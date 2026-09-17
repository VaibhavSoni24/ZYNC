import React from 'react';

interface FallingShape {
  type: 'cube' | 'neon-cube' | 'sphere' | 'ambient-orb' | 'diamond' | 'particle';
  size: number;
  left: string;
  fallDuration: number;
  fallDelay: number;
  spinDuration: number;
  swayX: number;
  targetOpacity: number;
  blur?: string;
  border?: string;
  gradient: string;
}

const FALLING_SHAPES: FallingShape[] = [
  // 1. 3D Glass Cube - far left
  {
    type: 'cube',
    size: 58,
    left: '3%',
    fallDuration: 19,
    fallDelay: -4,
    spinDuration: 10,
    swayX: 24,
    targetOpacity: 0.45,
    blur: 'blur-[1px]',
    border: 'border border-white/20',
    gradient: 'from-white/15 via-accent-blue/10 to-transparent'
  },
  // 2. Cyan Orb
  {
    type: 'sphere',
    size: 42,
    left: '8%',
    fallDuration: 15,
    fallDelay: -9,
    spinDuration: 8,
    swayX: 18,
    targetOpacity: 0.6,
    blur: 'blur-[1px]',
    border: 'border border-cyan-400/30',
    gradient: 'from-cyan-400/25 via-accent-blue/20 to-transparent'
  },
  // 3. Ambient Large Blue Sphere
  {
    type: 'ambient-orb',
    size: 220,
    left: '13%',
    fallDuration: 29,
    fallDelay: -18,
    spinDuration: 22,
    swayX: 35,
    targetOpacity: 0.28,
    blur: 'blur-3xl',
    gradient: 'from-accent-blue/25 via-indigo-600/15 to-transparent'
  },
  // 4. Neon Violet 3D Cube
  {
    type: 'neon-cube',
    size: 64,
    left: '19%',
    fallDuration: 17,
    fallDelay: -12,
    spinDuration: 9,
    swayX: 22,
    targetOpacity: 0.55,
    border: 'border border-accent-purple/35',
    gradient: 'from-accent-purple/20 via-purple-600/10 to-transparent'
  },
  // 5. Small Crystal Diamond
  {
    type: 'diamond',
    size: 32,
    left: '24%',
    fallDuration: 13,
    fallDelay: -6,
    spinDuration: 7,
    swayX: 15,
    targetOpacity: 0.7,
    border: 'border border-white/30',
    gradient: 'from-white/25 via-accent-blue/20 to-transparent'
  },
  // 6. Micro Snow Particle
  {
    type: 'particle',
    size: 10,
    left: '28%',
    fallDuration: 11,
    fallDelay: -2,
    spinDuration: 6,
    swayX: 12,
    targetOpacity: 0.8,
    gradient: 'from-white/80 to-accent-blue/50'
  },
  // 7. Glass Cube - mid left
  {
    type: 'cube',
    size: 72,
    left: '33%',
    fallDuration: 21,
    fallDelay: -15,
    spinDuration: 13,
    swayX: 28,
    targetOpacity: 0.42,
    blur: 'blur-[1px]',
    border: 'border border-white/20',
    gradient: 'from-white/10 via-accent-purple/10 to-transparent'
  },
  // 8. Luminous Blue Sphere
  {
    type: 'sphere',
    size: 52,
    left: '38%',
    fallDuration: 16,
    fallDelay: -8,
    spinDuration: 10,
    swayX: 20,
    targetOpacity: 0.65,
    border: 'border border-accent-blue/30',
    gradient: 'from-accent-blue/30 via-cyan-400/20 to-transparent'
  },
  // 9. Ambient Purple Orb - center
  {
    type: 'ambient-orb',
    size: 260,
    left: '44%',
    fallDuration: 32,
    fallDelay: -22,
    spinDuration: 25,
    swayX: 40,
    targetOpacity: 0.25,
    blur: 'blur-[90px]',
    gradient: 'from-accent-purple/25 via-accent-blue/15 to-transparent'
  },
  // 10. Cyan Rotating Cube
  {
    type: 'neon-cube',
    size: 46,
    left: '49%',
    fallDuration: 18,
    fallDelay: -13,
    spinDuration: 11,
    swayX: 25,
    targetOpacity: 0.5,
    border: 'border border-cyan-400/35',
    gradient: 'from-cyan-400/20 via-accent-blue/10 to-transparent'
  },
  // 11. Micro Snow Particle
  {
    type: 'particle',
    size: 8,
    left: '54%',
    fallDuration: 10,
    fallDelay: -5,
    spinDuration: 5,
    swayX: 10,
    targetOpacity: 0.85,
    gradient: 'from-cyan-300 to-white'
  },
  // 12. Crystal Diamond
  {
    type: 'diamond',
    size: 38,
    left: '58%',
    fallDuration: 14,
    fallDelay: -7,
    spinDuration: 8,
    swayX: 16,
    targetOpacity: 0.65,
    border: 'border border-accent-purple/30',
    gradient: 'from-accent-purple/25 via-white/10 to-transparent'
  },
  // 13. Large Glass Cube - mid right
  {
    type: 'cube',
    size: 85,
    left: '63%',
    fallDuration: 24,
    fallDelay: -17,
    spinDuration: 14,
    swayX: 30,
    targetOpacity: 0.38,
    blur: 'blur-[2px]',
    border: 'border border-white/15',
    gradient: 'from-white/15 via-accent-blue/10 to-transparent'
  },
  // 14. Glowing Emerald/Cyan Sphere
  {
    type: 'sphere',
    size: 48,
    left: '68%',
    fallDuration: 16,
    fallDelay: -11,
    spinDuration: 9,
    swayX: 20,
    targetOpacity: 0.6,
    border: 'border border-emerald-400/30',
    gradient: 'from-emerald-400/20 via-cyan-500/15 to-transparent'
  },
  // 15. Neon Violet Cube
  {
    type: 'neon-cube',
    size: 54,
    left: '73%',
    fallDuration: 17,
    fallDelay: -3,
    spinDuration: 10,
    swayX: 24,
    targetOpacity: 0.55,
    border: 'border border-accent-purple/35',
    gradient: 'from-accent-purple/25 via-white/5 to-transparent'
  },
  // 16. Micro Particle
  {
    type: 'particle',
    size: 12,
    left: '77%',
    fallDuration: 12,
    fallDelay: -9,
    spinDuration: 6,
    swayX: 14,
    targetOpacity: 0.75,
    gradient: 'from-white to-accent-purple/60'
  },
  // 17. Ambient Soft Orb
  {
    type: 'ambient-orb',
    size: 190,
    left: '81%',
    fallDuration: 27,
    fallDelay: -20,
    spinDuration: 20,
    swayX: 32,
    targetOpacity: 0.3,
    blur: 'blur-3xl',
    gradient: 'from-accent-blue/20 via-accent-purple/20 to-transparent'
  },
  // 18. Tilted Glass Cube - right
  {
    type: 'cube',
    size: 60,
    left: '86%',
    fallDuration: 19,
    fallDelay: -14,
    spinDuration: 12,
    swayX: 26,
    targetOpacity: 0.45,
    border: 'border border-white/20',
    gradient: 'from-white/10 via-accent-blue/15 to-transparent'
  },
  // 19. Crystal Diamond - far right
  {
    type: 'diamond',
    size: 34,
    left: '91%',
    fallDuration: 15,
    fallDelay: -6,
    spinDuration: 8,
    swayX: 18,
    targetOpacity: 0.65,
    border: 'border border-cyan-400/30',
    gradient: 'from-cyan-400/25 via-white/10 to-transparent'
  },
  // 20. Micro Snow Particle
  {
    type: 'particle',
    size: 9,
    left: '95%',
    fallDuration: 10,
    fallDelay: -4,
    spinDuration: 5,
    swayX: 11,
    targetOpacity: 0.8,
    gradient: 'from-white/90 to-cyan-400/40'
  },
  // 21. Additional Glass Cube - center left
  {
    type: 'cube',
    size: 50,
    left: '16%',
    fallDuration: 16,
    fallDelay: -7,
    spinDuration: 9,
    swayX: 20,
    targetOpacity: 0.5,
    border: 'border border-white/20',
    gradient: 'from-accent-blue/20 via-white/10 to-transparent'
  },
  // 22. Additional Neon Cube - center right
  {
    type: 'neon-cube',
    size: 62,
    left: '41%',
    fallDuration: 20,
    fallDelay: -16,
    spinDuration: 11,
    swayX: 27,
    targetOpacity: 0.48,
    border: 'border border-accent-purple/30',
    gradient: 'from-accent-purple/20 via-indigo-600/15 to-transparent'
  },
  // 23. Additional Diamond
  {
    type: 'diamond',
    size: 28,
    left: '60%',
    fallDuration: 12,
    fallDelay: -1,
    spinDuration: 7,
    swayX: 14,
    targetOpacity: 0.7,
    border: 'border border-emerald-400/30',
    gradient: 'from-emerald-400/25 to-transparent'
  },
  // 24. Additional Glass Orb
  {
    type: 'sphere',
    size: 56,
    left: '84%',
    fallDuration: 18,
    fallDelay: -10,
    spinDuration: 10,
    swayX: 22,
    targetOpacity: 0.55,
    border: 'border border-white/25',
    gradient: 'from-white/20 via-accent-purple/15 to-transparent'
  }
];

