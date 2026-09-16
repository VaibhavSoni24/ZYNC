import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border-subtle bg-bg-surface/40 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted">
        <div className="flex items-center gap-2">
          <span className="font-bold text-text-primary">Zync</span>
          <span>-</span>
          <span>Watch Together, Perfectly in Sync</span>
        </div>

        <div className="flex items-center gap-6">
          <Link to="/about" className="hover:text-text-primary transition">About</Link>
          <Link to="/contact" className="hover:text-text-primary transition">Contact</Link>
        </div>

        <div className="flex items-center gap-1 text-[11px]">
          <span>Engineered with</span>
          <Heart size={12} className="text-red-500 fill-red-500" />
          <span>by Vaibhav Soni</span>
        </div>
      </div>
    </footer>
  );
};
