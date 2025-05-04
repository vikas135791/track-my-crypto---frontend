import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const apiUrl = import.meta.env.VITE_API_URL;

const UserPanel = () => {
  const [user, setUser] = useState<any>(null);
  const [cryptoData, setCryptoData] = useState<any[]>([]);
  const [bookmarks, setBookmarks] = useState<any[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/home`);
        const formattedData = response.data.data.map((item: any) => ({
          id: item.id,
          name: item.attributes.name,
          symbol: item.id.split('_')[1].toUpperCase(),
          price: parseFloat(item.attributes.base_token_price_usd),
          change24h: parseFloat(item.attributes.price_change_percentage.h24),
          marketCap: parseFloat(item.attributes.market_cap_usd),
          imageUrl: `https://cryptologos.cc/logos/${item.id.split('_')[1]}.png`,
        }));
        setCryptoData(formattedData);
        localStorage.setItem('cryptoData', JSON.stringify(formattedData));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (user) {
      const fetchBookmarks = async () => {
        try {
          const response = await axios.get(`${apiUrl}/bookmarks/${user.email}`);
          setBookmarks(response.data?.bookmarks?.map((e: any) => e.id) || []);
        } catch (error) {
          console.error('Error fetching bookmarks:', error);
        }
      };
      fetchBookmarks();
    }
  }, [user]);

  const toggleBookmark = async (cryptoId: string) => {
    if (!user) return;
    try {
      const isBookmarked = bookmarks.includes(cryptoId);
      if (isBookmarked) {
        await axios.delete(`${apiUrl}/bookmark`, { data: { email: user.email, cryptoId } });
        setBookmarks((prev) => prev.filter((id) => id !== cryptoId));
      } else {
        await axios.post(`${apiUrl}/bookmark`, { email: user.email, cryptoId });
        setBookmarks((prev) => [...prev, cryptoId]);
      }
    } catch (error) {
      console.error('Error updating bookmark:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p>Please log in to view your panel.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto py-12">
        <h1 className="text-3xl font-bold mb-4">Welcome, {user.name}</h1>
        <p className="text-gray-400 mb-8">Your personal crypto dashboard</p>

        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Your Bookmarked Cryptocurrencies</h2>
          {bookmarks.length === 0 ? (
            <p className="text-gray-400">You haven't bookmarked any cryptocurrencies yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookmarks.map((cryptoId: any) => {
                const crypto: any = cryptoData.find((c: any) => c.id === cryptoId);
                if (!crypto) return null;
                return (
                  <div key={crypto.id} className="bg-gray-800 rounded-lg p-5 flex flex-col justify-between shadow-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div>
                          <h3 className="font-semibold text-lg">{crypto.name}</h3>
                        </div>
                      </div>
                      <button onClick={() => toggleBookmark(crypto.id)} className="text-red-500 hover:text-red-400 text-sm">
                        Remove
                      </button>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-lg font-bold">${crypto.price.toLocaleString()}</p>
                        <p className={`text-sm ${crypto.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {crypto.change24h >= 0 ? '+' : ''}{crypto.change24h}%
                        </p>
                      </div>
                      {/*<Link to={`/crypto/${crypto.symbol.toLowerCase()}`} className="px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 transition-all text-sm">*/}
                      {/*  View Details*/}
                      {/*</Link>*/}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserPanel;