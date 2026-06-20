import React from 'react';

const Header = ({ title }) => {
  // Read admin info stored in localStorage after login
  const adminRaw = localStorage.getItem('adminInfo') || localStorage.getItem('admin');
  let adminName = 'Platform Admin';
  let adminEmail = '';
  let adminInitials = 'PA';

  try {
    if (adminRaw) {
      const info = JSON.parse(adminRaw);
      adminName = info.fullName || info.name || 'Platform Admin';
      adminEmail = info.email || '';
      adminInitials = adminName
        .split(' ')
        .map(w => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
  } catch (_) {}

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
            {adminInitials}
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

