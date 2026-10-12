import React from 'react';

/**
 * Standard Form Select Component
 */
export function Select({
  label,
  id,
  value,
  onChange,
  options = [],
  required = false,
  error = null,
  helperText = null,
  className = '',
  disabled = false,
  ...rest
}) {
  const selectId = id || (label ? `select-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label htmlFor={selectId} className="form-label">
          {label} {required && <span className="text-rose">*</span>}
        </label>
      )}
      <select
        id={selectId}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`form-select ${error ? 'border-rose' : ''}`}
        {...rest}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="text-xs text-rose mt-1">{error}</span>}
      {!error && helperText && <span className="text-xs text-campus-muted mt-1">{helperText}</span>}
    </div>
  );
}

export default Select;
