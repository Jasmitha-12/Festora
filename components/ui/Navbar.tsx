'use client';

import React from 'react';
import { Sparkles, Calendar, Compass } from 'lucide-react';

interface NavbarProps {
  currentView: 'landing' | 'studio' | 'blueprint' | 'dashboard';
  onNavigate: (view: 'landing' | 'studio' | 'blueprint' | 'dashboard') => void;
  savedEventsCount: number;
}

const emptySubscribe = () => () => {};

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  savedEventsCount,
}) => {
  const mounted = React.useSyncExternalStore(emptySubscribe, () => true, () => false);

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F3]/90 backdrop-blur-xl border-b border-[#E9E0D8] no-print transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Wordmark */}
        <button
          onClick={() => onNavigate('landing')}
          className="text-left group focus:outline-none"
          aria-label="FESTORA Home"
        >
          <div className="flex items-center gap-2">
            <span className="font-serif text-2xl sm:text-3xl font-bold tracking-wider text-[#30252D] group-hover:text-[#D9858D] transition-colors">
              FESTORA
            </span>
            <span className="w-2 h-2 rounded-full bg-[#D9858D] mb-1 animate-pulse" />
          </div>
          <p className="text-[10px] tracking-widest uppercase text-[#C8AD78] font-mono hidden sm:block">
            Big moments. Beautifully orchestrated.
          </p>
        </button>

        {/* Navigation Items */}
        <nav className="flex items-center gap-1.5 sm:gap-6" aria-label="Main Navigation">
          <button
            onClick={() => {
              if (currentView !== 'landing') {
                onNavigate('landing');
              } else {
                const el = document.getElementById('discover-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="px-3 py-2 text-sm font-medium rounded-lg text-[#766B70] hover:text-[#30252D] hover:bg-[#F5E3E4]/40 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-[#C8AD78]" />
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
            className="px-3 py-2 text-sm font-medium text-[#766B70] hover:text-[#30252D] hover:bg-[#F5E3E4]/40 rounded-lg transition-colors hidden md:block"
          >
            How It Works
          </button>

          <button
            onClick={() => onNavigate('dashboard')}
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-all relative ${
              currentView === 'dashboard'
                ? 'text-[#30252D] font-semibold bg-[#F5E3E4]/80 border border-[#E9E0D8]'
                : 'text-[#766B70] hover:text-[#30252D] hover:bg-[#F5E3E4]/40'
            }`}
            aria-label={`My Events, ${savedEventsCount} saved`}
          >
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#C8AD78]" />
              <span>My Events</span>
              {mounted && savedEventsCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 text-[11px] bg-[#D9858D] text-white font-bold rounded-full font-mono">
                  {savedEventsCount}
                </span>
              )}
            </span>
          </button>

          {/* Primary CTA */}
          <button
            onClick={() => onNavigate('studio')}
            className="ml-2 px-5 sm:px-6 py-2.5 rounded-full bg-[#D9858D] hover:bg-[#E29DA3] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-[0_4px_15px_rgba(217,133,141,0.3)] transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>Plan Celebration</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
