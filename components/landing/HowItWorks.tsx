'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Sliders, Palette, PieChart, CheckCircle2, ArrowRight } from 'lucide-react';
import { UnderlineReveal } from '@/components/ui/HighlightedTypography';

interface HowItWorksProps {
  onPlanClick: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onPlanClick }) => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      stepNumber: '01',
      title: 'Choose Your Event',
      badge: 'Step 1 • Foundation',
      icon: Sliders,
      accentColor: '#E88D83',
      description:
        'Select your celebration modality—Wedding, Milestone Birthday, or Community Gathering—and configure scale parameters including calendar date, city, and guest volume.',
      previewDetail: 'Select from 3 tailored blueprints with preset vendor models and custom guest ranges.',
    },
    {
      stepNumber: '02',
      title: 'Customize Your Vision',
      badge: 'Step 2 • Aesthetic Expression',
      icon: Palette,
      accentColor: '#D8BD91',
      description:
        'Select a signature aesthetic—Regal Elegance, Botanical Garden, Contemporary Modern, Minimalist, Traditional, or Playful—to receive harmonized 4-swatch palettes and floral directives.',
      previewDetail: 'Receive instant 2700K golden spectrum lighting advice, table textures, and atmosphere directives.',
    },
    {
      stepNumber: '03',
      title: 'Plan Your Budget & Details',
      badge: 'Step 3 • Financial Precision',
      icon: PieChart,
      accentColor: '#A9B8A0',
      description:
        'Calibrate allocations across venue, catering, florals, cinema, and music. Real-time integer minor units eliminate floating-point drift, alerting you instantly to budget deficits.',
      previewDetail: 'Adjust category sliders in real-time with automatic 100% balancing and currency formatting.',
    },
    {
      stepNumber: '04',
      title: 'Bring Your Celebration to Life',
      badge: 'Step 4 • Day-of Orchestration',
      icon: CheckCircle2,
      accentColor: '#E6C875',
      description:
        'Track countdown milestones, coordinate with prioritized vendor interview guides, run through the hour-by-hour day-of itinerary, and export executive print-ready PDF dossiers.',
      previewDetail: 'Access complete run-of-show schedules, copyable executive briefs, and print-ready dossiers.',
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-white border-t border-[#321D35]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
          <p className="text-xs uppercase tracking-widest font-mono text-[#321D35]/60 font-semibold">
            Methodology & Flow
          </p>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#321D35] leading-tight">
            How FESTORA orchestrates{' '}
            <UnderlineReveal color="#D8BD91">
              your masterpiece.
            </UnderlineReveal>
          </h2>
          <p className="text-base sm:text-lg text-[#28262B]/75 font-light">
            Designed for uncompromising clarity, transforming overwhelming event logistics into a structured, cinematic planning journey.
          </p>
        </div>

        {/* Interactive 4-Step Process Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Interactive Step Selector */}
          <div className="lg:col-span-5 space-y-4">
            {steps.map((item, idx) => {
              const Icon = item.icon;
              const isActive = activeStep === idx;
              return (
                <button
                  key={item.stepNumber}
                  onClick={() => setActiveStep(idx)}
                  className={`w-full text-left p-5 rounded-2xl border transition-all flex items-start gap-4 ${
                    isActive
                      ? 'border-[#321D35] bg-[#FAF7F2] shadow-md ring-1 ring-[#321D35]/15'
                      : 'border-[#321D35]/10 hover:border-[#321D35]/30 bg-white'
                  }`}
                >
                  <span
                    className={`font-mono text-base font-bold px-2.5 py-1 rounded-lg ${
                      isActive ? 'bg-[#321D35] text-[#FAF7F2]' : 'bg-[#321D35]/5 text-[#321D35]/60'
                    }`}
                  >
                    {item.stepNumber}
                  </span>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className={`font-serif text-lg font-bold ${isActive ? 'text-[#321D35]' : 'text-[#321D35]/80'}`}>
                        {item.title}
                      </h3>
                      <Icon className={`w-4 h-4 ${isActive ? 'text-[#E88D83]' : 'text-[#321D35]/40'}`} />
                    </div>
                    <p className="text-xs text-[#28262B]/75 font-light leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Dynamic Step Stage Card */}
          <div className="lg:col-span-7">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-3xl bg-[#FAF7F2] editorial-border editorial-shadow-lg p-8 sm:p-12 relative overflow-hidden"
            >
              {/* Background Glow */}
              <div
                className="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none"
                style={{ backgroundColor: steps[activeStep].accentColor }}
              />

              <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between border-b border-[#321D35]/10 pb-4">
                  <span className="text-xs font-mono uppercase tracking-widest font-semibold text-[#321D35]/60">
                    {steps[activeStep].badge}
                  </span>
                  <span className="font-serif text-3xl font-bold text-[#D8BD91]">
                    {steps[activeStep].stepNumber} / 04
                  </span>
                </div>

                <div>
                  <h4 className="font-serif text-3xl sm:text-4xl font-bold text-[#321D35] mb-3 leading-snug">
                    {steps[activeStep].title}
                  </h4>
                  <p className="text-sm sm:text-base text-[#28262B]/85 font-light leading-relaxed">
                    {steps[activeStep].description}
                  </p>
                </div>

                {/* Highlight Capsule */}
                <div className="p-5 rounded-2xl bg-white editorial-border flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-[#D8BD91] flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#321D35] font-bold block mb-0.5">
                      Orchestration Highlight
                    </span>
                    <p className="text-xs text-[#28262B]/80 font-light leading-relaxed">
                      {steps[activeStep].previewDetail}
                    </p>
                  </div>
                </div>

                {/* Next Step / Action */}
                <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-1.5">
                    {steps.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveStep(i)}
                        className={`h-2 rounded-full transition-all ${
                          i === activeStep ? 'w-8 bg-[#321D35]' : 'w-2 bg-[#321D35]/20 hover:bg-[#321D35]/40'
                        }`}
                        aria-label={`Jump to step ${i + 1}`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={onPlanClick}
                    className="px-6 py-3 rounded-full bg-[#321D35] hover:bg-[#4A2B4E] text-[#FAF7F2] text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm"
                  >
                    <span>Launch Event Studio</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#D8BD91]" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

        </div>

      </div>
    </section>
  );
};
