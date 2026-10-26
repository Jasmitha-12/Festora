'use client';

import React, { useState } from 'react';
import { SavedEvent, EventFormData, EventType, EventBlueprint } from '@/types/event';
import {
  getSavedEvents,
  saveEvent,
  deleteEvent,
  duplicateEvent,
} from '@/lib/storage/persistence';
import { generateEventBlueprint } from '@/lib/planner/engine';
import { Navbar } from '@/components/ui/Navbar';
import { Toast, ToastMessage } from '@/components/ui/Toast';
import { Hero } from '@/components/landing/Hero';
import { EventTypeDiscovery } from '@/components/landing/EventTypeDiscovery';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { PlanPreview } from '@/components/landing/PlanPreview';
import { Footer } from '@/components/landing/Footer';
import { EventCreationStudio } from '@/components/studio/EventCreationStudio';
import { ActiveCelebrationStudio } from '@/components/studio/ActiveCelebrationStudio';
import { MyEventsDashboard } from '@/components/dashboard/MyEventsDashboard';
import { EditEventModal } from '@/components/dashboard/EditEventModal';
import { Rolling3DGallery } from '@/components/gallery/Rolling3DGallery';
import { HighlightedWord } from '@/components/ui/HighlightedTypography';
import { PrintablePlan } from '@/components/export/PrintablePlan';
import { CinematicPortal } from '@/components/portal/CinematicPortal';
import { ArrowRight } from 'lucide-react';

const emptySubscribe = () => () => {};

