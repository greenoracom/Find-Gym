import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import FormInput from '../common/FormInput';

const CreateAdmin = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    status: 'Active',
    permissions: []
  });

  const permissionOptions = [
    'View Dashboard', 'Manage Users', 'Manage Gyms', 'Manage Trainers', 
    'Manage Dietitians', 'Manage Payments', 'Manage CMS', 'View Reports', 
    'Manage Admins', 'Export Data'
  ];

  const handlePermissionToggle = (perm) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(perm)
        ? prev.permissions.filter(p => p !== perm)
        : [...prev.permissions, perm]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit logic
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Admin" size="lg">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput 
            label="Full Name" 
            placeholder="Enter full name" 
            required 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
          <FormInput 
            label="Email" 
            type="email" 
            placeholder="Enter email address" 
            required 
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          <FormInput 
            label="Phone" 
            type="tel" 
            placeholder="+91" 
            required 
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
          />
          <div className="mb-4">
            <label className="block text-sm font-bold text-gray-700 mb-1">Status</label>
            <div className="flex gap-4 mt-2">
              <label className="flex items-center gap-2">
                <input 
                  type="radio" 
                  name="status" 
                  value="Active"
                  checked={formData.status === 'Active'}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="text-primary focus:ring-primary"
                />
                Active
              </label>
              <label className="flex items-center gap-2">
                <input 
                  type="radio" 
                  name="status" 
                  value="Inactive"
                  checked={formData.status === 'Inactive'}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="text-primary focus:ring-primary"
                />
                Inactive
              </label>
            </div>
          </div>
          <FormInput 
            label="Password" 
            type="password" 
            placeholder="Minimum 8 characters" 
            required 
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
          <FormInput 
            label="Confirm Password" 
            type="password" 
            placeholder="Confirm password" 
            required 
            value={formData.confirmPassword}
            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
          />
        </div>

        <div className="mt-6 border-t border-gray-100 pt-6">
          <h4 className="text-sm font-bold text-gray-700 mb-4">Permissions</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {permissionOptions.map(perm => (
              <label key={perm} className="flex items-center gap-2 text-sm text-gray-700">
                <input 
                  type="checkbox" 
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                  checked={formData.permissions.includes(perm)}
                  onChange={() => handlePermissionToggle(perm)}
                />
                {perm}
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-3 mt-8 pt-4 border-t border-gray-100 justify-end">
          <Button variant="secondary" type="button" onClick={onClose}>Cancel</Button>
          <Button variant="primary" type="submit">Create Admin</Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateAdmin;
