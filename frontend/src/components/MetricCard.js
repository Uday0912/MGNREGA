import React from 'react';
import './MetricCard.css';

const MetricCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color = 'blue', 
  description,
  trend,
  trendValue 
}) => {
  return (
    <div className={`metric-card metric-card-${color}`}>
      <div className="metric-card-header">
        <div className={`metric-icon metric-icon-${color}`}>
          <Icon size={24} />
        </div>
        <div className="metric-content">
          <h3 className="metric-title">{title}</h3>
          <p className="metric-value">{value}</p>
        </div>
      </div>
      
      {description && (
        <p className="metric-description">{description}</p>
      )}
      
      {trend && (
        <div className={`metric-trend metric-trend-${trend}`}>
          <span className="trend-icon">
            {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'}
          </span>
          <span className="trend-value">
            {trendValue}
          </span>
        </div>
      )}
    </div>
  );
};

export default MetricCard;
