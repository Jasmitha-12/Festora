export type EventType =
  | 'wedding'
  | 'birthday'
  | 'college'
  | 'corporate'
  | 'party'
  | 'concert'
  | 'community'
  | 'custom';

export type Aesthetic =
  | 'elegant'
  | 'modern'
  | 'garden'
  | 'minimal'
  | 'traditional'
  | 'playful';

export type Currency = 'INR' | 'USD' | 'EUR' | 'GBP';

export type EventSetting = 'indoor' | 'outdoor' | 'hybrid';

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

export interface BudgetCategoryItem {
  id: string;
  name: string;
  allocated: number; // In standard currency units
  recommendedPercentage: number;
  percentage: number;
  description: string;
  isCustom?: boolean;
}

export interface BudgetAllocation {
  totalBudget: number;
  currency: Currency;
  categories: BudgetCategoryItem[];
  totalAllocated: number;
  remaining: number;
  isOverBudget: boolean;
  overspendAmount: number;
}

export interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  description: string;
  phase: string;
}

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

export interface ColorSwatch {
  name: string;
  hex: string;
  role: string;
  description: string;
}

export interface PersonalizedIdea {
  title: string;
  category: string;
  description: string;
  whyItWorks: string;
}

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

export interface SavedEvent extends EventFormData {
  id: string;
  blueprint: EventBlueprint;
  createdAt: string;
  updatedAt: string;
}
