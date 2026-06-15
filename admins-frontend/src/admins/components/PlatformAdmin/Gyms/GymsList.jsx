import React, { useState, useEffect, useCallback } from 'react';
import { getAllGyms, suspendGym, reactivateGym, deleteGym } from '../../../../services/adminApi';
import GymDetails from './GymDetails';

const GymsList = () => {
  const [gyms, setGyms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, limit: 10 });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const [selectedGym, setSelectedGym] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const fetchGyms = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.currentPage,
        limit: pagination.limit,
        search,
        status: statusFilter
      };
      const response = await getAllGyms(params);
      if (response.success) {
        setGyms(response.data.gyms);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch gyms:', error);
    } finally {
      setLoading(false);
    }
  }, [pagination.currentPage, pagination.limit, search, statusFilter]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchGyms();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [fetchGyms]);

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };

  const openDetails = (gym) => {
    setSelectedGym(gym);
    setIsDetailsModalOpen(true);
  };

  const handleSuspend = async (gymId) => {
    if (window.confirm('Are you sure you want to suspend this gym?')) {
      try {
        const response = await suspendGym(gymId);
        if (response.success) fetchGyms();
      } catch (error) {
        console.error('Failed to suspend gym:', error);
      }
    }
  };

  const handleReactivate = async (gymId) => {
    if (window.confirm('Are you sure you want to reactivate this gym?')) {
      try {
        const response = await reactivateGym(gymId);
        if (response.success) fetchGyms();
      } catch (error) {
        console.error('Failed to reactivate gym:', error);
      }
    }
  };

  const handleDelete = async (gymId) => {
    if (window.confirm('Are you sure you want to permanently delete this gym? This action cannot be undone.')) {
      try {
        const response = await deleteGym(gymId);
        if (response.success) fetchGyms();
      } catch (error) {
        console.error('Failed to delete gym:', error);
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-slate-800">Gyms Management</h2>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">🔍</span>
            <input
              type="text"
              placeholder="Search gyms..."
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
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
            <option value="rejected">Rejected</option>
          </select>
          
          <button 
            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
            onClick={fetchGyms}
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-gray-200 text-slate-500 text-sm">
              <th className="p-4 font-semibold">Gym Details</th>
              <th className="p-4 font-semibold">Location</th>
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
            ) : gyms.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-slate-500">No gyms found.</td>
              </tr>
            ) : (
              gyms.map(gym => (
                <tr key={gym.id} className="border-b border-gray-100 hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-slate-800">{gym.name}</div>
                    <div className="text-sm text-slate-500">Owner: {gym.ownerName}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-slate-700">{gym.city}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-slate-700">{gym.membersCount} Members</div>
                    <div className="text-xs text-slate-500">₹{gym.monthlyRevenue?.toLocaleString() || 0}/mo</div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      gym.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 
                      gym.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                      gym.status === 'suspended' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {gym.status.charAt(0).toUpperCase() + gym.status.slice(1)}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button 
                      onClick={() => openDetails(gym)}
                      className="px-3 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors text-sm"
                    >
                      View
                    </button>
                    {gym.status === 'approved' && (
                      <button 
                        onClick={() => handleSuspend(gym.id)}
                        className="px-3 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors text-sm"
                      >
                        Suspend
                      </button>
                    )}
                    {gym.status === 'suspended' && (
                      <button 
                        onClick={() => handleReactivate(gym.id)}
                        className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded hover:bg-emerald-100 transition-colors text-sm"
                      >
                        Reactivate
                      </button>
                    )}
                    <button 
                      onClick={() => handleDelete(gym.id)}
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
        <GymDetails 
          gymId={selectedGym?.id} 
          onClose={() => setIsDetailsModalOpen(false)} 
        />
      )}
    </div>
  );
};

export default GymsList;
