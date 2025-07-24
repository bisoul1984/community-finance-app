import React from 'react';
import NotificationSystem from '../components/NotificationSystem';

const NotificationPage = ({ user }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <NotificationSystem user={user} />
    </div>
  );
};

export default NotificationPage; 