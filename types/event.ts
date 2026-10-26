/**
 * Domain types and models for the Festora Celebration Architecture platform.
 *
 * @module event
 */

/**
 * Supported celebration modalities.
 */
export type EventType =
  | 'wedding'
  | 'birthday'
  | 'college'
  | 'corporate'
  | 'party'
  | 'concert'
  | 'community'
  | 'custom';

/**
 * Curated aesthetic archetypes providing consistent atmospheric and color schemes.
 */
export type Aesthetic =
  | 'elegant'
  | 'modern'
  | 'garden'
  | 'minimal'
  | 'traditional'
  | 'playful';

/**
 * Supported currency ISO codes.
 */
export type Currency = 'INR' | 'USD' | 'EUR' | 'GBP';

/**
 * Environmental venue setting options.
 */
export type EventSetting = 'indoor' | 'outdoor' | 'hybrid';

/**
 * Raw input payload submitted by user through EventCreationStudio.
 */
export interface EventFormData {
  eventType: EventType;
  title: string;
  date: string;
  location: string;
  guestCount: number;
  totalBudget: number;
  currency: Currency;
  aesthetic: Aesthetic;
  colorPalette?: string;
  setting?: EventSetting;
  atmosphere?: string;
  dietaryRequirements?: string;
  notes?: string;
  customBudgetCategories?: { name: string; allocated: number }[];
  isSample?: boolean;
}

/**
 * An individual budget line item within the calculated financial plan.
 */
export interface BudgetCategoryItem {
  id: string;
  name: string;
  allocated: number; // In standard major currency units
  recommendedPercentage: number;
  percentage: number;
  description: string;
  isCustom?: boolean;
}

/**
 * Aggregate financial allocation breakdown.
 */
export interface BudgetAllocation {
  totalBudget: number;
  currency: Currency;
  categories: BudgetCategoryItem[];
  totalAllocated: number;
  remaining: number;
  isOverBudget: boolean;
  overspendAmount: number;
}

/**
 * Chronological chapter in the day-of run sheet.
 */
export interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  description: string;
  phase: string;
}

/**
 * Vendor procurement specification and interview guide.
 */
export interface VendorItem {
  id: string;
  category: string;
  role: string;
  priority: 'essential' | 'recommended' | 'optional';
  deliverables: string[];
  questionsToAsk: string[];
  suggestedLeadTime: string;
  status: 'to_hire' | 'shortlisted' | 'booked';
}

/**
 * Preparation milestone in the phased event planning countdown.
 */
export interface TaskMilestone {
  id: string;
  phase: string;
  timeframe: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  category: string;
  isCustom?: boolean;
}

/**
 * Editorial color swatch definition with specific design role.
 */
export interface ColorSwatch {
  name: string;
  hex: string;
  role: string;
  description: string;
}

/**
 * Bespoke creative installation idea generated for the celebration.
 */
export interface PersonalizedIdea {
  title: string;
  category: string;
  description: string;
  whyItWorks: string;
}

/**
 * The complete architectural celebration plan.
 */
export interface EventBlueprint {
  eventId: string;
  conceptTitle: string;
  tagline: string;
  narrative: string;
  colorPalette: ColorSwatch[];
  decorHighlights: string[];
  atmosphereNotes: string;
  personalizedIdeas: PersonalizedIdea[];
  schedule: ScheduleItem[];
  budget: BudgetAllocation;
  vendors: VendorItem[];
  timeline: TaskMilestone[];
  generatedAt: string;
  engineType: 'deterministic-rules' | 'ai-model';
}

/**
 * Fully persisted celebration instance with metadata and timestamps.
 */
export interface SavedEvent extends EventFormData {
  id: string;
  blueprint: EventBlueprint;
  createdAt: string;
  updatedAt: string;
}
