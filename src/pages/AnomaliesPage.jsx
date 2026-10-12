import React, { useState, useMemo } from 'react';
import { Search, Download, Check } from 'lucide-react';
import { useTelemetry } from '../context/TelemetryContext.jsx';
import AnomalyService from '../api/anomalyService.js';
import Card from '../components/common/Card.jsx';
import Button from '../components/common/Button.jsx';
import Badge from '../components/common/Badge.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import { formatDateTime } from '../utils/formatters.js';

export function AnomaliesPage() {
  const { anomalies, resolveAnomaly, addToast } = useTelemetry();

  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredAnomalies = useMemo(() => {
    return anomalies.filter((a) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        a.building.toLowerCase().includes(q) ||
        a.meter_id.toLowerCase().includes(q) ||
        a.evidence.toLowerCase().includes(q);

      const matchesSeverity = severityFilter === 'ALL' || a.severity === severityFilter;
      const matchesStatus = statusFilter === 'ALL' || a.status === statusFilter;

      return matchesSearch && matchesSeverity && matchesStatus;
    });
  }, [anomalies, searchQuery, severityFilter, statusFilter]);

  const handleExportCsv = () => {
    try {
      AnomalyService.exportToCsv(filteredAnomalies);
      addToast(`Exported ${filteredAnomalies.length} anomaly records to CSV`, 'success');
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  return (
    <div className="space-y-6">
      <Card
        title="Anomaly Incidents"
        subtitle="Baseline variance records and incident resolution tracking"
        action={
          <Button
            variant="primary"
            size="sm"
            icon={Download}
            onClick={handleExportCsv}
          >
            Export CSV
          </Button>
        }
      >

        {/* Filter Controls Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-5">
          {/* Search Box */}
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3 top-3 text-campus-muted pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search building, meter, evidence..."
              className="form-input pl-9 text-xs"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="form-select text-xs py-1.5 px-3"
            >
              <option value="ALL">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-select text-xs py-1.5 px-3"
            >
              <option value="ALL">All Statuses</option>
              <option value="New">New Only</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="table-container">
          {filteredAnomalies.length === 0 ? (
            <EmptyState
              title="No Matching Incidents"
              description="No anomaly records match the selected search terms or filters."
              actionLabel="Clear Filters"
              onAction={() => {
                setSearchQuery('');
                setSeverityFilter('ALL');
                setStatusFilter('ALL');
              }}
            />
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Building Facility</th>
                  <th>Resource</th>
                  <th>Observed vs Baseline</th>
                  <th>Severity</th>
                  <th>Status</th>
                  <th>Diagnostic Evidence</th>
                  <th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredAnomalies.map((a) => (
                  <tr key={a.id}>
                    <td>{formatDateTime(a.timestamp)}</td>
                    <td className="font-semibold text-campus-text">{a.building}</td>
                    <td className="capitalize">{a.resource}</td>
                    <td>
                      <span className="font-semibold text-rose">{a.value} {a.unit}</span>{' '}
                      <span className="text-campus-muted font-normal">(Base: {a.expected})</span>
                    </td>
                    <td>
                      <Badge variant={a.severity === 'Critical' ? 'rose' : a.severity === 'High' ? 'amber' : 'neutral'}>
                        {a.severity}
                      </Badge>
                    </td>
                    <td>
                      <Badge variant={a.status === 'Resolved' ? 'emerald' : 'neutral'}>
                        {a.status}
                      </Badge>
                    </td>
                    <td className="text-campus-muted max-w-xs truncate" title={a.evidence}>
                      {a.evidence}
                    </td>
                    <td className="text-right">
                      {a.status !== 'Resolved' ? (
                        <Button
                          variant="secondary"
                          size="sm"
                          icon={Check}
                          onClick={() => resolveAnomaly(a.id)}
                        >
                          Resolve
                        </Button>
                      ) : (
                        <span className="text-xs text-emerald font-medium">Verified</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  );
}

export default AnomaliesPage;
