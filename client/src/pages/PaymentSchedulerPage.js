import React, { useState, useEffect } from 'react';
import PaymentScheduler from '../components/PaymentScheduler';

const PaymentSchedulerPage = ({ user }) => {
  const [loans, setLoans] = useState([]);

  useEffect(() => {
    fetchUserLoans();
  }, [user]);

  const fetchUserLoans = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/loans/user/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setLoans(data);
      }
    } catch (error) {
      console.error('Error fetching user loans:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PaymentScheduler user={user} loans={loans} />
    </div>
  );
};

export default PaymentSchedulerPage; 