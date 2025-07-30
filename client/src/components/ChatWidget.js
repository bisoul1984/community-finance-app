import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

const ChatWidget = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    const newMessage = {
      id: Date.now(),
      text: message,
      sender: user.name,
      timestamp: new Date().toLocaleTimeString()
    };
    
    setMessages(prev => [...prev, newMessage]);
    setMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-500 text-white p-2 sm:p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
        >
          <MessageCircle size={20} />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-xl border border-gray-200 w-72 sm:w-80 h-80 sm:h-96">
        {/* Header */}
        <div className="bg-blue-500 text-white p-2 sm:p-3 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center">
            <MessageCircle size={16} className="mr-2" />
            <span className="font-medium text-sm sm:text-base">Chat</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-blue-600 rounded"
          >
            <X size={14} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-2" style={{ height: '200px' }}>
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 text-xs sm:text-sm">
              No messages yet. Start the conversation!
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className="flex justify-end">
                <div className="bg-blue-500 text-white px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-xs sm:text-sm max-w-xs">
                  <div className="font-medium text-xs mb-1">{msg.sender}</div>
                  <div>{msg.text}</div>
                  <div className="text-xs opacity-75 mt-1">{msg.timestamp}</div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Message Input */}
        <div className="p-2 sm:p-3 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleSendMessage}
              disabled={!message.trim()}
              className="p-1 sm:p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWidget; 