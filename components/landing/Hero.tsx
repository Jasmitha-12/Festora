'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, Compass, ChevronDown } from 'lucide-react';
import { HighlightedWord } from '@/components/ui/HighlightedTypography';

interface HeroProps {
  onPlanClick: () => void;
  onExploreClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onPlanClick, onExploreClick }) => {
  // Pointer mouse coordinates for subtle interactive tilt
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY, currentTarget } = e;
    const { width, height, left, top } = currentTarget.getBoundingClientRect();
    const x = (clientX - left) / width - 0.5;
    const y = (clientY - top) / height - 0.5;
    setMousePos({ x, y });
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28 bg-gradient-to-b from-[#0F0412] via-[#16071B] to-[#140718] text-[#FAF7F2] border-b border-white/10"
    >
      {/* Cinematic Ambient Atmosphere Glows */}
      <div
        className="absolute top-0 left-1/4 w-[650px] h-[650px] bg-gradient-to-br from-[#E86A58]/20 via-[#3A1B42]/30 to-transparent rounded-full blur-3xl pointer-events-none -z-10 animate-glow"
        style={{
          transform: `translate(${mousePos.x * 30}px, ${mousePos.y * 30}px)`,
          transition: 'transform 0.4s ease-out',
        }}
      />
      <div
        className="absolute bottom-10 right-1/4 w-[550px] h-[550px] bg-gradient-to-tl from-[#D4AF37]/15 via-[#8F7696]/20 to-transparent rounded-full blur-3xl pointer-events-none -z-10 animate-glow"
        style={{
          transform: `translate(${mousePos.x * -25}px, ${mousePos.y * -25}px)`,
          transition: 'transform 0.5s ease-out',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          
          {/* Left Column: Expressive Editorial Headline & Copy */}
          <div className="lg:col-span-7 space-y-8 text-left">
            
            {/* Top Capsule Tag */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#240E2E]/80 border border-[#D8BD91]/30 text-[#D8BD91] text-xs font-mono tracking-wider uppercase backdrop-blur-md shadow-md"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#E86A58]" />
              <span>Cinematic Celebration Studio • Bespoke Blueprints</span>
            </motion.div>

            {/* Main Headline with Animated Block Highlights */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#FAF7F2] leading-[1.08]"
            >
              Make it a{' '}
              <HighlightedWord variant="coral" delay={0.35} rotation={-1.5}>
                moment.
              </HighlightedWord>
              <br />
              Make it{' '}
              <HighlightedWord variant="gold" delay={0.65} rotation={1}>
                unforgettable.
              </HighlightedWord>
            </motion.h1>

            {/* Supporting Copy */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-base sm:text-lg text-[#FAF7F2]/80 max-w-2xl font-light leading-relaxed"
            >
              FESTORA orchestrates weddings, milestone birthdays, and community festivals with bespoke aesthetic concepts, live budget allocation, tailored day-of schedules, and vetted vendor timelines.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
            >
              <button
                onClick={onPlanClick}
                className="px-8 py-4 rounded-full bg-[#E86A58] hover:bg-[#F2AEA6] text-[#140718] font-bold text-base tracking-wide flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(232,106,88,0.4)] hover:shadow-[0_15px_40px_rgba(232,106,88,0.55)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 group"
              >
                <span>Create Your Event</span>
                <ArrowRight className="w-4 h-4 text-[#140718] group-hover:translate-x-1.5 transition-transform" />
              </button>

              <button
                onClick={onExploreClick}
                className="px-7 py-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/20 text-[#FAF7F2] font-medium text-base tracking-wide transition-all flex items-center justify-center gap-2.5 backdrop-blur-md hover:border-[#D8BD91]/50"
              >
                <Compass className="w-4 h-4 text-[#D8BD91]" />
                <span>Explore the Experience</span>
              </button>
            </motion.div>

            {/* Editorial Metrics */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="pt-8 border-t border-white/10 grid grid-cols-3 gap-6 max-w-lg"
            >
              <div>
                <p className="font-serif text-2xl sm:text-3xl font-bold text-[#E86A58]">3-in-1</p>
                <p className="text-[11px] uppercase tracking-wider text-[#FAF7F2]/60 mt-0.5 font-medium">Weddings, Birthdays & Fests</p>
              </div>
              <div>
                <p className="font-serif text-2xl sm:text-3xl font-bold text-[#D4AF37]">100%</p>
                <p className="text-[11px] uppercase tracking-wider text-[#FAF7F2]/60 mt-0.5 font-medium">Float-Free Budget Math</p>
              </div>
              <div>
                <p className="font-serif text-2xl sm:text-3xl font-bold text-[#A38BB8]">Zero</p>
                <p className="text-[11px] uppercase tracking-wider text-[#FAF7F2]/60 mt-0.5 font-medium">Filler Text Or Delays</p>
              </div>
            </motion.div>

          </div>

          {/* Right Column: Layered Editorial 3D Photo Collage with Interactive Parallax */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative mx-auto max-w-md lg:max-w-none perspective-1000"
              style={{
                transform: `rotateY(${mousePos.x * 8}deg) rotateX(${-mousePos.y * 8}deg)`,
                transition: 'transform 0.3s ease-out',
              }}
            >
              {/* Primary Main Card: Glasshouse Nuptials */}
              <div className="relative rounded-3xl overflow-hidden border border-white/20 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] bg-[#1E0F24] transform sm:-rotate-2 hover:rotate-0 transition-transform duration-500 group">
                <div className="aspect-[4/5] relative overflow-hidden bg-black/40">
                  <img
                    src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80"
                    alt="Celebration ceremony framed with warm florals and candlelit atmosphere"
                    className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-700"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#140718]/95 via-transparent to-black/20" />
                  
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <span className="inline-block px-3 py-1 rounded-full bg-[#E86A58] text-[#140718] text-[10px] font-bold tracking-widest uppercase mb-2 shadow-sm">
                      Masterpiece Blueprint
                    </span>
                    <h3 className="font-serif text-2xl font-bold leading-snug">
                      The Glasshouse Union
                    </h3>
                    <p className="text-xs text-white/80 mt-1 font-light">
                      Curated color scheme, 12-hour run of show & budget breakdown
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating Secondary Card: Milestone Birthday */}
              <div
                className="absolute -bottom-8 -left-6 sm:-left-10 w-48 sm:w-56 rounded-2xl overflow-hidden border border-white/20 shadow-[0_20px_40px_rgba(0,0,0,0.7)] bg-[#1E0F24] p-2.5 transform rotate-4 hover:rotate-0 transition-transform duration-300 hidden xs:block"
                style={{
                  transform: `translate(${mousePos.x * -15}px, ${mousePos.y * -15}px) rotate(4deg)`,
                  transition: 'transform 0.4s ease-out',
                }}
              >
                <div className="aspect-square relative rounded-xl overflow-hidden bg-black/30">
                  <img
                    src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=500&q=80"
                    alt="Vibrant birthday celebration with sparklers and golden lights"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-[#D8BD91] backdrop-blur-sm">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="p-2">
                  <p className="text-xs font-bold text-[#FAF7F2]">Milestone Soirée</p>
                  <p className="text-[10px] text-[#FAF7F2]/70">Gourmet mixology & live vinyl</p>
                </div>
              </div>

              {/* Floating Badge: Concerts & Galas */}
              <div
                className="absolute -top-6 -right-4 sm:-right-6 bg-[#240E2E]/90 backdrop-blur-md border border-white/20 shadow-[0_15px_35px_rgba(0,0,0,0.6)] rounded-2xl p-3.5 flex items-center gap-3 transform -rotate-3 hover:rotate-0 transition-transform"
                style={{
                  transform: `translate(${mousePos.x * 20}px, ${mousePos.y * 20}px) rotate(-3deg)`,
                  transition: 'transform 0.4s ease-out',
                }}
              >
                <div className="w-10 h-10 rounded-full bg-[#E86A58]/20 flex items-center justify-center text-[#E86A58]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#FAF7F2]">Concerts & Galas</p>
                  <p className="text-[10px] text-[#FAF7F2]/70">Permits, stage AV & sound</p>
                </div>
              </div>

            </motion.div>
          </div>

        </div>

        {/* Scroll Indicator */}
        <div className="mt-16 sm:mt-20 flex flex-col items-center justify-center text-center">
          <button
            onClick={onExploreClick}
            className="flex flex-col items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#FAF7F2]/60 hover:text-[#D8BD91] transition-colors group focus:outline-none"
            aria-label="Scroll to 3D celebration gallery"
          >
            <span>Explore 3D Celebration Gallery</span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ChevronDown className="w-4 h-4 text-[#E86A58] group-hover:translate-y-1 transition-transform" />
            </motion.div>
          </button>
        </div>

      </div>
    </section>
  );
};
