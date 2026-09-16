import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

interface PageTransitionProps {
  children: React.ReactNode;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();
  const [transitionKey, setTransitionKey] = useState(location.pathname);

  useEffect(() => {
    // Scroll smoothly to top on navigation
    window.scrollTo({ top: 0, behavior: 'instant' });
    setTransitionKey(`${location.pathname}-${Date.now()}`);
  }, [location.pathname]);

  return (
    <>
      {/* Sleek Center-Outward Glowing Top Transition Beam */}
      <AnimatePresence mode="wait">
        <motion.div
          key={transitionKey}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{
            scaleX: [0, 0.45, 0.88, 1],
            opacity: [0, 1, 1, 0]
          }}
          transition={{
            scaleX: { duration: 0.52, ease: [0.16, 1, 0.3, 1] },
            opacity: { duration: 0.58, times: [0, 0.2, 0.7, 1], ease: 'easeOut' }
          }}
          className="fixed top-0 left-0 right-0 h-[2.5px] z-50 origin-center bg-gradient-to-r from-transparent via-cyan-400 via-accent-blue via-accent-purple to-transparent shadow-[0_0_24px_rgba(46,124,246,0.9),0_0_12px_rgba(155,60,255,0.9)] pointer-events-none"
        />
      </AnimatePresence>

      {/* Dynamic Animated Page Content */}
      <div key={location.pathname} className="animate-page-enter">
        {children}
      </div>
    </>
  );
};

