import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

const API_URL = API_ENDPOINTS.AUTH;

export const signup = async (userData) => {
  try {
    const res = await axios.post(`${API_URL}/signup`, userData);
    // Store token in localStorage
    if (res.data.token) {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
    }
    return res.data;
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
};

export const login = async (credentials) => {
  try {
    const res = await axios.post(`${API_URL}/login`, credentials);
    // Store token in localStorage
    if (res.data.token) {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
    }
    return res.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  // Clear any other auth-related data
  sessionStorage.clear();
}; 