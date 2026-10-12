import { TARIFF_CONFIG } from '../config/tariffs.config.js';

/**
 * Common Formatting Utilities
 * Standardized string and number formatting across the platform.
 */

/**
 * Format a number with institutional locale commas.
 * @param {number} value
 * @param {number} decimals
 * @returns {string}
 */
export function formatNumber(value, decimals = 0) {
  if (value === null || value === undefined || isNaN(value)) return '0';
  return Number(value).toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

/**
 * Format an institutional currency amount (₹).
 * @param {number} amount
 * @returns {string}
 */
export function formatCurrency(amount) {
  if (amount === null || amount === undefined || isNaN(amount)) return `${TARIFF_CONFIG.CURRENCY.SYMBOL}0`;
  return `${TARIFF_CONFIG.CURRENCY.SYMBOL}${formatNumber(Math.round(amount))}`;
}

/**
 * Format electricity energy unit.
 * @param {number} kwh
 * @returns {string}
 */
export function formatElectricity(kwh) {
  return `${formatNumber(Math.round(kwh))} kWh`;
}

/**
 * Format water volume unit.
 * @param {number} liters
 * @returns {string}
 */
export function formatWater(liters) {
  return `${formatNumber(Math.round(liters))} L`;
}

/**
 * Format timestamp into date-time string without em dashes.
 * @param {string|Date} timestamp
 * @param {boolean} includeTime
 * @returns {string}
 */
export function formatDateTime(timestamp, includeTime = true) {
  if (!timestamp) return 'N/A';
  const d = new Date(timestamp);
  if (isNaN(d.getTime())) return 'Invalid Date';

  const options = {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  };

  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
    options.hour12 = false;
  }

  return d.toLocaleString('en-US', options);
}

/**
 * Format timestamp for time-only display (e.g. 14:00).
 * @param {string|Date} timestamp
 * @returns {string}
 */
export function formatHour(timestamp) {
  if (!timestamp) return '00:00';
  const d = new Date(timestamp);
  return `${String(d.getHours()).padStart(2, '0')}:00`;
}
