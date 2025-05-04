import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const CryptoChart = ({ cryptoId }: any) => {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await axios.get(`http://localhost:4001/api/market_chart/${cryptoId}`, {
          params: { days: 30 },
        });
        const prices = response.data.prices;
        const labels = prices.map((price: any) => new Date(price[0]).toLocaleDateString());
        const data = prices.map((price: any) => price[1]);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Price (USD)',
              data,
              borderColor: 'rgba(75,192,192,1)',
              backgroundColor: 'rgba(75,192,192,0.2)',
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };

    fetchChartData();
  }, [cryptoId]);

  if (!chartData) return <div>Loading chart...</div>;

  return (
    <div>
      <h2>Price Chart</h2>
      <Line data={chartData} />
    </div>
  );
};

export default CryptoChart;
