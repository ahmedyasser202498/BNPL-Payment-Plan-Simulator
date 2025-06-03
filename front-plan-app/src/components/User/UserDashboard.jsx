import React, { useEffect, useState } from 'react';
import { fetchPlansApi, payInstallmentApi } from '../../services/api';
import ProgressBar from '../Shared/ProgressBar';
import { useAuth } from '../../context/AuthContext';
import Layout from '../Shared/Layout';
import InstallmentTable from '../Shared/InstallmentTable';

const UserDashboard = () => {
  const [plans, setPlans] = useState([]);
  const [expandedPlanId, setExpandedPlanId] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    (async () => {
      const data = await fetchPlansApi(user?.token);
      setPlans(data);
    })();
  }, []);

  const handlePay = async (installmentId) => {
    console.log(user?.token)
    await payInstallmentApi(installmentId, user?.token);
    const data = await fetchPlansApi(user?.token);
    setPlans(data);
  };

  const togglePlan = (planId) => {
    setExpandedPlanId(prev => (prev === planId ? null : planId));
  };

  return (
    <Layout>
      <div className="container py-4">
        <h1 className="mb-4 fw-semibold">User Dashboard</h1>

        {plans.map((plan) => (
          <div key={plan.id} className="card mb-4 shadow-sm">
            <div
              className="card-body"
              style={{ cursor: 'pointer' }}
              onClick={() => togglePlan(plan.id)}
            >
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">Plan: {plan.total_amount} ريال</h5>
                <span className="badge rounded-pill bg-light text-primary fw-medium shadow-sm px-3 py-1">
                  {expandedPlanId === plan.id ? (
                    <>
                      <i className="bi bi-chevron-up me-1"></i> Hide Details
                    </>
                  ) : (
                    <>
                      <i className="bi bi-chevron-down me-1"></i> View Details
                    </>
                  )}
                </span>
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

            {expandedPlanId === plan.id && (
              <div className="px-4 pb-4">
                <InstallmentTable installments={plan.installments} onPay={handlePay} />
              </div>
            )}
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default UserDashboard;
