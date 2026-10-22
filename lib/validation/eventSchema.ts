import type { EventFormData, EventType, Aesthetic, Currency } from '@/types/event';

export interface ValidationErrors {
  eventType?: string;
  title?: string;
  date?: string;
  location?: string;
  guestCount?: string;
  totalBudget?: string;
  currency?: string;
  aesthetic?: string;
  dietaryRequirements?: string;
  notes?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationErrors;
}

const VALID_EVENT_TYPES: EventType[] = ['wedding', 'birthday', 'community'];
const VALID_AESTHETICS: Aesthetic[] = [
  'elegant',
  'modern',
  'garden',
  'minimal',
  'traditional',
  'playful',
];
const VALID_CURRENCIES: Currency[] = ['INR', 'USD', 'EUR'];

export function validateEventBasics(data: Partial<EventFormData>): ValidationResult {
  const errors: ValidationErrors = {};

  // Event Type
  if (!data.eventType || !VALID_EVENT_TYPES.includes(data.eventType)) {
    errors.eventType = 'Please select a celebration category (Wedding, Birthday, or Community).';
  }

  // Title
  const trimmedTitle = data.title?.trim() || '';
  if (!trimmedTitle) {
    errors.title = 'Event title is required.';
  } else if (trimmedTitle.length < 3) {
    errors.title = 'Title must be at least 3 characters long.';
  } else if (trimmedTitle.length > 100) {
    errors.title = 'Title must be 100 characters or less.';
  }

  // Date
  if (!data.date) {
    errors.date = 'Event date is required.';
  } else {
    const selectedDate = new Date(data.date);
    if (isNaN(selectedDate.getTime())) {
      errors.date = 'Please enter a valid calendar date.';
    } else {
      // Must not be in the deep past (allowing today)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        errors.date = 'Event date cannot be in the past.';
      }
    }
  }

  // Location
  const trimmedLocation = data.location?.trim() || '';
  if (!trimmedLocation) {
    errors.location = 'City or location is required.';
  } else if (trimmedLocation.length < 2) {
    errors.location = 'Location must be at least 2 characters.';
  } else if (trimmedLocation.length > 120) {
    errors.location = 'Location must be 120 characters or less.';
  }

  // Guest Count
  if (data.guestCount === undefined || data.guestCount === null || isNaN(Number(data.guestCount))) {
    errors.guestCount = 'Guest count is required.';
  } else {
    const count = Number(data.guestCount);
    if (!Number.isInteger(count) || count < 1) {
      errors.guestCount = 'Guest count must be at least 1 person.';
    } else if (count > 50000) {
      errors.guestCount = 'Guest count cannot exceed 50,000.';
    }
  }

  // Currency
  if (!data.currency || !VALID_CURRENCIES.includes(data.currency)) {
    errors.currency = 'Please select a valid currency (INR, USD, or EUR).';
  }

  // Total Budget
  if (data.totalBudget === undefined || data.totalBudget === null || isNaN(Number(data.totalBudget))) {
    errors.totalBudget = 'Total budget is required.';
  } else {
    const budget = Number(data.totalBudget);
    if (budget <= 0) {
      errors.totalBudget = 'Budget must be greater than zero.';
    } else {
      const minBudget = data.currency === 'INR' ? 10000 : 500;
      if (budget < minBudget) {
        errors.totalBudget = `Minimum budget is ${data.currency === 'INR' ? '₹10,000' : data.currency === 'EUR' ? '€500' : '$500'} for practical planning.`;
      }
    }
  }

  // Aesthetic
  if (!data.aesthetic || !VALID_AESTHETICS.includes(data.aesthetic)) {
    errors.aesthetic = 'Please select an aesthetic style.';
  }

  // Dietary (optional length check)
  if (data.dietaryRequirements && data.dietaryRequirements.length > 500) {
    errors.dietaryRequirements = 'Dietary notes must be 500 characters or fewer.';
  }

  // Notes (optional length check)
  if (data.notes && data.notes.length > 1000) {
    errors.notes = 'General notes must be 1000 characters or fewer.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
