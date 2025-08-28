import React from 'react';
import { LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import summitLogo from '../assets/summit.svg'; // <-- Import the logo

const NavButton = ({ children, to }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link 
      to={to} 
      className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
        isActive ? 'text-white' : 'text-slate-300 hover:text-white'
      }`}
    >
      {children}
      {isActive && (
        <motion.div
          className="absolute inset-0 z-[-1] rounded-full bg-indigo-600"
          layoutId="active-pill"
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      )}
    </Link>
  );
};

const Header = ({ currentUser, onLogout }) => {
  return (
    <motion.header 
      className="sticky top-4 z-50"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="container mx-auto flex items-center justify-between p-2 rounded-full bg-slate-800/50 backdrop-blur-sm ring-1 ring-slate-700">
        <Link 
          to="/"
          className="flex cursor-pointer items-center gap-3 pl-4"
        >
          {/* --- THE CHANGE: Use the imported logo variable --- */}
          <img src={summitLogo} alt="E-Summit Logo" className="h-8 w-8" />
          <span className="text-xl font-bold text-slate-200">E-Summit Controls</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <nav className="flex items-center gap-2 rounded-full bg-slate-800/70 p-1 ring-1 ring-slate-700">
            <NavButton to="/">Home</NavButton>
            <NavButton to="/scan">Scan</NavButton>
            <NavButton to="/dashboard">Dashboard</NavButton>
          </nav>

          <div className="flex items-center gap-3 pr-2">
            <span className="text-sm text-slate-400">
              Welcome, <span className="font-bold text-slate-200">{currentUser?.name}</span>
            </span>
            <button 
              onClick={onLogout} 
              title="Logout"
              className="rounded-full p-2 text-slate-400 transition-colors hover:bg-red-500/20 hover:text-red-400"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
