/**
 * Utility functions for formatting weather data
 */

/**
 * Format temperature based on unit (°C or °F)
 * @param {number} celsius
 * @param {'C' | 'F'} unit
 * @returns {string} e.g. "24°C" or "75°F"
 */
export function formatTemp(celsius, unit = 'C') {
  if (celsius === null || celsius === undefined || isNaN(celsius)) {
    return '--°';
  }
  if (unit === 'F') {
    const fahrenheit = (celsius * 9) / 5 + 32;
    return `${Math.round(fahrenheit)}°`;
  }
  return `${Math.round(celsius)}°`;
}

/**
 * Format wind speed
 * @param {number} kmh
 * @param {'km/h' | 'mph'} unit
 */
export function formatWindSpeed(kmh, unit = 'km/h') {
  if (kmh === null || kmh === undefined || isNaN(kmh)) return '--';
  if (unit === 'mph') {
    return `${Math.round(kmh * 0.621371)} mph`;
  }
  return `${Math.round(kmh)} km/h`;
}

/**
 * Format wind direction degrees to cardinal directions
 * @param {number} degrees
 */
export function formatWindDirection(degrees) {
  if (degrees === null || degrees === undefined || isNaN(degrees)) return '';
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round((degrees % 360) / 22.5) % 16;
  return directions[index];
}

/**
 * Format precipitation in mm
 * @param {number} mm
 */
export function formatPrecipitation(mm) {
  if (mm === null || mm === undefined || isNaN(mm)) return '0.0 mm';
  return `${Number(mm).toFixed(1)} mm`;
}

/**
 * Format percentage
 * @param {number} val
 */
export function formatPercent(val) {
  if (val === null || val === undefined || isNaN(val)) return '0%';
  return `${Math.round(val)}%`;
}

/**
 * Format ISO time string into 12-hour or 24-hour time e.g., "3:00 PM"
 * @param {string} isoString
 * @param {string} [timeZone]
 */
export function formatTime(isoString, timeZone) {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: timeZone || undefined,
    }).format(date);
  } catch {
    return isoString.slice(11, 16);
  }
}

/**
 * Format hour label for hourly forecast e.g. "Now", "4 PM"
 * @param {string} isoString
 * @param {boolean} isFirst
 * @param {string} [timeZone]
 */
export function formatHour(isoString, isFirst = false, timeZone) {
  if (isFirst) return 'Now';
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      hour12: true,
      timeZone: timeZone || undefined,
    }).format(date);
  } catch {
    return isoString.slice(11, 13) + ':00';
  }
}

/**
 * Format ISO date string into day name e.g., "Today", "Thu", "Friday"
 * @param {string} isoDateStr
 * @param {number} index
 * @param {string} [timeZone]
 */
export function formatDay(isoDateStr, index = 0, timeZone) {
  if (index === 0) return 'Today';
  if (index === 1) return 'Tomorrow';
  try {
    // Append T00:00:00 to avoid UTC timezone off-by-one errors with simple dates
    const date = new Date(`${isoDateStr.split('T')[0]}T12:00:00`);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      timeZone: timeZone || undefined,
    }).format(date);
  } catch {
    return isoDateStr;
  }
}

/**
 * Format date for header display e.g. "Thursday, Oct 29, 2026"
 * @param {Date} date
 */
export function formatHeaderDate(date = new Date()) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

/**
 * Get UV Index description and color class
 * @param {number} uv
 */
export function getUvIndexInfo(uv) {
  if (uv === null || uv === undefined || isNaN(uv)) return { text: 'Low', level: 'low' };
  const val = Math.round(uv);
  if (val <= 2) return { text: 'Low', level: 'low' };
  if (val <= 5) return { text: 'Moderate', level: 'moderate' };
  if (val <= 7) return { text: 'High', level: 'high' };
  if (val <= 10) return { text: 'Very High', level: 'very-high' };
  return { text: 'Extreme', level: 'extreme' };
}
