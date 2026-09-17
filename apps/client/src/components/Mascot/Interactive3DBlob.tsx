import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useAnimationControls } from 'framer-motion';

export type MascotState = 'idle' | 'typing' | 'password' | 'success' | 'error' | 'yawn' | 'pet';
export type MascotEmotionState = MascotState;

interface Interactive3DBlobProps {
  state?: MascotState;
  size?: number;
  className?: string;
  showReactionBubble?: boolean;
  onStateChange?: (state: MascotState) => void;
}

const STATE_MESSAGES: Record<MascotState, string[]> = {
  idle: ["Hey there! I'm Zyncie ☁️", "Ready to watch together?", "Hover around! I'm watching 👀", "Your watch party buddy! ✨"],
  typing: ["Ooh nice typing! ✍️", "Looking good...", "Keep going! ✨", "Almost set!"],
  password: ["I promise I'm not peeking! 🙈", "Top secret cipher! 🔒", "Eyes closed tight! ✨"],
  success: ["Woohoo! You made it! 🎉", "Welcome to Zync! 🚀", "Let's party! 🍿"],
  error: ["Uh oh, let's fix that! 🥺", "Double check the details! 🔍", "You got this! 💪"],
  yawn: ["Where are you? 🥱", "Just do it already! 😴", "Still there? *yawns* ☁️", "I'm getting sleepy... 💤"],
  pet: [
    "Hehe, thank you for the pats! 🥰",
    "Aww that feels so nice! ✨",
    "Yay headpats! *purrs happily* ☁️",
    "Thank you! You're the best! ❤️",
    "Mmm so fluffy! Love the pats! 💖",
    "Hehe, that tickles! Thank you! 🌸"
  ]
};

interface PetParticle {
  id: number;
  x: number;
  y: number;
  icon: string;
  size: number;
}

