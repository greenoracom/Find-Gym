import React from 'react';

const RecentActivities = ({ activities }) => {
  if (!activities || activities.length === 0) return null;

  const getIconAndColor = (type) => {
    switch(type) {
      case 'user_signup': return { icon: '👤', color: 'bg-blue-100 text-blue-600' };
      case 'gym_approved': return { icon: '✅', color: 'bg-emerald-100 text-emerald-600' };
      case 'trainer_approved': return { icon: '🏋️', color: 'bg-orange-100 text-orange-600' };
      case 'user_blocked': return { icon: '🚫', color: 'bg-red-100 text-red-600' };
      default: return { icon: '📝', color: 'bg-slate-100 text-slate-600' };
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
      month: 'short', day: 'numeric', 
      hour: '2-digit', minute:'2-digit' 
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mt-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-6">Recent Activities</h3>
      <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
        {activities.map((activity, index) => {
          const { icon, color } = getIconAndColor(activity.type);
          return (
            <div key={activity.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              {/* Icon */}
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white ${color} shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2`}>
                {icon}
              </div>
              
              {/* Content */}
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-slate-50 p-4 rounded-xl border border-slate-100 shadow-sm group-hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-medium text-slate-800">{activity.description}</h4>
                  <time className="text-xs text-slate-500 font-medium whitespace-nowrap ml-4">
                    {formatDate(activity.timestamp)}
                  </time>
                </div>
                <p className="text-sm text-slate-500 capitalize">{activity.type.replace('_', ' ')}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentActivities;
