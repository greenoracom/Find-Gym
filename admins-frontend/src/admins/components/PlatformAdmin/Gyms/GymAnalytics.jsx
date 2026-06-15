import React, { useState, useEffect } from 'react';
import { getGymAnalytics } from '../../../../services/adminApi';

const GymAnalytics = ({ gymId }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await getGymAnalytics(gymId);
        if (response.success) {
          setData(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    if (gymId) fetchAnalytics();
  }, [gymId]);

  if (loading) return <div className="text-center py-10 text-slate-500">Loading analytics...</div>;
  if (!data) return <div className="text-center py-10 text-slate-500">No analytics data available.</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Member Growth Chart Placeholder */}
        <div className="bg-slate-50 rounded-xl border border-slate-100 p-6">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Member Growth</h4>
          <div className="h-48 flex items-end space-x-2 border-b border-l border-slate-300 p-2 pt-0">
             {/* Mock visualization */}
             <div className="w-full bg-blue-400 h-[40%] rounded-t-sm relative group">
                <span className="absolute -top-6 text-xs text-slate-500 hidden group-hover:block">Jan</span>
             </div>
             <div className="w-full bg-blue-500 h-[60%] rounded-t-sm relative group">
                <span className="absolute -top-6 text-xs text-slate-500 hidden group-hover:block">Feb</span>
             </div>
             <div className="w-full bg-blue-600 h-[90%] rounded-t-sm relative group">
                <span className="absolute -top-6 text-xs text-slate-500 hidden group-hover:block">Mar</span>
             </div>
          </div>
        </div>

        {/* Revenue Chart Placeholder */}
        <div className="bg-slate-50 rounded-xl border border-slate-100 p-6">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Revenue Growth</h4>
          <div className="h-48 flex items-end space-x-2 border-b border-l border-slate-300 p-2 pt-0">
             {/* Mock visualization */}
             <div className="w-full bg-orange-400 h-[50%] rounded-t-sm relative group"></div>
             <div className="w-full bg-orange-500 h-[70%] rounded-t-sm relative group"></div>
             <div className="w-full bg-orange-600 h-[85%] rounded-t-sm relative group"></div>
          </div>
        </div>
      </div>

      {/* Top Classes */}
      <div className="bg-slate-50 rounded-xl border border-slate-100 p-6 mt-6">
        <h4 className="text-lg font-semibold text-slate-800 mb-4">Top Performing Classes</h4>
        <div className="space-y-3">
          {data.topClasses && data.topClasses.length > 0 ? (
            data.topClasses.map((cls, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg">
                <span className="font-medium text-slate-700">{cls.name}</span>
                <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">{cls.count} Bookings</span>
              </div>
            ))
          ) : (
             <p className="text-sm text-slate-500">No class data available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GymAnalytics;
