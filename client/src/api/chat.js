import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

const API_URL = API_ENDPOINTS.CHAT;

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to create axios instance with auth headers
const createAuthAxios = () => {
  const token = getAuthToken();
  return axios.create({
    baseURL: API_URL,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
};

// Get user's chat rooms
export const getChatRooms = async () => {
  try {
    console.log('Fetching chat rooms...');
    const axiosInstance = createAuthAxios();
    const res = await axiosInstance.get('/rooms');
    console.log('Chat rooms fetched successfully:', res.data);
    return res.data;
  } catch (error) {
    console.error('Error fetching chat rooms:', error);
    console.error('Error details:', error.response?.data);
    throw error;
  }
};

// Get messages for a specific room
export const getRoomMessages = async (roomId, page = 1, limit = 50) => {
  try {
    const axiosInstance = createAuthAxios();
    const res = await axiosInstance.get(`/rooms/${roomId}/messages?page=${page}&limit=${limit}`);
    return res.data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

// Send a message
export const sendMessage = async (roomId, messageData) => {
  try {
    console.log('Sending message to room:', roomId, 'with data:', messageData);
    const axiosInstance = createAuthAxios();
    const res = await axiosInstance.post(`/rooms/${roomId}/messages`, messageData);
    console.log('Message sent successfully:', res.data);
    return res.data;
  } catch (error) {
    console.error('Error sending message:', error);
    console.error('Error details:', error.response?.data);
    throw error;
  }
};

// Create a new chat room
export const createChatRoom = async (roomData) => {
  try {
    const axiosInstance = createAuthAxios();
    const res = await axiosInstance.post('/rooms', roomData);
    return res.data;
  } catch (error) {
    console.error('Error creating chat room:', error);
    throw error;
  }
};

// Join a chat room
export const joinChatRoom = async (roomId) => {
  try {
    const axiosInstance = createAuthAxios();
    const res = await axiosInstance.post(`/rooms/${roomId}/join`);
    return res.data;
  } catch (error) {
    console.error('Error joining chat room:', error);
    throw error;
  }
};

// Leave a chat room
export const leaveChatRoom = async (roomId) => {
  try {
    const axiosInstance = createAuthAxios();
    const res = await axiosInstance.post(`/rooms/${roomId}/leave`);
    return res.data;
  } catch (error) {
    console.error('Error leaving chat room:', error);
    throw error;
  }
};

// Mark messages as read
export const markMessagesAsRead = async (messageIds) => {
  try {
    const axiosInstance = createAuthAxios();
    const res = await axiosInstance.put('/messages/read', { messageIds });
    return res.data;
  } catch (error) {
    console.error('Error marking messages as read:', error);
    throw error;
  }
};

// Get unread message count
export const getUnreadCount = async () => {
  try {
    const axiosInstance = createAuthAxios();
    const res = await axiosInstance.get('/messages/unread-count');
    return res.data;
  } catch (error) {
    console.error('Error getting unread count:', error);
    throw error;
  }
};

// Delete a message
export const deleteMessage = async (messageId) => {
  try {
    const axiosInstance = createAuthAxios();
    const res = await axiosInstance.delete(`/messages/${messageId}`);
    return res.data;
  } catch (error) {
    console.error('Error deleting message:', error);
    throw error;
  }
}; 