import React, { useState, useEffect } from 'react';
import { getAllUsers, getAllLoans, updateUserStatus, updateLoanStatus } from '../api/admin';

const AdminPanel = ({ user }) => {
  const [users, setUsers] = useState([]);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersData, loansData] = await Promise.all([
        getAllUsers(),
        getAllLoans()
      ]);
      setUsers(usersData);
      setLoans(loansData);
    } catch (err) {
      setError('Failed to load admin data.');
    } finally {
      setLoading(false);
    }
  };

  const handleUserStatusUpdate = async (userId, newStatus) => {
    try {
      await updateUserStatus(userId, { status: newStatus });
      setError('');
      fetchData(); // Refresh data
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user status.');
    }
  };

  const handleLoanStatusUpdate = async (loanId, newStatus) => {
    try {
      await updateLoanStatus(loanId, { status: newStatus });
      setError('');
      fetchData(); // Refresh data
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update loan status.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#059669';
      case 'suspended': return '#dc2626';
      case 'pending': return '#f59e0b';
      case 'completed': return '#2563eb';
      case 'overdue': return '#dc2626';
      case 'funded': return '#059669';
      default: return '#6b7280';
    }
  };

  const getSystemStats = () => {
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.status === 'active').length;
    const totalLoans = loans.length;
    const activeLoans = loans.filter(l => l.status === 'active' || l.status === 'funded').length;
    const totalAmount = loans.reduce((sum, loan) => sum + loan.amount, 0);
    const completedLoans = loans.filter(l => l.status === 'completed').length;

    return {
      totalUsers,
      activeUsers,
      totalLoans,
      activeLoans,
      totalAmount,
      completedLoans
    };
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Loading admin panel...</p>
      </div>
    );
  }

  const stats = getSystemStats();

  return (
    <div style={{ padding: '2rem', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <h2 style={{ color: '#1e40af', marginBottom: '1.5rem' }}>Admin Panel</h2>
      
      {error && (
        <div style={{ 
          backgroundColor: '#fee2e2', 
          color: '#dc2626', 
          padding: '1rem', 
          borderRadius: '0.375rem', 
          marginBottom: '1rem',
          border: '1px solid #fecaca'
        }}>
          {error}
        </div>
      )}

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', borderBottom: '1px solid #e5e7eb' }}>
        <button 
          onClick={() => setActiveTab('overview')}
          style={{ 
            padding: '0.75rem 1.5rem', 
            backgroundColor: activeTab === 'overview' ? '#2563eb' : 'transparent', 
            color: activeTab === 'overview' ? 'white' : '#374151',
            border: 'none',
            borderRadius: '0.375rem 0.375rem 0 0',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          System Overview
        </button>
        <button 
          onClick={() => setActiveTab('users')}
          style={{ 
            padding: '0.75rem 1.5rem', 
            backgroundColor: activeTab === 'users' ? '#2563eb' : 'transparent', 
            color: activeTab === 'users' ? 'white' : '#374151',
            border: 'none',
            borderRadius: '0.375rem 0.375rem 0 0',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          User Management
        </button>
        <button 
          onClick={() => setActiveTab('loans')}
          style={{ 
            padding: '0.75rem 1.5rem', 
            backgroundColor: activeTab === 'loans' ? '#2563eb' : 'transparent', 
            color: activeTab === 'loans' ? 'white' : '#374151',
            border: 'none',
            borderRadius: '0.375rem 0.375rem 0 0',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          Loan Management
        </button>
      </div>

      {/* System Overview Tab */}
      {activeTab === 'overview' && (
        <div>
          <h3 style={{ color: '#374151', marginBottom: '1.5rem' }}>System Statistics</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <h4 style={{ color: '#6b7280', marginBottom: '0.5rem' }}>Total Users</h4>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb', margin: 0 }}>{stats.totalUsers}</p>
              <p style={{ color: '#6b7280', margin: 0, fontSize: '0.875rem' }}>{stats.activeUsers} active</p>
            </div>
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <h4 style={{ color: '#6b7280', marginBottom: '0.5rem' }}>Total Loans</h4>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#059669', margin: 0 }}>{stats.totalLoans}</p>
              <p style={{ color: '#6b7280', margin: 0, fontSize: '0.875rem' }}>{stats.activeLoans} active</p>
            </div>
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <h4 style={{ color: '#6b7280', marginBottom: '0.5rem' }}>Total Amount</h4>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#dc2626', margin: 0 }}>${stats.totalAmount.toLocaleString()}</p>
              <p style={{ color: '#6b7280', margin: 0, fontSize: '0.875rem' }}>All loans</p>
            </div>
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <h4 style={{ color: '#6b7280', marginBottom: '0.5rem' }}>Completed Loans</h4>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#7c3aed', margin: 0 }}>{stats.completedLoans}</p>
              <p style={{ color: '#6b7280', margin: 0, fontSize: '0.875rem' }}>Successfully repaid</p>
            </div>
          </div>

          {/* Recent Activity */}
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h4 style={{ color: '#374151', marginBottom: '1rem' }}>Recent Activity</h4>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {loans.slice(0, 5).map((loan) => (
                <div key={loan._id} style={{ 
                  padding: '1rem', 
                  backgroundColor: '#f3f4f6', 
                  borderRadius: '0.375rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <p style={{ color: '#374151', margin: 0, fontWeight: '500' }}>
                      ${loan.amount.toLocaleString()} loan by {loan.borrower.name}
                    </p>
                    <p style={{ color: '#6b7280', margin: 0, fontSize: '0.875rem' }}>
                      {loan.purpose} • {new Date(loan.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span style={{ 
                    padding: '0.25rem 0.75rem', 
                    backgroundColor: getStatusColor(loan.status), 
                    color: 'white', 
                    borderRadius: '1rem',
                    fontSize: '0.875rem',
                    fontWeight: '500'
                  }}>
                    {loan.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* User Management Tab */}
      {activeTab === 'users' && (
        <div>
          <h3 style={{ color: '#374151', marginBottom: '1.5rem' }}>User Management</h3>
          <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f3f4f6' }}>
                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Name</th>
                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Email</th>
                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Role</th>
                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Status</th>
                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Reputation</th>
                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '1rem' }}>{user.name}</td>
                      <td style={{ padding: '1rem' }}>{user.email}</td>
                      <td style={{ padding: '1rem' }}>{user.role}</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ 
                          padding: '0.25rem 0.75rem', 
                          backgroundColor: getStatusColor(user.status), 
                          color: 'white', 
                          borderRadius: '1rem',
                          fontSize: '0.875rem',
                          fontWeight: '500'
                        }}>
                          {user.status}
                        </span>
                      </td>
                      <td style={{ padding: '1rem' }}>{user.reputation || 0}/100</td>
                      <td style={{ padding: '1rem' }}>
                        <select 
                          value={user.status}
                          onChange={(e) => handleUserStatusUpdate(user._id, e.target.value)}
                          style={{ 
                            padding: '0.5rem', 
                            border: '1px solid #d1d5db', 
                            borderRadius: '0.375rem',
                            fontSize: '0.875rem'
                          }}
                        >
                          <option value="active">Active</option>
                          <option value="suspended">Suspended</option>
                          <option value="pending">Pending</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Loan Management Tab */}
      {activeTab === 'loans' && (
        <div>
          <h3 style={{ color: '#374151', marginBottom: '1.5rem' }}>Loan Management</h3>
          <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f3f4f6' }}>
                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Amount</th>
                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Borrower</th>
                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Purpose</th>
                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Status</th>
                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Created</th>
                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loans.map((loan) => (
                    <tr key={loan._id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '1rem', fontWeight: '500' }}>${loan.amount.toLocaleString()}</td>
                      <td style={{ padding: '1rem' }}>{loan.borrower.name}</td>
                      <td style={{ padding: '1rem' }}>{loan.purpose}</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ 
                          padding: '0.25rem 0.75rem', 
                          backgroundColor: getStatusColor(loan.status), 
                          color: 'white', 
                          borderRadius: '1rem',
                          fontSize: '0.875rem',
                          fontWeight: '500'
                        }}>
                          {loan.status}
                        </span>
                      </td>
                      <td style={{ padding: '1rem' }}>{new Date(loan.createdAt).toLocaleDateString()}</td>
                      <td style={{ padding: '1rem' }}>
                        <select 
                          value={loan.status}
                          onChange={(e) => handleLoanStatusUpdate(loan._id, e.target.value)}
                          style={{ 
                            padding: '0.5rem', 
                            border: '1px solid #d1d5db', 
                            borderRadius: '0.375rem',
                            fontSize: '0.875rem'
                          }}
                        >
                          <option value="pending">Pending</option>
                          <option value="funded">Funded</option>
                          <option value="active">Active</option>
                          <option value="completed">Completed</option>
                          <option value="overdue">Overdue</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel; 