import { useParams, Navigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Clock } from 'lucide-react';
import { useBookmarks } from '../context/BookmarkContext';

// Demo data - this would come from an API in the future
const cryptoData = {
  bitcoin: {
    name: 'Bitcoin',
    symbol: 'BTC',
    price: 83137.00,
    change24h: -1.44,
    marketCap: 1649732000000,
    volume24h: 48256000000,
    circulatingSupply: 19584362,
    imageUrl: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
  },
  ethereum: {
    name: 'Ethereum',
    symbol: 'ETH',
    price: 1896.54,
    change24h: -1.70,
    marketCap: 228852000000,
    volume24h: 15678000000,
    circulatingSupply: 120456789,
    imageUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
  },
  cardano: {
    name: 'Cardano',
    symbol: 'ADA',
    price: 0.71,
    change24h: -4.32,
    marketCap: 25578000000,
    volume24h: 892000000,
    circulatingSupply: 35987654321,
    imageUrl: 'https://cryptologos.cc/logos/cardano-ada-logo.png',
  },
  dogecoin: {
    name: 'Dogecoin',
    symbol: 'DOGE',
    price: 0.17,
    change24h: -2.36,
    marketCap: 25582000000,
    volume24h: 756000000,
    circulatingSupply: 150456789012,
    imageUrl: 'https://cryptologos.cc/logos/dogecoin-doge-logo.png',
  },
  tron: {
    name: 'Tron',
    symbol: 'TRX',
    price: 0.21,
    change24h: -3.65,
    marketCap: 20191000000,
    volume24h: 645000000,
    circulatingSupply: 89765432100,
    imageUrl: 'https://cryptologos.cc/logos/tron-trx-logo.png',
  },
};

const CryptoDetail = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const { isBookmarked, addBookmark, removeBookmark } = useBookmarks();
  
  // Find the crypto data based on the URL parameter
  const crypto = Object.values(cryptoData).find(
    (crypto) => crypto.symbol.toLowerCase() === symbol?.toLowerCase()
  );

  // If crypto is not found, redirect to home
  if (!symbol || !crypto) {
    return <Navigate to="/" />;
  }

  const handleBookmarkToggle = () => {
    if (isBookmarked(crypto.symbol)) {
      removeBookmark(crypto.symbol);
    } else {
      addBookmark(crypto.symbol);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <img src={crypto.imageUrl} alt={crypto.name} className="w-16 h-16" />
            <div>
              <h1 className="text-3xl font-bold">{crypto.name}</h1>
              <p className="text-gray-400">{crypto.symbol}</p>
            </div>
          </div>
          <button
            onClick={handleBookmarkToggle}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
              isBookmarked(crypto.symbol)
                ? 'bg-yellow-500 text-black'
                : 'bg-gray-800 text-yellow-500'
            }`}
          >
            <span>{isBookmarked(crypto.symbol) ? 'Bookmarked' : 'Bookmark'}</span>
          </button>
        </div>

        {/* Price Overview */}
        <div className="bg-gray-900 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-gray-400 mb-2">Price</p>
              <div className="flex items-center">
                <DollarSign className="text-yellow-500 mr-2" />
                <span className="text-2xl font-bold">${crypto.price.toLocaleString()}</span>
              </div>
            </div>
            <div>
              <p className="text-gray-400 mb-2">24h Change</p>
              <div className={`flex items-center ${crypto.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {crypto.change24h >= 0 ? <TrendingUp className="mr-2" /> : <TrendingDown className="mr-2" />}
                <span className="text-2xl font-bold">{Math.abs(crypto.change24h)}%</span>
              </div>
            </div>
            <div>
              <p className="text-gray-400 mb-2">Market Cap</p>
              <div className="flex items-center">
                <BarChart3 className="text-yellow-500 mr-2" />
                <span className="text-2xl font-bold">${crypto.marketCap.toLocaleString()}</span>
              </div>
            </div>
            <div>
              <p className="text-gray-400 mb-2">24h Volume</p>
              <div className="flex items-center">
                <Clock className="text-yellow-500 mr-2" />
                <span className="text-2xl font-bold">${crypto.volume24h.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Price Chart */}
        <div className="bg-gray-900 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Price Chart</h2>
          <div className="h-96 flex items-center justify-center">
            <p className="text-gray-400">Chart will be implemented with real data</p>
          </div>
        </div>

        {/* Market Stats */}
        <div className="bg-gray-900 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Market Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-800 rounded-lg">
              <p className="text-gray-400">Circulating Supply</p>
              <p className="text-xl font-bold">{crypto.circulatingSupply.toLocaleString()} {crypto.symbol}</p>
            </div>
            <div className="p-4 bg-gray-800 rounded-lg">
              <p className="text-gray-400">Market Rank</p>
              <p className="text-xl font-bold">#{Object.values(cryptoData).findIndex(c => c.symbol === crypto.symbol) + 1}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoDetail;