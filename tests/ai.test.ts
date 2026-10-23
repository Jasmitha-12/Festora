import test from 'node:test';
import assert from 'node:assert/strict';
import { PlanRequestSchema, GeminiPlanOutputSchema } from '../lib/ai/schema';
import { buildGeminiPrompt, getGeminiJsonSchema } from '../lib/ai/geminiPrompt';
import { callGeminiForBlueprint } from '../lib/ai/geminiClient';
import type { PlanRequestInput } from '../lib/ai/schema';

const sampleValidInput: PlanRequestInput = {
  title: 'Isabella & Rafael Tuscan Wedding',
  eventType: 'wedding',
  date: '2027-06-18',
  location: 'Siena, Italy',
  guestCount: 140,
  totalBudget: 75000,
  currency: 'EUR',
  aesthetic: 'garden',
  colorPalette: 'Sage Garden & Blush Rose',
  setting: 'outdoor',
  atmosphere: 'Romantic, sun-dappled, and timeless',
  notes: 'Long rustic communal tables with olive branches',
};

test('AI Schema - Validates complete event plan request', () => {
  const result = PlanRequestSchema.safeParse(sampleValidInput);
  assert.equal(result.success, true);
});

test('AI Schema - Rejects invalid event type or budget', () => {
  const invalidResult = PlanRequestSchema.safeParse({
    ...sampleValidInput,
    eventType: 'space_launch',
    totalBudget: -500,
  });
  assert.equal(invalidResult.success, false);
});

test('AI Schema - Validates conforming Gemini structured output', () => {
  const mockAiOutput = {
    conceptTitle: 'Tuscan Sun: A Glasshouse Romance',
    tagline: 'Sun-dappled hills, heirloom olive groves, and vows whispered in gold',
    narrative: 'Designed specifically for Isabella and Rafael in Siena, this celebration gathers 140 cherished guests in an intimate setting.',
    atmosphereNotes: 'Warm golden 2700K lighting with acoustic guitar melodies during dinner.',
    colorPalette: [
      { name: 'Olive Sage', hex: '#4A6B4F', role: 'Primary Anchor', description: 'Earthy foliage grounding' },
      { name: 'Blush Rose', hex: '#E88D83', role: 'Floral Focal', description: 'Romantic petal accents' },
      { name: 'Warm Ivory', hex: '#FAF7F2', role: 'Base Canvas', description: 'Textured linen background' },
      { name: 'Gilded Brass', hex: '#D4AF37', role: 'Lustrous Accent', description: 'Warm metallic trim' },
    ],
    decorHighlights: [
      'Antique terracotta planters with wild rosemary and lavender',
      'Cascading Italian string lights over long rustic walnut tables',
      'Deckle-edge calligraphy stationery with olive wax seals',
    ],
    personalizedIdeas: [
      {
        title: 'Heirloom Olive Oil Favor Station',
        category: 'Sensory Favor',
        description: 'Bespoke bottled Tuscan olive oil pressed from local groves with personalized labels.',
        whyItWorks: 'Ties the celebration to the terroir and provides an enduring culinary memory.',
      },
      {
        title: 'Sunset Gelato & Prosecco Cart',
        category: 'Culinary Transition',
        description: 'Vintage Piaggio Ape cart serving artisanal blood orange gelato and sparkling wine.',
        whyItWorks: 'Invigorates guests between the ceremony and dinner seated courses.',
      },
    ],
    schedule: [
      { id: 'sch-1', time: '16:00', title: 'Guest Arrival & Welcome Spritz', description: 'Acoustic guitar in the courtyard', phase: 'Arrival' },
      { id: 'sch-2', time: '17:00', title: 'Cypress Grove Ceremony', description: 'Exchange of vows', phase: 'Ceremony' },
      { id: 'sch-3', time: '18:30', title: 'Al Fresco Banquet', description: 'Family style dining under festoon lights', phase: 'Dinner' },
    ],
    vendors: [
      {
        id: 'ven-1',
        category: 'Floral & Botanical',
        role: 'Master Floral Designer',
        priority: 'essential',
        deliverables: ['Bridal bouquets', 'Table runners', 'Pergola installation'],
        questionsToAsk: ['Are florals locally sourced in Tuscany?', 'Do you handle midnight strike?'],
        suggestedLeadTime: '4 to 6 months',
        status: 'to_hire',
      },
      {
        id: 'ven-2',
        category: 'Catering & Wine',
        role: 'Tuscan Estate Caterer',
        priority: 'essential',
        deliverables: ['Custom 4-course menu', 'Chianti wine pairings', 'Staffing'],
        questionsToAsk: ['Can dietary preferences be accommodated individually?'],
        suggestedLeadTime: '6 months',
        status: 'to_hire',
      },
      {
        id: 'ven-3',
        category: 'Photography & Cinema',
        role: 'Editorial Fine-Art Photographer',
        priority: 'essential',
        deliverables: ['10 hours coverage', 'Drone aerials', 'Online gallery'],
        questionsToAsk: ['Have you worked at this venue before?'],
        suggestedLeadTime: '6 to 9 months',
        status: 'to_hire',
      },
    ],
    timeline: [
      {
        id: 'mil-1',
        phase: 'Initial Vision',
        timeframe: '6 Months Out',
        title: 'Secure Tuscan Villa & Catering Permit',
        description: 'Lock in dates and deposit',
        dueDate: '2026-12-18',
        completed: false,
        category: 'Venue',
      },
      {
        id: 'mil-2',
        phase: 'Creative Direction',
        timeframe: '4 Months Out',
        title: 'Finalize Linen and Floral Mockups',
        description: 'Review table samples and colors',
        dueDate: '2027-02-18',
        completed: false,
        category: 'Design',
      },
      {
        id: 'mil-3',
        phase: 'Coordination',
        timeframe: '2 Months Out',
        title: 'Confirm Guest Transport & Room Blocks',
        description: 'Coordinate shuttles from Florence',
        dueDate: '2027-04-18',
        completed: false,
        category: 'Logistics',
      },
      {
        id: 'mil-4',
        phase: 'Final Countdown',
        timeframe: '2 Weeks Out',
        title: 'Final Headcount & Place Card Printing',
        description: 'Send counts to catering',
        dueDate: '2027-06-04',
        completed: false,
        category: 'Admin',
      },
    ],
  };

  const validation = GeminiPlanOutputSchema.safeParse(mockAiOutput);
  assert.equal(validation.success, true);
});

