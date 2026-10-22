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
    <section id="discover-section" className="py-24 bg-[#FAF7F2] border-t border-[#321D35]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Animated Underline */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <p className="text-xs uppercase tracking-widest font-mono text-[#321D35]/60 font-semibold">
            Bespoke Planning Modalities
          </p>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#321D35] leading-tight">
            Discover celebrations tailored to their{' '}
            <UnderlineReveal color="#E88D83">
              exact essence.
            </UnderlineReveal>
          </h2>
          <p className="text-base sm:text-lg text-[#28262B]/75 font-light">
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
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="group rounded-3xl overflow-hidden editorial-border bg-white flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 hover:editorial-shadow-lg"
              >
                <div>
                  {/* Image with Tag & Badge */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#321D35]/5">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                    
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-[#FAF7F2] text-[#321D35] shadow-sm">
                        {card.badge}
                      </span>
                    </div>

                    <div className="absolute top-4 right-4 p-2 rounded-full bg-white/90 text-[#321D35] shadow-sm">
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="font-serif text-2xl sm:text-3xl font-bold leading-snug">
                        {card.title}
                      </h3>
                      <p className="text-xs text-white/80 mt-1 font-light leading-relaxed">
                        {card.tagline}
                      </p>
                    </div>
                  </div>

                  {/* Card Content & Features */}
                  <div className="p-6 sm:p-8 space-y-5">
                    {/* Features list */}
                    <ul className="space-y-2 text-xs text-[#28262B]/85">
                      {card.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <Check className="w-4 h-4 text-[#7F9374] flex-shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Quick Specs */}
                    <div className="pt-4 border-t border-[#321D35]/10 grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-[#321D35]/60 block font-mono uppercase text-[10px]">Scale Parameters</span>
                        <span className="font-semibold text-[#321D35]">{card.guestRange}</span>
                      </div>
                      <div>
                        <span className="text-[#321D35]/60 block font-mono uppercase text-[10px]">Budget Scope</span>
                        <span className="font-semibold text-[#321D35] font-mono">{card.typicalBudget}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action */}
                <div className="p-6 sm:p-8 pt-0">
                  <button
                    onClick={() => onSelectEventType(card.type)}
                    className="w-full py-3.5 px-5 rounded-2xl bg-[#FAF7F2] hover:bg-[#321D35] text-[#321D35] hover:text-[#FAF7F2] border border-[#321D35]/20 hover:border-[#321D35] text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2 transition-all group/btn shadow-xs"
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
