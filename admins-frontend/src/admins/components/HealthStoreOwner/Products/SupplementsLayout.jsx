import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';

const SupplementsLayout = () => {
  return (
    <div className="space-y-6">
      {/* Premium Tab Bar Navigation */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex gap-2">
            <NavLink
              to="/health-store-owner/supplements"
              end
              className={({ isActive }) =>
                `flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border ${
                  isActive
                    ? 'bg-red-600 text-white border-red-600 shadow-md shadow-red-100'
                    : 'bg-slate-50 text-slate-650 border-slate-200 hover:bg-slate-100 hover:border-slate-350'
                }`
              }
            >
              📊 Supplements Dashboard
            </NavLink>
            <NavLink
              to="/health-store-owner/supplements/list"
              className={({ isActive }) =>
                `flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border ${
                  isActive
                    ? 'bg-red-600 text-white border-red-600 shadow-md shadow-red-100'
                    : 'bg-slate-50 text-slate-650 border-slate-200 hover:bg-slate-100 hover:border-slate-350'
                }`
              }
            >
              📋 Supplement List
            </NavLink>
            <NavLink
              to="/health-store-owner/supplements/payments"
              className={({ isActive }) =>
                `flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border ${
                  isActive
                    ? 'bg-red-600 text-white border-red-600 shadow-md shadow-red-100'
                    : 'bg-slate-50 text-slate-650 border-slate-200 hover:bg-slate-100 hover:border-slate-350'
                }`
              }
            >
              💳 Supplement Payments
            </NavLink>
            <NavLink
              to="/health-store-owner/supplements/add"
              className={({ isActive }) =>
                `flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border ${
                  isActive
                    ? 'bg-red-600 text-white border-red-600 shadow-md shadow-red-100'
                    : 'bg-slate-50 text-slate-650 border-slate-200 hover:bg-slate-100 hover:border-slate-350'
                }`
              }
            >
              💊 Add Supplement
            </NavLink>
          </div>
          <div className="text-xs text-slate-400 font-medium">
            Manage your store supplements & inventory
          </div>
        </div>
      </div>

      {/* Render Sub Pages */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <Outlet />
      </div>
    </div>
  );
};

export default SupplementsLayout;
