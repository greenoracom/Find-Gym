import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SuperAdminLayout from './admins/components/SuperAdmin/SuperAdminLayout';

import Dashboard from './admins/components/Dashboard/Dashboard';
import UsersList from './admins/components/Users/UsersList';
import AdminsList from './admins/components/Admins/AdminsList';
import CityAdminsList from './admins/components/CityAdmins/CityAdminsList';
import GymsList from './admins/components/Gyms/GymsList';
import GymOwnersList from './admins/components/GymOwners/GymOwnersList';
import TrainersList from './admins/components/Trainers/TrainersList';
import DietitiansList from './admins/components/Dietitians/DietitiansList';
import Payments from './admins/components/Payments/Payments';
import CMSManagement from './admins/components/CMS/CMSManagement';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/super-admin" replace />} />
        
        <Route path="/super-admin" element={<SuperAdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<UsersList />} />
          <Route path="admins" element={<AdminsList />} />
          <Route path="city-admins" element={<CityAdminsList />} />
          <Route path="gyms" element={<GymsList />} />
          <Route path="gym-owners" element={<GymOwnersList />} />
          <Route path="trainers" element={<TrainersList />} />
          <Route path="dietitians" element={<DietitiansList />} />
          <Route path="payments" element={<Payments />} />
          <Route path="cms" element={<CMSManagement />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
