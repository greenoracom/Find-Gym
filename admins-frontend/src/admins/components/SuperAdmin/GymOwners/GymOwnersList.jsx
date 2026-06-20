import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import Table from '../../common/Table';
import Badge from '../../common/Badge';
import Button from '../../common/Button';
import { getAllGymOwners } from '../../../../services/superApi';

const GymOwnersList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOwners = async () => {
    try {
      setLoading(true);
      const res = await getAllGymOwners();
      if (res.data && res.data.owners) {
        const formattedOwners = res.data.owners.map(o => ({
          id: o._id,
          name: o.name,
          email: o.email,
          phone: o.phone || 'N/A',
          gyms: o.gyms ? o.gyms.length : 0,
          kyc: o.kyc?.verified ? 'Verified' : 'Pending',
          status: o.status ? (o.status.charAt(0).toUpperCase() + o.status.slice(1)) : 'Pending'
        }));
        setOwners(formattedOwners);
      }
    } catch (err) {
      console.error("Failed to load owners:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwners();
  }, []);

  const columns = [
    { title: 'Owner ID', key: 'id' },
    { 
      title: 'Name', 
      key: 'name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
            {row.name ? row.name.charAt(0) : '?'}
          </div>
          <div className="font-medium text-gray-900">{row.name}</div>
        </div>
      )
    },
    { title: 'Email', key: 'email' },
    { title: 'Phone', key: 'phone' },
    { title: 'Gyms Owned', key: 'gyms' },
    { 
      title: 'KYC Status', 
      key: 'kyc',
      render: (row) => {
        const variants = { 'Verified': 'success', 'Pending': 'warning', 'Rejected': 'danger' };
        return <Badge label={row.kyc} variant={variants[row.kyc] || 'default'} />;
      }
    },
    { 
      title: 'Account', 
      key: 'status',
      render: (row) => {
        const variants = { 'Active': 'success', 'Suspended': 'danger', 'Pending': 'warning', 'Rejected': 'danger' };
        return <Badge label={row.status} variant={variants[row.status] || 'default'} />;
      }
    },
    { 
      title: 'Actions', 
      key: 'actions',
      render: (row) => {
        const handleToggleStatus = async () => {
          const newStatus = row.status === 'Active' ? 'suspended' : 'active';
          if (!window.confirm(`Are you sure you want to ${newStatus === 'active' ? 'activate' : 'suspend'} this gym owner?`)) return;
          try {
            const { updateGymOwnerStatus } = await import('../../../../services/superApi');
            const response = await updateGymOwnerStatus(row.id, newStatus);
            if (response.data && response.data.success) {
              fetchOwners();
            } else {
              alert('Failed to update status.');
            }
          } catch (error) {
            console.error(error);
            alert('Failed to update status.');
          }
        };

        const handleViewKYC = () => {
          setSelectedOwnerForModal(row);
        };

        return (
          <div className="flex gap-2">
             <Button variant="secondary" size="sm" onClick={handleViewKYC}>View KYC</Button>
             <Button variant="secondary" size="sm" className="text-red-500" onClick={handleToggleStatus}>
               {row.status === 'Active' ? 'Suspend' : 'Activate'}
             </Button>
          </div>
        );
      }
    },
  ];

  const [selectedOwnerForModal, setSelectedOwnerForModal] = useState(null);
  const rawOwners = owners; // placeholder to keep original reference if needed

  const filteredOwners = owners.filter(owner => 
    owner.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    owner.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    owner.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fetchFullOwnerDetails = async () => {
    // Helper to get raw object from backend for kyc documents
    if (!selectedOwnerForModal) return null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Find detailed selected owner data to display documents
  const selectedOwnerRaw = selectedOwnerForModal;

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gym Owners</h1>
          <p className="text-sm text-gray-500">Manage gym owners and verify KYC</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by owner name, email, phone..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>
        </div>
        
        <Table data={filteredOwners} columns={columns} />
      </div>

      {selectedOwnerForModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 flex flex-col p-6 animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-slate-900 mb-4">{selectedOwnerForModal.name}'s Profile & KYC</h3>
            <div className="space-y-3 text-left">
              <div><strong className="text-sm text-gray-500">Email:</strong> <span className="text-gray-900 text-sm font-medium">{selectedOwnerForModal.email}</span></div>
              <div><strong className="text-sm text-gray-500">Phone:</strong> <span className="text-gray-900 text-sm font-medium">{selectedOwnerForModal.phone}</span></div>
              <div><strong className="text-sm text-gray-500">Gyms Registered:</strong> <span className="text-gray-900 text-sm font-medium">{selectedOwnerForModal.gyms}</span></div>
              <div><strong className="text-sm text-gray-500">KYC Status:</strong> <span className="text-gray-900 text-sm font-medium">{selectedOwnerForModal.kyc}</span></div>
              <div><strong className="text-sm text-gray-500">Account Status:</strong> <span className="text-gray-900 text-sm font-medium">{selectedOwnerForModal.status}</span></div>
              <div className="border-t pt-3 mt-3">
                <p className="text-sm text-gray-500 mb-2">Note: To download/verify full uploaded Aadhaar/PAN and Bank documents, please approve or reject them directly from their registered dashboard profiles.</p>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="secondary" onClick={() => setSelectedOwnerForModal(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GymOwnersList;
