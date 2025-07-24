import React, { useState } from 'react';
import { LogOut, Bell, User, TrendingUp, FileText, CreditCard, Shield, Users, ClipboardList, Calendar, Settings, BarChart2, FilePlus, CheckCircle, AlertCircle } from 'lucide-react';
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
];

const Dashboard = ({ user, onLogout }) => {
  const [currentView, setCurrentView] = useState('main');
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  // Main dashboard content
  const renderOverview = () => (
    <div className="flex-1 p-6 md:p-10 bg-slate-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">Welcome, {user.name}!</h2>
          <div className="text-slate-500 text-sm md:text-base">Role: <span className="font-semibold text-slate-700 capitalize">{user.role}</span></div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={onLogout} className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-md font-medium shadow transition-colors">
            <LogOut className="w-5 h-5" /> Logout
          </button>
          <button onClick={() => setCurrentView('notifications')} className="relative p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs rounded-full px-1.5 py-0.5">3</span>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {stats.map((stat, i) => (
          <div key={i} className={`flex items-center gap-4 p-6 rounded-2xl shadow bg-white border border-slate-100 hover:shadow-lg transition-all ${stat.bg}`}>
            <span className={`p-3 rounded-full bg-white shadow ${stat.color} text-xl`}><stat.icon className="w-7 h-7" /></span>
            <div>
              <div className="text-2xl font-bold {stat.color}">{stat.value}</div>
              <div className="text-slate-600 text-sm font-medium">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl shadow p-6 border border-slate-100 mb-8">
        <h3 className="text-lg font-semibold text-slate-800 mb-2">Quick Tips</h3>
        <ul className="list-disc pl-5 text-slate-600 space-y-1 text-sm">
          <li>Use the sidebar to quickly access all dashboard features.</li>
          <li>Check your notifications for important updates.</li>
          <li>Keep your profile up to date for a better experience.</li>
        </ul>
      </div>
      <div className="bg-white rounded-2xl shadow p-6 border border-slate-100">
        <h3 className="text-lg font-semibold text-slate-800 mb-2">Get Started</h3>
        <div className="flex flex-wrap gap-4">
          {filteredNav.filter(item => item.key !== 'main').map(item => (
            <button
              key={item.key}
              onClick={() => setCurrentView(item.key)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-md font-medium shadow transition-colors"
            >
              <item.icon className="w-5 h-5" /> {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // Sidebar
  const Sidebar = () => (
    <aside className={`fixed md:static z-40 top-0 left-0 h-full w-64 bg-white border-r border-slate-100 shadow-lg md:shadow-none transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
        <span className="text-xl font-bold bg-gradient-to-r from-slate-800 to-gray-700 bg-clip-text text-transparent">MicroLoan</span>
        <button className="md:hidden text-slate-400 hover:text-slate-700" onClick={() => setSidebarOpen(false)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
      <nav className="mt-6 flex flex-col gap-1 px-4">
        {filteredNav.map(item => (
          <button
            key={item.key}
            onClick={() => { setCurrentView(item.key); setSidebarOpen(false); }}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium text-slate-700 hover:bg-slate-100 transition-colors ${currentView === item.key ? 'bg-slate-100 font-bold' : ''}`}
          >
            <item.icon className="w-5 h-5" /> {item.label}
          </button>
        ))}
      </nav>
      <div className="mt-auto px-4 py-6">
        <button onClick={onLogout} className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-md font-medium shadow transition-colors w-full">
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </div>
    </aside>
  );

  // Main layout
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar for desktop, drawer for mobile */}
      <Sidebar />
      {/* Mobile sidebar toggle */}
      <button className="fixed top-4 left-4 z-50 md:hidden bg-white border border-slate-200 p-2 rounded-full shadow-lg text-slate-700 hover:bg-slate-100" onClick={() => setSidebarOpen(true)}>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
      </button>
      {/* Main content */}
      <main className="flex-1">
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
            default: return renderOverview();
          }
        })()}
      </main>
    </div>
  );
};

export default Dashboard; 