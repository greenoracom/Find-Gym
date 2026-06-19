import React from 'react';

const Header = ({ title }) => {
  const store = JSON.parse(localStorage.getItem('hsStore') || '{}');
  const owner = JSON.parse(localStorage.getItem('hsOwner') || '{}');

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
      <div>
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs font-semibold text-gray-500">{store.storeName || 'My Store'}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
          <span className="text-[10px] text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
            {store.status || 'Active'}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {store.logo ? (
          <img src={store.logo} alt="Store Logo" className="w-9 h-9 rounded-full object-cover border" />
        ) : (
          <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold">
            {store.storeName ? store.storeName[0] : 'S'}
          </div>
        )}
        <div className="hidden sm:block text-left">
          <p className="text-sm font-semibold text-gray-800 leading-none">{owner.name || 'Owner'}</p>
          <p className="text-xs text-gray-400 mt-1 leading-none">{owner.email || 'owner@store.com'}</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
