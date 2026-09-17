import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Video,
  LogIn,
  Flame,
  Users,
  ArrowRight,
  Zap,
  Radio,
  MessageSquare,
  Shield,
  Plus,
  Play
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { AvatarIcon } from '../../assets/avatars';
import { Floating3DShapes } from '../../components/Background/Floating3DShapes';
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
          setFeaturedRooms(res.data.slice(0, 6));
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
    <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-6 sm:py-10 space-y-12">
      {/* Dedicated Floating 3D Shapes Layer for HomePage */}
      <Floating3DShapes />

      {/* Background Ambient Radial Glow Orbs */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[850px] h-[380px] bg-gradient-to-r from-accent-blue/15 via-accent-purple/20 to-accent-blue/10 blur-[130px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-5 w-[500px] h-[300px] bg-accent-blue/10 blur-[140px] pointer-events-none -z-10" />

      {/* 1. TOP SECTION: Welcome Back Header (Unboxed / No Card Container) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-2 pb-2">
        <div className="flex items-center gap-4 sm:gap-5">
          <div className="relative flex-shrink-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#090914]/80 border border-white/15 flex items-center justify-center p-1 shadow-[0_0_25px_rgba(46,124,246,0.25)] backdrop-blur-md">
              <AvatarIcon name={user?.avatar || 'Comet'} size={64} />
            </div>
            <span
              className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#090914] flex items-center justify-center shadow-[0_0_8px_rgba(16,185,129,0.8)]"
              title="Online"
            />
          </div>

          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Welcome back, {user?.name || 'Friend'}!
              </h1>
              <span className="text-xs font-mono text-accent-blue bg-accent-blue/15 px-2.5 py-0.5 rounded-full border border-accent-blue/25 font-semibold">
                @{user?.username}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 mt-1.5">
              Ready to watch together? Start your own watch party or hop into an existing theater.
            </p>
          </div>
        </div>

        {/* Action Buttons: Host Party (NO AI sparkles) & Join Party */}
        <div className="flex items-center gap-3 w-full sm:w-auto flex-shrink-0">
          <Link
            to="/room/host"
            className="flex-1 sm:flex-none px-6 py-3 rounded-xl gradient-brand text-white font-semibold text-xs sm:text-sm shadow-lg shadow-accent-blue/25 hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2 group"
          >
            <Video size={16} className="group-hover:scale-110 transition-transform" />
            <span>Host Party</span>
          </Link>
          <Link
            to="/room/join"
            className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-accent-blue/30 text-white font-semibold text-xs sm:text-sm transition flex items-center justify-center gap-2 active:scale-95 shadow-md backdrop-blur-sm"
          >
            <LogIn size={16} />
            <span>Join Party</span>
          </Link>
        </div>
      </div>

      {/* 2. SECOND SECTION: About Zync Spotlight (Unboxed / No Card Container) */}
      <section className="relative pt-2 pb-2 space-y-6">
        {/* Floating Telemetry Badges Left & Right (Center button removed) */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {/* Floating Telemetry 1 (Left) */}
          <div className="flex items-center gap-3 p-2 px-3.5 rounded-2xl bg-[#080811]/90 border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] animate-float-slow select-none backdrop-blur-md">
            <div className="w-7 h-7 rounded-xl bg-accent-blue/20 border border-accent-blue/30 flex items-center justify-center text-accent-blue shadow-[0_0_12px_rgba(46,124,246,0.35)]">
              <Zap size={14} className="animate-pulse" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-bold text-white tracking-wide">4.2ms Sync Drift</span>
              </div>
              <p className="text-[10px] text-gray-400 font-mono">Zero audio phase error</p>
            </div>
          </div>

          {/* Floating Telemetry 2 (Right) */}
          <div className="flex items-center gap-3 p-2 px-3.5 rounded-2xl bg-[#080811]/90 border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] animate-float-reverse select-none backdrop-blur-md">
            <div className="w-7 h-7 rounded-xl bg-accent-purple/20 border border-accent-purple/30 flex items-center justify-center text-accent-purple shadow-[0_0_12px_rgba(155,60,255,0.35)]">
              <Radio size={14} className="animate-spin-slow" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <div className="flex items-end gap-0.5 h-3">
                  <span className="w-1 bg-accent-purple rounded-full animate-wave-bar-1" />
                  <span className="w-1 bg-accent-purple rounded-full animate-wave-bar-2" />
                  <span className="w-1 bg-accent-purple rounded-full animate-wave-bar-3" />
                  <span className="w-1 bg-accent-purple rounded-full animate-wave-bar-4" />
                </div>
                <span className="text-xs font-bold text-white ml-1">WebSocket 60Hz</span>
              </div>
              <p className="text-[10px] text-gray-400 font-mono">Real-time playhead feed</p>
            </div>
          </div>
        </div>

        {/* Main Zync Pitch */}
        <div className="max-w-3xl">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Watch Together in <span className="gradient-brand-text font-black">Perfect Sync</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-300 mt-2.5 leading-relaxed">
            Zync locks every play, pause, seek, and buffer across all screens in real-time. Experience videos with friends as if you're sitting on the same couch — zero phase lag, live theater chat, and expressive floating emoji bursts.
          </p>
        </div>

        {/* 3 Core Highlights (Open, sleek glass pills/cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#0c0c16]/70 border border-white/10 hover:border-accent-blue/30 transition shadow-lg backdrop-blur-sm">
            <div className="p-2.5 rounded-xl bg-accent-blue/15 text-accent-blue flex-shrink-0">
              <Zap size={18} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Sub-50ms Lock</h4>
              <p className="text-xs text-gray-400 mt-1 leading-snug">
                Adaptive drift correction keeps every stream frame-synchronized worldwide.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#0c0c16]/70 border border-white/10 hover:border-accent-purple/30 transition shadow-lg backdrop-blur-sm">
            <div className="p-2.5 rounded-xl bg-accent-purple/15 text-accent-purple flex-shrink-0">
              <MessageSquare size={18} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Live Theater Chat</h4>
              <p className="text-xs text-gray-400 mt-1 leading-snug">
                Low-latency chat, sound effects, and animated floating emoji reactions.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#0c0c16]/70 border border-white/10 hover:border-emerald-500/30 transition shadow-lg backdrop-blur-sm">
            <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 flex-shrink-0">
              <Shield size={18} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Host Authority</h4>
              <p className="text-xs text-gray-400 mt-1 leading-snug">
                Full host permissions, co-host delegation, and private invite codes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. QUICK ACTION TILES (Full-Width 2-Column Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div
          onClick={() => navigate('/room/host')}
          className="group relative bg-[#0d0d1a]/90 hover:bg-[#121226] border border-white/10 hover:border-accent-blue/50 rounded-3xl p-6 sm:p-8 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-[0_15px_40px_rgba(46,124,246,0.15)] overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-36 h-36 bg-accent-blue/10 rounded-full blur-3xl pointer-events-none group-hover:bg-accent-blue/20 transition duration-500" />
          <div className="p-3.5 w-fit rounded-2xl bg-accent-blue/15 text-accent-blue mb-4 border border-accent-blue/25 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(46,124,246,0.4)] transition duration-300">
            <Video size={28} />
          </div>
          <h2 className="text-xl font-bold text-white group-hover:text-accent-blue transition">
            Host a New Room
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-2 leading-relaxed">
            Create a custom room with visibility controls, select languages, and take the Host seat with authoritative playback sync.
          </p>
          <div className="mt-6 flex items-center text-xs font-semibold text-accent-blue gap-2 group-hover:translate-x-2 transition-transform">
            <span>Launch theater</span>
            <ArrowRight size={14} />
          </div>
        </div>

        <div
          onClick={() => navigate('/room/join')}
          className="group relative bg-[#0d0d1a]/90 hover:bg-[#121226] border border-white/10 hover:border-accent-purple/50 rounded-3xl p-6 sm:p-8 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-[0_15px_40px_rgba(155,60,255,0.15)] overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-36 h-36 bg-accent-purple/10 rounded-full blur-3xl pointer-events-none group-hover:bg-accent-purple/20 transition duration-500" />
          <div className="p-3.5 w-fit rounded-2xl bg-accent-purple/15 text-accent-purple mb-4 border border-accent-purple/25 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(155,60,255,0.4)] transition duration-300">
            <Users size={28} />
          </div>
          <h2 className="text-xl font-bold text-white group-hover:text-accent-purple transition">
            Join an Existing Room
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-2 leading-relaxed">
            Enter an 8-character invite code from a friend or browse live community rooms organized by language and category.
          </p>
          <div className="mt-6 flex items-center text-xs font-semibold text-accent-purple gap-2 group-hover:translate-x-2 transition-transform">
            <span>Find watch party</span>
            <ArrowRight size={14} />
          </div>
        </div>
      </div>

      {/* 4. FEATURED / LIVE ROOMS SECTION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-amber-500/15 border border-amber-500/25">
              <Flame size={18} className="text-amber-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">Live Community Theaters</h2>
              <p className="text-[11px] text-gray-400">Public rooms currently streaming</p>
            </div>
          </div>
          <Link
            to="/room/join"
            className="text-xs font-medium text-accent-blue hover:text-accent-blue-hover flex items-center gap-1 group transition"
          >
            <span>View all</span>
            <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loadingRooms ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-36 rounded-2xl bg-[#0d0d18] border border-white/5 animate-pulse"
              />
            ))}
          </div>
        ) : featuredRooms.length === 0 ? (
          <div className="bg-[#0c0c16]/80 border border-white/10 rounded-3xl p-10 sm:p-14 text-center">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-3 text-text-muted">
              <Play size={20} />
            </div>
            <h3 className="text-sm font-semibold text-white">No Public Rooms Active</h3>
            <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
              There are no live community watch parties streaming right now. Be the first to start one!
            </p>
            <button
              onClick={() => navigate('/room/host')}
              className="mt-4 px-5 py-2.5 rounded-xl gradient-brand text-white font-semibold text-xs hover:brightness-110 transition inline-flex items-center gap-2 shadow-lg shadow-accent-blue/20"
            >
              <Plus size={14} />
              <span>Create First Room</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {featuredRooms.map((r) => (
              <div
                key={r.id}
                onClick={() => navigate(`/room/${r.code}`)}
                className="group relative bg-[#0c0c16]/90 hover:bg-[#111124] border border-white/10 hover:border-accent-blue/40 rounded-2xl p-5 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="font-mono text-xs font-bold text-accent-blue bg-accent-blue/15 px-2.5 py-0.5 rounded border border-accent-blue/30 tracking-wider">
                      {r.code}
                    </span>
                    <div className="flex items-center gap-2">
                      {/* Active participant count badge */}
                      <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                        <Users size={11} />
                        <span>{r.participantCount || 1} watching</span>
                      </span>
                      <span className="text-[10px] text-text-muted bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                        {r.language}
                      </span>
                    </div>
                  </div>

                  <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-accent-blue transition line-clamp-1">
                    {r.name}
                  </h4>
                  {r.description && (
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                      {r.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3.5 mt-4 border-t border-white/5 text-xs text-text-muted">
                  <span className="truncate">Host: <strong className="text-text-secondary font-medium">@{r.hostUsername || 'Host'}</strong></span>
                  <span className="text-accent-blue font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Enter <ArrowRight size={13} />
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
