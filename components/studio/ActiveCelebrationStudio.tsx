'use client';

import React, { useState, useSyncExternalStore } from 'react';
import { SavedEvent, BudgetAllocation, TaskMilestone, VendorItem } from '@/types/event';

const emptySubscribe = () => () => {};
import { BlueprintView } from '@/components/blueprint/BlueprintView';
import { BudgetStudio } from '@/components/budget/BudgetStudio';
import { TimelineScheduleView } from '@/components/timeline/TimelineScheduleView';
import { VendorChecklistView } from '@/components/blueprint/VendorChecklistView';
import { ShareModal } from '@/components/export/ShareModal';
import { formatCurrency } from '@/lib/budget/calculator';
import {
  Palette,
  PieChart,
  Clock,
  Briefcase,
  Printer,
  Share2,
  Calendar,
  MapPin,
  Users,
  ArrowLeft,
} from 'lucide-react';

interface ActiveCelebrationStudioProps {
  event: SavedEvent;
  onUpdateEvent: (updated: SavedEvent) => void;
  onBackToDashboard: () => void;
  onShowToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export const ActiveCelebrationStudio: React.FC<ActiveCelebrationStudioProps> = ({
  event,
  onUpdateEvent,
  onBackToDashboard,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'blueprint' | 'budget' | 'timeline' | 'vendors'>('blueprint');
  const [showShareModal, setShowShareModal] = useState(false);

  // Update budget
  const handleBudgetChange = (updatedBudget: BudgetAllocation) => {
    const updated: SavedEvent = {
      ...event,
      totalBudget: updatedBudget.totalBudget,
      blueprint: {
        ...event.blueprint,
        budget: updatedBudget,
      },
    };
    onUpdateEvent(updated);
  };

  // Toggle task completed
  const handleToggleTask = (taskId: string) => {
    const updatedTasks = event.blueprint.timeline.map((t) =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    const updated: SavedEvent = {
      ...event,
      blueprint: {
        ...event.blueprint,
        timeline: updatedTasks,
      },
    };
    onUpdateEvent(updated);
    const toggled = updatedTasks.find((t) => t.id === taskId);
    if (toggled?.completed) {
      onShowToast(`Milestone marked completed: "${toggled.title}"`, 'success');
    }
  };

  // Add custom task
  const handleAddTask = (newTask: Omit<TaskMilestone, 'id'>) => {
    const taskWithId: TaskMilestone = {
      ...newTask,
      id: `task-custom-${Date.now()}`,
    };
    const updated: SavedEvent = {
      ...event,
      blueprint: {
        ...event.blueprint,
        timeline: [taskWithId, ...event.blueprint.timeline],
      },
    };
    onUpdateEvent(updated);
    onShowToast(`Added milestone: "${newTask.title}"`, 'success');
  };

  // Edit task
  const handleEditTask = (taskId: string, updatedFields: Partial<TaskMilestone>) => {
    const updatedTasks = event.blueprint.timeline.map((t) =>
      t.id === taskId ? { ...t, ...updatedFields } : t
    );
    const updated: SavedEvent = {
      ...event,
      blueprint: {
        ...event.blueprint,
        timeline: updatedTasks,
      },
    };
    onUpdateEvent(updated);
    onShowToast('Milestone details updated', 'success');
  };

  // Delete task
  const handleDeleteTask = (taskId: string) => {
    const updated: SavedEvent = {
      ...event,
      blueprint: {
        ...event.blueprint,
        timeline: event.blueprint.timeline.filter((t) => t.id !== taskId),
      },
    };
    onUpdateEvent(updated);
    onShowToast('Milestone removed', 'info');
  };

  // Update vendor status
  const handleUpdateVendorStatus = (vendorId: string, status: VendorItem['status']) => {
    const updatedVendors = event.blueprint.vendors.map((v) =>
      v.id === vendorId ? { ...v, status } : v
    );
    const updated: SavedEvent = {
      ...event,
      blueprint: {
        ...event.blueprint,
        vendors: updatedVendors,
      },
    };
    onUpdateEvent(updated);
    onShowToast(`Vendor status updated to ${status.replace('_', ' ')}`, 'success');
  };

  // Print PDF trigger
  const handlePrint = () => {
    window.print();
  };

  const isMounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  // Days until celebration
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

  const completedTasks = event.blueprint.timeline.filter((t) => t.completed).length;

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Top Breadcrumb & Action Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <button
          onClick={onBackToDashboard}
          className="text-xs font-semibold text-[#321D35]/70 hover:text-[#321D35] flex items-center gap-1.5 self-start transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Celebrations</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowShareModal(true)}
            className="px-4 py-2 rounded-xl bg-white hover:bg-[#FAF7F2] editorial-border text-[#321D35] text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
            title="Export plain text summary"
          >
            <Share2 className="w-3.5 h-3.5 text-[#E88D83]" />
            <span>Copy Executive Summary</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-[#321D35] hover:bg-[#4A2B4E] text-[#FAF7F2] text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all"
            title="Open browser print dialog for PDF export"
          >
            <Printer className="w-3.5 h-3.5 text-[#D8BD91]" />
            <span>Print / Export PDF</span>
          </button>
        </div>
      </div>

      {/* Hero Dossier Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 editorial-border editorial-shadow no-print space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-[#321D35] text-[#FAF7F2]">
                {event.eventType}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-[#E88D83]/20 text-[#CF695E]">
                {event.aesthetic} Aesthetic
              </span>
              <span className="text-xs font-mono text-[#321D35]/60 font-medium">
                {getDaysUntil(event.date)}
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#321D35]">
              {event.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-[#28262B]/80 mt-2 font-light">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#321D35]/60" />
                <span>{event.date}</span>
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#321D35]/60" />
                <span>{event.location}</span>
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-[#321D35]/60" />
                <span>{event.guestCount} Guests</span>
              </span>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#FAF7F2] editorial-border self-start lg:self-auto">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#321D35]/60 block">Budget</span>
              <span className="font-mono font-bold text-sm text-[#321D35]">
                {formatCurrency(event.totalBudget, event.currency)}
              </span>
            </div>
            <div className="h-8 w-px bg-[#321D35]/15" />
            <div>
              <span className="text-[10px] font-mono uppercase text-[#321D35]/60 block">Milestones</span>
              <span className="font-mono font-bold text-sm text-[#7F9374]">
                {completedTasks}/{event.blueprint.timeline.length} Done
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#321D35]/10 gap-2 sm:gap-6 overflow-x-auto no-scrollbar pt-2">
          {[
            { id: 'blueprint', label: 'Theme & Concept', icon: Palette },
            { id: 'budget', label: 'Budget Studio', icon: PieChart },
            { id: 'timeline', label: 'Timeline & Run-Sheet', icon: Clock },
            { id: 'vendors', label: 'Vendor Briefs', icon: Briefcase },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                  isActive
                    ? 'border-[#321D35] text-[#321D35]'
                    : 'border-transparent text-[#321D35]/60 hover:text-[#321D35]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#E88D83]' : 'text-[#321D35]/50'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Panels */}
      <div className="no-print">
        {activeTab === 'blueprint' && (
          <BlueprintView
            blueprint={event.blueprint}
            onCopyColor={(hex) => onShowToast(`Color hex ${hex} copied to clipboard!`, 'info')}
          />
        )}

        {activeTab === 'budget' && (
          <BudgetStudio
            eventType={event.eventType}
            budget={event.blueprint.budget}
            onChange={handleBudgetChange}
          />
        )}

        {activeTab === 'timeline' && (
          <TimelineScheduleView
            schedule={event.blueprint.schedule}
            timeline={event.blueprint.timeline}
            onToggleTask={handleToggleTask}
            onAddTask={handleAddTask}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
          />
        )}

        {activeTab === 'vendors' && (
          <VendorChecklistView
            vendors={event.blueprint.vendors}
            onUpdateVendorStatus={handleUpdateVendorStatus}
          />
        )}
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <ShareModal
          event={event}
          onClose={() => setShowShareModal(false)}
          onCopySuccess={() => onShowToast('Executive summary copied to clipboard!', 'success')}
        />
      )}

    </div>
  );
};
