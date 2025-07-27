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
    console.log('Login attempt with credentials:', { email: credentials.email });
    console.log('Login API URL:', API_URL);
    const res = await axios.post(`${API_URL}/login`, credentials);
    console.log('Login response:', res.data);
    // Store token in localStorage
    if (res.data.token) {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      console.log('Token and user stored in localStorage');
    } else {
      console.error('No token in response:', res.data);
    }
    return res.data;
  } catch (error) {
    console.error('Login error:', error);
    console.error('Error response:', error.response);
    console.error('Error status:', error.response?.status);
    console.error('Error data:', error.response?.data);
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