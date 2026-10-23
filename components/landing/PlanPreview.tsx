'use client';

import React, { useState } from 'react';
import { Sparkles, Palette, Clock, PieChart, CheckSquare, ArrowRight, Check } from 'lucide-react';
import { formatCurrency } from '@/lib/budget/calculator';

interface PlanPreviewProps {
  onPlanClick: () => void;
}

export const PlanPreview: React.FC<PlanPreviewProps> = ({ onPlanClick }) => {
  const [activeTab, setActiveTab] = useState<'concept' | 'schedule' | 'budget' | 'vendors'>('concept');

  const previewPalette = [
    { name: 'Imperial Plum', hex: '#321D35', role: 'Primary Anchor' },
    { name: 'Champagne Shimmer', hex: '#D8BD91', role: 'Lustrous Accent' },
    { name: 'Warm Ivory', hex: '#FAF7F2', role: 'Base Canvas' },
    { name: 'Soft Sage', hex: '#A9B8A0', role: 'Botanical Balance' },
  ];

  const previewSchedule = [
    { time: '02:30 PM', title: 'First Look & Private Portraiture', phase: 'Photography' },
    { time: '04:00 PM', title: 'Guest Arrival & Welcome Spritzers', phase: 'Arrival' },
    { time: '04:30 PM', title: 'Garden Vow Exchange & Processional', phase: 'Ceremony' },
    { time: '05:30 PM', title: 'Sunset Cocktails & Passed Canapés', phase: 'Cocktails' },
    { time: '07:00 PM', title: 'Candlelit 3-Course Banquet Dinner', phase: 'Reception' },
    { time: '08:45 PM', title: 'First Dance & Dance Floor Celebration', phase: 'Party' },
  ];

  const previewBudget = [
    { name: 'Venue & Conservatory', amount: 16000, pct: 40 },
    { name: 'Banquet & Wine Service', amount: 10400, pct: 26 },
    { name: 'Editorial Photo & Cinema', amount: 4800, pct: 12 },
    { name: 'Botanical Styling & Lighting', amount: 4400, pct: 11 },
    { name: 'Acoustic String & DJ', amount: 2400, pct: 6 },
    { name: 'Contingency & Coordination', amount: 2000, pct: 5 },
  ];

  const previewVendors = [
    { role: 'Glasshouse Estate', priority: 'Essential', leadTime: '9–12 mo', status: 'Booked' },
    { role: 'Artisan Caterer & Sommelier', priority: 'Essential', leadTime: '7–9 mo', status: 'Shortlisted' },
    { role: 'Lead Editorial Photographer', priority: 'Essential', leadTime: '8–10 mo', status: 'Booked' },
    { role: 'Bespoke Floral Sculptor', priority: 'Recommended', leadTime: '5–7 mo', status: 'To Hire' },
  ];

  return (
    <section className="py-24 sm:py-32 bg-[#FAF8F3] text-[#30252D] border-t border-[#E9E0D8] relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/4 w-[600px] h-[600px] bg-gradient-to-r from-[#F5E3E4]/50 via-[#D8C9DF]/25 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-14 sm:mb-16 space-y-4">
          <span className="text-xs uppercase tracking-widest font-mono text-[#C8AD78] font-semibold">
            Live Interactive Dossier
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#30252D] leading-tight">
            A blueprint engineered{' '}
            <span className="italic font-normal text-[#D9858D]">down to the minute.</span>
          </h2>
          <p className="text-base sm:text-lg text-[#766B70] font-light max-w-2xl mx-auto">
            Preview the exact fidelity of a FESTORA generated plan. Toggle through real components below:
          </p>
        </div>

        {/* Interactive Dossier Card */}
        <div className="max-w-5xl mx-auto rounded-3xl bg-white border border-[#E9E0D8] shadow-[0_25px_60px_rgba(48,37,45,0.08)] overflow-hidden">
          
          {/* Top Dossier Bar */}
          <div className="bg-[#FAF8F3] border-b border-[#E9E0D8] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#D9858D] text-white shadow-xs">
                  Interactive Blueprint
                </span>
                <span className="text-xs text-[#C8AD78] font-mono">
                  Engine • Deterministic Rules v1.0
                </span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#30252D]">
                Seraphina & Julian’s Glasshouse Union
              </h3>
              <p className="text-xs text-[#766B70] mt-1.5 font-light">
                London & Cotswolds • 120 Guests • Budget: {formatCurrency(40000, 'USD')} • Garden Aesthetic
              </p>
            </div>

            <button
              onClick={onPlanClick}
              className="px-6 py-3 rounded-full bg-[#D9858D] hover:bg-[#E29DA3] text-white text-xs font-bold uppercase tracking-wider transition-all self-start sm:self-auto flex items-center gap-2 shadow-[0_4px_15px_rgba(217,133,141,0.3)]"
            >
              <span>Build Yours</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Dossier Tabs */}
          <div className="border-b border-[#E9E0D8] px-6 sm:px-8 bg-white flex items-center gap-2 sm:gap-6 overflow-x-auto no-scrollbar">
            {[
              { id: 'concept', label: 'Theme & Concept', icon: Palette },
              { id: 'schedule', label: 'Day-of Schedule', icon: Clock },
              { id: 'budget', label: 'Budget Allocation', icon: PieChart },
              { id: 'vendors', label: 'Vendor Checklist', icon: CheckSquare },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`py-4 px-2 sm:px-3 text-xs sm:text-sm font-medium border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                    isActive
                      ? 'border-[#D9858D] text-[#D9858D] font-bold'
                      : 'border-transparent text-[#766B70] hover:text-[#30252D]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#D9858D]' : 'text-[#766B70]/60'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content Panes */}
          <div className="p-6 sm:p-10 min-h-[380px] bg-white">
            
            {/* 1. Theme & Concept Pane */}
            {activeTab === 'concept' && (
              <div className="space-y-8 animate-in fade-in duration-200">
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-[#D9858D] font-bold">
                    Signature Theme
                  </span>
                  <h4 className="font-serif text-2xl sm:text-3xl font-bold text-[#30252D] mt-1">
                    Verdant Romance: An English Glasshouse Affair
                  </h4>
                  <p className="text-sm text-[#766B70] font-light mt-2 max-w-3xl leading-relaxed">
                    Sun-dappled botanicals, whispery silks, and open skies. The celebration unfolds inside a historic wrought-iron glasshouse surrounded by fragrant English gardens, transitioning smoothly into a warm candlelit dinner.
                  </p>
                </div>

                {/* Color Palette Grid */}
                <div>
                  <h5 className="text-xs uppercase font-mono tracking-wider text-[#C8AD78] font-semibold mb-3">
                    Curated Harmonious Color Palette
                  </h5>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {previewPalette.map((color, i) => (
                      <div key={i} className="rounded-2xl p-4 border border-[#E9E0D8] bg-[#FAF8F3] shadow-xs">
                        <div
                          className="w-full h-12 rounded-xl mb-3 shadow-inner border border-black/10"
                          style={{ backgroundColor: color.hex }}
                        />
                        <p className="text-xs font-bold text-[#30252D]">{color.name}</p>
                        <p className="text-[10px] text-[#C8AD78] font-mono mt-0.5">{color.hex}</p>
                        <span className="inline-block mt-1 text-[9px] uppercase tracking-wider font-semibold text-[#766B70]">
                          {color.role}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Decor highlights */}
                <div className="p-5 rounded-2xl bg-[#FAF8F3] border border-[#E9E0D8]">
                  <h5 className="text-xs uppercase font-mono tracking-wider text-[#C8AD78] font-semibold mb-3">
                    Key Visual & Atmosphere Directives
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#766B70]">
                    <div className="flex items-start gap-2.5">
                      <span className="text-[#D9858D] font-bold">✦</span>
                      <span>Festoon bistro lighting suspended between heritage iron pergolas</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="text-[#D9858D] font-bold">✦</span>
                      <span>Handmade deckle-edge cotton place cards pressed with dried thyme</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Schedule Pane */}
            {activeTab === 'schedule' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-[#E9E0D8]">
                  <span className="text-xs uppercase tracking-wider font-mono text-[#C8AD78] font-semibold">
                    Sequential Run-of-Show
                  </span>
                  <span className="text-xs text-[#D9858D] font-bold">6 Orchestrated Chapters</span>
                </div>

                <div className="divide-y divide-[#E9E0D8]">
                  {previewSchedule.map((item, idx) => (
                    <div key={idx} className="py-3.5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <span className="font-mono text-xs font-bold text-[#30252D] bg-[#FAF8F3] border border-[#E9E0D8] px-3 py-1 rounded-lg">
                          {item.time}
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-[#30252D]">{item.title}</p>
                          <span className="text-[10px] text-[#766B70] uppercase tracking-wider">
                            Phase: {item.phase}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#A8B69A]/20 text-[#7E8F6F] font-semibold hidden sm:inline border border-[#A8B69A]/30">
                        Verified
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Budget Pane */}
            {activeTab === 'budget' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[#E9E0D8]">
                  <div>
                    <span className="text-xs font-mono uppercase text-[#C8AD78] font-semibold">Total Event Budget</span>
                    <p className="font-serif text-3xl sm:text-4xl font-bold text-[#30252D] mt-0.5">
                      {formatCurrency(40000, 'USD')}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#A8B69A]/20 text-[#7E8F6F] border border-[#A8B69A]/30 text-xs font-bold">
                      <Check className="w-3.5 h-3.5" />
                      <span>100% Balanced • $0 Remaining</span>
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  {previewBudget.map((cat, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-[#30252D]">{cat.name}</span>
                        <span className="text-[#C8AD78] font-mono">
                          {formatCurrency(cat.amount, 'USD')} ({cat.pct}%)
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-[#E9E0D8] overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#D9858D] to-[#C8AD78] rounded-full transition-all"
                          style={{ width: `${cat.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Vendors Pane */}
            {activeTab === 'vendors' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-[#E9E0D8]">
                  <span className="text-xs uppercase tracking-wider font-mono text-[#C8AD78] font-semibold">
                    Key Creative Vendors
                  </span>
                  <span className="text-xs text-[#766B70]">Sourcing & Milestones</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {previewVendors.map((ven, i) => (
                    <div key={i} className="p-4 sm:p-5 rounded-2xl border border-[#E9E0D8] bg-[#FAF8F3] flex items-center justify-between">
                      <div>
                        <p className="text-xs font-mono uppercase text-[#C8AD78] font-semibold">{ven.leadTime}</p>
                        <h5 className="text-sm font-bold text-[#30252D] mt-0.5">{ven.role}</h5>
                        <span className="text-[10px] text-[#766B70] font-light">Priority: {ven.priority}</span>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                        ven.status === 'Booked'
                          ? 'bg-[#A8B69A]/20 text-[#7E8F6F] border border-[#A8B69A]/30'
                          : ven.status === 'Shortlisted'
                          ? 'bg-[#D8C9DF]/30 text-[#9E8BA6] border border-[#D8C9DF]/50'
                          : 'bg-[#F5E3E4] text-[#D9858D] border border-[#D9858D]/30'
                      }`}>
                        {ven.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Dossier Footer */}
          <div className="bg-[#FAF8F3] border-t border-[#E9E0D8] px-6 sm:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[#766B70] font-light">
              Full blueprints include interactive budget sliders, complete task trackers, and export features.
            </p>
            <button
              onClick={onPlanClick}
              className="px-6 py-2.5 rounded-full bg-[#D9858D] hover:bg-[#E29DA3] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-md"
            >
              <span>Create My Celebration Plan</span>
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};

