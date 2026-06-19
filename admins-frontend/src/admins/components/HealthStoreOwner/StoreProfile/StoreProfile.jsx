import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getStoreProfile, updateStoreProfile } from '../../../../services/healthStoreOwnerApi';

const StoreProfile = () => {
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [form, setForm] = useState({
    storeName: '', description: '', openingTime: '', closingTime: '',
    deliveryAvailable: false, deliveryRadiusKm: 10, serviceAreas: '',
    bankDetails: { bankName: '', accountHolderName: '', accountNumber: '', ifscCode: '', upiId: '' }
  });

  const [logoFile, setLogoFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);

  const fetchProfile = async () => {
    try {
      const res = await getStoreProfile();
      const s = res.data.data;
      setStore(s);
      setForm({
        storeName: s.storeName || '',
        description: s.description || '',
        openingTime: s.openingTime || '',
        closingTime: s.closingTime || '',
        deliveryAvailable: s.deliveryAvailable || false,
        deliveryRadiusKm: s.deliveryRadiusKm || 10,
        serviceAreas: s.serviceAreas?.join(', ') || '',
        bankDetails: {
          bankName: s.bankDetails?.bankName || '',
          accountHolderName: s.bankDetails?.accountHolderName || '',
          accountNumber: s.bankDetails?.accountNumber || '',
          ifscCode: s.bankDetails?.ifscCode || '',
          upiId: s.bankDetails?.upiId || '',
        }
      });
    } catch (err) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setForm(p => ({ ...p, [name]: val }));
  };

  const handleBankChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({
      ...p,
      bankDetails: { ...p.bankDetails, [name]: value }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    const formData = new FormData();
    formData.append('storeName', form.storeName);
    formData.append('description', form.description);
    formData.append('openingTime', form.openingTime);
    formData.append('closingTime', form.closingTime);
    formData.append('deliveryAvailable', form.deliveryAvailable);
    formData.append('deliveryRadiusKm', form.deliveryRadiusKm);
    
    // Split service areas by comma and trim
    const areas = form.serviceAreas.split(',').map(a => a.trim()).filter(Boolean);
    areas.forEach((area, index) => {
      formData.append(`serviceAreas[${index}]`, area);
    });

    // Append bank details
    Object.keys(form.bankDetails).forEach(key => {
      formData.append(`bankDetails[${key}]`, form.bankDetails[key]);
    });

    if (logoFile) formData.append('logo', logoFile);
    if (bannerFile) formData.append('bannerImage', bannerFile);

    try {
      const res = await updateStoreProfile(formData);
      setStore(res.data.data);
      // Update local storage too so Header updates logo/name immediately
      localStorage.setItem('hsStore', JSON.stringify(res.data.data));
      toast.success('Store profile updated successfully!');
      fetchProfile();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <div className="animate-spin w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full mb-3" />
        <p className="text-gray-500 text-sm">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Banner Preview */}
      <div className="relative h-48 w-full rounded-2xl overflow-hidden border shadow-sm bg-slate-100">
        {store?.bannerImage ? (
          <img src={store.bannerImage} alt="Banner" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold text-lg">
            {store?.storeName} Banner
          </div>
        )}
        <div className="absolute bottom-4 left-6 flex items-end gap-4">
          <div className="w-20 h-20 rounded-xl bg-white p-1 border shadow-md overflow-hidden flex items-center justify-center">
            {store?.logo ? (
              <img src={store.logo} alt="Logo" className="w-full h-full object-cover rounded-lg" />
            ) : (
              <span className="text-3xl">🏪</span>
            )}
          </div>
          <div className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] pb-1">
            <h2 className="text-xl font-bold">{store?.storeName}</h2>
            <p className="text-xs font-semibold">{store?.city} • {store?.storeType}</p>
          </div>
        </div>
      </div>

      {/* Main Profile Update Form */}
      <form onSubmit={handleSubmit} className="bg-white border rounded-2xl p-6 shadow-sm space-y-6">
        <h3 className="text-lg font-bold text-gray-800 pb-2 border-b">Store Details & Settings</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Store Name *</label>
            <input name="storeName" value={form.storeName} onChange={handleChange} required
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Service Areas (Comma separated)</label>
            <input name="serviceAreas" value={form.serviceAreas} onChange={handleChange} placeholder="e.g. Sector 15, Vashi, Koparkhairane"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Opening Time</label>
            <input type="time" name="openingTime" value={form.openingTime} onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Closing Time</label>
            <input type="time" name="closingTime" value={form.closingTime} onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Store Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3}
              placeholder="Tell customers about your store, product quality, specialization, etc..."
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none" />
          </div>
        </div>

        {/* Upload fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 border-t pt-5">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Update Logo File</label>
            <input type="file" accept="image/*" onChange={e => setLogoFile(e.target.files[0])}
              className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Update Banner Image</label>
            <input type="file" accept="image/*" onChange={e => setBannerFile(e.target.files[0])}
              className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100" />
          </div>
        </div>

        {/* Delivery settings */}
        <div className="border-t pt-5 space-y-4">
          <h4 className="text-sm font-bold text-gray-700">Delivery Information</h4>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="deliveryAvailable" name="deliveryAvailable" checked={form.deliveryAvailable} onChange={handleChange}
              className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500" />
            <label htmlFor="deliveryAvailable" className="text-sm font-medium text-gray-700">Home Delivery Available</label>
          </div>

          {form.deliveryAvailable && (
            <div className="max-w-xs">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Delivery Radius (km)</label>
              <input type="number" min={1} name="deliveryRadiusKm" value={form.deliveryRadiusKm} onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
          )}
        </div>

        {/* Bank details update */}
        <div className="border-t pt-5 space-y-4">
          <h4 className="text-sm font-bold text-gray-700">Bank Details (For Payouts)</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Bank Name</label>
              <input name="bankName" value={form.bankDetails.bankName} onChange={handleBankChange}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Account Holder Name</label>
              <input name="accountHolderName" value={form.bankDetails.accountHolderName} onChange={handleBankChange}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Account Number</label>
              <input name="accountNumber" value={form.bankDetails.accountNumber} onChange={handleBankChange}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">IFSC Code</label>
              <input name="ifscCode" value={form.bankDetails.ifscCode} onChange={handleBankChange}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="border-t pt-5 flex justify-end">
          <button type="submit" disabled={updating}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold text-sm px-6 py-2.5 rounded-xl transition-colors disabled:opacity-55 shadow-md">
            {updating ? 'Updating Profile...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StoreProfile;
