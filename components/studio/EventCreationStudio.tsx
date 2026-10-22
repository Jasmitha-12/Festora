'use client';

import React, { useState } from 'react';
import { EventFormData, EventType, Aesthetic, Currency } from '@/types/event';
import { validateEventBasics, ValidationErrors } from '@/lib/validation/eventSchema';
import {
  Heart,
  Gift,
  Users,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  AlertCircle,
} from 'lucide-react';
import { formatCurrency } from '@/lib/budget/calculator';

interface EventCreationStudioProps {
  initialEventType?: EventType;
  onCancel: () => void;
  onSubmit: (data: EventFormData) => void;
}

export const EventCreationStudio: React.FC<EventCreationStudioProps> = ({
  initialEventType = 'wedding',
  onCancel,
  onSubmit,
}) => {
  const [step, setStep] = useState<number>(1);
  const totalSteps = 4;

  // Form State
  const [formData, setFormData] = useState<EventFormData>({
    eventType: initialEventType,
    title: '',
    date: '',
    location: '',
    guestCount: 100,
    totalBudget: 25000,
    currency: 'USD',
    aesthetic: 'elegant',
    dietaryRequirements: '',
    notes: '',
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Helper to update fields
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

  // Validate step before proceeding
  const handleNext = () => {
    const validation = validateEventBasics(formData);

    if (step === 1) {
      if (validation.errors.eventType) {
        setErrors({ eventType: validation.errors.eventType });
        return;
      }
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (step === 2) {
      const stepErrors: ValidationErrors = {};
      if (validation.errors.title) stepErrors.title = validation.errors.title;
      if (validation.errors.date) stepErrors.date = validation.errors.date;
      if (validation.errors.location) stepErrors.location = validation.errors.location;
      if (validation.errors.guestCount) stepErrors.guestCount = validation.errors.guestCount;

      if (Object.keys(stepErrors).length > 0) {
        setErrors(stepErrors);
        setTouched({ title: true, date: true, location: true, guestCount: true });
        return;
      }
      setStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (step === 3) {
      const stepErrors: ValidationErrors = {};
      if (validation.errors.totalBudget) stepErrors.totalBudget = validation.errors.totalBudget;
      if (validation.errors.currency) stepErrors.currency = validation.errors.currency;
      if (validation.errors.aesthetic) stepErrors.aesthetic = validation.errors.aesthetic;

      if (Object.keys(stepErrors).length > 0) {
        setErrors(stepErrors);
        setTouched({ totalBudget: true, currency: true, aesthetic: true });
        return;
      }
      setStep(4);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Step 4 is Review & Submit
    if (validation.isValid) {
      onSubmit(formData);
    } else {
      setErrors(validation.errors);
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

  // Currencies
  const currencies: { code: Currency; symbol: string; label: string; defaultBudget: number }[] = [
    { code: 'USD', symbol: '$', label: 'US Dollar', defaultBudget: 35000 },
    { code: 'EUR', symbol: '€', label: 'Euro', defaultBudget: 32000 },
    { code: 'INR', symbol: '₹', label: 'Indian Rupee', defaultBudget: 1500000 },
  ];

  // Aesthetics definitions
  const aesthetics: {
    id: Aesthetic;
    title: string;
    description: string;
    colors: string[];
  }[] = [
    {
      id: 'elegant',
      title: 'Regal Elegance',
      description: 'Opulent plum, champagne luster, velvet linens, and candlelight.',
      colors: ['#321D35', '#D8BD91', '#FAF7F2', '#A9B8A0'],
    },
    {
      id: 'garden',
      title: 'Botanical Garden',
      description: 'Verdant sage foliage, romantic blush florals, and natural wood.',
      colors: ['#A9B8A0', '#E88D83', '#FAF7F2', '#321D35'],
    },
    {
      id: 'modern',
      title: 'Contemporary Modern',
      description: 'Sleek architectural charcoal, electric coral accents, and clean lines.',
      colors: ['#28262B', '#E88D83', '#FAF7F2', '#D8BD91'],
    },
    {
      id: 'minimal',
      title: 'Curated Minimalist',
      description: 'Neutral ivory serenity, negative space, and single-variety florals.',
      colors: ['#FAF7F2', '#28262B', '#D8BD91', '#E88D83'],
    },
    {
      id: 'traditional',
      title: 'Heritage Traditional',
      description: 'Sacred goldwork, rich ceremonies, and ancestral artisanal splendor.',
      colors: ['#321D35', '#D8BD91', '#E88D83', '#FAF7F2'],
    },
    {
      id: 'playful',
      title: 'Vibrant Playful',
      description: 'Energetic coral, confetti shimmer, bold photobooths, and upbeat joy.',
      colors: ['#E88D83', '#D8BD91', '#321D35', '#A9B8A0'],
    },
  ];

  return (
    <div className="py-12 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6">
      
      {/* Studio Header */}
      <div className="mb-10 text-center space-y-2">
        <span className="text-xs uppercase tracking-widest font-mono text-[#321D35]/60 font-semibold">
          FESTORA Planning Studio
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#321D35]">
          Orchestrate Your Celebration
        </h1>
        <p className="text-sm sm:text-base text-[#28262B]/75 font-light">
          Step {step} of {totalSteps}:{' '}
          {step === 1 && 'Select Celebration Category'}
          {step === 2 && 'Dates, Location & Scale'}
          {step === 3 && 'Financial Budget & Signature Aesthetic'}
          {step === 4 && 'Curated Nuances & Final Blueprint'}
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="mb-12" aria-label="Creation Progress">
        <div className="flex items-center justify-between mb-2">
          {['Category', 'Basics', 'Budget & Style', 'Review'].map((label, i) => {
            const stepNum = i + 1;
            const isCompleted = step > stepNum;
            const isCurrent = step === stepNum;
            return (
              <div key={i} className="flex flex-col items-center flex-1">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-mono text-xs font-semibold transition-all ${
                    isCompleted
                      ? 'bg-[#321D35] text-[#FAF7F2]'
                      : isCurrent
                      ? 'bg-[#E88D83] text-white ring-4 ring-[#E88D83]/20 shadow'
                      : 'bg-[#FAF7F2] text-[#321D35]/40 editorial-border'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4 text-[#D8BD91]" /> : stepNum}
                </div>
                <span
                  className={`text-[11px] mt-1.5 hidden sm:block ${
                    isCurrent ? 'font-bold text-[#321D35]' : 'text-[#321D35]/60'
                  }`}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>
        <div className="h-1.5 w-full bg-[#321D35]/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#321D35] transition-all duration-300"
            style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Container Form */}
      <div className="bg-white rounded-3xl editorial-border editorial-shadow-lg p-6 sm:p-10">
        
        {/* STEP 1: Celebration Category */}
        {step === 1 && (
          <fieldset className="space-y-6">
            <legend className="text-xl sm:text-2xl font-serif font-bold text-[#321D35] mb-2">
              Which milestone are you celebrating?
            </legend>
            <p className="text-sm text-[#28262B]/75 font-light mb-6">
              This configures the planning engine with category-specific vendor briefs, run-of-show templates, and budget distributions.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  id: 'wedding' as EventType,
                  title: 'Wedding & Nuptials',
                  desc: 'Vow ceremonies, cocktail reception, floral design, bridal beauty, and dinner banquet.',
                  icon: Heart,
                  img: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
                },
                {
                  id: 'birthday' as EventType,
                  title: 'Milestone Birthday',
                  desc: 'Celebration dinners, artisan cakes, cocktail mixology, dance floors, and memory books.',
                  icon: Gift,
                  img: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=600&q=80',
                },
                {
                  id: 'community' as EventType,
                  title: 'Community Gathering',
                  desc: 'Grassroots festivals, neighborhood galas, municipal permits, stage AV, and safety.',
                  icon: Users,
                  img: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80',
                },
              ].map((opt) => {
                const Icon = opt.icon;
                const isSelected = formData.eventType === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => updateField('eventType', opt.id)}
                    className={`rounded-2xl p-5 text-left border-2 transition-all flex flex-col justify-between group overflow-hidden ${
                      isSelected
                        ? 'border-[#321D35] bg-[#FAF7F2] shadow-md'
                        : 'border-[#321D35]/15 hover:border-[#321D35]/40 bg-white'
                    }`}
                  >
                    <div>
                      <div className="aspect-[16/10] rounded-xl overflow-hidden mb-4 bg-[#321D35]/5 relative">
                        <img
                          src={opt.img}
                          alt={opt.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {isSelected && (
                          <div className="absolute top-2 right-2 p-1.5 rounded-full bg-[#321D35] text-[#FAF7F2]">
                            <Check className="w-3.5 h-3.5 text-[#D8BD91]" />
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mb-1.5">
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-[#E88D83]' : 'text-[#321D35]/60'}`} />
                        <h3 className="font-serif text-lg font-bold text-[#321D35]">{opt.title}</h3>
                      </div>
                      <p className="text-xs text-[#28262B]/75 font-light leading-relaxed">{opt.desc}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#321D35]/10 flex items-center justify-between text-xs font-semibold">
                      <span className={isSelected ? 'text-[#321D35]' : 'text-[#321D35]/60'}>
                        {isSelected ? '✓ Selected' : 'Select'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
            {errors.eventType && (
              <p className="text-xs text-[#CF695E] flex items-center gap-1.5 mt-2">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errors.eventType}</span>
              </p>
            )}
          </fieldset>
        )}

        {/* STEP 2: Basics (Title, Date, Location, Guest Count) */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#321D35]">
                Tell us about your celebration basics
              </h2>
              <p className="text-sm text-[#28262B]/75 font-light mt-1">
                Provide timing, location, and guest scale to tailor timelines and catering quotas.
              </p>
            </div>

            <div className="space-y-5">
              {/* Event Title */}
              <div>
                <label htmlFor="event-title" className="block text-xs font-mono uppercase tracking-wider text-[#321D35] font-semibold mb-1.5">
                  Celebration Title <span className="text-[#E88D83]">*</span>
                </label>
                <input
                  id="event-title"
                  type="text"
                  placeholder={
                    formData.eventType === 'wedding'
                      ? 'e.g. Maya & Arjun’s Botanical Vows'
                      : formData.eventType === 'birthday'
                      ? 'e.g. Leo’s 40th Vinyl & Cocktail Soirée'
                      : 'e.g. Riverside Green Harvest Festival'
                  }
                  value={formData.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  onBlur={() => markTouched('title')}
                  className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none transition-colors ${
                    errors.title && touched.title
                      ? 'border-[#CF695E] bg-[#CF695E]/5'
                      : 'border-[#321D35]/20 focus:border-[#321D35] bg-[#FAF7F2]/50'
                  }`}
                  aria-invalid={!!(errors.title && touched.title)}
                  aria-describedby={errors.title && touched.title ? 'title-error' : undefined}
                />
                {errors.title && touched.title && (
                  <p id="title-error" className="text-xs text-[#CF695E] flex items-center gap-1.5 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.title}</span>
                  </p>
                )}
              </div>

              {/* Grid: Date & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Date */}
                <div>
                  <label htmlFor="event-date" className="block text-xs font-mono uppercase tracking-wider text-[#321D35] font-semibold mb-1.5">
                    Celebration Date <span className="text-[#E88D83]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="event-date"
                      type="date"
                      min="2026-01-01"
                      value={formData.date}
                      onChange={(e) => updateField('date', e.target.value)}
                      onBlur={() => markTouched('date')}
                      className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none transition-colors ${
                        errors.date && touched.date
                          ? 'border-[#CF695E] bg-[#CF695E]/5'
                          : 'border-[#321D35]/20 focus:border-[#321D35] bg-[#FAF7F2]/50'
                      }`}
                    />
                  </div>
                  {errors.date && touched.date && (
                    <p className="text-xs text-[#CF695E] flex items-center gap-1.5 mt-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{errors.date}</span>
                    </p>
                  )}
                </div>

                {/* Location */}
                <div>
                  <label htmlFor="event-location" className="block text-xs font-mono uppercase tracking-wider text-[#321D35] font-semibold mb-1.5">
                    City / Venue Location <span className="text-[#E88D83]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="event-location"
                      type="text"
                      placeholder="e.g. San Francisco, CA or London, UK"
                      value={formData.location}
                      onChange={(e) => updateField('location', e.target.value)}
                      onBlur={() => markTouched('location')}
                      className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none transition-colors ${
                        errors.location && touched.location
                          ? 'border-[#CF695E] bg-[#CF695E]/5'
                          : 'border-[#321D35]/20 focus:border-[#321D35] bg-[#FAF7F2]/50'
                      }`}
                    />
                  </div>
                  {errors.location && touched.location && (
                    <p className="text-xs text-[#CF695E] flex items-center gap-1.5 mt-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{errors.location}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Guest Count */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="guest-count" className="text-xs font-mono uppercase tracking-wider text-[#321D35] font-semibold">
                    Guest Count <span className="text-[#E88D83]">*</span>
                  </label>
                  <span className="text-xs font-mono font-bold text-[#321D35]">
                    {formData.guestCount} {formData.guestCount === 1 ? 'Guest' : 'Guests'}
                  </span>
                </div>

                {/* Preset quick buttons */}
                <div className="flex items-center gap-2 mb-3">
                  {[30, 75, 120, 250, 500].map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => updateField('guestCount', count)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        formData.guestCount === count
                          ? 'bg-[#321D35] text-[#FAF7F2]'
                          : 'bg-[#FAF7F2] text-[#321D35]/70 border border-[#321D35]/15 hover:border-[#321D35]/40'
                      }`}
                    >
                      {count}
                    </button>
                  ))}
                </div>

                <input
                  id="guest-count"
                  type="number"
                  min="1"
                  max="50000"
                  value={formData.guestCount}
                  onChange={(e) => updateField('guestCount', parseInt(e.target.value) || 0)}
                  onBlur={() => markTouched('guestCount')}
                  className="w-full px-4 py-3 rounded-xl border border-[#321D35]/20 focus:border-[#321D35] bg-[#FAF7F2]/50 text-sm focus:outline-none"
                />
                {errors.guestCount && touched.guestCount && (
                  <p className="text-xs text-[#CF695E] flex items-center gap-1.5 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.guestCount}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Financial Budget & Aesthetic */}
        {step === 3 && (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#321D35]">
                Financial Blueprint & Signature Aesthetic
              </h2>
              <p className="text-sm text-[#28262B]/75 font-light mt-1">
                Establish the financial parameters and choose a design aesthetic that resonates with your vision.
              </p>
            </div>

            {/* Currency & Total Budget */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-end">
              {/* Currency Selector */}
              <div className="sm:col-span-4">
                <label className="block text-xs font-mono uppercase tracking-wider text-[#321D35] font-semibold mb-1.5">
                  Currency <span className="text-[#E88D83]">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {currencies.map((curr) => (
                    <button
                      key={curr.code}
                      type="button"
                      onClick={() => {
                        updateField('currency', curr.code);
                        // If budget is still default, adjust sensibly
                        if (
                          (formData.currency === 'USD' && formData.totalBudget === 25000) ||
                          (formData.currency === 'INR' && formData.totalBudget === 1500000) ||
                          (formData.currency === 'EUR' && formData.totalBudget === 25000)
                        ) {
                          updateField('totalBudget', curr.defaultBudget);
                        }
                      }}
                      className={`py-3 rounded-xl border text-xs font-mono font-bold flex flex-col items-center justify-center transition-all ${
                        formData.currency === curr.code
                          ? 'border-[#321D35] bg-[#321D35] text-[#FAF7F2] shadow-sm'
                          : 'border-[#321D35]/20 bg-[#FAF7F2]/50 text-[#321D35] hover:border-[#321D35]/50'
                      }`}
                    >
                      <span className="text-sm">{curr.symbol}</span>
                      <span className="text-[10px]">{curr.code}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Total Budget Input */}
              <div className="sm:col-span-8">
                <label htmlFor="total-budget" className="block text-xs font-mono uppercase tracking-wider text-[#321D35] font-semibold mb-1.5">
                  Total Budget Allocation ({formData.currency}) <span className="text-[#E88D83]">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-serif text-base text-[#321D35]/50 font-bold">
                    {formData.currency === 'INR' ? '₹' : formData.currency === 'EUR' ? '€' : '$'}
                  </span>
                  <input
                    id="total-budget"
                    type="number"
                    step="100"
                    min="100"
                    value={formData.totalBudget}
                    onChange={(e) => updateField('totalBudget', parseFloat(e.target.value) || 0)}
                    onBlur={() => markTouched('totalBudget')}
                    className={`w-full pl-9 pr-4 py-3 rounded-xl border text-base font-semibold text-[#321D35] focus:outline-none transition-colors ${
                      errors.totalBudget && touched.totalBudget
                        ? 'border-[#CF695E] bg-[#CF695E]/5'
                        : 'border-[#321D35]/20 focus:border-[#321D35] bg-[#FAF7F2]/50'
                    }`}
                  />
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-[11px] text-[#28262B]/60">
                    Formatted: {formatCurrency(formData.totalBudget, formData.currency)}
                  </span>
                  {formData.guestCount > 0 && formData.totalBudget > 0 && (
                    <span className="text-[11px] text-[#321D35]/70 font-mono">
                      ~{formatCurrency(formData.totalBudget / formData.guestCount, formData.currency)} / guest
                    </span>
                  )}
                </div>
                {errors.totalBudget && touched.totalBudget && (
                  <p className="text-xs text-[#CF695E] flex items-center gap-1.5 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.totalBudget}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Aesthetic Selector */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#321D35] font-semibold mb-3">
                Signature Aesthetic Expression <span className="text-[#E88D83]">*</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {aesthetics.map((aest) => {
                  const isSelected = formData.aesthetic === aest.id;
                  return (
                    <button
                      key={aest.id}
                      type="button"
                      onClick={() => updateField('aesthetic', aest.id)}
                      className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                        isSelected
                          ? 'border-[#321D35] bg-[#FAF7F2] ring-2 ring-[#321D35]/15 shadow-sm'
                          : 'border-[#321D35]/15 hover:border-[#321D35]/35 bg-white'
                      }`}
                    >
                      <div>
                        {/* Swatch previews */}
                        <div className="flex gap-1.5 mb-3">
                          {aest.colors.map((c, idx) => (
                            <span
                              key={idx}
                              className="w-5 h-5 rounded-full shadow-inner border border-black/10"
                              style={{ backgroundColor: c }}
                            />
                          ))}
                        </div>

                        <div className="flex items-center justify-between">
                          <h4 className="font-serif font-bold text-base text-[#321D35]">{aest.title}</h4>
                          {isSelected && <Check className="w-4 h-4 text-[#E88D83]" />}
                        </div>
                        <p className="text-xs text-[#28262B]/70 font-light mt-1 leading-relaxed">
                          {aest.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Nuances & Review */}
        {step === 4 && (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#321D35]">
                Special Considerations & Final Synthesis
              </h2>
              <p className="text-sm text-[#28262B]/75 font-light mt-1">
                Incorporate dietary requirements and personal wishes before our engine compiles the blueprint.
              </p>
            </div>

            <div className="space-y-5">
              {/* Dietary & Accessibility */}
              <div>
                <label htmlFor="dietary-notes" className="block text-xs font-mono uppercase tracking-wider text-[#321D35] font-semibold mb-1.5">
                  Dietary, Accessibility & Venue Nuances (Optional)
                </label>
                <textarea
                  id="dietary-notes"
                  rows={2}
                  placeholder="e.g. 10 Vegetarian, 3 Celiac guests; wheelchair access required for grandfather; outdoor lawn sound curfew."
                  value={formData.dietaryRequirements}
                  onChange={(e) => updateField('dietaryRequirements', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#321D35]/20 focus:border-[#321D35] bg-[#FAF7F2]/50 text-sm focus:outline-none resize-none"
                />
              </div>

              {/* Special Notes & Dreams */}
              <div>
                <label htmlFor="event-notes" className="block text-xs font-mono uppercase tracking-wider text-[#321D35] font-semibold mb-1.5">
                  Personal Vision & Cherished Elements (Optional)
                </label>
                <textarea
                  id="event-notes"
                  rows={3}
                  placeholder="e.g. We met during a study abroad in Florence and want an Italian sunset theme with live jazz, olive sprigs, and lemon sorbet."
                  value={formData.notes}
                  onChange={(e) => updateField('notes', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#321D35]/20 focus:border-[#321D35] bg-[#FAF7F2]/50 text-sm focus:outline-none resize-none"
                />
              </div>
            </div>

            {/* Executive Synthesis Summary Card */}
            <div className="p-6 rounded-2xl bg-[#FAF7F2] editorial-border space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#321D35] flex items-center justify-between">
                <span>Executive Synthesis Dossier</span>
                <span className="text-xs font-mono text-[#E88D83] font-normal uppercase">Ready to Compile</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-[#321D35]/60 font-mono uppercase text-[10px] block">Celebration</span>
                  <p className="font-bold text-[#321D35] capitalize">{formData.eventType}</p>
                  <p className="text-[11px] text-[#28262B]/75 truncate">{formData.title || 'Untitled'}</p>
                </div>
                <div>
                  <span className="text-[#321D35]/60 font-mono uppercase text-[10px] block">When & Where</span>
                  <p className="font-bold text-[#321D35]">{formData.date || 'TBD'}</p>
                  <p className="text-[11px] text-[#28262B]/75 truncate">{formData.location || 'TBD'}</p>
                </div>
                <div>
                  <span className="text-[#321D35]/60 font-mono uppercase text-[10px] block">Scale & Budget</span>
                  <p className="font-bold text-[#321D35]">{formatCurrency(formData.totalBudget, formData.currency)}</p>
                  <p className="text-[11px] text-[#28262B]/75">{formData.guestCount} Guests</p>
                </div>
                <div>
                  <span className="text-[#321D35]/60 font-mono uppercase text-[10px] block">Aesthetic</span>
                  <p className="font-bold text-[#321D35] capitalize">{formData.aesthetic}</p>
                  <p className="text-[11px] text-[#28262B]/75">Tailored Palettes</p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Studio Controls / Buttons */}
        <div className="mt-10 pt-6 border-t border-[#321D35]/10 flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrev}
            className="px-5 py-3 rounded-xl border border-[#321D35]/20 hover:border-[#321D35] text-[#321D35] text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{step === 1 ? 'Cancel' : 'Previous Step'}</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="px-8 py-3.5 rounded-full bg-[#321D35] hover:bg-[#4A2B4E] text-[#FAF7F2] text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all shadow-md hover:shadow-lg flex items-center gap-2"
          >
            {step < totalSteps ? (
              <>
                <span>Continue</span>
                <ArrowRight className="w-4 h-4 text-[#D8BD91]" />
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#D8BD91]" />
                <span>Generate Event Blueprint</span>
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
};
