import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

const API_URL = API_ENDPOINTS.LOANS;

// Helper function to get auth token
const getAuthToken = () => {
  const token = localStorage.getItem('token');
  console.log('Getting auth token:', token ? 'Token exists' : 'No token found');
  return token;
};

// Helper function to create axios instance with auth headers
const createAuthAxios = () => {
  const token = getAuthToken();
  const instance = axios.create({
    baseURL: API_URL,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  console.log('Created axios instance with baseURL:', API_URL);
  console.log('Headers:', instance.defaults.headers);
  return instance;
};

export const getLoanRequests = async () => {
  try {
    console.log('Fetching loan requests...');
    const axiosInstance = createAuthAxios();
    const res = await axiosInstance.get('/requests');
    console.log('Loan requests response:', res.data);
    return res.data;
  } catch (error) {
    console.error('Error fetching loan requests:', error);
    console.error('Error response:', error.response);
    throw error;
  }
};

export const getUserLoans = async (userId) => {
  try {
    console.log('Fetching loans for user:', userId);
    console.log('API URL:', API_URL);
    const axiosInstance = createAuthAxios();
    const url = `/user/${userId}`;
    console.log('Making request to:', url);
    const res = await axiosInstance.get(url);
    console.log('User loans response:', res.data);
    return res.data;
  } catch (error) {
    console.error('Error fetching user loans:', error);
    console.error('Error response:', error.response);
    console.error('Error status:', error.response?.status);
    console.error('Error data:', error.response?.data);
    throw error;
  }
};

export const createLoan = async (loanData) => {
  try {
    console.log('Creating loan with data:', loanData);
    const axiosInstance = createAuthAxios();
    const res = await axiosInstance.post('/create', loanData);
    console.log('Create loan response:', res.data);
    return res.data;
  } catch (error) {
    console.error('Error creating loan:', error);
    console.error('Error response:', error.response);
    throw error;
  }
};

export const fundLoan = async (loanId, fundData) => {
  try {
    console.log('Funding loan:', loanId, 'with data:', fundData);
    const axiosInstance = createAuthAxios();
    const res = await axiosInstance.post(`/fund/${loanId}`, fundData);
    console.log('Fund loan response:', res.data);
    return res.data;
  } catch (error) {
    console.error('Error funding loan:', error);
    console.error('Error response:', error.response);
    throw error;
  }
};

export const repayLoan = async (loanId, amount) => {
  try {
    console.log('Repaying loan:', loanId, 'amount:', amount);
    const axiosInstance = createAuthAxios();
    const res = await axiosInstance.post(`/repay/${loanId}`, { amount });
    console.log('Repay loan response:', res.data);
    return res.data;
  } catch (error) {
    console.error('Error repaying loan:', error);
    console.error('Error response:', error.response);
    throw error;
  }
}; 