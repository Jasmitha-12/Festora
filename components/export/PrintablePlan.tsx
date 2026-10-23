'use client';

import React from 'react';
import { SavedEvent } from '@/types/event';
import { formatCurrency } from '@/lib/budget/calculator';

interface PrintablePlanProps {
  event: SavedEvent;
}

export const PrintablePlan: React.FC<PrintablePlanProps> = ({ event }) => {
  const { blueprint } = event;

  return (
    <div className="hidden print:block p-8 bg-white text-black font-serif text-sm">
      
      {/* Editorial Print Header */}
      <div className="border-b-2 border-black pb-6 mb-6">
        <div className="flex justify-between items-baseline">
          <div>
            <h1 className="text-3xl font-bold tracking-wider">FESTORA</h1>
            <p className="text-xs uppercase tracking-widest font-sans text-gray-600 mt-0.5">
              Celebration Dossier & Executive Event Plan
            </p>
          </div>
          <div className="text-right font-sans text-xs text-gray-600">
            <p>Printed: {event.updatedAt ? event.updatedAt.split('T')[0] : '2026-10-22'}</p>
            <p>ID: {event.id}</p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-300 grid grid-cols-4 gap-4 font-sans text-xs">
          <div>
            <span className="text-gray-500 uppercase font-mono block text-[9px]">Event</span>
            <p className="font-bold text-black">{event.title}</p>
            <p className="capitalize text-gray-700">{event.eventType}</p>
          </div>
          <div>
            <span className="text-gray-500 uppercase font-mono block text-[9px]">Date & City</span>
            <p className="font-bold text-black">{event.date}</p>
            <p className="text-gray-700">{event.location}</p>
          </div>
          <div>
            <span className="text-gray-500 uppercase font-mono block text-[9px]">Scale & Style</span>
            <p className="font-bold text-black">{event.guestCount} Guests</p>
            <p className="capitalize text-gray-700">{event.aesthetic} Aesthetic</p>
          </div>
          <div>
            <span className="text-gray-500 uppercase font-mono block text-[9px]">Total Budget</span>
            <p className="font-bold text-black">{formatCurrency(event.totalBudget, event.currency)}</p>
            <p className="text-gray-700 font-mono">100% Balanced</p>
          </div>
        </div>
      </div>

      {/* Concept Narrative */}
      <div className="mb-6 print-break-inside-avoid">
        <h2 className="text-lg font-bold font-sans uppercase tracking-wider border-b border-black pb-1 mb-2">
          1. Concept & Atmosphere Narrative
        </h2>
        <h3 className="text-xl font-bold italic mb-1">{blueprint.conceptTitle}</h3>
        <p className="italic text-gray-700 mb-2">&ldquo;{blueprint.tagline}&rdquo;</p>
        <p className="text-xs leading-relaxed text-gray-800 font-sans">{blueprint.narrative}</p>
        <p className="text-xs mt-2 text-gray-600 font-sans">
          <strong>Atmosphere:</strong> {blueprint.atmosphereNotes}
        </p>
      </div>

      {/* Color Palette */}
      <div className="mb-6 print-break-inside-avoid">
        <h2 className="text-lg font-bold font-sans uppercase tracking-wider border-b border-black pb-1 mb-2">
          2. Color Palette & Styling
        </h2>
        <div className="grid grid-cols-4 gap-3 font-sans text-xs">
          {(Array.isArray(blueprint.colorPalette) ? blueprint.colorPalette : []).map((col, idx) => (
            <div key={idx} className="border border-gray-300 p-2 rounded">
              <div
                className="w-full h-6 border border-gray-400 mb-1 rounded"
                style={{ backgroundColor: col.hex }}
              />
              <p className="font-bold">{col.name}</p>
              <p className="font-mono text-[10px] text-gray-600">{col.hex}</p>
              <p className="text-[10px] text-gray-500">{col.role}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Budget Breakdown Table */}
      <div className="mb-6 print-break-inside-avoid">
        <h2 className="text-lg font-bold font-sans uppercase tracking-wider border-b border-black pb-1 mb-2">
          3. Budget Category Allocations
        </h2>
        <table className="w-full font-sans text-xs border border-gray-300 text-left">
          <thead className="bg-gray-100 border-b border-gray-300">
            <tr>
              <th className="p-2">Category</th>
              <th className="p-2">Allocation ({event.currency})</th>
              <th className="p-2">Percentage</th>
              <th className="p-2">Scope / Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {blueprint.budget.categories.map((cat) => (
              <tr key={cat.id}>
                <td className="p-2 font-semibold">{cat.name}</td>
                <td className="p-2 font-mono">{formatCurrency(cat.allocated, event.currency)}</td>
                <td className="p-2">{cat.percentage}%</td>
                <td className="p-2 text-gray-600">{cat.description}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="border-t-2 border-black font-bold">
            <tr>
              <td className="p-2">Total Allocated</td>
              <td className="p-2 font-mono">{formatCurrency(blueprint.budget.totalAllocated, event.currency)}</td>
              <td className="p-2">
                {Math.round((blueprint.budget.totalAllocated / blueprint.budget.totalBudget) * 100)}%
              </td>
              <td className="p-2">
                Remaining Buffer: {formatCurrency(blueprint.budget.remaining, event.currency)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Day-of Itinerary Table */}
      <div className="mb-6 print-break-inside-avoid">
        <h2 className="text-lg font-bold font-sans uppercase tracking-wider border-b border-black pb-1 mb-2">
          4. Sequential Day-of Schedule
        </h2>
        <table className="w-full font-sans text-xs border border-gray-300 text-left">
          <thead className="bg-gray-100 border-b border-gray-300">
            <tr>
              <th className="p-2 w-24">Time</th>
              <th className="p-2 w-32">Phase</th>
              <th className="p-2">Chapter Activity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {blueprint.schedule.map((sch) => (
              <tr key={sch.id}>
                <td className="p-2 font-mono font-bold">{sch.time}</td>
                <td className="p-2 uppercase text-[10px] text-gray-600">{sch.phase}</td>
                <td className="p-2">
                  <p className="font-semibold text-black">{sch.title}</p>
                  <p className="text-[11px] text-gray-600">{sch.description}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Vendor Sourcing Table */}
      <div className="mb-6 print-break-inside-avoid">
        <h2 className="text-lg font-bold font-sans uppercase tracking-wider border-b border-black pb-1 mb-2">
          5. Vendor Directory & Sourcing
        </h2>
        <table className="w-full font-sans text-xs border border-gray-300 text-left">
          <thead className="bg-gray-100 border-b border-gray-300">
            <tr>
              <th className="p-2">Role</th>
              <th className="p-2">Priority</th>
              <th className="p-2">Lead Time</th>
              <th className="p-2">Deliverables</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {blueprint.vendors.map((ven) => (
              <tr key={ven.id}>
                <td className="p-2 font-semibold">
                  {ven.role}
                  <span className="block text-[10px] text-gray-500">{ven.category}</span>
                </td>
                <td className="p-2 capitalize">{ven.priority}</td>
                <td className="p-2 font-mono">{ven.suggestedLeadTime}</td>
                <td className="p-2 text-gray-700">
                  {ven.deliverables.slice(0, 2).join(', ')}
                </td>
                <td className="p-2 font-bold uppercase text-[10px]">
                  {ven.status.replace('_', ' ')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Preparation Timeline Table */}
      <div className="mb-6 print-break-inside-avoid">
        <h2 className="text-lg font-bold font-sans uppercase tracking-wider border-b border-black pb-1 mb-2">
          6. Chronological Preparation Milestones
        </h2>
        <table className="w-full font-sans text-xs border border-gray-300 text-left">
          <thead className="bg-gray-100 border-b border-gray-300">
            <tr>
              <th className="p-2 w-12">Done</th>
              <th className="p-2 w-28">Phase</th>
              <th className="p-2">Milestone</th>
              <th className="p-2 w-24">Due Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {blueprint.timeline.map((task) => (
              <tr key={task.id}>
                <td className="p-2 text-center font-mono font-bold">
                  {task.completed ? '[X]' : '[ ]'}
                </td>
                <td className="p-2 text-gray-600 text-[10px] uppercase">{task.timeframe}</td>
                <td className="p-2">
                  <p className="font-semibold">{task.title}</p>
                  <p className="text-[10px] text-gray-600">{task.description}</p>
                </td>
                <td className="p-2 font-mono text-[11px]">{task.dueDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Print Footer */}
      <div className="pt-4 border-t border-gray-400 font-sans text-[10px] text-gray-500 flex justify-between">
        <p>FESTORA • Big moments. Beautifully orchestrated.</p>
        <p>Page 1 of 1 • Local Browser Storage Persistence</p>
      </div>

    </div>
  );
};
