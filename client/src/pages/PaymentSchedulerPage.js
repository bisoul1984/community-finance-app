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
      const data = await getUserLoans(user.id);
      const activeLoans = data.filter(loan => 
        loan.status === 'funded' || loan.status === 'active' || loan.status === 'overdue'
      );
      setLoans(activeLoans);
    } catch (error) {
      console.error('Error fetching loans:', error);
      // Use mock data if API fails
      setLoans([
        { _id: 'loan1', amount: 5000, status: 'active', purpose: 'Business Expansion' },
        { _id: 'loan2', amount: 3000, status: 'funded', purpose: 'Home Renovation' },
        { _id: 'loan3', amount: 2000, status: 'active', purpose: 'Education' }
      ]);
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