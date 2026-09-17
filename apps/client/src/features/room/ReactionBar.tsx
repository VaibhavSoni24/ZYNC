import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Role, ReactionDto } from '@zync/shared';

interface ReactionBarProps {
  myRole: Role;
  onSendReaction: (emoji: string) => void;
  className?: string;
  compact?: boolean;
}

export const EMOJIS = ['❤️', '🔥', '😂', '👏', '🎉', '😮', '🍿'];

export const ReactionBar: React.FC<ReactionBarProps> = ({
  myRole,
  onSendReaction,
  className = '',
  compact = false
}) => {
  const [cooldown, setCooldown] = useState(false);
  if (myRole === Role.VIEWER) return null;

  const handleClick = (emoji: string) => {
    if (cooldown) return;
    onSendReaction(emoji);
    setCooldown(true);
    setTimeout(() => setCooldown(false), 700);
  };

  return (
    <div
      className={`flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#0d0a14]/90 border border-white/[0.08] backdrop-blur-xl shadow-lg shadow-black/40 ${className}`}
    >
      {EMOJIS.map((emoji) => (
        <button
          key={emoji}
          type="button"
          onClick={() => handleClick(emoji)}
          disabled={cooldown}
          className={`${
            compact ? 'w-7 h-7 text-sm' : 'w-8 h-8 text-base'
          } flex items-center justify-center rounded-xl hover:bg-white/[0.08] hover:scale-125 active:scale-95 transition-all select-none disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer`}
          title={`React with ${emoji}`}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
};

interface FloatingReactionsProps {
  reactions: ReactionDto[];
}

export const FloatingReactions: React.FC<FloatingReactionsProps> = ({ reactions }) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-30">
      <AnimatePresence>
        {reactions.map((rx) => {
          // Compute pseudo-random horizontal sway trajectory based on timestamp & id
          const seed = (rx.ts % 100) / 100;
          const xDrift = (seed - 0.5) * 60; // between -30px and +30px from bottom-right anchor
          const swayDirection = seed > 0.5 ? 14 : -14;

          return (
            <motion.div
              key={rx.id}
              initial={{
                opacity: 0,
                scale: 0.4,
                y: 0,
                x: xDrift
              }}
              animate={{
                opacity: [0, 1, 1, 0.75, 0],
                scale: [0.4, 1.35, 1.15, 0.9],
                y: -320,
                x: [xDrift, xDrift + swayDirection, xDrift - swayDirection * 0.7, xDrift + swayDirection * 0.4]
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 2.6,
                ease: [0.25, 0.1, 0.25, 1]
              }}
              style={{
                position: 'absolute',
                bottom: 24,
                right: 28
              }}
              className="text-3xl select-none filter drop-shadow-[0_4px_16px_rgba(0,0,0,0.7)]"
            >
              {rx.emoji}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

