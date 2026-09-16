import React, { useState } from 'react';
import { Role, ReactionDto } from '@zync/shared';

interface ReactionBarProps {
  myRole: Role;
  onSendReaction: (emoji: string) => void;
}

const EMOJIS = ['❤️', '🔥', '😂', '👏', '🎉', '😮', '🍿'];

export const ReactionBar: React.FC<ReactionBarProps> = ({ myRole, onSendReaction }) => {
  const [cooldown, setCooldown] = useState(false);
  if (myRole === Role.VIEWER) return null;

  const handleClick = (emoji: string) => {
    if (cooldown) return;
    onSendReaction(emoji);
    setCooldown(true);
    setTimeout(() => setCooldown(false), 1000);
  };

  return (
    <div className="flex items-center gap-1.5 p-2 bg-bg-surface/90 backdrop-blur-md border border-border-subtle rounded-full shadow-xl">
      {EMOJIS.map((emoji) => (
        <button
          key={emoji}
          onClick={() => handleClick(emoji)}
          disabled={cooldown}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-bg-elevated hover:scale-125 active:scale-95 transition-all text-base disabled:opacity-50 disabled:cursor-not-allowed"
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
    <div className="absolute right-4 bottom-16 pointer-events-none z-20 flex flex-col items-center gap-2 overflow-hidden h-64 w-16">
      {reactions.map((rx) => (
        <div
          key={rx.id}
          className="text-2xl animate-float-up filter drop-shadow-md select-none"
          style={{
            transform: `translateX(${(rx.ts % 16) - 8}px)`
          }}
        >
          {rx.emoji}
        </div>
      ))}
    </div>
  );
};
