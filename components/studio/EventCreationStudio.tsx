'use client';

import React, { useState } from 'react';
import { EventFormData, EventType, Aesthetic, Currency, EventSetting } from '@/types/event';
import { ValidationErrors } from '@/lib/validation/eventSchema';
import { formatCurrency } from '@/lib/budget/calculator';
import {
  Heart,
  Gift,
  Building2,
  GraduationCap,
  Sparkles,
  Music,
  PartyPopper,
  Flame,
  ArrowRight,
  ArrowLeft,
  Check,
  AlertCircle,
  Calendar,
  MapPin,
  Users,
  Coins,
  Palette,
  Compass,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';

interface EventCreationStudioProps {
  initialEventType?: EventType;
  onCancel: () => void;
  onSubmit: (data: EventFormData) => void;
}

const EVENT_TYPE_OPTIONS: { id: EventType; label: string; description: string; icon: React.ElementType }[] = [
  { id: 'wedding', label: 'Wedding & Union', description: 'Ceremonial vows, banquet dining & grand reception', icon: Heart },
  { id: 'birthday', label: 'Milestone Birthday', description: 'Intimate soirées, landmark years & cake celebrations', icon: Gift },
  { id: 'college', label: 'College & Campus Fest', description: 'Pro-nights, cultural stages, competitions & food stalls', icon: GraduationCap },
  { id: 'corporate', label: 'Corporate Gala & Summit', description: 'Conferences, leadership retreats & awards galas', icon: Building2 },
  { id: 'party', label: 'Private Party & Soirée', description: 'Cocktail mixers, rooftop beats & dance celebrations', icon: PartyPopper },
  { id: 'concert', label: 'Concert & Live Show', description: 'Stage production, acoustic touring & crowd arenas', icon: Music },
  { id: 'community', label: 'Community Festival', description: 'Civic gatherings, artisan markets & open-air fairs', icon: Sparkles },
  { id: 'custom', label: 'Bespoke Celebration', description: 'Personalized vision tailored from first principles', icon: Flame },
];

const AESTHETIC_OPTIONS: { id: Aesthetic; title: string; description: string; sampleHex: string[] }[] = [
  { id: 'elegant', title: 'Regal Elegance', description: 'Deep velvet, candlelight, champagne crystal & classical poise', sampleHex: ['#1E0F24', '#D4AF37', '#FAF7F2', '#3A1B42'] },
  { id: 'garden', title: 'Botanical Eden', description: 'Verdant foliage, blooming florals, stone textures & open skies', sampleHex: ['#3D5A40', '#E88D83', '#FAF7F2', '#8A9A86'] },
  { id: 'modern', title: 'Architectural Modern', description: 'Clean lines, sculptural monoliths, high-contrast & sleek lighting', sampleHex: ['#120616', '#E86A58', '#FAF7F2', '#2A1633'] },
  { id: 'minimal', title: 'Curated Minimalist', description: 'Ivory serenity, intentional negative space & refined simplicity', sampleHex: ['#FAF7F2', '#333333', '#D4AF37', '#777777'] },
  { id: 'traditional', title: 'Ancestral Heritage', description: 'Sacred goldwork, heirloom tapestries & rich ceremonial rites', sampleHex: ['#800020', '#D4AF37', '#FAF7F2', '#321D35'] },
  { id: 'playful', title: 'Vibrant Euphoria', description: 'Energetic neon, confetti accents, bold photobooths & upbeat warmth', sampleHex: ['#E86A58', '#D4AF37', '#8B00FF', '#00F0FF'] },
];

const COLOR_PALETTES = [
  { name: 'Royal Crimson & Antique Gold', colors: ['#800020', '#D4AF37', '#FAF7F2', '#1E0F24'] },
  { name: 'Midnight Velvet & Champagne', colors: ['#1E0F24', '#F5E6C8', '#E86A58', '#3A1B42'] },
  { name: 'Sage Garden & Blush Rose', colors: ['#4A6B4F', '#E88D83', '#FAF7F2', '#263829'] },
  { name: 'Monochrome Onyx & Platinum', colors: ['#120616', '#C0C0C0', '#FAF7F2', '#333333'] },
  { name: 'Sunset Terracotta & Amber', colors: ['#C85A32', '#D4AF37', '#FAF7F2', '#4A2018'] },
  { name: 'Electric Violet & Cyber Aqua', colors: ['#8B00FF', '#00F0FF', '#E86A58', '#0D0221'] },
];

const CURRENCY_OPTIONS: { code: Currency; symbol: string; label: string; defaultBudget: number }[] = [
  { code: 'INR', symbol: '₹', label: 'Indian Rupee (INR)', defaultBudget: 1500000 },
  { code: 'USD', symbol: '$', label: 'US Dollar (USD)', defaultBudget: 35000 },
  { code: 'EUR', symbol: '€', label: 'Euro (EUR)', defaultBudget: 30000 },
  { code: 'GBP', symbol: '£', label: 'British Pound (GBP)', defaultBudget: 28000 },
];

const DEFAULT_CATEGORY_RATIOS = {
  venue: 0.35,
  catering: 0.25,
  decoration: 0.15,
  photography: 0.10,
  entertainment: 0.10,
  miscellaneous: 0.05,
};

export const EventCreationStudio: React.FC<EventCreationStudioProps> = ({
  initialEventType = 'wedding',
  onCancel,
  onSubmit,
}) => {
  const [step, setStep] = useState<number>(1);
  const totalSteps = 4;
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState<EventFormData>({
    eventType: initialEventType,
    title: '',
    date: '',
    location: '',
    guestCount: 120,
    totalBudget: 1500000,
    currency: 'INR',
    aesthetic: 'elegant',
    colorPalette: 'Royal Crimson & Antique Gold',
    setting: 'outdoor',
    atmosphere: 'Sophisticated, warm, and memorable with candlelit charm',
    notes: '',
    dietaryRequirements: '',
  });

  // Step 3 Allocations
  const [allocations, setAllocations] = useState<{
    venue: number;
    catering: number;
    decoration: number;
    photography: number;
    entertainment: number;
    miscellaneous: number;
  }>({
    venue: Math.round(1500000 * DEFAULT_CATEGORY_RATIOS.venue),
    catering: Math.round(1500000 * DEFAULT_CATEGORY_RATIOS.catering),
    decoration: Math.round(1500000 * DEFAULT_CATEGORY_RATIOS.decoration),
    photography: Math.round(1500000 * DEFAULT_CATEGORY_RATIOS.photography),
    entertainment: Math.round(1500000 * DEFAULT_CATEGORY_RATIOS.entertainment),
    miscellaneous: Math.round(1500000 * DEFAULT_CATEGORY_RATIOS.miscellaneous),
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Recalculate default allocations when totalBudget changes if user hasn't heavily customized
  const handleBudgetChange = (newBudget: number) => {
    const valid = Math.max(0, newBudget);
    setFormData((prev) => ({ ...prev, totalBudget: valid }));
    setAllocations({
      venue: Math.round(valid * DEFAULT_CATEGORY_RATIOS.venue),
      catering: Math.round(valid * DEFAULT_CATEGORY_RATIOS.catering),
      decoration: Math.round(valid * DEFAULT_CATEGORY_RATIOS.decoration),
      photography: Math.round(valid * DEFAULT_CATEGORY_RATIOS.photography),
      entertainment: Math.round(valid * DEFAULT_CATEGORY_RATIOS.entertainment),
      miscellaneous: Math.round(valid * DEFAULT_CATEGORY_RATIOS.miscellaneous),
    });
  };

  const handleResetAllocations = () => {
    handleBudgetChange(formData.totalBudget);
  };

  const totalAllocated =
    allocations.venue +
    allocations.catering +
    allocations.decoration +
    allocations.photography +
    allocations.entertainment +
    allocations.miscellaneous;

  const remainingBudget = formData.totalBudget - totalAllocated;
  const isOverBudget = remainingBudget < 0;

  const updateField = <K extends keyof EventFormData>(field: K, value: EventFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof ValidationErrors]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field as keyof ValidationErrors];
        return copy;
      });
    }
  };

  const markTouched = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Step 1 validation
  const validateStep1 = () => {
    const stepErrors: ValidationErrors = {};
    if (!formData.title || formData.title.trim().length < 3) {
      stepErrors.title = 'Event title must be at least 3 characters.';
    }
    if (!formData.eventType) {
      stepErrors.eventType = 'Please select a celebration category.';
    }
    if (!formData.date) {
      stepErrors.date = 'Please select a valid event date.';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (isNaN(selectedDate.getTime()) || selectedDate <= today) {
        stepErrors.date = 'Event date must be in the future.';
      }
    }
    if (!formData.location || formData.location.trim().length < 2) {
      stepErrors.location = 'Please enter a location or venue preference.';
    }
    if (!formData.guestCount || formData.guestCount <= 0) {
      stepErrors.guestCount = 'Guest count must be at least 1.';
    }
    return stepErrors;
  };

  // Step 2 validation
  const validateStep2 = () => {
    const stepErrors: ValidationErrors = {};
    if (!formData.aesthetic) {
      stepErrors.aesthetic = 'Please select a preferred aesthetic style.';
    }
    return stepErrors;
  };

  // Step 3 validation
  const validateStep3 = () => {
    const stepErrors: ValidationErrors = {};
    if (!formData.totalBudget || formData.totalBudget <= 0) {
      stepErrors.totalBudget = 'Total budget must be a positive number.';
    }
    if (isOverBudget) {
      stepErrors.totalBudget = `Allocations exceed budget by ${formatCurrency(Math.abs(remainingBudget), formData.currency)}. Please balance categories.`;
    }
    return stepErrors;
  };

  const handleNext = () => {
    if (step === 1) {
      const s1Errors = validateStep1();
      if (Object.keys(s1Errors).length > 0) {
        setErrors(s1Errors);
        setTouched({ title: true, eventType: true, date: true, location: true, guestCount: true });
        return;
      }
      setErrors({});
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (step === 2) {
      const s2Errors = validateStep2();
      if (Object.keys(s2Errors).length > 0) {
        setErrors(s2Errors);
        setTouched({ aesthetic: true });
        return;
      }
      setErrors({});
      setStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (step === 3) {
      const s3Errors = validateStep3();
      if (Object.keys(s3Errors).length > 0) {
        setErrors(s3Errors);
        setTouched({ totalBudget: true });
        return;
      }
      setErrors({});
      setStep(4);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Step 4: Final Submission
    if (step === 4) {
      setIsSubmitting(true);
      const packageData: EventFormData = {
        ...formData,
        customBudgetCategories: [
          { name: 'Venue & Reception', allocated: allocations.venue },
          { name: 'Catering & Bar', allocated: allocations.catering },
          { name: 'Floral, Styling & Decor', allocated: allocations.decoration },
          { name: 'Photography & Cinema', allocated: allocations.photography },
          { name: 'Music & Entertainment', allocated: allocations.entertainment },
          { name: 'Miscellaneous & Contingency', allocated: allocations.miscellaneous },
        ],
      };
      setTimeout(() => {
        onSubmit(packageData);
      }, 350);
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onCancel();
    }
  };

  return (
    <div className="py-12 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6">
      {/* Studio Header */}
      <div className="mb-10 text-center space-y-2">
        <span className="text-xs uppercase tracking-widest font-mono text-[#D4AF37] font-semibold">
          FESTORA Event Architecture Studio
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#FAF7F2]">
          Create Your Celebration
        </h1>
        <p className="text-sm sm:text-base text-[#FAF7F2]/75 font-light">
          Step {step} of {totalSteps}:{' '}
          {step === 1 && 'Event Details & Scope'}
          {step === 2 && 'Style, Theme & Atmosphere'}
          {step === 3 && 'Financial Budget & Allocations'}
          {step === 4 && 'Dossier Review & Plan Creation'}
        </p>
      </div>

      {/* Progress Bar & Indicators */}
      <div className="mb-10" aria-label="Creation Progress">
        <div className="flex items-center justify-between mb-3">
          {[
            { num: 1, label: 'Details' },
            { num: 2, label: 'Style & Setting' },
            { num: 3, label: 'Budget' },
            { num: 4, label: 'Review' },
          ].map((item) => {
            const isCompleted = step > item.num;
            const isCurrent = step === item.num;
            return (
              <button
                key={item.num}
                type="button"
                onClick={() => {
                  if (item.num < step) setStep(item.num);
                }}
                disabled={item.num > step}
                className={`flex flex-col items-center flex-1 transition-all ${
                  item.num <= step ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all ${
                    isCompleted
                      ? 'bg-[#E86A58] text-[#120616]'
                      : isCurrent
                      ? 'bg-[#D4AF37] text-[#120616] ring-4 ring-[#D4AF37]/30 shadow-lg'
                      : 'bg-[#1E0F24] text-[#FAF7F2]/50 border border-white/10'
                  }`}
                >
                  {isCompleted ? <Check className="w-5 h-5 stroke-[2.5]" /> : item.num}
                </div>
                <span
                  className={`text-xs mt-2 font-medium hidden sm:block ${
                    isCurrent ? 'text-[#D4AF37] font-bold' : isCompleted ? 'text-[#FAF7F2]' : 'text-[#FAF7F2]/50'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#D4AF37] to-[#E86A58] transition-all duration-300"
            style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Studio Card Form Container */}
      <div className="bg-[#1E0F24]/90 backdrop-blur-md rounded-3xl border border-white/10 p-6 sm:p-10 shadow-2xl">
        {/* ================= STEP 1: EVENT DETAILS ================= */}
        {step === 1 && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#FAF7F2]">
                Step 1: Event Details & Scope
              </h2>
              <p className="text-sm text-[#FAF7F2]/70 font-light mt-1">
                Name your celebration, select its primary archetype, and establish date, location, and guest expectations.
              </p>
            </div>

            {/* Event Name */}
            <div className="space-y-2">
              <label htmlFor="event-title" className="block text-xs uppercase tracking-wider font-mono text-[#D4AF37] font-semibold">
                Event Name <span className="text-[#E86A58]">*</span>
              </label>
              <input
                id="event-title"
                type="text"
                value={formData.title}
                onChange={(e) => updateField('title', e.target.value)}
                onBlur={() => markTouched('title')}
                placeholder="e.g., Aarav & Meera’s Royal Sangeet & Wedding"
                className={`w-full px-4 py-3.5 rounded-xl bg-white/[0.05] border text-[#FAF7F2] placeholder-white/30 text-sm focus:outline-none transition-all ${
                  errors.title && touched.title
                    ? 'border-[#E86A58] ring-1 ring-[#E86A58]'
                    : 'border-white/15 focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]'
                }`}
              />
              {errors.title && touched.title && (
                <p className="text-xs text-[#E86A58] flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.title}</span>
                </p>
              )}
            </div>

            {/* Event Type Grid */}
            <div className="space-y-3">
              <label className="block text-xs uppercase tracking-wider font-mono text-[#D4AF37] font-semibold">
                Celebration Archetype <span className="text-[#E86A58]">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {EVENT_TYPE_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = formData.eventType === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => updateField('eventType', opt.id)}
                      className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all group ${
                        isSelected
                          ? 'bg-[#E86A58]/15 border-[#E86A58] ring-1 ring-[#E86A58] shadow-md'
                          : 'bg-white/[0.03] border-white/10 hover:border-white/25 hover:bg-white/[0.06]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                            isSelected ? 'bg-[#E86A58] text-[#120616]' : 'bg-white/10 text-[#D4AF37]'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-[#E86A58]" />}
                      </div>
                      <div>
                        <span className={`block font-serif font-bold text-sm ${isSelected ? 'text-[#FAF7F2]' : 'text-[#FAF7F2]/90'}`}>
                          {opt.label}
                        </span>
                        <span className="text-[11px] text-[#FAF7F2]/60 font-light line-clamp-2 mt-1">
                          {opt.description}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Date, Location, Guest Count Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {/* Event Date */}
              <div className="space-y-2">
                <label htmlFor="event-date" className="block text-xs uppercase tracking-wider font-mono text-[#D4AF37] font-semibold flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Date <span className="text-[#E86A58]">*</span></span>
                </label>
                <input
                  id="event-date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => updateField('date', e.target.value)}
                  onBlur={() => markTouched('date')}
                  className={`w-full px-4 py-3 rounded-xl bg-white/[0.05] border text-[#FAF7F2] text-sm focus:outline-none transition-all ${
                    errors.date && touched.date
                      ? 'border-[#E86A58] ring-1 ring-[#E86A58]'
                      : 'border-white/15 focus:border-[#D4AF37]'
                  }`}
                />
                {errors.date && touched.date && (
                  <p className="text-[11px] text-[#E86A58] flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.date}</span>
                  </p>
                )}
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label htmlFor="event-location" className="block text-xs uppercase tracking-wider font-mono text-[#D4AF37] font-semibold flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Location / Venue <span className="text-[#E86A58]">*</span></span>
                </label>
                <input
                  id="event-location"
                  type="text"
                  value={formData.location}
                  onChange={(e) => updateField('location', e.target.value)}
                  onBlur={() => markTouched('location')}
                  placeholder="e.g. Udaipur, Oberoi Udaivilas"
                  className={`w-full px-4 py-3 rounded-xl bg-white/[0.05] border text-[#FAF7F2] placeholder-white/30 text-sm focus:outline-none transition-all ${
                    errors.location && touched.location
                      ? 'border-[#E86A58] ring-1 ring-[#E86A58]'
                      : 'border-white/15 focus:border-[#D4AF37]'
                  }`}
                />
                {errors.location && touched.location && (
                  <p className="text-[11px] text-[#E86A58] flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{errors.location}</span>
                  </p>
                )}
              </div>

              {/* Guest Count */}
              <div className="space-y-2">
                <label htmlFor="event-guests" className="block text-xs uppercase tracking-wider font-mono text-[#D4AF37] font-semibold flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  <span>Expected Guests <span className="text-[#E86A58]">*</span></span>
                </label>
                <input
                  id="event-guests"
                  type="number"
                  min="1"
                  max="10000"
                  value={formData.guestCount || ''}
                  onChange={(e) => updateField('guestCount', parseInt(e.target.value) || 0)}
                  onBlur={() => markTouched('guestCount')}
                  className={`w-full px-4 py-3 rounded-xl bg-white/[0.05] border text-[#FAF7F2] text-sm focus:outline-none transition-all ${
                    errors.guestCount && touched.guestCount
                      ? 'border-[#E86A58] ring-1 ring-[#E86A58]'
                      : 'border-white/15 focus:border-[#D4AF37]'
                  }`}
                />
                {/* Guest preset pills */}
                <div className="flex gap-1.5 pt-1">
                  {[50, 100, 200, 500].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => updateField('guestCount', preset)}
                      className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors ${
                        formData.guestCount === preset
                          ? 'bg-[#D4AF37] text-[#120616] border-[#D4AF37] font-bold'
                          : 'border-white/15 text-[#FAF7F2]/60 hover:text-white'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 2: STYLE & PREFERENCES ================= */}
        {step === 2 && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#FAF7F2]">
                Step 2: Style, Palette & Atmosphere
              </h2>
              <p className="text-sm text-[#FAF7F2]/70 font-light mt-1">
                Define the aesthetic signature, sensory color harmonies, setting boundaries, and guest atmosphere.
              </p>
            </div>

            {/* Aesthetic Selector */}
            <div className="space-y-3">
              <label className="block text-xs uppercase tracking-wider font-mono text-[#D4AF37] font-semibold flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5" />
                <span>Preferred Theme & Aesthetic</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {AESTHETIC_OPTIONS.map((a) => {
                  const isSelected = formData.aesthetic === a.id;
                  return (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => updateField('aesthetic', a.id)}
                      className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                        isSelected
                          ? 'bg-[#D4AF37]/15 border-[#D4AF37] ring-1 ring-[#D4AF37] shadow-lg'
                          : 'bg-white/[0.03] border-white/10 hover:border-white/25 hover:bg-white/[0.05]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`font-serif font-bold text-base ${isSelected ? 'text-[#FAF7F2]' : 'text-[#FAF7F2]/90'}`}>
                            {a.title}
                          </span>
                          {isSelected && <Check className="w-4 h-4 text-[#D4AF37]" />}
                        </div>
                        <p className="text-xs text-[#FAF7F2]/65 font-light leading-relaxed mb-4">
                          {a.description}
                        </p>
                      </div>
                      {/* Swatch dots */}
                      <div className="flex gap-1.5 items-center">
                        {a.sampleHex.map((hex, i) => (
                          <div
                            key={i}
                            className="w-4 h-4 rounded-full border border-white/20 shadow-xs"
                            style={{ backgroundColor: hex }}
                            title={hex}
                          />
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Color Palette Selector */}
            <div className="space-y-3 pt-2">
              <label className="block text-xs uppercase tracking-wider font-mono text-[#D4AF37] font-semibold">
                Signature Color Harmonies
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {COLOR_PALETTES.map((pal) => {
                  const isSelected = formData.colorPalette === pal.name;
                  return (
                    <button
                      key={pal.name}
                      type="button"
                      onClick={() => updateField('colorPalette', pal.name)}
                      className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                        isSelected
                          ? 'bg-[#E86A58]/20 border-[#E86A58] ring-1 ring-[#E86A58]'
                          : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="text-left">
                        <span className="block text-xs font-semibold text-[#FAF7F2]">
                          {pal.name}
                        </span>
                        <div className="flex gap-1.5 mt-2">
                          {pal.colors.map((c, i) => (
                            <span
                              key={i}
                              className="w-3.5 h-3.5 rounded-full border border-white/20"
                              style={{ backgroundColor: c }}
                            />
                          ))}
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-[#E86A58]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Setting: Indoor, Outdoor, Hybrid */}
            <div className="space-y-3 pt-2">
              <label className="block text-xs uppercase tracking-wider font-mono text-[#D4AF37] font-semibold flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" />
                <span>Venue Setting & Spatial Layout</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'outdoor', label: 'Outdoor Garden / Open Air', desc: 'Lawns, courtyards, terraces & open skies' },
                  { id: 'indoor', label: 'Indoor Ballroom / Estate', desc: 'Acoustic-controlled salons, halls & galleries' },
                  { id: 'hybrid', label: 'Hybrid Indoor / Outdoor', desc: 'Seamless transition across glasshouses & lawns' },
                ].map((setOpt) => {
                  const isSelected = formData.setting === setOpt.id;
                  return (
                    <button
                      key={setOpt.id}
                      type="button"
                      onClick={() => updateField('setting', setOpt.id as EventSetting)}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-[#D4AF37]/20 border-[#D4AF37] ring-1 ring-[#D4AF37]'
                          : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                      }`}
                    >
                      <span className="block font-semibold text-xs text-[#FAF7F2]">{setOpt.label}</span>
                      <span className="text-[11px] text-[#FAF7F2]/60 font-light block mt-1">{setOpt.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Atmosphere & Specific Notes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <label htmlFor="event-atmosphere" className="block text-xs uppercase tracking-wider font-mono text-[#D4AF37] font-semibold">
                  Overall Atmosphere & Energy
                </label>
                <input
                  id="event-atmosphere"
                  type="text"
                  value={formData.atmosphere || ''}
                  onChange={(e) => updateField('atmosphere', e.target.value)}
                  placeholder="e.g. High-energy celebration shifting into intimate candlelit lounge"
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/15 text-[#FAF7F2] placeholder-white/30 text-sm focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="event-dietary" className="block text-xs uppercase tracking-wider font-mono text-[#D4AF37] font-semibold">
                  Dietary & Culinary Preferences
                </label>
                <input
                  id="event-dietary"
                  type="text"
                  value={formData.dietaryRequirements || ''}
                  onChange={(e) => updateField('dietaryRequirements', e.target.value)}
                  placeholder="e.g. Organic vegetarian banquet, signature mocktail pairings"
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/15 text-[#FAF7F2] placeholder-white/30 text-sm focus:border-[#D4AF37] focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP 3: BUDGET & ALLOCATION ================= */}
        {step === 3 && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#FAF7F2]">
                Step 3: Budget & Category Allocation
              </h2>
              <p className="text-sm text-[#FAF7F2]/70 font-light mt-1">
                Establish the financial parameters and calibrate allocation across venue, catering, decor, photography, entertainment, and contingency.
              </p>
            </div>

            {/* Currency & Total Budget Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Currency Picker */}
              <div className="space-y-2">
                <label htmlFor="currency-select" className="block text-xs uppercase tracking-wider font-mono text-[#D4AF37] font-semibold flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5" />
                  <span>Currency (INR Default)</span>
                </label>
                <select
                  id="currency-select"
                  value={formData.currency}
                  onChange={(e) => {
                    const c = e.target.value as Currency;
                    const preset = CURRENCY_OPTIONS.find((opt) => opt.code === c);
                    updateField('currency', c);
                    if (preset) handleBudgetChange(preset.defaultBudget);
                  }}
                  className="w-full px-4 py-3.5 rounded-xl bg-[#160B18] border border-white/20 text-[#FAF7F2] text-sm focus:border-[#D4AF37] focus:outline-none"
                >
                  {CURRENCY_OPTIONS.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.label} ({c.symbol})
                    </option>
                  ))}
                </select>
              </div>

              {/* Total Budget Input */}
              <div className="sm:col-span-2 space-y-2">
                <label htmlFor="total-budget" className="block text-xs uppercase tracking-wider font-mono text-[#D4AF37] font-semibold flex items-center justify-between">
                  <span>Total Estimated Budget <span className="text-[#E86A58]">*</span></span>
                  <span className="text-[11px] font-normal text-[#FAF7F2]/60">
                    Formatted: {formatCurrency(formData.totalBudget, formData.currency)}
                  </span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono font-bold text-[#D4AF37] text-base">
                    {CURRENCY_OPTIONS.find((c) => c.code === formData.currency)?.symbol || '₹'}
                  </span>
                  <input
                    id="total-budget"
                    type="number"
                    min="1000"
                    step="5000"
                    value={formData.totalBudget || ''}
                    onChange={(e) => handleBudgetChange(parseFloat(e.target.value) || 0)}
                    className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-white/[0.05] border border-white/20 text-[#FAF7F2] text-base font-mono font-bold focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Budget Balance Banner */}
            <div
              className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isOverBudget
                  ? 'bg-[#E86A58]/15 border-[#E86A58] text-[#E86A58]'
                  : remainingBudget === 0
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                  : 'bg-[#D4AF37]/15 border-[#D4AF37]/30 text-[#D4AF37]'
              }`}
            >
              <div className="flex items-center gap-3">
                {isOverBudget ? (
                  <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                ) : remainingBudget === 0 ? (
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                ) : (
                  <Coins className="w-5 h-5 flex-shrink-0" />
                )}
                <div>
                  <span className="text-xs uppercase tracking-wider font-mono font-bold block">
                    {isOverBudget
                      ? 'Budget Overflow Warning'
                      : remainingBudget === 0
                      ? '100% Perfectly Balanced'
                      : 'Unallocated Remaining Funds'}
                  </span>
                  <span className="text-xs font-light opacity-90">
                    Allocated: {formatCurrency(totalAllocated, formData.currency)} of {formatCurrency(formData.totalBudget, formData.currency)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto">
                <span className="font-mono font-bold text-sm">
                  {isOverBudget
                    ? `Over by ${formatCurrency(Math.abs(remainingBudget), formData.currency)}`
                    : `Remaining: ${formatCurrency(remainingBudget, formData.currency)}`}
                </span>
                <button
                  type="button"
                  onClick={handleResetAllocations}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#FAF7F2] text-[11px] font-semibold flex items-center gap-1 transition-colors"
                  title="Reset to recommended ratios"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Auto-Balance</span>
                </button>
              </div>
            </div>

            {/* Category Allocations Sliders / Inputs */}
            <div className="space-y-4 pt-2">
              <span className="text-xs uppercase tracking-wider font-mono text-[#D4AF37] font-semibold block">
                Category Allocations
              </span>

              {[
                { key: 'venue', label: 'Venue & Reception Space', defaultPct: 35 },
                { key: 'catering', label: 'Catering, Banquet & Mixology', defaultPct: 25 },
                { key: 'decoration', label: 'Floral, Styling & Lighting Decor', defaultPct: 15 },
                { key: 'photography', label: 'Photography & Cinema Documentation', defaultPct: 10 },
                { key: 'entertainment', label: 'Live Music, DJ & Entertainment', defaultPct: 10 },
                { key: 'miscellaneous', label: 'Miscellaneous & Contingency Buffer', defaultPct: 5 },
              ].map((item) => {
                const currentVal = allocations[item.key as keyof typeof allocations];
                const pct = formData.totalBudget > 0 ? Math.round((currentVal / formData.totalBudget) * 100) : 0;
                return (
                  <div key={item.key} className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                      <span className="font-semibold text-[#FAF7F2]">{item.label}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-[#D4AF37] font-bold">{pct}%</span>
                        <input
                          type="number"
                          min="0"
                          value={currentVal}
                          onChange={(e) => {
                            const val = Math.max(0, parseFloat(e.target.value) || 0);
                            setAllocations((prev) => ({ ...prev, [item.key]: val }));
                          }}
                          className="w-28 px-2 py-1 rounded bg-black/40 border border-white/20 text-right font-mono text-xs text-[#FAF7F2]"
                        />
                      </div>
                    </div>
                    {/* Range Slider */}
                    <input
                      type="range"
                      min="0"
                      max={formData.totalBudget}
                      step={Math.max(100, Math.round(formData.totalBudget / 100))}
                      value={currentVal}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        setAllocations((prev) => ({ ...prev, [item.key]: val }));
                      }}
                      className="w-full accent-[#E86A58] h-1.5 bg-white/10 rounded-lg cursor-pointer"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= STEP 4: REVIEW & CREATE PLAN ================= */}
        {step === 4 && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#FAF7F2]">
                Step 4: Review Celebration Dossier
              </h2>
              <p className="text-sm text-[#FAF7F2]/70 font-light mt-1">
                Confirm all details before activating the planning engine to generate schedules, checklists, and vendor briefs.
              </p>
            </div>

            {/* Section 1 Review: Details */}
            <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#D4AF37]" />
                  <span className="text-xs uppercase tracking-wider font-mono font-bold text-[#D4AF37]">
                    Event Details & Scope
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-[#E86A58] hover:underline font-semibold"
                >
                  Edit Details
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[#FAF7F2]/60 block">Event Name</span>
                  <span className="font-semibold text-sm text-[#FAF7F2]">{formData.title}</span>
                </div>
                <div>
                  <span className="text-[#FAF7F2]/60 block">Celebration Type</span>
                  <span className="font-semibold text-sm capitalize text-[#FAF7F2]">{formData.eventType}</span>
                </div>
                <div>
                  <span className="text-[#FAF7F2]/60 block">Celebration Date</span>
                  <span className="font-semibold text-[#FAF7F2]">{formData.date}</span>
                </div>
                <div>
                  <span className="text-[#FAF7F2]/60 block">Location & Guests</span>
                  <span className="font-semibold text-[#FAF7F2]">{formData.location} ({formData.guestCount} Guests)</span>
                </div>
              </div>
            </div>

            {/* Section 2 Review: Style */}
            <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-[#D4AF37]" />
                  <span className="text-xs uppercase tracking-wider font-mono font-bold text-[#D4AF37]">
                    Style & Setting
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-xs text-[#E86A58] hover:underline font-semibold"
                >
                  Edit Style
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[#FAF7F2]/60 block">Theme Aesthetic</span>
                  <span className="font-semibold capitalize text-[#FAF7F2]">{formData.aesthetic}</span>
                </div>
                <div>
                  <span className="text-[#FAF7F2]/60 block">Color Palette</span>
                  <span className="font-semibold text-[#FAF7F2]">{formData.colorPalette}</span>
                </div>
                <div>
                  <span className="text-[#FAF7F2]/60 block">Spatial Setting</span>
                  <span className="font-semibold capitalize text-[#FAF7F2]">{formData.setting} setting</span>
                </div>
                <div>
                  <span className="text-[#FAF7F2]/60 block">Atmosphere Vibe</span>
                  <span className="font-semibold text-[#FAF7F2]">{formData.atmosphere || 'Bespoke Celebration'}</span>
                </div>
              </div>
            </div>

            {/* Section 3 Review: Budget */}
            <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-[#D4AF37]" />
                  <span className="text-xs uppercase tracking-wider font-mono font-bold text-[#D4AF37]">
                    Budget Allocation
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="text-xs text-[#E86A58] hover:underline font-semibold"
                >
                  Edit Budget
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm font-bold text-[#FAF7F2]">
                  <span>Total Investment</span>
                  <span className="font-mono text-[#D4AF37] text-base">{formatCurrency(formData.totalBudget, formData.currency)}</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
                  {[
                    { label: 'Venue', val: allocations.venue },
                    { label: 'Catering', val: allocations.catering },
                    { label: 'Decor', val: allocations.decoration },
                    { label: 'Photography', val: allocations.photography },
                    { label: 'Entertainment', val: allocations.entertainment },
                    { label: 'Contingency', val: allocations.miscellaneous },
                  ].map((cat) => (
                    <div key={cat.label} className="p-2.5 rounded-xl bg-black/30 border border-white/5 text-xs">
                      <span className="text-[#FAF7F2]/60 block text-[11px]">{cat.label}</span>
                      <span className="font-mono font-semibold text-[#FAF7F2]">
                        {formatCurrency(cat.val, formData.currency)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons Toolbar */}
        <div className="flex items-center justify-between gap-4 pt-8 mt-8 border-t border-white/10">
          <button
            type="button"
            onClick={handlePrev}
            className="px-5 py-3 rounded-xl border border-white/20 hover:bg-white/10 text-xs font-semibold uppercase tracking-wider text-[#FAF7F2] flex items-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{step === 1 ? 'Cancel' : 'Previous Step'}</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={isSubmitting}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E86A58] hover:from-[#E5BF48] hover:to-[#F2AEA6] text-[#120616] text-xs font-bold uppercase tracking-wider flex items-center gap-2.5 shadow-lg shadow-[#E86A58]/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-[#120616] border-t-transparent rounded-full animate-spin" />
                <span>Generating Blueprint...</span>
              </>
            ) : step === 4 ? (
              <>
                <span>Create Celebration Plan</span>
                <Sparkles className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>Continue to Step {step + 1}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
