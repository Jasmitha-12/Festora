'use client';

import React, { useState } from 'react';
import { BudgetAllocation, BudgetCategoryItem, EventType } from '@/types/event';
import {
  formatCurrency,
  recalculateBudget,
  generateRecommendedBudget,
} from '@/lib/budget/calculator';
import {
  PieChart,
  AlertTriangle,
  RotateCcw,
  Plus,
  Trash2,
  CheckCircle2,
} from 'lucide-react';

interface BudgetStudioProps {
  eventType: EventType;
  budget: BudgetAllocation;
  onChange: (updatedBudget: BudgetAllocation) => void;
}

export const BudgetStudio: React.FC<BudgetStudioProps> = ({
  eventType,
  budget,
  onChange,
}) => {
  const [newCatName, setNewCatName] = useState('');
  const [newCatAmount, setNewCatAmount] = useState<number>(0);
  const [showAddForm, setShowAddForm] = useState(false);

  // Handle category amount changes
  const handleAmountChange = (id: string, newAmount: number) => {
    const updatedCategories = budget.categories.map((cat) =>
      cat.id === id ? { ...cat, allocated: Math.max(0, newAmount) } : cat
    );
    const recalculated = recalculateBudget(updatedCategories, budget.totalBudget, budget.currency);
    onChange(recalculated);
  };

  // Reset to recommended
  const handleResetRecommended = () => {
    const recommended = generateRecommendedBudget(eventType, budget.totalBudget, budget.currency);
    onChange(recommended);
  };

  // Add custom category
  const handleAddCustomCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const newCat: BudgetCategoryItem = {
      id: `custom-cat-${Date.now()}`,
      name: newCatName.trim(),
      allocated: Math.max(0, newCatAmount),
      recommendedPercentage: 0,
      percentage: 0,
      description: 'Custom celebration expenditure item.',
      isCustom: true,
    };

    const updatedCategories = [...budget.categories, newCat];
    const recalculated = recalculateBudget(updatedCategories, budget.totalBudget, budget.currency);
    onChange(recalculated);
    setNewCatName('');
    setNewCatAmount(0);
    setShowAddForm(false);
  };

  // Remove category
  const handleRemoveCategory = (id: string) => {
    const updatedCategories = budget.categories.filter((cat) => cat.id !== id);
    const recalculated = recalculateBudget(updatedCategories, budget.totalBudget, budget.currency);
    onChange(recalculated);
  };

  const percentAllocated = budget.totalBudget > 0
    ? Math.round((budget.totalAllocated / budget.totalBudget) * 100)
    : 0;

  return (
    <div className="space-y-8">
      
      {/* Overview Financial HUD Bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 editorial-border editorial-shadow">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#321D35]/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <PieChart className="w-5 h-5 text-[#E88D83]" />
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#321D35]">
                Interactive Budget Studio
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#28262B]/75 font-light">
              Adjust category sliders in real-time. Calculations execute with integer precision to prevent fractional drift.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handleResetRecommended}
              className="px-4 py-2 rounded-xl bg-[#FAF7F2] hover:bg-[#321D35]/10 border border-[#321D35]/20 text-xs font-semibold text-[#321D35] flex items-center gap-1.5 transition-colors"
              title="Reset all categories to initial recommended proportions"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Recommended</span>
            </button>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
          
          {/* Total Budget */}
          <div className="p-4 rounded-2xl bg-[#FAF7F2] editorial-border">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#321D35]/60 block mb-1">
              Target Budget
            </span>
            <p className="font-serif text-2xl sm:text-3xl font-bold text-[#321D35]">
              {formatCurrency(budget.totalBudget, budget.currency)}
            </p>
            <span className="text-[11px] text-[#28262B]/60 mt-1 block font-mono">
              Base investment parameter
            </span>
          </div>

          {/* Total Allocated */}
          <div className="p-4 rounded-2xl bg-[#FAF7F2] editorial-border">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#321D35]/60 block mb-1">
              Total Allocated
            </span>
            <p className={`font-serif text-2xl sm:text-3xl font-bold ${
              budget.isOverBudget ? 'text-[#CF695E]' : 'text-[#321D35]'
            }`}>
              {formatCurrency(budget.totalAllocated, budget.currency)}
            </p>
            <span className="text-[11px] font-mono text-[#321D35]/70 mt-1 block">
              {percentAllocated}% of target budget
            </span>
          </div>

          {/* Remaining Balance or Overspend */}
          <div className={`p-4 rounded-2xl border ${
            budget.isOverBudget
              ? 'bg-[#CF695E]/10 border-[#CF695E]/30 text-[#CF695E]'
              : 'bg-[#A9B8A0]/15 border-[#A9B8A0]/40 text-[#7F9374]'
          }`}>
            <span className="text-[10px] font-mono uppercase tracking-wider text-current block mb-1 font-semibold">
              {budget.isOverBudget ? 'Budget Deficit (Over)' : 'Remaining Buffer'}
            </span>
            <p className="font-serif text-2xl sm:text-3xl font-bold text-current">
              {budget.isOverBudget
                ? `-${formatCurrency(budget.overspendAmount, budget.currency)}`
                : formatCurrency(budget.remaining, budget.currency)}
            </p>
            <span className="text-[11px] font-mono text-current mt-1 flex items-center gap-1 font-medium">
              {budget.isOverBudget ? (
                <>
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Exceeds target budget</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Available for contingency</span>
                </>
              )}
            </span>
          </div>

        </div>

        {/* Warning Banner if Over Budget */}
        {budget.isOverBudget && (
          <div
            role="alert"
            className="mt-6 p-4 rounded-2xl bg-[#CF695E]/10 border border-[#CF695E]/40 text-[#CF695E] flex items-center gap-3 animate-in fade-in"
          >
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <div className="text-xs leading-relaxed">
              <span className="font-bold">Budget threshold exceeded by {formatCurrency(budget.overspendAmount, budget.currency)}. </span>
              <span>Lower one or more category allocations or use &ldquo;Reset to Recommended&rdquo; to restore exact balance.</span>
            </div>
          </div>
        )}

        {/* Multi-segment Allocation Bar */}
        <div className="mt-8 space-y-2">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-[#321D35]/70">Visual Category Distribution</span>
            <span className="font-bold text-[#321D35]">{percentAllocated}% Committed</span>
          </div>
          <div className="h-3 w-full bg-[#FAF7F2] rounded-full overflow-hidden flex border border-[#321D35]/10">
            {budget.categories.map((cat, idx) => {
              const colors = ['#321D35', '#E88D83', '#D8BD91', '#A9B8A0', '#4A2B4E', '#CF695E', '#7F9374'];
              const color = colors[idx % colors.length];
              if (cat.allocated <= 0 || budget.totalBudget <= 0) return null;
              const widthPct = Math.min(100, (cat.allocated / budget.totalBudget) * 100);
              return (
                <div
                  key={cat.id}
                  title={`${cat.name}: ${cat.percentage}%`}
                  style={{ width: `${widthPct}%`, backgroundColor: color }}
                  className="h-full transition-all"
                />
              );
            })}
          </div>
        </div>

      </div>

      {/* Category Adjustment Sliders & Numerical Inputs */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 editorial-border editorial-shadow space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#321D35]/10">
          <div>
            <h3 className="font-serif text-xl font-bold text-[#321D35]">Category Allocations</h3>
            <p className="text-xs text-[#28262B]/70 font-light mt-0.5">
              Drag slider or type exact amounts to calibrate your spend.
            </p>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-3 py-1.5 rounded-lg bg-[#FAF7F2] hover:bg-[#321D35]/10 border border-[#321D35]/20 text-xs font-semibold text-[#321D35] flex items-center gap-1 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Category</span>
          </button>
        </div>

        {/* Add Category Form Modal / Accordion */}
        {showAddForm && (
          <form
            onSubmit={handleAddCustomCategory}
            className="p-5 rounded-2xl bg-[#FAF7F2] editorial-border space-y-4 animate-in fade-in"
          >
            <h4 className="text-xs font-mono uppercase font-bold text-[#321D35]">
              Add Custom Celebration Expenditure
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#321D35] mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Fireworks Display, Drone Operator"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#321D35]/20 bg-white text-xs focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#321D35] mb-1">
                  Initial Amount ({budget.currency})
                </label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={newCatAmount}
                  onChange={(e) => setNewCatAmount(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-[#321D35]/20 bg-white text-xs focus:outline-none"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#321D35]/70 hover:text-[#321D35]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-[#321D35] text-white text-xs font-semibold"
              >
                Save Category
              </button>
            </div>
          </form>
        )}

        {/* Categories List */}
        <div className="space-y-6">
          {budget.categories.map((cat) => {
            const maxSliderValue = Math.max(budget.totalBudget, cat.allocated * 1.5);
            return (
              <div
                key={cat.id}
                className="p-4 sm:p-5 rounded-2xl bg-[#FAF7F2] editorial-border transition-all hover:bg-[#FAF7F2]/80 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-serif font-bold text-base text-[#321D35]">{cat.name}</h4>
                      {cat.isCustom && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] uppercase font-mono font-semibold bg-[#E88D83]/20 text-[#CF695E]">
                          Custom
                        </span>
                      )}
                      <span className="text-xs font-mono text-[#321D35]/60">
                        {cat.percentage}% of total
                      </span>
                    </div>
                    <p className="text-xs text-[#28262B]/70 font-light mt-0.5">
                      {cat.description}
                    </p>
                  </div>

                  {/* Numerical Input & Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <div className="relative w-36">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-mono text-[#321D35]/60 font-semibold">
                        {budget.currency === 'INR' ? '₹' : budget.currency === 'EUR' ? '€' : budget.currency === 'GBP' ? '£' : '$'}
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="100"
                        value={cat.allocated}
                        onChange={(e) => handleAmountChange(cat.id, parseFloat(e.target.value) || 0)}
                        className="w-full pl-6 pr-2 py-1.5 text-right font-mono text-xs font-bold rounded-lg border border-[#321D35]/20 bg-white focus:outline-none focus:border-[#321D35]"
                        aria-label={`${cat.name} amount in ${budget.currency}`}
                      />
                    </div>

                    {cat.isCustom && (
                      <button
                        onClick={() => handleRemoveCategory(cat.id)}
                        className="p-1.5 rounded-lg text-[#CF695E] hover:bg-[#CF695E]/10 transition-colors"
                        title="Delete custom category"
                        aria-label={`Delete custom category: ${cat.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Range Slider Control */}
                <div className="flex items-center gap-3 pt-1">
                  <input
                    type="range"
                    min="0"
                    max={maxSliderValue}
                    step="50"
                    value={cat.allocated}
                    onChange={(e) => handleAmountChange(cat.id, parseFloat(e.target.value) || 0)}
                    className="w-full h-2 bg-white rounded-lg appearance-none cursor-pointer accent-[#321D35]"
                    aria-label={`Allocate budget for ${cat.name}`}
                  />
                  <span className="text-[10px] font-mono text-[#321D35]/60 whitespace-nowrap">
                    Rec: {cat.recommendedPercentage}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
