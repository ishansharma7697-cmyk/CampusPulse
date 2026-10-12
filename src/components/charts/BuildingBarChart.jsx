import React, { useEffect, useRef } from 'react';
import {
  Chart,
  BarController,
  BarElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
} from 'chart.js';
import { useTheme } from '../../context/ThemeContext.jsx';

Chart.register(
  BarController,
  BarElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
);

export function BuildingBarChart({
  labels = [],
  data = null,
  label = 'Consumption',
  unit = 'kWh',
  color = null,
  electricityData = null,
  waterData = null,
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

    let datasets = [];

    if (data !== null) {
      // Single Resource View (clean, accurate units)
      const barColor = color || (isDark ? '#d4a755' : '#8c672b');
      datasets = [
        {
          label: `${label} (${unit})`,
          data,
          backgroundColor: barColor,
          borderRadius: 3
        }
      ];
    } else if (electricityData && waterData) {
      // Fallback dual view if both provided
      datasets = [
        {
          label: 'Electricity (kWh)',
          data: electricityData,
          backgroundColor: isDark ? '#d4a755' : '#8c672b',
          borderRadius: 3
        },
        {
          label: 'Water (Liters)',
          data: waterData,
          backgroundColor: isDark ? '#60a5fa' : '#2563eb',
          borderRadius: 3
        }
      ];
    }

    chartInstanceRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 250 },
        plugins: {
          legend: {
            display: datasets.length > 1,
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
            cornerRadius: 4,
            callbacks: {
              label: (context) => {
                const val = Number(context.raw).toLocaleString();
                return ` ${context.dataset.label}: ${val}`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              font: { family: 'Inter', size: 10 },
              color: textColor
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
  }, [labels, data, label, unit, color, electricityData, waterData, isDark]);

  return (
    <div style={{ height, position: 'relative', width: '100%' }}>
      <canvas ref={canvasRef} />
    </div>
  );
}

export default BuildingBarChart;

