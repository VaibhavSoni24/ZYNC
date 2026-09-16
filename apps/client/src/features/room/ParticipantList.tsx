import React, { useState } from 'react';
import { MoreVertical, ShieldCheck, Crown, User, Eye, UserX, ArrowRightLeft } from 'lucide-react';
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
          <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
            <Crown size={12} /> Host
          </span>
        );
      case Role.MODERATOR:
        return (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-accent-purple bg-accent-purple/10 px-2 py-0.5 rounded-full border border-accent-purple/20">
            <ShieldCheck size={12} /> Moderator
          </span>
        );
      case Role.PARTICIPANT:
        return (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-accent-blue bg-accent-blue/10 px-2 py-0.5 rounded-full border border-accent-blue/20">
            <User size={12} /> Participant
          </span>
        );
      case Role.VIEWER:
      default:
        return (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-text-muted bg-bg-elevated px-2 py-0.5 rounded-full border border-border-subtle">
            <Eye size={12} /> Viewer
          </span>
        );
    }
  };

  return (
    <div className="bg-bg-surface border border-border-subtle rounded-xl p-4 flex flex-col h-full shadow-lg">
      <div className="flex items-center justify-between pb-3 border-b border-border-subtle mb-3">
        <h3 className="font-semibold text-sm text-text-primary flex items-center gap-2">
          <span>Participants</span>
          <span className="text-xs font-normal text-text-muted bg-bg-elevated px-2 py-0.5 rounded-full">
            {participants.length}
          </span>
        </h3>
      </div>

      <div className="space-y-2 overflow-y-auto flex-1 pr-1">
        {participants.map((p) => {
          const isSelf = p.userId === myUserId;
          const isHost = myRole === Role.HOST;
          const showActions = isHost && !isSelf;

          return (
            <div
              key={p.userId}
              className={`flex items-center justify-between p-2 rounded-lg transition ${
                isSelf ? 'bg-bg-elevated/80 border border-accent-blue/20' : 'hover:bg-bg-elevated'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-bg-elevated flex items-center justify-center flex-shrink-0">
                  <AvatarIcon name={p.avatar} size={32} />
                </div>
                <div className="truncate">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="text-sm font-medium text-text-primary truncate">{p.username}</span>
                    {isSelf && <span className="text-[10px] text-accent-blue font-bold">(You)</span>}
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
                      className="p-1 hover:bg-border-subtle rounded text-text-muted hover:text-text-primary transition"
                      title="Manage participant"
                    >
                      <MoreVertical size={15} />
                    </button>

                    {activeMenuUserId === p.userId && (
                      <div className="absolute right-0 top-7 w-44 bg-bg-elevated border border-border-subtle rounded-lg shadow-2xl py-1 z-30 text-xs">
                        {p.role !== Role.MODERATOR && (
                          <button
                            onClick={() => {
                              onAssignRole(p.userId, Role.MODERATOR);
                              setActiveMenuUserId(null);
                            }}
                            className="w-full text-left px-3 py-1.5 hover:bg-accent-purple/20 text-text-primary flex items-center gap-2"
                          >
                            <ShieldCheck size={14} className="text-accent-purple" />
                            Make Moderator
                          </button>
                        )}
                        {p.role !== Role.PARTICIPANT && (
                          <button
                            onClick={() => {
                              onAssignRole(p.userId, Role.PARTICIPANT);
                              setActiveMenuUserId(null);
                            }}
                            className="w-full text-left px-3 py-1.5 hover:bg-accent-blue/20 text-text-primary flex items-center gap-2"
                          >
                            <User size={14} className="text-accent-blue" />
                            Make Participant
                          </button>
                        )}
                        {p.role !== Role.VIEWER && (
                          <button
                            onClick={() => {
                              onAssignRole(p.userId, Role.VIEWER);
                              setActiveMenuUserId(null);
                            }}
                            className="w-full text-left px-3 py-1.5 hover:bg-border-subtle text-text-muted flex items-center gap-2"
                          >
                            <Eye size={14} />
                            Make Viewer
                          </button>
                        )}
                        <hr className="border-border-subtle my-1" />
                        <button
                          onClick={() => {
                            if (window.confirm(`Transfer room host ownership to ${p.username}?`)) {
                              onTransferHost(p.userId);
                            }
                            setActiveMenuUserId(null);
                          }}
                          className="w-full text-left px-3 py-1.5 hover:bg-amber-400/20 text-amber-400 flex items-center gap-2"
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
                          className="w-full text-left px-3 py-1.5 hover:bg-red-500/20 text-red-400 flex items-center gap-2"
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
