import React, { useRef } from 'react';
import { Clock, Droplets, ChevronLeft, ChevronRight } from 'lucide-react';
import WeatherIcon from './WeatherIcon';
import { formatHour, formatTemp, formatPercent } from '../utils/formatters';

export default function HourlyForecast({ hourly = [], timezone, tempUnit = 'C' }) {
  const scrollRef = useRef(null);

  if (!hourly || hourly.length === 0) return null;

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="card hourly-forecast-card" aria-label="Hourly 24-hour Forecast">
      <div className="forecast-card-header">
        <div className="forecast-header-left">
          <Clock size={18} className="forecast-header-icon" aria-hidden="true" />
          <h3 className="forecast-title">24-Hour Forecast</h3>
        </div>

        <div className="scroll-controls" aria-hidden="true">
          <button
            type="button"
            className="scroll-btn"
            onClick={() => scroll('left')}
            aria-label="Scroll hourly forecast left"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            className="scroll-btn"
            onClick={() => scroll('right')}
            aria-label="Scroll hourly forecast right"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="hourly-scroll-container" ref={scrollRef} tabIndex={0} role="region" aria-label="Hourly timeline">
        <div className="hourly-track">
          {hourly.map((item, index) => {
            const isCurrent = index === 0;
            const hourText = formatHour(item.time, isCurrent, timezone);
            // Check day/night for hourly: between 6 AM and 8 PM roughly, or default 1
            const hourNumber = new Date(item.time).getHours();
            const isDay = hourNumber >= 6 && hourNumber < 19 ? 1 : 0;
            const rainChance = item.precipProbability ?? 0;

            return (
              <div
                key={item.time}
                className={`hourly-item ${isCurrent ? 'hourly-item--current' : ''}`}
                aria-current={isCurrent ? 'time' : undefined}
              >
                <span className="hourly-time">{hourText}</span>

                <div className="hourly-icon-wrap">
                  <WeatherIcon code={item.weatherCode} isDay={isDay} size={28} />
                </div>

                <span className="hourly-temp">{formatTemp(item.temperature, tempUnit)}</span>

                {rainChance > 0 ? (
                  <div className="hourly-rain" title={`${rainChance}% chance of precipitation`}>
                    <Droplets size={11} className="rain-icon" />
                    <span>{formatPercent(rainChance)}</span>
                  </div>
                ) : (
                  <div className="hourly-rain-placeholder" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
