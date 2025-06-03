import React from 'react';

const ProgressBar = ({ total, paid }) => {
  const percent = Math.round((paid / total) * 100);

  return (
    <div className="mb-2">
      <div className="d-flex justify-content-between align-items-center mb-1">
        <span className="fw-semibold text-muted small">Progress</span>
      </div>
      <div className="progress" style={{ height: '10px', borderRadius: '50px' }}>
        <div
          className="progress-bar"
          role="progressbar"
          style={{
            width: `${percent}%`,
            background: 'linear-gradient(90deg, #0d6efd 0%, #66b2ff 100%)',
            transition: 'width 0.4s ease-in-out',
            borderRadius: '50px'
          }}
          aria-valuenow={percent}
          aria-valuemin="0"
          aria-valuemax="100"
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
