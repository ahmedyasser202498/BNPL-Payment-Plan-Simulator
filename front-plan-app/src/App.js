import logo from './logo.svg';
import './App.css';

import React, {Fragment, useEffect} from 'react';

import AppRoutes from './routes/Routes';

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <AppRoutes />
    </div>
  );
};

export default App;
