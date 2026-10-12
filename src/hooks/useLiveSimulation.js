import { useTelemetry } from '../context/TelemetryContext.jsx';

/**
 * Custom hook to control streaming telemetry simulation
 */
export function useLiveSimulation() {
  const { isLiveStreaming, toggleLiveSimulation } = useTelemetry();
  return {
    isLiveStreaming,
    toggleLiveSimulation
  };
}

export default useLiveSimulation;
