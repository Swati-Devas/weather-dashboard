import React from 'react';
import { MapPin, ArrowUp, ArrowDown, Thermometer } from 'lucide-react';
import WeatherIcon from './WeatherIcon';
import { getWeatherInfo } from '../utils/weatherCodes';
import { formatTemp } from '../utils/formatters';

export default function CurrentWeather({ city, weather, tempUnit = 'C' }) {
  if (!weather || !weather.current) return null;

  const { current } = weather;
  const weatherInfo = getWeatherInfo(current.weatherCode, current.isDay);

  const formattedCity = city?.name || 'Selected City';
  const locationDetails = [city?.admin1, city?.country].filter(Boolean).join(', ');

  return (
    <article className="card current-weather-card" aria-label={`Current weather in ${formattedCity}`}>
      <div className="current-header">
        <div className="location-group">
          <div className="location-name-row">
            <MapPin size={22} className="location-pin-icon" aria-hidden="true" />
            <h2 className="current-city">{formattedCity}</h2>
          </div>
          {locationDetails && <p className="current-region">{locationDetails}</p>}
        </div>

        <div className="condition-badge" data-category={weatherInfo.category}>
          <span className="condition-dot" />
          <span className="condition-text">{weatherInfo.label}</span>
        </div>
      </div>

      <div className="current-body">
        {/* Main Temperature Hero */}
        <div className="current-temp-wrapper">
          <span className="current-temp-number" aria-label={`Temperature: ${formatTemp(current.temperature, tempUnit)}`}>
            {formatTemp(current.temperature, tempUnit)}
          </span>
          <span className="current-temp-unit">°{tempUnit}</span>
        </div>

        {/* Big Weather Icon */}
        <div className="current-icon-wrapper" aria-hidden="true">
          <WeatherIcon
            code={current.weatherCode}
            isDay={current.isDay}
            size={88}
            className="current-hero-icon"
          />
        </div>
      </div>

      <div className="current-footer">
        <div className="meta-stat feels-like-stat">
          <Thermometer size={17} className="meta-stat-icon" aria-hidden="true" />
          <span className="meta-stat-label">Feels like</span>
          <span className="meta-stat-value">{formatTemp(current.apparentTemperature, tempUnit)}</span>
        </div>

        <div className="high-low-stats" aria-label="Today's temperature range">
          <div className="meta-stat">
            <ArrowUp size={16} className="high-temp-arrow" aria-hidden="true" />
            <span className="meta-stat-label">High</span>
            <span className="meta-stat-value">{formatTemp(current.todayMax, tempUnit)}</span>
          </div>

          <div className="meta-stat">
            <ArrowDown size={16} className="low-temp-arrow" aria-hidden="true" />
            <span className="meta-stat-label">Low</span>
            <span className="meta-stat-value">{formatTemp(current.todayMin, tempUnit)}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
