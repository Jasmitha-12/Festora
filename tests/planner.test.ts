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
