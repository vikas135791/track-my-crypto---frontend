import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from 'chart.js';
import CrosshairPlugin from 'chartjs-plugin-crosshair';

// Register all necessary components ONCE
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  CrosshairPlugin
);

interface ChartSectionProps {
  name: string;
  historicalPrices: Array<[number, number]>;
}

const ChartSection: React.FC<ChartSectionProps> = ({ name, historicalPrices }) => {
  if (!historicalPrices || historicalPrices.length === 0) return null;

  const labels: string[] = historicalPrices.map(([timestamp]) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  });

  const prices: number[] = historicalPrices.map(([, price]) => price);

  const chartData: ChartData<'line', number[], string> = {
    labels,
    datasets: [
      {
        label: `${name} Price (USD)`,
        data: prices,
        borderColor: 'rgba(255, 206, 86, 1)',
        backgroundColor: 'rgba(255, 206, 86, 0.1)',
        tension: 0.3,
        pointRadius: 0,
        pointHoverRadius: 5,
        fill: true,
      },
    ],
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: '#222',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#555',
        borderWidth: 1,
        callbacks: {
          label: (tooltipItem) => `$${tooltipItem.formattedValue}`,
        },
      },
      legend: {
        labels: {
          color: 'white',
        },
      },
      crosshair: {
        line: {
          color: 'rgba(255,255,255,0.2)',
          width: 1,
        },
        sync: { enabled: false },
        zoom: { enabled: false },
        snap: { enabled: true },
      } as any,
    },
    scales: {
      x: {
        ticks: { color: '#aaa', maxTicksLimit: 10 },
        grid: { color: '#333' },
      },
      y: {
        ticks: {
          color: '#aaa',
          callback: (value: number | string) => `$${value.toLocaleString()}`,
        },
        grid: { color: '#333' },
      },
    },
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6 shadow-lg h-[400px]">
      <h2 className="text-lg font-semibold text-white mb-4">{name} Price Chart</h2>
      <Line
        key={`${name}-${historicalPrices.length}`}
        data={chartData}
        options={chartOptions}
      />
    </div>
  );
};

export default ChartSection;
