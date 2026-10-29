import React, { useState, useEffect, useRef, useCallback } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import WeatherMetrics from './components/WeatherMetrics';
import HourlyForecast from './components/HourlyForecast';
import WeeklyForecast from './components/WeeklyForecast';
import LoadingState from './components/LoadingState';
import ErrorMessage from './components/ErrorMessage';
import { searchCities, fetchWeatherData } from './services/weatherApi';

const DEFAULT_CITY = {
  name: 'Bengaluru',
  country: 'India',
  admin1: 'Karnataka',
  latitude: 12.9716,
  longitude: 77.5946,
  timezone: 'Asia/Kolkata',
};

export default function App() {
  // Theme state: Persisted in localStorage, respects system theme
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('weather_theme');
    if (saved) return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });

  // Temperature unit: 'C' or 'F'
  const [tempUnit, setTempUnit] = useState(() => {
    return localStorage.getItem('weather_temp_unit') || 'C';
  });

  // Active City & Weather Data
  const [selectedCity, setSelectedCity] = useState(DEFAULT_CITY);
  const [weatherData, setWeatherData] = useState(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(true);
  const [weatherError, setWeatherError] = useState(null);

  // Search state
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchError, setSearchError] = useState(null);

  // Geolocation state
  const [isLocating, setIsLocating] = useState(false);

  // Abort controllers to prevent race conditions
  const weatherAbortRef = useRef(null);
  const searchAbortRef = useRef(null);

  // Apply theme to <html> tag and persist
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('weather_theme', theme);
  }, [theme]);

  // Persist temperature unit
  useEffect(() => {
    localStorage.setItem('weather_temp_unit', tempUnit);
  }, [tempUnit]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleUnit = (unit) => {
    setTempUnit(unit);
  };

  /**
   * Fetch weather for a given city
   */
  const loadWeatherForCity = useCallback(async (city) => {
    if (!city || city.latitude === undefined || city.longitude === undefined) return;

    if (weatherAbortRef.current) {
      weatherAbortRef.current.abort();
    }
    const abortController = new AbortController();
    weatherAbortRef.current = abortController;

    setIsLoadingWeather(true);
    setWeatherError(null);

    try {
      const data = await fetchWeatherData(
        city.latitude,
        city.longitude,
        city.timezone || 'auto',
        abortController.signal
      );
      setWeatherData(data);
      setSelectedCity(city);
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Failed to load weather:', err);
        setWeatherError(err.message || 'Unable to retrieve live forecast.');
        // Note: Previous valid weatherData is intentionally preserved in state
      }
    } finally {
      setIsLoadingWeather(false);
    }
  }, []);

  // Initial fetch on mount
  useEffect(() => {
    loadWeatherForCity(DEFAULT_CITY);

    return () => {
      if (weatherAbortRef.current) weatherAbortRef.current.abort();
      if (searchAbortRef.current) searchAbortRef.current.abort();
    };
  }, [loadWeatherForCity]);

  /**
   * Search city via Geocoding API
   */
  const handleSearch = async (query) => {
    if (!query) return;

    if (searchAbortRef.current) {
      searchAbortRef.current.abort();
    }
    const abortController = new AbortController();
    searchAbortRef.current = abortController;

    setIsSearching(true);
    setSearchError(null);
    setSearchResults([]);

    try {
      const results = await searchCities(query, abortController.signal);
      setSearchResults(results);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setSearchError(err.message || 'City not found.');
      }
    } finally {
      setIsSearching(false);
    }
  };

  /**
   * Handle user choosing a city from search dropdown or popular chips
   */
  const handleSelectCity = (city) => {
    setSearchResults([]);
    setSearchError(null);
    loadWeatherForCity(city);
  };

  /**
   * Clear search dropdown results
   */
  const handleClearResults = () => {
    setSearchResults([]);
    setSearchError(null);
  };

  /**
   * Geolocation: Locate user with browser GPS API
   */
  const handleLocateUser = () => {
    if (!navigator.geolocation) {
      setSearchError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setSearchError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const userCity = {
          name: 'Your Current Location',
          country: '',
          admin1: `Lat: ${latitude.toFixed(2)}, Lon: ${longitude.toFixed(2)}`,
          latitude,
          longitude,
          timezone: 'auto',
        };

        setIsLocating(false);
        handleSelectCity(userCity);
      },
      (error) => {
        setIsLocating(false);
        let msg = 'Unable to retrieve your location.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Location permission was denied. Please search for your city manually.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = 'Location information is currently unavailable.';
        } else if (error.code === error.TIMEOUT) {
          msg = 'Location request timed out.';
        }
        setSearchError(msg);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="app-layout">
      {/* Background ambient decorative glows */}
      <div className="ambient-background" aria-hidden="true">
        <div className="ambient-glow glow-1" />
        <div className="ambient-glow glow-2" />
      </div>

      <div className="app-container">
        {/* Header with Title, Live Clock, Unit Switch & Theme Toggle */}
        <Header
          theme={theme}
          onToggleTheme={toggleTheme}
          tempUnit={tempUnit}
          onToggleUnit={toggleUnit}
        />

        {/* Prominent Search Bar with suggestions, GPS button, popular chips */}
        <SearchBar
          onSearch={handleSearch}
          onSelectCity={handleSelectCity}
          onLocateUser={handleLocateUser}
          isSearching={isSearching}
          isLocating={isLocating}
          searchResults={searchResults}
          searchError={searchError}
          onClearResults={handleClearResults}
        />

        {/* Main Content Area */}
        <main className="dashboard-main" id="main-content">
          {/* Error Banner with Retry button if API failed */}
          {weatherError && (
            <ErrorMessage
              message={weatherError}
              onRetry={() => loadWeatherForCity(selectedCity)}
            />
          )}

          {/* Initial Loading Skeleton */}
          {isLoadingWeather && !weatherData && <LoadingState />}

          {/* Live Weather Dashboard Content */}
          {weatherData && (
            <div className={`dashboard-content ${isLoadingWeather ? 'updating' : ''}`}>
              {/* Top Hero Section: Current Weather Card */}
              <CurrentWeather
                city={selectedCity}
                weather={weatherData}
                tempUnit={tempUnit}
              />

              {/* Weather Metrics: 6 Cards in Responsive Grid */}
              <WeatherMetrics
                weather={weatherData}
                tempUnit={tempUnit}
              />

              {/* Forecasts Section */}
              <div className="forecasts-section">
                {/* 24-Hour Forecast */}
                <HourlyForecast
                  hourly={weatherData.hourly}
                  timezone={weatherData.timezone}
                  tempUnit={tempUnit}
                />

                {/* 7-Day Forecast */}
                <WeeklyForecast
                  daily={weatherData.daily}
                  timezone={weatherData.timezone}
                  tempUnit={tempUnit}
                />
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="app-footer">
          <p>
            Data provided by{' '}
            <a
              href="https://open-meteo.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              Open-Meteo API
            </a>{' '}
            • Free & Open Source Weather Service
          </p>
        </footer>
      </div>
    </div>
  );
}
