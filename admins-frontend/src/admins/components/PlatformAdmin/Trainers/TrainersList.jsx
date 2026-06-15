import React, { useState, useEffect, useCallback } from 'react';
import { getAllTrainers, blockTrainer, unblockTrainer, deleteTrainer } from '../../../../services/adminApi';
import TrainerDetails from './TrainerDetails';
import ApproveRejectModal from './ApproveRejectModal';

const TrainersList = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, limit: 10 });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [modalInfo, setModalInfo] = useState({ isOpen: false, item: null, action: 'approve' });

  const fetchTrainers = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.currentPage,
        limit: pagination.limit,
        search,
        status: statusFilter
      };
      const response = await getAllTrainers(params);
      if (response.success) {
        setTrainers(response.data.trainers);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch trainers:', error);
    } finally {
      setLoading(false);
    }
  }, [pagination.currentPage, pagination.limit, search, statusFilter]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchTrainers();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [fetchTrainers]);

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };

  const openDetails = (trainer) => {
    setSelectedTrainer(trainer);
    setIsDetailsModalOpen(true);
  };

  const openActionModal = (trainer, action) => {
    setModalInfo({ isOpen: true, item: trainer, action });
  };

  const handleBlockUnblock = async (trainerId, isBlocking) => {
    if (window.confirm(`Are you sure you want to ${isBlocking ? 'block' : 'unblock'} this trainer?`)) {
      try {
        const response = isBlocking ? await blockTrainer(trainerId) : await unblockTrainer(trainerId);
        if (response.success) fetchTrainers();
      } catch (error) {
        console.error('Action failed:', error);
      }
    }
  };

  const handleDelete = async (trainerId) => {
    if (window.confirm('Are you sure you want to permanently delete this trainer?')) {
      try {
        const response = await deleteTrainer(trainerId);
        if (response.success) fetchTrainers();
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-slate-800">Trainers Management</h2>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">🔍</span>
            <input
              type="text"
              placeholder="Search trainers..."
              className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 w-full sm:w-64"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPagination(prev => ({ ...prev, currentPage: 1 }));
              }}
            />
          </div>
          
          <select 
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPagination(prev => ({ ...prev, currentPage: 1 }));
            }}
          >
            <option value="all">All Status</option>
            <option value="verified">Verified</option>
            <option value="pending">Pending</option>
            <option value="blocked">Blocked</option>
          </select>
          
          <button 
            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
            onClick={fetchTrainers}
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-gray-200 text-slate-500 text-sm">
              <th className="p-4 font-semibold">Trainer</th>
              <th className="p-4 font-semibold">Specialization</th>
              <th className="p-4 font-semibold">Stats</th>
              <th className="p-4 font-semibold">Status</th>
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
            ) : trainers.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-slate-500">No trainers found.</td>
              </tr>
            ) : (
              trainers.map(trainer => (
                <tr key={trainer.id} className="border-b border-gray-100 hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-slate-800">{trainer.name}</div>
                    <div className="text-sm text-slate-500">{trainer.email}</div>
                  </td>
                  <td className="p-4 text-slate-700">
                    {trainer.specialization || 'Not specified'}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-500 text-xs">⭐</span>
                      <span className="text-slate-700 font-medium">{trainer.rating}</span>
                    </div>
                    <div className="text-xs text-slate-500">{trainer.clientCount} clients</div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      trainer.status === 'verified' ? 'bg-emerald-100 text-emerald-700' : 
                      trainer.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {trainer.status.charAt(0).toUpperCase() + trainer.status.slice(1)}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button 
                      onClick={() => openDetails(trainer)}
                      className="px-3 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors text-sm"
                    >
                      View
                    </button>
                    
                    {trainer.status === 'pending' && (
                      <>
                        <button 
                          onClick={() => openActionModal(trainer, 'approve')}
                          className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded hover:bg-emerald-100 transition-colors text-sm"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => openActionModal(trainer, 'reject')}
                          className="px-3 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors text-sm"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {trainer.status === 'verified' && (
                      <button 
                        onClick={() => handleBlockUnblock(trainer.id, true)}
                        className="px-3 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors text-sm"
                      >
                        Block
                      </button>
                    )}

                    {trainer.status === 'blocked' && (
                      <button 
                        onClick={() => handleBlockUnblock(trainer.id, false)}
                        className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded hover:bg-emerald-100 transition-colors text-sm"
                      >
                        Unblock
                      </button>
                    )}

                    <button 
                      onClick={() => handleDelete(trainer.id)}
                      className="px-3 py-1 bg-slate-100 text-slate-600 rounded hover:bg-slate-200 transition-colors text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!loading && pagination.totalPages > 1 && (
        <div className="p-4 border-t border-gray-200 flex justify-between items-center text-sm text-slate-600">
          <div>
            Showing {(pagination.currentPage - 1) * pagination.limit + 1} to {Math.min(pagination.currentPage * pagination.limit, pagination.totalCount)} of {pagination.totalCount} entries
          </div>
          <div className="flex space-x-1">
            <button 
              disabled={pagination.currentPage === 1}
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
            >
              Prev
            </button>
            <button 
              disabled={pagination.currentPage === pagination.totalPages}
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {isDetailsModalOpen && (
        <TrainerDetails 
          trainerId={selectedTrainer?.id} 
          onClose={() => setIsDetailsModalOpen(false)} 
        />
      )}

      {modalInfo.isOpen && (
        <ApproveRejectModal 
          item={modalInfo.item}
          type="trainer"
          action={modalInfo.action}
          onClose={() => setModalInfo({ isOpen: false, item: null, action: 'approve' })}
          onSuccess={fetchTrainers}
        />
      )}
    </div>
  );
};

export default TrainersList;
