import React, { useState } from 'react';
import { approveGym, rejectGym, approveTrainer, rejectTrainer } from '../../../../services/adminApi';

const ApproveRejectModal = ({ item, type, action, onClose, onSuccess }) => {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isRejecting = action === 'reject';
  const isGym = type === 'gym';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isRejecting && !reason.trim()) {
      setError('Please provide a reason for rejection.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      let response;
      if (isGym) {
        response = isRejecting ? await rejectGym(item.id, reason) : await approveGym(item.id);
      } else {
        response = isRejecting ? await rejectTrainer(item.id, reason) : await approveTrainer(item.id);
      }

      if (response.success) {
        onSuccess();
        onClose();
      } else {
        setError(response.message || 'Action failed');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!item) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in">
        <div className={`p-4 border-b ${isRejecting ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100'}`}>
          <h2 className={`text-lg font-bold ${isRejecting ? 'text-red-700' : 'text-emerald-700'}`}>
            {isRejecting ? 'Reject' : 'Approve'} {isGym ? 'Gym' : 'Trainer'}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <p className="text-slate-700 mb-4">
            Are you sure you want to {isRejecting ? 'reject' : 'approve'} <span className="font-bold">{item.name}</span>?
          </p>
          
          {isRejecting && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Reason for Rejection <span className="text-red-500">*</span>
              </label>
              <textarea
                className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
                rows="3"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter reason..."
              ></textarea>
            </div>
          )}

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors disabled:opacity-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 text-white rounded-lg transition-colors flex items-center ${
                isRejecting 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-emerald-600 hover:bg-emerald-700'
              } disabled:opacity-50`}
              disabled={loading}
            >
              {loading && <span className="mr-2 animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>}
              {isRejecting ? 'Confirm Reject' : 'Confirm Approve'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApproveRejectModal;
