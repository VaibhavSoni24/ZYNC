import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search,
  Globe,
  Users,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  Radio,
  Plus,
  X,
  Zap,
  MessageSquare,
  Ticket,
  Video
} from 'lucide-react';
import { RoomDto } from '@zync/shared';
import { useAuthStore } from '../../store/useAuthStore';
import { AvatarIcon } from '../../assets/avatars';
import { SearchableLanguageSelect } from '../../components/Form/SearchableLanguageSelect';
import { apiRequest } from '../../lib/api';

export const JoinRoomPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [directCode, setDirectCode] = useState('');
  const [search, setSearch] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('All Languages');
  const [publicRooms, setPublicRooms] = useState<RoomDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (search.trim()) queryParams.append('search', search.trim());
      if (selectedLanguage && selectedLanguage !== 'All Languages' && selectedLanguage !== 'All') {
        queryParams.append('language', selectedLanguage);
      }

      const res = await apiRequest(`/api/rooms/public?${queryParams.toString()}`);
      if (res.success && Array.isArray(res.data)) {
        setPublicRooms(res.data);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchRooms();
    }, 250);
    return () => clearTimeout(delayDebounce);
  }, [search, selectedLanguage]);

  const handleDirectJoin = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = directCode.trim().toUpperCase().replace(/\s+/g, '');
    if (!clean) return;

    // Support both ABCD-1234 and ABCD1234 formats
    const formatted = clean.includes('-')
      ? clean
      : clean.length === 8
      ? `${clean.slice(0, 4)}-${clean.slice(4)}`
      : clean;

    if (formatted.replace('-', '').length < 8) {
      setError('Please enter an 8-character room code (e.g. T6YZ-POM2)');
      return;
    }

    navigate(`/room/${formatted}`);
  };

  // Clean display code for preview pass
  const displayCode = directCode.trim().toUpperCase().replace(/\s+/g, '');

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 pt-6 sm:pt-10 pb-28 sm:pb-36 space-y-12 sm:space-y-14">
      {/* Background Ambient Radial Glow */}
      <div className="absolute top-10 left-1/4 -translate-x-1/2 w-[750px] h-[350px] bg-gradient-to-r from-accent-blue/15 via-accent-purple/20 to-transparent blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/3 right-10 w-[550px] h-[320px] bg-accent-blue/10 blur-[140px] pointer-events-none -z-10" />

      {/* Navigation Breadcrumb */}
      <div>
        <button
          type="button"
          onClick={() => navigate('/home')}
          className="inline-flex items-center gap-2 text-xs font-medium text-text-muted hover:text-white transition group py-1.5 px-3 rounded-xl hover:bg-white/[0.05] border border-transparent hover:border-white/10"
        >
          <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Dashboard</span>
        </button>
      </div>

      {/* 1. TOP HERO SECTION: BALANCED 2-COLUMN LAYOUT (Matches Host Page) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Direct Room Code Entry (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Title */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-blue/10 border border-accent-blue/20 text-accent-blue text-xs font-semibold mb-3">
              <KeyRound size={13} className="animate-pulse" />
              <span>Direct Access & Discovery</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Join a Watch Party
            </h1>
            <p className="text-sm sm:text-base text-gray-400 mt-2 max-w-xl">
              Enter an invite code to hop directly into your friend's private theater, or discover live public rooms streaming right now.
            </p>
          </div>

          {/* Room Code Form */}
          <div className="space-y-4 pt-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-accent-blue/15 text-accent-blue flex items-center justify-center border border-accent-blue/30 shadow-[0_0_20px_rgba(46,124,246,0.2)] flex-shrink-0">
                <KeyRound size={18} />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Have a Secret Room Code?
                </h2>
                <p className="text-xs text-text-muted">
                  Enter the 8-character invite code shared by your host.
                </p>
              </div>
            </div>

            {error && (
              <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-3 animate-fade-in">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400 animate-ping flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleDirectJoin} className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="ENTER 8-DIGIT CODE (E.G. T6YZ-POM2)"
                    value={directCode}
                    onChange={(e) => {
                      setDirectCode(e.target.value.toUpperCase());
                      setError(null);
                    }}
                    maxLength={10}
                    className="w-full px-5 py-4 bg-white/[0.04] border border-white/[0.1] focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/25 rounded-2xl font-mono text-sm sm:text-base tracking-widest text-white placeholder:text-text-muted/40 placeholder:font-sans placeholder:tracking-normal placeholder:text-xs sm:placeholder:text-sm focus:outline-none transition uppercase shadow-inner"
                  />
                  {directCode && (
                    <button
                      type="button"
                      onClick={() => {
                        setDirectCode('');
                        setError(null);
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition p-1"
                    >
                      <X size={15} />
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!directCode.trim()}
                  className="px-7 py-4 rounded-2xl gradient-brand text-white font-bold text-sm shadow-[0_0_25px_rgba(46,124,246,0.3)] hover:brightness-110 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center justify-center gap-2.5 group flex-shrink-0"
                >
                  <span>Join Theater</span>
                  <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-text-muted px-1 font-mono">
                <span className="text-accent-blue">Tip:</span>
                <span>Codes are case-insensitive (e.g. T6YZ-POM2 or T6YZPOM2).</span>
              </div>
            </form>

            {/* Quick Link to Host */}
            <div className="pt-2">
              <Link
                to="/room/host"
                className="inline-flex items-center gap-2 text-xs font-semibold text-accent-blue hover:text-accent-blue-hover transition group"
              >
                <span>Want to stream your own videos instead?</span>
                <span className="underline underline-offset-4 flex items-center gap-1">
                  Host a Watch Party <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Live Attendee Pass / Features Card (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Live Direct Access Ticket Pass */}
          <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            {/* Top Badge */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-accent-blue animate-pulse" />
                <span className="text-[11px] font-mono text-gray-300 font-semibold tracking-wide uppercase">
                  Attendee Theater Pass
                </span>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md flex items-center gap-1">
                <Ticket size={11} /> Instant Entry
              </span>
            </div>

            {/* Simulated Pass Body */}
            <div className="p-5 rounded-2xl bg-[#090914]/90 border border-white/15 shadow-inner space-y-4 relative">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center p-0.5 flex-shrink-0">
                  <AvatarIcon name={user?.avatar || 'Comet'} size={40} />
                </div>
                <div>
                  <span className="block text-[10px] text-text-muted uppercase font-mono tracking-wider">
                    Connecting As
                  </span>
                  <h3 className="text-base font-bold text-white leading-snug">
                    @{user?.username || 'guest_viewer'}
                  </h3>
                </div>
              </div>

              {/* Dynamic Room Code Display */}
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between font-mono text-xs">
                <span className="text-text-muted">Target Code:</span>
                <span className="font-bold text-accent-blue tracking-widest text-sm">
                  {displayCode || '____-____'}
                </span>
              </div>

              {/* Feature Checklist inside pass */}
              <div className="pt-2 border-t border-white/[0.08] grid grid-cols-2 gap-2 text-[11px] text-gray-400">
                <span className="flex items-center gap-1.5">
                  <Zap size={12} className="text-accent-blue" />
                  <span>Sub-50ms Sync</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <MessageSquare size={12} className="text-accent-purple" />
                  <span>Live Group Chat</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Users size={12} className="text-emerald-400" />
                  <span>Up to 50 Viewers</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Globe size={12} className="text-cyan-400" />
                  <span>Cross-Platform</span>
                </span>
              </div>
            </div>

            <p className="text-[11px] text-text-muted text-center mt-3">
              Instant sync engine connects immediately upon code submission.
            </p>
          </div>

          {/* Hosting Superpower Banner */}
          <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-md flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-accent-purple/15 text-accent-purple flex-shrink-0">
                <Video size={18} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Host Your Own Watch Party</h4>
                <p className="text-[11px] text-text-muted mt-0.5">
                  Stream YouTube videos with host-authoritative controls.
                </p>
              </div>
            </div>

            <Link
              to="/room/host"
              className="px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 text-xs font-semibold text-white transition flex items-center gap-1.5 flex-shrink-0"
            >
              <span>Host</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>

      {/* DIVIDER LINE */}
      <div className="border-t border-white/[0.08]" />

      {/* 2. PUBLIC WATCH PARTIES: BROWSE IN CARDS (FULL WIDTH) */}
      <div className="space-y-6">
        {/* Section Header & Filter Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <Radio size={18} className="animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <span>Live Public Theaters</span>
                <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                  {publicRooms.length} Live
                </span>
              </h2>
              <p className="text-xs text-text-muted">
                Open rooms hosted by the community. Join freely without any password.
              </p>
            </div>
          </div>

          {/* Search & Language Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
              <input
                type="text"
                placeholder="Search rooms or host..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-8 py-2.5 bg-white/[0.04] border border-white/[0.08] focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/20 rounded-2xl text-xs sm:text-sm text-text-primary placeholder:text-text-muted/50 focus:outline-none transition shadow-inner"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition p-0.5"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Language Filter Dropdown with 90+ Languages & All Languages Option */}
            <div className="w-full sm:w-56">
              <SearchableLanguageSelect
                value={selectedLanguage}
                onChange={(lang) => setSelectedLanguage(lang)}
                includeAllOption={true}
                allOptionLabel="All Languages"
              />
            </div>
          </div>
        </div>

        {/* Public Rooms Grid (IN CARDS) */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-44 rounded-3xl bg-white/[0.02] border border-white/[0.06] animate-pulse"
              />
            ))}
          </div>
        ) : publicRooms.length === 0 ? (
          <div className="p-10 sm:p-14 rounded-3xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-md text-center">
            <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto mb-3 text-text-muted">
              <Radio size={24} className="opacity-50" />
            </div>
            <h3 className="text-base font-bold text-white">No Public Rooms Match Your Filter</h3>
            <p className="text-xs sm:text-sm text-gray-400 mt-1.5 max-w-sm mx-auto leading-relaxed">
              There are no active public watch parties with these filters. You can clear the search or host your own watch party!
            </p>

            <div className="flex items-center justify-center gap-3 mt-5">
              {(search || (selectedLanguage !== 'All Languages' && selectedLanguage !== 'All')) && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch('');
                    setSelectedLanguage('All Languages');
                  }}
                  className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] border border-white/10 text-xs font-semibold text-text-secondary transition"
                >
                  Clear Filters
                </button>
              )}
              <Link
                to="/room/host"
                className="px-5 py-2.5 rounded-xl gradient-brand text-white font-semibold text-xs shadow-lg shadow-accent-blue/20 hover:brightness-110 active:scale-95 transition flex items-center gap-2"
              >
                <Plus size={14} />
                <span>Host a Watch Party</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {publicRooms.map((r) => (
              <div
                key={r.id}
                onClick={() => navigate(`/room/${r.code}`)}
                className="group relative bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-accent-blue/40 rounded-3xl p-6 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-[0_15px_40px_rgba(46,124,246,0.15)] flex flex-col justify-between overflow-hidden"
              >
                {/* Top Ambient Highlight on Card Hover */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent-blue/0 group-hover:via-accent-blue/60 to-transparent transition-all duration-300" />

                <div>
                  {/* Top Card Badges */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="font-mono text-xs font-bold text-accent-blue bg-accent-blue/15 px-3 py-1 rounded-xl border border-accent-blue/30 tracking-wider">
                      {r.code}
                    </span>

                    <div className="flex items-center gap-2">
                      {/* Active participant count badge */}
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-3 py-0.5 rounded-full font-mono">
                        <Users size={12} />
                        <span>{r.participantCount || 1} watching</span>
                      </span>

                      {/* Language badge */}
                      <span className="text-[11px] text-text-muted bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <Globe size={11} className="text-accent-blue" />
                        <span>{r.language}</span>
                      </span>
                    </div>
                  </div>

                  {/* Room Name */}
                  <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-accent-blue transition line-clamp-1 leading-snug">
                    {r.name}
                  </h3>

                  {/* Room Description */}
                  <p className="text-xs text-gray-400 mt-1.5 line-clamp-2 leading-relaxed min-h-[36px]">
                    {r.description || 'No description provided. Join to see what they are watching together!'}
                  </p>
                </div>

                {/* Footer with Host Info & Enter Button */}
                <div className="flex items-center justify-between pt-4 mt-5 border-t border-white/[0.08] text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center p-0.5 flex-shrink-0">
                      <AvatarIcon name="Comet" size={26} />
                    </div>
                    <div className="truncate">
                      <span className="block text-[10px] text-text-muted uppercase font-mono tracking-wider">Host</span>
                      <strong className="text-text-secondary font-semibold truncate block max-w-[110px]">
                        @{r.hostUsername || 'host'}
                      </strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-bold text-accent-blue bg-accent-blue/10 group-hover:bg-accent-blue group-hover:text-white border border-accent-blue/25 px-3 py-1.5 rounded-xl transition duration-200">
                    <span>Enter</span>
                    <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
