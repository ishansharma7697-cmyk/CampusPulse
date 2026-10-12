import apiClient from './client.js';
import { generateSyntheticDataset } from '../services/dataGenerator.js';

/**
 * Telemetry API Service
 * Handles telemetry logs retrieval, simulated presets, and live stream updates.
 */
export const TelemetryService = {
  /**
   * Fetch primary telemetry records.
   * @returns {Promise<Array<Object>>}
   */
  async getTelemetryDataset() {
    return apiClient.get('/telemetry', {
      mockHandler: () => {
        return generateSyntheticDataset();
      }
    });
  },

  /**
   * Load simulated benchmark scenarios.
   * @param {'normal' | 'water_leak' | 'weekend_waste'} presetKey
   * @returns {Promise<Array<Object>>}
   */
  async loadPresetScenario(presetKey) {
    return apiClient.get(`/telemetry/presets/${presetKey}`, {
      mockHandler: () => {
        const dataset = generateSyntheticDataset();
        if (presetKey === 'water_leak') {
          dataset.forEach((d) => {
            if (d.building_name === 'Library Complex' && d.resource_type === 'water') {
              d.consumption = parseFloat((d.consumption * 2.5).toFixed(2));
            }
          });
        } else if (presetKey === 'weekend_waste') {
          dataset.forEach((d) => {
            if (d.day_type === 'weekend') {
              d.consumption = parseFloat((d.consumption * 1.85).toFixed(2));
            }
          });
        }
        return dataset;
      }
    });
  }
};

export default TelemetryService;
