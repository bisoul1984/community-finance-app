# Microloan & Community Finance Web Application

A full-stack web application that facilitates community-based microloans for individuals in low-income areas. The platform allows users to request, offer, and manage microloans in a transparent and collaborative way.

## 🎯 Features

### ✅ User Roles
- **Borrowers**: Request microloans, track repayment, view history
- **Lenders**: Fund loan requests, track returns, view borrower reputation
- **Admins/Moderators**: Oversee community health, resolve disputes, manage reports

### 💸 Loan System
- Create loan requests with amount, purpose, and repayment terms
- Community members can choose to partially or fully fund a loan
- Repayment schedules and automatic reminders
- Interest-free or low-interest options configurable per community

### 🔒 Transparency & Trust
- Borrower profile includes past loan history and repayment behavior
- Community-based verification of borrower credibility
- Public ledger of active and completed loans for transparency

### 📊 Dashboard & Tracking
- Visual dashboards for borrowers and lenders
- Upcoming repayments, outstanding balances, completed loans
- Admin insights into system-wide loan health

## 🧱 Tech Stack

### Frontend
- **React.js** - User interface and state management
- **Inline CSS** - Styling (Tailwind CSS ready)
- **Axios** - API requests
- **React Router** - Page navigation

### Backend
- **Node.js** - Server runtime
- **Express.js** - RESTful API framework
- **MongoDB** - Database with Mongoose ODM
- **JWT** - Authentication and authorization
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/bisoul1984/community-finance-app.git
   cd community-finance-app
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd server
   npm install
   
   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. **Environment Setup**
   
   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   JWT_SECRET=your_jwt_secret_here
   MONGO_URI=mongodb://localhost:27017/microloan
   ```

4. **Start the application**
   ```bash
   # Start backend server (from server directory)
   cd server
   node index.js
   
   # Start frontend (from client directory, in a new terminal)
   cd client
   npm start
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📁 Project Structure

```
community-finance-app/
├── client/                 # React frontend
│   ├── src/
│   │   ├── api/           # API utilities
│   │   ├── pages/         # React components
│   │   ├── App.js         # Main app component
│   │   └── index.js       # Entry point
│   └── package.json
├── server/                 # Node.js backend
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── index.js           # Server entry point
│   └── package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### Loans
- `GET /api/loans/requests` - Get all pending loan requests
- `GET /api/loans/user/:userId` - Get user's loans
- `POST /api/loans/create` - Create new loan request
- `POST /api/loans/fund/:loanId` - Fund a loan
- `POST /api/loans/repay/:loanId` - Make a repayment

## 🎮 Usage

### For Borrowers
1. Sign up as a "Borrower"
2. Log in to your dashboard
3. Click "Request New Loan"
4. Fill out loan details (amount, purpose, term)
5. Submit and wait for community funding

### For Lenders
1. Sign up as a "Lender"
2. Log in to your dashboard
3. Click "Browse Loan Requests"
4. View available loans and borrower details
5. Enter funding amount and click "Fund Loan"

## 🔮 Future Features

- [ ] Email/SMS notifications
- [ ] Admin panel for dispute resolution
- [ ] Community verification system
- [ ] Credit scoring algorithm
- [ ] PWA support for offline access
- [ ] Community forums
- [ ] Gamified rewards system

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Community-based lending inspiration
- Open source community contributions
- Financial inclusion initiatives

---

**Built with ❤️ for community empowerment and financial inclusion** 