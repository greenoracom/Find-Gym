import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import Table from '../../common/Table';
import Badge from '../../common/Badge';
import Button from '../../common/Button';
import { getAllTrainers } from '../../../../services/superApi';

const TrainersList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTrainers = async () => {
    try {
      setLoading(true);
      const res = await getAllTrainers();
      if (res.data && res.data.trainers) {
        const formattedTrainers = res.data.trainers.map(t => ({
          id: t._id,
          name: t.name,
          email: t.email,
          phone: t.phone || 'N/A',
          gym: t.associatedGym || 'Independent',
          status: t.status ? (t.status.charAt(0).toUpperCase() + t.status.slice(1)) : 'Pending',
          rating: t.rating?.average || 0
        }));
        setTrainers(formattedTrainers);
      }
    } catch (err) {
      console.error("Failed to load trainers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainers();
  }, []);

  const columns = [
    { title: 'Trainer ID', key: 'id' },
    { 
      title: 'Trainer', 
      key: 'name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center font-bold text-xs">
            {row.name ? row.name.charAt(0) : '?'}
          </div>
          <div>
            <div className="font-medium text-gray-900">{row.name}</div>
            <div className="text-xs text-gray-500">{row.email}</div>
          </div>
        </div>
      )
    },
    { title: 'Associated Gym', key: 'gym' },
    { 
      title: 'Verification', 
      key: 'status',
      render: (row) => {
        const variants = { 'Approved': 'success', 'Pending': 'warning', 'Rejected': 'danger', 'Active': 'success', 'Blocked': 'danger', 'Suspended': 'danger' };
        const label = row.status === 'Blocked' ? 'Blocked' : row.status;
        return <Badge label={label} variant={variants[row.status] || 'default'} />;
      }
    },
    { 
      title: 'Rating', 
      key: 'rating',
      render: (row) => <span className="text-yellow-500 font-medium">★ {row.rating}</span>
    },
    { 
      title: 'Actions', 
      key: 'actions',
      render: (row) => {
        const handleToggleStatus = async () => {
          const newStatus = row.status === 'Active' || row.status === 'Approved' ? 'blocked' : 'active';
          if (!window.confirm(`Are you sure you want to ${newStatus === 'active' ? 'activate' : 'suspend'} this trainer?`)) return;
          try {
            const { updateTrainerStatus } = await import('../../../../services/superApi');
            const response = await updateTrainerStatus(row.id, newStatus);
            if (response.data && response.data.success) {
              fetchTrainers();
            } else {
              alert('Failed to update status.');
            }
          } catch (error) {
            console.error(error);
            alert('Failed to update status.');
          }
        };

        const handleView = () => {
          setSelectedTrainerForModal(row);
        };

        return (
          <div className="flex gap-2">
             <Button variant="secondary" size="sm" onClick={handleView}>View</Button>
             <Button variant="secondary" size="sm" className="text-red-500" onClick={handleToggleStatus}>
               {row.status === 'Active' || row.status === 'Approved' ? 'Suspend' : 'Activate'}
             </Button>
          </div>
        );
      }
    },
  ];

  const [selectedTrainerForModal, setSelectedTrainerForModal] = useState(null);

  const filteredTrainers = trainers.filter(trainer => 
    trainer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trainer.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Trainers</h1>
          <p className="text-sm text-gray-500">Manage trainers and verify certifications</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search trainers..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>
        </div>
        <Table data={filteredTrainers} columns={columns} />
      </div>

      {selectedTrainerForModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 flex flex-col p-6 animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-slate-900 mb-4">{selectedTrainerForModal.name}'s Profile</h3>
            <div className="space-y-3 text-left">
              <div><strong className="text-sm text-gray-500">Email:</strong> <span className="text-gray-900 text-sm font-medium">{selectedTrainerForModal.email}</span></div>
              <div><strong className="text-sm text-gray-500">Phone:</strong> <span className="text-gray-900 text-sm font-medium">{selectedTrainerForModal.phone}</span></div>
              <div><strong className="text-sm text-gray-500">Associated Gym:</strong> <span className="text-gray-900 text-sm font-medium">{selectedTrainerForModal.gym}</span></div>
              <div><strong className="text-sm text-gray-500">Rating:</strong> <span className="text-gray-900 text-sm font-medium">★ {selectedTrainerForModal.rating}</span></div>
              <div><strong className="text-sm text-gray-500">Status:</strong> <span className="text-gray-900 text-sm font-medium">{selectedTrainerForModal.status}</span></div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="secondary" onClick={() => setSelectedTrainerForModal(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainersList;
