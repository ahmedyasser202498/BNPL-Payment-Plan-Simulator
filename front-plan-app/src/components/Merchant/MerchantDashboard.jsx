import React, { useEffect, useState } from 'react';
import { fetchPlansApi } from '../../services/api';
import ProgressBar from '../Shared/ProgressBar';
import { useAuth } from '../../context/AuthContext';
import Layout from '../Shared/Layout';
import SummaryCards from '../Shared/SummaryCards';

const MerchantDashboard = () => {
  const [plans, setPlans] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    (async () => {
      const data = await fetchPlansApi(user?.token);
      setPlans(data);
    })();
  }, []);

  const totalRevenue = plans.reduce(
    (sum, plan) =>  sum + parseFloat(plan.total_paid_amount),
    0
  );
  const totalPlans = plans.length;
  const successfulPlans = plans.filter(plan => plan.status === 'Settled').length;

  return (
    <Layout>
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="display-6 fw-semibold text-dark">Merchant Dashboard</h1>
          <span className="text-muted">Welcome, {user?.email}</span>
        </div>
        <SummaryCards
          totalRevenue={totalRevenue}
          totalPlans={totalPlans}
          successfulPlans={successfulPlans}
        />
        {plans.map((plan) => (
          <div key={plan.id} className="card mb-4 border-0 shadow-sm rounded-4">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="card-title mb-0 fw-semibold text-primary">
                  {plan.user_email}
                </h5>
                <span
                  className={`badge text-bg-${
                    plan.status === 'Settled'
                      ? 'success'
                      : plan.status === 'Active'
                      ? 'warning'
                      : 'danger'
                  }`}
                >
                  {plan.status}
                </span>
              </div>

              <div className="mb-3">
                <h6 className="text-muted mb-1">Total Amount</h6>
                <div className="fs-5 fw-bold text-dark">{plan.total_amount} ريال</div>
              </div>

              <ProgressBar
                total={plan.number_of_installments}
                paid={plan.number_of_paid_installments}
              />

              <div className="mt-3">
                <ul className="list-unstyled small text-muted">
                  <li>
                    <strong>Installments:</strong> {plan.number_of_installments}
                  </li>
                  <li>
                    <strong>Paid:</strong> {plan.number_of_paid_installments} /{' '}
                    {plan.number_of_installments}
                  </li>
                  <li>
                    <strong>Start Date:</strong> {plan.start_date}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ))}

      </div>
    </Layout>
  );
};

export default MerchantDashboard;
