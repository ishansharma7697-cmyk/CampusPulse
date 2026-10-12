import React from 'react';

/**
 * Standard Form Input Component
 */
export function Input({
  label,
  id,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  required = false,
  min,
  max,
  step,
  error = null,
  helperText = null,
  className = '',
  disabled = false,
  ...rest
}) {
  const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label} {required && <span className="text-rose">*</span>}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        className={`form-input ${error ? 'border-rose' : ''}`}
        {...rest}
      />
      {error && <span className="text-xs text-rose mt-1">{error}</span>}
      {!error && helperText && <span className="text-xs text-campus-muted mt-1">{helperText}</span>}
    </div>
  );
}

export default Input;
