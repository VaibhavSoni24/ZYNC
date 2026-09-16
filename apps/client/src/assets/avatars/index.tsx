import React from 'react';

export const PRESET_AVATARS = [
  'Comet',
  'Nova',
  'Drift',
  'Pulse',
  'Glint',
  'Halo',
  'Ember',
  'Wisp',
  'Prism',
  'Orbit'
] as const;

export type PresetAvatarName = (typeof PRESET_AVATARS)[number];

interface AvatarProps extends React.SVGProps<SVGSVGElement> {
  name: string;
  size?: number | string;
}

export const AvatarIcon: React.FC<AvatarProps> = ({ name, size = 40, className = '', ...props }) => {
  const s = size;

  switch (name) {
    case 'Comet':
      return (
        <svg width={s} height={s} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
          <defs>
            <linearGradient id="cometGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop stopColor="#2E7CF6" />
              <stop offset="1" stopColor="#9B3CFF" />
            </linearGradient>
            <linearGradient id="tailGrad" x1="20" y1="80" x2="80" y2="20" gradientUnits="userSpaceOnUse">
              <stop stopColor="#9B3CFF" stopOpacity="0" />
              <stop offset="1" stopColor="#2E7CF6" stopOpacity="0.8" />
            </linearGradient>
          </defs>
          <path d="M20 75 C35 65, 45 55, 60 40 C70 30, 80 20, 85 15" stroke="url(#tailGrad)" strokeWidth="8" strokeLinecap="round" />
          <circle cx="65" cy="35" r="24" fill="url(#cometGrad)" />
          <circle cx="58" cy="28" r="6" fill="#FFFFFF" fillOpacity="0.4" />
        </svg>
      );

    case 'Nova':
      return (
        <svg width={s} height={s} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
          <defs>
            <radialGradient id="novaGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="35%" stopColor="#38bdf8" />
              <stop offset="70%" stopColor="#9B3CFF" />
              <stop offset="100%" stopColor="#14141F" />
            </radialGradient>
          </defs>
          <polygon points="50,15 80,32 80,68 50,85 20,68 20,32" fill="url(#novaGrad)" stroke="#38bdf8" strokeWidth="2" strokeLinejoin="round" />
          <circle cx="50" cy="50" r="14" fill="#FFFFFF" fillOpacity="0.8" />
        </svg>
      );

    case 'Drift':
      return (
        <svg width={s} height={s} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
          <defs>
            <linearGradient id="driftGrad" x1="0" y1="50" x2="100" y2="50" gradientUnits="userSpaceOnUse">
              <stop stopColor="#06b6d4" />
              <stop offset="0.5" stopColor="#3b82f6" />
              <stop offset="1" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
          <path d="M25 45 C20 30, 40 18, 65 22 C85 25, 90 48, 75 70 C62 88, 30 85, 20 68 C12 55, 28 55, 25 45 Z" fill="url(#driftGrad)" />
          <circle cx="45" cy="40" r="7" fill="#FFFFFF" fillOpacity="0.5" />
        </svg>
      );

    case 'Pulse':
      return (
        <svg width={s} height={s} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
          <defs>
            <linearGradient id="pulseGrad" x1="0" y1="0" x2="100" y2="100">
              <stop stopColor="#6366f1" />
              <stop offset="1" stopColor="#a855f7" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="38" stroke="#a855f7" strokeWidth="2" strokeDasharray="6 6" opacity="0.6" />
          <circle cx="50" cy="50" r="28" stroke="#6366f1" strokeWidth="3" opacity="0.8" />
          <circle cx="50" cy="50" r="16" fill="url(#pulseGrad)" />
        </svg>
      );

    case 'Glint':
      return (
        <svg width={s} height={s} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
          <defs>
            <linearGradient id="glintGrad" x1="50" y1="10" x2="50" y2="90" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="60%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#4f46e5" />
            </linearGradient>
          </defs>
          <path d="M50 18 C50 18, 76 52, 76 68 C76 82, 64 90, 50 90 C36 90, 24 82, 24 68 C24 52, 50 18, 50 18 Z" fill="url(#glintGrad)" />
          <ellipse cx="44" cy="52" rx="4" ry="9" transform="rotate(-20 44 52)" fill="#FFFFFF" fillOpacity="0.6" />
        </svg>
      );

    case 'Halo':
      return (
        <svg width={s} height={s} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
          <defs>
            <linearGradient id="haloGrad" x1="0" y1="0" x2="100" y2="100">
              <stop stopColor="#38bdf8" />
              <stop offset="0.5" stopColor="#818cf8" />
              <stop offset="1" stopColor="#c084fc" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="30" stroke="url(#haloGrad)" strokeWidth="12" fill="none" strokeLinecap="round" />
          <circle cx="50" cy="20" r="4" fill="#FFFFFF" />
        </svg>
      );

    case 'Ember':
      return (
        <svg width={s} height={s} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
          <defs>
            <linearGradient id="emberGrad" x1="50" y1="20" x2="50" y2="85" gradientUnits="userSpaceOnUse">
              <stop stopColor="#ec4899" />
              <stop offset="0.5" stopColor="#8b5cf6" />
              <stop offset="1" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
          <path d="M50 20 C54 20, 78 68, 76 74 C74 80, 26 80, 24 74 C22 68, 46 20, 50 20 Z" fill="url(#emberGrad)" stroke="#f472b6" strokeWidth="2" strokeLinejoin="round" />
          <circle cx="50" cy="60" r="8" fill="#FFFFFF" fillOpacity="0.4" />
        </svg>
      );

    case 'Wisp':
      return (
        <svg width={s} height={s} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
          <defs>
            <linearGradient id="wispGrad" x1="15" y1="35" x2="85" y2="75">
              <stop stopColor="#a78bfa" />
              <stop offset="1" stopColor="#4338ca" />
            </linearGradient>
          </defs>
          <circle cx="42" cy="46" r="20" fill="url(#wispGrad)" opacity="0.9" />
          <circle cx="60" cy="52" r="16" fill="url(#wispGrad)" opacity="0.8" />
          <circle cx="48" cy="62" r="15" fill="url(#wispGrad)" opacity="0.85" />
          <circle cx="40" cy="42" r="4" fill="#FFFFFF" fillOpacity="0.5" />
        </svg>
      );

    case 'Prism':
      return (
        <svg width={s} height={s} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
          <defs>
            <linearGradient id="prismGrad1" x1="50" y1="18" x2="20" y2="78">
              <stop stopColor="#60a5fa" />
              <stop offset="1" stopColor="#2563eb" />
            </linearGradient>
            <linearGradient id="prismGrad2" x1="50" y1="18" x2="80" y2="78">
              <stop stopColor="#c084fc" />
              <stop offset="1" stopColor="#7c3aed" />
            </linearGradient>
          </defs>
          <polygon points="50,18 22,78 50,66" fill="url(#prismGrad1)" />
          <polygon points="50,18 78,78 50,66" fill="url(#prismGrad2)" />
          <line x1="50" y1="18" x2="50" y2="66" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.6" />
        </svg>
      );

    case 'Orbit':
    default:
      return (
        <svg width={s} height={s} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
          <defs>
            <linearGradient id="orbitGrad" x1="0" y1="0" x2="100" y2="100">
              <stop stopColor="#2E7CF6" />
              <stop offset="1" stopColor="#9B3CFF" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="22" fill="url(#orbitGrad)" />
          <ellipse cx="50" cy="50" rx="38" ry="18" transform="rotate(-25 50 50)" stroke="#9B3CFF" strokeWidth="2.5" fill="none" strokeDasharray="5 3" opacity="0.8" />
          <circle cx="78" cy="38" r="6" fill="#38bdf8" />
        </svg>
      );
  }
};
