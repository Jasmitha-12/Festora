'use client';

import React, { useState } from 'react';
import { TaskMilestone, ScheduleItem } from '@/types/event';
import {
  Clock,
  Plus,
  Check,
  Trash2,
} from 'lucide-react';

interface TimelineScheduleViewProps {
  schedule: ScheduleItem[];
  timeline: TaskMilestone[];
  onToggleTask: (taskId: string) => void;
  onAddTask: (newTask: Omit<TaskMilestone, 'id'>) => void;
  onDeleteTask: (taskId: string) => void;
}

export const TimelineScheduleView: React.FC<TimelineScheduleViewProps> = ({
  schedule,
  timeline,
  onToggleTask,
  onAddTask,
  onDeleteTask,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'timeline' | 'schedule'>('timeline');
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  
  // Custom task form state
  const [showAddModal, setShowAddModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('');
  const taskPhase = 'Phase 3: Details';
  const taskTimeframe = '2 Weeks Out';
  const taskCategory = 'General';

  const completedCount = timeline.filter((t) => t.completed).length;
  const totalCount = timeline.length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Filter tasks
  const filteredTasks = timeline.filter((t) => {
    if (filter === 'completed') return t.completed;
    if (filter === 'pending') return !t.completed;
    return true;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    onAddTask({
      title: taskTitle.trim(),
      description: 'Custom celebration milestone.',
      phase: taskPhase,
      timeframe: taskTimeframe,
      dueDate: taskDueDate || new Date().toISOString().split('T')[0],
      completed: false,
      category: taskCategory,
      isCustom: true,
    });

    setTaskTitle('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-8">
      
      {/* View Switcher Bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 editorial-border editorial-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-5 h-5 text-[#E88D83]" />
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#321D35]">
              Timeline & Day-of Itinerary
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#28262B]/75 font-light">
            Toggle between the long-range preparation milestones and the sequential day-of run-of-show.
          </p>
        </div>

        {/* Sub-tabs */}
        <div className="flex rounded-xl bg-[#FAF7F2] p-1 editorial-border self-start sm:self-auto">
          <button
            onClick={() => setActiveSubTab('timeline')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wider transition-all ${
              activeSubTab === 'timeline'
                ? 'bg-[#321D35] text-[#FAF7F2] shadow-sm'
                : 'text-[#321D35]/70 hover:text-[#321D35]'
            }`}
          >
            Preparation Milestones ({completedCount}/{totalCount})
          </button>
          <button
            onClick={() => setActiveSubTab('schedule')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wider transition-all ${
              activeSubTab === 'schedule'
                ? 'bg-[#321D35] text-[#FAF7F2] shadow-sm'
                : 'text-[#321D35]/70 hover:text-[#321D35]'
            }`}
          >
            Day-of Schedule ({schedule.length} Chapters)
          </button>
        </div>
      </div>

      {/* 1. Preparation Milestones View */}
      {activeSubTab === 'timeline' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 editorial-border editorial-shadow space-y-6">
          
          {/* Progress & Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#321D35]/10">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[#321D35]">
                  {completedCount} of {totalCount} Milestones Completed ({progressPct}%)
                </span>
              </div>
              <div className="w-64 h-2 bg-[#FAF7F2] rounded-full overflow-hidden mt-2 border border-[#321D35]/10">
                <div
                  className="h-full bg-[#A9B8A0] transition-all duration-300"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>

            {/* Filter Buttons & Add Task */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex rounded-lg bg-[#FAF7F2] p-0.5 editorial-border text-xs">
                {(['all', 'pending', 'completed'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setFilter(mode)}
                    className={`px-3 py-1 rounded-md capitalize font-medium transition-colors ${
                      filter === mode
                        ? 'bg-white text-[#321D35] shadow-xs font-semibold'
                        : 'text-[#321D35]/60 hover:text-[#321D35]'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowAddModal(true)}
                className="px-3 py-1.5 rounded-lg bg-[#321D35] text-[#FAF7F2] text-xs font-semibold flex items-center gap-1 hover:bg-[#4A2B4E] transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Task</span>
              </button>
            </div>
          </div>

          {/* Add Task Modal / Banner */}
          {showAddModal && (
            <form
              onSubmit={handleCreateTask}
              className="p-5 rounded-2xl bg-[#FAF7F2] editorial-border space-y-4 animate-in fade-in"
            >
              <h4 className="text-xs font-mono uppercase font-bold text-[#321D35]">
                Create New Preparation Milestone
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-[#321D35] mb-1">
                    Milestone Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Schedule bridal hair trial, finalize playlist"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#321D35]/20 bg-white text-xs focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#321D35] mb-1">
                    Target Due Date
                  </label>
                  <input
                    type="date"
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#321D35]/20 bg-white text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-[#321D35]/70 hover:text-[#321D35]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#321D35] text-white text-xs font-semibold"
                >
                  Save Milestone
                </button>
              </div>
            </form>
          )}

          {/* Task List */}
          <div className="space-y-3">
            {filteredTasks.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#321D35]/60 bg-[#FAF7F2] rounded-2xl">
                No milestones match the active filter.
              </div>
            ) : (
              filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-4 rounded-2xl editorial-border flex items-start justify-between gap-4 transition-all ${
                    task.completed
                      ? 'bg-[#FAF7F2]/50 opacity-80'
                      : 'bg-[#FAF7F2] hover:bg-white hover:editorial-shadow'
                  }`}
                >
                  <div className="flex items-start gap-3 flex-1">
                    {/* Completion checkbox button */}
                    <button
                      type="button"
                      onClick={() => onToggleTask(task.id)}
                      className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                        task.completed
                          ? 'bg-[#321D35] text-[#D8BD91]'
                          : 'border-2 border-[#321D35]/30 hover:border-[#321D35] bg-white'
                      }`}
                      aria-label={task.completed ? 'Mark task pending' : 'Mark task completed'}
                    >
                      {task.completed && <Check className="w-4 h-4 stroke-[3]" />}
                    </button>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-[#E88D83]">
                          {task.phase}
                        </span>
                        <span className="text-xs text-[#28262B]/50 font-mono">•</span>
                        <span className="text-[10px] font-mono text-[#321D35]/60">
                          {task.timeframe}
                        </span>
                        {task.isCustom && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] uppercase font-mono bg-[#E88D83]/20 text-[#CF695E]">
                            Custom
                          </span>
                        )}
                      </div>

                      <h4 className={`text-sm font-bold ${
                        task.completed ? 'line-through text-[#321D35]/60' : 'text-[#321D35]'
                      }`}>
                        {task.title}
                      </h4>

                      <p className="text-xs text-[#28262B]/75 font-light leading-relaxed">
                        {task.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-[11px] font-mono text-[#321D35]/60 hidden sm:inline">
                      Due: {task.dueDate}
                    </span>
                    {task.isCustom && (
                      <button
                        onClick={() => onDeleteTask(task.id)}
                        className="p-1 rounded text-[#CF695E] hover:bg-[#CF695E]/10"
                        title="Delete milestone"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      )}

      {/* 2. Day-of Itinerary Schedule */}
      {activeSubTab === 'schedule' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 editorial-border editorial-shadow space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#321D35]/10">
            <div>
              <h3 className="font-serif text-xl font-bold text-[#321D35]">Sequential Day-of Run-Sheet</h3>
              <p className="text-xs text-[#28262B]/75 font-light mt-0.5">
                Exact chapter breakdown for seamless on-site execution.
              </p>
            </div>
            <span className="text-xs font-mono text-[#A9B8A0] font-bold">
              ✓ Synchronized
            </span>
          </div>

          <div className="relative pl-6 sm:pl-8 border-l-2 border-[#321D35]/15 space-y-8 my-6">
            {schedule.map((item) => (
              <div key={item.id} className="relative group">
                {/* Timeline node */}
                <div className="absolute -left-[31px] sm:-left-[39px] top-1 w-4 h-4 rounded-full bg-[#FAF7F2] border-2 border-[#321D35] group-hover:bg-[#E88D83] transition-colors" />

                <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF7F2] editorial-border group-hover:bg-white group-hover:editorial-shadow transition-all space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-[#FAF7F2] bg-[#321D35] px-2.5 py-1 rounded-md">
                      {item.time}
                    </span>
                    <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-[#E88D83]">
                      Phase: {item.phase}
                    </span>
                  </div>

                  <h4 className="font-serif font-bold text-base text-[#321D35] pt-1">
                    {item.title}
                  </h4>

                  <p className="text-xs text-[#28262B]/80 font-light leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
