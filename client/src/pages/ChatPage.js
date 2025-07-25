import React from 'react';
import ChatSystem from '../components/ChatSystem';

const ChatPage = ({ user }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Community Chat</h1>
              <p className="text-gray-600">Connect with other community members in real-time</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto">
        <ChatSystem user={user} />
      </div>
    </div>
  );
};

export default ChatPage; 