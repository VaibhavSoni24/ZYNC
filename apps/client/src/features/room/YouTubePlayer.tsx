import React, { useEffect, useRef } from 'react';
import { PlayState } from '@zync/shared';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface YouTubePlayerProps {
  videoId: string;
  playState: PlayState;
  currentTime: number;
  canControl: boolean;
  onPlayerTimeUpdate?: (time: number, duration: number) => void;
  onPlayAction?: (time: number) => void;
  onPauseAction?: (time: number) => void;
}

export const YouTubePlayer: React.FC<YouTubePlayerProps> = ({
  videoId,
  playState,
  currentTime,
  canControl,
  onPlayerTimeUpdate,
  onPlayAction,
  onPauseAction
}) => {
  const containerId = 'zync-youtube-iframe';
  const playerRef = useRef<any>(null);
  const isReadyRef = useRef<boolean>(false);
  const isProgrammaticRef = useRef<boolean>(false);

  // Load YouTube IFrame API Script
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        initPlayer();
      };
    } else if (window.YT && window.YT.Player) {
      initPlayer();
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
        isReadyRef.current = false;
      }
    };
  }, []);

  const initPlayer = () => {
    if (playerRef.current) return;

    playerRef.current = new window.YT.Player(containerId, {
      videoId,
      playerVars: {
        autoplay: 0,
        controls: 1, // allow native volume / captions / controls
        rel: 0,
        modestbranding: 1,
        enablejsapi: 1,
        origin: window.location.origin
      },
      events: {
        onReady: (event: any) => {
          isReadyRef.current = true;

          // Initial sync
          isProgrammaticRef.current = true;
          event.target.seekTo(currentTime, true);
          if (playState === 'playing') {
            event.target.playVideo();
          } else {
            event.target.pauseVideo();
          }
          setTimeout(() => {
            isProgrammaticRef.current = false;
          }, 600);
        },
        onStateChange: (event: any) => {
          if (!isReadyRef.current || isProgrammaticRef.current) return;

          // YT.PlayerState.PLAYING = 1, PAUSED = 2
          const player = event.target;
          const time = player.getCurrentTime();

          if (event.data === window.YT.PlayerState.PLAYING) {
            if (canControl && onPlayAction) {
              onPlayAction(time);
            } else if (!canControl && playState === 'paused') {
              // Revert unauthorized local action
              isProgrammaticRef.current = true;
              player.pauseVideo();
              setTimeout(() => { isProgrammaticRef.current = false; }, 300);
            }
          } else if (event.data === window.YT.PlayerState.PAUSED) {
            if (canControl && onPauseAction) {
              onPauseAction(time);
            } else if (!canControl && playState === 'playing') {
              // Revert unauthorized local action
              isProgrammaticRef.current = true;
              player.playVideo();
              setTimeout(() => { isProgrammaticRef.current = false; }, 300);
            }
          }
        }
      }
    });
  };

  // Synchronize videoId changes
  useEffect(() => {
    if (isReadyRef.current && playerRef.current) {
      const currentUrl = playerRef.current.getVideoUrl?.() || '';
      if (!currentUrl.includes(videoId)) {
        isProgrammaticRef.current = true;
        playerRef.current.loadVideoById(videoId);
        setTimeout(() => {
          isProgrammaticRef.current = false;
        }, 800);
      }
    }
  }, [videoId]);

  // Synchronize play/pause and time sync from server
  useEffect(() => {
    if (!isReadyRef.current || !playerRef.current) return;

    const player = playerRef.current;
    const localTime = player.getCurrentTime?.() || 0;
    const drift = Math.abs(localTime - currentTime);

    // If drift exceeds 1.5 seconds, re-align playhead
    if (drift > 1.5) {
      isProgrammaticRef.current = true;
      player.seekTo(currentTime, true);
      setTimeout(() => { isProgrammaticRef.current = false; }, 400);
    }

    // Playback state alignment
    const state = player.getPlayerState?.();
    if (playState === 'playing' && state !== window.YT?.PlayerState?.PLAYING) {
      isProgrammaticRef.current = true;
      player.playVideo?.();
      setTimeout(() => { isProgrammaticRef.current = false; }, 400);
    } else if (playState === 'paused' && state === window.YT?.PlayerState?.PLAYING) {
      isProgrammaticRef.current = true;
      player.pauseVideo?.();
      setTimeout(() => { isProgrammaticRef.current = false; }, 400);
    }
  }, [playState, currentTime]);

  // Time ticker for UI slider
  useEffect(() => {
    const interval = setInterval(() => {
      if (isReadyRef.current && playerRef.current && onPlayerTimeUpdate) {
        const time = playerRef.current.getCurrentTime() || 0;
        const total = playerRef.current.getDuration() || 0;
        onPlayerTimeUpdate(time, total);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [onPlayerTimeUpdate]);

  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black shadow-2xl border border-border-subtle">
      <div id={containerId} className="w-full h-full" />
    </div>
  );
};
