import React from "react";
import { Link } from "react-router-dom";

const UserProfile = () => {
  const user = {
    fullName: "Sana",
    email: "sana@findgym.com",
    phone: "+91 9876543210",
    gender: "Female",
    memberSince: "12 Jan 2024",
    location: "Koregaon Park, Pune",
    profilePhoto: "https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=300&auto=format&fit=crop",
    completion: 85,
    membership: {
      gymName: "Gold's Gym, Kalyani Nagar",
      plan: "Annual Elite Membership",
      expiryDate: "June 25, 2027",
      status: "Active"
    },
    stats: [
      { id: 1, label: "Workouts", value: "48", icon: "🔥" },
      { id: 2, label: "Hours Active", value: "62 hrs", icon: "⏰" },
      { id: 3, label: "Kcal Burned", value: "24.5k", icon: "⚡" },
      { id: 4, label: "Bookings", value: "12", icon: "📅" }
    ],
    healthBadges: [
      { id: 1, label: "Height & Weight", value: "165 cm / 58 kg", icon: "🧍" },
      { id: 2, label: "Fitness Goal", value: "Weight Loss & Build", icon: "🎯" },
      { id: 3, label: "BMI / Activity Level", value: "22.4 / Moderate", icon: "💖" },
      { id: 4, label: "Preferred Workout", value: "Strength Training", icon: "🏋️" }
    ],
    bookings: [
      { id: 1, gym: "Powerhouse Gym", loc: "Baner, Pune", date: "20 May 2024", time: "07:00 AM", status: "Completed", image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=150&auto=format&fit=crop" },
      { id: 2, gym: "FitZone Fitness", loc: "Kothrud, Pune", date: "15 May 2024", time: "08:00 AM", status: "Completed", image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=150&auto=format&fit=crop" },
      { id: 3, gym: "Muscle Factory", loc: "Hinjewadi, Pune", date: "10 May 2024", time: "08:00 AM", status: "Cancelled", image: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=150&auto=format&fit=crop" }
    ],
    savedGyms: [
      { id: 1, name: "Cult Fit Gym", loc: "Wakad, Pune", image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=150&auto=format&fit=crop" },
      { id: 2, name: "Absolute Fitness", loc: "Kalyani Nagar, Pune", image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=150&auto=format&fit=crop" },
      { id: 3, name: "The Strength Hub", loc: "Viman Nagar, Pune", image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=150&auto=format&fit=crop" }
    ]
  };

  return (
    <div className="pt-24 pb-12 min-h-screen bg-[#070708] text-white px-4 md:px-8 max-w-7xl mx-auto font-sans">
      
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            My <span className="text-[#FF7A00]">Profile</span>
          </h1>
          <p className="text-gray-400 text-xs mt-1">Manage your health stats, goals, and active memberships.</p>
        </div>
        
        <button className="px-4 py-2 border border-[#FF7A00] text-[#FF7A00] hover:bg-[#FF7A00]/10 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer">
          ✏️ Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Sidebar Panel (4 columns) */}
        <div className="lg:col-span-3 bg-[#111112] border border-white/5 rounded-3xl p-6 flex flex-col items-center relative overflow-hidden shadow-xl">
          {/* Avatar Area */}
          <div className="relative mb-4">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#FF7A00] to-orange-400 p-[1px] blur-[3px]" />
            <img 
              src={user.profilePhoto} 
              alt={user.fullName} 
              className="relative w-28 h-28 object-cover rounded-full border-2 border-[#FF7A00] shadow-[0_0_15px_rgba(255,122,0,0.3)]"
            />
          </div>

          <h2 className="text-xl font-bold text-white">{user.fullName}</h2>
          
          {/* Badge */}
          <div className="mt-1.5 px-3 py-1 rounded-full bg-[#FF7A00]/10 border border-[#FF7A00]/30 text-[#FF7A00] text-[10px] font-bold tracking-wide flex items-center gap-1">
            🏆 Fitness Enthusiast
          </div>

          <p className="text-xs text-gray-400 mt-3 flex items-center gap-1">
            <span className="text-[#FF3B30]">📍</span> {user.location}
          </p>

          <div className="w-full border-t border-white/5 my-5" />

          {/* User Details Details Rows */}
          <div className="w-full space-y-4 text-xs text-gray-300">
            <div className="flex items-center gap-3">
              <span className="text-gray-500 w-5">✉️</span>
              <div className="flex-grow">
                <p className="text-[10px] text-gray-500 uppercase">Email</p>
                <p className="font-semibold text-white truncate max-w-[170px]">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gray-500 w-5">📞</span>
              <div className="flex-grow">
                <p className="text-[10px] text-gray-500 uppercase">Phone</p>
                <p className="font-semibold text-white">{user.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gray-500 w-5">👤</span>
              <div className="flex-grow">
                <p className="text-[10px] text-gray-500 uppercase">Gender</p>
                <p className="font-semibold text-white">{user.gender}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gray-500 w-5">📅</span>
              <div className="flex-grow">
                <p className="text-[10px] text-gray-500 uppercase">Member Since</p>
                <p className="font-semibold text-white">{user.memberSince}</p>
              </div>
            </div>
          </div>

          <div className="w-full border-t border-white/5 my-5" />

          {/* Profile Completion Bar */}
          <div className="w-full">
            <div className="flex justify-between items-center text-xs font-bold mb-2">
              <span className="text-gray-300">Profile Completion</span>
              <span className="text-[#FF7A00]">{user.completion}%</span>
            </div>
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mb-3">
              <div 
                className="h-full bg-gradient-to-r from-[#FF7A00] to-orange-400 rounded-full"
                style={{ width: `${user.completion}%` }}
              />
            </div>
            <p className="text-[10px] text-gray-500 leading-relaxed mb-4">
              Complete your profile to get better recommendations.
            </p>
            <button className="w-full py-2.5 border border-[#FF7A00]/40 text-[#FF7A00] hover:bg-[#FF7A00]/5 hover:border-[#FF7A00] rounded-xl text-xs font-bold transition-all cursor-pointer">
              Update Goals
            </button>
            <button 
              onClick={() => {
                localStorage.removeItem("token");
                alert("Logged out successfully!");
                window.location.href = "/";
              }}
              className="w-full mt-3 py-2.5 bg-red-500/10 hover:bg-red-500/25 border border-red-500/30 hover:border-red-500 text-red-400 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              🚪 Logout
            </button>
          </div>
        </div>

        {/* Right Panel Content (9 columns) */}
        <div className="lg:col-span-9 flex flex-col gap-6">
          
          {/* Top 4 Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {user.stats.map((stat) => (
              <div 
                key={stat.id} 
                className="bg-[#111112] border border-white/5 rounded-2xl p-4 flex flex-col justify-between h-[120px] relative overflow-hidden shadow-md"
              >
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <span className="text-2xl font-black text-white leading-none mt-1">{stat.value}</span>
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1.5">{stat.label}</span>
                  </div>
                  <span className="text-xl bg-white/5 w-8 h-8 rounded-lg flex items-center justify-center border border-white/5">{stat.icon}</span>
                </div>
                
                {/* Micro Sparkline Chart simulation */}
                <div className="w-full h-4 opacity-30 mt-auto">
                  <svg className="w-full h-full" viewBox="0 0 100 20" preserveAspectRatio="none">
                    <path d="M 0,15 Q 20,5 40,12 T 80,4 T 100,10" fill="none" stroke="#FF7A00" strokeWidth="2" />
                  </svg>
                </div>
              </div>
            ))}
          </div>

          {/* Membership card details (Crown themed) */}
          <div className="bg-gradient-to-br from-[#2b1b11] via-[#16120e] to-[#0d0b0a] border border-[#FF7A00]/20 rounded-3xl p-6 relative overflow-hidden shadow-xl">
            {/* Crown Watermark background */}
            <div className="absolute right-6 bottom-4 text-white/[0.02] text-9xl font-black select-none pointer-events-none transform translate-y-6">
              👑
            </div>

            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <span className="text-3xl bg-[#FF7A00]/10 w-12 h-12 rounded-xl flex items-center justify-center border border-[#FF7A00]/20">👑</span>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Membership Details</p>
                  <h3 className="text-xl font-black text-white mt-0.5">{user.membership.gymName}</h3>
                  <p className="text-xs text-[#FF7A00] font-bold mt-0.5">{user.membership.plan}</p>
                </div>
              </div>
              
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                {user.membership.status}
              </span>
            </div>

            <div className="w-full border-t border-white/5 my-5" />

            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-400 flex items-center gap-1.5">
                <span>📅</span> Valid till: <strong className="text-white font-semibold">{user.membership.expiryDate}</strong>
              </p>
              
              <button className="px-4 py-2 border border-[#FF7A00]/30 hover:border-[#FF7A00] text-[#FF7A00] hover:bg-[#FF7A00]/5 text-xs font-bold rounded-xl transition-all cursor-pointer">
                Manage &rarr;
              </button>
            </div>
          </div>

          {/* Horizontal Grid of 4 Health Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {user.healthBadges.map((badge) => (
              <div key={badge.id} className="bg-[#111112] border border-white/5 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
                <span className="text-xl bg-white/5 w-8 h-8 rounded-lg flex items-center justify-center border border-white/5">{badge.icon}</span>
                <div>
                  <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">{badge.label}</p>
                  <p className="text-xs font-extrabold text-white mt-0.5 whitespace-nowrap">{badge.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Grid: Recent Bookings & Saved Gyms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Recent Bookings Pane */}
            <div className="bg-[#111112] border border-white/5 rounded-3xl p-5 shadow-xl">
              <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-3">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">Recent Bookings</h3>
                <Link to="/bookings" className="text-xs font-bold text-[#FF7A00] hover:underline">View All</Link>
              </div>

              <div className="space-y-3">
                {user.bookings.map((booking) => (
                  <div key={booking.id} className="p-3 bg-black/40 border border-white/5 rounded-2xl flex justify-between items-center gap-3">
                    <div className="flex items-center gap-3">
                      <img src={booking.image} alt={booking.gym} className="w-12 h-12 object-cover rounded-xl border border-white/5" />
                      <div>
                        <h4 className="font-bold text-xs text-white leading-tight">{booking.gym}</h4>
                        <p className="text-[10px] text-gray-500 mt-0.5">📍 {booking.loc}</p>
                        <p className="text-[9px] text-[#FF7A00] mt-0.5">{booking.date} • {booking.time}</p>
                      </div>
                    </div>
                    
                    <span 
                      className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                        booking.status === "Completed" 
                          ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" 
                          : "bg-red-500/10 border border-red-500/20 text-red-400"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Saved Gyms Pane */}
            <div className="bg-[#111112] border border-white/5 rounded-3xl p-5 shadow-xl">
              <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-3">
                <h3 className="font-bold text-sm text-white">Saved Gyms</h3>
                <Link to="/saved" className="text-xs font-bold text-[#FF7A00] hover:underline">View All</Link>
              </div>

              <div className="space-y-3">
                {user.savedGyms.map((saved) => (
                  <div key={saved.id} className="p-3 bg-black/40 border border-white/5 rounded-2xl flex justify-between items-center gap-3">
                    <div className="flex items-center gap-3">
                      <img src={saved.image} alt={saved.name} className="w-12 h-12 object-cover rounded-xl border border-white/5" />
                      <div>
                        <h4 className="font-bold text-xs text-white leading-tight">{saved.name}</h4>
                        <p className="text-[10px] text-gray-500 mt-0.5">📍 {saved.loc}</p>
                      </div>
                    </div>
                    
                    <button className="text-[#FF7A00] hover:scale-110 transition-transform">
                      ❤️
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default UserProfile;
