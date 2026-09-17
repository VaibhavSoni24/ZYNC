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
  volume?: number;
  isMuted?: boolean;
  onPlayerTimeUpdate?: (time: number, duration: number) => void;
}

export const YouTubePlayer: React.FC<YouTubePlayerProps> = ({
  videoId,
  playState,
  currentTime,
  volume = 80,
  isMuted = false,
  onPlayerTimeUpdate
}) => {
  const containerId = 'zync-youtube-iframe';
  const playerRef = useRef<any>(null);
  const isReadyRef = useRef<boolean>(false);
  const isProgrammaticRef = useRef<boolean>(false);

  const activeVideoId = videoId?.trim() || 'dQw4w9WgXcQ';

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
        try {
          playerRef.current.destroy();
        } catch {
          // ignore cleanup error
        }
        playerRef.current = null;
        isReadyRef.current = false;
      }
    };
  }, []);

  const initPlayer = () => {
    if (playerRef.current) return;

    playerRef.current = new window.YT.Player(containerId, {
      videoId: activeVideoId,
      playerVars: {
        autoplay: 0,
        controls: 0, // Strict: Hide native YouTube controls per Requirement 3
        disablekb: 1, // Disable keyboard controls on iframe
        modestbranding: 1,
        rel: 0,
        iv_load_policy: 3,
        fs: 0, // Custom fullscreen handled on container
        enablejsapi: 1,
        origin: window.location.origin
      },
      events: {
        onReady: (event: any) => {
          isReadyRef.current = true;
          const player = event.target;

          // Set initial volume & mute
          try {
            player.setVolume(volume);
            if (isMuted) {
              player.mute();
            } else {
              player.unMute();
            }
          } catch {
            // ignore
          }

          // Initial playback sync without broadcasting any actions to other users
          isProgrammaticRef.current = true;
          player.seekTo(currentTime, true);
          if (playState === 'playing') {
            player.playVideo();
          } else {
            player.pauseVideo();
          }
          setTimeout(() => {
            isProgrammaticRef.current = false;
          }, 800);
        },
        onStateChange: () => {
          // Video can ONLY be controlled via UI interface (Requirement 3 & 7).
          // Internal player state events are never forwarded back to the server to prevent pauses on join.
        }
      }
    });
  };

  // Synchronize videoId changes
  useEffect(() => {
    if (isReadyRef.current && playerRef.current) {
      const currentUrl = playerRef.current.getVideoUrl?.() || '';
      if (!currentUrl.includes(activeVideoId)) {
        isProgrammaticRef.current = true;
        playerRef.current.loadVideoById(activeVideoId);
        setTimeout(() => {
          isProgrammaticRef.current = false;
        }, 800);
      }
    }
  }, [activeVideoId]);

  // Synchronize play/pause and time drift from server
  useEffect(() => {
    if (!isReadyRef.current || !playerRef.current) return;

    const player = playerRef.current;
    const localTime = player.getCurrentTime?.() || 0;
    const drift = Math.abs(localTime - currentTime);

    // Re-align playhead if drift exceeds 1.2 seconds
    if (drift > 1.2) {
      isProgrammaticRef.current = true;
      player.seekTo(currentTime, true);
      setTimeout(() => {
        isProgrammaticRef.current = false;
      }, 400);
    }

    // Playback state alignment
    const state = player.getPlayerState?.();
    if (playState === 'playing' && state !== window.YT?.PlayerState?.PLAYING) {
      isProgrammaticRef.current = true;
      player.playVideo?.();
      setTimeout(() => {
        isProgrammaticRef.current = false;
      }, 400);
    } else if (playState === 'paused' && state === window.YT?.PlayerState?.PLAYING) {
      isProgrammaticRef.current = true;
      player.pauseVideo?.();
      setTimeout(() => {
        isProgrammaticRef.current = false;
      }, 400);
    }
  }, [playState, currentTime]);

  // Synchronize volume and mute
  useEffect(() => {
    if (isReadyRef.current && playerRef.current) {
      try {
        playerRef.current.setVolume(volume);
        if (isMuted) {
          playerRef.current.mute();
        } else {
          playerRef.current.unMute();
        }
      } catch {
        // ignore
      }
    }
  }, [volume, isMuted]);

  // High-frequency time ticker for smooth UI progress bar
  useEffect(() => {
    const interval = setInterval(() => {
      if (isReadyRef.current && playerRef.current && onPlayerTimeUpdate) {
        const time = playerRef.current.getCurrentTime?.() || 0;
        const total = playerRef.current.getDuration?.() || 0;
        onPlayerTimeUpdate(time, total);
      }
    }, 250);

    return () => clearInterval(interval);
  }, [onPlayerTimeUpdate]);

  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl border border-white/[0.08]">
      {/* YouTube Iframe Container */}
      <div id={containerId} className="w-full h-full pointer-events-none" />

      {/* Transparent Protective Shield (Enforcing UI-only playback control per Requirement 3) */}
      <div
        className="absolute inset-0 z-10 cursor-default select-none"
        title="Playback is controlled exclusively through the UI controls below"
      />
    </div>
  );
};
