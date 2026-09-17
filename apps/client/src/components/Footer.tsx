import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative z-10 bg-[#070710]/90 backdrop-blur-xl mt-12 sm:mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted">
        <div className="flex items-center gap-2">
          <span className="font-bold text-white text-sm tracking-tight">Zync</span>
          <span className="text-white/40">-</span>
          <span className="text-white/60">Watch Together, Perfectly in Sync</span>
        </div>

        <div className="flex items-center gap-6">
          <Link to="/about" className="text-white/70 hover:text-white transition font-medium">About</Link>
          <Link to="/contact" className="text-white/70 hover:text-white transition font-medium">Contact</Link>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-white/50">
          <span>Engineered with</span>
          <Heart size={12} className="text-red-500 fill-red-500 inline-block" />
          <span className="text-white/70 font-medium">by Vaibhav Soni</span>
        </div>
      </div>
    </footer>
  );
};
