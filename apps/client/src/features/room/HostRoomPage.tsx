import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Video,
  Globe,
  Lock,
  Unlock,
  ArrowLeft,
  Users,
  Play,
  Zap,
  Radio,
  CheckCircle2
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { AvatarIcon } from '../../assets/avatars';
import { SearchableLanguageSelect } from '../../components/Form/SearchableLanguageSelect';
import { apiRequest } from '../../lib/api';

const QUICK_TITLES = [
  '🎬 Movie Night',
  '✨ Anime Hangout',
  '🔥 Late Night Vibes',
  '💻 Tech & Code Stream',
  '🎧 Chill Beats & Music',
  '🍿 Weekend Marathon'
];

export const HostRoomPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState<'PUBLIC' | 'PRIVATE'>('PUBLIC');
  const [language, setLanguage] = useState('English');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await apiRequest('/api/rooms', {
        method: 'POST',
        data: {
          name: name.trim(),
          description: description.trim() || undefined,
          visibility,
          language
        }
      });

      if (res.success && res.data?.code) {
        navigate(`/room/${res.data.code}`);
      } else {
        throw new Error(res.error || 'Failed to create room');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create room. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-6 sm:py-10">
      {/* Background Ambient Radial Glow */}
      <div className="absolute top-12 left-1/4 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-accent-blue/15 via-accent-purple/20 to-transparent blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/3 right-10 w-[500px] h-[300px] bg-accent-blue/10 blur-[130px] pointer-events-none -z-10" />

      {/* Navigation Breadcrumb / Back Button */}
      <div className="mb-6 sm:mb-8">
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
      <div className="mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-blue/10 border border-accent-blue/20 text-accent-blue text-xs font-semibold mb-3">
          <Radio size={13} className="animate-pulse" />
          <span>Live Room Creation</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Host a Watch Party
        </h1>
        <p className="text-sm sm:text-base text-gray-400 mt-2 max-w-2xl">
          Set up your private or public cinema, invite your circle, and experience video sync in ultra-low latency.
        </p>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mb-8 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs sm:text-sm flex items-center gap-3 animate-fade-in">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400 animate-ping flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 2-Column Unboxed Section Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Form Settings (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Room Name & Quick Suggestions */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-text-secondary">
                Theater Name <span className="text-accent-blue">*</span>
              </label>
              <input
                type="text"
                required
                maxLength={80}
                placeholder="e.g. Attack on Titan Final Season Watch"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3.5 bg-white/[0.04] border border-white/[0.08] focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/20 rounded-2xl text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none transition shadow-inner"
              />

              {/* Quick Suggestion Chips */}
              <div className="pt-1.5 flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] text-text-muted font-medium mr-1">Quick ideas:</span>
                {QUICK_TITLES.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => setName(chip)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:border-accent-blue/40 hover:bg-accent-blue/10 hover:text-accent-blue text-text-muted transition duration-150 active:scale-95"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-text-secondary">
                  Description <span className="text-text-muted font-normal">(Optional)</span>
                </label>
                <span className="text-[10px] font-mono text-text-muted">
                  {description.length}/300
                </span>
              </div>
              <textarea
                rows={3}
                maxLength={300}
                placeholder="Share the vibe, house rules, or what you're planning to stream..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/20 rounded-2xl text-xs sm:text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none transition resize-none shadow-inner"
              />
            </div>

            {/* Visibility & Access Control */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-text-secondary">
                Privacy & Visibility
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Public Tile */}
                <button
                  type="button"
                  onClick={() => setVisibility('PUBLIC')}
                  className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between gap-3 ${
                    visibility === 'PUBLIC'
                      ? 'bg-accent-blue/10 border-accent-blue ring-1 ring-accent-blue/30 shadow-[0_0_25px_rgba(46,124,246,0.15)]'
                      : 'bg-white/[0.03] border-white/[0.08] hover:border-white/20 hover:bg-white/[0.05]'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="w-9 h-9 rounded-xl bg-accent-blue/15 text-accent-blue flex items-center justify-center border border-accent-blue/25">
                      <Unlock size={18} />
                    </div>
                    {visibility === 'PUBLIC' && (
                      <span className="w-2 h-2 rounded-full bg-accent-blue animate-pulse" />
                    )}
                  </div>
                  <div>
                    <span className="block font-semibold text-sm text-white">Public Theater</span>
                    <span className="block text-xs text-text-muted mt-1 leading-relaxed">
                      Visible on the explore dashboard. Anyone with the link or browsing can join.
                    </span>
                  </div>
                </button>

                {/* Private Tile */}
                <button
                  type="button"
                  onClick={() => setVisibility('PRIVATE')}
                  className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between gap-3 ${
                    visibility === 'PRIVATE'
                      ? 'bg-accent-purple/10 border-accent-purple ring-1 ring-accent-purple/30 shadow-[0_0_25px_rgba(157,78,221,0.15)]'
                      : 'bg-white/[0.03] border-white/[0.08] hover:border-white/20 hover:bg-white/[0.05]'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="w-9 h-9 rounded-xl bg-accent-purple/15 text-accent-purple flex items-center justify-center border border-accent-purple/25">
                      <Lock size={18} />
                    </div>
                    {visibility === 'PRIVATE' && (
                      <span className="w-2 h-2 rounded-full bg-accent-purple animate-pulse" />
                    )}
                  </div>
                  <div>
                    <span className="block font-semibold text-sm text-white">Private Party</span>
                    <span className="block text-xs text-text-muted mt-1 leading-relaxed">
                      Hidden from public listings. Only friends with your secret room code can enter.
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Searchable Language Dropdown (90+ Languages) */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-text-secondary">
                Primary Audio / Chat Language
              </label>
              <SearchableLanguageSelect
                value={language}
                onChange={(lang) => setLanguage(lang)}
                disabled={loading}
              />
            </div>

            {/* Launch Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading || !name.trim()}
                className="w-full py-4 px-6 rounded-2xl gradient-brand text-white font-bold text-sm sm:text-base shadow-[0_0_30px_rgba(46,124,246,0.3)] hover:brightness-110 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 flex items-center justify-center gap-3 group"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    <span>Spinning Up Your Theater...</span>
                  </>
                ) : (
                  <>
                    <Play size={18} className="fill-white group-hover:scale-110 transition-transform" />
                    <span>Create & Launch Theater</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Live Theater Preview & Host Superpowers (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Live Preview Card */}
          <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            {/* Top Badge */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] font-mono text-gray-300 font-semibold tracking-wide uppercase">
                  Live Theater Preview
                </span>
              </div>
              <span className="text-[11px] font-mono text-accent-blue bg-accent-blue/10 border border-accent-blue/20 px-2 py-0.5 rounded-md">
                {visibility}
              </span>
            </div>

            {/* Simulated Room Card */}
            <div className="p-5 rounded-2xl bg-[#090914]/90 border border-white/15 shadow-inner space-y-4">
              {/* Header inside preview */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center p-0.5">
                    <AvatarIcon name={user?.avatar || 'Comet'} size={40} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white leading-snug line-clamp-1">
                      {name.trim() || 'Your Watch Party Name'}
                    </h3>
                    <span className="text-xs text-text-muted">
                      Hosted by <strong className="text-gray-300">@{user?.username || 'you'}</strong>
                    </span>
                  </div>
                </div>

                <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-mono font-medium">
                  <Users size={12} /> 1
                </span>
              </div>

              {/* Description preview */}
              <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed min-h-[36px]">
                {description.trim() || 'No description provided. Add one on the left to set expectations for your guests!'}
              </p>

              {/* Badges footer */}
              <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1.5 text-accent-blue font-medium">
                  <Globe size={13} /> {language}
                </span>

                <span className="font-mono text-gray-400 flex items-center gap-1">
                  <Zap size={12} className="text-accent-blue" /> Instant Sync
                </span>
              </div>
            </div>

            <p className="text-[11px] text-text-muted text-center mt-3">
              This is how your theater appears to users across Zync.
            </p>
          </div>

          {/* Host Superpowers List */}
          <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-md space-y-4">
            <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider font-mono">
              Host Privileges & Features
            </h4>

            <div className="space-y-3 text-xs text-gray-400">
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-accent-blue/15 text-accent-blue flex-shrink-0 mt-0.5">
                  <Zap size={14} />
                </div>
                <div>
                  <strong className="text-white block font-medium">Authoritative Sync Engine</strong>
                  <span>Every play, pause, and timestamp seek broadcasts in sub-50ms to all attendees.</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-accent-purple/15 text-accent-purple flex-shrink-0 mt-0.5">
                  <Video size={14} />
                </div>
                <div>
                  <strong className="text-white block font-medium">Stream Any YouTube Video</strong>
                  <span>Paste any YouTube URL or playlist link directly inside the theater at any time.</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 flex-shrink-0 mt-0.5">
                  <CheckCircle2 size={14} />
                </div>
                <div>
                  <strong className="text-white block font-medium">Automatic Room Lifecycle</strong>
                  <span>Share your 8-character room code. When everyone leaves, the room is cleanly reclaimed.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
