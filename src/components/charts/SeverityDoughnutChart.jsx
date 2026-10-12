import React, { useEffect, useRef } from 'react';
import {
  Chart,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

Chart.register(
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend
);

export function SeverityDoughnutChart({
  counts = { Critical: 0, High: 0, Medium: 0, Low: 0 },
  height = 190
}) {
  const canvasRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const dataValues = [
      counts.Critical || 0,
      counts.High || 0,
      counts.Medium || 0,
      counts.Low || 0
    ];

    const hasData = dataValues.some(v => v > 0);

    chartInstanceRef.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Critical', 'High', 'Medium', 'Low'],
        datasets: [{
          data: hasData ? dataValues : [1],
          backgroundColor: hasData
            ? ['#be123c', '#ea580c', '#d97706', '#2563eb']
            : ['#e4dfd7'],
          borderWidth: 2,
          borderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        animation: { duration: 300 },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              boxWidth: 10,
              font: { family: 'Inter', size: 10 },
              color: '#6b655f'
            }
          },
          tooltip: {
            enabled: hasData,
            backgroundColor: '#1c1a17',
            padding: 8,
            cornerRadius: 4
          }
        }
      }
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [counts]);

  return (
    <div style={{ height, position: 'relative', width: '100%' }}>
      <canvas ref={canvasRef} />
    </div>
  );
}

export default SeverityDoughnutChart;
