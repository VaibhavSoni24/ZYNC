import React from 'react';
import { Code, Zap, Sparkles, Layers } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-blue/10 text-accent-blue border border-accent-blue/20 text-xs font-semibold">
          <Sparkles size={14} />
          <span>Project & Engineering</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary">
          About Zync
        </h1>
        <p className="text-xs sm:text-sm text-text-muted max-w-xl mx-auto">
          Synchronized real-time video playback designed for zero lag, deep social connection, and effortless streaming.
        </p>
      </div>

      {/* Mission & Product Section */}
      <div className="bg-bg-surface border border-border-subtle rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
        <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
          <Zap size={20} className="text-accent-blue" />
          <span>What is Zync?</span>
        </h2>
        <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
          Watching videos together over the internet shouldn't require counting down "3, 2, 1, play" or dealing with 10-second playback desyncs. Zync solves this with a high-precision WebSocket architecture that synchronizes the YouTube IFrame player across all connected clients in real time.
        </p>
        <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
          Whether you're streaming a live podcast, breaking down tutorials with peers, or hosting movie night with friends across continents, Zync ensures everyone witnesses every punchline, clutch play, and beat drop at the exact same fraction of a second.
        </p>
      </div>

      {/* Technical Architecture Overview */}
      <div className="bg-bg-surface border border-border-subtle rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
          <Layers size={20} className="text-accent-purple" />
          <span>Under the Hood</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-bg-elevated p-4 rounded-2xl border border-border-subtle">
            <h3 className="text-xs font-bold text-text-primary mb-1">Real-Time State Synchronization</h3>
            <p className="text-[11px] text-text-muted leading-relaxed">
              Utilizes persistent WebSockets with periodic drift correction algorithms. When the host scrubs or pauses, timestamps and play states are instantly negotiated and aligned across all viewer playheads.
            </p>
          </div>

          <div className="bg-bg-elevated p-4 rounded-2xl border border-border-subtle">
            <h3 className="text-xs font-bold text-text-primary mb-1">Server-Side RBAC Enforcement</h3>
            <p className="text-[11px] text-text-muted leading-relaxed">
              Every action (play, pause, seek, video change, chat, reactions) is cryptographically validated on the backend. Client UI hides restricted controls, but backend guards guarantee absolute authority.
            </p>
          </div>

          <div className="bg-bg-elevated p-4 rounded-2xl border border-border-subtle">
            <h3 className="text-xs font-bold text-text-primary mb-1">Horizontal Scalability with Redis</h3>
            <p className="text-[11px] text-text-muted leading-relaxed">
              Engineered with an OOP WebSocket server architecture paired with the official Socket.IO Redis adapter, allowing real-time watch rooms to seamlessly distribute across multi-node server clusters.
            </p>
          </div>

          <div className="bg-bg-elevated p-4 rounded-2xl border border-border-subtle">
            <h3 className="text-xs font-bold text-text-primary mb-1">Ephemeral Security & OTP</h3>
            <p className="text-[11px] text-text-muted leading-relaxed">
              User registration leverages 6-digit cryptographic verification codes sent via Brevo and stored in Redis with TTLs, preventing database clutter from unverified signups.
            </p>
          </div>
        </div>
      </div>

      {/* Developer Profile: Vaibhav Soni */}
      <div className="bg-gradient-to-r from-bg-surface via-bg-elevated to-bg-surface border border-border-subtle rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="w-20 h-20 rounded-2xl gradient-brand flex items-center justify-center text-white text-2xl font-bold shadow-lg flex-shrink-0">
            VS
          </div>
          <div>
            <h2 className="text-xl font-bold text-text-primary text-center sm:text-left">
              Developed by Vaibhav Soni
            </h2>
            <p className="text-xs text-accent-blue font-medium mt-0.5 text-center sm:text-left">
              Full-Stack Software Engineer & Distributed Systems Enthusiast
            </p>
            <p className="text-xs text-text-muted mt-2 leading-relaxed text-center sm:text-left">
              Passionate about building responsive, real-time web applications with clean design aesthetics, modular object-oriented architecture, and robust distributed state management.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-border-subtle flex flex-wrap items-center justify-between gap-4 text-xs text-text-muted">
          <div className="flex items-center gap-2">
            <Code size={14} className="text-accent-blue" />
            <span>TypeScript • React • Node.js • Socket.IO • PostgreSQL</span>
          </div>
          <a
            href="https://github.com/VaibhavSoni24"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-primary hover:text-accent-blue font-medium flex items-center gap-1 transition"
          >
            <span>GitHub Profile</span>
            <span>&rarr;</span>
          </a>
        </div>
      </div>
    </div>
  );
};
