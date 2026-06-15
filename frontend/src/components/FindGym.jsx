import React, { useEffect, useRef, useState } from "react";

const gymsData = [
  {
    id: 1,
    name: "Gold's Gym",
    rating: 4.8,
    reviews: 142,
    price: "₹1,999",
    location: "Kalyani Nagar, Pune",
    address: "Kalyani Nagar Rd, beside Jogger's Park, Pune - 411006",
    coords: [18.5484, 73.9025],
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop",
    tags: ["Cardio", "Strength", "Zumba"],
    closesAt: "10:00 pm",
    website: "https://goldsgym.in",
    reviewSnippet: "Great atmosphere, well-maintained equipment, and supportive trainers."
  },
  {
    id: 3,
    name: "Anytime Fitness",
    rating: 4.7,
    reviews: 75,
    price: "₹1,799",
    location: "Aundh, Pune",
    address: "DP Road, beside vaishno mata mandir, Aundh, Pune - 411007",
    coords: [18.5580, 73.8075],
    image: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=600&auto=format&fit=crop",
    tags: ["24/7 Access", "Steam Bath", "Strength"],
    closesAt: "10:30 pm",
    website: "https://anytimefitness.in",
    reviewSnippet: "Love the 24/7 access option. Clean facilities and good crowd."
  },
  {
    id: 4,
    name: "Titan Strength Academy",
    rating: 4.8,
    reviews: 53,
    price: "₹1,499",
    location: "Viman Nagar, Pune",
    address: "Datta Mandir Chowk, opposite Viman Nagar Airport Rd, Pune - 411014",
    coords: [18.5679, 73.9143],
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=600&auto=format&fit=crop",
    tags: ["Powerlifting", "Crossfit", "Sauna"],
    closesAt: "11:00 pm",
    website: "https://titanacademy.com",
    reviewSnippet: "Best place for strength training and heavy lifting in town."
  }
];

const allTags = ["All", "Cardio", "Strength", "Zumba", "Yoga", "Crossfit", "MMA"];

