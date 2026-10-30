/**
 * Open-Meteo API Service
 * Handles city geocoding search, reverse geocoding, and weather forecast retrieval
 */

const GEOCODING_BASE_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_BASE_URL = 'https://api.open-meteo.com/v1/forecast';

/**
 * Search cities by name using Open-Meteo Geocoding API
 * @param {string} cityName - Name of the city to search for
 * @param {AbortSignal} [signal] - Optional abort signal to cancel requests
 * @returns {Promise<Array>} List of matching city objects
 */
export async function searchCities(cityName, signal) {
  const query = cityName?.trim();
  if (!query) {
    throw new Error('Please enter a city name.');
  }

  const params = new URLSearchParams({
    name: query,
    count: '5',
    language: 'en',
    format: 'json',
  });

  const url = `${GEOCODING_BASE_URL}?${params.toString()}`;

  try {
    const response = await fetch(url, { signal });

    if (!response.ok) {
      throw new Error(`Geocoding server responded with status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      throw new Error(`No locations found matching "${query}". Check spelling or try a different city.`);
    }

    return data.results.map((item) => ({
      id: item.id || `${item.latitude}-${item.longitude}`,
      name: item.name,
      latitude: item.latitude,
      longitude: item.longitude,
      country: item.country || '',
      countryCode: item.country_code || '',
      admin1: item.admin1 || '',
      timezone: item.timezone || 'auto',
    }));
  } catch (err) {
    if (err.name === 'AbortError') {
      throw err;
    }
    // Re-throw user-friendly message
    throw new Error(err.message || 'Failed to search for city. Please check your internet connection.');
  }
}

/**
 * Reverse geocode coordinates to find the nearest city/place name
 * Uses BigDataCloud client API with fallback to Nominatim (OpenStreetMap)
 * and graceful fallback to coordinates string if in remote/ocean regions.
 * @param {number} latitude
 * @param {number} longitude
 * @param {AbortSignal} [signal]
 * @returns {Promise<{ name: string, country: string, admin1: string, latitude: number, longitude: number, timezone: string }>}
 */
export async function reverseGeocode(latitude, longitude, signal) {
  const lat = Number(latitude);
  const lon = Number(longitude);
  if (isNaN(lat) || isNaN(lon)) {
    throw new Error('Invalid coordinates for reverse geocoding.');
  }

  const defaultLocation = {
    name: `Location (${lat >= 0 ? lat.toFixed(2) + '°N' : Math.abs(lat).toFixed(2) + '°S'}, ${lon >= 0 ? lon.toFixed(2) + '°E' : Math.abs(lon).toFixed(2) + '°W'})`,
    country: '',
    admin1: '',
    latitude: lat,
    longitude: lon,
    timezone: 'auto',
  };

  // 1. Try BigDataCloud free client reverse geocoding (fast, CORS-enabled, client-friendly)
  try {
    const bdcUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
    const res = await fetch(bdcUrl, { signal });
    if (res.ok) {
      const data = await res.json();
      const cityName =
        data.city ||
        data.locality ||
        data.principalSubdivision ||
        (data.localityInfo && data.localityInfo.administrative && data.localityInfo.administrative[0]?.name);
      const country = data.countryName || '';
      const admin1 = data.principalSubdivision || '';

      if (cityName || country) {
        return {
          name: cityName || country,
          country: country,
          admin1: admin1 !== cityName ? admin1 : '',
          latitude: lat,
          longitude: lon,
          timezone: 'auto',
        };
      }
    }
  } catch (err) {
    if (err.name === 'AbortError') throw err;
  }

  // 2. Fallback to OpenStreetMap Nominatim reverse geocoding
  try {
    const osmUrl = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
    const res = await fetch(osmUrl, {
      signal,
      headers: { Accept: 'application/json' },
    });
    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      const cityName =
        addr.city ||
        addr.town ||
        addr.village ||
        addr.municipality ||
        addr.county ||
        addr.state;
      const country = addr.country || '';
      const admin1 = addr.state || addr.region || '';

      if (cityName || country) {
        return {
          name: cityName || country,
          country: country,
          admin1: admin1 !== cityName ? admin1 : '',
          latitude: lat,
          longitude: lon,
          timezone: 'auto',
        };
      }
    }
  } catch (err) {
    if (err.name === 'AbortError') throw err;
  }

  // 3. Fallback when over uninhabited water or remote regions
  return defaultLocation;
}

/**
 * Fetch complete live weather data for given coordinates
 * @param {number} latitude
 * @param {number} longitude
 * @param {string} [timezone='auto']
 * @param {AbortSignal} [signal]
 */
export async function fetchWeatherData(latitude, longitude, timezone = 'auto', signal) {
  if (latitude === undefined || longitude === undefined || isNaN(latitude) || isNaN(longitude)) {
    throw new Error('Invalid coordinates provided.');
  }

  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'is_day',
      'precipitation',
      'weather_code',
      'wind_speed_10m',
      'wind_direction_10m',
      'surface_pressure',
      'uv_index',
    ].join(','),
    hourly: [
      'temperature_2m',
      'precipitation_probability',
      'weather_code',
      'relative_humidity_2m',
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'precipitation_sum',
      'precipitation_probability_max',
      'uv_index_max',
    ].join(','),
    timezone: timezone || 'auto',
    forecast_days: '7',
  });

  const url = `${FORECAST_BASE_URL}?${params.toString()}`;

  try {
    const response = await fetch(url, { signal });

    if (!response.ok) {
      throw new Error(`Weather service responded with status: ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.reason || 'Failed to retrieve weather data from Open-Meteo.');
    }

    return parseWeatherData(data);
  } catch (err) {
    if (err.name === 'AbortError') {
      throw err;
    }
    throw new Error(err.message || 'Unable to fetch weather forecast. Please try again.');
  }
}