export default function Home(): React.JSX.Element {
  const [currentView, setCurrentView] = useState<'landing' | 'studio' | 'blueprint' | 'dashboard'>('landing');
  const [savedEvents, setSavedEvents] = useState<SavedEvent[]>(() => getSavedEvents());
  const [activeEvent, setActiveEvent] = useState<SavedEvent | null>(() => {
    const loaded = getSavedEvents();
    return loaded.length > 0 ? loaded[0] : null;
  });
  const [presetEventType, setPresetEventType] = useState<EventType>('wedding');
  const [editingEvent, setEditingEvent] = useState<SavedEvent | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [hasDismissedPortal, setHasDismissedPortal] = useState<boolean>(false);

  // Synchronize session portal status safely across SSR and client render
  const hasSeenPortalSession = React.useSyncExternalStore(
    emptySubscribe,
    () => {
      try {
        return sessionStorage.getItem('festora_portal_seen') === 'true';
      } catch (_err: unknown) {
        // Fallback to true if sessionStorage access is blocked by browser policies
        return true;
      }
    },
    () => true
  );

  const showPortal = !hasSeenPortalSession && !hasDismissedPortal;

  const handleEnterPortal = () => {
    setHasDismissedPortal(true);
    try {
      sessionStorage.setItem('festora_portal_seen', 'true');
    } catch (_err: unknown) {
      // Gracefully ignore if private browsing restricts storage writes
    }
  };

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({
      id: `toast-${Date.now()}`,
      message,
      type,
    });
  };

  // Create new celebration from studio form submission
  const handleCreateEvent = async (data: EventFormData) => {
    const id = `festora-event-${Date.now()}`;
    let finalBlueprint: EventBlueprint;
    let engineUsed: 'ai-model' | 'deterministic-rules' = 'deterministic-rules';
    let toastNotice: string | null = null;

    try {
      const response = await fetch('/api/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        if (result?.success && result?.blueprint) {
          finalBlueprint = result.blueprint;
          engineUsed = result.engineType || 'ai-model';
          if (result.notice) {
            toastNotice = result.notice;
          }
        } else {
          finalBlueprint = generateEventBlueprint(data, id);
        }
      } else {
        finalBlueprint = generateEventBlueprint(data, id);
      }
    } catch (_err: unknown) {
      // Deterministic fallback if API route unreachable, offline, or rate limited
      finalBlueprint = generateEventBlueprint(data, id);
    }

    const newSavedEvent: SavedEvent = {
      ...data,
      id,
      blueprint: finalBlueprint,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveEvent(newSavedEvent);
    const refreshed = getSavedEvents();
    setSavedEvents(refreshed);
    setActiveEvent(newSavedEvent);
    setCurrentView('blueprint');

    if (engineUsed === 'ai-model') {
      showToast(`AI Celebration Blueprint created for "${data.title}"!`, 'success');
    } else if (toastNotice) {
      showToast(toastNotice, 'info');
    } else {
      showToast(`Celebration Blueprint generated for "${data.title}"!`, 'success');
    }
  };

  // Update existing celebration (e.g. from Budget Studio or Timeline checkbox)
  const handleUpdateEvent = (updated: SavedEvent) => {
    saveEvent(updated);
    setActiveEvent(updated);
    setSavedEvents((prev) => prev.map((ev) => (ev.id === updated.id ? updated : ev)));
  };

  // Delete event
  const handleDeleteEvent = (id: string) => {
    deleteEvent(id);
    const refreshed = getSavedEvents();
    setSavedEvents(refreshed);
    if (activeEvent?.id === id) {
      setActiveEvent(refreshed.length > 0 ? refreshed[0] : null);
    }
    showToast('Celebration blueprint removed from storage', 'info');
  };

  // Duplicate celebration event
  const handleDuplicateEvent = (id: string) => {
    const duplicated = duplicateEvent(id);
    if (duplicated) {
      const refreshed = getSavedEvents();
      setSavedEvents(refreshed);
      showToast(`Celebration duplicated: "${duplicated.title}"`, 'success');
    } else {
      showToast('Could not duplicate event', 'error');
    }
  };

  // Quick-start from discovery card
  const handleSelectEventTypeFromDiscovery = (type: EventType) => {
    setPresetEventType(type);
    setCurrentView('studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open event from dashboard
  const handleOpenFromDashboard = (event: SavedEvent) => {
    setActiveEvent(event);
    setCurrentView('blueprint');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F3]">
      {/* Cinematic Festora O-Portal (Shown once per browsing session) */}
      {showPortal && <CinematicPortal onEnter={handleEnterPortal} />}

      {/* Navigation Bar */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        savedEventsCount={savedEvents.length}
      />

      {/* Main Content Areas */}
      <main className="flex-1">
        {/* VIEW 1: LANDING PAGE */}
        {currentView === 'landing' && (
          <div className="space-y-0">
            <Hero
              onPlanClick={() => {
                setPresetEventType('wedding');
                setCurrentView('studio');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onExploreClick={() => {
                const galleryEl = document.getElementById('rolling-gallery-section');
                galleryEl?.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Section A2: Immersive 3D Rolling Gallery */}
            <section
              id="rolling-gallery-section"
              className="bg-[#FAF8F3] text-[#30252D] py-6 sm:py-12 border-b border-[#E9E0D8] relative overflow-hidden"
            >
              <Rolling3DGallery onSelectEvent={handleSelectEventTypeFromDiscovery} />
            </section>

            {/* Section B: Discover the Possibilities */}
            <EventTypeDiscovery onSelectEventType={handleSelectEventTypeFromDiscovery} />

            {/* Section C: How FESTORA Works */}
            <HowItWorks
              onPlanClick={() => {
                setPresetEventType('wedding');
                setCurrentView('studio');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* Section D: Interactive Planning Preview */}
            <PlanPreview
              onPlanClick={() => {
                setPresetEventType('wedding');
                setCurrentView('studio');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* Section E: Final Cinematic Call to Action */}
            <section className="py-24 sm:py-36 bg-gradient-to-b from-[#FFFDF9] via-[#FAF8F3] to-[#F5E3E4]/30 text-[#30252D] border-t border-[#E9E0D8] text-center relative overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[450px] bg-gradient-to-r from-[#D9858D]/20 via-[#A8B69A]/20 to-[#C8AD78]/20 rounded-full blur-3xl pointer-events-none -z-10" />

              <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8 relative z-10">
                <span className="text-xs uppercase tracking-widest font-mono text-[#C8AD78] font-semibold block">
                  Orchestrate Your Next Milestone
                </span>

                <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight text-[#30252D]">
                  Every extraordinary celebration begins with a{' '}
                  <HighlightedWord variant="coral" delay={0.2} rotation={-1}>
                    blueprint.
                  </HighlightedWord>
                </h2>

                <p className="text-base sm:text-lg text-[#766B70] font-light max-w-2xl mx-auto leading-relaxed">
                  Experience the ease of precision event architecture—from initial concept and color harmonies through live budget calibration and vetted vendor timelines.
                </p>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    onClick={() => {
                      setPresetEventType('wedding');
                      setCurrentView('studio');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-8 py-4 rounded-full bg-[#D9858D] hover:bg-[#E29DA3] text-white font-bold text-sm tracking-wide flex items-center gap-3 shadow-[0_10px_35px_rgba(217,133,141,0.35)] hover:shadow-[0_15px_45px_rgba(217,133,141,0.5)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 group"
                  >
                    <span>Start Planning</span>
                    <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1.5 transition-transform" />
                  </button>

                  <button
                    onClick={() => {
                      setCurrentView('dashboard');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-7 py-4 rounded-full bg-white hover:bg-[#FAF8F3] border border-[#E9E0D8] hover:border-[#D9858D]/50 text-[#30252D] font-semibold text-sm tracking-wide transition-all shadow-xs"
                  >
                    View Saved Celebrations ({savedEvents.length})
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* VIEW 2: EVENT CREATION STUDIO */}
        {currentView === 'studio' && (
          <div className="bg-[#FAF8F3] min-h-[calc(100vh-80px)]">
            <EventCreationStudio
              initialEventType={presetEventType}
              onCancel={() => {
                setCurrentView('landing');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onSubmit={handleCreateEvent}
            />
          </div>
        )}

        {/* VIEW 3: ACTIVE CELEBRATION BLUEPRINT STUDIO */}
        {currentView === 'blueprint' && activeEvent && (
          <ActiveCelebrationStudio
            event={activeEvent}
            onUpdateEvent={handleUpdateEvent}
            onBackToDashboard={() => {
              setCurrentView('dashboard');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onShowToast={showToast}
          />
        )}

        {/* VIEW 4: MY EVENTS DASHBOARD */}
        {currentView === 'dashboard' && (
          <div className="bg-[#FAF8F3] min-h-[calc(100vh-80px)]">
            <MyEventsDashboard
              events={savedEvents}
              onOpenEvent={handleOpenFromDashboard}
              onEditEvent={(ev) => setEditingEvent(ev)}
              onDuplicateEvent={handleDuplicateEvent}
              onDeleteEvent={handleDeleteEvent}
              onCreateNew={() => {
                setPresetEventType('wedding');
                setCurrentView('studio');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        )}
      </main>


      {/* Editorial Footer */}
      <Footer
        onPlanClick={() => {
          setPresetEventType('wedding');
          setCurrentView('studio');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onMyEventsClick={() => {
          setCurrentView('dashboard');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Edit Event Modal */}
      {editingEvent && (
        <EditEventModal
          event={editingEvent}
          onClose={() => setEditingEvent(null)}
          onSave={(updated) => {
            handleUpdateEvent(updated);
            setEditingEvent(null);
            showToast('Celebration parameters updated!', 'success');
          }}
        />
      )}

      {/* Printable Plan Dossier (Visible only during window.print()) */}
      {activeEvent && <PrintablePlan event={activeEvent} />}

      {/* Accessible Floating Toast Notifications */}
      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
