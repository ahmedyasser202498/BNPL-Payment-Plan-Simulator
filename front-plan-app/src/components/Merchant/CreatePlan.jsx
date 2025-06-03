import React, { useState } from 'react';
import { createPlanApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Layout from '../Shared/Layout';
import { useNavigate } from 'react-router-dom';

const CreatePlan = () => {
  const [form, setForm] = useState({
    total_amount: 0,
    user_email: '',
    number_of_installments: 0,
    start_date: ''
  });

  const navigate = useNavigate();
  const [error, setError] = useState('');

  const { user } = useAuth();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    var flag=false
    try{
      await createPlanApi(form,user.token);
    } catch (err) {
      flag=true
      console.error(err);
      setError(err.response.data.non_field_errors[0]);
    }
    if(flag===false){
      alert('Plan created!');
      navigate('/merchant');
    }
  };

  return (
    <Layout>
      <div className="container mt-5 d-flex justify-content-center">
        <div className="bg-white p-5 rounded-4 shadow-sm" style={{ width: '30rem' }}>
          <div className="text-center mb-4">
            <h2 className="fw-semibold text-primary">Create BNPL Plan</h2>
            <p className="text-muted small">Split a total amount into easy monthly installments.</p>
          </div>

          <form onSubmit={handleSubmit}>

            {error && (
              <div className="alert alert-danger py-2 text-center small">{error}</div>
            )}
            <div className="mb-3">
              <label htmlFor="amount" className="form-label fw-semibold">Total Amount</label>
              <input
                type="number"
                id="amount"
                className="form-control"
                placeholder="Enter total amount"
                onChange={(e) => setForm((prev) => ({ ...prev, total_amount: e.target.value }))}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-semibold">User Email</label>
              <input
                type="email"
                id="email"
                className="form-control"
                placeholder="Enter user email"
                onChange={(e) => setForm((prev) => ({ ...prev, user_email: e.target.value }))}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="installments" className="form-label fw-semibold">Number of Installments</label>
              <input
                type="number"
                id="installments"
                className="form-control"
                placeholder="Enter number of installments"
                onChange={(e) => setForm((prev) => ({ ...prev, number_of_installments: e.target.value }))}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="start-date" className="form-label fw-semibold">Start Date</label>
              <input
                type="date"
                id="start-date"
                className="form-control"
                onChange={(e) => setForm((prev) => ({ ...prev, start_date: e.target.value }))}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold">
              Create Plan
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default CreatePlan;
