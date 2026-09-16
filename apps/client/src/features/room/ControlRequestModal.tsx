import React from 'react';
import { Check, X, ShieldAlert } from 'lucide-react';
import { ControlRequestDto } from '@zync/shared';

interface ControlRequestModalProps {
  requests: ControlRequestDto[];
  onRespond: (userId: string, approve: boolean) => void;
}

export const ControlRequestModal: React.FC<ControlRequestModalProps> = ({ requests, onRespond }) => {
  if (requests.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-2 max-w-sm w-full">
      {requests.map((req) => (
        <div
          key={req.userId}
          className="bg-bg-elevated border border-accent-blue/40 rounded-xl p-4 shadow-2xl backdrop-blur-lg flex flex-col gap-3 animate-slide-in"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-accent-blue/10 text-accent-blue flex-shrink-0">
              <ShieldAlert size={18} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-text-primary">Playback Control Request</h4>
              <p className="text-xs text-text-muted mt-0.5">
                <span className="font-medium text-white">{req.username}</span> is requesting permission to control video playback.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border-subtle">
            <button
              onClick={() => onRespond(req.userId, false)}
              className="px-3 py-1.5 rounded-lg bg-bg-surface hover:bg-border-subtle text-xs text-text-muted hover:text-white transition flex items-center gap-1"
            >
              <X size={14} />
              Deny
            </button>
            <button
              onClick={() => onRespond(req.userId, true)}
              className="px-3 py-1.5 rounded-lg bg-accent-blue hover:bg-blue-600 text-xs text-white font-medium transition flex items-center gap-1 shadow-md"
            >
              <Check size={14} />
              Approve (Moderator)
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
