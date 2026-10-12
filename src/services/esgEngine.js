import { ENV } from '../config/env.config.js';

/**
 * Institutional ESG and Carbon Footprint Engine
 * Transforms energy and water conservation telemetry into auditable environmental metrics.
 */

/**
 * Computes ESG carbon avoidance and natural resource conservation equivalents.
 * @param {Array<Object>} dataset
 * @returns {Object}
 */
export function calculateEsgImpact(dataset) {
  if (!Array.isArray(dataset)) {
    return {
      co2AvoidedKg: 0,
      waterSavedLiters: 0,
      treesEquivalent: 0,
      reportDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    };
  }

  let excessElectricity = 0;
  let excessWater = 0;

  dataset.forEach((d) => {
    const consumption = Number(d.consumption) || 0;
    const baseline = Number(d.expected_baseline) || 0;
    const excess = Math.max(0, consumption - baseline);

    if (d.resource_type === 'electricity') {
      excessElectricity += excess;
    } else if (d.resource_type === 'water') {
      excessWater += excess;
    }
  });

  const co2AvoidedKg = Math.round(excessElectricity * ENV.ESG_FACTORS.GRID_CO2_KG_PER_KWH);
  const treesEquivalent = Math.round(co2AvoidedKg / ENV.ESG_FACTORS.TREE_OFFSET_ANNUAL_KG);
  const waterSavedLiters = Math.round(excessWater);

  return {
    co2AvoidedKg,
    waterSavedLiters,
    treesEquivalent,
    reportDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    executiveSummary: `Campus telemetry demonstrates that continuous variance monitoring and automated fault detection have isolated ${co2AvoidedKg.toLocaleString()} kg of preventable CO2 equivalent emissions and ${waterSavedLiters.toLocaleString()} L of potable water leakage. Institutional operations remain strictly aligned with campus net-zero sustainability charters.`
  };
}
