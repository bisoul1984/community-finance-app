import React, { useState, useEffect } from 'react';
import { getUsersForVerification, verifyUser } from '../api/community';

const CommunityVerification = ({ user }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [verificationNotes, setVerificationNotes] = useState({});

  useEffect(() => {
    fetchUsersForVerification();
  }, []);

  const fetchUsersForVerification = async () => {
    try {
      const data = await getUsersForVerification();
      setUsers(data);
    } catch (err) {
      setError('Failed to load users for verification.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (userId, isVerified) => {
    const notes = verificationNotes[userId] || '';
    
    try {
      await verifyUser(userId, { isVerified, notes });
      setError('');
      // Refresh the users list
      fetchUsersForVerification();
      // Clear the verification notes
      setVerificationNotes({ ...verificationNotes, [userId]: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit verification.');
    }
  };

  const handleNotesChange = (userId, value) => {
    setVerificationNotes({ ...verificationNotes, [userId]: value });
  };

  const getReputationColor = (reputation) => {
    if (reputation >= 80) return '#059669'; // Green for high reputation
    if (reputation >= 60) return '#f59e0b'; // Yellow for medium reputation
    return '#dc2626'; // Red for low reputation
  };

  const getReputationLevel = (reputation) => {
    if (reputation >= 80) return 'Excellent';
    if (reputation >= 60) return 'Good';
    if (reputation >= 40) return 'Fair';
    return 'Poor';
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Loading users for verification...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <h2 style={{ color: '#1e40af', marginBottom: '1.5rem' }}>Community Verification</h2>
      
      <div style={{ 
        backgroundColor: '#dbeafe', 
        padding: '1rem', 
        borderRadius: '0.375rem', 
        marginBottom: '1.5rem',
        border: '1px solid #93c5fd'
      }}>
        <p style={{ color: '#1e40af', margin: 0 }}>
          <strong>Help build trust in our community!</strong> Verify users you know personally or have had positive interactions with. 
          Your verification helps other community members make informed decisions.
        </p>
      </div>
      
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

      {users.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: '#6b7280', fontSize: '1.1rem', marginBottom: '1rem' }}>
            No users available for verification at the moment.
          </p>
          <p style={{ color: '#9ca3af' }}>
            Check back later for new community members who need verification.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {users.map((verificationUser) => (
            <div key={verificationUser._id} style={{ 
              backgroundColor: 'white', 
              padding: '1.5rem', 
              borderRadius: '0.5rem', 
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ color: '#374151', marginBottom: '0.5rem' }}>
                    {verificationUser.name}
                  </h3>
                  <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
                    <strong>Email:</strong> {verificationUser.email}
                  </p>
                  <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
                    <strong>Role:</strong> {verificationUser.role}
                  </p>
                  <p style={{ color: '#6b7280' }}>
                    <strong>Member since:</strong> {new Date(verificationUser.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ 
                    padding: '0.25rem 0.75rem', 
                    backgroundColor: getReputationColor(verificationUser.reputation || 0), 
                    color: 'white', 
                    borderRadius: '1rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    marginBottom: '0.5rem'
                  }}>
                    {getReputationLevel(verificationUser.reputation || 0)}
                  </div>
                  <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>
                    Reputation: {verificationUser.reputation || 0}/100
                  </p>
                </div>
              </div>

              {/* User Activity Summary */}
              <div style={{ 
                backgroundColor: '#f3f4f6', 
                padding: '1rem', 
                borderRadius: '0.375rem',
                marginBottom: '1rem'
              }}>
                <h4 style={{ color: '#374151', marginBottom: '0.5rem' }}>Activity Summary</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                  <div>
                    <p style={{ color: '#6b7280', margin: 0, fontSize: '0.875rem' }}>
                      <strong>Loans Requested:</strong> {verificationUser.loansRequested || 0}
                    </p>
                  </div>
                  <div>
                    <p style={{ color: '#6b7280', margin: 0, fontSize: '0.875rem' }}>
                      <strong>Loans Funded:</strong> {verificationUser.loansFunded || 0}
                    </p>
                  </div>
                  <div>
                    <p style={{ color: '#6b7280', margin: 0, fontSize: '0.875rem' }}>
                      <strong>Completed Loans:</strong> {verificationUser.completedLoans || 0}
                    </p>
                  </div>
                  <div>
                    <p style={{ color: '#6b7280', margin: 0, fontSize: '0.875rem' }}>
                      <strong>Verifications Received:</strong> {verificationUser.verificationsReceived || 0}
                    </p>
                  </div>
                </div>
              </div>

              {/* Verification Notes */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontWeight: '500' }}>
                  Verification Notes (Optional)
                </label>
                <textarea
                  placeholder="Share your experience with this user or why you're verifying them..."
                  value={verificationNotes[verificationUser._id] || ''}
                  onChange={(e) => handleNotesChange(verificationUser._id, e.target.value)}
                  rows="3"
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem', 
                    border: '1px solid #d1d5db', 
                    borderRadius: '0.375rem',
                    fontSize: '1rem',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Verification Actions */}
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  onClick={() => handleVerification(verificationUser._id, true)}
                  style={{ 
                    flex: 1,
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
                  ✅ Verify User
                </button>
                <button 
                  onClick={() => handleVerification(verificationUser._id, false)}
                  style={{ 
                    flex: 1,
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
                  ❌ Decline Verification
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommunityVerification; 