const FindGym = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");
  const [sortBy, setSortBy] = useState("rating");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedGymDetail, setSelectedGymDetail] = useState(null);

  const mapRef = useRef(null);
  const leafletMapInstanceRef = useRef(null);
  const markersRef = useRef({});

  // Filter & Sort Gyms
  const filteredAndSortedGyms = gymsData
    .filter((gym) => {
      const matchesSearch =
        gym.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gym.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gym.address.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTag =
        selectedTag === "All" ||
        gym.tags.some((tag) => tag.toLowerCase().includes(selectedTag.toLowerCase()));
      return matchesSearch && matchesTag;
    })
    .sort((a, b) => {
      if (sortBy === "rating") {
        return b.rating - a.rating;
      } else if (sortBy === "price") {
        const priceA = parseInt(a.price.replace(/[^\d]/g, ""));
        const priceB = parseInt(b.price.replace(/[^\d]/g, ""));
        return priceA - priceB;
      }
      return 0;
    });

  // Dynamically load Leaflet
  useEffect(() => {
    let link = document.getElementById("leaflet-css");
    if (!link) {
      link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    let script = document.getElementById("leaflet-js");
    if (!script) {
      script = document.createElement("script");
      script.id = "leaflet-js";
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.async = true;
      script.onload = initializeMap;
      document.body.appendChild(script);
    } else if (window.L) {
      initializeMap();
    }

    function initializeMap() {
      if (!mapRef.current || leafletMapInstanceRef.current) return;

      const L = window.L;
      const map = L.map(mapRef.current, {
        zoomControl: false
      }).setView([18.552, 73.856], 12);

      leafletMapInstanceRef.current = map;

      L.control.zoom({ position: "bottomright" }).addTo(map);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      const customIcon = L.divIcon({
        className: "custom-leaflet-marker",
        html: `<div class="w-8 h-8 rounded-full bg-[#FF7A00] border-2 border-white flex items-center justify-center text-white font-bold shadow-lg transform -translate-x-1/2 -translate-y-1/2 animate-bounce">🏋️</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      gymsData.forEach((gym) => {
        const marker = L.marker(gym.coords, { icon: customIcon }).addTo(map);
        
        const popupContent = `
          <div style="font-family: sans-serif; min-width: 200px; color: #333; background: #fff; padding: 4px; border-radius: 8px;">
            <img src="${gym.image}" style="width: 100%; height: 90px; object-fit: cover; border-radius: 6px; margin-bottom: 8px;" />
            <h4 style="margin: 0 0 4px 0; font-size: 14px; font-weight: bold; color: #FF7A00;">${gym.name}</h4>
            <p style="margin: 0 0 4px 0; font-size: 11px; color: #555;">📍 ${gym.address}</p>
            <p style="margin: 0 0 6px 0; font-size: 11px; color: #2e7d32; font-weight: bold;">★ ${gym.rating} (${gym.reviews} reviews)</p>
            <p style="margin: 0 0 8px 0; font-size: 12px; font-weight: bold; color: #111;">${gym.price}/mo</p>
            <div style="display: flex; gap: 6px; margin-top: 4px;">
              <a href="${gym.website}" target="_blank" style="text-decoration: none; color: #666; background: rgba(0,0,0,0.05); border: 1px solid rgba(0,0,0,0.1); font-size: 10px; font-weight: bold; padding: 4px 8px; border-radius: 12px; display: inline-block;">🌐 Website</a>
              <a href="https://www.google.com/maps/dir/?api=1&destination=${gym.coords[0]},${gym.coords[1]}" target="_blank" style="text-decoration: none; color: #fff; background: #FF7A00; font-size: 10px; font-weight: bold; padding: 4px 8px; border-radius: 12px; display: inline-block;">➡️ Directions</a>
            </div>
          </div>
        `;

        const popup = L.popup({
          className: "custom-leaflet-popup",
          closeButton: false,
        }).setContent(popupContent);

        marker.bindPopup(popup);
        marker.on('click', () => {
          setSelectedGymDetail(gym);
          setIsSidebarOpen(true);
        });
        markersRef.current[gym.id] = marker;
      });
    }

    return () => {
      if (leafletMapInstanceRef.current) {
        leafletMapInstanceRef.current.remove();
        leafletMapInstanceRef.current = null;
      }
    };
  }, []);

  // Filter map pins
  useEffect(() => {
    if (!leafletMapInstanceRef.current || !window.L) return;

    const map = leafletMapInstanceRef.current;

    gymsData.forEach((gym) => {
      const marker = markersRef.current[gym.id];
      if (!marker) return;

      const matchesSearch =
        gym.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gym.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gym.address.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTag =
        selectedTag === "All" ||
        gym.tags.some((tag) => tag.toLowerCase().includes(selectedTag.toLowerCase()));

      if (matchesSearch && matchesTag) {
        if (!map.hasLayer(marker)) {
          marker.addTo(map);
        }
      } else {
        if (map.hasLayer(marker)) {
          map.removeLayer(marker);
        }
      }
    });
  }, [searchQuery, selectedTag]);

  const handleGymSelect = (gym) => {
    setSelectedGymDetail(gym);
    if (leafletMapInstanceRef.current && window.L) {
      leafletMapInstanceRef.current.flyTo(gym.coords, 14, {
        duration: 1.5,
      });

      const marker = markersRef.current[gym.id];
      if (marker) {
        setTimeout(() => {
          marker.openPopup();
        }, 1500);
      }
    }
  };

  // Invalidate map size on sidebar toggle
  useEffect(() => {
    if (leafletMapInstanceRef.current) {
      setTimeout(() => {
        leafletMapInstanceRef.current.invalidateSize({ animate: true });
      }, 300);
    }
  }, [isSidebarOpen]);

  return (
    <div className="w-full h-screen mt-0 overflow-hidden bg-white text-gray-900 font-sans flex flex-col md:flex-row relative">
      
      {/* Floating Google-style Search Bar */}
      <div 
        className="absolute top-4 left-4 z-20 bg-white rounded-full border border-gray-300 shadow-md px-4 py-2.5 flex items-center transition-all duration-300 w-[calc(100%-32px)] max-w-[360px]"
      >
        {/* Left Menu / Hamburger Icon (if sidebar is closed) */}
        {!isSidebarOpen && (
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="mr-3 text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
            title="Open menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}

        <input
          type="text"
          placeholder="Search gyms..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            if (!isSidebarOpen) setIsSidebarOpen(true);
          }}
          onFocus={() => {
            if (!isSidebarOpen) setIsSidebarOpen(true);
          }}
          className="flex-grow bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none text-sm pr-2"
        />
        
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="mr-2 text-gray-400 hover:text-gray-700 transition-colors text-xs font-bold"
            title="Clear search"
          >
            ✕
          </button>
        )}

        <div className="flex items-center gap-2.5 border-l border-gray-200 pl-3">
          <button className="text-gray-400 hover:text-[#FF7A00] transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          
          {isSidebarOpen && (
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
              title="Close sidebar"
            >
              <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Left Sidebar Panel (Matches Google Maps list style) */}
      <div className={`h-full bg-white border-r border-gray-200 flex flex-col flex-shrink-0 z-10 shadow-lg transition-all duration-300 ${
        isSidebarOpen 
          ? "w-full md:w-[390px] opacity-100" 
          : "w-0 md:w-0 opacity-0 pointer-events-none overflow-hidden"
      }`}>
        {/* Top Spacer to leave room for the floating search bar */}
        <div className="h-[76px] flex-shrink-0" />

        {/* Results Info & Sort controls */}
        <div className="flex items-center justify-between px-5 py-2 border-b border-gray-100 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <span>Results ({filteredAndSortedGyms.length})</span>
            <span className="text-[10px] text-gray-400 cursor-pointer" title="Results shown on map">ⓘ</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <span>Sort by</span>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-none text-gray-900 font-semibold focus:outline-none text-xs cursor-pointer"
              >
                <option value="rating">Rating</option>
                <option value="price">Price</option>
              </select>
            </div>
            <button className="text-gray-500 hover:text-gray-700 font-semibold flex items-center gap-1">
              <span>🔗</span> Share
            </button>
          </div>
        </div>

        {/* Scrollable list items */}
        <div className="flex-grow overflow-y-auto divide-y divide-gray-150">
          {filteredAndSortedGyms.length > 0 ? (
            filteredAndSortedGyms.map((gym) => (
              <div
                key={gym.id}
                onClick={() => handleGymSelect(gym)}
                className={`p-5 hover:bg-gray-50/80 cursor-pointer flex flex-col gap-2.5 transition-all ${
                  selectedGymDetail?.id === gym.id ? "bg-orange-50/50 border-l-4 border-[#FF7A00]" : ""
                }`}
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-grow">
                    <h3 className="font-bold text-[15px] text-gray-950 hover:text-[#FF7A00] transition-colors leading-snug">
                      {gym.name}
                    </h3>
                    
                    {/* Stars Block */}
                    <div className="flex items-center gap-1 mt-0.5 text-xs text-gray-500">
                      <span className="font-bold text-[#FF7A00]">{gym.rating}</span>
                      <div className="flex text-yellow-500 text-xs">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i}>{i < Math.floor(gym.rating) ? "★" : "☆"}</span>
                        ))}
                      </div>
                      <span className="text-gray-400">({gym.reviews})</span>
                    </div>

                    {/* Address details */}
                    <p className="text-[11px] text-gray-500 mt-1.5 leading-relaxed">
                      Gym • {gym.address}
                    </p>

                    {/* Status timings */}
                    <div className="flex items-center gap-1.5 mt-1.5 text-xs">
                      <span className="font-semibold text-green-600">Open</span>
                      <span className="text-gray-400">• Closes {gym.closesAt}</span>
                    </div>
                  </div>

                  <img
                    src={gym.image}
                    alt={gym.name}
                    className="w-[76px] h-[76px] object-cover rounded-xl border border-gray-150 flex-shrink-0"
                  />
                </div>

                {/* Review Snippet with avatar */}
                {gym.reviewSnippet && (
                  <div className="flex items-start gap-2 bg-gray-50 p-2.5 rounded-xl border border-gray-100 text-[11px] text-gray-600 leading-normal">
                    <div className="w-5 h-5 rounded-full bg-[#00838F]/10 border border-[#00838F]/20 flex items-center justify-center text-[10px] text-[#00838F] font-bold">
                      👤
                    </div>
                    <p className="flex-grow">"{gym.reviewSnippet}"</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-xs text-gray-400">
              No results found. Try adjusting filters.
            </div>
          )}
        </div>
      </div>

      {/* Sidebar Toggle Button (Google Maps Style) */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="hidden md:flex absolute top-1/2 -translate-y-1/2 z-20 bg-white border border-gray-200 shadow-md hover:shadow-lg rounded-r-md py-4 px-1.5 hover:bg-gray-50 text-gray-500 hover:text-gray-800 transition-all duration-300 items-center justify-center cursor-pointer"
        style={{ left: isSidebarOpen ? "390px" : "0px" }}
        title={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
      >
        <span className="text-xs font-bold">{isSidebarOpen ? "◀" : "▶"}</span>
      </button>

      {/* Mobile floating open list button */}
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="md:hidden absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-white text-gray-800 border border-gray-200 shadow-lg px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all duration-300 hover:bg-gray-50"
        >
          📋 Show List
        </button>
      )}

      {/* Right Map Panel */}
      <div className="flex-grow h-full relative">
        <div ref={mapRef} className="w-full h-full z-0" />

        {/* Floating Gym Detail Card (Google Maps Style) */}
        {selectedGymDetail && (
          <div className="absolute top-20 left-4 z-20 bg-white rounded-2xl shadow-2xl w-[calc(100%-32px)] sm:w-[420px] max-h-[calc(100vh-160px)] overflow-y-auto flex flex-col border border-gray-150 animate-in fade-in slide-in-from-bottom-5 duration-300 pointer-events-auto">
            {/* Gym Image Header */}
            <div className="relative w-full h-[200px] flex-shrink-0">
              <img
                src={selectedGymDetail.image}
                alt={selectedGymDetail.name}
                className="w-full h-full object-cover"
              />
              {/* Close Button overlay */}
              <button
                onClick={() => setSelectedGymDetail(null)}
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/95 hover:bg-white flex items-center justify-center text-gray-700 shadow-md transition-all cursor-pointer z-30"
                title="Close details"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              {/* See Photos Overlay */}
              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-md text-white text-[10px] font-bold flex items-center gap-1">
                📷 See photos
              </div>
            </div>

            {/* Details Content */}
            <div className="p-5 flex flex-col gap-4 text-left">
              <div>
                <h2 className="text-xl font-bold text-gray-900 leading-tight">{selectedGymDetail.name}</h2>
                <p className="text-xs text-gray-400 mt-0.5">Gym in Pune</p>
                
                {/* Rating */}
                <div className="flex items-center gap-1.5 mt-1.5 text-sm text-gray-600">
                  <span className="font-bold text-[#FF7A00]">{selectedGymDetail.rating}</span>
                  <div className="flex text-yellow-500 text-xs">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i}>{i < Math.floor(selectedGymDetail.rating) ? "★" : "☆"}</span>
                    ))}
                  </div>
                  <span className="text-gray-400">({selectedGymDetail.reviews})</span>
                </div>
              </div>

              {/* Quick Action Tabs */}
              <div className="flex border-b border-gray-150 text-sm font-semibold text-gray-500">
                <button className="flex-1 pb-2 border-b-2 border-[#FF7A00] text-[#FF7A00]">Overview</button>
                <button className="flex-1 pb-2 hover:text-gray-800">Reviews</button>
                <button className="flex-1 pb-2 hover:text-gray-800">About</button>
              </div>

              {/* Quick Actions Row */}
              <div className="flex justify-around py-2 bg-gray-50/50 rounded-xl border border-gray-100">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${selectedGymDetail.coords[0]},${selectedGymDetail.coords[1]}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col items-center gap-1.5 text-center group"
                >
                  <div className="w-10 h-10 rounded-full bg-[#00838F] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  </div>
                  <span className="text-[10px] font-bold text-gray-600 group-hover:text-gray-900">Directions</span>
                </a>

                <button className="flex flex-col items-center gap-1.5 text-center group cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-[#E0F2F1] flex items-center justify-center text-[#00838F] shadow-sm group-hover:scale-105 transition-transform">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </div>
                  <span className="text-[10px] font-bold text-gray-650 group-hover:text-gray-900">Save</span>
                </button>

                <a
                  href={selectedGymDetail.website}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col items-center gap-1.5 text-center group"
                >
                  <div className="w-9 h-9 rounded-full bg-[#E0F2F1] flex items-center justify-center text-[#00838F] shadow-sm group-hover:scale-105 transition-transform">
                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </div>
                  <span className="text-[9px] font-bold text-gray-650 group-hover:text-gray-900">Website</span>
                </a>

                <button className="flex flex-col items-center gap-1.5 text-center group cursor-pointer">
                  <div className="w-9 h-9 rounded-full bg-[#E0F2F1] flex items-center justify-center text-[#00838F] shadow-sm group-hover:scale-105 transition-transform">
                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 10.742l4.828-2.414m0 0a3 3 0 10-2.684-2.683l-4.829 2.414m4.829 2.414a3 3 0 11-2.684 2.683l-4.828-2.414a3 3 0 110-5.366z" />
                    </svg>
                  </div>
                  <span className="text-[9px] font-bold text-gray-650 group-hover:text-gray-900">Share</span>
                </button>
              </div>

              <hr className="border-gray-100" />

              {/* List Details */}
              <div className="flex flex-col gap-3 text-xs text-gray-700">
                <div className="flex items-start gap-2.5">
                  <span className="text-sm">📍</span>
                  <div>
                    <p className="font-semibold text-gray-900">Address</p>
                    <p className="text-gray-500 mt-0.5 leading-relaxed text-[11px]">{selectedGymDetail.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="text-sm">🕒</span>
                  <div>
                    <p className="font-semibold text-gray-900">Timings</p>
                    <p className="text-gray-500 mt-0.5 text-[11px]">Open now • Closes {selectedGymDetail.closesAt}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="text-sm">💰</span>
                  <div>
                    <p className="font-semibold text-gray-900">Membership Fee</p>
                    <p className="text-gray-500 mt-0.5 text-[11px]">{selectedGymDetail.price} per month</p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="text-sm">🏷️</span>
                  <div>
                    <p className="font-semibold text-gray-900">Amenities</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedGymDetail.tags.map((tag) => (
                        <span key={tag} className="px-2 py-0.5 bg-gray-100 rounded text-[9px] text-gray-600 font-semibold">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* User Review Quote */}
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 mt-1">
                <p className="text-[11px] font-bold text-gray-800 mb-1.5">Popular Review</p>
                <div className="flex items-start gap-2 text-[10px] text-gray-600 leading-relaxed">
                  <div className="w-4.5 h-4.5 rounded-full bg-[#00838F]/10 border border-[#00838F]/20 flex items-center justify-center text-[9px] text-[#00838F] font-bold flex-shrink-0">
                    👤
                  </div>
                  <p>"{selectedGymDetail.reviewSnippet}"</p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Floating Filter Chips inside map panel */}
        <div className="absolute top-20 left-4 md:top-4 md:left-auto md:right-4 z-10 flex gap-1.5 overflow-x-auto max-w-[calc(100vw-32px)] md:max-w-[calc(100vw-450px)] pb-1 scrollbar-none pointer-events-auto">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border shadow-md ${
                selectedTag === tag
                  ? "bg-[#FF7A00] text-white border-[#FF7A00]"
                  : "bg-white text-gray-700 border-gray-300 hover:text-black"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Custom styles to keep clean light popup map styling */}
      <style>{`
        /* Marker styling */
        .custom-leaflet-marker {
          background: transparent !important;
          border: none !important;
        }
      `}</style>
    </div>
  );
};

export default FindGym;
