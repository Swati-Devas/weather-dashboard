import React from 'react';
import { motion } from 'motion/react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function ErrorMessage({ message, onRetry }) {
  return (
    <motion.div
      className="card error-banner-card"
      role="alert"
      initial={{ opacity: 0, scale: 0.98, y: -8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="error-icon-bubble">
        <AlertCircle size={26} className="error-icon" />
      </div>

      <div className="error-content">
        <h3 className="error-heading">Weather Information Notice</h3>
        <p className="error-description">
          {message || 'An unexpected issue occurred while fetching the live forecast. Please check your connection or retry.'}
        </p>

        {onRetry && (
          <button type="button" className="retry-btn" onClick={onRetry}>
            <RefreshCw size={14} className="retry-icon" />
            <span>Retry Forecast</span>
          </button>
        )}
      </div>
    </motion.div>
  );
}
