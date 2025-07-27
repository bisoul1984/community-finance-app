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
    const response = await api.get('/documents');
    return response.data;
  } catch (error) {
    console.error('Error fetching documents:', error);
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
    const response = await api.get('/documents/stats/summary');
    return response.data;
  } catch (error) {
    console.error('Error fetching document stats:', error);
    throw error;
  }
}; 