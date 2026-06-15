import React, { useState, useEffect, useCallback } from 'react';
import { getAllUsers } from '../../../../services/adminApi';
import UserDetails from './UserDetails';
import BlockUserModal from './BlockUserModal';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, limit: 10 });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [blockModalInfo, setBlockModalInfo] = useState({ isOpen: false, user: null, action: 'block' });

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.currentPage,
        limit: pagination.limit,
        search,
        status: statusFilter
      };
      const response = await getAllUsers(params);
      if (response.success) {
        setUsers(response.data.users);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  }, [pagination.currentPage, pagination.limit, search, statusFilter]);

  useEffect(() => {
    // Debounce search
    const delayDebounceFn = setTimeout(() => {
      fetchUsers();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [fetchUsers]);

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };

  const openDetails = (user) => {
    setSelectedUser(user);
    setIsDetailsModalOpen(true);
  };

  const openBlockModal = (user, action) => {
    setBlockModalInfo({ isOpen: true, user, action });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-slate-800">Users Management</h2>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search users..."
              className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 w-full sm:w-64"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPagination(prev => ({ ...prev, currentPage: 1 })); // reset to page 1
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
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>
          
          <button 
            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
            onClick={fetchUsers}
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-gray-200 text-slate-500 text-sm">
              <th className="p-4 font-semibold">User Info</th>
              <th className="p-4 font-semibold">Contact</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">Joined Date</th>
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
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-slate-500">No users found.</td>
              </tr>
            ) : (
              users.map(user => (
                <tr key={user.id} className="border-b border-gray-100 hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-slate-800">{user.name}</div>
                    <div className="text-xs text-slate-500">ID: {user.id.substring(0, 8)}...</div>
                  </td>
                  <td className="p-4">
                    <div className="text-slate-700">{user.email}</div>
                    <div className="text-sm text-slate-500">{user.phone || 'N/A'}</div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </td>
                  <td className="p-4 text-slate-600">
                    {new Date(user.joinDate).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button 
                      onClick={() => openDetails(user)}
                      className="px-3 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors text-sm"
                    >
                      View
                    </button>
                    {user.status === 'active' ? (
                      <button 
                        onClick={() => openBlockModal(user, 'block')}
                        className="px-3 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors text-sm"
                      >
                        Block
                      </button>
                    ) : (
                      <button 
                        onClick={() => openBlockModal(user, 'unblock')}
                        className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded hover:bg-emerald-100 transition-colors text-sm"
                      >
                        Unblock
                      </button>
                    )}
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
        <UserDetails 
          userId={selectedUser?.id} 
          onClose={() => setIsDetailsModalOpen(false)} 
        />
      )}

      {blockModalInfo.isOpen && (
        <BlockUserModal 
          user={blockModalInfo.user} 
          action={blockModalInfo.action}
          onClose={() => setBlockModalInfo({ isOpen: false, user: null, action: 'block' })} 
          onSuccess={fetchUsers}
        />
      )}
    </div>
  );
};

export default UsersList;
