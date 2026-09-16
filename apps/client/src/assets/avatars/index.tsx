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

export interface PresetAvatarInfo {
  name: PresetAvatarName;
  role: string;
  tagline: string;
  bgGradient: string;
}

export const PRESET_AVATAR_DETAILS: Record<PresetAvatarName, PresetAvatarInfo> = {
  Comet: {
    name: 'Comet',
    role: 'The Architect',
    tagline: 'Tech wizard with studio cans & spectacles',
    bgGradient: 'from-blue-600/30 to-indigo-900/40'
  },
  Nova: {
    name: 'Nova',
    role: 'The Creator',
    tagline: 'Artistic spirit with starry afro-puffs',
    bgGradient: 'from-purple-600/30 to-fuchsia-950/40'
  },
  Drift: {
    name: 'Drift',
    role: 'The Skater',
    tagline: 'Chilled-out friend with a backward cyan cap',
    bgGradient: 'from-cyan-600/30 to-teal-950/40'
  },
  Pulse: {
    name: 'Pulse',
    role: 'The Streamer',
    tagline: 'High-energy gamer with cat-ear headphones',
    bgGradient: 'from-pink-600/30 to-rose-950/40'
  },
  Glint: {
    name: 'Glint',
    role: 'The Cyberpunk',
    tagline: 'Futuristic explorer with a glowing visor',
    bgGradient: 'from-sky-500/30 to-blue-950/40'
  },
  Halo: {
    name: 'Halo',
    role: 'The Optimist',
    tagline: 'Golden curls with round wire spectacles',
    bgGradient: 'from-amber-500/30 to-orange-950/40'
  },
  Ember: {
    name: 'Ember',
    role: 'The Adventurer',
    tagline: 'Fiery ginger scout wearing an orange beanie',
    bgGradient: 'from-orange-600/30 to-red-950/40'
  },
  Wisp: {
    name: 'Wisp',
    role: 'The Night Owl',
    tagline: 'Cozy anime fan in an oversized mint hoodie',
    bgGradient: 'from-emerald-600/30 to-teal-950/40'
  },
  Prism: {
    name: 'Prism',
    role: 'The Trendsetter',
    tagline: 'Sleek purple bob and silver hoop earring',
    bgGradient: 'from-violet-600/30 to-purple-950/40'
  },
  Orbit: {
    name: 'Orbit',
    role: 'The Stargazer',
    tagline: 'Textured curls with a cosmic starry bandana',
    bgGradient: 'from-indigo-600/30 to-slate-950/40'
  }
};

interface AvatarProps extends React.SVGProps<SVGSVGElement> {
  name: string;
  size?: number | string;
}

