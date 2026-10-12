/**
 * Synthetic Telemetry Data Generator
 * Generates realistic institutional telemetry across campus facilities with baselines and known anomaly events.
 */

export const DEFAULT_BUILDINGS = [
  'Library Complex',
  'Engineering Hub',
  'Science Center',
  'Student Union',
  'Athletic Dome'
];

/**
 * Generate synthetic 14-day hourly telemetry logs.
 * @param {Array<string>} buildings
 * @returns {Array<Object>}
 */
export function generateSyntheticDataset(buildings = DEFAULT_BUILDINGS) {
  const dataset = [];
  const now = new Date();

  // Generate 14 days of hourly data (336 hours per building)
  for (let d = 14; d >= 0; d--) {
    for (let h = 0; h < 24; h++) {
      const timestamp = new Date(now.getTime() - (d * 24 * 3600 * 1000) + (h * 3600 * 1000));
      const dayOfWeek = timestamp.getDay();
      const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);
      const dayType = isWeekend ? 'weekend' : 'weekday';
      const isOccupied = (!isWeekend && h >= 8 && h <= 18);
      const occupancyStatus = isOccupied ? 'occupied' : 'unoccupied';

      buildings.forEach(building => {
        // Base Electricity Profile
        const baseElec = isOccupied ? (120 + Math.random() * 40) : (30 + Math.random() * 15);
        let elecValue = baseElec;

        // Base Water Profile
        const baseWater = isOccupied ? (400 + Math.random() * 150) : (50 + Math.random() * 20);
        let waterValue = baseWater;

        // Specific Anomaly Scenario 1: Engineering Hub Off-Hour Spikes
        if (building === 'Engineering Hub' && d === 2 && h >= 1 && h <= 5) {
          elecValue = 190 + Math.random() * 30;
        }

        // Specific Anomaly Scenario 2: Science Center Continuous Overnight Water Leak
        if (building === 'Science Center' && d === 4 && h >= 0 && h <= 8) {
          waterValue = 650 + Math.random() * 80;
        }

        // Electricity Record
        dataset.push({
          id: `REC-ELEC-${building.substring(0, 3).toUpperCase()}-${d}-${h}`,
          timestamp: timestamp.toISOString(),
          building_name: building,
          meter_id: `MTR-ELEC-${building.substring(0, 3).toUpperCase()}`,
          resource_type: 'electricity',
          consumption: parseFloat(elecValue.toFixed(2)),
          expected_baseline: parseFloat(baseElec.toFixed(2)),
          unit: 'kWh',
          occupancy_status: occupancyStatus,
          day_type: dayType
        });

        // Water Record
        dataset.push({
          id: `REC-WATR-${building.substring(0, 3).toUpperCase()}-${d}-${h}`,
          timestamp: timestamp.toISOString(),
          building_name: building,
          meter_id: `MTR-WATR-${building.substring(0, 3).toUpperCase()}`,
          resource_type: 'water',
          consumption: parseFloat(waterValue.toFixed(2)),
          expected_baseline: parseFloat(baseWater.toFixed(2)),
          unit: 'L',
          occupancy_status: occupancyStatus,
          day_type: dayType
        });
      });
    }
  }

  return dataset;
}

/**
 * Generate a single simulated telemetry reading for the live stream.
 * @param {Array<string>} buildings
 * @returns {Object}
 */
export function generateLiveTelemetryReading(buildings = DEFAULT_BUILDINGS) {
  const building = buildings[Math.floor(Math.random() * buildings.length)];
  const isElectricity = Math.random() > 0.5;
  const resourceType = isElectricity ? 'electricity' : 'water';
  const baseline = isElectricity ? 95.0 : 320.0;
  
  // Random variance, occasionally an excess spike
  const hasSpike = Math.random() < 0.25;
  const consumption = hasSpike 
    ? baseline * (1.45 + Math.random() * 0.6)
    : baseline * (0.85 + Math.random() * 0.3);

  const now = new Date();
  const dayOfWeek = now.getDay();
  const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);
  const hour = now.getHours();
  const isOccupied = (!isWeekend && hour >= 8 && hour <= 18);

  return {
    id: `REC-LIVE-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: now.toISOString(),
    building_name: building,
    meter_id: `MTR-LIVE-${building.substring(0, 3).toUpperCase()}`,
    resource_type: resourceType,
    consumption: parseFloat(consumption.toFixed(2)),
    expected_baseline: parseFloat(baseline.toFixed(2)),
    unit: isElectricity ? 'kWh' : 'L',
    occupancy_status: isOccupied ? 'occupied' : 'unoccupied',
    day_type: isWeekend ? 'weekend' : 'weekday'
  };
}
