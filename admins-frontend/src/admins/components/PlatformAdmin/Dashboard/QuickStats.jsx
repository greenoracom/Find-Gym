import React from 'react';

const QuickStats = ({ stats }) => {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-slate-800">Top Gyms by Members</h3>
          <span className="text-sm text-blue-600 hover:underline cursor-pointer">View All</span>
        </div>
        <div className="space-y-4">
          {stats.topGyms?.map((gym, index) => (
            <div key={gym.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </div>
                <span className="font-medium text-slate-700">{gym.name}</span>
              </div>
              <span className="text-slate-600 bg-slate-100 px-3 py-1 rounded-full text-sm font-medium">
                {gym.members} members
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-slate-800">Top Trainers by Rating</h3>
          <span className="text-sm text-blue-600 hover:underline cursor-pointer">View All</span>
        </div>
        <div className="space-y-4">
          {stats.topTrainers?.map((trainer, index) => (
            <div key={trainer.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </div>
                <span className="font-medium text-slate-700">{trainer.name}</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-yellow-500">⭐</span>
                <span className="text-slate-600 font-medium">{trainer.rating}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickStats;
