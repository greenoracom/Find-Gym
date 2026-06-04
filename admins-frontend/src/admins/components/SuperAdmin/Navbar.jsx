import React from 'react';
import { Menu, Search, Bell, User, LogOut, Settings } from 'lucide-react';

const Navbar = ({ toggleSidebar }) => {
  return (
    <header className="bg-card h-16 border-b border-gray-200 sticky top-0 z-10 flex items-center justify-between px-4 lg:px-6 shadow-sm">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-md hover:bg-gray-100 lg:hidden focus:outline-none"
        >
          <Menu size={20} className="text-gray-600" />
        </button>
        <div className="font-bold text-xl text-primary hidden lg:block">Admin Portal</div>
      </div>

      <div className="hidden lg:flex flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search size={18} className="text-gray-400" />
          </span>
          <input 
            type="text" 
            placeholder="Search users, gyms, trainers..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-full hover:bg-gray-100 focus:outline-none">
          <Bell size={20} className="text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full"></span>
        </button>
        
        <div className="relative group cursor-pointer flex items-center gap-2">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden border border-gray-300">
             <User size={20} className="text-gray-500" />
          </div>
          <div className="hidden md:block">
            <div className="text-sm font-semibold text-gray-800">Super Admin</div>
          </div>
          
          {/* Dropdown Menu implementation would go here */}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
