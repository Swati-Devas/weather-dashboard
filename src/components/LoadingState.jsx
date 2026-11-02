import React from 'react';
import { CloudSun } from 'lucide-react';

export default function LoadingState() {
  return (
    <div className="skeleton-dashboard" aria-label="Loading weather data..." role="status">
      {/* Animated Floating Weather Badge Loader */}
      <div className="skeleton-hero-loader">
        <div className="weather-loader-halo">
          <CloudSun size={42} className="weather-loader-icon spin-gentle" />
        </div>
        <p className="weather-loader-text">Fetching atmospheric data...</p>
      </div>

      {/* Current Weather Skeleton */}
      <div className="card skeleton-current-card skeleton-pulse">
        <div className="skeleton-row skeleton-title-bar" />
        <div className="skeleton-hero-group">
          <div className="skeleton-big-number" />
          <div className="skeleton-big-circle" />
        </div>
        <div className="skeleton-row skeleton-footer-bar" />
      </div>

      {/* Metrics Grid Skeleton */}
      <div className="metrics-grid">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="card skeleton-metric-card skeleton-pulse">
            <div className="skeleton-metric-top" />
            <div className="skeleton-metric-val" />
            <div className="skeleton-metric-sub" />
          </div>
        ))}
      </div>

      {/* Hourly Skeleton */}
      <div className="card skeleton-hourly-card skeleton-pulse">
        <div className="skeleton-row" style={{ width: '180px', marginBottom: '1rem' }} />
        <div className="skeleton-hourly-row">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="skeleton-hourly-pill" />
          ))}
        </div>
      </div>

      {/* Weekly Skeleton */}
      <div className="card skeleton-weekly-card skeleton-pulse">
        <div className="skeleton-row" style={{ width: '160px', marginBottom: '1.25rem' }} />
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="skeleton-weekly-row" />
        ))}
      </div>
    </div>
  );
}
