import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { getOrders } from '../../../../services/healthStoreOwnerApi';

const DietFoodPayments = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch store owner orders
      const res = await getOrders({ limit: 100 });
      const allOrders = res.data.data || [];
      
      // Filter orders that contain at least one Diet or Food item
      const dietOrders = allOrders.filter(order =>
        order.items?.some(item => item.productType === 'Diet' || item.productType === 'Food')
      );

      setTransactions(dietOrders);
    } catch (err) {
      toast.error('Failed to load transaction data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Filter based on search query and payment status filter
  const filteredTransactions = transactions.filter(tx => {
    const matchesStatus = statusFilter === 'All' || tx.paymentStatus === statusFilter;
    
    const customerName = (tx.address?.fullName || tx.customer?.name || '').toLowerCase();
    const customerMobile = (tx.address?.mobile || tx.customer?.phone || '').toLowerCase();
    const orderNum = (tx.orderNumber || '').toLowerCase();
    const rpPaymentId = (tx.razorpayPaymentId || '').toLowerCase();
    const query = searchQuery.toLowerCase();

    const matchesSearch = 
      customerName.includes(query) ||
      customerMobile.includes(query) ||
      orderNum.includes(query) ||
      rpPaymentId.includes(query);

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Filters and search header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Diet & Healthy Food Payment Ledgers</h2>
          <p className="text-slate-500 text-xs mt-0.5">Audit transaction history, payment verification IDs, and settlement accounts for diet plans.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* Status selector */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-red-400 bg-white"
          >
            <option value="All">All Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
            <option value="Refunded">Refunded</option>
          </select>
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="🔍 Search name, phone, Razorpay ID..."
            className="border border-slate-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-red-400 bg-white w-64"
          />
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-red-650 border-t-transparent rounded-full mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Loading transactions...</p>
        </div>
      ) : filteredTransactions.length === 0 ? (
        <div className="p-12 bg-white border border-slate-200 rounded-2xl text-center">
          <p className="text-3xl mb-2">💳</p>
          <p className="text-gray-500 font-semibold text-sm">No transaction records found.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="p-4">Date & Time</th>
                  <th className="p-4">Order / Payment ID</th>
                  <th className="p-4">Customer Details</th>
                  <th className="p-4">Purchased Product & Qty</th>
                  <th className="p-4">Payment Method</th>
                  <th className="p-4">Razorpay Payment ID</th>
                  <th className="p-4">Settled Account</th>
                  <th className="p-4 text-right">Amount</th>
                  <th className="p-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {filteredTransactions.map(tx => (
                  <tr key={tx._id} className="hover:bg-slate-50 transition-colors">
                    {/* Date & Time */}
                    <td className="p-4 whitespace-nowrap">
                      <div>{new Date(tx.createdAt).toLocaleDateString('en-IN')}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {new Date(tx.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    
                    {/* Order / Payment ID */}
                    <td className="p-4 font-bold text-slate-800 whitespace-nowrap">
                      {tx.orderNumber}
                    </td>

                    {/* Customer details */}
                    <td className="p-4">
                      <div className="font-bold text-slate-800">{tx.address?.fullName || tx.customer?.name || 'Walk-in'}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">📞 {tx.address?.mobile || tx.customer?.phone || 'N/A'}</div>
                      <div className="text-[9px] text-slate-400">✉️ {tx.address?.email || tx.customer?.email || 'N/A'}</div>
                    </td>

                    {/* Quantity & Product Name */}
                    <td className="p-4 max-w-[200px]">
                      <div className="space-y-1">
                        {tx.items?.map((item, idx) => (
                          <div key={idx} className="truncate">
                            <span className="bg-slate-100 text-slate-650 px-1 py-0.5 rounded text-[9px] mr-1 font-extrabold">{item.quantity}x</span>
                            <span>{item.name}</span>
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Payment Mode */}
                    <td className="p-4 whitespace-nowrap">
                      <span className="font-semibold text-slate-800">
                        {tx.razorpayPaymentId ? 'Online (Razorpay)' : 'Cash on Delivery (COD)'}
                      </span>
                    </td>

                    {/* Razorpay Payment ID */}
                    <td className="p-4 font-mono text-[10px] text-slate-600 break-all max-w-[120px]">
                      {tx.razorpayPaymentId || 'N/A'}
                    </td>

                    {/* Paid from Account */}
                    <td className="p-4 whitespace-nowrap">
                      {tx.razorpayPaymentId ? (
                        <div className="text-slate-800">
                          {tx.address?.fullName || tx.customer?.name || 'Customer'}'s A/C (**{tx.razorpayPaymentId.slice(-4)})
                        </div>
                      ) : (
                        <div className="text-slate-400 italic">No account linking</div>
                      )}
                    </td>

                    {/* Amount */}
                    <td className="p-4 text-right font-extrabold text-slate-900 whitespace-nowrap">
                      ₹{tx.total}
                    </td>

                    {/* Payment Status */}
                    <td className="p-4 text-center whitespace-nowrap">
                      <span className={`inline-block font-extrabold text-[10px] px-2.5 py-0.5 rounded-full border ${
                        tx.paymentStatus === 'Paid' ? 'bg-green-50 text-green-700 border-green-200' : 
                        tx.paymentStatus === 'Pending' ? 'bg-yellow-50 text-yellow-800 border-yellow-250' : 
                        'bg-red-50 text-red-755 border-red-200'
                      }`}>
                        {tx.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default DietFoodPayments;
