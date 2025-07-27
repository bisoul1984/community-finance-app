import React, { useState, useEffect } from 'react';
import { Bell, Check, X, Mail, AlertCircle, CheckCircle, Clock, Inbox, BellOff, Info } from 'lucide-react';

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      fetchNotifications();
      fetchUnreadCount();
    }
  }, [token]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/notifications`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/notifications/unread-count`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUnreadCount(data.count);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        setNotifications(prev => 
          prev.map(notif => 
            notif._id === notificationId 
              ? { ...notif, read: true }
              : notif
          )
        );
        fetchUnreadCount();
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/notifications/read-all`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        setNotifications(prev => prev.filter(notif => notif._id !== notificationId));
        fetchUnreadCount();
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'loanApproved':
        return <CheckCircle className="w-5 h-5 text-green-600" title="Loan Approved" />;
      case 'loanRepaid':
        return <CheckCircle className="w-5 h-5 text-green-500" title="Loan Fully Repaid" />;
      case 'paymentReceived':
        return <CheckCircle className="w-5 h-5 text-blue-500" title="Payment Received" />;
      case 'loanRejected':
        return <AlertCircle className="w-5 h-5 text-red-500" title="Loan Rejected" />;
      case 'repaymentReminder':
        return <AlertCircle className="w-5 h-5 text-yellow-500" title="Repayment Reminder" />;
      case 'loanSubmitted':
        return <Mail className="w-5 h-5 text-indigo-500" title="Loan Submitted" />;
      case 'accountVerification':
        return <Info className="w-5 h-5 text-blue-400" title="Account Verification" />;
      case 'passwordReset':
        return <Info className="w-5 h-5 text-orange-400" title="Password Reset" />;
      case 'welcomeEmail':
        return <Inbox className="w-5 h-5 text-purple-500" title="Welcome" />;
      default:
        return <Bell className="w-5 h-5 text-gray-400" title="Notification" />;
    }
  };

  const getNotificationTitle = (type) => {
    switch (type) {
      case 'loanSubmitted':
        return 'Loan Application Submitted';
      case 'loanApproved':
        return 'Loan Approved!';
      case 'loanRejected':
        return 'Loan Application Update';
      case 'repaymentReminder':
        return 'Payment Reminder';
      case 'paymentReceived':
        return 'Payment Received';
      case 'loanRepaid':
        return 'Loan Fully Repaid!';
      case 'accountVerification':
        return 'Email Verification';
      case 'passwordReset':
        return 'Password Reset';
      case 'welcomeEmail':
        return 'Welcome!';
      default:
        return 'Notification';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-3 rounded-2xl transition-all duration-300 ${
          unreadCount > 0 
            ? 'text-blue-600 hover:text-blue-700 hover:bg-blue-50 shadow-lg hover:shadow-xl' 
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg'
        } ${isOpen ? 'bg-blue-50 shadow-xl' : ''}`}
        aria-label="Open notifications"
      >
        {unreadCount > 0 ? (
          <div className="relative">
            <Bell className="w-7 h-7 animate-pulse" />
            <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow-lg animate-bounce">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          </div>
        ) : (
          <div className="relative">
            <Bell className="w-7 h-7" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-gray-300 rounded-full"></div>
          </div>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-20 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="fixed top-20 right-4 w-[420px] bg-white rounded-3xl shadow-2xl border border-gray-100 z-50 max-h-[600px] overflow-hidden backdrop-blur-sm">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 via-white to-purple-50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Bell className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Notifications</h3>
                  {unreadCount > 0 && (
                    <p className="text-sm text-blue-600 font-medium">{unreadCount} new notification{unreadCount > 1 ? 's' : ''}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium px-4 py-2 rounded-xl hover:bg-blue-50 transition-all duration-200 border border-blue-200 hover:border-blue-300"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-xl hover:bg-gray-100 transition-all duration-200"
                  aria-label="Close notifications"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {loading ? (
                <div className="p-12 text-center">
                  <div className="relative">
                    <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <div className="w-6 h-6 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto absolute top-3 left-1/2 transform -translate-x-1/2"></div>
                  </div>
                  <p className="text-gray-500 font-medium">Loading your notifications...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-80 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-6">
                    <Bell className="w-10 h-10 text-gray-400" />
                  </div>
                  <span className="text-2xl text-gray-700 font-bold mb-3">All caught up!</span>
                  <p className="text-gray-500 text-center mb-8 max-w-xs leading-relaxed">You're all set. No new notifications at the moment.</p>
                  <button
                    className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white text-sm px-8 py-4 rounded-2xl hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 font-semibold"
                    onClick={() => window.location.href = '/'}
                  >
                    Explore Loans
                  </button>
                </div>
              ) : (
                notifications.map((notification, index) => (
                  <div
                    key={notification._id}
                    className={`p-6 border-b border-gray-50 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 transition-all duration-300 ${
                      !notification.read ? 'bg-gradient-to-r from-blue-50/80 to-purple-50/80 border-l-4 border-l-blue-500 shadow-sm' : ''
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 mt-1">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
                          {getNotificationIcon(notification.type)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-bold text-gray-900">
                            {getNotificationTitle(notification.type)}
                          </h4>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500 bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-200">
                              {formatDate(notification.createdAt)}
                            </span>
                            {!notification.read && (
                              <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse shadow-lg"></div>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed mb-4">
                          {notification.subject}
                        </p>
                        <div className="flex items-center space-x-3">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification._id)}
                              className="text-xs text-blue-600 hover:text-blue-800 flex items-center space-x-2 px-4 py-2 rounded-xl hover:bg-blue-50 transition-all duration-200 border border-blue-200 hover:border-blue-300 font-medium"
                            >
                              <Check className="w-4 h-4" />
                              <span>Mark read</span>
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification._id)}
                            className="text-xs text-red-600 hover:text-red-800 flex items-center space-x-2 px-4 py-2 rounded-xl hover:bg-red-50 transition-all duration-200 border border-red-200 hover:border-red-300 font-medium"
                          >
                            <X className="w-4 h-4" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-5 border-t border-gray-100 bg-gradient-to-r from-gray-50 via-blue-50 to-purple-50">
                <button
                  onClick={fetchNotifications}
                  className="text-sm text-blue-600 hover:text-blue-800 w-full text-center font-semibold py-3 rounded-xl hover:bg-white transition-all duration-200 border border-blue-200 hover:border-blue-300 shadow-sm hover:shadow-md"
                >
                  🔄 Refresh Notifications
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationCenter; 