import React, { useState, useEffect, useCallback } from 'react';
import { getAllTransactions } from '../../../../services/adminApi';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, limit: 10 });
  
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.currentPage,
        limit: pagination.limit,
        search,
        type: typeFilter,
        status: statusFilter,
        dateFrom,
        dateTo
      };
      const response = await getAllTransactions(params);
      if (response.success) {
        setTransactions(response.data.transactions);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
    }
  }, [pagination.currentPage, pagination.limit, search, typeFilter, statusFilter, dateFrom, dateTo]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchTransactions();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [fetchTransactions]);

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200 flex flex-col md:flex-row justify-between gap-4">
        <h2 className="text-xl font-bold text-slate-800">Transaction History</h2>
        
        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">🔍</span>
            <input
              type="text"
              placeholder="Search user..."
              className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 w-full sm:w-48 text-sm"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPagination(prev => ({ ...prev, currentPage: 1 }));
              }}
            />
          </div>
          
          <select 
            className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-sm"
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setPagination(prev => ({ ...prev, currentPage: 1 }));
            }}
          >
            <option value="">All Types</option>
            <option value="gym_booking">Gym Booking</option>
            <option value="trainer_booking">Trainer</option>
            <option value="food_order">Food</option>
            <option value="supplement">Supplement</option>
          </select>

          <select 
            className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-sm"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPagination(prev => ({ ...prev, currentPage: 1 }));
            }}
          >
            <option value="">All Status</option>
            <option value="success">Success</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>

          <div className="flex items-center space-x-2">
            <input 
              type="date" 
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-sm"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
            <span className="text-slate-500">to</span>
            <input 
              type="date" 
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-sm"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>
          
          <button 
            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm font-medium"
            onClick={fetchTransactions}
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-gray-200 text-slate-500 text-sm">
              <th className="p-4 font-semibold">Txn ID</th>
              <th className="p-4 font-semibold">User</th>
              <th className="p-4 font-semibold">Amount</th>
              <th className="p-4 font-semibold">Type</th>
              <th className="p-4 font-semibold">Date</th>
              <th className="p-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-slate-500">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                </td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-slate-500">No transactions found.</td>
              </tr>
            ) : (
              transactions.map(txn => (
                <tr key={txn.id} className="border-b border-gray-100 hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-sm font-mono text-slate-500">#{txn.id.substring(0, 8)}</td>
                  <td className="p-4">
                    <div className="font-medium text-slate-800">{txn.userName}</div>
                  </td>
                  <td className="p-4 font-bold text-slate-800">
                    ₹{txn.amount.toLocaleString()}
                  </td>
                  <td className="p-4">
                    <span className="text-sm capitalize px-2 py-1 bg-slate-100 rounded text-slate-700">
                      {txn.type.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-slate-600">
                    {new Date(txn.date).toLocaleString()}
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      txn.status === 'success' ? 'bg-emerald-100 text-emerald-700' : 
                      txn.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {txn.status.charAt(0).toUpperCase() + txn.status.slice(1)}
                    </span>
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
    </div>
  );
};

export default TransactionHistory;
