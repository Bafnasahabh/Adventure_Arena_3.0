import { useEffect, useRef, useState } from 'react';

export const useSound = () => {
  const [isMuted, setIsMuted] = useState(false);
  const clickSoundRef = useRef<HTMLAudioElement | null>(null);
  const bgMusicRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    clickSoundRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFAg+ltryxHMpBSuAzvLZiTYIGWi78OScTgwNUKXj8LZjHAU5kdnyy3krBSR3x/DdkEALFF6z6eqnVRUJPpbZ88NyKAUrgc7y2Ik3CBlouuzjnE4MDVCl4/C2YxwFOZHZ8sp5KwUkd8fw3ZBAC...');

    bgMusicRef.current = new Audio();
    bgMusicRef.current.loop = true;
    bgMusicRef.current.volume = 0.3;

    return () => {
      if (bgMusicRef.current) {
        bgMusicRef.current.pause();
      }
    };
  }, []);

  useEffect(() => {
    if (clickSoundRef.current) {
      clickSoundRef.current.muted = isMuted;
    }
    if (bgMusicRef.current) {
      bgMusicRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const playClick = () => {
    if (clickSoundRef.current && !isMuted) {
      clickSoundRef.current.currentTime = 0;
      clickSoundRef.current.play().catch(() => {});
    }
  };

  const toggleMusic = () => {
    if (bgMusicRef.current) {
      if (bgMusicRef.current.paused) {
        bgMusicRef.current.play().catch(() => {});
      } else {
        bgMusicRef.current.pause();
      }
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return {
    playClick,
    toggleMusic,
    toggleMute,
    isMuted,
  };
};
