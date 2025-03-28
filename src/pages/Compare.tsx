import { useEffect, useState } from 'react';
import CryptoCard from '../components/CryptoCard';

const Compare = () => {
  const [cryptoData, setCryptoData] = useState([]);
  const [crypto1, setCrypto1] = useState(null);
  const [crypto2, setCrypto2] = useState(null);

  useEffect(() => {
    const storedData = localStorage.getItem('cryptoData');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setCryptoData(parsedData);

      if (parsedData.length > 1) {
        setCrypto1(parsedData[0]);
        setCrypto2(parsedData[1]);
      }
    }
  }, []);

  if (!crypto1 || !crypto2) {
    return <div className="text-center text-white mt-20">Loading...</div>;
  }

  return (
      <div className="min-h-screen bg-black text-white pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold mb-8">Compare Cryptocurrencies</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* First Crypto Selection */}
            <div>
              <select
                  value={crypto1.id}
                  onChange={(e) => setCrypto1(cryptoData.find(c => c.id === e.target.value))}
                  className="w-full mb-4 p-3 rounded bg-gray-900 text-white border border-gray-700 focus:border-yellow-500 focus:outline-none"
              >
                {cryptoData.map((crypto) => (
                    <option key={crypto.id} value={crypto.id}>{crypto.name}</option>
                ))}
              </select>
              <CryptoCard {...crypto1} />
            </div>

            {/* Second Crypto Selection */}
            <div>
              <select
                  value={crypto2.id}
                  onChange={(e) => setCrypto2(cryptoData.find(c => c.id === e.target.value))}
                  className="w-full mb-4 p-3 rounded bg-gray-900 text-white border border-gray-700 focus:border-yellow-500 focus:outline-none"
              >
                {cryptoData.map((crypto) => (
                    <option key={crypto.id} value={crypto.id}>{crypto.name}</option>
                ))}
              </select>
              <CryptoCard {...crypto2} />
            </div>
          </div>

          {/* Comparison Table */}
          <div className="mt-12 bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-6">Detailed Comparison</h2>
            <table className="w-full">
              <tbody className="divide-y divide-gray-800">
              <tr>
                <td className="py-4 text-gray-400">Price Difference</td>
                <td className="py-4 text-right">
                  ${Math.abs(crypto1.price - crypto2.price)?.toLocaleString()}
                </td>
              </tr>
              <tr>
                <td className="py-4 text-gray-400">Market Cap Difference</td>
                <td className="py-4 text-right">
                  ${Math.abs(crypto1.marketCap - crypto2.marketCap)?.toLocaleString()}
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
                  {Math.abs(crypto1.change24h - crypto2.change24h)?.toFixed(2)}%
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
  );
};

export default Compare;
