import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getSavedEvents,
  saveEvent,
  deleteEvent,
  createSampleCelebration,
} from '../lib/storage/persistence';

test('Persistence - generates fallback sample celebration in SSR/node environment', () => {
  const events = getSavedEvents();
  assert.ok(events.length >= 1);
  assert.ok(events[0].id);
  assert.equal(events[0].eventType, 'wedding');
});

test('Persistence - can save, retrieve, and delete an event in memory', () => {
  const sample = createSampleCelebration();
  sample.id = 'test-persistence-id-999';
  sample.title = 'Special Silver Jubilee';

  const saved = saveEvent(sample);
  assert.equal(saved, true);

  const events = getSavedEvents();
  const found = events.find((e) => e.id === 'test-persistence-id-999');
  assert.ok(found);
  assert.equal(found?.title, 'Special Silver Jubilee');

  // Now delete
  const deleted = deleteEvent('test-persistence-id-999');
  assert.equal(deleted, true);

  const afterDelete = getSavedEvents();
  assert.equal(afterDelete.some((e) => e.id === 'test-persistence-id-999'), false);
});
