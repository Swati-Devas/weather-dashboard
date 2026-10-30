import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation, Droplets, Wind, Loader2 } from 'lucide-react';
import WeatherIcon from './WeatherIcon';
import { getWeatherInfo } from '../utils/weatherCodes';
import { formatTemp, formatWindSpeed, formatPercent } from '../utils/formatters';

// Custom SVG HTML DivIcon for Selected Location
const createSelectedPinIcon = () =>
  L.divIcon({
    className: 'custom-map-pin',
    html: `
      <div class="pin-marker-wrapper">
        <div class="pin-marker-pulse"></div>
        <div class="pin-marker-head">
          <svg width="28" height="38" viewBox="0 0 28 38" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 0C6.268 0 0 6.268 0 14C0 24.5 14 38 14 38C14 38 28 24.5 28 14C28 6.268 21.732 0 14 0Z" fill="url(#pinGradient)"/>
            <circle cx="14" cy="14" r="6" fill="#ffffff"/>
            <defs>
              <linearGradient id="pinGradient" x1="0" y1="0" x2="28" y2="38" gradientUnits="userSpaceOnUse">
                <stop stop-color="#3b82f6"/>
                <stop offset="1" stop-color="#1d4ed8"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    `,
    iconSize: [28, 38],
    iconAnchor: [14, 38],
    popupAnchor: [0, -38],
  });

// Custom SVG HTML DivIcon for User's Current GPS Location
const createUserLocationIcon = () =>
  L.divIcon({
    className: 'custom-user-pin',
    html: `
      <div class="user-gps-marker">
        <div class="user-gps-pulse"></div>
        <div class="user-gps-dot">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#ffffff">
            <circle cx="12" cy="12" r="8"/>
          </svg>
        </div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -14],
  });

/**
 * Controller to smoothly pan/fly the map when coordinates change
 */
function MapController({ center, zoom }) {
  const map = useMap();

  useEffect(() => {
    if (center && center[0] !== undefined && center[1] !== undefined) {
      const currentZoom = map.getZoom();
      const targetZoom = zoom || (currentZoom < 6 ? 8 : currentZoom);
      map.flyTo(center, targetZoom, {
        duration: 1.2,
        easeLinearity: 0.25,
      });
    }
  }, [center, zoom, map]);

  return null;
}

/**
 * Capture map clicks and pass coordinates to parent
 */
function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click: (e) => {
      if (onMapClick) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      }
    },
  });

  return null;
}

export default function InteractiveMap({
  selectedCity,
  weather,
  userLocation,
  onMapClick,
  isLoadingLocationWeather,
  tempUnit = 'C',
  theme = 'dark',
}) {
  const markerRef = useRef(null);

  const selectedPos =
    selectedCity && selectedCity.latitude !== undefined && selectedCity.longitude !== undefined
      ? [selectedCity.latitude, selectedCity.longitude]
      : [12.9716, 77.5946];

  const userPos =
    userLocation && userLocation.latitude !== undefined && userLocation.longitude !== undefined
      ? [userLocation.latitude, userLocation.longitude]
      : null;

  // Automatically open the popup for selected location when weather data is loaded
  useEffect(() => {
    if (markerRef.current && weather && weather.current) {
      markerRef.current.openPopup();
    }
  }, [weather, selectedCity]);

  const current = weather?.current;
  const weatherInfo = current ? getWeatherInfo(current.weatherCode, current.isDay) : null;
  const cityName = selectedCity?.name || 'Selected Location';
  const regionName = [selectedCity?.admin1, selectedCity?.country].filter(Boolean).join(', ');

  return (
    <section className="card interactive-map-section" aria-label="Interactive World Weather Map">
      <div className="map-section-header">
        <div className="map-header-text">
          <div className="map-title-row">
            <h2 className="map-heading">Explore Weather Around the World 🌍</h2>
            {isLoadingLocationWeather && (
              <span className="map-loading-badge" role="status">
                <Loader2 size={14} className="spin-animation" />
                <span>Fetching weather...</span>
              </span>
            )}
          </div>
          <p className="map-subheading">Click anywhere on the map to discover local weather.</p>
        </div>

        <div className="map-legend" aria-hidden="true">
          <div className="legend-item">
            <span className="legend-dot legend-dot--selected"></span>
            <span className="legend-label">Selected City</span>
          </div>
          {userPos && (
            <div className="legend-item">
              <span className="legend-dot legend-dot--gps"></span>
              <span className="legend-label">Your Location</span>
            </div>
          )}
        </div>
      </div>

      <div className={`map-wrapper theme-${theme}`}>
        <MapContainer
          center={selectedPos}
          zoom={5}
          scrollWheelZoom={true}
          className="leaflet-map-element"
          attributionControl={true}
        >
          {/* OpenStreetMap Tile Layer */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={18}
          />

          {/* Map Click Listener */}
          <MapClickHandler onMapClick={onMapClick} />

          {/* Smooth View Transition Controller */}
          <MapController center={selectedPos} />

          {/* User GPS Location Marker (if detected via Locate Me) */}
          {userPos && (
            <Marker position={userPos} icon={createUserLocationIcon()}>
              <Popup className="custom-leaflet-popup">
                <div className="map-popup-card user-location-popup">
                  <div className="map-popup-header">
                    <Navigation size={14} className="user-gps-icon" />
                    <span className="popup-title">Your Current Location</span>
                  </div>
                  <p className="popup-coords">
                    {userPos[0].toFixed(2)}°, {userPos[1].toFixed(2)}°
                  </p>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Selected Location Marker with Weather Popup */}
          <Marker position={selectedPos} icon={createSelectedPinIcon()} ref={markerRef}>
            <Popup className="custom-leaflet-popup">
              <div className="map-popup-card">
                <div className="map-popup-header">
                  <MapPin size={15} className="popup-pin-icon" />
                  <div className="popup-location-text">
                    <span className="popup-city-name">{cityName}</span>
                    {regionName && <span className="popup-region-name">{regionName}</span>}
                  </div>
                </div>

                {isLoadingLocationWeather ? (
                  <div className="map-popup-loading">
                    <Loader2 size={18} className="spin-animation" />
                    <span>Updating weather...</span>
                  </div>
                ) : current && weatherInfo ? (
                  <div className="map-popup-body">
                    <div className="popup-weather-hero">
                      <WeatherIcon
                        code={current.weatherCode}
                        isDay={current.isDay}
                        size={32}
                        className="popup-weather-icon"
                      />
                      <div className="popup-temp-group">
                        <span className="popup-temp">{formatTemp(current.temperature, tempUnit)}</span>
                        <span className="popup-unit">°{tempUnit}</span>
                      </div>
                      <span className="popup-condition-badge" data-category={weatherInfo.category}>
                        {weatherInfo.label}
                      </span>
                    </div>

                    <div className="popup-metrics-grid">
                      <div className="popup-metric-item">
                        <Droplets size={13} className="popup-metric-icon metric-icon--blue" />
                        <span className="popup-metric-label">Humidity:</span>
                        <span className="popup-metric-val">{formatPercent(current.relativeHumidity)}</span>
                      </div>

                      <div className="popup-metric-item">
                        <Wind size={13} className="popup-metric-icon metric-icon--teal" />
                        <span className="popup-metric-label">Wind:</span>
                        <span className="popup-metric-val">{formatWindSpeed(current.windSpeed)}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="popup-no-data">Weather data unavailable</p>
                )}
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </section>
  );
}

