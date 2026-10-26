'use client';

import React, { useState, useMemo, useSyncExternalStore } from 'react';
import { SavedEvent } from '@/types/event';
import { formatCurrency } from '@/lib/budget/calculator';
import {
  Calendar,
  MapPin,
  Users,
  ArrowRight,
  Edit2,
  Copy,
  Trash2,
  Plus,
  AlertTriangle,
  Sparkles,
  Search,
} from 'lucide-react';

interface MyEventsDashboardProps {
  events: SavedEvent[];
  onOpenEvent: (event: SavedEvent) => void;
  onEditEvent: (event: SavedEvent) => void;
  onDuplicateEvent?: (id: string) => void;
  onDeleteEvent: (id: string) => void;
  onCreateNew: () => void;
}

const emptySubscribe = () => () => {};

export const MyEventsDashboard: React.FC<MyEventsDashboardProps> = ({
  events,
  onOpenEvent,
  onEditEvent,
  onDuplicateEvent,
  onDeleteEvent,
  onCreateNew,
}) => {
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'budget' | 'name'>('date');

  const isMounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  const deleteActiveElement = React.useRef<HTMLElement | null>(null);
  const deleteModalRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!deleteConfirmId) return;
    deleteActiveElement.current = document.activeElement as HTMLElement | null;

    // Safe focus: focus the cancel/keep button inside confirmation modal
    const focusable = deleteModalRef.current?.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable && focusable.length > 0) {
      focusable[0].focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setDeleteConfirmId(null);
        return;
      }
      if (e.key === 'Tab' && deleteModalRef.current) {
        const focusableElements = deleteModalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;
        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];
        if (!deleteModalRef.current.contains(document.activeElement)) {
          e.preventDefault();
          first.focus();
        } else if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      deleteActiveElement.current?.focus();
    };
  }, [deleteConfirmId]);

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
      // Graceful fallback to Upcoming on invalid date format
      return 'Upcoming';
    }
  };

  // Filter and sort events
  const filteredEvents = useMemo(() => {
    return events
      .filter((ev) => {
        const matchesQuery =
          ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ev.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ev.aesthetic.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesType = selectedTypeFilter === 'all' || ev.eventType === selectedTypeFilter;

        return matchesQuery && matchesType;
      })
      .sort((a, b) => {
        if (sortBy === 'date') {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        }
        if (sortBy === 'budget') {
          return b.totalBudget - a.totalBudget;
        }
        return a.title.localeCompare(b.title);
      });
  }, [events, searchQuery, selectedTypeFilter, sortBy]);

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-[#E9E0D8]">
        <div>
          <span className="text-xs uppercase tracking-widest font-mono text-[#C8AD78] font-semibold">
            FESTORA Dossier Archive
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#30252D] mt-1">
            My Celebrations
          </h1>
          <p className="text-sm text-[#766B70] font-light mt-1">
            {events.length} active {events.length === 1 ? 'celebration plan' : 'celebration plans'} saved locally in browser storage.
          </p>
        </div>

        <button
          onClick={onCreateNew}
          className="px-6 py-3 rounded-xl bg-[#D9858D] hover:bg-[#E29DA3] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 self-start sm:self-auto shadow-md shadow-[#D9858D]/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Plan New Celebration</span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-[#E9E0D8] shadow-sm">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#766B70] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search plans by name, venue or style..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FAF8F3] border border-[#E9E0D8] text-xs text-[#30252D] placeholder-[#766B70]/50 focus:border-[#D9858D] focus:outline-none"
          />
        </div>

        {/* Filter Pills & Sort Dropdown */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Type Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
            {[
              { id: 'all', label: 'All' },
              { id: 'wedding', label: 'Weddings' },
              { id: 'birthday', label: 'Birthdays' },
              { id: 'corporate', label: 'Corporate' },
              { id: 'concert', label: 'Concerts' },
              { id: 'college', label: 'Campus' },
              { id: 'party', label: 'Parties' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setSelectedTypeFilter(f.id)}
                className={`text-[11px] px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  selectedTypeFilter === f.id
                    ? 'bg-[#D9858D] text-white font-bold shadow-xs'
                    : 'bg-transparent text-[#766B70] hover:text-[#30252D] hover:bg-[#FAF8F3]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-1.5 pl-2 border-l border-[#E9E0D8]">
            <span className="text-[11px] text-[#766B70] font-mono">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'budget' | 'name')}
              className="bg-white text-[#30252D] border border-[#E9E0D8] rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-[#D9858D]"
            >
              <option value="date">Soonest Date</option>
              <option value="budget">Highest Budget</option>
              <option value="name">Event Name (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div
          ref={deleteModalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-confirm-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setDeleteConfirmId(null);
          }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#E9E0D8] shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#F5E3E4] flex items-center justify-center text-[#D9858D]">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 id="delete-confirm-title" className="font-serif text-xl font-bold text-[#30252D]">
              Delete this celebration blueprint?
            </h3>
            <p className="text-xs sm:text-sm text-[#766B70] font-light leading-relaxed">
              This action cannot be undone. All custom budget adjustments, completed milestones, and vendor notes will be permanently removed from your browser storage.
            </p>
            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#30252D] hover:bg-[#FAF8F3] border border-[#E9E0D8] transition-colors"
              >
                Keep Event
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteEvent(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#D9858D] hover:bg-[#E29DA3] text-white font-bold transition-colors shadow-xs"
              >
                Yes, Delete Blueprint
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-[#E9E0D8] space-y-4 max-w-xl mx-auto shadow-sm">
          <div className="w-14 h-14 rounded-full bg-[#FAF8F3] border border-[#E9E0D8] flex items-center justify-center mx-auto text-[#C8AD78]">
            <Sparkles className="w-6 h-6 text-[#D9858D]" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-[#30252D]">
            {events.length === 0 ? 'No celebrations saved yet' : 'No matching events found'}
          </h3>
          <p className="text-xs sm:text-sm text-[#766B70] font-light">
            {events.length === 0
              ? 'Launch the FESTORA Planning Studio to construct a bespoke wedding, milestone birthday, college fest, or concert blueprint.'
              : 'Try clearing your search query or switching your category filter to view all saved celebrations.'}
          </p>
          <button
            onClick={events.length === 0 ? onCreateNew : () => { setSearchQuery(''); setSelectedTypeFilter('all'); }}
            className="mt-4 px-6 py-3 rounded-xl bg-[#D9858D] hover:bg-[#E29DA3] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-xs"
          >
            {events.length === 0 ? 'Create Your First Celebration' : 'Reset Filters'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((ev) => {
            const completedTasks = ev.blueprint.timeline.filter((t) => t.completed).length;
            const totalTasks = ev.blueprint.timeline.length;
            const taskPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

            return (
              <div
                key={ev.id}
                className="group bg-white hover:bg-[#FFFDF9] rounded-3xl border border-[#E9E0D8] hover:border-[#D9858D]/50 p-6 flex flex-col justify-between transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1"
              >
                <div className="space-y-4">
                  {/* Badges Bar: Sample vs User & Event Type */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#FAF8F3] text-[#30252D] border border-[#E9E0D8]">
                        {ev.eventType}
                      </span>
                      {ev.isSample ? (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-semibold uppercase tracking-widest bg-[#C8AD78]/15 text-[#8F743E] border border-[#C8AD78]/30">
                          Sample Blueprint
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-semibold uppercase tracking-widest bg-[#A8B69A]/20 text-[#436437] border border-[#A8B69A]/30">
                          Your Event
                        </span>
                      )}
                    </div>

                    <span className="text-[11px] font-mono text-[#D9858D] font-semibold">
                      {getDaysUntil(ev.date)}
                    </span>
                  </div>

                  {/* Title & Theme */}
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#30252D] group-hover:text-[#D9858D] transition-colors line-clamp-1">
                      {ev.title}
                    </h3>
                    <p className="text-xs text-[#766B70] font-light mt-1 capitalize">
                      {ev.aesthetic} aesthetic • {ev.setting || 'custom'} setting
                    </p>
                  </div>

                  {/* Metadata Chips */}
                  <div className="space-y-1.5 text-xs text-[#766B70] font-light pt-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#C8AD78]" />
                      <span>{ev.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#C8AD78]" />
                      <span className="line-clamp-1">{ev.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-[#C8AD78]" />
                      <span>{ev.guestCount} Expected Guests</span>
                    </div>
                  </div>

                  {/* Financial Budget & Progress */}
                  <div className="pt-2 p-3.5 rounded-2xl bg-[#FAF8F3]/70 border border-[#E9E0D8] space-y-2.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#766B70] font-mono text-[11px] uppercase">Budget</span>
                      <span className="font-mono font-bold text-[#30252D]">
                        {formatCurrency(ev.totalBudget, ev.currency)}
                      </span>
                    </div>

                    {/* Checklist Progress */}
                    <div>
                      <div className="flex justify-between text-[11px] text-[#766B70] mb-1">
                        <span>Milestone Progress</span>
                        <span className="font-mono font-semibold text-[#D9858D]">
                          {completedTasks}/{totalTasks} ({taskPct}%)
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-[#E9E0D8] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#C8AD78] to-[#D9858D] transition-all duration-300"
                          style={{ width: `${taskPct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="pt-5 mt-5 border-t border-[#E9E0D8] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    {/* Edit Parameters */}
                    <button
                      type="button"
                      onClick={() => onEditEvent(ev)}
                      className="p-2 rounded-xl text-[#766B70] hover:text-[#30252D] hover:bg-[#FAF8F3] transition-colors"
                      title="Edit Event Parameters"
                      aria-label={`Edit ${ev.title}`}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    {/* Duplicate Event */}
                    {onDuplicateEvent && (
                      <button
                        type="button"
                        onClick={() => onDuplicateEvent(ev.id)}
                        className="p-2 rounded-xl text-[#766B70] hover:text-[#30252D] hover:bg-[#FAF8F3] transition-colors"
                        title="Duplicate Celebration"
                        aria-label={`Duplicate ${ev.title}`}
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    )}

                    {/* Delete Event */}
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(ev.id)}
                      className="p-2 rounded-xl text-[#766B70] hover:text-[#D9858D] hover:bg-[#F5E3E4]/50 transition-colors"
                      title="Delete Celebration"
                      aria-label={`Delete ${ev.title}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Open Dossier CTA */}
                  <button
                    type="button"
                    onClick={() => onOpenEvent(ev)}
                    className="px-4 py-2 rounded-xl bg-[#D9858D] hover:bg-[#E29DA3] text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs"
                  >
                    <span>Open Plan</span>
                    <ArrowRight className="w-3.5 h-3.5" />
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
