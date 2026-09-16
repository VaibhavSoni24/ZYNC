import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: React.ReactNode;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();
  const [progress, setProgress] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    // Scroll smoothly to top on navigation
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Trigger glowing top route transition progress bar
    setIsNavigating(true);
    setProgress(25);

    const t1 = setTimeout(() => setProgress(75), 80);
    const t2 = setTimeout(() => {
      setProgress(100);
      const t3 = setTimeout(() => {
        setIsNavigating(false);
        setProgress(0);
      }, 200);
      return () => clearTimeout(t3);
    }, 220);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [location.pathname]);

  return (
    <>
      {/* Sleek Top Glow Loading Progress Bar */}
      {isNavigating && (
        <div
          className="fixed top-0 left-0 h-[2.5px] z-50 transition-all duration-200 ease-out bg-gradient-to-r from-accent-blue via-accent-purple to-cyan-400 shadow-[0_0_16px_rgba(155,60,255,0.9)] pointer-events-none"
          style={{ width: `${progress}%` }}
        />
      )}

      {/* Dynamic Animated Page Content */}
      <div key={location.pathname} className="animate-page-enter">
        {children}
      </div>
    </>
  );
};
