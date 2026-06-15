import React, { useState, useEffect } from 'react';
import { getAnalytics } from '../../../../services/cityAdminApi';

const Analytics = () => {
  const [data, setData] = useState({ userGrowth: Array(12).fill(0), gymGrowth: Array(12).fill(0) });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [assignedCities, setAssignedCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  useEffect(() => {
    const admin = JSON.parse(localStorage.getItem('admin') || '{}');
    const cities = admin.assignedCities || [];
    setAssignedCities(cities);
    if (cities.length > 0) {
      setSelectedCity(cities[0]);
    }
  }, []);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const res = await getAnalytics({ city: selectedCity || undefined });
        if (res.success) {
          setData(res.data);
        } else {
          setError(res.message || 'Failed to fetch analytics data');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Error communicating with server');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [selectedCity]);

  const maxUserVal = Math.max(...data.userGrowth, 1);
  const maxGymVal = Math.max(...data.gymGrowth, 1);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Analytics Overview</h1>
          <p className="text-slate-500 text-sm">Visualize user growth and gym registrations by city.</p>
        </div>
        {assignedCities.length > 1 && (
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">All Assigned Cities</option>
            {assignedCities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        )}
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-10 font-medium text-slate-600">Loading Analytics...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* User Growth */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-semibold text-slate-800 mb-6 flex items-center">
              <span>👥</span> <span className="ml-2">User Registrations (Monthly)</span>
            </h2>
            <div className="h-64 flex items-end justify-between gap-2 border-b border-l border-slate-200 pb-2 pl-2">
              {data.userGrowth.map((count, index) => {
                const heightPercentage = (count / maxUserVal) * 100;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center group relative">
                    <span className="absolute bottom-full mb-1 scale-0 group-hover:scale-100 bg-slate-800 text-white text-xs rounded px-2 py-1 transition-all">
                      {count}
                    </span>
                    <div
                      style={{ height: `${heightPercentage}%` }}
                      className="w-full bg-orange-500 hover:bg-orange-600 rounded-t transition-all duration-500 min-h-[4px]"
                    ></div>
                    <span className="text-[10px] text-slate-500 mt-2 font-medium">{months[index]}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Gym Growth */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-semibold text-slate-800 mb-6 flex items-center">
              <span>🏢</span> <span className="ml-2">Gym Registrations (Monthly)</span>
            </h2>
            <div className="h-64 flex items-end justify-between gap-2 border-b border-l border-slate-200 pb-2 pl-2">
              {data.gymGrowth.map((count, index) => {
                const heightPercentage = (count / maxGymVal) * 100;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center group relative">
                    <span className="absolute bottom-full mb-1 scale-0 group-hover:scale-100 bg-slate-800 text-white text-xs rounded px-2 py-1 transition-all">
                      {count}
                    </span>
                    <div
                      style={{ height: `${heightPercentage}%` }}
                      className="w-full bg-slate-700 hover:bg-slate-800 rounded-t transition-all duration-500 min-h-[4px]"
                    ></div>
                    <span className="text-[10px] text-slate-500 mt-2 font-medium">{months[index]}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
