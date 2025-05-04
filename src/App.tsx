import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BookmarkProvider } from './context/BookmarkContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import UserPanel from './pages/UserPanel';
import AdminPanel from './pages/AdminPanel';
import Compare from './pages/Compare';
import CryptoDetail from './pages/CryptoDetail';
import Bookmarks from './pages/Bookmarks';

const App = () => {
  return (
    <AuthProvider>
      <BookmarkProvider>
        <Router>
          <div className="min-h-screen bg-black">
            <Navbar />
            <div className="container mx-auto px-4">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/user" element={<UserPanel />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/compare" element={<Compare />} />
                <Route path="/bookmarks" element={<Bookmarks />} />
                <Route path="/crypto/:symbol" element={<CryptoDetail />} />
              </Routes>
            </div>
          </div>
        </Router>
      </BookmarkProvider>
    </AuthProvider>
  );
};

export default App;