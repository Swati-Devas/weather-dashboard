import React from 'react';
import { motion } from 'motion/react';
import { Lock, Sparkles, CloudSun, Calendar, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LockedForecastCard() {
  const { openLoginModal } = useAuth();

  return (
    <section className="locked-forecast-wrapper" aria-label="Upcoming Weather Forecasts Restricted">
      {/* Blurred Decorative Mockup Backdrop (No Real Data Exposed) */}
      <div className="locked-mockup-backdrop" aria-hidden="true">
        <div className="mockup-row mockup-header">
          <div className="mockup-pill w-40" />
          <div className="mockup-pill w-24" />
        </div>
        <div className="mockup-hourly-strip">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="mockup-card">
              <div className="mockup-line w-12" />
              <div className="mockup-circle" />
              <div className="mockup-line w-16" />
            </div>
          ))}
        </div>
        <div className="mockup-chart-box">
          <div className="mockup-wave" />
        </div>
      </div>

      {/* Foreground Glassmorphic Locked Gate Card */}
      <motion.div
        className="card locked-gate-card"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="locked-badge-glow">
          <div className="locked-badge-inner">
            <Lock size={32} className="locked-badge-icon" />
          </div>
        </div>

        <div className="locked-text-group">
          <div className="locked-pill-tag">
            <Sparkles size={12} />
            <span>Subscriber Feature</span>
          </div>

          <h3 className="locked-heading">Upcoming Forecasts Locked</h3>
          <p className="locked-description">
            Sign in with your Google account to view upcoming weather conditions, hourly projections, 7-day outlooks, and temperature charts to plan ahead.
          </p>
        </div>

        {/* Feature Icons Preview */}
        <div className="locked-features-pills" aria-hidden="true">
          <span className="locked-pill-item">
            <CloudSun size={14} /> 24h Timeline
          </span>
          <span className="locked-pill-item">
            <Calendar size={14} /> 7-Day Outlook
          </span>
          <span className="locked-pill-item">
            <TrendingUp size={14} /> Trend Analytics
          </span>
        </div>

        <button
          type="button"
          className="unlock-forecast-btn"
          onClick={openLoginModal}
          aria-label="Unlock upcoming forecasts with Google"
        >
          <Lock size={16} />
          <span>Unlock Forecast</span>
        </button>
      </motion.div>
    </section>
  );
}

