import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateDaysUntil, formatDateSafe } from '../lib/utils/date';

test('Date Utils - calculateDaysUntil formats relative future dates', () => {
  const future = new Date();
  future.setDate(future.getDate() + 10);
  const futureStr = future.toISOString().split('T')[0];

  const result = calculateDaysUntil(futureStr);
  assert.ok(result.includes('days away'));
});

test('Date Utils - calculateDaysUntil detects today and passed dates', () => {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  assert.equal(calculateDaysUntil(todayStr), 'Today!');

  const past = new Date();
  past.setDate(past.getDate() - 5);
  const pastStr = past.toISOString().split('T')[0];
  assert.equal(calculateDaysUntil(pastStr), 'Passed');
});

test('Date Utils - handles invalid or empty inputs gracefully', () => {
  assert.equal(calculateDaysUntil(''), '');
  assert.equal(calculateDaysUntil('invalid-date'), 'invalid-date');
  assert.equal(formatDateSafe(''), '');
  assert.equal(formatDateSafe('2027-08-15T10:00:00.000Z'), '2027-08-15');
});
