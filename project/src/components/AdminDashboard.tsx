import { useState, useEffect } from 'react';
import { api, Team, TeamProgress } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Trophy, RefreshCw, LogOut, Download, Users, MapPin, Loader, HelpCircle } from 'lucide-react';

type LeaderboardEntry = {
  team_id: string;
  team_name: string | null;
  current_clue_number: number;
  is_completed: boolean;
  start_time: string | null;
  end_time: string | null;
  total_time_seconds: number;
  total_penalty_minutes: number;
};

export const AdminDashboard = () => {
  const { signOut } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();

    // Poll for updates
    const interval = setInterval(() => {
      loadData();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await api.get('/api/admin/dashboard');

      if (!data || !data.teams || !data.progress) {
        console.error('Error fetching admin data');
        setLoading(false);
        return;
      }

      const { teams: teamsData, progress: progressData } = data;
      
      setTeams(teamsData);

      const leaderboardData: LeaderboardEntry[] = teamsData.map((team: Team) => {
        const progress = progressData.find((p: TeamProgress) => p.team_id === team.team_id);

        let totalTimeSeconds = 0;
        if (progress?.start_time) {
          const endTime = progress.end_time
            ? new Date(progress.end_time).getTime()
            : Date.now();
          const startTime = new Date(progress.start_time).getTime();
          totalTimeSeconds =
            Math.floor((endTime - startTime) / 1000) +
            (progress.total_penalty_minutes || 0) * 60;
        }

        return {
          team_id: team.team_id,
          team_name: team.team_name,
          current_clue_number: progress?.current_clue_number || 0,
          is_completed: progress?.is_completed || false,
          start_time: progress?.start_time || null,
          end_time: progress?.end_time || null,
          total_time_seconds: totalTimeSeconds,
          total_penalty_minutes: progress?.total_penalty_minutes || 0,
        };
      });

      leaderboardData.sort((a, b) => {
        if (a.is_completed && !b.is_completed) return -1;
        if (!a.is_completed && b.is_completed) return 1;
        if (a.is_completed && b.is_completed) {
          return a.total_time_seconds - b.total_time_seconds;
        }
        return b.current_clue_number - a.current_clue_number;
      });

      setLeaderboard(leaderboardData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const resetTeam = async (teamId: string) => {
    if (!confirm(`Are you sure you want to reset ${teamId}?`)) return;

    try {
      await api.post(`/api/admin/reset/${teamId}`, {});
      loadData();
    } catch (error) {
      console.error('Error resetting team', error);
    }
  };

  const resetAllTeams = async () => {
    if (!confirm('Are you sure you want to reset ALL teams?')) return;

    try {
      await api.post('/api/admin/reset/all', {});
      loadData();
    } catch (error) {
      console.error('Error resetting all teams', error);
    }
  };

  const addHintPenalty = async (teamId: string, currentClueNumber: number) => {
    if (!confirm(`Are you sure you want to log a hint penalty for ${teamId}?`)) return;

    try {
      const data = await api.get(`/api/game/data/${teamId}`);
      const hintsUsed = data.hints.length;
      const penaltyMinutes = 4 + hintsUsed;

      await api.post('/api/game/hint', {
        teamId: teamId,
        clueNumber: currentClueNumber,
        penaltyMinutes
      });

      alert(`Added ${penaltyMinutes} min penalty to ${teamId}.`);
      loadData();
    } catch (error) {
      console.error('Error adding hint penalty', error);
      alert('Failed to add hint penalty.');
    }
  };

  const exportLeaderboard = () => {
    const csv = [
      ['Rank', 'Team ID', 'Team Name', 'Status', 'Current Clue', 'Total Time', 'Penalties (min)'],
      ...leaderboard.map((entry, index) => [
        index + 1,
        entry.team_id,
        entry.team_name || '-',
        entry.is_completed ? 'Completed' : entry.start_time ? 'In Progress' : 'Not Started',
        entry.current_clue_number,
        formatTime(entry.total_time_seconds),
        entry.total_penalty_minutes,
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leaderboard-${new Date().toISOString()}.csv`;
    a.click();
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading && leaderboard.length === 0) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center">
        <Loader className="w-12 h-12 text-amber-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-900 bg-[url('/assets/bg.png')] bg-cover bg-center bg-fixed p-4 pb-20 relative">
      <div className="absolute inset-0 bg-stone-900/80 backdrop-blur-[2px]"></div>
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="bg-stone-900/90 backdrop-blur-md rounded-lg border-2 border-amber-700 overflow-hidden mb-6 shadow-2xl">
          <div className="bg-amber-900/50 p-4 flex items-center justify-between border-b-2 border-amber-700">
            <div>
              <h1 className="text-3xl font-bold text-amber-300 font-serif">Admin Dashboard</h1>
              <p className="text-amber-200 text-sm italic">Pirate's Treasure Hunt</p>
            </div>
            <button
              onClick={signOut}
              className="flex items-center gap-2 px-4 py-2 bg-stone-800 text-amber-300 rounded-lg hover:bg-stone-700 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>

          <div className="p-4 bg-amber-800/20 flex flex-wrap gap-4 justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-300" />
              <span className="text-amber-100">
                Total Teams: <strong>{teams.length}</strong>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-300" />
              <span className="text-amber-100">
                Completed: <strong>{leaderboard.filter((e) => e.is_completed).length}</strong>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-amber-300" />
              <span className="text-amber-100">
                In Progress:{' '}
                <strong>
                  {leaderboard.filter((e) => e.start_time && !e.is_completed).length}
                </strong>
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={loadData}
            className="flex items-center gap-2 px-6 py-3 bg-amber-600/90 text-white rounded-lg hover:bg-amber-700 transition-colors shadow-lg"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={exportLeaderboard}
            className="flex items-center gap-2 px-6 py-3 bg-green-600/90 text-white rounded-lg hover:bg-green-700 transition-colors shadow-lg"
          >
            <Download className="w-5 h-5" />
            Export CSV
          </button>
          <button
            onClick={resetAllTeams}
            className="flex items-center gap-2 px-6 py-3 bg-red-600/90 text-white rounded-lg hover:bg-red-700 transition-colors shadow-lg"
          >
            <RefreshCw className="w-5 h-5" />
            Reset All Teams
          </button>
        </div>

        <div className="bg-stone-900/90 backdrop-blur-md rounded-lg border-2 border-amber-700 overflow-hidden shadow-2xl">
          <div className="bg-amber-900/50 p-4 border-b-2 border-amber-700 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-amber-300 flex items-center gap-2 font-serif">
              <Trophy className="w-6 h-6" />
              Treasure Hunt Leaderboard
            </h2>
            <img src="/assets/chest.png" alt="Chest" className="w-10 h-10 object-contain drop-shadow-md" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-amber-800/30">
                <tr>
                  <th className="px-4 py-3 text-left text-amber-300 font-semibold border-b border-amber-700/50">Rank</th>
                  <th className="px-4 py-3 text-left text-amber-300 font-semibold border-b border-amber-700/50">Team</th>
                  <th className="px-4 py-3 text-left text-amber-300 font-semibold border-b border-amber-700/50">Status</th>
                  <th className="px-4 py-3 text-left text-amber-300 font-semibold border-b border-amber-700/50">Map Step</th>
                  <th className="px-4 py-3 text-left text-amber-300 font-semibold border-b border-amber-700/50">Time</th>
                  <th className="px-4 py-3 text-left text-amber-300 font-semibold border-b border-amber-700/50">Penalties</th>
                  <th className="px-4 py-3 text-left text-amber-300 font-semibold border-b border-amber-700/50">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-amber-500/50 italic">
                      No teams have departed yet. Waiting for signals from the sea...
                    </td>
                  </tr>
                ) : (
                  leaderboard.map((entry, index) => (
                    <tr
                      key={entry.team_id}
                      className="border-b border-amber-700/30 hover:bg-amber-900/20 transition-colors"
                    >
                      <td className="px-4 py-3 text-amber-100 font-bold">
                        {index === 0 && entry.is_completed ? (
                          <span className="text-yellow-400">🏆 1</span>
                        ) : (
                          index + 1
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <div className="text-amber-100 font-medium">
                            {entry.team_name || entry.team_id}
                          </div>
                          {entry.team_name && (
                            <div className="text-amber-400 text-sm">{entry.team_id}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                            entry.is_completed
                              ? 'bg-green-900/50 text-green-200'
                              : entry.start_time
                              ? 'bg-blue-900/50 text-blue-200'
                              : 'bg-stone-700 text-stone-300'
                          }`}
                        >
                          {entry.is_completed
                            ? 'Completed'
                            : entry.start_time
                            ? 'In Progress'
                            : 'Not Started'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-amber-100">{entry.current_clue_number}</td>
                      <td className="px-4 py-3 text-amber-100 font-mono">
                        {entry.start_time ? formatTime(entry.total_time_seconds) : '-'}
                      </td>
                      <td className="px-4 py-3 text-amber-100">
                        {entry.total_penalty_minutes > 0
                          ? `+${entry.total_penalty_minutes} min`
                          : '-'}
                      </td>
                      <td className="px-4 py-3 flex gap-2">
                        <button
                          onClick={() => resetTeam(entry.team_id)}
                          className="px-3 py-1 bg-red-600/90 text-white text-sm rounded hover:bg-red-700 transition-colors shadow"
                        >
                          Reset Team
                        </button>
                        <button
                          onClick={() => addHintPenalty(entry.team_id, entry.current_clue_number)}
                          disabled={entry.is_completed || !entry.start_time}
                          className="px-3 py-1 bg-amber-600/90 text-white text-sm rounded hover:bg-amber-700 transition-colors shadow flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <HelpCircle className="w-4 h-4" />
                          Hint Used
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
