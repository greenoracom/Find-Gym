import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { addProduct, getProductById, updateProduct } from '../../../../services/healthStoreOwnerApi';

const CATEGORIES = ['Whey Protein', 'Creatine', 'Mass Gainer', 'Pre Workout', 'Multivitamin', 'Fat Burner', 'BCAA', 'Fish Oil'];

const AddSupplement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState({
    name: '', category: 'Whey Protein', brand: '',
    shortDescription: '', description: '', benefits: '', suitableFor: '',
    ingredients: '', howToUse: '', flavor: 'Unflavored', quantity: '1kg',
    originalPrice: '', sellingPrice: '', purchaseMode: 'One-Time',
    stock: '50', lowStockAlert: '5', isReturnable: false, deliveryAvailable: true,
    submitForApproval: false
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (isEdit) {
      const fetchProduct = async () => {
        setFetching(true);
        try {
          const res = await getProductById(id);
          const p = res.data.data;
          setForm({
            name: p.name || '',
            category: p.category || 'Whey Protein',
            brand: p.brand || '',
            shortDescription: p.shortDescription || '',
            description: p.description || '',
            benefits: p.benefits?.join('\n') || '',
            suitableFor: p.suitableFor?.join('\n') || '',
            ingredients: p.ingredients || '',
            howToUse: p.howToUse || '',
            flavor: p.flavor || 'Unflavored',
            quantity: p.quantity || '1kg',
            originalPrice: p.originalPrice || '',
            sellingPrice: p.sellingPrice || '',
            purchaseMode: 'One-Time',
            stock: p.stock || '50',
            lowStockAlert: p.lowStockAlert || '5',
            isReturnable: p.isReturnable || false,
            deliveryAvailable: p.deliveryAvailable !== false,
            submitForApproval: false
          });
        } catch (err) {
          toast.error('Failed to load product details');
          navigate('/health-store-owner/supplements/list');
        } finally {
          setFetching(false);
        }
      };
      fetchProduct();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('productType', 'Supplement');

    Object.keys(form).forEach(key => {
      formData.append(key, form[key]);
    });

    images.forEach(img => {
      formData.append('images', img);
    });

    try {
      if (isEdit) {
        await updateProduct(id, formData);
        toast.success('Supplement updated successfully!');
      } else {
        await addProduct(formData);
        toast.success(form.submitForApproval ? 'Supplement submitted for approval!' : 'Supplement saved as Draft!');
      }
      navigate('/health-store-owner/supplements/list');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <div className="animate-spin w-8 h-8 border-4 border-red-650 border-t-transparent rounded-full mb-3" />
        <p className="text-gray-500 text-sm">Fetching product details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/health-store-owner/supplements/list')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors border">
          🔙 Back
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{isEdit ? 'Edit Supplement Listing' : 'Add Supplement Listing'}</h2>
          <p className="text-gray-500 text-xs mt-0.5">Define supplement specs, branding, pricing, and stock details.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border rounded-2xl p-6 shadow-sm space-y-6">
        {/* Core fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Supplement Name *</label>
            <input name="name" value={form.name} onChange={handleChange} required placeholder="e.g. 100% Whey Gold Standard"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Category *</label>
            <select name="category" value={form.category} onChange={handleChange} required
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Brand *</label>
            <input name="brand" value={form.brand} onChange={handleChange} required placeholder="e.g. Optimum Nutrition"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Flavor (e.g. Double Rich Chocolate)</label>
            <input name="flavor" value={form.flavor} onChange={handleChange} placeholder="e.g. Chocolate"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Size / Quantity (e.g. 1kg, 60 Tabs) *</label>
            <input name="quantity" value={form.quantity} onChange={handleChange} required placeholder="e.g. 2kg"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>
        </div>

        {/* Description / Info */}
        <div className="space-y-4 border-t pt-5">
          <h4 className="text-sm font-bold text-gray-750">Product Description & Specs</h4>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Short Summary *</label>
              <input name="shortDescription" value={form.shortDescription} onChange={handleChange} required placeholder="Brief tag line summary of supplement benefits"
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Detailed Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Describe product details, certifications, authenticity..."
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Key Benefits (One per line)</label>
              <textarea name="benefits" value={form.benefits} onChange={handleChange} rows={3} placeholder="24g of pure whey protein per scoop&#10;Supports muscle recovery"
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none" />
            </div>
          </div>
        </div>

        {/* Inventory & Pricing */}
        <div className="space-y-4 border-t pt-5">
          <h4 className="text-sm font-bold text-gray-750">Pricing & Inventory</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Original Price (₹) *</label>
              <input type="number" name="originalPrice" value={form.originalPrice} onChange={handleChange} required
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Discount Selling Price (₹) *</label>
              <input type="number" name="sellingPrice" value={form.sellingPrice} onChange={handleChange} required
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Stock Available *</label>
              <input type="number" name="stock" value={form.stock} onChange={handleChange} required
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Low Stock Alert Level</label>
              <input type="number" name="lowStockAlert" value={form.lowStockAlert} onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
          </div>
        </div>

        {/* Details & Policies */}
        <div className="space-y-4 border-t pt-5">
          <h4 className="text-sm font-bold text-gray-750">Policies & Flags</h4>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm font-semibold">
              <input type="checkbox" name="isReturnable" checked={form.isReturnable} onChange={handleChange}
                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500" />
              Easy Returns Available
            </label>
            <label className="flex items-center gap-2 text-sm font-semibold">
              <input type="checkbox" name="deliveryAvailable" checked={form.deliveryAvailable} onChange={handleChange}
                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500" />
              Delivery Available
            </label>
          </div>
        </div>

        {/* Media Images */}
        <div className="space-y-4 border-t pt-5">
          <h4 className="text-sm font-bold text-gray-750">Upload Images</h4>
          <div>
            <input type="file" multiple accept="image/*" onChange={handleImageChange}
              className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-red-50 file:text-red-750 hover:file:bg-red-100" />
            <p className="text-[10px] text-gray-400 mt-1">Upload up to 5 images representing the supplement product.</p>
          </div>
        </div>

        {/* Submit Approval Switch */}
        {!isEdit && (
          <div className="flex items-center gap-2 border-t pt-5">
            <input type="checkbox" id="submitForApproval" name="submitForApproval" checked={form.submitForApproval} onChange={handleChange}
              className="w-4 h-4 text-red-650 border-gray-300 rounded focus:ring-red-500" />
            <label htmlFor="submitForApproval" className="text-sm font-semibold text-gray-700">Submit directly to City Admin for live listing approval</label>
          </div>
        )}

        {/* Actions */}
        <div className="border-t pt-5 flex justify-end gap-3">
          <button type="button" onClick={() => navigate('/health-store-owner/supplements/list')}
            className="px-5 py-2.5 border rounded-xl text-gray-600 font-semibold text-sm hover:bg-gray-50">
            Cancel
          </button>
          <button type="submit" disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold text-sm px-6 py-2.5 rounded-xl transition-colors disabled:opacity-55 shadow-md">
            {loading ? 'Processing...' : (isEdit ? 'Save Changes' : (form.submitForApproval ? 'Submit Listing' : 'Save as Draft'))}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddSupplement;
