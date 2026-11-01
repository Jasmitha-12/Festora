'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { EyeOff, Eye } from 'lucide-react';

interface FloatingCelebrationElementsProps {
  className?: string;
}

export const FloatingCelebrationElements: React.FC<FloatingCelebrationElementsProps> = ({
  className = '',
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (shouldReduceMotion) return;

    let rafId: number;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handlePointerMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      targetX = (e.clientX / innerWidth - 0.5) * 2;
      targetY = (e.clientY / innerHeight - 0.5) * 2;
    };

    const updateLoop = () => {
      currentX += (targetX - currentX) * 0.04;
      currentY += (targetY - currentY) * 0.04;
      setMousePos({ x: currentX, y: currentY });
      rafId = requestAnimationFrame(updateLoop);
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    rafId = requestAnimationFrame(updateLoop);

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      cancelAnimationFrame(rafId);
    };
  }, [shouldReduceMotion]);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 left-4 z-40 p-2 rounded-full bg-white/90 border border-[#E9E0D8] text-[#766B70] hover:text-[#30252D] shadow-xs backdrop-blur-md transition-all text-xs flex items-center gap-1.5 no-print"
        title="Show 3D celebration elements"
        aria-label="Show 3D celebration elements"
      >
        <Eye className="w-3.5 h-3.5 text-[#D9858D]" />
        <span className="hidden sm:inline font-mono text-[10px]">3D Atmosphere</span>
      </button>
    );
  }

  return (
    <aside
      ref={containerRef}
      aria-label="Decorative floating celebration elements"
      className={`fixed inset-0 pointer-events-none z-10 overflow-hidden select-none ${className}`}
    >
      {/* Element 1: English Garden Rose (Blush Coral & Champagne Stamen) - Top Left Midground */}
      <div
        className="absolute transition-transform duration-700 ease-out"
        style={{
          top: '12%',
          left: '4%',
          transform: `translate3d(${mousePos.x * 22}px, ${mousePos.y * 18}px, 0) rotate(${
            mousePos.x * 8
          }deg)`,
        }}
      >
        <motion.div
          animate={shouldReduceMotion ? {} : { y: [-6, 6, -6], rotate: [0, 4, 0] }}
          transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut' }}
          className="relative w-16 h-16 sm:w-20 sm:h-20 drop-shadow-[0_12px_24px_rgba(217,133,141,0.22)] opacity-85"
        >
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
            {/* Outer Petals */}
            <path
              d="M50 15 C35 15, 20 28, 20 45 C20 62, 35 80, 50 85 C65 80, 80 62, 80 45 C80 28, 65 15, 50 15 Z"
              fill="url(#roseGradOuter)"
            />
            {/* Layered Middle Petals */}
            <path
              d="M32 35 C25 45, 30 65, 45 70 C60 75, 75 60, 72 45 C70 30, 55 25, 45 28 C35 30, 32 35, 32 35 Z"
              fill="url(#roseGradMid)"
            />
            {/* Inner Spiral Petals */}
            <path
              d="M45 38 C40 42, 42 55, 50 56 C58 57, 62 48, 58 42 C54 36, 48 36, 45 38 Z"
              fill="#D9858D"
            />
            {/* Golden Core Accent */}
            <circle cx="50" cy="46" r="4.5" fill="#C8AD78" />
            <circle cx="48" cy="45" r="1.5" fill="#FFFFFF" />
            {/* Delicate Leaf */}
            <path
              d="M22 55 C12 60, 8 72, 14 78 C20 84, 32 80, 35 70 Z"
              fill="#A8B69A"
              fillOpacity="0.85"
            />

            <defs>
              <linearGradient id="roseGradOuter" x1="20" y1="15" x2="80" y2="85" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F5E3E4" />
                <stop offset="0.6" stopColor="#E2A6AD" />
                <stop offset="1" stopColor="#D9858D" />
              </linearGradient>
              <linearGradient id="roseGradMid" x1="30" y1="25" x2="70" y2="70" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F5E3E4" />
                <stop offset="1" stopColor="#C66E76" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
      </div>

      {/* Element 2: Silk Champagne Ribbon Curl - Top Right Foreground */}
      <div
        className="absolute transition-transform duration-500 ease-out"
        style={{
          top: '18%',
          right: '5%',
          transform: `translate3d(${mousePos.x * -28}px, ${mousePos.y * -22}px, 0) rotate(${
            mousePos.y * -10
          }deg)`,
        }}
      >
        <motion.div
          animate={shouldReduceMotion ? {} : { y: [8, -8, 8], rotate: [-2, 3, -2] }}
          transition={{ duration: 8.5, repeat: Infinity, ease: 'easeInOut' }}
          className="relative w-18 h-24 sm:w-24 sm:h-32 drop-shadow-[0_16px_30px_rgba(200,173,120,0.25)] opacity-80"
        >
          <svg viewBox="0 0 120 160" fill="none" className="w-full h-full">
            <path
              d="M20 10 C50 30, 90 20, 100 55 C110 90, 40 85, 30 115 C20 145, 75 140, 95 155"
              stroke="url(#ribbonGoldGrad)"
              strokeWidth="14"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Satin Sheen Highlight */}
            <path
              d="M25 15 C52 33, 88 25, 96 56 C104 87, 44 83, 34 113 C26 139, 72 138, 90 152"
              stroke="#FFF7E6"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeOpacity="0.8"
            />
            <defs>
              <linearGradient id="ribbonGoldGrad" x1="20" y1="10" x2="100" y2="155" gradientUnits="userSpaceOnUse">
                <stop stopColor="#E8DCC2" />
                <stop offset="0.4" stopColor="#C8AD78" />
                <stop offset="0.8" stopColor="#A98E58" />
                <stop offset="1" stopColor="#E8DCC2" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
      </div>

      {/* Element 3: Pearlescent Champagne Balloon - Mid-Right Background */}
      <div
        className="absolute transition-transform duration-1000 ease-out hidden md:block"
        style={{
          top: '52%',
          right: '3%',
          transform: `translate3d(${mousePos.x * -14}px, ${mousePos.y * -12}px, 0)`,
        }}
      >
        <motion.div
          animate={shouldReduceMotion ? {} : { y: [-10, 10, -10], rotate: [2, -3, 2] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          className="relative w-14 h-20 sm:w-16 sm:h-24 drop-shadow-[0_15px_30px_rgba(48,37,45,0.12)] opacity-75"
        >
          <svg viewBox="0 0 80 120" fill="none" className="w-full h-full">
            {/* Balloon Body */}
            <path
              d="M40 10 C18 10, 8 28, 8 50 C8 72, 25 88, 38 90 L38 94 L42 94 L42 90 C55 88, 72 72, 72 50 C72 28, 62 10, 40 10 Z"
              fill="url(#balloonGrad)"
            />
            {/* Specular Highlight */}
            <ellipse cx="28" cy="32" rx="7" ry="14" transform="rotate(-25 28 32)" fill="#FFFFFF" fillOpacity="0.65" />
            {/* Balloon String */}
            <path
              d="M40 94 Q48 105, 38 115 T42 125"
              stroke="#C8AD78"
              strokeWidth="1.5"
              strokeOpacity="0.75"
              fill="none"
            />
            <defs>
              <radialGradient id="balloonGrad" cx="32" cy="35" r="45" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FFFDFC" />
                <stop offset="0.5" stopColor="#F5E3E4" />
                <stop offset="1" stopColor="#D9858D" />
              </radialGradient>
            </defs>
          </svg>
        </motion.div>
      </div>

      {/* Element 4: Taper Candle in Brass Holder with Warm Flame - Bottom Left */}
      <div
        className="absolute transition-transform duration-600 ease-out hidden lg:block"
        style={{
          bottom: '14%',
          left: '3%',
          transform: `translate3d(${mousePos.x * 16}px, ${mousePos.y * 14}px, 0)`,
        }}
      >
        <motion.div
          animate={shouldReduceMotion ? {} : { y: [4, -4, 4] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
          className="relative w-12 h-24 sm:w-14 sm:h-28 drop-shadow-[0_12px_25px_rgba(200,173,120,0.3)] opacity-80"
        >
          <svg viewBox="0 0 60 120" fill="none" className="w-full h-full">
            {/* Flame with Glow */}
            <circle cx="30" cy="20" r="16" fill="#FFA500" fillOpacity="0.2" className="animate-pulse" />
            <path
              d="M30 6 C24 16, 26 25, 30 28 C34 25, 36 16, 30 6 Z"
              fill="url(#flameGrad)"
            />
            {/* Candle Wick */}
            <line x1="30" y1="28" x2="30" y2="34" stroke="#30252D" strokeWidth="1.5" />
            {/* Ivory Wax Taper */}
            <rect x="25" y="34" width="10" height="58" rx="2" fill="#FAF8F3" stroke="#E9E0D8" strokeWidth="1" />
            {/* Brass Base Holder */}
            <path
              d="M18 92 L42 92 L44 98 L16 98 Z M12 98 L48 98 L50 106 L10 106 Z"
              fill="url(#brassGrad)"
            />
            <defs>
              <linearGradient id="flameGrad" x1="30" y1="6" x2="30" y2="28" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FFF" />
                <stop offset="0.4" stopColor="#FFD700" />
                <stop offset="1" stopColor="#FF4500" />
              </linearGradient>
              <linearGradient id="brassGrad" x1="10" y1="92" x2="50" y2="106" gradientUnits="userSpaceOnUse">
                <stop stopColor="#E8DCC2" />
                <stop offset="0.5" stopColor="#C8AD78" />
                <stop offset="1" stopColor="#7E6838" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
      </div>

      {/* Element 5: Regal Plum & Champagne Gift Box with Bow - Bottom Right */}
      <div
        className="absolute transition-transform duration-800 ease-out hidden sm:block"
        style={{
          bottom: '8%',
          right: '4%',
          transform: `translate3d(${mousePos.x * -20}px, ${mousePos.y * -16}px, 0) rotate(${
            mousePos.x * 6
          }deg)`,
        }}
      >
        <motion.div
          animate={shouldReduceMotion ? {} : { y: [-5, 5, -5], rotate: [-1, 2, -1] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="relative w-16 h-18 sm:w-20 sm:h-22 drop-shadow-[0_16px_35px_rgba(48,37,45,0.2)] opacity-85"
        >
          <svg viewBox="0 0 100 110" fill="none" className="w-full h-full">
            {/* Box Body (Plum) */}
            <rect x="15" y="45" width="70" height="55" rx="6" fill="#30252D" />
            {/* Box Lid (Plum Light) */}
            <rect x="11" y="35" width="78" height="15" rx="4" fill="#4A3A47" stroke="#241A22" strokeWidth="1" />
            {/* Gold Ribbon Vertical */}
            <rect x="44" y="35" width="12" height="65" fill="#C8AD78" />
            {/* Gold Ribbon Horizontal */}
            <rect x="15" y="66" width="70" height="10" fill="#C8AD78" />
            {/* 3D Bow Loops */}
            <ellipse cx="38" cy="25" rx="14" ry="9" transform="rotate(-25 38 25)" fill="#E8DCC2" stroke="#A98E58" strokeWidth="1.5" />
            <ellipse cx="62" cy="25" rx="14" ry="9" transform="rotate(25 62 25)" fill="#E8DCC2" stroke="#A98E58" strokeWidth="1.5" />
            {/* Bow Knot */}
            <circle cx="50" cy="27" r="5" fill="#C8AD78" />
          </svg>
        </motion.div>
      </div>

      {/* Accessible Element Control Toggle in Footer / Corner */}
      <div className="absolute bottom-4 right-4 pointer-events-auto no-print">
        <button
          onClick={() => setIsVisible(false)}
          className="px-3 py-1.5 rounded-full bg-white/80 hover:bg-white border border-[#E9E0D8] text-[#766B70] hover:text-[#30252D] text-[10px] font-mono tracking-wider shadow-xs backdrop-blur-md transition-all flex items-center gap-1.5 opacity-60 hover:opacity-100"
          title="Hide floating 3D atmosphere objects"
          aria-label="Hide floating 3D atmosphere objects"
        >
          <EyeOff className="w-3 h-3 text-[#766B70]" />
          <span className="hidden sm:inline">Mute Atmosphere</span>
        </button>
      </div>
    </aside>
  );
};
