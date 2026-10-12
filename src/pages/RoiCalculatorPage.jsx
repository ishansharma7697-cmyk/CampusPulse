import React, { useMemo } from 'react';
import { useTelemetry } from '../context/TelemetryContext.jsx';
import Card from '../components/common/Card.jsx';
import Input from '../components/common/Input.jsx';
import RoiProjectionChart from '../components/charts/RoiProjectionChart.jsx';
import { calculateFiveYearProjection } from '../services/financialEngine.js';
import { formatCurrency } from '../utils/formatters.js';

export function RoiCalculatorPage() {
  const { tariffs, setTariff, financials } = useTelemetry();

  const projection = useMemo(() => {
    return calculateFiveYearProjection(financials.annualSavings, 0.05);
  }, [financials.annualSavings]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Parameters Column */}
        <Card
          title="Tariff & Target Settings"
          subtitle="Configure utility unit rates and target operational recovery factors"
        >
          <div className="space-y-4">
            <Input
              label="Electricity Tariff (₹ / kWh)"
              type="number"
              step="0.10"
              value={tariffs.electricity}
              onChange={(e) => setTariff('electricity', parseFloat(e.target.value) || 0)}
              helperText="Institutional commercial billing rate"
            />

            <Input
              label="Water Tariff (₹ / Liter)"
              type="number"
              step="0.01"
              value={tariffs.water}
              onChange={(e) => setTariff('water', parseFloat(e.target.value) || 0)}
              helperText="Municipal supply and sewer treatment rate"
            />

            <div className="form-group">
              <div className="flex justify-between items-center mb-1">
                <label className="form-label">Target Recovery Rate</label>
                <span className="text-xs font-bold text-campus-bronze">
                  {Math.round(tariffs.recoveryRate * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={Math.round(tariffs.recoveryRate * 100)}
                onChange={(e) => setTariff('recoveryRate', (parseFloat(e.target.value) || 50) / 100)}
                className="w-full accent-campus-bronze cursor-pointer"
              />
              <span className="text-xs text-campus-muted mt-1">
                Projected percentage of flagged waste eliminated through operational interventions
              </span>
            </div>

            <div className="pt-4 border-t border-campus-border text-xs text-campus-muted space-y-2">
              <div className="flex justify-between">
                <span>Annual Tariff Inflation Factor:</span>
                <span className="font-semibold text-campus-text">5.0% Compound</span>
              </div>
              <div className="p-3 bg-campus-container rounded text-campus-muted leading-relaxed">
                Adjusting these parameters dynamically updates multi-year capital recovery models and budget reallocation targets.
              </div>
            </div>
          </div>
        </Card>

        {/* Projections Column */}
        <div className="lg:col-span-2">
          <Card
            title="Cost Recovery Projections"
            subtitle="Estimated financial burden and multi-year savings potential"
          >

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded bg-rose-light border border-rose-border">
                <span className="text-xs font-semibold text-rose uppercase tracking-wider">
                  Current Flagged Waste
                </span>
                <div className="text-3xl font-bold font-serif text-rose mt-1">
                  {formatCurrency(financials.financialLoss)}
                </div>
                <p className="text-xs text-rose mt-1">
                  Cumulative cost of unaddressed energy & water variances in filter scope
                </p>
              </div>

              <div className="p-4 rounded bg-emerald-light border border-emerald-border">
                <span className="text-xs font-semibold text-emerald uppercase tracking-wider">
                  Recoverable Annual Savings
                </span>
                <div className="text-3xl font-bold font-serif text-emerald mt-1">
                  {formatCurrency(financials.annualSavings)}
                </div>
                <p className="text-xs text-emerald mt-1">
                  Projected 52-week savings at {Math.round(tariffs.recoveryRate * 100)}% recovery efficiency
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-campus-muted mb-3">
                5-Year Cumulative Savings Potential (Compound Inflation Model)
              </h4>
              <RoiProjectionChart projectionData={projection} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default RoiCalculatorPage;
