'use client';

import React, { useState } from 'react';
import { SavedEvent } from '@/types/event';
import { recalculateBudget } from '@/lib/budget/calculator';
import { X, Save, AlertCircle } from 'lucide-react';

interface EditEventModalProps {
  event: SavedEvent;
  onClose: () => void;
  onSave: (updatedEvent: SavedEvent) => void;
}

export const EditEventModal: React.FC<EditEventModalProps> = ({
  event,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState(event.title);
  const [date, setDate] = useState(event.date);
  const [location, setLocation] = useState(event.location);
  const [guestCount, setGuestCount] = useState(event.guestCount);
  const [totalBudget, setTotalBudget] = useState(event.totalBudget);
  const [error, setError] = useState<string | null>(null);
  const previousActiveElement = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    previousActiveElement.current = document.activeElement as HTMLElement | null;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      previousActiveElement.current?.focus();
    };
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Event title cannot be empty.');
      return;
    }
    if (!date) {
      setError('Date is required.');
      return;
    }
    if (!location.trim()) {
      setError('Location is required.');
      return;
    }
    if (guestCount < 1) {
      setError('Guest count must be at least 1.');
      return;
    }
    if (totalBudget <= 0) {
      setError('Budget must be greater than zero.');
      return;
    }

    const recalculatedBudget = recalculateBudget(
      event.blueprint.budget.categories,
      totalBudget,
      event.currency
    );

    const updated: SavedEvent = {
      ...event,
      title: title.trim(),
      date,
      location: location.trim(),
      guestCount,
      totalBudget,
      blueprint: {
        ...event.blueprint,
        budget: recalculatedBudget,
      },
    };

    onSave(updated);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-dialog-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full editorial-border editorial-shadow-lg space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#321D35]/10">
          <h3 id="edit-dialog-title" className="font-serif text-2xl font-bold text-[#321D35]">
            Edit Celebration Details
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#FAF7F2] text-[#321D35]/70"
            aria-label="Close edit dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-[#CF695E]/10 text-[#CF695E] text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-[#321D35] font-semibold mb-1">
              Celebration Title
            </label>
            <input
              type="text"
              value={title}
              autoFocus
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-[#321D35]/20 text-xs focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-[#321D35] font-semibold mb-1">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-[#321D35]/20 text-xs focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase text-[#321D35] font-semibold mb-1">
                Guest Count
              </label>
              <input
                type="number"
                min="1"
                value={guestCount}
                onChange={(e) => setGuestCount(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2.5 rounded-xl border border-[#321D35]/20 text-xs focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-[#321D35] font-semibold mb-1">
                City / Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-[#321D35]/20 text-xs focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase text-[#321D35] font-semibold mb-1">
                Budget ({event.currency})
              </label>
              <input
                type="number"
                min="100"
                step="100"
                value={totalBudget}
                onChange={(e) => setTotalBudget(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2.5 rounded-xl border border-[#321D35]/20 text-xs focus:outline-none font-mono"
                required
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-[#321D35]/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#321D35] hover:bg-[#FAF7F2] border border-[#321D35]/20"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#321D35] text-white text-xs font-semibold flex items-center gap-1.5"
            >
              <Save className="w-4 h-4 text-[#D8BD91]" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
