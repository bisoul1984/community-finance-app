import React, { useState } from 'react';
import { login } from '../api/auth';

const Login = ({ onLogin }) => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      console.log('Attempting login with:', form);
      const response = await login(form);
      console.log('Login response:', response);
      console.log('Token stored:', localStorage.getItem('token'));
      setSuccess('Login successful!');
      // Call onLogin with user data after successful login
      setTimeout(() => {
        onLogin(response.user);
      }, 1000);
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed.');
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      backgroundColor: '#f1f5f9' 
    }}>
      <form onSubmit={handleSubmit} style={{ 
        backgroundColor: 'white', 
        padding: '2rem', 
        borderRadius: '0.5rem', 
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', 
        width: '100%', 
        maxWidth: '400px' 
      }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center' }}>Log In</h2>
        {error && <div style={{ color: '#dc2626', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
        {success && <div style={{ color: '#059669', marginBottom: '1rem', textAlign: 'center' }}>{success}</div>}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          style={{ 
            width: '100%', 
            marginBottom: '1rem', 
            padding: '0.5rem', 
            border: '1px solid #d1d5db', 
            borderRadius: '0.375rem' 
          }}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          style={{ 
            width: '100%', 
            marginBottom: '1rem', 
            padding: '0.5rem', 
            border: '1px solid #d1d5db', 
            borderRadius: '0.375rem' 
          }}
          required
        />
        <button type="submit" style={{ 
          width: '100%', 
          backgroundColor: '#2563eb', 
          color: 'white', 
          padding: '0.5rem', 
          borderRadius: '0.375rem', 
          border: 'none',
          cursor: 'pointer'
        }}>Log In</button>
      </form>
    </div>
  );
};

export default Login; 