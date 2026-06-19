import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getProducts, deleteProduct, submitForApproval } from '../../../../services/healthStoreOwnerApi';

const STATUS_TABS = ['All', 'Draft', 'Pending Approval', 'Live', 'Rejected'];

const STATUS_COLORS = {
  Draft: 'bg-gray-100 text-gray-700 border-gray-250',
  'Pending Approval': 'bg-orange-100 text-orange-700 border-orange-200',
  Live: 'bg-green-100 text-green-700 border-green-200',
  Rejected: 'bg-red-100 text-red-700 border-red-200',
};

const DietFoodList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState('All');
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: 10,
        type: 'Diet', // Gets Diet/Food items
        search
      };
      if (activeStatus !== 'All') params.status = activeStatus;
      const res = await getProducts(params);
      setProducts(res.data.data);
      setPagination(p => ({ ...p, ...res.data.pagination }));
    } catch (err) {
      toast.error('Failed to load diet list');
    } finally {
      setLoading(false);
    }
  }, [activeStatus, search, pagination.page]);

  useEffect(() => {
    fetchItems();
  }, [activeStatus, search]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await deleteProduct(id);
      toast.success('Product deleted successfully');
      fetchItems();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleSubmitApproval = async (id, name) => {
    if (!window.confirm(`Submit "${name}" for Admin verification?`)) return;
    try {
      await submitForApproval(id);
      toast.success('Submitted for approval!');
      fetchItems();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Diet Plans & Healthy Foods</h2>
          <p className="text-gray-500 text-sm mt-1">Manage nutrition tables, weight loss/gain diet packages, and healthy meals.</p>
        </div>
        <button onClick={() => navigate('/health-store-owner/diet-foods/add')}
          className="bg-red-600 hover:bg-red-750 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors shadow-md flex items-center gap-2">
          🥗 Add Diet/Food Listing
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap pb-2 border-b">
        {STATUS_TABS.map(tab => (
          <button key={tab} onClick={() => { setActiveStatus(tab); setPagination(p => ({ ...p, page: 1 })); }}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${activeStatus === tab ? 'bg-red-600 text-white border-red-600' : 'bg-white text-gray-600 border-gray-300 hover:border-red-400'}`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Search */}
      <div>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Search items by name..."
          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400" />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="p-12 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full mx-auto mb-3" />
          <p className="text-gray-500">Loading your items...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="p-12 bg-white border rounded-2xl text-center">
          <p className="text-4xl mb-3">🍏</p>
          <p className="text-gray-500 font-medium">No diet listings found. Create one now!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {products.map(item => (
            <div key={item._id} className="bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="flex gap-4">
                  {item.images?.[0] ? (
                    <img src={item.images[0]} alt="" className="w-16 h-16 rounded-xl object-cover border" />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-red-50 flex items-center justify-center text-red-500 text-2xl font-bold border border-red-100">
                      🥗
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border ${STATUS_COLORS[item.approvalStatus] || 'bg-gray-100'}`}>
                        {item.approvalStatus}
                      </span>
                      <span className="text-[10px] text-gray-400">{item.category}</span>
                    </div>
                    <h3 className="font-bold text-gray-800 text-base mt-1 truncate">{item.name}</h3>
                    <p className="text-xs text-gray-500 font-semibold mt-0.5">Price: ₹{item.sellingPrice || item.oneTimePrice} ({item.purchaseMode})</p>
                  </div>
                </div>

                {item.shortDescription && (
                  <p className="text-xs text-gray-500 mt-3 line-clamp-2">{item.shortDescription}</p>
                )}

                {item.approvalStatus === 'Rejected' && item.rejectionReason && (
                  <div className="mt-3 p-2 bg-red-50 text-red-700 text-xs rounded-lg border border-red-150">
                    <span className="font-bold">Reason:</span> {item.rejectionReason}
                  </div>
                )}
              </div>

              <div className="flex gap-2 border-t pt-4 mt-4">
                {['Draft', 'Rejected'].includes(item.approvalStatus) ? (
                  <>
                    <button onClick={() => handleSubmitApproval(item._id, item.name)}
                      className="flex-1 bg-red-650 bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-2 rounded-lg transition-colors shadow-sm">
                      🚀 Submit Live
                    </button>
                    <button onClick={() => navigate(`/health-store-owner/diet-foods/edit/${item._id}`)}
                      className="flex-1 bg-white hover:bg-slate-55 hover:bg-slate-50 text-slate-800 border font-bold text-xs py-2 rounded-lg transition-colors">
                      ✍️ Edit
                    </button>
                    <button onClick={() => handleDelete(item._id, item.name)}
                      className="text-red-650 hover:bg-red-50 border border-red-200 text-red-600 font-semibold text-xs px-3 py-2 rounded-lg transition-colors">
                      🗑️
                    </button>
                  </>
                ) : (
                  <p className="text-[11px] text-gray-400 italic">Listing cannot be modified while pending or live.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DietFoodList;
