import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Menu, X } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { AvatarIcon } from '../assets/avatars';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLinks = isAuthenticated
    ? [
        { label: 'Home', path: '/home' },
        { label: 'Host Room', path: '/room/host' },
        { label: 'Join Room', path: '/room/join' },
        { label: 'About', path: '/about' },
        { label: 'Contact', path: '/contact' },
        { label: 'Profile', path: '/profile' }
      ]
    : [
        { label: 'About', path: '/about' },
        { label: 'Contact', path: '/contact' }
      ];

  return (
    <header className="sticky top-0 z-40 bg-bg-base/80 backdrop-blur-md border-b border-border-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between relative">
        {/* Brand Logo */}
        <Link to={isAuthenticated ? '/home' : '/'} className="flex items-center gap-2.5 group z-10">
          <div className="w-8 h-8 rounded-xl bg-bg-surface border border-border-subtle flex items-center justify-center p-1 group-hover:border-accent-blue transition">
            <svg viewBox="0 0 512 512" className="w-full h-full">
              <defs>
                <linearGradient id="logoBlue" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2E7CF6" />
                  <stop offset="100%" stopColor="#005BFF" />
                </linearGradient>
                <linearGradient id="logoPurp" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#9B3CFF" />
                  <stop offset="100%" stopColor="#7B16FF" />
                </linearGradient>
              </defs>
              <circle cx="160" cy="150" r="55" fill="url(#logoBlue)" />
              <circle cx="352" cy="150" r="55" fill="url(#logoPurp)" />
              <path d="M 352 205 C 290 205 270 240 256 265 C 242 240 222 205 160 205 C 100 205 85 270 85 320 C 85 410 180 435 256 435 C 332 435 427 410 427 320 C 427 270 412 205 352 205 Z" fill="url(#logoPurp)" />
              <path d="M 160 205 C 100 205 85 270 85 320 C 85 385 130 425 185 433 C 240 440 295 400 340 330 C 355 305 315 240 220 225 C 185 220 170 205 160 205 Z" fill="url(#logoBlue)" />
              <path d="M 195 245 C 195 235 206 228 215 233 L 335 300 C 344 305 344 319 335 324 L 215 391 C 206 396 195 389 195 379 Z" fill="#FFFFFF" />
            </svg>
          </div>
          <span className="font-bold text-lg text-text-primary tracking-tight group-hover:text-accent-blue transition">
            Zync
          </span>
        </Link>

        {/* Desktop Navigation Links - Centered Floating Pill */}
        <nav className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2 pointer-events-auto">
          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-xl shadow-lg shadow-black/20">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3.5 py-1 rounded-full text-xs font-medium transition ${
                  isActive(link.path)
                    ? 'text-white bg-white/[0.12] font-semibold'
                    : 'text-text-muted hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>

        {/* Desktop User Section / CTA */}
        <div className="hidden md:flex items-center gap-3 z-10">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link to="/profile" className="flex items-center gap-2 p-1 pl-2 pr-3 rounded-xl bg-bg-surface hover:bg-bg-elevated border border-border-subtle transition">
                <div className="w-6 h-6 rounded-full overflow-hidden bg-bg-elevated flex items-center justify-center">
                  <AvatarIcon name={user?.avatar || 'Comet'} size={24} />
                </div>
                <span className="text-xs font-semibold text-text-primary truncate max-w-[120px]">
                  {user?.name}
                </span>
              </Link>

              <button
                onClick={handleLogout}
                className="p-2 rounded-xl bg-bg-surface hover:bg-bg-elevated border border-border-subtle text-text-muted hover:text-red-400 transition"
                title="Log out"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-xs font-medium text-text-muted hover:text-white transition px-2 py-1"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-1.5 rounded-full bg-accent-purple/80 hover:bg-accent-purple border border-accent-purple/50 text-white font-medium text-xs shadow-lg shadow-accent-purple/20 hover:shadow-accent-purple/30 transition active:scale-95"
              >
                Start free trial
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-elevated transition"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-bg-surface border-b border-border-subtle px-4 py-3 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                isActive(link.path)
                  ? 'text-accent-blue bg-accent-blue/10'
                  : 'text-text-muted hover:text-text-primary hover:bg-bg-elevated'
              }`}
            >
              {link.label}
            </Link>
          ))}

          <div className="pt-2 mt-2 border-t border-border-subtle">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 flex items-center gap-2"
              >
                <LogOut size={16} />
                <span>Log Out</span>
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 text-center rounded-xl bg-bg-elevated border border-border-subtle text-xs font-semibold text-text-primary"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 text-center rounded-xl gradient-brand text-xs font-semibold text-white"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
