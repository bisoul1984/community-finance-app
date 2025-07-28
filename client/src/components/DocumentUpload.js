import React, { useState, useEffect } from 'react';
import { 
  getDocuments, 
  uploadDocument, 
  deleteDocument, 
  getDocumentStats 
} from '../api/documents';

const DocumentUpload = ({ user, onDocumentUploaded }) => {
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentType, setDocumentType] = useState('identification');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const documentTypes = [
    { value: 'identification', label: 'Identification Document', required: true },
    { value: 'income', label: 'Income Proof', required: true },
    { value: 'bank_statement', label: 'Bank Statement', required: true },
    { value: 'utility_bill', label: 'Utility Bill', required: false },
    { value: 'employment_letter', label: 'Employment Letter', required: false },
    { value: 'business_plan', label: 'Business Plan', required: false },
    { value: 'collateral', label: 'Collateral Documentation', required: false },
    { value: 'other', label: 'Other Supporting Document', required: false }
  ];

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please upload a valid file type (JPEG, PNG, GIF, PDF, DOC, DOCX)');
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !documentType) {
      alert('Please select a file and document type');
      return;
    }

    setUploading(true);
    setError('');
    
    try {
      const newDocument = await uploadDocument(selectedFile, documentType);
      
      setDocuments(prev => [newDocument, ...prev]);
      setSelectedFile(null);
      setDocumentType('identification');
      
      // Refresh stats
      await fetchStats();
      
      if (onDocumentUploaded) {
        onDocumentUploaded(newDocument);
      }

      alert('Document uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      setError(error.response?.data?.message || 'Failed to upload document. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (documentId) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await deleteDocument(documentId);
        setDocuments(prev => prev.filter(doc => doc._id !== documentId));
        await fetchStats();
        alert('Document deleted successfully!');
      } catch (error) {
        console.error('Error deleting document:', error);
        alert('Failed to delete document. Please try again.');
      }
    }
  };

  const handleDownload = async (documentId, originalName) => {
    try {
      // For now, just show a message that download is not implemented
      alert('Download functionality will be implemented soon!');
    } catch (error) {
      console.error('Error downloading document:', error);
      alert('Failed to download document. Please try again.');
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getRequiredDocuments = () => {
    return documentTypes.filter(type => type.required);
  };

  const getUploadedRequiredDocuments = () => {
    const requiredTypes = getRequiredDocuments().map(type => type.value);
    return documents.filter(doc => requiredTypes.includes(doc.documentType));
  };

  const getDocumentTypeLabel = (type) => {
    const docType = documentTypes.find(dt => dt.value === type);
    return docType ? docType.label : type;
  };

  // Fetch documents and stats on component mount
  useEffect(() => {
    fetchDocuments();
    fetchStats();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const data = await getDocuments();
      setDocuments(data);
    } catch (error) {
      console.error('Error fetching documents:', error);
      setError('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await getDocumentStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6 text-center">
        Document Upload
      </h2>

      {/* Upload Progress */}
      <div className="mb-6 sm:mb-8">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-3 sm:mb-4">
          Required Documents ({getUploadedRequiredDocuments().length}/{getRequiredDocuments().length})
        </h3>
        
        {stats && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs sm:text-sm font-medium text-blue-800">Document Completion</span>
              <span className="text-xs sm:text-sm font-bold text-blue-900">{stats.required.percentage}%</span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${stats.required.percentage}%` }}
              ></div>
            </div>
            <div className="mt-2 text-xs text-blue-700">
              {stats.required.uploaded} of {stats.required.total} required documents uploaded
              {stats.optional.uploaded > 0 && ` • ${stats.optional.uploaded} optional documents`}
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {getRequiredDocuments().map(type => {
            const isUploaded = documents.some(doc => doc.documentType === type.value);
            return (
              <div 
                key={type.value}
                className={`p-3 rounded-lg border-2 ${
                  isUploaded 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-red-200 bg-red-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm sm:text-base font-medium text-gray-700">{type.label}</span>
                  <span className={`text-xs sm:text-sm font-medium ${
                    isUploaded ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {isUploaded ? '✓ Uploaded' : 'Required'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upload Form */}
      <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-gray-50 rounded-lg">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-3 sm:mb-4">
          Upload New Document
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              Document Type
            </label>
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            >
              {documentTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label} {type.required && '(Required)'}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              Select File
            </label>
            <input
              type="file"
              onChange={handleFileSelect}
              accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            />
            <p className="text-xs text-gray-500 mt-1">
              Max size: 10MB. Supported formats: JPEG, PNG, GIF, PDF, DOC, DOCX
            </p>
          </div>
        </div>

        {selectedFile && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs sm:text-sm text-blue-700">
              <strong>Selected file:</strong> {selectedFile.name} ({formatFileSize(selectedFile.size)})
            </p>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 rounded-lg">
            <p className="text-xs sm:text-sm text-red-700">{error}</p>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!selectedFile || uploading}
          className={`w-full px-4 py-2 rounded-md text-white font-medium text-sm sm:text-base ${
            !selectedFile || uploading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {uploading ? 'Uploading...' : 'Upload Document'}
        </button>
      </div>

      {/* Uploaded Documents */}
      <div>
        <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-3 sm:mb-4">
          Uploaded Documents ({documents.length})
        </h3>
        
        {loading ? (
          <div className="text-center py-8 text-gray-500">
            <p>Loading documents...</p>
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No documents uploaded yet.</p>
            <p className="text-sm">Upload your required documents to proceed with loan applications.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {documents.map(doc => (
              <div key={doc._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg gap-3">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-xs sm:text-sm">
                      {doc.originalName.split('.').pop().toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm sm:text-base font-medium text-gray-800 truncate">{doc.originalName}</p>
                    <p className="text-xs sm:text-sm text-gray-600">
                      {getDocumentTypeLabel(doc.documentType)} • {formatFileSize(doc.fileSize)}
                    </p>
                    <p className="text-xs text-gray-500">
                      Uploaded: {new Date(doc.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    doc.status === 'verified' ? 'bg-green-100 text-green-800' :
                    doc.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    doc.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {doc.status}
                  </span>
                  <button
                    onClick={() => handleDownload(doc._id, doc.originalName)}
                    className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 text-xs sm:text-sm"
                  >
                    Download
                  </button>
                  <button
                    onClick={() => handleDelete(doc._id)}
                    className="px-2 sm:px-3 py-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200 text-xs sm:text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-yellow-50 rounded-lg">
        <h4 className="text-base sm:text-lg font-semibold text-yellow-800 mb-2">
          📋 Document Upload Tips
        </h4>
        <ul className="text-xs sm:text-sm text-yellow-700 space-y-1">
          <li>• Ensure all required documents are uploaded before applying for loans</li>
          <li>• Use clear, high-quality scans or photos of your documents</li>
          <li>• Make sure documents are not expired and are clearly readable</li>
          <li>• Keep file sizes under 10MB for faster uploads</li>
          <li>• Supported formats: JPEG, PNG, GIF, PDF, DOC, DOCX</li>
        </ul>
      </div>
    </div>
  );
};

export default DocumentUpload; 