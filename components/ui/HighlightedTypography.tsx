'use client';

import React from 'react';
import { motion } from 'motion/react';

interface HighlightedWordProps {
  children: React.ReactNode;
  variant?: 'plum' | 'coral' | 'champagne' | 'lavender';
  delay?: number;
  className?: string;
  textColor?: string;
}

/**
 * Editorial block highlight that slides into position behind selected text
 */
export const HighlightedWord: React.FC<HighlightedWordProps> = ({
  children,
  variant = 'plum',
  delay = 0.4,
  className = '',
  textColor,
}) => {
  const bgStyles = {
    plum: 'bg-[#321D35] text-[#FAF7F2]',
    coral: 'bg-[#E88D83] text-[#1E1120]',
    champagne: 'bg-[#D8BD91] text-[#1E1120]',
    lavender: 'bg-[#8F7696] text-[#FAF7F2]',
  }[variant];

  return (
    <span className={`relative inline-block px-2.5 py-0.5 mx-1 rounded-md overflow-hidden align-baseline ${className}`}>
      {/* Animated Sliding Background Block */}
      <motion.span
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
        style={{ originX: 0 }}
        className={`absolute inset-0 ${bgStyles.split(' ')[0]} -z-0 rounded-md shadow-sm`}
        aria-hidden="true"
      />
      {/* Forefront Text */}
      <motion.span
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: delay + 0.15 }}
        className={`relative z-10 font-bold ${textColor || bgStyles.split(' ')[1]}`}
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
 * Animated underline stroke that draws itself into view
 */
export const UnderlineReveal: React.FC<UnderlineRevealProps> = ({
  children,
  color = '#E88D83',
  delay = 0.5,
  className = '',
}) => {
  return (
    <span className={`relative inline-block ${className}`}>
      <span>{children}</span>
      <motion.span
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
        style={{ originX: 0, backgroundColor: color }}
        className="absolute left-0 bottom-0.5 h-[3px] w-full rounded-full"
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
            initial={{ y: '105%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            transition={{
              duration: 0.65,
              delay: delay + i * 0.08,
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
