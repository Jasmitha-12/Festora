import type { Currency, EventType, BudgetCategoryItem, BudgetAllocation } from '@/types/event';

// Category templates tailored to specific event types
export const DEFAULT_BUDGET_TEMPLATES: Record<
  EventType,
  { name: string; percentage: number; description: string }[]
> = {
  wedding: [
    { name: 'Venue & Reception', percentage: 38, description: 'Ceremony & reception hall rental, security, and staffing.' },
    { name: 'Catering & Bar', percentage: 26, description: 'Dinner, cocktail hour, cake, beverages, and service staff.' },
    { name: 'Photography & Cinema', percentage: 11, description: 'Full day photo & video coverage, portraits, and albums.' },
    { name: 'Floral, Styling & Decor', percentage: 10, description: 'Ceremony arch, centerpieces, lighting, linens, and stage.' },
    { name: 'Music & Entertainment', percentage: 6, description: 'Live band, DJ, ceremony acoustic ensemble, and sound.' },
    { name: 'Attire & Beauty', percentage: 5, description: 'Wedding outfits, hair styling, makeup, and alterations.' },
    { name: 'Contingency & Coordination', percentage: 4, description: 'Emergency buffer and day-of management coordination.' },
  ],
  birthday: [
    { name: 'Venue & Setup', percentage: 30, description: 'Party room, lounge, outdoor space rental, and setup.' },
    { name: 'Food, Drinks & Dessert', percentage: 35, description: 'Gourmet bites, custom celebration cake, bar, and drinks.' },
    { name: 'Thematic Decor & Photobooth', percentage: 15, description: 'Backdrops, balloon artistry, table styling, and instant photo zone.' },
    { name: 'Entertainment & DJ', percentage: 12, description: 'Live DJ, playlist management, games, or live artist performance.' },
    { name: 'Party Favors & Invitations', percentage: 5, description: 'Custom souvenir gifts, digital invitations, and welcome signs.' },
    { name: 'Buffer / Contingency', percentage: 3, description: 'Unexpected guest extras and spontaneous celebration upgrades.' },
  ],
  community: [
    { name: 'Permits, Venue & Facilities', percentage: 28, description: 'Park/hall permits, staging, portable restrooms, power supply.' },
    { name: 'Sound, Stage & AV Production', percentage: 22, description: 'PA system, microphones, stage lighting, and AV technician.' },
    { name: 'Food & Beverage Stalls', percentage: 22, description: 'Community catering, snack kiosks, water stations, and compostable supplies.' },
    { name: 'Signage, Marketing & Badges', percentage: 12, description: 'Banners, flyers, directional wayfinding, and digital outreach.' },
    { name: 'Safety, First Aid & Sanitation', percentage: 10, description: 'Security personnel, first aid kit, volunteer kits, and clean-up crew.' },
    { name: 'Emergency Contingency', percentage: 6, description: 'Weather fallback provisions and unexpected operational needs.' },
  ],
  college: [
    { name: 'Venue & Campus Facilities', percentage: 25, description: 'Auditorium/ground permissions, staging, and power setup.' },
    { name: 'Stage, Sound & AV Lighting', percentage: 25, description: 'Concert-grade acoustics, microphones, and stage lighting.' },
    { name: 'Food Stalls & Refreshments', percentage: 20, description: 'Festival food trucks, student snack kiosks, and drinks.' },
    { name: 'Artist & Guest Honorarium', percentage: 15, description: 'Headline band, guest speakers, judges, and hospitality.' },
    { name: 'Banners, Badges & Merch', percentage: 10, description: 'Festival t-shirts, identity passes, trophies, and posters.' },
    { name: 'Security & Medical Emergency', percentage: 5, description: 'Campus security, volunteer coordination, and emergency kit.' },
  ],
  corporate: [
    { name: 'Venue & Executive Suites', percentage: 35, description: 'Conference hall, breakout salons, and premium facilities.' },
    { name: 'Executive Catering & Gala Bar', percentage: 28, description: 'Multi-course banquet dining, coffee stations, and bar service.' },
    { name: 'Stage, AV & Keynote Tech', percentage: 15, description: 'LED video walls, keynote streaming, and acoustic engineering.' },
    { name: 'Photo & Media Production', percentage: 10, description: 'Event photography, executive highlight film, and press reels.' },
    { name: 'Branding, Badges & Gift Kits', percentage: 7, description: 'Corporate gift hampers, embossed lanyards, and signage.' },
    { name: 'Logistics & Coordination', percentage: 5, description: 'VIP transport, registration kiosks, and management buffer.' },
  ],
  party: [
    { name: 'Venue & Lounge Space', percentage: 32, description: 'Rooftop, private loft, or villa rental and setup.' },
    { name: 'Mixology, Bar & Catering', percentage: 32, description: 'Craft cocktails, passed hors d’oeuvres, and late-night snacks.' },
    { name: 'DJ, Sound & Dance Floor', percentage: 15, description: 'Live DJ set, party acoustics, and dance floor lighting.' },
    { name: 'Thematic Decor & Photo Wall', percentage: 11, description: 'Neon signage, bespoke floral vignettes, and instant photos.' },
    { name: 'Photography & Keepsakes', percentage: 6, description: 'Party portraits, candid video reels, and signature favors.' },
    { name: 'Contingency Buffer', percentage: 4, description: 'Extra bar stock and unexpected event requests.' },
  ],
  concert: [
    { name: 'Audio Rig & Stage Lighting', percentage: 32, description: 'Line-array concert sound, stage trusses, and intelligent lighting.' },
    { name: 'Arena & Venue Staging', percentage: 26, description: 'Amphitheater / ground rental, backstage barricades, and power.' },
    { name: 'Artist & Band Production', percentage: 20, description: 'Musical talent, greenroom hospitality, and riders.' },
    { name: 'Crowd Safety & Access Control', percentage: 10, description: 'Professional bouncers, medical squad, and ticketing scanners.' },
    { name: 'Backstage Hospitality & Crew', percentage: 7, description: 'Crew catering, artist transport, and production managers.' },
    { name: 'Permits & Municipal Licenses', percentage: 5, description: 'Civic permits, noise clearances, and fire marshal checks.' },
  ],
  custom: [
    { name: 'Venue & Facilities', percentage: 30, description: 'Primary venue reservation, insurance, and access staffing.' },
    { name: 'Catering & Dining Experience', percentage: 25, description: 'Artisan food service, beverage curation, and service crew.' },
    { name: 'Decoration & Atmosphere', percentage: 15, description: 'Thematic decor, bespoke floral styling, and ambient lighting.' },
    { name: 'Photography & Cinema', percentage: 12, description: 'Professional documentary capture and high-res gallery.' },
    { name: 'Entertainment & Music', percentage: 10, description: 'Live performers, DJ, and professional sound amplification.' },
    { name: 'Miscellaneous & Contingency', percentage: 8, description: 'Flexible buffer for personalized custom adjustments.' },
  ],
};

