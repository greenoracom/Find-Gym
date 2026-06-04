  import React, { useState, useEffect } from 'react';
  import defaultHeroBg from '../assets/home background img2.png';
  import { getActiveBanners } from '../userServices/homeApi';
  
  const Home = () => {
    const [heroBg, setHeroBg] = useState(defaultHeroBg);
    const [mediaType, setMediaType] = useState('image/png');

    useEffect(() => {
      const fetchBanner = async () => {
        try {
          const response = await getActiveBanners();
          const banners = response.data.banners;
          
          if (banners && banners.length > 0) {
            // Find the first active banner
            const activeBanner = banners.find(b => b.status === 'Active');
            if (activeBanner) {
              const baseUrl = import.meta.env.VITE_BASE_URL || '';
              setHeroBg(`${baseUrl}${activeBanner.mediaUrl}`);
              setMediaType(activeBanner.mediaType || 'image/jpeg');
            }
          }
        } catch (error) {
          console.error("Failed to load banner:", error);
        }
      };
      
      fetchBanner();
    }, []);

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div 
          className="relative bg-cover bg-center bg-no-repeat transition-all duration-1000 overflow-hidden"
          style={mediaType.startsWith('image/') ? { backgroundImage: `url(${heroBg})` } : {}}
        >
          {mediaType.startsWith('video/') && (
            <video 
              autoPlay 
              loop 
              muted 
              playsInline
              className="absolute top-0 left-0 w-full h-full object-cover z-0"
            >
              <source src={heroBg} type={mediaType} />
            </video>
          )}
          {/* <div className="absolute inset-0 bg-black/50 dark:bg-black/60"></div> */}
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32 lg:pt-32 lg:pb-40">
            <div className="text-center md:text-left md:max-w-2xl">
              <h1 className="text-4xl tracking-tight font-extrabold text-black sm:text-5xl md:text-6xl">
                <span className="block xl:inline">Find The Perfect</span>{' '}
                <span className="block text-blue-400 xl:inline">Gym Near You</span>
              </h1>
              <p className="mt-3 text-base text-gray-200 sm:mt-5 sm:text-lg sm:max-w-xl md:mt-5 md:text-xl">
                Discover gyms, fitness centers, trainers and workout spaces around your location. Start your fitness journey today with the best facilities in town.
              </p>
              <div className="mt-8 sm:flex sm:justify-center md:justify-start">
                <div className="w-full sm:max-w-md lg:max-w-lg flex flex-col sm:flex-row gap-3">
                  <input 
                    type="text" 
                    placeholder="Enter city or location..." 
                    className="w-full px-5 py-3 border-0 shadow-sm rounded-full text-gray-900 bg-white/95 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="w-full sm:w-auto flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 md:py-3 md:text-lg hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5">
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6 text-blue-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Find Nearby Gyms</h3>
                <p className="text-gray-600">Locate the best fitness centers in your area with precise location tracking and user reviews.</p>
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6 text-purple-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Compare Memberships</h3>
                <p className="text-gray-600">Easily compare prices, amenities, and membership plans to find what suits your budget.</p>
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6 text-green-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Contact Trainers</h3>
                <p className="text-gray-600">Get in touch with certified personal trainers to help you achieve your fitness goals faster.</p>
              </div>
            </div>
          </div>
        </div>
        {/* Nearest Gyms Section */}
        <div className="py-20 bg-[#050816] relative overflow-hidden">
          {/* Glow effects */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F172A] border border-gray-800 text-blue-500 text-sm font-medium mb-4">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                  </span>
                  LOCATION: PUNE
                </div>
                <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
                  Nearest Gyms <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-300">Near You</span>
                </h2>
                <p className="text-[#94A3B8] text-lg max-w-2xl">
                  Discover the best premium gyms and fitness centers closest to your location.
                </p>
              </div>
              <button className="flex items-center gap-2 text-white bg-[#0F172A] hover:bg-blue-600 border border-gray-800 hover:border-blue-500 px-6 py-3 rounded-full font-medium transition-all duration-300 shadow-[0_0_0_rgba(37,99,235,0)] hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] whitespace-nowrap">
                View All Nearby Gyms
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Gym Cards Array */}
              {[
                { name: "Gold Fitness Club", img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop", rating: "4.8", dist: "1.2", price: "1,499", tags: ["AC", "Trainer", "Parking"] },
                { name: "Cult Fit Premium", img: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=1375&auto=format&fit=crop", rating: "4.9", dist: "2.5", price: "2,999", tags: ["CrossFit", "Zumba", "AC"] },
                { name: "Anytime Fitness", img: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1470&auto=format&fit=crop", rating: "4.7", dist: "3.1", price: "1,999", tags: ["24/7", "Cardio", "Parking"] },
                { name: "Fitness First", img: "https://images.unsplash.com/photo-1558611848-73f7eb4001a1?q=80&w=1471&auto=format&fit=crop", rating: "4.6", dist: "4.0", price: "1,299", tags: ["Pool", "AC", "Spa"] },
                { name: "Talwalkars Gym", img: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=1469&auto=format&fit=crop", rating: "4.5", dist: "5.2", price: "999", tags: ["Weights", "Trainer", "Cardio"] },
                { name: "Iron Core Fitness", img: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1470&auto=format&fit=crop", rating: "4.8", dist: "6.0", price: "1,799", tags: ["Powerlifting", "AC", "Cafe"] },
              ].map((gym, idx) => (
                <div key={idx} className="group relative bg-[#0F172A] rounded-[24px] overflow-hidden border border-gray-800 hover:border-blue-500/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(37,99,235,0.15)]">
                  {/* Image Section */}
                  <div className="relative h-56 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] to-transparent z-10"></div>
                    <img src={gym.img} alt={gym.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    
                    {/* Heart Icon */}
                    <button className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-blue-600 hover:border-blue-600 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                    </button>
                    
                    {/* Rating Badge */}
                    <div className="absolute top-4 left-4 z-20 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white text-sm font-semibold flex items-center gap-1">
                      <span className="text-yellow-400">⭐</span> {gym.rating}
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6 relative z-20 -mt-8">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">{gym.name}</h3>
                    </div>
                    
                    <div className="flex flex-col gap-2 mb-4">
                      <div className="flex items-center text-[#94A3B8] text-sm gap-1.5">
                        <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        {gym.dist} km away • Pune, Maharashtra
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {gym.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 rounded-full bg-blue-900/20 text-blue-400 border border-blue-800/30 text-xs font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                      <div>
                        <p className="text-[#94A3B8] text-xs uppercase tracking-wider mb-0.5">Starting from</p>
                        <p className="text-white font-bold text-xl">₹{gym.price}<span className="text-sm font-normal text-[#94A3B8]">/mo</span></p>
                      </div>
                      <button className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-medium text-sm hover:bg-blue-500 transition-colors shadow-[0_0_15px_rgba(37,99,235,0.4)]">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default Home;
