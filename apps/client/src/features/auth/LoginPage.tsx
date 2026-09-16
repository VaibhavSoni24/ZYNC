import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { ReactiveMascot, MascotState } from '../../components/Mascot/ReactiveMascot';

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
      }, 500);
    } catch {
      setMascotState('error');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-bg-surface border border-border-subtle rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Brand Accent Top Border */}
        <div className="absolute top-0 left-0 right-0 h-1 gradient-brand" />

        {/* Mascot Centerpiece */}
        <div className="flex flex-col items-center mb-6">
          <ReactiveMascot state={mascotState} size={120} />
          <h1 className="text-2xl font-bold text-text-primary mt-3 text-center">Welcome Back to Zync</h1>
          <p className="text-xs text-text-muted mt-1 text-center">
            Sign in to rejoin your watch parties and sync with friends.
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username or Email */}
          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1.5">
              Username or Email
            </label>
            <div className="relative">
              <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                required
                placeholder="username or email@domain.com"
                value={identifier}
                onFocus={() => setMascotState('typing')}
                onBlur={() => setMascotState('idle')}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 bg-bg-elevated border border-border-subtle rounded-xl text-xs text-text-primary placeholder:text-text-muted/60 focus:outline-none focus:border-accent-blue transition"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onFocus={() => setMascotState('password')}
                onBlur={() => setMascotState('idle')}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 bg-bg-elevated border border-border-subtle rounded-xl text-xs text-text-primary placeholder:text-text-muted/60 focus:outline-none focus:border-accent-blue transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 px-4 rounded-xl gradient-brand text-white font-semibold text-sm shadow-lg shadow-accent-blue/20 hover:opacity-95 active:scale-[0.99] disabled:opacity-50 transition flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span>Signing in...</span>
            ) : (
              <>
                <Sparkles size={16} />
                <span>Sign In to Zync</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-text-muted mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-accent-blue font-semibold hover:underline">
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  );
};
