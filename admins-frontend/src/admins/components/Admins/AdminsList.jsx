import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import Table from '../common/Table';
import Badge from '../common/Badge';
import Button from '../common/Button';
import CreateAdmin from './CreateAdmin';
import ConfirmationModal from '../common/ConfirmationModal';

const AdminsList = () => {
  const [showCreate, setShowCreate] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState(null);

  const admins = [
    { id: 'ADM-001', name: 'Vikram Singh', email: 'vikram@findgym.com', phone: '+91 9876543220', status: 'Active', created: '2023-11-01', permissions: 10 },
    { id: 'ADM-002', name: 'Neha Gupta', email: 'neha@findgym.com', phone: '+91 9876543221', status: 'Active', created: '2023-12-15', permissions: 7 },
    { id: 'ADM-003', name: 'Rohan Desai', email: 'rohan@findgym.com', phone: '+91 9876543222', status: 'Inactive', created: '2024-01-10', permissions: 5 },
  ];

  const handleDelete = (admin) => {
    setAdminToDelete(admin);
    setShowDelete(true);
  };

  const confirmDelete = () => {
    // API call
    setShowDelete(false);
  };

  const columns = [
    { title: 'Admin ID', key: 'id' },
    { 
      title: 'Name', 
      key: 'name',
      render: (row) => (
        <div className="font-medium text-gray-900">{row.name}</div>
      )
    },
    { title: 'Email', key: 'email' },
    { title: 'Phone', key: 'phone' },
    { 
      title: 'Status', 
      key: 'status',
      render: (row) => (
        <Badge label={row.status} variant={row.status === 'Active' ? 'success' : 'default'} />
      )
    },
    { 
      title: 'Permissions', 
      key: 'permissions',
      render: (row) => <span className="text-gray-500">{row.permissions} permissions</span>
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
          <h1 className="text-2xl font-bold text-gray-900">Admins</h1>
          <p className="text-sm text-gray-500">Manage system administrators</p>
        </div>
        <Button variant="primary" className="flex items-center gap-2" onClick={() => setShowCreate(true)}>
          <Plus size={16} /> Create New Admin
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <Table data={admins} columns={columns} />
      </div>

      {showCreate && (
        <CreateAdmin isOpen={showCreate} onClose={() => setShowCreate(false)} />
      )}

      <ConfirmationModal
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={confirmDelete}
        title="Delete Admin"
        message={`Are you sure you want to delete ${adminToDelete?.name}? This action cannot be undone.`}
        dangerMode={true}
      />
    </div>
  );
};

export default AdminsList;
