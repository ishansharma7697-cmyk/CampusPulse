import React, { useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * Standard Dialog Modal Component
 */
export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-md'
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div className={`relative bg-white border border-campus-border rounded-xl shadow-lg w-full ${maxWidth} overflow-hidden z-10 transition-all`}>
        <div className="flex items-center justify-between p-5 border-b border-campus-border">
          <div>
            {title && <h3 className="font-serif font-bold text-lg text-campus-text">{title}</h3>}
            {subtitle && <p className="text-xs text-campus-muted mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-campus-muted hover:text-campus-text hover:bg-campus-container transition"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
