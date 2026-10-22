'use client';

import React, { useState, useSyncExternalStore } from 'react';
import { SavedEvent } from '@/types/event';
import { formatCurrency } from '@/lib/budget/calculator';
import {
  Calendar,
  MapPin,
  Users,
  ArrowRight,
  Edit2,
  Trash2,
  Plus,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';

interface MyEventsDashboardProps {
  events: SavedEvent[];
  onOpenEvent: (event: SavedEvent) => void;
  onEditEvent: (event: SavedEvent) => void;
  onDeleteEvent: (id: string) => void;
  onCreateNew: () => void;
}

const emptySubscribe = () => () => {};

export const MyEventsDashboard: React.FC<MyEventsDashboardProps> = ({
  events,
  onOpenEvent,
  onEditEvent,
  onDeleteEvent,
  onCreateNew,
}) => {
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const isMounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  // Calculate days until celebration safely
  const getDaysUntil = (dateStr: string) => {
    if (!isMounted) return 'Upcoming';
    try {
      const target = new Date(dateStr).getTime();
      const today = new Date().setHours(0, 0, 0, 0);
      const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
      if (diff < 0) return 'Passed';
      if (diff === 0) return 'Today!';
      return `${diff} days away`;
    } catch {
      return 'Upcoming';
    }
  };

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-[#321D35]/10">
        <div>
          <span className="text-xs uppercase tracking-widest font-mono text-[#321D35]/60 font-semibold">
            FESTORA Dossier Archive
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#321D35] mt-1">
            My Celebrations
          </h1>
          <p className="text-sm text-[#28262B]/75 font-light mt-1">
            {events.length} active {events.length === 1 ? 'celebration plan' : 'celebration plans'} saved on this device.
          </p>
        </div>

        <button
          onClick={onCreateNew}
          className="px-6 py-3 rounded-full bg-[#321D35] hover:bg-[#4A2B4E] text-[#FAF7F2] text-xs font-semibold uppercase tracking-wider flex items-center gap-2 self-start sm:self-auto shadow-sm transition-all"
        >
          <Plus className="w-4 h-4 text-[#D8BD91]" />
          <span>Plan New Celebration</span>
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full editorial-border editorial-shadow-lg space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#CF695E]/15 flex items-center justify-center text-[#CF695E]">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#321D35]">
              Delete this celebration blueprint?
            </h3>
            <p className="text-xs sm:text-sm text-[#28262B]/75 font-light leading-relaxed">
              This action cannot be undone. All custom budget adjustments, completed milestones, and notes will be removed from your local storage.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#321D35] hover:bg-[#FAF7F2] border border-[#321D35]/20"
              >
                Keep Event
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteEvent(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#CF695E] hover:bg-[#CF695E]/90 text-white"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Events Grid */}
      {events.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl editorial-border editorial-shadow space-y-4 max-w-xl mx-auto">
          <div className="w-14 h-14 rounded-full bg-[#321D35]/5 flex items-center justify-center mx-auto text-[#321D35]">
            <Sparkles className="w-6 h-6 text-[#E88D83]" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-[#321D35]">No celebrations saved yet</h3>
          <p className="text-xs sm:text-sm text-[#28262B]/75 font-light">
            Launch our planning studio to construct a bespoke wedding, milestone birthday, or community gathering blueprint.
          </p>
          <button
            onClick={onCreateNew}
            className="mt-4 px-6 py-3 rounded-full bg-[#321D35] text-[#FAF7F2] text-xs font-semibold uppercase tracking-wider"
          >
            Create Your First Celebration
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((ev) => {
            const completedTasks = ev.blueprint.timeline.filter((t) => t.completed).length;
            const totalTasks = ev.blueprint.timeline.length;
            const taskPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

            const categoryBadgeColor = {
              wedding: 'bg-[#E88D83]/20 text-[#CF695E]',
              birthday: 'bg-[#D8BD91]/30 text-[#B99968]',
              community: 'bg-[#A9B8A0]/25 text-[#7F9374]',
            }[ev.eventType];

            return (
              <div
                key={ev.id}
                className="bg-white rounded-3xl editorial-border editorial-shadow flex flex-col justify-between overflow-hidden group hover:-translate-y-1 hover:editorial-shadow-lg transition-all"
              >
                <div className="p-6 space-y-4">
                  {/* Category & Countdown */}
                  <div className="flex items-center justify-between gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase ${categoryBadgeColor}`}>
                      {ev.eventType}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-[#321D35] bg-[#FAF7F2] px-2.5 py-0.5 rounded-full border border-[#321D35]/10">
                      {getDaysUntil(ev.date)}
                    </span>
                  </div>

                  {/* Title & Concept */}
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#321D35] group-hover:text-[#E88D83] transition-colors leading-snug">
                      {ev.title}
                    </h3>
                    <p className="text-xs text-[#28262B]/70 font-light mt-1">
                      {ev.blueprint.conceptTitle}
                    </p>
                  </div>

                  {/* Logistics Pill Specs */}
                  <div className="space-y-1.5 pt-2 border-t border-[#321D35]/10 text-xs text-[#28262B]/80 font-light">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#321D35]/60" />
                      <span>{ev.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#321D35]/60" />
                      <span className="truncate">{ev.location}</span>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-[#321D35]/60" />
                        <span>{ev.guestCount} Guests</span>
                      </span>
                      <span className="font-mono font-bold text-[#321D35]">
                        {formatCurrency(ev.totalBudget, ev.currency)}
                      </span>
                    </div>
                  </div>

                  {/* Task Progress Bar */}
                  <div className="pt-2">
                    <div className="flex justify-between items-center text-[10px] font-mono text-[#321D35]/70 mb-1">
                      <span>Tasks: {completedTasks}/{totalTasks} Done</span>
                      <span>{taskPct}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#FAF7F2] rounded-full overflow-hidden border border-[#321D35]/10">
                      <div
                        className="h-full bg-[#A9B8A0] rounded-full"
                        style={{ width: `${taskPct}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="p-4 bg-[#FAF7F2] border-t border-[#321D35]/10 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEditEvent(ev)}
                      className="p-2 rounded-xl text-[#321D35]/70 hover:text-[#321D35] hover:bg-white transition-colors"
                      title="Edit event parameters"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(ev.id)}
                      className="p-2 rounded-xl text-[#CF695E]/70 hover:text-[#CF695E] hover:bg-white transition-colors"
                      title="Delete celebration"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => onOpenEvent(ev)}
                    className="px-4 py-2 rounded-xl bg-[#321D35] hover:bg-[#4A2B4E] text-[#FAF7F2] text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
                  >
                    <span>Open Studio</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#D8BD91]" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
