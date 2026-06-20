import React, { useState, useEffect } from 'react';
import { getCityAdmins } from '../../../../services/adminApi';

const StatusBadge = ({ status }) => {
  const map = {
    Active: 'bg-green-50 text-green-700 border-green-200',
    Inactive: 'bg-slate-100 text-slate-500 border-slate-200',
    active: 'bg-green-50 text-green-700 border-green-200',
    pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    suspended: 'bg-orange-50 text-orange-700 border-orange-200',
    rejected: 'bg-red-50 text-red-700 border-red-200',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${map[status] || 'bg-slate-100 text-slate-500 border-slate-200'}`}>
      {status}
    </span>
  );
};

const CityAdminsList = () => {
  const [cityAdmins, setCityAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Drill-down state
  const [selectedAdmin, setSelectedAdmin] = useState(null); // City admin detail modal
  const [selectedOwner, setSelectedOwner] = useState(null); // Gym owner gyms modal

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getCityAdmins();
        if (res.success) {
          setCityAdmins(res.cityAdmins);
        } else {
          setError(res.message || 'Failed to load city admins');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Error communicating with server');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = cityAdmins.filter((admin) => {
    const term = searchTerm.toLowerCase();
    return (
      admin.fullName?.toLowerCase().includes(term) ||
      admin.email?.toLowerCase().includes(term) ||
      admin.city?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">City Admins</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            View all city admins, their gym owners, and gym count.
          </p>
        </div>
        <input
          type="text"
          placeholder="Search by name, email or city..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 w-full sm:w-72"
        />
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200 text-sm">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-base font-medium">
            {searchTerm ? 'No city admins match your search.' : 'No city admins found.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm font-semibold">
                  <th className="p-4">Name</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4">City</th>
                  <th className="p-4 text-center">Gym Owners</th>
                  <th className="p-4 text-center">Total Gyms</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Last Login</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="text-slate-700 text-sm divide-y divide-slate-100">
                {filtered.map((admin) => (
                  <tr key={admin._id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-semibold text-slate-900">{admin.fullName}</td>
                    <td className="p-4">
                      <div className="font-medium">{admin.email}</div>
                      <div className="text-xs text-slate-400">{admin.phone}</div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 bg-orange-50 text-orange-700 border border-orange-200 px-2 py-0.5 rounded-full text-xs font-semibold">
                        📍 {admin.city}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-700 font-bold text-sm">
                        {admin.gymOwnerCount}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-50 text-green-700 font-bold text-sm">
                        {admin.gymCount}
                      </span>
                    </td>
                    <td className="p-4">
                      <StatusBadge status={admin.status} />
                    </td>
                    <td className="p-4 text-xs text-slate-400">
                      {admin.lastLogin
                        ? new Date(admin.lastLogin).toLocaleDateString('en-IN', {
                            day: '2-digit', month: 'short', year: 'numeric'
                          })
                        : 'Never'}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => setSelectedAdmin(admin)}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── City Admin Detail Modal ── */}
      {selectedAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[88vh] overflow-y-auto shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-gradient-to-r from-slate-50 to-orange-50">
              <div>
                <h3 className="text-xl font-bold text-slate-900">{selectedAdmin.fullName}</h3>
                <p className="text-slate-500 text-sm mt-0.5">
                  City Admin · 📍 {selectedAdmin.city}
                </p>
              </div>
              <button
                onClick={() => { setSelectedAdmin(null); setSelectedOwner(null); }}
                className="text-slate-400 hover:text-slate-700 text-2xl font-light leading-none"
              >
                ✕
              </button>
            </div>

            {/* Admin Info */}
            <div className="p-6 border-b border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Email</p>
                <p className="text-sm text-slate-700 font-semibold mt-0.5">{selectedAdmin.email}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Phone</p>
                <p className="text-sm text-slate-700 font-semibold mt-0.5">{selectedAdmin.phone || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Status</p>
                <div className="mt-0.5"><StatusBadge status={selectedAdmin.status} /></div>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Joined</p>
                <p className="text-sm text-slate-700 font-semibold mt-0.5">
                  {new Date(selectedAdmin.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="px-6 py-4 grid grid-cols-2 gap-4 border-b border-slate-100">
              <div className="rounded-xl bg-blue-50 border border-blue-100 p-4 text-center">
                <p className="text-3xl font-bold text-blue-700">{selectedAdmin.gymOwnerCount}</p>
                <p className="text-xs text-blue-500 mt-1 font-medium">Gym Owners</p>
              </div>
              <div className="rounded-xl bg-green-50 border border-green-100 p-4 text-center">
                <p className="text-3xl font-bold text-green-700">{selectedAdmin.gymCount}</p>
                <p className="text-xs text-green-500 mt-1 font-medium">Total Gyms</p>
              </div>
            </div>

            {/* Gym Owners List */}
            <div className="p-6">
              <h4 className="font-bold text-slate-800 text-base mb-4">
                Gym Owners in {selectedAdmin.city}
              </h4>

              {!selectedAdmin.gymOwners || selectedAdmin.gymOwners.length === 0 ? (
                <p className="text-center py-8 text-slate-400 font-medium text-sm">
                  No gym owners found in {selectedAdmin.city}.
                </p>
              ) : (
                <div className="space-y-3">
                  {selectedAdmin.gymOwners.map((owner) => (
                    <div
                      key={owner._id}
                      className="border border-slate-100 rounded-xl p-4 hover:border-orange-200 hover:bg-orange-50/20 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-sm shrink-0">
                              {owner.name?.charAt(0)?.toUpperCase() || '?'}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900 text-sm">{owner.name}</p>
                              <p className="text-xs text-slate-400">{owner.email} · {owner.phone}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <StatusBadge status={owner.status} />
                          <span className="inline-flex items-center gap-1 text-xs text-slate-500 font-medium bg-slate-100 px-2 py-1 rounded-full">
                            🏢 {owner.gymCount} gym{owner.gymCount !== 1 ? 's' : ''}
                          </span>
                          <button
                            onClick={() => setSelectedOwner(selectedOwner?._id === owner._id ? null : owner)}
                            className="text-xs text-orange-600 hover:text-orange-800 font-semibold underline"
                          >
                            {selectedOwner?._id === owner._id ? 'Hide Gyms' : 'View Gyms'}
                          </button>
                        </div>
                      </div>

                      {/* Gyms Expansion */}
                      {selectedOwner?._id === owner._id && (
                        <div className="mt-3 ml-12 space-y-2">
                          {owner.gyms.length === 0 ? (
                            <p className="text-xs text-slate-400">No gyms registered.</p>
                          ) : (
                            owner.gyms.map((gym) => (
                              <div
                                key={gym._id}
                                className="bg-white border border-slate-100 rounded-lg px-4 py-3 flex items-center justify-between"
                              >
                                <div>
                                  <p className="text-sm font-semibold text-slate-800">{gym.name}</p>
                                  <p className="text-xs text-slate-400 mt-0.5">
                                    📍 {gym.address}, {gym.city}
                                  </p>
                                </div>
                                <div className="flex gap-2">
                                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${
                                    gym.verified
                                      ? 'bg-green-50 text-green-700 border-green-200'
                                      : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                  }`}>
                                    {gym.verified ? '✓ Verified' : '⏳ Pending'}
                                  </span>
                                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${
                                    gym.active
                                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                                      : 'bg-red-50 text-red-700 border-red-200'
                                  }`}>
                                    {gym.active ? 'Active' : 'Inactive'}
                                  </span>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-100 flex justify-end bg-slate-50">
              <button
                onClick={() => { setSelectedAdmin(null); setSelectedOwner(null); }}
                className="px-6 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-sm font-semibold transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CityAdminsList;
