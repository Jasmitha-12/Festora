import { NextRequest, NextResponse } from 'next/server';
import { PlanRequestSchema } from '@/lib/ai/schema';
import { callGeminiForBlueprint } from '@/lib/ai/geminiClient';
import { generateEventBlueprint } from '@/lib/planner/engine';
import { recalculateBudget, generateRecommendedBudget } from '@/lib/budget/calculator';
import type { EventBlueprint } from '@/types/event';

// Simple in-memory sliding rate limiter per IP address
interface RateLimitRecord {
  count: number;
  resetAt: number;
}
const rateLimitMap = new Map<string, RateLimitRecord>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 12; // 12 plan generations per minute per IP

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }

  record.count += 1;
  return false;
}

export async function POST(req: NextRequest) {
  // 1. IP rate limiting
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('x-real-ip') ||
    '127.0.0.1';

  if (isRateLimited(ip)) {
    return NextResponse.json(
      {
        success: false,
        error: 'Too many planning requests. Please pause a moment before generating another plan.',
        engineType: 'none',
      },
      {
        status: 429,
        headers: { 'Retry-After': '60' },
      }
    );
  }

  // 2. Request body parsing & size guard
  let bodyJson: unknown;
  try {
    const rawBody = await req.text();
    if (rawBody.length > 50000) {
      // 50KB request size limit
      return NextResponse.json(
        {
          success: false,
          error: 'Request payload exceeds maximum allowed size.',
          engineType: 'none',
        },
        { status: 413 }
      );
    }
    bodyJson = JSON.parse(rawBody);
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: 'Malformed JSON payload.',
        engineType: 'none',
      },
      { status: 400 }
    );
  }

  // 3. Schema validation
  const validation = PlanRequestSchema.safeParse(bodyJson);
  if (!validation.success) {
    const firstErrors = validation.error.issues
      .map((i) => `${i.path.join('.')}: ${i.message}`)
      .join(', ');
    return NextResponse.json(
      {
        success: false,
        error: `Invalid event data: ${firstErrors}`,
        engineType: 'none',
      },
      { status: 400 }
    );
  }

  const formData = validation.data;
  const eventId = `festora-event-${Date.now()}`;

  // 4. Check API Key
  const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0);

  if (!hasGeminiKey) {
    // Graceful deterministic fallback
    const fallbackBlueprint = generateEventBlueprint(formData, eventId);
    return NextResponse.json(
      {
        success: true,
        blueprint: fallbackBlueprint,
        engineType: 'deterministic-rules',
        notice: 'AI key not configured; blueprint generated using deterministic rules engine.',
      },
      { status: 200 }
    );
  }

  // 5. Invoke Gemini API
  const geminiResult = await callGeminiForBlueprint(formData);

  if (!geminiResult.success || !geminiResult.data) {
    // Graceful fallback to deterministic planner if Gemini fails / times out
    const fallbackBlueprint = generateEventBlueprint(formData, eventId);
    return NextResponse.json(
      {
        success: true,
        blueprint: fallbackBlueprint,
        engineType: 'deterministic-rules',
        notice: `AI service unavailable (${geminiResult.error || 'unknown issue'}). Blueprint generated using deterministic rules engine.`,
      },
      { status: 200 }
    );
  }

  // 6. Assemble AI Blueprint with mathematically verified budget
  const aiData = geminiResult.data;

  // Derive budget strictly through deterministic calculator
  let verifiedBudget = generateRecommendedBudget(formData.eventType, formData.totalBudget, formData.currency);
  if (formData.customBudgetCategories && formData.customBudgetCategories.length > 0) {
    const updatedCats = verifiedBudget.categories.map((cat) => {
      const customMatch = formData.customBudgetCategories?.find(
        (c) =>
          c.name.toLowerCase().includes(cat.name.toLowerCase().split(' ')[0]) ||
          cat.name.toLowerCase().includes(c.name.toLowerCase().split(' ')[0])
      );
      if (customMatch) {
        return {
          ...cat,
          allocated: customMatch.allocated,
        };
      }
      return cat;
    });
    verifiedBudget = recalculateBudget(updatedCats, formData.totalBudget, formData.currency);
  }

  const aiBlueprint: EventBlueprint = {
    eventId,
    conceptTitle: aiData.conceptTitle,
    tagline: aiData.tagline,
    narrative: aiData.narrative,
    colorPalette: aiData.colorPalette,
    decorHighlights: aiData.decorHighlights,
    atmosphereNotes: aiData.atmosphereNotes,
    personalizedIdeas: aiData.personalizedIdeas,
    schedule: aiData.schedule,
    budget: verifiedBudget,
    vendors: aiData.vendors,
    timeline: aiData.timeline,
    generatedAt: new Date().toISOString(),
    engineType: 'ai-model',
  };

  return NextResponse.json(
    {
      success: true,
      blueprint: aiBlueprint,
      engineType: 'ai-model',
      modelUsed: geminiResult.modelUsed,
      costSavingSuggestions: aiData.costSavingSuggestions,
    },
    { status: 200 }
  );
}
