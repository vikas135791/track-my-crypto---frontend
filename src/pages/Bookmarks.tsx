import { useBookmarks } from '../context/BookmarkContext';
import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';

// Demo data - this would come from an API in the future
const cryptoData = {
  BTC: {
    name: 'Bitcoin',
    symbol: 'BTC',
    price: 83137.00,
    change24h: -1.44,
    imageUrl: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
  },
  ETH: {
    name: 'Ethereum',
    symbol: 'ETH',
    price: 1896.54,
    change24h: -1.70,
    imageUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
  },
  ADA: {
    name: 'Cardano',
    symbol: 'ADA',
    price: 0.71,
    change24h: -4.32,
    imageUrl: 'https://cryptologos.cc/logos/cardano-ada-logo.png',
  },
  DOGE: {
    name: 'Dogecoin',
    symbol: 'DOGE',
    price: 0.17,
    change24h: -2.36,
    imageUrl: 'https://cryptologos.cc/logos/dogecoin-doge-logo.png',
  },
  TRX: {
    name: 'Tron',
    symbol: 'TRX',
    price: 0.21,
    change24h: -3.65,
    imageUrl: 'https://cryptologos.cc/logos/tron-trx-logo.png',
  },
};

const Bookmarks = () => {
  const { bookmarks, removeBookmark } = useBookmarks();

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Your Bookmarks</h1>
            <p className="text-gray-400 mt-2">Track your favorite cryptocurrencies</p>
          </div>
          <div className="bg-gray-800 px-4 py-2 rounded-lg">
            <span className="text-yellow-500 font-semibold">{bookmarks.length}</span>
            <span className="text-gray-400 ml-2">Bookmarked</span>
          </div>
        </div>

        {bookmarks.length === 0 ? (
          <div className="bg-gray-900 rounded-lg p-8 text-center">
            <p className="text-gray-400 mb-4">You haven't bookmarked any cryptocurrencies yet.</p>
            <Link
              to="/"
              className="inline-block bg-yellow-500 text-black px-6 py-2 rounded hover:bg-yellow-600 transition-colors"
            >
              Explore Cryptocurrencies
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarks.map((symbol) => {
              const crypto = cryptoData[symbol as keyof typeof cryptoData];
              if (!crypto) return null;

              return (
                <div key={symbol} className="bg-gray-900 rounded-lg p-6 hover:bg-gray-800 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <img src={crypto.imageUrl} alt={crypto.name} className="w-10 h-10" />
                      <div>
                        <h3 className="font-semibold text-lg">{crypto.name}</h3>
                        <p className="text-gray-400">{crypto.symbol}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeBookmark(symbol)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      title="Remove from bookmarks"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>

                  <div className="flex items-end justify-between mt-4">
                    <div>
                      <p className="text-2xl font-bold">${crypto.price.toLocaleString()}</p>
                      <p
                        className={`text-sm ${
                          crypto.change24h >= 0 ? 'text-green-500' : 'text-red-500'
                        }`}
                      >
                        {crypto.change24h >= 0 ? '+' : ''}{crypto.change24h}%
                      </p>
                    </div>
                    <Link
                      to={`/crypto/${crypto.symbol.toLowerCase()}`}
                      className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600 transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;
