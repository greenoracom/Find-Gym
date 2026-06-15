import React, { useState, useEffect } from 'react';
import { getPendingPayouts, processPayout } from '../../../../services/adminApi';

const PayoutManagement = () => {
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchPayouts();
  }, []);

  const fetchPayouts = async () => {
    try {
      setLoading(true);
      const response = await getPendingPayouts();
      if (response.success) {
        setPayouts(response.data.payouts);
      }
    } catch (error) {
      console.error('Failed to fetch payouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessPayout = async (payoutId) => {
    if (!window.confirm('Are you sure you want to process this payout? This action will mark it as complete.')) return;
    
    try {
      setProcessingId(payoutId);
      const data = { processedDate: new Date().toISOString() };
      const response = await processPayout(payoutId, data);
      
      if (response.success) {
        // Remove from list or update status
        setPayouts(prev => prev.filter(p => p.id !== payoutId));
      } else {
        alert(response.message || 'Failed to process payout');
      }
    } catch (error) {
      console.error('Failed to process payout:', error);
      alert('An error occurred while processing the payout.');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 mt-8">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">Pending Payouts</h2>
        <span className="bg-orange-100 text-orange-800 py-1 px-3 rounded-full text-sm font-bold">
          {payouts.length} Pending
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-gray-200 text-slate-500 text-sm">
              <th className="p-4 font-semibold">Payout ID</th>
              <th className="p-4 font-semibold">Recipient (Gym)</th>
              <th className="p-4 font-semibold">Amount</th>
              <th className="p-4 font-semibold">Due Date</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-slate-500">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                </td>
              </tr>
            ) : payouts.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-slate-500">No pending payouts at this time.</td>
              </tr>
            ) : (
              payouts.map(payout => (
                <tr key={payout.id} className="border-b border-gray-100 hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-sm font-mono text-slate-500">#{payout.id.substring(0, 8)}</td>
                  <td className="p-4 font-medium text-slate-800">{payout.gymName}</td>
                  <td className="p-4 font-bold text-slate-800 text-lg">₹{payout.amount.toLocaleString()}</td>
                  <td className="p-4 text-slate-600">{new Date(payout.dueDate).toLocaleDateString()}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleProcessPayout(payout.id)}
                      disabled={processingId === payout.id}
                      className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors text-sm font-medium disabled:opacity-50 flex items-center justify-end ml-auto"
                    >
                      {processingId === payout.id && (
                        <span className="mr-2 animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                      )}
                      Process Payout
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PayoutManagement;
