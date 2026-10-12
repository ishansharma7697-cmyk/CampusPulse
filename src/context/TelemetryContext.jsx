import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from 'react';
import { generateSyntheticDataset, generateLiveTelemetryReading } from '../services/dataGenerator.js';
import { runAnomalyEngine } from '../services/anomalyEngine.js';
import { calculateFinancialImpact } from '../services/financialEngine.js';
import { calculateEsgImpact } from '../services/esgEngine.js';
import { TARIFF_CONFIG } from '../config/tariffs.config.js';
import { ENV } from '../config/env.config.js';
import TelemetryService from '../api/telemetryService.js';

// Action Types
const ACTION = {
  SET_DATASET: 'SET_DATASET',
  INGEST_DATASET: 'INGEST_DATASET',
  APPEND_READING: 'APPEND_READING',
  UPDATE_FILTER: 'UPDATE_FILTER',
  RESET_FILTERS: 'RESET_FILTERS',
  UPDATE_TARIFF: 'UPDATE_TARIFF',
  RESOLVE_ANOMALY: 'RESOLVE_ANOMALY',
  SET_LIVE_SIMULATION: 'SET_LIVE_SIMULATION',
  ADD_TOAST: 'ADD_TOAST',
  REMOVE_TOAST: 'REMOVE_TOAST',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR'
};

const initialState = {
  rawDataset: [],
  filters: {
    dateRange: 'ALL',
    building: 'ALL',
    resource: 'ALL',
    dayType: 'ALL',
    occupancy: 'ALL'
  },
  tariffs: {
    electricity: TARIFF_CONFIG.DEFAULT_TARIFFS.electricity,
    water: TARIFF_CONFIG.DEFAULT_TARIFFS.water,
    recoveryRate: TARIFF_CONFIG.DEFAULT_TARIFFS.recoveryRate
  },
  isLiveStreaming: false,
  isLoading: false,
  error: null,
  toasts: []
};

function telemetryReducer(state, action) {
  switch (action.type) {
    case ACTION.SET_DATASET:
      return {
        ...state,
        rawDataset: action.payload,
        filters: {
          ...state.filters,
          building: 'ALL',
          dateRange: 'ALL'
        },
        isLoading: false,
        error: null
      };

    case ACTION.INGEST_DATASET: {
      const { records, append } = action.payload;
      const combined = append ? [...state.rawDataset, ...records] : records;
      return {
        ...state,
        rawDataset: combined,
        // Reset filters so the ingested data is instantly visible
        filters: {
          dateRange: 'ALL',
          building: 'ALL',
          resource: 'ALL',
          dayType: 'ALL',
          occupancy: 'ALL'
        },
        isLoading: false,
        error: null
      };
    }

    case ACTION.APPEND_READING:
      return {
        ...state,
        rawDataset: [...state.rawDataset, action.payload]
      };

    case ACTION.UPDATE_FILTER:
      return {
        ...state,
        filters: {
          ...state.filters,
          [action.payload.key]: action.payload.value
        }
      };

    case ACTION.RESET_FILTERS:
      return {
        ...state,
        filters: {
          dateRange: 'ALL',
          building: 'ALL',
          resource: 'ALL',
          dayType: 'ALL',
          occupancy: 'ALL'
        }
      };

    case ACTION.UPDATE_TARIFF:
      return {
        ...state,
        tariffs: {
          ...state.tariffs,
          [action.payload.key]: action.payload.value
        }
      };

    case ACTION.RESOLVE_ANOMALY: {
      const anomalyId = action.payload;
      const resolvedIds = state.resolvedAnomalyIds || new Set();
      const updatedResolved = new Set(resolvedIds);
      updatedResolved.add(anomalyId);
      return {
        ...state,
        resolvedAnomalyIds: updatedResolved
      };
    }

    case ACTION.SET_LIVE_SIMULATION:
      return {
        ...state,
        isLiveStreaming: action.payload
      };

    case ACTION.ADD_TOAST:
      return {
        ...state,
        toasts: [...state.toasts, action.payload]
      };

    case ACTION.REMOVE_TOAST:
      return {
        ...state,
        toasts: state.toasts.filter(t => t.id !== action.payload)
      };

    case ACTION.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };

    case ACTION.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    default:
      return state;
  }
}

