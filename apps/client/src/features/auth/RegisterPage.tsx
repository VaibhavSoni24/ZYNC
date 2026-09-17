import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, AtSign, Mail, Lock, ArrowRight, Check, Film, Zap } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { Interactive3DBlob, MascotState } from '../../components/Mascot/Interactive3DBlob';
import {
  PRESET_AVATARS,
  AvatarIcon,
  PresetAvatarName,
  PRESET_AVATAR_DETAILS
} from '../../assets/avatars';
import { DateOfBirthPicker } from '../../components/Form/DateOfBirthPicker';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, error, clearError, isLoading } = useAuthStore();

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    dob: '',
    password: '',
    avatar: 'Comet' as PresetAvatarName,
    bio: ''
  });

  const [mascotState, setMascotState] = useState<MascotState>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!formData.dob) {
      setMascotState('error');
      return;
    }

    try {
      setMascotState('typing');
      const res = await register(formData);
      setMascotState('success');
      setTimeout(() => {
        navigate(`/verify-otp?email=${encodeURIComponent(res.email)}`);
      }, 600);
    } catch {
      setMascotState('error');
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] py-10 sm:py-16 text-text-primary">
      {/* 3D Blurred Depth Shapes in Background */}
      <div className="absolute inset-0 pointer-events-none select-none -z-10 overflow-hidden">
        <div className="absolute -top-10 -left-12 sm:top-12 sm:left-10 w-72 sm:w-96 h-72 sm:h-96 rounded-full opacity-45 blur-[55px] animate-float-slow">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <defs>
              <radialGradient id="regSphereGrad" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#60A5FA" />
                <stop offset="45%" stopColor="#2563EB" />
                <stop offset="85%" stopColor="#1E1B4B" />
                <stop offset="100%" stopColor="#0B0F19" />
              </radialGradient>
            </defs>
            <circle cx="100" cy="100" r="95" fill="url(#regSphereGrad)" />
          </svg>
        </div>

        <div className="absolute top-28 -right-16 sm:top-36 sm:right-12 w-80 sm:w-[420px] h-80 sm:h-[420px] opacity-40 blur-[50px] animate-float-reverse">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <defs>
              <linearGradient id="regFacetTop" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E9D5FF" />
                <stop offset="100%" stopColor="#9333EA" />
              </linearGradient>
              <linearGradient id="regFacetLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#A855F7" />
                <stop offset="100%" stopColor="#581C87" />
              </linearGradient>
            </defs>
            <polygon points="100,20 180,80 100,140 20,80" fill="url(#regFacetTop)" />
            <polygon points="20,80 100,140 100,190 20,130" fill="url(#regFacetLeft)" />
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* ================================================================= */}
          {/* LEFT COLUMN: 3D CLOUD-BLOB COMPANION & BRAND VALUE (5 cols)       */}
          {/* ================================================================= */}
          <div className="lg:col-span-5 flex flex-col items-center text-center space-y-6 lg:sticky lg:top-24 mx-auto lg:mx-0 w-full max-w-md lg:max-w-none">
            <div className="w-full flex justify-center">
              <Interactive3DBlob state={mascotState} size={300} />
            </div>

            <div className="space-y-3 max-w-md mx-auto">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Create Your{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-blue via-accent-purple to-cyan-400">
                  Zync Account
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                Join thousands of film enthusiasts, anime fans, and friends hosting synchronized live watch parties across the web.
              </p>
            </div>

            {/* Quick Benefits Cards */}
            <div className="w-full max-w-md space-y-2.5 pt-1 text-left">
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-accent-blue/20 text-accent-blue flex items-center justify-center flex-shrink-0">
                  <Zap size={16} />
                </div>
                <div>
                  <span className="block text-xs font-semibold text-white">Sub-Second Audio Synchronization</span>
                  <span className="block text-[10px] text-text-muted">Zero drift with WebSocket playhead telemetry.</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-accent-purple/20 text-accent-purple flex items-center justify-center flex-shrink-0">
                  <Film size={16} />
                </div>
                <div>
                  <span className="block text-xs font-semibold text-white">Live Floating Emoji Reactions</span>
                  <span className="block text-[10px] text-text-muted">Share every laugh and gasp in real-time.</span>
                </div>
              </div>
            </div>
          </div>

          {/* ================================================================= */}
          {/* RIGHT COLUMN: LUXURY REGISTRATION CARD (7 cols)                   */}
          {/* ================================================================= */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl p-6 sm:p-10 bg-[#0a0a14]/85 border border-white/[0.08] backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.5)] relative overflow-hidden">
              {/* Top gradient line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-blue via-accent-purple to-cyan-400" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-28 bg-accent-purple/15 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 space-y-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    Get Started with Zync
                  </h2>
                  <p className="text-xs text-text-muted mt-1">
                    Fill in your details below to receive your verification code.
                  </p>
                </div>

                {error && (
                  <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2.5 animate-fade-in">
                    <span className="w-2 h-2 rounded-full bg-red-400 animate-ping flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-text-secondary">Full Name</label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          placeholder="Alex Rivers"
                          value={formData.name}
                          onFocus={() => setMascotState('typing')}
                          onBlur={() => setMascotState('idle')}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full pl-10 pr-4 py-2.5 bg-white/[0.04] border border-white/[0.08] focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/20 rounded-2xl text-xs sm:text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none transition"
                        />
                        <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                      </div>
                    </div>

                    {/* Username */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-text-secondary">Username</label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          placeholder="alex_rivers"
                          value={formData.username}
                          onFocus={() => setMascotState('typing')}
                          onBlur={() => setMascotState('idle')}
                          onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase() })}
                          className="w-full pl-10 pr-4 py-2.5 bg-white/[0.04] border border-white/[0.08] focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/20 rounded-2xl text-xs sm:text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none transition"
                        />
                        <AtSign size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-text-secondary">Email Address</label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        placeholder="alex@example.com"
                        value={formData.email}
                        onFocus={() => setMascotState('typing')}
                        onBlur={() => setMascotState('idle')}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 bg-white/[0.04] border border-white/[0.08] focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/20 rounded-2xl text-xs sm:text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none transition"
                      />
                      <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                    </div>
                  </div>

                  {/* Date of Birth Picker (User-friendly segmented dropdowns) */}
                  <DateOfBirthPicker
                    value={formData.dob}
                    onChange={(dob) => setFormData({ ...formData, dob })}
                    onFocus={() => setMascotState('typing')}
                    onBlur={() => setMascotState('idle')}
                    required
                  />

                  {/* Password */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-text-secondary">Password</label>
                    <div className="relative">
                      <input
                        type="password"
                        required
                        placeholder="Min 6 characters"
                        value={formData.password}
                        onFocus={() => setMascotState('password')}
                        onBlur={() => setMascotState('idle')}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 bg-white/[0.04] border border-white/[0.08] focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/20 rounded-2xl text-xs sm:text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none transition"
                      />
                      <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                    </div>
                  </div>

                  {/* Redesigned Human-Like Avatars Grid (Duolingo Style with Names) */}
                  <div className="space-y-2.5 pt-1">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-semibold text-text-secondary">
                        Choose Your Character Avatar
                      </label>
                      <span className="text-[10px] text-accent-purple font-medium">
                        Selected: <strong className="text-white">{formData.avatar}</strong>
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                      {PRESET_AVATARS.map((av) => {
                        const isSelected = formData.avatar === av;
                        const details = PRESET_AVATAR_DETAILS[av];

                        return (
                          <button
                            key={av}
                            type="button"
                            onClick={() => setFormData({ ...formData, avatar: av })}
                            className={`p-2.5 rounded-2xl border transition-all flex flex-col items-center text-center relative group ${
                              isSelected
                                ? 'bg-gradient-to-b from-accent-blue/20 to-accent-purple/25 border-accent-blue shadow-[0_0_18px_rgba(46,124,246,0.35)] scale-[1.03]'
                                : 'bg-white/[0.02] border-white/[0.06] hover:border-white/20 hover:bg-white/[0.05]'
                            }`}
                          >
                            {/* Selected Badge */}
                            {isSelected && (
                              <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-accent-blue text-white flex items-center justify-center">
                                <Check size={10} strokeWidth={3} />
                              </div>
                            )}

                            <div className="transform group-hover:scale-110 transition-transform duration-200">
                              <AvatarIcon name={av} size={46} />
                            </div>

                            <span className="block text-xs font-bold text-white mt-1.5 leading-none">
                              {details.name}
                            </span>
                            <span className="block text-[9px] text-text-muted mt-0.5 leading-tight truncate max-w-full">
                              {details.role}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-3 py-3.5 px-6 rounded-2xl gradient-brand text-white font-semibold text-xs sm:text-sm shadow-xl shadow-accent-blue/20 hover:shadow-accent-blue/40 hover:opacity-95 transition-all active:scale-[0.99] flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        <span>Sending verification code...</span>
                      </>
                    ) : (
                      <>
                        <span>Create Account & Verify OTP</span>
                        <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>

                <div className="pt-2 text-center text-xs text-text-muted border-t border-white/[0.06]">
                  Already have an account?{' '}
                  <Link to="/login" className="text-accent-blue font-semibold hover:underline">
                    Sign In
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
