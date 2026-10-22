import type { SavedEvent, EventFormData } from '@/types/event';
import { generateEventBlueprint } from '@/lib/planner/engine';

const STORAGE_KEY = 'festora_saved_celebrations_v1';

// In-memory fallback for environments without localStorage (SSR, private browsing restrictions, etc.)
let memoryStore: SavedEvent[] = [];

function isLocalStorageAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const testKey = '__festora_storage_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Creates an initial sample celebration so first-time visitors can immediately
 * explore the interactive blueprint, budget sliders, and day-of schedules.
 */
export function createSampleCelebration(): SavedEvent {
  const sampleData: EventFormData = {
    eventType: 'wedding',
    title: 'Seraphina & Julian’s Glasshouse Union',
    date: '2027-06-18',
    location: 'Cotswolds & London Botanical Conservatory',
    guestCount: 120,
    totalBudget: 45000,
    currency: 'USD',
    aesthetic: 'garden',
    dietaryRequirements: '6 Vegan, 4 Gluten-Free, Nut-free banquet preference',
    notes: 'Desire an atmospheric candlelit evening transition with natural garden foliage and an acoustic jazz trio.',
  };

  const id = 'sample-celebration-festora-01';
  const blueprint = generateEventBlueprint(sampleData, id);

  return {
    ...sampleData,
    id,
    blueprint,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Retrieves all saved events safely.
 * Gracefully handles parsing failures and falls back to memory.
 */
export function getSavedEvents(): SavedEvent[] {
  if (!isLocalStorageAvailable()) {
    if (memoryStore.length === 0) {
      memoryStore = [createSampleCelebration()];
    }
    return [...memoryStore];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Seed with initial inspiring celebration
      const sample = createSampleCelebration();
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify([sample]));
      return [sample];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      console.warn('[FESTORA Storage] Invalid storage structure encountered. Resetting to sample.');
      const sample = createSampleCelebration();
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify([sample]));
      return [sample];
    }

    // Filter valid event objects
    const validEvents = parsed.filter(
      (ev) => ev && typeof ev === 'object' && typeof ev.id === 'string' && ev.blueprint
    );

    if (validEvents.length === 0) {
      const sample = createSampleCelebration();
      return [sample];
    }

    return validEvents;
  } catch (err) {
    console.error('[FESTORA Storage] Error parsing stored events:', err);
    return [createSampleCelebration()];
  }
}

/**
 * Retrieves a single event by ID.
 */
export function getEventById(id: string): SavedEvent | null {
  const events = getSavedEvents();
  return events.find((ev) => ev.id === id) || null;
}

/**
 * Saves a new or updated event.
 * Returns true on success, false on quota error.
 */
export function saveEvent(event: SavedEvent): boolean {
  try {
    const events = getSavedEvents();
    const existingIndex = events.findIndex((ev) => ev.id === event.id);

    const updatedEvent: SavedEvent = {
      ...event,
      updatedAt: new Date().toISOString(),
    };

    let nextEvents: SavedEvent[];
    if (existingIndex >= 0) {
      nextEvents = [...events];
      nextEvents[existingIndex] = updatedEvent;
    } else {
      nextEvents = [updatedEvent, ...events];
    }

    if (isLocalStorageAvailable()) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextEvents));
    }
    memoryStore = nextEvents;
    return true;
  } catch (err) {
    console.error('[FESTORA Storage] Could not persist event to localStorage:', err);
    return false;
  }
}

/**
 * Deletes an event by ID.
 */
export function deleteEvent(id: string): boolean {
  try {
    const events = getSavedEvents();
    const nextEvents = events.filter((ev) => ev.id !== id);

    if (isLocalStorageAvailable()) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextEvents));
    }
    memoryStore = nextEvents;
    return true;
  } catch (err) {
    console.error('[FESTORA Storage] Could not delete event:', err);
    return false;
  }
}
