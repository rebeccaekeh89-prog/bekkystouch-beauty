import React from 'react';
import { Check, X } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-center gap-3 bg-[#1E1B18] text-[#FAF9F5] px-4 py-3 rounded-xl shadow-xl border border-stone-700 text-xs font-medium">
        <div className="w-5 h-5 rounded-full bg-emerald-700 flex items-center justify-center shrink-0">
          <Check className="w-3 h-3 text-white" />
        </div>
        <span>{message}</span>
        <button
          onClick={onClose}
          className="text-stone-400 hover:text-white ml-2 p-1"
          aria-label="Close notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
