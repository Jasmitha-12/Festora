'use client';

import React from 'react';
import { ArrowRight, Sparkles, Gift, Users } from 'lucide-react';

interface HeroProps {
  onPlanClick: () => void;
  onExploreClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onPlanClick, onExploreClick }) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-20 sm:pt-14 sm:pb-28">
      {/* Editorial Decorative Background Details */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-[#E88D83]/10 via-[#D8BD91]/5 to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Editorial Headline & Copy */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#321D35]/5 border border-[#321D35]/15 text-[#321D35] text-xs font-medium tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-[#E88D83]" />
              <span>Prompt Wars: Challenge 5 • AI Celebration & Event Studio</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#321D35] leading-[1.08]">
              Your moments <br />
              <span className="italic font-normal text-[#E88D83]">deserve a</span> <br />
              masterpiece.
            </h1>

            <p className="text-base sm:text-xl text-[#28262B]/80 max-w-2xl font-light leading-relaxed">
              FESTORA orchestrates weddings, milestone birthdays, and civic community gatherings with bespoke aesthetic concepts, live budget allocation, tailored day-of schedules, and vetted vendor timelines.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={onPlanClick}
                className="px-8 py-4 rounded-full bg-[#321D35] hover:bg-[#4A2B4E] text-[#FAF7F2] font-medium text-base tracking-wide flex items-center justify-center gap-3 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 group"
              >
                <span>Plan My Event</span>
                <ArrowRight className="w-4 h-4 text-[#D8BD91] group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onExploreClick}
                className="px-7 py-4 rounded-full bg-transparent hover:bg-[#321D35]/5 border border-[#321D35]/25 text-[#321D35] font-medium text-base tracking-wide transition-colors flex items-center justify-center gap-2"
              >
                <span>Explore the Experience</span>
              </button>
            </div>

            {/* Editorial highlights / metrics */}
            <div className="pt-8 border-t border-[#321D35]/10 grid grid-cols-3 gap-6 max-w-lg">
              <div>
                <p className="font-serif text-2xl sm:text-3xl font-bold text-[#321D35]">3-in-1</p>
                <p className="text-xs uppercase tracking-wider text-[#28262B]/70 mt-0.5 font-medium">Weddings, Birthdays & Gatherings</p>
              </div>
              <div>
                <p className="font-serif text-2xl sm:text-3xl font-bold text-[#321D35]">100%</p>
                <p className="text-xs uppercase tracking-wider text-[#28262B]/70 mt-0.5 font-medium">Balanced Minor-Unit Budgets</p>
              </div>
              <div>
                <p className="font-serif text-2xl sm:text-3xl font-bold text-[#321D35]">Zero</p>
                <p className="text-xs uppercase tracking-wider text-[#28262B]/70 mt-0.5 font-medium">Generic AI Hallucinations</p>
              </div>
            </div>
          </div>

          {/* Right Column: Layered Editorial Photo Collage */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Primary Main Card: Wedding Splendor */}
              <div className="relative rounded-2xl overflow-hidden editorial-border editorial-shadow-lg bg-white transform sm:-rotate-1 hover:rotate-0 transition-transform duration-500">
                <div className="aspect-[4/5] relative bg-[#321D35]/10">
                  <img
                    src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80"
                    alt="Elegant couple surrounded by warm floral arrangements and candlelit atmosphere"
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#321D35]/80 via-transparent to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5 text-white">
                    <span className="inline-block px-2.5 py-1 rounded-full bg-[#E88D83] text-white text-[11px] font-semibold tracking-wider uppercase mb-2">
                      Wedding Masterpiece
                    </span>
                    <h3 className="font-serif text-xl font-bold leading-snug">
                      The Glasshouse Nuptials
                    </h3>
                    <p className="text-xs text-white/80 mt-1 font-light">
                      Curated color scheme, 12-hour run of show & budget breakdown
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating Secondary Card: Milestone Birthday */}
              <div className="absolute -bottom-6 -left-6 sm:-left-10 w-48 sm:w-56 rounded-xl overflow-hidden editorial-border editorial-shadow bg-[#FAF7F2] p-2 transform rotate-3 hover:rotate-0 transition-transform duration-300 hidden xs:block">
                <div className="aspect-square relative rounded-lg overflow-hidden bg-[#E88D83]/20">
                  <img
                    src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=500&q=80"
                    alt="Vibrant birthday celebration with festive golden lights"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-2 right-2 p-1.5 rounded-full bg-[#321D35]/80 text-[#D8BD91]">
                    <Gift className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="p-2">
                  <p className="text-[11px] font-bold text-[#321D35]">Milestone Birthday</p>
                  <p className="text-[10px] text-[#28262B]/70">Gourmet dessert bar & DJ itinerary</p>
                </div>
              </div>

              {/* Floating Badge: Community Festival */}
              <div className="absolute -top-4 -right-4 sm:-right-6 bg-[#FAF7F2] editorial-border editorial-shadow rounded-xl p-3 flex items-center gap-3 transform -rotate-2 hover:rotate-0 transition-transform">
                <div className="w-10 h-10 rounded-full bg-[#A9B8A0]/20 flex items-center justify-center text-[#7F9374]">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#321D35]">Community Gatherings</p>
                  <p className="text-[10px] text-[#28262B]/70">Permits, AV stage & safety</p>
                </div>
              </div>

              {/* Editorial Stamp */}
              <div className="absolute bottom-4 right-4 bg-[#321D35] text-[#FAF7F2] px-3 py-1.5 rounded-full text-[10px] tracking-widest uppercase font-mono border border-[#D8BD91]/30">
                Editorial Issue • 2026
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
