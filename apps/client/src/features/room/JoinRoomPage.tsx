import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Globe, Users, ArrowRight, ArrowLeft, KeyRound, Radio } from 'lucide-react';
import { RoomDto } from '@zync/shared';
import { apiRequest } from '../../lib/api';

const LANGUAGES = ['All', 'English', 'Hindi', 'Japanese', 'Spanish', 'French', 'German', 'Chinese', 'Russian'];

export const JoinRoomPage: React.FC = () => {
  const navigate = useNavigate();
  const [directCode, setDirectCode] = useState('');
  const [search, setSearch] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [publicRooms, setPublicRooms] = useState<RoomDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (search.trim()) queryParams.append('search', search.trim());
      if (selectedLanguage !== 'All') queryParams.append('language', selectedLanguage);

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
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [search, selectedLanguage]);

  const handleDirectJoin = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = directCode.trim().toUpperCase();
    if (!clean) return;

    if (clean.length < 8) {
      setError('Please enter an 8-character room code (e.g. T6YZ-POM2)');
      return;
    }

    navigate(`/room/${clean}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div>
        <button
          onClick={() => navigate('/home')}
          className="inline-flex items-center gap-2 text-xs text-text-muted hover:text-text-primary mb-4 transition"
        >
          <ArrowLeft size={14} /> Back to dashboard
        </button>
        <h1 className="text-2xl font-bold text-text-primary">Join a Watch Party</h1>
        <p className="text-xs text-text-muted mt-1">
          Enter a private invite code or discover live public rooms hosted by the community.
        </p>
      </div>

      {/* Path A: Enter 8-character code */}
      <div className="bg-bg-surface border border-border-subtle rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="p-2 rounded-lg bg-accent-blue/10 text-accent-blue">
            <KeyRound size={18} />
          </div>
          <h2 className="text-sm font-semibold text-text-primary">Have a Room Code?</h2>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-2.5 rounded-lg mb-3">
            {error}
          </div>
        )}

        <form onSubmit={handleDirectJoin} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Enter 8-digit code (e.g. T6YZ-POM2)"
            value={directCode}
            onChange={(e) => {
              setDirectCode(e.target.value.toUpperCase());
              setError(null);
            }}
            maxLength={10}
            className="flex-1 bg-bg-elevated border border-border-subtle rounded-xl px-4 py-2.5 font-mono text-sm tracking-wider text-text-primary placeholder:text-text-muted/60 focus:outline-none focus:border-accent-blue transition uppercase"
          />
          <button
            type="submit"
            disabled={!directCode.trim()}
            className="px-6 py-2.5 rounded-xl bg-accent-blue hover:bg-blue-600 disabled:opacity-50 text-white text-sm font-semibold transition flex items-center justify-center gap-2 shadow-md shadow-accent-blue/20"
          >
            <span>Join Room</span>
            <ArrowRight size={16} />
          </button>
        </form>
      </div>

      {/* Path B: Browse Public Rooms with filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Radio size={18} className="text-emerald-400 animate-pulse" />
            <h2 className="text-base font-semibold text-text-primary">Public Watch Parties</h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="Search rooms..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-bg-surface border border-border-subtle rounded-xl pl-9 pr-3 py-1.5 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-blue transition"
              />
            </div>

            {/* Language Filter */}
            <div className="relative">
              <Globe size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-bg-surface border border-border-subtle rounded-xl pl-8 pr-4 py-1.5 text-xs text-text-primary focus:outline-none focus:border-accent-blue transition appearance-none cursor-pointer"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Public Rooms Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 rounded-2xl bg-bg-surface/50 border border-border-subtle animate-pulse" />
            ))}
          </div>
        ) : publicRooms.length === 0 ? (
          <div className="bg-bg-surface border border-border-subtle rounded-2xl p-12 text-center text-text-muted">
            <Radio size={32} className="mx-auto mb-2 opacity-40" />
            <p className="text-sm font-medium">No live public rooms match your criteria.</p>
            <p className="text-xs mt-1">Be the pioneer and host one yourself!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {publicRooms.map((r) => (
              <div
                key={r.id}
                onClick={() => navigate(`/room/${r.code}`)}
                className="group bg-bg-surface hover:bg-bg-elevated/70 border border-border-subtle hover:border-accent-blue/40 rounded-2xl p-5 transition cursor-pointer shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-mono font-bold text-accent-blue bg-accent-blue/10 px-2 py-0.5 rounded border border-accent-blue/20">
                      {r.code}
                    </span>
                    <span className="text-[11px] text-text-muted bg-bg-elevated px-2 py-0.5 rounded-full border border-border-subtle">
                      {r.language}
                    </span>
                  </div>
                  <h3 className="font-semibold text-sm text-text-primary group-hover:text-accent-blue transition line-clamp-1">
                    {r.name}
                  </h3>
                  {r.description && (
                    <p className="text-xs text-text-muted mt-1 line-clamp-2">{r.description}</p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 mt-3 border-t border-border-subtle/50 text-xs text-text-muted">
                  <div className="flex items-center gap-1.5">
                    <Users size={13} />
                    <span>Host: {r.hostUsername || 'Host'}</span>
                  </div>
                  <span className="text-accent-blue font-medium flex items-center gap-1 group-hover:translate-x-1 transition">
                    Join <ArrowRight size={13} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
