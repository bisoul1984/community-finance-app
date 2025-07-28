import React, { useState } from 'react';
import { LogOut, Bell, User, TrendingUp, FileText, CreditCard, Shield, Users, ClipboardList, Calendar, Settings, BarChart2, FilePlus, CheckCircle, AlertCircle, Search, Home, Wallet as WalletIcon, MessageCircle, HelpCircle } from 'lucide-react';
import CreateLoan from './CreateLoan';
import BrowseLoans from './BrowseLoans';
import LoanHistory from './LoanHistory';
import RepaymentTracker from './RepaymentTracker';
import CommunityVerification from './CommunityVerification';
import AdminPanel from './AdminPanel';
import Payments from './Payments';
import LoanCalculatorPage from './LoanCalculatorPage';
import DocumentUploadPage from './DocumentUploadPage';
import EnhancedDashboard from './EnhancedDashboard';
import NotificationPage from './NotificationPage';
import PaymentSchedulerPage from './PaymentSchedulerPage';
import UserProfilePage from './UserProfilePage';
import ReportingPage from './ReportingPage';
import ReturnsTracker from './ReturnsTracker';
import LenderNotifications from './LenderNotifications';
import Wallet from './Wallet';
import ChatSystem from '../components/ChatSystem';
import ChatWidget from '../components/ChatWidget';

const navItems = [
  { key: 'main', label: 'Overview', icon: BarChart2 },
  { key: 'create-loan', label: 'Request Loan', icon: FilePlus, roles: ['borrower'] },
  { key: 'repayment-tracker', label: 'Repayments', icon: CreditCard, roles: ['borrower'] },
  { key: 'loan-history', label: 'Loan History', icon: ClipboardList, roles: ['borrower'] },
  { key: 'community-verification', label: 'Community', icon: Users },
  { key: 'payments', label: 'Payments', icon: CreditCard },
  { key: 'loan-calculator', label: 'Calculator', icon: TrendingUp },
  { key: 'document-upload', label: 'Documents', icon: FileText },
  { key: 'enhanced-dashboard', label: 'Enhanced', icon: BarChart2 },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'payment-scheduler', label: 'Scheduler', icon: Calendar },
  { key: 'user-profile', label: 'Profile', icon: User },
  { key: 'admin-panel', label: 'Admin', icon: Shield, roles: ['admin'] },
  { key: 'reporting', label: 'Reporting', icon: FileText, roles: ['admin'] },
  { key: 'browse-loans', label: 'Browse Loans', icon: ClipboardList, roles: ['lender'] },
  { key: 'investment-history', label: 'Investments', icon: TrendingUp, roles: ['lender'] },
  { key: 'returns-tracker', label: 'Returns Tracker', icon: BarChart2, roles: ['lender'] },
  { key: 'lender-notifications', label: 'Notifications', icon: Bell, roles: ['lender'] },
  { key: 'wallet', label: 'Wallet', icon: BarChart2, roles: ['borrower', 'lender', 'admin'] },
  { key: 'chat', label: 'Community Chat', icon: MessageCircle, roles: ['borrower', 'lender', 'admin'] },
];

