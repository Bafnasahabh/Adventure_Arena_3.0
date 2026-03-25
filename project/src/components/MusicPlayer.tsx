import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const TRACK_PATH = encodeURI(
  '/Pirates of the Caribbean Music & Ambience _ Main Themes and Pirate Ship Ambience [91E_lYSUmg8].mp3'
);

export const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(TRACK_PATH);
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = 0.5;
    audioRef.current = audio;

    const tryPlay = () => {
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          // Autoplay blocked. Wait for first user interaction (any click/touch anywhere).
          const startOnInteraction = () => {
            audio.play().then(() => setIsPlaying(true)).catch(() => {});
            document.removeEventListener('click', startOnInteraction);
            document.removeEventListener('touchstart', startOnInteraction);
          };
          document.addEventListener('click', startOnInteraction);
          document.addEventListener('touchstart', startOnInteraction);
        });
    };

    tryPlay();

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isPlaying) {
        audio.play().catch(() => {});
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2 pointer-events-none">
      <button
        onClick={(e) => { 
          e.stopPropagation(); 
          togglePlay();
        }}
        className="bg-stone-800/90 backdrop-blur-md p-3 rounded-full shadow-[0_0_15px_rgba(0,0,0,0.8)] border-2 border-amber-700 text-amber-300 hover:bg-stone-700 hover:text-amber-100 transition-all hover:scale-110 flex items-center justify-center pointer-events-auto"
        title={isPlaying ? "Pause Music" : "Play Music"}
      >
        {isPlaying ? <Volume2 className="w-7 h-7" /> : <VolumeX className="w-7 h-7" />}
      </button>
    </div>
  );
};
