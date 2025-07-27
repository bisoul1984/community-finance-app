import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { 
  MessageCircle, 
  Send, 
  Users, 
  Plus, 
  Search, 
  MoreVertical, 
  Phone, 
  Video, 
  Paperclip,
  Smile,
  X,
  Edit3,
  Trash2,
  Reply
} from 'lucide-react';
import { 
  getChatRooms, 
  getRoomMessages, 
  sendMessage, 
  createChatRoom,
  joinChatRoom,
  leaveChatRoom,
  markMessagesAsRead,
  getUnreadCount,
  deleteMessage
} from '../api/chat';

const ChatSystem = ({ user }) => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState(null);
  const [typingUsers, setTypingUsers] = useState([]);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [replyTo, setReplyTo] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    initializeSocket();
    fetchChatRooms();
    fetchUnreadCounts();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [user]);

  useEffect(() => {
    if (selectedRoom) {
      fetchMessages(selectedRoom._id);
      joinRoomSocket(selectedRoom._id);
    }
  }, [selectedRoom]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeSocket = () => {
    const socketUrl = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';
    const newSocket = io(socketUrl, {
      auth: { token: localStorage.getItem('token') },
      query: { userId: user._id || user.id }
    });

    newSocket.on('new_message', (message) => {
      setMessages(prev => [...prev, message]);
      updateUnreadCount(message.receiver === (user._id || user.id) ? 1 : 0);
    });

    newSocket.on('user_typing', (data) => {
      if (data.roomId === selectedRoom?._id) {
        setTypingUsers(prev => [...prev.filter(u => u.userId !== data.userId), data]);
      }
    });

    newSocket.on('user_stop_typing', (data) => {
      if (data.roomId === selectedRoom?._id) {
        setTypingUsers(prev => prev.filter(u => u.userId !== data.userId));
      }
    });

    setSocket(newSocket);
  };

  const joinRoomSocket = (roomId) => {
    if (socket) {
      socket.emit('join_room', roomId);
    }
  };

  const fetchChatRooms = async () => {
    try {
      setLoading(true);
      const data = await getChatRooms();
      setRooms(data);
    } catch (error) {
      console.error('Error fetching chat rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (roomId) => {
    try {
      setLoading(true);
      const data = await getRoomMessages(roomId);
      setMessages(data);
      
      // Mark messages as read
      const unreadMessages = data.filter(msg => !msg.read && msg.sender._id !== (user._id || user.id));
      if (unreadMessages.length > 0) {
        await markMessagesAsRead(unreadMessages.map(msg => msg._id));
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCounts = async () => {
    try {
      const data = await getUnreadCount();
      setUnreadCounts(prev => ({ ...prev, total: data.count }));
    } catch (error) {
      console.error('Error fetching unread counts:', error);
    }
  };

  const updateUnreadCount = (increment) => {
    setUnreadCounts(prev => ({
      ...prev,
      total: (prev.total || 0) + increment
    }));
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedRoom) return;

    try {
      const messageData = {
        content: newMessage,
        messageType: 'text',
        replyTo: replyTo?._id
      };

      await sendMessage(selectedRoom._id, messageData);
      setNewMessage('');
      setReplyTo(null);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleTyping = () => {
    if (socket && selectedRoom) {
      socket.emit('typing_start', {
        userId: user._id || user.id,
        userName: user.name,
        roomId: selectedRoom._id
      });

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('typing_stop', {
          userId: user._id || user.id,
          roomId: selectedRoom._id
        });
      }, 1000);
    }
  };

  const handleCreateRoom = async (roomData) => {
    try {
      const newRoom = await createChatRoom(roomData);
      setRooms(prev => [newRoom, ...prev]);
      setShowCreateRoom(false);
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };

  const handleJoinRoom = async (roomId) => {
    try {
      await joinChatRoom(roomId);
      fetchChatRooms(); // Refresh rooms list
    } catch (error) {
      console.error('Error joining room:', error);
    }
  };

  const handleLeaveRoom = async (roomId) => {
    try {
      await leaveChatRoom(roomId);
      if (selectedRoom?._id === roomId) {
        setSelectedRoom(null);
        setMessages([]);
      }
      fetchChatRooms(); // Refresh rooms list
    } catch (error) {
      console.error('Error leaving room:', error);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await deleteMessage(messageId);
      setMessages(prev => prev.filter(msg => msg._id !== messageId));
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const filteredRooms = rooms.filter(room =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoomDisplayName = (room) => {
    if (room.type === 'direct') {
      const otherParticipant = room.participants.find(p => p.user._id !== (user._id || user.id));
      return otherParticipant?.user.name || 'Unknown User';
    }
    return room.name;
  };

  const getRoomLastMessage = (room) => {
    if (!room.lastMessage) return 'No messages yet';
    return room.lastMessage.content.length > 50 
      ? room.lastMessage.content.substring(0, 50) + '...'
      : room.lastMessage.content;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
            <button
              onClick={() => setShowCreateRoom(true)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
            >
              <Plus size={20} />
            </button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Rooms List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-500">Loading...</div>
          ) : filteredRooms.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No conversations found</div>
          ) : (
            filteredRooms.map((room) => (
              <div
                key={room._id}
                onClick={() => setSelectedRoom(room)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                  selectedRoom?._id === room._id ? 'bg-blue-50 border-blue-200' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {getRoomDisplayName(room)}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {room.lastActivity ? new Date(room.lastActivity).toLocaleDateString() : ''}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 truncate mt-1">
                      {getRoomLastMessage(room)}
                    </p>
                  </div>
                  {unreadCounts[room._id] > 0 && (
                    <span className="ml-2 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCounts[room._id]}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedRoom ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {getRoomDisplayName(selectedRoom).charAt(0).toUpperCase()}
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {getRoomDisplayName(selectedRoom)}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {selectedRoom.type === 'direct' ? 'Direct Message' : `${selectedRoom.participants.length} members`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
                    <Phone size={20} />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
                    <Video size={20} />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
                    <MoreVertical size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {loading ? (
                <div className="text-center text-gray-500">Loading messages...</div>
              ) : messages.length === 0 ? (
                <div className="text-center text-gray-500">No messages yet. Start the conversation!</div>
              ) : (
                messages.map((message) => (
                                     <div
                     key={message._id}
                     className={`flex ${message.sender._id === (user._id || user.id) ? 'justify-end' : 'justify-start'}`}
                   >
                                         <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                       message.sender._id === (user._id || user.id)
                         ? 'bg-blue-500 text-white' 
                         : 'bg-gray-200 text-gray-900'
                     }`}>
                      {replyTo && message._id === replyTo._id && (
                        <div className="text-xs opacity-75 mb-1">
                          Replying to: {replyTo.content.substring(0, 30)}...
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {message.sender.name}
                        </span>
                        <span className="text-xs opacity-75 ml-2">
                          {new Date(message.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm mt-1">{message.content}</p>
                                             {message.sender._id === (user._id || user.id) && (
                        <div className="flex items-center space-x-2 mt-2">
                          <button
                            onClick={() => setReplyTo(message)}
                            className="text-xs opacity-75 hover:opacity-100"
                          >
                            <Reply size={12} />
                          </button>
                          <button
                            onClick={() => setEditingMessage(message)}
                            className="text-xs opacity-75 hover:opacity-100"
                          >
                            <Edit3 size={12} />
                          </button>
                          <button
                            onClick={() => handleDeleteMessage(message._id)}
                            className="text-xs opacity-75 hover:opacity-100"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
              
              {/* Typing indicator */}
              {typingUsers.length > 0 && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 text-gray-900 px-4 py-2 rounded-lg">
                    <p className="text-sm italic">
                      {typingUsers.map(u => u.userName).join(', ')} typing...
                    </p>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              {replyTo && (
                <div className="bg-gray-100 p-2 rounded-lg mb-2 flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Replying to: {replyTo.content.substring(0, 50)}...
                  </span>
                  <button
                    onClick={() => setReplyTo(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
              
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
                  <Paperclip size={20} />
                </button>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => {
                      setNewMessage(e.target.value);
                      handleTyping();
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Type a message..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
                  <Smile size={20} />
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle size={48} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
              <p className="text-gray-500">Choose a conversation from the sidebar to start messaging</p>
            </div>
          </div>
        )}
      </div>

      {/* Create Room Modal */}
      {showCreateRoom && (
        <CreateRoomModal
          onClose={() => setShowCreateRoom(false)}
          onCreate={handleCreateRoom}
          user={user}
        />
      )}
    </div>
  );
};

// Create Room Modal Component
const CreateRoomModal = ({ onClose, onCreate, user }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'group',
    isPrivate: false,
    topic: '',
    rules: []
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Create New Room</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Room Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="3"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Room Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="group">Group</option>
              <option value="community">Community</option>
              <option value="loan">Loan Discussion</option>
            </select>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPrivate"
              checked={formData.isPrivate}
              onChange={(e) => setFormData({ ...formData, isPrivate: e.target.checked })}
              className="mr-2"
            />
            <label htmlFor="isPrivate" className="text-sm text-gray-700">
              Private Room
            </label>
          </div>
          
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Create Room
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatSystem; 