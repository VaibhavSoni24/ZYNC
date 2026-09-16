import React, { useState, useRef, useEffect } from 'react';
import { Send, Lock } from 'lucide-react';
import { Role, ChatMessageDto } from '@zync/shared';
import { AvatarIcon } from '../../assets/avatars';

interface ChatPanelProps {
  messages: ChatMessageDto[];
  myRole: Role;
  myUserId: string;
  onSendMessage: (text: string) => void;
}

function formatClock(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  messages,
  myRole,
  myUserId,
  onSendMessage
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isViewer = myRole === Role.VIEWER;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isViewer) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  return (
    <div className="bg-bg-surface border border-border-subtle rounded-xl flex flex-col h-full shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-3.5 border-b border-border-subtle flex items-center justify-between">
        <h3 className="font-semibold text-sm text-text-primary">Live Chat</h3>
        <span className="text-xs text-text-muted">{messages.length} messages</span>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 p-3.5 space-y-3 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-text-muted text-xs p-4">
            <p>No messages yet.</p>
            <p className="mt-1">Be the first to say hello!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isSelf = msg.userId === myUserId;
            return (
              <div key={msg.id} className={`flex gap-2.5 ${isSelf ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className="w-7 h-7 rounded-full overflow-hidden bg-bg-elevated flex-shrink-0">
                  <AvatarIcon name={msg.avatar} size={28} />
                </div>
                <div className={`max-w-[75%] ${isSelf ? 'items-end' : 'items-start'}`}>
                  <div className={`flex items-center gap-1.5 mb-1 text-[11px] ${isSelf ? 'justify-end' : ''}`}>
                    <span className="font-medium text-text-primary">{msg.username}</span>
                    <span className="text-text-muted text-[10px]">{formatClock(msg.ts)}</span>
                  </div>
                  <div
                    className={`rounded-xl px-3 py-1.5 text-xs break-words ${
                      isSelf
                        ? 'bg-accent-blue text-white rounded-tr-none'
                        : 'bg-bg-elevated text-text-primary border border-border-subtle rounded-tl-none'
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

      {/* Input / Restriction Footer */}
      <div className="p-3 border-t border-border-subtle bg-bg-surface/50">
        {isViewer ? (
          <div className="flex items-center justify-center gap-2 p-2 rounded-lg bg-bg-elevated text-xs text-text-muted border border-border-subtle">
            <Lock size={14} />
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
              className="flex-1 bg-bg-elevated border border-border-subtle rounded-lg px-3 py-2 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-blue transition"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="px-3 py-2 rounded-lg bg-accent-blue hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed text-white transition flex items-center justify-center"
            >
              <Send size={14} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
