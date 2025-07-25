import React, { useState, useEffect } from 'react';

const PaymentScheduler = ({ user, loans }) => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
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

  // Mock data for schedules
  const mockSchedules = [
    {
      _id: '1',
      loanId: 'loan1',
      amount: 500,
      frequency: 'monthly',
      startDate: '2025-07-25',
      nextPaymentDate: '2025-08-25',
      isActive: true,
      paymentMethod: 'bank_transfer',
      autoPay: true
    },
    {
      _id: '2',
      loanId: 'loan2',
      amount: 300,
      frequency: 'weekly',
      startDate: '2025-07-20',
      nextPaymentDate: '2025-07-27',
      isActive: false,
      paymentMethod: 'credit_card',
      autoPay: false
    }
  ];

  useEffect(() => {
    // Load mock schedules
    setSchedules(mockSchedules);
  }, []);

  const createPaymentSchedule = async () => {
    if (!newSchedule.loanId || !newSchedule.amount || !newSchedule.startDate) {
      setMessage('Please fill in all required fields');
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newScheduleData = {
        _id: Date.now().toString(),
        ...newSchedule,
        amount: parseFloat(newSchedule.amount),
        nextPaymentDate: newSchedule.startDate,
        isActive: true
      };

      setSchedules([...schedules, newScheduleData]);
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
      setLoading(false);
    }, 1000);
  };

  const deletePaymentSchedule = async (scheduleId) => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setSchedules(schedules.filter(schedule => schedule._id !== scheduleId));
      setMessage('Payment schedule deleted successfully!');
      setLoading(false);
    }, 500);
  };

  const toggleScheduleStatus = async (scheduleId, isActive) => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setSchedules(schedules.map(schedule => 
        schedule._id === scheduleId 
          ? { ...schedule, isActive: !isActive }
          : schedule
      ));
      setMessage(`Schedule ${!isActive ? 'activated' : 'deactivated'} successfully!`);
      setLoading(false);
    }, 500);
  };

  const getFrequencyLabel = (frequency) => {
    const labels = {
      weekly: 'Weekly',
      biweekly: 'Bi-weekly',
      monthly: 'Monthly',
      quarterly: 'Quarterly'
    };
    return labels[frequency] || frequency;
  };

  const getLoanById = (loanId) => {
    return loans?.find(loan => loan._id === loanId) || { amount: 'Unknown' };
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Scheduler</h1>
        <p className="text-gray-600">Create and manage recurring payment schedules for your loans</p>
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
                        ${schedule.amount} - {getFrequencyLabel(schedule.frequency)}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => toggleScheduleStatus(schedule._id, schedule.isActive)}
                        className={`px-3 py-1 text-xs rounded-md ${
                          schedule.isActive 
                            ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {schedule.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => deletePaymentSchedule(schedule._id)}
                        className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Start Date:</span> {new Date(schedule.startDate).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="font-medium">Next Payment:</span> {new Date(schedule.nextPaymentDate).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="font-medium">Method:</span> {schedule.paymentMethod.replace('_', ' ')}
                    </div>
                    <div>
                      <span className="font-medium">Auto Pay:</span> {schedule.autoPay ? 'Yes' : 'No'}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentScheduler; 