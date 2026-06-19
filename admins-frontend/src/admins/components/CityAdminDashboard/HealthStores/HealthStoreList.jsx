import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getHealthStores, blockHealthStore } from '../../../../services/cityAdminHealthStoreApi';

const STATUS_TABS = ['All', 'Invited', 'Registration Submitted', 'Pending Verification', 'Active', 'Rejected', 'Blocked'];

const STATUS_COLORS = {
  Invited: 'bg-blue-100 text-blue-700',
  'Registration Submitted': 'bg-purple-100 text-purple-700',
  'Pending Verification': 'bg-yellow-100 text-yellow-700',
  'Changes Requested': 'bg-orange-100 text-orange-700',
  Approved: 'bg-teal-100 text-teal-700',
  'Password Pending': 'bg-indigo-100 text-indigo-700',
  Active: 'bg-green-100 text-green-700',
  Rejected: 'bg-red-100 text-red-700',
  Blocked: 'bg-gray-200 text-gray-700',
};

const HealthStoreList = () => {
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });

  const fetchStores = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page: pagination.page, limit: 10, search };
      if (activeTab !== 'All') params.status = activeTab;
      const res = await getHealthStores(params);
      setStores(res.data.data);
      setPagination(p => ({ ...p, ...res.data.pagination }));
    } catch (err) {
      toast.error('Failed to load health stores');
    } finally {
      setLoading(false);
    }
  }, [activeTab, search, pagination.page]);

  useEffect(() => { fetchStores(); }, [activeTab, search]);

  const handleBlock = async (store) => {
    if (!window.confirm(`${store.status === 'Blocked' ? 'Unblock' : 'Block'} "${store.storeName}"?`)) return;
    try {
      await blockHealthStore(store._id);
      toast.success('Status updated');
      fetchStores();
    } catch (err) {
      toast.error('Action failed');
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Health Stores</h2>
          <p className="text-gray-500 text-sm mt-1">{pagination.total} total stores</p>
        </div>
        <button onClick={() => navigate('/city-admin/health-stores/add')}
          className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 transition-colors">
          🏪 Invite Health Store
        </button>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 flex-wrap mb-5">
        {STATUS_TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-colors ${activeTab === tab ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-600 border-gray-300 hover:border-orange-400'}`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="mb-5">
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Search by store name, owner name or email..."
          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-3" />
            <p className="text-gray-500">Loading stores...</p>
          </div>
        ) : stores.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-4xl mb-3">🏪</p>
            <p className="text-gray-500 font-medium">No health stores found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Store', 'Owner', 'City', 'Type', 'Status', 'Date', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stores.map(store => (
                  <tr key={store._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {store.logo
                          ? <img src={store.logo} alt="" className="w-9 h-9 rounded-lg object-cover" />
                          : <div className="w-9 h-9 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-sm">{store.storeName[0]}</div>
                        }
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">{store.storeName}</p>
                          <p className="text-gray-400 text-xs">{store.storeType}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-700">{store.ownerName}</p>
                      <p className="text-xs text-gray-400">{store.ownerEmail}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{store.city}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">{store.storeType}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[store.status] || 'bg-gray-100 text-gray-600'}`}>
                        {store.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {new Date(store.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link to={`/city-admin/health-stores/${store._id}`}
                          className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg font-medium transition-colors">
                          View
                        </Link>
                        {store.status === 'Active' || store.status === 'Blocked' ? (
                          <button onClick={() => handleBlock(store)}
                            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${store.status === 'Blocked' ? 'bg-green-50 hover:bg-green-100 text-green-700' : 'bg-red-50 hover:bg-red-100 text-red-700'}`}>
                            {store.status === 'Blocked' ? 'Unblock' : 'Block'}
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthStoreList;
