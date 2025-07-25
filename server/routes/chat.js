const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Message = require('../models/Message');
const ChatRoom = require('../models/ChatRoom');
const User = require('../models/User');

// Get user's chat rooms
router.get('/rooms', auth, async (req, res) => {
  try {
    const rooms = await ChatRoom.find({
      'participants.user': req.user.id,
      isActive: true
    })
    .populate('participants.user', 'name email reputation')
    .populate('lastMessage', 'content createdAt sender')
    .populate('lastMessage.sender', 'name')
    .sort({ lastActivity: -1 });

    res.json(rooms);
  } catch (error) {
    console.error('Error fetching chat rooms:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get messages for a specific room
router.get('/rooms/:roomId/messages', auth, async (req, res) => {
  try {
    const { roomId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    // Check if user is participant in the room
    const room = await ChatRoom.findOne({
      _id: roomId,
      'participants.user': req.user.id,
      isActive: true
    });

    if (!room) {
      return res.status(404).json({ message: 'Chat room not found' });
    }

    // Get messages
    const messages = await Message.find({
      $or: [
        { sender: req.user.id, receiver: { $in: room.participants.map(p => p.user) } },
        { receiver: req.user.id, sender: { $in: room.participants.map(p => p.user) } }
      ],
      deleted: false
    })
    .populate('sender', 'name email reputation')
    .populate('receiver', 'name email')
    .populate('replyTo', 'content sender')
    .populate('replyTo.sender', 'name')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

    // Mark messages as read
    await Message.updateMany(
      {
        receiver: req.user.id,
        sender: { $in: room.participants.map(p => p.user) },
        read: false
      },
      {
        read: true,
        readAt: new Date()
      }
    );

    res.json(messages.reverse());
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Send a message
router.post('/rooms/:roomId/messages', auth, async (req, res) => {
  try {
    const { roomId } = req.params;
    const { content, messageType = 'text', replyTo, attachments } = req.body;

    console.log('Sending message:', { roomId, content, sender: req.user.id });

    // Check if user is participant in the room
    const room = await ChatRoom.findOne({
      _id: roomId,
      'participants.user': req.user.id,
      isActive: true
    });

    if (!room) {
      console.log('Room not found or user not participant');
      return res.status(404).json({ message: 'Chat room not found' });
    }

    console.log('Room found:', room.name);

    // Create message
    const message = new Message({
      sender: req.user.id,
      receiver: room.participants.find(p => p.user.toString() !== req.user.id)?.user,
      content,
      messageType,
      replyTo,
      attachments
    });

    await message.save();
    console.log('Message saved:', message._id);

    // Update room's last message and activity
    await ChatRoom.findByIdAndUpdate(roomId, {
      lastMessage: message._id,
      lastActivity: new Date()
    });

    // Populate message for response
    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name email reputation')
      .populate('receiver', 'name email')
      .populate('replyTo', 'content sender')
      .populate('replyTo.sender', 'name');

    // Emit to all participants
    const io = req.app.get('io');
    if (io) {
      room.participants.forEach(participant => {
        console.log('Emitting to participant:', participant.user.toString());
        io.to(participant.user.toString()).emit('new_message', populatedMessage);
      });
    } else {
      console.log('Socket.io not available');
    }

    console.log('Message sent successfully');
    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new chat room
router.post('/rooms', auth, async (req, res) => {
  try {
    const { name, description, type, participants, isPrivate, topic, rules } = req.body;

    // Validate participants
    if (participants && participants.length > 0) {
      const validUsers = await User.find({
        _id: { $in: participants },
        status: 'active'
      });

      if (validUsers.length !== participants.length) {
        return res.status(400).json({ message: 'Some participants are invalid' });
      }
    }

    // Add creator to participants
    const allParticipants = [
      { user: req.user.id, role: 'admin' },
      ...(participants || []).map(p => ({ user: p, role: 'member' }))
    ];

    const room = new ChatRoom({
      name,
      description,
      type,
      participants: allParticipants,
      admins: [req.user.id],
      isPrivate,
      topic,
      rules,
      createdBy: req.user.id
    });

    await room.save();

    const populatedRoom = await ChatRoom.findById(room._id)
      .populate('participants.user', 'name email reputation')
      .populate('createdBy', 'name email');

    res.status(201).json(populatedRoom);
  } catch (error) {
    console.error('Error creating chat room:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Join a chat room
router.post('/rooms/:roomId/join', auth, async (req, res) => {
  try {
    const { roomId } = req.params;

    const room = await ChatRoom.findById(roomId);
    if (!room || !room.isActive) {
      return res.status(404).json({ message: 'Chat room not found' });
    }

    if (room.isPrivate) {
      return res.status(403).json({ message: 'Cannot join private room' });
    }

    // Check if user is already a participant
    const isParticipant = room.participants.some(p => p.user.toString() === req.user.id);
    if (isParticipant) {
      return res.status(400).json({ message: 'Already a participant' });
    }

    // Check if room is full
    if (room.participants.length >= room.maxParticipants) {
      return res.status(400).json({ message: 'Room is full' });
    }

    // Add user to participants
    room.participants.push({
      user: req.user.id,
      role: 'member',
      joinedAt: new Date(),
      lastSeen: new Date()
    });

    await room.save();

    const populatedRoom = await ChatRoom.findById(room._id)
      .populate('participants.user', 'name email reputation');

    res.json(populatedRoom);
  } catch (error) {
    console.error('Error joining chat room:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Leave a chat room
router.post('/rooms/:roomId/leave', auth, async (req, res) => {
  try {
    const { roomId } = req.params;

    const room = await ChatRoom.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Chat room not found' });
    }

    // Remove user from participants
    room.participants = room.participants.filter(p => p.user.toString() !== req.user.id);

    // If no participants left, deactivate room
    if (room.participants.length === 0) {
      room.isActive = false;
    }

    await room.save();

    res.json({ message: 'Left chat room successfully' });
  } catch (error) {
    console.error('Error leaving chat room:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark messages as read
router.put('/messages/read', auth, async (req, res) => {
  try {
    const { messageIds } = req.body;

    await Message.updateMany(
      {
        _id: { $in: messageIds },
        receiver: req.user.id,
        read: false
      },
      {
        read: true,
        readAt: new Date()
      }
    );

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get unread message count
router.get('/messages/unread-count', auth, async (req, res) => {
  try {
    const count = await Message.countDocuments({
      receiver: req.user.id,
      read: false,
      deleted: false
    });

    res.json({ count });
  } catch (error) {
    console.error('Error getting unread count:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a message
router.delete('/messages/:messageId', auth, async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Only sender can delete their own message
    if (message.sender.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Cannot delete this message' });
    }

    message.deleted = true;
    message.deletedAt = new Date();
    await message.save();

    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 