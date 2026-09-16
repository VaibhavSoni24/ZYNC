import React, { useEffect, useState } from 'react';

export type MascotState = 'idle' | 'typing' | 'password' | 'success' | 'error';

interface ReactiveMascotProps {
  state?: MascotState;
  size?: number;
  className?: string;
}

export const ReactiveMascot: React.FC<ReactiveMascotProps> = ({
  state = 'idle',
  size = 140,
  className = ''
}) => {
  const [blink, setBlink] = useState(false);
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });

  // Natural blinking effect
  useEffect(() => {
    if (state === 'password') return;
    const interval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 180);
    }, 4000 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, [state]);

  // Subtle mouse tracking for typing/idle
  useEffect(() => {
    if (state === 'password' || state === 'success') {
      setEyeOffset({ x: 0, y: 0 });
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = ((e.clientX - innerWidth / 2) / innerWidth) * 10;
      const y = ((e.clientY - innerHeight / 2) / innerHeight) * 8;
      setEyeOffset({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [state]);

  const isPassword = state === 'password';
  const isSuccess = state === 'success';
  const isError = state === 'error';

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* Soft glowing ambient aura */}
      <div 
        className="absolute rounded-full blur-2xl opacity-40 transition-all duration-700 pointer-events-none"
        style={{
          width: size * 1.3,
          height: size * 1.3,
          background: isSuccess 
            ? 'radial-gradient(circle, #22c55e 0%, #10b981 70%)'
            : isError 
            ? 'radial-gradient(circle, #ef4444 0%, #f43f5e 70%)'
            : 'radial-gradient(circle, #2E7CF6 0%, #9B3CFF 80%)'
        }}
      />

      <svg
        width={size}
        height={size}
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 transition-transform duration-300"
        style={{
          transform: isError ? 'rotate(-6deg)' : isSuccess ? 'translateY(-4px) scale(1.05)' : 'none'
        }}
      >
        <defs>
          <linearGradient id="mascotBodyGrad" x1="20" y1="20" x2="140" y2="140" gradientUnits="userSpaceOnUse">
            <stop stopColor="#2E7CF6" />
            <stop offset="0.55" stopColor="#6C47FF" />
            <stop offset="1" stopColor="#9B3CFF" />
          </linearGradient>
          <linearGradient id="earGradLeft" x1="30" y1="10" x2="60" y2="50" gradientUnits="userSpaceOnUse">
            <stop stopColor="#2E7CF6" />
            <stop offset="1" stopColor="#4F46E5" />
          </linearGradient>
          <linearGradient id="earGradRight" x1="100" y1="10" x2="130" y2="50" gradientUnits="userSpaceOnUse">
            <stop stopColor="#7C3AED" />
            <stop offset="1" stopColor="#9B3CFF" />
          </linearGradient>
          <linearGradient id="pawGrad" x1="0" y1="0" x2="0" y2="100%">
            <stop stopColor="#4F46E5" />
            <stop offset="1" stopColor="#312E81" />
          </linearGradient>
        </defs>

        {/* Cute Ears / Antennae */}
        <path d="M 38 48 C 30 18, 52 14, 56 38 Z" fill="url(#earGradLeft)" />
        <path d="M 122 48 C 130 18, 108 14, 104 38 Z" fill="url(#earGradRight)" />

        {/* Mascot Main Body Sphere */}
        <circle cx="80" cy="88" r="54" fill="url(#mascotBodyGrad)" />

        {/* Highlight sheen on top */}
        <ellipse cx="68" cy="54" rx="22" ry="10" transform="rotate(-15 68 54)" fill="#FFFFFF" fillOpacity="0.25" />

        {/* Cheeks Blush */}
        <ellipse cx="44" cy="100" rx="9" ry="5" fill="#F43F5E" fillOpacity={isSuccess ? 0.6 : 0.25} />
        <ellipse cx="116" cy="100" rx="9" ry="5" fill="#F43F5E" fillOpacity={isSuccess ? 0.6 : 0.25} />

        {/* EYES */}
        {isPassword ? (
          // Playfully closed / covered eyes
          <g>
            <path d="M 48 85 Q 60 92 72 85" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            <path d="M 88 85 Q 100 92 112 85" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            {/* Cute paws covering lower eyes */}
            <circle cx="58" cy="98" r="14" fill="url(#pawGrad)" stroke="#6366F1" strokeWidth="2" />
            <circle cx="102" cy="98" r="14" fill="url(#pawGrad)" stroke="#6366F1" strokeWidth="2" />
          </g>
        ) : isSuccess ? (
          // Joyous happy curve eyes (^ ^)
          <g>
            <path d="M 48 86 Q 60 72 72 86" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            <path d="M 88 86 Q 100 72 112 86" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" fill="none" />
          </g>
        ) : blink ? (
          // Blinking slit
          <g>
            <line x1="48" y1="84" x2="72" y2="84" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
            <line x1="88" y1="84" x2="112" y2="84" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
          </g>
        ) : (
          // Open interactive tracking eyes
          <g>
            {/* Left Eye Sclera */}
            <ellipse cx="60" cy="82" rx="14" ry="16" fill="#FFFFFF" />
            {/* Left Pupil */}
            <circle cx={60 + eyeOffset.x} cy={82 + eyeOffset.y} r="8" fill="#14141F" />
            <circle cx={58 + eyeOffset.x} cy={79 + eyeOffset.y} r="2.8" fill="#FFFFFF" />

            {/* Right Eye Sclera */}
            <ellipse cx="100" cy="82" rx="14" ry="16" fill="#FFFFFF" />
            {/* Right Pupil */}
            <circle cx={100 + eyeOffset.x} cy={82 + eyeOffset.y} r="8" fill="#14141F" />
            <circle cx={98 + eyeOffset.x} cy={79 + eyeOffset.y} r="2.8" fill="#FFFFFF" />
          </g>
        )}

        {/* MOUTH */}
        {isSuccess ? (
          <path d="M 66 102 Q 80 120 94 102 Z" fill="#FFFFFF" />
        ) : isError ? (
          <path d="M 70 110 Q 80 102 90 110" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        ) : isPassword ? (
          <path d="M 72 116 Q 80 122 88 116" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" fill="none" />
        ) : (
          <path d="M 70 104 Q 80 115 90 104" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        )}
      </svg>
    </div>
  );
};
