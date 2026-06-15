import React, { useState, useEffect } from 'react';
import { getRevenueReports } from '../../../../services/adminApi';

const RevenueReports = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Default to current year
  const currentYear = new Date().getFullYear();
  const [dateFrom, setDateFrom] = useState(`${currentYear}-01-01`);
  const [dateTo, setDateTo] = useState(`${currentYear}-12-31`);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    if (!dateFrom || !dateTo) return;
    try {
      setLoading(true);
      const response = await getRevenueReports({ dateFrom, dateTo });
      if (response.success) {
        setData(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch revenue reports:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 mt-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-slate-800">Revenue Reports</h2>
        <div className="flex items-center space-x-3">
          <input 
            type="date" 
            className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
          <span className="text-slate-500">to</span>
          <input 
            type="date" 
            className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
          <button 
            onClick={fetchReports}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors font-medium text-sm"
          >
            Generate
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      ) : !data ? (
        <div className="flex justify-center items-center h-64 bg-white rounded-xl shadow-sm border border-gray-200 text-slate-500">
          Select dates and click generate.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
          {/* Total Revenue Card */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 shadow-md text-white md:col-span-1">
            <h3 className="text-orange-100 font-medium mb-2">Total Revenue</h3>
            <p className="text-4xl font-bold mb-4">₹{data.totalRevenue.toLocaleString()}</p>
            
            <div className="bg-white/20 rounded-lg p-4 mt-6 border border-white/20">
              <p className="text-sm text-orange-100 mb-1">Year-over-Year Growth</p>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold">
                  {parseFloat(data.comparison.growth) > 0 ? '+' : ''}{data.comparison.growth}%
                </span>
                <span className="text-sm opacity-80">vs last period</span>
              </div>
            </div>
          </div>

          {/* Revenue by Type */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 md:col-span-2">
            <h3 className="text-lg font-semibold text-slate-800 mb-6">Revenue Breakdown</h3>
            <div className="space-y-4">
              {data.byType && data.byType.length > 0 ? (
                data.byType.map((item, idx) => {
                  const percentage = ((item.amount / data.totalRevenue) * 100).toFixed(1);
                  return (
                    <div key={idx}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-slate-700 capitalize">{item.type.replace('_', ' ')}</span>
                        <span className="font-bold text-slate-800">₹{item.amount.toLocaleString()} ({percentage}%)</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2.5">
                        <div 
                          className="bg-blue-500 h-2.5 rounded-full" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-slate-500">No data available for this period.</p>
              )}
            </div>
          </div>

          {/* Monthly Trend (Simplified Bar Chart Placeholder) */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 md:col-span-3">
            <h3 className="text-lg font-semibold text-slate-800 mb-6">Monthly Trend</h3>
            <div className="h-64 flex items-end space-x-2 border-b border-l border-slate-200 p-4 pt-0">
              {data.monthlyRevenue && data.monthlyRevenue.length > 0 ? (
                data.monthlyRevenue.map((monthData, idx) => {
                  const maxAmount = Math.max(...data.monthlyRevenue.map(m => m.amount));
                  const heightPercentage = maxAmount > 0 ? (monthData.amount / maxAmount) * 100 : 0;
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                      <div 
                        className="w-full max-w-md bg-orange-400 rounded-t-sm group-hover:bg-orange-600 transition-colors"
                        style={{ height: `${Math.max(5, heightPercentage)}%` }}
                      ></div>
                      <span className="mt-2 text-xs text-slate-500 transform -rotate-45 origin-top-left hidden md:block">
                        {monthData.month}
                      </span>
                      <span className="absolute -top-8 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        ₹{monthData.amount.toLocaleString()}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">No trend data available.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RevenueReports;
