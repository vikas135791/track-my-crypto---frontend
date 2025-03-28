import React, { useState } from 'react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'login' | 'signup';
  onSwitchType: (type: 'login' | 'signup') => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, type, onSwitchType }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-8 rounded-lg w-full max-w-md">
        <div className="flex justify-between mb-6">
          <button 
            className={`text-lg ${type === 'login' ? 'text-yellow-500 border-b-2 border-yellow-500' : 'text-gray-400'}`}
            onClick={() => onSwitchType('login')}
          >
            LOGIN
          </button>
          <button 
            className={`text-lg ${type === 'signup' ? 'text-yellow-500 border-b-2 border-yellow-500' : 'text-gray-400'}`}
            onClick={() => onSwitchType('signup')}
          >
            SIGN UP
          </button>
        </div>

        <form className="space-y-4">
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700 focus:border-yellow-500 focus:outline-none"
          />
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded bg-gray-800 text-white border border-gray-700 focus:border-yellow-500 focus:outline-none"
          />
          <button 
            type="submit"
            className="w-full bg-yellow-500 text-black py-3 rounded font-semibold hover:bg-yellow-600 transition-colors"
          >
            {type === 'login' ? 'LOGIN' : 'SIGN UP'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-400">OR</p>
          <button className="mt-4 w-full bg-white text-black py-3 rounded font-semibold flex items-center justify-center space-x-2">
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
            <span>Sign in with Google</span>
          </button>
        </div>

        <button 
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default AuthModal;