import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/admin';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to create axios instance with auth headers
const createAuthAxios = () => {
  const token = getAuthToken();
  return axios.create({
    baseURL: API_URL,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
};

export const getAllUsers = async () => {
  try {
    const axiosInstance = createAuthAxios();
    const res = await axiosInstance.get('/users');
    return res.data;
  } catch (error) {
    console.error('Error fetching all users:', error);
    throw error;
  }
};

export const getAllLoans = async () => {
  try {
    const axiosInstance = createAuthAxios();
    const res = await axiosInstance.get('/loans');
    return res.data;
  } catch (error) {
    console.error('Error fetching all loans:', error);
    throw error;
  }
};

export const updateUserStatus = async (userId, statusData) => {
  try {
    const axiosInstance = createAuthAxios();
    const res = await axiosInstance.put(`/users/${userId}/status`, statusData);
    return res.data;
  } catch (error) {
    console.error('Error updating user status:', error);
    throw error;
  }
};

export const updateLoanStatus = async (loanId, statusData) => {
  try {
    const axiosInstance = createAuthAxios();
    const res = await axiosInstance.put(`/loans/${loanId}/status`, statusData);
    return res.data;
  } catch (error) {
    console.error('Error updating loan status:', error);
    throw error;
  }
};

export const getSystemStats = async () => {
  try {
    const axiosInstance = createAuthAxios();
    const res = await axiosInstance.get('/stats');
    return res.data;
  } catch (error) {
    console.error('Error fetching system stats:', error);
    throw error;
  }
}; 