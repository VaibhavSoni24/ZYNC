import React from 'react';
import { Link } from 'react-router-dom';
import {
  Zap,
  Shield,
  Cpu,
  Radio,
  Activity,
  Lock,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Terminal
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-20 space-y-16 lg:space-y-24 text-text-primary">
      {/* Hero Section with Floating 3D Animated Objects */}
      <section className="relative text-center max-w-5xl mx-auto pt-4 pb-4">
        {/* Floating Ambient Orbs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-accent-blue/15 via-accent-purple/20 to-accent-blue/10 blur-[110px] pointer-events-none -z-10" />

        {/* Floating 3D Animated Object Badges */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 mb-8 flex-wrap">
          {/* Floating 3D Object Left */}
          <div className="flex items-center gap-3 p-2.5 px-4 rounded-2xl bg-[#090914]/85 border border-white/10 backdrop-blur-xl shadow-[0_15px_40px_rgba(0,0,0,0.5)] animate-float-slow select-none">
            <div className="w-8 h-8 rounded-xl bg-accent-blue/20 border border-accent-blue/30 flex items-center justify-center text-accent-blue shadow-[0_0_15px_rgba(46,124,246,0.3)]">
              <Zap size={16} className="animate-pulse" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-bold text-white">4.2ms Sync Drift</span>
              </div>
              <p className="text-[10px] text-text-muted font-mono">Zero audio phase error</p>
            </div>
          </div>

          {/* Floating 3D Object Right */}
          <div className="flex items-center gap-3 p-2.5 px-4 rounded-2xl bg-[#090914]/85 border border-white/10 backdrop-blur-xl shadow-[0_15px_40px_rgba(0,0,0,0.5)] animate-float-reverse select-none">
            <div className="w-8 h-8 rounded-xl bg-accent-purple/20 border border-accent-purple/30 flex items-center justify-center text-accent-purple shadow-[0_0_15px_rgba(155,60,255,0.3)]">
              <Radio size={16} className="animate-spin-slow" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1">
                <div className="flex items-end gap-0.5 h-3">
                  <span className="w-1 bg-accent-purple rounded-full animate-wave-bar-1" />
                  <span className="w-1 bg-accent-purple rounded-full animate-wave-bar-2" />
                  <span className="w-1 bg-accent-purple rounded-full animate-wave-bar-3" />
                  <span className="w-1 bg-accent-purple rounded-full animate-wave-bar-4" />
                </div>
                <span className="text-xs font-bold text-white ml-1.5">WebSocket 60Hz</span>
              </div>
              <p className="text-[10px] text-text-muted font-mono">Real-time playhead feed</p>
            </div>
          </div>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.12]">
          Real-Time Synchronization, <br />
          <span className="gradient-brand-text">Engineered to Perfection</span>
        </h1>

        <p className="text-base sm:text-lg text-text-muted max-w-2xl mx-auto mt-6 leading-relaxed">
          Zync eliminates video playback desync forever with a high-precision WebSocket architecture, cryptographic server-side role enforcement, and sub-millisecond drift correction.
        </p>

        {/* Quick Action Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md text-xs text-white/90">
            <CheckCircle2 size={14} className="text-emerald-400" />
            <span>Sub-15ms Latency</span>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md text-xs text-white/90">
            <CheckCircle2 size={14} className="text-accent-blue" />
            <span>Server-Authoritative RBAC</span>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md text-xs text-white/90">
            <CheckCircle2 size={14} className="text-accent-purple" />
            <span>Redis Horizontal Sharding</span>
          </div>
        </div>
      </section>

      {/* Full-Width Telemetry Metrics Strip */}
      <section className="relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#090914]/80 border border-white/10 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
          <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/[0.02] border border-white/[0.04] text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-text-muted mb-1">
              <Activity size={14} className="text-emerald-400" />
              <span>Target Drift</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">0.0ms</div>
            <p className="text-[11px] text-text-muted mt-1">Autonomous playhead consensus</p>
          </div>

          <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/[0.02] border border-white/[0.04] text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-text-muted mb-1">
              <Zap size={14} className="text-accent-blue" />
              <span>Refresh Rate</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-accent-blue font-mono">60 FPS</div>
            <p className="text-[11px] text-text-muted mt-1">Direct YouTube IFrame control</p>
          </div>

          <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/[0.02] border border-white/[0.04] text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-text-muted mb-1">
              <Shield size={14} className="text-accent-purple" />
              <span>RBAC Security</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-accent-purple font-mono">100%</div>
            <p className="text-[11px] text-text-muted mt-1">Server-side validated commands</p>
          </div>

          <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/[0.02] border border-white/[0.04] text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-text-muted mb-1">
              <Lock size={14} className="text-amber-400" />
              <span>Token Encryption</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">256-bit</div>
            <p className="text-[11px] text-text-muted mt-1">Stateless JWT + Refresh rotation</p>
          </div>
        </div>
      </section>

      {/* 4-Pillar Architectural Deep Dive */}
      <section className="space-y-6">
        <div className="text-center sm:text-left">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Under the Hood: Distributed Systems Architecture
          </h2>
          <p className="text-xs sm:text-sm text-text-muted mt-1 max-w-xl">
            A breakdown of the low-latency networking, security models, and real-time state machines powering Zync.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Pillar 1: Sync Engine */}
          <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#090914]/80 border border-white/10 backdrop-blur-xl shadow-xl flex flex-col justify-between group hover:border-accent-blue/40 transition duration-300">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-accent-blue/10 border border-accent-blue/20 flex items-center justify-center text-accent-blue mb-4 group-hover:scale-105 group-hover:bg-accent-blue/20 transition-all duration-300">
                <div className="flex items-end gap-1 h-5">
                  <span className="w-1 bg-accent-blue rounded-full animate-wave-bar-1" />
                  <span className="w-1 bg-accent-blue rounded-full animate-wave-bar-3" />
                  <span className="w-1 bg-accent-blue rounded-full animate-wave-bar-2" />
                  <span className="w-1 bg-accent-blue rounded-full animate-wave-bar-4" />
                </div>
              </div>
              <div className="text-[10px] font-mono text-accent-blue uppercase tracking-widest font-bold mb-1">
                Precision Clock
              </div>
              <h3 className="text-base font-bold text-white mb-2">Real-Time Drift Correction</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Employs persistent bidirectional WebSockets with sub-millisecond drift correction. When a Host seeks or pauses, timestamp delta vectors negotiate and instantaneously align playheads across all participants.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/[0.06] text-[11px] text-white/50 flex items-center justify-between">
              <span>Threshold</span>
              <span className="font-mono text-accent-blue font-bold">&lt; 0.5s tolerance</span>
            </div>
          </div>

          {/* Pillar 2: Server-Side RBAC */}
          <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#090914]/80 border border-white/10 backdrop-blur-xl shadow-xl flex flex-col justify-between group hover:border-accent-purple/40 transition duration-300">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-accent-purple/10 border border-accent-purple/20 flex items-center justify-center text-accent-purple mb-4 group-hover:scale-105 group-hover:bg-accent-purple/20 transition-all duration-300">
                <Shield size={24} className="animate-pulse" />
              </div>
              <div className="text-[10px] font-mono text-accent-purple uppercase tracking-widest font-bold mb-1">
                Authority Matrix
              </div>
              <h3 className="text-base font-bold text-white mb-2">Server-Authoritative RBAC</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Zero client-trust architecture. Every single playback state mutation, volume modification, video change, and role promotion is cryptographically verified against server session storage before propagation.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/[0.06] text-[11px] text-white/50 flex items-center justify-between">
              <span>Roles</span>
              <span className="font-mono text-accent-purple font-bold">HOST • MOD • VIEWER</span>
            </div>
          </div>

          {/* Pillar 3: Redis Horizontal Scaling */}
          <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#090914]/80 border border-white/10 backdrop-blur-xl shadow-xl flex flex-col justify-between group hover:border-emerald-500/40 transition duration-300">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-105 group-hover:bg-emerald-500/20 transition-all duration-300">
                <Cpu size={24} className="animate-spin-slow" />
              </div>
              <div className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold mb-1">
                Cluster Mesh
              </div>
              <h3 className="text-base font-bold text-white mb-2">Redis Pub/Sub Architecture</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                Constructed with an OOP socket room adapter layered over Redis Pub/Sub channels. Rooms scale seamlessly across multi-node server clusters with instant horizontal inter-process messaging.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/[0.06] text-[11px] text-white/50 flex items-center justify-between">
              <span>Backbone</span>
              <span className="font-mono text-emerald-400 font-bold">Redis Streams</span>
            </div>
          </div>

          {/* Pillar 4: Ephemeral Security */}
          <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#090914]/80 border border-white/10 backdrop-blur-xl shadow-xl flex flex-col justify-between group hover:border-amber-500/40 transition duration-300">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-105 group-hover:bg-amber-500/20 transition-all duration-300">
                <Lock size={24} className="animate-pulse" />
              </div>
              <div className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-bold mb-1">
                Zero-Leak Security
              </div>
              <h3 className="text-base font-bold text-white mb-2">Ephemeral OTP & Auth</h3>
              <p className="text-xs text-text-muted leading-relaxed">
                User onboarding utilizes 6-digit cryptographic verification codes transmitted via Brevo SMTP and stored in Redis with strict 5-minute TTL expirations, keeping the PostgreSQL primary database clean.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/[0.06] text-[11px] text-white/50 flex items-center justify-between">
              <span>Expiry</span>
              <span className="font-mono text-amber-400 font-bold">300s TTL in Redis</span>
            </div>
          </div>
        </div>
      </section>

      {/* Panoramic Creator Spotlight & Interactive Topology Simulation */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Creator Profile */}
        <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-[#090914]/85 border border-white/10 backdrop-blur-2xl shadow-2xl flex flex-col justify-between relative overflow-hidden">
          {/* Subtle Ambient Light */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent-blue/10 blur-3xl pointer-events-none" />

          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl gradient-brand flex items-center justify-center text-white text-2xl font-black shadow-[0_0_30px_rgba(46,124,246,0.4)] flex-shrink-0 overflow-hidden border border-white/20 relative">
                <img
                  src="/vaibhav.jpeg"
                  alt="Vaibhav Soni"
                  className="w-full h-full object-cover object-top"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-white">Vaibhav Soni</h3>
                <p className="text-xs text-accent-blue font-semibold mt-0.5">
                  Full-Stack Software Engineer
                </p>
                <p className="text-[11px] text-text-muted mt-0.5">
                  Creator & Lead Architect of Zync
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-text-muted leading-relaxed mb-4">
              "Building real-time experiences demands uncompromising dedication to milliseconds and user delight. Zync was engineered to bridge physical distance, transforming video watching into an effortless, communal experience that feels as immediate as sitting on the same couch."
            </p>

            {/* Core Tech Stack Matrix */}
            <div className="space-y-2 mt-6">
              <div className="text-[11px] font-mono text-white/50 uppercase tracking-wider font-semibold">
                Technology Ecosystem
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  'TypeScript',
                  'React 18',
                  'Node.js',
                  'Socket.IO',
                  'PostgreSQL',
                  'Prisma ORM',
                  'Redis',
                  'TailwindCSS',
                  'WebGL Shaders',
                  'Vite'
                ].map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[11px] text-white/80 font-medium hover:border-accent-blue/40 transition"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-5 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-4 text-xs">
            <a
              href="https://github.com/VaibhavSoni24"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-white font-medium flex items-center gap-2 transition"
            >
              <Terminal size={14} className="text-accent-blue" />
              <span>github.com/VaibhavSoni24</span>
              <ExternalLink size={12} className="text-text-muted" />
            </a>

            <Link
              to="/contact"
              className="text-accent-blue hover:text-white font-semibold flex items-center gap-1.5 transition"
            >
              <span>Get in touch directly</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Live Interactive Distributed Mesh Topology */}
        <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-[#090914]/85 border border-white/10 backdrop-blur-2xl shadow-2xl flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <h4 className="text-sm font-bold text-white tracking-tight">Active Mesh State Machine</h4>
              </div>
              <span className="px-2 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">
                LOCKSTEP SYNCED
              </span>
            </div>

            <p className="text-xs text-text-muted leading-relaxed mb-6">
              A real-time state visualization of how Host playback signals broadcast through Redis channels to viewer nodes without audio jitter:
            </p>

            {/* Topology Graphic Node Graph */}
            <div className="relative h-56 bg-[#05050A] rounded-2xl border border-white/[0.06] p-4 flex items-center justify-center overflow-hidden">
              {/* Pulsing Grid Background */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px]" />

              {/* Connecting SVG Beams & Real Travelling Packets */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 200">
                <defs>
                  <filter id="glowPacket" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>

                {/* Base Grid Circuit Lines */}
                <line x1="200" y1="45" x2="65" y2="170" stroke="rgba(46,124,246,0.2)" strokeWidth="2" strokeDasharray="5 5" />
                <line x1="200" y1="45" x2="200" y2="170" stroke="rgba(155,60,255,0.2)" strokeWidth="2" strokeDasharray="5 5" />
                <line x1="200" y1="45" x2="335" y2="170" stroke="rgba(16,185,129,0.2)" strokeWidth="2" strokeDasharray="5 5" />

                {/* Host Broadcast Emanation Ring */}
                <circle cx="200" cy="45" r="6" fill="none" stroke="#9B3CFF" strokeWidth="2">
                  <animate attributeName="r" values="6;26" dur="1.8s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.9;0" dur="1.8s" repeatCount="indefinite" />
                </circle>

                {/* Stream 1: Host to Viewer A */}
                <circle r="4" fill="#38BDF8" filter="url(#glowPacket)">
                  <animateMotion path="M 200 45 L 65 170" dur="1.6s" repeatCount="indefinite" />
                </circle>
                <circle r="2" fill="#FFFFFF">
                  <animateMotion path="M 200 45 L 65 170" dur="1.6s" repeatCount="indefinite" />
                </circle>
                <circle r="3" fill="#38BDF8" opacity="0.6">
                  <animateMotion path="M 200 45 L 65 170" dur="1.6s" begin="0.8s" repeatCount="indefinite" />
                </circle>

                {/* Stream 2: Host to Viewer B */}
                <circle r="4" fill="#C084FC" filter="url(#glowPacket)">
                  <animateMotion path="M 200 45 L 200 170" dur="1.6s" begin="0.3s" repeatCount="indefinite" />
                </circle>
                <circle r="2" fill="#FFFFFF">
                  <animateMotion path="M 200 45 L 200 170" dur="1.6s" begin="0.3s" repeatCount="indefinite" />
                </circle>
                <circle r="3" fill="#C084FC" opacity="0.6">
                  <animateMotion path="M 200 45 L 200 170" dur="1.6s" begin="1.1s" repeatCount="indefinite" />
                </circle>

                {/* Stream 3: Host to Viewer C */}
                <circle r="4" fill="#34D399" filter="url(#glowPacket)">
                  <animateMotion path="M 200 45 L 335 170" dur="1.6s" begin="0.6s" repeatCount="indefinite" />
                </circle>
                <circle r="2" fill="#FFFFFF">
                  <animateMotion path="M 200 45 L 335 170" dur="1.6s" begin="0.6s" repeatCount="indefinite" />
                </circle>
                <circle r="3" fill="#34D399" opacity="0.6">
                  <animateMotion path="M 200 45 L 335 170" dur="1.6s" begin="1.4s" repeatCount="indefinite" />
                </circle>

                {/* Arrival Ripple Rings at Viewers */}
                <circle cx="65" cy="170" r="3" fill="none" stroke="#38BDF8" strokeWidth="1.5">
                  <animate attributeName="r" values="3;16" dur="1.6s" begin="1.4s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.8;0" dur="1.6s" begin="1.4s" repeatCount="indefinite" />
                </circle>
                <circle cx="200" cy="170" r="3" fill="none" stroke="#C084FC" strokeWidth="1.5">
                  <animate attributeName="r" values="3;16" dur="1.6s" begin="0.1s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.8;0" dur="1.6s" begin="0.1s" repeatCount="indefinite" />
                </circle>
                <circle cx="335" cy="170" r="3" fill="none" stroke="#34D399" strokeWidth="1.5">
                  <animate attributeName="r" values="3;16" dur="1.6s" begin="0.4s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.8;0" dur="1.6s" begin="0.4s" repeatCount="indefinite" />
                </circle>
              </svg>

              {/* Central Host Node */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 flex flex-col items-center z-10">
                <div className="px-3 py-1.5 rounded-xl bg-accent-purple/20 border border-accent-purple/40 text-accent-purple font-mono font-bold text-xs shadow-[0_0_20px_rgba(155,60,255,0.4)] flex items-center gap-1.5">
                  <Radio size={12} className="animate-spin-slow" />
                  <span>Host Playhead [02:15]</span>
                </div>
              </div>

              {/* Viewer Nodes */}
              <div className="absolute bottom-4 inset-x-4 flex justify-between z-10">
                <div className="px-2.5 py-1 rounded-xl bg-white/[0.04] border border-white/10 text-white font-mono text-[10px] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-blue animate-pulse" />
                  <span>Viewer A (Δ 0ms)</span>
                </div>
                <div className="px-2.5 py-1 rounded-xl bg-white/[0.04] border border-white/10 text-white font-mono text-[10px] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent-purple animate-pulse" />
                  <span>Viewer B (Δ 2ms)</span>
                </div>
                <div className="px-2.5 py-1 rounded-xl bg-white/[0.04] border border-white/10 text-white font-mono text-[10px] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Viewer C (Δ 0ms)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between text-[11px] text-text-muted">
            <span>Transmission Protocol: Binary Frame Packets</span>
            <span className="font-mono text-emerald-400">Zero packet loss</span>
          </div>
        </div>
      </section>

      {/* Bottom CTA Card */}
      <section className="text-center p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#0B0B18]/90 to-[#070710]/95 border border-white/10 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent-purple/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-xl mx-auto space-y-4">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Ready to experience Zync?
          </h3>
          <p className="text-xs sm:text-sm text-text-muted">
            Create an instant synchronized room in seconds. No extensions, no downloads, perfectly in sync.
          </p>
          <div className="pt-2">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-accent-purple/85 hover:bg-accent-purple border border-accent-purple/50 text-white font-semibold text-xs sm:text-sm shadow-xl shadow-accent-purple/25 hover:shadow-accent-purple/40 active:scale-95 transition"
            >
              <span>Get Started</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
