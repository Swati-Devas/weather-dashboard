import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="card error-banner-card" role="alert">
      <div className="error-icon-bubble">
        <AlertCircle size={28} className="error-icon" />
      </div>

      <div className="error-content">
        <h3 className="error-heading">Weather Data Unavailable</h3>
        <p className="error-description">
          {message || 'An unexpected error occurred while fetching weather data. Please try again.'}
        </p>

        {onRetry && (
          <button type="button" className="retry-btn" onClick={onRetry}>
            <RefreshCw size={15} />
            <span>Try Again</span>
          </button>
        )}
      </div>
    </div>
  );
}