// Safe integer conversion helper: convert amount to minor units (e.g. cents/paise)
export function toMinorUnits(amount: number): number {
  return Math.round(Number(amount) * 100);
}

// Convert minor units back to major units with 2 decimal precision
export function fromMinorUnits(minorUnits: number): number {
  return Math.round(minorUnits) / 100;
}

// Format currency display nicely
export function formatCurrency(amount: number, currency: Currency): string {
  const rounded = Math.round(amount);
  const localeMap: Record<Currency, string> = {
    INR: 'en-IN',
    USD: 'en-US',
    EUR: 'de-DE',
    GBP: 'en-GB',
  };

  try {
    return new Intl.NumberFormat(localeMap[currency] || 'en-IN', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    }).format(rounded);
  } catch {
    const symbol = currency === 'INR' ? '₹' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '$';
    return `${symbol}${rounded.toLocaleString()}`;
  }
}

// Create initial recommended budget distribution
export function generateRecommendedBudget(
  eventType: EventType,
  totalBudget: number,
  currency: Currency
): BudgetAllocation {
  const template = DEFAULT_BUDGET_TEMPLATES[eventType] || DEFAULT_BUDGET_TEMPLATES.wedding;
  const totalMinor = toMinorUnits(totalBudget);

  let allocatedMinorSum = 0;
  const categories: BudgetCategoryItem[] = template.map((item, idx) => {
    // For all except the last item, calculate integer proportional minor units
    let itemMinor: number;
    if (idx === template.length - 1) {
      // Absorb rounding difference into last category so total matches exactly 100%
      itemMinor = Math.max(0, totalMinor - allocatedMinorSum);
    } else {
      itemMinor = Math.round((totalMinor * item.percentage) / 100);
      allocatedMinorSum += itemMinor;
    }

    const allocated = fromMinorUnits(itemMinor);
    const percentage = totalBudget > 0 ? Math.round((allocated / totalBudget) * 100) : 0;

    return {
      id: `cat-${idx}-${item.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      name: item.name,
      allocated,
      recommendedPercentage: item.percentage,
      percentage,
      description: item.description,
      isCustom: false,
    };
  });

  return recalculateBudget(categories, totalBudget, currency);
}

// Recalculate allocations, overflow, percentages safely
export function recalculateBudget(
  categories: BudgetCategoryItem[],
  totalBudget: number,
  currency: Currency
): BudgetAllocation {
  const totalBudgetMinor = toMinorUnits(totalBudget);
  let totalAllocatedMinor = 0;

  for (const cat of categories) {
    const safeAmount = Math.max(0, Number(cat.allocated) || 0);
    totalAllocatedMinor += toMinorUnits(safeAmount);
  }

  const totalAllocated = fromMinorUnits(totalAllocatedMinor);
  const remainingMinor = totalBudgetMinor - totalAllocatedMinor;
  const remaining = fromMinorUnits(remainingMinor);
  const isOverBudget = remainingMinor < 0;
  const overspendAmount = isOverBudget ? fromMinorUnits(Math.abs(remainingMinor)) : 0;

  // Update percentages
  const updatedCategories = categories.map((cat) => {
    const safeAmount = Math.max(0, Number(cat.allocated) || 0);
    const pct = totalBudget > 0 ? Number(((safeAmount / totalBudget) * 100).toFixed(1)) : 0;
    return {
      ...cat,
      allocated: safeAmount,
      percentage: pct,
    };
  });

  return {
    totalBudget,
    currency,
    categories: updatedCategories,
    totalAllocated,
    remaining,
    isOverBudget,
    overspendAmount,
  };
}
