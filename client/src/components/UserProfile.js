import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, ThumbsDown, MessageCircle, ShieldCheck } from 'lucide-react';

const UserProfile = ({ user, onProfileUpdate }) => {
  const [profile, setProfile] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email || '',
    phone: user.phone || '',
    address: user.address || '',
    city: user.city || '',
    state: user.state || '',
    zipCode: user.zipCode || '',
    dateOfBirth: user.dateOfBirth || '',
    occupation: user.occupation || '',
    employer: user.employer || '',
    annualIncome: user.annualIncome || '',
    emergencyContact: user.emergencyContact || {
      name: '',
      phone: '',
      relationship: ''
    }
  });
  
  const [preferences, setPreferences] = useState({
    language: user.language || 'en',
    timezone: user.timezone || 'UTC',
    currency: user.currency || 'USD',
    theme: user.theme || 'light',
    notifications: user.notifications || {
      email: true,
      sms: false,
      push: true
    }
  });
  
  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: user.twoFactorEnabled || false
  });
  
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  useEffect(() => {
    // Load user data when component mounts
    loadUserProfile();
  }, [user]);

  const loadUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/users/profile/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setProfile(prev => ({ ...prev, ...data }));
        setPreferences(prev => ({ ...prev, ...data.preferences }));
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const updateProfile = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/users/profile/${user.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profile)
      });
      
      if (response.ok) {
        setMessage('Profile updated successfully!');
        setTimeout(() => setMessage(''), 3000);
        if (onProfileUpdate) {
          onProfileUpdate(profile);
        }
      } else {
        setMessage('Failed to update profile');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Error updating profile');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/users/preferences/${user.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(preferences)
      });
      
      if (response.ok) {
        setMessage('Preferences updated successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Failed to update preferences');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error updating preferences:', error);
      setMessage('Error updating preferences');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async () => {
    if (security.newPassword !== security.confirmPassword) {
      setMessage('New passwords do not match');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    if (security.newPassword.length < 8) {
      setMessage('Password must be at least 8 characters long');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/users/password/${user.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword: security.currentPassword,
          newPassword: security.newPassword
        })
      });
      
      if (response.ok) {
        setMessage('Password updated successfully!');
        setTimeout(() => setMessage(''), 3000);
        setSecurity(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
        setShowPasswordForm(false);
      } else {
        setMessage('Failed to update password. Please check your current password.');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error updating password:', error);
      setMessage('Error updating password');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const toggleTwoFactor = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/users/2fa/${user.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ enabled: !security.twoFactorEnabled })
      });
      
      if (response.ok) {
        setSecurity(prev => ({ ...prev, twoFactorEnabled: !prev.twoFactorEnabled }));
        setMessage(`Two-factor authentication ${!security.twoFactorEnabled ? 'enabled' : 'disabled'} successfully!`);
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error toggling two-factor authentication:', error);
      setMessage('Error updating two-factor authentication');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name
          </label>
          <input
            type="text"
            value={profile.firstName}
            onChange={(e) => setProfile(prev => ({ ...prev, firstName: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name
          </label>
          <input
            type="text"
            value={profile.lastName}
            onChange={(e) => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={profile.email}
            onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            value={profile.phone}
            onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Address
        </label>
        <input
          type="text"
          value={profile.address}
          onChange={(e) => setProfile(prev => ({ ...prev, address: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City
          </label>
          <input
            type="text"
            value={profile.city}
            onChange={(e) => setProfile(prev => ({ ...prev, city: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            State
          </label>
          <input
            type="text"
            value={profile.state}
            onChange={(e) => setProfile(prev => ({ ...prev, state: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ZIP Code
          </label>
          <input
            type="text"
            value={profile.zipCode}
            onChange={(e) => setProfile(prev => ({ ...prev, zipCode: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date of Birth
          </label>
          <input
            type="date"
            value={profile.dateOfBirth}
            onChange={(e) => setProfile(prev => ({ ...prev, dateOfBirth: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Annual Income
          </label>
          <input
            type="number"
            value={profile.annualIncome}
            onChange={(e) => setProfile(prev => ({ ...prev, annualIncome: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter annual income"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Occupation
          </label>
          <input
            type="text"
            value={profile.occupation}
            onChange={(e) => setProfile(prev => ({ ...prev, occupation: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Employer
          </label>
          <input
            type="text"
            value={profile.employer}
            onChange={(e) => setProfile(prev => ({ ...prev, employer: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <button
        onClick={updateProfile}
        disabled={loading}
        className={`w-full py-2 px-4 rounded-md text-white font-medium ${
          loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {loading ? 'Updating...' : 'Update Profile'}
      </button>
    </div>
  );

  const renderPreferences = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Language
          </label>
          <select
            value={preferences.language}
            onChange={(e) => setPreferences(prev => ({ ...prev, language: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Currency
          </label>
          <select
            value={preferences.currency}
            onChange={(e) => setPreferences(prev => ({ ...prev, currency: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="JPY">JPY (¥)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Theme
          </label>
          <select
            value={preferences.theme}
            onChange={(e) => setPreferences(prev => ({ ...prev, theme: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="auto">Auto</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Timezone
          </label>
          <select
            value={preferences.timezone}
            onChange={(e) => setPreferences(prev => ({ ...prev, timezone: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="UTC">UTC</option>
            <option value="EST">Eastern Time</option>
            <option value="PST">Pacific Time</option>
            <option value="GMT">GMT</option>
          </select>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-800 mb-3">Notification Preferences</h3>
        <div className="space-y-3">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={preferences.notifications.email}
              onChange={(e) => setPreferences(prev => ({
                ...prev,
                notifications: { ...prev.notifications, email: e.target.checked }
              }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-700">Email Notifications</span>
          </label>
          
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={preferences.notifications.sms}
              onChange={(e) => setPreferences(prev => ({
                ...prev,
                notifications: { ...prev.notifications, sms: e.target.checked }
              }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-700">SMS Notifications</span>
          </label>
          
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={preferences.notifications.push}
              onChange={(e) => setPreferences(prev => ({
                ...prev,
                notifications: { ...prev.notifications, push: e.target.checked }
              }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-700">Push Notifications</span>
          </label>
        </div>
      </div>

      <button
        onClick={updatePreferences}
        disabled={loading}
        className={`w-full py-2 px-4 rounded-md text-white font-medium ${
          loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {loading ? 'Updating...' : 'Update Preferences'}
      </button>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-6">
      <div className="bg-yellow-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-yellow-800 mb-2">Password Security</h3>
        <p className="text-yellow-700 text-sm">
          Keep your password strong and unique. Consider enabling two-factor authentication for additional security.
        </p>
      </div>

      {!showPasswordForm ? (
        <button
          onClick={() => setShowPasswordForm(true)}
          className="w-full py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Change Password
        </button>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <input
              type="password"
              value={security.currentPassword}
              onChange={(e) => setSecurity(prev => ({ ...prev, currentPassword: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              value={security.newPassword}
              onChange={(e) => setSecurity(prev => ({ ...prev, newPassword: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              value={security.confirmPassword}
              onChange={(e) => setSecurity(prev => ({ ...prev, confirmPassword: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={updatePassword}
              disabled={loading}
              className={`flex-1 py-2 px-4 rounded-md text-white font-medium ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
            <button
              onClick={() => setShowPasswordForm(false)}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="border-t pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-800">Two-Factor Authentication</h3>
            <p className="text-gray-600 text-sm">
              Add an extra layer of security to your account
            </p>
          </div>
          <button
            onClick={toggleTwoFactor}
            className={`px-4 py-2 rounded-md font-medium ${
              security.twoFactorEnabled
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            {security.twoFactorEnabled ? 'Disable' : 'Enable'}
          </button>
        </div>
      </div>
    </div>
  );

  const mockFeedback = [
    {
      id: 1,
      lender: 'Jane Doe',
      rating: 5,
      comment: 'Great borrower, always pays on time!',
      upvotes: 12,
      downvotes: 0,
      date: '2024-07-01',
    },
    {
      id: 2,
      lender: 'John Smith',
      rating: 4,
      comment: 'Good communication, minor delay but resolved.',
      upvotes: 8,
      downvotes: 1,
      date: '2024-06-15',
    },
  ];

  const CommunityTrustSection = ({ trustScore = 4.7, feedback = mockFeedback }) => (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
        <Star className="w-5 h-5 text-amber-400" /> Community Trust & Feedback
      </h3>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl font-bold text-amber-500">{trustScore.toFixed(1)}</span>
        <span className="flex gap-0.5">
          {[1,2,3,4,5].map(i => (
            <Star key={i} className={`w-5 h-5 ${i <= Math.round(trustScore) ? 'text-amber-400' : 'text-slate-200'}`} fill={i <= Math.round(trustScore) ? '#fbbf24' : 'none'} />
          ))}
        </span>
        <span className="text-slate-500 text-sm">({feedback.length} reviews)</span>
      </div>
      <div className="space-y-4">
        {feedback.map(fb => (
          <div key={fb.id} className="border border-slate-100 rounded-lg p-4 bg-slate-50">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-slate-800">{fb.lender}</span>
              <span className="flex gap-0.5">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className={`w-4 h-4 ${i <= fb.rating ? 'text-amber-400' : 'text-slate-200'}`} fill={i <= fb.rating ? '#fbbf24' : 'none'} />
                ))}
              </span>
              <span className="text-xs text-slate-400 ml-2">{new Date(fb.date).toLocaleDateString()}</span>
            </div>
            <div className="text-slate-700 text-sm mb-2 flex items-center gap-2"><MessageCircle className="w-4 h-4 text-slate-400" /> {fb.comment}</div>
            <div className="flex gap-3 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1"><ThumbsUp className="w-4 h-4" /> {fb.upvotes}</span>
              <span className="inline-flex items-center gap-1"><ThumbsDown className="w-4 h-4" /> {fb.downvotes}</span>
            </div>
          </div>
        ))}
      </div>
      {/* Add feedback form for lenders (mock, not functional) */}
      <div className="mt-6 border-t pt-4">
        <h4 className="font-semibold text-slate-800 mb-2">Leave Feedback (Lender Only)</h4>
        <form className="flex flex-col gap-2">
          <textarea className="w-full border border-slate-300 rounded-md p-2 text-sm" placeholder="Write a comment..." disabled />
          <div className="flex gap-2 items-center">
            <span className="text-xs text-slate-400">Rating:</span>
            {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 text-slate-200" />)}
            <button className="ml-auto px-4 py-1 bg-slate-300 text-slate-600 rounded font-medium text-xs cursor-not-allowed" disabled>Submit</button>
          </div>
          <span className="text-xs text-slate-400">(Only available to lenders after repayment)</span>
        </form>
      </div>
    </div>
  );

  const KYCSection = ({ kycStatus = 'pending', kycDocs = {}, onUpload }) => (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
        <ShieldCheck className="w-5 h-5 text-blue-500" /> KYC Verification
      </h3>
      <div className="mb-4">
        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${kycStatus === 'verified' ? 'bg-emerald-100 text-emerald-700' : kycStatus === 'rejected' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>{kycStatus.charAt(0).toUpperCase() + kycStatus.slice(1)}</span>
      </div>
      <form className="space-y-4" onSubmit={e => { e.preventDefault(); }}>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Upload ID Document</label>
          <input type="file" name="id" accept=".pdf,.jpg,.jpeg,.png" className="w-full px-2 py-1 border border-slate-300 rounded-md bg-white text-slate-900" disabled />
          {kycDocs.id && <span className="text-xs text-slate-500 ml-2">Uploaded: {kycDocs.id}</span>}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Upload Proof of Address</label>
          <input type="file" name="address" accept=".pdf,.jpg,.jpeg,.png" className="w-full px-2 py-1 border border-slate-300 rounded-md bg-white text-slate-900" disabled />
          {kycDocs.address && <span className="text-xs text-slate-500 ml-2">Uploaded: {kycDocs.address}</span>}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Upload Bank Statement</label>
          <input type="file" name="bank" accept=".pdf,.jpg,.jpeg,.png" className="w-full px-2 py-1 border border-slate-300 rounded-md bg-white text-slate-900" disabled />
          {kycDocs.bank && <span className="text-xs text-slate-500 ml-2">Uploaded: {kycDocs.bank}</span>}
        </div>
        <button className="w-full bg-slate-300 text-slate-600 rounded font-medium py-2 cursor-not-allowed" disabled>Submit KYC (Demo Only)</button>
      </form>
      <div className="text-xs text-slate-400 mt-2">(KYC upload is demo only. Integrate with backend for full functionality.)</div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
        <p className="text-gray-600">Manage your personal information, preferences, and account security</p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.includes('successfully') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {message}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('personal')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'personal'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Personal Information
            </button>
            <button
              onClick={() => setActiveTab('preferences')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'preferences'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Preferences
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'security'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Security
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'personal' && renderPersonalInfo()}
          {activeTab === 'preferences' && renderPreferences()}
          {activeTab === 'security' && renderSecurity()}
        </div>
      </div>
      <KYCSection kycStatus="pending" kycDocs={{ id: 'id.pdf', address: '', bank: '' }} />
      <CommunityTrustSection trustScore={user.trustScore} feedback={user.feedback} />
    </div>
  );
};

export default UserProfile; 