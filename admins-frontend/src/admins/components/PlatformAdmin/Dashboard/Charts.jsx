import React from 'react';

// Using basic divs for charts as placeholder. In real app, integrate Recharts or Chart.js
const Charts = ({ data }) => {
  if (!data) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* User Growth Chart Placeholder */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">User Growth (Last 30 Days)</h3>
        <div className="h-64 flex items-end space-x-2 border-b border-l border-slate-200 p-4 pt-0">
          {data.userGrowth?.slice(-15).map((point, i) => (
            <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group relative">
              <div 
                className="w-full bg-blue-500 rounded-t-sm group-hover:bg-blue-600 transition-colors"
                style={{ height: `${Math.max(10, (point.count / 200) * 100)}%` }}
              ></div>
              <span className="absolute -top-8 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                {point.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue Growth Chart Placeholder */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Revenue Growth (Last 30 Days)</h3>
        <div className="h-64 flex items-end space-x-2 border-b border-l border-slate-200 p-4 pt-0">
          {data.revenueGrowth?.slice(-15).map((point, i) => (
            <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group relative">
              <div 
                className="w-full bg-orange-500 rounded-t-sm group-hover:bg-orange-600 transition-colors"
                style={{ height: `${Math.max(10, (point.amount / 100000) * 100)}%` }}
              ></div>
              <span className="absolute -top-8 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                ₹{point.amount.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Charts;
