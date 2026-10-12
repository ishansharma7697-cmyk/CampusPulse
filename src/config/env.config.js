/**
 * Application Environment Configuration
 * Centralized registry for environment variables and build-time constants.
 * Business logic and UI components must read from this module rather than accessing import.meta.env directly.
 */

const getMetaEnv = () => {
  if (typeof import.meta !== 'undefined' && import.meta && import.meta.env) {
    return import.meta.env;
  }
  if (typeof process !== 'undefined' && process.env) {
    return process.env;
  }
  return {};
};

const metaEnv = getMetaEnv();

const getEnvNumber = (key, defaultValue) => {
  const value = metaEnv[key];
  if (value === undefined || value === '') return defaultValue;
  const parsed = Number(value);
  return isNaN(parsed) ? defaultValue : parsed;
};

const getEnvString = (key, defaultValue) => {
  const value = metaEnv[key];
  return value !== undefined && value !== '' ? String(value) : defaultValue;
};

const getEnvBoolean = (key, defaultValue) => {
  const value = metaEnv[key];
  if (value === undefined || value === '') return defaultValue;
  return value === 'true' || value === '1';
};

export const ENV = Object.freeze({
  APP_NAME: getEnvString('VITE_APP_NAME', 'CampusPulse Enterprise'),
  APP_VERSION: getEnvString('VITE_APP_VERSION', 'v3.2.0'),
  ENVIRONMENT: getEnvString('VITE_ENVIRONMENT', 'development'),
  IS_PROD: Boolean(metaEnv.PROD),
  IS_DEV: Boolean(metaEnv.DEV !== false),


  API: {
    BASE_URL: getEnvString('VITE_API_BASE_URL', 'https://api.campuspulse.internal/v1'),
    TIMEOUT_MS: 10000
  },

  SIMULATION: {
    INTERVAL_MS: getEnvNumber('VITE_SIMULATION_INTERVAL_MS', 3000),
    ENABLED: getEnvBoolean('VITE_ENABLE_LIVE_STREAM', true)
  },

  DOMAIN: {
    DEFAULT_CUSTOM_DOMAIN: getEnvString('VITE_DEFAULT_CUSTOM_DOMAIN', 'pulse.university.edu'),
    CNAME_TARGET: getEnvString('VITE_CNAME_TARGET', 'ingress.campuspulse.network')
  },

  TARIFF_DEFAULTS: {
    ELECTRICITY_PER_KWH: getEnvNumber('VITE_DEFAULT_ELEC_TARIFF', 8.50),
    WATER_PER_LITER: getEnvNumber('VITE_DEFAULT_WATER_TARIFF', 0.12),
    RECOVERY_RATE: 0.75,
    INFLATION_ANNUAL: 0.05
  },

  ESG_FACTORS: {
    GRID_CO2_KG_PER_KWH: getEnvNumber('VITE_GRID_CO2_FACTOR', 0.82),
    TREE_OFFSET_ANNUAL_KG: getEnvNumber('VITE_TREE_OFFSET_ANNUAL_KG', 21.8)
  }
});

export default ENV;
