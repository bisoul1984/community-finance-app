import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import { logout } from './api/auth';

// Wrapper component to use useNavigate hook
function AppContent() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleSignup = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    logout(); // Clear token from localStorage
    setUser(null);
    // Redirect to home page after logout using window.location for immediate redirect
    window.location.href = '/';
  };

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login onLogin={handleLogin} />} />
      <Route path="/signup" element={<Signup onSignup={handleSignup} />} />
      <Route 
        path="/dashboard" 
        element={user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/" />} 
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
