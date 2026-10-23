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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-white/10">
        <div>
          <span className="text-xs uppercase tracking-widest font-mono text-[#D4AF37] font-semibold">
            FESTORA Dossier Archive
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#FAF7F2] mt-1">
            My Celebrations
          </h1>
          <p className="text-sm text-[#FAF7F2]/70 font-light mt-1">
            {events.length} active {events.length === 1 ? 'celebration plan' : 'celebration plans'} saved locally in browser storage.
          </p>
        </div>

        <button
          onClick={onCreateNew}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E86A58] hover:from-[#E5BF48] hover:to-[#F2AEA6] text-[#120616] text-xs font-bold uppercase tracking-wider flex items-center gap-2 self-start sm:self-auto shadow-lg shadow-[#E86A58]/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Plan New Celebration</span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-[#1E0F24]/80 backdrop-blur-md border border-white/10">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#FAF7F2]/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search plans by name, venue or style..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-xs text-[#FAF7F2] placeholder-white/40 focus:border-[#D4AF37] focus:outline-none"
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
                    ? 'bg-[#E86A58] text-[#120616] font-bold shadow-xs'
                    : 'bg-white/[0.04] text-[#FAF7F2]/70 hover:text-white hover:bg-white/[0.08]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-1.5 pl-2 border-l border-white/10">
            <span className="text-[11px] text-[#FAF7F2]/60 font-mono">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'budget' | 'name')}
              className="bg-[#160B18] text-[#FAF7F2] border border-white/15 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-[#D4AF37]"
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
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-[#1E0F24] rounded-3xl p-6 sm:p-8 max-w-md w-full border border-white/15 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#E86A58]/20 flex items-center justify-center text-[#E86A58]">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#FAF7F2]">
              Delete this celebration blueprint?
            </h3>
            <p className="text-xs sm:text-sm text-[#FAF7F2]/75 font-light leading-relaxed">
              This action cannot be undone. All custom budget adjustments, completed milestones, and vendor notes will be permanently removed from your browser storage.
            </p>
            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#FAF7F2] hover:bg-white/10 border border-white/20 transition-colors"
              >
                Keep Event
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteEvent(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#E86A58] hover:bg-[#E86A58]/90 text-[#120616] font-bold transition-colors"
              >
                Yes, Delete Blueprint
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="p-12 text-center bg-[#1E0F24]/60 backdrop-blur-md rounded-3xl border border-white/10 space-y-4 max-w-xl mx-auto">
          <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mx-auto text-[#D4AF37]">
            <Sparkles className="w-6 h-6 text-[#E86A58]" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-[#FAF7F2]">
            {events.length === 0 ? 'No celebrations saved yet' : 'No matching events found'}
          </h3>
          <p className="text-xs sm:text-sm text-[#FAF7F2]/70 font-light">
            {events.length === 0
              ? 'Launch the FESTORA Planning Studio to construct a bespoke wedding, milestone birthday, college fest, or concert blueprint.'
              : 'Try clearing your search query or switching your category filter to view all saved celebrations.'}
          </p>
          <button
            onClick={events.length === 0 ? onCreateNew : () => { setSearchQuery(''); setSelectedTypeFilter('all'); }}
            className="mt-4 px-6 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E86A58] text-[#120616] text-xs font-bold uppercase tracking-wider transition-all"
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
                className="group bg-[#1E0F24]/90 hover:bg-[#25122C] rounded-3xl border border-white/10 hover:border-[#D4AF37]/50 p-6 flex flex-col justify-between transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1"
              >
                <div className="space-y-4">
                  {/* Badges Bar: Sample vs User & Event Type */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/10 text-[#FAF7F2] border border-white/10">
                        {ev.eventType}
                      </span>
                      {ev.isSample ? (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-semibold uppercase tracking-widest bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30">
                          Sample Blueprint
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-semibold uppercase tracking-widest bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          Your Event
                        </span>
                      )}
                    </div>

                    <span className="text-[11px] font-mono text-[#D4AF37] font-semibold">
                      {getDaysUntil(ev.date)}
                    </span>
                  </div>

                  {/* Title & Theme */}
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#FAF7F2] group-hover:text-[#D4AF37] transition-colors line-clamp-1">
                      {ev.title}
                    </h3>
                    <p className="text-xs text-[#FAF7F2]/65 font-light mt-1 capitalize">
                      {ev.aesthetic} aesthetic • {ev.setting || 'custom'} setting
                    </p>
                  </div>

                  {/* Metadata Chips */}
                  <div className="space-y-1.5 text-xs text-[#FAF7F2]/75 font-light pt-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>{ev.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span className="line-clamp-1">{ev.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>{ev.guestCount} Expected Guests</span>
                    </div>
                  </div>

                  {/* Financial Budget & Progress */}
                  <div className="pt-2 p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#FAF7F2]/60 font-mono text-[11px] uppercase">Budget</span>
                      <span className="font-mono font-bold text-[#FAF7F2]">
                        {formatCurrency(ev.totalBudget, ev.currency)}
                      </span>
                    </div>

                    {/* Checklist Progress */}
                    <div>
                      <div className="flex justify-between text-[11px] text-[#FAF7F2]/70 mb-1">
                        <span>Milestone Progress</span>
                        <span className="font-mono font-semibold text-[#D4AF37]">
                          {completedTasks}/{totalTasks} ({taskPct}%)
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#D4AF37] to-[#E86A58] transition-all duration-300"
                          style={{ width: `${taskPct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="pt-5 mt-5 border-t border-white/10 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    {/* Edit Parameters */}
                    <button
                      type="button"
                      onClick={() => onEditEvent(ev)}
                      className="p-2 rounded-xl text-[#FAF7F2]/70 hover:text-white hover:bg-white/10 transition-colors"
                      title="Edit Event Parameters"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    {/* Duplicate Event */}
                    {onDuplicateEvent && (
                      <button
                        type="button"
                        onClick={() => onDuplicateEvent(ev.id)}
                        className="p-2 rounded-xl text-[#FAF7F2]/70 hover:text-white hover:bg-white/10 transition-colors"
                        title="Duplicate Celebration"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    )}

                    {/* Delete Event */}
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(ev.id)}
                      className="p-2 rounded-xl text-[#FAF7F2]/70 hover:text-[#E86A58] hover:bg-[#E86A58]/10 transition-colors"
                      title="Delete Celebration"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Open Dossier CTA */}
                  <button
                    type="button"
                    onClick={() => onOpenEvent(ev)}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-[#D4AF37] hover:text-[#120616] text-[#FAF7F2] text-xs font-semibold flex items-center gap-1.5 transition-all"
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
