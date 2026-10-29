/**
 * Open-Meteo WMO Weather interpretation codes (WW)
 * Reference: https://open-meteo.com/en/docs
 */

export const WEATHER_CODES = {
  0: {
    label: 'Clear sky',
    category: 'clear',
    dayIcon: 'Sun',
    nightIcon: 'Moon',
  },
  1: {
    label: 'Mainly clear',
    category: 'clear',
    dayIcon: 'SunMedium',
    nightIcon: 'Moon',
  },
  2: {
    label: 'Partly cloudy',
    category: 'clouds',
    dayIcon: 'CloudSun',
    nightIcon: 'CloudMoon',
  },
  3: {
    label: 'Overcast',
    category: 'clouds',
    dayIcon: 'Cloud',
    nightIcon: 'Cloud',
  },
  45: {
    label: 'Foggy',
    category: 'fog',
    dayIcon: 'CloudFog',
    nightIcon: 'CloudFog',
  },
  48: {
    label: 'Depositing rime fog',
    category: 'fog',
    dayIcon: 'CloudFog',
    nightIcon: 'CloudFog',
  },
  51: {
    label: 'Light drizzle',
    category: 'rain',
    dayIcon: 'CloudDrizzle',
    nightIcon: 'CloudDrizzle',
  },
  53: {
    label: 'Moderate drizzle',
    category: 'rain',
    dayIcon: 'CloudDrizzle',
    nightIcon: 'CloudDrizzle',
  },
  55: {
    label: 'Dense drizzle',
    category: 'rain',
    dayIcon: 'CloudDrizzle',
    nightIcon: 'CloudDrizzle',
  },
  56: {
    label: 'Light freezing drizzle',
    category: 'snow',
    dayIcon: 'CloudSnow',
    nightIcon: 'CloudSnow',
  },
  57: {
    label: 'Dense freezing drizzle',
    category: 'snow',
    dayIcon: 'CloudSnow',
    nightIcon: 'CloudSnow',
  },
  61: {
    label: 'Slight rain',
    category: 'rain',
    dayIcon: 'CloudRain',
    nightIcon: 'CloudRain',
  },
  63: {
    label: 'Moderate rain',
    category: 'rain',
    dayIcon: 'CloudRain',
    nightIcon: 'CloudRain',
  },
  65: {
    label: 'Heavy rain',
    category: 'rain',
    dayIcon: 'CloudRain',
    nightIcon: 'CloudRain',
  },
  66: {
    label: 'Light freezing rain',
    category: 'snow',
    dayIcon: 'CloudSnow',
    nightIcon: 'CloudSnow',
  },
  67: {
    label: 'Heavy freezing rain',
    category: 'snow',
    dayIcon: 'CloudSnow',
    nightIcon: 'CloudSnow',
  },
  71: {
    label: 'Slight snow fall',
    category: 'snow',
    dayIcon: 'Snowflake',
    nightIcon: 'Snowflake',
  },
  73: {
    label: 'Moderate snow fall',
    category: 'snow',
    dayIcon: 'Snowflake',
    nightIcon: 'Snowflake',
  },
  75: {
    label: 'Heavy snow fall',
    category: 'snow',
    dayIcon: 'Snowflake',
    nightIcon: 'Snowflake',
  },
  77: {
    label: 'Snow grains',
    category: 'snow',
    dayIcon: 'Snowflake',
    nightIcon: 'Snowflake',
  },
  80: {
    label: 'Slight rain showers',
    category: 'rain',
    dayIcon: 'CloudRain',
    nightIcon: 'CloudRain',
  },
  81: {
    label: 'Moderate rain showers',
    category: 'rain',
    dayIcon: 'CloudRain',
    nightIcon: 'CloudRain',
  },
  82: {
    label: 'Violent rain showers',
    category: 'rain',
    dayIcon: 'CloudRain',
    nightIcon: 'CloudRain',
  },
  85: {
    label: 'Slight snow showers',
    category: 'snow',
    dayIcon: 'CloudSnow',
    nightIcon: 'CloudSnow',
  },
  86: {
    label: 'Heavy snow showers',
    category: 'snow',
    dayIcon: 'CloudSnow',
    nightIcon: 'CloudSnow',
  },
  95: {
    label: 'Thunderstorm',
    category: 'thunderstorm',
    dayIcon: 'CloudLightning',
    nightIcon: 'CloudLightning',
  },
  96: {
    label: 'Thunderstorm with slight hail',
    category: 'thunderstorm',
    dayIcon: 'CloudLightning',
    nightIcon: 'CloudLightning',
  },
  99: {
    label: 'Thunderstorm with heavy hail',
    category: 'thunderstorm',
    dayIcon: 'CloudLightning',
    nightIcon: 'CloudLightning',
  },
};

/**
 * Get weather info from WMO code
 * @param {number} code - WMO weather code
 * @param {number|boolean} isDay - 1 (true) for day, 0 (false) for night
 */
export function getWeatherInfo(code, isDay = 1) {
  const isDaytime = isDay === 1 || isDay === true;
  const weather = WEATHER_CODES[code] || {
    label: 'Unknown',
    category: 'clouds',
    dayIcon: 'Cloud',
    nightIcon: 'Cloud',
  };

  return {
    label: weather.label,
    category: weather.category,
    iconName: isDaytime ? weather.dayIcon : weather.nightIcon,
  };
}
