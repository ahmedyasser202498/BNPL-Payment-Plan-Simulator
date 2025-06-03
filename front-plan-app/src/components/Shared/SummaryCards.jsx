import React from 'react';

const SummaryCards = ({ totalRevenue, totalPlans, successfulPlans }) => {
  const successRate = totalPlans ? ((successfulPlans / totalPlans) * 100).toFixed(1) : 0;

  return (
    <div className="row mb-4">
      <div className="col-md-6 col-lg-4">
        <div className="card shadow-sm border-0 rounded-4 p-3">
          <h6 className="text-muted">Total Revenue</h6>
          <h4 className="fw-bold">{totalRevenue} ريال</h4>
        </div>
      </div>
      <div className="col-md-6 col-lg-4">
        <div className="card shadow-sm border-0 rounded-4 p-3">
          <h6 className="text-muted">Total Plans</h6>
          <h4 className="fw-bold">{totalPlans}</h4>
        </div>
      </div>
      <div className="col-md-6 col-lg-4">
        <div className="card shadow-sm border-0 rounded-4 p-3">
          <h6 className="text-muted">Success Rate</h6>
          <h4 className="fw-bold">{successRate}%</h4>
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;