export const AvatarIcon: React.FC<AvatarProps> = ({ name, size = 44, className = '', ...props }) => {
  const s = size;

  switch (name) {
    // 1. Comet: Techie coder with headphones, glasses & blue hair
    case 'Comet':
      return (
        <svg width={s} height={s} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
          <circle cx="50" cy="50" r="48" fill="#1E293B" stroke="#38BDF8" strokeWidth="2.5" />
          {/* Shoulders / Shirt */}
          <path d="M 22 92 C 24 72, 40 68, 50 68 C 60 68, 76 72, 78 92 Z" fill="#2563EB" />
          <path d="M 42 68 L 50 78 L 58 68 Z" fill="#F8FAFC" />
          {/* Head & Neck */}
          <rect x="44" y="58" width="12" height="14" rx="4" fill="#FBCFE8" />
          <ellipse cx="50" cy="48" rx="20" ry="22" fill="#FDE047" opacity="0" />
          <ellipse cx="50" cy="46" rx="19" ry="21" fill="#FFEDD5" />
          {/* Hair (Blue Swept) */}
          <path d="M 30 42 C 30 25, 42 18, 56 18 C 70 18, 72 32, 70 42 C 65 30, 52 26, 44 32 C 38 36, 34 38, 30 42 Z" fill="#1D4ED8" />
          <path d="M 30 40 Q 26 26 44 20" stroke="#60A5FA" strokeWidth="3" strokeLinecap="round" />
          {/* Over-Ear Headphones */}
          <path d="M 28 44 C 28 22, 72 22, 72 44" stroke="#0284C7" strokeWidth="4.5" strokeLinecap="round" fill="none" />
          <rect x="25" y="40" width="8" height="14" rx="4" fill="#0EA5E9" />
          <rect x="67" y="40" width="8" height="14" rx="4" fill="#0EA5E9" />
          {/* Glasses */}
          <rect x="36" y="42" width="11" height="8" rx="2" stroke="#0F172A" strokeWidth="2" fill="#E0F2FE" fillOpacity="0.4" />
          <rect x="53" y="42" width="11" height="8" rx="2" stroke="#0F172A" strokeWidth="2" fill="#E0F2FE" fillOpacity="0.4" />
          <line x1="47" y1="46" x2="53" y2="46" stroke="#0F172A" strokeWidth="2" />
          {/* Pupils */}
          <circle cx="41" cy="46" r="2" fill="#0F172A" />
          <circle cx="58" cy="46" r="2" fill="#0F172A" />
          {/* Smile */}
          <path d="M 45 56 Q 50 61 55 56" stroke="#B45309" strokeWidth="2" strokeLinecap="round" fill="none" />
        </svg>
      );

    // 2. Nova: Creative with purple afro-puffs and warm smile
    case 'Nova':
      return (
        <svg width={s} height={s} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
          <circle cx="50" cy="50" r="48" fill="#2E1065" stroke="#C084FC" strokeWidth="2.5" />
          {/* Purple Afro Puffs */}
          <circle cx="28" cy="30" r="16" fill="#7E22CE" />
          <circle cx="72" cy="30" r="16" fill="#7E22CE" />
          <circle cx="28" cy="30" r="13" fill="#6B21A8" />
          <circle cx="72" cy="30" r="13" fill="#6B21A8" />
          {/* Hair Clips */}
          <circle cx="38" cy="35" r="3" fill="#FACC15" />
          <circle cx="62" cy="35" r="3" fill="#FACC15" />
          {/* Shirt */}
          <path d="M 22 92 C 24 72, 40 68, 50 68 C 60 68, 76 72, 78 92 Z" fill="#9333EA" />
          {/* Head & Neck */}
          <rect x="45" y="58" width="10" height="14" rx="4" fill="#A16207" />
          <ellipse cx="50" cy="48" rx="19" ry="20" fill="#CA8A04" />
          {/* Hair Front Edge */}
          <path d="M 32 40 C 35 28, 65 28, 68 40 C 60 34, 40 34, 32 40 Z" fill="#581C87" />
          {/* Eyes with lashes */}
          <ellipse cx="42" cy="46" rx="3.5" ry="4" fill="#1F2937" />
          <circle cx="43" cy="44.5" r="1.5" fill="#FFFFFF" />
          <ellipse cx="58" cy="46" rx="3.5" ry="4" fill="#1F2937" />
          <circle cx="59" cy="44.5" r="1.5" fill="#FFFFFF" />
          {/* Rosy Cheeks */}
          <circle cx="37" cy="52" r="3.5" fill="#F43F5E" opacity="0.4" />
          <circle cx="63" cy="52" r="3.5" fill="#F43F5E" opacity="0.4" />
          {/* Cheerful Smile */}
          <path d="M 44 55 Q 50 62 56 55 Z" fill="#FFFFFF" stroke="#854D0E" strokeWidth="1.5" />
        </svg>
      );

    // 3. Drift: Chill skater with backward cyan cap & smirk
    case 'Drift':
      return (
        <svg width={s} height={s} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
          <circle cx="50" cy="50" r="48" fill="#0F172A" stroke="#22D3EE" strokeWidth="2.5" />
          {/* Hoodie */}
          <path d="M 22 92 C 24 72, 40 68, 50 68 C 60 68, 76 72, 78 92 Z" fill="#0891B2" />
          <rect x="44" y="58" width="12" height="12" rx="4" fill="#FED7AA" />
          {/* Head */}
          <ellipse cx="50" cy="48" rx="19" ry="20" fill="#FED7AA" />
          {/* Backward Snapback Cap */}
          <path d="M 31 40 C 31 24, 69 24, 69 40 Z" fill="#06B6D4" />
          {/* Cap Brim turned backward */}
          <path d="M 24 40 Q 50 44 76 40 L 73 35 Q 50 38 27 35 Z" fill="#0E7490" />
          <rect x="46" y="24" width="8" height="4" rx="2" fill="#E0F2FE" />
          {/* Hair strands peaking */}
          <path d="M 31 42 Q 28 48 31 52" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
          <path d="M 69 42 Q 72 48 69 52" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
          {/* Freckles */}
          <circle cx="39" cy="52" r="1" fill="#C2410C" />
          <circle cx="42" cy="53" r="1" fill="#C2410C" />
          <circle cx="58" cy="53" r="1" fill="#C2410C" />
          <circle cx="61" cy="52" r="1" fill="#C2410C" />
          {/* Eyes (confident) */}
          <path d="M 38 46 Q 43 44 46 47" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 54 47 Q 57 44 62 46" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="42" cy="48" r="2.5" fill="#1E293B" />
          <circle cx="58" cy="48" r="2.5" fill="#1E293B" />
          {/* Smirk */}
          <path d="M 46 56 Q 52 56 57 53" stroke="#9A3412" strokeWidth="2" strokeLinecap="round" fill="none" />
        </svg>
      );

    // 4. Pulse: Gamer girl with cat-ear headphones & pink hair
    case 'Pulse':
      return (
        <svg width={s} height={s} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
          <circle cx="50" cy="50" r="48" fill="#3B0764" stroke="#F43F5E" strokeWidth="2.5" />
          {/* Cat Ear Headphones (Top) */}
          <polygon points="30,28 38,12 46,24" fill="#F43F5E" stroke="#E11D48" strokeWidth="2" strokeLinejoin="round" />
          <polygon points="34,25 38,16 42,23" fill="#FECDD3" />
          <polygon points="70,28 62,12 54,24" fill="#F43F5E" stroke="#E11D48" strokeWidth="2" strokeLinejoin="round" />
          <polygon points="66,25 62,16 58,23" fill="#FECDD3" />
          <path d="M 28 38 C 28 18, 72 18, 72 38" stroke="#E11D48" strokeWidth="4" fill="none" />
          <rect x="23" y="36" width="8" height="14" rx="4" fill="#BE185D" />
          <rect x="69" y="36" width="8" height="14" rx="4" fill="#BE185D" />
          {/* Shirt */}
          <path d="M 22 92 C 24 72, 40 68, 50 68 C 60 68, 76 72, 78 92 Z" fill="#E11D48" />
          {/* Head & Neck */}
          <rect x="45" y="58" width="10" height="14" rx="4" fill="#FDE047" opacity="0" />
          <ellipse cx="50" cy="48" rx="18" ry="20" fill="#FFEDD5" />
          {/* Vibrant Pink Hair & Bangs */}
          <path d="M 28 44 C 28 26, 72 26, 72 44 C 68 34, 58 32, 50 34 C 42 32, 32 34, 28 44 Z" fill="#FB7185" />
          <path d="M 32 36 L 40 45 L 48 36 L 56 45 L 68 36" fill="#F43F5E" />
          {/* Wink Eye Left, Big Eye Right */}
          <path d="M 37 47 Q 42 51 47 47" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="58" cy="46" r="4.5" fill="#0F172A" />
          <circle cx="59.5" cy="44.5" r="1.5" fill="#FFFFFF" />
          {/* Cute Open Grin */}
          <path d="M 44 55 Q 50 63 56 55 Z" fill="#E11D48" stroke="#BE123C" strokeWidth="1.5" />
          <circle cx="36" cy="52" r="3" fill="#FB7185" opacity="0.6" />
          <circle cx="64" cy="52" r="3" fill="#FB7185" opacity="0.6" />
        </svg>
      );

    // 5. Glint: Cyberpunk with luminous neon visor
    case 'Glint':
      return (
        <svg width={s} height={s} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
          <circle cx="50" cy="50" r="48" fill="#020617" stroke="#38BDF8" strokeWidth="2.5" />
          {/* Futuristic Jacket */}
          <path d="M 22 92 C 24 72, 40 68, 50 68 C 60 68, 76 72, 78 92 Z" fill="#0F172A" />
          <path d="M 40 68 L 50 92 L 60 68" stroke="#38BDF8" strokeWidth="2" fill="none" />
          {/* Head & Neck */}
          <rect x="44" y="58" width="12" height="12" rx="4" fill="#E2E8F0" />
          <ellipse cx="50" cy="48" rx="19" ry="20" fill="#CBD5E1" />
          {/* Dark Undercut Hair */}
          <path d="M 29 42 C 29 20, 71 20, 71 42 C 65 26, 55 24, 50 24 C 45 24, 35 26, 29 42 Z" fill="#1E293B" />
          <path d="M 31 30 L 40 22 L 52 24" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" />
          {/* Glowing Cyber Visor */}
          <path d="M 28 43 Q 50 40 72 43 L 70 51 Q 50 48 30 51 Z" fill="#0284C7" stroke="#38BDF8" strokeWidth="2" />
          <line x1="33" y1="46" x2="67" y2="46" stroke="#E0F2FE" strokeWidth="2" strokeLinecap="round" />
          {/* Determined Mouth */}
          <line x1="46" y1="58" x2="54" y2="58" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    // 6. Halo: Cheerful friend with golden wavy hair & round glasses
    case 'Halo':
      return (
        <svg width={s} height={s} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
          <circle cx="50" cy="50" r="48" fill="#451A03" stroke="#FBBF24" strokeWidth="2.5" />
          {/* Golden Locks Background */}
          <ellipse cx="32" cy="52" rx="10" ry="18" fill="#F59E0B" />
          <ellipse cx="68" cy="52" rx="10" ry="18" fill="#F59E0B" />
          {/* Shirt */}
          <path d="M 22 92 C 24 72, 40 68, 50 68 C 60 68, 76 72, 78 92 Z" fill="#D97706" />
          {/* Head & Neck */}
          <rect x="44" y="58" width="12" height="12" rx="4" fill="#FEF08A" />
          <ellipse cx="50" cy="48" rx="19" ry="20" fill="#FEF08A" />
          {/* Top Hair */}
          <path d="M 28 40 C 28 22, 72 22, 72 40 C 65 30, 55 26, 48 26 C 40 26, 33 30, 28 40 Z" fill="#FBBF24" />
          {/* Round Golden Glasses */}
          <circle cx="41" cy="46" r="7" stroke="#B45309" strokeWidth="2" fill="#FFFFFF" fillOpacity="0.3" />
          <circle cx="59" cy="46" r="7" stroke="#B45309" strokeWidth="2" fill="#FFFFFF" fillOpacity="0.3" />
          <line x1="48" y1="46" x2="52" y2="46" stroke="#B45309" strokeWidth="2" />
          {/* Pupils */}
          <circle cx="41" cy="46" r="2.5" fill="#451A03" />
          <circle cx="59" cy="46" r="2.5" fill="#451A03" />
          {/* Soft Smile */}
          <path d="M 45 56 Q 50 61 55 56" stroke="#92400E" strokeWidth="2" strokeLinecap="round" fill="none" />
        </svg>
      );

    // 7. Ember: Ginger adventurer with orange beanie & freckles
    case 'Ember':
      return (
        <svg width={s} height={s} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
          <circle cx="50" cy="50" r="48" fill="#431407" stroke="#FB923C" strokeWidth="2.5" />
          {/* Jacket */}
          <path d="M 22 92 C 24 72, 40 68, 50 68 C 60 68, 76 72, 78 92 Z" fill="#C2410C" />
          {/* Head & Neck */}
          <rect x="44" y="58" width="12" height="12" rx="4" fill="#FFEDD5" />
          <ellipse cx="50" cy="50" rx="19" ry="20" fill="#FFEDD5" />
          {/* Ginger Side Hair */}
          <path d="M 29 48 Q 25 56 29 60" stroke="#EA580C" strokeWidth="4" strokeLinecap="round" />
          <path d="M 71 48 Q 75 56 71 60" stroke="#EA580C" strokeWidth="4" strokeLinecap="round" />
          {/* Orange Beanie */}
          <path d="M 30 42 C 30 22, 70 22, 70 42 Z" fill="#F97316" />
          <rect x="27" y="38" width="46" height="8" rx="4" fill="#EA580C" stroke="#C2410C" strokeWidth="1.5" />
          {/* Beanie Pom-Pom */}
          <circle cx="50" cy="20" r="6" fill="#FDBA74" />
          {/* Eyes */}
          <circle cx="41" cy="49" r="3.5" fill="#1C1917" />
          <circle cx="42.5" cy="47.5" r="1.2" fill="#FFFFFF" />
          <circle cx="59" cy="49" r="3.5" fill="#1C1917" />
          <circle cx="60.5" cy="47.5" r="1.2" fill="#FFFFFF" />
          {/* Freckles Cluster */}
          <circle cx="37" cy="54" r="1" fill="#C2410C" />
          <circle cx="40" cy="55" r="1" fill="#C2410C" />
          <circle cx="43" cy="54" r="1" fill="#C2410C" />
          <circle cx="57" cy="54" r="1" fill="#C2410C" />
          <circle cx="60" cy="55" r="1" fill="#C2410C" />
          <circle cx="63" cy="54" r="1" fill="#C2410C" />
          {/* Grin */}
          <path d="M 45 58 Q 50 63 55 58" stroke="#9A3412" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </svg>
      );

    // 8. Wisp: Cozy streamer in mint oversized hoodie
    case 'Wisp':
      return (
        <svg width={s} height={s} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
          <circle cx="50" cy="50" r="48" fill="#064E3B" stroke="#34D399" strokeWidth="2.5" />
          {/* Oversized Mint Hoodie Hood Backdrop */}
          <path d="M 24 50 C 24 22, 76 22, 76 50 C 76 76, 24 76, 24 50 Z" fill="#059669" />
          {/* Shoulders */}
          <path d="M 18 92 C 20 70, 38 66, 50 66 C 62 66, 80 70, 82 92 Z" fill="#10B981" />
          {/* Head & Neck */}
          <rect x="45" y="58" width="10" height="12" rx="4" fill="#FEF3C7" />
          <ellipse cx="50" cy="48" rx="17" ry="18" fill="#FEF3C7" />
          {/* Dark Messy Hair Fringe */}
          <path d="M 33 42 C 36 30, 64 30, 67 42 C 60 36, 54 44, 48 38 C 42 44, 38 36, 33 42 Z" fill="#1F2937" />
          {/* Chill eyes */}
          <ellipse cx="42" cy="47" rx="3.5" ry="3" fill="#111827" />
          <ellipse cx="58" cy="47" rx="3.5" ry="3" fill="#111827" />
          <circle cx="43" cy="46" r="1.2" fill="#FFFFFF" />
          <circle cx="59" cy="46" r="1.2" fill="#FFFFFF" />
          {/* Hoodie Drawstrings */}
          <line x1="46" y1="68" x2="46" y2="80" stroke="#D1FAE5" strokeWidth="2" strokeLinecap="round" />
          <line x1="54" y1="68" x2="54" y2="78" stroke="#D1FAE5" strokeWidth="2" strokeLinecap="round" />
          {/* Soft Smile */}
          <path d="M 46 55 Q 50 58 54 55" stroke="#92400E" strokeWidth="2" strokeLinecap="round" fill="none" />
        </svg>
      );

    // 9. Prism: Trendsetter with violet bob & silver hoop
    case 'Prism':
      return (
        <svg width={s} height={s} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
          <circle cx="50" cy="50" r="48" fill="#3B0764" stroke="#A855F7" strokeWidth="2.5" />
          {/* High Collar Jacket */}
          <path d="M 22 92 C 24 72, 40 68, 50 68 C 60 68, 76 72, 78 92 Z" fill="#581C87" />
          {/* Head & Neck */}
          <rect x="45" y="58" width="10" height="12" rx="4" fill="#FDE047" opacity="0" />
          <ellipse cx="50" cy="48" rx="18" ry="19" fill="#E2E8F0" />
          {/* Asymmetric Purple Bob */}
          <path d="M 28 40 C 28 20, 72 20, 72 40 C 72 58, 64 62, 64 62 L 58 42 C 54 44, 46 44, 42 42 L 36 66 C 28 58, 28 40, 28 40 Z" fill="#7C3AED" />
          {/* Silver Earring on right */}
          <circle cx="68" cy="52" r="3.5" stroke="#E2E8F0" strokeWidth="1.8" fill="none" />
          {/* Sassy/Sharp Eyes */}
          <path d="M 37 45 Q 43 42 47 46" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
          <circle cx="43" cy="47" r="3" fill="#0F172A" />
          <circle cx="44" cy="46" r="1" fill="#FFFFFF" />
          <path d="M 53 46 Q 57 42 63 45" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
          <circle cx="57" cy="47" r="3" fill="#0F172A" />
          <circle cx="58" cy="46" r="1" fill="#FFFFFF" />
          {/* Smirk */}
          <path d="M 45 57 Q 52 59 55 54" stroke="#6B21A8" strokeWidth="2" strokeLinecap="round" fill="none" />
        </svg>
      );

    // 10. Orbit: Stargazer with dark curly hair & cosmic bandana
    case 'Orbit':
    default:
      return (
        <svg width={s} height={s} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
          <circle cx="50" cy="50" r="48" fill="#0F172A" stroke="#818CF8" strokeWidth="2.5" />
          {/* Shoulders */}
          <path d="M 22 92 C 24 72, 40 68, 50 68 C 60 68, 76 72, 78 92 Z" fill="#3730A3" />
          {/* Head & Neck */}
          <rect x="44" y="58" width="12" height="12" rx="4" fill="#78350F" />
          <ellipse cx="50" cy="48" rx="19" ry="20" fill="#92400E" />
          {/* Curly Textured Afro Backdrop */}
          <circle cx="34" cy="36" r="10" fill="#1C1917" />
          <circle cx="44" cy="28" r="11" fill="#1C1917" />
          <circle cx="56" cy="28" r="11" fill="#1C1917" />
          <circle cx="66" cy="36" r="10" fill="#1C1917" />
          {/* Cosmic Galaxy Bandana */}
          <path d="M 31 38 Q 50 42 69 38 L 68 32 Q 50 36 32 32 Z" fill="#4F46E5" />
          <circle cx="42" cy="36" r="1" fill="#FDE047" />
          <circle cx="50" cy="37" r="1.2" fill="#FFFFFF" />
          <circle cx="58" cy="36" r="1" fill="#FDE047" />
          {/* Bright expressive eyes */}
          <ellipse cx="42" cy="47" rx="3.5" ry="4" fill="#111827" />
          <circle cx="43.5" cy="45.5" r="1.5" fill="#FFFFFF" />
          <ellipse cx="58" cy="47" rx="3.5" ry="4" fill="#111827" />
          <circle cx="59.5" cy="45.5" r="1.5" fill="#FFFFFF" />
          {/* Cheerful grin */}
          <path d="M 44 56 Q 50 63 56 56 Z" fill="#FFFFFF" stroke="#451A03" strokeWidth="1.5" />
        </svg>
      );
  }
};
