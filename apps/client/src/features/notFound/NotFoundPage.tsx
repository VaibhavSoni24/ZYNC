import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6 bg-bg-surface border border-border-subtle rounded-3xl p-8 shadow-2xl">
        <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full gradient-brand blur-xl opacity-30 animate-pulse" />
          <div className="relative w-20 h-20 rounded-2xl bg-bg-elevated border border-border-subtle flex items-center justify-center text-accent-blue shadow-inner">
            <Film size={36} />
          </div>
        </div>

        <div>
          <span className="text-xs font-mono font-bold text-accent-purple bg-accent-purple/10 px-3 py-1 rounded-full border border-accent-purple/20">
            ERROR 404
          </span>
          <h1 className="text-2xl font-bold text-text-primary mt-3">Watch Party Not Found</h1>
          <p className="text-xs text-text-muted mt-2 leading-relaxed">
            The room or link you are seeking has drifted off the timeline or was never created.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            to="/home"
            className="flex-1 py-2.5 px-4 rounded-xl gradient-brand text-white text-xs font-semibold shadow-md shadow-accent-blue/20 hover:opacity-95 transition flex items-center justify-center gap-2"
          >
            <Home size={14} />
            <span>Return Home</span>
          </Link>
          <Link
            to="/room/join"
            className="flex-1 py-2.5 px-4 rounded-xl bg-bg-elevated hover:bg-border-subtle border border-border-subtle text-text-primary text-xs font-semibold transition flex items-center justify-center gap-2"
          >
            <ArrowLeft size={14} />
            <span>Browse Rooms</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
