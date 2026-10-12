import React, { useEffect, useRef } from 'react';
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { useTheme } from '../../context/ThemeContext.jsx';

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

/**
 * Line Chart for actual telemetry consumption vs baseline model
 */
export function TrendLineChart({
  labels = [],
  actualData = [],
  baselineData = [],
  actualLabel = 'Actual Consumption',
  baselineLabel = 'Expected Baseline',
  borderColor = '#8c672b',
  backgroundColor = 'rgba(140, 103, 43, 0.08)',
  unit = 'kWh',
  height = 240
}) {
  const canvasRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const { isDark } = useTheme();

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(228, 223, 215, 0.45)';
    const textColor = isDark ? '#9e978c' : '#6b655f';
    const tooltipBg = isDark ? '#23211d' : '#1c1a17';

    const datasets = [
      {
        label: `${actualLabel} (${unit})`,
        data: actualData,
        borderColor: borderColor,
        backgroundColor: backgroundColor,
        fill: true,
        tension: 0.25,
        borderWidth: 2,
        pointRadius: 2,
        pointHoverRadius: 5
      }
    ];

    if (baselineData && baselineData.length > 0) {
      datasets.push({
        label: `${baselineLabel} (${unit})`,
        data: baselineData,
        borderColor: isDark ? '#6b655f' : '#c7beaf',
        borderDash: [5, 4],
        fill: false,
        tension: 0.25,
        borderWidth: 1.5,
        pointRadius: 0,
        pointHoverRadius: 4
      });
    }

    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 250 },
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: {
            position: 'top',
            align: 'end',
            labels: {
              boxWidth: 12,
              font: { family: 'Inter', size: 11 },
              color: textColor
            }
          },
          tooltip: {
            backgroundColor: tooltipBg,
            borderColor: isDark ? '#4a443a' : 'transparent',
            borderWidth: isDark ? 1 : 0,
            titleFont: { family: 'Inter', size: 12 },
            bodyFont: { family: 'Inter', size: 11 },
            padding: 10,
            cornerRadius: 4
          }
        },
        scales: {
          x: {
            grid: { color: gridColor },
            ticks: {
              font: { family: 'Inter', size: 10 },
              color: textColor,
              maxTicksLimit: 10
            }
          },
          y: {
            grid: { color: gridColor },
            ticks: {
              font: { family: 'Inter', size: 10 },
              color: textColor
            }
          }
        }
      }
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [labels, actualData, baselineData, actualLabel, baselineLabel, borderColor, backgroundColor, unit, isDark]);

  return (
    <div style={{ height, position: 'relative', width: '100%' }}>
      <canvas ref={canvasRef} />
    </div>
  );
}

export default TrendLineChart;