const Dashboard = ({ user, onLogout }) => {
  const [currentView, setCurrentView] = useState('main');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [navbarDropdownOpen, setNavbarDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Dummy stats for demonstration
  const stats = user.role === 'borrower' ? [
    { label: 'Active Loans', value: 0, icon: CreditCard, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Total Borrowed', value: '$0', icon: TrendingUp, color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: 'Reputation', value: user.reputation || 0, icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-50' },
  ] : user.role === 'lender' ? [
    { label: 'Active Investments', value: 0, icon: CreditCard, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Total Invested', value: '$0', icon: TrendingUp, color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: 'Returns Earned', value: '$0', icon: BarChart2, color: 'text-blue-600', bg: 'bg-blue-50' },
  ] : [
    { label: 'System Status', value: 'Active', icon: Shield, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Admin Access', value: 'Full', icon: User, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Security Level', value: 'High', icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  // Sidebar navigation items filtered by role
  const filteredNav = navItems.filter(item => !item.roles || item.roles.includes(user.role));

  // Quick actions based on user role
  const quickActions = user.role === 'borrower' ? [
    { label: 'Request Loan', icon: FilePlus, action: () => setCurrentView('create-loan') },
    { label: 'View Repayments', icon: CreditCard, action: () => setCurrentView('repayment-tracker') },
    { label: 'My Wallet', icon: WalletIcon, action: () => setCurrentView('wallet') },
  ] : user.role === 'lender' ? [
    { label: 'Browse Loans', icon: Search, action: () => setCurrentView('browse-loans') },
    { label: 'My Investments', icon: TrendingUp, action: () => setCurrentView('investment-history') },
    { label: 'My Wallet', icon: WalletIcon, action: () => setCurrentView('wallet') },
  ] : [
    { label: 'Admin Panel', icon: Shield, action: () => setCurrentView('admin-panel') },
    { label: 'Reports', icon: FileText, action: () => setCurrentView('reporting') },
    { label: 'User Management', icon: Users, action: () => setCurrentView('admin-panel') },
  ];

  // Top Navbar Component
  const TopNavbar = () => (
    <nav className="bg-white border-b border-slate-200 px-4 py-3 shadow-sm overflow-hidden">
      <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 max-w-full">
        {/* Left side - Logo and Search */}
        <div className="flex items-center space-x-4 w-full sm:w-auto">
          <div className="flex items-center space-x-2 flex-shrink-0">
            <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md font-medium shadow transition-colors text-sm sm:text-base">
              <span className="font-bold">ML</span>
            </div>
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-slate-800 to-gray-700 bg-clip-text text-transparent">
              MicroLoan
            </span>
          </div>
          
          {/* Search Bar */}
          <div className="hidden md:flex items-center space-x-2 bg-slate-100 rounded-lg px-3 py-2 w-64 flex-shrink-0">
            <Search className="w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search loans, users, or documents..."
              className="bg-transparent border-none outline-none text-sm text-slate-700 placeholder-slate-500 w-full"
            />
          </div>
        </div>

        {/* Right side - Notifications, Profile, etc. */}
        <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
          {/* Quick Actions Dropdown */}
          <div className="relative">
            <button
              onClick={() => setNavbarDropdownOpen(!navbarDropdownOpen)}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-md font-medium transition-colors text-sm sm:text-base"
            >
              <span className="hidden sm:block">Quick Actions</span>
              <span className="sm:hidden">Actions</span>
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {navbarDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 sm:w-56 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-50">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      action.action();
                      setNavbarDropdownOpen(false);
                    }}
                    className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <action.icon className="w-4 h-4" />
                    <span>{action.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-slate-200">
                  <h3 className="font-semibold text-slate-800">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {[
                    { title: 'Loan Approved', message: 'Your loan request has been approved', time: '2 min ago' },
                    { title: 'Payment Due', message: 'Payment reminder for loan #1234', time: '1 hour ago' },
                    { title: 'New Investment', message: 'Someone invested in your loan', time: '3 hours ago' },
                  ].map((notification, index) => (
                    <div key={index} className="px-4 py-3 hover:bg-slate-50 border-b border-slate-100 last:border-b-0">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-800">{notification.title}</p>
                          <p className="text-xs text-slate-600">{notification.message}</p>
                          <p className="text-xs text-slate-400 mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2 border-t border-slate-200">
                  <button
                    onClick={() => {
                      setCurrentView('notifications');
                      setNotificationsOpen(false);
                    }}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setCurrentView('user-profile')}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-md font-medium transition-colors text-sm sm:text-base"
            >
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-xs sm:text-sm">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </span>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-slate-800">{user.name}</p>
                <p className="text-xs text-slate-500 capitalize">{user.role}</p>
              </div>
            </button>
          </div>

          {/* Logout */}
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium shadow transition-colors text-sm sm:text-base"
          >
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Logout</span>
            <span className="sm:hidden">Exit</span>
          </button>
        </div>
      </div>
    </nav>
  );

  // Main dashboard content
  const renderOverview = () => (
    <div className="flex-1 p-4 sm:p-6 md:p-10 bg-slate-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 sm:mb-8 gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 mb-1">Welcome back, {user.name}!</h2>
          <div className="text-slate-500 text-sm md:text-base">Role: <span className="font-semibold text-slate-700 capitalize">{user.role}</span></div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setCurrentView('wallet')} className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium shadow transition-colors text-sm sm:text-base">
            <WalletIcon className="w-4 h-4 sm:w-5 sm:h-5" /> <span className="hidden sm:inline">My Wallet</span><span className="sm:hidden">Wallet</span>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
        {stats.map((stat, i) => (
          <div key={i} className={`flex items-center gap-3 sm:gap-4 p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow bg-white border border-slate-100 hover:shadow-lg transition-all ${stat.bg}`}
            title={stat.label}
            aria-label={stat.label}
            tabIndex={0}
          >
            <span className={`p-2 sm:p-3 rounded-full bg-white shadow ${stat.color} text-lg sm:text-xl`}><stat.icon className="w-5 h-5 sm:w-7 sm:h-7" /></span>
            <div>
              <div className="text-lg sm:text-xl md:text-2xl font-bold {stat.color}">{stat.value}</div>
              <div className="text-slate-600 text-xs sm:text-sm font-medium">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl sm:rounded-2xl shadow p-4 sm:p-6 border border-slate-100 mb-6 sm:mb-8">
        <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-2">Quick Tips</h3>
        <ul className="list-disc pl-4 sm:pl-5 text-slate-600 space-y-1 text-xs sm:text-sm">
          <li>Use the sidebar to quickly access all dashboard features.</li>
          <li>Check your notifications for important updates.</li>
          <li>Keep your profile up to date for a better experience.</li>
        </ul>
      </div>
      <div className="bg-white rounded-xl sm:rounded-2xl shadow p-4 sm:p-6 border border-slate-100">
        <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-2">Get Started</h3>
        <div className="flex flex-wrap gap-2 sm:gap-4">
          {filteredNav.filter(item => item.key !== 'main').map(item => (
            <button
              key={item.key}
              onClick={() => setCurrentView(item.key)}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-md font-medium shadow transition-colors text-xs sm:text-sm"
              title={item.label}
              aria-label={item.label}
            >
              <item.icon className="w-4 h-4 sm:w-5 sm:h-5" /> <span className="hidden sm:inline">{item.label}</span><span className="sm:hidden">{item.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // Sidebar
  const Sidebar = () => (
    <aside className={`fixed md:static z-40 top-0 left-0 h-full w-64 bg-white border-r border-slate-100 shadow-lg md:shadow-none transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-100">
        <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-slate-800 to-gray-700 bg-clip-text text-transparent">MicroLoan</span>
        <button className="md:hidden text-slate-400 hover:text-slate-700 p-1" onClick={() => setSidebarOpen(false)}>
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
      <nav className="mt-4 sm:mt-6 flex flex-col gap-1 px-3 sm:px-4" aria-label="Sidebar Navigation">
        {filteredNav.map(item => (
          <button
            key={item.key}
            onClick={() => { setCurrentView(item.key); setSidebarOpen(false); }}
            className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 rounded-lg font-medium text-slate-700 hover:bg-slate-100 transition-colors text-sm sm:text-base ${currentView === item.key ? 'bg-slate-100 font-bold' : ''}`}
            title={item.label}
            aria-label={item.label}
          >
            <item.icon className="w-4 h-4 sm:w-5 sm:h-5" /> <span className="hidden sm:inline">{item.label}</span><span className="sm:hidden">{item.label.split(' ')[0]}</span>
          </button>
        ))}
      </nav>
      <div className="mt-auto px-3 sm:px-4 py-4 sm:py-6">
        <button onClick={onLogout} className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-md font-medium shadow transition-colors w-full text-sm sm:text-base" title="Logout" aria-label="Logout">
          <LogOut className="w-4 h-4 sm:w-5 sm:h-5" /> <span className="hidden sm:inline">Logout</span><span className="sm:hidden">Exit</span>
        </button>
      </div>
    </aside>
  );

  // Main layout
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50" aria-busy="true" aria-live="polite">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4" role="status" aria-label="Loading"></div>
          <span className="text-slate-600 text-lg">Loading dashboard...</span>
        </div>
      </div>
    );
  }
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar for desktop, drawer for mobile */}
      <Sidebar />
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <TopNavbar />
        
        {/* Mobile sidebar toggle */}
        <button className="fixed top-4 left-4 z-50 md:hidden bg-white border border-slate-200 p-2 rounded-full shadow-lg text-slate-700 hover:bg-slate-100" onClick={() => setSidebarOpen(true)}>
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
        
        {/* Mobile overlay for sidebar */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" 
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Main content */}
        <main className="flex-1 overflow-x-hidden">
          {(() => {
            switch (currentView) {
              case 'main': return renderOverview();
              case 'create-loan': return <CreateLoan user={user} onLoanCreated={() => setCurrentView('main')} />;
              case 'repayment-tracker': return <RepaymentTracker user={user} />;
              case 'loan-history': return <LoanHistory user={user} />;
              case 'community-verification': return <CommunityVerification user={user} />;
              case 'payments': return <Payments user={user} />;
              case 'loan-calculator': return <LoanCalculatorPage />;
              case 'document-upload': return <DocumentUploadPage user={user} />;
                              case 'enhanced-dashboard': return <EnhancedDashboard user={user} />;
                case 'notifications': return <NotificationPage user={user} />;
                case 'payment-scheduler': return <PaymentSchedulerPage user={user} />;
                case 'user-profile': return <UserProfilePage user={user} />;
              case 'admin-panel': return <AdminPanel user={user} />;
              case 'reporting': return <ReportingPage />;
              case 'browse-loans': return <BrowseLoans user={user} />;
              case 'investment-history': return <LoanHistory user={user} />;
              case 'returns-tracker': return <ReturnsTracker user={user} />;
              case 'lender-notifications': return <LenderNotifications user={user} />;
              case 'wallet': return <Wallet user={user} />;
              case 'chat': return <ChatSystem user={user} />;
              default: return renderOverview();
            }
          })()}
        </main>
      </div>
      
      {/* Chat Widget */}
      <ChatWidget user={user} />
    </div>
  );
};

export default Dashboard; 