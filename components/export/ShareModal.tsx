'use client';

import React, { useState } from 'react';
import { SavedEvent } from '@/types/event';
import { formatCurrency } from '@/lib/budget/calculator';
import { Copy, Check, Lock, X, Share2 } from 'lucide-react';

interface ShareModalProps {
  event: SavedEvent;
  onClose: () => void;
  onCopySuccess: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  event,
  onClose,
  onCopySuccess,
}) => {
  const [includePrivateNotes, setIncludePrivateNotes] = useState(false);
  const [copied, setCopied] = useState(false);

  // Generate clean readable plain text summary
  const generateSummaryText = () => {
    const { blueprint } = event;
    const completedTasks = blueprint.timeline.filter((t) => t.completed).length;

    let text = `========================================\n`;
    text += `FESTORA CELEBRATION BLUEPRINT\n`;
    text += `Big moments. Beautifully orchestrated.\n`;
    text += `========================================\n\n`;

    text += `EVENT: ${event.title}\n`;
    text += `CATEGORY: ${event.eventType.toUpperCase()}\n`;
    text += `DATE: ${event.date}\n`;
    text += `LOCATION: ${event.location}\n`;
    text += `GUESTS: ${event.guestCount}\n`;
    text += `AESTHETIC: ${event.aesthetic.toUpperCase()}\n`;
    text += `TOTAL BUDGET: ${formatCurrency(event.totalBudget, event.currency)}\n\n`;

    text += `--- CONCEPT & THEME ---\n`;
    text += `Theme: ${blueprint.conceptTitle}\n`;
    text += `Tagline: "${blueprint.tagline}"\n\n`;
    text += `Narrative:\n${blueprint.narrative}\n\n`;

    text += `--- COLOR PALETTE ---\n`;
    (Array.isArray(blueprint.colorPalette) ? blueprint.colorPalette : []).forEach((c) => {
      text += `• ${c.name} (${c.hex}) - ${c.role}\n`;
    });
    text += `\n`;

    text += `--- DAY-OF SCHEDULE ---\n`;
    blueprint.schedule.forEach((s) => {
      text += `• ${s.time} - ${s.title} [Phase: ${s.phase}]\n`;
    });
    text += `\n`;

    text += `--- BUDGET ALLOCATION ---\n`;
    blueprint.budget.categories.forEach((cat) => {
      text += `• ${cat.name}: ${formatCurrency(cat.allocated, event.currency)} (${cat.percentage}%)\n`;
    });
    text += `Allocated Total: ${formatCurrency(blueprint.budget.totalAllocated, event.currency)}\n`;
    text += `Balance Buffer: ${formatCurrency(blueprint.budget.remaining, event.currency)}\n\n`;

    text += `--- VENDOR DIRECTORY ---\n`;
    blueprint.vendors.forEach((v) => {
      text += `• [${v.status.toUpperCase()}] ${v.role} (${v.category}) - Priority: ${v.priority}\n`;
    });
    text += `\n`;

    text += `--- PREPARATION MILESTONES (${completedTasks}/${blueprint.timeline.length} COMPLETED) ---\n`;
    blueprint.timeline.forEach((t) => {
      text += `• [${t.completed ? 'X' : ' '}] ${t.title} (Due: ${t.dueDate})\n`;
    });
    text += `\n`;

    if (includePrivateNotes) {
      text += `--- PRIVATE NOTES & SPECIAL REQUIREMENTS ---\n`;
      if (event.dietaryRequirements) {
        text += `Dietary/Access: ${event.dietaryRequirements}\n`;
      }
      if (event.notes) {
        text += `Vision Notes: ${event.notes}\n`;
      }
      text += `\n`;
    }

    text += `========================================\n`;
    text += `Generated with FESTORA • Deterministic Planning Engine\n`;
    text += `========================================\n`;

    return text;
  };

  const handleCopy = async () => {
    const text = generateSummaryText();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      onCopySuccess();
      setTimeout(() => setCopied(false), 3000);
    } catch (_clipboardError: unknown) {
      // Fallback for browsers or contexts without navigator.clipboard write permissions
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      onCopySuccess();
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full editorial-border editorial-shadow-lg space-y-6 animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#321D35]/10">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-[#E88D83]" />
            <h3 className="font-serif text-2xl font-bold text-[#321D35]">
              Executive Summary Export
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#FAF7F2] text-[#321D35]/70 hover:text-[#321D35]"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Text Preview Box */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-[#321D35]/70">
            <span>Plain-Text Blueprint Dossier</span>
            <span className="font-mono text-[10px]">Formatted for Email, Docs & WhatsApp</span>
          </div>

          <pre className="p-4 rounded-2xl bg-[#FAF7F2] editorial-border text-[11px] font-mono text-[#28262B] h-64 overflow-y-auto whitespace-pre-wrap leading-relaxed select-all">
            {generateSummaryText()}
          </pre>
        </div>

        {/* Privacy Note / Toggle */}
        <div className="p-4 rounded-xl bg-[#321D35]/5 border border-[#321D35]/15 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Lock className="w-4 h-4 text-[#7F9374] flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-[#321D35]">Privacy Guardrail</p>
              <p className="text-[11px] text-[#28262B]/70 font-light">
                Include private vision notes and dietary requirements in exported summary?
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={includePrivateNotes}
              onChange={(e) => setIncludePrivateNotes(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#321D35]"></div>
          </label>
        </div>

        {/* Controls */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-[#321D35] hover:bg-[#FAF7F2] border border-[#321D35]/20"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="px-6 py-2.5 rounded-full bg-[#321D35] hover:bg-[#4A2B4E] text-[#FAF7F2] text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all shadow-sm"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-[#D8BD91]" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-[#D8BD91]" />
                <span>Copy Summary Text</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
