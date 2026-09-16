import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Users, MessageSquare, Shield, Sparkles, ArrowRight, Zap, Film } from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="space-y-24 py-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden text-center max-w-4xl mx-auto px-4 pt-12 pb-8">
        {/* Soft background glow circles */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-accent-blue/15 to-accent-purple/15 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-bg-surface border border-border-subtle text-xs text-text-muted mb-6">
          <span className="flex h-2 w-2 rounded-full bg-accent-blue animate-pulse" />
          <span>Real-time collaborative YouTube watch party</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-text-primary leading-[1.15]">
          Watch Together, <br className="hidden sm:inline" />
          <span className="gradient-brand-text">Perfectlys In Sync</span>
        </h1>

        <p className="text-base sm:text-lg text-text-muted max-w-2xl mx-auto mt-6 leading-relaxed">
          Create a private theater in seconds. Drop any YouTube link, invite your friends, and stream with zero drift, live chat, floating reactions, and granular roles.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <Link
            to="/register"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl gradient-brand text-white font-semibold text-sm shadow-xl shadow-accent-blue/20 hover:opacity-95 active:scale-95 transition flex items-center justify-center gap-2"
          >
            <Sparkles size={16} />
            <span>Get Started Free</span>
            <ArrowRight size={16} />
          </Link>
          <Link
            to="/room/join"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-bg-surface hover:bg-bg-elevated border border-border-subtle text-text-primary font-semibold text-sm transition flex items-center justify-center gap-2"
          >
            <Film size={16} />
            <span>Join a Public Party</span>
          </Link>
        </div>
      </section>

      {/* Interactive Mock Video Preview Showcase */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="bg-bg-surface/80 border border-border-subtle rounded-3xl p-3 sm:p-5 shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between px-3 py-2 border-b border-border-subtle/50 mb-3 text-xs text-text-muted">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="font-mono text-text-primary ml-2">ROOM: T6YZ-POM2</span>
            </div>
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> In Sync
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            {/* Player Simulation */}
            <div className="lg:col-span-2 relative aspect-video bg-black/90 rounded-2xl overflow-hidden border border-border-subtle flex flex-col justify-between p-4">
              <div className="flex items-center justify-between text-xs text-white/80">
                <span className="bg-black/60 backdrop-blur px-2.5 py-1 rounded-md">4K Ultra HD • 60 FPS</span>
                <span className="bg-accent-blue/80 backdrop-blur px-2.5 py-1 rounded-md font-semibold">HOST: Vaibhav</span>
              </div>
              <div className="flex items-center justify-center">
                <div className="w-16 h-16 rounded-full gradient-brand text-white flex items-center justify-center shadow-2xl scale-110">
                  <Play size={28} className="translate-x-0.5" />
                </div>
              </div>
              <div className="bg-black/70 backdrop-blur p-2.5 rounded-xl border border-white/10 flex items-center gap-3 text-xs text-white/90">
                <span className="font-mono">14:28 / 42:15</span>
                <div className="flex-1 h-1.5 rounded-full bg-white/20 relative">
                  <div className="w-1/3 h-full rounded-full gradient-brand" />
                </div>
                <span>🔊 100%</span>
              </div>
            </div>

            {/* Simulated Live Chat */}
            <div className="bg-bg-elevated/70 border border-border-subtle rounded-2xl p-4 flex flex-col justify-between">
              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-2 pb-2 border-b border-border-subtle/50 text-text-muted font-semibold">
                  <MessageSquare size={14} />
                  <span>Live Stream Chat</span>
                </div>
                <div className="space-y-2">
                  <p><span className="text-accent-blue font-semibold">Maya:</span> This scene is incredible!</p>
                  <p><span className="text-accent-purple font-semibold">Leo:</span> The sync is literally millisecond perfect 🍿</p>
                  <p><span className="text-amber-400 font-semibold">Vaibhav (Host):</span> Turning up the volume for the drop!</p>
                </div>
              </div>
              <div className="pt-3 border-t border-border-subtle/50 text-xs text-text-muted italic text-center">
                Reaction: ❤️ 🔥 🎉 floating live
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
          <div className="bg-bg-surface border border-border-subtle rounded-2xl p-6 shadow-xl hover:border-accent-blue/40 transition">
            <div className="p-3 w-fit rounded-xl bg-accent-blue/10 text-accent-blue mb-4">
              <Zap size={22} />
            </div>
            <h3 className="text-base font-bold text-text-primary mb-2">Automated Drift Correction</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              When one user pauses, seeks, or scrubs, everyone follows instantaneously. Built-in periodic drift correction ensures everyone hears and sees the same frame.
            </p>
          </div>

          <div className="bg-bg-surface border border-border-subtle rounded-2xl p-6 shadow-xl hover:border-accent-purple/40 transition">
            <div className="p-3 w-fit rounded-xl bg-accent-purple/10 text-accent-purple mb-4">
              <Shield size={22} />
            </div>
            <h3 className="text-base font-bold text-text-primary mb-2">Granular Role System</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Enforced strictly server-side. Creators control the room as Host, promote trusted co-hosts to Moderator, while Participants can request control on demand.
            </p>
          </div>

          <div className="bg-bg-surface border border-border-subtle rounded-2xl p-6 shadow-xl hover:border-accent-blue/40 transition">
            <div className="p-3 w-fit rounded-xl bg-accent-blue/10 text-accent-blue mb-4">
              <Users size={22} />
            </div>
            <h3 className="text-base font-bold text-text-primary mb-2">Live Chat & Reactions</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Enjoy high-energy streaming with live text chat and YouTube Live style floating emoji reactions that stream right across the edge of the theater.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-4xl mx-auto px-4 py-8 bg-bg-surface/50 border border-border-subtle rounded-3xl">
        <h2 className="text-xl sm:text-2xl font-bold text-text-primary text-center mb-8">How It Works in 3 Steps</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-full gradient-brand text-white font-bold flex items-center justify-center mx-auto text-sm">
              1
            </div>
            <h3 className="text-sm font-semibold text-text-primary">Create a Room</h3>
            <p className="text-xs text-text-muted">Give your theater a name, set your preferred language, and generate an 8-char code.</p>
          </div>
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-full gradient-brand text-white font-bold flex items-center justify-center mx-auto text-sm">
              2
            </div>
            <h3 className="text-sm font-semibold text-text-primary">Drop a YouTube Link</h3>
            <p className="text-xs text-text-muted">Paste any YouTube URL or search code. It loads instantly for everyone.</p>
          </div>
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-full gradient-brand text-white font-bold flex items-center justify-center mx-auto text-sm">
              3
            </div>
            <h3 className="text-sm font-semibold text-text-primary">Enjoy In Sync</h3>
            <p className="text-xs text-text-muted">Chat, react with floating emojis, and watch with flawless synchronized playback.</p>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="text-center max-w-3xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-text-primary mb-4">Ready to Start Watching?</h2>
        <p className="text-xs sm:text-sm text-text-muted max-w-lg mx-auto mb-6">
          Set up your party now with no downloads or browser extensions required.
        </p>
        <Link
          to="/register"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl gradient-brand text-white font-semibold text-sm shadow-xl shadow-accent-blue/20 hover:opacity-95 transition"
        >
          <span>Create Free Account</span>
          <ArrowRight size={16} />
        </Link>
      </section>
    </div>
  );
};
