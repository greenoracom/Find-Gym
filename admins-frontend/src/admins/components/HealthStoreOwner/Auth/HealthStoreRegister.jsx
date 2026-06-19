import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { validateInviteToken, registerHealthStore } from '../../../../services/healthStoreOwnerApi';

const HealthStoreRegister = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [inviteData, setInviteData] = useState(null);
  const [checking, setChecking] = useState(true);
  const [loading, setLoading] = useState(false);

  // Form Fields
  const [form, setForm] = useState({
    description: '', alternateMobile: '',
    address: '', state: '', pincode: '', landmark: '',
    gstNumber: '', fssaiLicenseNumber: '', businessRegistrationNumber: '', panNumber: '',
    openingTime: '09:00', closingTime: '21:00',
    deliveryAvailable: true, deliveryRadiusKm: '10', serviceAreas: '',
    bankName: '', accountHolderName: '', accountNumber: '', ifscCode: '', upiId: '',
  });

  // Files
  const [logo, setLogo] = useState(null);
  const [banner, setBanner] = useState(null);
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const res = await validateInviteToken(token);
        setInviteData(res.data.data);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Invalid or expired invite token');
      } finally {
        setChecking(false);
      }
    };
    checkToken();
  }, [token]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleDocChange = (e) => {
    setDocs(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    
    // Add text inputs
    Object.keys(form).forEach(key => {
      formData.append(key, form[key]);
    });

    // Add files
    if (logo) formData.append('logo', logo);
    if (banner) formData.append('bannerImage', banner);
    docs.forEach(docFile => {
      formData.append('documents', docFile);
    });

    try {
      await registerHealthStore(token, formData);
      toast.success('Registration submitted! City Admin will review and verify details.');
      setForm({});
      setInviteData(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center">
        <div className="animate-spin w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full mb-3" />
        <p className="text-gray-400">Verifying store invite...</p>
      </div>
    );
  }

  if (!inviteData) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center p-6 text-center">
        <span className="text-5xl mb-4">🏪</span>
        <h2 className="text-2xl font-bold text-red-500">Invalid or Expired Invite Link</h2>
        <p className="text-gray-400 max-w-md mt-2">
          This registration invite is expired, invalid, or has already been used. Please contact your assigned City Admin for a new invitation.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Intro */}
        <div className="text-center">
          <span className="text-4xl">🏪</span>
          <h2 className="text-3xl font-extrabold text-white mt-2">Health Store Onboarding</h2>
          <p className="text-gray-400 text-sm mt-1">Complete your registration for <span className="text-red-500 font-bold">{inviteData.storeName}</span></p>
        </div>

        <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-8">
          {/* Read-Only Details */}
          <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-red-400 uppercase tracking-widest">Invited Store Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-zinc-500 text-xs">Store Name</p>
                <p className="font-semibold text-zinc-300">{inviteData.storeName}</p>
              </div>
              <div>
                <p className="text-zinc-500 text-xs">Owner Name</p>
                <p className="font-semibold text-zinc-300">{inviteData.ownerName}</p>
              </div>
              <div>
                <p className="text-zinc-500 text-xs">Owner Email</p>
                <p className="font-semibold text-zinc-300">{inviteData.ownerEmail}</p>
              </div>
              <div>
                <p className="text-zinc-500 text-xs">Mobile Number</p>
                <p className="font-semibold text-zinc-300">{inviteData.ownerMobile}</p>
              </div>
              <div>
                <p className="text-zinc-500 text-xs">City</p>
                <p className="font-semibold text-zinc-300">{inviteData.city}</p>
              </div>
              <div>
                <p className="text-zinc-500 text-xs">Store Type</p>
                <p className="font-semibold text-red-500">{inviteData.storeType}</p>
              </div>
            </div>
          </div>

          {/* Business description & Timings */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white border-b border-zinc-800 pb-2">1. Store Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Store Description *</label>
                <textarea required name="description" value={form.description} onChange={handleChange} rows={3}
                  placeholder="Describe your store offerings, brands, and custom meal plans..."
                  className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none text-zinc-200" />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Opening Time</label>
                <input type="time" name="openingTime" value={form.openingTime} onChange={handleChange}
                  className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 text-zinc-200" />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Closing Time</label>
                <input type="time" name="closingTime" value={form.closingTime} onChange={handleChange}
                  className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 text-zinc-200" />
              </div>
            </div>
          </div>

          {/* Location & Address */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white border-b border-zinc-800 pb-2">2. Address & Logistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Full Address *</label>
                <input required name="address" value={form.address} onChange={handleChange} placeholder="Shop no, Building, Street address..."
                  className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 text-zinc-200" />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">State *</label>
                <input required name="state" value={form.state} onChange={handleChange} placeholder="e.g. Maharashtra"
                  className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 text-zinc-200" />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Pincode *</label>
                <input required name="pincode" value={form.pincode} onChange={handleChange} placeholder="e.g. 400703"
                  className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 text-zinc-200" />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Landmark</label>
                <input name="landmark" value={form.landmark} onChange={handleChange} placeholder="e.g. Near HDFC Bank"
                  className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 text-zinc-200" />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Alternate Mobile Number</label>
                <input name="alternateMobile" value={form.alternateMobile} onChange={handleChange} placeholder="Backup mobile number..."
                  className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 text-zinc-200" />
              </div>
            </div>
          </div>

          {/* Legal / Licensing */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white border-b border-zinc-800 pb-2">3. Business Registration & Legal</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">FSSAI License Number (Optional for Supplement only)</label>
                <input name="fssaiLicenseNumber" value={form.fssaiLicenseNumber} onChange={handleChange} placeholder="14-digit FSSAI Number"
                  className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 text-zinc-200" />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">GST Number (Optional)</label>
                <input name="gstNumber" value={form.gstNumber} onChange={handleChange} placeholder="GSTIN Number"
                  className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 text-zinc-200" />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Business License Number *</label>
                <input required name="businessRegistrationNumber" value={form.businessRegistrationNumber} onChange={handleChange} placeholder="Shop License / Gumasta Number"
                  className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 text-zinc-200" />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Company PAN Number *</label>
                <input required name="panNumber" value={form.panNumber} onChange={handleChange} placeholder="10-digit PAN ID"
                  className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 text-zinc-200" />
              </div>
            </div>
          </div>

          {/* Bank details */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white border-b border-zinc-800 pb-2">4. Payout Bank Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Bank Name *</label>
                <input required name="bankName" value={form.bankName} onChange={handleChange} placeholder="e.g. ICICI Bank"
                  className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 text-zinc-200" />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Account Holder Name *</label>
                <input required name="accountHolderName" value={form.accountHolderName} onChange={handleChange} placeholder="Name as per Passbook"
                  className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 text-zinc-200" />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Account Number *</label>
                <input required name="accountNumber" value={form.accountNumber} onChange={handleChange} placeholder="Account Number"
                  className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 text-zinc-200" />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Bank IFSC Code *</label>
                <input required name="ifscCode" value={form.ifscCode} onChange={handleChange} placeholder="11-digit IFSC"
                  className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 text-zinc-200" />
              </div>
            </div>
          </div>

          {/* Files */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white border-b border-zinc-800 pb-2">5. Verification Documents Upload</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Store Logo File *</label>
                <input required type="file" accept="image/*" onChange={e => setLogo(e.target.files[0])}
                  className="w-full text-xs text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-white hover:file:bg-zinc-700" />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Store Banner Image *</label>
                <input required type="file" accept="image/*" onChange={e => setBanner(e.target.files[0])}
                  className="w-full text-xs text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-white hover:file:bg-zinc-700" />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Business Proof PDFs (Gumasta/PAN/FSSAI) *</label>
                <input required type="file" multiple accept=".pdf,image/*" onChange={handleDocChange}
                  className="w-full text-xs text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-white hover:file:bg-zinc-700" />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="border-t border-zinc-800 pt-6 flex justify-end">
            <button type="submit" disabled={loading}
              className="bg-red-600 hover:bg-red-750 text-white font-bold text-sm px-8 py-3.5 rounded-xl shadow-lg shadow-red-500/25 transition-all transform active:scale-95 disabled:opacity-50">
              {loading ? 'Submitting Registration...' : 'Complete & Submit Registration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HealthStoreRegister;
