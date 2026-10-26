'use client';

import React, { useState } from 'react';
import { TaskMilestone, ScheduleItem } from '@/types/event';
import {
  Clock,
  Plus,
  Check,
  Trash2,
  Edit2,
  X,
} from 'lucide-react';

interface TimelineScheduleViewProps {
  schedule: ScheduleItem[];
  timeline: TaskMilestone[];
  onToggleTask: (taskId: string) => void;
  onAddTask: (newTask: Omit<TaskMilestone, 'id'>) => void;
  onEditTask?: (taskId: string, updated: Partial<TaskMilestone>) => void;
  onDeleteTask: (taskId: string) => void;
}

export const TimelineScheduleView: React.FC<TimelineScheduleViewProps> = ({
  schedule,
  timeline,
  onToggleTask,
  onAddTask,
  onEditTask,
  onDeleteTask,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'timeline' | 'schedule'>('timeline');
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  
  // Custom task form state
  const [showAddModal, setShowAddModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('');
  const taskCategory = 'General';
  const taskPhase = 'Phase 3: Details';
  const taskTimeframe = '2 Weeks Out';

  // Edit task state
  const [editingTask, setEditingTask] = useState<TaskMilestone | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDueDate, setEditDueDate] = useState('');
  const [editDescription, setEditDescription] = useState('');

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

  const handleStartEdit = (task: TaskMilestone) => {
    setEditingTask(task);
    setEditTitle(task.title);
    setEditDueDate(task.dueDate);
    setEditDescription(task.description);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask || !editTitle.trim()) return;

    if (onEditTask) {
      onEditTask(editingTask.id, {
        title: editTitle.trim(),
        dueDate: editDueDate,
        description: editDescription.trim(),
      });
    }

    setEditingTask(null);
  };

  React.useEffect(() => {
    if (!editingTask) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setEditingTask(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editingTask]);

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
            Day-of Run-Sheet ({schedule.length} Chapters)
          </button>
        </div>
      </div>

      {/* Edit Milestone Modal */}
      {editingTask && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-milestone-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setEditingTask(null);
          }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full editorial-border editorial-shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#321D35]/10">
              <h3 id="edit-milestone-title" className="font-serif text-xl font-bold text-[#321D35]">Edit Milestone</h3>
              <button
                type="button"
                onClick={() => setEditingTask(null)}
                aria-label="Close edit milestone modal"
                className="p-1 rounded-lg text-[#321D35]/60 hover:text-[#321D35]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-mono text-[#321D35]/70 font-semibold mb-1">
                  Milestone Title
                </label>
                <input
                  type="text"
                  value={editTitle}
                  autoFocus
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#321D35]/20 text-xs text-[#321D35] focus:outline-none focus:border-[#321D35]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-mono text-[#321D35]/70 font-semibold mb-1">
                  Target Due Date
                </label>
                <input
                  type="date"
                  value={editDueDate}
                  onChange={(e) => setEditDueDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#321D35]/20 text-xs text-[#321D35] focus:outline-none focus:border-[#321D35]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-mono text-[#321D35]/70 font-semibold mb-1">
                  Description & Execution Notes
                </label>
                <textarea
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#321D35]/20 text-xs text-[#321D35] focus:outline-none focus:border-[#321D35]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingTask(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#321D35] border border-[#321D35]/20 hover:bg-[#FAF7F2]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#321D35] text-white hover:bg-[#4A2B4E]"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 1. Preparation Milestones View */}
      {activeSubTab === 'timeline' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 editorial-border editorial-shadow space-y-6">
          {/* Header & Quick Stats */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#321D35]/10">
            <div>
              <h3 className="font-serif text-xl font-bold text-[#321D35]">
                Milestone Execution Tracker
              </h3>
              <p className="text-xs text-[#28262B]/75 font-light mt-0.5">
                Check off deliverables as you lock down venues, menus, and contracts.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Filter Buttons */}
              <div className="flex rounded-lg bg-[#FAF7F2] p-1 editorial-border text-[11px] font-semibold">
                {(['all', 'pending', 'completed'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setFilter(mode)}
                    aria-pressed={filter === mode}
                    className={`px-2.5 py-1 rounded capitalize transition-colors ${
                      filter === mode
                        ? 'bg-[#321D35] text-white'
                        : 'text-[#321D35]/60 hover:text-[#321D35]'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>

              {/* Add Custom Task CTA */}
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="px-3.5 py-1.5 rounded-xl bg-[#321D35] hover:bg-[#4A2B4E] text-[#FAF7F2] text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Task</span>
              </button>
            </div>
          </div>

          {/* Overall Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#321D35]/70">Overall Completion</span>
              <span className="font-bold text-[#321D35]">{progressPct}% Complete</span>
            </div>
            <div className="h-2 w-full bg-[#FAF7F2] rounded-full overflow-hidden editorial-border">
              <div
                className="h-full bg-gradient-to-r from-[#D8BD91] to-[#E88D83] transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* Add Task Inline Form */}
          {showAddModal && (
            <form
              onSubmit={handleCreateTask}
              className="p-4 rounded-2xl bg-[#FAF7F2] editorial-border space-y-3"
            >
              <h4 className="text-xs font-serif font-bold text-[#321D35]">Create New Custom Milestone</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Task title (e.g. Schedule Cake Tasting)"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="sm:col-span-2 px-3 py-2 rounded-xl bg-white border border-[#321D35]/15 text-xs text-[#321D35] focus:outline-none focus:border-[#321D35]"
                  required
                />
                <input
                  type="date"
                  value={taskDueDate}
                  onChange={(e) => setTaskDueDate(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-white border border-[#321D35]/15 text-xs text-[#321D35] focus:outline-none focus:border-[#321D35]"
                />
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
                      role="checkbox"
                      aria-checked={task.completed}
                      onClick={() => onToggleTask(task.id)}
                      className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                        task.completed
                          ? 'bg-[#321D35] text-[#D8BD91]'
                          : 'border-2 border-[#321D35]/30 hover:border-[#321D35] bg-white'
                      }`}
                      aria-label={task.completed ? `Mark "${task.title}" pending` : `Mark "${task.title}" completed`}
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

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[11px] font-mono text-[#321D35]/60 hidden sm:inline mr-2">
                      Due: {task.dueDate}
                    </span>

                    {/* Edit button */}
                    <button
                      type="button"
                      onClick={() => handleStartEdit(task)}
                      className="p-1 rounded text-[#321D35]/60 hover:text-[#321D35] hover:bg-black/5"
                      title="Edit milestone"
                      aria-label={`Edit milestone: ${task.title}`}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete button (for custom or any task) */}
                    <button
                      type="button"
                      onClick={() => onDeleteTask(task.id)}
                      className="p-1 rounded text-[#CF695E] hover:bg-[#CF695E]/10"
                      title="Delete milestone"
                      aria-label={`Delete milestone: ${task.title}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
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
