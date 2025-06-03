import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from '../components/Auth/Login';
import Signup from '../components/Auth/Signup';
import CreatePlan from '../components/Merchant/CreatePlan';
import MerchantDashboard from '../components/Merchant/MerchantDashboard';
import UserDashboard from '../components/User/UserDashboard';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/merchant/create" element={<CreatePlan />} />
        <Route path="/merchant" element={<MerchantDashboard />} />
        <Route path="/user" element={<UserDashboard />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
