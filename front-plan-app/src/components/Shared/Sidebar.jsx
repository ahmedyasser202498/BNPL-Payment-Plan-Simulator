import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();

  return (
    <div
      className="bg-dark text-white p-3"
      style={{
        width: '250px',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1000,
        overflowY: 'auto'
      }}
    >
      <h4 className="mb-4">BNPL Dashboard</h4>
      <ul className="nav nav-pills flex-column">
        {user?.role === 'user' && (
          <li className="nav-item mb-2">
            <Link to="/user" className="nav-link text-white">User Dashboard</Link>
          </li>
        )}

        {user?.role === 'merchant' && (
          <>
            <li className="nav-item mb-2">
              <Link to="/merchant" className="nav-link text-white">Merchant Dashboard</Link>
            </li>
            <li className="nav-item mb-2">
              <Link to="/merchant/create" className="nav-link text-white">Create Plan</Link>
            </li>
          </>
        )}

        <li className="nav-item">
          <Link to="/" className="nav-link text-white" onClick={logout}>Logout</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
