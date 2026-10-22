'use client';

import React from 'react';
import { Sliders, Cpu, FileCheck2, ArrowRight } from 'lucide-react';

interface HowItWorksProps {
  onPlanClick: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onPlanClick }) => {
  const steps = [
    {
      num: '01',
      title: 'Articulate Your Vision & Real-World Boundaries',
      description:
        'Specify celebration category, date, city, guest volume, exact budget, currency (INR, USD, EUR), and signature aesthetic—from Garden Romance to Minimal Modernity.',
      icon: Sliders,
      tag: 'Step 1 • Input Studio',
    },
    {
      num: '02',
      title: 'Generate Your Modular Planning Blueprint',
      description:
        'Our modular planning engine compiles a personalized thematic narrative, 4-swatch color palette, hourly run-of-show, prioritized vendor briefs, and chronological countdown milestones.',
      icon: Cpu,
      tag: 'Step 2 • Blueprint Engine',
    },
    {
      num: '03',
      title: 'Master Budget Allocations & Day-of Delivery',
      description:
        'Fine-tune category allocations with live overflow detection, check off preparations, safely persist changes locally, and export an executive print-ready dossier or plain-text brief.',
      icon: FileCheck2,
      tag: 'Step 3 • Execution & Export',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white border-t border-[#321D35]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
          <p className="text-xs uppercase tracking-widest font-mono text-[#321D35]/60 font-semibold">
            Methodology & Flow
          </p>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#321D35]">
            How FESTORA orchestrates perfection.
          </h2>
          <p className="text-base sm:text-lg text-[#28262B]/75 font-light">
            Designed for clarity, eliminating chaos through structured editorial architecture.
          </p>
        </div>

        {/* 3 Step Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="relative rounded-2xl p-8 bg-[#FAF7F2] editorial-border flex flex-col justify-between hover:editorial-shadow transition-shadow"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-serif text-4xl font-bold text-[#D8BD91]/80">
                      {step.num}
                    </span>
                    <div className="p-3 rounded-xl bg-[#321D35] text-[#FAF7F2]">
                      <Icon className="w-5 h-5 text-[#D8BD91]" />
                    </div>
                  </div>

                  <span className="text-[10px] tracking-widest uppercase font-mono text-[#321D35]/60 font-semibold block mb-2">
                    {step.tag}
                  </span>

                  <h3 className="font-serif text-xl font-bold text-[#321D35] mb-3 leading-snug">
                    {step.title}
                  </h3>

                  <p className="text-sm text-[#28262B]/75 font-light leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-[#321D35]/10">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#321D35]">
                    <span>Standardized precision</span>
                    <span className="text-[#A9B8A0] font-bold">✓</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="mt-14 rounded-2xl bg-[#321D35] text-[#FAF7F2] p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 editorial-shadow">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-serif text-2xl font-bold text-[#FAF7F2]">
              Ready to construct your event blueprint?
            </h4>
            <p className="text-sm text-[#FAF7F2]/75 font-light">
              Takes under two minutes. Real budgets, zero filler text.
            </p>
          </div>
          <button
            onClick={onPlanClick}
            className="px-6 py-3.5 rounded-full bg-[#E88D83] hover:bg-[#F2AEA6] text-[#321D35] font-semibold text-sm tracking-wide transition-all shadow hover:shadow-md flex items-center gap-2 flex-shrink-0"
          >
            <span>Launch Event Studio</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
