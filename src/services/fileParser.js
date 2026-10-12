import Papa from 'papaparse';
import * as XLSX from 'xlsx';

/**
 * Resilient Date Parser
 * Handles ISO strings, Excel dates, Unix timestamps, and international DD/MM/YYYY formats.
 */
export function parseRobustDate(dateVal, fallbackOffsetHours = 0) {
  if (!dateVal && dateVal !== 0) {
    const d = new Date();
    d.setHours(d.getHours() - fallbackOffsetHours);
    return d.toISOString();
  }

  if (dateVal instanceof Date && !isNaN(dateVal.getTime())) {
    return dateVal.toISOString();
  }

  // Numeric epoch or Excel serial date
  if (typeof dateVal === 'number' || (!isNaN(Number(dateVal)) && String(dateVal).trim() !== '')) {
    const num = Number(dateVal);
    // Excel serial date (e.g. 45000 is year 2023)
    if (num > 25000 && num < 65000) {
      const excelEpoch = new Date(Date.UTC(1899, 11, 30));
      const jsDate = new Date(excelEpoch.getTime() + num * 86400000);
      return jsDate.toISOString();
    }
    // Unix timestamp in seconds
    if (num > 1000000000 && num < 2000000000) {
      return new Date(num * 1000).toISOString();
    }
    // Unix timestamp in ms
    if (num >= 1000000000000) {
      return new Date(num).toISOString();
    }
  }

  const str = String(dateVal).trim();
  const directDate = new Date(str);
  if (!isNaN(directDate.getTime())) {
    return directDate.toISOString();
  }

  // Handle DD/MM/YYYY or DD-MM-YYYY format
  const dmyMatch = str.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})(?:\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?/);
  if (dmyMatch) {
    const day = parseInt(dmyMatch[1], 10);
    const month = parseInt(dmyMatch[2], 10) - 1;
    let year = parseInt(dmyMatch[3], 10);
    if (year < 100) year += 2000;
    const hour = dmyMatch[4] ? parseInt(dmyMatch[4], 10) : 0;
    const minute = dmyMatch[5] ? parseInt(dmyMatch[5], 10) : 0;
    const second = dmyMatch[6] ? parseInt(dmyMatch[6], 10) : 0;
    const constructed = new Date(year, month, day, hour, minute, second);
    if (!isNaN(constructed.getTime())) {
      return constructed.toISOString();
    }
  }

  // Fallback to recent date
  const fallback = new Date();
  fallback.setHours(fallback.getHours() - fallbackOffsetHours);
  return fallback.toISOString();
}

/**
 * Extracts a numeric value from string or number with currency/unit cleaning.
 */
function parseNumericValue(val, fallback = 0) {
  if (val === null || val === undefined) return fallback;
  if (typeof val === 'number') return isNaN(val) ? fallback : val;
  const cleanStr = String(val).replace(/,/g, '').replace(/[^0-9.-]/g, '');
  const parsed = parseFloat(cleanStr);
  return isNaN(parsed) ? fallback : parsed;
}

/**
 * Fuzzy search to resolve column names regardless of casing, spaces, or underscores.
 */
function findRowValue(row, possibleKeys) {
  for (const k of Object.keys(row)) {
    const cleanKey = k.toLowerCase().replace(/[^a-z0-9]/g, '');
    for (const target of possibleKeys) {
      if (cleanKey === target || cleanKey.includes(target)) {
        if (row[k] !== undefined && row[k] !== null && String(row[k]).trim() !== '') {
          return row[k];
        }
      }
    }
  }
  return null;
}

/**
 * Normalizes an individual raw row from CSV or XLSX into a strict TelemetryRecord.
 * @param {Object} raw
 * @param {number} rowIndex
 * @returns {Object|null}
 */
