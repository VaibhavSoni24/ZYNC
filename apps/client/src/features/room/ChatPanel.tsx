import React, { useState, useRef, useEffect } from 'react';
import { Send, Lock, Clock, Sparkles } from 'lucide-react';
import { Role, ChatMessageDto } from '@zync/shared';
import { AvatarIcon } from '../../assets/avatars';
import { ReactionBar } from './ReactionBar';

interface ChatPanelProps {
  messages: ChatMessageDto[];
  myRole: Role;
  myUserId: string;
  onSendMessage: (text: string) => void;
  onSendReaction: (emoji: string) => void;
}

function formatClock(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  messages,
  myRole,
  myUserId,
  onSendMessage,
  onSendReaction
}) => {
  const [inputText, setInputText] = useState('');
  const [isCooldown, setIsCooldown] = useState(false);
  const [lastSentTime, setLastSentTime] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isViewer = myRole === Role.VIEWER;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isViewer) return;

    const now = Date.now();
    if (now - lastSentTime < 1000 || isCooldown) {
      return;
    }

    onSendMessage(inputText.trim());
    setInputText('');
    setLastSentTime(now);
    setIsCooldown(true);

    setTimeout(() => {
      setIsCooldown(false);
    }, 1000);
  };

  return (
    <div className="bg-[#0d0a14]/90 border border-white/[0.08] backdrop-blur-2xl rounded-2xl flex flex-col h-full shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/[0.08] flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent-blue animate-pulse" />
          <h3 className="font-semibold text-xs uppercase tracking-wider text-white">Live Chat</h3>
        </div>
        <span className="text-[11px] text-text-muted bg-white/[0.04] px-2 py-0.5 rounded-full border border-white/[0.06]">
          {messages.length} messages
        </span>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 p-3.5 space-y-3 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-text-muted text-xs p-6 space-y-2">
            <div className="w-10 h-10 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-accent-blue">
              <Sparkles size={18} />
            </div>
            <p className="font-medium text-white/80">No messages yet</p>
            <p className="text-[11px] text-text-muted">Say hello or share a reaction!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isSelf = msg.userId === myUserId;
            return (
              <div key={msg.id} className={`flex gap-2.5 ${isSelf ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className="w-7 h-7 rounded-full overflow-hidden bg-white/[0.05] border border-white/[0.08] flex-shrink-0">
                  <AvatarIcon name={msg.avatar} size={28} />
                </div>
                <div className={`max-w-[75%] flex flex-col ${isSelf ? 'items-end' : 'items-start'}`}>
                  <div className={`flex items-center gap-1.5 mb-1 text-[11px] ${isSelf ? 'justify-end' : ''}`}>
                    <span className="font-semibold text-white/90">{msg.username}</span>
                    <span className="text-text-muted text-[10px]">{formatClock(msg.ts)}</span>
                  </div>
                  <div
                    className={`rounded-2xl px-3 py-2 text-xs break-words leading-relaxed shadow-md ${
                      isSelf
                        ? 'bg-gradient-to-r from-accent-blue to-accent-purple text-white rounded-tr-none'
                        : 'bg-white/[0.05] text-white/95 border border-white/[0.08] rounded-tl-none'
                    }`}
                  >
                    {msg.message}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Reactions Bar - Positioned directly above input per Requirement 2 */}
      {!isViewer && (
        <div className="px-3.5 py-1.5 border-t border-white/[0.06] bg-white/[0.02] flex items-center justify-between">
          <span className="text-[10px] uppercase font-semibold tracking-wider text-text-muted">React</span>
          <ReactionBar myRole={myRole} onSendReaction={onSendReaction} compact />
        </div>
      )}

      {/* Input / Restriction Footer */}
      <div className="p-3 border-t border-white/[0.08] bg-black/40">
        {isViewer ? (
          <div className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-white/[0.04] text-xs text-text-muted border border-white/[0.06]">
            <Lock size={14} className="text-text-muted" />
            <span>Viewers cannot chat. Ask host to promote you.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              placeholder="Type a message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              maxLength={500}
              disabled={isCooldown}
              className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-text-muted/60 focus:outline-none focus:border-accent-blue transition disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isCooldown}
              title={isCooldown ? 'Cooldown active (1 msg/sec)' : 'Send message'}
              className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed text-white transition flex items-center justify-center cursor-pointer shadow-md flex-shrink-0"
            >
              {isCooldown ? (
                <Clock size={14} className="animate-spin text-white/80" />
              ) : (
                <Send size={14} />
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
