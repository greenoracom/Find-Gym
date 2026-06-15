import React, { useState, useEffect, useCallback } from 'react';
import { getPendingGyms } from '../../../../services/adminApi';
import GymDetails from './GymDetails';
import ApproveRejectModal from './ApproveRejectModal';

const PendingGyms = () => {
  const [gyms, setGyms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, limit: 10 });
  
  const [selectedGym, setSelectedGym] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [modalInfo, setModalInfo] = useState({ isOpen: false, item: null, action: 'approve' });

  const fetchPendingGyms = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.currentPage,
        limit: pagination.limit
      };
      const response = await getPendingGyms(params);
      if (response.success) {
        setGyms(response.data.gyms);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch pending gyms:', error);
    } finally {
      setLoading(false);
    }
  }, [pagination.currentPage, pagination.limit]);

  useEffect(() => {
    fetchPendingGyms();
  }, [fetchPendingGyms]);

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };

  const openDetails = (gym) => {
    setSelectedGym(gym);
    setIsDetailsModalOpen(true);
  };

  const openActionModal = (gym, action) => {
    setModalInfo({ isOpen: true, item: gym, action });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-orange-200 mt-6 overflow-hidden">
      <div className="p-4 bg-orange-50 border-b border-orange-200 flex justify-between items-center">
        <h3 className="text-lg font-bold text-orange-800 flex items-center">
          <span className="mr-2">⏳</span> Pending Gym Approvals
        </h3>
        <span className="bg-orange-200 text-orange-800 py-1 px-3 rounded-full text-xs font-bold">
          {pagination.totalCount || 0}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white border-b border-gray-100 text-slate-500 text-sm">
              <th className="p-4 font-semibold">Gym Name</th>
              <th className="p-4 font-semibold">City</th>
              <th className="p-4 font-semibold">Owner</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="p-6 text-center text-slate-500">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
                </td>
              </tr>
            ) : gyms.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-6 text-center text-slate-500">No pending gym approvals.</td>
              </tr>
            ) : (
              gyms.map(gym => (
                <tr key={gym.id} className="border-b border-gray-50 hover:bg-orange-50/50 transition-colors">
                  <td className="p-4 font-medium text-slate-800">{gym.name}</td>
                  <td className="p-4 text-slate-600">{gym.city}</td>
                  <td className="p-4 text-slate-600">{gym.ownerName}</td>
                  <td className="p-4 text-right space-x-2">
                    <button 
                      onClick={() => openDetails(gym)}
                      className="px-3 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors text-sm"
                    >
                      View Details
                    </button>
                    <button 
                      onClick={() => openActionModal(gym, 'approve')}
                      className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded hover:bg-emerald-100 transition-colors text-sm"
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => openActionModal(gym, 'reject')}
                      className="px-3 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors text-sm"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!loading && pagination.totalPages > 1 && (
        <div className="p-3 bg-white flex justify-center space-x-2">
           <button 
              disabled={pagination.currentPage === 1}
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              className="px-3 py-1 bg-slate-100 rounded disabled:opacity-50 text-sm text-slate-600"
            >
              Prev
            </button>
            <button 
              disabled={pagination.currentPage === pagination.totalPages}
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              className="px-3 py-1 bg-slate-100 rounded disabled:opacity-50 text-sm text-slate-600"
            >
              Next
            </button>
        </div>
      )}

      {isDetailsModalOpen && (
        <GymDetails 
          gymId={selectedGym?.id} 
          onClose={() => setIsDetailsModalOpen(false)} 
        />
      )}

      {modalInfo.isOpen && (
        <ApproveRejectModal 
          item={modalInfo.item}
          type="gym"
          action={modalInfo.action}
          onClose={() => setModalInfo({ isOpen: false, item: null, action: 'approve' })}
          onSuccess={fetchPendingGyms}
        />
      )}
    </div>
  );
};

export default PendingGyms;
