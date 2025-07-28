import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

const API_URL = API_ENDPOINTS.AUTH;

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Add request interceptor for debugging
apiClient.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    console.log('API Request data:', config.data);
    return config;
  },
  (error) => {
    console.error('API Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
apiClient.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('API Response error:', error);
    return Promise.reject(error);
  }
);

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
    
    const res = await apiClient.post('/login', credentials);
    
    console.log('Login response:', res.data);
    
    // Store token in localStorage
    if (res.data.token) {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      console.log('Token and user stored in localStorage');
    } else {
      console.error('No token in response:', res.data);
      throw new Error('No authentication token received from server');
    }
    
    return res.data;
  } catch (error) {
    console.error('Login error:', error);
    console.error('Error message:', error.message);
    console.error('Error response:', error.response);
    console.error('Error status:', error.response?.status);
    console.error('Error data:', error.response?.data);
    
    // Provide better error messages
    if (error.code === 'ECONNABORTED') {
      throw new Error('Login request timed out. Please try again.');
    } else if (error.response?.status === 401) {
      throw new Error('Invalid email or password. Please check your credentials.');
    } else if (error.response?.status === 500) {
      throw new Error('Server error. Please try again later.');
    } else if (!error.response) {
      throw new Error('Network error. Please check your connection and try again.');
    } else {
      throw new Error(error.response?.data?.message || 'Login failed. Please try again.');
    }
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