const TelemetryContext = createContext(null);

export function TelemetryProvider({ children }) {
  const [state, dispatch] = useReducer(telemetryReducer, initialState);

  // Toast Helpers
  const addToast = useCallback((message, type = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    dispatch({ type: ACTION.ADD_TOAST, payload: { id, message, type } });
    setTimeout(() => {
      dispatch({ type: ACTION.REMOVE_TOAST, payload: id });
    }, 4500);
  }, []);

  const removeToast = useCallback((id) => {
    dispatch({ type: ACTION.REMOVE_TOAST, payload: id });
  }, []);

  // Initial Data Load
  useEffect(() => {
    try {
      const dataset = generateSyntheticDataset();
      dispatch({ type: ACTION.SET_DATASET, payload: dataset });
    } catch (err) {
      dispatch({ type: ACTION.SET_ERROR, payload: err.message });
      addToast('Failed to initialize telemetry: ' + err.message, 'error');
    }
  }, [addToast]);

  // Live Stream Simulation Effect
  useEffect(() => {
    if (!state.isLiveStreaming) return;

    const interval = setInterval(() => {
      const reading = generateLiveTelemetryReading();
      dispatch({ type: ACTION.APPEND_READING, payload: reading });
    }, ENV.SIMULATION.INTERVAL_MS);

    return () => clearInterval(interval);
  }, [state.isLiveStreaming]);

  // Filter Pipeline: Compute filteredDataset anchored dynamically to latest dataset time
  const filteredDataset = useMemo(() => {
    let filtered = [...state.rawDataset];
    if (filtered.length === 0) return [];

    // Find the latest valid timestamp in dataset to anchor relative time filters
    const timestamps = filtered
      .map(d => new Date(d.timestamp).getTime())
      .filter(t => !isNaN(t));

    const maxTimestamp = timestamps.length > 0 ? Math.max(...timestamps) : Date.now();
    const maxDate = new Date(maxTimestamp);

    // 1. Time Horizon Filter
    if (state.filters.dateRange === 'TODAY') {
      const latestDateStr = maxDate.toDateString();
      filtered = filtered.filter(d => new Date(d.timestamp).toDateString() === latestDateStr);
    } else if (state.filters.dateRange === '7D') {
      const cutoff = new Date(maxTimestamp - (7 * 24 * 3600 * 1000));
      filtered = filtered.filter(d => new Date(d.timestamp) >= cutoff);
    } else if (state.filters.dateRange === '14D') {
      const cutoff = new Date(maxTimestamp - (14 * 24 * 3600 * 1000));
      filtered = filtered.filter(d => new Date(d.timestamp) >= cutoff);
    }
    // 'ALL' retains 100% of the dataset

    // 2. Building Filter
    if (state.filters.building !== 'ALL') {
      filtered = filtered.filter(d => d.building_name === state.filters.building);
    }

    // 3. Resource Filter
    if (state.filters.resource !== 'ALL') {
      filtered = filtered.filter(d => d.resource_type === state.filters.resource);
    }

    // 4. Day Type Filter
    if (state.filters.dayType !== 'ALL') {
      filtered = filtered.filter(d => d.day_type === state.filters.dayType);
    }

    // 5. Occupancy Filter
    if (state.filters.occupancy !== 'ALL') {
      filtered = filtered.filter(d => d.occupancy_status === state.filters.occupancy);
    }

    return filtered;
  }, [state.rawDataset, state.filters]);

  // Derived Anomalies
  const anomalies = useMemo(() => {
    const rawAnomalies = runAnomalyEngine(filteredDataset);
    const resolvedIds = state.resolvedAnomalyIds || new Set();
    return rawAnomalies.map(a => ({
      ...a,
      status: resolvedIds.has(a.id) ? 'Resolved' : 'New'
    }));
  }, [filteredDataset, state.resolvedAnomalyIds]);

  // Derived Financial Impact
  const financials = useMemo(() => {
    return calculateFinancialImpact(filteredDataset, state.tariffs);
  }, [filteredDataset, state.tariffs]);

  // Derived ESG Metrics
  const esg = useMemo(() => {
    return calculateEsgImpact(filteredDataset);
  }, [filteredDataset]);

  // Extract list of all unique building names
  const availableBuildings = useMemo(() => {
    const set = new Set(state.rawDataset.map(d => d.building_name).filter(Boolean));
    return Array.from(set).sort();
  }, [state.rawDataset]);

  // Action Dispatchers
  const setFilter = useCallback((key, value) => {
    dispatch({ type: ACTION.UPDATE_FILTER, payload: { key, value } });
  }, []);

  const resetFilters = useCallback(() => {
    dispatch({ type: ACTION.RESET_FILTERS });
  }, []);

  const setTariff = useCallback((key, value) => {
    dispatch({ type: ACTION.UPDATE_TARIFF, payload: { key, value } });
  }, []);

  const setDataset = useCallback((newDataset) => {
    dispatch({ type: ACTION.SET_DATASET, payload: newDataset });
  }, []);

  const ingestDataset = useCallback((records, append = false) => {
    dispatch({ type: ACTION.INGEST_DATASET, payload: { records, append } });
  }, []);

  const loadPreset = useCallback(async (presetKey) => {
    dispatch({ type: ACTION.SET_LOADING, payload: true });
    try {
      const data = await TelemetryService.loadPresetScenario(presetKey);
      dispatch({ type: ACTION.SET_DATASET, payload: data });
      const titles = {
        normal: 'Baseline Operations',
        water_leak: 'Severe Water Pipe Rupture',
        weekend_waste: 'Weekend HVAC Overrun'
      };
      addToast(`Scenario loaded: ${titles[presetKey] || presetKey}`, 'info');
    } catch (err) {
      addToast(`Failed to load preset scenario: ${err.message}`, 'error');
    } finally {
      dispatch({ type: ACTION.SET_LOADING, payload: false });
    }
  }, [addToast]);

  const toggleLiveSimulation = useCallback(() => {
    const nextState = !state.isLiveStreaming;
    dispatch({ type: ACTION.SET_LIVE_SIMULATION, payload: nextState });
    addToast(
      nextState ? 'Live telemetry stream enabled' : 'Live telemetry stream paused',
      nextState ? 'success' : 'info'
    );
  }, [state.isLiveStreaming, addToast]);

  const resolveAnomaly = useCallback((id) => {
    dispatch({ type: ACTION.RESOLVE_ANOMALY, payload: id });
    addToast(`Anomaly incident ${id} marked as resolved`, 'success');
  }, [addToast]);

  const contextValue = useMemo(() => ({
    rawDataset: state.rawDataset,
    filteredDataset,
    anomalies,
    financials,
    esg,
    filters: state.filters,
    tariffs: state.tariffs,
    availableBuildings,
    isLiveStreaming: state.isLiveStreaming,
    isLoading: state.isLoading,
    error: state.error,
    toasts: state.toasts,
    setFilter,
    resetFilters,
    setTariff,
    setDataset,
    ingestDataset,
    loadPreset,
    toggleLiveSimulation,
    resolveAnomaly,
    addToast,
    removeToast
  }), [
    state.rawDataset,
    filteredDataset,
    anomalies,
    financials,
    esg,
    state.filters,
    state.tariffs,
    availableBuildings,
    state.isLiveStreaming,
    state.isLoading,
    state.error,
    state.toasts,
    setFilter,
    resetFilters,
    setTariff,
    setDataset,
    ingestDataset,
    loadPreset,
    toggleLiveSimulation,
    resolveAnomaly,
    addToast,
    removeToast
  ]);

  return (
    <TelemetryContext.Provider value={contextValue}>
      {children}
    </TelemetryContext.Provider>
  );
}

export function useTelemetry() {
  const context = useContext(TelemetryContext);
  if (!context) {
    throw new Error('useTelemetry must be used within a TelemetryProvider');
  }
  return context;
}

export default TelemetryContext;
