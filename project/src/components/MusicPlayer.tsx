import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

declare global {
  interface Window {
    onYouTubeIframeAPIReady: any;
    YT: any;
  }
}

export const MusicPlayer = () => {
  const [isMuted, setIsMuted] = useState(true);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    const initPlayer = () => {
      // Create the player only if the container exists
      if (!document.getElementById('youtube-audio-player')) return;
      
      playerRef.current = new window.YT.Player('youtube-audio-player', {
        height: '2',
        width: '2',
        videoId: '91E_lYSUmg8',
        playerVars: {
          autoplay: 1,
          loop: 1,
          playlist: '91E_lYSUmg8', // Required to loop a single video
          controls: 0,
          showinfo: 0,
          autohide: 1,
          modestbranding: 1,
          playsinline: 1
        },
        events: {
          onReady: (event: any) => {
            // Browsers allow autoplay ONLY if it is muted first.
            event.target.mute();
            event.target.playVideo();
          }
        }
      });
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      // Load YouTube API script
      if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        if (firstScriptTag && firstScriptTag.parentNode) {
          firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }
      }
      
      // Setup callback
      const prevCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (prevCallback) prevCallback();
        initPlayer();
      };
    }

    return () => {
      if (playerRef.current && playerRef.current.destroy) {
        playerRef.current.destroy();
      }
    };
  }, []);

  const toggleMute = () => {
    if (!playerRef.current || !playerRef.current.unMute) return;
    
    if (isMuted) {
      playerRef.current.unMute();
      playerRef.current.setVolume(50);
      playerRef.current.playVideo();
    } else {
      playerRef.current.mute();
    }
    setIsMuted(!isMuted);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2 pointer-events-none">
      
      {isMuted && (
         <div className="bg-amber-900/90 text-amber-200 text-[10px] uppercase tracking-wider font-bold px-3 py-1 text-center rounded-full animate-pulse border border-amber-700 shadow-xl pointer-events-none">
           Click to Unmute Background Audio
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

      {/* Completely hidden iframe container to play audio out of sight */}
      <div className="absolute top-[-9999px] left-[-9999px] w-[2px] h-[2px] opacity-0 pointer-events-none">
        <div id="youtube-audio-player"></div>
      </div>
    </div>
  );
};
