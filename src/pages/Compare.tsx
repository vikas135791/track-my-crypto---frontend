import { useEffect, useState } from 'react';
import CryptoCard from '../components/CryptoCard';
import ChartSection from '../components/ChartSection';

interface HistoricalPrice {
  time: string;
  price: number;
}

interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  price: number;
  volume: number;
  imageUrl: string;
  marketCap: number;
  change24h: number;
  historicalPrices?: HistoricalPrice[];
}

const Compare = () => {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [crypto1, setCrypto1] = useState<CryptoData | null>(null);
  const [crypto2, setCrypto2] = useState<CryptoData | null>(null);

  const generateMockHistory = (basePrice: number): HistoricalPrice[] => {
    const history: HistoricalPrice[] = [];
    const now = Date.now();
    for (let i = 0; i < 24; i++) {
      const time = new Date(now - i * 3600000).toISOString(); // hourly data
      const price = parseFloat((basePrice + (Math.random() - 0.5) * 0.1).toFixed(3));
      history.unshift({ time, price });
    }
    return history;
  };

  useEffect(() => {
    const storedData = localStorage.getItem('cryptoData');
    if (storedData) {
      const parsedData = JSON.parse(storedData);

      // Add mock historical prices if not present
      const enrichedData = parsedData.map((coin: CryptoData) => ({
        ...coin,
        symbol: coin.symbol?.toUpperCase(),
        historicalPrices: coin.historicalPrices || generateMockHistory(coin.price),
      }));

      setCryptoData(enrichedData);

      if (enrichedData.length > 1) {
        setCrypto1(enrichedData[0]);
        setCrypto2(enrichedData[1]);
      }
    }
  }, []);

  const formatPrice = (price: number) => {
    if (!price || isNaN(price)) return '0.00000';
    if (price < 0.01) return price.toFixed(6);
    if (price < 1) return price.toFixed(5);
    return price.toFixed(2);
  };

  if (!crypto1 || !crypto2) {
    return <div className="text-center text-white mt-20">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">Compare Cryptocurrencies</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <select
              value={crypto1.id}
              onChange={(e) => setCrypto1(cryptoData.find(c => c.id === e.target.value) || null)}
              className="w-full mb-4 p-3 rounded bg-gray-900 text-white border border-gray-700 focus:border-yellow-500 focus:outline-none"
            >
              {cryptoData.map((crypto) => (
                <option key={crypto.id} value={crypto.id}>{crypto.name}</option>
              ))}
            </select>
            <CryptoCard
              id={crypto1.id}
              name={crypto1.name}
              symbol={crypto1.symbol}
              price={parseFloat(formatPrice(crypto1.price))}
              change24h={crypto1.change24h}
              marketCap={crypto1.marketCap}
              volume={crypto1.volume}
              imageUrl={crypto1.imageUrl}
            />
          </div>

          <div>
            <select
              value={crypto2.id}
              onChange={(e) => setCrypto2(cryptoData.find(c => c.id === e.target.value) || null)}
              className="w-full mb-4 p-3 rounded bg-gray-900 text-white border border-gray-700 focus:border-yellow-500 focus:outline-none"
            >
              {cryptoData.map((crypto) => (
                <option key={crypto.id} value={crypto.id}>{crypto.name}</option>
              ))}
            </select>
            <CryptoCard
              id={crypto2.id}
              name={crypto2.name}
              symbol={crypto2.symbol}
              price={parseFloat(formatPrice(crypto2.price))}
              change24h={crypto2.change24h}
              marketCap={crypto2.marketCap}
              volume={crypto2.volume}
              imageUrl={crypto2.imageUrl}
            />
          </div>
        </div>

        <div className="mt-12 bg-gray-900 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-6">Detailed Comparison</h2>
          <table className="w-full">
            <tbody className="divide-y divide-gray-800">
              <tr>
                <td className="py-4 text-gray-400">Price Difference</td>
                <td className="py-4 text-right">
                ${formatPrice(Math.abs(crypto1.price - crypto2.price))}
                </td>
              </tr>
              <tr>
                <td className="py-4 text-gray-400">Market Cap Difference</td>
                <td className="py-4 text-right">
                  ${Math.abs((crypto1.marketCap || 0) - (crypto2.marketCap || 0)).toLocaleString()}
                </td>
              </tr>
              <tr>
                <td className="py-4 text-gray-400">24h Volume Difference</td>
                <td className="py-4 text-right">
                  ${Math.abs((crypto1.volume || 0) - (crypto2.volume || 0)).toLocaleString()}
                </td>
              </tr>
              <tr>
                <td className="py-4 text-gray-400">24h Change Difference</td>
                <td className="py-4 text-right">
                  {Math.abs((crypto1.change24h || 0) - (crypto2.change24h || 0)).toFixed(2)}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <ChartSection
            name={crypto1.name}
            historicalPrices={crypto1.historicalPrices!.map(h => [new Date(h.time).getTime(), h.price])}
          />
          <ChartSection
            name={crypto2.name}
            historicalPrices={crypto2.historicalPrices!.map(h => [new Date(h.time).getTime(), h.price])}
          />
        </div>
      </div>
    </div>
  );
};

export default Compare;
