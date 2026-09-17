import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  Lock,
  Eye,
  EyeOff,
  Mail,
  ArrowLeft,
  AlertOctagon,
  ShieldAlert,
  AlertTriangle,
  Loader2,
  CheckCircle2,
  RotateCcw
} from 'lucide-react';
import { apiRequest } from '../../lib/api';
import { useAuthStore } from '../../store/useAuthStore';
import { Interactive3DBlob } from '../../components/Mascot/Interactive3DBlob';

export const DeleteAccountPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const [deleteMode, setDeleteMode] = useState<'password' | 'otp'>('password');
  const [deletePassword, setDeletePassword] = useState('');
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [deleteOtp, setDeleteOtp] = useState('');
  const [deleteOtpSent, setDeleteOtpSent] = useState(false);
  const [deleteCooldown, setDeleteCooldown] = useState(0);
  const [deleteConfirmUsername, setDeleteConfirmUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otpSuccessMsg, setOtpSuccessMsg] = useState<string | null>(null);

  // Countdown timer for OTP resend
  useEffect(() => {
    if (deleteCooldown <= 0) return;
    const timer = setInterval(() => {
      setDeleteCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [deleteCooldown]);

  // Masked email for security display
  const maskedEmail = user?.email
    ? user.email.replace(/^(.)(.*)(.@.*)$/, (_, a, _b, c) => `${a}***${c}`)
    : 'your registered email';

  // Handler to request email OTP
  const handleSendDeleteOtp = async () => {
    if (deleteCooldown > 0) return;
    setError(null);
    setLoading(true);
    try {
      const res = await apiRequest('/api/users/request-delete-otp', {
        method: 'POST'
      });
      if (res.success) {
        setDeleteOtpSent(true);
        setDeleteCooldown(60);
        setOtpSuccessMsg('A 6-digit deletion verification code has been dispatched to your email.');
        setTimeout(() => setOtpSuccessMsg(null), 5000);
      } else {
        throw new Error(res.error || 'Failed to dispatch deletion code');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to request deletion code');
    } finally {
      setLoading(false);
    }
  };

  // Handler for permanent account deletion
  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (deleteConfirmUsername.trim().toLowerCase() !== user?.username.toLowerCase()) {
      setError(`Please type @${user?.username} exactly as shown to confirm deletion`);
      return;
    }

    if (deleteMode === 'password' && !deletePassword) {
      setError('Your current account password is required');
      return;
    }

    if (deleteMode === 'otp' && deleteOtp.trim().length !== 6) {
      setError('Please enter the valid 6-digit deletion code');
      return;
    }

    setLoading(true);
    try {
      const res = await apiRequest('/api/users/account', {
        method: 'DELETE',
        data: {
          password: deleteMode === 'password' ? deletePassword : undefined,
          otp: deleteMode === 'otp' ? deleteOtp.trim() : undefined
        }
      });

      if (res.success) {
        await logout();
        navigate('/', { replace: true });
      } else {
        throw new Error(res.error || 'Failed to delete account');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete account');
    } finally {
      setLoading(false);
    }
  };

  const isConfirmationMatched =
    deleteConfirmUsername.trim().toLowerCase() === (user?.username || '').toLowerCase();

  const isReadyToSubmit =
    isConfirmationMatched &&
    (deleteMode === 'password' ? deletePassword.length > 0 : deleteOtp.trim().length === 6);

  return (
    <div className="min-h-[85vh] py-10 sm:py-16 relative flex items-center justify-center">
      {/* Background ambient crimson/rose danger glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-red-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-rose-600/10 rounded-full blur-[120px] animate-pulse" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 max-w-lg lg:max-w-none mx-auto">
          <Link
            to="/profile"
            className="inline-flex items-center gap-2 text-xs font-semibold text-text-muted hover:text-white transition px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06]"
          >
            <ArrowLeft size={14} />
            <span>Back to Profile</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* ================================================================= */}
          {/* LEFT COLUMN: 3D CLOUD-BLOB MASCOT (WORRIED FACE) & WARNINGS      */}
          {/* ================================================================= */}
          <div className="lg:col-span-5 flex flex-col items-center text-center space-y-6 mx-auto lg:mx-0 w-full max-w-md lg:max-w-none">
            <div className="w-full flex justify-center">
              {/* Mascot in worried / error state with concerned brows and apologetic mouth */}
              <Interactive3DBlob state="error" size={290} showReactionBubble={false} />
            </div>

            <div className="space-y-3 max-w-md mx-auto">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Delete Your{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-500 to-amber-500">
                  Account
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                We're really sad to see you go. This will permanently wipe your profile, avatar persona, room bookmarks, and cancel any watch parties you host.
              </p>
            </div>

            {/* Warning Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/20 text-[11px] text-red-300">
                <AlertTriangle size={12} className="text-red-400" />
                <span>Permanent & Irreversible</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[11px] text-text-muted">
                <ShieldAlert size={12} className="text-amber-400" />
                <span>Immediate Data Erasure</span>
              </div>
            </div>
          </div>

          {/* ================================================================= */}
          {/* RIGHT COLUMN: LUXURY DANGER ZONE CARD (7 cols)                   */}
          {/* ================================================================= */}
          <div className="lg:col-span-7 flex justify-center lg:justify-end">
            <div className="w-full max-w-lg rounded-3xl p-7 sm:p-10 bg-[#0d070b]/90 border border-red-500/25 backdrop-blur-2xl shadow-[0_25px_60px_rgba(239,68,68,0.18)] relative overflow-hidden text-left">
              {/* Top Accent Gradient Border */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-rose-500 to-amber-500" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-28 bg-red-500/15 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/25 text-red-400 text-xs font-semibold mb-3">
                    <AlertOctagon size={13} />
                    <span>Danger Action</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    Confirm Account Deletion
                  </h2>
                  <p className="text-xs text-text-muted mt-1.5 leading-relaxed">
                    Choose how you would like to verify your identity before permanently removing your account.
                  </p>
                </div>

                {/* Error Banner */}
                {error && (
                  <div className="p-3.5 rounded-2xl bg-red-500/15 border border-red-500/35 text-red-300 text-xs flex items-center gap-2.5 animate-fade-in">
                    <span className="w-2 h-2 rounded-full bg-red-400 animate-ping flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* OTP Success Notification */}
                {otpSuccessMsg && (
                  <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2.5 animate-fade-in">
                    <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
                    <span>{otpSuccessMsg}</span>
                  </div>
                )}

                {/* Verification Mode Toggle Pill */}
                <div className="flex rounded-2xl p-1 bg-white/[0.04] border border-white/[0.08] gap-1 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setDeleteMode('password');
                      setError(null);
                    }}
                    className={`flex-1 py-2 px-3 rounded-xl font-semibold transition text-center ${
                      deleteMode === 'password'
                        ? 'bg-red-500/30 text-red-200 border border-red-500/40 shadow-sm'
                        : 'text-text-muted hover:text-white'
                    }`}
                  >
                    Verify via Password
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDeleteMode('otp');
                      setError(null);
                    }}
                    className={`flex-1 py-2 px-3 rounded-xl font-semibold transition text-center ${
                      deleteMode === 'otp'
                        ? 'bg-red-500/30 text-red-200 border border-red-500/40 shadow-sm'
                        : 'text-text-muted hover:text-white'
                    }`}
                  >
                    Forgot Password? (OTP)
                  </button>
                </div>

                <form onSubmit={handleDeleteAccount} className="space-y-5">
                  {/* Mode 1: Password Input */}
                  {deleteMode === 'password' && (
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-text-secondary">
                        Current Account Password <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showDeletePassword ? 'text' : 'password'}
                          required
                          placeholder="Enter your account password"
                          value={deletePassword}
                          onChange={(e) => setDeletePassword(e.target.value)}
                          className="w-full pl-10 pr-11 py-3 bg-white/[0.03] border border-white/[0.09] focus:border-red-500/70 focus:bg-white/[0.05] rounded-2xl text-xs sm:text-sm text-white placeholder:text-text-muted/40 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition"
                        />
                        <Lock
                          size={14}
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowDeletePassword(!showDeletePassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition"
                        >
                          {showDeletePassword ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Mode 2: Email OTP Input */}
                  {deleteMode === 'otp' && (
                    <div className="space-y-3">
                      <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between gap-3">
                        <div className="space-y-0.5">
                          <p className="text-[11px] text-text-muted">Registered Email</p>
                          <p className="text-xs font-mono text-white">{maskedEmail}</p>
                        </div>
                        <button
                          type="button"
                          onClick={handleSendDeleteOtp}
                          disabled={loading || deleteCooldown > 0}
                          className="px-3.5 py-1.5 rounded-xl bg-red-500/20 text-red-300 hover:bg-red-500 hover:text-white border border-red-500/30 text-xs font-semibold transition flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          {loading ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <Mail size={12} />
                          )}
                          <span>
                            {deleteCooldown > 0
                              ? `Resend in ${deleteCooldown}s`
                              : deleteOtpSent
                              ? 'Resend Code'
                              : 'Send Deletion Code'}
                          </span>
                        </button>
                      </div>

                      {deleteOtpSent && (
                        <div className="space-y-1.5 animate-fade-in">
                          <div className="flex items-center justify-between">
                            <label className="block text-xs font-semibold text-text-secondary">
                              6-Digit Email Code <span className="text-red-400">*</span>
                            </label>
                            {deleteCooldown > 0 && (
                              <span className="text-[11px] text-text-muted flex items-center gap-1 font-mono">
                                <RotateCcw size={11} className="animate-spin" />
                                {deleteCooldown}s
                              </span>
                            )}
                          </div>
                          <input
                            type="text"
                            maxLength={6}
                            required
                            placeholder="••••••"
                            value={deleteOtp}
                            onChange={(e) => setDeleteOtp(e.target.value.replace(/\D/g, ''))}
                            className="w-full text-center tracking-[10px] font-mono text-xl font-bold py-2.5 bg-white/[0.03] border border-white/[0.09] focus:border-red-500/70 focus:bg-white/[0.05] rounded-2xl text-red-300 placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* GitHub-style Username Confirmation Input */}
                  <div className="space-y-1.5 pt-1">
                    <label className="block text-xs font-semibold text-text-secondary">
                      To confirm deletion, type <strong className="text-red-400 font-mono">@{user?.username}</strong> below:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={`@${user?.username}`}
                      value={deleteConfirmUsername}
                      onChange={(e) => setDeleteConfirmUsername(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.09] focus:border-red-500/70 focus:bg-white/[0.05] rounded-2xl text-xs sm:text-sm font-mono text-white placeholder:text-text-muted/40 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition"
                    />
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-white/[0.06] flex items-center justify-end gap-3">
                    <Link
                      to="/profile"
                      className="px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.09] text-text-muted hover:text-white text-xs font-semibold transition"
                    >
                      Cancel
                    </Link>

                    <button
                      type="submit"
                      disabled={loading || !isReadyToSubmit}
                      className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-[0_0_25px_rgba(239,68,68,0.35)] hover:shadow-[0_0_35px_rgba(239,68,68,0.5)] active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed transition duration-200 flex items-center gap-2 cursor-pointer"
                    >
                      {loading ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          <span>Deleting Account...</span>
                        </>
                      ) : (
                        <>
                          <Trash2 size={14} />
                          <span>Permanently Delete Account</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
