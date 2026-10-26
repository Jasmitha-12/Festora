import test from 'node:test';
import assert from 'node:assert/strict';
import { generateEventBlueprint } from '../lib/planner/engine';
import type { EventFormData } from '../types/event';

test('Planning Engine - Wedding receives distinctive wedding blueprint', () => {
  const weddingForm: EventFormData = {
    eventType: 'wedding',
    title: 'Elena & Lucas Nuptials',
    date: '2027-09-12',
    location: 'Florence, Italy',
    guestCount: 150,
    totalBudget: 85000,
    currency: 'EUR',
    aesthetic: 'elegant',
    notes: 'Candlelight evening ceremony',
  };

  const blueprint = generateEventBlueprint(weddingForm, 'test-wedding-1');

  assert.equal(blueprint.eventId, 'test-wedding-1');
  assert.equal(blueprint.engineType, 'deterministic-rules');
  assert.match(blueprint.conceptTitle, /Velvet & Vows/);
  assert.ok(blueprint.schedule.some((s) => s.title.includes('Ceremony')));
  assert.ok(blueprint.vendors.some((v) => v.category === 'Floral & Decor'));
  assert.ok(blueprint.timeline.length > 5);
});

test('Planning Engine - Birthday produces distinct party schedule and vendors', () => {
  const birthdayForm: EventFormData = {
    eventType: 'birthday',
    title: 'Zara’s 40th Jubilee',
    date: '2027-11-20',
    location: 'Mumbai, India',
    guestCount: 80,
    totalBudget: 500000,
    currency: 'INR',
    aesthetic: 'playful',
  };

  const blueprint = generateEventBlueprint(birthdayForm, 'test-birthday-1');

  assert.match(blueprint.conceptTitle, /Carnival of Curiosities/);
  assert.ok(blueprint.schedule.some((s) => s.title.includes('Artisan Cake Reveal')));
  assert.ok(blueprint.vendors.some((v) => v.category === 'Culinary & Cake'));
  // Ensure it didn't get wedding items like Bridal party
  assert.ok(!blueprint.schedule.some((s) => s.title.includes('Bridal Party')));
});

test('Planning Engine - Community Event generates civic permits and stage sound', () => {
  const communityForm: EventFormData = {
    eventType: 'community',
    title: 'Green Meadows Eco Festival',
    date: '2027-05-10',
    location: 'Austin, TX',
    guestCount: 1200,
    totalBudget: 35000,
    currency: 'USD',
    aesthetic: 'garden',
  };

  const blueprint = generateEventBlueprint(communityForm, 'test-community-1');

  assert.match(blueprint.conceptTitle, /Green Horizon Festival/);
  assert.ok(blueprint.vendors.some((v) => v.role.includes('Municipal Authority')));
  assert.ok(blueprint.schedule.some((s) => s.title.includes('Volunteer & Staff Briefing')));
});

test('Planning Engine - Corporate and College generate tailored schedules and budgets', () => {
  const corpForm: EventFormData = {
    eventType: 'corporate',
    title: 'Future Tech Summit 2027',
    date: '2027-10-15',
    location: 'Bangalore, India',
    guestCount: 300,
    totalBudget: 2500000,
    currency: 'INR',
    aesthetic: 'modern',
  };

  const corpBlueprint = generateEventBlueprint(corpForm, 'test-corp-1');
  assert.match(corpBlueprint.conceptTitle, /The Innovation Gala/);
  assert.ok(corpBlueprint.schedule.some((s) => s.title.includes('Keynote')));
  assert.ok(corpBlueprint.timeline.some((t) => t.category === 'Branding'));

  const collegeForm: EventFormData = {
    eventType: 'college',
    title: 'Spring Pulse Fest',
    date: '2027-04-20',
    location: 'IIT Campus',
    guestCount: 1500,
    totalBudget: 800000,
    currency: 'INR',
    aesthetic: 'playful',
  };

  const collegeBlueprint = generateEventBlueprint(collegeForm, 'test-college-1');
  assert.match(collegeBlueprint.conceptTitle, /Spring Carnival/);
  assert.ok(collegeBlueprint.schedule.some((s) => s.title.includes('Headliner')));
});

test('Planning Engine - preserves custom budget categories and personalized notes', () => {
  const customForm: EventFormData = {
    eventType: 'party',
    title: 'Neon Skyline Gala',
    date: '2027-08-15',
    location: 'Marina Bay, Singapore',
    guestCount: 75,
    totalBudget: 40000,
    currency: 'USD',
    aesthetic: 'modern',
    notes: 'Require vintage vinyl DJ booth and craft gin tasting station',
    customBudgetCategories: [
      { name: 'Venue & Lounge Space', allocated: 18000 },
      { name: 'Mixology, Bar & Catering', allocated: 14000 },
    ],
  };

  const blueprint = generateEventBlueprint(customForm, 'test-custom-notes-1');
  assert.equal(blueprint.eventId, 'test-custom-notes-1');

  // Verify custom budget allocations merged
  const venueCategory = blueprint.budget.categories.find((c) => c.name.includes('Venue'));
  assert.ok(venueCategory);
  assert.equal(venueCategory?.allocated, 18000);

  // Verify custom notes generated personalized idea
  assert.ok(blueprint.personalizedIdeas.some((idea) => idea.category === 'Personalized Touch'));
  assert.ok(blueprint.personalizedIdeas.some((idea) => idea.description.includes('vintage vinyl DJ booth')));
});

