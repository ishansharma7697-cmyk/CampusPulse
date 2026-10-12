import { ENV } from '../config/env.config.js';

/**
 * Financial & Tariff Calculations Engine
 * Computes waste costs, target recovery, and multi-year ROI projections.
 */

/**
 * Calculate financial impact metrics for a filtered telemetry set.
 * @param {Array<Object>} dataset
 * @param {Object} tariffs { electricity, water, recoveryRate }
 * @returns {Object}
 */
export function calculateFinancialImpact(dataset, tariffs) {
  if (!Array.isArray(dataset)) {
    return {
      totalElectricity: 0,
      excessElectricity: 0,
      totalWater: 0,
      excessWater: 0,
      financialLoss: 0,
      savingsTarget: 0,
      annualSavings: 0,
      efficiencyScore: 100
    };
  }

  const elecTariff = Number(tariffs.electricity) || ENV.TARIFF_DEFAULTS.ELECTRICITY_PER_KWH;
  const waterTariff = Number(tariffs.water) || ENV.TARIFF_DEFAULTS.WATER_PER_LITER;
  const recoveryRate = Number(tariffs.recoveryRate) || ENV.TARIFF_DEFAULTS.RECOVERY_RATE;

  let totalElectricity = 0;
  let excessElectricity = 0;
  let totalWater = 0;
  let excessWater = 0;
  let totalBaseline = 0;
  let totalActual = 0;

  let minTime = Infinity;
  let maxTime = -Infinity;

  dataset.forEach((d) => {
    const consumption = Number(d.consumption) || 0;
    const baseline = Number(d.expected_baseline) || 0;
    const excess = Math.max(0, consumption - baseline);

    totalBaseline += baseline;
    totalActual += consumption;

    if (d.resource_type === 'electricity') {
      totalElectricity += consumption;
      excessElectricity += excess;
    } else if (d.resource_type === 'water') {
      totalWater += consumption;
      excessWater += excess;
    }

    if (d.timestamp) {
      const t = new Date(d.timestamp).getTime();
      if (!isNaN(t)) {
        if (t < minTime) minTime = t;
        if (t > maxTime) maxTime = t;
      }
    }
  });

  const financialLoss = (excessElectricity * elecTariff) + (excessWater * waterTariff);
  const savingsTarget = financialLoss * recoveryRate;

  // Dynamically annualize from actual observed time span (prevents double-counting across multi-day filters)
  const elapsedDays = (maxTime > minTime && minTime !== Infinity)
    ? Math.max(1, (maxTime - minTime) / (24 * 3600 * 1000))
    : 7;

  const dailyLoss = financialLoss / elapsedDays;
  const annualSavings = dailyLoss * 365 * recoveryRate;


  const efficiencyScore = totalActual > 0
    ? Math.max(0, Math.min(100, Math.round((totalBaseline / totalActual) * 100)))
    : 100;

  return {
    totalElectricity: Math.round(totalElectricity),
    excessElectricity: Math.round(excessElectricity),
    totalWater: Math.round(totalWater),
    excessWater: Math.round(excessWater),
    financialLoss: Math.round(financialLoss),
    savingsTarget: Math.round(savingsTarget),
    annualSavings: Math.round(annualSavings),
    efficiencyScore
  };
}

/**
 * Calculates 5-Year Cumulative Savings with compound inflation factor.
 * @param {number} annualSavings
 * @param {number} inflationRate
 * @returns {Array<Object>}
 */
export function calculateFiveYearProjection(annualSavings, inflationRate = ENV.TARIFF_DEFAULTS.INFLATION_ANNUAL) {
  const years = ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'];
  let cumulative = 0;

  return years.map((yearLabel, index) => {
    const yearMultiplier = Math.pow(1 + inflationRate, index);
    const yearlyAdjusted = annualSavings * yearMultiplier;
    cumulative += yearlyAdjusted;

    return {
      year: yearLabel,
      yearlySavings: Math.round(yearlyAdjusted),
      cumulativeSavings: Math.round(cumulative)
    };
  });
}
