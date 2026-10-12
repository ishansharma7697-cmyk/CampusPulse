import React, { useEffect, useRef } from 'react';
import {
  Chart,
  BarController,
  LineController,
  BarElement,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
} from 'chart.js';
import { useTheme } from '../../context/ThemeContext.jsx';

Chart.register(
  BarController,
  LineController,
  BarElement,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
);

export function HourlyProfileChart({
  labels = [],
  actualData = [],
  baselineData = [],
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

    chartInstanceRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            type: 'bar',
            label: 'Observed Hourly Average',
            data: actualData,
            backgroundColor: isDark ? '#d4a755' : '#8c672b',
            borderRadius: 3
          },
          {
            type: 'line',
            label: 'Modeled Baseline',
            data: baselineData,
            borderColor: isDark ? '#9e978c' : '#6b655f',
            borderDash: [4, 4],
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 4,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 250 },
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
            padding: 10,
            cornerRadius: 4
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
  }, [labels, actualData, baselineData, isDark]);

  return (
    <div style={{ height, position: 'relative', width: '100%' }}>
      <canvas ref={canvasRef} />
    </div>
  );
}

export default HourlyProfileChart;
