import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';
import { useTelemetry } from '../../context/TelemetryContext.jsx';

/**
 * Toast Notification Stack Container
 */
export function ToastContainer() {
  const { toasts, removeToast } = useTelemetry();

  if (!toasts || toasts.length === 0) return null;

  const iconMap = {
    success: <CheckCircle size={16} className="text-emerald flex-shrink-0" />,
    warning: <AlertTriangle size={16} className="text-amber flex-shrink-0" />,
    error: <XCircle size={16} className="text-rose flex-shrink-0" />,
    info: <Info size={16} className="text-campus-bronze flex-shrink-0" />
  };

  const borderClass = {
    success: 'border-l-4 border-l-emerald bg-white',
    warning: 'border-l-4 border-l-amber bg-white',
    error: 'border-l-4 border-l-rose bg-white',
    info: 'border-l-4 border-l-campus-bronze bg-white'
  };

  return (
    <div
      className="fixed top-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`p-3.5 rounded border border-campus-border shadow-md text-xs font-medium flex items-center justify-between gap-3 pointer-events-auto transition ${borderClass[toast.type] || borderClass.info}`}
        >
          <div className="flex items-center gap-2.5">
            {iconMap[toast.type] || iconMap.info}
            <span className="text-campus-text">{toast.message}</span>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-campus-muted hover:text-campus-text p-1 transition"
            aria-label="Dismiss notification"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}

export default ToastContainer;
