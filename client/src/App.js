import React, { useState } from 'react';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('home');
  };

  const renderPage = () => {
    if (user) {
      return <Dashboard user={user} onLogout={handleLogout} />;
    }

    switch (currentPage) {
      case 'signup':
        return <Signup />;
      case 'login':
        return <Login onLogin={handleLogin} />;
      default:
        return (
          <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#f8fafc', minHeight: 'calc(100vh - 80px)' }}>
            <h1 style={{ color: '#1e40af', fontSize: '2.5rem', marginBottom: '1rem' }}>Welcome to Microloan</h1>
            <p style={{ fontSize: '1.25rem', color: '#374151', marginBottom: '2rem' }}>
              Community-based microloans for individuals in low-income areas
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <button 
                onClick={() => setCurrentPage('signup')}
                style={{ 
                  padding: '0.75rem 1.5rem', 
                  backgroundColor: '#2563eb', 
                  color: 'white', 
                  border: 'none',
                  borderRadius: '0.375rem',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Get Started
              </button>
              <button 
                onClick={() => setCurrentPage('login')}
                style={{ 
                  padding: '0.75rem 1.5rem', 
                  backgroundColor: '#059669', 
                  color: 'white', 
                  border: 'none',
                  borderRadius: '0.375rem',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Sign In
              </button>
            </div>
          </div>
        );
    }
  };

  if (user) {
    return <Dashboard user={user} onLogout={handleLogout} />;
  }

  return (
    <div>
      <nav style={{ backgroundColor: '#2563eb', padding: '1rem', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div 
          style={{ fontWeight: 'bold', fontSize: '1.25rem', cursor: 'pointer' }}
          onClick={() => setCurrentPage('home')}
        >
          Microloan App
        </div>
        <div>
          <button 
            onClick={() => setCurrentPage('signup')}
            style={{ marginRight: '1rem', color: 'white', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Sign Up
          </button>
          <button 
            onClick={() => setCurrentPage('login')}
            style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Log In
          </button>
        </div>
      </nav>
      {renderPage()}
    </div>
  );
}

export default App;
