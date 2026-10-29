import React from 'react';
import { Calendar, Droplets } from 'lucide-react';
import WeatherIcon from './WeatherIcon';
import { getWeatherInfo } from '../utils/weatherCodes';
import { formatDay, formatTemp, formatPercent } from '../utils/formatters';

export default function WeeklyForecast({ daily = [], timezone, tempUnit = 'C' }) {
  if (!daily || daily.length === 0) return null;

  // Calculate week-wide min and max for the relative visual temperature bars
  const validMins = daily.map((d) => d.tempMin).filter((t) => t !== null && !isNaN(t));
  const validMaxs = daily.map((d) => d.tempMax).filter((t) => t !== null && !isNaN(t));

  const weekMin = validMins.length > 0 ? Math.min(...validMins) : 0;
  const weekMax = validMaxs.length > 0 ? Math.max(...validMaxs) : 35;
  const totalRange = weekMax - weekMin || 1;

  return (
    <section className="card weekly-forecast-card" aria-label="7-Day Weather Forecast">
      <div className="forecast-card-header">
        <div className="forecast-header-left">
          <Calendar size={18} className="forecast-header-icon" aria-hidden="true" />
          <h3 className="forecast-title">7-Day Forecast</h3>
        </div>
      </div>

      <div className="weekly-list">
        {daily.map((item, index) => {
          const dayName = formatDay(item.date, index, timezone);
          const weatherInfo = getWeatherInfo(item.weatherCode, 1);
          const rainChance = item.precipProbabilityMax ?? 0;

          // Calculate percentage offsets for bar fill
          const leftPercent = Math.max(0, Math.min(100, ((item.tempMin - weekMin) / totalRange) * 100));
          const widthPercent = Math.max(8, Math.min(100 - leftPercent, (((item.tempMax - item.tempMin) || 1) / totalRange) * 100));

          return (
            <div key={item.date} className="weekly-row">
              <div className="weekly-day-info">
                <span className="weekly-day-name">{dayName}</span>
                <span className="weekly-date-sub">{item.date.slice(5).replace('-', '/')}</span>
              </div>

              <div className="weekly-condition">
                <WeatherIcon code={item.weatherCode} isDay={1} size={22} />
                <span className="weekly-condition-label">{weatherInfo.label}</span>

                {rainChance > 0 && (
                  <span className="weekly-rain-badge" title={`${rainChance}% chance of rain`}>
                    <Droplets size={10} />
                    {formatPercent(rainChance)}
                  </span>
                )}
              </div>

              <div className="weekly-temp-range">
                <span className="temp-bound temp-min">{formatTemp(item.tempMin, tempUnit)}</span>

                {/* Relative temperature gauge bar */}
                <div className="temp-bar-track" aria-hidden="true">
                  <div
                    className="temp-bar-fill"
                    style={{
                      left: `${leftPercent}%`,
                      width: `${widthPercent}%`,
                    }}
                  />
                </div>

                <span className="temp-bound temp-max">{formatTemp(item.tempMax, tempUnit)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
