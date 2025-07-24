import React, { useState, useEffect } from 'react';

const PaymentScheduler = ({ user, loans }) => {
  const [schedules, setSchedules] = useState([]);
  const [newSchedule, setNewSchedule] = useState({
    loanId: '',
    amount: '',
    frequency: 'monthly',
    startDate: '',
    endDate: '',
    reminderDays: 3,
    autoPay: false,
    paymentMethod: 'bank_transfer'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [editingSchedule, setEditingSchedule] = useState(null);

  useEffect(() => {
    fetchPaymentSchedules();
  }, [user]);

  const fetchPaymentSchedules = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/payments/schedules/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSchedules(data);
      }
    } catch (error) {
      console.error('Error fetching payment schedules:', error);
    }
  };

  const createPaymentSchedule = async () => {
    if (!newSchedule.loanId || !newSchedule.amount || !newSchedule.startDate) {
      setMessage('Please fill in all required fields');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/payments/schedules`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...newSchedule,
          userId: user.id
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setSchedules(prev => [...prev, data]);
        setNewSchedule({
          loanId: '',
          amount: '',
          frequency: 'monthly',
          startDate: '',
          endDate: '',
          reminderDays: 3,
          autoPay: false,
          paymentMethod: 'bank_transfer'
        });
        setMessage('Payment schedule created successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Failed to create payment schedule');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error creating payment schedule:', error);
      setMessage('Error creating schedule');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const updatePaymentSchedule = async (scheduleId, updatedSchedule) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/payments/schedules/${scheduleId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedSchedule)
      });
      
      if (response.ok) {
        setSchedules(prev => 
          prev.map(schedule => 
            schedule._id === scheduleId 
              ? { ...schedule, ...updatedSchedule }
              : schedule
          )
        );
        setEditingSchedule(null);
        setMessage('Payment schedule updated successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Failed to update payment schedule');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error updating payment schedule:', error);
      setMessage('Error updating schedule');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const deletePaymentSchedule = async (scheduleId) => {
    if (!window.confirm('Are you sure you want to delete this payment schedule?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/payments/schedules/${scheduleId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        setSchedules(prev => prev.filter(schedule => schedule._id !== scheduleId));
        setMessage('Payment schedule deleted successfully!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error deleting payment schedule:', error);
      setMessage('Error deleting schedule');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const toggleScheduleStatus = async (scheduleId, isActive) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/payments/schedules/${scheduleId}/toggle`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isActive: !isActive })
      });
      
      if (response.ok) {
        setSchedules(prev => 
          prev.map(schedule => 
            schedule._id === scheduleId 
              ? { ...schedule, isActive: !isActive }
              : schedule
          )
        );
      }
    } catch (error) {
      console.error('Error toggling schedule status:', error);
    }
  };

  const getFrequencyLabel = (frequency) => {
    switch (frequency) {
      case 'weekly': return 'Weekly';
      case 'biweekly': return 'Bi-weekly';
      case 'monthly': return 'Monthly';
      case 'quarterly': return 'Quarterly';
      default: return frequency;
    }
  };

  const getNextPaymentDate = (schedule) => {
    const startDate = new Date(schedule.startDate);
    const now = new Date();
    const frequencyDays = {
      weekly: 7,
      biweekly: 14,
      monthly: 30,
      quarterly: 90
    };
    
    let nextDate = new Date(startDate);
    while (nextDate <= now) {
      nextDate.setDate(nextDate.getDate() + frequencyDays[schedule.frequency]);
    }
    
    return nextDate.toLocaleDateString();
  };

  const getLoanById = (loanId) => {
    return loans?.find(loan => loan._id === loanId);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Scheduler</h1>
        <p className="text-gray-600">Set up automatic payment reminders and recurring payment schedules</p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.includes('successfully') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {message}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Create New Schedule */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Create Payment Schedule</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Loan
              </label>
              <select
                value={newSchedule.loanId}
                onChange={(e) => setNewSchedule(prev => ({ ...prev, loanId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose a loan</option>
                {loans?.map(loan => (
                  <option key={loan._id} value={loan._id}>
                    Loan #{loan._id.slice(-6)} - ${loan.amount}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Amount ($)
              </label>
              <input
                type="number"
                value={newSchedule.amount}
                onChange={(e) => setNewSchedule(prev => ({ ...prev, amount: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter payment amount"
                min="0"
                step="0.01"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Frequency
                </label>
                <select
                  value={newSchedule.frequency}
                  onChange={(e) => setNewSchedule(prev => ({ ...prev, frequency: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Bi-weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reminder Days
                </label>
                <input
                  type="number"
                  value={newSchedule.reminderDays}
                  onChange={(e) => setNewSchedule(prev => ({ ...prev, reminderDays: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                  max="14"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={newSchedule.startDate}
                  onChange={(e) => setNewSchedule(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date (Optional)
                </label>
                <input
                  type="date"
                  value={newSchedule.endDate}
                  onChange={(e) => setNewSchedule(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method
              </label>
              <select
                value={newSchedule.paymentMethod}
                onChange={(e) => setNewSchedule(prev => ({ ...prev, paymentMethod: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="bank_transfer">Bank Transfer</option>
                <option value="credit_card">Credit Card</option>
                <option value="debit_card">Debit Card</option>
                <option value="mobile_money">Mobile Money</option>
              </select>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="autoPay"
                checked={newSchedule.autoPay}
                onChange={(e) => setNewSchedule(prev => ({ ...prev, autoPay: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="autoPay" className="text-sm text-gray-700">
                Enable automatic payments
              </label>
            </div>

            <button
              onClick={createPaymentSchedule}
              disabled={loading}
              className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? 'Creating...' : 'Create Schedule'}
            </button>
          </div>
        </div>

        {/* Existing Schedules */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment Schedules</h2>
          
          <div className="space-y-4">
            {schedules.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">📅</div>
                <p>No payment schedules yet</p>
                <p className="text-sm">Create a schedule to get started</p>
              </div>
            ) : (
              schedules.map((schedule) => (
                <div
                  key={schedule._id}
                  className={`p-4 rounded-lg border ${
                    schedule.isActive ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className={`w-3 h-3 rounded-full ${
                        schedule.isActive ? 'bg-green-500' : 'bg-gray-400'
                      }`}></span>
                      <span className="font-medium text-gray-800">
                        {getLoanById(schedule.loanId)?.amount ? 
                          `Loan #${schedule.loanId.slice(-6)}` : 'Unknown Loan'
                        }
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => toggleScheduleStatus(schedule._id, schedule.isActive)}
                        className={`text-sm px-2 py-1 rounded ${
                          schedule.isActive 
                            ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {schedule.isActive ? 'Pause' : 'Resume'}
                      </button>
                      <button
                        onClick={() => setEditingSchedule(schedule)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deletePaymentSchedule(schedule._id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-medium ml-1">${schedule.amount}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Frequency:</span>
                      <span className="font-medium ml-1">{getFrequencyLabel(schedule.frequency)}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Next Payment:</span>
                      <span className="font-medium ml-1">{getNextPaymentDate(schedule)}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Auto Pay:</span>
                      <span className="font-medium ml-1">{schedule.autoPay ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Edit Schedule Modal */}
      {editingSchedule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Edit Payment Schedule</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Amount ($)
                </label>
                <input
                  type="number"
                  value={editingSchedule.amount}
                  onChange={(e) => setEditingSchedule(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Frequency
                </label>
                <select
                  value={editingSchedule.frequency}
                  onChange={(e) => setEditingSchedule(prev => ({ ...prev, frequency: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Bi-weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                </select>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="editAutoPay"
                  checked={editingSchedule.autoPay}
                  onChange={(e) => setEditingSchedule(prev => ({ ...prev, autoPay: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="editAutoPay" className="text-sm text-gray-700">
                  Enable automatic payments
                </label>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => updatePaymentSchedule(editingSchedule._id, editingSchedule)}
                  disabled={loading}
                  className={`flex-1 py-2 px-4 rounded-md text-white font-medium ${
                    loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={() => setEditingSchedule(null)}
                  className="flex-1 py-2 px-4 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentScheduler; 