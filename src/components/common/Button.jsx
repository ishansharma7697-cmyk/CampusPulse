import React from 'react';

/**
 * Enterprise Action Button
 * Strict rectangular styling with subtle 6px corner radius.
 * Pill-shaped buttons are explicitly disallowed per institutional design guidelines.
 */
export function Button({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'subtle' | 'danger'
  size = 'md',        // 'sm' | 'md' | 'lg'
  icon: Icon = null,
  iconPosition = 'left',
  disabled = false,
  className = '',
  onClick,
  type = 'button',
  ...rest
}) {
  const variantClass = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    subtle: 'btn-subtle',
    danger: 'btn-danger'
  }[variant] || 'btn-primary';

  const sizeClass = {
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg'
  }[size] || '';

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`btn ${variantClass} ${sizeClass} ${className}`}
      {...rest}
    >
      {Icon && iconPosition === 'left' && <Icon size={size === 'sm' ? 14 : 16} />}
      {children}
      {Icon && iconPosition === 'right' && <Icon size={size === 'sm' ? 14 : 16} />}
    </button>
  );
}

export default Button;