test('AI Schema - Rejects invalid HEX color code in AI output', () => {
  const invalidColors = {
    conceptTitle: 'Invalid Title',
    tagline: 'A nice tagline',
    narrative: 'Long enough narrative to pass the 30 characters length requirement easily.',
    atmosphereNotes: 'Long enough atmosphere notes for test.',
    colorPalette: [
      { name: 'Red', hex: 'red-not-hex', role: 'Main', description: 'Desc' }, // Invalid!
      { name: 'Blue', hex: '#0000FF', role: 'Accent', description: 'Desc' },
      { name: 'White', hex: '#FFFFFF', role: 'Base', description: 'Desc' },
    ],
    decorHighlights: ['Highlight 1', 'Highlight 2', 'Highlight 3'],
    personalizedIdeas: [
      { title: 'Idea 1', category: 'Cat', description: 'Desc', whyItWorks: 'Why' },
      { title: 'Idea 2', category: 'Cat', description: 'Desc', whyItWorks: 'Why' },
    ],
    schedule: [
      { id: '1', time: '10:00', title: 'Start', description: 'Desc', phase: 'Arrival' },
      { id: '2', time: '12:00', title: 'Lunch', description: 'Desc', phase: 'Food' },
      { id: '3', time: '14:00', title: 'End', description: 'Desc', phase: 'Departure' },
    ],
    vendors: [
      { id: '1', category: 'Catering', role: 'Chef', priority: 'essential', deliverables: ['Food'], questionsToAsk: ['Q1'], suggestedLeadTime: '1 month' },
      { id: '2', category: 'Music', role: 'DJ', priority: 'essential', deliverables: ['Sound'], questionsToAsk: ['Q1'], suggestedLeadTime: '1 month' },
      { id: '3', category: 'Photo', role: 'Photo', priority: 'essential', deliverables: ['Pictures'], questionsToAsk: ['Q1'], suggestedLeadTime: '1 month' },
    ],
    timeline: [
      { id: '1', phase: 'P1', timeframe: 'T1', title: 'M1', description: 'D1', dueDate: '2027-01-01', completed: false, category: 'C1' },
      { id: '2', phase: 'P2', timeframe: 'T2', title: 'M2', description: 'D2', dueDate: '2027-02-01', completed: false, category: 'C2' },
      { id: '3', phase: 'P3', timeframe: 'T3', title: 'M3', description: 'D3', dueDate: '2027-03-01', completed: false, category: 'C3' },
      { id: '4', phase: 'P4', timeframe: 'T4', title: 'M4', description: 'D4', dueDate: '2027-04-01', completed: false, category: 'C4' },
    ],
  };

  const validation = GeminiPlanOutputSchema.safeParse(invalidColors);
  assert.equal(validation.success, false);
});

test('AI Client - Returns error when GEMINI_API_KEY is missing', async () => {
  const originalKey = process.env.GEMINI_API_KEY;
  delete process.env.GEMINI_API_KEY;

  const result = await callGeminiForBlueprint(sampleValidInput, { apiKey: '' });
  assert.equal(result.success, false);
  assert.equal(result.statusCode, 401);
  assert.match(result.error || '', /GEMINI_API_KEY.*not configured/);

  if (originalKey) {
    process.env.GEMINI_API_KEY = originalKey;
  }
});

test('AI Client - Handles timeout gracefully via AbortController', async () => {
  const result = await callGeminiForBlueprint(sampleValidInput, {
    apiKey: 'dummy-test-key',
    timeoutMs: 1, // 1 millisecond will instantly abort
  });

  assert.equal(result.success, false);
  assert.ok(result.error?.includes('timed out') || result.statusCode === 504);
});

test('AI Prompt Builder - Constructs detailed prompt referencing user inputs', () => {
  const prompt = buildGeminiPrompt(sampleValidInput);
  assert.ok(prompt.includes('Isabella & Rafael Tuscan Wedding'));
  assert.ok(prompt.includes('Siena, Italy'));
  assert.ok(prompt.includes('140 guests'));
  assert.ok(prompt.includes('EUR 75,000'));
  assert.ok(prompt.includes('Sage Garden & Blush Rose'));
  assert.ok(prompt.includes('olive branches'));

  const jsonSchema = getGeminiJsonSchema();
  assert.equal(jsonSchema.type, 'OBJECT');
  assert.ok('conceptTitle' in (jsonSchema.properties as Record<string, unknown>));
  assert.ok('colorPalette' in (jsonSchema.properties as Record<string, unknown>));
});
