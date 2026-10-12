import React, { useState } from 'react';
import { SlidersHorizontal, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import { useTelemetry } from '../../context/TelemetryContext.jsx';
import Select from '../common/Select.jsx';
import Button from '../common/Button.jsx';

export function GlobalFilterBar() {
  const { filters, setFilter, resetFilters, availableBuildings } = useTelemetry();
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);

  const buildingOptions = [
    { value: 'ALL', label: 'All Facilities' },
    ...availableBuildings.map(b => ({ value: b, label: b }))
  ];

  const dateRangeOptions = [
    { value: 'ALL', label: 'Entire Dataset' },
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

  const activeFiltersCount = [
    filters.dateRange !== 'ALL',
    filters.building !== 'ALL',
    filters.resource !== 'ALL',
    filters.dayType !== 'ALL'
  ].filter(Boolean).length;

  return (
    <section className="no-print glass-card rounded-2xl p-3 sm:p-4 mb-4 sm:mb-6 shadow-sm border border-campus-border/70 transition">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Filter Title & Mobile Accordion Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-campus-bronze-light/70 text-campus-bronze flex items-center justify-center">
              <SlidersHorizontal size={14} />
            </div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-xs uppercase tracking-wider text-campus-text">
                Telemetry Filters
              </h3>
              {activeFiltersCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-campus-bronze text-white shadow-xs">
                  {activeFiltersCount} active
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setIsMobileExpanded(prev => !prev)}
              className="p-1.5 text-xs font-medium text-campus-muted hover:text-campus-text bg-campus-container/60 rounded-lg flex items-center gap-1 glass-panel cursor-pointer"
              aria-label="Toggle mobile filters"
            >
              <span>{isMobileExpanded ? 'Hide' : 'Options'}</span>
              {isMobileExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            <Button
              variant="secondary"
              size="sm"
              icon={RotateCcw}
              onClick={resetFilters}
              title="Reset all filters"
            >
              Reset
            </Button>
          </div>
        </div>

        {/* Filter Select Controls (Always visible on desktop, toggleable on mobile) */}
        <div
          className={`${
            isMobileExpanded ? 'grid' : 'hidden lg:grid'
          } grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 flex-1 lg:max-w-3xl pt-2 lg:pt-0 border-t lg:border-t-0 border-campus-border/40`}
        >
          <Select
            label="Time Horizon"
            value={filters.dateRange}
            onChange={(e) => setFilter('dateRange', e.target.value)}
            options={dateRangeOptions}
          />

          <Select
            label="Facility"
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

        {/* Desktop Reset Button */}
        <div className="hidden lg:flex justify-end">
          <Button
            variant="secondary"
            size="sm"
            icon={RotateCcw}
            onClick={resetFilters}
            title="Reset filters to all"
            className="glass-btn"
          >
            Reset
          </Button>
        </div>
      </div>
    </section>
  );
}

export default GlobalFilterBar;
