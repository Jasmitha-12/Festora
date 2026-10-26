/**
 * Zod validation schemas for Gemini structured output and API requests.
 *
 * @module schema
 */

import { z } from 'zod';
import type { EventType, Aesthetic, Currency, EventSetting } from '@/types/event';

// Supported Enum values
export const EVENT_TYPES: [EventType, ...EventType[]] = [
  'wedding',
  'birthday',
  'college',
  'corporate',
  'party',
  'concert',
  'community',
  'custom',
];

export const AESTHETICS: [Aesthetic, ...Aesthetic[]] = [
  'elegant',
  'modern',
  'garden',
  'minimal',
  'traditional',
  'playful',
];

export const CURRENCIES: [Currency, ...Currency[]] = ['INR', 'USD', 'EUR', 'GBP'];

export const EVENT_SETTINGS: [EventSetting, ...EventSetting[]] = ['indoor', 'outdoor', 'hybrid'];

// Request Payload Schema for /api/plan
export const PlanRequestSchema = z.object({
  title: z.string().trim().min(3).max(100),
  eventType: z.enum(EVENT_TYPES),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Valid ISO date string is required',
  }),
  location: z.string().trim().min(2).max(120),
  guestCount: z.coerce.number().int().min(1).max(50000),
  totalBudget: z.coerce.number().positive(),
  currency: z.enum(CURRENCIES),
  aesthetic: z.enum(AESTHETICS),
  colorPalette: z.string().max(80).optional(),
  setting: z.enum(EVENT_SETTINGS).optional(),
  atmosphere: z.string().max(500).optional(),
  dietaryRequirements: z.string().max(500).optional(),
  notes: z.string().max(1000).optional(),
  customBudgetCategories: z
    .array(
      z.object({
        name: z.string().min(1).max(80),
        allocated: z.number().nonnegative(),
      })
    )
    .max(20)
    .optional(),
});

export type PlanRequestInput = z.infer<typeof PlanRequestSchema>;

// Strict Schema for Gemini JSON Output
const HexColorSchema = z.string().regex(/^#[0-9A-Fa-f]{6}$/, {
  message: 'Color must be a valid 6-character hex code starting with #',
});

export const AiColorSwatchSchema = z.object({
  name: z.string().min(1).max(50),
  hex: HexColorSchema,
  role: z.string().min(1).max(50),
  description: z.string().min(1).max(200),
});

export const AiPersonalizedIdeaSchema = z.object({
  title: z.string().min(1).max(80),
  category: z.string().min(1).max(50),
  description: z.string().min(1).max(300),
  whyItWorks: z.string().min(1).max(250),
});

export const AiScheduleItemSchema = z.object({
  id: z.string().min(1).max(30),
  time: z.string().min(1).max(30),
  title: z.string().min(1).max(80),
  description: z.string().min(1).max(300),
  phase: z.string().min(1).max(50),
});

export const AiVendorItemSchema = z.object({
  id: z.string().min(1).max(30),
  category: z.string().min(1).max(50),
  role: z.string().min(1).max(80),
  priority: z.enum(['essential', 'recommended', 'optional']),
  deliverables: z.array(z.string().min(1).max(200)).min(1).max(8),
  questionsToAsk: z.array(z.string().min(1).max(200)).min(1).max(6),
  suggestedLeadTime: z.string().min(1).max(60),
  status: z.enum(['to_hire', 'shortlisted', 'booked']).default('to_hire'),
});

export const AiTaskMilestoneSchema = z.object({
  id: z.string().min(1).max(30),
  phase: z.string().min(1).max(50),
  timeframe: z.string().min(1).max(60),
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(300),
  dueDate: z.string().min(1).max(30),
  completed: z.boolean().default(false),
  category: z.string().min(1).max(50),
});

export const AiCategoryAllocationRecommendationSchema = z.object({
  name: z.string().min(1).max(60),
  recommendedPercentage: z.number().min(0).max(100),
  description: z.string().min(1).max(250),
});

export const AiCostSavingTipSchema = z.object({
  category: z.string().min(1).max(50),
  tip: z.string().min(1).max(300),
  estimatedImpact: z.string().min(1).max(100),
});

// Full structured response from AI
export const GeminiPlanOutputSchema = z.object({
  conceptTitle: z.string().min(3).max(100),
  tagline: z.string().min(5).max(150),
  narrative: z.string().min(30).max(1200),
  atmosphereNotes: z.string().min(10).max(400),
  colorPalette: z.array(AiColorSwatchSchema).min(3).max(6),
  decorHighlights: z.array(z.string().min(5).max(250)).min(3).max(8),
  personalizedIdeas: z.array(AiPersonalizedIdeaSchema).min(2).max(5),
  schedule: z.array(AiScheduleItemSchema).min(3).max(10),
  vendors: z.array(AiVendorItemSchema).min(3).max(10),
  timeline: z.array(AiTaskMilestoneSchema).min(4).max(15),
  costSavingSuggestions: z.array(AiCostSavingTipSchema).min(1).max(5).optional(),
});

export type GeminiPlanOutput = z.infer<typeof GeminiPlanOutputSchema>;
