import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileCode2,
  Download,
  CheckCircle,
  AlertCircle,
  Play,
  ArrowRight
} from 'lucide-react';
import { useTelemetry } from '../context/TelemetryContext.jsx';
import { parseTelemetryFile, downloadSampleSchema, generateComprehensiveSampleDataset } from '../services/fileParser.js';
import Card from '../components/common/Card.jsx';
import Button from '../components/common/Button.jsx';
import { formatNumber, formatDateTime } from '../utils/formatters.js';

export function DataImportPage({ onSelectTab }) {
  const { ingestDataset, addToast } = useTelemetry();
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [appendMode, setAppendMode] = useState(false);
  const [ingestedSummary, setIngestedSummary] = useState(null);
  const fileInputRef = useRef(null);

  const processAndIngest = (records, sourceName) => {
    ingestDataset(records, appendMode);

    const facilities = Array.from(new Set(records.map(r => r.building_name)));
    const elecCount = records.filter(r => r.resource_type === 'electricity').length;
    const waterCount = records.filter(r => r.resource_type === 'water').length;
    const anomalyCount = records.filter(r => r.consumption > r.expected_baseline * 1.4).length;

    setIngestedSummary({
      sourceName,
      totalCount: records.length,
      facilities,
      elecCount,
      waterCount,
      anomalyCount,
      sampleRows: records.slice(0, 5)
    });

    addToast(`Successfully ingested ${records.length} records from ${sourceName}`, 'success');
  };

  const handleFile = async (file) => {
    if (!file) return;

    setIsProcessing(true);
    setIngestedSummary(null);

    try {
      const records = await parseTelemetryFile(file);
      processAndIngest(records, file.name);
    } catch (err) {
      setIngestedSummary({
        error: err.message,
        sourceName: file.name
      });
      addToast(err.message, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLoadSample = () => {
    setIsProcessing(true);
    try {
      const sampleRecords = generateComprehensiveSampleDataset();
      processAndIngest(sampleRecords, 'Standard Institutional Dataset (140+ records)');
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className="space-y-6">
      <Card
        title="Data Import"
        subtitle="Import meter telemetry logs in CSV or XLSX format"
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              icon={Play}
              onClick={handleLoadSample}
              disabled={isProcessing}
            >
              Load Standard Sample
            </Button>
            <Button
              variant="secondary"
              size="sm"
              icon={Download}
              onClick={downloadSampleSchema}
            >
              Download Template CSV
            </Button>
          </div>
        }
      >
        {/* Mode Toggle */}
        <div className="mb-4 flex items-center justify-between p-3 rounded bg-campus-container border border-campus-border text-xs">
          <span className="font-medium text-campus-text">Upload Mode:</span>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="ingestMode"
                checked={!appendMode}
                onChange={() => setAppendMode(false)}
                className="accent-campus-bronze"
              />
              <span className={!appendMode ? 'font-semibold text-campus-text' : 'text-campus-muted'}>
                Replace Dataset
              </span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="ingestMode"
                checked={appendMode}
                onChange={() => setAppendMode(true)}
                className="accent-campus-bronze"
              />
              <span className={appendMode ? 'font-semibold text-campus-text' : 'text-campus-muted'}>
                Append Records
              </span>
            </label>
          </div>
        </div>

        {/* Drag and Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition ${
            isDragging
              ? 'border-campus-bronze bg-campus-bronze-light/40'
              : 'border-campus-border hover:border-campus-bronze bg-campus-bg'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv, .xlsx, .xls"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="w-14 h-14 rounded bg-campus-container text-campus-bronze flex items-center justify-center mx-auto mb-3">
            <UploadCloud size={28} />
          </div>

          <h4 className="font-serif font-bold text-base text-campus-text mb-1">
            {isProcessing ? 'Processing File...' : 'Upload Telemetry File'}
          </h4>

          <p className="text-xs text-campus-muted max-w-md mx-auto">
            Drop CSV or XLSX file here, or click to browse. Supported columns: timestamp, building, meter_id, resource, consumption, baseline, unit.
          </p>
        </div>


        {/* Ingestion Verified Summary */}
        {ingestedSummary && !ingestedSummary.error && (
          <div className="mt-5 p-4 rounded-xl bg-campus-container border border-campus-border space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-campus-border">
              <div className="flex items-center gap-2">
                <CheckCircle size={18} className="text-emerald" />
                <span className="font-bold text-sm text-campus-text">
                  Ingestion Complete: {ingestedSummary.sourceName}
                </span>
              </div>
              <Button
                variant="primary"
                size="sm"
                icon={ArrowRight}
                iconPosition="right"
                onClick={() => onSelectTab('dashboard')}
              >
                View Dashboard
              </Button>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-campus-card rounded border border-campus-border">
                <span className="text-[10px] uppercase font-bold text-campus-muted">Records</span>
                <div className="text-lg font-bold font-serif text-campus-text mt-0.5">
                  {formatNumber(ingestedSummary.totalCount)}
                </div>
              </div>
              <div className="p-3 bg-campus-card rounded border border-campus-border">
                <span className="text-[10px] uppercase font-bold text-campus-muted">Facilities</span>
                <div className="text-lg font-bold font-serif text-campus-text mt-0.5">
                  {ingestedSummary.facilities.length}
                </div>
              </div>
              <div className="p-3 bg-campus-card rounded border border-campus-border">
                <span className="text-[10px] uppercase font-bold text-campus-muted">Utility Mix</span>
                <div className="text-xs font-semibold text-campus-text mt-1">
                  {ingestedSummary.elecCount} Elec / {ingestedSummary.waterCount} Water
                </div>
              </div>
              <div className="p-3 bg-campus-card rounded border border-campus-border">
                <span className="text-[10px] uppercase font-bold text-campus-muted">Anomalies</span>
                <div className="text-lg font-bold font-serif text-amber mt-0.5">
                  {ingestedSummary.anomalyCount}
                </div>
              </div>
            </div>

            {/* Preview of Ingested Records */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-campus-muted block mb-2">
                Sample Records Preview:
              </span>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Timestamp</th>
                      <th>Facility</th>
                      <th>Meter</th>
                      <th>Resource</th>
                      <th>Observed</th>
                      <th>Baseline</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ingestedSummary.sampleRows.map((r, i) => (
                      <tr key={i}>
                        <td>{formatDateTime(r.timestamp)}</td>
                        <td className="font-semibold">{r.building_name}</td>
                        <td className="font-mono">{r.meter_id}</td>
                        <td className="capitalize">{r.resource_type}</td>
                        <td className="font-semibold text-campus-bronze">{r.consumption} {r.unit}</td>
                        <td className="text-campus-muted">{r.expected_baseline} {r.unit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Error Feedback */}
        {ingestedSummary && ingestedSummary.error && (
          <div className="mt-4 p-3 rounded bg-rose-light border border-rose-border text-rose text-xs flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{ingestedSummary.error}</span>
          </div>
        )}
      </Card>
    </div>
  );
}

export default DataImportPage;
