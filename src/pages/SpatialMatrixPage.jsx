import React, { useState, useMemo } from 'react';
import { useTelemetry } from '../context/TelemetryContext.jsx';
import Card from '../components/common/Card.jsx';
import Badge from '../components/common/Badge.jsx';

export function SpatialMatrixPage() {
  const { filteredDataset, availableBuildings, filters } = useTelemetry();
  const [inspectedCell, setInspectedCell] = useState(null);

  const displayedBuildings = useMemo(() => {
    if (filters.building !== 'ALL' && availableBuildings.includes(filters.building)) {
      return [filters.building];
    }
    return availableBuildings;
  }, [availableBuildings, filters.building]);


  // Precompute matrix for each building and each hour (0..23)
  const matrix = useMemo(() => {
    const result = {};

    availableBuildings.forEach((building) => {
      result[building] = Array(24).fill(null).map((_, hour) => {
        const records = filteredDataset.filter(
          d => d.building_name === building && new Date(d.timestamp).getHours() === hour
        );

        if (records.length === 0) {
          return { ratio: 1.0, count: 0, actual: 0, baseline: 0 };
        }

        const sumActual = records.reduce((acc, r) => acc + r.consumption, 0);
        const sumBase = records.reduce((acc, r) => acc + r.expected_baseline, 0);
        const ratio = sumBase > 0 ? sumActual / sumBase : 1.0;

        return {
          ratio: parseFloat(ratio.toFixed(2)),
          count: records.length,
          actual: Math.round(sumActual / records.length),
          baseline: Math.round(sumBase / records.length)
        };
      });
    });

    return result;
  }, [availableBuildings, filteredDataset]);

  const handleCellClick = (building, hour, data) => {
    const info = {
      building,
      hour: `${hour}:00`,
      ratio: data.ratio,
      actual: data.actual,
      baseline: data.baseline
    };
    setInspectedCell(info);
  };

  return (
    <div className="space-y-6">
      <Card
        title="Hourly Energy Heatmap"
        subtitle="Hourly consumption load relative to expected baseline across campus facilities"
        action={
          <div className="flex items-center gap-4 text-xs text-campus-muted">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-light border border-emerald" /> Normal (≤1.05x)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-amber-light border border-amber" /> Elevated (1.2x)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-rose-light border border-rose" /> Anomaly Peak (&gt;1.5x)
            </span>
          </div>
        }
      >
        {/* Heatmap Grid Container */}
        <div className="overflow-x-auto pb-2">
          <div className="min-w-[840px]">
            {/* Header Row: 0h to 23h */}
            <div className="grid grid-cols-25 gap-1 text-center text-[10px] font-bold text-campus-muted mb-1.5">
              <div className="text-left pl-1">Facility</div>
              {Array.from({ length: 24 }, (_, h) => (
                <div key={h}>{h}h</div>
              ))}
            </div>

            {/* Facility Rows */}
            {displayedBuildings.map((building) => (
              <div key={building} className="grid grid-cols-25 gap-1 items-center mb-1.5">

                <div className="text-xs font-semibold text-campus-text truncate pr-2" title={building}>
                  {building}
                </div>

                {Array.from({ length: 24 }, (_, h) => {
                  const data = matrix[building]?.[h] || { ratio: 1.0 };
                  const r = data.ratio;

                  let cellStyle = 'bg-emerald-light text-emerald border border-emerald-border';
                  if (r > 1.5) {
                    cellStyle = 'bg-rose text-white font-bold border border-rose-border';
                  } else if (r > 1.2) {
                    cellStyle = 'bg-amber text-white font-bold border border-amber-border';
                  } else if (r > 1.05) {
                    cellStyle = 'bg-amber-light text-amber border border-amber-border';
                  }

                  return (
                    <button
                      key={h}
                      onClick={() => handleCellClick(building, h, data)}
                      className={`heatmap-cell ${cellStyle}`}
                      title={`${building} at ${h}:00 - Ratio: ${r}x`}
                      aria-label={`${building} at ${h}:00 load ratio ${r}`}
                    >
                      {r > 1.5 ? '!' : `${r}x`}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Selected Cell Inspection Panel */}
        {inspectedCell && (
          <div className="mt-4 p-4 rounded bg-campus-container border border-campus-border text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="font-bold text-campus-text text-sm">
                Hourly Consumption Details: {inspectedCell.building} ({inspectedCell.hour})
              </span>
              <p className="text-campus-muted mt-0.5">
                Observed load: {inspectedCell.actual} vs Baseline: {inspectedCell.baseline} ({inspectedCell.ratio}x ratio).
              </p>
            </div>
            <Badge variant={inspectedCell.ratio > 1.2 ? 'rose' : 'emerald'}>
              {inspectedCell.ratio > 1.2 ? 'Variance Alert Flagged' : 'Within Expected Baseline'}
            </Badge>
          </div>
        )}
      </Card>
    </div>
  );
}

export default SpatialMatrixPage;

