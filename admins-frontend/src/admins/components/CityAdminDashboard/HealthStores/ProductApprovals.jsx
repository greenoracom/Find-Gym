import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import {
  getProductsForApproval,
  approveProduct,
  rejectProduct
} from '../../../../services/cityAdminHealthStoreApi';

const TYPE_TABS = ['All', 'Diet', 'Supplement'];
const STATUS_TABS = ['Pending Approval', 'Live', 'Rejected'];

const ProductApprovals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeType, setActiveType] = useState('All');
  const [activeStatus, setActiveStatus] = useState('Pending Approval');
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });

  // Rejection modal state
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: 10,
        status: activeStatus,
        search
      };
      if (activeType !== 'All') params.type = activeType;

      const res = await getProductsForApproval(params);
      setProducts(res.data.data);
      setPagination(p => ({ ...p, ...res.data.pagination }));
    } catch (err) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [activeType, activeStatus, search, pagination.page]);

  useEffect(() => {
    fetchProducts();
  }, [activeType, activeStatus, search]);

  const handleApprove = async (product) => {
    if (!window.confirm(`Approve product "${product.name}" and make it live?`)) return;
    setActionLoading(true);
    try {
      await approveProduct(product._id);
      toast.success('Product approved & is now live!');
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Approval failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    if (!rejectReason.trim()) {
      toast.error('Please enter a rejection reason');
      return;
    }
    setActionLoading(true);
    try {
      await rejectProduct(selectedProduct._id, rejectReason);
      toast.success('Product rejected. Owner notified.');
      setShowRejectModal(false);
      setSelectedProduct(null);
      setRejectReason('');
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Rejection failed');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Product Approvals</h2>
        <p className="text-gray-500 text-sm mt-1">Review diet plans, health foods, and supplement listings submitted by health stores.</p>
      </div>

      {/* Tabs Filter */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between border-b pb-4">
        <div className="flex gap-2 flex-wrap">
          {STATUS_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => { setActiveStatus(tab); setPagination(p => ({ ...p, page: 1 })); }}
              className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-colors ${activeStatus === tab ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-600 border-gray-300 hover:border-orange-400'}`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex gap-2 flex-wrap">
          {TYPE_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => { setActiveType(tab); setPagination(p => ({ ...p, page: 1 })); }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${activeType === tab ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-gray-600 border-gray-200 hover:border-slate-400'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Search products by name..."
          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      {/* List */}
      {loading ? (
        <div className="p-12 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-3" />
          <p className="text-gray-500">Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="p-12 bg-white border rounded-2xl text-center">
          <p className="text-4xl mb-3">🍏</p>
          <p className="text-gray-500 font-medium">No products found in this tab</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {products.map(product => (
            <div key={product._id} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-start gap-4 mb-4">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-20 h-20 rounded-xl object-cover border" />
                  ) : (
                    <div className="w-20 h-20 rounded-xl bg-orange-50 border flex items-center justify-center text-orange-500 text-2xl font-bold">
                      {product.productType === 'Supplement' ? '💊' : '🥗'}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${product.productType === 'Supplement' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                        {product.productType}
                      </span>
                      <span className="text-xs text-gray-400">
                        {product.healthStore?.city}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-800 text-base mt-1 truncate">{product.name}</h3>
                    <p className="text-xs text-orange-600 font-semibold mt-0.5">Store: {product.healthStore?.storeName || 'N/A'}</p>
                    <div className="flex items-baseline gap-2 mt-1.5">
                      <span className="text-sm font-bold text-gray-800">₹{product.discountPrice || product.price}</span>
                      {product.discountPrice && (
                        <span className="text-xs text-gray-400 line-through">₹{product.price}</span>
                      )}
                      <span className="text-[11px] text-gray-500 ml-1">({product.purchaseMode})</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 border-t pt-3 pb-3 text-xs text-gray-600">
                  <p><span className="font-semibold text-gray-700">Stock Available:</span> {product.stock} units</p>
                  {product.brand && <p><span className="font-semibold text-gray-700">Brand:</span> {product.brand}</p>}
                  {product.description && (
                    <p className="line-clamp-2"><span className="font-semibold text-gray-700">Description:</span> {product.description}</p>
                  )}
                  {product.nutritionalInfo && (
                    <p className="line-clamp-2"><span className="font-semibold text-gray-700">Nutrients/Ingredients:</span> {product.nutritionalInfo}</p>
                  )}
                  {product.approvalStatus === 'Rejected' && product.rejectionReason && (
                    <div className="mt-2 p-2 bg-red-50 text-red-700 rounded-lg border border-red-100">
                      <span className="font-semibold">Rejection Reason:</span> {product.rejectionReason}
                    </div>
                  )}
                </div>
              </div>

              {activeStatus === 'Pending Approval' && (
                <div className="flex gap-3 border-t pt-4 mt-2">
                  <button
                    onClick={() => handleApprove(product)}
                    disabled={actionLoading}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold text-xs py-2 rounded-lg transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => { setSelectedProduct(product); setShowRejectModal(true); }}
                    disabled={actionLoading}
                    className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 font-semibold text-xs py-2 rounded-lg transition-colors border border-red-200"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Reject Reason Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95">
            <div>
              <h4 className="text-lg font-bold text-gray-800">Reject Product listing</h4>
              <p className="text-xs text-gray-500 mt-1">Specify why this product is being rejected. The store owner will be notified.</p>
            </div>
            <form onSubmit={handleRejectSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Rejection Reason *</label>
                <textarea
                  required
                  rows={3}
                  value={rejectReason}
                  onChange={e => setRejectReason(e.target.value)}
                  placeholder="e.g. Invalid image, incorrect pricing or branding information..."
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                />
              </div>
              <div className="flex justify-end gap-3 border-t pt-4">
                <button
                  type="button"
                  onClick={() => { setShowRejectModal(false); setRejectReason(''); setSelectedProduct(null); }}
                  className="px-4 py-2 border rounded-xl text-gray-600 font-semibold text-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm rounded-xl"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductApprovals;
