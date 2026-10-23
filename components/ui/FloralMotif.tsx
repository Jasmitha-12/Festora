'use client';

import React from 'react';

interface FloralCornerProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
  size?: number;
  opacity?: number;
}

/**
 * Delicate, subtle botanical corner illustration.
 * Styled in warm champagne, dusty rose, and sage green with very low opacity.
 */
export const FloralCorner: React.FC<FloralCornerProps> = ({
  position = 'top-right',
  className = '',
  size = 140,
  opacity = 0.22,
}) => {
  const rotation =
    position === 'top-right'
      ? 'rotate-0'
      : position === 'bottom-right'
      ? 'rotate-90'
      : position === 'bottom-left'
      ? 'rotate-180'
      : '-rotate-90';

  const positionClasses =
    position === 'top-right'
      ? 'top-0 right-0'
      : position === 'top-left'
      ? 'top-0 left-0'
      : position === 'bottom-right'
      ? 'bottom-0 right-0'
      : 'bottom-0 left-0';

  return (
    <div
      aria-hidden="true"
      className={`absolute ${positionClasses} pointer-events-none select-none ${rotation} ${className}`}
      style={{ opacity, width: size, height: size }}
    >
      <svg
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full text-[#A8B69A]"
      >
        {/* Main curved vine */}
        <path
          d="M160 0C120 15 70 50 45 95C25 130 10 160 0 160"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
        {/* Secondary branch */}
        <path
          d="M110 24C92 48 68 85 58 118"
          stroke="#C8AD78"
          strokeWidth="1"
          strokeLinecap="round"
          strokeDasharray="2 1"
        />
        {/* Olive / Eucalyptus leaves */}
        <path
          d="M125 10C138 6 150 14 148 24C140 28 126 22 125 10Z"
          fill="#A8B69A"
          fillOpacity="0.45"
          stroke="#A8B69A"
          strokeWidth="0.8"
        />
        <path
          d="M95 28C108 24 118 34 114 44C104 46 94 40 95 28Z"
          fill="#D9858D"
          fillOpacity="0.35"
          stroke="#D9858D"
          strokeWidth="0.8"
        />
        <path
          d="M72 52C84 48 94 58 90 68C80 70 70 64 72 52Z"
          fill="#A8B69A"
          fillOpacity="0.45"
          stroke="#A8B69A"
          strokeWidth="0.8"
        />
        <path
          d="M52 82C64 78 72 88 68 96C58 98 50 92 52 82Z"
          fill="#C8AD78"
          fillOpacity="0.4"
          stroke="#C8AD78"
          strokeWidth="0.8"
        />
        <path
          d="M34 116C44 112 52 122 48 130C38 132 32 126 34 116Z"
          fill="#D8C9DF"
          fillOpacity="0.5"
          stroke="#D8C9DF"
          strokeWidth="0.8"
        />
        {/* Delicate blossom bud */}
        <circle cx="138" cy="28" r="3.5" fill="#D9858D" fillOpacity="0.6" />
        <circle cx="82" cy="74" r="2.5" fill="#D9858D" fillOpacity="0.6" />
        <circle cx="48" cy="138" r="2" fill="#C8AD78" fillOpacity="0.7" />
      </svg>
    </div>
  );
};

/**
 * Elegant botanical horizontal divider.
 */
export const FloralDivider: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      aria-hidden="true"
      className={`flex items-center justify-center gap-3 py-4 select-none pointer-events-none opacity-30 ${className}`}
    >
      <div className="h-[1px] w-20 sm:w-32 bg-gradient-to-r from-transparent via-[#C8AD78] to-[#D9858D]" />
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#D9858D]">
        <path
          d="M12 2C13.5 6 17 8 21 8C17 10 13.5 12 12 16C10.5 12 7 10 3 8C7 8 10.5 6 12 2Z"
          fill="currentColor"
          fillOpacity="0.4"
        />
        <circle cx="12" cy="12" r="1.5" fill="#C8AD78" />
      </svg>
      <div className="h-[1px] w-20 sm:w-32 bg-gradient-to-l from-transparent via-[#C8AD78] to-[#D9858D]" />
    </div>
  );
};
