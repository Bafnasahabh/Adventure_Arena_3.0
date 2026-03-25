import { Volume2, VolumeX } from 'lucide-react';
import { useSound } from '../hooks/useSound';

export const SoundToggle = () => {
  const { isMuted, toggleMute } = useSound();

  return (
    <button
      onClick={toggleMute}
      className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-amber-600 hover:bg-amber-700 rounded-full flex items-center justify-center shadow-2xl border-2 border-amber-400 transition-all transform hover:scale-110"
      title={isMuted ? 'Unmute sounds' : 'Mute sounds'}
    >
      {isMuted ? (
        <VolumeX className="w-6 h-6 text-white" />
      ) : (
        <Volume2 className="w-6 h-6 text-white" />
      )}
    </button>
  );
};
