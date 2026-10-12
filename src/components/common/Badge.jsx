import React from 'react';

/**
 * Institutional Status Badge
 * Reusable badge component with color variants. Strictly no emoji glyphs.
 */
export function Badge({
  children,
  variant = 'neutral', // 'bronze' | 'emerald' | 'amber' | 'rose' | 'blue' | 'neutral'
  className = '',
  icon: Icon = null
}) {
  const variantClass = {
    bronze: 'badge-bronze',
    emerald: 'badge-emerald',
    amber: 'badge-amber',
    rose: 'badge-rose',
    blue: 'badge-blue',
    neutral: 'badge-neutral'
  }[variant] || 'badge-neutral';

  return (
    <span className={`badge ${variantClass} ${className}`}>
      {Icon && <Icon size={12} />}
      <span>{children}</span>
    </span>
  );
}

export default Badge;