export function normalizeTelemetryRow(raw, rowIndex = 0) {
  if (!raw || typeof raw !== 'object') return null;

  // Resolve Building / Facility
  const rawBuilding = findRowValue(raw, [
    'buildingname', 'building', 'facility', 'facilityname', 'location', 'site', 'campusbuilding', 'property'
  ]);
  const building = rawBuilding ? String(rawBuilding).trim() : 'Library Complex';

  // Resolve Timestamp
  const rawTimestamp = findRowValue(raw, [
    'timestamp', 'datetime', 'date', 'time', 'readingtime', 'recordedat', 'period'
  ]);
  const timestampIso = parseRobustDate(rawTimestamp, rowIndex);

  // Resolve Meter ID
  const rawMeter = findRowValue(raw, [
    'meterid', 'meter', 'meternumber', 'metercode', 'sensorid', 'deviceid', 'id'
  ]);
  const meterId = rawMeter ? String(rawMeter).trim() : `MTR-${building.substring(0, 3).toUpperCase()}`;

  // Resolve Resource Type & Unit
  const rawResource = findRowValue(raw, [
    'resourcetype', 'resource', 'utility', 'utilitytype', 'type', 'energytype'
  ]);
  const rawUnit = findRowValue(raw, [
    'unit', 'units', 'uom', 'measurementunit'
  ]);

  let resourceStr = String(rawResource || '').toLowerCase().trim();
  let unit = String(rawUnit || '').trim();

  // Infer resource from meter ID or unit if not explicit
  if (!resourceStr) {
    if (meterId.toLowerCase().includes('watr') || meterId.toLowerCase().includes('water') || unit.toLowerCase() === 'l' || unit.toLowerCase().includes('m3')) {
      resourceStr = 'water';
    } else {
      resourceStr = 'electricity';
    }
  }

  // Resolve Consumption Value
  const rawVal = findRowValue(raw, [
    'consumption', 'usage', 'value', 'kwh', 'liters', 'litres', 'flow', 'reading', 'actual', 'amount', 'load', 'energy', 'volume'
  ]);
  let val = parseNumericValue(rawVal, 0);

  // Default units if missing
  if (!unit) {
    unit = resourceStr.includes('water') ? 'L' : 'kWh';
  }

  // Unit conversion: cubic meters to liters
  const isCubicMeters = unit.toLowerCase().includes('m3') || unit.toLowerCase().includes('m^3') || unit.toLowerCase().includes('cubic');
  if (isCubicMeters) {
    val = val * 1000;
    unit = 'L';
  }

  // Resolve Expected Baseline
  const rawBaseline = findRowValue(raw, [
    'expectedbaseline', 'baseline', 'expected', 'normal', 'target', 'baseload', 'predicted'
  ]);
  let baseline = parseNumericValue(rawBaseline, null);

  // If baseline is not provided, estimate a realistic baseline
  if (baseline === null || baseline <= 0) {
    baseline = Math.round(val * 0.85 * 100) / 100;
  } else if (isCubicMeters || String(rawBaseline).toLowerCase().includes('m3') || String(rawBaseline).toLowerCase().includes('m^3')) {
    baseline = baseline * 1000;
  }


  // Resolve Occupancy Status & Day Type
  const rawOccupancy = findRowValue(raw, ['occupancystatus', 'occupancy', 'occupied', 'status', 'mode']);
  const rawDayType = findRowValue(raw, ['daytype', 'day', 'dayofweek', 'weekday']);

  const hour = new Date(timestampIso).getHours();
  const dayOfWeek = new Date(timestampIso).getDay();
  const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);

  const occupancy = rawOccupancy
    ? String(rawOccupancy).toLowerCase()
    : (!isWeekend && hour >= 8 && hour <= 18 ? 'occupied' : 'unoccupied');

  const dayType = rawDayType
    ? String(rawDayType).toLowerCase()
    : (isWeekend ? 'weekend' : 'weekday');

  return {
    id: `INGEST-${Date.now()}-${rowIndex}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: timestampIso,
    building_name: building,
    meter_id: meterId,
    resource_type: resourceStr.includes('wat') ? 'water' : 'electricity',
    consumption: parseFloat(val.toFixed(2)),
    expected_baseline: parseFloat(baseline.toFixed(2)),
    unit: unit,
    occupancy_status: occupancy.includes('unocc') ? 'unoccupied' : 'occupied',
    day_type: dayType.includes('weekend') ? 'weekend' : 'weekday'
  };
}

/**
 * Generate a rich, multi-day, multi-building sample dataset (150+ realistic rows).
 * @returns {Array<Object>}
 */
export function generateComprehensiveSampleDataset() {
  const buildings = ['Library Complex', 'Engineering Hub', 'Science Center', 'Student Union', 'Athletic Dome'];
  const data = [];
  const now = new Date();

  // Generate 7 days of hourly logs (168 hours total)
  for (let d = 7; d >= 0; d--) {
    for (let h = 0; h < 24; h += 2) { // Every 2 hours for high-density, legible data
      const timestamp = new Date(now.getTime() - (d * 24 * 3600 * 1000) + (h * 3600 * 1000));
      const dayOfWeek = timestamp.getDay();
      const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);
      const isOccupied = (!isWeekend && h >= 8 && h <= 18);
      const occupancy = isOccupied ? 'occupied' : 'unoccupied';
      const dayType = isWeekend ? 'weekend' : 'weekday';

      buildings.forEach((building) => {
        // Electricity base
        let baseElec = isOccupied ? (120 + Math.random() * 35) : (35 + Math.random() * 15);
        let actualElec = baseElec * (0.95 + Math.random() * 0.1);

        // Water base
        let baseWater = isOccupied ? (380 + Math.random() * 120) : (45 + Math.random() * 20);
        let actualWater = baseWater * (0.95 + Math.random() * 0.1);

        // Inject intentional real-world anomalies for rich dashboard insights
        if (building === 'Engineering Hub' && (isWeekend || (h >= 1 && h <= 5))) {
          // Off-hour HVAC overrun
          actualElec = baseElec * 2.3;
        }

        if (building === 'Science Center' && d === 2 && h >= 2 && h <= 8) {
          // Continuous overnight water pipe leak
          actualWater = baseWater * 3.4;
        }

        if (building === 'Athletic Dome' && h === 16 && !isWeekend) {
          // Peak daytime stadium lighting surge
          actualElec = baseElec * 1.8;
        }

        // Electricity row
        data.push({
          timestamp: timestamp.toISOString(),
          building_name: building,
          meter_id: `MTR-ELEC-${building.substring(0, 3).toUpperCase()}`,
          resource_type: 'electricity',
          consumption: parseFloat(actualElec.toFixed(2)),
          expected_baseline: parseFloat(baseElec.toFixed(2)),
          unit: 'kWh',
          occupancy_status: occupancy,
          day_type: dayType
        });

        // Water row
        data.push({
          timestamp: timestamp.toISOString(),
          building_name: building,
          meter_id: `MTR-WATR-${building.substring(0, 3).toUpperCase()}`,
          resource_type: 'water',
          consumption: parseFloat(actualWater.toFixed(2)),
          expected_baseline: parseFloat(baseWater.toFixed(2)),
          unit: 'L',
          occupancy_status: occupancy,
          day_type: dayType
        });
      });
    }
  }

  return data;
}

/**
 * Parse uploaded File object (CSV or XLSX) into valid normalized records.
 * @param {File} file
 * @returns {Promise<Array<Object>>}
 */
export async function parseTelemetryFile(file) {
  if (!file) {
    throw new Error('No file provided for parsing.');
  }

  const ext = file.name.split('.').pop().toLowerCase();

  if (ext === 'csv') {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          try {
            if (!results.data || results.data.length === 0) {
              return reject(new Error('CSV file contains no data rows.'));
            }
            const normalized = results.data
              .map((row, idx) => normalizeTelemetryRow(row, idx))
              .filter(Boolean);

            if (normalized.length === 0) {
              return reject(new Error('No valid telemetry rows detected. Please check CSV column headers.'));
            }
            resolve(normalized);
          } catch (err) {
            reject(err);
          }
        },
        error: (err) => reject(new Error(`Failed to parse CSV: ${err.message}`))
      });
    });
  }

  if (ext === 'xlsx' || ext === 'xls') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          if (!firstSheetName) {
            return reject(new Error('XLSX workbook has no sheets.'));
          }
          const sheet = workbook.Sheets[firstSheetName];
          const rawRows = XLSX.utils.sheet_to_json(sheet);

          if (!rawRows || rawRows.length === 0) {
            return reject(new Error('XLSX sheet contains no rows.'));
          }

          const normalized = rawRows
            .map((row, idx) => normalizeTelemetryRow(row, idx))
            .filter(Boolean);

          if (normalized.length === 0) {
            return reject(new Error('No valid telemetry rows detected in spreadsheet.'));
          }

          resolve(normalized);
        } catch (err) {
          reject(new Error(`Failed to parse XLSX: ${err.message}`));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file from disk.'));
      reader.readAsArrayBuffer(file);
    });
  }

  throw new Error(`Unsupported file type (.${ext}). Only .csv and .xlsx files are supported.`);
}

/**
 * Downloads comprehensive sample telemetry CSV (150+ realistic institutional records).
 */
export function downloadSampleSchema() {
  const sample = generateComprehensiveSampleDataset();
  const csv = Papa.unparse(sample);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `CampusPulse_Comprehensive_Telemetry_Dataset_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}
