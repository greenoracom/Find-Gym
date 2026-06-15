import React, { useState, useEffect } from 'react';
import { getAllGymCategories, createGymCategory, updateGymCategory, deleteGymCategory } from '../../../../services/adminApi';

const GymCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', imageUrl: '', isActive: true });
  
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await getAllGymCategories();
      if (res.success) {
        setCategories(res.data.categories);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch gym categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({ name: category.name, imageUrl: category.imageUrl, isActive: category.isActive });
    } else {
      setEditingCategory(null);
      setFormData({ name: '', imageUrl: '', isActive: true });
    }
    setError('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({ name: '', imageUrl: '', isActive: true });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await updateGymCategory(editingCategory._id, formData);
      } else {
        await createGymCategory(formData);
      }
      closeModal();
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save gym category');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this gym category?')) {
      try {
        await deleteGymCategory(id);
        fetchCategories();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete gym category');
      }
    }
  };

  const handleToggleStatus = async (category) => {
    try {
      await updateGymCategory(category._id, { isActive: !category.isActive });
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  if (loading && categories.length === 0) {
    return <div className="p-8 text-center text-slate-500">Loading categories...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gym Categories</h1>
          <p className="text-sm text-slate-500">Manage categories available for gyms</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 shadow-sm"
        >
          <span>➕</span>
          <span>Add Category</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm">
                <th className="px-6 py-4 font-medium">Image</th>
                <th className="px-6 py-4 font-medium">Category Name</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {categories.map((category) => (
                <tr key={category._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    {category.imageUrl ? (
                      <img src={category.imageUrl} alt={category.name} className="w-16 h-12 object-cover rounded-md border border-slate-200" />
                    ) : (
                      <div className="w-16 h-12 bg-slate-100 rounded-md border border-slate-200 flex items-center justify-center text-slate-400 text-xs">
                        No Img
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900">{category.name}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleStatus(category)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                        category.isActive 
                          ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' 
                          : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                      }`}
                    >
                      {category.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-3 text-sm">
                      <button
                        onClick={() => openModal(category)}
                        className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(category._id)}
                        className="text-red-600 hover:text-red-800 font-medium transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-slate-500">
                    No gym categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">
                {editingCategory ? 'Edit Gym Category' : 'Add Gym Category'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              {error && (
                <div className="mb-4 bg-red-50 text-red-700 p-3 rounded-lg text-sm border border-red-100">
                  {error}
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="e.g. Yoga, Crossfit"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Image URL</label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="https://example.com/image.jpg"
                  />
                  {formData.imageUrl && (
                    <div className="mt-2">
                      <p className="text-xs text-slate-500 mb-1">Image Preview:</p>
                      <img src={formData.imageUrl} alt="Preview" className="h-20 rounded border border-slate-200 object-cover" onError={(e) => e.target.style.display = 'none'} />
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-orange-600 rounded border-slate-300 focus:ring-orange-500"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-slate-700">
                    Category is Active
                  </label>
                </div>
              </div>

              <div className="mt-8 flex space-x-3 justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium shadow-sm transition-colors"
                >
                  {editingCategory ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GymCategories;
