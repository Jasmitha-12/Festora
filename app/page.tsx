'use client';

import React, { useState } from 'react';
import { SavedEvent, EventFormData, EventType } from '@/types/event';
import {
  getSavedEvents,
  saveEvent,
  deleteEvent,
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
import { ArrowRight } from 'lucide-react';

export default function Home() {
  const [currentView, setCurrentView] = useState<'landing' | 'studio' | 'blueprint' | 'dashboard'>('landing');
  const [savedEvents, setSavedEvents] = useState<SavedEvent[]>(() => getSavedEvents());
  const [activeEvent, setActiveEvent] = useState<SavedEvent | null>(() => {
    const loaded = getSavedEvents();
    return loaded.length > 0 ? loaded[0] : null;
  });
  const [presetEventType, setPresetEventType] = useState<EventType>('wedding');
  const [editingEvent, setEditingEvent] = useState<SavedEvent | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({
      id: `toast-${Date.now()}`,
      message,
      type,
    });
  };

  // Create new celebration from studio form submission
  const handleCreateEvent = (data: EventFormData) => {
    const id = `festora-event-${Date.now()}`;
    const blueprint = generateEventBlueprint(data, id);
    const newSavedEvent: SavedEvent = {
      ...data,
      id,
      blueprint,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveEvent(newSavedEvent);
    const refreshed = getSavedEvents();
    setSavedEvents(refreshed);
    setActiveEvent(newSavedEvent);
    setCurrentView('blueprint');
    showToast(`Blueprint generated for "${data.title}"!`, 'success');
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
    <div className="min-h-screen flex flex-col bg-[#FAF7F2]">
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
              className="bg-[#160B18] text-[#FAF7F2] py-6 sm:py-12 border-b border-white/10 relative overflow-hidden"
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
            <section className="py-24 sm:py-36 bg-gradient-to-b from-[#140718] via-[#1E0F24] to-[#0B030E] text-[#FAF7F2] border-t border-white/10 text-center relative overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[450px] bg-gradient-to-r from-[#E86A58]/20 via-[#3A1B42]/30 to-[#D4AF37]/20 rounded-full blur-3xl pointer-events-none -z-10" />

              <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8 relative z-10">
                <span className="text-xs uppercase tracking-widest font-mono text-[#D8BD91] font-semibold block">
                  Orchestrate Your Next Milestone
                </span>

                <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                  Every extraordinary celebration begins with a{' '}
                  <HighlightedWord variant="coral" delay={0.2} rotation={-1}>
                    blueprint.
                  </HighlightedWord>
                </h2>

                <p className="text-base sm:text-lg text-[#FAF7F2]/80 font-light max-w-2xl mx-auto leading-relaxed">
                  Experience the ease of precision event architecture—from initial concept and color harmonies through live budget calibration and vetted vendor timelines.
                </p>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    onClick={() => {
                      setPresetEventType('wedding');
                      setCurrentView('studio');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-8 py-4 rounded-full bg-[#E86A58] hover:bg-[#F2AEA6] text-[#140718] font-bold text-sm tracking-wide flex items-center gap-3 shadow-[0_10px_35px_rgba(232,106,88,0.45)] hover:shadow-[0_15px_45px_rgba(232,106,88,0.6)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 group"
                  >
                    <span>Start Planning</span>
                    <ArrowRight className="w-4 h-4 text-[#140718] group-hover:translate-x-1.5 transition-transform" />
                  </button>

                  <button
                    onClick={() => {
                      setCurrentView('dashboard');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-7 py-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/20 hover:border-[#D8BD91]/50 text-[#FAF7F2] font-semibold text-sm tracking-wide transition-all backdrop-blur-sm"
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
          <EventCreationStudio
            initialEventType={presetEventType}
            onCancel={() => {
              setCurrentView('landing');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSubmit={handleCreateEvent}
          />
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
          <MyEventsDashboard
            events={savedEvents}
            onOpenEvent={handleOpenFromDashboard}
            onEditEvent={(ev) => setEditingEvent(ev)}
            onDeleteEvent={handleDeleteEvent}
            onCreateNew={() => {
              setPresetEventType('wedding');
              setCurrentView('studio');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
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
