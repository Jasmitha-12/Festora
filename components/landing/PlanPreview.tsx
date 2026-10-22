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
    <section className="py-24 sm:py-32 bg-[#140718] text-[#FAF7F2] border-t border-white/10 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/4 w-[600px] h-[600px] bg-gradient-to-r from-[#E86A58]/10 via-[#3A1B42]/20 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-14 sm:mb-16 space-y-4">
          <span className="text-xs uppercase tracking-widest font-mono text-[#D8BD91] font-semibold">
            Live Interactive Dossier
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#FAF7F2] leading-tight">
            A blueprint engineered{' '}
            <span className="italic font-normal text-[#E86A58]">down to the minute.</span>
          </h2>
          <p className="text-base sm:text-lg text-[#FAF7F2]/75 font-light max-w-2xl mx-auto">
            Preview the exact fidelity of a FESTORA generated plan. Toggle through real components below:
          </p>
        </div>

        {/* Interactive Dossier Card */}
        <div className="max-w-5xl mx-auto rounded-3xl bg-[#1E0F24] border border-white/15 shadow-[0_30px_70px_rgba(0,0,0,0.85)] overflow-hidden">
          
          {/* Top Dossier Bar */}
          <div className="bg-[#240E2E] border-b border-white/10 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#E86A58] text-[#140718] shadow-sm">
                  Interactive Blueprint
                </span>
                <span className="text-xs text-[#D8BD91] font-mono">
                  Engine • Deterministic Rules v1.0
                </span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                Seraphina & Julian’s Glasshouse Union
              </h3>
              <p className="text-xs text-[#FAF7F2]/75 mt-1.5 font-light">
                London & Cotswolds • 120 Guests • Budget: {formatCurrency(40000, 'USD')} • Garden Aesthetic
              </p>
            </div>

            <button
              onClick={onPlanClick}
              className="px-6 py-3 rounded-full bg-[#E86A58] hover:bg-[#F2AEA6] text-[#140718] text-xs font-bold uppercase tracking-wider transition-all self-start sm:self-auto flex items-center gap-2 shadow-[0_4px_15px_rgba(232,106,88,0.35)]"
            >
              <span>Build Yours</span>
              <ArrowRight className="w-4 h-4 text-[#140718]" />
            </button>
          </div>

          {/* Dossier Tabs */}
          <div className="border-b border-white/10 px-6 sm:px-8 bg-[#16071B]/80 flex items-center gap-2 sm:gap-6 overflow-x-auto no-scrollbar">
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
                      ? 'border-[#E86A58] text-[#E86A58] font-bold'
                      : 'border-transparent text-[#FAF7F2]/60 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#E86A58]' : 'text-white/40'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content Panes */}
          <div className="p-6 sm:p-10 min-h-[380px] bg-[#1E0F24]">
            
            {/* 1. Theme & Concept Pane */}
            {activeTab === 'concept' && (
              <div className="space-y-8 animate-in fade-in duration-200">
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-[#E86A58] font-bold">
                    Signature Theme
                  </span>
                  <h4 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">
                    Verdant Romance: An English Glasshouse Affair
                  </h4>
                  <p className="text-sm text-[#FAF7F2]/80 font-light mt-2 max-w-3xl leading-relaxed">
                    Sun-dappled botanicals, whispery silks, and open skies. The celebration unfolds inside a historic wrought-iron glasshouse surrounded by fragrant English gardens, transitioning smoothly into a warm candlelit dinner.
                  </p>
                </div>

                {/* Color Palette Grid */}
                <div>
                  <h5 className="text-xs uppercase font-mono tracking-wider text-[#D8BD91] font-semibold mb-3">
                    Curated Harmonious Color Palette
                  </h5>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {previewPalette.map((color, i) => (
                      <div key={i} className="rounded-2xl p-4 border border-white/10 bg-[#16071B]/80 shadow-md">
                        <div
                          className="w-full h-12 rounded-xl mb-3 shadow-inner border border-white/15"
                          style={{ backgroundColor: color.hex }}
                        />
                        <p className="text-xs font-bold text-white">{color.name}</p>
                        <p className="text-[10px] text-[#D8BD91] font-mono mt-0.5">{color.hex}</p>
                        <span className="inline-block mt-1 text-[9px] uppercase tracking-wider font-semibold text-white/50">
                          {color.role}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Decor highlights */}
                <div className="p-5 rounded-2xl bg-[#16071B]/80 border border-white/10">
                  <h5 className="text-xs uppercase font-mono tracking-wider text-[#D8BD91] font-semibold mb-3">
                    Key Visual & Atmosphere Directives
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#FAF7F2]/80">
                    <div className="flex items-start gap-2.5">
                      <span className="text-[#E86A58] font-bold">✦</span>
                      <span>Festoon bistro lighting suspended between heritage iron pergolas</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="text-[#E86A58] font-bold">✦</span>
                      <span>Handmade deckle-edge cotton place cards pressed with dried thyme</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Schedule Pane */}
            {activeTab === 'schedule' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="text-xs uppercase tracking-wider font-mono text-[#D8BD91] font-semibold">
                    Sequential Run-of-Show
                  </span>
                  <span className="text-xs text-[#E86A58] font-bold">6 Orchestrated Chapters</span>
                </div>

                <div className="divide-y divide-white/10">
                  {previewSchedule.map((item, idx) => (
                    <div key={idx} className="py-3.5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <span className="font-mono text-xs font-bold text-[#D8BD91] bg-black/40 border border-white/10 px-3 py-1 rounded-lg">
                          {item.time}
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-white">{item.title}</p>
                          <span className="text-[10px] text-white/50 uppercase tracking-wider">
                            Phase: {item.phase}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] font-semibold hidden sm:inline border border-[#D4AF37]/30">
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-white/10">
                  <div>
                    <span className="text-xs font-mono uppercase text-[#D8BD91] font-semibold">Total Event Budget</span>
                    <p className="font-serif text-3xl sm:text-4xl font-bold text-white mt-0.5">
                      {formatCurrency(40000, 'USD')}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 text-xs font-bold">
                      <Check className="w-3.5 h-3.5" />
                      <span>100% Balanced • $0 Remaining</span>
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  {previewBudget.map((cat, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-white/90">{cat.name}</span>
                        <span className="text-[#D8BD91] font-mono">
                          {formatCurrency(cat.amount, 'USD')} ({cat.pct}%)
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-black/40 overflow-hidden border border-white/10">
                        <div
                          className="h-full bg-gradient-to-r from-[#E86A58] to-[#D4AF37] rounded-full transition-all"
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
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="text-xs uppercase tracking-wider font-mono text-[#D8BD91] font-semibold">
                    Key Creative Vendors
                  </span>
                  <span className="text-xs text-white/60">Sourcing & Milestones</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {previewVendors.map((ven, i) => (
                    <div key={i} className="p-4 sm:p-5 rounded-2xl border border-white/10 bg-[#16071B]/80 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-mono uppercase text-[#D8BD91]">{ven.leadTime}</p>
                        <h5 className="text-sm font-bold text-white mt-0.5">{ven.role}</h5>
                        <span className="text-[10px] text-white/50 font-light">Priority: {ven.priority}</span>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                        ven.status === 'Booked'
                          ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30'
                          : ven.status === 'Shortlisted'
                          ? 'bg-[#A38BB8]/20 text-[#A38BB8] border border-[#A38BB8]/30'
                          : 'bg-[#E86A58]/20 text-[#E86A58] border border-[#E86A58]/30'
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
          <div className="bg-[#16071B] border-t border-white/10 px-6 sm:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[#FAF7F2]/70 font-light">
              Full blueprints include interactive budget sliders, complete task trackers, and export features.
            </p>
            <button
              onClick={onPlanClick}
              className="px-6 py-2.5 rounded-full bg-[#E86A58] hover:bg-[#F2AEA6] text-[#140718] text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-md"
            >
              <span>Create My Celebration Plan</span>
              <Sparkles className="w-3.5 h-3.5 text-[#140718]" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
