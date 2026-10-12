/**
 * Input Validation Utilities
 */

export function isValidEmail(email) {
  if (typeof email !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function isValidPassword(password, minLength = 6) {
  if (typeof password !== 'string') return false;
  return password.length >= minLength;
}

export function isValidDomain(domain) {
  if (typeof domain !== 'string') return false;
  const trimmed = domain.trim();
  return /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/.test(trimmed) ||
         /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(trimmed);
}

export function parsePositiveNumber(value, fallback = 0) {
  const parsed = Number(value);
  if (isNaN(parsed) || parsed < 0) return fallback;
  return parsed;
}
