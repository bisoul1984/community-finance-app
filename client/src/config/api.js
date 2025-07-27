// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: `${API_BASE_URL}/auth`,
  LOANS: `${API_BASE_URL}/loans`,
  PAYMENTS: `${API_BASE_URL}/payments`,
  USERS: `${API_BASE_URL}/users`,
  ADMIN: `${API_BASE_URL}/admin`,
  COMMUNITY: `${API_BASE_URL}/community`,
  DOCUMENTS: `${API_BASE_URL}/documents`,
  CHAT: `${API_BASE_URL}/chat`,
  HEALTH: `${API_BASE_URL}/health`
};

export default API_BASE_URL; 