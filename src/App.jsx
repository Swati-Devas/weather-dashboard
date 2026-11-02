import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import WeatherMetrics from './components/WeatherMetrics';
import TemperatureChart from './components/TemperatureChart';
import HourlyForecast from './components/HourlyForecast';
import WeeklyForecast from './components/WeeklyForecast';
import LoadingState from './components/LoadingState';
import ErrorMessage from './components/ErrorMessage';
import InteractiveMap from './components/InteractiveMap';
import WeatherBackground from './components/WeatherBackground';
import LockedForecastCard from './components/LockedForecastCard';
import LoginModal from './components/LoginModal';
import { searchCities, fetchWeatherData, reverseGeocode } from './services/weatherApi';

const DEFAULT_CITY = {
  name: 'Bengaluru',
  country: 'India',
  admin1: 'Karnataka',
  latitude: 12.9716,
  longitude: 77.5946,
  timezone: 'Asia/Kolkata',
};

function WeatherDashboardApp() {
  const { user } = useAuth();

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

  // Geolocation & Map state
  const [isLocating, setIsLocating] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [isLoadingMapWeather, setIsLoadingMapWeather] = useState(false);

  // Abort controllers to prevent race conditions
  const weatherAbortRef = useRef(null);
  const searchAbortRef = useRef(null);
  const mapClickAbortRef = useRef(null);

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
   * Fetch weather for a given city / location object
   */
  const loadWeatherForCity = useCallback(async (city, forceRefresh = false) => {
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
        abortController.signal,
        forceRefresh
      );
      setWeatherData(data);
      setSelectedCity(city);
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Failed to load weather:', err);
        setWeatherError(err.message || 'Unable to retrieve live forecast.');
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
      if (mapClickAbortRef.current) mapClickAbortRef.current.abort();
    };
  }, [loadWeatherForCity]);

  /**
   * Option 1: Search city via Geocoding API
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
   * Option 2: Geolocation: Locate user with browser GPS API
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
        setUserLocation({ latitude, longitude });

        try {
          const resolvedLocation = await reverseGeocode(latitude, longitude);
          const userCity = {
            name: resolvedLocation.name || 'Your Location',
            country: resolvedLocation.country || '',
            admin1: resolvedLocation.admin1 || `GPS: ${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`,
            latitude,
            longitude,
            timezone: 'auto',
          };
          setIsLocating(false);
          handleSelectCity(userCity);
        } catch {
          const fallbackCity = {
            name: 'Your Current Location',
            country: '',
            admin1: `Lat: ${latitude.toFixed(2)}, Lon: ${longitude.toFixed(2)}`,
            latitude,
            longitude,
            timezone: 'auto',
          };
          setIsLocating(false);
          handleSelectCity(fallbackCity);
        }
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

  /**
   * Option 3: Handle click anywhere on the Interactive World Map
   */
  const handleMapClick = async (lat, lon) => {
    // Retained for direct map coordinates logging/handling if needed
  };

  /**
   * Synchronize location and weather selected from the map with the main dashboard
   */
  const handleSelectLocationFromMap = (location, data) => {
    if (location) setSelectedCity(location);
    if (data) {
      setWeatherData(data);
    } else if (location) {
      loadWeatherForCity(location);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-layout">
      {/* Dynamic Condition-Based Weather Background Animations */}
      <WeatherBackground weather={weatherData} />

      <div className="app-container">
        {/* Header with Title, Live Clock, Unit Switch, Theme Toggle & User Auth */}
        <Header
          theme={theme}
          onToggleTheme={toggleTheme}
          tempUnit={tempUnit}
          onToggleUnit={toggleUnit}
        />

        {/* Option 1 & 2: Search Bar + Locate Me button + Popular chips */}
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
          <AnimatePresence>
            {weatherError && (
              <ErrorMessage
                message={weatherError}
                onRetry={() => loadWeatherForCity(selectedCity, true)}
              />
            )}
          </AnimatePresence>

          {/* Initial Loading Skeleton */}
          {isLoadingWeather && !weatherData && <LoadingState />}

          {/* Live Weather Dashboard Content */}
          {weatherData && (
            <motion.div
              className={`dashboard-content ${isLoadingWeather ? 'updating' : ''}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.35 }}
            >
              {/* Public Feature: Current Weather Hero Card */}
              <CurrentWeather
                city={selectedCity}
                weather={weatherData}
                tempUnit={tempUnit}
              />

              {/* Public Feature: Real-time Weather Metrics (Humidity, Wind, UV, etc.) */}
              <WeatherMetrics
                weather={weatherData}
                tempUnit={tempUnit}
              />

              {/* Protected Features: Upcoming Forecasts & Charts */}
              {user ? (
                /* Authenticated User: Unlocked Full Forecasts */
                <motion.div
                  key="unlocked-forecasts"
                  className="unlocked-forecasts-wrap"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {/* Visual Temperature Trends & Forecast Chart */}
                  <TemperatureChart
                    hourly={weatherData.hourly}
                    daily={weatherData.daily}
                    timezone={weatherData.timezone}
                    tempUnit={tempUnit}
                  />

                  {/* Forecasts Section: 24-Hour Hourly + 7-Day Extended */}
                  <div className="forecasts-section">
                    <HourlyForecast
                      hourly={weatherData.hourly}
                      timezone={weatherData.timezone}
                      tempUnit={tempUnit}
                    />

                    <WeeklyForecast
                      daily={weatherData.daily}
                      timezone={weatherData.timezone}
                      tempUnit={tempUnit}
                    />
                  </div>
                </motion.div>
              ) : (
                /* Logged-Out Visitor: Locked Forecast Gate Card */
                <LockedForecastCard key="locked-forecast-gate" />
              )}
            </motion.div>
          )}

          {/* Public Feature: Interactive World Map Section */}
          <InteractiveMap
            selectedCity={selectedCity}
            weather={weatherData}
            userLocation={userLocation}
            onSelectLocationFromMap={handleSelectLocationFromMap}
            isLoadingLocationWeather={isLoadingWeather}
            tempUnit={tempUnit}
            theme={theme}
          />
        </main>

        {/* Global Google Login Modal */}
        <LoginModal />

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
            • Maps by{' '}
            <a
              href="https://www.openstreetmap.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              OpenStreetMap
            </a>{' '}
            • Free & Open Source
          </p>
        </footer>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <WeatherDashboardApp />
    </AuthProvider>
  );
}
