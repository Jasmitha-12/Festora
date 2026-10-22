'use client';

import React from 'react';
import { Sparkles, Heart, Lock } from 'lucide-react';

interface FooterProps {
  onPlanClick: () => void;
  onMyEventsClick: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onPlanClick, onMyEventsClick }) => {
  return (
    <footer className="bg-[#0B030E] text-[#FAF7F2] pt-16 pb-12 border-t border-white/10 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-serif text-3xl font-bold tracking-wider text-[#FAF7F2]">
                FESTORA
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#E88D83] mb-1" />
            </div>
            <p className="text-sm text-white/70 max-w-sm font-light leading-relaxed">
              Big moments. Beautifully orchestrated. A modern editorial celebration studio helping you organize weddings, milestone birthdays, and community gatherings with personalized blueprints.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-[#D8BD91] font-mono">
              <Sparkles className="w-4 h-4" />
              <span>Bespoke Event Architecture • Digital Studio</span>
            </div>
          </div>

          {/* Nav Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#D8BD91] font-semibold">
              Celebration Formats
            </h4>
            <ul className="space-y-2 text-sm text-white/75 font-light">
              <li>
                <button
                  onClick={onPlanClick}
                  className="hover:text-[#E88D83] transition-colors"
                >
                  Weddings & Receptions
                </button>
              </li>
              <li>
                <button
                  onClick={onPlanClick}
                  className="hover:text-[#E88D83] transition-colors"
                >
                  Milestone Birthdays & Anniversaries
                </button>
              </li>
              <li>
                <button
                  onClick={onPlanClick}
                  className="hover:text-[#E88D83] transition-colors"
                >
                  Community Gatherings & Galas
                </button>
              </li>
              <li>
                <button
                  onClick={onMyEventsClick}
                  className="hover:text-[#E88D83] transition-colors"
                >
                  My Saved Celebrations
                </button>
              </li>
            </ul>
          </div>

          {/* Privacy & Engine Transparency */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#D8BD91] font-semibold">
              Security & Privacy
            </h4>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-xs font-medium text-white">
                <Lock className="w-3.5 h-3.5 text-[#A9B8A0]" />
                <span>Client-Side Local Persistence</span>
              </div>
              <p className="text-xs text-white/60 font-light leading-relaxed">
                Your private notes, budgets, and guest lists stay entirely on your device in browser localStorage. No data is shared with third-party tracking services.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50 font-light">
          <p>© 2026 FESTORA Studio. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            <span>Orchestrated with</span>
            <Heart className="w-3 h-3 text-[#E88D83] fill-current" />
            <span>for unforgettable celebrations</span>
          </p>
        </div>

      </div>
    </footer>
  );
};
