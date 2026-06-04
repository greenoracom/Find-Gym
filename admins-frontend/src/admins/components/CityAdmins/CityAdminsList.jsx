import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import Table from '../common/Table';
import Badge from '../common/Badge';
import Button from '../common/Button';
import CreateCityAdmin from './CreateCityAdmin';
import ConfirmationModal from '../common/ConfirmationModal';

const CityAdminsList = () => {
  const [showCreate, setShowCreate] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState(null);

  const cityAdmins = [
    { id: 'CA-001', name: 'Ravi Kumar', email: 'ravi.k@findgym.com', assignedCities: ['Pune', 'Mumbai'], status: 'Active', created: '2024-02-01' },
    { id: 'CA-002', name: 'Anita Patel', email: 'anita.p@findgym.com', assignedCities: ['Bangalore', 'Chennai', 'Hyderabad', 'Mysore'], status: 'Active', created: '2024-02-15' },
    { id: 'CA-003', name: 'Sanjay Dutt', email: 'sanjay.d@findgym.com', assignedCities: ['Delhi'], status: 'Inactive', created: '2024-03-01' },
  ];

  const handleDelete = (admin) => {
    setAdminToDelete(admin);
    setShowDelete(true);
  };

  const confirmDelete = () => {
    setShowDelete(false);
  };

  const columns = [
    { title: 'Admin ID', key: 'id' },
    { 
      title: 'Name', 
      key: 'name',
      render: (row) => <div className="font-medium text-gray-900">{row.name}</div>
    },
    { title: 'Email', key: 'email' },
    { 
      title: 'Assigned Cities', 
      key: 'assignedCities',
      render: (row) => (
        <div className="flex gap-1 flex-wrap max-w-xs">
          {row.assignedCities.slice(0, 3).map(city => (
            <Badge key={city} label={city} variant="info" className="bg-blue-100 text-blue-800" />
          ))}
          {row.assignedCities.length > 3 && (
            <Badge label={`+${row.assignedCities.length - 3} more`} variant="default" />
          )}
        </div>
      )
    },
    { 
      title: 'Status', 
      key: 'status',
      render: (row) => (
        <Badge label={row.status} variant={row.status === 'Active' ? 'success' : 'default'} />
      )
    },
    { 
      title: 'Actions', 
      key: 'actions',
      render: (row) => (
        <div className="flex gap-2">
           <Button variant="secondary" size="sm">Edit</Button>
           <Button variant="danger" size="sm" onClick={() => handleDelete(row)}>Delete</Button>
        </div>
      )
    },
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">City Admins</h1>
          <p className="text-sm text-gray-500">Manage region-specific administrators</p>
        </div>
        <Button variant="primary" className="flex items-center gap-2" onClick={() => setShowCreate(true)}>
          <Plus size={16} /> Create City Admin
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <Table data={cityAdmins} columns={columns} />
      </div>

      {showCreate && (
        <CreateCityAdmin isOpen={showCreate} onClose={() => setShowCreate(false)} />
      )}

      <ConfirmationModal
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={confirmDelete}
        title="Delete City Admin"
        message={`Are you sure you want to delete ${adminToDelete?.name}? This action cannot be undone.`}
        dangerMode={true}
      />
    </div>
  );
};

export default CityAdminsList;
