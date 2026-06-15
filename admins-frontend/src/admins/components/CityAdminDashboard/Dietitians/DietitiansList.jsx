import React, { useState, useEffect } from 'react';
import { getAllDietitians, approveDietitian } from '../../../../services/cityAdminApi';

const DietitiansList = () => {
  const [dietitians, setDietitians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [assignedCities, setAssignedCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const admin = JSON.parse(localStorage.getItem('admin') || '{}');
    const cities = admin.assignedCities || [];
    setAssignedCities(cities);
    if (cities.length > 0) {
      setSelectedCity(cities[0]);
    }
  }, []);

  const fetchDietitians = async () => {
    setLoading(true);
    try {
      const res = await getAllDietitians({
        city: selectedCity || undefined,
        search: searchTerm || undefined,
      });
      if (res.success) {
        setDietitians(res.data);
      } else {
        setError(res.message || 'Failed to fetch dietitians');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error communicating with server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDietitians();
  }, [selectedCity, searchTerm]);

  const handleApprove = async (dietitianId) => {
    if (!window.confirm('Approve this dietitian?')) return;
    try {
      const res = await approveDietitian(dietitianId);
      if (res.success) {
        alert('Dietitian approved successfully!');
        fetchDietitians();
      } else {
        alert(res.message || 'Approval failed');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error executing request');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dietitians Management</h1>
          <p className="text-slate-500 text-sm">Review credentials and verify registered dietitians.</p>
        </div>
        <div className="flex gap-4 items-center">
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
          <input
            type="text"
            placeholder="Search dietitians..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 w-64"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="text-center py-10 font-medium text-slate-600">Loading dietitians...</div>
        ) : dietitians.length === 0 ? (
          <div className="text-center py-10 font-medium text-slate-500">No dietitians found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm font-semibold">
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">City</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="text-slate-700 text-sm divide-y divide-slate-100">
                {dietitians.map((dietitian) => (
                  <tr key={dietitian._id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-medium text-slate-900">{dietitian.name}</td>
                    <td className="p-4">{dietitian.email}</td>
                    <td className="p-4">{dietitian.phone || '-'}</td>
                    <td className="p-4">{dietitian.city}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          dietitian.status === 'verified'
                            ? 'bg-green-50 text-green-700 border border-green-150'
                            : dietitian.status === 'pending'
                            ? 'bg-yellow-50 text-yellow-700 border border-yellow-150'
                            : 'bg-red-50 text-red-700 border border-red-150'
                        }`}
                      >
                        {dietitian.status}
                      </span>
                    </td>
                    <td className="p-4">
                      {dietitian.status === 'pending' && (
                        <button
                          onClick={() => handleApprove(dietitian._id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-2.5 py-1 rounded text-xs transition-colors"
                        >
                          Approve
                        </button>
                      )}
                    </td>
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

export default DietitiansList;
