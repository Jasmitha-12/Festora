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
    title: 'Seraphina & Julian’s Royal Glasshouse Union',
    date: '2027-06-18',
    location: 'The Oberoi Rajvilas, Jaipur',
    guestCount: 150,
    totalBudget: 3500000,
    currency: 'INR',
    aesthetic: 'garden',
    setting: 'outdoor',
    atmosphere: 'Enchanting botanical elegance with candlelit chandeliers and live acoustic strings',
    dietaryRequirements: 'Royal vegetarian degustation, organic vegan options, nut-free banquet preference',
    notes: 'Desire an atmospheric candlelit evening transition with natural garden foliage, grand floral arches, and an acoustic jazz trio.',
    isSample: true,
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

    // Filter and sanitize valid event objects
    const validEvents: SavedEvent[] = parsed
      .filter((ev) => ev && typeof ev === 'object' && typeof ev.id === 'string' && ev.blueprint)
      .map((ev) => {
        let palette = ev.blueprint.colorPalette;
        if (!Array.isArray(palette)) {
          if (palette && typeof palette === 'object') {
            const values = Object.values(palette).filter(
              (v: unknown): v is { name: string; hex: string } =>
                Boolean(v && typeof v === 'object' && 'name' in v && 'hex' in v && typeof (v as { name: unknown }).name === 'string' && typeof (v as { hex: unknown }).hex === 'string')
            );
            palette = values.length > 0 ? values : [];
          } else {
            palette = [];
          }
        }
        return {
          ...ev,
          blueprint: {
            ...ev.blueprint,
            colorPalette: palette,
          },
        };
      });

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

/**
 * Duplicates an existing event with a new unique ID and updated timestamp.
 */
export function duplicateEvent(id: string): SavedEvent | null {
  try {
    const original = getEventById(id);
    if (!original) return null;

    const newId = `celebration-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const duplicated: SavedEvent = {
      ...original,
      id: newId,
      title: `${original.title} (Copy)`,
      isSample: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      blueprint: {
        ...original.blueprint,
        eventId: newId,
        generatedAt: new Date().toISOString(),
      },
    };

    const success = saveEvent(duplicated);
    return success ? duplicated : null;
  } catch (err) {
    console.error('[FESTORA Storage] Could not duplicate event:', err);
    return null;
  }
}

