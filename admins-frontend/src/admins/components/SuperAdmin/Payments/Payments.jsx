import React, { useState, useEffect } from 'react';
import { CreditCard, TrendingUp, Wallet } from 'lucide-react';
import Table from '../../common/Table';
import Badge from '../../common/Badge';
import Button from '../../common/Button';
import { getTransactionHistory, getPendingPayouts, getRevenueReports } from '../../../../services/superApi';

const Payments = () => {
  const [activeTab, setActiveTab] = useState('transactions');
  const [transactions, setTransactions] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await getTransactionHistory();
      if (res.data && res.data.success && res.data.data) {
        setTransactions(res.data.data.transactions || []);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch transactions.');
    } finally {
      setLoading(false);
    }
  };

  const fetchPayouts = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await getPendingPayouts();
      if (res.data && res.data.success && res.data.data) {
        setPayouts(res.data.data.payouts || []);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch payouts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'transactions') {
      fetchTransactions();
    } else if (activeTab === 'payouts') {
      fetchPayouts();
    }
  }, [activeTab]);

  const columns = [
    { title: 'Transaction ID', key: 'id' },
    { title: 'User / Gym', key: 'userName' },
    { 
      title: 'Amount', 
      key: 'amount',
      render: (row) => `₹${row.amount?.toLocaleString()}`
    },
    { 
      title: 'Type', 
      key: 'type',
      render: (row) => <Badge label={row.type} variant="info" className="bg-purple-100 text-purple-800" />
    },
    { title: 'Method', key: 'paymentMethod' },
    { 
      title: 'Status', 
      key: 'status',
      render: (row) => {
        const statusClean = row.status?.toLowerCase();
        const label = row.status;
        const variants = { 'success': 'success', 'pending': 'warning', 'failed': 'danger' };
        return <Badge label={label} variant={variants[statusClean] || 'warning'} />;
      }
    },
    { 
      title: 'Date', 
      key: 'date',
      render: (row) => row.date ? new Date(row.date).toLocaleString() : 'N/A'
    },
    { 
      title: 'Actions', 
      key: 'actions',
      render: (row) => (
        <div className="flex gap-2">
           <Button variant="secondary" size="sm">View</Button>
           {row.status === 'success' && <Button variant="secondary" size="sm" className="text-red-500">Refund</Button>}
        </div>
      )
    },
  ];

  const payoutColumns = [
    { title: 'Payout ID', key: 'id' },
    { title: 'Gym ID', key: 'gymId' },
    { title: 'Gym Name', key: 'gymName' },
    { 
      title: 'Amount', 
      key: 'amount',
      render: (row) => `₹${row.amount?.toLocaleString()}`
    },
    { 
      title: 'Due Date', 
      key: 'dueDate',
      render: (row) => row.dueDate ? new Date(row.dueDate).toLocaleDateString() : 'N/A'
    },
    { 
      title: 'Status', 
      key: 'status',
      render: (row) => <Badge label={row.status} variant="warning" />
    }
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments & Revenue</h1>
          <p className="text-sm text-gray-500">Manage transactions, payouts, and view financial reports</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6 border border-red-200 text-sm">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="flex border-b border-gray-200">
          <button 
            className={`flex-1 py-4 px-6 text-sm font-medium flex items-center justify-center gap-2 transition-colors
              ${activeTab === 'transactions' ? 'bg-orange-50 text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
            onClick={() => setActiveTab('transactions')}
          >
            <CreditCard size={18} /> Transaction History
          </button>
          <button 
            className={`flex-1 py-4 px-6 text-sm font-medium flex items-center justify-center gap-2 transition-colors
              ${activeTab === 'reports' ? 'bg-orange-50 text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
            onClick={() => setActiveTab('reports')}
          >
            <TrendingUp size={18} /> Revenue Reports
          </button>
          <button 
            className={`flex-1 py-4 px-6 text-sm font-medium flex items-center justify-center gap-2 transition-colors
              ${activeTab === 'payouts' ? 'bg-orange-50 text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
            onClick={() => setActiveTab('payouts')}
          >
            <Wallet size={18} /> Payout Management
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-500">
            <div className="w-8 h-8 border-4 border-t-orange-500 border-gray-200 rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-sm">Loading data...</p>
          </div>
        ) : (
          <>
            {activeTab === 'transactions' && (
              <div className="p-0">
                 {transactions.length === 0 ? (
                   <div className="p-12 text-center text-gray-500">No transactions found.</div>
                 ) : (
                   <Table data={transactions} columns={columns} />
                 )}
              </div>
            )}

            {activeTab === 'reports' && (
              <div className="p-8 text-center text-gray-500">
                Revenue Reports Charts (To be implemented with Chart.js)
              </div>
            )}

            {activeTab === 'payouts' && (
              <div className="p-0">
                 {payouts.length === 0 ? (
                   <div className="p-12 text-center text-gray-500">No pending payouts found.</div>
                 ) : (
                   <Table data={payouts} columns={payoutColumns} />
                 )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Payments;
