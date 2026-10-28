import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

export default function PieChart({ done, pending }) {
  const ref = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) chartRef.current.destroy();
    chartRef.current = new Chart(ref.current, {
      type: 'pie',
      data: {
        labels: ['Completed today', 'Remaining today'],
        datasets: [{
          data: [done, pending],
          backgroundColor: ['#8fcfae', '#b79ce0'],
          borderColor: '#fffdf3',
          borderWidth: 3,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { color: '#6b4a56', font: { family: 'Quicksand', size: 12 }, boxWidth: 12, padding: 14 } },
        },
      },
    });
    return () => { if (chartRef.current) chartRef.current.destroy(); };
  }, [done, pending]);

  return <canvas ref={ref}></canvas>;
}
