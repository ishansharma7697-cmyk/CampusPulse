import { ENV } from './env.config.js';

/**
 * Institutional Utility Tariffs and Audit Benchmarks
 */
export const TARIFF_CONFIG = Object.freeze({
  CURRENCY: {
    CODE: 'INR',
    SYMBOL: '₹',
    LOCALE: 'en-IN'
  },
  DEFAULT_TARIFFS: {
    electricity: ENV.TARIFF_DEFAULTS.ELECTRICITY_PER_KWH,
    water: ENV.TARIFF_DEFAULTS.WATER_PER_LITER,
    recoveryRate: ENV.TARIFF_DEFAULTS.RECOVERY_RATE
  },
  ANOMALY_THRESHOLDS: {
    VARIANCE_MIN_RATIO: 0.40,     // 40% above baseline triggers an anomaly
    MEDIUM_RATIO: 0.50,           // 50% above baseline
    HIGH_RATIO: 0.80,             // 80% above baseline
    CRITICAL_RATIO: 1.20          // 120% above baseline
  },
  ESG: {
    CO2_FACTOR_KG_PER_KWH: ENV.ESG_FACTORS.GRID_CO2_KG_PER_KWH,
    TREE_OFFSET_ANNUAL_KG: ENV.ESG_FACTORS.TREE_OFFSET_ANNUAL_KG
  }
});
