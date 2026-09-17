import React, { useState } from 'react';
import {
  Play,
  Pause,
  Video,
  Lock,
  Send,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Sparkles,
  Subtitles
} from 'lucide-react';
import { Role } from '@zync/shared';
import { extractYouTubeVideoId } from '../../lib/youtubeHelper';

interface PlaybackControlsProps {
  playState: 'playing' | 'paused' | 'buffering';
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isFullscreen: boolean;
  captionsEnabled: boolean;
  myRole: Role;
  canControl: boolean;
  onPlay: () => void;
  onPause: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (val: number) => void;
  onToggleMute: () => void;
  onToggleFullscreen: () => void;
  onToggleCaptions: () => void;
  onChangeVideo: (videoId: string) => void;
  onRequestControl: () => void;
}

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  playState,
  currentTime,
  duration,
  volume,
  isMuted,
  isFullscreen,
  captionsEnabled,
  myRole,
  canControl,
  onPlay,
  onPause,
  onSeek,
  onVolumeChange,
  onToggleMute,
  onToggleFullscreen,
  onToggleCaptions,
  onChangeVideo,
  onRequestControl
}) => {
  const [videoInput, setVideoInput] = useState('');
  const [hasRequested, setHasRequested] = useState(false);
  const [showChangeVideo, setShowChangeVideo] = useState(false);

  const handleVideoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoInput.trim()) return;
    const cleanId = extractYouTubeVideoId(videoInput.trim()) || 'dQw4w9WgXcQ';
    onChangeVideo(cleanId);
    setVideoInput('');
    setShowChangeVideo(false);
  };

  const handleRequestClick = () => {
    onRequestControl();
    setHasRequested(true);
  };

  const progressPercent = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  return (
    <div className="bg-[#0d0a14]/90 border border-white/[0.08] backdrop-blur-2xl rounded-2xl p-4 mt-3 space-y-3.5 shadow-xl">
      {/* Upper Bar: Play/Pause, Scrubber, Time, Volume, Fullscreen */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center gap-3">
          {/* Main Play / Pause Button */}
          {canControl ? (
            <button
              type="button"
              onClick={playState === 'playing' ? onPause : onPlay}
              className="w-11 h-11 rounded-xl bg-gradient-to-r from-accent-blue via-accent-purple to-cyan-500 hover:opacity-95 text-white font-bold transition-all shadow-[0_0_20px_rgba(59,130,246,0.35)] active:scale-95 flex items-center justify-center flex-shrink-0 cursor-pointer"
              title={playState === 'playing' ? 'Pause Stream (Host/Mod)' : 'Play Stream (Host/Mod)'}
            >
              {playState === 'playing' ? (
                <Pause size={20} />
              ) : (
                <Play size={20} className="translate-x-0.5" />
              )}
            </button>
          ) : (
            <div
              className="w-11 h-11 rounded-xl bg-white/[0.04] text-text-muted border border-white/[0.06] flex items-center justify-center flex-shrink-0 cursor-not-allowed"
              title="Playback is managed by the Host & Moderators"
            >
              <Lock size={18} />
            </div>
          )}

          {/* Scrubber Track */}
          <div className="flex-1 flex flex-col justify-center gap-1.5 min-w-0">
            <div className="relative flex items-center group">
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                disabled={!canControl}
                onChange={(e) => canControl && onSeek(parseFloat(e.target.value))}
                className={`w-full h-2 rounded-lg appearance-none cursor-pointer bg-white/[0.08] accent-accent-blue focus:outline-none transition-all ${!canControl ? 'cursor-not-allowed opacity-60' : ''
                  }`}
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #9333ea ${progressPercent}%, rgba(255,255,255,0.08) ${progressPercent}%, rgba(255,255,255,0.08) 100%)`
                }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono text-text-muted px-0.5">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Volume Control */}
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <button
              type="button"
              onClick={onToggleMute}
              className="text-text-muted hover:text-white transition p-1"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
            <input
              type="range"
              min={0}
              max={100}
              value={isMuted ? 0 : volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              className="w-16 h-1.5 rounded-lg appearance-none cursor-pointer bg-white/[0.1] accent-accent-blue"
            />
          </div>

          {/* Captions Toggle Button - Controlled by Host & Moderator */}
          <button
            type="button"
            onClick={canControl ? onToggleCaptions : undefined}
            disabled={!canControl}
            className={`p-2.5 rounded-xl border transition flex items-center justify-center flex-shrink-0 cursor-pointer ${
              !canControl
                ? 'opacity-40 cursor-not-allowed border-white/[0.06] bg-white/[0.02] text-text-muted'
                : captionsEnabled
                ? 'bg-accent-blue/20 border-accent-blue/50 text-accent-blue shadow-[0_0_12px_rgba(59,130,246,0.3)]'
                : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/[0.08] text-text-muted hover:text-white'
            }`}
            title={
              !canControl
                ? 'Captions are controlled by the Host & Moderators'
                : captionsEnabled
                ? 'Turn Off Captions (Host/Mod)'
                : 'Turn On Captions (Host/Mod)'
            }
          >
            <Subtitles size={17} />
          </button>

          {/* Request Control Button for Participants */}
          {myRole === Role.PARTICIPANT && !canControl && (
            <button
              type="button"
              onClick={handleRequestClick}
              disabled={hasRequested}
              className="text-xs px-3 py-2 rounded-xl bg-accent-blue/15 hover:bg-accent-blue/25 text-accent-blue border border-accent-blue/30 font-semibold transition flex items-center gap-1.5 flex-shrink-0 disabled:opacity-40"
            >
              <Sparkles size={13} />
              <span>{hasRequested ? 'Requested' : 'Request Control'}</span>
            </button>
          )}

          {/* Host Change Video Toggle Button */}
          {canControl && (
            <button
              type="button"
              onClick={() => setShowChangeVideo(!showChangeVideo)}
              className={`text-xs px-3 py-2 rounded-xl border font-semibold transition flex items-center gap-1.5 flex-shrink-0 ${showChangeVideo
                  ? 'bg-accent-purple/25 border-accent-purple/50 text-white'
                  : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/[0.08] text-text-muted hover:text-white'
                }`}
              title="Change playing YouTube video"
            >
              <Video size={14} />
              <span className="hidden md:inline">Change Video</span>
            </button>
          )}

          {/* Fullscreen Button */}
          <button
            type="button"
            onClick={onToggleFullscreen}
            className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-text-muted hover:text-white transition flex items-center justify-center flex-shrink-0"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize size={17} /> : <Maximize size={17} />}
          </button>
        </div>
      </div>

      {/* Expandable Video URL change bar for Host / Moderator */}
      {canControl && showChangeVideo && (
        <form
          onSubmit={handleVideoSubmit}
          className="flex flex-col sm:flex-row gap-2 pt-3 border-t border-white/[0.06] animate-fade-in"
        >
          <div className="relative flex-1">
            <Video size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Paste YouTube link"
              value={videoInput}
              onChange={(e) => setVideoInput(e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-white/[0.03] border border-white/[0.08] rounded-xl text-xs sm:text-sm text-white placeholder:text-text-muted/50 focus:outline-none focus:border-accent-blue transition"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-gradient-to-r from-accent-blue to-accent-purple hover:opacity-95 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
          >
            <Send size={13} />
            <span>Load Video</span>
          </button>
        </form>
      )}
    </div>
  );
};

