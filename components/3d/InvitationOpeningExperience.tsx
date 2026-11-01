'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, X, MailOpen } from 'lucide-react';
import { FloralCorner } from '@/components/ui/FloralMotif';

interface InvitationOpeningExperienceProps {
  onEnter: () => void;
  isOpenDirectly?: boolean;
}

export const InvitationOpeningExperience: React.FC<InvitationOpeningExperienceProps> = ({
  onEnter,
  isOpenDirectly = false,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [stage, setStage] = useState<'sealed' | 'opening' | 'unfolded'>(
    isOpenDirectly || shouldReduceMotion ? 'unfolded' : 'sealed'
  );
  const [isHoveringSeal, setIsHoveringSeal] = useState(false);

  const handleOpen = useCallback(() => {
    if (stage !== 'sealed') return;
    if (shouldReduceMotion) {
      setStage('unfolded');
      return;
    }
    setStage('opening');
    setTimeout(() => {
      setStage('unfolded');
    }, 950);
  }, [stage, shouldReduceMotion]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onEnter();
      } else if (e.key === 'Enter' || e.key === ' ') {
        if (stage === 'sealed') {
          handleOpen();
        } else if (stage === 'unfolded') {
          onEnter();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [stage, onEnter, handleOpen]);

  return (
    <div
      role="dialog"
      aria-label="FESTORA 3D Celebration Invitation"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1218]/85 backdrop-blur-md p-4 sm:p-6 overflow-hidden select-none"
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-radial from-[#30252D]/80 via-[#1A1218]/90 to-[#100A10] pointer-events-none -z-10" />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-[#D9858D]/25 to-transparent rounded-full blur-3xl pointer-events-none -z-10 animate-glow" />

      {/* Decorative Botanical Corners */}
      <FloralCorner position="top-left" size={160} opacity={0.25} />
      <FloralCorner position="top-right" size={160} opacity={0.25} />

      {/* Top Controls: Skip to Main Application */}
      <div className="absolute top-6 right-6 sm:top-8 sm:right-8 z-30 flex items-center gap-3">
        <button
          onClick={onEnter}
          className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-[#FAF8F3] hover:text-white text-xs font-mono tracking-wider backdrop-blur-md transition-all flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9858D]"
          aria-label="Skip invitation and enter celebration studio"
        >
          <span>Skip to Studio</span>
          <X className="w-3.5 h-3.5 text-[#D9858D]" />
        </button>
      </div>

      {/* 3D Perspective Stage Container */}
      <div className="relative w-full max-w-xl perspective-1600 flex flex-col items-center justify-center">
        
        {/* ============================================================== */}
        {/* STAGE 1 & 2: 3D ENVELOPE (SEALED / OPENING)                     */}
        {/* ============================================================== */}
        {stage !== 'unfolded' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -40 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-md aspect-[16/11] rounded-2xl preserve-3d shadow-[0_30px_70px_rgba(0,0,0,0.5)] cursor-pointer group"
            onClick={handleOpen}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleOpen();
              }
            }}
            tabIndex={0}
            role="button"
            aria-label="Wax-sealed celebration envelope. Click to break wax seal and open."
          >
            {/* Envelope Back Body (Deep Plum Velvet) */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[#30252D] to-[#241A22] border-2 border-[#C8AD78]/40 shadow-inner flex flex-col justify-end p-6">
              {/* Gold Damask Foil Lining (Interior) */}
              <div
                className="absolute inset-2 rounded-xl opacity-20 pointer-events-none"
                style={{
                  backgroundImage:
                    'radial-gradient(#C8AD78 1.5px, transparent 1.5px), radial-gradient(#C8AD78 1.5px, #30252D 1.5px)',
                  backgroundSize: '24px 24px',
                  backgroundPosition: '0 0, 12px 12px',
                }}
              />

              {/* Envelope Address Tag Front */}
              <div className="relative z-10 text-center space-y-1.5 pointer-events-none pb-2">
                <p className="font-mono text-[10px] uppercase tracking-widest text-[#C8AD78] font-bold">
                  Orchestrated Milestone Invitation
                </p>
                <h2 className="font-serif italic text-2xl sm:text-3xl font-bold text-[#FAF8F3] tracking-wide">
                  To The Visionary Host
                </h2>
                <p className="text-[11px] font-mono text-[#FAF8F3]/60 tracking-wider">
                  FESTORA Atelier • Season 2026
                </p>
              </div>
            </div>

            {/* Envelope Bottom Triangle Flaps */}
            <div
              className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none"
              style={{
                clipPath: 'polygon(0% 100%, 50% 30%, 100% 100%)',
                background: 'linear-gradient(180deg, #382B35 0%, #291D26 100%)',
                boxShadow: '0 -4px 15px rgba(0,0,0,0.3)',
              }}
            />

            {/* Envelope Left & Right Side Flaps */}
            <div
              className="absolute inset-y-0 left-0 w-1/2 pointer-events-none"
              style={{
                clipPath: 'polygon(0% 0%, 75% 50%, 0% 100%)',
                background: 'linear-gradient(90deg, #332730 0%, #241A22 100%)',
              }}
            />
            <div
              className="absolute inset-y-0 right-0 w-1/2 pointer-events-none"
              style={{
                clipPath: 'polygon(100% 0%, 25% 50%, 100% 100%)',
                background: 'linear-gradient(-90deg, #332730 0%, #241A22 100%)',
              }}
            />

            {/* Envelope Top Flap (Flips 180 degrees in 3D when opening) */}
            <div
              className="absolute inset-x-0 top-0 h-1/2 origin-top preserve-3d transition-transform duration-700 ease-[cubic-bezier(0.7,0,0.2,1)]"
              style={{
                clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)',
                background:
                  stage === 'opening'
                    ? 'linear-gradient(0deg, #2A1C27 0%, #382B35 100%)'
                    : 'linear-gradient(180deg, #4A3A47 0%, #30252D 100%)',
                transform: stage === 'opening' ? 'rotateX(180deg)' : 'rotateX(0deg)',
                borderTop: '2px solid rgba(200, 173, 120, 0.4)',
                zIndex: 20,
              }}
            />

            {/* 3D Wax Seal with Monogram F (Center Anchor) */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 transition-transform duration-300"
              style={{
                transform: `translate(-50%, -50%) scale(${isHoveringSeal ? 1.12 : 1})`,
              }}
              onMouseEnter={() => setIsHoveringSeal(true)}
              onMouseLeave={() => setIsHoveringSeal(false)}
            >
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center bg-gradient-to-br from-[#E29DA3] via-[#D9858D] to-[#993A43] shadow-[0_10px_25px_rgba(217,133,141,0.5),0_0_0_2px_rgba(200,173,120,0.6)] border-2 border-[#D9858D] group-hover:shadow-[0_15px_35px_rgba(217,133,141,0.7)]">
                {/* Gold Stamped Edge Trim */}
                <div className="absolute inset-1.5 rounded-full border border-dashed border-[#F5E3E4]/70 pointer-events-none" />

                {/* Wax Seal Monogram Letter */}
                <span className="font-serif font-bold text-2xl sm:text-3xl text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
                  F
                </span>

                {/* Sparkling Halo on Hover */}
                {isHoveringSeal && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1.25 }}
                    className="absolute inset-0 rounded-full border border-[#C8AD78] animate-ping pointer-events-none"
                  />
                )}
              </div>
            </div>

            {/* Instructional Tag underneath Envelope */}
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-mono tracking-widest uppercase">
              <MailOpen className="w-3.5 h-3.5 text-[#D9858D]" />
              <span>Click to Break Wax Seal</span>
            </div>
          </motion.div>
        )}

        {/* ============================================================== */}
        {/* STAGE 3: UNFOLDED EDITORIAL INVITATION CARD                    */}
        {/* ============================================================== */}
        {stage === 'unfolded' && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-lg rounded-3xl bg-[#FAF8F3] border-2 border-[#E9E0D8] shadow-[0_30px_90px_rgba(0,0,0,0.55)] p-8 sm:p-12 text-[#30252D] text-center space-y-6 overflow-hidden"
          >
            {/* Gold Gilded Outer & Inner Border */}
            <div className="absolute inset-3 rounded-2xl border border-[#C8AD78]/40 pointer-events-none" />
            <div className="absolute inset-4 rounded-xl border border-dashed border-[#C8AD78]/25 pointer-events-none" />

            {/* Subtle Floral Watermark */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-radial from-[#F5E3E4]/40 to-transparent rounded-full blur-2xl pointer-events-none" />

            {/* Monogram Seal Top */}
            <div className="flex justify-center">
              <div className="w-12 h-12 rounded-full bg-[#FAF8F3] border border-[#C8AD78] flex items-center justify-center shadow-xs">
                <span className="font-serif font-bold text-lg text-[#C8AD78]">F</span>
              </div>
            </div>

            {/* Header Text */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#C8AD78] font-bold block">
                Official Invitation
              </span>
              <h3 className="font-serif text-3xl sm:text-4xl font-bold leading-tight text-[#30252D]">
                You are cordially invited to orchestrate life’s grandest moments.
              </h3>
            </div>

            {/* Curated Details */}
            <p className="text-xs sm:text-sm text-[#766B70] font-light max-w-sm mx-auto leading-relaxed">
              Step inside the FESTORA Celebration Atelier. Precision event architecture, live budget calibration, curated aesthetic styling, and vetted vendor timelines await.
            </p>

            {/* Event Metrics Box */}
            <div className="py-3 px-6 rounded-2xl bg-white border border-[#E9E0D8] inline-flex items-center gap-6 text-xs text-[#30252D]">
              <div>
                <span className="text-[9px] font-mono uppercase text-[#C8AD78] block font-bold">Modality</span>
                <span className="font-semibold">3-in-1 Studio</span>
              </div>
              <div className="w-px h-6 bg-[#E9E0D8]" />
              <div>
                <span className="text-[9px] font-mono uppercase text-[#C8AD78] block font-bold">Aesthetics</span>
                <span className="font-semibold">Luxury 3D</span>
              </div>
              <div className="w-px h-6 bg-[#E9E0D8]" />
              <div>
                <span className="text-[9px] font-mono uppercase text-[#C8AD78] block font-bold">Budget Math</span>
                <span className="font-semibold text-[#D9858D]">100% Precise</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onEnter}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#D9858D] hover:bg-[#E29DA3] text-white font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-3 shadow-[0_10px_35px_rgba(217,133,141,0.4)] hover:shadow-[0_15px_45px_rgba(217,133,141,0.55)] transition-all transform hover:-translate-y-0.5 group"
              >
                <span>Enter Celebration Studio</span>
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1.5 transition-transform" />
              </button>

              <button
                onClick={onEnter}
                className="w-full sm:w-auto px-6 py-4 rounded-full bg-white hover:bg-[#FAF8F3] border border-[#E9E0D8] text-[#30252D] font-semibold text-xs tracking-wider uppercase transition-colors"
              >
                Explore Homepage
              </button>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
};
