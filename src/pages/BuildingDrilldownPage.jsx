import React, { useState, useMemo } from 'react';
import { useTelemetry } from '../context/TelemetryContext.jsx';
import Card from '../components/common/Card.jsx';
import Select from '../components/common/Select.jsx';
import Badge from '../components/common/Badge.jsx';
import HourlyProfileChart from '../components/charts/HourlyProfileChart.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import { formatDateTime } from '../utils/formatters.js';

export function BuildingDrilldownPage() {
  const { filteredDataset, availableBuildings, anomalies, filters, setFilter } = useTelemetry();

  const [selectedBuilding, setSelectedBuilding] = useState(
    availableBuildings[0] || 'Library Complex'
  );

  const activeBuilding = (filters.building !== 'ALL' && availableBuildings.includes(filters.building))
    ? filters.building
    : (availableBuildings.includes(selectedBuilding)
        ? selectedBuilding
        : (availableBuildings[0] || 'Library Complex'));

  const handleBuildingChange = (e) => {
    const val = e.target.value;
    setSelectedBuilding(val);
    setFilter('building', val);
  };


  // Filter telemetry specific to this building
  const buildingTelemetry = useMemo(() => {
    return filteredDataset.filter(d => d.building_name === activeBuilding);
  }, [filteredDataset, activeBuilding]);

  // Hourly load calculation (24 hours)
  const { hourlyLabels, hourlyActuals, hourlyBaselines, peakHour, offHourRatio, healthIndex } = useMemo(() => {
    const hourlyMap = Array(24).fill(0).map(() => ({ actual: 0, baseline: 0, count: 0 }));
    let offHourExcess = 0;
    let offHourTotal = 0;
    let maxHour = 0;
    let maxLoad = -1;

    buildingTelemetry.forEach((d) => {
      const h = new Date(d.timestamp).getHours();
      hourlyMap[h].actual += d.consumption;
      hourlyMap[h].baseline += d.expected_baseline;
      hourlyMap[h].count++;

      // Off-hour calculations (unoccupied hours e.g. < 8 or > 18)
      if (d.occupancy_status === 'unoccupied') {
        offHourTotal += d.consumption;
        offHourExcess += Math.max(0, d.consumption - d.expected_baseline);
      }
    });

    hourlyMap.forEach((entry, idx) => {
      const avg = entry.count > 0 ? entry.actual / entry.count : 0;
      if (avg > maxLoad) {
        maxLoad = avg;
        maxHour = idx;
      }
    });

    const labels = Array.from({ length: 24 }, (_, i) => `${i}:00`);
    const actuals = hourlyMap.map(h => h.count > 0 ? Math.round(h.actual / h.count) : 0);
    const baselines = hourlyMap.map(h => h.count > 0 ? Math.round(h.baseline / h.count) : 0);

    const calculatedOffRatio = offHourTotal > 0
      ? Math.round((offHourExcess / offHourTotal) * 100)
      : 0;

    let computedHealth = 'Normal Variance';
    if (calculatedOffRatio > 40) computedHealth = 'Elevated Variance';
    else if (calculatedOffRatio > 20) computedHealth = 'Moderate Variance';

    return {
      hourlyLabels: labels,
      hourlyActuals: actuals,
      hourlyBaselines: baselines,
      peakHour: `${String(maxHour).padStart(2, '0')}:00 - ${String((maxHour + 1) % 24).padStart(2, '0')}:00`,
      offHourRatio: calculatedOffRatio,
      healthIndex: computedHealth
    };
  }, [buildingTelemetry]);

  // Anomalies specific to this building
  const buildingAnomalies = useMemo(() => {
    return anomalies.filter(a => a.building === activeBuilding);
  }, [anomalies, activeBuilding]);

  const buildingOptions = availableBuildings.map(b => ({ value: b, label: b }));

  return (
    <div className="space-y-6">
      <Card
        title="Building Analytics"
        subtitle="Hourly load profile and anomaly records for individual facilities"
        action={
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-campus-muted uppercase">Selected Building:</span>
            <select
              value={activeBuilding}
              onChange={handleBuildingChange}
              className="form-select text-xs py-1.5 px-3 font-semibold text-campus-text"
            >

              {buildingOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        }
      >
        {/* Profile Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded bg-campus-container border border-campus-border">
            <div className="text-xs text-campus-muted font-medium uppercase">Peak Consumption Hour</div>
            <div className="text-xl font-bold font-serif text-campus-text mt-1">{peakHour}</div>
            <div className="text-[11px] text-campus-muted mt-1">Observed maximum aggregate load point</div>
          </div>

          <div className="p-4 rounded bg-campus-container border border-campus-border">
            <div className="text-xs text-campus-muted font-medium uppercase">Off-Hour Overhead Ratio</div>
            <div className={`text-xl font-bold font-serif mt-1 ${offHourRatio > 25 ? 'text-amber' : 'text-campus-text'}`}>
              {offHourRatio}%
            </div>
            <div className="text-[11px] text-campus-muted mt-1">Percentage of off-schedule energy excess</div>
          </div>

          <div className="p-4 rounded bg-campus-container border border-campus-border">
            <div className="text-xs text-campus-muted font-medium uppercase">Variance Rating</div>
            <div className={`text-xl font-bold font-serif mt-1 ${offHourRatio > 40 ? 'text-rose' : offHourRatio > 20 ? 'text-amber' : 'text-emerald'}`}>
              {healthIndex}
            </div>
            <div className="text-[11px] text-campus-muted mt-1">Evaluated against modeled baseline parameters</div>
          </div>
        </div>

        {/* 24-Hour Load Profile Chart */}
        <div className="mb-6">
          <h4 className="font-bold text-sm text-campus-text mb-2">Average 24-Hour Load Profile vs Baseline</h4>
          <HourlyProfileChart

            labels={hourlyLabels}
            actualData={hourlyActuals}
            baselineData={hourlyBaselines}
          />
        </div>

        {/* Facility Specific Anomalies Table */}
        <div>
          <h4 className="font-bold text-sm text-campus-text mb-3">Facility Specific Anomaly Events</h4>
          <div className="table-container">
            {buildingAnomalies.length === 0 ? (
              <EmptyState
                title="No Facility Anomalies"
                description={`No active energy or water anomalies flagged for ${activeBuilding} within this period.`}
              />
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Meter ID</th>
                    <th>Resource</th>
                    <th>Observed / Baseline</th>
                    <th>Severity</th>
                    <th>Evidence</th>
                  </tr>
                </thead>
                <tbody>
                  {buildingAnomalies.map((a) => (
                    <tr key={a.id}>
                      <td>{formatDateTime(a.timestamp)}</td>
                      <td className="font-mono">{a.meter_id}</td>
                      <td className="capitalize">{a.resource}</td>
                      <td className="font-semibold">
                        {a.value} / {a.expected} {a.unit}
                      </td>
                      <td>
                        <Badge variant={a.severity === 'Critical' ? 'rose' : a.severity === 'High' ? 'amber' : 'neutral'}>
                          {a.severity}
                        </Badge>
                      </td>
                      <td className="text-campus-muted">{a.evidence}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

export default BuildingDrilldownPage;
