const mongoose = require('mongoose');
const dotenv = require('dotenv');
const ChatRoom = require('./models/ChatRoom');
const User = require('./models/User');

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/microloan', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

const initializeChatRooms = async () => {
  try {
    // Get all active users
    const users = await User.find({ status: 'active' });
    
    if (users.length === 0) {
      console.log('No users found. Please create some users first.');
      return;
    }

    console.log(`Found ${users.length} users`);

    // Create default community chat room
    const communityRoom = new ChatRoom({
      name: 'Community General',
      description: 'General community discussions and announcements',
      type: 'community',
      participants: users.map(user => ({
        user: user._id,
        role: 'member',
        joinedAt: new Date(),
        lastSeen: new Date()
      })),
      admins: [users[0]._id], // First user as admin
      isPrivate: false,
      topic: 'General Community Discussion',
      rules: [
        'Be respectful to all members',
        'No spam or inappropriate content',
        'Stay on topic with community discussions'
      ],
      createdBy: users[0]._id
    });

    await communityRoom.save();
    console.log('Created Community General room');

    // Create loan discussion room
    const loanRoom = new ChatRoom({
      name: 'Loan Discussions',
      description: 'Discuss loan requests, funding, and repayment strategies',
      type: 'loan',
      participants: users.map(user => ({
        user: user._id,
        role: 'member',
        joinedAt: new Date(),
        lastSeen: new Date()
      })),
      admins: [users[0]._id],
      isPrivate: false,
      topic: 'Loan and Funding Discussions',
      rules: [
        'Share loan experiences and advice',
        'Discuss funding strategies',
        'Help each other with loan applications'
      ],
      createdBy: users[0]._id
    });

    await loanRoom.save();
    console.log('Created Loan Discussions room');

    // Create borrower support room
    const borrowerRoom = new ChatRoom({
      name: 'Borrower Support',
      description: 'Support and advice for borrowers',
      type: 'group',
      participants: users.filter(user => user.role === 'borrower').map(user => ({
        user: user._id,
        role: 'member',
        joinedAt: new Date(),
        lastSeen: new Date()
      })),
      admins: [users[0]._id],
      isPrivate: false,
      topic: 'Borrower Support and Advice',
      rules: [
        'Share borrowing experiences',
        'Ask for advice on loan applications',
        'Support fellow borrowers'
      ],
      createdBy: users[0]._id
    });

    await borrowerRoom.save();
    console.log('Created Borrower Support room');

    // Create lender network room
    const lenderRoom = new ChatRoom({
      name: 'Lender Network',
      description: 'Network and discuss investment opportunities',
      type: 'group',
      participants: users.filter(user => user.role === 'lender').map(user => ({
        user: user._id,
        role: 'member',
        joinedAt: new Date(),
        lastSeen: new Date()
      })),
      admins: [users[0]._id],
      isPrivate: false,
      topic: 'Lender Network and Investment',
      rules: [
        'Discuss investment strategies',
        'Share successful funding experiences',
        'Network with other lenders'
      ],
      createdBy: users[0]._id
    });

    await lenderRoom.save();
    console.log('Created Lender Network room');

    console.log('Chat rooms initialized successfully!');
    console.log('Created rooms:');
    console.log('- Community General');
    console.log('- Loan Discussions');
    console.log('- Borrower Support');
    console.log('- Lender Network');

  } catch (error) {
    console.error('Error initializing chat rooms:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the initialization
initializeChatRooms(); 