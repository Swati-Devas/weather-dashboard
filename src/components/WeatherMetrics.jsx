import React from 'react';
import { motion } from 'motion/react';
import {
  Droplets,
  Wind,
  SunMedium,
  Gauge,
  Navigation,
  Eye,
  Sunrise,
  Sunset,
} from 'lucide-react';
import {
  formatWindSpeed,
  formatWindDirection,
  formatPercent,
  getUvIndexInfo,
  formatVisibility,
  formatTime,
  calculateSunProgress,
} from '../utils/formatters';

export default function WeatherMetrics({ weather, tempUnit = 'C' }) {
  if (!weather || !weather.current) return null;

  const { current, timezone } = weather;

  // 1. Humidity & Circular Progress calculation
  const humidity = current.relativeHumidity ?? 0;
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (humidity / 100) * circumference;

  let humidityText = 'Comfortable';
  if (humidity > 70) humidityText = 'High humidity';
  else if (humidity < 30) humidityText = 'Dry air';

  // 2. Wind & Direction
  const windDir = formatWindDirection(current.windDirection);

  // 3. UV Index & Severity
  const uvVal = current.uvIndex !== null && current.uvIndex !== undefined ? Math.round(current.uvIndex) : 0;
  const uvInfo = getUvIndexInfo(current.uvIndex);
  const uvPercent = Math.min(100, (uvVal / 11) * 100);

  // 4. Visibility
  const visText = formatVisibility(current.visibility, tempUnit);
  let visQuality = 'Clear';
  if (current.visibility) {
    if (current.visibility < 2000) visQuality = 'Poor / Fog';
    else if (current.visibility < 5000) visQuality = 'Moderate haze';
    else visQuality = 'Excellent visibility';
  }

  // 5. Pressure Gauge
  const pressureVal = current.surfacePressure ? Math.round(current.surfacePressure) : 1013;
  // Standard atmospheric range 980 to 1040 hPa
  const pressurePercent = Math.max(0, Math.min(100, ((pressureVal - 980) / 60) * 100));

  // 6. Sunrise / Sunset
  const sunriseTime = formatTime(current.sunrise, timezone) || '06:00 AM';
  const sunsetTime = formatTime(current.sunset, timezone) || '06:00 PM';
  const sunProgress = calculateSunProgress(current.sunrise, current.sunset);

  return (
    <section className="weather-metrics-section" aria-label="Detailed Weather Metrics">
      <div className="metrics-grid">
        {/* Card 1: Humidity with Circular SVG Progress */}
        <motion.div
          className="card metric-card metric-card--interactive"
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
        >
          <div className="metric-header">
            <span className="metric-label">Humidity</span>
            <div className="metric-icon-bubble bubble-cyan" aria-hidden="true">
              <Droplets size={16} />
            </div>
          </div>

          <div className="metric-circular-body">
            <div className="metric-value-box">
              <span className="metric-value">{formatPercent(humidity)}</span>
              <span className="metric-subtext">{humidityText}</span>
            </div>

            <div className="circular-progress-wrap" aria-hidden="true">
              <svg width="60" height="60" className="progress-ring">
                <circle
                  className="progress-ring-track"
                  strokeWidth="5"
                  fill="transparent"
                  r={radius}
                  cx="30"
                  cy="30"
                />
                <circle
                  className="progress-ring-fill"
                  strokeWidth="5"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  r={radius}
                  cx="30"
                  cy="30"
                />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Card 2: Wind Speed & Interactive Direction Compass */}
        <motion.div
          className="card metric-card metric-card--interactive"
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
        >
          <div className="metric-header">
            <span className="metric-label">Wind</span>
            <div className="metric-icon-bubble bubble-teal" aria-hidden="true">
              <Wind size={16} />
            </div>
          </div>

          <div className="metric-value">{formatWindSpeed(current.windSpeed)}</div>

          <div className="wind-direction-row">
            <div className="compass-mini" aria-hidden="true">
              <Navigation
                size={14}
                className="wind-arrow-icon"
                style={{ transform: `rotate(${current.windDirection || 0}deg)` }}
              />
            </div>
            <span className="metric-subtext">
              {windDir ? `${windDir} (${Math.round(current.windDirection || 0)}°)` : 'Calm air'}
            </span>
          </div>
        </motion.div>

        {/* Card 3: UV Index with Color-coded Severity Bar */}
        <motion.div
          className="card metric-card metric-card--interactive"
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
        >
          <div className="metric-header">
            <span className="metric-label">UV Index</span>
            <div className="metric-icon-bubble bubble-amber" aria-hidden="true">
              <SunMedium size={16} />
            </div>
          </div>

          <div className="metric-value-row">
            <span className="metric-value">{current.uvIndex !== null ? uvVal : '--'}</span>
            <span className={`uv-severity-badge severity--${uvInfo.level}`}>
              {uvInfo.text}
            </span>
          </div>

          <div className="uv-progress-bar-track" aria-hidden="true">
            <div className="uv-progress-bar-fill" style={{ width: `${uvPercent}%` }} />
          </div>
        </motion.div>

        {/* Card 4: Visibility */}
        <motion.div
          className="card metric-card metric-card--interactive"
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
        >
          <div className="metric-header">
            <span className="metric-label">Visibility</span>
            <div className="metric-icon-bubble bubble-blue" aria-hidden="true">
              <Eye size={16} />
            </div>
          </div>

          <div className="metric-value">{visText}</div>
          <span className="metric-subtext">{visQuality}</span>
        </motion.div>

        {/* Card 5: Pressure with Gauge Bar */}
        <motion.div
          className="card metric-card metric-card--interactive"
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
        >
          <div className="metric-header">
            <span className="metric-label">Pressure</span>
            <div className="metric-icon-bubble bubble-purple" aria-hidden="true">
              <Gauge size={16} />
            </div>
          </div>

          <div className="metric-value">{pressureVal} <span className="metric-unit-sm">hPa</span></div>

          <div className="pressure-gauge-track" aria-hidden="true">
            <div className="pressure-gauge-fill" style={{ width: `${pressurePercent}%` }} />
          </div>
          <span className="metric-subtext">Atmospheric pressure</span>
        </motion.div>

        {/* Card 6: Sunrise & Sunset Timeline */}
        <motion.div
          className="card metric-card metric-card--interactive metric-card--sun"
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
        >
          <div className="metric-header">
            <span className="metric-label">Sun Schedule</span>
            <div className="metric-icon-bubble bubble-orange" aria-hidden="true">
              <Sunrise size={16} />
            </div>
          </div>

          {/* Miniature Parabolic Sun Path Arc */}
          <div className="sun-arc-container" aria-hidden="true">
            <div className="sun-arc-line" />
            <div
              className="sun-arc-dot"
              style={{ left: `${sunProgress}%` }}
              title={`Daylight Progress: ${sunProgress}%`}
            />
          </div>

          <div className="sun-times-row">
            <div className="sun-time-block">
              <Sunrise size={12} className="sun-sub-icon sunrise-gold" />
              <span>{sunriseTime}</span>
            </div>
            <div className="sun-time-block">
              <Sunset size={12} className="sun-sub-icon sunset-rose" />
              <span>{sunsetTime}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
