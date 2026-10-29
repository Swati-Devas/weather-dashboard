import React, { useState, useEffect } from 'react';
import { CloudSun, Clock } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { formatHeaderDate } from '../utils/formatters';

export default function Header({ theme, onToggleTheme, tempUnit, onToggleUnit }) {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const timeString = currentDateTime.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <header className="app-header">
      <div className="header-brand">
        <div className="brand-logo" aria-hidden="true">
          <CloudSun size={28} className="brand-icon" />
        </div>
        <div className="brand-text">
          <h1 className="brand-title">SkyPulse</h1>
          <span className="brand-subtitle">Live Weather Dashboard</span>
        </div>
      </div>

      <div className="header-meta">
        <div className="datetime-pill" title="Local System Time">
          <Clock size={15} className="datetime-icon" aria-hidden="true" />
          <span className="datetime-text">
            <span className="date-part">{formatHeaderDate(currentDateTime)}</span>
            <span className="divider">•</span>
            <span className="time-part">{timeString}</span>
          </span>
        </div>

        <div className="header-controls">
          {/* Temperature unit switch */}
          <div className="unit-switch" role="group" aria-label="Temperature unit selector">
            <button
              type="button"
              className={`unit-btn ${tempUnit === 'C' ? 'active' : ''}`}
              onClick={() => onToggleUnit('C')}
              aria-pressed={tempUnit === 'C'}
              aria-label="Celsius"
            >
              °C
            </button>
            <button
              type="button"
              className={`unit-btn ${tempUnit === 'F' ? 'active' : ''}`}
              onClick={() => onToggleUnit('F')}
              aria-pressed={tempUnit === 'F'}
              aria-label="Fahrenheit"
            >
              °F
            </button>
          </div>

          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>
      </div>
    </header>
  );
}
