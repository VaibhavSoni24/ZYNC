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
  Loader2
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
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
  const { user, setUser } = useAuthStore();

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

  // Calculate Monthly Username Change Eligibility (Calendar month rule: resets on 1st day of next month at 12:00 AM)
  let canChangeUsername = true;
  let daysUntilEligible = 0;
  let nextEligibleDate: string | null = null;

  if (user?.lastUsernameChangedAt) {
    const lastDate = new Date(user.lastUsernameChangedAt);
    const now = new Date();

    const isSameCalendarMonth =
      lastDate.getFullYear() === now.getFullYear() &&
      lastDate.getMonth() === now.getMonth();

    if (isSameCalendarMonth) {
      canChangeUsername = false;
      const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0, 0);
      daysUntilEligible = Math.max(1, Math.ceil((nextMonthStart.getTime() - now.getTime()) / (24 * 60 * 60 * 1000)));
      nextEligibleDate = nextMonthStart.toLocaleDateString(undefined, {
        month: 'long',
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
        `Username can only be updated once per calendar month. Next change becomes available on ${nextEligibleDate} at 12:00 AM (${daysUntilEligible}d left).`
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
                    Monthly limit reached: resets on {nextEligibleDate} ({daysUntilEligible}d left)
                  </span>
                </span>
              )}
            </div>

            {/* Policy Info Box */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-xs space-y-1.5 text-gray-300">
              <div className="flex items-center gap-2 text-white font-semibold">
                <AlertTriangle size={14} className="text-amber-400" />
                <span>Monthly Handle Policy</span>
              </div>
              <p className="text-[11px] text-text-muted leading-relaxed">
                Usernames can be changed <strong>once per calendar month</strong>. Eligibility automatically resets on the <strong>1st day of each new month at 12:00 AM</strong>, provided the desired handle is available.
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
                    <span>Monthly limit reached. Resets on {nextEligibleDate} at 12:00 AM ({daysUntilEligible}d left).</span>
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
    </div>
  );
};
