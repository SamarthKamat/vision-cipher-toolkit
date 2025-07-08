
import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ size = 'medium' }) => {
  return (
    <div className={`loading-spinner ${size}`}>
      <div className="spinner-ring"></div>
      <div className="spinner-ring delay-1"></div>
      <div className="spinner-ring delay-2"></div>
    </div>
  );
};

export default LoadingSpinner;
