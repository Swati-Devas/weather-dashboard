import React from 'react';
import {
  Droplets,
  Wind,
  Thermometer,
  CloudRain,
  SunMedium,
  Gauge,
  Navigation,
} from 'lucide-react';
import {
  formatTemp,
  formatWindSpeed,
  formatWindDirection,
  formatPrecipitation,
  formatPercent,
  getUvIndexInfo,
} from '../utils/formatters';

export default function WeatherMetrics({ weather, tempUnit = 'C' }) {
  if (!weather || !weather.current) return null;

  const { current } = weather;

  const humidity = current.relativeHumidity;
  let humidityText = 'Comfortable';
  if (humidity > 70) humidityText = 'High humidity';
  else if (humidity < 30) humidityText = 'Dry air';

  const windDir = formatWindDirection(current.windDirection);
  const uvInfo = getUvIndexInfo(current.uvIndex);

  const metrics = [
    {
      id: 'humidity',
      label: 'Humidity',
      icon: Droplets,
      iconColor: 'var(--metric-blue)',
      value: formatPercent(humidity),
      subtext: humidityText,
    },
    {
      id: 'wind',
      label: 'Wind Speed',
      icon: Wind,
      iconColor: 'var(--metric-teal)',
      value: formatWindSpeed(current.windSpeed),
      subtext: (
        <span className="wind-direction-subtext">
          <Navigation
            size={12}
            className="wind-arrow-icon"
            style={{ transform: `rotate(${current.windDirection || 0}deg)` }}
            aria-hidden="true"
          />
          {windDir ? `From ${windDir}` : 'Calm'}
        </span>
      ),
    },
    {
      id: 'apparent',
      label: 'Feels Like',
      icon: Thermometer,
      iconColor: 'var(--metric-orange)',
      value: `${formatTemp(current.apparentTemperature, tempUnit)}°${tempUnit}`,
      subtext:
        Math.abs(current.apparentTemperature - current.temperature) < 1.5
          ? 'Similar to actual temp'
          : current.apparentTemperature > current.temperature
          ? 'Warmer due to humidity'
          : 'Cooler due to wind',
    },
    {
      id: 'precipitation',
      label: 'Precipitation',
      icon: CloudRain,
      iconColor: 'var(--metric-indigo)',
      value: formatPrecipitation(current.precipitation),
      subtext: current.precipitation > 0 ? 'Recorded rainfall' : 'No rain expected',
    },
    {
      id: 'uv',
      label: 'UV Index',
      icon: SunMedium,
      iconColor: 'var(--metric-amber)',
      value: current.uvIndex !== null && current.uvIndex !== undefined ? Math.round(current.uvIndex) : '--',
      subtext: `${uvInfo.text} exposure`,
    },
    {
      id: 'pressure',
      label: 'Pressure',
      icon: Gauge,
      iconColor: 'var(--metric-purple)',
      value: current.surfacePressure ? `${Math.round(current.surfacePressure)} hPa` : '--',
      subtext: 'Atmospheric level',
    },
  ];

  return (
    <section className="weather-metrics-section" aria-label="Detailed Weather Metrics">
      <div className="metrics-grid">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.id} className="card metric-card">
              <div className="metric-header">
                <span className="metric-label">{m.label}</span>
                <div className="metric-icon-bubble" style={{ color: m.iconColor }} aria-hidden="true">
                  <Icon size={18} strokeWidth={2.2} />
                </div>
              </div>
              <div className="metric-value">{m.value}</div>
              <div className="metric-subtext">{m.subtext}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
