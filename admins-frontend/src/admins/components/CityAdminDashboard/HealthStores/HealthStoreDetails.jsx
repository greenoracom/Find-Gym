import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  getHealthStoreById,
  approveHealthStore,
  rejectHealthStore,
  requestChanges
} from '../../../../services/cityAdminHealthStoreApi';

const STATUS_COLORS = {
  Invited: 'bg-blue-100 text-blue-700 border-blue-200',
  'Registration Submitted': 'bg-purple-100 text-purple-700 border-purple-200',
  'Pending Verification': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  'Changes Requested': 'bg-orange-100 text-orange-700 border-orange-200',
  Approved: 'bg-teal-100 text-teal-700 border-teal-200',
  'Password Pending': 'bg-indigo-100 text-indigo-700 border-indigo-200',
  Active: 'bg-green-100 text-green-700 border-green-200',
  Rejected: 'bg-red-100 text-red-700 border-red-200',
  Blocked: 'bg-gray-100 text-gray-700 border-gray-200',
};

const HealthStoreDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Modal/Reason state
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [reasonType, setReasonType] = useState(''); // 'reject' or 'request-changes'
  const [reasonText, setReasonText] = useState('');

  const fetchStore = async () => {
    setLoading(true);
    try {
      const res = await getHealthStoreById(id);
      setStore(res.data.data);
    } catch (err) {
      toast.error('Failed to load health store details');
      navigate('/city-admin/health-stores');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStore();
  }, [id]);

  const handleApprove = async () => {
    if (!window.confirm(`Are you sure you want to approve "${store.storeName}"? This will invite them to set up their password.`)) return;
    setActionLoading(true);
    try {
      await approveHealthStore(store._id);
      toast.success('Health Store approved successfully!');
      fetchStore();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Approval failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReasonSubmit = async (e) => {
    e.preventDefault();
    if (!reasonText.trim()) {
      toast.error('Please enter a reason');
      return;
    }
    setActionLoading(true);
    try {
      if (reasonType === 'reject') {
        await rejectHealthStore(store._id, reasonText);
        toast.success('Health Store rejected');
      } else {
        await requestChanges(store._id, reasonText);
        toast.success('Changes request email sent to owner');
      }
      setShowReasonModal(false);
      setReasonText('');
      fetchStore();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full mb-4"></div>
        <p className="text-gray-500 font-medium">Loading store details...</p>
      </div>
    );
  }

  if (!store) return null;

  const showActions = ['Registration Submitted', 'Pending Verification', 'Changes Requested'].includes(store.status);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/city-admin/health-stores')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors border">
            🔙 Back
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              {store.storeName}
              <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${STATUS_COLORS[store.status] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                {store.status}
              </span>
            </h2>
            <p className="text-gray-500 text-sm mt-0.5">Store ID: {store._id}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left/Main Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Information */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b">Store Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-xs font-medium uppercase">Owner Name</p>
                <p className="text-gray-800 font-semibold">{store.ownerName}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs font-medium uppercase">Owner Email</p>
                <p className="text-gray-800 font-semibold">{store.ownerEmail}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs font-medium uppercase">Owner Mobile</p>
                <p className="text-gray-800 font-semibold">{store.ownerMobile}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs font-medium uppercase">City</p>
                <p className="text-gray-800 font-semibold">{store.city}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs font-medium uppercase">Store Type</p>
                <p className="text-gray-800 font-semibold">{store.storeType}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs font-medium uppercase">Created On</p>
                <p className="text-gray-800 font-semibold">{new Date(store.createdAt).toLocaleString('en-IN')}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-gray-400 text-xs font-medium uppercase">Full Address</p>
                <p className="text-gray-800 font-semibold">{store.address || 'Not Provided'}</p>
              </div>
              {store.description && (
                <div className="sm:col-span-2">
                  <p className="text-gray-400 text-xs font-medium uppercase">Description</p>
                  <p className="text-gray-800 font-normal text-sm mt-1">{store.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Business & Legal Verification Info */}
          {store.licenseNumber || store.gstNumber || store.panNumber ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b">Business Documents & Numbers</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {store.licenseNumber && (
                  <div className="border border-gray-100 p-4 rounded-xl">
                    <p className="text-gray-400 text-xs font-medium uppercase">Business License Number</p>
                    <p className="text-gray-800 font-semibold text-sm mb-2">{store.licenseNumber}</p>
                    {store.licenseDoc && (
                      <a href={store.licenseDoc} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs text-orange-500 hover:text-orange-600 font-semibold mt-1">
                        📄 View License Document
                      </a>
                    )}
                  </div>
                )}
                {store.gstNumber && (
                  <div className="border border-gray-100 p-4 rounded-xl">
                    <p className="text-gray-400 text-xs font-medium uppercase">GST Number</p>
                    <p className="text-gray-800 font-semibold text-sm mb-2">{store.gstNumber}</p>
                    {store.gstDoc && (
                      <a href={store.gstDoc} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs text-orange-500 hover:text-orange-600 font-semibold mt-1">
                        📄 View GST Document
                      </a>
                    )}
                  </div>
                )}
                {store.panNumber && (
                  <div className="border border-gray-100 p-4 rounded-xl">
                    <p className="text-gray-400 text-xs font-medium uppercase">PAN Number</p>
                    <p className="text-gray-800 font-semibold text-sm mb-2">{store.panNumber}</p>
                    {store.panDoc && (
                      <a href={store.panDoc} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs text-orange-500 hover:text-orange-600 font-semibold mt-1">
                        📄 View PAN Document
                      </a>
                    )}
                  </div>
                )}
                {store.foodLicenseNumber && (
                  <div className="border border-gray-100 p-4 rounded-xl">
                    <p className="text-gray-400 text-xs font-medium uppercase">FSSAI Food License Number</p>
                    <p className="text-gray-800 font-semibold text-sm mb-2">{store.foodLicenseNumber}</p>
                    {store.foodLicenseDoc && (
                      <a href={store.foodLicenseDoc} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs text-orange-500 hover:text-orange-600 font-semibold mt-1">
                        📄 View FSSAI Document
                      </a>
                    )}
                  </div>
                )}
                {store.drugLicenseNumber && (
                  <div className="border border-gray-100 p-4 rounded-xl">
                    <p className="text-gray-400 text-xs font-medium uppercase">Drug License Number</p>
                    <p className="text-gray-800 font-semibold text-sm mb-2">{store.drugLicenseNumber}</p>
                    {store.drugLicenseDoc && (
                      <a href={store.drugLicenseDoc} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs text-orange-500 hover:text-orange-600 font-semibold mt-1">
                        📄 View Drug License Document
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm text-center">
              <p className="text-gray-400 font-medium">Store owner has not uploaded business details/documents yet.</p>
            </div>
          )}

          {/* Bank Details */}
          {store.bankDetails?.bankName ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b">Bank Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-xs font-medium uppercase">Account Holder Name</p>
                  <p className="text-gray-800 font-semibold">{store.bankDetails.holderName}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs font-medium uppercase">Bank Name</p>
                  <p className="text-gray-800 font-semibold">{store.bankDetails.bankName}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs font-medium uppercase">Account Number</p>
                  <p className="text-gray-800 font-semibold">{store.bankDetails.accountNumber}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs font-medium uppercase">IFSC Code</p>
                  <p className="text-gray-800 font-semibold">{store.bankDetails.ifscCode}</p>
                </div>
                {store.bankDoc && (
                  <div className="sm:col-span-2 mt-2">
                    <a href={store.bankDoc} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs text-orange-500 hover:text-orange-600 font-semibold">
                      📄 View Bank Passbook/Cheque Proof
                    </a>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>

        {/* Right Column - Actions & Status Details */}
        <div className="space-y-6">
          {/* Audit / Review Log */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b">Status & History</h3>
            <div className="space-y-3">
              <div>
                <p className="text-gray-400 text-xs font-medium">Status</p>
                <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full mt-1 ${STATUS_COLORS[store.status] || 'bg-gray-100 text-gray-600'}`}>
                  {store.status}
                </span>
              </div>

              {store.cityAdmin && (
                <div>
                  <p className="text-gray-400 text-xs font-medium">Invited By</p>
                  <p className="text-sm font-semibold text-gray-800">{store.cityAdmin.fullName} ({store.cityAdmin.email})</p>
                </div>
              )}

              {store.approvedBy && (
                <div>
                  <p className="text-gray-400 text-xs font-medium">Approved By</p>
                  <p className="text-sm font-semibold text-gray-800">{store.approvedBy.fullName}</p>
                  <p className="text-xs text-gray-400">{new Date(store.approvedAt).toLocaleString('en-IN')}</p>
                </div>
              )}

              {store.rejectReason && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl">
                  <p className="text-red-700 font-semibold text-xs">Rejection Reason</p>
                  <p className="text-red-600 text-xs mt-1">{store.rejectReason}</p>
                </div>
              )}

              {store.changesRequestedReason && (
                <div className="p-3 bg-orange-50 border border-orange-100 rounded-xl">
                  <p className="text-orange-700 font-semibold text-xs">Changes Requested Reason</p>
                  <p className="text-orange-600 text-xs mt-1">{store.changesRequestedReason}</p>
                </div>
              )}
            </div>
          </div>

          {/* Action Panel */}
          {showActions && (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-3">
              <h3 className="text-lg font-bold text-gray-800 mb-2 pb-2 border-b">Verify Application</h3>
              <p className="text-xs text-gray-500 mb-4">Please review all business information and uploaded documents before choosing an action.</p>

              <button
                onClick={handleApprove}
                disabled={actionLoading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-55 text-white py-2.5 rounded-xl font-semibold text-sm transition-colors"
              >
                {actionLoading ? 'Processing...' : '✅ Approve & Invite'}
              </button>

              <button
                onClick={() => { setReasonType('request-changes'); setShowReasonModal(true); }}
                disabled={actionLoading}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-55 text-white py-2.5 rounded-xl font-semibold text-sm transition-colors"
              >
                Request Correction
              </button>

              <button
                onClick={() => { setReasonType('reject'); setShowReasonModal(true); }}
                disabled={actionLoading}
                className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-55 text-white py-2.5 rounded-xl font-semibold text-sm transition-colors"
              >
                Reject Application
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Reason Input Modal */}
      {showReasonModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95">
            <div>
              <h4 className="text-lg font-bold text-gray-800 capitalize">
                {reasonType === 'reject' ? 'Reject Health Store' : 'Request Document Correction'}
              </h4>
              <p className="text-xs text-gray-500 mt-1">
                {reasonType === 'reject'
                  ? 'This store will be rejected and notified. Specify the reasons below.'
                  : 'Specify what documents or details need correction. The owner will be invited to update them.'}
              </p>
            </div>
            <form onSubmit={handleReasonSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Detailed Reason/Message *</label>
                <textarea
                  required
                  rows={4}
                  value={reasonText}
                  onChange={e => setReasonText(e.target.value)}
                  placeholder="Explain details here..."
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                />
              </div>
              <div className="flex justify-end gap-3 border-t pt-4">
                <button
                  type="button"
                  onClick={() => { setShowReasonModal(false); setReasonText(''); }}
                  className="px-4 py-2 border rounded-xl text-gray-600 font-semibold text-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className={`px-4 py-2 text-white font-semibold text-sm rounded-xl ${reasonType === 'reject' ? 'bg-red-600 hover:bg-red-700' : 'bg-orange-500 hover:bg-orange-600'}`}
                >
                  {actionLoading ? 'Submitting...' : 'Submit Decision'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthStoreDetails;
