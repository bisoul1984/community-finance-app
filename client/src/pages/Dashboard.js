import React, { useState } from 'react';
import CreateLoan from './CreateLoan';
import BrowseLoans from './BrowseLoans';
import LoanHistory from './LoanHistory';

const Dashboard = ({ user, onLogout }) => {
  const [currentView, setCurrentView] = useState('main');

  const renderBorrowerDashboard = () => (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ color: '#1e40af', marginBottom: '1rem' }}>Borrower Dashboard</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#374151', marginBottom: '0.5rem' }}>Active Loans</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#059669' }}>0</p>
          <p style={{ color: '#6b7280' }}>No active loans</p>
        </div>
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#374151', marginBottom: '0.5rem' }}>Total Borrowed</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#dc2626' }}>$0</p>
          <p style={{ color: '#6b7280' }}>Lifetime total</p>
        </div>
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#374151', marginBottom: '0.5rem' }}>Reputation Score</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb' }}>{user.reputation || 0}</p>
          <p style={{ color: '#6b7280' }}>Community trust</p>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <button 
          onClick={() => setCurrentView('create-loan')}
          style={{ 
            padding: '0.75rem 1.5rem', 
            backgroundColor: '#2563eb', 
            color: 'white', 
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '500'
          }}
        >
          Request New Loan
        </button>
        <button 
          onClick={() => setCurrentView('loan-history')}
          style={{ 
            padding: '0.75rem 1.5rem', 
            backgroundColor: '#059669', 
            color: 'white', 
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '500'
          }}
        >
          View Loan History
        </button>
      </div>
    </div>
  );

  const renderLenderDashboard = () => (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ color: '#1e40af', marginBottom: '1rem' }}>Lender Dashboard</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#374151', marginBottom: '0.5rem' }}>Active Investments</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#059669' }}>0</p>
          <p style={{ color: '#6b7280' }}>Loans funded</p>
        </div>
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#374151', marginBottom: '0.5rem' }}>Total Invested</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#dc2626' }}>$0</p>
          <p style={{ color: '#6b7280' }}>Lifetime total</p>
        </div>
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#374151', marginBottom: '0.5rem' }}>Returns Earned</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb' }}>$0</p>
          <p style={{ color: '#6b7280' }}>Total returns</p>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <button 
          onClick={() => setCurrentView('browse-loans')}
          style={{ 
            padding: '0.75rem 1.5rem', 
            backgroundColor: '#2563eb', 
            color: 'white', 
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '500'
          }}
        >
          Browse Loan Requests
        </button>
        <button 
          onClick={() => setCurrentView('investment-history')}
          style={{ 
            padding: '0.75rem 1.5rem', 
            backgroundColor: '#059669', 
            color: 'white', 
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '500'
          }}
        >
          View Investment History
        </button>
      </div>
    </div>
  );

  const renderMainDashboard = () => (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <nav style={{ backgroundColor: '#2563eb', padding: '1rem', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
          Welcome, {user.name}!
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span>Role: {user.role}</span>
          <button 
            onClick={onLogout}
            style={{ 
              padding: '0.5rem 1rem', 
              backgroundColor: '#dc2626', 
              color: 'white', 
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </nav>
      {user.role === 'borrower' ? renderBorrowerDashboard() : renderLenderDashboard()}
    </div>
  );

  const renderCurrentView = () => {
    switch (currentView) {
      case 'create-loan':
        return (
          <div>
            <nav style={{ backgroundColor: '#2563eb', padding: '1rem', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
                Request New Loan
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button 
                  onClick={() => setCurrentView('main')}
                  style={{ 
                    padding: '0.5rem 1rem', 
                    backgroundColor: '#374151', 
                    color: 'white', 
                    border: 'none',
                    borderRadius: '0.375rem',
                    cursor: 'pointer'
                  }}
                >
                  Back to Dashboard
                </button>
                <button 
                  onClick={onLogout}
                  style={{ 
                    padding: '0.5rem 1rem', 
                    backgroundColor: '#dc2626', 
                    color: 'white', 
                    border: 'none',
                    borderRadius: '0.375rem',
                    cursor: 'pointer'
                  }}
                >
                  Logout
                </button>
              </div>
            </nav>
            <CreateLoan user={user} onLoanCreated={() => setCurrentView('main')} />
          </div>
        );
      case 'browse-loans':
        return (
          <div>
            <nav style={{ backgroundColor: '#2563eb', padding: '1rem', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
                Browse Loan Requests
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button 
                  onClick={() => setCurrentView('main')}
                  style={{ 
                    padding: '0.5rem 1rem', 
                    backgroundColor: '#374151', 
                    color: 'white', 
                    border: 'none',
                    borderRadius: '0.375rem',
                    cursor: 'pointer'
                  }}
                >
                  Back to Dashboard
                </button>
                <button 
                  onClick={onLogout}
                  style={{ 
                    padding: '0.5rem 1rem', 
                    backgroundColor: '#dc2626', 
                    color: 'white', 
                    border: 'none',
                    borderRadius: '0.375rem',
                    cursor: 'pointer'
                  }}
                >
                  Logout
                </button>
              </div>
            </nav>
            <BrowseLoans user={user} />
          </div>
        );
      case 'loan-history':
      case 'investment-history':
        return (
          <div>
            <nav style={{ backgroundColor: '#2563eb', padding: '1rem', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
                {currentView === 'loan-history' ? 'Loan History' : 'Investment History'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button 
                  onClick={() => setCurrentView('main')}
                  style={{ 
                    padding: '0.5rem 1rem', 
                    backgroundColor: '#374151', 
                    color: 'white', 
                    border: 'none',
                    borderRadius: '0.375rem',
                    cursor: 'pointer'
                  }}
                >
                  Back to Dashboard
                </button>
                <button 
                  onClick={onLogout}
                  style={{ 
                    padding: '0.5rem 1rem', 
                    backgroundColor: '#dc2626', 
                    color: 'white', 
                    border: 'none',
                    borderRadius: '0.375rem',
                    cursor: 'pointer'
                  }}
                >
                  Logout
                </button>
              </div>
            </nav>
            <LoanHistory user={user} />
          </div>
        );
      default:
        return renderMainDashboard();
    }
  };

  return renderCurrentView();
};

export default Dashboard; 