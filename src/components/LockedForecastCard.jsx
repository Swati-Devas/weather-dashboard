import React from 'react';
import { motion } from 'motion/react';
import { Lock, Sparkles, CloudSun, Calendar, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LockedForecastCard() {
  const { openLoginModal } = useAuth();

  return (
    <section className="card locked-forecast-wrapper" aria-label="Upcoming Weather Forecasts Restricted">
      {/* Blurred Decorative Mockup Backdrop in Background */}
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

      {/* Centered Locked Gate Content Card */}
      <motion.div
        className="locked-gate-content"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="locked-badge-glow">
          <div className="locked-badge-inner">
            <Lock size={30} className="locked-badge-icon" />
          </div>
        </div>

        <div className="locked-text-group">
          <div className="locked-pill-tag">
            <Sparkles size={13} />
            <span>Subscriber Feature</span>
          </div>

          <h3 className="locked-heading">Upcoming Forecasts Locked</h3>
          <p className="locked-description">
            Sign in with your Google account to unlock full 24-hour detailed timelines, 7-day extended outlooks, and interactive temperature trend analytics.
          </p>
        </div>

        {/* Feature Icons Preview */}
        <div className="locked-features-pills" aria-hidden="true">
          <span className="locked-pill-item">
            <CloudSun size={14} className="text-cyan" /> 24h Timeline
          </span>
          <span className="locked-pill-item">
            <Calendar size={14} className="text-blue" /> 7-Day Outlook
          </span>
          <span className="locked-pill-item">
            <TrendingUp size={14} className="text-cyan" /> Trend Analytics
          </span>
        </div>

        {/* Unlock Forecast Action Button with generous padding and spacing */}
        <button
          type="button"
          className="unlock-forecast-btn"
          onClick={openLoginModal}
          aria-label="Unlock upcoming forecasts with Google"
        >
          <Lock size={17} />
          <span>Unlock Forecast</span>
        </button>
      </motion.div>
    </section>
  );
}
