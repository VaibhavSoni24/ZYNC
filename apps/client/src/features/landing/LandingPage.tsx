import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Copy,
  Check,
  MessageSquare,
  Send,
  Users,
  Shield,
  Zap,
  ArrowRight
} from 'lucide-react';
import { SmokeShaderBackground } from '../../components/Background/SmokeShaderBackground';

interface ChatMsg {
  id: string;
  sender: string;
  role: 'HOST' | 'MOD' | 'YOU';
  text: string;
  time: string;
}

interface FloatingEmoji {
  id: number;
  emoji: string;
  left: number;
}

export const LandingPage: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(42);
  const [currentTimeSec, setCurrentTimeSec] = useState(102);
  const totalDurationSec = 228;

  // Interactive Live Chat
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      id: '1',
      sender: 'Maya',
      role: 'MOD',
      text: 'The audio sync on this 4K trailer is literally zero millisecond drift! 🍿',
      time: '14:02'
    },
    {
      id: '2',
      sender: 'Leo',
      role: 'MOD',
      text: 'Wait for the bass drop around the 2 minute mark! 🔥🚀',
      time: '14:03'
    },
    {
      id: '3',
      sender: 'Vaibhav',
      role: 'HOST',
      text: 'Turning the room volume to 100% - enjoy the show everyone!',
      time: '14:03'
    }
  ]);
  const [inputVal, setInputVal] = useState('');

  // Floating Reactions
  const [floatingEmojis, setFloatingEmojis] = useState<FloatingEmoji[]>([]);
  const emojiCountRef = useRef(0);

  // Playback timer simulation
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentTimeSec((prev) => {
        const next = prev >= totalDurationSec ? 0 : prev + 1;
        setProgress((next / totalDurationSec) * 100);
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText('T6YZ-POM2');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newRatio = Math.max(0, Math.min(1, clickX / rect.width));
    const newSec = Math.floor(newRatio * totalDurationSec);
    setCurrentTimeSec(newSec);
    setProgress(newRatio * 100);
  };

  const spawnReaction = (emoji: string) => {
    const id = ++emojiCountRef.current;
    const left = Math.floor(Math.random() * 60) + 20;
    setFloatingEmojis((prev) => [...prev, { id, emoji, left }]);
    setTimeout(() => {
      setFloatingEmojis((prev) => prev.filter((item) => item.id !== id));
    }, 2200);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const newMsg: ChatMsg = {
      id: Date.now().toString(),
      sender: 'You',
      role: 'YOU',
      text: inputVal.trim(),
      time: timeStr
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputVal('');
    spawnReaction('💬');
  };

  return (
    <div className="relative min-h-screen overflow-hidden text-text-primary">
      {/* 60FPS Pure WebGL Smoke Shader Background */}
      <SmokeShaderBackground />

      <div className="relative z-10 space-y-24 py-8 sm:py-16">
        {/* Hero Section */}
        <section className="text-center max-w-4xl mx-auto px-4 pt-8 pb-4">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.12]">
            Watch Together, <br className="hidden sm:inline" />
            <span className="gradient-brand-text">Perfectly in Sync</span>
          </h1>

          <p className="text-base sm:text-lg text-text-muted max-w-xl mx-auto mt-5 leading-relaxed">
            Never miss a moment, laugh, or reaction.
          </p>

          <div className="flex items-center justify-center mt-8">
            <Link
              to="/register"
              className="px-7 py-3 rounded-full bg-accent-purple/85 hover:bg-accent-purple border border-accent-purple/50 text-white font-semibold text-xs sm:text-sm shadow-xl shadow-accent-purple/25 hover:shadow-accent-purple/40 active:scale-95 transition flex items-center gap-2 group"
            >
              <span>Get Started</span>
              <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </section>

        {/* Interactive Theater Card */}
        <section className="relative max-w-6xl mx-auto px-4">
          {/* Subtle Ambient Radial Backlight */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[80%] max-w-3xl h-32 bg-gradient-to-r from-accent-blue/30 via-accent-purple/50 to-accent-blue/30 blur-3xl opacity-70 -z-10" />

          {/* Frosted Product Card */}
          <div className="bg-[#090914]/85 border border-white/10 rounded-2xl sm:rounded-3xl p-3 sm:p-5 shadow-[0_30px_90px_rgba(0,0,0,0.85)] backdrop-blur-2xl relative overflow-hidden">
            {/* Header Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-3 py-2 border-b border-white/[0.08] mb-3 text-xs">
              {/* Left: Window Dots & Room Pill */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>

                <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] px-2.5 py-1 rounded-xl">
                  <span className="text-[10px] text-text-muted font-mono">ROOM:</span>
                  <span className="font-mono font-bold text-white tracking-wider text-xs">T6YZ-POM2</span>
                  <button
                    onClick={handleCopyCode}
                    className="text-text-muted hover:text-white transition ml-1"
                    title="Copy Room Code"
                  >
                    {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  </button>
                </div>
              </div>

              {/* Right: Sync Status & Watchers */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>In Sync • 0.0s drift</span>
                </div>

                <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-text-muted">
                  <div className="flex -space-x-1">
                    <div className="w-5 h-5 rounded-full bg-accent-blue/40 border border-bg-base flex items-center justify-center text-[9px] font-bold text-accent-blue">V</div>
                    <div className="w-5 h-5 rounded-full bg-accent-purple/40 border border-bg-base flex items-center justify-center text-[9px] font-bold text-accent-purple">M</div>
                    <div className="w-5 h-5 rounded-full bg-emerald-500/40 border border-bg-base flex items-center justify-center text-[9px] font-bold text-emerald-400">L</div>
                  </div>
                  <span>+12 watching</span>
                </div>
              </div>
            </div>

            {/* Main Theater Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
              {/* 16:9 Video Canvas */}
              <div className="lg:col-span-8 relative aspect-video bg-[#040408] rounded-xl sm:rounded-2xl overflow-hidden border border-white/[0.08] flex flex-col justify-between p-3.5 sm:p-4 group select-none shadow-inner">
                {/* Cinematic Video Poster Atmosphere */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#050616] via-[#08051E] to-[#120732] opacity-95" />

                {/* Dynamic Floating Reactions Overlay */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-30">
                  {floatingEmojis.map((item) => (
                    <div
                      key={item.id}
                      style={{ left: `${item.left}%` }}
                      className="absolute bottom-16 text-2xl animate-float-fade"
                    >
                      {item.emoji}
                    </div>
                  ))}
                </div>

                {/* Video Top Badges */}
                <div className="relative z-10 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="bg-black/65 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-[11px] font-medium text-white/90">
                      Interstellar • Official Trailer
                    </span>
                    <span className="hidden sm:inline-block bg-accent-blue/20 text-accent-blue border border-accent-blue/30 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold">
                      4K 60FPS
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 bg-black/65 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-[11px] text-white/90">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-purple animate-ping" />
                    <span className="font-semibold text-accent-purple">HOST:</span>
                    <span>Vaibhav</span>
                  </div>
                </div>

                {/* Interactive Big Center Play/Pause Trigger */}
                <div className="relative z-10 flex items-center justify-center">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-gradient-to-br from-accent-blue via-accent-purple to-accent-purple text-white flex items-center justify-center shadow-[0_0_40px_rgba(123,22,255,0.6)] hover:scale-105 active:scale-95 transition"
                    title={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? (
                      <Pause size={26} className="text-white" />
                    ) : (
                      <Play size={26} className="text-white translate-x-0.5" />
                    )}
                  </button>
                </div>

                {/* Interactive Playback Control HUD */}
                <div className="relative z-10 bg-black/80 backdrop-blur-md p-2.5 sm:p-3 rounded-xl border border-white/10 flex flex-col gap-2">
                  {/* Scrub Bar */}
                  <div
                    onClick={handleScrub}
                    className="w-full h-1.5 rounded-full bg-white/20 relative cursor-pointer group/scrub"
                    title="Click to seek"
                  >
                    <div
                      style={{ width: `${progress}%` }}
                      className="h-full rounded-full gradient-brand relative transition-all duration-150"
                    >
                      <span className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md scale-0 group-hover/scrub:scale-100 transition-transform" />
                    </div>
                  </div>

                  {/* Controls Row */}
                  <div className="flex items-center justify-between text-[11px] text-white/80">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="hover:text-white transition"
                      >
                        {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                      </button>
                      <span className="font-mono text-white/90">
                        {formatTime(currentTimeSec)} / {formatTime(totalDurationSec)}
                      </span>
                      <button
                        onClick={() => setIsMuted(!isMuted)}
                        className="flex items-center gap-1 text-white/70 hover:text-white transition"
                      >
                        {isMuted ? <VolumeX size={14} className="text-red-400" /> : <Volume2 size={14} />}
                        <span className="font-mono text-[10px]">{isMuted ? 'Muted' : '100%'}</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-3 text-white/70">
                      <div className="flex items-center gap-1 bg-white/[0.06] px-2 py-0.5 rounded text-[10px] font-mono">
                        <span>Auto Drift Fix</span>
                      </div>
                      <Maximize2 size={13} className="hover:text-white cursor-pointer transition" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Interactive Live Chat & Instant Reaction Stream */}
              <div className="lg:col-span-4 bg-[#06060E]/80 border border-white/[0.08] rounded-xl sm:rounded-2xl p-3 flex flex-col justify-between h-full min-h-[300px]">
                <div>
                  {/* Chat Header */}
                  <div className="flex items-center justify-between pb-2.5 border-b border-white/[0.08] text-xs">
                    <div className="flex items-center gap-2 font-semibold text-white">
                      <MessageSquare size={13} className="text-accent-blue" />
                      <span>Live Chat</span>
                    </div>
                    <span className="text-[10px] text-text-muted font-mono bg-white/[0.04] px-2 py-0.5 rounded-full">
                      {messages.length} messages
                    </span>
                  </div>

                  {/* Messages Flow */}
                  <div className="space-y-2.5 py-2.5 text-xs max-h-[220px] overflow-y-auto">
                    {messages.map((m) => (
                      <div
                        key={m.id}
                        className={`p-2 rounded-xl transition ${
                          m.role === 'YOU'
                            ? 'bg-accent-blue/10 border border-accent-blue/20'
                            : m.role === 'HOST'
                            ? 'bg-accent-purple/10 border border-accent-purple/20'
                            : 'bg-white/[0.02] border border-white/[0.04]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-0.5">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`font-bold text-[11px] ${
                                m.role === 'YOU'
                                  ? 'text-accent-blue'
                                  : m.role === 'HOST'
                                  ? 'text-amber-300'
                                  : 'text-purple-300'
                              }`}
                            >
                              {m.sender}
                            </span>
                            <span
                              className={`text-[8px] font-bold px-1 py-0.2 rounded ${
                                m.role === 'YOU'
                                  ? 'bg-accent-blue/20 text-accent-blue'
                                  : m.role === 'HOST'
                                  ? 'bg-amber-400/20 text-amber-300'
                                  : 'bg-white/10 text-text-muted'
                              }`}
                            >
                              {m.role}
                            </span>
                          </div>
                          <span className="text-[9px] text-text-muted font-mono">{m.time}</span>
                        </div>
                        <p className="text-white/90 text-[11px] leading-relaxed">{m.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Interactive Floating Emoji Quick Bar + Chat Input */}
                <div className="pt-2 border-t border-white/[0.08] space-y-2">
                  {/* Quick Reactions: Click to Float Emojis */}
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] text-text-muted">React:</span>
                    <div className="flex items-center gap-1.5">
                      {['❤️', '🔥', '🍿', '🚀', '🎉'].map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => spawnReaction(emoji)}
                          className="p-1 text-xs hover:scale-125 active:scale-95 transition"
                          title={`Send ${emoji}`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Text Input */}
                  <form onSubmit={handleSendMessage} className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={inputVal}
                      onChange={(e) => setInputVal(e.target.value)}
                      placeholder="Type a message..."
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-text-muted/60 focus:outline-none focus:border-accent-purple/50 transition"
                    />
                    <button
                      type="submit"
                      className="p-1.5 rounded-xl bg-accent-purple/30 hover:bg-accent-purple/50 border border-accent-purple/40 text-accent-purple hover:text-white transition"
                    >
                      <Send size={13} />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Pillars */}
        <section className="max-w-5xl mx-auto px-4 pt-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Engineered for Frictionless Watch Parties</h2>
            <p className="text-xs sm:text-sm text-text-muted mt-2">Built ground-up for sub-second sync, privacy, and effortless fun.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/[0.02] backdrop-blur border border-white/[0.06] rounded-2xl p-6 shadow-xl hover:border-accent-blue/40 transition">
              <div className="p-3 w-fit rounded-xl bg-accent-blue/10 text-accent-blue mb-4">
                <Zap size={22} />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Automated Drift Correction</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                When one user pauses, seeks, or scrubs, everyone follows instantaneously. Built-in periodic drift correction ensures everyone hears and sees the exact same frame.
              </p>
            </div>

            <div className="bg-white/[0.02] backdrop-blur border border-white/[0.06] rounded-2xl p-6 shadow-xl hover:border-accent-purple/40 transition">
              <div className="p-3 w-fit rounded-xl bg-accent-purple/10 text-accent-purple mb-4">
                <Shield size={22} />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Granular Role System</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Enforced strictly server-side. Creators control the room as Host, promote trusted friends to Moderator, while Participants can request playback control on demand.
              </p>
            </div>

            <div className="bg-white/[0.02] backdrop-blur border border-white/[0.06] rounded-2xl p-6 shadow-xl hover:border-accent-blue/40 transition">
              <div className="p-3 w-fit rounded-xl bg-accent-blue/10 text-accent-blue mb-4">
                <Users size={22} />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Live Chat & Reactions</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Enjoy high-energy streaming with live text chat backed by a 100-message ring buffer and YouTube Live style floating emoji reactions that stream right across the theater.
              </p>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="text-center max-w-3xl mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-white mb-3">Ready to Start Watching?</h2>
          <p className="text-xs sm:text-sm text-text-muted max-w-md mx-auto mb-8">
            Set up your party in seconds with zero downloads or extensions required.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-accent-purple/85 hover:bg-accent-purple border border-accent-purple/50 text-white font-semibold text-xs sm:text-sm shadow-xl shadow-accent-purple/25 hover:shadow-accent-purple/40 active:scale-95 transition group"
          >
            <span>Get Started</span>
            <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </section>
      </div>
    </div>
  );
};
