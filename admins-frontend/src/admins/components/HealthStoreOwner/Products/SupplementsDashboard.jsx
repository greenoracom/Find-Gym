import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getProducts } from '../../../../services/healthStoreOwnerApi';

const SupplementsDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    live: 0,
    pending: 0,
    draft: 0,
    rejected: 0,
    lowStock: 0,
  });
  const [recentItems, setRecentItems] = useState([]);

  useEffect(() => {
    const fetchSupplementStats = async () => {
      setLoading(true);
      try {
        const res = await getProducts({ type: 'Supplement', limit: 100 });
        const allSupplements = res.data.data || [];
        
        const computedStats = allSupplements.reduce(
          (acc, item) => {
            acc.total += 1;
            if (item.approvalStatus === 'Live') acc.live += 1;
            else if (item.approvalStatus === 'Pending Approval') acc.pending += 1;
            else if (item.approvalStatus === 'Draft') acc.draft += 1;
            else if (item.approvalStatus === 'Rejected') acc.rejected += 1;

            if (item.stock <= (item.lowStockAlert || 5)) {
              acc.lowStock += 1;
            }
            return acc;
          },
          { total: 0, live: 0, pending: 0, draft: 0, rejected: 0, lowStock: 0 }
        );

        setStats(computedStats);
        setRecentItems(allSupplements.slice(0, 3));
      } catch (err) {
        toast.error('Failed to load supplements statistics');
      } finally {
        setLoading(false);
      }
    };
    fetchSupplementStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <div className="animate-spin w-8 h-8 border-4 border-red-650 border-t-transparent rounded-full mb-3" />
        <p className="text-gray-500 text-sm">Loading statistics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-gradient-to-br from-slate-900 to-slate-850 text-white rounded-2xl p-5 shadow-sm border border-slate-800">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Supplements</p>
          <p className="text-3xl font-extrabold mt-2">{stats.total}</p>
          <span className="text-[10px] text-red-400 font-semibold mt-2 inline-block">Registered listings</span>
        </div>

        <div className="bg-white border rounded-2xl p-5 shadow-sm">
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Live & Active</p>
          <p className="text-3xl font-extrabold text-green-600 mt-2">{stats.live}</p>
          <span className="text-[10px] text-green-700 bg-green-50 px-2 py-0.5 rounded-full mt-2 inline-block font-bold">On Storefront</span>
        </div>

        <div className="bg-white border rounded-2xl p-5 shadow-sm">
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Pending Approvals</p>
          <p className="text-3xl font-extrabold text-orange-500 mt-2">{stats.pending}</p>
          <span className="text-[10px] text-orange-700 bg-orange-50 px-2 py-0.5 rounded-full mt-2 inline-block font-bold">Under review</span>
        </div>

        <div className="bg-white border rounded-2xl p-5 shadow-sm">
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Low Stock Alerts</p>
          <p className={`text-3xl font-extrabold mt-2 ${stats.lowStock > 0 ? 'text-red-650' : 'text-gray-800'}`}>{stats.lowStock}</p>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mt-2 inline-block ${stats.lowStock > 0 ? 'bg-red-50 text-red-700' : 'bg-slate-50 text-slate-500'}`}>
            {stats.lowStock > 0 ? 'Action required' : 'Stock levels healthy'}
          </span>
        </div>
      </div>

      {stats.lowStock > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚠️</span>
            <div>
              <p className="text-sm font-semibold text-red-800">Low Stock Alert!</p>
              <p className="text-xs text-red-600">Some of your premium supplements are running below their alert thresholds.</p>
            </div>
          </div>
          <button onClick={() => navigate('/health-store-owner/supplements/list')} className="bg-red-600 hover:bg-red-750 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors shadow-sm">
            Manage Listings
          </button>
        </div>
      )}

      {/* Quick insights & Recent updates */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-850 text-base">Recently Added Supplements</h3>
            <button onClick={() => navigate('/health-store-owner/supplements/list')} className="text-xs font-bold text-red-600 hover:text-red-750">
              View All Listings &rarr;
            </button>
          </div>

          {recentItems.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">No supplements added yet.</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentItems.map(item => (
                <div key={item._id} className="py-4 flex justify-between items-center gap-4">
                  <div className="flex items-center gap-3">
                    {item.images?.[0] ? (
                      <img src={item.images[0]} alt="" className="w-12 h-12 rounded-lg object-cover border" />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center text-red-650 text-xl font-bold border">
                        💊
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-gray-800 text-sm">{item.name}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{item.brand} • {item.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800 text-sm">₹{item.sellingPrice || item.oneTimePrice}</p>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                      item.approvalStatus === 'Live' ? 'bg-green-50 text-green-700 border-green-200' :
                      item.approvalStatus === 'Pending Approval' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                      'bg-slate-50 text-slate-500 border-slate-200'
                    }`}>
                      {item.approvalStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-gray-850 text-base">Quick Shortcuts</h3>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/health-store-owner/supplements/add')}
              className="w-full flex items-center justify-between bg-slate-50 hover:bg-slate-100 p-3 rounded-xl border transition-all text-left"
            >
              <div>
                <p className="font-bold text-gray-800 text-xs">💊 Add New Supplement</p>
                <p className="text-[9px] text-gray-400 mt-0.5">List proteins, creatine, or vitamins</p>
              </div>
              <span className="text-slate-400 font-bold">&rarr;</span>
            </button>

            <button
              onClick={() => navigate('/health-store-owner/supplements/list')}
              className="w-full flex items-center justify-between bg-slate-50 hover:bg-slate-100 p-3 rounded-xl border transition-all text-left"
            >
              <div>
                <p className="font-bold text-gray-800 text-xs">📋 View Supplement List</p>
                <p className="text-[9px] text-gray-400 mt-0.5">Edit status, prices, and stock levels</p>
              </div>
              <span className="text-slate-400 font-bold">&rarr;</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplementsDashboard;
