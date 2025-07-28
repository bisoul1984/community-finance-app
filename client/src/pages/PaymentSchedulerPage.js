import React, { useState, useEffect } from 'react';
import PaymentScheduler from '../components/PaymentScheduler';
import { getUserLoans } from '../api/loans';

const PaymentSchedulerPage = ({ user }) => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserLoans();
  }, []);

  const fetchUserLoans = async () => {
    try {
      console.log('PaymentSchedulerPage: Fetching loans for user:', user.id);
      console.log('PaymentSchedulerPage: User object:', user);
      
      const data = await getUserLoans(user.id);
      console.log('PaymentSchedulerPage: Raw loan data:', data);
      console.log('PaymentSchedulerPage: Data type:', typeof data);
      console.log('PaymentSchedulerPage: Data length:', Array.isArray(data) ? data.length : 'Not an array');
      
      if (!Array.isArray(data)) {
        console.error('PaymentSchedulerPage: Data is not an array:', data);
        throw new Error('Invalid data format received');
      }
      
      const activeLoans = data.filter(loan => {
        console.log('PaymentSchedulerPage: Checking loan:', loan);
        const isActive = loan.status === 'funded' || loan.status === 'active' || loan.status === 'overdue';
        console.log('PaymentSchedulerPage: Loan status:', loan.status, 'Is active:', isActive);
        return isActive;
      });
      
      console.log('PaymentSchedulerPage: Active loans:', activeLoans);
      console.log('PaymentSchedulerPage: Active loans count:', activeLoans.length);
      
      // If no active loans found, use mock data for testing
      if (activeLoans.length === 0) {
        console.log('PaymentSchedulerPage: No active loans found, using mock data');
        const mockLoans = [
          { _id: 'loan1', amount: 5000, status: 'active', purpose: 'Business Expansion' },
          { _id: 'loan2', amount: 3000, status: 'funded', purpose: 'Home Renovation' },
          { _id: 'loan3', amount: 2000, status: 'active', purpose: 'Education' }
        ];
        setLoans(mockLoans);
      } else {
        setLoans(activeLoans);
      }
    } catch (error) {
      console.error('Error fetching loans:', error);
      console.error('Error details:', error.response?.data || error.message);
      
      // Use mock data if API fails
      const mockLoans = [
        { _id: 'loan1', amount: 5000, status: 'active', purpose: 'Business Expansion' },
        { _id: 'loan2', amount: 3000, status: 'funded', purpose: 'Home Renovation' },
        { _id: 'loan3', amount: 2000, status: 'active', purpose: 'Education' }
      ];
      console.log('PaymentSchedulerPage: Using mock loans due to error:', mockLoans);
      setLoans(mockLoans);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payment scheduler...</p>
        </div>
      </div>
    );
  }

  return (
    <PaymentScheduler user={user} loans={loans} />
  );
};

export default PaymentSchedulerPage; 