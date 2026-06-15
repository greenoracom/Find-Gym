import React, { useState, useEffect } from 'react';
import { getDashboardData } from '../../../../services/cityAdminApi';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalGyms: 0,
    pendingGyms: 0,
    verifiedTrainers: 0,
    verifiedDietitians: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [assignedCities, setAssignedCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');

  useEffect(() => {
    const admin = JSON.parse(localStorage.getItem('admin') || '{}');
    const cities = admin.assignedCities || [];
    setAssignedCities(cities);
    if (cities.length > 0) {
      setSelectedCity(cities[0]);
    }
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const res = await getDashboardData(selectedCity || undefined);
        if (res.success) {
          setStats(res.data);
        } else {
          setError(res.message || 'Failed to fetch dashboard data');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Error communicating with server');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [selectedCity]);

  if (loading && !stats.totalGyms) {
    return <div className="text-center py-10 font-medium text-slate-600">Loading Dashboard...</div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Welcome back!</h1>
          <p className="text-slate-500">Here is the overview for your assigned locations.</p>
        </div>
        {assignedCities.length > 1 && (
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-slate-600">Select City:</span>
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
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="text-3xl mb-2">👥</div>
          <div className="text-slate-500 text-sm font-medium">Total Users</div>
          <div className="text-2xl font-bold text-slate-800 mt-1">{stats.totalUsers}</div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="text-3xl mb-2">🏢</div>
          <div className="text-slate-500 text-sm font-medium">Total Gyms</div>
          <div className="text-2xl font-bold text-slate-800 mt-1">{stats.totalGyms}</div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="text-3xl mb-2">⏳</div>
          <div className="text-slate-500 text-sm font-medium">Pending Gyms</div>
          <div className="text-2xl font-bold text-slate-800 mt-1 text-orange-600">{stats.pendingGyms}</div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="text-3xl mb-2">🏋️</div>
          <div className="text-slate-500 text-sm font-medium">Verified Trainers</div>
          <div className="text-2xl font-bold text-slate-800 mt-1">{stats.verifiedTrainers}</div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="text-3xl mb-2">🥗</div>
          <div className="text-slate-500 text-sm font-medium">Verified Dietitians</div>
          <div className="text-2xl font-bold text-slate-800 mt-1">{stats.verifiedDietitians}</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
