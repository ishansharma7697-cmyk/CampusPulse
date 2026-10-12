import { TARIFF_CONFIG } from '../config/tariffs.config.js';

/**
 * Anomaly Detection & Statistical Variance Engine
 * Analyzes telemetry points against algorithmic baseline thresholds.
 */

/**
 * Determines anomaly severity based on baseline excess percentage.
 * @param {number} excess
 * @param {number} baseline
 * @returns {'Critical' | 'High' | 'Medium' | 'Low'}
 */
export function calculateAnomalySeverity(excess, baseline) {
  if (baseline <= 0) return 'Medium';
  const ratio = excess / baseline;
  const { CRITICAL_RATIO, HIGH_RATIO, MEDIUM_RATIO } = TARIFF_CONFIG.ANOMALY_THRESHOLDS;

  if (ratio >= CRITICAL_RATIO) return 'Critical';
  if (ratio >= HIGH_RATIO) return 'High';
  if (ratio >= MEDIUM_RATIO) return 'Medium';
  return 'Low';
}

/**
 * Generates an evidence explanation for the detected variance.
 * @param {Object} item
 * @param {number} ratio
 * @returns {string}
 */
export function generateEvidenceText(item, ratio) {
  if (item.occupancy_status === 'unoccupied') {
    return item.resource_type === 'water'
      ? 'Continuous off-hour baseflow indicates pipe leak'
      : 'Unoccupied overnight load spike (>150% baseline)';
  }
  if (ratio > 1.0) {
    return `Critical daytime surge (${(ratio * 100).toFixed(0)}% above normal operating band)`;
  }
  return 'Statistically elevated variance detected';
}

/**
 * Execute the statistical anomaly engine over an array of telemetry items.
 * @param {Array<Object>} dataset
 * @returns {Array<Object>} List of flagged anomaly objects
 */
export function runAnomalyEngine(dataset) {
  if (!Array.isArray(dataset)) return [];

  const anomalies = [];
  const minThreshold = TARIFF_CONFIG.ANOMALY_THRESHOLDS.VARIANCE_MIN_RATIO;

  dataset.forEach((item, index) => {
    if (typeof item.consumption !== 'number' || typeof item.expected_baseline !== 'number') {
      return;
    }

    const excess = item.consumption - item.expected_baseline;
    const thresholdDelta = item.expected_baseline * minThreshold;

    if (excess > thresholdDelta) {
      const severity = calculateAnomalySeverity(excess, item.expected_baseline);
      const ratio = excess / Math.max(1, item.expected_baseline);

      anomalies.push({
        id: `ANM-${item.meter_id.replace('MTR-', '')}-${new Date(item.timestamp).getTime().toString().slice(-6)}-${index}`,
        timestamp: item.timestamp,
        building: item.building_name,
        meter_id: item.meter_id,
        resource: item.resource_type,
        value: parseFloat(item.consumption.toFixed(2)),
        expected: parseFloat(item.expected_baseline.toFixed(2)),
        excess: parseFloat(excess.toFixed(2)),
        unit: item.unit,
        severity: severity,
        status: 'New',
        evidence: generateEvidenceText(item, ratio)
      });
    }
  });

  return anomalies;
}

/**
 * Computes automated diagnostic summaries by facility.
 * @param {Array<Object>} anomalies
 * @returns {Array<Object>}
 */
export function generateDiagnosticFindings(anomalies) {
  if (!Array.isArray(anomalies) || anomalies.length === 0) {
    return [];
  }

  const facilityMap = {};
  anomalies.forEach((a) => {
    if (!facilityMap[a.building]) {
      facilityMap[a.building] = {
        building: a.building,
        count: 0,
        resources: new Set(),
        criticalCount: 0,
        primaryEvidence: a.evidence
      };
    }
    facilityMap[a.building].count++;
    facilityMap[a.building].resources.add(a.resource);
    if (a.severity === 'Critical') facilityMap[a.building].criticalCount++;
  });

  return Object.values(facilityMap).map((entry) => {
    const resourceList = Array.from(entry.resources).join(' & ');
    let recommendedAction = 'Inspect HVAC chiller schedule and sub-meter logs';
    if (entry.resources.has('water') && entry.criticalCount > 0) {
      recommendedAction = 'Dispatch acoustic leak inspection to basement mains';
    } else if (entry.criticalCount > 0) {
      recommendedAction = 'Audit building automation schedule for overnight setbacks';
    }

    return {
      building: entry.building,
      count: entry.count,
      criticalCount: entry.criticalCount,
      resources: resourceList,
      summary: `Identified ${entry.count} anomalous load events for ${resourceList}. ${entry.primaryEvidence}.`,
      action: recommendedAction
    };
  });
}
