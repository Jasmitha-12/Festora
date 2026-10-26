import test from 'node:test';
import assert from 'node:assert/strict';
import {
  generateRecommendedBudget,
  recalculateBudget,
  applyCustomBudgetCategories,
  toMinorUnits,
  fromMinorUnits,
  formatCurrency,
} from '../lib/budget/calculator';

test('Budget Calculator - integer minor units conversions', () => {
  assert.equal(toMinorUnits(100.55), 10055);
  assert.equal(fromMinorUnits(10055), 100.55);
  assert.equal(toMinorUnits(0), 0);
  assert.equal(fromMinorUnits(0), 0);
});

test('Budget Calculator - generates recommended budget matching 100% total', () => {
  const total = 50000;
  const budget = generateRecommendedBudget('wedding', total, 'USD');

  assert.equal(budget.totalBudget, total);
  assert.equal(budget.currency, 'USD');
  assert.equal(budget.isOverBudget, false);
  assert.equal(budget.overspendAmount, 0);

  // Sum of category allocations must match total budget exactly
  const sumAllocated = budget.categories.reduce((acc, cat) => acc + cat.allocated, 0);
  assert.equal(Math.round(sumAllocated), total);
  assert.equal(Math.round(budget.totalAllocated), total);
});

test('Budget Calculator - detects budget overflow when user increases amounts', () => {
  const total = 20000;
  const budget = generateRecommendedBudget('birthday', total, 'EUR');

  // Manually inflate first category by 5,000
  const inflatedCategories = budget.categories.map((cat, idx) =>
    idx === 0 ? { ...cat, allocated: cat.allocated + 5000 } : cat
  );

  const recalculated = recalculateBudget(inflatedCategories, total, 'EUR');

  assert.equal(recalculated.isOverBudget, true);
  assert.equal(recalculated.overspendAmount, 5000);
  assert.equal(recalculated.remaining, -5000);
  assert.equal(recalculated.totalAllocated, 25000);
});

test('Budget Calculator - formats currency correctly', () => {
  const usdFormatted = formatCurrency(50000, 'USD');
  assert.match(usdFormatted, /\$50,000/);

  const inrFormatted = formatCurrency(100000, 'INR');
  assert.ok(inrFormatted.includes('1,00,000') || inrFormatted.includes('100,000'));

  const eurFormatted = formatCurrency(25000, 'EUR');
  assert.ok(eurFormatted.includes('25.000') || eurFormatted.includes('25,000'));

  const gbpFormatted = formatCurrency(15000, 'GBP');
  assert.ok(gbpFormatted.includes('15,000') || gbpFormatted.includes('£'));
});

test('Budget Calculator - recalculateBudget re-proportions category percentages when total budget changes', () => {
  const initialBudget = generateRecommendedBudget('wedding', 100000, 'USD');
  assert.equal(initialBudget.categories[0].percentage, 38);

  // When total budget is increased to 200,000 while allocations remain constant, category percentage is updated
  const updated = recalculateBudget(initialBudget.categories, 200000, 'USD');
  assert.equal(updated.totalBudget, 200000);
  assert.equal(updated.totalAllocated, 100000);
  assert.equal(updated.remaining, 100000);
  assert.equal(updated.isOverBudget, false);
  assert.equal(updated.categories[0].percentage, 19);
});

test('Budget Calculator - applyCustomBudgetCategories overrides matched categories and balances totals', () => {
  const initial = generateRecommendedBudget('wedding', 100000, 'USD');
  const customCats = [
    { name: 'Venue & Reception', allocated: 45000 },
    { name: 'Catering & Bar', allocated: 30000 },
  ];

  const customized = applyCustomBudgetCategories(initial, customCats);
  assert.equal(customized.totalBudget, 100000);
  assert.equal(customized.categories.find((c) => c.name.includes('Venue'))?.allocated, 45000);
  assert.equal(customized.categories.find((c) => c.name.includes('Catering'))?.allocated, 30000);
});

test('Budget Calculator - applyCustomBudgetCategories handles undefined, empty, and negative allocations', () => {
  const initial = generateRecommendedBudget('wedding', 50000, 'EUR');
  
  // Undefined or empty input returns base budget unchanged
  assert.equal(applyCustomBudgetCategories(initial, undefined), initial);
  assert.equal(applyCustomBudgetCategories(initial, []), initial);

  // Negative amounts are clamped to zero and balance is recalculated
  const negativeAdjusted = applyCustomBudgetCategories(initial, [
    { name: 'Venue & Reception', allocated: -1000 },
  ]);
  const venueCat = negativeAdjusted.categories.find((c) => c.name.includes('Venue'));
  assert.equal(venueCat?.allocated, 0);
  assert.ok(negativeAdjusted.remaining > 0);
});


