import React from 'react';
import { motion } from 'motion/react';
import { MapPin, ArrowUp, ArrowDown, Thermometer, Calendar, Clock } from 'lucide-react';
import WeatherIcon from './WeatherIcon';
import { getWeatherInfo } from '../utils/weatherCodes';
import { formatTemp, formatHeaderDate } from '../utils/formatters';

export default function CurrentWeather({ city, weather, tempUnit = 'C' }) {
  if (!weather || !weather.current) return null;

  const { current, timezone } = weather;
  const weatherInfo = getWeatherInfo(current.weatherCode, current.isDay);

  const formattedCity = city?.name || 'Selected City';
  const locationDetails = [city?.admin1, city?.country].filter(Boolean).join(', ');

  // Format local time for the selected city timezone
  const localTimeStr = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: timezone || undefined,
  }).format(new Date());

  const localDateStr = formatHeaderDate(new Date());

  return (
    <motion.article
      className="card current-weather-card"
      data-condition={weatherInfo.category}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      aria-label={`Current weather in ${formattedCity}`}
    >
      {/* Decorative weather ambient glow behind the card */}
      <div className={`current-weather-glow glow--${weatherInfo.category}`} aria-hidden="true" />

      <div className="current-header">
        <div className="location-group">
          <div className="location-name-row">
            <div className="location-pin-wrap" aria-hidden="true">
              <MapPin size={22} className="location-pin-icon" />
            </div>
            <h2 className="current-city">{formattedCity}</h2>
          </div>
          {locationDetails && <p className="current-region">{locationDetails}</p>}

          <div className="current-meta-datetime">
            <span className="datetime-sub-item">
              <Calendar size={13} />
              <span>{localDateStr}</span>
            </span>
            <span className="datetime-dot">•</span>
            <span className="datetime-sub-item">
              <Clock size={13} />
              <span>{localTimeStr}</span>
            </span>
          </div>
        </div>

        <div className="condition-badge-wrap">
          <div className="condition-badge" data-category={weatherInfo.category}>
            <span className="condition-pulse-dot" />
            <span className="condition-text">{weatherInfo.label}</span>
          </div>
        </div>
      </div>

      <div className="current-body">
        {/* Main Temperature Display */}
        <div className="current-temp-wrapper">
          <motion.span
            key={`${current.temperature}-${tempUnit}`}
            className="current-temp-number"
            initial={{ opacity: 0.6, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            aria-label={`Temperature: ${formatTemp(current.temperature, tempUnit)}`}
          >
            {formatTemp(current.temperature, tempUnit)}
          </motion.span>
          <span className="current-temp-unit">°{tempUnit}</span>
        </div>

        {/* Weather Illustration & Dynamic Halo */}
        <div className="current-illustration-wrap" aria-hidden="true">
          <div className={`illustration-halo halo--${weatherInfo.category}`} />
          <motion.div
            key={current.weatherCode}
            initial={{ scale: 0.8, rotate: -8, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 220, damping: 18 }}
            className="illustration-icon-box"
          >
            <WeatherIcon
              code={current.weatherCode}
              isDay={current.isDay}
              size={96}
              className="current-hero-icon"
            />
          </motion.div>
        </div>
      </div>

      <div className="current-footer">
        <div className="meta-stat feels-like-stat">
          <div className="meta-icon-bubble bubble-orange">
            <Thermometer size={16} />
          </div>
          <span className="meta-stat-label">Feels like</span>
          <span className="meta-stat-value">{formatTemp(current.apparentTemperature, tempUnit)}</span>
        </div>

        <div className="high-low-stats" aria-label="Today's temperature range">
          <div className="meta-stat">
            <div className="meta-icon-bubble bubble-red">
              <ArrowUp size={15} />
            </div>
            <span className="meta-stat-label">High</span>
            <span className="meta-stat-value">{formatTemp(current.todayMax, tempUnit)}</span>
          </div>

          <div className="meta-stat">
            <div className="meta-icon-bubble bubble-blue">
              <ArrowDown size={15} />
            </div>
            <span className="meta-stat-label">Low</span>
            <span className="meta-stat-value">{formatTemp(current.todayMin, tempUnit)}</span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
