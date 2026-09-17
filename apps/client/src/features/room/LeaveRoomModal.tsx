import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, LogOut } from 'lucide-react';
import { Role } from '@zync/shared';

interface LeaveRoomModalProps {
  isOpen: boolean;
  myRole: Role;
  onConfirm: () => void;
  onCancel: () => void;
}

export const LeaveRoomModal: React.FC<LeaveRoomModalProps> = ({
  isOpen,
  myRole,
  onConfirm,
  onCancel
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          {/* Backdrop click cancels */}
          <div className="absolute inset-0" onClick={onCancel} />

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-md bg-[#0d0a14]/95 border border-white/10 rounded-2xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl text-left overflow-hidden z-10"
          >
            {/* Ambient subtle glow */}
            <div className="absolute -top-16 -right-16 w-36 h-36 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-accent-purple/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">Leave Watch Party?</h3>
                  <p className="text-xs text-text-muted mt-0.5">Confirmation required</p>
                </div>
              </div>
              <button
                onClick={onCancel}
                className="text-text-muted hover:text-white p-1 rounded-lg hover:bg-white/[0.06] transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Role-Specific Warning Body */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3.5 mb-5 text-xs text-text-muted leading-relaxed">
              {myRole === Role.HOST ? (
                <p>
                  <strong className="text-amber-300 font-semibold">👑 You are the Host.</strong> Leaving this room will transfer host controls to a moderator. If no moderators are present, the watch party will be permanently closed for everyone.
                </p>
              ) : myRole === Role.MODERATOR ? (
                <p>
                  <strong className="text-accent-purple font-semibold">🛡️ You are a Moderator.</strong> Leaving will disconnect you from this watch party and revoke your active session controls.
                </p>
              ) : (
                <p>
                  Leaving will disconnect you from the synchronized stream and real-time chat. You can rejoin at any time with the room code.
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-white/[0.05] hover:bg-white/[0.09] text-white/90 border border-white/[0.08] transition cursor-pointer"
              >
                Stay in Room
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)] transition cursor-pointer flex items-center gap-1.5"
              >
                <LogOut size={13} />
                <span>Leave Watch Party</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
