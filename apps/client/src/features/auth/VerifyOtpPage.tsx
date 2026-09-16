import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { RotateCcw, CheckCircle2, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuthStore } from '../../store/useAuthStore';
import { ReactiveMascot, MascotState } from '../../components/Mascot/ReactiveMascot';

export const VerifyOtpPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get('email') || '';

  const { verifyOtp, resendOtp, error, clearError, isLoading } = useAuthStore();

  const [otp, setOtp] = useState('');
  const [cooldown, setCooldown] = useState(60);
  const [mascotState, setMascotState] = useState<MascotState>('idle');
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
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
      setTimeout(() => {
        navigate('/home');
      }, 1000);
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
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-bg-surface border border-border-subtle rounded-3xl p-8 shadow-2xl relative overflow-hidden text-center">
        {/* Brand Accent Top Border */}
        <div className="absolute top-0 left-0 right-0 h-1 gradient-brand" />

        <div className="flex justify-center mb-4">
          <ReactiveMascot state={mascotState} size={110} />
        </div>

        <h1 className="text-2xl font-bold text-text-primary">Verify Your Email</h1>
        <p className="text-xs text-text-muted mt-1.5">
          We sent a 6-digit verification code to <span className="text-text-primary font-medium">{email}</span>
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3 rounded-xl mt-4 text-left">
            {error}
          </div>
        )}

        {resendSuccess && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs p-3 rounded-xl mt-4 flex items-center gap-2">
            <CheckCircle2 size={15} />
            <span>A fresh verification code has been dispatched!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div className="relative max-w-[280px] mx-auto">
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
              className="w-full text-center tracking-[14px] font-mono text-2xl font-bold py-3 bg-bg-elevated border border-border-subtle rounded-2xl text-text-primary focus:outline-none focus:border-accent-blue transition placeholder:text-text-muted/40"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || otp.length !== 6}
            className="w-full py-3 px-4 rounded-xl gradient-brand text-white font-semibold text-sm shadow-lg shadow-accent-blue/20 hover:opacity-95 active:scale-[0.99] disabled:opacity-50 transition flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span>Verifying Code...</span>
            ) : (
              <>
                <span>Complete Registration</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-border-subtle flex items-center justify-between text-xs text-text-muted">
          <span>Didn't receive code?</span>
          <button
            type="button"
            disabled={cooldown > 0}
            onClick={handleResend}
            className="text-accent-blue font-semibold hover:underline disabled:text-text-muted disabled:no-underline flex items-center gap-1"
          >
            <RotateCcw size={13} className={cooldown > 0 ? 'animate-spin opacity-50' : ''} />
            <span>{cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend Code'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
