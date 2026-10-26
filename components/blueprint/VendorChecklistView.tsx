'use client';

import React from 'react';
import { VendorItem } from '@/types/event';
import { HelpCircle, Briefcase, Calendar } from 'lucide-react';

interface VendorChecklistViewProps {
  vendors: VendorItem[];
  onUpdateVendorStatus: (vendorId: string, status: VendorItem['status']) => void;
}

export const VendorChecklistView: React.FC<VendorChecklistViewProps> = ({
  vendors,
  onUpdateVendorStatus,
}) => {
  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 editorial-border editorial-shadow">
        <div className="flex items-center gap-2 mb-1">
          <Briefcase className="w-5 h-5 text-[#E88D83]" />
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#321D35]">
            Vendor Sourcing & Interview Briefs
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-[#28262B]/75 font-light">
          Essential creative partners, contractual deliverables, and targeted interview vetting prompts.
        </p>
      </div>

      {/* Vendor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {vendors.map((ven) => {
          const priorityStyles = {
            essential: 'bg-[#CF695E]/15 text-[#CF695E] border-[#CF695E]/30',
            recommended: 'bg-[#D8BD91]/20 text-[#B99968] border-[#D8BD91]/40',
            optional: 'bg-[#A9B8A0]/20 text-[#7F9374] border-[#A9B8A0]/30',
          }[ven.priority];

          return (
            <div
              key={ven.id}
              className="bg-white rounded-3xl p-6 editorial-border editorial-shadow flex flex-col justify-between space-y-5"
            >
              <div>
                {/* Top Badges */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${priorityStyles}`}>
                    {ven.priority}
                  </span>

                  <span className="text-[11px] font-mono text-[#321D35]/60 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#D8BD91]" />
                    <span>{ven.suggestedLeadTime}</span>
                  </span>
                </div>

                <div className="mb-4">
                  <span className="text-[10px] font-mono uppercase text-[#321D35]/50 font-semibold block">
                    {ven.category}
                  </span>
                  <h3 className="font-serif text-xl font-bold text-[#321D35]">{ven.role}</h3>
                </div>

                {/* Deliverables */}
                <div className="space-y-1.5 mb-4">
                  <h4 className="text-[10px] font-mono uppercase tracking-wider text-[#321D35] font-bold">
                    Key Expected Deliverables
                  </h4>
                  <ul className="space-y-1 text-xs text-[#28262B]/80 font-light">
                    {ven.deliverables.map((del, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-[#A9B8A0] font-bold">✓</span>
                        <span>{del}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Questions to ask */}
                <div className="p-3.5 rounded-xl bg-[#FAF7F2] editorial-border space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-[#321D35] font-bold">
                    <HelpCircle className="w-3 h-3 text-[#E88D83]" />
                    <span>Vetting Questions to Ask</span>
                  </div>
                  <ul className="space-y-1 text-xs text-[#28262B]/80 font-light">
                    {ven.questionsToAsk.map((q, idx) => (
                      <li key={idx} className="italic">
                        &ldquo;{q}&rdquo;
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Status Switcher Footer */}
              <div className="pt-4 border-t border-[#321D35]/10 flex items-center justify-between">
                <span className="text-xs font-medium text-[#321D35]/70">Status:</span>
                <div className="flex rounded-lg bg-[#FAF7F2] p-0.5 editorial-border text-[11px]">
                  {(['to_hire', 'shortlisted', 'booked'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => onUpdateVendorStatus(ven.id, st)}
                      aria-pressed={ven.status === st}
                      aria-label={`Set ${ven.role} status to ${st.replace('_', ' ')}`}
                      className={`px-2.5 py-1 rounded-md font-semibold capitalize transition-all ${
                        ven.status === st
                          ? 'bg-[#321D35] text-[#FAF7F2] shadow-xs'
                          : 'text-[#321D35]/60 hover:text-[#321D35]'
                      }`}
                    >
                      {st.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
