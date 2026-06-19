import React from 'react';
import { Outlet, useLocation, Navigate } from 'react-router-dom';
import Layout from '../admins/components/HealthStoreOwner/Layout/Layout';

const HealthStoreOwnerDashboard = () => {
  const location = useLocation();
  const token = localStorage.getItem('hsOwnerToken');

  if (!token) {
    return <Navigate to="/health-store-owner/login" replace />;
  }

  const getTitle = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'Dashboard Overview';
    if (path.includes('/profile')) return 'Store Profile Management';
    if (path.includes('/diet-foods/add')) return 'Add New Diet/Food Item';
    if (path.includes('/diet-foods/edit')) return 'Edit Diet/Food Item';
    if (path.includes('/diet-foods')) return 'Diet Plans & Healthy Foods';
    if (path.includes('/supplements/add')) return 'Add New Supplement';
    if (path.includes('/supplements/edit')) return 'Edit Supplement';
    if (path.includes('/supplements')) return 'Premium Supplements';
    if (path.includes('/orders')) return 'Customer Orders';
    return 'Health Store Owner Panel';
  };

  return (
    <Layout title={getTitle()}>
      <Outlet />
    </Layout>
  );
};

export default HealthStoreOwnerDashboard;
