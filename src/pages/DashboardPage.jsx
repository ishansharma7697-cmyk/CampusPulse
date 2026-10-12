import React, { useState, useMemo } from 'react';
import {
  Zap,
  Droplets,
  IndianRupee,
  ShieldCheck,
  ArrowRight,
  FilterX,
  AlertTriangle
} from 'lucide-react';
import { useTelemetry } from '../context/TelemetryContext.jsx';
import Card from '../components/common/Card.jsx';
import Badge from '../components/common/Badge.jsx';
import Button from '../components/common/Button.jsx';
import TrendLineChart from '../components/charts/TrendLineChart.jsx';
import BuildingBarChart from '../components/charts/BuildingBarChart.jsx';
import SeverityDoughnutChart from '../components/charts/SeverityDoughnutChart.jsx';
import { generateDiagnosticFindings } from '../services/anomalyEngine.js';
import { formatNumber, formatCurrency, formatElectricity, formatWater } from '../utils/formatters.js';

export function DashboardPage({ onSelectTab }) {
  const { filteredDataset, anomalies, financials, resetFilters, filters, setFilter } = useTelemetry();

  const [facilityResourceTab, setFacilityResourceTab] = useState('electricity');

  const activeFacilityResource = filters.resource !== 'ALL'
    ? filters.resource
    : facilityResourceTab;

  // Aggregate time series for Electricity & Water Trend Charts (chronologically sorted)
  const { elecSeries, waterSeries } = useMemo(() => {
    const elecMap = {};
    const waterMap = {};

    const sorted = [...filteredDataset].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    sorted.forEach((d) => {
      const dateStr = new Date(d.timestamp).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit'
      });

      if (d.resource_type === 'electricity') {
        if (!elecMap[dateStr]) elecMap[dateStr] = { actual: 0, baseline: 0 };
        elecMap[dateStr].actual += d.consumption;
        elecMap[dateStr].baseline += d.expected_baseline;
      } else {
        if (!waterMap[dateStr]) waterMap[dateStr] = { actual: 0, baseline: 0 };
        waterMap[dateStr].actual += d.consumption;
        waterMap[dateStr].baseline += d.expected_baseline;
      }
    });

    const elecLabels = Object.keys(elecMap).slice(-24);
    const waterLabels = Object.keys(waterMap).slice(-24);

    return {
      elecSeries: {
        labels: elecLabels,
        actual: elecLabels.map(l => Math.round(elecMap[l].actual)),
        baseline: elecLabels.map(l => Math.round(elecMap[l].baseline))
      },
      waterSeries: {
        labels: waterLabels,
        actual: waterLabels.map(l => Math.round(waterMap[l].actual)),
        baseline: waterLabels.map(l => Math.round(waterMap[l].baseline))
      }
    };
  }, [filteredDataset]);

  // Aggregate building intensity for Bar Chart (accurate units, no arbitrary scaling)
  const buildingIntensity = useMemo(() => {
    const bMap = {};
    filteredDataset.forEach((d) => {
      if (!bMap[d.building_name]) bMap[d.building_name] = { elec: 0, water: 0 };
      if (d.resource_type === 'electricity') bMap[d.building_name].elec += d.consumption;
      else bMap[d.building_name].water += d.consumption;
    });

    const labels = Object.keys(bMap).sort();
    return {
      labels,
      electricity: labels.map(l => Math.round(bMap[l].elec)),
      water: labels.map(l => Math.round(bMap[l].water))
    };
  }, [filteredDataset]);

  // Anomaly severity counts for Doughnut Chart
  const severityCounts = useMemo(() => {
    const counts = { Critical: 0, High: 0, Medium: 0, Low: 0 };
    anomalies.forEach((a) => {
      if (counts[a.severity] !== undefined) counts[a.severity]++;
    });
    return counts;
  }, [anomalies]);

  // Automated diagnostic findings
  const diagnostics = useMemo(() => {
    return generateDiagnosticFindings(anomalies);
  }, [anomalies]);

  const showElecTrend = filters.resource === 'ALL' || filters.resource === 'electricity';
  const showWaterTrend = filters.resource === 'ALL' || filters.resource === 'water';

  return (
    <div className="space-y-6">
      {/* Zero Record Warning if all data was filtered out */}
      {filteredDataset.length === 0 && (
        <div className="p-4 rounded-xl bg-amber-light border border-amber-border text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2 text-amber-dark">
            <FilterX size={18} className="text-amber flex-shrink-0" />
            <span>No telemetry records match the current filter selection. Reset filters to view all records in the active dataset.</span>
          </div>
          <Button variant="secondary" size="sm" onClick={resetFilters}>
            Reset Filters
          </Button>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Electricity Usage */}
        <div className="card p-4 hover:border-campus-bronze transition">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold text-campus-muted uppercase tracking-wider">
                Electricity Usage
              </span>
              <div className="text-2xl font-bold font-serif text-campus-text mt-1">
                {formatElectricity(financials.totalElectricity)}
              </div>
            </div>
            <div className="p-2 bg-amber-light text-amber rounded">
              <Zap size={20} />
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-campus-border">
            <span className="text-campus-muted">Excess:</span>
            <span className="font-semibold text-amber">
              {formatElectricity(financials.excessElectricity)}
            </span>
          </div>
        </div>

        {/* KPI 2: Water Consumed */}
        <div className="card p-4 hover:border-campus-bronze transition">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold text-campus-muted uppercase tracking-wider">
                Water Consumed
              </span>
              <div className="text-2xl font-bold font-serif text-campus-text mt-1">
                {formatWater(financials.totalWater)}
              </div>
            </div>
            <div className="p-2 bg-blue-light text-blue rounded">
              <Droplets size={20} />
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-campus-border">
            <span className="text-campus-muted">Excess:</span>
            <span className="font-semibold text-blue">
              {formatWater(financials.excessWater)}
            </span>
          </div>
        </div>

        {/* KPI 3: Estimated Financial Loss */}
        <div className="card p-4 hover:border-campus-bronze transition">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold text-campus-muted uppercase tracking-wider">
                Flagged Waste Loss
              </span>
              <div className="text-2xl font-bold font-serif text-rose mt-1">
                {formatCurrency(financials.financialLoss)}
              </div>
            </div>
            <div className="p-2 bg-rose-light text-rose rounded">
              <IndianRupee size={20} />
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-campus-border">
            <span className="text-campus-muted">Recovery Target:</span>
            <span className="font-semibold text-emerald">
              {formatCurrency(financials.savingsTarget)}
            </span>
          </div>
        </div>

        {/* KPI 4: Efficiency Score */}
        <div className="card p-4 hover:border-campus-bronze transition">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-semibold text-campus-muted uppercase tracking-wider">
                Efficiency Index
              </span>
              <div className="text-2xl font-bold font-serif text-campus-text mt-1">
                {financials.efficiencyScore}%
              </div>
            </div>
            <div className="p-2 bg-emerald-light text-emerald rounded">
              <ShieldCheck size={20} />
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-campus-border">
            <span className="text-campus-muted">Flagged Events:</span>
            <Badge variant={anomalies.length > 0 ? 'amber' : 'emerald'}>
              {anomalies.length} Events
            </Badge>
          </div>
        </div>
      </div>

      {/* Row 1: Utility Trends (filter-aware layout) */}
      {(showElecTrend || showWaterTrend) && (
        <div className={`grid grid-cols-1 ${showElecTrend && showWaterTrend ? 'lg:grid-cols-2' : ''} gap-6`}>
          {showElecTrend && (
            <Card
              title="Electricity Consumption Baseline"
              subtitle="Meter logs vs expected baseline model (kWh)"
            >
              <TrendLineChart
                labels={elecSeries.labels}
                actualData={elecSeries.actual}
                baselineData={elecSeries.baseline}
                actualLabel="Observed Usage"
                baselineLabel="Modeled Baseline"
                unit="kWh"
                borderColor="#8c672b"
                backgroundColor="rgba(140, 103, 43, 0.08)"
              />
            </Card>
          )}

          {showWaterTrend && (
            <Card
              title="Water Usage and Leakage Trend"
              subtitle="Flow volume (L) with night baseline tracking"
            >
              <TrendLineChart
                labels={waterSeries.labels}
                actualData={waterSeries.actual}
                baselineData={waterSeries.baseline}
                actualLabel="Observed Flow"
                baselineLabel="Night Baseline"
                unit="L"
                borderColor="#1d4ed8"
                backgroundColor="rgba(29, 78, 216, 0.08)"
              />
            </Card>
          )}
        </div>
      )}

      {/* Row 2: Building Breakdown and Anomaly Severity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card
            title={activeFacilityResource === 'water' ? 'Building Water Consumption' : 'Building Energy Consumption'}
            subtitle={activeFacilityResource === 'water' ? 'Total observed water volume per campus facility (Liters)' : 'Total observed electricity usage per campus facility (kWh)'}
            action={
              filters.resource === 'ALL' ? (
                <div className="flex items-center gap-1 bg-campus-bg p-0.5 rounded border border-campus-border">
                  <button
                    onClick={() => setFacilityResourceTab('electricity')}
                    className={`px-2.5 py-1 text-xs rounded transition font-medium cursor-pointer ${
                      facilityResourceTab === 'electricity'
                        ? 'bg-campus-bronze text-white shadow-xs font-semibold'
                        : 'text-campus-muted hover:text-campus-text'
                    }`}
                  >
                    Electricity (kWh)
                  </button>
                  <button
                    onClick={() => setFacilityResourceTab('water')}
                    className={`px-2.5 py-1 text-xs rounded transition font-medium cursor-pointer ${
                      facilityResourceTab === 'water'
                        ? 'bg-campus-bronze text-white shadow-xs font-semibold'
                        : 'text-campus-muted hover:text-campus-text'
                    }`}
                  >
                    Water (Liters)
                  </button>
                </div>
              ) : null
            }
          >
            <BuildingBarChart
              labels={buildingIntensity.labels}
              data={activeFacilityResource === 'water' ? buildingIntensity.water : buildingIntensity.electricity}
              label={activeFacilityResource === 'water' ? 'Water' : 'Electricity'}
              unit={activeFacilityResource === 'water' ? 'L' : 'kWh'}
              color={activeFacilityResource === 'water' ? '#2563eb' : '#8c672b'}
            />
          </Card>
        </div>

        <div>
          <Card
            title="Anomaly Severity Mix"
            subtitle="Distribution of detected risk flags"
          >
            <SeverityDoughnutChart counts={severityCounts} />
            <div className="text-xs text-center text-campus-muted pt-3 border-t border-campus-border mt-3">
              {severityCounts.Critical} Critical &amp; {severityCounts.High} High severity incidents flagged
            </div>
          </Card>
        </div>
      </div>


      {/* Operational Insights */}
      <Card
        title="Operational Insights"
        subtitle="Priority findings and recommended remediation actions"
      >

        {diagnostics.length === 0 ? (
          <div className="p-4 rounded bg-emerald-light border border-emerald-border text-emerald-dark text-xs flex items-center gap-2">
            <ShieldCheck size={16} />
            <span>No active energy anomalies detected. All building baselines operating within standard parameters.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {diagnostics.slice(0, 3).map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded bg-campus-container border border-campus-border text-xs space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between font-bold text-campus-text">
                    <span>{item.building}</span>
                    <Badge variant={item.criticalCount > 0 ? 'rose' : 'amber'}>
                      {item.count} Incidents
                    </Badge>
                  </div>
                  <p className="text-campus-muted mt-2 leading-relaxed">
                    {item.summary}
                  </p>
                </div>
                <div className="pt-2 border-t border-campus-border flex items-center justify-between font-semibold text-campus-bronze">
                  <span>Action: {item.action}</span>
                  <button
                    onClick={() => {
                      setFilter('building', item.building);
                      onSelectTab('building-drilldown');
                    }}
                    className="p-1 text-campus-bronze hover:underline cursor-pointer"
                    aria-label={`Drilldown into ${item.building}`}
                  >
                    <ArrowRight size={14} />
                  </button>

                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

export default DashboardPage;
