import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Video, LogIn, Sparkles, Flame, Users, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { AvatarIcon } from '../../assets/avatars';
import { RoomDto } from '@zync/shared';
import { apiRequest } from '../../lib/api';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [featuredRooms, setFeaturedRooms] = useState<RoomDto[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(false);

  useEffect(() => {
    const loadFeatured = async () => {
      setLoadingRooms(true);
      try {
        const res = await apiRequest('/api/rooms/public');
        if (res.success && Array.isArray(res.data)) {
          setFeaturedRooms(res.data.slice(0, 4));
        }
      } catch {
        // ignore
      } finally {
        setLoadingRooms(false);
      }
    };
    loadFeatured();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-bg-surface via-bg-elevated to-bg-surface border border-border-subtle rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-bg-surface border border-border-subtle flex items-center justify-center p-1 flex-shrink-0 shadow-inner">
              <AvatarIcon name={user?.avatar || 'Comet'} size={54} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-text-primary">
                  Welcome, {user?.name || 'Friend'}!
                </h1>
                <span className="text-xs font-mono text-accent-blue bg-accent-blue/10 px-2.5 py-0.5 rounded-full border border-accent-blue/20">
                  @{user?.username}
                </span>
              </div>
              <p className="text-xs text-text-muted mt-1">
                Ready to watch together? Start your own party or hop into an existing theater.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              to="/room/host"
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl gradient-brand text-white font-semibold text-xs shadow-lg shadow-accent-blue/20 hover:opacity-95 transition flex items-center justify-center gap-2"
            >
              <Sparkles size={14} />
              <span>Host Party</span>
            </Link>
            <Link
              to="/room/join"
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-bg-surface hover:bg-bg-elevated border border-border-subtle text-text-primary font-semibold text-xs transition flex items-center justify-center gap-2"
            >
              <LogIn size={14} />
              <span>Join Party</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Action Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div
          onClick={() => navigate('/room/host')}
          className="group bg-bg-surface hover:bg-bg-elevated border border-border-subtle hover:border-accent-blue/40 rounded-3xl p-6 sm:p-8 transition cursor-pointer shadow-xl relative overflow-hidden"
        >
          <div className="p-3 w-fit rounded-2xl bg-accent-blue/10 text-accent-blue mb-4 group-hover:scale-110 transition">
            <Video size={28} />
          </div>
          <h2 className="text-lg font-bold text-text-primary group-hover:text-accent-blue transition">
            Host a New Room
          </h2>
          <p className="text-xs text-text-muted mt-2 leading-relaxed">
            Create a custom room with visibility controls, select languages, and take the Host seat with full playback permissions.
          </p>
          <div className="mt-6 flex items-center text-xs font-semibold text-accent-blue gap-1.5 group-hover:translate-x-1.5 transition">
            <span>Launch theater</span>
            <ArrowRight size={14} />
          </div>
        </div>

        <div
          onClick={() => navigate('/room/join')}
          className="group bg-bg-surface hover:bg-bg-elevated border border-border-subtle hover:border-accent-purple/40 rounded-3xl p-6 sm:p-8 transition cursor-pointer shadow-xl relative overflow-hidden"
        >
          <div className="p-3 w-fit rounded-2xl bg-accent-purple/10 text-accent-purple mb-4 group-hover:scale-110 transition">
            <Users size={28} />
          </div>
          <h2 className="text-lg font-bold text-text-primary group-hover:text-accent-purple transition">
            Join an Existing Room
          </h2>
          <p className="text-xs text-text-muted mt-2 leading-relaxed">
            Have an 8-character invite code from a friend? Or browse active public parties organized by language.
          </p>
          <div className="mt-6 flex items-center text-xs font-semibold text-accent-purple gap-1.5 group-hover:translate-x-1.5 transition">
            <span>Find watch party</span>
            <ArrowRight size={14} />
          </div>
        </div>
      </div>

      {/* Featured / Live Rooms */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame size={18} className="text-amber-400" />
            <h2 className="text-base font-bold text-text-primary">Live Community Theaters</h2>
          </div>
          <Link to="/room/join" className="text-xs text-accent-blue hover:underline">
            View all &rarr;
          </Link>
        </div>

        {loadingRooms ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-28 rounded-2xl bg-bg-surface border border-border-subtle animate-pulse" />
            ))}
          </div>
        ) : featuredRooms.length === 0 ? (
          <div className="bg-bg-surface border border-border-subtle rounded-2xl p-8 text-center text-text-muted text-xs">
            No public rooms currently active. Be the first to start one!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {featuredRooms.map((r) => (
              <div
                key={r.id}
                onClick={() => navigate(`/room/${r.code}`)}
                className="bg-bg-surface hover:bg-bg-elevated border border-border-subtle hover:border-accent-blue/30 rounded-2xl p-4 transition cursor-pointer shadow-md flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-accent-blue bg-accent-blue/10 px-2 py-0.5 rounded">
                      {r.code}
                    </span>
                    <span className="text-[10px] text-text-muted bg-bg-elevated px-2 py-0.5 rounded-full">
                      {r.language}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-text-primary line-clamp-1">{r.name}</h4>
                  <p className="text-[11px] text-text-muted mt-0.5">Host: {r.hostUsername || 'Host'}</p>
                </div>
                <div className="p-2 rounded-xl bg-bg-elevated text-text-muted hover:text-accent-blue transition">
                  <ArrowRight size={16} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
