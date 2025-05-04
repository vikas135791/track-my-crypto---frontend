import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface CryptoBookmark {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume: number;
  imageUrl: string;
}

interface BookmarkContextType {
  bookmarks: CryptoBookmark[];
  addBookmark: (crypto: CryptoBookmark) => void;
  removeBookmark: (symbol: string) => void;
  isBookmarked: (symbol: string) => boolean;
}

const defaultContextValue: BookmarkContextType = {
  bookmarks: [],
  addBookmark: () => {},
  removeBookmark: () => {},
  isBookmarked: () => false,
};

export const BookmarkContext = createContext<BookmarkContextType>(defaultContextValue);

export const BookmarkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookmarks, setBookmarks] = useState<CryptoBookmark[]>([]);

  const user = localStorage.getItem("user");
  const userEmail = user ? JSON.parse(user).email : null;
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!userEmail) return;
    const fetchBookmarks = async () => {
      try {
        const res = await axios.get(`${apiUrl}/bookmarks/${userEmail}`);
        setBookmarks(res.data?.bookmarks || []);
      } catch (err) {
        console.error("Failed to fetch bookmarks:", err);
      }
    };
    fetchBookmarks();
  }, [userEmail]);

  const addBookmark = async (crypto: CryptoBookmark) => {
    if (!userEmail) return;
    try {
      await axios.post(`${apiUrl}/bookmark`, { email: userEmail, crypto });
      setBookmarks((prev) => [...prev, crypto]);
    } catch (err) {
      console.error("Error adding bookmark:", err);
    }
  };

  const removeBookmark = async (symbol: string) => {
    if (!userEmail) return;
    try {
      const target = bookmarks.find((b) => b.symbol.toLowerCase() === symbol.toLowerCase());
      if (!target) return;

      await axios.delete(`${apiUrl}/bookmark`, {
        data: { email: userEmail, cryptoId: target.id },
      });

      setBookmarks((prev) => prev.filter((b) => b.symbol.toLowerCase() !== symbol.toLowerCase()));
    } catch (err) {
      console.error("Error removing bookmark:", err);
    }
  };

  const isBookmarked = (symbol: string) =>
    bookmarks.some((b) => b.symbol.toLowerCase() === symbol.toLowerCase());

  return (
    <BookmarkContext.Provider value={{ bookmarks, addBookmark, removeBookmark, isBookmarked }}>
      {children}
    </BookmarkContext.Provider>
  );
};

export const useBookmarks = () => {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error('useBookmarks must be used within a BookmarkProvider');
  }
  return context;
};
