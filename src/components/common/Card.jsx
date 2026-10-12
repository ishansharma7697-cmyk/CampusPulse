import React from 'react';

/**
 * Surface Container Card
 */
export function Card({
  children,
  title,
  subtitle,
  action,
  icon: Icon = null,
  className = '',
  headerClassName = ''
}) {
  return (
    <div className={`card ${className}`}>
      {(title || subtitle || action || Icon) && (
        <div className={`flex items-start justify-between gap-4 mb-4 ${headerClassName}`}>
          <div className="flex items-start gap-3">
            {Icon && (
              <div className="p-2 rounded bg-campus-container text-campus-bronze flex-shrink-0 mt-0.5">
                <Icon size={18} />
              </div>
            )}
            <div>
              {title && <h3 className="font-serif font-bold text-lg text-campus-text">{title}</h3>}
              {subtitle && <p className="text-xs text-campus-muted mt-0.5">{subtitle}</p>}
            </div>
          </div>
          {action && <div className="flex-shrink-0">{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

export default Card;
