import React, { useState, useEffect } from 'react';
import { getGymDetails } from '../../../../services/adminApi';
import GymAnalytics from './GymAnalytics';

const GymDetails = ({ gymId, onClose }) => {
  const [gym, setGym] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const response = await getGymDetails(gymId);
        if (response.success) {
          setGym(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch gym details:', error);
      } finally {
        setLoading(false);
      }
    };
    if (gymId) fetchDetails();
  }, [gymId]);

  if (!gymId) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800">Gym Details</h2>
          <button onClick={onClose} className="text-slate-500 hover:bg-slate-200 p-2 rounded-full transition-colors">
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
          ) : !gym ? (
            <div className="text-center text-red-500 py-10">Failed to load gym data.</div>
          ) : (
            <div className="space-y-8">
              {/* Gym Header */}
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="w-24 h-24 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-500 text-3xl font-bold border-4 border-white shadow-lg shrink-0">
                  🏢
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-bold text-slate-800">{gym.name}</h3>
                  <p className="text-slate-500">{gym.address}, {gym.city}</p>
                  <div className="mt-3 flex flex-wrap gap-2 justify-center md:justify-start">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      gym.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 
                      gym.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                      gym.status === 'suspended' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {(gym.status || 'pending').toUpperCase()}
                    </span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold flex items-center">
                      ⭐ {gym.rating && typeof gym.rating === 'object' ? (gym.rating.average || 0) : (gym.rating || 0)}
                    </span>
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex space-x-6 text-center">
                  <div>
                    <p className="text-sm text-slate-500">Members</p>
                    <p className="text-xl font-bold text-slate-800">{gym.membersCount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Revenue/mo</p>
                    <p className="text-xl font-bold text-slate-800">₹{gym.monthlyRevenue?.toLocaleString() || 0}</p>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8">
                  <button
                    onClick={() => setActiveTab('info')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'info' ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                  >
                    Gym Info & Owner
                  </button>
                  <button
                    onClick={() => setActiveTab('docs')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'docs' ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                  >
                    Documents & Facilities
                  </button>
                  <button
                    onClick={() => setActiveTab('analytics')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'analytics' ? 'border-orange-500 text-orange-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                  >
                    Analytics
                  </button>
                </nav>
              </div>

              {/* Tab Content */}
              {activeTab === 'info' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <h4 className="text-lg font-semibold text-slate-800 border-b pb-2">Contact Details</h4>
                    <div className="grid grid-cols-1 gap-4 text-sm">
                      <div>
                        <p className="text-slate-500">Phone</p>
                        <p className="font-medium text-slate-800">{gym.phone || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Website</p>
                        <p className="font-medium text-slate-800 text-blue-600">
                          {gym.website ? <a href={`https://${gym.website.replace('https://', '')}`} target="_blank" rel="noreferrer">{gym.website}</a> : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-500">Joined Date</p>
                        <p className="font-medium text-slate-800">{new Date(gym.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6 bg-slate-50 p-6 rounded-xl border border-slate-100">
                    <h4 className="text-lg font-semibold text-slate-800 border-b pb-2">Owner Information</h4>
                    <div className="grid grid-cols-1 gap-4 text-sm">
                      <div>
                        <p className="text-slate-500">Name</p>
                        <p className="font-medium text-slate-800">{gym.owner?.name}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Email</p>
                        <p className="font-medium text-slate-800">{gym.owner?.email}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Phone</p>
                        <p className="font-medium text-slate-800">{gym.owner?.phone || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'docs' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <h4 className="text-lg font-semibold text-slate-800 border-b pb-2">Verification Documents</h4>
                    {gym.documents && gym.documents.length > 0 ? (
                      <ul className="space-y-3">
                        {gym.documents.map((doc, idx) => (
                          <li key={idx} className="flex justify-between items-center bg-slate-50 p-3 rounded border border-slate-100">
                            <div>
                              <span className="font-medium uppercase">{doc.type}</span>
                              {doc.verified && <span className="ml-2 text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">Verified</span>}
                            </div>
                            <a href={doc.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-sm">View</a>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-slate-500">No documents uploaded.</p>
                    )}
                  </div>

                  <div className="space-y-6">
                    <h4 className="text-lg font-semibold text-slate-800 border-b pb-2">Facilities & Equipment</h4>
                    <div>
                      <p className="text-sm text-slate-500 mb-2">Equipment Available</p>
                      <div className="flex flex-wrap gap-2">
                        {gym.equipment && gym.equipment.length > 0 ? (
                          gym.equipment.map((item, idx) => (
                            <span key={idx} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs border border-slate-200">
                              {item}
                            </span>
                          ))
                        ) : <span className="text-sm text-slate-500">Not specified</span>}
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <p className="text-sm text-slate-500 mb-2">Classes Offered</p>
                      <div className="space-y-2">
                        {gym.classes && gym.classes.length > 0 ? (
                          gym.classes.map((cls, idx) => (
                            <div key={idx} className="bg-slate-50 p-2 rounded border border-slate-100 text-sm flex justify-between">
                              <span className="font-medium">{cls.name}</span>
                              <span className="text-slate-500">{cls.timings}</span>
                            </div>
                          ))
                        ) : <span className="text-sm text-slate-500">Not specified</span>}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'analytics' && (
                <GymAnalytics gymId={gym.id} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GymDetails;
