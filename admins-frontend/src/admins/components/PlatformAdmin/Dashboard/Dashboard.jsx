import React, { useState, useEffect } from 'react';
import { getDashboardData } from '../../../../services/adminApi';
import KPICards from './KPICards';
import Charts from './Charts';
import QuickStats from './QuickStats';
import RecentActivities from './RecentActivities';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await getDashboardData();
        if (response.success) {
          setData(response.data);
        } else {
          setError('Failed to load dashboard data');
        }
      } catch (err) {
        setError(err.message || 'An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
        <h3 className="font-semibold text-lg">Error</h3>
        <p>{error}</p>
        <button 
          className="mt-2 text-sm underline hover:text-red-800"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="animate-fade-in">
      <KPICards kpis={data.kpis} />
      <Charts data={data.charts} />
      <QuickStats stats={data.quickStats} />
      <RecentActivities activities={data.recentActivities} />
    </div>
  );
};

export default Dashboard;
