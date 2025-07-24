import React from 'react';
import UserProfile from '../components/UserProfile';

const UserProfilePage = ({ user }) => {
  const handleProfileUpdate = (updatedProfile) => {
    console.log('Profile updated:', updatedProfile);
    // You can add additional logic here, such as updating the global user state
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <UserProfile user={user} onProfileUpdate={handleProfileUpdate} />
    </div>
  );
};

export default UserProfilePage; 