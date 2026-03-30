import { useState, useEffect } from 'react';
import { api, Clue, TeamProgress } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { QRScanner } from './QRScanner';
import { Clock, MapPin, Camera, LogOut, Scroll, Loader, PartyPopper } from 'lucide-react';
import { Confetti } from './Confetti';

export const TeamGame = () => {
  const { user, team, signOut, updateTeamName } = useAuth();
  const [progress, setProgress] = useState<TeamProgress | null>(null);
  const [currentClue, setCurrentClue] = useState<Clue | null>(null);
  const [teamNameInput, setTeamNameInput] = useState('');
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  const [pastClues, setPastClues] = useState<Clue[]>([]);
  const [showScanner, setShowScanner] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [memeData, setMemeData] = useState<{ url: string; isVideo: boolean; message: string } | null>(null);
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
      
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleQRScan = async (qrData: string) => {
    if (!team || !progress) return;
    setShowScanner(false);

    const safeQrData = qrData.trim().toLowerCase();
    if (safeQrData.startsWith('meme_qr_')) {
      const match = safeQrData.match(/meme_qr_(\d+)/);
      if (match) {
        let index = parseInt(match[1], 10);
        if (index > 9) index = ((index - 1) % 9) + 1; // Map 10+ safely to 1-9
        const isVideo = [5, 8, 9].includes(index);
        const url = `/memes/meme_${index}.${isVideo ? 'mp4' : 'jpg'}`;
        setMemeData({ url, isVideo, message: "Pirates, you have been pranked. 🏴‍☠️" });
        return;
      }
    }

    try {
      const res = await api.post('/api/game/scan', {
        teamId: team.team_id,
        qrData: qrData.trim(),
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

  // Hints are now managed physically and logged by admins. The in-app hint button is removed.

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

  if (team && !team.team_name) {
    return (
      <div className="min-h-screen bg-stone-900 bg-[url('/assets/bg.png')] bg-cover bg-center bg-fixed justify-center p-4 relative flex items-center text-center">
        <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-[2px]"></div>
        <div className="max-w-md w-full bg-stone-900/90 backdrop-blur-md rounded-lg border-2 border-amber-700 p-8 relative z-10 shadow-2xl">
          <img src="/assets/ship.png" alt="Pirate Ship" className="w-24 h-24 mx-auto mb-4 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]" />
          <h1 className="text-3xl font-bold text-amber-300 mb-4 font-serif">
            Welcome Aboard!
          </h1>
          <p className="text-amber-200 mb-6 text-lg">
            Before we set sail, what be the name of your crew?
          </p>
          <form onSubmit={async (e) => {
            e.preventDefault();
            if (!teamNameInput.trim()) return;
            setIsUpdatingName(true);
            await updateTeamName(teamNameInput.trim());
            setIsUpdatingName(false);
          }} className="space-y-4">
            <input
              type="text"
              value={teamNameInput}
              onChange={(e) => setTeamNameInput(e.target.value)}
              placeholder="e.g. Team Shardul"
              className="w-full px-4 py-3 bg-stone-800 border-2 border-amber-700/50 rounded-lg text-white placeholder-stone-500 focus:outline-none focus:border-amber-500 transition-colors text-center font-bold"
              required
            />
            <button
              type="submit"
              disabled={isUpdatingName || !teamNameInput.trim()}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold rounded-lg hover:from-amber-700 hover:to-amber-800 transition-all transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:transform-none"
            >
              {isUpdatingName ? 'Registering...' : 'Register Crew Name'}
            </button>
          </form>
          <button
            onClick={signOut}
            className="w-full mt-4 px-6 py-2 text-stone-400 hover:text-stone-200 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  if (progress?.is_completed) {
    return (
      <div className="min-h-screen bg-stone-900 bg-[url('/assets/bg.png')] bg-cover bg-center bg-fixed flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-[3px]"></div>
        <Confetti />
        
        <div className="max-w-md w-full bg-stone-900/80 backdrop-blur-xl rounded-2xl border-2 border-amber-500 p-8 text-center relative z-10 shadow-[0_0_50px_rgba(251,191,36,0.2)] transform transition-all duration-1000 scale-100 animate-[fadeIn_0.5s_ease-out]">
          
          <div className="relative inline-block mb-10 w-full">
            <div className="absolute inset-0 bg-amber-400/40 blur-3xl rounded-full scale-150 animate-[pulse_3s_ease-in-out_infinite]"></div>
            <div className="absolute inset-x-0 h-40 bg-gradient-to-t from-amber-500/30 to-transparent -bottom-10 blur-xl"></div>
            
            <img src="/assets/chest.png" alt="Treasure Chest" className="w-56 h-56 drop-shadow-[0_0_40px_rgba(251,191,36,1)] mx-auto relative z-10 animate-[bounce_2s_infinite] cursor-pointer hover:scale-110 transition-transform duration-300" />
            
            {/* Glowing rings */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-4 border-amber-300/40 rounded-full animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-amber-100/20 rounded-full animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite_0.5s]"></div>
          </div>

          <div className="flex justify-center items-center gap-3 mb-4">
            <PartyPopper className="w-8 h-8 text-amber-400 animate-[spin_4s_linear_infinite]" />
            <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 font-serif drop-shadow-sm uppercase tracking-widest">
              Secured!
            </h1>
            <PartyPopper className="w-8 h-8 text-amber-400 animate-[spin_4s_linear_infinite_reverse]" />
          </div>

          <p className="text-amber-100/90 text-lg mb-8 font-medium italic">
            Congratulations Captain, you have unearthed the final treasure of the Seven Seas!
          </p>

          <div className="bg-gradient-to-b from-amber-900/60 to-black/60 rounded-xl p-5 mb-8 border border-amber-500/40 relative overflow-hidden group">
            <div className="absolute inset-0 bg-amber-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
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

        {memeData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-stone-900 border-2 border-amber-500 rounded-xl p-6 max-w-lg w-full text-center shadow-[0_0_30px_rgba(251,191,36,0.3)] relative transform transition-all scale-100">
              <h2 className="text-2xl font-black text-amber-300 mb-4 font-serif uppercase tracking-widest">{memeData.message}</h2>
              <div className="mb-6 rounded-lg overflow-hidden border border-amber-900 bg-black flex justify-center items-center">
                {memeData.isVideo ? (
                  <video src={memeData.url} controls autoPlay className="w-full h-auto max-h-[60vh] object-contain" />
                ) : (
                  <img src={memeData.url} alt="Secret Meme" className="max-w-full h-auto max-h-[60vh] object-contain" />
                )}
              </div>
              <button
                onClick={() => setMemeData(null)}
                className="px-8 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold rounded-lg hover:from-amber-700 hover:to-amber-800 transition-all shadow-lg w-full cursor-pointer"
              >
                Continue Hunt
              </button>
            </div>
          </div>
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
                 </div>
               ))}
             </div>
           </div>
        )}

        <div className="flex justify-center mb-8">
            <button
            onClick={() => setShowScanner(true)}
            className="w-full max-w-sm flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold rounded-lg hover:from-amber-700 hover:to-amber-800 transition-all transform hover:scale-[1.02] shadow-lg"
          >
            <Camera className="w-6 h-6" />
            Scan QR Code
          </button>
        </div>
      </div>

      {showScanner && (
        <QRScanner
          onScan={handleQRScan}
          onClose={() => setShowScanner(false)}
        />
      )}

      {memeData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-stone-900 border-2 border-amber-500 rounded-xl p-6 max-w-lg w-full text-center shadow-[0_0_30px_rgba(251,191,36,0.3)] relative transform transition-all scale-100">
            <h2 className="text-2xl font-black text-amber-300 mb-4 font-serif uppercase tracking-widest">{memeData.message}</h2>
            <div className="mb-6 rounded-lg overflow-hidden border border-amber-900 bg-black flex justify-center items-center">
              {memeData.isVideo ? (
                <video src={memeData.url} controls autoPlay className="w-full h-auto max-h-[60vh] object-contain" />
              ) : (
                <img src={memeData.url} alt="Secret Meme" className="max-w-full h-auto max-h-[60vh] object-contain" />
              )}
            </div>
            <button
              onClick={() => setMemeData(null)}
              className="px-8 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold rounded-lg hover:from-amber-700 hover:to-amber-800 transition-all shadow-lg w-full cursor-pointer"
            >
              Continue Hunt
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
