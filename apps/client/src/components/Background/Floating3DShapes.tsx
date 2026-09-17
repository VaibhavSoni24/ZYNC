import React from 'react';
import { motion } from 'motion/react';

interface ShapeConfig {
  type: 'sphere' | 'square';
  size: number;
  top: string;
  left: string;
  blur: string;
  opacity: number;
  gradient: string;
  border?: string;
  rotate?: number;
  duration: number;
  delay: number;
  xRange: [number, number, number, number, number];
  yRange: [number, number, number, number, number];
  rotateRange?: [number, number, number, number, number];
}

const SHAPES: ShapeConfig[] = [
  // 1. Large deep ambient sphere - top left
  {
    type: 'sphere',
    size: 240,
    top: '5%',
    left: '2%',
    blur: 'blur-3xl',
    opacity: 0.35,
    gradient: 'from-accent-blue/30 via-indigo-600/20 to-transparent',
    duration: 18,
    delay: 0,
    xRange: [0, 45, -30, 20, 0],
    yRange: [0, -35, 25, -15, 0]
  },
  // 2. Medium tilted glass square - top right
  {
    type: 'square',
    size: 130,
    top: '12%',
    left: '84%',
    blur: 'blur-[2px]',
    opacity: 0.4,
    gradient: 'from-accent-purple/20 via-white/[0.06] to-transparent',
    border: 'border border-accent-purple/30',
    rotate: 24,
    duration: 14,
    delay: 1.5,
    xRange: [0, -30, 20, -15, 0],
    yRange: [0, 30, -25, 10, 0],
    rotateRange: [24, 45, 15, 35, 24]
  },
  // 3. Crisp luminous glass sphere - upper middle left
  {
    type: 'sphere',
    size: 64,
    top: '28%',
    left: '14%',
    blur: 'blur-[1px]',
    opacity: 0.6,
    gradient: 'from-cyan-400/25 via-accent-blue/20 to-transparent',
    border: 'border border-cyan-400/30',
    duration: 11,
    delay: 0.8,
    xRange: [0, 25, -20, 10, 0],
    yRange: [0, -28, 18, -12, 0]
  },
  // 4. Large soft ambient purple sphere - mid center
  {
    type: 'sphere',
    size: 320,
    top: '38%',
    left: '42%',
    blur: 'blur-[100px]',
    opacity: 0.28,
    gradient: 'from-accent-purple/25 via-accent-blue/15 to-transparent',
    duration: 22,
    delay: 2,
    xRange: [0, -50, 40, -20, 0],
    yRange: [0, 40, -30, 20, 0]
  },
  // 5. Small tilted glass cube - center right
  {
    type: 'square',
    size: 48,
    top: '42%',
    left: '78%',
    blur: 'blur-[0.5px]',
    opacity: 0.55,
    gradient: 'from-white/[0.12] via-accent-blue/15 to-transparent',
    border: 'border border-white/25',
    rotate: 42,
    duration: 10,
    delay: 2.2,
    xRange: [0, -20, 15, -10, 0],
    yRange: [0, -25, 20, -10, 0],
    rotateRange: [42, 65, 30, 50, 42]
  },
  // 6. Mid-size rounded diamond - lower left
  {
    type: 'square',
    size: 95,
    top: '64%',
    left: '6%',
    blur: 'blur-[3px]',
    opacity: 0.35,
    gradient: 'from-accent-blue/20 via-purple-600/10 to-transparent',
    border: 'border border-accent-blue/25',
    rotate: -35,
    duration: 16,
    delay: 1,
    xRange: [0, 35, -25, 15, 0],
    yRange: [0, 25, -30, 15, 0],
    rotateRange: [-35, -20, -50, -30, -35]
  },
  // 7. Glowing cyan sphere - lower middle
  {
    type: 'sphere',
    size: 90,
    top: '72%',
    left: '52%',
    blur: 'blur-md',
    opacity: 0.45,
    gradient: 'from-emerald-400/20 via-cyan-500/15 to-transparent',
    border: 'border border-cyan-400/20',
    duration: 13,
    delay: 3,
    xRange: [0, -25, 30, -15, 0],
    yRange: [0, -30, 20, -10, 0]
  },
  // 8. Tilted large glass prism - bottom right
  {
    type: 'square',
    size: 160,
    top: '78%',
    left: '86%',
    blur: 'blur-xl',
    opacity: 0.3,
    gradient: 'from-accent-purple/20 via-accent-blue/15 to-transparent',
    border: 'border border-white/10',
    rotate: 15,
    duration: 20,
    delay: 0.5,
    xRange: [0, -40, 25, -20, 0],
    yRange: [0, -35, 30, -15, 0],
    rotateRange: [15, 30, 0, 20, 15]
  },
  // 9. Tiny floating particle orb - top middle
  {
    type: 'sphere',
    size: 24,
    top: '18%',
    left: '48%',
    blur: 'blur-[0.5px]',
    opacity: 0.65,
    gradient: 'from-white/40 via-accent-blue/30 to-transparent',
    duration: 9,
    delay: 1.2,
    xRange: [0, 20, -15, 10, 0],
    yRange: [0, 15, -20, 10, 0]
  }
];

export const Floating3DShapes: React.FC = () => {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden -z-10 select-none">
      {SHAPES.map((shape, idx) => (
        <motion.div
          key={idx}
          className={`absolute bg-gradient-to-br ${shape.gradient} ${shape.blur} ${shape.border || ''}`}
          style={{
            width: `${shape.size}px`,
            height: `${shape.size}px`,
            top: shape.top,
            left: shape.left,
            opacity: shape.opacity,
            borderRadius: shape.type === 'sphere' ? '9999px' : '24px',
            transform: shape.rotate ? `rotate(${shape.rotate}deg)` : undefined
          }}
          animate={{
            x: shape.xRange,
            y: shape.yRange,
            rotate: shape.rotateRange || (shape.rotate ? [shape.rotate, shape.rotate + 15, shape.rotate - 15, shape.rotate] : undefined),
            scale: [1, 1.06, 0.96, 1.03, 1]
          }}
          transition={{
            duration: shape.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: shape.delay
          }}
        />
      ))}
    </div>
  );
};
