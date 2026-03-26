import { useEffect, useState } from 'react';

export const Confetti = () => {
  const [pieces, setPieces] = useState<{ x: number; y: number; color: string; delay: number; duration: number; rotation: number }[]>([]);

  useEffect(() => {
    // Array of gold, amber, red, and jewel colors for pirate theme.
    const colors = ['#fcd34d', '#fbbf24', '#f59e0b', '#d97706', '#ef4444', '#10b981', '#3b82f6'];
    const newPieces = Array.from({ length: 100 }).map(() => ({
      x: Math.random() * 100,
      y: -10 - Math.random() * 20,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 3, // random delay before falling
      duration: 2 + Math.random() * 3, // fall speed between 2s and 5s
      rotation: Math.random() * 360,
    }));
    setPieces(newPieces);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <style>
        {`
          @keyframes confetti-fall {
            0% { transform: translateY(0vh) rotateX(0) rotateY(0) rotateZ(0); opacity: 1; }
            100% { transform: translateY(110vh) rotateX(720deg) rotateY(360deg) rotateZ(180deg); opacity: 0.8; }
          }
        `}
      </style>
      {pieces.map((p, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${6 + Math.random() * 6}px`,
            height: `${12 + Math.random() * 8}px`,
            backgroundColor: p.color,
            animation: `confetti-fall ${p.duration}s linear ${p.delay}s infinite`,
            borderRadius: '2px',
            boxShadow: '0 0 4px rgba(0,0,0,0.3)',
          }}
        />
      ))}
    </div>
  );
};
