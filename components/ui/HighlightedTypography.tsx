'use client';

import React from 'react';
import { motion } from 'motion/react';

interface HighlightedWordProps {
  children: React.ReactNode;
  variant?: 'plum' | 'coral' | 'champagne' | 'lavender' | 'gold';
  delay?: number;
  className?: string;
  textColor?: string;
  rotation?: number;
}

/**
 * Editorial block highlight that slides into position behind selected text
 * with luxury easing, subtle print-style rotation, and light shimmer.
 */
export const HighlightedWord: React.FC<HighlightedWordProps> = ({
  children,
  variant = 'coral',
  delay = 0.25,
  className = '',
  textColor,
  rotation = -1,
}) => {
  const variantConfig = {
    coral: {
      bg: 'bg-gradient-to-r from-[#D9858D] via-[#F5E3E4] to-[#D9858D]',
      text: 'text-[#30252D]',
      shadow: 'shadow-[0_4px_16px_rgba(217,133,141,0.25)]',
      border: 'border-b-2 border-[#D9858D]/50',
    },
    plum: {
      bg: 'bg-gradient-to-r from-[#30252D] to-[#4A3A47]',
      text: 'text-white',
      shadow: 'shadow-[0_4px_16px_rgba(48,37,45,0.25)]',
      border: 'border border-[#C8AD78]/30',
    },
    champagne: {
      bg: 'bg-gradient-to-r from-[#E8DCC2] to-[#C8AD78]',
      text: 'text-[#30252D]',
      shadow: 'shadow-[0_4px_16px_rgba(200,173,120,0.25)]',
      border: 'border-b-2 border-[#C8AD78]/40',
    },
    gold: {
      bg: 'bg-gradient-to-r from-[#C8AD78] via-[#E8DCC2] to-[#C8AD78]',
      text: 'text-[#30252D]',
      shadow: 'shadow-[0_4px_20px_rgba(200,173,120,0.3)]',
      border: 'border-b-2 border-[#C8AD78]/50',
    },
    lavender: {
      bg: 'bg-gradient-to-r from-[#D8C9DF] via-[#F5E3E4] to-[#D8C9DF]',
      text: 'text-[#30252D]',
      shadow: 'shadow-[0_4px_16px_rgba(216,201,223,0.3)]',
      border: 'border-b-2 border-[#D8C9DF]/50',
    },
  }[variant];

  return (
    <span
      className={`relative inline-block px-3 py-0.5 mx-1.5 align-baseline select-text ${className}`}
      style={{
        transform: `rotate(${rotation}deg)`,
      }}
    >
      {/* Animated Sliding Background Block */}
      <motion.span
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true, margin: '-20px' }}
        transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
        style={{ originX: 0 }}
        className={`absolute inset-0 ${variantConfig.bg} ${variantConfig.shadow} ${variantConfig.border} rounded-md -z-0 overflow-hidden`}
        aria-hidden="true"
      >
        {/* Subtle Shimmer Sheen across the highlight */}
        <motion.span
          initial={{ x: '-100%' }}
          whileInView={{ x: '200%' }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: delay + 0.45, ease: 'easeInOut' }}
          className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
        />
      </motion.span>

      {/* Forefront Typography */}
      <motion.span
        initial={{ opacity: 0, y: 5 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-20px' }}
        transition={{ duration: 0.45, delay: delay + 0.15, ease: 'easeOut' }}
        className={`relative z-10 font-bold tracking-tight inline-block ${textColor || variantConfig.text}`}
      >
        {children}
      </motion.span>
    </span>
  );
};

interface UnderlineRevealProps {
  children: React.ReactNode;
  color?: string;
  delay?: number;
  className?: string;
}

/**
 * Animated underline stroke that draws itself into view with editorial precision
 */
export const UnderlineReveal: React.FC<UnderlineRevealProps> = ({
  children,
  color = '#D9858D',
  delay = 0.3,
  className = '',
}) => {
  return (
    <span className={`relative inline-block ${className}`}>
      <span className="relative z-10">{children}</span>
      <motion.span
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
        style={{ originX: 0, backgroundColor: color }}
        className="absolute left-0 bottom-0.5 h-[3px] w-full rounded-full shadow-[0_2px_8px_rgba(217,133,141,0.35)]"
        aria-hidden="true"
      />
    </span>
  );
};

interface StaggeredTextRevealProps {
  text: string;
  className?: string;
  delay?: number;
}

/**
 * Editorial clipping-mask text entrance where words rise from beneath an overflow-hidden wrapper
 */
export const StaggeredTextReveal: React.FC<StaggeredTextRevealProps> = ({
  text,
  className = '',
  delay = 0.1,
}) => {
  const words = text.split(' ');

  return (
    <span className={`inline-flex flex-wrap gap-x-2 ${className}`}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden py-1">
          <motion.span
            initial={{ y: '110%', opacity: 0 }}
            whileInView={{ y: '0%', opacity: 1 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{
              duration: 0.7,
              delay: delay + i * 0.06,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="inline-block"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
};
