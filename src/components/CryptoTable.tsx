import React from "react";
import { TrendingUp, TrendingDown, Bookmark, BookmarkCheck } from "lucide-react";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  marketCap: number;
  imageUrl: string;
}

interface CryptoTableProps {
  data: CryptoData[];
  userEmail: string;
  bookmarks: string[]; // Ensure it's always an array
  setBookmarks: (bookmarks: string[]) => void;
}

const CryptoTable: React.FC<CryptoTableProps> = ({ data, userEmail, bookmarks = [], setBookmarks }) => {
  const toggleBookmark = async (crypto: CryptoData) => {
    try {
      const isBookmarked = bookmarks.includes(crypto.id);
      if (isBookmarked) {
        await axios.delete(`${apiUrl}/bookmark`, { data: { email: userEmail, cryptoId: crypto.id } });
        setBookmarks(bookmarks.filter((id) => id !== crypto.id));
      } else {
        await axios.post(`${apiUrl}/bookmark`, { email: userEmail, crypto });
        setBookmarks([...bookmarks, crypto.id]);
      }
    } catch (error) {
      console.error("Error updating bookmark:", error);
    }
  };

  return (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-900 rounded-lg overflow-hidden">
          <thead>
          <tr className="bg-gray-800">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
              Coin
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
              Price
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
              24h Change
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
              Market Cap
            </th>
          </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
          {data.map((crypto) => (
              <tr key={crypto.id} className="hover:bg-gray-800 transition-colors cursor-pointer">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="ml-4">
                      <div className="text-sm font-medium text-white flex items-center gap-2">
                        {crypto?.name}
                        {
                          userEmail ?
                            <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleBookmark(crypto);
                            }}>
                              {bookmarks.includes(crypto.id) ? (
                                  <BookmarkCheck size={16} className="text-yellow-400" />
                              ) : (
                                  <Bookmark size={16} className="text-gray-400" />
                              )}
                            </button> :
                            ''
                        }
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-white">${crypto?.price}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <div
                      className={`flex items-center justify-end ${
                          crypto?.change24h >= 0 ? "text-green-500" : "text-red-500"
                      }`}
                  >
                    {crypto?.change24h >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    <span className="ml-1">{Math.abs(crypto?.change24h)}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-white">
                  ${crypto?.marketCap?.toLocaleString() ?? 0}
                </td>
              </tr>
          ))}
          </tbody>
        </table>
      </div>
  );
};

export default CryptoTable;
