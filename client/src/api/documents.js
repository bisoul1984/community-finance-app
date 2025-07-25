import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Get auth token
const getAuthToken = () => localStorage.getItem('token');

// Create axios instance with auth header
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

// Get all documents for the current user
export const getDocuments = async () => {
  try {
    const response = await api.get('/documents');
    return response.data;
  } catch (error) {
    console.error('Error fetching documents:', error);
    throw error;
  }
};

// Get documents by type
export const getDocumentsByType = async (documentType) => {
  try {
    const response = await api.get(`/documents/type/${documentType}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching documents by type:', error);
    throw error;
  }
};

// Upload a new document
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

// Get a specific document
export const getDocument = async (documentId) => {
  try {
    const response = await api.get(`/documents/${documentId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching document:', error);
    throw error;
  }
};

// Download a document
export const downloadDocument = async (documentId) => {
  try {
    const response = await api.get(`/documents/${documentId}/download`, {
      responseType: 'blob'
    });
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', response.headers['content-disposition']?.split('filename=')[1] || 'document');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Error downloading document:', error);
    throw error;
  }
};

// Delete a document
export const deleteDocument = async (documentId) => {
  try {
    const response = await api.delete(`/documents/${documentId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
};

// Get document statistics
export const getDocumentStats = async () => {
  try {
    const response = await api.get('/documents/stats/summary');
    return response.data;
  } catch (error) {
    console.error('Error fetching document stats:', error);
    throw error;
  }
};

// Admin: Get all documents (admin only)
export const getAllDocuments = async () => {
  try {
    const response = await api.get('/documents/admin/all');
    return response.data;
  } catch (error) {
    console.error('Error fetching all documents:', error);
    throw error;
  }
};

// Admin: Verify a document (admin only)
export const verifyDocument = async (documentId, status, verificationNotes) => {
  try {
    const response = await api.put(`/documents/admin/${documentId}/verify`, {
      status,
      verificationNotes
    });
    return response.data;
  } catch (error) {
    console.error('Error verifying document:', error);
    throw error;
  }
}; 