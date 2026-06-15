import React, { useState, useEffect } from 'react';
import { getActivityLogs } from '../../../../services/cityAdminApi';

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
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

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await getActivityLogs({ city: selectedCity || undefined });
      if (res.success) {
        setLogs(res.data);
      } else {
        setError(res.message || 'Failed to fetch logs');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error communicating with server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [selectedCity]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Activity Logs</h1>
          <p className="text-slate-500 text-sm">Monitor administration actions and system events.</p>
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

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="text-center py-10 font-medium text-slate-600">Loading logs...</div>
        ) : logs.length === 0 ? (
          <div className="text-center py-10 font-medium text-slate-500">No activity logs found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm font-semibold">
                  <th className="p-4">Timestamp</th>
                  <th className="p-4">Action Type</th>
                  <th className="p-4">Performed By (Admin)</th>
                  <th className="p-4">Description</th>
                  <th className="p-4">City</th>
                </tr>
              </thead>
              <tbody className="text-slate-700 text-sm divide-y divide-slate-100">
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-mono text-xs text-slate-500">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="p-4">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs font-semibold uppercase">
                        {log.type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-4 font-medium text-slate-800">
                      {log.adminId ? log.adminId.fullName : 'System'}
                    </td>
                    <td className="p-4 text-slate-600">{log.description}</td>
                    <td className="p-4 font-semibold text-orange-600">{log.city || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityLogs;
