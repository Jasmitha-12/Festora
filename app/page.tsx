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
import { PrintablePlan } from '@/components/export/PrintablePlan';
import { Sparkles } from 'lucide-react';

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
                const previewEl = document.getElementById('discover-section');
                previewEl?.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            <EventTypeDiscovery onSelectEventType={handleSelectEventTypeFromDiscovery} />

            <HowItWorks
              onPlanClick={() => {
                setPresetEventType('wedding');
                setCurrentView('studio');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            <PlanPreview
              onPlanClick={() => {
                setPresetEventType('wedding');
                setCurrentView('studio');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* Final Call to Action */}
            <section className="py-24 bg-[#FAF7F2] border-t border-[#321D35]/10 text-center">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
                <span className="text-xs uppercase tracking-widest font-mono text-[#321D35]/60 font-semibold">
                  Orchestrate Your Next Milestone
                </span>
                <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#321D35]">
                  Every extraordinary celebration begins with a blueprint.
                </h2>
                <p className="text-base sm:text-lg text-[#28262B]/75 font-light max-w-2xl mx-auto">
                  Experience the ease of precision planning—from initial concept and color harmonies through live budget calibration and vetted vendor timelines.
                </p>
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    onClick={() => {
                      setPresetEventType('wedding');
                      setCurrentView('studio');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-8 py-4 rounded-full bg-[#321D35] hover:bg-[#4A2B4E] text-[#FAF7F2] font-semibold text-sm tracking-wide flex items-center gap-3 shadow-md hover:shadow-lg transition-all"
                  >
                    <span>Launch Event Studio</span>
                    <Sparkles className="w-4 h-4 text-[#D8BD91]" />
                  </button>

                  <button
                    onClick={() => {
                      setCurrentView('dashboard');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-6 py-4 rounded-full bg-white hover:bg-[#321D35]/5 border border-[#321D35]/25 text-[#321D35] font-semibold text-sm tracking-wide transition-colors"
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
