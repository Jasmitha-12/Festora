import test from 'node:test';
import assert from 'node:assert/strict';
import { validateEventBasics } from '../lib/validation/eventSchema';

test('Validation - rejects empty or missing event data', () => {
  const result = validateEventBasics({});
  assert.equal(result.isValid, false);
  assert.ok(result.errors.eventType);
  assert.ok(result.errors.title);
  assert.ok(result.errors.date);
  assert.ok(result.errors.location);
  assert.ok(result.errors.guestCount);
  assert.ok(result.errors.totalBudget);
});

test('Validation - rejects dates in the past', () => {
  const pastDate = new Date();
  pastDate.setDate(pastDate.getDate() - 5);

  const result = validateEventBasics({
    eventType: 'wedding',
    title: 'Autumn Vows',
    date: pastDate.toISOString().split('T')[0],
    location: 'Paris',
    guestCount: 50,
    totalBudget: 30000,
    currency: 'EUR',
    aesthetic: 'elegant',
  });

  assert.equal(result.isValid, false);
  assert.equal(result.errors.date, 'Event date cannot be in the past.');
});

test('Validation - passes with complete valid data', () => {
  const futureDate = new Date();
  futureDate.setMonth(futureDate.getMonth() + 6);

  const result = validateEventBasics({
    eventType: 'birthday',
    title: 'Liam’s 30th Rooftop Soirée',
    date: futureDate.toISOString().split('T')[0],
    location: 'New York City',
    guestCount: 45,
    totalBudget: 12000,
    currency: 'USD',
    aesthetic: 'modern',
    dietaryRequirements: 'Vegetarian options',
    notes: 'Jazz playlist preferred',
  });

  assert.equal(result.isValid, true);
  assert.equal(Object.keys(result.errors).length, 0);
});
