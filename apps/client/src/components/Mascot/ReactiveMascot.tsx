import React from 'react';
import { Interactive3DBlob, MascotState } from './Interactive3DBlob';

export type { MascotState };

interface ReactiveMascotProps {
  state?: MascotState;
  size?: number;
  className?: string;
  showReactionBubble?: boolean;
}

export const ReactiveMascot: React.FC<ReactiveMascotProps> = ({
  state = 'idle',
  size = 140,
  className = '',
  showReactionBubble = true
}) => {
  return (
    <Interactive3DBlob
      state={state}
      size={size}
      className={className}
      showReactionBubble={showReactionBubble}
    />
  );
};
