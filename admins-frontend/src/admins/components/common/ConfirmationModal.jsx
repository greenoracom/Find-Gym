import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { AlertTriangle } from 'lucide-react';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  dangerMode = false,
  loading = false
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="flex flex-col items-center text-center">
        {dangerMode ? (
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
        ) : (
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-blue-600" />
          </div>
        )}
        <p className="text-sm text-gray-500 mb-6">{message}</p>
        
        <div className="flex w-full gap-3 mt-2">
          <Button 
            variant="secondary" 
            className="flex-1" 
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            variant={dangerMode ? 'danger' : 'primary'} 
            className="flex-1" 
            onClick={onConfirm}
            loading={loading}
          >
            Confirm
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
