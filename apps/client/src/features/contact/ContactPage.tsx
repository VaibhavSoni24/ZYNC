import React, { useState } from 'react';
import {
  Mail,
  Send,
  CheckCircle2,
  User,
  Github,
  Copy,
  Check,
  Sparkles,
  Clock,
  ShieldCheck,
  ArrowUpRight
} from 'lucide-react';
import { apiRequest } from '../../lib/api';

const TOPIC_PRESETS = [
  'Architecture & Code',
  'Feature Suggestion',
  'Bug Report',
  'Collaboration',
  'General Inquiry'
];

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [selectedTopic, setSelectedTopic] = useState<string>('General Inquiry');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const emailAddress = 'vaibhavsoni280506@gmail.com';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(emailAddress);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2200);
  };

  const handleTopicSelect = (topic: string) => {
    setSelectedTopic(topic);
    if (!formData.message.startsWith(`[${topic}]`)) {
      // If previous topic was in square brackets, replace it, otherwise prepend
      const cleanMessage = formData.message.replace(/^\[.*?\]\s*/, '');
      setFormData(prev => ({
        ...prev,
        message: `[${topic}] ${cleanMessage}`
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Ensure the topic is tagged in the message if not already present
      const finalMessage = formData.message.startsWith('[')
        ? formData.message
        : `[${selectedTopic}] ${formData.message}`;

      const res = await apiRequest('/api/contact', {
        method: 'POST',
        data: {
          name: formData.name.trim(),
          email: formData.email.trim(),
          message: finalMessage.trim()
        }
      });

      if (res.success) {
        setSuccess(true);
        setFormData({ name: '', email: '', message: '' });
      } else {
        setError(res.error || 'Failed to dispatch message. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to send message. Please reach out directly to vaibhavsoni280506@gmail.com.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden py-12 sm:py-20 text-text-primary">
      {/* ========================================================================= */}
      {/* 3D BLURRED DEPTH SHAPES IN BACKGROUND (Optical Spatial Depth Vibe)        */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none -z-10">
        {/* 3D Blurred Sphere (Top-Left Depth Anchor) */}
        <div className="absolute -top-10 -left-12 sm:top-12 sm:left-10 w-72 sm:w-96 h-72 sm:h-96 rounded-full opacity-45 blur-[55px] animate-float-slow">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <defs>
              <radialGradient id="sphereGrad1" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#60A5FA" />
                <stop offset="45%" stopColor="#2563EB" />
                <stop offset="85%" stopColor="#1E1B4B" />
                <stop offset="100%" stopColor="#0B0F19" />
              </radialGradient>
            </defs>
            <circle cx="100" cy="100" r="95" fill="url(#sphereGrad1)" />
          </svg>
        </div>

        {/* 3D Blurred Faceted Polyhedron (Top-Right Depth Dimension) */}
        <div className="absolute top-28 -right-16 sm:top-36 sm:right-12 w-80 sm:w-[420px] h-80 sm:h-[420px] opacity-40 blur-[50px] animate-float-reverse">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <defs>
              <linearGradient id="facetTop" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E9D5FF" />
                <stop offset="100%" stopColor="#9333EA" />
              </linearGradient>
              <linearGradient id="facetLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#A855F7" />
                <stop offset="100%" stopColor="#581C87" />
              </linearGradient>
              <linearGradient id="facetRight" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7E22CE" />
                <stop offset="100%" stopColor="#2E1065" />
              </linearGradient>
            </defs>
            <polygon points="100,20 180,80 100,140 20,80" fill="url(#facetTop)" />
            <polygon points="20,80 100,140 100,190 20,130" fill="url(#facetLeft)" />
            <polygon points="180,80 100,140 100,190 180,130" fill="url(#facetRight)" />
          </svg>
        </div>

        {/* 3D Blurred Toroidal Ring (Bottom-Center Depth Accent) */}
        <div className="absolute -bottom-20 left-1/3 -translate-x-1/2 w-96 sm:w-[500px] h-96 sm:h-[500px] opacity-35 blur-[65px] animate-float-slow">
          <svg viewBox="0 0 300 300" className="w-full h-full">
            <defs>
              <radialGradient id="ringGrad" cx="50%" cy="50%" r="50%">
                <stop offset="40%" stopColor="transparent" />
                <stop offset="70%" stopColor="#3B82F6" />
                <stop offset="90%" stopColor="#9333EA" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            </defs>
            <circle cx="150" cy="150" r="130" fill="none" stroke="url(#ringGrad)" strokeWidth="48" />
          </svg>
        </div>

        {/* Cinematic Ambient Glow Center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[400px] bg-gradient-to-r from-accent-blue/10 via-accent-purple/15 to-accent-blue/10 blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 lg:space-y-16 relative z-10">
        {/* ========================================================================= */}
        {/* HERO SECTION                                                              */}
        {/* ========================================================================= */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-xl text-xs font-medium text-text-muted">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white/90">Direct Transmission Channel</span>
            <span className="text-white/30">•</span>
            <span className="text-accent-blue font-mono text-[11px]">Brevo SMTP Direct</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
            Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-blue via-accent-purple to-cyan-400">Touch</span>
          </h1>

          <p className="text-sm sm:text-base text-text-muted leading-relaxed max-w-2xl mx-auto">
            Have questions regarding Zync's distributed synchronization engine, feedback,
            or ideas for collaboration? Send a direct transmission straight to Vaibhav.
          </p>
        </div>

        {/* ========================================================================= */}
        {/* MAIN 2-COLUMN LUXURY INTERFACE                                            */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* --------------------------------------------------------------------- */}
          {/* LEFT COLUMN: DEVELOPER PROFILE & DIRECT CHANNELS (5 cols)             */}
          {/* --------------------------------------------------------------------- */}
          <div className="lg:col-span-5 space-y-6">
            {/* Developer Card */}
            <div className="rounded-3xl p-6 sm:p-8 bg-[#0a0a14]/80 border border-white/[0.08] backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group">
              {/* Subtle card glow */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-accent-blue/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 space-y-6">
                {/* Photo & Status */}
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src="/vaibhav.jpeg"
                      alt="Vaibhav Soni"
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white/10 shadow-lg shadow-black/40 group-hover:border-accent-blue/50 transition-colors duration-300"
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#0a0a14] flex items-center justify-center">
                      <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping absolute opacity-75" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 relative" />
                    </div>
                  </div>

                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
                      Vaibhav Soni
                    </h2>
                    <p className="text-xs text-accent-blue font-medium mt-0.5">
                      Creator & Full-Stack Architect
                    </p>
                    <div className="inline-flex items-center gap-1.5 mt-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-400 font-medium">
                      <span>Available for inquiries & collabs</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-text-muted leading-relaxed">
                  Architecting synchronized real-time systems, low-latency WebSocket & WebRTC mesh protocols,
                  and modern reactive web applications.
                </p>

                {/* Direct Contact Links */}
                <div className="space-y-3 pt-2">
                  {/* Email Card with Quick Copy */}
                  <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-accent-blue/40 transition-colors flex items-center justify-between gap-3 group/mail">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-accent-blue/15 text-accent-blue flex items-center justify-center flex-shrink-0 border border-accent-blue/30 shadow-[0_0_12px_rgba(46,124,246,0.2)]">
                        <Mail size={16} />
                      </div>
                      <div className="min-w-0">
                        <span className="block text-[10px] uppercase font-bold tracking-wider text-text-muted">Direct Email</span>
                        <a
                          href={`mailto:${emailAddress}`}
                          className="block text-xs font-semibold text-white hover:text-accent-blue truncate transition-colors"
                          title={emailAddress}
                        >
                          {emailAddress}
                        </a>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/[0.08] text-text-muted hover:text-white transition-all flex-shrink-0"
                      title="Copy email to clipboard"
                    >
                      {copiedEmail ? (
                        <Check size={14} className="text-emerald-400" />
                      ) : (
                        <Copy size={14} />
                      )}
                    </button>
                  </div>

                  {/* GitHub Profile Card */}
                  <a
                    href="https://github.com/VaibhavSoni24"
                    target="_blank"
                    rel="noreferrer"
                    className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-accent-purple/40 transition-colors flex items-center justify-between gap-3 group/git"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-accent-purple/15 text-accent-purple flex items-center justify-center flex-shrink-0 border border-accent-purple/30 shadow-[0_0_12px_rgba(155,60,255,0.2)]">
                        <Github size={16} />
                      </div>
                      <div className="min-w-0">
                        <span className="block text-[10px] uppercase font-bold tracking-wider text-text-muted">GitHub Repository</span>
                        <span className="block text-xs font-semibold text-white group-hover/git:text-accent-purple truncate transition-colors">
                          github.com/VaibhavSoni24
                        </span>
                      </div>
                    </div>
                    <ArrowUpRight size={14} className="text-text-muted group-hover/git:text-accent-purple group-hover/git:translate-x-0.5 group-hover/git:-translate-y-0.5 transition-transform flex-shrink-0" />
                  </a>
                </div>
              </div>
            </div>

            {/* Architecture Relay Details Card */}
            <div className="rounded-3xl p-6 bg-[#0a0a14]/60 border border-white/[0.06] backdrop-blur-xl space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-white">
                <ShieldCheck size={16} className="text-accent-blue" />
                <span>Encrypted Direct Delivery</span>
              </div>
              <p className="text-[11px] text-text-muted leading-relaxed">
                Messages submitted through this terminal are authenticated and dispatched directly to
                Vaibhav's personal mailbox via Brevo's verified transactional infrastructure.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-1 text-[11px]">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                  <div className="flex items-center gap-1.5 text-text-muted mb-1">
                    <Clock size={12} className="text-accent-purple" />
                    <span>Response Time</span>
                  </div>
                  <span className="text-white font-semibold">&lt; 24 Hours</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                  <div className="flex items-center gap-1.5 text-text-muted mb-1">
                    <Sparkles size={12} className="text-cyan-400" />
                    <span>Delivery Status</span>
                  </div>
                  <span className="text-emerald-400 font-semibold">100% Reliable</span>
                </div>
              </div>
            </div>
          </div>

          {/* --------------------------------------------------------------------- */}
          {/* RIGHT COLUMN: LUXURY INTERACTIVE CONTACT FORM (7 cols)               */}
          {/* --------------------------------------------------------------------- */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl p-6 sm:p-10 bg-[#0a0a14]/85 border border-white/[0.08] backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.5)] relative">
              {/* Card Ambient Glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-accent-purple/15 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 space-y-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    Transmit a Message
                  </h2>
                  <p className="text-xs sm:text-sm text-text-muted mt-1">
                    Fill in your details below to start a direct line of communication.
                  </p>
                </div>

                {/* Topic Selector Pills */}
                <div>
                  <label className="block text-[11px] uppercase font-bold tracking-wider text-text-muted mb-2.5">
                    Select Inquiry Category
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {TOPIC_PRESETS.map((topic) => {
                      const isSelected = selectedTopic === topic;
                      return (
                        <button
                          key={topic}
                          type="button"
                          onClick={() => handleTopicSelect(topic)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                            isSelected
                              ? 'bg-gradient-to-r from-accent-blue to-accent-purple text-white shadow-[0_0_15px_rgba(155,60,255,0.35)] scale-[1.02]'
                              : 'bg-white/[0.04] text-text-muted hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
                          }`}
                        >
                          {topic}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Success State Banner */}
                {success && (
                  <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 space-y-3 animate-fade-in shadow-[0_0_30px_rgba(16,185,129,0.15)]">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 flex-shrink-0">
                        <CheckCircle2 size={22} />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">Transmission Delivered Successfully!</h3>
                        <p className="text-xs text-emerald-300/90 mt-0.5">
                          Your message was dispatched to Vaibhav Soni ({emailAddress}).
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-text-muted leading-relaxed pl-11">
                      Thank you for reaching out. A response will be sent directly to your email address shortly.
                    </p>
                    <div className="pl-11 pt-1">
                      <button
                        type="button"
                        onClick={() => setSuccess(false)}
                        className="text-xs font-semibold text-white underline underline-offset-4 hover:text-accent-blue transition-colors"
                      >
                        Send another transmission
                      </button>
                    </div>
                  </div>
                )}

                {/* Error Banner */}
                {error && (
                  <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-3 animate-fade-in">
                    <div className="w-2 h-2 rounded-full bg-red-400 animate-ping flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Contact Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    {/* Name Input */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-text-secondary">
                        Your Full Name
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          placeholder="Taylor Vance"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/20 rounded-2xl px-4 py-3 pl-10 text-xs sm:text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none transition"
                        />
                        <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                      </div>
                    </div>

                    {/* Email Input */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-text-secondary">
                        Your Email Address
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          required
                          placeholder="taylor@domain.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/20 rounded-2xl px-4 py-3 pl-10 text-xs sm:text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none transition"
                        />
                        <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Message Input */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-semibold text-text-secondary">
                        Message Content
                      </label>
                      <span className="text-[10px] text-text-muted font-mono">
                        {formData.message.length} / 2000
                      </span>
                    </div>
                    <div className="relative">
                      <textarea
                        required
                        rows={6}
                        maxLength={2000}
                        placeholder={`Share your thoughts, suggestions, or collaboration request...`}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/20 rounded-2xl px-4 py-3 text-xs sm:text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none transition resize-none leading-relaxed"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-6 rounded-2xl gradient-brand text-white font-semibold text-xs sm:text-sm shadow-xl shadow-accent-blue/20 hover:shadow-accent-blue/40 hover:opacity-95 transition-all active:scale-[0.99] flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        <span>Dispatching Transmission...</span>
                      </>
                    ) : (
                      <>
                        <Send size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        <span>Transmit Message to Vaibhav</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
