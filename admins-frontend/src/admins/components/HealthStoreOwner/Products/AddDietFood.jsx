import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { addProduct, getProductById, updateProduct } from '../../../../services/healthStoreOwnerApi';

const CATEGORIES = ['Weight Loss', 'Muscle Gain', 'Keto', 'Diabetic Friendly', 'High Protein', 'Vegetarian', 'General Nutrition'];
const FOOD_PREFERENCES = ['Veg', 'Non-Veg', 'Eggitarian', 'Vegan'];

const AddDietFood = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState({
    name: '', category: 'Weight Loss', brand: '',
    shortDescription: '', description: '', benefits: '', suitableFor: '',
    ingredients: '', howToUse: '', duration: '1 Month', foodPreference: 'Veg',
    quantity: '1', originalPrice: '', sellingPrice: '',
    oneTimePrice: '', monthlyPrice: '', purchaseMode: 'One-Time',
    stock: '100', lowStockAlert: '10',
    calories: '', protein: '', carbs: '', fat: '',
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
            category: p.category || 'Weight Loss',
            brand: p.brand || '',
            shortDescription: p.shortDescription || '',
            description: p.description || '',
            benefits: p.benefits?.join('\n') || '',
            suitableFor: p.suitableFor?.join('\n') || '',
            ingredients: p.ingredients || '',
            howToUse: p.howToUse || '',
            duration: p.duration || '1 Month',
            foodPreference: p.foodPreference || 'Veg',
            quantity: p.quantity || '1',
            originalPrice: p.originalPrice || '',
            sellingPrice: p.sellingPrice || '',
            oneTimePrice: p.oneTimePrice || '',
            monthlyPrice: p.monthlyPrice || '',
            purchaseMode: p.purchaseMode || 'One-Time',
            stock: p.stock || '100',
            lowStockAlert: p.lowStockAlert || '10',
            calories: p.nutritionInfo?.calories || '',
            protein: p.nutritionInfo?.protein || '',
            carbs: p.nutritionInfo?.carbs || '',
            fat: p.nutritionInfo?.fat || '',
            submitForApproval: false
          });
        } catch (err) {
          toast.error('Failed to load product details');
          navigate('/health-store-owner/diet-foods/list');
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
    formData.append('productType', 'Diet');

    // Populate primary fields
    Object.keys(form).forEach(key => {
      if (['calories', 'protein', 'carbs', 'fat'].includes(key)) {
        formData.append(key, form[key]);
      } else {
        formData.append(key, form[key]);
      }
    });

    // Append image files
    images.forEach(img => {
      formData.append('images', img);
    });

    try {
      if (isEdit) {
        await updateProduct(id, formData);
        toast.success('Diet plan updated successfully!');
      } else {
        await addProduct(formData);
        toast.success(form.submitForApproval ? 'Diet plan submitted for approval!' : 'Diet plan saved as Draft!');
      }
      navigate('/health-store-owner/diet-foods/list');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <div className="animate-spin w-8 h-8 border-4 border-red-650 border-red-650/40 border-t-red-600 rounded-full mb-3" />
        <p className="text-gray-500 text-sm">Fetching product info...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/health-store-owner/diet-foods/list')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors border">
          🔙 Back
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{isEdit ? 'Edit Diet Listing' : 'Add Diet/Food Listing'}</h2>
          <p className="text-gray-500 text-xs mt-0.5">Define your diet plan structure, nutrition charts, and meal details.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border rounded-2xl p-6 shadow-sm space-y-6">
        {/* Core fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Diet Plan Name *</label>
            <input name="name" value={form.name} onChange={handleChange} required placeholder="e.g. 30-Day Ultimate Weight Loss Diet"
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
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Food Preference *</label>
            <select name="foodPreference" value={form.foodPreference} onChange={handleChange} required
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500">
              {FOOD_PREFERENCES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Duration (e.g. 1 Month, 3 Months) *</label>
            <input name="duration" value={form.duration} onChange={handleChange} required placeholder="e.g. 1 Month"
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>
        </div>

        {/* Description / Content */}
        <div className="space-y-4 border-t pt-5">
          <h4 className="text-sm font-bold text-gray-750">Details & Summary</h4>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Short Summary *</label>
              <input name="shortDescription" value={form.shortDescription} onChange={handleChange} required placeholder="A brief one-liner summary of the plan"
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Detailed Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={4} placeholder="Describe the diet plan schedules, cheat meals, customisations..."
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Key Benefits (One per line)</label>
              <textarea name="benefits" value={form.benefits} onChange={handleChange} rows={3} placeholder="Improve energy levels&#10;Reduce belly fat&#10;Better digestion"
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none" />
            </div>
          </div>
        </div>

        {/* Nutritional Information */}
        <div className="space-y-4 border-t pt-5">
          <h4 className="text-sm font-bold text-gray-750">Nutritional Stats (Approx Daily Values)</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Calories (kcal)</label>
              <input type="number" name="calories" value={form.calories} onChange={handleChange} placeholder="e.g. 1800"
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Protein (g)</label>
              <input name="protein" value={form.protein} onChange={handleChange} placeholder="e.g. 120g"
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Carbs (g)</label>
              <input name="carbs" value={form.carbs} onChange={handleChange} placeholder="e.g. 150g"
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Fat (g)</label>
              <input name="fat" value={form.fat} onChange={handleChange} placeholder="e.g. 50g"
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
          </div>
        </div>

        {/* Pricing Option */}
        <div className="space-y-4 border-t pt-5">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-gray-755">Pricing & Mode</h4>
            <div className="flex gap-4">
              <label className="flex items-center gap-1 text-sm font-semibold">
                <input type="radio" name="purchaseMode" value="One-Time" checked={form.purchaseMode === 'One-Time'} onChange={handleChange} />
                One-Time
              </label>
              <label className="flex items-center gap-1 text-sm font-semibold">
                <input type="radio" name="purchaseMode" value="Subscription" checked={form.purchaseMode === 'Subscription'} onChange={handleChange} />
                Subscription (Monthly)
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {form.purchaseMode === 'One-Time' ? (
              <>
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
              </>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Original One-Time Setup Fee (₹)</label>
                  <input type="number" name="oneTimePrice" value={form.oneTimePrice} onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Monthly Subscription Fee (₹) *</label>
                  <input type="number" name="monthlyPrice" value={form.monthlyPrice} onChange={handleChange} required
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Media Images */}
        <div className="space-y-4 border-t pt-5">
          <h4 className="text-sm font-bold text-gray-750">Upload Images</h4>
          <div>
            <input type="file" multiple accept="image/*" onChange={handleImageChange}
              className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-red-50 file:text-red-750 hover:file:bg-red-100" />
            <p className="text-[10px] text-gray-400 mt-1">Upload up to 5 images representing the meal plan or food items.</p>
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
          <button type="button" onClick={() => navigate('/health-store-owner/diet-foods/list')}
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

export default AddDietFood;
