import React, { useState } from 'react';
import { Play, Pause, Video, Lock, Send } from 'lucide-react';
import { Role } from '@zync/shared';
import { extractYouTubeVideoId } from '../../lib/youtubeHelper';

interface PlaybackControlsProps {
  playState: 'playing' | 'paused' | 'buffering';
  currentTime: number;
  duration: number;
  myRole: Role;
  canControl: boolean;
  onPlay: () => void;
  onPause: () => void;
  onSeek: (time: number) => void;
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
  myRole,
  canControl,
  onPlay,
  onPause,
  onSeek,
  onChangeVideo,
  onRequestControl
}) => {
  const [videoInput, setVideoInput] = useState('');
  const [hasRequested, setHasRequested] = useState(false);

  const handleVideoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoInput.trim()) return;
    const cleanId = extractYouTubeVideoId(videoInput.trim());
    onChangeVideo(cleanId);
    setVideoInput('');
  };

  const handleRequestClick = () => {
    onRequestControl();
    setHasRequested(true);
  };

  return (
    <div className="bg-bg-surface border border-border-subtle rounded-xl p-4 mt-3 space-y-4 shadow-lg">
      {/* Time Slider & Play/Pause */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          {canControl ? (
            <button
              onClick={playState === 'playing' ? onPause : onPlay}
              className="p-3 rounded-lg bg-accent-blue hover:bg-blue-600 text-white font-medium transition-all shadow-md active:scale-95 flex items-center justify-center"
              title={playState === 'playing' ? 'Pause' : 'Play'}
            >
              {playState === 'playing' ? <Pause size={20} /> : <Play size={20} className="translate-x-0.5" />}
            </button>
          ) : (
            <div
              className="p-3 rounded-lg bg-bg-elevated text-text-muted border border-border-subtle flex items-center justify-center cursor-not-allowed"
              title="Playback control restricted to Host and Moderator"
            >
              <Lock size={18} />
            </div>
          )}

          {/* Time Scrubber */}
          <div className="flex-1 flex items-center gap-3">
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              disabled={!canControl}
              onChange={(e) => canControl && onSeek(parseFloat(e.target.value))}
              className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-border-subtle accent-accent-blue ${
                !canControl ? 'cursor-not-allowed opacity-60' : ''
              }`}
            />
            <span className="text-xs font-mono text-text-muted whitespace-nowrap">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          {/* Participant Request Control CTA */}
          {myRole === Role.PARTICIPANT && !canControl && (
            <button
              onClick={handleRequestClick}
              disabled={hasRequested}
              className="text-xs px-3 py-2 rounded-lg bg-bg-elevated hover:bg-border-subtle text-accent-blue border border-accent-blue/30 font-medium transition flex items-center gap-1.5"
            >
              {hasRequested ? 'Request Sent' : 'Request Control'}
            </button>
          )}
        </div>
      </div>

      {/* Video URL change bar for Host / Moderator */}
      {canControl && (
        <form onSubmit={handleVideoSubmit} className="flex gap-2 pt-2 border-t border-border-subtle/50">
          <div className="relative flex-1">
            <Video size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Paste YouTube video link or ID (e.g. https://youtu.be/dQw4w9WgXcQ)..."
              value={videoInput}
              onChange={(e) => setVideoInput(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-bg-elevated border border-border-subtle rounded-lg text-sm text-text-primary placeholder:text-text-muted/60 focus:outline-none focus:border-accent-blue transition"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-bg-elevated hover:bg-border-subtle text-text-primary text-sm font-medium rounded-lg border border-border-subtle transition flex items-center gap-1.5"
          >
            <Send size={14} />
            <span>Change</span>
          </button>
        </form>
      )}
    </div>
  );
};
