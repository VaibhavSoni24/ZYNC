import React, { useState, useEffect } from 'react';
import { User, AtSign, Calendar, FileText, Check, AlertTriangle } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { PRESET_AVATARS, AvatarIcon, PresetAvatarName } from '../../assets/avatars';
import { apiRequest } from '../../lib/api';

export const ProfilePage: React.FC = () => {
  const { user, setUser } = useAuthStore();

  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState<PresetAvatarName>((user?.avatar as PresetAvatarName) || 'Comet');
  const [bio, setBio] = useState(user?.bio || '');
  const [dob, setDob] = useState(user?.dob || '');
  const [username, setUsername] = useState(user?.username || '');

  const [profileSuccess, setProfileSuccess] = useState(false);
  const [usernameSuccess, setUsernameSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setAvatar((user.avatar as PresetAvatarName) || 'Comet');
      setBio(user.bio || '');
      setDob(user.dob);
      setUsername(user.username);
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setProfileSuccess(false);

    try {
      const res = await apiRequest('/api/users/profile', {
        method: 'PUT',
        data: { name, avatar, bio, dob }
      });

      if (res.success && res.data) {
        setUser(res.data);
        setProfileSuccess(true);
        setTimeout(() => setProfileSuccess(false), 3000);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username.toLowerCase() === user?.username.toLowerCase()) return;

    if (!window.confirm('Warning: Username can only be changed ONCE. Are you sure?')) {
      return;
    }

    setLoading(true);
    setError(null);
    setUsernameSuccess(false);

    try {
      const res = await apiRequest('/api/users/username', {
        method: 'PUT',
        data: { username: username.toLowerCase().trim() }
      });

      if (res.success && res.data) {
        setUser(res.data);
        setUsernameSuccess(true);
        setTimeout(() => setUsernameSuccess(false), 3000);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to change username');
    } finally {
      setLoading(false);
    }
  };

  const canChangeUsername = (user?.usernameChangeCount || 0) < 1;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Profile & Identity</h1>
        <p className="text-xs text-text-muted mt-1">
          Customize your persona, silhouette avatar, and account credentials.
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3.5 rounded-xl">
          {error}
        </div>
      )}

      {/* Avatar Showcase & Selection */}
      <div className="bg-bg-surface border border-border-subtle rounded-3xl p-6 sm:p-8 shadow-xl">
        <h2 className="text-sm font-bold text-text-primary mb-2">Preset Silhouette Avatar</h2>
        <p className="text-xs text-text-muted mb-4">
          Select from 10 geometric gradients crafted specifically for high-contrast visibility.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          {PRESET_AVATARS.map((av) => (
            <button
              key={av}
              type="button"
              onClick={() => setAvatar(av)}
              className={`p-2 rounded-2xl transition flex flex-col items-center gap-1.5 ${
                avatar === av
                  ? 'bg-accent-blue/15 border border-accent-blue scale-105 shadow-md'
                  : 'bg-bg-elevated border border-border-subtle hover:border-text-muted/40'
              }`}
            >
              <AvatarIcon name={av} size={48} />
              <span className="text-[10px] font-medium text-text-muted">{av}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Basic Profile Details */}
      <div className="bg-bg-surface border border-border-subtle rounded-3xl p-6 sm:p-8 shadow-xl">
        <h2 className="text-sm font-bold text-text-primary mb-4">General Profile Details</h2>
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1">Display Name</label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 bg-bg-elevated border border-border-subtle rounded-xl text-xs text-text-primary focus:outline-none focus:border-accent-blue transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1">Date of Birth</label>
              <div className="relative">
                <Calendar size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="date"
                  required
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 bg-bg-elevated border border-border-subtle rounded-xl text-xs text-text-primary focus:outline-none focus:border-accent-blue transition"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1">
              Bio <span className="text-text-muted font-normal">(Max 100 characters)</span>
            </label>
            <div className="relative">
              <FileText size={15} className="absolute left-3.5 top-3 text-text-muted" />
              <textarea
                value={bio}
                maxLength={100}
                rows={2}
                placeholder="A line about the movies or genres you enjoy..."
                onChange={(e) => setBio(e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-bg-elevated border border-border-subtle rounded-xl text-xs text-text-primary placeholder:text-text-muted/60 focus:outline-none focus:border-accent-blue transition resize-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            {profileSuccess ? (
              <span className="text-xs text-emerald-400 flex items-center gap-1">
                <Check size={14} /> Profile changes saved!
              </span>
            ) : <span />}

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl gradient-brand text-white font-semibold text-xs shadow-md shadow-accent-blue/20 hover:opacity-95 transition"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>

      {/* One-Time Username Change Section */}
      <div className="bg-bg-surface border border-border-subtle rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h2 className="text-sm font-bold text-text-primary">Unique Username</h2>
            <p className="text-xs text-text-muted mt-0.5">
              Identifies your account across chat, rooms, and invitations.
            </p>
          </div>
          {canChangeUsername ? (
            <span className="text-[11px] font-semibold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20 flex items-center gap-1">
              <AlertTriangle size={12} /> 1 change remaining
            </span>
          ) : (
            <span className="text-[11px] font-semibold text-text-muted bg-bg-elevated px-2.5 py-1 rounded-full border border-border-subtle">
              Username locked
            </span>
          )}
        </div>

        <form onSubmit={handleUpdateUsername} className="space-y-4">
          <div>
            <div className="relative">
              <AtSign size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                disabled={!canChangeUsername || loading}
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase())}
                className="w-full pl-10 pr-3 py-2 bg-bg-elevated border border-border-subtle rounded-xl text-xs text-text-primary focus:outline-none focus:border-accent-blue transition disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            {!canChangeUsername && (
              <p className="text-[11px] text-text-muted mt-1.5">
                You have already used your one-time username change allocation.
              </p>
            )}
          </div>

          {canChangeUsername && (
            <div className="flex items-center justify-between pt-2">
              {usernameSuccess ? (
                <span className="text-xs text-emerald-400 flex items-center gap-1">
                  <Check size={14} /> Username updated!
                </span>
              ) : <span />}

              <button
                type="submit"
                disabled={loading || username.toLowerCase() === user?.username.toLowerCase()}
                className="px-5 py-2 rounded-xl bg-bg-elevated hover:bg-border-subtle border border-border-subtle text-text-primary font-semibold text-xs disabled:opacity-40 transition"
              >
                Change Username (Permanent)
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
