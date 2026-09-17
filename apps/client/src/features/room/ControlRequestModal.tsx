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
    <div className="fixed bottom-6 right-6 z-50 space-y-3 max-w-sm w-full">
      {requests.map((req) => (
        <div
          key={req.userId}
          className="bg-[#0d0a14]/95 border border-accent-blue/30 rounded-2xl p-4 shadow-2xl backdrop-blur-2xl flex flex-col gap-3 animate-slide-in shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
        >
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-accent-blue/15 text-accent-blue flex-shrink-0 border border-accent-blue/20">
              <ShieldAlert size={18} />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider font-bold text-white">Playback Control Request</h4>
              <p className="text-xs text-text-muted mt-1 leading-relaxed">
                <span className="font-semibold text-white">{req.username}</span> is requesting permission to control playback.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2.5 border-t border-white/[0.08]">
            <button
              onClick={() => onRespond(req.userId, false)}
              className="px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs text-text-muted hover:text-white transition flex items-center gap-1 cursor-pointer"
            >
              <X size={14} />
              Deny
            </button>
            <button
              onClick={() => onRespond(req.userId, true)}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple hover:opacity-95 text-xs text-white font-semibold transition flex items-center gap-1 shadow-md cursor-pointer"
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
