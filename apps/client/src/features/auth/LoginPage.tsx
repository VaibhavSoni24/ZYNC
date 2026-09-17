import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, ArrowRight, Shield, Radio } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { Interactive3DBlob, MascotState } from '../../components/Mascot/Interactive3DBlob';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, error, clearError, isLoading } = useAuthStore();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [mascotState, setMascotState] = useState<MascotState>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password) return;

    clearError();
    setMascotState('typing');

    try {
      await login(identifier.trim(), password);
      setMascotState('success');
      setTimeout(() => {
        navigate('/home');
      }, 600);
    } catch {
      setMascotState('error');
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] py-12 sm:py-20 text-text-primary">
      {/* 3D Blurred Depth Shapes in Background (No hard bottom clipping) */}
      <div className="absolute inset-0 pointer-events-none select-none -z-10 overflow-hidden">
        <div className="absolute -top-10 -left-12 sm:top-12 sm:left-10 w-72 sm:w-96 h-72 sm:h-96 rounded-full opacity-45 blur-[55px] animate-float-slow">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <defs>
              <radialGradient id="loginSphereGrad" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#60A5FA" />
                <stop offset="45%" stopColor="#2563EB" />
                <stop offset="85%" stopColor="#1E1B4B" />
                <stop offset="100%" stopColor="#0B0F19" />
              </radialGradient>
            </defs>
            <circle cx="100" cy="100" r="95" fill="url(#loginSphereGrad)" />
          </svg>
        </div>

        <div className="absolute top-28 -right-16 sm:top-36 sm:right-12 w-80 sm:w-[420px] h-80 sm:h-[420px] opacity-40 blur-[50px] animate-float-reverse">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <defs>
              <linearGradient id="loginFacetTop" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E9D5FF" />
                <stop offset="100%" stopColor="#9333EA" />
              </linearGradient>
              <linearGradient id="loginFacetLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#A855F7" />
                <stop offset="100%" stopColor="#581C87" />
              </linearGradient>
            </defs>
            <polygon points="100,20 180,80 100,140 20,80" fill="url(#loginFacetTop)" />
            <polygon points="20,80 100,140 100,190 20,130" fill="url(#loginFacetLeft)" />
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* ================================================================= */}
          {/* LEFT COLUMN: 3D CLOUD-BLOB COMPANION & WELCOME HERO (5 cols)     */}
          {/* ================================================================= */}
          <div className="lg:col-span-5 flex flex-col items-center text-center space-y-6 mx-auto lg:mx-0 w-full max-w-md lg:max-w-none">
            {/* Interactive 3D Cloud-Blob Mascot */}
            <div className="w-full flex justify-center">
              <Interactive3DBlob state={mascotState} size={300} />
            </div>

            <div className="space-y-3 max-w-md mx-auto">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Welcome Back to{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-blue via-accent-purple to-cyan-400">
                  Zync
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                Connect seamlessly with friends across the globe for synchronized YouTube watch sessions with sub-second latency.
              </p>
            </div>

            {/* Feature Highlights Pill */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[11px] text-text-muted">
                <Radio size={12} className="text-accent-blue" />
                <span>60Hz Live Playhead</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[11px] text-text-muted">
                <Shield size={12} className="text-accent-purple" />
                <span>Zero Audio Drift</span>
              </div>
            </div>
          </div>

          {/* ================================================================= */}
          {/* RIGHT COLUMN: LUXURY GLASSMORPHIC SIGN-IN CARD (7 cols)           */}
          {/* ================================================================= */}
          <div className="lg:col-span-7 flex justify-center lg:justify-end">
            <div className="w-full max-w-lg rounded-3xl p-7 sm:p-10 bg-[#0a0a14]/85 border border-white/[0.08] backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.5)] relative overflow-hidden">
              {/* Subtle top brand accent line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-blue via-accent-purple to-cyan-400" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-60 h-28 bg-accent-blue/15 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 space-y-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    Sign In
                  </h2>
                  <p className="text-xs text-text-muted mt-1">
                    Enter your credentials to access your rooms and saved parties.
                  </p>
                </div>

                {error && (
                  <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2.5 animate-fade-in">
                    <span className="w-2 h-2 rounded-full bg-red-400 animate-ping flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Username or Email */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-text-secondary">
                      Username or Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="your_username or you@example.com"
                        value={identifier}
                        onFocus={() => setMascotState('typing')}
                        onBlur={() => setMascotState('idle')}
                        onChange={(e) => setIdentifier(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white/[0.04] border border-white/[0.08] focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/20 rounded-2xl text-xs sm:text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none transition"
                      />
                      <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-semibold text-text-secondary">
                        Password
                      </label>
                      <Link
                        to="/forgot-password"
                        className="text-[11px] text-accent-blue hover:text-blue-400 transition font-medium hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <input
                        type="password"
                        required
                        placeholder="••••••••••••"
                        value={password}
                        onFocus={() => setMascotState('password')}
                        onBlur={() => setMascotState('idle')}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white/[0.04] border border-white/[0.08] focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/20 rounded-2xl text-xs sm:text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none transition"
                      />
                      <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 py-3.5 px-6 rounded-2xl gradient-brand text-white font-semibold text-xs sm:text-sm shadow-xl shadow-accent-blue/20 hover:shadow-accent-blue/40 hover:opacity-95 transition-all active:scale-[0.99] flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        <span>Signing In...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In to Zync</span>
                        <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>

                <div className="pt-2 text-center text-xs text-text-muted border-t border-white/[0.06]">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-accent-blue font-semibold hover:underline">
                    Create a free account
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
