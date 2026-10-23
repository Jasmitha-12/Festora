import type { PlanRequestInput } from './schema';

/**
 * Builds the prompt passed to Gemini for generating a celebration plan.
 */
export function buildGeminiPrompt(input: PlanRequestInput): string {
  const budgetFormatted = `${input.currency} ${input.totalBudget.toLocaleString()}`;
  const customAllocations = input.customBudgetCategories && input.customBudgetCategories.length > 0
    ? input.customBudgetCategories.map((c) => `- ${c.name}: ${input.currency} ${c.allocated.toLocaleString()}`).join('\n')
    : 'Default recommended proportions';

  return `You are FESTORA's lead celebration architect and luxury event director.
Generate an extraordinary, highly personalized celebration blueprint tailored to the following specifications:

=== CELEBRATION SPECIFICATIONS ===
- Celebration Name: "${input.title}"
- Event Category: ${input.eventType}
- Target Date: ${input.date}
- Location & Venue Type: ${input.location}
- Expected Guest Count: ${input.guestCount} guests
- Total Budget: ${budgetFormatted}
- Selected Aesthetic Archetype: ${input.aesthetic}
- Preferred Color Harmony: ${input.colorPalette || 'Curate bespoke harmony matching the aesthetic'}
- Venue Setting: ${input.setting || 'hybrid / indoor-outdoor'}
- Desired Atmosphere: ${input.atmosphere || 'Elevated, captivating, warm, and memorable'}
- Dietary / Culinary Preferences: ${input.dietaryRequirements || 'Standard curated culinary selection'}
- Personal Vision & Special Directives: ${input.notes || 'None provided; design with exceptional creativity.'}

=== EXISTING BUDGET CATEGORIES ===
${customAllocations}

=== ARCHITECTURAL REQUIREMENTS ===
1. Concept Title: A distinctive, evocative, non-generic title (e.g. "Velvet & Vows: Midnight Symphony", "The Atelier Union", "Golden Solstice").
2. Tagline: A poetic, cinematic subtitle (under 25 words).
3. Narrative: A 2 to 3 paragraph editorial narrative explaining how the celebration flows from arrival to departure, explicitly referencing ${input.location}, the guest scale (${input.guestCount}), and the personalized notes.
4. Atmosphere Directives: Precise lighting Kelvin temperature (e.g. 2700K golden spectrum), acoustic zoning, and scent/sensory touches.
5. Curated Color Palette: Exactly 4 distinct color swatches. Each MUST have a valid 6-character hex code starting with # (e.g. #321D35, #D4AF37, #FAF7F2, #E88D83), a descriptive editorial name, its design role (e.g., 'Primary Anchor', 'Lustrous Accent', 'Base Canvas', 'Botanical Accent'), and styling guidance.
6. Decor Highlights: 4 to 6 tactile, specific styling and floral directives.
7. Personalized Celebration Ideas: Exactly 3 bespoke ideas (Title, Category, Description, and "Why It Works" rationale).
8. Day-of Run Sheet: 5 to 7 chronological phases from arrival to grand send-off.
9. Vendor Team: 4 to 6 essential vendor briefs with prioritized categories, key deliverables, and critical questions to ask each vendor.
10. Preparation Milestones: 5 to 8 chronological milestones formatted with dates relative to ${input.date}.
11. Cost-Saving Suggestions: 2 to 3 practical ways to maximize impact without compromising luxury.

Respond ONLY with valid, unescaped JSON matching the exact schema specified. Do not include markdown code fences or conversational text.`;
}

/**
 * Returns the Gemini response schema definition for structured JSON generation.
 */
export function getGeminiJsonSchema(): Record<string, unknown> {
  return {
    type: 'OBJECT',
    properties: {
      conceptTitle: { type: 'STRING' },
      tagline: { type: 'STRING' },
      narrative: { type: 'STRING' },
      atmosphereNotes: { type: 'STRING' },
      colorPalette: {
        type: 'ARRAY',
        items: {
          type: 'OBJECT',
          properties: {
            name: { type: 'STRING' },
            hex: { type: 'STRING' },
            role: { type: 'STRING' },
            description: { type: 'STRING' },
          },
          required: ['name', 'hex', 'role', 'description'],
        },
      },
      decorHighlights: {
        type: 'ARRAY',
        items: { type: 'STRING' },
      },
      personalizedIdeas: {
        type: 'ARRAY',
        items: {
          type: 'OBJECT',
          properties: {
            title: { type: 'STRING' },
            category: { type: 'STRING' },
            description: { type: 'STRING' },
            whyItWorks: { type: 'STRING' },
          },
          required: ['title', 'category', 'description', 'whyItWorks'],
        },
      },
      schedule: {
        type: 'ARRAY',
        items: {
          type: 'OBJECT',
          properties: {
            id: { type: 'STRING' },
            time: { type: 'STRING' },
            title: { type: 'STRING' },
            description: { type: 'STRING' },
            phase: { type: 'STRING' },
          },
          required: ['id', 'time', 'title', 'description', 'phase'],
        },
      },
      vendors: {
        type: 'ARRAY',
        items: {
          type: 'OBJECT',
          properties: {
            id: { type: 'STRING' },
            category: { type: 'STRING' },
            role: { type: 'STRING' },
            priority: { type: 'STRING', enum: ['essential', 'recommended', 'optional'] },
            deliverables: { type: 'ARRAY', items: { type: 'STRING' } },
            questionsToAsk: { type: 'ARRAY', items: { type: 'STRING' } },
            suggestedLeadTime: { type: 'STRING' },
            status: { type: 'STRING', enum: ['to_hire', 'shortlisted', 'booked'] },
          },
          required: ['id', 'category', 'role', 'priority', 'deliverables', 'questionsToAsk', 'suggestedLeadTime'],
        },
      },
      timeline: {
        type: 'ARRAY',
        items: {
          type: 'OBJECT',
          properties: {
            id: { type: 'STRING' },
            phase: { type: 'STRING' },
            timeframe: { type: 'STRING' },
            title: { type: 'STRING' },
            description: { type: 'STRING' },
            dueDate: { type: 'STRING' },
            completed: { type: 'BOOLEAN' },
            category: { type: 'STRING' },
          },
          required: ['id', 'phase', 'timeframe', 'title', 'description', 'dueDate', 'category'],
        },
      },
      costSavingSuggestions: {
        type: 'ARRAY',
        items: {
          type: 'OBJECT',
          properties: {
            category: { type: 'STRING' },
            tip: { type: 'STRING' },
            estimatedImpact: { type: 'STRING' },
          },
          required: ['category', 'tip', 'estimatedImpact'],
        },
      },
    },
    required: [
      'conceptTitle',
      'tagline',
      'narrative',
      'atmosphereNotes',
      'colorPalette',
      'decorHighlights',
      'personalizedIdeas',
      'schedule',
      'vendors',
      'timeline',
    ],
  };
}
