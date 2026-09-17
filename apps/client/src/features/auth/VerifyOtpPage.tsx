import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { RotateCcw, CheckCircle2, ArrowRight, ShieldCheck, MailCheck, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuthStore } from '../../store/useAuthStore';
import { Interactive3DBlob, MascotEmotionState } from '../../components/Mascot/Interactive3DBlob';

export const VerifyOtpPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get('email') || '';

  const { verifyOtp, resendOtp, error, clearError, isLoading } = useAuthStore();

  const [otp, setOtp] = useState('');
  const [cooldown, setCooldown] = useState(60);
  const [mascotState, setMascotState] = useState<MascotEmotionState>('idle');
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    if (!email) {
      navigate('/register');
    }
  }, [email, navigate]);

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) return;

    clearError();
    setMascotState('typing');

    try {
      await verifyOtp(email, otp);
      setMascotState('success');
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 }
      });
      setTimeout(() => {
        navigate('/home');
      }, 1100);
    } catch {
      setMascotState('error');
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    clearError();
    try {
      await resendOtp(email);
      setCooldown(60);
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 4000);
    } catch {
      // handled in store
    }
  };

  return (
    <div className="min-h-[85vh] py-10 sm:py-16 relative flex items-center justify-center">
      {/* Background ambient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-accent-blue/10 rounded-full blur-[110px] animate-pulse" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-accent-purple/10 rounded-full blur-[110px] animate-pulse" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* ================================================================= */}
          {/* LEFT COLUMN: 3D CLOUD-BLOB MASCOT & INFO (5 cols)                */}
          {/* ================================================================= */}
          <div className="lg:col-span-5 flex flex-col items-center text-center space-y-6 mx-auto lg:mx-0 w-full max-w-md lg:max-w-none">
            <div className="w-full flex justify-center">
              <Interactive3DBlob state={mascotState} size={300} />
            </div>

            <div className="space-y-3 max-w-md mx-auto">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Verify Your{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-blue via-accent-purple to-cyan-400">
                  Email
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                One quick check to protect your room sessions and link your personalized avatar identity.
              </p>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[11px] text-text-muted">
                <ShieldCheck size={12} className="text-accent-blue" />
                <span>Encrypted Verification</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[11px] text-text-muted">
                <Sparkles size={12} className="text-accent-purple" />
                <span>Instant Activation</span>
              </div>
            </div>
          </div>

          {/* ================================================================= */}
          {/* RIGHT COLUMN: LUXURY VERIFICATION CARD (7 cols)                  */}
          {/* ================================================================= */}
          <div className="lg:col-span-7 flex justify-center lg:justify-end">
            <div className="w-full max-w-lg rounded-3xl p-7 sm:p-10 bg-[#0a0a14]/85 border border-white/[0.08] backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.5)] relative overflow-hidden text-center">
              {/* Brand Accent Top Border */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-blue via-accent-purple to-cyan-400" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-60 h-28 bg-accent-blue/15 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 space-y-6">
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-blue/10 border border-accent-blue/20 text-accent-blue text-xs font-semibold mb-3">
                    <MailCheck size={13} />
                    <span>Code Sent</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    Enter Verification Code
                  </h2>
                  <p className="text-xs text-text-muted mt-1.5 leading-relaxed max-w-sm mx-auto">
                    We sent a 6-digit confirmation code to{' '}
                    <span className="text-white font-medium break-all">{email}</span>
                  </p>
                </div>

                {error && (
                  <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2.5 animate-fade-in text-left">
                    <span className="w-2 h-2 rounded-full bg-red-400 animate-ping flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {resendSuccess && (
                  <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2.5 animate-fade-in text-left">
                    <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
                    <span>A fresh verification code has been dispatched to your inbox!</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="relative max-w-[320px] mx-auto">
                    <input
                      type="text"
                      maxLength={6}
                      value={otp}
                      autoFocus
                      onFocus={() => setMascotState('typing')}
                      onBlur={() => setMascotState('idle')}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        setOtp(val);
                      }}
                      placeholder="••••••"
                      className="w-full text-center tracking-[14px] font-mono text-2xl font-bold py-3.5 bg-white/[0.03] border border-white/[0.09] rounded-2xl text-white placeholder:text-white/20 focus:outline-none focus:border-accent-blue focus:bg-white/[0.05] focus:ring-2 focus:ring-accent-blue/20 transition shadow-inner"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || otp.length !== 6}
                    className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-accent-blue via-accent-purple to-cyan-500 text-white font-bold text-sm shadow-[0_0_25px_rgba(59,130,246,0.35)] hover:shadow-[0_0_35px_rgba(59,130,246,0.5)] hover:opacity-95 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed transition duration-200 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Verifying Code...</span>
                      </span>
                    ) : (
                      <>
                        <span>Complete Registration</span>
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </form>

                <div className="pt-5 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between text-xs text-text-muted gap-3">
                  <span>Didn't receive the code?</span>
                  <button
                    type="button"
                    disabled={cooldown > 0}
                    onClick={handleResend}
                    className="text-accent-blue font-semibold hover:underline disabled:text-text-muted disabled:no-underline flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <RotateCcw size={13} className={cooldown > 0 ? 'animate-spin opacity-50' : ''} />
                    <span>{cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend Code'}</span>
                  </button>
                </div>

                <div className="pt-2 text-center text-xs text-text-muted">
                  Wrong email?{' '}
                  <Link to="/register" className="text-white hover:text-accent-blue transition font-medium underline underline-offset-4">
                    Re-enter registration details
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
