import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { CloudSun, Clock } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import UserProfileMenu from './UserProfileMenu';
import { formatHeaderDate } from '../utils/formatters';

const NAV_TABS = [
  { id: 'dashboard', label: 'Dashboard', targetId: 'main-content' },
  { id: 'maps', label: 'Maps', targetId: 'interactive-map-section' },
  { id: 'radar', label: 'Radar', targetId: 'interactive-map-section' },
  { id: 'forecasts', label: 'Forecasts', targetSelector: '.weekly-forecast-card, .locked-forecast-wrapper' },
];

export default function Header({ theme, onToggleTheme, tempUnit, onToggleUnit }) {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('dashboard');

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

  const handleTabClick = (tab) => {
    setActiveTab(tab.id);
    if (tab.targetId) {
      const el = document.getElementById(tab.targetId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (tab.targetSelector) {
      const el = document.querySelector(tab.targetSelector);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="app-header">
      {/* 1. Left Section: Logo & Branding with gentle glowing pulse */}
      <div className="header-left">
        <div className="header-brand">
          <div className="brand-logo" aria-hidden="true">
            <CloudSun size={24} className="brand-icon" />
            <div className="logo-pulse-ring" />
          </div>
          <div className="brand-text">
            <h1 className="brand-title">SkyPulse</h1>
            <span className="brand-subtitle">LIVE WEATHER DASHBOARD</span>
          </div>
        </div>
      </div>

      {/* 2. Center Section: Navigation with smooth animated active-tab indicator */}
      <div className="header-center">
        <nav className="header-nav-tabs" aria-label="Main Navigation">
          {NAV_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                className={`header-nav-tab ${isActive ? 'active' : ''}`}
                onClick={() => handleTabClick(tab)}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavPill"
                    className="nav-active-pill-bg"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="nav-tab-label">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* 3. Right Section: Date & Time, Unit Toggle, Dark Mode, Profile/Sign In */}
      <div className="header-right">
        {/* Date & Time Pill */}
        <div className="datetime-pill" title="Local System Time">
          <Clock size={14} className="datetime-icon" aria-hidden="true" />
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
          <UserProfileMenu />
        </div>
      </div>
    </header>
  );
}
