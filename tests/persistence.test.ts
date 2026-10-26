import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getSavedEvents,
  saveEvent,
  deleteEvent,
  duplicateEvent,
  createSampleCelebration,
} from '../lib/storage/persistence';

test('Persistence - generates fallback sample celebration in SSR/node environment', () => {
  const events = getSavedEvents();
  assert.ok(events.length >= 1);
  assert.ok(events[0].id);
  assert.equal(events[0].eventType, 'wedding');
  assert.equal(events[0].isSample, true);
});

test('Persistence - can save, retrieve, duplicate, and delete an event in memory', () => {
  const sample = createSampleCelebration();
  sample.id = 'test-persistence-id-999';
  sample.title = 'Special Silver Jubilee';

  const saved = saveEvent(sample);
  assert.equal(saved, true);

  const events = getSavedEvents();
  const found = events.find((e) => e.id === 'test-persistence-id-999');
  assert.ok(found);
  assert.equal(found?.title, 'Special Silver Jubilee');

  // Test duplicate
  const duplicated = duplicateEvent('test-persistence-id-999');
  assert.ok(duplicated);
  assert.notEqual(duplicated?.id, 'test-persistence-id-999');
  assert.equal(duplicated?.title, 'Special Silver Jubilee (Copy)');
  assert.equal(duplicated?.isSample, false);

  // Now delete
  const deleted = deleteEvent('test-persistence-id-999');
  assert.equal(deleted, true);

  const afterDelete = getSavedEvents();
  assert.equal(afterDelete.some((e) => e.id === 'test-persistence-id-999'), false);
});

test('Persistence - can update and overwrite an existing event', () => {
  const sample = createSampleCelebration();
  sample.id = 'test-persistence-edit-1';
  sample.title = 'Initial Title';
  saveEvent(sample);

  // Edit event fields
  const updated = {
    ...sample,
    title: 'Updated Gala Title',
    guestCount: 250,
  };
  const saveSuccess = saveEvent(updated);
  assert.equal(saveSuccess, true);

  const found = getSavedEvents().find((e) => e.id === 'test-persistence-edit-1');
  assert.ok(found);
  assert.equal(found?.title, 'Updated Gala Title');
  assert.equal(found?.guestCount, 250);

  // Cleanup
  deleteEvent('test-persistence-edit-1');
});

