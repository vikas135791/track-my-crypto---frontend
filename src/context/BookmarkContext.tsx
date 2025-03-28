import { createContext, useContext, useState } from 'react';

interface BookmarkContextType {
  bookmarks: string[];
  addBookmark: (symbol: string) => void;
  removeBookmark: (symbol: string) => void;
  isBookmarked: (symbol: string) => boolean;
}

// Create context with a default value that matches the shape
const defaultContextValue: BookmarkContextType = {
  bookmarks: [],
  addBookmark: () => {},
  removeBookmark: () => {},
  isBookmarked: () => false
};

export const BookmarkContext = createContext<BookmarkContextType>(defaultContextValue);

export const BookmarkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  const addBookmark = (symbol: string) => {
    if (!bookmarks.includes(symbol)) {
      setBookmarks([...bookmarks, symbol]);
    }
  };

  const removeBookmark = (symbol: string) => {
    setBookmarks(bookmarks.filter(b => b !== symbol));
  };

  const isBookmarked = (symbol: string) => bookmarks.includes(symbol);

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
