import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true); // Show loading before API call

    const endpoint = isLogin ? '/login' : '/signup';
    const payload = isLogin ? { email, password } : { name, email, password };

    try {
      const response = await axios.post(`${apiUrl}${endpoint}`, payload);

      if (isLogin) {
        // Store user data in localStorage on successful login
        localStorage.setItem('user', JSON.stringify(response.data.user));
        window.location.href = '/'; // Redirect to home page after login
      } else {
        // Show success message (optional) and switch to login mode after signup
        setIsLogin(true);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false); // Reset loading state after API call
    }
  };


  return (
      <div className="min-h-screen bg-black text-white pt-20">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-gray-900 rounded-lg p-8">
            <div className="flex justify-center space-x-4 mb-8">
              <button
                  className={`px-4 py-2 rounded ${isLogin ? 'bg-yellow-500 text-black' : 'bg-gray-800 text-yellow-500'}`}
                  onClick={() => setIsLogin(true)}
              >
                Login
              </button>
              <button
                  className={`px-4 py-2 rounded ${!isLogin ? 'bg-yellow-500 text-black' : 'bg-gray-800 text-yellow-500'}`}
                  onClick={() => setIsLogin(false)}
              >
                Sign Up
              </button>
            </div>

            <h1 className="text-2xl font-bold mb-6 text-center">{isLogin ? 'Welcome Back' : 'Create Account'}</h1>

            {error && (
                <div className="bg-red-500/10 border border-red-500 text-red-500 rounded px-4 py-2 mb-4">
                  {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                {!isLogin && (
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">
                        Name
                      </label>
                      <input
                          type="text"
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-700 focus:border-yellow-500 focus:outline-none"
                          required={!isLogin} // Required only for signup
                      />
                    </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">
                    Email
                  </label>
                  <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-700 focus:border-yellow-500 focus:outline-none"
                      required
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1">
                    Password
                  </label>
                  <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-700 focus:border-yellow-500 focus:outline-none"
                      required
                  />
                </div>
                <button
                    type="submit"
                    className="w-full py-2 px-4 bg-yellow-500 text-black rounded hover:bg-yellow-400 transition-colors flex justify-center"
                    disabled={loading}
                >
                  {loading ? (
                      <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span>
                  ) : (
                      isLogin ? 'Login' : 'Sign Up'
                  )}
                </button>
              </div>
            </form>

            <p className="mt-4 text-center text-sm text-gray-400">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button onClick={() => setIsLogin(!isLogin)} className="text-yellow-500 hover:text-yellow-400">
                {isLogin ? 'Sign up here' : 'Login here'}
              </button>
            </p>
          </div>
        </div>
      </div>
  );
};

export default Login;
