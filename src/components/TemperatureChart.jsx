import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { TrendingUp, Clock, Calendar, Droplets } from 'lucide-react';
import { formatHour, formatDay, formatTemp } from '../utils/formatters';

/**
 * Custom glassmorphism tooltip for Recharts
 */
function CustomChartTooltip({ active, payload, label, tempUnit, activeTab }) {
  if (!active || !payload || !payload.length) return null;
  const data = payload[0].payload;

  return (
    <div className="custom-chart-tooltip">
      <p className="chart-tooltip-title">{data.label || label}</p>
      {activeTab === 'hourly' && (
        <>
          <p className="chart-tooltip-val">
            <span className="tooltip-color-dot temp-dot" />
            Temperature: <strong>{formatTemp(data.tempRaw, tempUnit)}</strong>
          </p>
          {data.rain !== undefined && (
            <p className="chart-tooltip-sub">
              <span className="tooltip-color-dot rain-dot" />
              Rain Chance: <strong>{data.rain}%</strong>
            </p>
          )}
        </>
      )}

      {activeTab === 'daily' && (
        <>
          <p className="chart-tooltip-val">
            <span className="tooltip-color-dot max-dot" />
            High: <strong>{formatTemp(data.maxRaw, tempUnit)}</strong>
          </p>
          <p className="chart-tooltip-sub">
            <span className="tooltip-color-dot min-dot" />
            Low: <strong>{formatTemp(data.minRaw, tempUnit)}</strong>
          </p>
        </>
      )}

      {activeTab === 'rain' && (
        <p className="chart-tooltip-val">
          <span className="tooltip-color-dot rain-dot" />
          Precipitation Chance: <strong>{data.rain}%</strong>
        </p>
      )}
    </div>
  );
}

export default function TemperatureChart({ hourly = [], daily = [], timezone, tempUnit = 'C' }) {
  const [activeTab, setActiveTab] = useState('hourly'); // 'hourly' | 'daily' | 'rain'

  // Convert hourly data for the chart
  const hourlyData = hourly.slice(0, 24).map((h, i) => {
    const rawC = h.temperature ?? 0;
    const displayTemp = tempUnit === 'F' ? Math.round((rawC * 9) / 5 + 32) : Math.round(rawC);

    return {
      name: formatHour(h.time, i === 0, timezone),
      label: formatHour(h.time, false, timezone),
      temperature: displayTemp,
      tempRaw: rawC,
      rain: h.precipProbability ?? 0,
    };
  });

  // Convert 7-day daily data for the chart
  const dailyData = daily.map((d, i) => {
    const minC = d.tempMin ?? 0;
    const maxC = d.tempMax ?? 0;
    const displayMin = tempUnit === 'F' ? Math.round((minC * 9) / 5 + 32) : Math.round(minC);
    const displayMax = tempUnit === 'F' ? Math.round((maxC * 9) / 5 + 32) : Math.round(maxC);

    return {
      name: formatDay(d.date, i, timezone),
      label: `${formatDay(d.date, i, timezone)} (${d.date.slice(5).replace('-', '/')})`,
      max: displayMax,
      min: displayMin,
      maxRaw: maxC,
      minRaw: minC,
      rain: d.precipProbabilityMax ?? 0,
    };
  });

  return (
    <section className="card temperature-chart-card" aria-label="Weather Trends and Graphs">
      <div className="chart-card-header">
        <div className="chart-header-left">
          <TrendingUp size={18} className="chart-header-icon" aria-hidden="true" />
          <h3 className="chart-title">Forecast Trends & Analytics</h3>
        </div>

        {/* Chart View Selector Tabs */}
        <div className="chart-tabs" role="tablist" aria-label="Forecast chart views">
          <button
            type="button"
            className={`chart-tab-btn ${activeTab === 'hourly' ? 'active' : ''}`}
            onClick={() => setActiveTab('hourly')}
            role="tab"
            aria-selected={activeTab === 'hourly'}
          >
            <Clock size={13} />
            <span>24h Temp</span>
          </button>

          <button
            type="button"
            className={`chart-tab-btn ${activeTab === 'daily' ? 'active' : ''}`}
            onClick={() => setActiveTab('daily')}
            role="tab"
            aria-selected={activeTab === 'daily'}
          >
            <Calendar size={13} />
            <span>7-Day Trend</span>
          </button>

          <button
            type="button"
            className={`chart-tab-btn ${activeTab === 'rain' ? 'active' : ''}`}
            onClick={() => setActiveTab('rain')}
            role="tab"
            aria-selected={activeTab === 'rain'}
          >
            <Droplets size={13} />
            <span>Rain Probability</span>
          </button>
        </div>
      </div>

      <div className="chart-canvas-wrapper">
        <ResponsiveContainer width="100%" height={230}>
          {activeTab === 'hourly' ? (
            <AreaChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="hourlyTempGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop stopColor="#38BDF8" stopOpacity={0.4} />
                  <stop stopColor="#38BDF8" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.07)" vertical={false} />
              <XAxis
                dataKey="name"
                stroke="#64748B"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              />
              <YAxis
                stroke="#64748B"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                unit="°"
                domain={['dataMin - 2', 'dataMax + 2']}
              />
              <Tooltip content={<CustomChartTooltip tempUnit={tempUnit} activeTab="hourly" />} />
              <Area
                type="monotone"
                dataKey="temperature"
                stroke="#38BDF8"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#hourlyTempGrad)"
              />
            </AreaChart>
          ) : activeTab === 'daily' ? (
            <AreaChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="dailyMaxGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop stopColor="#F59E0B" stopOpacity={0.35} />
                  <stop stopColor="#F59E0B" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="dailyMinGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop stopColor="#818CF8" stopOpacity={0.3} />
                  <stop stopColor="#818CF8" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.07)" vertical={false} />
              <XAxis
                dataKey="name"
                stroke="#64748B"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              />
              <YAxis
                stroke="#64748B"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                unit="°"
                domain={['dataMin - 2', 'dataMax + 2']}
              />
              <Tooltip content={<CustomChartTooltip tempUnit={tempUnit} activeTab="daily" />} />
              <Area
                type="monotone"
                dataKey="max"
                name="High"
                stroke="#F59E0B"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#dailyMaxGrad)"
              />
              <Area
                type="monotone"
                dataKey="min"
                name="Low"
                stroke="#818CF8"
                strokeWidth={2.2}
                fillOpacity={1}
                fill="url(#dailyMinGrad)"
              />
            </AreaChart>
          ) : (
            <AreaChart data={hourlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="rainGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop stopColor="#0EA5E9" stopOpacity={0.45} />
                  <stop stopColor="#0EA5E9" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.07)" vertical={false} />
              <XAxis
                dataKey="name"
                stroke="#64748B"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              />
              <YAxis
                stroke="#64748B"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                unit="%"
                domain={[0, 100]}
              />
              <Tooltip content={<CustomChartTooltip tempUnit={tempUnit} activeTab="rain" />} />
              <Area
                type="monotone"
                dataKey="rain"
                name="Rain"
                stroke="#0EA5E9"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#rainGrad)"
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </section>
  );
}