export const Floating3DShapes: React.FC = () => {
  return (
    <div
      className="pointer-events-none fixed inset-0 overflow-hidden z-0 select-none"
      style={{ perspective: '1200px' }}
    >
      {FALLING_SHAPES.map((shape, idx) => {
        // Border-radius styling based on shape type
        let borderRadius = '18px';
        let extraClasses = '';

        if (shape.type === 'sphere' || shape.type === 'ambient-orb' || shape.type === 'particle') {
          borderRadius = '9999px';
        } else if (shape.type === 'diamond') {
          borderRadius = '8px';
          extraClasses = 'rotate-45';
        }

        const customStyle: React.CSSProperties & Record<string, string | number> = {
          width: `${shape.size}px`,
          height: `${shape.size}px`,
          left: shape.left,
          borderRadius,
          transformStyle: 'preserve-3d',
          // Pass CSS animation variables
          ['--fall-duration' as any]: `${shape.fallDuration}s`,
          ['--fall-delay' as any]: `${shape.fallDelay}s`,
          ['--spin-duration' as any]: `${shape.spinDuration}s`,
          ['--sway-x' as any]: `${shape.swayX}px`,
          ['--target-opacity' as any]: shape.targetOpacity
        };

        return (
          <div
            key={idx}
            className={`absolute bg-gradient-to-br ${shape.gradient} ${shape.blur || ''} ${shape.border || ''} ${extraClasses} animate-falling-3d`}
            style={customStyle}
          />
        );
      })}
    </div>
  );
};
