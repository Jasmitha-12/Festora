'use client';

import React from 'react';
import { motion } from 'motion/react';
import { EventType } from '@/types/event';
import { Heart, Gift, Users, Music, ArrowUpRight, Check } from 'lucide-react';
import { UnderlineReveal } from '@/components/ui/HighlightedTypography';

interface EventTypeDiscoveryProps {
  onSelectEventType: (type: EventType) => void;
}

export const EventTypeDiscovery: React.FC<EventTypeDiscoveryProps> = ({
  onSelectEventType,
}) => {
  const cards = [
    {
      type: 'wedding' as EventType,
      title: 'Weddings & Nuptials',
      tagline: 'High-fashion editorial ceremonies and soulful candlelit receptions',
      image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=80',
      badge: 'Ceremonial Splendor',
      icon: Heart,
      accentColor: '#E88D83',
      features: [
        'Vow ceremony & cocktail run-of-show',
        'Bridal party styling & beauty timelines',
        'Venue, florals & catering allocations',
        'Aesthetic palette matching (Modern, Garden, Regal)',
      ],
      guestRange: '40 – 400 Guests',
      typicalBudget: '₹15L+ / $30K+ / €28K+',
    },
    {
      type: 'birthday' as EventType,
      title: 'Milestone Birthdays',
      tagline: 'Distinctive anniversary parties, curated dining, and lively dance floors',
      image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=900&q=80',
      badge: 'Milestone Soirée',
      icon: Gift,
      accentColor: '#D8BD91',
      features: [
        'Custom cake reveal & toast timeline',
        'DJ playlist & dance floor choreography',
        'Interactive mixology & dessert bars',
        'Bespoke photo installations & keepsake favors',
      ],
      guestRange: '20 – 150 Guests',
      typicalBudget: '₹50K+ / $3K+ / €3K+',
    },
    {
      type: 'community' as EventType,
      title: 'Community & Cultural Festivals',
      tagline: 'Grassroots street festivals, neighborhood galas, and civic summits',
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=900&q=80',
      badge: 'Civic Activation',
      icon: Users,
      accentColor: '#A9B8A0',
      features: [
        'Municipal permits & safety clearances',
        'Outdoor PA audio & stage run-sheets',
        'Volunteer briefing & crowd flow zones',
        'Zero-waste clean-up & community honor awards',
      ],
      guestRange: '100 – 2,000+ Attendees',
      typicalBudget: '₹2L+ / $8K+ / €7K+',
    },
    {
      type: 'community' as EventType,
      title: 'Live Concerts & Galas',
      tagline: 'Acoustic amphitheaters, headline stages, and philanthropic galas',
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=900&q=80',
      badge: 'Live Production',
      icon: Music,
      accentColor: '#E6C875',
      features: [
        'Commercial stage lighting & multi-band sound',
        'Crowd management & backstage coordination',
        'VIP lounge hospitality & catering kiosks',
        'Audio run-sheet synchronized to minute',
      ],
      guestRange: '200 – 3,000+ Attendees',
      typicalBudget: '₹5L+ / $20K+ / €18K+',
    },
  ];

  return (
    <section id="discover-section" className="py-24 sm:py-32 bg-[#140718] text-[#FAF7F2] border-t border-white/10 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-gradient-to-r from-[#E86A58]/10 via-[#3A1B42]/15 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-0 w-[500px] h-[500px] bg-gradient-to-l from-[#D4AF37]/10 via-[#8F7696]/15 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Animated Underline */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20 space-y-4">
          <p className="text-xs uppercase tracking-widest font-mono text-[#D8BD91] font-semibold">
            Bespoke Planning Modalities
          </p>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#FAF7F2] leading-tight">
            Discover celebrations tailored to their{' '}
            <UnderlineReveal color="#E86A58">
              exact essence.
            </UnderlineReveal>
          </h2>
          <p className="text-base sm:text-lg text-[#FAF7F2]/75 font-light max-w-2xl mx-auto">
            No two celebrations are alike. FESTORA’s modular engine adapts vendors, budgets, and countdown schedules to the unique anatomy of your milestone.
          </p>
        </div>

        {/* Discovery Asymmetrical Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.65, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="group rounded-3xl overflow-hidden border border-white/15 bg-[#1E0F24] flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 hover:border-[#D8BD91]/50 shadow-[0_20px_50px_rgba(0,0,0,0.7)] hover:shadow-[0_25px_60px_rgba(232,106,88,0.25)]"
              >
                <div>
                  {/* Image with Tag & Badge */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-black/40">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1E0F24] via-black/35 to-transparent" />
                    
                    <div className="absolute top-4 left-4">
                      <span className="px-3.5 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-[#140718]/80 text-[#D8BD91] border border-[#D8BD91]/30 backdrop-blur-md shadow-sm">
                        {card.badge}
                      </span>
                    </div>

                    <div className="absolute top-4 right-4 p-2.5 rounded-full bg-[#140718]/80 text-[#E86A58] border border-white/20 backdrop-blur-md shadow-sm">
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="absolute bottom-4 left-5 right-5 text-white">
                      <h3 className="font-serif text-2xl sm:text-3xl font-bold leading-snug drop-shadow-md">
                        {card.title}
                      </h3>
                      <p className="text-xs text-white/80 mt-1 font-light leading-relaxed">
                        {card.tagline}
                      </p>
                    </div>
                  </div>

                  {/* Card Content & Features */}
                  <div className="p-6 sm:p-8 space-y-6">
                    {/* Features list */}
                    <ul className="space-y-2.5 text-xs text-[#FAF7F2]/80">
                      {card.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <Check className="w-4 h-4 text-[#D8BD91] flex-shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Quick Specs */}
                    <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-[#D8BD91]/70 block font-mono uppercase text-[10px]">Scale Parameters</span>
                        <span className="font-semibold text-[#FAF7F2]">{card.guestRange}</span>
                      </div>
                      <div>
                        <span className="text-[#D8BD91]/70 block font-mono uppercase text-[10px]">Budget Scope</span>
                        <span className="font-semibold text-[#E86A58] font-mono">{card.typicalBudget}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action */}
                <div className="p-6 sm:p-8 pt-0">
                  <button
                    onClick={() => onSelectEventType(card.type)}
                    className="w-full py-3.5 px-5 rounded-2xl bg-white/10 hover:bg-[#E86A58] text-[#FAF7F2] hover:text-[#140718] border border-white/20 hover:border-[#E86A58] text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 transition-all group/btn shadow-md"
                  >
                    <span>Orchestrate {card.title}</span>
                    <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
