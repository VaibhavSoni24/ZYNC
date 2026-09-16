import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, AtSign, Mail, Calendar, Lock, Sparkles, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { ReactiveMascot, MascotState } from '../../components/Mascot/ReactiveMascot';
import { PRESET_AVATARS, AvatarIcon, PresetAvatarName } from '../../assets/avatars';

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

    try {
      setMascotState('typing');
      const res = await register(formData);
      setMascotState('success');
      setTimeout(() => {
        navigate(`/verify-otp?email=${encodeURIComponent(res.email)}`);
      }, 500);
    } catch {
      setMascotState('error');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4">
      <div className="max-w-lg w-full bg-bg-surface border border-border-subtle rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Brand Accent Top Border */}
        <div className="absolute top-0 left-0 right-0 h-1 gradient-brand" />

        {/* Mascot Centerpiece */}
        <div className="flex flex-col items-center mb-6">
          <ReactiveMascot state={mascotState} size={120} />
          <h1 className="text-2xl font-bold text-text-primary mt-3 text-center">Create Your Zync Account</h1>
          <p className="text-xs text-text-muted mt-1 text-center">
            Join thousands watching movies, concerts, and streams in real-time.
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1">Full Name</label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  required
                  placeholder="Alex Rivers"
                  value={formData.name}
                  onFocus={() => setMascotState('typing')}
                  onBlur={() => setMascotState('idle')}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 bg-bg-elevated border border-border-subtle rounded-xl text-xs text-text-primary placeholder:text-text-muted/60 focus:outline-none focus:border-accent-blue transition"
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1">Username</label>
              <div className="relative">
                <AtSign size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  required
                  placeholder="alex_rivers"
                  value={formData.username}
                  onFocus={() => setMascotState('typing')}
                  onBlur={() => setMascotState('idle')}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase() })}
                  className="w-full pl-10 pr-3 py-2 bg-bg-elevated border border-border-subtle rounded-xl text-xs text-text-primary placeholder:text-text-muted/60 focus:outline-none focus:border-accent-blue transition"
                />
              </div>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1">Email Address</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="email"
                required
                placeholder="alex@example.com"
                value={formData.email}
                onFocus={() => setMascotState('typing')}
                onBlur={() => setMascotState('idle')}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-3 py-2 bg-bg-elevated border border-border-subtle rounded-xl text-xs text-text-primary placeholder:text-text-muted/60 focus:outline-none focus:border-accent-blue transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* DOB */}
            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1">Date of Birth</label>
              <div className="relative">
                <Calendar size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="date"
                  required
                  value={formData.dob}
                  onFocus={() => setMascotState('typing')}
                  onBlur={() => setMascotState('idle')}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 bg-bg-elevated border border-border-subtle rounded-xl text-xs text-text-primary focus:outline-none focus:border-accent-blue transition"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="password"
                  required
                  placeholder="Min 6 characters"
                  value={formData.password}
                  onFocus={() => setMascotState('password')}
                  onBlur={() => setMascotState('idle')}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 bg-bg-elevated border border-border-subtle rounded-xl text-xs text-text-primary placeholder:text-text-muted/60 focus:outline-none focus:border-accent-blue transition"
                />
              </div>
            </div>
          </div>

          {/* Preset Avatar Selector (§6) */}
          <div>
            <label className="block text-xs font-semibold text-text-primary mb-2">
              Choose an Avatar <span className="text-text-muted font-normal">(10 geometric presets)</span>
            </label>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {PRESET_AVATARS.map((av) => (
                <button
                  key={av}
                  type="button"
                  onClick={() => setFormData({ ...formData, avatar: av })}
                  className={`p-1 rounded-xl flex-shrink-0 transition ${
                    formData.avatar === av
                      ? 'ring-2 ring-accent-blue bg-accent-blue/10 scale-105'
                      : 'hover:bg-bg-elevated opacity-70 hover:opacity-100'
                  }`}
                  title={av}
                >
                  <AvatarIcon name={av} size={40} />
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 px-4 rounded-xl gradient-brand text-white font-semibold text-sm shadow-lg shadow-accent-blue/20 hover:opacity-95 active:scale-[0.99] disabled:opacity-50 transition flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span>Sending verification code...</span>
            ) : (
              <>
                <Sparkles size={16} />
                <span>Verify Email with Code</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-text-muted mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-accent-blue font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};
