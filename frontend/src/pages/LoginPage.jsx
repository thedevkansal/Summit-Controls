import React, { useState } from 'react';
import { LogIn, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import summitLogo from '../assets/summit.svg'; // <-- Import the logo

const LoginPage = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid username or password');
      }

      const data = await response.json();
      onLoginSuccess(data.accessToken, data.user);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <motion.div
        className="w-full max-w-md p-8 space-y-6 rounded-2xl bg-slate-800/50 ring-1 ring-slate-700 shadow-2xl"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="text-center">
          <div className="inline-flex items-center justify-center">
            {/* --- THE CHANGE: Replaced the icon with your logo --- */}
            <img src={summitLogo} alt="E-Summit Logo" className="h-12 w-12" />
          </div>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-white">
            Controls Portal Login
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Please sign in to continue.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-slate-300"
            >
              Username
            </label>
            <div className="mt-1">
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-lg border-2 border-slate-700 bg-slate-800 px-3 py-2 text-white shadow-sm transition-colors focus:border-indigo-500 focus:outline-none focus:ring-0"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-300"
            >
              Password
            </label>
            <div className="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border-2 border-slate-700 bg-slate-800 px-3 py-2 text-white shadow-sm transition-colors focus:border-indigo-500 focus:outline-none focus:ring-0"
              />
            </div>
          </div>
          
          {error && (
            <p className="text-sm text-red-400 text-center">{error}</p>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-4 py-3 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <LogIn className="h-6 w-6" />
              )}
              <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginPage;
