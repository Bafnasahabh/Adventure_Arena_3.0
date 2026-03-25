import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const TRACK_PATH = encodeURI(
  '/Pirates of the Caribbean Music & Ambience _ Main Themes and Pirate Ship Ambience [91E_lYSUmg8].mp3'
);

export const MusicPlayer = () => {
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(TRACK_PATH);
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = 0.5;
    audio.muted = false;
    audioRef.current = audio;

    const startOnInteraction = () => {
      audio.play().catch(() => {});
      document.removeEventListener('click', startOnInteraction);
      document.removeEventListener('touchstart', startOnInteraction);
    };

    audio.play().catch(() => {
      // Autoplay blocked. Wait for first user interaction (any click/touch anywhere).
      document.addEventListener('click', startOnInteraction);
      document.addEventListener('touchstart', startOnInteraction);
    });

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        audio.play().catch(() => {
          // Ignore browser autoplay restrictions
        });
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      document.removeEventListener('click', startOnInteraction);
      document.removeEventListener('touchstart', startOnInteraction);
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = isMuted;
    if (!isMuted) {
      audio.play().catch(() => {
        // User can click again if blocked.
      });
    }
  }, [isMuted]);

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2 pointer-events-none">
      
      {isMuted && (
         <div className="bg-amber-900/90 text-amber-200 text-[10px] uppercase tracking-wider font-bold px-3 py-1 text-center rounded-full border border-amber-700 shadow-xl pointer-events-none">
           Code of Conduct: Music is Muted
         </div>
      )}
      
      <button
        onClick={(e) => { 
          e.stopPropagation(); 
          toggleMute();
        }}
        className="bg-stone-800/90 backdrop-blur-md p-3 rounded-full shadow-[0_0_15px_rgba(0,0,0,0.8)] border-2 border-amber-700 text-amber-300 hover:bg-stone-700 hover:text-amber-100 transition-all hover:scale-110 flex items-center justify-center pointer-events-auto"
        title="Toggle Music"
      >
        {isMuted ? <VolumeX className="w-7 h-7" /> : <Volume2 className="w-7 h-7" />}
      </button>
    </div>
  );
};
