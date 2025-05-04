import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { TrendingUp, TrendingDown, Bookmark, BookmarkCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
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
        marketCap: item.attributes.market_cap_usd ? parseFloat(item.attributes.market_cap_usd) || 0 : 0,
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
      setBookmarks(response.data?.bookmarks?.map((e: any) => e.id) || []);
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

  const handleRowClick = (crypto: CryptoData) => {
    navigate(`/crypto/${crypto.symbol}`);
  };

  const formatPrice = (price: number) => {
    if (!price || isNaN(price)) return '0.00000';
    return price.toFixed(5);
  };

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`;
    if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`;
    if (marketCap >= 1e3) return `$${(marketCap / 1e3).toFixed(2)}K`;
    return `$${marketCap.toFixed(2)}`;
  };

  useEffect(() => {
    fetchData();
    fetchBookmarks();
    const intervalId = setInterval(fetchData, 10000);
    return () => clearInterval(intervalId);
  }, []);

  const filteredCrypto = cryptoData.filter((crypto) =>
    crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Cryptocurrency Prices by Market Cap</h2>
          <input
            type="text"
            placeholder="Search currency..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 rounded bg-gray-800 text-white border border-gray-700 w-72"
          />
        </div>

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
                {filteredCrypto.map((crypto) => (
                  <tr
                    key={crypto.id}
                    className="hover:bg-gray-800 transition-colors cursor-pointer"
                    onClick={() => handleRowClick(crypto)}
                  >
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
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-white">
                      ${formatPrice(crypto?.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <div className={`flex items-center justify-end ${crypto?.change24h >= 0 ? "text-green-500" : "text-red-500"}`}>
                        {crypto?.change24h >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                        <span className="ml-1">{Math.abs(crypto?.change24h)}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-white">
                      {formatMarketCap(crypto?.marketCap ?? 0)}
                    </td>
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
