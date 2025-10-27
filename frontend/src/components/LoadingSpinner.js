import React from 'react';
import { Loader2, Database, BarChart3 } from 'lucide-react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ message = 'Loading MGNREGA Dashboard...', size = 'large' }) => {
  return (
    <div className={`loading-spinner ${size}`}>
      <div className="spinner-container">
        <div className="spinner-icons">
          <Database className="spinner-icon database" size={32} />
          <BarChart3 className="spinner-icon chart" size={24} />
        </div>
        <Loader2 className="spinner-loader" size={size === 'large' ? 48 : 24} />
        <p className="spinner-message">{message}</p>
        <p className="spinner-submessage">Fetching latest data from government sources...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
