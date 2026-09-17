import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  User,
  Lock,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  RotateCcw,
  CheckCircle2,
  Eye,
  EyeOff,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { apiRequest } from '../../lib/api';
import { Interactive3DBlob, MascotState } from '../../components/Mascot/Interactive3DBlob';

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialIdentifier = searchParams.get('identifier') || '';

  // Stepper state: 'request' (Step 1) | 'verify' (Step 2) | 'complete' (Step 3)
  const [step, setStep] = useState<'request' | 'verify' | 'complete'>('request');

  // Form states
  const [identifier, setIdentifier] = useState(initialIdentifier);
  const [targetEmail, setTargetEmail] = useState('');
  const [maskedEmail, setMaskedEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Status & Mascot states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [cooldown, setCooldown] = useState(60);
  const [mascotState, setMascotState] = useState<MascotState>('idle');

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldown <= 0 || step !== 'verify') return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown, step]);

  // Step 1: Submit identifier to receive OTP
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanIdentifier = identifier.trim();
    if (!cleanIdentifier) {
      setError('Please enter your username or registered email address');
      setMascotState('error');
      return;
    }

    setError(null);
    setLoading(true);
    setMascotState('typing');

    try {
      const res = await apiRequest('/api/auth/forgot-password', {
        method: 'POST',
        data: { identifier: cleanIdentifier }
      });

      if (res.success && res.data) {
        setTargetEmail(res.data.email);
        setMaskedEmail(res.data.maskedEmail || res.data.email);
        setStep('verify');
        setCooldown(60);
        setMascotState('idle');
      } else {
        throw new Error(res.error || 'Failed to send recovery code');
      }
    } catch (err: any) {
      setError(err.message || 'No account found matching this credential.');
      setMascotState('error');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (cooldown > 0 || !targetEmail) return;
    setError(null);
    try {
      const res = await apiRequest('/api/auth/resend-reset-otp', {
        method: 'POST',
        data: { email: targetEmail }
      });

      if (res.success) {
        setCooldown(60);
        setResendSuccess(true);
        setTimeout(() => setResendSuccess(false), 4000);
      } else {
        throw new Error(res.error || 'Failed to resend code');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to resend verification code');
      setMascotState('error');
    }
  };

  // Step 2: Submit OTP + New Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanOtp = otp.trim();
    if (cleanOtp.length !== 6) {
      setError('Please enter the complete 6-digit verification code.');
      setMascotState('error');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      setMascotState('error');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      setMascotState('error');
      return;
    }

    setLoading(true);
    setMascotState('typing');

    try {
      const res = await apiRequest('/api/auth/reset-password', {
        method: 'POST',
        data: {
          email: targetEmail,
          otp: cleanOtp,
          newPassword
        }
      });

      if (res.success) {
        setStep('complete');
        setMascotState('success');
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
        setTimeout(() => {
          navigate('/login');
        }, 3500);
      } else {
        throw new Error(res.error || 'Failed to reset password');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to reset password. Please check your code.');
      setMascotState('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] py-12 sm:py-20 text-text-primary">
      {/* 3D Blurred Ambient Background Lighting */}
      <div className="absolute inset-0 pointer-events-none select-none -z-10 overflow-hidden">
        <div className="absolute -top-10 -left-12 sm:top-12 sm:left-10 w-72 sm:w-96 h-72 sm:h-96 rounded-full opacity-45 blur-[55px] animate-float-slow">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <defs>
              <radialGradient id="forgotSphereGrad" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#60A5FA" />
                <stop offset="45%" stopColor="#2563EB" />
                <stop offset="85%" stopColor="#1E1B4B" />
                <stop offset="100%" stopColor="#0B0F19" />
              </radialGradient>
            </defs>
            <circle cx="100" cy="100" r="95" fill="url(#forgotSphereGrad)" />
          </svg>
        </div>

        <div className="absolute top-28 -right-16 sm:top-36 sm:right-12 w-80 sm:w-[420px] h-80 sm:h-[420px] opacity-40 blur-[50px] animate-float-reverse">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <defs>
              <linearGradient id="forgotFacetTop" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E9D5FF" />
                <stop offset="100%" stopColor="#9333EA" />
              </linearGradient>
            </defs>
            <polygon points="100,20 180,80 100,140 20,80" fill="url(#forgotFacetTop)" />
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-xs font-semibold text-text-muted hover:text-white transition px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-white/20"
          >
            <ArrowLeft size={14} /> Back to Sign In
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* ================================================================= */}
          {/* LEFT COLUMN: 3D CLOUD-BLOB MASCOT & GUIDANCE (5 cols)             */}
          {/* ================================================================= */}
          <div className="lg:col-span-5 flex flex-col items-center text-center space-y-6 mx-auto lg:mx-0 w-full max-w-md lg:max-w-none">
            <div className="w-full flex justify-center">
              <Interactive3DBlob state={mascotState} size={300} />
            </div>

            <div className="space-y-3 max-w-md mx-auto">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Account{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-blue via-accent-purple to-cyan-400">
                  Recovery
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                {step === 'request' &&
                  "Forgot your key? No worries! Just enter your username or registered email and we'll dispatch an instant 6-digit verification code."}
                {step === 'verify' &&
                  "We've sent a 6-digit code to your inbox. Enter it along with your new password to regain access immediately."}
                {step === 'complete' &&
                  "Password updated successfully! You can now sign back in with your updated credentials."}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[11px] text-text-muted">
                <ShieldCheck size={13} className="text-accent-blue" />
                <span>Encrypted bcrypt Hash</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[11px] text-text-muted">
                <Sparkles size={13} className="text-accent-purple" />
                <span>Instant Restoration</span>
              </div>
            </div>
          </div>

          {/* ================================================================= */}
          {/* RIGHT COLUMN: LUXURY GLASSMORPHIC RECOVERY CARD (7 cols)          */}
          {/* ================================================================= */}
          <div className="lg:col-span-7 flex justify-center lg:justify-end">
            <div className="w-full max-w-lg rounded-3xl p-7 sm:p-10 bg-[#0a0a14]/85 border border-white/[0.08] backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.5)] relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-blue via-accent-purple to-cyan-400" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-60 h-28 bg-accent-blue/15 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 space-y-6">
                {/* Header */}
                <div>
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                      {step === 'request' && 'Reset Password'}
                      {step === 'verify' && 'Verify & Set Password'}
                      {step === 'complete' && 'Success!'}
                    </h2>
                    <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/10 text-accent-blue font-semibold">
                      {step === 'request' && 'Step 1 of 2'}
                      {step === 'verify' && 'Step 2 of 2'}
                      {step === 'complete' && 'Complete'}
                    </span>
                  </div>
                  <p className="text-xs text-text-muted mt-1">
                    {step === 'request' && 'Provide your credentials to request an authenticated OTP code.'}
                    {step === 'verify' && `Verification code dispatched to ${maskedEmail || 'your email'}.`}
                    {step === 'complete' && 'Your account security has been restored.'}
                  </p>
                </div>

                {/* Error Banner */}
                {error && (
                  <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2.5 animate-fade-in">
                    <span className="w-2 h-2 rounded-full bg-red-400 animate-ping flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Resend success banner */}
                {resendSuccess && (
                  <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2.5 animate-fade-in">
                    <CheckCircle2 size={16} />
                    <span>A fresh verification code has been dispatched to your email!</span>
                  </div>
                )}

                {/* STEP 1: REQUEST FORM */}
                {step === 'request' && (
                  <form onSubmit={handleRequestOtp} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-text-secondary">
                        Username or Email Address
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          autoFocus
                          placeholder="your_username or you@example.com"
                          value={identifier}
                          onFocus={() => setMascotState('typing')}
                          onBlur={() => setMascotState('idle')}
                          onChange={(e) => {
                            setIdentifier(e.target.value);
                            setError(null);
                          }}
                          className="w-full pl-10 pr-4 py-3 bg-white/[0.04] border border-white/[0.08] focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/20 rounded-2xl text-xs sm:text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none transition"
                        />
                        <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading || !identifier.trim()}
                      className="w-full mt-3 py-3.5 px-6 rounded-2xl gradient-brand text-white font-semibold text-xs sm:text-sm shadow-xl shadow-accent-blue/20 hover:shadow-accent-blue/40 hover:opacity-95 transition-all active:scale-[0.99] flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                          <span>Dispatching Code...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Recovery Code</span>
                          <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* STEP 2: VERIFY OTP & ENTER NEW PASSWORD */}
                {step === 'verify' && (
                  <form onSubmit={handleResetPassword} className="space-y-4">
                    {/* OTP Input */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-semibold text-text-secondary">
                          6-Digit Verification Code
                        </label>
                        <button
                          type="button"
                          onClick={handleResendOtp}
                          disabled={cooldown > 0}
                          className="text-[11px] font-mono flex items-center gap-1 text-accent-blue hover:text-blue-300 disabled:text-text-muted/50 transition disabled:cursor-not-allowed"
                        >
                          <RotateCcw size={11} className={cooldown > 0 ? '' : 'hover:rotate-180 transition-transform'} />
                          {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend Code'}
                        </button>
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          autoFocus
                          maxLength={6}
                          placeholder="123456"
                          value={otp}
                          onFocus={() => setMascotState('typing')}
                          onBlur={() => setMascotState('idle')}
                          onChange={(e) => {
                            setOtp(e.target.value.replace(/\D/g, ''));
                            setError(null);
                          }}
                          className="w-full pl-10 pr-4 py-3 bg-white/[0.04] border border-white/[0.08] focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/20 rounded-2xl font-mono text-center tracking-[0.35em] text-lg font-bold text-accent-blue placeholder:tracking-normal placeholder:font-sans placeholder:text-xs placeholder:text-text-muted/50 focus:outline-none transition"
                        />
                        <KeyRound size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                      </div>
                    </div>

                    {/* New Password */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-text-secondary">
                        New Password (min 6 characters)
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          placeholder="••••••••••••"
                          value={newPassword}
                          onFocus={() => setMascotState('password')}
                          onBlur={() => setMascotState('idle')}
                          onChange={(e) => {
                            setNewPassword(e.target.value);
                            setError(null);
                          }}
                          className="w-full pl-10 pr-11 py-3 bg-white/[0.04] border border-white/[0.08] focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/20 rounded-2xl text-xs sm:text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none transition"
                        />
                        <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition"
                        >
                          {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-text-secondary">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          placeholder="••••••••••••"
                          value={confirmPassword}
                          onFocus={() => setMascotState('password')}
                          onBlur={() => setMascotState('idle')}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            setError(null);
                          }}
                          className="w-full pl-10 pr-4 py-3 bg-white/[0.04] border border-white/[0.08] focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/20 rounded-2xl text-xs sm:text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none transition"
                        />
                        <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setStep('request');
                          setError(null);
                        }}
                        className="py-3.5 px-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-text-muted hover:text-white text-xs font-semibold transition"
                      >
                        Change Email
                      </button>
                      <button
                        type="submit"
                        disabled={loading || otp.length !== 6 || !newPassword || !confirmPassword}
                        className="flex-1 py-3.5 px-6 rounded-2xl gradient-brand text-white font-semibold text-xs sm:text-sm shadow-xl shadow-accent-blue/20 hover:shadow-accent-blue/40 hover:opacity-95 transition-all active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <>
                            <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                            <span>Updating Password...</span>
                          </>
                        ) : (
                          <>
                            <span>Set New Password</span>
                            <ArrowRight size={15} />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}

                {/* STEP 3: SUCCESS STATE */}
                {step === 'complete' && (
                  <div className="text-center py-6 space-y-4 animate-fade-in">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                      <CheckCircle2 size={32} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Password Reset Successfully</h3>
                      <p className="text-xs text-text-muted mt-1.5 max-w-xs mx-auto">
                        Your account has been secured with your new password. Redirecting to sign in...
                      </p>
                    </div>
                    <Link
                      to="/login"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl gradient-brand text-white text-xs font-bold shadow-lg shadow-accent-blue/25 hover:opacity-95 transition"
                    >
                      <span>Sign In Now</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                )}

                {/* Card Footer */}
                <div className="pt-2 text-center text-xs text-text-muted border-t border-white/[0.06]">
                  Remember your password?{' '}
                  <Link to="/login" className="text-accent-blue font-semibold hover:underline">
                    Sign In instead
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
