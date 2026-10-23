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
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-[#0F0412]/85 backdrop-blur-xl border-b border-white/10 no-print transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Wordmark */}
        <button
          onClick={() => onNavigate('landing')}
          className="text-left group focus:outline-none"
          aria-label="FESTORA Home"
        >
          <div className="flex items-center gap-2">
            <span className="font-serif text-2xl sm:text-3xl font-bold tracking-wider text-[#FAF7F2] group-hover:text-[#E86A58] transition-colors">
              FESTORA
            </span>
            <span className="w-2 h-2 rounded-full bg-[#E86A58] mb-1 animate-pulse" />
          </div>
          <p className="text-[10px] tracking-widest uppercase text-[#D8BD91]/80 font-mono hidden sm:block">
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
            className="px-3 py-2 text-sm font-medium rounded-lg text-[#FAF7F2]/80 hover:text-white transition-colors"
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
            className="px-3 py-2 text-sm font-medium text-[#FAF7F2]/80 hover:text-white rounded-lg transition-colors hidden md:block"
          >
            How It Works
          </button>

          <button
            onClick={() => onNavigate('dashboard')}
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-all relative ${
              currentView === 'dashboard'
                ? 'text-[#FAF7F2] font-semibold bg-white/10 border border-white/15'
                : 'text-[#FAF7F2]/80 hover:text-white hover:bg-white/5'
            }`}
            aria-label={`My Events, ${savedEventsCount} saved`}
          >
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#D8BD91]" />
              <span>My Events</span>
              {mounted && savedEventsCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 text-[11px] bg-[#E86A58] text-[#140718] font-bold rounded-full font-mono">
                  {savedEventsCount}
                </span>
              )}
            </span>
          </button>

          {/* Primary CTA */}
          <button
            onClick={() => onNavigate('studio')}
            className="ml-2 px-5 sm:px-6 py-2.5 rounded-full bg-[#E86A58] hover:bg-[#F2AEA6] text-[#140718] text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-[0_4px_15px_rgba(232,106,88,0.35)] transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#140718]" />
            <span>Plan Celebration</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
