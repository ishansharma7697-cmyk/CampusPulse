import React from 'react';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';
import { useTelemetry } from '../../context/TelemetryContext.jsx';
import Select from '../common/Select.jsx';
import Button from '../common/Button.jsx';

export function GlobalFilterBar() {
  const { filters, setFilter, resetFilters, availableBuildings } = useTelemetry();

  const buildingOptions = [
    { value: 'ALL', label: 'All Facilities' },
    ...availableBuildings.map(b => ({ value: b, label: b }))
  ];

  const dateRangeOptions = [
    { value: 'ALL', label: 'All Time' },
    { value: '7D', label: 'Last 7 Days' },
    { value: '14D', label: 'Last 14 Days' },
    { value: 'TODAY', label: 'Latest Date' }
  ];

  const resourceOptions = [
    { value: 'ALL', label: 'All Utilities' },
    { value: 'electricity', label: 'Electricity (kWh)' },
    { value: 'water', label: 'Water (Liters)' }
  ];

  const dayTypeOptions = [
    { value: 'ALL', label: 'All Days' },
    { value: 'weekday', label: 'Weekdays Only' },
    { value: 'weekend', label: 'Weekends Only' }
  ];

  return (
    <section className="no-print bg-white rounded-xl border border-campus-border p-3.5 mb-6 shadow-xs transition">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={15} className="text-campus-bronze" />
          <h3 className="font-semibold text-xs uppercase tracking-wider text-campus-text">
            Filters
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 flex-1 lg:max-w-3xl">
          <Select
            label="Time Range"
            value={filters.dateRange}
            onChange={(e) => setFilter('dateRange', e.target.value)}
            options={dateRangeOptions}
          />

          <Select
            label="Building"
            value={filters.building}
            onChange={(e) => setFilter('building', e.target.value)}
            options={buildingOptions}
          />

          <Select
            label="Utility"
            value={filters.resource}
            onChange={(e) => setFilter('resource', e.target.value)}
            options={resourceOptions}
          />

          <Select
            label="Day Category"
            value={filters.dayType}
            onChange={(e) => setFilter('dayType', e.target.value)}
            options={dayTypeOptions}
          />
        </div>

        <div className="flex justify-end">
          <Button
            variant="secondary"
            size="sm"
            icon={RotateCcw}
            onClick={resetFilters}
            title="Reset filters to all"
          >
            Reset
          </Button>
        </div>
      </div>
    </section>
  );
}

export default GlobalFilterBar;

