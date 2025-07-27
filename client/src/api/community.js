import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

const API_URL = API_ENDPOINTS.COMMUNITY;

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

export const getUsersForVerification = async () => {
  try {
    const axiosInstance = createAuthAxios();
    const res = await axiosInstance.get('/users-for-verification');
    return res.data;
  } catch (error) {
    console.error('Error fetching users for verification:', error);
    throw error;
  }
};

export const verifyUser = async (userId, verificationData) => {
  try {
    const axiosInstance = createAuthAxios();
    const res = await axiosInstance.post(`/verify/${userId}`, verificationData);
    return res.data;
  } catch (error) {
    console.error('Error verifying user:', error);
    throw error;
  }
};

export const getUserProfile = async (userId) => {
  try {
    const axiosInstance = createAuthAxios();
    const res = await axiosInstance.get(`/profile/${userId}`);
    return res.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (profileData) => {
  try {
    const axiosInstance = createAuthAxios();
    const res = await axiosInstance.put('/profile', profileData);
    return res.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}; 