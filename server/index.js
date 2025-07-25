const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const loanRoutes = require('./routes/loans');
const communityRoutes = require('./routes/community');
const adminRoutes = require('./routes/admin');
const notificationRoutes = require('./routes/notifications');
const paymentRoutes = require('./routes/payments');
const userRoutes = require('./routes/users');
const categoryRoutes = require('./routes/categories');
const reportRoutes = require('./routes/reports');
const chatRoutes = require('./routes/chat');
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  const userId = socket.handshake.query.userId;
  const token = socket.handshake.auth.token;
  
  if (userId) {
    socket.join(userId);
    console.log(`Socket ${socket.id} joined room ${userId}`);
  }

  // Join chat rooms
  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined chat room ${roomId}`);
  });

  // Leave chat room
  socket.on('leave_room', (roomId) => {
    socket.leave(roomId);
    console.log(`Socket ${socket.id} left chat room ${roomId}`);
  });

  // Typing indicator
  socket.on('typing_start', (data) => {
    socket.to(data.roomId).emit('user_typing', {
      userId: data.userId,
      userName: data.userName,
      roomId: data.roomId
    });
  });

  socket.on('typing_stop', (data) => {
    socket.to(data.roomId).emit('user_stop_typing', {
      userId: data.userId,
      roomId: data.roomId
    });
  });

  // Online status
  socket.on('user_online', (userId) => {
    socket.broadcast.emit('user_status_change', {
      userId,
      status: 'online'
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    // Emit offline status
    if (userId) {
      socket.broadcast.emit('user_status_change', {
        userId,
        status: 'offline'
      });
    }
  });
});

app.set('io', io); // Make io accessible in routes/services
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/microloan', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/loans/categories', categoryRoutes);
app.use('/api/reports', reportRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Microloan API is running.' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 