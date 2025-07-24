import React from 'react';
import DocumentUpload from '../components/DocumentUpload';

const DocumentUploadPage = ({ user }) => {
  const handleDocumentUploaded = (document) => {
    console.log('Document uploaded:', document);
    // You can add additional logic here, such as updating user profile
    // or sending notifications
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 text-center mb-2">
            Document Management
          </h1>
          <p className="text-gray-600 text-center max-w-2xl mx-auto">
            Upload and manage your supporting documents for loan applications. 
            Ensure all required documents are uploaded to expedite your loan approval process.
          </p>
        </div>
        
        <DocumentUpload user={user} onDocumentUploaded={handleDocumentUploaded} />
        
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Why Documents Are Required
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-700 mb-2">
                  Verification Process
                </h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• Identity verification for security</li>
                  <li>• Income verification for loan eligibility</li>
                  <li>• Financial history assessment</li>
                  <li>• Risk evaluation and loan terms</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-700 mb-2">
                  Faster Processing
                </h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• Complete applications are processed faster</li>
                  <li>• Reduces back-and-forth communication</li>
                  <li>• Higher approval rates with complete documentation</li>
                  <li>• Better loan terms with verified information</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentUploadPage; 