export const Interactive3DBlob: React.FC<Interactive3DBlobProps> = ({
  state: externalState = 'idle',
  size = 290,
  className = '',
  showReactionBubble = true
}) => {
  const [internalState, setInternalState] = useState<MascotState>(externalState);
  const [blink, setBlink] = useState(false);
  const [pupilPos, setPupilPos] = useState({ x: 0, y: 0 });
  const [bubbleText, setBubbleText] = useState(STATE_MESSAGES.idle[0]);
  const [particles, setParticles] = useState<PetParticle[]>([]);

  const squishControls = useAnimationControls();
  const lastBubbleTime = useRef(0);
  const blobRef = useRef<HTMLDivElement | null>(null);
  const targetPupil = useRef({ x: 0, y: 0 });
  const currentPupil = useRef({ x: 0, y: 0 });
  const animFrameId = useRef<number | null>(null);
  const lastActiveTime = useRef(Date.now());
  const petTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync external state changes: form interactions (typing, password, etc.) immediately override pet state!
  useEffect(() => {
    if (externalState !== 'idle') {
      if (petTimerRef.current) {
        clearTimeout(petTimerRef.current);
        petTimerRef.current = null;
      }
      setInternalState(externalState);
    } else {
      setInternalState(prev => (prev === 'pet' ? 'pet' : 'idle'));
    }
    lastActiveTime.current = Date.now();
  }, [externalState]);

  // Clean up pet timer on unmount
  useEffect(() => {
    return () => {
      if (petTimerRef.current) clearTimeout(petTimerRef.current);
    };
  }, []);

  const activeState = internalState;

  // Inactivity detection -> Yawning reaction after ~45 seconds of no activity
  useEffect(() => {
    const resetTimer = () => {
      lastActiveTime.current = Date.now();
      setInternalState(prev => (prev === 'yawn' ? 'idle' : prev));
    };

    const interval = setInterval(() => {
      // Only yawn if currently in idle state and no activity for > 45 seconds
      if (externalState === 'idle') {
        const elapsed = Date.now() - lastActiveTime.current;
        if (elapsed >= 45000) {
          setInternalState(prev => (prev === 'idle' ? 'yawn' : prev));
        }
      }
    }, 3000);

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    window.addEventListener('click', resetTimer);
    window.addEventListener('scroll', resetTimer);

    return () => {
      clearInterval(interval);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      window.removeEventListener('click', resetTimer);
      window.removeEventListener('scroll', resetTimer);
    };
  }, [externalState]);

  // Natural blinking effect (except during password, yawn, or pet)
  useEffect(() => {
    if (activeState === 'password' || activeState === 'yawn' || activeState === 'pet') return;
    const interval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 170);
    }, 3200 + Math.random() * 2600);
    return () => clearInterval(interval);
  }, [activeState]);

  // Reactive speech bubble text rotation
  useEffect(() => {
    const list = STATE_MESSAGES[activeState] || STATE_MESSAGES.idle;
    const randomMsg = list[Math.floor(Math.random() * list.length)];
    setBubbleText(randomMsg);
  }, [activeState]);

  // Smooth lerp pupil tracking using requestAnimationFrame
  useEffect(() => {
    if (activeState === 'password' || activeState === 'yawn' || activeState === 'pet') {
      targetPupil.current = { x: 0, y: 0 };
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (activeState === 'password' || activeState === 'yawn' || activeState === 'pet') return;
      if (!blobRef.current) return;

      const rect = blobRef.current.getBoundingClientRect();
      const blobCenterX = rect.left + rect.width / 2;
      const blobCenterY = rect.top + rect.height * 0.45;

      const deltaX = e.clientX - blobCenterX;
      const deltaY = e.clientY - blobCenterY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const maxDistance = 11; // maximum pupil movement in SVG units

      const angle = Math.atan2(deltaY, deltaX);
      const travel = Math.min(maxDistance, distance * 0.022);

      targetPupil.current = {
        x: Math.cos(angle) * travel,
        y: Math.sin(angle) * travel
      };
    };

    // Smooth animation loop
    const updatePupilPhysics = () => {
      const lerpFactor = 0.12;
      currentPupil.current.x += (targetPupil.current.x - currentPupil.current.x) * lerpFactor;
      currentPupil.current.y += (targetPupil.current.y - currentPupil.current.y) * lerpFactor;

      setPupilPos({
        x: currentPupil.current.x,
        y: currentPupil.current.y
      });

      animFrameId.current = requestAnimationFrame(updatePupilPhysics);
    };

    window.addEventListener('mousemove', handleMouseMove);
    animFrameId.current = requestAnimationFrame(updatePupilPhysics);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [activeState]);

  // Handle head-pat / petting click interaction
  const handlePet = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    lastActiveTime.current = Date.now();
    setInternalState('pet');

    // Smooth head-pat squish physics on the existing element - zero lag, no unmounting!
    squishControls.start({
      scaleY: [0.89, 1.05, 0.98, 1],
      scaleX: [1.07, 0.96, 1.02, 1],
      y: [5, -2, 1, 0],
      transition: { duration: 0.4, ease: 'easeOut' }
    });

    // Pick a cute appreciation message (throttled to avoid stuttering on spam click)
    const now = Date.now();
    if (now - lastBubbleTime.current > 1200) {
      lastBubbleTime.current = now;
      const petMsgs = STATE_MESSAGES.pet;
      const randomMsg = petMsgs[Math.floor(Math.random() * petMsgs.length)];
      setBubbleText(randomMsg);
    }

    // Spawn floating cute particles (capped so spamming doesn't lag)
    const icons = ['❤️', '💖', '✨', '🥰', '💕', '☁️'];
    const newParticles: PetParticle[] = [
      {
        id: now + Math.random(),
        x: (Math.random() - 0.5) * 100,
        y: -10 - Math.random() * 15,
        icon: icons[Math.floor(Math.random() * icons.length)],
        size: 18 + Math.floor(Math.random() * 8)
      },
      {
        id: now + Math.random() + 1,
        x: (Math.random() - 0.5) * 100,
        y: -10 - Math.random() * 15,
        icon: icons[Math.floor(Math.random() * icons.length)],
        size: 18 + Math.floor(Math.random() * 8)
      }
    ];

    setParticles(prev => [...prev.slice(-6), ...newParticles]);

    // Reset pet timer (lasts 4.5 seconds before smoothly returning to externalState)
    if (petTimerRef.current) clearTimeout(petTimerRef.current);
    petTimerRef.current = setTimeout(() => {
      setInternalState(externalState);
    }, 4500);
  };

  const isPassword = activeState === 'password';
  const isSuccess = activeState === 'success';
  const isError = activeState === 'error';
  const isTyping = activeState === 'typing';
  const isYawn = activeState === 'yawn';
  const isPet = activeState === 'pet';

  return (
    <div
      ref={blobRef}
      className={`relative flex flex-col items-center justify-center select-none ${className}`}
      style={{ width: size, minHeight: size * 0.85 + 50 }}
    >
      {/* Dynamic Reactive Speech Bubble with smooth fade-in and exit */}
      {showReactionBubble && (
        <div className="h-9 flex items-center justify-center mb-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={bubbleText}
              initial={{ opacity: 0, y: 8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.9 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className={`px-4 py-1.5 rounded-full border backdrop-blur-xl text-xs font-medium shadow-[0_8px_25px_rgba(0,0,0,0.5)] flex items-center gap-1.5 text-center transition-all duration-300 ${
                isPet
                  ? 'bg-rose-500/25 border-rose-400/50 text-rose-100 shadow-[0_8px_25px_rgba(244,63,94,0.35)]'
                  : 'bg-white/[0.09] border-white/20 text-white'
              }`}
            >
              <span>{bubbleText}</span>
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* Floating Petting Heart & Sparkle Particles */}
      <div className="absolute top-1/4 pointer-events-none z-30 select-none">
        <AnimatePresence>
          {particles.map(p => (
            <motion.span
              key={p.id}
              initial={{ opacity: 0, scale: 0.4, x: p.x, y: p.y }}
              animate={{
                opacity: [0, 1, 1, 0],
                y: p.y - 75,
                x: p.x + (Math.random() - 0.5) * 35,
                scale: [0.5, 1.25, 1.1, 0.7],
                rotate: [-8, 8, -4]
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.6, ease: 'easeOut' }}
              onAnimationComplete={() => {
                setParticles(prev => prev.filter(item => item.id !== p.id));
              }}
              style={{ fontSize: p.size }}
              className="absolute filter drop-shadow-[0_2px_8px_rgba(244,63,94,0.6)]"
            >
              {p.icon}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>

      {/* Floating Sleep Zzz particles when yawning */}
      <AnimatePresence>
        {isYawn && (
          <div className="absolute -top-4 right-10 pointer-events-none z-30">
            <motion.span
              initial={{ opacity: 0, y: 10, scale: 0.6 }}
              animate={{ opacity: [0, 1, 0], y: -30, x: [0, 8, 16], scale: 1.2 }}
              transition={{ repeat: Infinity, duration: 2.2, ease: 'easeOut' }}
              className="absolute text-sm font-bold text-cyan-300 font-mono"
            >
              z
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 10, scale: 0.6 }}
              animate={{ opacity: [0, 1, 0], y: -45, x: [0, 14, 28], scale: 1.5 }}
              transition={{ repeat: Infinity, duration: 2.6, delay: 0.5, ease: 'easeOut' }}
              className="absolute text-base font-extrabold text-indigo-300 font-mono"
            >
              Z
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 10, scale: 0.6 }}
              animate={{ opacity: [0, 1, 0], y: -60, x: [0, 20, 36], scale: 1.8 }}
              transition={{ repeat: Infinity, duration: 3.0, delay: 1.1, ease: 'easeOut' }}
              className="absolute text-lg font-black text-purple-300 font-mono"
            >
              Z
            </motion.span>
          </div>
        )}
      </AnimatePresence>

      {/* Volumetric Glowing Ambient Aura behind the Cloud with synchronized breathing */}
      <motion.div
        animate={{
          scale: isPet ? [1.08, 0.98, 1.08] : [1.03, 0.94, 1.03],
          opacity: isPet ? [0.65, 0.45, 0.65] : [0.45, 0.32, 0.45]
        }}
        transition={{
          duration: isPet ? 2.5 : isYawn ? 5.0 : 4.2,
          repeat: Infinity,
          repeatType: 'loop',
          ease: 'easeInOut',
          times: [0, 0.5, 1]
        }}
        className="absolute rounded-full blur-[70px] pointer-events-none transition-colors duration-500"
        style={{
          width: size * 0.9,
          height: size * 0.6,
          backgroundColor: isPet
            ? '#F43F5E'
            : isSuccess
            ? '#10B981'
            : isError
            ? '#EF4444'
            : isPassword
            ? '#F59E0B'
            : isTyping
            ? '#3B82F6'
            : isYawn
            ? '#818CF8'
            : '#6366F1'
        }}
      />

      {/* ================================================================= */}
      {/* OUTER INTERACTIVE WRAPPER: Handles Hover & Tap with Spring Physics */}
      {/* Separating hover from the inner looping animation eliminates      */}
      {/* any snapping or abrupt transitions when hover is removed.         */}
      {/* ================================================================= */}
      <motion.div
        whileHover={{
          scale: 1.07,
          transition: { type: 'spring', stiffness: 320, damping: 22 }
        }}
        whileTap={{
          scale: 0.94,
          transition: { type: 'spring', stiffness: 450, damping: 20 }
        }}
        transition={{
          type: 'spring',
          stiffness: 320,
          damping: 22
        }}
        onClick={handlePet}
        className="relative z-10 cursor-pointer drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)] select-none"
        title="Click to pet me! ☁️"
      >
        {/* INNER FLOATING & BREATHING LOOP CONTAINER */}
        <motion.div
          animate={{
            y: isYawn ? [0, -4, 0] : isPet ? [0, -6, 0] : [0, -8, 0],
            scale: isYawn ? [1.02, 0.96, 1.02] : [1.02, 0.96, 1.02],
            rotate: isYawn ? [0, -0.6, 0.6, 0] : isPet ? [0, 1.5, -1.5, 0] : [0, 0.8, -0.8, 0]
          }}
          transition={{
            duration: isPet ? 2.6 : isYawn ? 5.0 : 4.2,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'easeInOut',
            times: [0, 0.5, 1]
          }}
        >
          {/* SQUISH & BOUNCE HEAD-PAT DEFORMATION (Continuous in-place physics, no unmounting) */}
          <motion.div
            animate={squishControls}
            style={{ transformOrigin: 'center bottom' }}
          >
            <svg
              viewBox="0 0 260 180"
              className="w-full h-auto overflow-visible"
              style={{ width: size, height: size * 0.69 }}
            >
              <defs>
                {/* Soft volumetric pure white cloud shading */}
                <radialGradient id="cloudWhiteRadial" cx="50%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="65%" stopColor="#F8FAFC" />
                  <stop offset="88%" stopColor="#EEF2F6" />
                  <stop offset="100%" stopColor="#E2E8F0" />
                </radialGradient>

                {/* Specular Rim Light along top contours */}
                <linearGradient id="cloudTopGlint" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
                  <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                </linearGradient>

                {/* Soft celestial shadow for lower cloud belly */}
                <linearGradient id="cloudBellyShadow" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#E2E8F0" stopOpacity="0" />
                  <stop offset="100%" stopColor="#CBD5E1" stopOpacity="0.5" />
                </linearGradient>

                {/* Rosy cheek blush */}
                <radialGradient id="dreamCheekBlush" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FB7185" stopOpacity="0.65" />
                  <stop offset="70%" stopColor="#FDA4AF" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#FDA4AF" stopOpacity="0.1" />
                </radialGradient>

                {/* Fluffy Paw Gradient */}
                <radialGradient id="cloudPawGrad" cx="40%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="75%" stopColor="#F1F5F9" />
                  <stop offset="100%" stopColor="#E2E8F0" />
                </radialGradient>

                {/* Drop shadow filter */}
                <filter id="cloudSoftShadow" x="-10%" y="-10%" width="130%" height="130%">
                  <feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="#000000" floodOpacity="0.45" />
                </filter>
              </defs>

              {/* ================================================================= */}
              {/* FLUFFY WHITE CLOUD BODY (Dream Blob Style - No Ears, Pure Cloud)  */}
              {/* ================================================================= */}
              <g filter="url(#cloudSoftShadow)">
                {/* Base lower fluff shelf */}
                <rect x="52" y="96" width="156" height="52" rx="26" fill="url(#cloudWhiteRadial)" />

                {/* Overlapping fluffy cloud lobes along perimeter */}
                {/* Bottom-left lobe */}
                <circle cx="68" cy="118" r="34" fill="url(#cloudWhiteRadial)" />
                {/* Mid-left lobe */}
                <circle cx="50" cy="94" r="32" fill="url(#cloudWhiteRadial)" />
                {/* Top-left high lobe */}
                <circle cx="86" cy="64" r="38" fill="url(#cloudWhiteRadial)" />
                {/* Center-top peak lobe */}
                <circle cx="132" cy="48" r="44" fill="url(#cloudWhiteRadial)" />
                {/* Top-right high lobe */}
                <circle cx="178" cy="62" r="38" fill="url(#cloudWhiteRadial)" />
                {/* Mid-right lobe */}
                <circle cx="210" cy="94" r="32" fill="url(#cloudWhiteRadial)" />
                {/* Bottom-right lobe */}
                <circle cx="192" cy="118" r="34" fill="url(#cloudWhiteRadial)" />

                {/* Central volumetric body */}
                <circle cx="130" cy="100" r="54" fill="url(#cloudWhiteRadial)" />
              </g>

              {/* Volumetric Top Rim Specular Highlight */}
              <g opacity="0.85">
                <ellipse cx="132" cy="38" rx="34" ry="12" fill="url(#cloudTopGlint)" />
                <ellipse cx="86" cy="52" rx="26" ry="10" fill="url(#cloudTopGlint)" transform="rotate(-15 86 52)" />
                <ellipse cx="178" cy="52" rx="26" ry="10" fill="url(#cloudTopGlint)" transform="rotate(15 178 52)" />
              </g>

              {/* Subtle lower belly soft depth */}
              <path
                d="M 50 120 C 80 152, 180 152, 210 120 C 180 142, 80 142, 50 120 Z"
                fill="url(#cloudBellyShadow)"
              />

              {/* ================================================================= */}
              {/* FACIAL FEATURES (Dream-Blob Minimalist Expressive Face)           */}
              {/* ================================================================= */}

              {/* Cheeks Blush - Glowing and rosy, expands during headpat */}
              <motion.circle
                cx="88"
                cy="108"
                r={isPet ? 18 : isPassword ? 16 : 14}
                animate={{
                  scale: isPet ? [1, 1.15, 1] : isPassword ? 1.08 : 1,
                  opacity: isPet ? 0.95 : isPassword ? 0.85 : 0.6
                }}
                transition={{ repeat: isPet ? Infinity : 0, duration: 1.2, ease: 'easeInOut' }}
                fill="url(#dreamCheekBlush)"
              />
              <motion.circle
                cx="172"
                cy="108"
                r={isPet ? 18 : isPassword ? 16 : 14}
                animate={{
                  scale: isPet ? [1, 1.15, 1] : isPassword ? 1.08 : 1,
                  opacity: isPet ? 0.95 : isPassword ? 0.85 : 0.6
                }}
                transition={{ repeat: isPet ? Infinity : 0, duration: 1.2, ease: 'easeInOut' }}
                fill="url(#dreamCheekBlush)"
              />

              {/* EYES */}
              {isPet ? (
                /* Blissful Head-Pat Reaction: Adorable Squint Purr Eyes ^ ^ */
                <g className="transition-all duration-300">
                  <path
                    d="M 94 100 Q 107 82 120 100"
                    stroke="#0F172A"
                    strokeWidth="4.8"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M 140 100 Q 153 82 166 100"
                    stroke="#0F172A"
                    strokeWidth="4.8"
                    strokeLinecap="round"
                    fill="none"
                  />
                  {/* Joyful blush sparkles */}
                  <circle cx="107" cy="84" r="2.5" fill="#FB7185" />
                  <circle cx="153" cy="84" r="2.5" fill="#FB7185" />
                </g>
              ) : isPassword ? (
                /* Natural cute closed eyes - identical to when patted ^ ^ */
                <g className="transition-all duration-300">
                  <path
                    d="M 94 100 Q 107 82 120 100"
                    stroke="#0F172A"
                    strokeWidth="4.8"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M 140 100 Q 153 82 166 100"
                    stroke="#0F172A"
                    strokeWidth="4.8"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <circle cx="107" cy="84" r="2.2" fill="#FB7185" opacity="0.8" />
                  <circle cx="153" cy="84" r="2.2" fill="#FB7185" opacity="0.8" />
                </g>
              ) : isYawn ? (
                /* Sleepy squint eyes: > < or curved sleepy arcs */
                <g className="transition-all duration-300">
                  <path d="M 96 98 Q 106 90 116 98" stroke="#0F172A" strokeWidth="4" strokeLinecap="round" fill="none" />
                  <path d="M 144 98 Q 154 90 164 98" stroke="#0F172A" strokeWidth="4" strokeLinecap="round" fill="none" />
                </g>
              ) : isSuccess ? (
                /* Ecstatic happy curved joy eyes */
                <g className="transition-all duration-300">
                  <path d="M 96 100 Q 107 84 118 100" stroke="#0F172A" strokeWidth="4.5" strokeLinecap="round" fill="none" />
                  <path d="M 142 100 Q 153 84 164 100" stroke="#0F172A" strokeWidth="4.5" strokeLinecap="round" fill="none" />
                  <circle cx="158" cy="88" r="3.5" fill="#FBBF24" />
                </g>
              ) : isError ? (
                /* Worried / Apologetic Droop Eyes */
                <g className="transition-all duration-300">
                  {/* Worried brows */}
                  <path d="M 96 86 Q 107 90 116 84" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" fill="none" />
                  <path d="M 144 84 Q 153 90 164 86" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" fill="none" />
                  {/* Eyes */}
                  <circle cx="107" cy="98" r="9" fill="#0F172A" />
                  <circle cx="153" cy="98" r="9" fill="#0F172A" />
                  <circle cx="105" cy="96" r="3" fill="#FFFFFF" />
                  <circle cx="151" cy="96" r="3" fill="#FFFFFF" />
                </g>
              ) : (
                /* Dream-Blob Expressive Eyes with Smooth Pupil Mouse Following */
                <g className="transition-all duration-200">
                  {/* Left Eye Socket */}
                  <ellipse
                    cx="107"
                    cy="96"
                    rx={11}
                    ry={blink ? 1.5 : 13}
                    fill="#0F172A"
                    className="transition-all duration-150"
                  />
                  {/* Right Eye Socket */}
                  <ellipse
                    cx="153"
                    cy="96"
                    rx={11}
                    ry={blink ? 1.5 : 13}
                    fill="#0F172A"
                    className="transition-all duration-150"
                  />

                  {!blink && (
                    <>
                      {/* Left Specular Glint (Glossy Dream-Blob Eye) */}
                      <circle
                        cx={107 + pupilPos.x}
                        cy={94 + pupilPos.y}
                        r="4.5"
                        fill="#FFFFFF"
                      />
                      <circle
                        cx={111 + pupilPos.x}
                        cy={98 + pupilPos.y}
                        r="1.8"
                        fill="#FFFFFF"
                      />

                      {/* Right Specular Glint */}
                      <circle
                        cx={153 + pupilPos.x}
                        cy={94 + pupilPos.y}
                        r="4.5"
                        fill="#FFFFFF"
                      />
                      <circle
                        cx={157 + pupilPos.x}
                        cy={98 + pupilPos.y}
                        r="1.8"
                        fill="#FFFFFF"
                      />
                    </>
                  )}
                </g>
              )}

              {/* MOUTH */}
              {isPet ? (
                /* Ecstatic Head-Pat Purring Smile */
                <g className="transition-all duration-300">
                  <path
                    d="M 115 110 Q 130 132 145 110 Z"
                    fill="#F43F5E"
                    stroke="#0F172A"
                    strokeWidth="3.2"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M 122 122 Q 130 117 138 122 Q 130 128 122 122 Z"
                    fill="#FDA4AF"
                  />
                </g>
              ) : isSuccess ? (
                /* Big Joyful Happy Open Smile */
                <path
                  d="M 116 112 Q 130 134 144 112 Z"
                  fill="#E11D48"
                  stroke="#0F172A"
                  strokeWidth="3"
                  strokeLinejoin="round"
                />
              ) : isTyping ? (
                /* Curious 'O' Mouth */
                <ellipse
                  cx="130"
                  cy="114"
                  rx="6"
                  ry="7.5"
                  fill="#E11D48"
                  stroke="#0F172A"
                  strokeWidth="2.8"
                />
              ) : isYawn ? (
                /* Wide Cute Yawning Mouth with Tongue */
                <g>
                  <ellipse cx="130" cy="116" rx="9" ry="12.5" fill="#E11D48" stroke="#0F172A" strokeWidth="3" />
                  <path d="M 124 122 Q 130 118 136 122 Q 130 128 124 122 Z" fill="#FB7185" />
                </g>
              ) : isPassword ? (
                /* Shy / bashful cute closed smile */
                <path
                  d="M 121 113 Q 130 123 139 113"
                  stroke="#0F172A"
                  strokeWidth="3.6"
                  strokeLinecap="round"
                  fill="none"
                />
              ) : isError ? (
                /* Apologetic Wavy Mouth */
                <path
                  d="M 120 118 Q 125 114 130 118 Q 135 122 140 117"
                  stroke="#0F172A"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  fill="none"
                />
              ) : (
                /* Classic Dream-Blob Cute Smile */
                <path
                  d="M 118 112 Q 130 125 142 112"
                  stroke="#0F172A"
                  strokeWidth="3.8"
                  strokeLinecap="round"
                  fill="none"
                />
              )}
            </svg>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};
