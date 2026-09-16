import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Play,
  Pause,
  Volume2,
  Maximize2,
  Copy,
  Check,
  MessageSquare,
  Shield,
  Users,
  Zap,
  ArrowRight,
  Send
} from 'lucide-react';
import { SmokeShaderBackground } from '../../components/Background/SmokeShaderBackground';

export const LandingPage: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  const handleCopyCode = () => {
    navigator.clipboard.writeText('T6YZ-POM2');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Dynamic WebGL Smoke Shader Background */}
      <SmokeShaderBackground />

      <div className="relative z-10 space-y-28 py-10">
        {/* Hero Section */}
        <section className="text-center max-w-4xl mx-auto px-4 pt-16 pb-6">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-text-primary leading-[1.12]">
            Watch Together, <br className="hidden sm:inline" />
            <span className="gradient-brand-text">Perfectly in Sync</span>
          </h1>

          <p className="text-base sm:text-lg text-text-muted max-w-2xl mx-auto mt-6 leading-relaxed">
            Create a private theater in seconds. Drop any YouTube link, invite your friends, and stream with zero drift, low-latency live chat, floating reactions, and granular role permissions.
          </p>

          <div className="flex items-center justify-center mt-10">
            <Link
              to="/register"
              className="px-9 py-4 rounded-2xl gradient-brand text-white font-semibold text-sm shadow-xl shadow-accent-blue/25 hover:opacity-95 active:scale-[0.98] transition flex items-center justify-center gap-2.5 group"
            >
              <span>Get Started Free</span>
              <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </section>

        {/* Premium Room Theater Showcase */}
        <section className="max-w-6xl mx-auto px-4">
          <div className="relative">
            {/* Ambient Backlight Glow Behind Theater */}
            <div className="absolute -inset-1 bg-gradient-to-r from-accent-blue/30 via-accent-purple/30 to-accent-blue/30 rounded-[32px] blur-2xl opacity-70 -z-10 animate-pulse duration-1000" />

            <div className="bg-[#0D0D18]/90 border border-white/10 rounded-[28px] p-3.5 sm:p-6 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.8)] backdrop-blur-xl">
              {/* Theater Control Bar / Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 px-3 py-2.5 border-b border-white/[0.08] mb-4 text-xs">
                {/* Left: Window Dots & Room Code Pill */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>

                  <div className="flex items-center gap-2 bg-white/[0.05] border border-white/[0.08] px-3 py-1 rounded-xl">
                    <span className="text-[11px] text-text-muted font-mono">ROOM:</span>
                    <span className="font-mono font-bold text-text-primary tracking-wider">T6YZ-POM2</span>
                    <button
                      onClick={handleCopyCode}
                      className="text-text-muted hover:text-accent-blue transition ml-1"
                      title="Copy Room Code"
                    >
                      {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                    </button>
                  </div>
                </div>

                {/* Right: Real-Time Sync Telemetry & Active Watchers */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium text-[11px]">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>In Sync • 0.0s drift</span>
                  </div>

                  <div className="hidden sm:flex items-center gap-1.5">
                    <div className="flex -space-x-1.5">
                      <div className="w-5 h-5 rounded-full bg-accent-blue/30 border border-bg-base flex items-center justify-center text-[9px] font-bold text-accent-blue">V</div>
                      <div className="w-5 h-5 rounded-full bg-accent-purple/30 border border-bg-base flex items-center justify-center text-[9px] font-bold text-accent-purple">M</div>
                      <div className="w-5 h-5 rounded-full bg-emerald-500/30 border border-bg-base flex items-center justify-center text-[9px] font-bold text-emerald-400">L</div>
                    </div>
                    <span className="text-[11px] text-text-muted font-medium">+12 watching</span>
                  </div>
                </div>
              </div>

              {/* Theater Main Grid: Video Player + Interactive Chat */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* 16:9 Video Theater Frame */}
                <div className="lg:col-span-8 relative aspect-video bg-[#05050A] rounded-2xl overflow-hidden border border-white/[0.08] flex flex-col justify-between p-4 group shadow-inner">
                  {/* Subtle video background gradient simulating cinematic 4K video */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#060919] via-[#0A071E] to-[#120B2E] opacity-90" />

                  {/* Visual Floating Reactions Overlay */}
                  <div className="absolute right-6 bottom-16 flex flex-col items-center gap-2 pointer-events-none z-20">
                    <span className="px-2.5 py-1 rounded-full bg-black/60 border border-white/10 text-xs shadow-lg animate-bounce">
                      🍿
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-black/60 border border-white/10 text-xs shadow-lg animate-pulse delay-100">
                      🔥
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-black/60 border border-white/10 text-xs shadow-lg">
                      ❤️
                    </span>
                  </div>

                  {/* Video Header Badges */}
                  <div className="relative z-10 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-[11px] font-semibold text-white/90">
                        Interstellar • Official 4K Trailer
                      </span>
                      <span className="hidden sm:inline-block bg-accent-blue/20 text-accent-blue border border-accent-blue/30 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold">
                        4K 60FPS
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-[11px] text-white/90">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-purple animate-ping" />
                      <span className="font-semibold text-accent-purple">HOST:</span>
                      <span className="font-medium">Vaibhav</span>
                    </div>
                  </div>

                  {/* Center Play/Pause Pulsing Trigger */}
                  <div className="relative z-10 flex items-center justify-center">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl gradient-brand text-white flex items-center justify-center shadow-[0_0_40px_rgba(0,91,255,0.5)] hover:scale-105 active:scale-95 transition"
                    >
                      {isPlaying ? (
                        <Pause size={28} className="text-white" />
                      ) : (
                        <Play size={28} className="text-white translate-x-0.5" />
                      )}
                    </button>
                  </div>

                  {/* Polished Glass Playback Control HUD */}
                  <div className="relative z-10 bg-black/75 backdrop-blur-md p-3 rounded-xl border border-white/10 flex flex-col gap-2">
                    {/* Scrub Bar */}
                    <div className="w-full h-1.5 rounded-full bg-white/20 relative cursor-pointer group/scrub overflow-hidden">
                      <div className="w-[45%] h-full rounded-full gradient-brand relative" />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-white/80">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setIsPlaying(!isPlaying)}
                          className="hover:text-white transition"
                        >
                          {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                        </button>
                        <span className="font-mono text-white/90">01:42 / 03:48</span>
                        <div className="flex items-center gap-1.5 text-white/60 hover:text-white transition cursor-pointer">
                          <Volume2 size={14} />
                          <span className="font-mono text-[10px]">100%</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-white/70">
                        <span className="font-mono text-[10px] px-1.5 py-0.5 bg-white/10 rounded">Auto Sync</span>
                        <Maximize2 size={13} className="hover:text-white cursor-pointer transition" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side: Live Chat Panel */}
                <div className="lg:col-span-4 bg-[#080812]/90 border border-white/[0.08] rounded-2xl p-3.5 flex flex-col justify-between h-full min-h-[300px]">
                  <div>
                    {/* Chat Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] text-xs">
                      <div className="flex items-center gap-2 text-text-primary font-semibold">
                        <MessageSquare size={14} className="text-accent-blue" />
                        <span>Live Chat</span>
                      </div>
                      <span className="text-[10px] text-text-muted font-mono bg-white/[0.04] px-2 py-0.5 rounded-full border border-white/[0.06]">
                        100-msg buffer
                      </span>
                    </div>

                    {/* Messages Flow */}
                    <div className="space-y-3 py-3 text-xs">
                      <div className="p-2 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-accent-blue">Maya</span>
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-accent-blue/10 text-accent-blue font-semibold">MOD</span>
                          </div>
                          <span className="text-[10px] text-text-muted font-mono">14:02</span>
                        </div>
                        <p className="text-text-primary/90 text-[11px] leading-relaxed">
                          The audio sync on this 4K trailer is literally zero millisecond drift! 🍿
                        </p>
                      </div>

                      <div className="p-2 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-accent-purple">Leo</span>
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/10 text-text-muted font-semibold">MEMBER</span>
                          </div>
                          <span className="text-[10px] text-text-muted font-mono">14:03</span>
                        </div>
                        <p className="text-text-primary/90 text-[11px] leading-relaxed">
                          Wait for the bass drop around the 2 minute mark! 🔥🚀
                        </p>
                      </div>

                      <div className="p-2 rounded-xl bg-accent-purple/10 border border-accent-purple/20">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-amber-400">Vaibhav</span>
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 font-bold">HOST</span>
                          </div>
                          <span className="text-[10px] text-text-muted font-mono">14:03</span>
                        </div>
                        <p className="text-white text-[11px] leading-relaxed">
                          Turning the room volume to 100% - enjoy the show everyone!
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Mock Input Bar */}
                  <div className="pt-2 border-t border-white/[0.08]">
                    <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-xs">
                      <input
                        type="text"
                        readOnly
                        placeholder="Say something or react..."
                        className="bg-transparent text-text-muted placeholder:text-text-muted/60 text-xs w-full focus:outline-none cursor-default"
                      />
                      <div className="flex items-center gap-1 text-text-muted">
                        <button className="hover:text-text-primary transition">🔥</button>
                        <button className="hover:text-text-primary transition">❤️</button>
                        <div className="p-1 rounded-lg bg-accent-blue/20 text-accent-blue">
                          <Send size={12} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Pillars */}
        <section className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary">Engineered for Frictionless Watch Parties</h2>
            <p className="text-xs sm:text-sm text-text-muted mt-2">Every feature built ground-up for speed, security, and effortless fun.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-bg-surface/80 backdrop-blur border border-border-subtle rounded-2xl p-6 shadow-xl hover:border-accent-blue/40 transition">
              <div className="p-3 w-fit rounded-xl bg-accent-blue/10 text-accent-blue mb-4">
                <Zap size={22} />
              </div>
              <h3 className="text-base font-bold text-text-primary mb-2">Automated Drift Correction</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                When one user pauses, seeks, or scrubs, everyone follows instantaneously. Built-in periodic drift correction ensures everyone hears and sees the exact same frame.
              </p>
            </div>

            <div className="bg-bg-surface/80 backdrop-blur border border-border-subtle rounded-2xl p-6 shadow-xl hover:border-accent-purple/40 transition">
              <div className="p-3 w-fit rounded-xl bg-accent-purple/10 text-accent-purple mb-4">
                <Shield size={22} />
              </div>
              <h3 className="text-base font-bold text-text-primary mb-2">Granular Role System</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Enforced strictly server-side. Creators control the room as Host, promote trusted friends to Moderator, while Participants can request playback control on demand.
              </p>
            </div>

            <div className="bg-bg-surface/80 backdrop-blur border border-border-subtle rounded-2xl p-6 shadow-xl hover:border-accent-blue/40 transition">
              <div className="p-3 w-fit rounded-xl bg-accent-blue/10 text-accent-blue mb-4">
                <Users size={22} />
              </div>
              <h3 className="text-base font-bold text-text-primary mb-2">Live Chat & Reactions</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Enjoy high-energy streaming with live text chat backed by a 100-message ring buffer and YouTube Live style floating emoji reactions that stream right across the theater.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="max-w-4xl mx-auto px-4 py-10 bg-bg-surface/60 backdrop-blur border border-border-subtle rounded-3xl">
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary text-center mb-8">How It Works in 3 Steps</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full gradient-brand text-white font-bold flex items-center justify-center mx-auto text-sm shadow-md shadow-accent-blue/20">
                1
              </div>
              <h3 className="text-sm font-semibold text-text-primary">Create a Room</h3>
              <p className="text-xs text-text-muted">Give your theater a name, choose public or private, and generate a secure 8-character code.</p>
            </div>
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full gradient-brand text-white font-bold flex items-center justify-center mx-auto text-sm shadow-md shadow-accent-blue/20">
                2
              </div>
              <h3 className="text-sm font-semibold text-text-primary">Drop a YouTube Link</h3>
              <p className="text-xs text-text-muted">Paste any YouTube URL or search code. It synchronizes instantly for all room members.</p>
            </div>
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full gradient-brand text-white font-bold flex items-center justify-center mx-auto text-sm shadow-md shadow-accent-blue/20">
                3
              </div>
              <h3 className="text-sm font-semibold text-text-primary">Enjoy in Sync</h3>
              <p className="text-xs text-text-muted">Chat, react with floating emojis, and watch with zero playback drift across devices.</p>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="text-center max-w-3xl mx-auto px-4 py-12">
          <h2 className="text-3xl font-bold text-text-primary mb-4">Ready to Start Watching?</h2>
          <p className="text-xs sm:text-sm text-text-muted max-w-lg mx-auto mb-8">
            Set up your party now with no downloads, browser extensions, or complicated setups required.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2.5 px-9 py-4 rounded-2xl gradient-brand text-white font-semibold text-sm shadow-xl shadow-accent-blue/25 hover:opacity-95 transition group"
          >
            <span>Create Free Account</span>
            <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </section>
      </div>
    </div>
  );
};
