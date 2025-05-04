import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, UserCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { user, logout }: any = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (user?.email) {
      try {
        await axios.post(`${apiUrl}/logout`, { email: user.email });
      } catch (error) {
        console.error('Logout API error:', error);
      }
    }
    logout();
    navigate('/login');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-gray-900 shadow-lg z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and main navigation */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold text-yellow-500">
              Track My Crypto
            </Link>
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/compare" className="text-gray-300 hover:text-yellow-500 transition-colors">
                Compare
              </Link>
              {user && (
                <Link to="/user" className="text-gray-300 hover:text-yellow-500 transition-colors">
                  My Dashboard
                </Link>
              )}
              {user?.email === 'admin@gmail.com' && (
                <Link to="/admin" className="text-gray-300 hover:text-yellow-500 transition-colors">
                  Admin Panel
                </Link>
              )}
            </div>
          </div>

          {/* User section */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 text-gray-300 hover:text-white"
                >
                  <UserCircle size={28} />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50">
                    <div className="px-4 py-2 text-gray-800 text-sm border-b">{user.name}</div>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600 transition-colors"
              >
                Login / Sign Up
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-300 hover:text-white">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-700">
            <div className="flex flex-col space-y-4">
              <Link
                to="/compare"
                className="text-gray-300 hover:text-yellow-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Compare
              </Link>
              {user && (
                <Link
                  to="/user"
                  className="text-gray-300 hover:text-yellow-500 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Dashboard
                </Link>
              )}
              {user?.email === 'admin@gmail.com' && (
                <Link
                  to="/admin"
                  className="text-gray-300 hover:text-yellow-500 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin Panel
                </Link>
              )}
              {user ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login / Sign Up
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
