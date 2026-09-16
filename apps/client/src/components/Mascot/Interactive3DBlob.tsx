import React, { useEffect, useState, useRef } from 'react';

export type MascotState = 'idle' | 'typing' | 'password' | 'success' | 'error';
export type MascotEmotionState = MascotState;

interface Interactive3DBlobProps {
  state?: MascotState;
  size?: number;
  className?: string;
  showReactionBubble?: boolean;
}

const STATE_MESSAGES: Record<MascotState, string[]> = {
  idle: ["Hey there! I'm Zyncie 👋", "Ready to watch together?", "Hover around! I'm watching 👀"],
  typing: ["Ooh nice typing! ✍️", "Looking good...", "Keep going! ✨", "Almost set!"],
  password: ["I promise I'm not peeking! 🙈", "Top secret cipher! 🔒", "Eyes covered! 🫣"],
  success: ["Woohoo! You made it! 🎉", "Welcome to Zync! 🚀", "Let's party! 🍿"],
  error: ["Uh oh, let's fix that! 🥺", "Double check the details! 🔍", "You got this! 💪"]
};

export const Interactive3DBlob: React.FC<Interactive3DBlobProps> = ({
  state = 'idle',
  size = 220,
  className = '',
  showReactionBubble = true
}) => {
  const [blink, setBlink] = useState(false);
  const [pupilPos, setPupilPos] = useState({ x: 0, y: 0 });
  const [bubbleText, setBubbleText] = useState(STATE_MESSAGES.idle[0]);
  const blobRef = useRef<HTMLDivElement | null>(null);

  // Natural blinking effect
  useEffect(() => {
    if (state === 'password') return;
    const interval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 160);
    }, 3500 + Math.random() * 2500);
    return () => clearInterval(interval);
  }, [state]);

  // Reactive speech bubble text rotation
  useEffect(() => {
    const list = STATE_MESSAGES[state] || STATE_MESSAGES.idle;
    const randomMsg = list[Math.floor(Math.random() * list.length)];
    setBubbleText(randomMsg);
  }, [state]);

  // Smooth mouse-following tracking relative to the blob itself
  useEffect(() => {
    if (state === 'password') {
      setPupilPos({ x: 0, y: 0 });
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!blobRef.current) return;
      const rect = blobRef.current.getBoundingClientRect();
      const blobCenterX = rect.left + rect.width / 2;
      const blobCenterY = rect.top + rect.height / 2;

      const deltaX = e.clientX - blobCenterX;
      const deltaY = e.clientY - blobCenterY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const maxDistance = 18; // maximum pupil travel distance in SVG coordinate units

      const angle = Math.atan2(deltaY, deltaX);
      const travel = Math.min(maxDistance, distance * 0.035);

      setPupilPos({
        x: Math.cos(angle) * travel,
        y: Math.sin(angle) * travel
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [state]);

  const isPassword = state === 'password';
  const isSuccess = state === 'success';
  const isError = state === 'error';
  const isTyping = state === 'typing';

  return (
    <div
      ref={blobRef}
      className={`relative flex flex-col items-center justify-center select-none ${className}`}
      style={{ width: size, minHeight: size + 50 }}
    >
      {/* Dynamic Reactive Speech Bubble */}
      {showReactionBubble && (
        <div className="mb-3 px-3.5 py-1.5 rounded-2xl bg-white/[0.08] border border-white/15 backdrop-blur-xl text-xs font-semibold text-white shadow-[0_8px_20px_rgba(0,0,0,0.4)] animate-bounce text-center transition-all duration-300">
          <span>{bubbleText}</span>
        </div>
      )}

      {/* Volumetric Glowing Ambient Aura */}
      <div
        className="absolute rounded-full blur-[60px] opacity-60 transition-all duration-700 pointer-events-none"
        style={{
          width: size * 1.35,
          height: size * 1.35,
          background: isSuccess
            ? 'radial-gradient(circle, #10b981 0%, #059669 45%, transparent 70%)'
            : isError
            ? 'radial-gradient(circle, #f43f5e 0%, #e11d48 45%, transparent 70%)'
            : isPassword
            ? 'radial-gradient(circle, #f59e0b 0%, #8b5cf6 55%, transparent 75%)'
            : isTyping
            ? 'radial-gradient(circle, #38bdf8 0%, #2563eb 50%, transparent 75%)'
            : 'radial-gradient(circle, #818cf8 0%, #9333ea 50%, transparent 75%)'
        }}
      />

      {/* 3D Emotive Cloud-Blob SVG */}
      <div className="relative animate-float-slow transition-transform duration-300">
        <svg
          width={size}
          height={size}
          viewBox="0 0 240 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.6)]"
        >
          <defs>
            {/* 3D Volumetric Cloud Spherical Lighting */}
            <radialGradient id="cloudBody3D" cx="38%" cy="30%" r="68%">
              <stop offset="0%" stopColor="#80B5FE" />
              <stop offset="28%" stopColor="#437EFF" />
              <stop offset="65%" stopColor="#6C2DF5" />
              <stop offset="88%" stopColor="#3B0799" />
              <stop offset="100%" stopColor="#1B0452" />
            </radialGradient>

            {/* Specular Rim / Top Cloud Highlights */}
            <linearGradient id="cloudRimLight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
              <stop offset="35%" stopColor="#93C5FD" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#A855F7" stopOpacity="0" />
            </linearGradient>

            {/* Cute Ear / Antenna Gradients */}
            <radialGradient id="antennaGradLeft" cx="40%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#60A5FA" />
              <stop offset="70%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#1D4ED8" />
            </radialGradient>
            <radialGradient id="antennaGradRight" cx="40%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#C084FC" />
              <stop offset="70%" stopColor="#9333EA" />
              <stop offset="100%" stopColor="#581C87" />
            </radialGradient>

            {/* Rosy Cheek Blush */}
            <radialGradient id="cheekBlush" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#F43F5E" stopOpacity="0.6" />
              <stop offset="60%" stopColor="#FB7185" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#FDA4AF" stopOpacity="0" />
            </radialGradient>

            {/* Paw Gradients */}
            <radialGradient id="pawGrad" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#93C5FD" />
              <stop offset="50%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#1E3A8A" />
            </radialGradient>
          </defs>

          {/* Floating Orbiting Tiny Star Accent */}
          <g className="animate-spin-slow origin-center">
            <path
              d="M 205 50 L 208 58 L 216 60 L 209 66 L 211 74 L 204 70 L 197 74 L 199 66 L 192 60 L 200 58 Z"
              fill="#FBBF24"
              opacity="0.85"
            />
          </g>

          {/* Cute Cloud Antenna / Ear Bumps */}
          <ellipse cx="65" cy="52" rx="24" ry="28" fill="url(#antennaGradLeft)" transform="rotate(-15 65 52)" />
          <ellipse cx="175" cy="52" rx="24" ry="28" fill="url(#antennaGradRight)" transform="rotate(15 175 52)" />

          {/* MAIN 3D VOLUMETRIC CLOUD-BLOB BODY */}
          {/* Compound Organic Cloud Lobes */}
          <g>
            {/* Base cloud lobe - Left */}
            <circle cx="75" cy="140" r="48" fill="url(#cloudBody3D)" />
            {/* Base cloud lobe - Right */}
            <circle cx="165" cy="140" r="48" fill="url(#cloudBody3D)" />
            {/* Top cloud lobe - Center */}
            <circle cx="120" cy="95" r="54" fill="url(#cloudBody3D)" />
            {/* Center filling body */}
            <circle cx="120" cy="130" r="58" fill="url(#cloudBody3D)" />
          </g>

          {/* 3D Top Highlight Layer (Volumetric Specular Shading) */}
          <ellipse cx="120" cy="85" rx="46" ry="24" fill="url(#cloudRimLight)" />
          <ellipse cx="78" cy="120" rx="30" ry="16" fill="url(#cloudRimLight)" transform="rotate(-20 78 120)" />

          {/* ================================================================= */}
          {/* FACIAL FEATURES                                                   */}
          {/* ================================================================= */}

          {/* Cheeks Blush */}
          <circle cx="68" cy="146" r="15" fill="url(#cheekBlush)" />
          <circle cx="172" cy="146" r="15" fill="url(#cheekBlush)" />

          {/* EYES */}
          {isPassword ? (
            /* Covered Eyes or Mischievous Peeking Eyes */
            <g>
              <path d="M 80 126 Q 92 118 104 126" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
              <path d="M 136 126 Q 148 118 160 126" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
            </g>
          ) : isSuccess ? (
            /* Ecstatic Star/Joy Eyes */
            <g>
              <path d="M 78 130 Q 92 115 106 130" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" />
              <path d="M 134 130 Q 148 115 162 130" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" />
              {/* Sparkle over right eye */}
              <circle cx="150" cy="116" r="3" fill="#FBBF24" />
            </g>
          ) : isError ? (
            /* Cute Sad / Apologetic Droop Eyes */
            <g>
              <circle cx="92" cy="128" r="13" fill="#0F172A" />
              <circle cx="148" cy="128" r="13" fill="#0F172A" />
              <circle cx="92" cy="130" r="4" fill="#FFFFFF" />
              <circle cx="148" cy="130" r="4" fill="#FFFFFF" />
              {/* Worried brows */}
              <path d="M 80 114 Q 92 118 104 112" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
              <path d="M 136 112 Q 148 118 160 114" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
            </g>
          ) : (
            /* Natural Emotive Eyes with Dynamic Mouse Tracking Pupils */
            <g>
              {/* Left Eye Socket (White Sclera) */}
              <ellipse cx="92" cy="126" rx="17" ry={blink ? 2 : 20} fill="#FFFFFF" />
              {/* Right Eye Socket */}
              <ellipse cx="148" cy="126" rx="17" ry={blink ? 2 : 20} fill="#FFFFFF" />

              {!blink && (
                <>
                  {/* Left Pupil + Iris */}
                  <circle cx={92 + pupilPos.x} cy={126 + pupilPos.y} r="10.5" fill="#0B132B" />
                  <circle cx={90 + pupilPos.x} cy={124 + pupilPos.y} r="8.5" fill="#1D4ED8" />
                  <circle cx={89 + pupilPos.x} cy={122 + pupilPos.y} r="3.5" fill="#FFFFFF" />
                  <circle cx={95 + pupilPos.x} cy={129 + pupilPos.y} r="1.5" fill="#FFFFFF" />

                  {/* Right Pupil + Iris */}
                  <circle cx={148 + pupilPos.x} cy={126 + pupilPos.y} r="10.5" fill="#0B132B" />
                  <circle cx={146 + pupilPos.x} cy={124 + pupilPos.y} r="8.5" fill="#1D4ED8" />
                  <circle cx={145 + pupilPos.x} cy={122 + pupilPos.y} r="3.5" fill="#FFFFFF" />
                  <circle cx={151 + pupilPos.x} cy={129 + pupilPos.y} r="1.5" fill="#FFFFFF" />
                </>
              )}
            </g>
          )}

          {/* NOSE */}
          <ellipse cx="120" cy="138" rx="3.5" ry="2.5" fill="#3B82F6" opacity="0.6" />

          {/* MOUTH */}
          {isSuccess ? (
            /* Big Joyful Open Mouth */
            <path d="M 108 146 Q 120 166 132 146 Z" fill="#E11D48" stroke="#FFFFFF" strokeWidth="2" strokeLinejoin="round" />
          ) : isTyping ? (
            /* Curious 'O' Mouth */
            <ellipse cx="120" cy="150" rx="6" ry="7" fill="#E11D48" stroke="#FFFFFF" strokeWidth="2" />
          ) : isError ? (
            /* Wavy Apologetic Mouth */
            <path d="M 110 152 Q 115 147 120 151 Q 125 155 130 150" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" fill="none" />
          ) : (
            /* Sweet Cheerful Smile */
            <path d="M 110 146 Q 120 156 130 146" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          )}

          {/* PAWS: During Password, Paws cover the eyes! */}
          {isPassword && (
            <g className="transition-all duration-300">
              {/* Left Paw Covering Left Eye */}
              <g transform="translate(68, 108)">
                <ellipse cx="18" cy="18" rx="18" ry="14" fill="url(#pawGrad)" stroke="#60A5FA" strokeWidth="2" />
                <circle cx="10" cy="12" r="3" fill="#FFFFFF" opacity="0.5" />
                <circle cx="17" cy="9" r="3" fill="#FFFFFF" opacity="0.5" />
                <circle cx="24" cy="12" r="3" fill="#FFFFFF" opacity="0.5" />
              </g>

              {/* Right Paw Covering Right Eye */}
              <g transform="translate(136, 108)">
                <ellipse cx="18" cy="18" rx="18" ry="14" fill="url(#pawGrad)" stroke="#60A5FA" strokeWidth="2" />
                <circle cx="12" cy="12" r="3" fill="#FFFFFF" opacity="0.5" />
                <circle cx="19" cy="9" r="3" fill="#FFFFFF" opacity="0.5" />
                <circle cx="26" cy="12" r="3" fill="#FFFFFF" opacity="0.5" />
              </g>
            </g>
          )}
        </svg>
      </div>
    </div>
  );
};
