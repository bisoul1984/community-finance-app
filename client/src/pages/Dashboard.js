import React, { useState } from 'react';
import CreateLoan from './CreateLoan';
import BrowseLoans from './BrowseLoans';
import LoanHistory from './LoanHistory';
import RepaymentTracker from './RepaymentTracker';
import CommunityVerification from './CommunityVerification';
import AdminPanel from './AdminPanel';
import Payments from './Payments';
import LoanCalculatorPage from './LoanCalculatorPage';
import DocumentUploadPage from './DocumentUploadPage';
import EnhancedDashboard from './EnhancedDashboard';
import NotificationPage from './NotificationPage';
import PaymentSchedulerPage from './PaymentSchedulerPage';
import UserProfilePage from './UserProfilePage';
import ReportingPage from './ReportingPage';

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
          onClick={() => setCurrentView('repayment-tracker')}
          style={{ 
            padding: '0.75rem 1.5rem', 
            backgroundColor: '#dc2626', 
            color: 'white', 
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '500'
          }}
        >
          Track Repayments
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
        <button 
          onClick={() => setCurrentView('community-verification')}
          style={{ 
            padding: '0.75rem 1.5rem', 
            backgroundColor: '#7c3aed', 
            color: 'white', 
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '500'
          }}
        >
          Community Verification
        </button>
        <button 
          onClick={() => setCurrentView('payments')}
          style={{ 
            padding: '0.75rem 1.5rem', 
            backgroundColor: '#f59e0b', 
            color: 'white', 
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '500'
          }}
        >
          Payments
        </button>
        <button 
          onClick={() => setCurrentView('loan-calculator')}
          style={{ 
            padding: '0.75rem 1.5rem', 
            backgroundColor: '#8b5cf6', 
            color: 'white', 
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '500'
          }}
        >
          Loan Calculator
        </button>
        <button 
          onClick={() => setCurrentView('document-upload')}
          style={{ 
            padding: '0.75rem 1.5rem', 
            backgroundColor: '#10b981', 
            color: 'white', 
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '500'
          }}
        >
          Document Upload
        </button>
        <button 
          onClick={() => setCurrentView('enhanced-dashboard')}
          style={{ 
            padding: '0.75rem 1.5rem', 
            backgroundColor: '#6366f1', 
            color: 'white', 
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '500'
          }}
        >
          Enhanced Dashboard
        </button>
        <button 
          onClick={() => setCurrentView('notifications')}
          style={{ 
            padding: '0.75rem 1.5rem', 
            backgroundColor: '#ec4899', 
            color: 'white', 
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '500'
          }}
        >
          Notifications
        </button>
        <button 
          onClick={() => setCurrentView('payment-scheduler')}
          style={{ 
            padding: '0.75rem 1.5rem', 
            backgroundColor: '#f97316', 
            color: 'white', 
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '500'
          }}
        >
          Payment Scheduler
        </button>
        <button 
          onClick={() => setCurrentView('user-profile')}
          style={{ 
            padding: '0.75rem 1.5rem', 
            backgroundColor: '#06b6d4', 
            color: 'white', 
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '500'
          }}
        >
          Profile Settings
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
        <button 
          onClick={() => setCurrentView('community-verification')}
          style={{ 
            padding: '0.75rem 1.5rem', 
            backgroundColor: '#7c3aed', 
            color: 'white', 
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '500'
          }}
        >
          Community Verification
        </button>
      </div>
    </div>
  );

  const renderAdminDashboard = () => (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ color: '#1e40af', marginBottom: '1rem' }}>Admin Dashboard</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#374151', marginBottom: '0.5rem' }}>System Status</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#059669' }}>Active</p>
          <p style={{ color: '#6b7280' }}>All systems operational</p>
        </div>
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#374151', marginBottom: '0.5rem' }}>Admin Access</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb' }}>Full</p>
          <p style={{ color: '#6b7280' }}>Complete system control</p>
        </div>
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#374151', marginBottom: '0.5rem' }}>Security Level</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#dc2626' }}>High</p>
          <p style={{ color: '#6b7280' }}>Enhanced protection</p>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <button 
          onClick={() => setCurrentView('admin-panel')}
          style={{ 
            padding: '0.75rem 1.5rem', 
            backgroundColor: '#dc2626', 
            color: 'white', 
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '500'
          }}
        >
          System Management
        </button>
        <button 
          onClick={() => setCurrentView('community-verification')}
          style={{ 
            padding: '0.75rem 1.5rem', 
            backgroundColor: '#7c3aed', 
            color: 'white', 
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '500'
          }}
        >
          Community Verification
        </button>
        <button 
          onClick={() => setCurrentView('reporting')}
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
          Reporting System
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
      {user.role === 'admin' ? renderAdminDashboard() : 
       user.role === 'borrower' ? renderBorrowerDashboard() : renderLenderDashboard()}
    </div>
  );

  const renderCurrentView = () => {
    switch (currentView) {
      case 'admin-panel':
        return (
          <div>
            <nav style={{ backgroundColor: '#2563eb', padding: '1rem', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
                System Management
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
            <AdminPanel user={user} />
          </div>
        );
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
      case 'repayment-tracker':
        return (
          <div>
            <nav style={{ backgroundColor: '#2563eb', padding: '1rem', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
                Repayment Tracker
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
            <RepaymentTracker user={user} />
          </div>
        );
      case 'community-verification':
        return (
          <div>
            <nav style={{ backgroundColor: '#2563eb', padding: '1rem', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
                Community Verification
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
            <CommunityVerification user={user} />
          </div>
        );
      case 'payments':
        return (
          <div>
            <nav style={{ backgroundColor: '#2563eb', padding: '1rem', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
                Payments
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
            <Payments user={user} />
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
      case 'loan-calculator':
        return (
          <div>
            <nav style={{ backgroundColor: '#2563eb', padding: '1rem', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
                Loan Calculator
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
            <LoanCalculatorPage />
          </div>
        );
      case 'document-upload':
        return (
          <div>
            <nav style={{ backgroundColor: '#2563eb', padding: '1rem', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
                Document Upload
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
            <DocumentUploadPage user={user} />
          </div>
        );
      case 'enhanced-dashboard':
        return (
          <div>
            <nav style={{ backgroundColor: '#2563eb', padding: '1rem', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
                Enhanced Dashboard
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
            <EnhancedDashboard user={user} />
          </div>
        );
      case 'notifications':
        return (
          <div>
            <nav style={{ backgroundColor: '#2563eb', padding: '1rem', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
                Notifications
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
            <NotificationPage user={user} />
          </div>
        );
      case 'payment-scheduler':
        return (
          <div>
            <nav style={{ backgroundColor: '#2563eb', padding: '1rem', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
                Payment Scheduler
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
            <PaymentSchedulerPage user={user} />
          </div>
        );
      case 'user-profile':
        return (
          <div>
            <nav style={{ backgroundColor: '#2563eb', padding: '1rem', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
                Profile Settings
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
            <UserProfilePage user={user} />
          </div>
        );
      case 'reporting':
        return (
          <div>
            <nav style={{ backgroundColor: '#2563eb', padding: '1rem', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
                Reporting System
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
            <ReportingPage />
          </div>
        );
      default:
        return renderMainDashboard();
    }
  };

  return renderCurrentView();
};

export default Dashboard; 