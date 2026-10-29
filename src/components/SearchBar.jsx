import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Loader2, X, Navigation } from 'lucide-react';

const POPULAR_CITIES = [
  { name: 'Bengaluru', country: 'India', lat: 12.9716, lon: 77.5946, timezone: 'Asia/Kolkata' },
  { name: 'London', country: 'United Kingdom', lat: 51.5074, lon: -0.1278, timezone: 'Europe/London' },
  { name: 'Tokyo', country: 'Japan', lat: 35.6762, lon: 139.6503, timezone: 'Asia/Tokyo' },
  { name: 'New York', country: 'United States', lat: 40.7128, lon: -74.006, timezone: 'America/New_York' },
  { name: 'Paris', country: 'France', lat: 48.8566, lon: 2.3522, timezone: 'Europe/Paris' },
  { name: 'Sydney', country: 'Australia', lat: -33.8688, lon: 151.2093, timezone: 'Australia/Sydney' },
];

export default function SearchBar({
  onSearch,
  onSelectCity,
  onLocateUser,
  isSearching,
  isLocating,
  searchResults = [],
  searchError = null,
  onClearResults,
}) {
  const [inputValue, setInputValue] = useState('');
  const [validationError, setValidationError] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const searchContainerRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Show dropdown when results change or error occurs
  useEffect(() => {
    if (searchResults.length > 0 || searchError) {
      setShowDropdown(true);
    }
  }, [searchResults, searchError]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const query = inputValue.trim();

    if (!query) {
      setValidationError('Please enter a city or location name.');
      return;
    }

    setValidationError('');
    setShowDropdown(true);
    onSearch(query);
  };

  const handleSelect = (city) => {
    setInputValue(`${city.name}${city.country ? `, ${city.country}` : ''}`);
    setShowDropdown(false);
    setValidationError('');
    if (onClearResults) onClearResults();
    onSelectCity(city);
  };

  const handleClear = () => {
    setInputValue('');
    setValidationError('');
    setShowDropdown(false);
    if (onClearResults) onClearResults();
  };

  return (
    <section className="search-section" aria-label="City Search">
      <div className="search-container" ref={searchContainerRef}>
        <form className="search-form" onSubmit={handleSubmit} noValidate>
          <div className="search-input-wrapper">
            <Search className="search-leading-icon" size={20} aria-hidden="true" />
            
            <input
              type="text"
              className="search-input"
              placeholder="Search any city worldwide (e.g., Tokyo, London, Paris)..."
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                if (validationError) setValidationError('');
              }}
              aria-label="City search input"
              aria-invalid={!!validationError}
              aria-describedby={validationError ? 'search-validation-error' : undefined}
              disabled={isSearching}
              autoComplete="off"
            />

            {inputValue && !isSearching && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={handleClear}
                aria-label="Clear search input"
              >
                <X size={16} />
              </button>
            )}

            {isSearching && (
              <div className="search-spinner" aria-label="Searching cities">
                <Loader2 size={18} className="spin-animation" />
              </div>
            )}
          </div>

          <div className="search-actions">
            <button
              type="submit"
              className="search-submit-btn"
              disabled={isSearching}
              aria-label="Search city"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>

            <button
              type="button"
              className="geo-locate-btn"
              onClick={onLocateUser}
              disabled={isLocating || isSearching}
              title="Use current location"
              aria-label="Use current GPS location"
            >
              {isLocating ? (
                <Loader2 size={18} className="spin-animation" />
              ) : (
                <Navigation size={18} />
              )}
              <span className="geo-btn-text">Locate Me</span>
            </button>
          </div>
        </form>

        {validationError && (
          <p id="search-validation-error" className="search-validation-msg" role="alert">
            {validationError}
          </p>
        )}

        {/* Search Results Dropdown */}
        {showDropdown && (searchResults.length > 0 || searchError) && (
          <div className="search-dropdown" role="listbox">
            {searchError ? (
              <div className="dropdown-error-item" role="alert">
                <p>{searchError}</p>
              </div>
            ) : (
              searchResults.map((city) => (
                <button
                  key={city.id}
                  type="button"
                  className="dropdown-result-item"
                  role="option"
                  onClick={() => handleSelect(city)}
                >
                  <MapPin size={16} className="dropdown-item-icon" />
                  <div className="dropdown-item-info">
                    <span className="dropdown-city-name">{city.name}</span>
                    <span className="dropdown-city-sub">
                      {[city.admin1, city.country].filter(Boolean).join(', ')}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* Popular Cities Quick Chips */}
      <div className="popular-cities" aria-label="Popular cities">
        <span className="popular-label">Popular:</span>
        <div className="popular-chips">
          {POPULAR_CITIES.map((city) => (
            <button
              key={city.name}
              type="button"
              className="city-chip"
              onClick={() => handleSelect(city)}
              disabled={isSearching}
            >
              {city.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
