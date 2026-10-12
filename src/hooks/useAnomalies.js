import { useTelemetry } from '../context/TelemetryContext.jsx';
import AnomalyService from '../api/anomalyService.js';

/**
 * Custom hook for anomaly data management, resolution, and CSV export
 */
export function useAnomalies() {
  const { anomalies, resolveAnomaly, addToast } = useTelemetry();

  const exportLedger = () => {
    try {
      AnomalyService.exportToCsv(anomalies);
      addToast(`Exported ${anomalies.length} anomaly records to CSV`, 'success');
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  return {
    anomalies,
    resolveAnomaly,
    exportLedger
  };
}

export default useAnomalies;
