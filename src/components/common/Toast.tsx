import React from 'react';
import { useFairShift } from '../../context/FairShiftContext';
import { CheckCircle2, AlertTriangle, Info, XCircle } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast } = useFairShift();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-teal-400 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
    error: <XCircle className="w-5 h-5 text-rose-400 shrink-0" />,
  };

  const bgStyles = {
    success: 'border-emerald-800 bg-slate-900/95 text-emerald-100',
    info: 'border-teal-800 bg-slate-900/95 text-teal-100',
    warning: 'border-amber-800 bg-slate-900/95 text-amber-100',
    error: 'border-rose-800 bg-slate-900/95 text-rose-100',
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-md animate-in fade-in slide-in-from-bottom-3 duration-300">
      <div
        className={`flex items-start gap-3 px-4 py-3 rounded-xl border shadow-2xl backdrop-blur-md ${
          bgStyles[toast.type]
        }`}
      >
        {icons[toast.type]}
        <div className="text-sm font-medium leading-relaxed pr-2">{toast.message}</div>
      </div>
    </div>
  );
};
