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

export function RoiProjectionChart({
  projectionData = [],
  height = 200
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

    const labels = projectionData.map(d => d.year);
    const cumulativeValues = projectionData.map(d => d.cumulativeSavings);

    chartInstanceRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Cumulative Cost Recovered (₹)',
          data: cumulativeValues,
          backgroundColor: isDark ? '#d4a755' : '#8c672b',
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 250 },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: tooltipBg,
            borderColor: isDark ? '#4a443a' : 'transparent',
            borderWidth: isDark ? 1 : 0,
            padding: 10,
            cornerRadius: 4,
            callbacks: {
              label: (context) => `Recovered: ₹${Number(context.raw).toLocaleString('en-IN')}`
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
              color: textColor,
              callback: (value) => `₹${Number(value).toLocaleString('en-IN')}`
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
  }, [projectionData, isDark]);

  return (
    <div style={{ height, position: 'relative', width: '100%' }}>
      <canvas ref={canvasRef} />
    </div>
  );
}

export default RoiProjectionChart;
