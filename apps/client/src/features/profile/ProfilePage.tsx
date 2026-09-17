import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  AtSign,
  FileText,
  Check,
  AlertTriangle,
  ArrowLeft,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Calendar,
  Sparkles,
  Clock,
  CheckCircle2,
  Mail,
  Loader2,
  Trash2,
  KeyRound,
  ShieldAlert,
  X
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { Interactive3DBlob } from '../../components/Mascot/Interactive3DBlob';
import {
  PRESET_AVATARS,
  PRESET_AVATAR_DETAILS,
  AvatarIcon,
  PresetAvatarName
} from '../../assets/avatars';
import { DateOfBirthPicker } from '../../components/Form/DateOfBirthPicker';
import { apiRequest } from '../../lib/api';

const QUICK_BIO_IDEAS = [
  '🎬 Film enthusiast & weekend binge-watcher',
  '✨ Anime & Studio Ghibli lover',
  '🍿 Movie night host with hot takes',
  '🎧 Lo-fi beats, tech streams & chill vibes'
];

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, setUser, logout } = useAuthStore();

  // Profile Form States
  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState<PresetAvatarName>((user?.avatar as PresetAvatarName) || 'Comet');
  const [bio, setBio] = useState(user?.bio || '');
  const [dob, setDob] = useState(user?.dob || '2000-01-01');

  // Username & Security States
  const [newUsername, setNewUsername] = useState(user?.username || '');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Availability checking state
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [availabilityResult, setAvailabilityResult] = useState<{
    status: 'idle' | 'current' | 'available' | 'taken' | 'invalid';
    message: string;
  }>({ status: 'idle', message: '' });

  // Action feedback states
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [usernameSuccess, setUsernameSuccess] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [usernameLoading, setUsernameLoading] = useState(false);

  // Danger Zone - Change Password States
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [pwdMode, setPwdMode] = useState<'standard' | 'otp'>('standard');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [pwdOtp, setPwdOtp] = useState('');
  const [pwdOtpSent, setPwdOtpSent] = useState(false);
  const [pwdCooldown, setPwdCooldown] = useState(0);
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdError, setPwdError] = useState<string | null>(null);
  const [pwdSuccess, setPwdSuccess] = useState<string | null>(null);

  // Danger Zone - Delete Account States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteMode, setDeleteMode] = useState<'password' | 'otp'>('password');
  const [deletePassword, setDeletePassword] = useState('');
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [deleteOtp, setDeleteOtp] = useState('');
  const [deleteOtpSent, setDeleteOtpSent] = useState(false);
  const [deleteCooldown, setDeleteCooldown] = useState(0);
  const [deleteConfirmUsername, setDeleteConfirmUsername] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Cooldown timers
  useEffect(() => {
    if (pwdCooldown <= 0) return;
    const t = setInterval(() => setPwdCooldown((prev) => prev - 1), 1000);
    return () => clearInterval(t);
  }, [pwdCooldown]);

  useEffect(() => {
    if (deleteCooldown <= 0) return;
    const t = setInterval(() => setDeleteCooldown((prev) => prev - 1), 1000);
    return () => clearInterval(t);
  }, [deleteCooldown]);

  // Masked email for display
  const maskedUserEmail = user?.email
    ? user.email.replace(/^(.)(.*)(.@.*)$/, (_, a, _b, c) => `${a}***${c}`)
    : 'your registered email';

  // Handlers for Change Password
  const handleChangePasswordStandard = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdError(null);
    setPwdSuccess(null);

    if (!currentPassword) {
      setPwdError('Current password is required');
      return;
    }
    if (newPassword.length < 6) {
      setPwdError('New password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwdError('New passwords do not match');
      return;
    }

    setPwdLoading(true);
    try {
      const res = await apiRequest('/api/users/change-password', {
        method: 'PUT',
        data: { currentPassword, newPassword }
      });
      if (res.success) {
        setPwdSuccess('Your password has been successfully updated!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => {
          setIsChangingPassword(false);
          setPwdSuccess(null);
        }, 3000);
      } else {
        throw new Error(res.error || 'Failed to update password');
      }
    } catch (err: any) {
      setPwdError(err.message || 'Failed to update password');
    } finally {
      setPwdLoading(false);
    }
  };

  const handleSendPasswordOtp = async () => {
    if (pwdCooldown > 0 || !user?.email) return;
    setPwdError(null);
    setPwdLoading(true);
    try {
      const res = await apiRequest('/api/auth/forgot-password', {
        method: 'POST',
        data: { identifier: user.email }
      });
      if (res.success) {
        setPwdOtpSent(true);
        setPwdCooldown(60);
        setPwdSuccess(`Verification code dispatched to ${maskedUserEmail}`);
      } else {
        throw new Error(res.error || 'Failed to send recovery code');
      }
    } catch (err: any) {
      setPwdError(err.message || 'Failed to send recovery code');
    } finally {
      setPwdLoading(false);
    }
  };

  const handleChangePasswordOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdError(null);
    setPwdSuccess(null);

    if (pwdOtp.trim().length !== 6) {
      setPwdError('Please enter the 6-digit verification code');
      return;
    }
    if (newPassword.length < 6) {
      setPwdError('New password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwdError('New passwords do not match');
      return;
    }

    setPwdLoading(true);
    try {
      const res = await apiRequest('/api/auth/reset-password', {
        method: 'POST',
        data: {
          email: user?.email,
          otp: pwdOtp.trim(),
          newPassword
        }
      });
      if (res.success) {
        setPwdSuccess('Your password has been successfully reset via OTP!');
        setPwdOtp('');
        setNewPassword('');
        setConfirmPassword('');
        setPwdOtpSent(false);
        setTimeout(() => {
          setIsChangingPassword(false);
          setPwdSuccess(null);
        }, 3000);
      } else {
        throw new Error(res.error || 'Failed to reset password');
      }
    } catch (err: any) {
      setPwdError(err.message || 'Failed to reset password');
    } finally {
      setPwdLoading(false);
    }
  };

  // Handlers for Delete Account
  const handleSendDeleteOtp = async () => {
    if (deleteCooldown > 0) return;
    setDeleteError(null);
    setDeleteLoading(true);
    try {
      const res = await apiRequest('/api/users/request-delete-otp', {
        method: 'POST'
      });
      if (res.success) {
        setDeleteOtpSent(true);
        setDeleteCooldown(60);
      } else {
        throw new Error(res.error || 'Failed to dispatch deletion code');
      }
    } catch (err: any) {
      setDeleteError(err.message || 'Failed to request deletion code');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setDeleteError(null);

    if (deleteConfirmUsername.trim().toLowerCase() !== user?.username.toLowerCase()) {
      setDeleteError(`Please type @${user?.username} exactly to confirm account deletion`);
      return;
    }

    if (deleteMode === 'password' && !deletePassword) {
      setDeleteError('Account password is required');
      return;
    }

    if (deleteMode === 'otp' && deleteOtp.trim().length !== 6) {
      setDeleteError('Please enter the 6-digit email deletion code');
      return;
    }

    setDeleteLoading(true);
    try {
      const res = await apiRequest('/api/users/account', {
        method: 'DELETE',
        data: {
          password: deleteMode === 'password' ? deletePassword : undefined,
          otp: deleteMode === 'otp' ? deleteOtp.trim() : undefined
        }
      });

      if (res.success) {
        setIsDeleteModalOpen(false);
        await logout();
        navigate('/', { replace: true });
      } else {
        throw new Error(res.error || 'Failed to delete account');
      }
    } catch (err: any) {
      setDeleteError(err.message || 'Failed to delete account');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Synchronize initial state when user loads or updates
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setAvatar((user.avatar as PresetAvatarName) || 'Comet');
      setBio(user.bio || '');
      setDob(user.dob || '2000-01-01');
      setNewUsername(user.username || '');
    }
  }, [user]);

  // Calculate Calendar-Month Username Change Eligibility
  // Resets on the 1st day of every new month at 12:00 AM
  let canChangeUsername = true;
  let daysUntilEligible = 0;
  let nextEligibleDate: string | null = null;

  const lastChanged = user?.lastUsernameChangedAt;
  if (lastChanged) {
    const lastDate = new Date(lastChanged);
    const now = new Date();

    const isSameCalendarMonth =
      lastDate.getFullYear() === now.getFullYear() &&
      lastDate.getMonth() === now.getMonth();

    if (isSameCalendarMonth) {
      canChangeUsername = false;
      // 1st day of next month at 12:00 AM (00:00:00)
      const nextMonthFirstDay = new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0, 0);
      daysUntilEligible = Math.max(1, Math.ceil((nextMonthFirstDay.getTime() - now.getTime()) / (24 * 60 * 60 * 1000)));
      nextEligibleDate = nextMonthFirstDay.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }
  }

  // Debounced Username Availability Checker
  useEffect(() => {
    const trimmed = newUsername.toLowerCase().trim();

    if (!trimmed || trimmed === user?.username.toLowerCase()) {
      setAvailabilityResult({ status: 'current', message: 'Current username' });
      return;
    }

    if (trimmed.length < 3 || trimmed.length > 20) {
      setAvailabilityResult({ status: 'invalid', message: 'Must be 3-20 characters' });
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) {
      setAvailabilityResult({ status: 'invalid', message: 'Letters, numbers, and underscores only' });
      return;
    }

    const timer = setTimeout(async () => {
      setCheckingAvailability(true);
      try {
        const res = await apiRequest(`/api/users/check-username?username=${encodeURIComponent(trimmed)}`);
        if (res.success && res.data) {
          if (res.data.available) {
            setAvailabilityResult({ status: 'available', message: `✓ @${trimmed} is available` });
          } else {
            setAvailabilityResult({ status: 'taken', message: `✗ @${trimmed} is already taken` });
          }
        }
      } catch (err) {
        setAvailabilityResult({ status: 'idle', message: '' });
      } finally {
        setCheckingAvailability(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [newUsername, user?.username]);

  // Handle Profile (Name, Avatar, DOB, Bio) Submission
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileError(null);
    setProfileSuccess(false);

    try {
      const res = await apiRequest('/api/users/profile', {
        method: 'PUT',
        data: { name: name.trim(), avatar, bio: bio.trim(), dob }
      });

      if (res.success && res.data) {
        setUser(res.data);
        setProfileSuccess(true);
        setTimeout(() => setProfileSuccess(false), 3500);
      }
    } catch (err: any) {
      setProfileError(err.message || 'Failed to update profile details');
    } finally {
      setProfileLoading(false);
    }
  };

  // Handle Monthly Username Change Submission (with Password Verification)
  const handleUpdateUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = newUsername.toLowerCase().trim();

    if (normalized === user?.username.toLowerCase()) return;

    if (!canChangeUsername) {
      setUsernameError(
        `Username can only be updated once per calendar month. Next update unlocks on ${nextEligibleDate} at 12:00 AM (${daysUntilEligible} day(s) left).`
      );
      return;
    }

    if (!verifyPassword.trim()) {
      setUsernameError('Please enter your current password to verify identity.');
      return;
    }

    setUsernameLoading(true);
    setUsernameError(null);
    setUsernameSuccess(false);

    try {
      const res = await apiRequest('/api/users/username', {
        method: 'PUT',
        data: {
          username: normalized,
          password: verifyPassword
        }
      });

      if (res.success && res.data) {
        setUser(res.data);
        setUsernameSuccess(true);
        setVerifyPassword('');
        setTimeout(() => setUsernameSuccess(false), 4000);
      }
    } catch (err: any) {
      setUsernameError(err.message || 'Failed to update username. Verify your password.');
    } finally {
      setUsernameLoading(false);
    }
  };

  const selectedAvatarInfo = PRESET_AVATAR_DETAILS[avatar] || PRESET_AVATAR_DETAILS['Comet'];

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 pt-4 sm:pt-6 pb-28 sm:pb-36">
      {/* Background Ambient Radial Glow */}
      <div className="absolute top-10 left-1/4 -translate-x-1/2 w-[750px] h-[350px] bg-gradient-to-r from-accent-blue/15 via-accent-purple/20 to-transparent blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/3 right-10 w-[550px] h-[320px] bg-accent-blue/10 blur-[140px] pointer-events-none -z-10" />

      {/* Navigation Breadcrumb / Back Button */}
      <div className="mb-3 sm:mb-4">
        <button
          type="button"
          onClick={() => navigate('/home')}
          className="inline-flex items-center gap-2 text-xs font-medium text-text-muted hover:text-white transition group py-1.5 px-3 rounded-xl hover:bg-white/[0.05] border border-transparent hover:border-white/10"
        >
          <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Dashboard</span>
        </button>
      </div>

      {/* Main Section Header (Unboxed) */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Account & Profile Settings
        </h1>
        <p className="text-sm sm:text-base text-gray-400 mt-1.5 max-w-2xl">
          Customize your digital persona, silhouette avatar, personal information, and handle security.
        </p>
      </div>

      {/* 2-Column Unboxed Section Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* ========================================================================= */}
        {/* LEFT COLUMN: EDIT CONTROLS (7 COLS)                                       */}
        {/* ========================================================================= */}
        <div className="lg:col-span-7 space-y-8">
          {/* 1. SILHOUETTE CHARACTER AVATAR PICKER (5 PER ROW) */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <Sparkles size={18} className="text-accent-blue" />
                  <span>Choose Silhouette Character Avatar</span>
                </h2>
                <p className="text-xs text-text-muted mt-0.5">
                  10 vector gradients crafted for theater contrast. 5 per row.
                </p>
              </div>
              <span className="text-[11px] font-mono text-accent-blue bg-accent-blue/10 border border-accent-blue/20 px-3 py-1 rounded-full self-start sm:self-auto">
                Selected: <strong className="text-white">{avatar}</strong>
              </span>
            </div>

            {/* 5 Per Line Grid on Tablet / Desktop */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-3.5 pt-1">
              {PRESET_AVATARS.map((av) => {
                const isSelected = avatar === av;
                const info = PRESET_AVATAR_DETAILS[av];

                return (
                  <button
                    key={av}
                    type="button"
                    onClick={() => setAvatar(av)}
                    className={`relative p-3 rounded-2xl transition-all duration-200 flex flex-col items-center gap-2 text-center group cursor-pointer ${
                      isSelected
                        ? 'bg-accent-blue/15 border border-accent-blue ring-2 ring-accent-blue/30 shadow-[0_0_25px_rgba(46,124,246,0.3)] scale-[1.02]'
                        : 'bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.07] hover:border-white/20 active:scale-95'
                    }`}
                  >
                    {/* Selected Checkmark Badge */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-accent-blue text-white flex items-center justify-center shadow-md animate-scale-in">
                        <Check size={11} strokeWidth={3} />
                      </div>
                    )}

                    <div className="relative">
                      <AvatarIcon name={av} size={48} />
                    </div>

                    <div className="w-full">
                      <span
                        className={`block text-xs font-bold truncate transition ${
                          isSelected ? 'text-white' : 'text-text-secondary group-hover:text-white'
                        }`}
                      >
                        {av}
                      </span>
                      <span className="block text-[9px] text-text-muted truncate mt-0.5 font-medium">
                        {info.role.replace('The ', '')}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Avatar Spotlight Bar */}
            <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center gap-3 text-xs">
              <div className="w-8 h-8 rounded-xl bg-accent-blue/15 text-accent-blue flex items-center justify-center flex-shrink-0">
                <AvatarIcon name={avatar} size={28} />
              </div>
              <div className="truncate">
                <span className="font-semibold text-white">{selectedAvatarInfo.name}</span>
                <span className="text-text-muted mx-1.5">•</span>
                <span className="text-accent-blue font-medium">{selectedAvatarInfo.role}</span>
                <span className="text-text-muted mx-1.5">•</span>
                <span className="text-gray-400 text-[11px] truncate">{selectedAvatarInfo.tagline}</span>
              </div>
            </div>
          </div>

          {/* 2. GENERAL PROFILE DETAILS FORM */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl shadow-xl space-y-6">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <User size={18} className="text-accent-purple" />
                <span>Personal Profile Details</span>
              </h2>
              <p className="text-xs text-text-muted mt-0.5">
                Update how your name, birthday, and theater bio appear to others.
              </p>
            </div>

            {profileError && (
              <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2.5 animate-fade-in">
                <span className="w-2 h-2 rounded-full bg-red-400 animate-ping flex-shrink-0" />
                <span>{profileError}</span>
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-5">
              {/* Display Name */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-text-secondary">
                    Display Name <span className="text-accent-blue">*</span>
                  </label>
                  <span className="text-[10px] font-mono text-text-muted">{name.length}/50</span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    required
                    maxLength={50}
                    placeholder="e.g. Tilak Khatoria"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-white/[0.04] border border-white/[0.08] focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/20 rounded-2xl text-xs sm:text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none transition shadow-inner"
                  />
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                </div>
              </div>

              {/* Date of Birth Picker (User-friendly segmented dropdowns) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-text-secondary">
                  Date of Birth <span className="text-accent-blue">*</span>
                </label>
                <DateOfBirthPicker value={dob} onChange={(val) => setDob(val)} required />
              </div>

              {/* Bio & Suggestions */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-text-secondary">
                    Theater Bio <span className="text-text-muted font-normal">(Optional)</span>
                  </label>
                  <span className="text-[10px] font-mono text-text-muted">{bio.length}/100</span>
                </div>
                <div className="relative">
                  <textarea
                    rows={2}
                    maxLength={100}
                    placeholder="A quick sentence on what genres or shows you love to watch..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-white/[0.04] border border-white/[0.08] focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/20 rounded-2xl text-xs sm:text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none transition resize-none shadow-inner"
                  />
                  <FileText size={16} className="absolute left-3.5 top-3.5 text-text-muted pointer-events-none" />
                </div>

                {/* Quick Bio Suggestion Chips */}
                <div className="pt-1 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] text-text-muted font-medium mr-1">Quick ideas:</span>
                  {QUICK_BIO_IDEAS.map((idea) => (
                    <button
                      key={idea}
                      type="button"
                      onClick={() => setBio(idea)}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:border-accent-purple/40 hover:bg-accent-purple/10 hover:text-accent-purple text-text-muted transition duration-150 active:scale-95"
                    >
                      {idea}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button & Success Indicator */}
              <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
                {profileSuccess ? (
                  <span className="text-xs text-emerald-400 flex items-center gap-1.5 font-medium animate-fade-in">
                    <CheckCircle2 size={15} /> Profile details saved successfully!
                  </span>
                ) : (
                  <span className="text-[11px] text-text-muted font-mono">
                    Changes take effect across all active watch rooms immediately.
                  </span>
                )}

                <button
                  type="submit"
                  disabled={profileLoading}
                  className="px-6 py-3 rounded-2xl gradient-brand text-white font-bold text-xs shadow-lg shadow-accent-blue/25 hover:brightness-110 active:scale-[0.99] disabled:opacity-50 transition flex items-center gap-2"
                >
                  {profileLoading ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Check size={14} />
                      <span>Save Profile Details</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* 3. USERNAME & HANDLE (ONCE PER MONTH WITH PASSWORD VERIFICATION) */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <AtSign size={18} className="text-emerald-400" />
                  <span>Unique Username & Handle</span>
                </h2>
                <p className="text-xs text-text-muted mt-0.5">
                  Your public handle across live chat, invite links, and room discovery.
                </p>
              </div>

              {/* Monthly Eligibility Pill Badge */}
              {canChangeUsername ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-3 py-1 rounded-full self-start sm:self-auto font-mono">
                  <ShieldCheck size={13} />
                  <span>Eligible for monthly update</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/25 px-3 py-1 rounded-full self-start sm:self-auto font-mono">
                  <Clock size={13} />
                  <span>
                    Cooldown active: unlocks {nextEligibleDate} at 12:00 AM ({daysUntilEligible}d left)
                  </span>
                </span>
              )}
            </div>

            {/* Policy Info Box */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-xs space-y-1.5 text-gray-300">
              <div className="flex items-center gap-2 text-white font-semibold">
                <AlertTriangle size={14} className="text-amber-400" />
                <span>Calendar-Month Handle Policy</span>
              </div>
              <p className="text-[11px] text-text-muted leading-relaxed">
                Usernames can be changed <strong>once per calendar month</strong> (unlocks at 12:00 AM on the 1st day of each new month) and only if the requested handle is currently available.
                To protect against unauthorized account takeovers, your <strong>current password verification</strong> is strictly required.
              </p>
            </div>

            {usernameError && (
              <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2.5 animate-fade-in">
                <span className="w-2 h-2 rounded-full bg-red-400 animate-ping flex-shrink-0" />
                <span>{usernameError}</span>
              </div>
            )}

            <form onSubmit={handleUpdateUsername} className="space-y-4">
              {/* New Username Input with Availability Indicator */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-text-secondary">
                    New Username <span className="text-accent-blue">*</span>
                  </label>
                  {/* Availability feedback */}
                  <div className="text-[11px] font-mono">
                    {checkingAvailability ? (
                      <span className="text-accent-blue flex items-center gap-1">
                        <Loader2 size={11} className="animate-spin" /> Checking availability...
                      </span>
                    ) : availabilityResult.status === 'available' ? (
                      <span className="text-emerald-400 font-semibold">{availabilityResult.message}</span>
                    ) : availabilityResult.status === 'taken' ? (
                      <span className="text-red-400 font-semibold">{availabilityResult.message}</span>
                    ) : availabilityResult.status === 'invalid' ? (
                      <span className="text-amber-400">{availabilityResult.message}</span>
                    ) : (
                      <span className="text-text-muted">{availabilityResult.message}</span>
                    )}
                  </div>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    required
                    disabled={!canChangeUsername || usernameLoading}
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value.toLowerCase().trim())}
                    maxLength={20}
                    placeholder="new_username"
                    className="w-full pl-11 pr-4 py-3 bg-white/[0.04] border border-white/[0.08] focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/20 rounded-2xl font-mono text-xs sm:text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none transition shadow-inner disabled:opacity-40 disabled:cursor-not-allowed"
                  />
                  <AtSign size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                </div>
              </div>

              {/* Password Verification Field */}
              {canChangeUsername && newUsername.toLowerCase() !== user?.username.toLowerCase() && (
                <div className="space-y-1.5 pt-1 animate-fade-in">
                  <label className="block text-xs font-semibold text-text-secondary">
                    Current Password Verification <span className="text-accent-blue">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Enter your current password to confirm handle change"
                      value={verifyPassword}
                      onChange={(e) => {
                        setVerifyPassword(e.target.value);
                        setUsernameError(null);
                      }}
                      className="w-full pl-11 pr-12 py-3 bg-white/[0.04] border border-white/[0.08] focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/20 rounded-2xl text-xs sm:text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none transition shadow-inner"
                    />
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition p-1"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <span className="block text-[11px] text-text-muted font-mono px-1">
                    Security check: verifies you are the account holder before releasing your previous handle.
                  </span>
                </div>
              )}

              {/* Submit Button & Feedback */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-white/[0.06]">
                {usernameSuccess ? (
                  <span className="text-xs text-emerald-400 flex items-center gap-1.5 font-medium animate-fade-in">
                    <CheckCircle2 size={15} /> Username successfully updated to @{user?.username}!
                  </span>
                ) : !canChangeUsername ? (
                  <span className="text-xs text-amber-400 flex items-center gap-1.5">
                    <Clock size={13} />
                    <span>Monthly cooldown active. Unlocks {nextEligibleDate} at 12:00 AM ({daysUntilEligible}d left).</span>
                  </span>
                ) : (
                  <span className="text-[11px] text-text-muted font-mono">
                    Requires available handle & verified password.
                  </span>
                )}

                {canChangeUsername && (
                  <button
                    type="submit"
                    disabled={
                      usernameLoading ||
                      newUsername.toLowerCase().trim() === user?.username.toLowerCase() ||
                      !verifyPassword.trim() ||
                      availabilityResult.status === 'taken' ||
                      availabilityResult.status === 'invalid' ||
                      checkingAvailability
                    }
                    className="px-6 py-3 rounded-2xl bg-white/[0.08] hover:bg-accent-blue hover:text-white border border-white/10 text-white font-bold text-xs disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 self-end sm:self-auto flex-shrink-0"
                  >
                    {usernameLoading ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span>Verifying & Updating...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck size={14} />
                        <span>Confirm & Update Handle</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: LIVE PERSONA THEATER PASS / ID CARD PREVIEW (5 COLS)        */}
        {/* ========================================================================= */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-5">
          {/* Glassmorphic Persona Pass Card */}
          <div className="p-6 sm:p-7 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            {/* Top Accent Gradient Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-blue via-accent-purple to-cyan-400" />

            {/* Header Badge */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-accent-blue animate-pulse" />
                <span className="text-[11px] font-mono text-gray-300 font-semibold tracking-wide uppercase">
                  Live Persona Theater ID
                </span>
              </div>
              <span className="text-[11px] font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/25 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                <Sparkles size={11} /> Real-Time Preview
              </span>
            </div>

            {/* Body of the ID Card */}
            <div className="p-6 rounded-2xl bg-[#090914]/90 border border-white/15 shadow-inner space-y-5 relative">
              {/* Radial glow tailored to selected avatar */}
              <div
                className={`absolute -top-10 -right-10 w-48 h-48 bg-gradient-to-bl ${selectedAvatarInfo.bgGradient} blur-2xl pointer-events-none rounded-full`}
              />

              {/* Big Avatar + Names */}
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-white/[0.05] border border-white/15 flex items-center justify-center p-1 shadow-lg flex-shrink-0">
                  <AvatarIcon name={avatar} size={54} />
                </div>
                <div className="truncate">
                  <h3 className="text-lg font-extrabold text-white tracking-tight truncate leading-tight">
                    {name.trim() || 'Your Name'}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs font-mono font-bold text-accent-blue truncate">
                      @{newUsername.trim() || user?.username || 'username'}
                    </span>
                    <span className="text-[10px] text-text-muted font-mono bg-white/[0.05] px-2 py-0.5 rounded-md">
                      {selectedAvatarInfo.role}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bio Preview Box */}
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs relative z-10">
                <span className="block text-[10px] text-text-muted uppercase font-mono tracking-wider mb-1">
                  Theater Bio
                </span>
                <p className="text-gray-300 text-xs italic leading-relaxed">
                  "{bio.trim() || 'No bio provided. Share your favorite movies or shows with your friends!'}"
                </p>
              </div>

              {/* Account Metadata Badges */}
              <div className="pt-3 border-t border-white/[0.08] space-y-2.5 text-xs text-gray-300 relative z-10 font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-text-muted flex items-center gap-1.5 text-[11px]">
                    <Mail size={12} className="text-accent-blue" />
                    <span>Registered Email</span>
                  </span>
                  <span className="text-white text-[11px] truncate max-w-[170px]">
                    {user?.email || 'user@example.com'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-text-muted flex items-center gap-1.5 text-[11px]">
                    <Calendar size={12} className="text-accent-purple" />
                    <span>Date of Birth</span>
                  </span>
                  <span className="text-white text-[11px]">
                    {dob || '2000-01-01'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-text-muted flex items-center gap-1.5 text-[11px]">
                    <ShieldCheck size={12} className="text-emerald-400" />
                    <span>Handle Changes</span>
                  </span>
                  <span className="text-emerald-400 text-[11px] font-semibold">
                    {user?.usernameChangeCount || 0} time(s)
                  </span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-text-muted text-center mt-3">
              This card reflects your live theater presence across all synchronized sessions.
            </p>
          </div>

          {/* Additional Account Security & Tips Banner */}
          <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-md space-y-2.5">
            <div className="flex items-center gap-2.5 text-white font-semibold text-xs">
              <ShieldCheck size={16} className="text-accent-blue" />
              <span>Identity & Security Guidance</span>
            </div>
            <p className="text-[11px] text-text-muted leading-relaxed">
              Zync uses end-to-end authenticated session tokens. Changing your handle automatically migrates all your hosted theaters and history.
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* GITHUB-STYLE DANGER ZONE AT THE BOTTOM                                    */}
      {/* ========================================================================= */}
      <div className="rounded-3xl border border-red-500/30 bg-red-950/10 backdrop-blur-xl overflow-hidden shadow-[0_15px_40px_rgba(239,68,68,0.08)] mt-10 sm:mt-14">
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-red-500/20 bg-red-500/5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <ShieldAlert size={18} className="text-red-400" />
            <h3 className="text-sm sm:text-base font-bold text-red-400 tracking-tight">Danger Zone</h3>
          </div>
          <span className="text-[11px] font-mono text-red-300 bg-red-500/10 border border-red-500/20 px-2.5 py-0.5 rounded-full">
            Security & Destructive Actions
          </span>
        </div>

        <div className="divide-y divide-red-500/15">
          {/* OPTION 1: CHANGE PASSWORD ROW */}
          <div className="p-6 sm:p-7 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm sm:text-base font-semibold text-white">Change Account Password</h4>
                <p className="text-xs text-text-muted mt-0.5 max-w-xl">
                  Update your current password or reset your credentials using a one-time verification code sent to your registered email.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsChangingPassword(!isChangingPassword);
                  setPwdError(null);
                  setPwdSuccess(null);
                }}
                className={`px-4 py-2.5 rounded-xl border text-xs font-semibold transition flex items-center gap-2 flex-shrink-0 self-start sm:self-auto ${
                  isChangingPassword
                    ? 'bg-white/10 text-white border-white/20'
                    : 'bg-white/[0.04] text-white hover:bg-white/[0.08] border-white/15'
                }`}
              >
                <KeyRound size={14} />
                <span>{isChangingPassword ? 'Cancel' : 'Change Password'}</span>
              </button>
            </div>

            {/* Expanded Change Password Box */}
            {isChangingPassword && (
              <div className="p-5 sm:p-6 rounded-2xl bg-black/40 border border-white/[0.08] space-y-5 animate-fade-in mt-3">
                {/* Mode Selector */}
                <div className="flex flex-wrap items-center gap-2 border-b border-white/[0.06] pb-3 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setPwdMode('standard');
                      setPwdError(null);
                      setPwdSuccess(null);
                    }}
                    className={`px-3 py-1.5 rounded-lg font-medium transition ${
                      pwdMode === 'standard'
                        ? 'bg-accent-blue text-white shadow-md'
                        : 'text-text-muted hover:text-white'
                    }`}
                  >
                    I Know My Current Password
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPwdMode('otp');
                      setPwdError(null);
                      setPwdSuccess(null);
                    }}
                    className={`px-3 py-1.5 rounded-lg font-medium transition ${
                      pwdMode === 'otp'
                        ? 'bg-accent-blue text-white shadow-md'
                        : 'text-text-muted hover:text-white'
                    }`}
                  >
                    Forgot Password? Reset via Email OTP
                  </button>
                </div>

                {pwdError && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
                    <span>{pwdError}</span>
                  </div>
                )}

                {pwdSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                    <CheckCircle2 size={15} />
                    <span>{pwdSuccess}</span>
                  </div>
                )}

                {/* MODE A: STANDARD (Current + New) */}
                {pwdMode === 'standard' && (
                  <form onSubmit={handleChangePasswordStandard} className="space-y-4 max-w-lg">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-text-secondary">Current Password</label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          required
                          placeholder="Enter current password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full pl-10 pr-11 py-2.5 bg-white/[0.04] border border-white/[0.08] focus:border-accent-blue rounded-xl text-xs sm:text-sm text-white placeholder:text-text-muted/50 focus:outline-none transition"
                        />
                        <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition"
                        >
                          {showCurrentPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-text-secondary">New Password (min 6 characters)</label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          required
                          placeholder="Enter new password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full pl-10 pr-11 py-2.5 bg-white/[0.04] border border-white/[0.08] focus:border-accent-blue rounded-xl text-xs sm:text-sm text-white placeholder:text-text-muted/50 focus:outline-none transition"
                        />
                        <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition"
                        >
                          {showNewPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-text-secondary">Confirm New Password</label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          required
                          placeholder="Confirm new password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 bg-white/[0.04] border border-white/[0.08] focus:border-accent-blue rounded-xl text-xs sm:text-sm text-white placeholder:text-text-muted/50 focus:outline-none transition"
                        />
                        <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setPwdMode('otp');
                          setPwdError(null);
                        }}
                        className="text-[11px] text-accent-blue hover:underline"
                      >
                        Forgot your current password?
                      </button>
                      <button
                        type="submit"
                        disabled={pwdLoading || !currentPassword || !newPassword || !confirmPassword}
                        className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-accent-blue text-white font-bold text-xs disabled:opacity-40 transition flex items-center gap-2"
                      >
                        {pwdLoading ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                        <span>Update Password</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* MODE B: FORGOT PASSWORD RESET VIA OTP */}
                {pwdMode === 'otp' && (
                  <div className="space-y-4 max-w-lg">
                    <p className="text-xs text-text-muted leading-relaxed">
                      We'll send a 6-digit recovery code to your registered email (<span className="text-white font-mono">{maskedUserEmail}</span>).
                    </p>

                    {!pwdOtpSent ? (
                      <button
                        type="button"
                        onClick={handleSendPasswordOtp}
                        disabled={pwdLoading || pwdCooldown > 0}
                        className="px-5 py-2.5 rounded-xl gradient-brand text-white font-semibold text-xs transition flex items-center gap-2 disabled:opacity-50"
                      >
                        {pwdLoading ? <Loader2 size={14} className="animate-spin" /> : <Mail size={14} />}
                        <span>{pwdCooldown > 0 ? `Resend in ${pwdCooldown}s` : 'Send Verification Code to My Email'}</span>
                      </button>
                    ) : (
                      <form onSubmit={handleChangePasswordOtp} className="space-y-4">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <label className="block text-xs font-semibold text-text-secondary">6-Digit Email Code</label>
                            <button
                              type="button"
                              onClick={handleSendPasswordOtp}
                              disabled={pwdCooldown > 0}
                              className="text-[11px] font-mono text-accent-blue hover:underline disabled:text-text-muted/50"
                            >
                              {pwdCooldown > 0 ? `Resend in ${pwdCooldown}s` : 'Resend Code'}
                            </button>
                          </div>
                          <input
                            type="text"
                            required
                            maxLength={6}
                            placeholder="123456"
                            value={pwdOtp}
                            onChange={(e) => setPwdOtp(e.target.value.replace(/\D/g, ''))}
                            className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.08] focus:border-accent-blue rounded-xl font-mono text-center tracking-[0.3em] text-sm text-accent-blue font-bold focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-xs font-semibold text-text-secondary">New Password (min 6 chars)</label>
                          <input
                            type="password"
                            required
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.08] focus:border-accent-blue rounded-xl text-xs sm:text-sm text-white focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-xs font-semibold text-text-secondary">Confirm New Password</label>
                          <input
                            type="password"
                            required
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.08] focus:border-accent-blue rounded-xl text-xs sm:text-sm text-white focus:outline-none"
                          />
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                          <button
                            type="button"
                            onClick={() => setPwdMode('standard')}
                            className="text-[11px] text-text-muted hover:text-white"
                          >
                            Cancel & verify with current password
                          </button>
                          <button
                            type="submit"
                            disabled={pwdLoading || pwdOtp.length !== 6 || !newPassword || !confirmPassword}
                            className="px-5 py-2.5 rounded-xl gradient-brand text-white font-bold text-xs disabled:opacity-40 transition flex items-center gap-2"
                          >
                            {pwdLoading ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                            <span>Verify OTP & Update Password</span>
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* OPTION 2: DELETE ACCOUNT ROW */}
          <div className="p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-red-500/[0.02]">
            <div>
              <h4 className="text-sm sm:text-base font-semibold text-red-300">Delete Account</h4>
              <p className="text-xs text-text-muted mt-0.5 max-w-xl">
                Permanently remove your personal account, your silhouette identity, and any hosted watch parties. Once deleted, your account cannot be recovered.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsDeleteModalOpen(true);
                setDeleteError(null);
                setDeleteConfirmUsername('');
                setDeletePassword('');
                setDeleteOtp('');
                setDeleteOtpSent(false);
              }}
              className="px-4 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white border border-red-500/30 text-xs font-bold transition flex items-center gap-2 flex-shrink-0 self-start sm:self-auto shadow-lg shadow-red-500/10 active:scale-95"
            >
              <Trash2 size={14} />
              <span>Delete Account</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* DELETE ACCOUNT MODAL WITH 3D CLOUD-BLOB MASCOT (WORRIED EMOTION)          */}
      {/* ========================================================================= */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-3xl p-6 sm:p-8 bg-[#0d070b] border border-red-500/35 shadow-[0_25px_60px_rgba(239,68,68,0.25)] space-y-5 overflow-hidden my-auto">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-text-muted hover:text-white rounded-xl bg-white/[0.04] transition"
            >
              <X size={16} />
            </button>

            {/* 3D Cloud-Blob Companion Mascot with Worried Expression */}
            <div className="flex flex-col items-center justify-center pt-2">
              <Interactive3DBlob state="error" size={170} showReactionBubble={false} />
              <h3 className="text-xl font-bold text-red-400 mt-2 text-center">
                Permanently Delete Account?
              </h3>
              <p className="text-xs text-text-muted text-center mt-1 max-w-sm">
                We're really sad to see you go. This will immediately wipe your profile, avatar persona, and cancel any watch parties you host.
              </p>
            </div>

            {deleteError && (
              <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping flex-shrink-0" />
                <span>{deleteError}</span>
              </div>
            )}

            {/* Verification Mode Toggle */}
            <div className="flex flex-wrap items-center gap-2 border-b border-white/[0.06] pb-3 text-xs">
              <button
                type="button"
                onClick={() => {
                  setDeleteMode('password');
                  setDeleteError(null);
                }}
                className={`px-3 py-1.5 rounded-lg font-medium transition ${
                  deleteMode === 'password'
                    ? 'bg-red-500 text-white shadow-md'
                    : 'text-text-muted hover:text-white'
                }`}
              >
                Verify with Password
              </button>
              <button
                type="button"
                onClick={() => {
                  setDeleteMode('otp');
                  setDeleteError(null);
                }}
                className={`px-3 py-1.5 rounded-lg font-medium transition ${
                  deleteMode === 'otp'
                    ? 'bg-red-500 text-white shadow-md'
                    : 'text-text-muted hover:text-white'
                }`}
              >
                Forgot Password? Verify via OTP
              </button>
            </div>

            <form onSubmit={handleDeleteAccount} className="space-y-4">
              {/* Mode 1: Password */}
              {deleteMode === 'password' && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-text-secondary">
                    Your Current Password <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showDeletePassword ? 'text' : 'password'}
                      required
                      placeholder="Enter your account password"
                      value={deletePassword}
                      onChange={(e) => setDeletePassword(e.target.value)}
                      className="w-full pl-10 pr-11 py-2.5 bg-white/[0.04] border border-white/[0.08] focus:border-red-500 rounded-xl text-xs sm:text-sm text-white focus:outline-none transition"
                    />
                    <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
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

              {/* Mode 2: Email OTP */}
              {deleteMode === 'otp' && (
                <div className="space-y-3">
                  {!deleteOtpSent ? (
                    <div className="space-y-2">
                      <p className="text-xs text-text-muted">
                        Request a 6-digit deletion code to your email: <span className="text-white font-mono">{maskedUserEmail}</span>
                      </p>
                      <button
                        type="button"
                        onClick={handleSendDeleteOtp}
                        disabled={deleteLoading || deleteCooldown > 0}
                        className="px-4 py-2 rounded-xl bg-red-500/20 text-red-300 hover:bg-red-500 hover:text-white border border-red-500/30 text-xs font-semibold transition flex items-center gap-2"
                      >
                        {deleteLoading ? <Loader2 size={13} className="animate-spin" /> : <Mail size={13} />}
                        <span>{deleteCooldown > 0 ? `Resend in ${deleteCooldown}s` : 'Send Deletion Code'}</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-semibold text-text-secondary">6-Digit Deletion Code</label>
                        <button
                          type="button"
                          onClick={handleSendDeleteOtp}
                          disabled={deleteCooldown > 0}
                          className="text-[11px] font-mono text-red-400 hover:underline disabled:text-text-muted/50"
                        >
                          {deleteCooldown > 0 ? `Resend in ${deleteCooldown}s` : 'Resend Code'}
                        </button>
                      </div>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        placeholder="123456"
                        value={deleteOtp}
                        onChange={(e) => setDeleteOtp(e.target.value.replace(/\D/g, ''))}
                        className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.08] focus:border-red-500 rounded-xl font-mono text-center tracking-[0.3em] text-sm text-red-400 font-bold focus:outline-none"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* GitHub-style confirmation text input */}
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
                  className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.08] focus:border-red-500 rounded-xl text-xs sm:text-sm font-mono text-white placeholder:text-text-muted/40 focus:outline-none transition"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-text-muted hover:text-white text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    deleteLoading ||
                    deleteConfirmUsername.trim().toLowerCase() !== user?.username.toLowerCase() ||
                    (deleteMode === 'password' && !deletePassword) ||
                    (deleteMode === 'otp' && deleteOtp.trim().length !== 6)
                  }
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-600/30 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {deleteLoading ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                  <span>Permanently Delete Account</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

