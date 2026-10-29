import React from 'react';
import {
  Sun,
  Moon,
  SunMedium,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  Snowflake,
  CloudLightning,
  HelpCircle,
} from 'lucide-react';
import { getWeatherInfo } from '../utils/weatherCodes';

const ICONS = {
  Sun,
  Moon,
  SunMedium,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  Snowflake,
  CloudLightning,
};

/**
 * Universal Weather Icon component
 * Accepts either `name` directly or `code` + `isDay`
 */
export default function WeatherIcon({
  name,
  code,
  isDay = 1,
  size = 24,
  className = '',
  strokeWidth = 2,
}) {
  let iconName = name;
  let category = 'clouds';

  if (code !== undefined) {
    const info = getWeatherInfo(code, isDay);
    iconName = info.iconName;
    category = info.category;
  }

  const IconComponent = ICONS[iconName] || HelpCircle;

  return (
    <IconComponent
      size={size}
      strokeWidth={strokeWidth}
      className={`weather-icon weather-icon--${category} ${className}`}
      aria-hidden="true"
    />
  );
}
