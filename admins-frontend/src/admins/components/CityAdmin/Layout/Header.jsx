import React, { useEffect, useState } from 'react';

const Header = ({ title }) => {
  const [adminName, setAdminName] = useState('City Admin');
  const [adminEmail, setAdminEmail] = useState('cityadmin@findgym.com');

  useEffect(() => {
    // Dynamically retrieve logged-in admin data
    const storedAdmin = localStorage.getItem('admin');
    if (storedAdmin) {
      try {
        const parsed = JSON.parse(storedAdmin);
        setAdminName(parsed.fullName || 'City Admin');
        setAdminEmail(parsed.email || 'cityadmin@findgym.com');
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  return (
    <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 shadow-sm">
      <div className="flex items-center">
        <h2 className="text-xl font-semibold text-slate-800">{title || 'Dashboard'}</h2>
      </div>
      <div className="flex items-center space-x-6">
        <div className="relative">
          <button className="text-slate-500 hover:text-orange-500 transition-colors relative">
            <span className="text-xl">🔔</span>
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
        </div>
        <div className="flex items-center space-x-3 border-l pl-6 border-slate-200">
          <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold border border-orange-200 shadow-sm">
            {adminName.substring(0, 2).toUpperCase()}
          </div>
          <div className="hidden md:block text-sm">
            <p className="font-medium text-slate-800">{adminName}</p>
            <p className="text-slate-500 text-xs">{adminEmail}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
