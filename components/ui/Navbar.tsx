'use client';

import React from 'react';
import { Sparkles, Calendar, Compass } from 'lucide-react';

interface NavbarProps {
  currentView: 'landing' | 'studio' | 'blueprint' | 'dashboard';
  onNavigate: (view: 'landing' | 'studio' | 'blueprint' | 'dashboard') => void;
  savedEventsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  savedEventsCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#321D35]/10 no-print transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Wordmark */}
        <button
          onClick={() => onNavigate('landing')}
          className="text-left group focus:outline-none"
          aria-label="FESTORA Home"
        >
          <div className="flex items-center gap-2">
            <span className="font-serif text-2xl sm:text-3xl font-bold tracking-wider text-[#321D35] group-hover:text-[#E88D83] transition-colors">
              FESTORA
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#E88D83] mb-1" />
          </div>
          <p className="text-[10px] tracking-widest uppercase text-[#321D35]/60 font-sans hidden sm:block">
            Big moments. Beautifully orchestrated.
          </p>
        </button>

        {/* Navigation Items */}
        <nav className="flex items-center gap-1 sm:gap-6" aria-label="Main Navigation">
          <button
            onClick={() => {
              if (currentView !== 'landing') {
                onNavigate('landing');
              } else {
                const el = document.getElementById('discover-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              currentView === 'landing'
                ? 'text-[#321D35] hover:text-[#E88D83]'
                : 'text-[#321D35]/70 hover:text-[#321D35]'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-[#D8BD91]" />
              <span className="hidden sm:inline">Discover</span>
            </span>
          </button>

          <button
            onClick={() => {
              if (currentView !== 'landing') {
                onNavigate('landing');
                setTimeout(() => {
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              } else {
                document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="px-3 py-2 text-sm font-medium text-[#321D35]/70 hover:text-[#321D35] rounded-md transition-colors hidden md:block"
          >
            How It Works
          </button>

          <button
            onClick={() => onNavigate('dashboard')}
            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors relative ${
              currentView === 'dashboard'
                ? 'text-[#321D35] font-semibold bg-[#321D35]/5'
                : 'text-[#321D35]/80 hover:text-[#321D35] hover:bg-[#321D35]/5'
            }`}
            aria-label={`My Events, ${savedEventsCount} saved`}
          >
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#A9B8A0]" />
              <span>My Events</span>
              {savedEventsCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-xs bg-[#321D35] text-[#FAF7F2] rounded-full font-mono">
                  {savedEventsCount}
                </span>
              )}
            </span>
          </button>

          {/* Primary CTA */}
          <button
            onClick={() => onNavigate('studio')}
            className="ml-2 px-4 sm:px-5 py-2.5 rounded-full bg-[#321D35] hover:bg-[#4A2B4E] text-[#FAF7F2] text-sm font-medium tracking-wide flex items-center gap-2 shadow-sm transition-all hover:shadow hover:-translate-y-0.5 active:translate-y-0"
          >
            <Sparkles className="w-4 h-4 text-[#D8BD91]" />
            <span>Plan My Event</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
