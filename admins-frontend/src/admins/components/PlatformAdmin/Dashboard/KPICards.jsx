import React from 'react';

const KPICards = ({ kpis }) => {
  if (!kpis) return null;

  const cards = [
    {
      title: 'Total Users',
      value: kpis.totalUsers.toLocaleString(),
      change: `${kpis.userChange}% from last month`,
      isPositive: parseFloat(kpis.userChange) >= 0,
      icon: '👥',
      color: 'text-blue-600',
      bg: 'bg-blue-100'
    },
    {
      title: 'Active Gyms',
      value: kpis.totalGyms.toLocaleString(),
      change: `${kpis.gymChange}% from last month`,
      isPositive: parseFloat(kpis.gymChange) >= 0,
      icon: '🏢',
      color: 'text-emerald-600',
      bg: 'bg-emerald-100'
    },
    {
      title: 'This Month',
      value: `₹${kpis.totalRevenue.toLocaleString()}`,
      change: `${kpis.revenueChange}% from last month`,
      isPositive: parseFloat(kpis.revenueChange) >= 0,
      icon: '💰',
      color: 'text-orange-600',
      bg: 'bg-orange-100'
    },
    {
      title: 'Active Bookings',
      value: kpis.activeBookings.toLocaleString(),
      change: `${kpis.bookingChange}% from last month`,
      isPositive: parseFloat(kpis.bookingChange) >= 0,
      icon: '📅',
      color: 'text-purple-600',
      bg: 'bg-purple-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">{card.title}</p>
              <h3 className="text-3xl font-bold text-slate-800">{card.value}</h3>
            </div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${card.bg} ${card.color}`}>
              {card.icon}
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className={`text-sm font-medium flex items-center ${card.isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
              {card.isPositive ? '↑' : '↓'} {Math.abs(parseFloat(card.change))}%
            </span>
            <span className="text-sm text-slate-500 ml-2">from last month</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KPICards;
