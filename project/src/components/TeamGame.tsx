import { useState, useEffect } from 'react';
import { api, Clue, TeamProgress } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { QRScanner } from './QRScanner';
import { Clock, MapPin, Camera, HelpCircle, LogOut, Scroll, Loader } from 'lucide-react';

export const TeamGame = () => {
  const { user, team, signOut } = useAuth();
  const [progress, setProgress] = useState<TeamProgress | null>(null);
  const [currentClue, setCurrentClue] = useState<Clue | null>(null);
  const [pastClues, setPastClues] = useState<Clue[]>([]);
  const [hintRevealed, setHintRevealed] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && team) {
      loadProgress();
      const interval = setInterval(() => {
        if (progress?.start_time && !progress.is_completed) {
          const start = new Date(progress.start_time).getTime();
          const now = Date.now();
          const elapsed = Math.floor((now - start) / 1000);
          setElapsedTime(elapsed + (progress.total_penalty_minutes * 60));
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [user, team, progress?.start_time, progress?.is_completed, progress?.total_penalty_minutes]);

  // Poll for updates (Replacing Supabase Realtime)
  useEffect(() => {
    if (team) {
      const interval = setInterval(() => {
        loadProgress();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [team]);

  const loadProgress = async () => {
    if (!team) return;
    try {
      const data = await api.get(`/api/game/data/${team.team_id}`);
      setProgress(data.progress);
      
      const currentClueNum = data.progress?.current_clue_number || 1;
      
      const past = data.clues.filter((c: Clue) => c.sequence_number < currentClueNum);
      const current = data.clues.find((c: Clue) => c.sequence_number === currentClueNum);
      
      setPastClues(past);
      if (data.progress && !data.progress.is_completed && current) {
        setCurrentClue(current);
      } else {
        setCurrentClue(null);
      }
      
      const hasHint = data.hints.some((h: any) => h.clue_number === currentClueNum);
      setHintRevealed(hasHint);
      
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleQRScan = async (qrData: string) => {
    if (!team || !progress) return;
    setShowScanner(false);

    try {
      const res = await api.post('/api/game/scan', {
        teamId: team.team_id,
        qrData,
        currentClueNumber: progress.current_clue_number
      });
      
      if (res.message) {
        setMessage({ type: 'success', text: res.message });
      } else if (res.completed) {
        setMessage({ type: 'success', text: 'Congratulations! You found the ultimate treasure!' });
      } else if (res.nextClue) {
        setMessage({ type: 'success', text: 'Correct! Moving to the next clue...' });
      }
      loadProgress();
    } catch (e: any) {
      console.error(e);
      try {
        const err = JSON.parse(e.message);
        setMessage({ type: 'error', text: err.error || 'Network error checking QR code.' });
      } catch {
        setMessage({ type: 'error', text: 'Error checking QR code.' });
      }
    }
  };

  const useHint = async () => {
    if (!team || !progress || !currentClue) return;
    if (hintRevealed) return;

    try {
      const penaltyMinutes = 5;
      await api.post('/api/game/hint', {
        teamId: team.team_id,
        clueNumber: progress.current_clue_number,
        penaltyMinutes
      });

      setMessage({
        type: 'info',
        text: `Hint revealed! ${penaltyMinutes} minute penalty added to your total time.`,
      });

      loadProgress();
    } catch (e) {
      console.error(e);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-900 via-stone-800 to-slate-900 flex items-center justify-center">
        <Loader className="w-12 h-12 text-amber-400 animate-spin" />
      </div>
    );
  }

  if (progress?.is_completed) {
    return (
      <div className="min-h-screen bg-stone-900 bg-[url('/assets/bg.png')] bg-cover bg-center bg-fixed flex items-center justify-center p-4 relative">
        <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-[2px]"></div>
        <div className="max-w-md w-full bg-stone-900/90 backdrop-blur-md rounded-lg border-2 border-amber-700 p-8 text-center relative z-10 shadow-2xl">
          <img src="/assets/chest.png" alt="Treasure Chest" className="w-48 h-48 drop-shadow-[0_0_20px_rgba(251,191,36,0.6)] mx-auto mb-4 animate-bounce" />
          <h1 className="text-4xl font-bold text-amber-300 mb-4 font-serif">Treasure Secured!</h1>
          <p className="text-amber-200 text-lg mb-4">
            Congratulations, you have found the final treasure!
          </p>
          <div className="bg-amber-900/50 rounded-lg p-4 mb-6 border border-amber-700/50">
            <p className="text-amber-300 text-sm mb-2 font-bold uppercase tracking-wider">Final Completion Time</p>
            <p className="text-3xl font-bold text-amber-100">
              {formatTime(
                Math.floor(
                  (new Date(progress.end_time!).getTime() -
                    new Date(progress.start_time!).getTime()) /
                    1000
                ) +
                  progress.total_penalty_minutes * 60
              )}
            </p>
            {progress.total_penalty_minutes > 0 && (
              <p className="text-amber-400 text-sm mt-2">
                (includes {progress.total_penalty_minutes} min penalty)
              </p>
            )}
          </div>
          <button
            onClick={signOut}
            className="px-6 py-3 w-full bg-amber-600 text-white font-bold rounded-lg hover:bg-amber-700 transition-colors shadow-lg"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  if (!progress?.start_time) {
    return (
      <div className="min-h-screen bg-stone-900 bg-[url('/assets/bg.png')] bg-cover bg-center bg-fixed flex items-center justify-center p-4 relative text-center">
        <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-[2px]"></div>
        <div className="max-w-md w-full bg-stone-900/90 backdrop-blur-md rounded-lg border-2 border-amber-700 p-8 relative z-10 shadow-2xl">
          <img src="/assets/ship.png" alt="Pirate Ship" className="w-24 h-24 mx-auto mb-4 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]" />
          <h1 className="text-3xl font-bold text-amber-300 mb-4 font-serif">
            Welcome, {team?.team_name || team?.team_id}!
          </h1>
          <p className="text-amber-200 mb-6 text-lg">
            Ready to start the hunt? Scan your starting QR Code to receive your first clue!
          </p>
          {message && (
             <div className={`mb-4 p-4 rounded-lg border-2 ${message.type === 'error' ? 'bg-red-900/50 border-red-500 text-red-200' : 'bg-green-900/50 border-green-500 text-green-200'}`}>
               {message.text}
             </div>
          )}
          <button
            onClick={() => setShowScanner(true)}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold rounded-lg hover:from-amber-700 hover:to-amber-800 transition-all transform hover:scale-[1.02] shadow-lg"
          >
            <Camera className="w-5 h-5"/>
            Scan Starting QR Code 
          </button>
          <button
            onClick={signOut}
            className="w-full mt-4 px-6 py-2 text-stone-400 hover:text-stone-200 transition-colors"
          >
            Logout
          </button>
        </div>
        
        {showScanner && (
          <QRScanner
            onScan={handleQRScan}
            onClose={() => setShowScanner(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-900 bg-[url('/assets/bg.png')] bg-cover bg-center bg-fixed p-4 pb-20 relative">
      <div className="absolute inset-0 bg-stone-900/70 backdrop-blur-[1px]"></div>
      <div className="max-w-2xl mx-auto relative z-10">
        <div className="bg-stone-900/80 backdrop-blur-md rounded-lg border-2 border-amber-700 overflow-hidden mb-4">
          <div className="bg-amber-900/50 p-4 flex items-center justify-between border-b-2 border-amber-700">
            <div>
              <h2 className="text-xl font-bold text-amber-300">
                {team?.team_name || team?.team_id}
              </h2>
              <p className="text-amber-200 text-sm">
                Map Step {progress?.current_clue_number}
              </p>
            </div>
            <button
              onClick={signOut}
              className="text-amber-300 hover:text-amber-100 transition-colors"
            >
              <LogOut className="w-6 h-6" />
            </button>
          </div>

          <div className="p-4 bg-amber-800/20">
            <div className="flex items-center gap-2 text-amber-300">
              <Clock className="w-5 h-5" />
              <span className="text-2xl font-bold">{formatTime(elapsedTime)}</span>
              {progress && progress.total_penalty_minutes > 0 && (
                <span className="text-sm text-amber-400">
                  (+{progress.total_penalty_minutes} min penalty)
                </span>
              )}
            </div>
          </div>
        </div>

        {message && (
          <div
            className={`mb-4 p-4 rounded-lg border-2 ${
              message.type === 'success'
                ? 'bg-green-900/50 border-green-500 text-green-200'
                : message.type === 'error'
                ? 'bg-red-900/50 border-red-500 text-red-200'
                : 'bg-blue-900/50 border-blue-500 text-blue-200'
            }`}
          >
            {message.text}
          </div>
        )}

        {currentClue && (
          <div className="bg-stone-900/80 backdrop-blur-md rounded-lg border-2 border-amber-700 p-6 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-6 h-6 text-amber-400" />
              <h3 className="text-2xl font-bold text-amber-300">Captain's Clue</h3>
            </div>
            <p className="text-amber-100 text-lg leading-relaxed mb-4 font-serif italic text-center">
              "{currentClue.clue_text}"
            </p>
            
            {hintRevealed ? (
              <div className="mt-4 p-4 bg-amber-900/40 border border-amber-500/50 rounded-lg">
                <p className="text-amber-300 text-sm font-bold mb-1 flex items-center gap-2"><HelpCircle className="w-4 h-4"/> Revealed Hint:</p>
                <p className="text-amber-100 text-md">{currentClue.hint_text}</p>
              </div>
            ) : null}
          </div>
        )}

        {/* Previous Clues Section */}
        {pastClues.length > 0 && (
           <div className="bg-stone-900/60 backdrop-blur-sm rounded-lg border border-amber-900 p-4 mb-4">
             <div className="flex items-center gap-2 mb-4 border-b border-amber-900/50 pb-2">
               <Scroll className="w-5 h-5 text-amber-500" />
               <h3 className="text-lg font-bold text-amber-300">Captain's Log (Past Clues)</h3>
             </div>
             <div className="space-y-3">
               {pastClues.map((c) => (
                 <div key={c.id} className="bg-black/30 p-3 rounded-md border border-amber-900/30">
                   <p className="text-amber-500 text-xs font-bold mb-1">Mark {c.sequence_number}</p>
                   <p className="text-amber-100 text-sm italic">"{c.clue_text}"</p>
                   <p className="text-amber-400/60 text-xs mt-1 flex items-center justify-between">
                      <span>Found at: {c.location_description}</span>
                   </p>
                 </div>
               ))}
             </div>
           </div>
        )}

        <div className="grid grid-cols-2 gap-4 mb-8">
            <button
            onClick={() => setShowScanner(true)}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold rounded-lg hover:from-amber-700 hover:to-amber-800 transition-all transform hover:scale-[1.02] shadow-lg"
          >
            <Camera className="w-6 h-6" />
            Scan QR Code
          </button>

          {!hintRevealed ? (
             <button
              onClick={useHint}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-stone-800 border-2 border-amber-700 text-amber-300 font-bold rounded-lg hover:bg-stone-700 transition-all transform hover:scale-[1.02] shadow-lg"
             >
               <HelpCircle className="w-6 h-6" />
               Reveal Hint
             </button>
          ) : (
            <div className="flex items-center justify-center gap-2 px-6 py-4 bg-stone-800/50 text-stone-500 font-bold rounded-lg border border-stone-700 cursor-not-allowed">
              <HelpCircle className="w-6 h-6" />
              Hint Revealed
            </div>
          )}
        </div>
      </div>

      {showScanner && (
        <QRScanner
          onScan={handleQRScan}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
};
