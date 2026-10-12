import apiClient from './client.js';
import Papa from 'papaparse';

/**
 * Anomaly Management API Service
 */
export const AnomalyService = {
  /**
   * Mark an anomaly incident as resolved.
   * @param {string} anomalyId
   * @param {string} resolutionNotes
   */
  async resolveAnomaly(anomalyId, resolutionNotes = 'Verified by Facility Operations') {
    return apiClient.post(`/anomalies/${anomalyId}/resolve`, {
      notes: resolutionNotes,
      resolvedAt: new Date().toISOString()
    }, {
      mockHandler: () => ({
        success: true,
        anomalyId,
        status: 'Resolved',
        notes: resolutionNotes
      })
    });
  },

  /**
   * Export an array of anomaly objects to CSV file.
   * @param {Array<Object>} anomalies
   */
  exportToCsv(anomalies) {
    if (!anomalies || anomalies.length === 0) {
      throw new Error('No anomalies available to export.');
    }
    const cleanData = anomalies.map(a => ({
      ID: a.id,
      Timestamp: a.timestamp,
      Building: a.building,
      Meter_ID: a.meter_id,
      Resource: a.resource,
      Value: a.value,
      Expected_Baseline: a.expected,
      Excess: a.excess,
      Unit: a.unit,
      Severity: a.severity,
      Status: a.status,
      Evidence: a.evidence
    }));

    const csvString = Papa.unparse(cleanData);
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `CampusPulse_Anomalies_Audit_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }
};

export default AnomalyService;
