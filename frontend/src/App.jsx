import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Header from './components/Header';
import HomePage from './pages/HomePage';
import ScanPage from './pages/ScanPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';

// A component to protect routes that require authentication
const ProtectedRoute = ({ children, token }) => {
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('currentUser');
    if (storedToken && storedUser) {
      setAuthToken(storedToken);
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLoginSuccess = (token, user) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('currentUser', JSON.stringify(user));
    setAuthToken(token);
    setCurrentUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    setAuthToken(null);
    setCurrentUser(null);
  };

  return (
    <BrowserRouter>
      {/* --- THE FIX: Made the root container a flex column --- */}
      <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-indigo-500/30 flex flex-col">
        {authToken && <Header currentUser={currentUser} onLogout={handleLogout} />}
        
        {/* --- THE FIX: This container now properly grows and centers content --- */}
        <main className="container mx-auto flex flex-grow flex-col items-center justify-center px-4 py-8">
          <Routes>
            <Route path="/login" element={
                !authToken ? <LoginPage onLoginSuccess={handleLoginSuccess} /> : <Navigate to="/" replace />
            } />

            {/* Protected Routes */}
            <Route path="/" element={
              <ProtectedRoute token={authToken}><HomePage /></ProtectedRoute>
            } />
            <Route path="/scan" element={
              <ProtectedRoute token={authToken}><ScanPage /></ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute token={authToken}><DashboardPage /></ProtectedRoute>
            } />
            
            {/* Fallback route */}
            <Route path="*" element={<Navigate to={authToken ? "/" : "/login"} replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
