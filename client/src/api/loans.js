import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/loans';

export const getLoanRequests = async () => {
  const res = await axios.get(`${API_URL}/requests`);
  return res.data;
};

export const getUserLoans = async (userId) => {
  const res = await axios.get(`${API_URL}/user/${userId}`);
  return res.data;
};

export const createLoan = async (loanData) => {
  const res = await axios.post(`${API_URL}/create`, loanData);
  return res.data;
};

export const fundLoan = async (loanId, fundData) => {
  const res = await axios.post(`${API_URL}/fund/${loanId}`, fundData);
  return res.data;
};

export const repayLoan = async (loanId, amount) => {
  const res = await axios.post(`${API_URL}/repay/${loanId}`, { amount });
  return res.data;
}; 