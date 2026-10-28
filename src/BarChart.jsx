import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { DAY_KEYS, TODAY_INDEX } from './constants.js';

export default function BarChart({ data }) {
  const ref = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) chartRef.current.destroy();
    chartRef.current = new Chart(ref.current, {
      type: 'bar',
      data: {
        labels: DAY_KEYS.map(d => d),
        datasets: [{
          label: 'Tasks done',
          data,
          backgroundColor: DAY_KEYS.map(d => d === TODAY_INDEX ? '#ee7fa6' : '#b79ce0'),
          borderRadius: 4,
          maxBarThickness: 16,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { color: '#b08a97', font: { family: 'Quicksand', size: 10 } } },
          y: {
            beginAtZero: true, ticks: { stepSize: 1, color: '#b08a97', font: { family: 'Quicksand', size: 11 } },
            grid: { color: '#f3c3d6' },
          },
        },
      },
    });
    return () => { if (chartRef.current) chartRef.current.destroy(); };
  }, [data]);

  return <canvas ref={ref}></canvas>;
}
