import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

const API_URL = API_ENDPOINTS.DOCUMENTS;

const getAuthToken = () => localStorage.getItem('token');

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Authorization': `Bearer ${getAuthToken()}`
  }
});

// Add request interceptor to include token
api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getDocuments = async () => {
  try {
    console.log('Fetching documents from:', API_URL);
    console.log('Auth token exists:', !!localStorage.getItem('token'));
    const response = await api.get('/documents');
    console.log('Documents response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching documents:', error);
    console.error('Error response:', error.response);
    console.error('Error status:', error.response?.status);
    console.error('Error data:', error.response?.data);
    throw error;
  }
};

export const uploadDocument = async (file, documentType) => {
  try {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('documentType', documentType);
    
    const response = await api.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading document:', error);
    throw error;
  }
};

export const deleteDocument = async (documentId) => {
  try {
    const response = await api.delete(`/documents/${documentId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
};

export const getDocumentStats = async () => {
  try {
    console.log('Fetching document stats from:', API_URL);
    console.log('Auth token exists:', !!localStorage.getItem('token'));
    const response = await api.get('/documents/stats/summary');
    console.log('Document stats response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching document stats:', error);
    console.error('Error response:', error.response);
    console.error('Error status:', error.response?.status);
    console.error('Error data:', error.response?.data);
    throw error;
  }
}; 