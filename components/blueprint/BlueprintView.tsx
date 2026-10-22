'use client';

import React, { useState } from 'react';
import { EventBlueprint } from '@/types/event';
import {
  Sparkles,
  Palette,
  Copy,
  Check,
  Lightbulb,
  Layers,
  Cpu,
  Info,
} from 'lucide-react';

interface BlueprintViewProps {
  blueprint: EventBlueprint;
  onCopyColor: (hex: string) => void;
}

export const BlueprintView: React.FC<BlueprintViewProps> = ({
  blueprint,
  onCopyColor,
}) => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const handleCopy = (hex: string) => {
    onCopyColor(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2500);
  };

  return (
    <div className="space-y-12">
      
      {/* 1. Concept Header & Narrative Dossier */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 editorial-border editorial-shadow">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-[#321D35]/10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#321D35]/5 border border-[#321D35]/15 text-xs font-mono uppercase text-[#321D35]">
            <Cpu className="w-3.5 h-3.5 text-[#E88D83]" />
            <span>Modular Planning Engine v1.0 • Rule-Curated</span>
          </div>

          <span className="text-xs text-[#28262B]/60 font-mono">
            Generated {blueprint.generatedAt ? blueprint.generatedAt.split('T')[0] : '2026-10-22'}
          </span>
        </div>

        <div className="pt-8 space-y-4 max-w-4xl">
          <span className="text-xs uppercase tracking-widest font-mono text-[#E88D83] font-bold">
            Personalized Concept & Theme
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#321D35] leading-tight">
            {blueprint.conceptTitle}
          </h2>
          <p className="font-serif italic text-lg sm:text-xl text-[#321D35]/80 font-normal">
            &ldquo;{blueprint.tagline}&rdquo;
          </p>
          <p className="text-sm sm:text-base text-[#28262B]/85 font-light leading-relaxed pt-2">
            {blueprint.narrative}
          </p>
        </div>

        {/* Atmosphere & Lighting directives */}
        <div className="mt-8 p-5 rounded-2xl bg-[#FAF7F2] editorial-border grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-white text-[#321D35] editorial-border">
              <Sparkles className="w-4 h-4 text-[#D8BD91]" />
            </div>
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#321D35] font-semibold">
                Atmosphere & Golden Spectrum
              </h4>
              <p className="text-xs text-[#28262B]/75 mt-1 font-light leading-relaxed">
                {blueprint.atmosphereNotes}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-white text-[#321D35] editorial-border">
              <Info className="w-4 h-4 text-[#A9B8A0]" />
            </div>
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#321D35] font-semibold">
                Engine Transparency Notice
              </h4>
              <p className="text-xs text-[#28262B]/75 mt-1 font-light leading-relaxed">
                Deterministic modular planner producing mathematically balanced budgets, vetted milestones, and distinct aesthetic directives.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Color Palette & Decor Curation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Color Palette (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 editorial-border editorial-shadow flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-[#E88D83]" />
                <h3 className="font-serif text-xl font-bold text-[#321D35]">Curated Color Palette</h3>
              </div>
              <span className="text-[11px] font-mono text-[#321D35]/60 uppercase">Click Hex to Copy</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              {blueprint.colorPalette.map((color, idx) => {
                const isCopied = copiedHex === color.hex;
                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl editorial-border bg-[#FAF7F2] flex flex-col justify-between space-y-2 group hover:editorial-shadow transition-shadow"
                  >
                    <div
                      className="w-full h-14 rounded-xl shadow-inner border border-black/10 relative overflow-hidden flex items-end justify-end p-2"
                      style={{ backgroundColor: color.hex }}
                    >
                      <button
                        type="button"
                        onClick={() => handleCopy(color.hex)}
                        className="px-2 py-1 rounded bg-black/60 hover:bg-black/80 text-white text-[10px] font-mono font-bold flex items-center gap-1 backdrop-blur-sm transition-opacity"
                        aria-label={`Copy color ${color.hex}`}
                      >
                        {isCopied ? <Check className="w-3 h-3 text-[#A9B8A0]" /> : <Copy className="w-3 h-3" />}
                        <span>{color.hex}</span>
                      </button>
                    </div>

                    <div>
                      <p className="text-xs font-bold text-[#321D35]">{color.name}</p>
                      <span className="text-[10px] font-semibold tracking-wider uppercase text-[#E88D83] block">
                        {color.role}
                      </span>
                      <p className="text-[11px] text-[#28262B]/70 font-light mt-1 leading-snug">
                        {color.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Decor Highlights (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 editorial-border editorial-shadow flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Layers className="w-5 h-5 text-[#D8BD91]" />
              <h3 className="font-serif text-xl font-bold text-[#321D35]">Styling & Floral Directives</h3>
            </div>
            <p className="text-xs text-[#28262B]/75 font-light mb-6">
              Tactile textures, floral structures, and architectural focal points tailored to your chosen aesthetic.
            </p>

            <div className="space-y-3">
              {blueprint.decorHighlights.map((highlight, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-[#FAF7F2] editorial-border flex items-start gap-3 text-xs text-[#28262B]/85 leading-relaxed"
                >
                  <span className="w-5 h-5 rounded-full bg-[#321D35] text-[#FAF7F2] font-mono text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#321D35]/10 flex items-center justify-between text-[11px] text-[#321D35]/70">
            <span>Harmonized for Photography</span>
            <span className="font-mono">Color Contrasts Verified</span>
          </div>
        </div>

      </div>

      {/* 3. Tailored Signature Ideas */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 editorial-border editorial-shadow">
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb className="w-5 h-5 text-[#E88D83]" />
          <h3 className="font-serif text-2xl font-bold text-[#321D35]">Personalized Celebration Concepts</h3>
        </div>
        <p className="text-sm text-[#28262B]/75 font-light mb-8 max-w-2xl">
          Engineered specifically for your guest scale, budget tier, and personal vision to leave an enduring emotional imprint.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blueprint.personalizedIdeas.map((idea, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-[#FAF7F2] editorial-border flex flex-col justify-between hover:editorial-shadow transition-shadow"
            >
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-[#E88D83] block mb-1">
                  {idea.category}
                </span>
                <h4 className="font-serif text-lg font-bold text-[#321D35] mb-2 leading-snug">
                  {idea.title}
                </h4>
                <p className="text-xs text-[#28262B]/80 font-light leading-relaxed mb-4">
                  {idea.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[#321D35]/10">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#321D35]/60 font-semibold block mb-0.5">
                  Why It Works
                </span>
                <p className="text-[11px] text-[#7F9374] font-medium leading-snug">
                  {idea.whyItWorks}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
