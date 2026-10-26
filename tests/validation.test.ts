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

test('Validation - rejects out-of-bound guest count and below-minimum budget', () => {
  const futureDate = new Date();
  futureDate.setMonth(futureDate.getMonth() + 3);
  const dateStr = futureDate.toISOString().split('T')[0];

  // Zero guests and below-minimum INR budget
  const res1 = validateEventBasics({
    eventType: 'wedding',
    title: 'Grand Union',
    date: dateStr,
    location: 'Mumbai',
    guestCount: 0,
    totalBudget: 5000, // min is 10,000 for INR
    currency: 'INR',
    aesthetic: 'traditional',
  });
  assert.equal(res1.isValid, false);
  assert.ok(res1.errors.guestCount);
  assert.ok(res1.errors.totalBudget);

  // Invalid currency code
  const res2 = validateEventBasics({
    eventType: 'birthday',
    title: 'Party',
    date: dateStr,
    location: 'London',
    guestCount: 50,
    totalBudget: 5000,
    currency: 'AUD' as unknown as import('../types/event').Currency,
    aesthetic: 'playful',
  });
  assert.equal(res2.isValid, false);
  assert.ok(res2.errors.currency);
});
