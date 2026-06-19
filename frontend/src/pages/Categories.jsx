import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  getPublicDiets,
  getPublicSupplements,
  createRazorpayOrder,
  verifyRazorpayPayment
} from '../userServices/publicHealthStoreApi';

// Star Rating helper
const StarRating = ({ rating = 4.5 }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map((i) => (
      <span key={i} className={`text-sm ${i <= Math.floor(rating) ? 'text-yellow-400' : 'text-gray-700'}`}>
        ★
      </span>
    ))}
    <span className="text-gray-400 text-xs font-semibold ml-1">{rating}</span>
  </div>
);

// Dynamic script loader for Razorpay
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Categories = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('diet');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Selected Detail Modal
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [purchaseType, setPurchaseType] = useState('One Time'); // 'One Time' or 'Monthly'
  const [checkoutAddress, setCheckoutAddress] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const isDiet = activeTab === 'diet';

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let res;
      if (isDiet) {
        res = await getPublicDiets({ search });
      } else {
        res = await getPublicSupplements({ search });
      }
      setItems(res.data || []);
    } catch (err) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [activeTab, search]);

  const handleLocateUser = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser.');
      return;
    }
    
    toast.loading('Detecting current location...', { id: 'geo' });
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          if (data && data.display_name) {
            setCheckoutAddress(data.display_name);
            toast.success('Location detected!', { id: 'geo' });
          } else {
            setCheckoutAddress(`${latitude}, ${longitude}`);
            toast.success('Location set to coordinates.', { id: 'geo' });
          }
        } catch (err) {
          setCheckoutAddress(`${latitude}, ${longitude}`);
          toast.success('Location set to coordinates.', { id: 'geo' });
        }
      },
      (err) => {
        toast.error('Unable to retrieve location: ' + err.message, { id: 'geo' });
      }
    );
  };

  const handleCheckout = async (product) => {
    const userToken = localStorage.getItem('userToken');
    if (!userToken) {
      toast.error('Please login first to purchase plans or supplements.');
      navigate('/login');
      return;
    }

    if (!checkoutAddress.trim()) {
      toast.error('Please enter a delivery address.');
      return;
    }

    setCheckoutLoading(true);

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error('Razorpay SDK failed to load. Are you online?');
        setCheckoutLoading(false);
        return;
      }

      // Prepare order details
      const orderPayload = {
        storeId: product.healthStore._id || product.healthStore,
        address: checkoutAddress,
        items: [
          {
            productId: product._id,
            quantity: 1,
            purchaseType: product.productType === 'Diet' && purchaseType === 'Monthly' ? 'Monthly' : 'One Time'
          }
        ]
      };

      const res = await createRazorpayOrder(orderPayload);
      const orderData = res.data;

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Find Gym Health Store',
        description: `Order for ${product.name}`,
        image: product.images?.[0] || 'https://lh3.googleusercontent.com/d/1w8lK1Hw1h...',
        order_id: orderData.razorpayOrderId,
        handler: async (response) => {
          try {
            const verificationPayload = {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              orderId: orderData.orderId
            };
            const verifyRes = await verifyRazorpayPayment(verificationPayload);
            toast.success(verifyRes.message || 'Payment verified! Order placed.');
            setSelectedProduct(null);
            setCheckoutAddress('');
            fetchProducts(); // refresh stock
          } catch (verifyErr) {
            toast.error(verifyErr.message || 'Payment verification failed');
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: ''
        },
        theme: {
          color: isDiet ? '#22c55e' : '#ef4444'
        }
      };

      const rzpInstance = new window.Razorpay(options);
      rzpInstance.open();
    } catch (err) {
      toast.error(err.message || 'Failed to place order');
    } finally {
      setCheckoutLoading(false);
    }
  };

  const dietBg = 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1920&auto=format&fit=crop';
  const suppBg = 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?q=80&w=1920&auto=format&fit=crop';

  return (
    <div className="min-h-screen bg-[#111215] text-white font-sans">
      {/* Hero Section */}
      <div className="relative overflow-hidden" style={{ minHeight: '520px' }}>
        <div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-700"
          style={{ backgroundImage: `url(${dietBg})`, opacity: isDiet ? 1 : 0 }}
        />
        <div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-700"
          style={{ backgroundImage: `url(${suppBg})`, opacity: isDiet ? 0 : 1 }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#111215]/80 via-[#111215]/70 to-[#111215] z-10" />

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
          {/* Tabs */}
          <div className="flex items-center justify-center mb-14">
            <div className="inline-flex bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-1.5 gap-1">
              <button
                onClick={() => { setActiveTab('diet'); setSearch(''); }}
                className={`relative flex items-center gap-2.5 px-7 py-3 rounded-xl font-semibold text-sm transition-all duration-300 cursor-pointer ${
                  isDiet ? 'bg-white/[0.08] text-white shadow-lg' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <span>🥗</span>
                <span>Diet Plans</span>
                {isDiet && <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-10 h-0.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]" />}
              </button>

              <button
                onClick={() => { setActiveTab('supplements'); setSearch(''); }}
                className={`relative flex items-center gap-2.5 px-7 py-3 rounded-xl font-semibold text-sm transition-all duration-300 cursor-pointer ${
                  !isDiet ? 'bg-white/[0.08] text-white shadow-lg' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <span>💊</span>
                <span>Supplements</span>
                {!isDiet && <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-10 h-0.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]" />}
              </button>
            </div>
          </div>

          {/* Hero text */}
          <div className="max-w-lg">
            <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold uppercase tracking-widest mb-5 transition-all duration-500 ${
              isDiet ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
            }`}>
              {isDiet ? '🥦 Nutrition & Diet' : '⚡ Premium Supplements'}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-3">
              Choose Your <br />
              <span className={isDiet ? 'text-green-400' : 'text-red-400'}>Health Path</span>
            </h1>
            <p className="text-gray-300 text-base leading-relaxed">
              {isDiet ? 'Nutrition and diet plans tailored for your goals' : 'Premium supplements for better performance'}
            </p>
          </div>
        </div>
      </div>

      {/* Search & Grid Listings */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-20 relative z-15">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className={`w-1 h-6 rounded-full ${isDiet ? 'bg-green-500' : 'bg-red-500'}`} />
            <p className="text-gray-400 text-sm font-semibold uppercase tracking-widest">
              {isDiet ? 'Available Diet Plans' : 'Available Supplements'}
            </p>
          </div>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={`🔍 Search ${isDiet ? 'diet plans...' : 'supplements...'}`}
            className="w-full sm:max-w-xs bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-red-500 text-zinc-300"
          />
        </div>

        {loading ? (
          <div className="py-24 text-center">
            <div className={`animate-spin w-8 h-8 border-4 ${isDiet ? 'border-green-500' : 'border-red-500'} border-t-transparent rounded-full mx-auto mb-3`} />
            <p className="text-gray-400">Loading catalog...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="py-24 text-center border border-zinc-850 rounded-2xl bg-zinc-900/20">
            <p className="text-3xl mb-2">🍏</p>
            <p className="text-gray-400 font-medium">No live listings found matching your search</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {items.map((item) => {
              const price = item.purchaseMode === 'Subscription' ? item.monthlyPrice : (item.sellingPrice || item.oneTimePrice || 133);
              const cleanTitle = item.name.split(" - ")[0];
              const cleanDesc = (item.shortDescription || item.description || "")
                .replace(/^(short\s+summary|summary):\s*/i, "");

              if (isDiet) {
                return (
                  <div
                    key={item._id}
                    onClick={() => { setSelectedProduct(item); setPurchaseType(item.purchaseMode === 'Subscription' ? 'Monthly' : 'One Time'); }}
                    className="group relative flex flex-col sm:flex-row bg-white/[0.02] backdrop-blur-xl border border-white/10 hover:border-green-500/40 rounded-[1.8rem] p-6 hover:shadow-[0_0_30px_rgba(34,197,94,0.08)] transition-all duration-300 shadow-2xl cursor-pointer gap-6 text-left"
                  >
                    {/* Left: Image Container */}
                    <div className="relative w-full sm:w-[30%] aspect-[4/3] sm:aspect-auto sm:self-stretch rounded-2xl overflow-hidden bg-zinc-950 flex-shrink-0 border border-zinc-900">
                      {item.images?.[0] ? (
                        <img src={item.images[0]} alt={cleanTitle} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-5xl bg-zinc-900">🥗</div>
                      )}
                      {/* Live Badge */}
                      <span className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-[10px] font-extrabold text-white px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-1.5 z-10">
                        <span className="w-2 h-2 rounded-full bg-[#22c55e]"></span>
                        <span>LIVE</span>
                      </span>
                    </div>

                    {/* Right: Info */}
                    <div className="flex flex-col justify-between flex-grow">
                      <div>
                        {/* Live Badge Group */}
                        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#0d1c12] border border-[#142d1a] text-[#22c55e] text-[9.5px] font-black uppercase tracking-wider mb-2.5">
                          {item.brand || 'FIND GYM LIVE'}
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-bold text-white leading-tight mb-1.5 tracking-tight group-hover:text-green-400 transition-colors">
                          {cleanTitle}
                        </h3>

                        {/* Description */}
                        <p className="text-zinc-400 text-xs leading-relaxed line-clamp-2 mb-4 font-normal">
                          {cleanDesc || "A balanced diet plan designed to support your fitness journey with nutritious meals."}
                        </p>

                        {/* Specs grid */}
                        <div className="grid grid-cols-4 gap-2 mb-4">
                          <div className="flex flex-col items-start">
                            <svg className="w-5 h-5 text-[#22c55e]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M2 22c1.25-3.25 4.5-9.5 9-13.5 4.5-4 9-5.5 10-4.5s-.5 5.5-4.5 10c-4 4.5-10.25 7.75-13.5 9z" />
                              <path d="M2 22l7-7" />
                            </svg>
                            <span className="text-xs font-bold text-white mt-1.5 leading-none">{item.foodType || 'Vegetarian'}</span>
                            <span className="text-[10px] text-zinc-550 mt-1 font-medium">Food Type</span>
                          </div>
                          
                          <div className="flex flex-col items-start border-l border-zinc-800/80 pl-3">
                            <svg className="w-5 h-5 text-[#22c55e]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2 .5 3.5 1.5 4.5 2 2 3 5 1.5 7.5A5.5 5.5 0 118.5 14.5z" />
                            </svg>
                            <span className="text-xs font-bold text-white mt-1.5 leading-none">{item.nutritionInfo?.calories || '1200'} kcal</span>
                            <span className="text-[10px] text-zinc-550 mt-1 font-medium">Calories</span>
                          </div>
                          
                          <div className="flex flex-col items-start border-l border-zinc-800/80 pl-3">
                            <svg className="w-5 h-5 text-[#22c55e]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="9" />
                              <polyline points="12 6 12 12 16 12" />
                            </svg>
                            <span className="text-xs font-bold text-white mt-1.5 leading-none">{item.duration || '1-Day Plan'}</span>
                            <span className="text-[10px] text-zinc-550 mt-1 font-medium">Meal Plan</span>
                          </div>
                          
                          <div className="flex flex-col items-start border-l border-zinc-800/80 pl-3">
                            <svg className="w-5 h-5 text-[#22c55e]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M9 20v-6m4 6V9m4 11V5" />
                            </svg>
                            <span className="text-xs font-bold text-white mt-1.5 leading-none">Balanced</span>
                            <span className="text-[10px] text-zinc-550 mt-1 font-medium">Nutrition</span>
                          </div>
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="flex items-center justify-between pt-3.5 border-t border-zinc-800/80 mt-auto">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl font-bold text-white tracking-tight">₹{price}</span>
                          <span className="flex items-center px-2.5 py-0.5 text-[10px] font-bold bg-[#0d1c12] border border-[#142d1a] text-[#22c55e] rounded-full">
                            <svg className="w-3 h-3 text-[#22c55e] mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581a1.5 1.5 0 002.122 0l4.318-4.318a1.5 1.5 0 000-2.122L11.159 3.659A2.25 2.25 0 009.568 3z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                            </svg>
                            Affordable Plan
                          </span>
                        </div>

                        <button className="bg-[#22c55e] hover:bg-green-500 text-white font-bold py-2.5 px-5 rounded-xl text-xs flex items-center gap-1.5 transition-all duration-300 shadow-md whitespace-nowrap flex-shrink-0">
                          <span>View Plan Details</span>
                          <svg className="w-3.5 h-3.5 text-white flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              } else {
                // Return horizontal Supplement card matching the diet layout style (in red/orange theme)
                return (
                  <div
                    key={item._id}
                    onClick={() => { setSelectedProduct(item); setPurchaseType(item.purchaseMode === 'Subscription' ? 'Monthly' : 'One Time'); }}
                    className="group relative flex flex-col sm:flex-row bg-white/[0.02] backdrop-blur-xl border border-white/10 hover:border-red-500/40 rounded-[1.8rem] p-6 hover:shadow-[0_0_30px_rgba(239,68,68,0.08)] transition-all duration-300 shadow-2xl cursor-pointer gap-6 text-left"
                  >
                    {/* Left: Image Container */}
                    <div className="relative w-full sm:w-[30%] aspect-[4/3] sm:aspect-auto sm:self-stretch rounded-2xl overflow-hidden bg-zinc-950 flex-shrink-0 border border-zinc-900">
                      {item.images?.[0] ? (
                        <img src={item.images[0]} alt={cleanTitle} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-5xl bg-zinc-900">💊</div>
                      )}
                      {/* Store Badge */}
                      <span className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-[10px] font-extrabold text-white px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-1.5 z-10">
                        <span className="w-2 h-2 rounded-full bg-[#ef4444]"></span>
                        <span>STORE</span>
                      </span>
                    </div>

                    {/* Right: Info */}
                    <div className="flex flex-col justify-between flex-grow">
                      <div>
                        {/* Brand Badge Group */}
                        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#1c0d0d] border border-[#2d1414] text-[#ef4444] text-[9.5px] font-black uppercase tracking-wider mb-2.5">
                          {item.brand || 'FIND GYM STORE'}
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-bold text-white leading-tight mb-1.5 tracking-tight group-hover:text-red-400 transition-colors">
                          {cleanTitle}
                        </h3>

                        {/* Description */}
                        <p className="text-zinc-400 text-xs leading-relaxed line-clamp-2 mb-4 font-normal">
                          {cleanDesc || "Premium quality supplements to optimize your training results and recovery."}
                        </p>

                        {/* Specs grid */}
                        <div className="grid grid-cols-4 gap-2 mb-4">
                          <div className="flex flex-col items-start">
                            <svg className="w-5 h-5 text-[#ef4444]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                              <line x1="12" y1="22.08" x2="12" y2="12" />
                            </svg>
                            <span className="text-xs font-bold text-white mt-1.5 leading-none truncate max-w-[50px]">{item.quantity || '1 unit'}</span>
                            <span className="text-[10px] text-zinc-550 mt-1 font-medium">Quantity</span>
                          </div>
                          
                          <div className="flex flex-col items-start border-l border-zinc-800/80 pl-3">
                            <svg className="w-5 h-5 text-[#ef4444]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                            <span className="text-xs font-bold text-white mt-1.5 leading-none">4.8 Rating</span>
                            <span className="text-[10px] text-zinc-550 mt-1 font-medium">Feedback</span>
                          </div>
                          
                          <div className="flex flex-col items-start border-l border-zinc-800/80 pl-3">
                            <svg className="w-5 h-5 text-[#ef4444]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M13 2L3 14h9l-1 8 10-10h-9l1-8z" />
                            </svg>
                            <span className="text-xs font-bold text-white mt-1.5 leading-none">Premium</span>
                            <span className="text-[10px] text-zinc-550 mt-1 font-medium">Category</span>
                          </div>
                          
                          <div className="flex flex-col items-start border-l border-zinc-800/80 pl-3">
                            <svg className="w-5 h-5 text-[#ef4444]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            </svg>
                            <span className="text-xs font-bold text-white mt-1.5 leading-none">100% Safe</span>
                            <span className="text-[10px] text-zinc-550 mt-1 font-medium">Authentic</span>
                          </div>
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="flex items-center justify-between pt-3.5 border-t border-zinc-800/80 mt-auto">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl font-bold text-white tracking-tight">₹{price}</span>
                          <span className="flex items-center px-2.5 py-0.5 text-[10px] font-bold bg-[#1c0d0d] border border-[#2d1414] text-[#ef4444] rounded-full">
                            <svg className="w-3 h-3 text-[#ef4444] mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581a1.5 1.5 0 002.122 0l4.318-4.318a1.5 1.5 0 000-2.122L11.159 3.659A2.25 2.25 0 009.568 3z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                            </svg>
                            Authentic Product
                          </span>
                        </div>

                        <button className="bg-[#ef4444] hover:bg-red-600 text-white font-bold py-2.5 px-5 rounded-xl text-xs flex items-center gap-1.5 transition-all duration-300 shadow-md whitespace-nowrap flex-shrink-0">
                          <span>View Product Details</span>
                          <svg className="w-3.5 h-3.5 text-white flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }
            })}
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0e1013] border border-zinc-800/80 rounded-[2rem] max-w-4xl w-full p-6 md:p-8 shadow-2xl relative overflow-hidden max-h-[95vh] flex flex-col">
            {/* Close Button */}
            <button
              onClick={() => { setSelectedProduct(null); setCheckoutAddress(''); }}
              className="absolute top-5 right-5 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full p-2 transition-all cursor-pointer z-10"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Main content grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 overflow-y-auto pr-1">
              
              {/* Left Column: Image & Nutrition Specs & What's Included */}
              <div className="space-y-6">
                {/* Product Image Card */}
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950">
                  {selectedProduct.images?.[0] ? (
                    <img src={selectedProduct.images[0]} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl">
                      {isDiet ? '🥗' : '💊'}
                    </div>
                  )}
                  {/* Badge */}
                  <span className={`absolute top-4 left-4 text-[11px] font-extrabold uppercase px-3 py-1.5 rounded-lg backdrop-blur-md border ${
                    isDiet ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
                  }`}>
                    {selectedProduct.brand || (isDiet ? 'NUTRITION PLAN' : 'PREMIUM SUPPLEMENT')}
                  </span>
                </div>

                {/* Nutrition grid (Calories, Protein, Carbs, Fat) */}
                {selectedProduct.nutritionInfo?.calories ? (
                  <div className="grid grid-cols-4 gap-3">
                    <div className="bg-[#12151a] border border-zinc-800/80 rounded-xl p-3 text-center">
                      <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Calories</p>
                      <p className="font-extrabold text-white text-lg mt-0.5">{selectedProduct.nutritionInfo.calories}</p>
                      <p className="text-[9px] text-gray-500">kcal</p>
                    </div>
                    <div className="bg-[#12151a] border border-zinc-800/80 rounded-xl p-3 text-center">
                      <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Protein</p>
                      <p className="font-extrabold text-white text-lg mt-0.5">{selectedProduct.nutritionInfo.protein || 'N/A'}</p>
                      <p className="text-[9px] text-gray-500">g</p>
                    </div>
                    <div className="bg-[#12151a] border border-zinc-800/80 rounded-xl p-3 text-center">
                      <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Carbs</p>
                      <p className="font-extrabold text-white text-lg mt-0.5">{selectedProduct.nutritionInfo.carbs || 'N/A'}</p>
                      <p className="text-[9px] text-gray-500">g</p>
                    </div>
                    <div className="bg-[#12151a] border border-zinc-800/80 rounded-xl p-3 text-center">
                      <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Fat</p>
                      <p className="font-extrabold text-white text-lg mt-0.5">{selectedProduct.nutritionInfo.fat || 'N/A'}</p>
                      <p className="text-[9px] text-gray-500">g</p>
                    </div>
                  </div>
                ) : null}

                {/* What's Included Section (for Diets mainly) */}
                {isDiet && (
                  <div className="bg-[#12151a] border border-zinc-800/80 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-300 uppercase tracking-wider">
                      <span>🍏</span>
                      <span>What's Included</span>
                    </div>
                    <div className="grid grid-cols-5 gap-1.5 text-center text-[10px]">
                      <div className="flex flex-col items-center">
                        <span className="text-base">🕒</span>
                        <span className="font-semibold text-white mt-1">Breakfast</span>
                        <span className="text-gray-500">Options</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-base">☀️</span>
                        <span className="font-semibold text-white mt-1">Lunch</span>
                        <span className="text-gray-500">Options</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-base">☕</span>
                        <span className="font-semibold text-white mt-1">Evening Snack</span>
                        <span className="text-gray-500">Options</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-base">🌙</span>
                        <span className="font-semibold text-white mt-1">Dinner</span>
                        <span className="text-gray-500">Options</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-base">📋</span>
                        <span className="font-semibold text-white mt-1">Meal Timing</span>
                        <span className="text-gray-500">Guide</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Info & Purchase Checkout */}
              <div className="flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  {/* Title */}
                  <div>
                    <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">{selectedProduct.name}</h2>
                    <p className="text-xs text-gray-400 mt-1">
                      By Store: <span className={isDiet ? 'text-green-400 font-bold' : 'text-red-400 font-bold'}>{selectedProduct.healthStore?.storeName}</span>
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-400 leading-relaxed font-normal">
                    {selectedProduct.description || selectedProduct.shortDescription}
                  </p>

                  {/* Badges Section */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#12151a] border border-zinc-800/80 rounded-xl p-3.5 flex items-center gap-3">
                      <span className="text-xl">📦</span>
                      <div>
                        <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Quantity / Size</p>
                        <p className="text-sm font-bold text-white mt-0.5">{selectedProduct.quantity || '1 unit'}</p>
                      </div>
                    </div>
                    <div className="bg-[#12151a] border border-zinc-800/80 rounded-xl p-3.5 flex items-center gap-3">
                      <span className="text-xl">🌱</span>
                      <div>
                        <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Food Type</p>
                        <p className="text-sm font-bold text-white mt-0.5">{selectedProduct.foodPreference || selectedProduct.flavor || 'Veg'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Checkout Area */}
                <div className="bg-[#12151a] border border-zinc-800/80 rounded-2xl p-5 space-y-5">
                  
                  {/* Pricing details */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-300 uppercase tracking-wider">Pricing Details</span>
                    {selectedProduct.purchaseMode === 'Subscription' ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => setPurchaseType('One Time')}
                          className={`px-3 py-1.5 rounded-lg border text-xs font-extrabold transition-all cursor-pointer ${
                            purchaseType === 'One Time' ? 'bg-white text-black border-white' : 'border-zinc-850 bg-zinc-900/60 text-gray-400 hover:text-white'
                          }`}
                        >
                          One-time (₹{selectedProduct.oneTimePrice})
                        </button>
                        <button
                          onClick={() => setPurchaseType('Monthly')}
                          className={`px-3 py-1.5 rounded-lg border text-xs font-extrabold transition-all cursor-pointer ${
                            purchaseType === 'Monthly' ? (isDiet ? 'bg-green-500 text-white border-green-500' : 'bg-red-500 text-white border-red-500') : 'border-zinc-850 bg-zinc-900/60 text-gray-400 hover:text-white'
                          }`}
                        >
                          Monthly (₹{selectedProduct.monthlyPrice})
                        </button>
                      </div>
                    ) : (
                      <p className="font-black text-2xl text-white">₹{selectedProduct.sellingPrice || selectedProduct.oneTimePrice}</p>
                    )}
                  </div>

                  {/* Delivery Address */}
                  <div className="space-y-2 border-t border-zinc-800/80 pt-4">
                    <div className="flex justify-between items-center">
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest">Delivery Address *</label>
                      <button
                        type="button"
                        onClick={handleLocateUser}
                        className={`text-[10px] font-extrabold flex items-center gap-1 cursor-pointer bg-white/5 border border-zinc-800 px-2 py-0.5 rounded-md hover:bg-white/10 transition-all ${
                          isDiet ? 'text-green-400 hover:text-green-300' : 'text-red-400 hover:text-red-300'
                        }`}
                      >
                        📍 Get Current Location
                      </button>
                    </div>
                    <input
                      required
                      value={checkoutAddress}
                      onChange={e => setCheckoutAddress(e.target.value)}
                      placeholder="Enter full shipping address..."
                      className="w-full bg-[#1c2027] border border-zinc-800/80 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition-all"
                    />
                  </div>

                  {/* Buy button */}
                  <button
                    onClick={() => handleCheckout(selectedProduct)}
                    disabled={checkoutLoading}
                    className={`w-full text-white font-extrabold text-sm py-3.5 rounded-xl transition-all shadow-lg hover:brightness-110 cursor-pointer ${
                      isDiet ? 'bg-green-600 hover:bg-green-500' : 'bg-red-600 hover:bg-red-500'
                    }`}
                  >
                    {checkoutLoading ? 'Initiating Checkout...' : (purchaseType === 'Monthly' ? 'Subscribe Now' : 'Buy Now')}
                  </button>
                </div>

              </div>
            </div>

            {/* Footer banner */}
            <div className="border-t border-zinc-800/80 mt-6 pt-5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-gray-500 text-[10px] font-semibold uppercase tracking-wider">
              <div className="flex items-center justify-center gap-2">
                <span className="text-green-500 text-sm">🛡️</span>
                <span>100% Secure Payments</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-green-500 text-sm">🚚</span>
                <span>Instant Delivery</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-green-500 text-sm">🤝</span>
                <span>Trusted by Thousands</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-green-500 text-sm">📞</span>
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
