import React, { useState } from 'react';
import { MoreVertical, ShieldCheck, Crown, User, Eye, UserX, ArrowRightLeft, Users } from 'lucide-react';
import { Role, ParticipantDto } from '@zync/shared';
import { AvatarIcon } from '../../assets/avatars';

interface ParticipantListProps {
  participants: ParticipantDto[];
  myUserId: string;
  myRole: Role;
  onAssignRole: (userId: string, role: Role) => void;
  onRemoveParticipant: (userId: string) => void;
  onTransferHost: (userId: string) => void;
}

export const ParticipantList: React.FC<ParticipantListProps> = ({
  participants,
  myUserId,
  myRole,
  onAssignRole,
  onRemoveParticipant,
  onTransferHost
}) => {
  const [activeMenuUserId, setActiveMenuUserId] = useState<string | null>(null);

  const getRoleBadge = (role: Role) => {
    switch (role) {
      case Role.HOST:
        return (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-300 bg-amber-400/15 px-2.5 py-0.5 rounded-full border border-amber-400/30 shadow-[0_0_12px_rgba(251,191,36,0.2)]">
            <Crown size={12} className="text-amber-400" /> Host
          </span>
        );
      case Role.MODERATOR:
        return (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-purple-300 bg-purple-500/15 px-2.5 py-0.5 rounded-full border border-purple-500/30 shadow-[0_0_12px_rgba(168,85,247,0.2)]">
            <ShieldCheck size={12} className="text-purple-400" /> Moderator
          </span>
        );
      case Role.PARTICIPANT:
        return (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-blue-300 bg-blue-500/15 px-2.5 py-0.5 rounded-full border border-blue-500/30">
            <User size={12} className="text-blue-400" /> Participant
          </span>
        );
      case Role.VIEWER:
      default:
        return (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-text-muted bg-white/[0.04] px-2.5 py-0.5 rounded-full border border-white/[0.08]">
            <Eye size={12} /> Viewer
          </span>
        );
    }
  };

  return (
    <div className="bg-[#0d0a14]/90 border border-white/[0.08] backdrop-blur-2xl rounded-2xl p-4 flex flex-col h-full shadow-2xl overflow-hidden">
      <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.08] mb-3">
        <div className="flex items-center gap-2">
          <Users size={16} className="text-accent-blue" />
          <h3 className="font-semibold text-xs uppercase tracking-wider text-white">Participants</h3>
        </div>
        <span className="text-[11px] font-medium text-text-muted bg-white/[0.04] px-2 py-0.5 rounded-full border border-white/[0.06]">
          {participants.length} online
        </span>
      </div>

      <div className="space-y-2 overflow-y-auto flex-1 pr-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {participants.map((p) => {
          const isSelf = p.userId === myUserId;
          const isHost = myRole === Role.HOST;
          const showActions = isHost && !isSelf;

          return (
            <div
              key={p.userId}
              className={`flex items-center justify-between p-2.5 rounded-xl transition ${
                isSelf
                  ? 'bg-accent-blue/10 border border-accent-blue/30 shadow-[0_0_15px_rgba(59,130,246,0.1)]'
                  : 'bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.04]'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-white/[0.06] border border-white/[0.08] flex items-center justify-center flex-shrink-0">
                  <AvatarIcon name={p.avatar} size={32} />
                </div>
                <div className="truncate">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="text-xs font-semibold text-white/90 truncate">{p.username}</span>
                    {isSelf && <span className="text-[10px] text-accent-blue font-bold tracking-wide">(You)</span>}
                  </div>
                  {p.hasRequestedControl && (
                    <span className="text-[10px] text-amber-400 block animate-pulse">
                      Requested control
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0 relative">
                {getRoleBadge(p.role)}

                {showActions && (
                  <div className="relative">
                    <button
                      onClick={() => setActiveMenuUserId(activeMenuUserId === p.userId ? null : p.userId)}
                      className="p-1.5 hover:bg-white/[0.08] rounded-lg text-text-muted hover:text-white transition cursor-pointer"
                      title="Manage participant"
                    >
                      <MoreVertical size={14} />
                    </button>

                    {activeMenuUserId === p.userId && (
                      <div className="absolute right-0 top-8 w-48 bg-[#130f1e] border border-white/[0.1] backdrop-blur-2xl rounded-xl shadow-2xl py-1.5 z-40 text-xs animate-scale-up">
                        {p.role !== Role.MODERATOR && (
                          <button
                            onClick={() => {
                              onAssignRole(p.userId, Role.MODERATOR);
                              setActiveMenuUserId(null);
                            }}
                            className="w-full text-left px-3.5 py-2 hover:bg-purple-500/20 text-white/90 flex items-center gap-2 transition"
                          >
                            <ShieldCheck size={14} className="text-purple-400" />
                            Make Moderator
                          </button>
                        )}
                        {p.role !== Role.PARTICIPANT && (
                          <button
                            onClick={() => {
                              onAssignRole(p.userId, Role.PARTICIPANT);
                              setActiveMenuUserId(null);
                            }}
                            className="w-full text-left px-3.5 py-2 hover:bg-blue-500/20 text-white/90 flex items-center gap-2 transition"
                          >
                            <User size={14} className="text-blue-400" />
                            Make Participant
                          </button>
                        )}
                        {p.role !== Role.VIEWER && (
                          <button
                            onClick={() => {
                              onAssignRole(p.userId, Role.VIEWER);
                              setActiveMenuUserId(null);
                            }}
                            className="w-full text-left px-3.5 py-2 hover:bg-white/[0.08] text-text-muted flex items-center gap-2 transition"
                          >
                            <Eye size={14} />
                            Make Viewer
                          </button>
                        )}
                        <hr className="border-white/[0.08] my-1" />
                        <button
                          onClick={() => {
                            if (window.confirm(`Transfer room host ownership to ${p.username}?`)) {
                              onTransferHost(p.userId);
                            }
                            setActiveMenuUserId(null);
                          }}
                          className="w-full text-left px-3.5 py-2 hover:bg-amber-400/20 text-amber-300 flex items-center gap-2 transition"
                        >
                          <ArrowRightLeft size={14} />
                          Transfer Host
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Remove ${p.username} from the room?`)) {
                              onRemoveParticipant(p.userId);
                            }
                            setActiveMenuUserId(null);
                          }}
                          className="w-full text-left px-3.5 py-2 hover:bg-red-500/25 text-red-400 flex items-center gap-2 transition"
                        >
                          <UserX size={14} />
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
