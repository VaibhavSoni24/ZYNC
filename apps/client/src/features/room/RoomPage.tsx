import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Copy, Check, Users, MessageSquare, ArrowLeft, Globe, AlertCircle } from 'lucide-react';
import { Role } from '@zync/shared';
import { useRoomStore } from '../../store/useRoomStore';
import { useAuthStore } from '../../store/useAuthStore';
import { YouTubePlayer } from './YouTubePlayer';
import { PlaybackControls } from './PlaybackControls';
import { ParticipantList } from './ParticipantList';
import { ChatPanel } from './ChatPanel';
import { ReactionBar, FloatingReactions } from './ReactionBar';
import { ControlRequestModal } from './ControlRequestModal';

export const RoomPage: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const {
    room,
    myRole,
    participants,
    playState,
    currentTime,
    videoId,
    chatMessages,
    activeReactions,
    controlRequests,
    isConnected,
    isKicked,
    kickedReason,
    errorMessage,
    clearError,
    joinRoom,
    leaveRoom,
    emitPlay,
    emitPause,
    emitSeek,
    emitChangeVideo,
    emitAssignRole,
    emitRemoveParticipant,
    emitTransferHost,
    emitRequestControl,
    emitRespondControl,
    emitChat,
    emitReaction
  } = useRoomStore();

  const [activeTab, setActiveTab] = useState<'chat' | 'participants'>('chat');
  const [copiedCode, setCopiedCode] = useState(false);
  const [localTime, setLocalTime] = useState(currentTime);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!code) {
      navigate('/home');
      return;
    }

    const currentUser = user || {
      id: 'guest_' + Math.random().toString(36).substring(2, 8),
      username: 'Guest',
      avatar: 'Comet'
    };

    joinRoom(code, currentUser);

    return () => {
      leaveRoom();
    };
  }, [code, user]);

  const handleCopyCode = () => {
    if (code) {
      navigator.clipboard.writeText(code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const canControl = myRole === Role.HOST || myRole === Role.MODERATOR;

  if (isKicked) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="bg-bg-surface border border-red-500/30 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
          <div className="w-14 h-14 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={28} />
          </div>
          <h2 className="text-xl font-bold text-text-primary">Removed From Room</h2>
          <p className="text-sm text-text-muted mt-2 mb-6">
            {kickedReason || 'You have been removed from this room by the host.'}
          </p>
          <button
            onClick={() => navigate('/home')}
            className="w-full py-2.5 px-4 rounded-lg bg-accent-blue hover:bg-blue-600 text-white text-sm font-semibold transition"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-3.5 bg-bg-surface border border-border-subtle rounded-xl shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/home')}
            className="p-2 rounded-lg bg-bg-elevated hover:bg-border-subtle text-text-muted hover:text-text-primary transition"
            title="Leave room"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-text-primary tracking-tight">
                {room?.name || 'Watch Party'}
              </h1>
              <span className="flex items-center gap-1.5 text-xs text-text-muted bg-bg-elevated px-2 py-0.5 rounded-full border border-border-subtle">
                <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                {isConnected ? 'Synced' : 'Connecting...'}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-text-muted mt-0.5">
              <span className="flex items-center gap-1">
                <Globe size={12} /> {room?.language || 'English'}
              </span>
              <span>•</span>
              <span>Host: {room?.hostUsername || 'Host'}</span>
            </div>
          </div>
        </div>

        {/* Room Code Badge with Copy */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-bg-elevated px-3 py-1.5 rounded-lg border border-border-subtle">
            <span className="text-xs text-text-muted">Code:</span>
            <span className="font-mono text-sm font-bold text-accent-blue tracking-wider">{code}</span>
            <button
              onClick={handleCopyCode}
              className="ml-1 text-text-muted hover:text-text-primary transition"
              title="Copy room code"
            >
              {copiedCode ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            </button>
          </div>
        </div>
      </div>

      {/* Error banner if any */}
      {errorMessage && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs px-4 py-2.5 rounded-lg flex items-center justify-between">
          <span>{errorMessage}</span>
          <button onClick={clearError} className="font-bold ml-2">&times;</button>
        </div>
      )}

      {/* Main Grid: Video Player + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Video & Playback Column (2 cols) */}
        <div className="lg:col-span-2 flex flex-col relative">
          <div className="relative">
            <YouTubePlayer
              videoId={videoId}
              playState={playState}
              currentTime={currentTime}
              canControl={canControl}
              onPlayerTimeUpdate={(t, d) => {
                setLocalTime(t);
                setDuration(d);
              }}
              onPlayAction={(t) => emitPlay(t)}
              onPauseAction={(t) => emitPause(t)}
            />
            {/* Floating Reactions Stream */}
            <FloatingReactions reactions={activeReactions} />
          </div>

          {/* Controls */}
          <PlaybackControls
            playState={playState}
            currentTime={localTime}
            duration={duration}
            myRole={myRole}
            canControl={canControl}
            onPlay={() => emitPlay(localTime)}
            onPause={() => emitPause(localTime)}
            onSeek={(t) => emitSeek(t)}
            onChangeVideo={(vId) => emitChangeVideo(vId)}
            onRequestControl={() => emitRequestControl()}
          />

          {/* Emoji Reaction Bar */}
          <div className="mt-3 flex justify-end">
            <ReactionBar myRole={myRole} onSendReaction={(emoji) => emitReaction(emoji)} />
          </div>
        </div>

        {/* Sidebar Column (1 col): Chat & Participants */}
        <div className="flex flex-col h-[580px]">
          {/* Tab Selector */}
          <div className="flex border-b border-border-subtle bg-bg-surface rounded-t-xl overflow-hidden">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-2.5 text-xs font-semibold flex items-center justify-center gap-2 border-b-2 transition ${
                activeTab === 'chat'
                  ? 'border-accent-blue text-accent-blue bg-bg-elevated/40'
                  : 'border-transparent text-text-muted hover:text-text-primary'
              }`}
            >
              <MessageSquare size={14} />
              <span>Chat</span>
            </button>
            <button
              onClick={() => setActiveTab('participants')}
              className={`flex-1 py-2.5 text-xs font-semibold flex items-center justify-center gap-2 border-b-2 transition ${
                activeTab === 'participants'
                  ? 'border-accent-blue text-accent-blue bg-bg-elevated/40'
                  : 'border-transparent text-text-muted hover:text-text-primary'
              }`}
            >
              <Users size={14} />
              <span>Participants ({participants.length})</span>
            </button>
          </div>

          <div className="flex-1 overflow-hidden">
            {activeTab === 'chat' ? (
              <ChatPanel
                messages={chatMessages}
                myRole={myRole}
                myUserId={user?.id || ''}
                onSendMessage={(msg) => emitChat(msg)}
              />
            ) : (
              <ParticipantList
                participants={participants}
                myUserId={user?.id || ''}
                myRole={myRole}
                onAssignRole={(uId, r) => emitAssignRole(uId, r)}
                onRemoveParticipant={(uId) => emitRemoveParticipant(uId)}
                onTransferHost={(uId) => emitTransferHost(uId)}
              />
            )}
          </div>
        </div>
      </div>

      {/* Control Request Realtime Popups */}
      <ControlRequestModal
        requests={controlRequests}
        onRespond={(uId, approve) => emitRespondControl(uId, approve)}
      />
    </div>
  );
};
