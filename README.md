# 🏦 Microloan & Community Finance Web Application

A full-stack web application for community-based microlending with reputation systems, repayment tracking, and admin management.

## 🌟 Features

### **Core Functionality**
- **User Authentication** - JWT-based authentication with role-based access
- **Loan Management** - Create, fund, and track loans
- **Repayment System** - Track payments with progress visualization
- **Community Verification** - Build trust through user verification
- **Admin Panel** - Complete system management and oversight

### **User Roles**
- **Borrowers** - Request loans and manage repayments
- **Lenders** - Fund loans and track investments
- **Admins** - System management and user oversight

### **Advanced Features**
- **Reputation System** - Community-driven trust scoring (0-100)
- **Real-time Tracking** - Live updates for loan status and payments
- **Responsive Design** - Modern UI/UX with mobile compatibility
- **Security** - JWT authentication with role-based permissions

## 🚀 Tech Stack

### **Frontend**
- **React.js** - User interface and state management
- **Axios** - HTTP client for API communication
- **JWT** - Authentication token management

### **Backend**
- **Node.js** - Server runtime
- **Express.js** - Web framework
- **MongoDB** - Database with Mongoose ODM
- **JWT** - Authentication middleware

### **Development**
- **CORS** - Cross-origin resource sharing
- **Dotenv** - Environment variable management

## 📋 Prerequisites

- **Node.js** (v14 or higher)
- **MongoDB** (local or cloud instance)
- **Git** (for version control)

## 🛠️ Installation

### **1. Clone the Repository**
```bash
git clone <your-github-repo-url>
cd Microloan
```

### **2. Install Dependencies**

#### **Backend Dependencies**
```bash
cd server
npm install
```

#### **Frontend Dependencies**
```bash
cd ../client
npm install
```

### **3. Environment Setup**

#### **Backend Environment (.env)**
Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/microloan
JWT_SECRET=your_jwt_secret_key_here
```

#### **Frontend Environment**
Create a `.env` file in the `client` directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### **4. Database Setup**
Ensure MongoDB is running on your system or update the `MONGO_URI` in your backend `.env` file.

## 🚀 Running the Application

### **Start Backend Server**
```bash
cd server
node index.js
```
The backend will run on `http://localhost:5000`

### **Start Frontend Server**
```bash
cd client
npm start
```
The frontend will run on `http://localhost:3000`

## 📱 Usage Guide

### **For Borrowers**
1. **Register/Login** with borrower role
2. **Request Loans** - Create loan requests with amount, purpose, and term
3. **Track Repayments** - Monitor loan status and make payments
4. **Build Reputation** - Participate in community verification

### **For Lenders**
1. **Register/Login** with lender role
2. **Browse Loans** - View available loan requests
3. **Fund Loans** - Invest in promising loan requests
4. **Track Investments** - Monitor funded loans and returns

### **For Admins**
1. **Register/Login** with admin role
2. **System Management** - Access admin panel
3. **User Management** - Monitor and manage user accounts
4. **Loan Oversight** - Track all loans and system statistics

## 🔧 API Endpoints

### **Authentication**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### **Loans**
- `GET /api/loans/requests` - Get pending loan requests
- `GET /api/loans/user/:userId` - Get user's loans
- `POST /api/loans/create` - Create new loan request
- `POST /api/loans/fund/:loanId` - Fund a loan
- `POST /api/loans/repay/:loanId` - Make loan repayment

### **Community**
- `GET /api/community/users-for-verification` - Get users for verification
- `POST /api/community/verify/:userId` - Submit user verification
- `GET /api/community/profile/:userId` - Get user profile

### **Admin**
- `GET /api/admin/users` - Get all users
- `GET /api/admin/loans` - Get all loans
- `PUT /api/admin/users/:userId/status` - Update user status
- `PUT /api/admin/loans/:loanId/status` - Update loan status
- `GET /api/admin/stats` - Get system statistics

## 📊 Database Schema

### **User Model**
```javascript
{
  name: String,
  email: String,
  password: String,
  role: ['borrower', 'lender', 'admin'],
  status: ['active', 'suspended', 'pending'],
  reputation: Number
}
```

### **Loan Model**
```javascript
{
  borrower: ObjectId,
  amount: Number,
  purpose: String,
  term: Number,
  status: String,
  fundedAmount: Number,
  totalRepaid: Number,
  lenders: Array,
  repayments: Array,
  startDate: Date,
  dueDate: Date
}
```

### **Verification Model**
```javascript
{
  verifier: ObjectId,
  verifiedUser: ObjectId,
  isVerified: Boolean,
  notes: String,
  date: Date
}
```

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Role-based Access Control** - Different permissions for different user types
- **Input Validation** - Server-side validation for all inputs
- **CORS Protection** - Cross-origin request security
- **Password Hashing** - Secure password storage

## 🎯 Key Features in Detail

### **Repayment Tracking**
- Visual progress bars showing repayment status
- Due date tracking with overdue alerts
- Payment history and recent transactions
- Real-time status updates

### **Community Verification**
- User verification platform for building trust
- Reputation scoring system (0-100 scale)
- Activity summaries for each user
- Verification notes and feedback system

### **Admin Panel**
- System overview with key statistics
- User management with status controls
- Loan management with status updates
- Real-time monitoring of all activities

## 🐛 Troubleshooting

### **Common Issues**

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check your `MONGO_URI` in `.env`

2. **Port Already in Use**
   - Change the port in your `.env` file
   - Kill existing processes using the port

3. **JWT Token Issues**
   - Check your `JWT_SECRET` in `.env`
   - Ensure tokens are being sent in headers

4. **CORS Errors**
   - Verify the frontend URL is allowed in backend CORS settings
   - Check API URL configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

## 🙏 Acknowledgments

- React.js community for the amazing framework
- MongoDB team for the robust database
- Express.js community for the web framework
- All contributors and testers

---

**⭐ Star this repository if you found it helpful!** 