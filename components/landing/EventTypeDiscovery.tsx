'use client';

import React from 'react';
import { EventType } from '@/types/event';
import { Heart, Gift, Users, ArrowUpRight, Check } from 'lucide-react';

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
      tagline: 'High-fashion editorial ceremonies and soulful receptions',
      image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
      badge: 'Ceremonial Splendor',
      icon: Heart,
      accentColor: '#E88D83',
      features: [
        'Vow ceremony & cocktail run of show',
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
      tagline: 'Distinctive anniversary parties, curated dining and lively dance floors',
      image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=800&q=80',
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
      title: 'Community & Cultural Events',
      tagline: 'Grassroots festivals, neighborhood galas, and civic summits',
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
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
  ];

  return (
    <section id="discover-section" className="py-20 bg-[#FAF7F2] border-t border-[#321D35]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <p className="text-xs uppercase tracking-widest font-mono text-[#321D35]/60 font-semibold">
            Bespoke Planning Modalities
          </p>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#321D35]">
            Celebrations tailored to their exact essence.
          </h2>
          <p className="text-base sm:text-lg text-[#28262B]/75 font-light">
            No two celebrations are alike. FESTORA’s modular engine adapts vendors, budgets, and countdown schedules to the unique anatomy of your milestone.
          </p>
        </div>

        {/* Discovery Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.type}
                className="group rounded-2xl overflow-hidden editorial-border bg-white flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:editorial-shadow-lg"
              >
                <div>
                  {/* Image with Tag */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#321D35]/5">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-[#FAF7F2] text-[#321D35] shadow-sm">
                        {card.badge}
                      </span>
                    </div>

                    <div className="absolute bottom-3 right-3 p-2 rounded-full bg-white/90 text-[#321D35]">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="font-serif text-2xl font-bold text-[#321D35] group-hover:text-[#E88D83] transition-colors">
                        {card.title}
                      </h3>
                      <p className="text-xs text-[#28262B]/70 mt-1 font-light leading-relaxed">
                        {card.tagline}
                      </p>
                    </div>

                    {/* Features list */}
                    <ul className="space-y-2 pt-2 border-t border-[#321D35]/10 text-xs text-[#28262B]/85">
                      {card.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-[#A9B8A0] flex-shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Quick Specs */}
                    <div className="pt-3 border-t border-[#321D35]/10 grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-[#321D35]/60 block font-mono uppercase text-[9px]">Typical Scale</span>
                        <span className="font-medium text-[#321D35]">{card.guestRange}</span>
                      </div>
                      <div>
                        <span className="text-[#321D35]/60 block font-mono uppercase text-[9px]">Scope</span>
                        <span className="font-medium text-[#321D35]">{card.typicalBudget}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action */}
                <div className="p-6 pt-0">
                  <button
                    onClick={() => onSelectEventType(card.type)}
                    className="w-full py-3 px-4 rounded-xl bg-[#FAF7F2] hover:bg-[#321D35] text-[#321D35] hover:text-[#FAF7F2] border border-[#321D35]/20 hover:border-[#321D35] text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2 transition-all group/btn"
                  >
                    <span>Plan a {card.type === 'community' ? 'Community Event' : card.type}</span>
                    <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