/**
 * Parse and validate Open-Meteo response into clean domain models
 * @param {Object} raw
 */
function parseWeatherData(raw) {
  const current = raw.current || {};
  const hourly = raw.hourly || {};
  const daily = raw.daily || {};

  // Process next 24 hours starting from current time
  const currentIsoTime = current.time;
  let startIndex = 0;
  if (hourly.time && hourly.time.length > 0 && currentIsoTime) {
    const currentIndex = hourly.time.findIndex((t) => t >= currentIsoTime);
    if (currentIndex !== -1) {
      startIndex = currentIndex;
    }
  }

  const hourlyList = [];
  const totalHourly = hourly.time ? hourly.time.length : 0;
  for (let i = startIndex; i < Math.min(startIndex + 24, totalHourly); i++) {
    hourlyList.push({
      time: hourly.time[i],
      temperature: hourly.temperature_2m ? hourly.temperature_2m[i] : null,
      weatherCode: hourly.weather_code ? hourly.weather_code[i] : 0,
      precipProbability: hourly.precipitation_probability ? hourly.precipitation_probability[i] : 0,
      humidity: hourly.relative_humidity_2m ? hourly.relative_humidity_2m[i] : null,
    });
  }

  // Process 7-day forecast
  const dailyList = [];
  const totalDays = daily.time ? daily.time.length : 0;
  for (let i = 0; i < totalDays; i++) {
    dailyList.push({
      date: daily.time[i],
      weatherCode: daily.weather_code ? daily.weather_code[i] : 0,
      tempMax: daily.temperature_2m_max ? daily.temperature_2m_max[i] : null,
      tempMin: daily.temperature_2m_min ? daily.temperature_2m_min[i] : null,
      precipSum: daily.precipitation_sum ? daily.precipitation_sum[i] : 0,
      precipProbabilityMax: daily.precipitation_probability_max ? daily.precipitation_probability_max[i] : 0,
      uvIndexMax: daily.uv_index_max ? daily.uv_index_max[i] : 0,
    });
  }

  return {
    timezone: raw.timezone,
    timezoneAbbreviation: raw.timezone_abbreviation,
    elevation: raw.elevation,
    current: {
      time: current.time,
      temperature: current.temperature_2m,
      apparentTemperature: current.apparent_temperature,
      relativeHumidity: current.relative_humidity_2m,
      isDay: current.is_day ?? 1,
      precipitation: current.precipitation ?? 0,
      weatherCode: current.weather_code ?? 0,
      windSpeed: current.wind_speed_10m ?? 0,
      windDirection: current.wind_direction_10m ?? 0,
      surfacePressure: current.surface_pressure ?? null,
      uvIndex: current.uv_index ?? null,
      // Today's high and low from daily forecast
      todayMax: daily.temperature_2m_max ? daily.temperature_2m_max[0] : null,
      todayMin: daily.temperature_2m_min ? daily.temperature_2m_min[0] : null,
    },
    hourly: hourlyList,
    daily: dailyList,
  };
}
