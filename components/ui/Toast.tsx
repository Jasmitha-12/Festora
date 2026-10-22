'use client';

import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToastProps {
  toast: ToastMessage | null;
  onDismiss: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  if (!toast) return null;

  const bgStyles = {
    success: 'bg-[#321D35] text-[#FAF7F2] border-[#D8BD91]/40',
    error: 'bg-[#CF695E] text-[#FAF7F2] border-[#FAF7F2]/20',
    info: 'bg-[#28262B] text-[#FAF7F2] border-[#A9B8A0]/30',
  }[toast.type];

  const Icon = {
    success: CheckCircle2,
    error: AlertCircle,
    info: Info,
  }[toast.type];

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 max-w-md animate-in fade-in slide-in-from-bottom-4 duration-300 no-print"
    >
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl border ${bgStyles}`}
      >
        <Icon className="w-5 h-5 flex-shrink-0 text-[#D8BD91]" />
        <span className="text-sm font-medium tracking-wide flex-1">{toast.message}</span>
        <button
          onClick={onDismiss}
          className="p-1 rounded-md hover:bg-white/10 transition-colors"
          aria-label="Close notification"
        >
          <X className="w-4 h-4 text-white/70 hover:text-white" />
        </button>
      </div>
    </div>
  );
};
