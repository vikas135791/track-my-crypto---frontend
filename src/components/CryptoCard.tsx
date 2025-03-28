import React from 'react';
import { Link } from 'react-router-dom';
import { useBookmarks } from '../context/BookmarkContext';
import { Star, TrendingUp, TrendingDown } from 'lucide-react';

interface CryptoCardProps {
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume: number;
  imageUrl: string;
}

const CryptoCard: React.FC<CryptoCardProps> = ({
  name,
  symbol,
  price,
  change24h,
  marketCap,
  volume,
  imageUrl,
}) => {
  const { isBookmarked, addBookmark, removeBookmark } = useBookmarks();
  const bookmarked = isBookmarked(symbol);
  const isPositive = change24h >= 0;

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (bookmarked) {
      removeBookmark(symbol);
    } else {
      addBookmark(symbol);
    }
  };

  return (
    <Link to={`/crypto/${symbol?.toLowerCase()}`} className="block">
      <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-all duration-200 transform hover:-translate-y-1">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-3">
            {/*<img src={imageUrl} alt={name} className="w-10 h-10 rounded-full" />*/}
            <div>
              <h3 className="text-lg font-semibold text-white">{name}</h3>
              {/*<p className="text-gray-400 text-sm">{symbol?.toUpperCase()}</p>*/}
            </div>
          </div>
          <button
            onClick={handleBookmarkClick}
            className={`p-2 rounded-full hover:bg-gray-600 transition-colors ${
              bookmarked ? 'text-yellow-500' : 'text-gray-400'
            }`}
          >
            <Star size={20} fill={bookmarked ? 'currentColor' : 'none'} />
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Price</span>
            <span className="text-white font-semibold">
              ${price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 } ?? 0)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">24h Change</span>
            <div className={`flex items-center space-x-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span className="font-semibold">{Math.abs(change24h).toFixed(2) ?? 0}%</span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Market Cap</span>
            <span className="text-white">
              ${marketCap?.toLocaleString(undefined, { maximumFractionDigits: 0 }) ?? 0}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-sm">Volume (24h)</span>
            <span className="text-white">
              ${volume?.toLocaleString(undefined, { maximumFractionDigits: 0 }) ?? 0}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CryptoCard;