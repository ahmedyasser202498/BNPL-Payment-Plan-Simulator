import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

import { signUpApi } from '../../services/api';
import BG from "../../assets/images/Abstract-Grey-DNA-Molecular-Structure-Animated-Background-.gif";

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signUpApi({
        email,
        password,
        is_merchant: role === 'merchant',
      });

      navigate('/');
    } catch (err) {
      setError('Signup failed. Please check your input.');
      console.error(err);
    }
  };  

  return (
    <div
      className="d-flex align-items-center justify-content-center min-vh-100"
      style={{
        backgroundImage: `url(${BG})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        backdropFilter: 'blur(5px)',
        color: '#000'
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white p-5 rounded-4 shadow-sm"
        style={{ width: '28rem', backdropFilter: 'blur(5px)', backgroundColor: 'rgba(255, 255, 255, 0.85)' }}
      >
        <h2 className="mb-4 text-center text-primary fw-bold">Create Account</h2>

        {error && (
          <div className="alert alert-danger py-2 text-center small">{error}</div>
        )}

        <div className="mb-3">
          <label htmlFor="email" className="form-label fw-semibold">Email address</label>
          <input
            type="email"
            id="email"
            className="form-control"
            placeholder="e.g. user@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label fw-semibold">Password</label>
          <input
            type="password"
            id="password"
            className="form-control"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="role" className="form-label fw-semibold">Sign Up As</label>
          <select
            id="role"
            className="form-select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="user">User</option>
            <option value="merchant">Merchant</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary w-100 fw-semibold py-2">
          Sign Up
        </button>


        <div className="text-center mt-3">
          <span className="text-muted">Already have an account? </span>
          <Link to="/" className="text-primary fw-semibold text-decoration-none">Log In</Link>
        </div>
      </form>
    </div>
  );
};

export default Signup;
