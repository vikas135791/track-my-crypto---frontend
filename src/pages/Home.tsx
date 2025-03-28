import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { TrendingUp, TrendingDown, Bookmark, BookmarkCheck } from "lucide-react";

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

const Home = () => {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingBookmarks, setLoadingBookmarks] = useState(false);
  const isFetching = useRef(false);
  const previousDataRef = useRef<CryptoData[]>([]);
  const users = localStorage.getItem("user");
  const userEmail = users ? JSON.parse(users).email : null;

  const fetchData = async () => {
    if (isFetching.current) return;
    isFetching.current = true;
    setLoading(true);

    try {
      const response = await axios.get(`${apiUrl}/home`);
      const formattedData = response.data.data.map((item: any) => ({
        id: item.id,
        name: item.attributes.name,
        symbol: item.id.split("_")[1],
        price: parseFloat(item.attributes.base_token_price_usd),
        change24h: parseFloat(item.attributes.price_change_percentage.h24),
        volume: parseFloat(item.attributes.volume_usd.h24),
        marketCap: parseFloat(item.attributes.market_cap_usd),
        imageUrl: `https://cryptologos.cc/logos/${item.id.split("_")[1]}.png`,
      }));

      if (JSON.stringify(previousDataRef.current) !== JSON.stringify(formattedData)) {
        setCryptoData(formattedData);
        previousDataRef.current = formattedData;
        localStorage.setItem("cryptoData", JSON.stringify(formattedData));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  };

  const fetchBookmarks = async () => {
    if (!userEmail) return;
    setLoadingBookmarks(true);

    try {
      const response = await axios.get(`${apiUrl}/bookmarks/${userEmail}`);
      setBookmarks(response.data?.bookmarks?.map(e => e.id) || []);
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
    } finally {
      setLoadingBookmarks(false);
    }
  };

  const toggleBookmark = async (crypto: CryptoData) => {
    try {
      const isBookmarked = bookmarks.includes(crypto.id);
      if (isBookmarked) {
        await axios.delete(`${apiUrl}/bookmark`, { data: { email: userEmail, cryptoId: crypto.id } });
        setBookmarks((prev) => prev.filter((id) => id !== crypto.id));
      } else {
        await axios.post(`${apiUrl}/bookmark`, { email: userEmail, crypto });
        setBookmarks((prev) => [...prev, crypto.id]);
      }
    } catch (error) {
      console.error("Error updating bookmark:", error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchBookmarks();
    const intervalId = setInterval(fetchData, 10000);
    return () => clearInterval(intervalId);
  }, []);

  return (
      <div className="min-h-screen bg-black text-white pt-20">
        <div className="relative bg-[url('https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80')] bg-cover bg-center py-20">
          <div className="absolute inset-0 bg-black/60"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Track My Crypto</h1>
            <p className="text-xl text-gray-300 mb-8">Get All The Info Regarding Your Favorite Crypto Currency</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-bold mb-6">Cryptocurrency Prices by Market Cap</h2>

          {loading ? (
              <div className="text-center text-gray-300 text-lg">Loading market data...</div>
          ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-900 rounded-lg overflow-hidden">
                  <thead>
                  <tr className="bg-gray-800">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Coin</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">24h Change</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Market Cap</th>
                  </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                  {cryptoData.map((crypto) => (
                      <tr key={crypto.id} className="hover:bg-gray-800 transition-colors cursor-pointer">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="ml-4">
                              <div className="text-sm font-medium text-white flex items-center gap-2">
                                {crypto?.name}
                                {userEmail && (
                                    <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toggleBookmark(crypto);
                                        }}
                                    >
                                      {bookmarks.includes(crypto.id) ? (
                                          <BookmarkCheck size={16} className="text-yellow-400" />
                                      ) : (
                                          <Bookmark size={16} className="text-gray-400" />
                                      )}
                                    </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-white">${crypto?.price}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <div className={`flex items-center justify-end ${crypto?.change24h >= 0 ? "text-green-500" : "text-red-500"}`}>
                            {crypto?.change24h >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                            <span className="ml-1">{Math.abs(crypto?.change24h)}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-white">${crypto?.marketCap?.toLocaleString() ?? 0}</td>
                      </tr>
                  ))}
                  </tbody>
                </table>
              </div>
          )}

          {loadingBookmarks && userEmail && <div className="text-center text-gray-300 mt-4">Loading bookmarks...</div>}
        </div>
      </div>
  );
};

export default Home;
