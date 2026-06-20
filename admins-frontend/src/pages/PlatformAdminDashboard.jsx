import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Layout from '../admins/components/PlatformAdmin/Layout/Layout';

const PlatformAdminDashboard = () => {
  const location = useLocation();
  
  const getTitle = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'Dashboard Overview';
    if (path.includes('/city-admins')) return 'City Admins';
    if (path.includes('/users')) return 'Users Management';
    if (path.includes('/gyms')) return 'Gyms Management';
    if (path.includes('/trainers')) return 'Trainers Management';
    if (path.includes('/payments')) return 'Payments & Revenue';
    if (path.includes('/cms')) return 'CMS Management';
    return 'Dashboard';
  };

  return (
    <Layout title={getTitle()}>
      <Outlet />
    </Layout>
  );
};

export default PlatformAdminDashboard;
