import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { Clock, Droplets, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import WeatherIcon from './WeatherIcon';
import { formatHour, formatTemp, formatPercent } from '../utils/formatters';

export default function HourlyForecast({ hourly = [], timezone, tempUnit = 'C' }) {
  const scrollRef = useRef(null);

  if (!hourly || hourly.length === 0) return null;

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <motion.section
      className="card hourly-forecast-card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      aria-label="Hourly 24-hour Forecast"
    >
      <div className="forecast-card-header">
        <div className="forecast-header-left">
          <div className="header-icon-pill">
            <Clock size={16} className="forecast-header-icon" />
          </div>
          <div className="header-title-group">
            <h3 className="forecast-title">24-Hour Forecast</h3>
            <span className="forecast-subtitle">Hourly weather & rain outlook</span>
          </div>
        </div>

        <div className="scroll-controls" aria-hidden="true">
          <button
            type="button"
            className="scroll-btn"
            onClick={() => scroll('left')}
            aria-label="Scroll left"
            title="Scroll left"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            className="scroll-btn"
            onClick={() => scroll('right')}
            aria-label="Scroll right"
            title="Scroll right"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div
        className="hourly-scroll-container"
        ref={scrollRef}
        tabIndex={0}
        role="region"
        aria-label="Hourly forecast list"
      >
        <div className="hourly-track">
          {hourly.map((item, index) => {
            const isCurrent = index === 0;
            const hourText = formatHour(item.time, isCurrent, timezone);
            const hourNumber = new Date(item.time).getHours();
            const isDay = hourNumber >= 6 && hourNumber < 19 ? 1 : 0;
            const rainChance = item.precipProbability ?? 0;

            return (
              <motion.div
                key={item.time}
                className={`hourly-item ${isCurrent ? 'hourly-item--current' : ''}`}
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ duration: 0.15 }}
                aria-current={isCurrent ? 'time' : undefined}
              >
                {isCurrent && (
                  <span className="current-hour-tag">
                    <Sparkles size={9} />
                    <span>Now</span>
                  </span>
                )}

                <span className="hourly-time">{hourText}</span>

                <div className="hourly-icon-wrap">
                  <WeatherIcon code={item.weatherCode} isDay={isDay} size={30} />
                </div>

                <span className="hourly-temp">{formatTemp(item.temperature, tempUnit)}</span>

                {rainChance > 0 ? (
                  <div className="hourly-rain" title={`${rainChance}% precipitation chance`}>
                    <Droplets size={11} className="rain-icon" />
                    <span>{formatPercent(rainChance)}</span>
                  </div>
                ) : (
                  <div className="hourly-rain-placeholder" />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}
