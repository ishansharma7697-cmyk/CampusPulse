import React from 'react';
import { Inbox } from 'lucide-react';
import Button from './Button.jsx';

/**
 * Reusable Empty State Display
 */
export function EmptyState({
  title = 'No Records Found',
  description = 'There are no items matching the currently applied telemetry criteria.',
  icon: Icon = Inbox,
  actionLabel = null,
  onAction = null
}) {
  return (
    <div className="p-12 text-center flex flex-col items-center justify-center space-y-3">
      <div className="w-12 h-12 rounded bg-campus-container text-campus-muted flex items-center justify-center">
        <Icon size={24} />
      </div>
      <h4 className="font-serif font-bold text-base text-campus-text">{title}</h4>
      <p className="text-xs text-campus-muted max-w-sm">{description}</p>
      {actionLabel && onAction && (
        <div className="pt-2">
          <Button variant="secondary" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}

export default EmptyState;
