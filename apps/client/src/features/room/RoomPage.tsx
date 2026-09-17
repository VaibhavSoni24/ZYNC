import React, { useEffect, useState, useRef } from 'react';
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
  const playerWrapperRef = useRef<HTMLDivElement>(null);

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
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

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

  // Fullscreen state listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleToggleFullscreen = () => {
    if (!playerWrapperRef.current) return;
    if (!document.fullscreenElement) {
      playerWrapperRef.current.requestFullscreen().catch((err) => {
        console.error('Failed to enter fullscreen:', err);
      });
    } else {
      document.exitFullscreen().catch((err) => {
        console.error('Failed to exit fullscreen:', err);
      });
    }
  };

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
      <div className="min-h-screen bg-[#06040a] flex items-center justify-center p-4">
        <div className="bg-[#0d0a14]/90 border border-red-500/30 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl backdrop-blur-2xl">
          <div className="w-14 h-14 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mx-auto mb-4 border border-red-500/20">
            <AlertCircle size={28} />
          </div>
          <h2 className="text-xl font-bold text-white">Removed From Room</h2>
          <p className="text-sm text-text-muted mt-2 mb-6">
            {kickedReason || 'You have been removed from this room by the host.'}
          </p>
          <button
            onClick={() => navigate('/home')}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple hover:opacity-95 text-white text-sm font-semibold transition cursor-pointer"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#06040a] text-white selection:bg-accent-blue/30 relative">
      {/* Ambient background glows */}
      <div className="pointer-events-none fixed -top-40 left-1/4 w-96 h-96 bg-accent-blue/10 rounded-full blur-[140px]" />
      <div className="pointer-events-none fixed top-1/3 -right-20 w-96 h-96 bg-accent-purple/10 rounded-full blur-[150px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-4 relative z-10">
        {/* Top Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-3.5 bg-[#0d0a14]/80 border border-white/[0.08] backdrop-blur-2xl rounded-2xl shadow-xl">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/home')}
              className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-text-muted hover:text-white transition cursor-pointer"
              title="Leave room"
            >
              <ArrowLeft size={16} />
            </button>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-base font-bold text-white tracking-tight">
                  {room?.name || 'Watch Party'}
                </h1>
                <span className="flex items-center gap-1.5 text-xs text-text-muted bg-white/[0.04] px-2.5 py-0.5 rounded-full border border-white/[0.08]">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isConnected ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)] animate-pulse' : 'bg-amber-400'
                    }`}
                  />
                  {isConnected ? 'Synced' : 'Connecting...'}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-text-muted mt-0.5">
                <span className="flex items-center gap-1">
                  <Globe size={12} /> {room?.language || 'English'}
                </span>
                <span>•</span>
                <span>Host: <strong className="text-white/80">{room?.hostUsername || 'Host'}</strong></span>
              </div>
            </div>
          </div>

          {/* Room Code Badge with Copy */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-white/[0.04] px-3.5 py-1.5 rounded-xl border border-white/[0.08]">
              <span className="text-xs text-text-muted">Code:</span>
              <span className="font-mono text-sm font-bold text-accent-blue tracking-wider">{code}</span>
              <button
                onClick={handleCopyCode}
                className="ml-1 text-text-muted hover:text-white transition cursor-pointer p-0.5"
                title="Copy room code"
              >
                {copiedCode ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              </button>
            </div>
          </div>
        </div>

        {/* Error banner if any */}
        {errorMessage && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs px-4 py-2.5 rounded-xl flex items-center justify-between backdrop-blur-lg">
            <span>{errorMessage}</span>
            <button onClick={clearError} className="font-bold ml-2 cursor-pointer">&times;</button>
          </div>
        )}

        {/* Main Grid: Video Player + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
          {/* Video & Playback Column (2 cols) */}
          <div className="lg:col-span-2 flex flex-col">
            {/* Player Wrapper element supporting Fullscreen */}
            <div
              ref={playerWrapperRef}
              className={`relative rounded-2xl overflow-hidden bg-black shadow-2xl ${
                isFullscreen ? 'w-screen h-screen flex items-center justify-center' : 'w-full'
              }`}
            >
              <YouTubePlayer
                videoId={videoId}
                playState={playState}
                currentTime={currentTime}
                volume={volume}
                isMuted={isMuted}
                onPlayerTimeUpdate={(t, d) => {
                  setLocalTime(t);
                  setDuration(d);
                }}
              />

              {/* YouTube Live stream Physics Floating Reactions */}
              <FloatingReactions reactions={activeReactions} />

              {/* Fullscreen Reactions Floating Pill - Visible at bottom-right in Fullscreen per Requirement 4 */}
              {isFullscreen && (
                <div className="absolute bottom-6 right-6 z-40 animate-fade-in">
                  <ReactionBar
                    myRole={myRole}
                    onSendReaction={(emoji) => emitReaction(emoji)}
                    compact
                  />
                </div>
              )}
            </div>

            {/* Custom Playback Controls */}
            <PlaybackControls
              playState={playState}
              currentTime={localTime}
              duration={duration}
              volume={volume}
              isMuted={isMuted}
              isFullscreen={isFullscreen}
              myRole={myRole}
              canControl={canControl}
              onPlay={() => emitPlay(localTime)}
              onPause={() => emitPause(localTime)}
              onSeek={(t) => emitSeek(t)}
              onVolumeChange={(val) => setVolume(val)}
              onToggleMute={() => setIsMuted(!isMuted)}
              onToggleFullscreen={handleToggleFullscreen}
              onChangeVideo={(vId) => emitChangeVideo(vId)}
              onRequestControl={() => emitRequestControl()}
            />
          </div>

          {/* Sidebar Column (1 col): Chat & Participants */}
          <div className="flex flex-col h-[590px]">
            {/* Tab Selector */}
            <div className="flex p-1 bg-[#0d0a14]/90 border border-white/[0.08] backdrop-blur-2xl rounded-2xl mb-2.5">
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex-1 py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition cursor-pointer ${
                  activeTab === 'chat'
                    ? 'bg-gradient-to-r from-accent-blue/20 to-accent-purple/20 text-white border border-white/[0.1] shadow-[0_0_12px_rgba(59,130,246,0.2)]'
                    : 'text-text-muted hover:text-white'
                }`}
              >
                <MessageSquare size={14} />
                <span>Chat</span>
              </button>
              <button
                onClick={() => setActiveTab('participants')}
                className={`flex-1 py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition cursor-pointer ${
                  activeTab === 'participants'
                    ? 'bg-gradient-to-r from-accent-blue/20 to-accent-purple/20 text-white border border-white/[0.1] shadow-[0_0_12px_rgba(59,130,246,0.2)]'
                    : 'text-text-muted hover:text-white'
                }`}
              >
                <Users size={14} />
                <span>Participants ({participants.length})</span>
              </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-hidden">
              {activeTab === 'chat' ? (
                <ChatPanel
                  messages={chatMessages}
                  myRole={myRole}
                  myUserId={user?.id || ''}
                  onSendMessage={(msg) => emitChat(msg)}
                  onSendReaction={(emoji) => emitReaction(emoji)}
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

        {/* Realtime Playback Control Request Dialogs for Host/Mods */}
        <ControlRequestModal
          requests={controlRequests}
          onRespond={(uId, approve) => emitRespondControl(uId, approve)}
        />
      </div>
    </div>
  );
};
