'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { FloralCorner } from '@/components/ui/FloralMotif';

interface CinematicPortalProps {
  onEnter: () => void;
}

const subscribeReducedMotion = (callback: () => void) => {
  if (typeof window === 'undefined') return () => {};
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  mediaQuery.addEventListener('change', callback);
  return () => mediaQuery.removeEventListener('change', callback);
};

const getReducedMotionSnapshot = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export const CinematicPortal: React.FC<CinematicPortalProps> = ({ onEnter }) => {
  const [isZooming, setIsZooming] = useState(false);
  const [isHoveringO, setIsHoveringO] = useState(false);
  const prefersReducedMotion = React.useSyncExternalStore(subscribeReducedMotion, getReducedMotionSnapshot, () => false);
  const oLetterRef = useRef<HTMLSpanElement>(null);
  const [portalOrigin, setPortalOrigin] = useState({ x: 50, y: 50 });

  const triggerPortal = () => {
    if (isZooming) return;

    if (prefersReducedMotion) {
      onEnter();
      return;
    }

    // Calculate O center percentage relative to viewport for accurate portal expansion
    if (oLetterRef.current) {
      const rect = oLetterRef.current.getBoundingClientRect();
      const xPct = ((rect.left + rect.width / 2) / window.innerWidth) * 100;
      const yPct = ((rect.top + rect.height / 2) / window.innerHeight) * 100;
      setPortalOrigin({ x: Math.round(xPct), y: Math.round(yPct) });
    }

    setIsZooming(true);

    // After animation duration, reveal complete homepage
    const timer = setTimeout(() => {
      onEnter();
    }, 1350);

    return () => clearTimeout(timer);
  };

  return (
    <div
      role="dialog"
      aria-label="Welcome to FESTORA"
      aria-modal="true"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FAF8F3] overflow-hidden select-none transition-all"
      style={{
        // Dynamic circular aperture mask centered on the letter O
        clipPath: isZooming
          ? `circle(150vmax at ${portalOrigin.x}% ${portalOrigin.y}%)`
          : undefined,
        transition: isZooming ? 'clip-path 1.35s cubic-bezier(0.7, 0, 0.2, 1)' : undefined,
      }}
    >
      {/* Subtle Warm Ivory & Rose Grain Background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 -z-10"
        style={{
          backgroundImage: 'radial-gradient(rgba(200, 173, 120, 0.18) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Ambient Floral Glow Orbs */}
      <div
        aria-hidden="true"
        className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#F5E3E4]/70 via-[#D8C9DF]/30 to-transparent blur-3xl pointer-events-none -z-10 animate-glow"
        style={{ top: '20%', left: '15%' }}
      />
      <div
        aria-hidden="true"
        className="absolute w-[450px] h-[450px] rounded-full bg-gradient-to-tl from-[#A8B69A]/30 via-[#C8AD78]/25 to-transparent blur-3xl pointer-events-none -z-10 animate-glow"
        style={{ bottom: '15%', right: '15%' }}
      />

      {/* Delicate Botanical Corners */}
      <FloralCorner position="top-left" size={170} opacity={0.35} />
      <FloralCorner position="top-right" size={170} opacity={0.35} />
      <FloralCorner position="bottom-left" size={170} opacity={0.35} />
      <FloralCorner position="bottom-right" size={170} opacity={0.35} />

      {/* Floating Petal Accents */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        {[
          { top: '18%', left: '22%', delay: 0, duration: 6, rot: 15, scale: 0.9 },
          { top: '25%', right: '28%', delay: 1.5, duration: 7, rot: -25, scale: 1.1 },
          { bottom: '28%', left: '30%', delay: 0.8, duration: 8, rot: 40, scale: 0.8 },
          { bottom: '20%', right: '22%', delay: 2.2, duration: 6.5, rot: -10, scale: 1 },
          { top: '60%', left: '14%', delay: 3, duration: 7.5, rot: 30, scale: 0.85 },
        ].map((petal, i) => (
          <motion.div
            key={i}
            initial={{ y: 0, opacity: 0.4 }}
            animate={{
              y: [-12, 12, -12],
              rotate: [petal.rot, petal.rot + 15, petal.rot],
              opacity: [0.35, 0.65, 0.35],
            }}
            transition={{
              duration: petal.duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: petal.delay,
            }}
            className="absolute"
            style={{
              top: petal.top,
              left: petal.left,
              right: petal.right,
              bottom: petal.bottom,
              transform: `scale(${petal.scale})`,
            }}
          >
            <svg width="28" height="34" viewBox="0 0 28 34" fill="none">
              <path
                d="M14 0C6 10 0 18 0 25C0 30 6 34 14 34C22 34 28 30 28 25C28 18 22 10 14 0Z"
                fill="#D9858D"
                fillOpacity="0.22"
              />
              <path
                d="M14 6C11 14 8 20 8 26"
                stroke="#C8AD78"
                strokeWidth="0.75"
                strokeOpacity="0.4"
                strokeLinecap="round"
              />
            </svg>
          </motion.div>
        ))}
      </div>

      {/* Accessible Skip Button */}
      <button
        onClick={onEnter}
        type="button"
        className="absolute top-6 right-6 sm:top-8 sm:right-8 z-30 px-4 py-2 rounded-full bg-white/80 hover:bg-white border border-[#E9E0D8] text-xs font-mono tracking-wider text-[#766B70] hover:text-[#30252D] shadow-xs backdrop-blur-md transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5 focus:outline-none"
        aria-label="Skip introduction and view website"
      >
        <span>Skip Intro</span>
        <ArrowRight className="w-3.5 h-3.5 text-[#D9858D]" />
      </button>

      {/* Main Center Composition */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 max-w-4xl">
        
        {/* Curated Subtitle / Brand Badge */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={isZooming ? { opacity: 0, y: -30 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6 sm:mb-8 flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-[#E9E0D8] text-[11px] font-mono tracking-widest uppercase text-[#766B70] shadow-xs backdrop-blur-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#D9858D]" />
          <span>Bespoke Celebration Studio</span>
        </motion.div>

        {/* Wordmark FESTORA with Interactive Letter 'O' Portal */}
        <div
          className="relative flex items-center justify-center font-serif text-6xl sm:text-8xl md:text-9xl lg:text-[10.5rem] font-bold tracking-tight text-[#30252D] leading-none cursor-pointer group"
          onClick={triggerPortal}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              triggerPortal();
            }
          }}
          aria-label="FESTORA. Click the letter O to enter the celebration studio"
        >
          {/* Letters F-E-S-T */}
          <motion.span
            animate={
              isZooming
                ? {
                    x: -260,
                    opacity: 0,
                    filter: 'blur(8px)',
                    scale: 0.8,
                  }
                : { x: 0, opacity: 1, filter: 'blur(0px)', scale: 1 }
            }
            transition={{ duration: 0.9, ease: [0.7, 0, 0.2, 1] }}
            className="inline-block transition-transform duration-300"
          >
            FEST
          </motion.span>

          {/* Letter 'O' — The Defining Portal Anchor */}
          <span
            ref={oLetterRef}
            onMouseEnter={() => setIsHoveringO(true)}
            onMouseLeave={() => setIsHoveringO(false)}
            className="relative inline-flex items-center justify-center mx-0.5 sm:mx-1 transition-transform"
          >
            {/* Interactive Ring / Floral Halo around the O */}
            <motion.span
              animate={
                isZooming
                  ? {
                      scale: [1, 2.5, 35],
                      opacity: [1, 0.9, 0],
                    }
                  : isHoveringO
                  ? { scale: 1.15, opacity: 1 }
                  : {
                      scale: [1, 1.06, 1],
                      opacity: [0.65, 0.95, 0.65],
                    }
              }
              transition={
                isZooming
                  ? { duration: 1.25, ease: [0.7, 0, 0.2, 1] }
                  : isHoveringO
                  ? { duration: 0.3 }
                  : { duration: 3, repeat: Infinity, ease: 'easeInOut' }
              }
              className="absolute inset-[-14%] sm:inset-[-18%] rounded-full border-2 border-dashed border-[#D9858D] pointer-events-none"
              style={{
                boxShadow: isHoveringO
                  ? '0 0 35px 8px rgba(217, 133, 141, 0.45), 0 0 15px rgba(200, 173, 120, 0.5) inset'
                  : '0 0 20px 4px rgba(217, 133, 141, 0.2)',
              }}
            />

            {/* Subtle rotating floral wreath around O */}
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-[-28%] rounded-full pointer-events-none opacity-40 hidden sm:block"
            >
              <svg viewBox="0 0 100 100" fill="none" className="w-full h-full text-[#A8B69A]">
                <circle cx="50" cy="5" r="2.5" fill="#D9858D" />
                <circle cx="95" cy="50" r="2" fill="#C8AD78" />
                <circle cx="50" cy="95" r="2.5" fill="#D8C9DF" />
                <circle cx="5" cy="50" r="2" fill="#A8B69A" />
              </svg>
            </motion.span>

            {/* The Actual Letter 'O' */}
            <motion.span
              animate={
                isZooming
                  ? {
                      scale: [1, 1.4, 28],
                      opacity: [1, 1, 0.15],
                    }
                  : isHoveringO
                  ? {
                      scale: 1.08,
                      color: '#D9858D',
                    }
                  : {
                      scale: 1,
                      color: '#30252D',
                    }
              }
              transition={
                isZooming
                  ? { duration: 1.3, ease: [0.7, 0, 0.2, 1] }
                  : { duration: 0.3 }
              }
              className="inline-block relative z-10 transition-colors"
            >
              O
            </motion.span>

            {/* Core Lens Flare when Hovering */}
            <AnimatePresence>
              {isHoveringO && !isZooming && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.25 }}
                  className="absolute w-8 h-8 rounded-full bg-radial from-[#D9858D]/40 to-transparent blur-md pointer-events-none"
                />
              )}
            </AnimatePresence>
          </span>

          {/* Letters R-A */}
          <motion.span
            animate={
              isZooming
                ? {
                    x: 260,
                    opacity: 0,
                    filter: 'blur(8px)',
                    scale: 0.8,
                  }
                : { x: 0, opacity: 1, filter: 'blur(0px)', scale: 1 }
            }
            transition={{ duration: 0.9, ease: [0.7, 0, 0.2, 1] }}
            className="inline-block transition-transform duration-300"
          >
            RA
          </motion.span>
        </div>

        {/* Tagline beneath wordmark */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isZooming ? { opacity: 0, y: 15 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-4 sm:mt-6 font-serif italic text-lg sm:text-2xl text-[#766B70] tracking-wide"
        >
          Big moments. Beautifully orchestrated.
        </motion.p>

        {/* Click to Enter Prompt */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={
            isZooming
              ? { opacity: 0, scale: 0.8 }
              : {
                  opacity: [0.7, 1, 0.7],
                  y: [0, -3, 0],
                }
          }
          transition={
            isZooming
              ? { duration: 0.4 }
              : { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }
          }
          className="mt-8 sm:mt-10 flex flex-col items-center gap-2 cursor-pointer"
          onClick={triggerPortal}
        >
          <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-[#E9E0D8] shadow-sm hover:border-[#D9858D] hover:shadow-md transition-all text-xs font-mono font-semibold tracking-widest text-[#30252D] uppercase group">
            <span className="w-2 h-2 rounded-full bg-[#D9858D] animate-ping" />
            <span>Click The &apos;O&apos; To Enter</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#D9858D] group-hover:translate-x-1 transition-transform" />
          </div>
          <span className="text-[11px] font-mono text-[#766B70]/80">
            A botanical journey into bespoke celebration planning
          </span>
        </motion.div>

      </div>
    </div>
  );
};
