import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Layers,
  Navigation,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  CloudRain,
  MapPin,
  Droplets,
  Wind,
  Eye,
  Gauge,
  Sun,
  X,
  Check,
  AlertCircle,
  Loader2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import WeatherIcon from './WeatherIcon';
import { reverseGeocode, fetchWeatherData } from '../services/weatherApi';
import { getWeatherInfo } from '../utils/weatherCodes';
import {
  formatTemp,
  formatWindSpeed,
  formatWindDirection,
  formatPercent,
  formatVisibility,
} from '../utils/formatters';

// Map layer provider configurations - SkyPulse Dark Theme as primary default
export const MAP_LAYERS = {
  dark: {
    id: 'dark',
    name: 'SkyPulse Dark',
    tag: 'Default Navy',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    maxZoom: 19,
    isDark: true,
  },
  standard: {
    id: 'standard',
    name: 'OpenStreetMap',
    tag: 'Classic Standard',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    maxZoom: 19,
    isDark: false,
  },
  satellite: {
    id: 'satellite',
    name: 'Satellite View',
    tag: 'Esri Imagery',
    attribution:
      'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and GIS User Community',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    maxZoom: 18,
    isDark: false,
  },
};

/**
 * Return inline SVG icon string for category pins
 */
function getCategorySvg(category, isDay = 1) {
  if (category === 'clear') {
    return isDay
      ? '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>'
      : '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>';
  }
  if (category === 'rain') {
    return '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M16 14v6"/><path d="M8 14v6"/><path d="M12 16v6"/></svg>';
  }
  if (category === 'thunderstorm') {
    return '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 16.326A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.973"/><path d="m13 12-3 5h4l-3 5"/></svg>';
  }
  if (category === 'snow') {
    return '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M8 15h.01"/><path d="M8 19h.01"/><path d="M12 17h.01"/><path d="M12 21h.01"/><path d="M16 15h.01"/><path d="M16 19h.01"/></svg>';
  }
  // Clouds default
  return '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>';
}

/**
 * Custom Weather Marker Icon
 */
function createWeatherMarkerIcon({
  temp,
  tempUnit = 'C',
  category = 'clouds',
  isSelected = false,
  isUserGps = false,
  isDay = 1,
}) {
  if (isUserGps) {
    return L.divIcon({
      className: 'custom-gps-pin',
      html: `
        <div class="user-gps-marker">
          <div class="user-gps-pulse"></div>
          <div class="user-gps-dot">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="#ffffff">
              <circle cx="12" cy="12" r="8"/>
            </svg>
          </div>
          <div class="user-gps-pill">Your Location</div>
        </div>
      `,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
      popupAnchor: [0, -18],
    });
  }

  const tempText =
    temp !== null && temp !== undefined ? `${Math.round(temp)}°` : '';

  return L.divIcon({
    className: 'custom-weather-marker-pin',
    html: `
      <div class="weather-pin-container ${isSelected ? 'pin-is-selected' : 'pin-standard'}" data-category="${category}">
        ${
          isSelected
            ? `
            <div class="pin-glow-core"></div>
            <div class="pin-radar-ring ring-1"></div>
            <div class="pin-radar-ring ring-2"></div>
            `
            : ''
        }
        <div class="pin-capsule ${isSelected ? 'capsule-selected' : 'capsule-standard'}">
          <div class="pin-icon-circle">
            ${getCategorySvg(category, isDay)}
          </div>
          ${tempText ? `<span class="pin-temperature-val">${tempText}</span>` : ''}
        </div>
        <div class="pin-pointer ${isSelected ? 'pointer-selected' : ''}"></div>
      </div>
    `,
    iconSize: [68, 50],
    iconAnchor: [34, 46],
    popupAnchor: [0, -44],
  });
}

/**
 * Controller to smoothly pan/fly the map when coordinates change
 */
function MapFlyController({ targetPos, zoom }) {
  const map = useMap();

  useEffect(() => {
    if (targetPos && targetPos[0] !== undefined && targetPos[1] !== undefined) {
      const currentZoom = map.getZoom();
      const nextZoom = zoom || (currentZoom < 6 ? 7 : currentZoom);
      map.flyTo(targetPos, nextZoom, {
        duration: 1.2,
        easeLinearity: 0.25,
      });
    }
  }, [targetPos, zoom, map]);

  return null;
}

/**
 * Expose map instance to parent for custom controls (zoom, invalidateSize)
 */
function MapBridge({ onMapReady }) {
  const map = useMap();
  useEffect(() => {
    if (onMapReady) onMapReady(map);
  }, [map, onMapReady]);
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
  onSelectLocationFromMap,
  isLoadingLocationWeather = false,
  tempUnit = 'C',
  theme = 'dark',
}) {
  const mapRef = useRef(null);
  const containerRef = useRef(null);
  const activeMarkerRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Map layer state persisted in localStorage (defaults to SkyPulse Dark Theme)
  const [mapLayer, setMapLayer] = useState(() => {
    const saved = localStorage.getItem('skypulse_map_layer');
    if (saved && (saved === 'dark' || saved === 'standard' || saved === 'satellite')) {
      return saved;
    }
    return 'dark';
  });
  const [isLayerMenuOpen, setIsLayerMenuOpen] = useState(false);

  // Precipitation Radar Overlay (RainViewer) state
  const [showRadar, setShowRadar] = useState(false);
  const [radarPath, setRadarPath] = useState(null);
  const [isLoadingRadar, setIsLoadingRadar] = useState(false);

  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Floating notification toast for map events (e.g. GPS error or info)
  const [mapToast, setMapToast] = useState(null);

  // Inspected location (either clicked point or current selected city)
  const [inspectedLocation, setInspectedLocation] = useState(selectedCity);
  const [inspectedWeather, setInspectedWeather] = useState(weather);
  const [isInspecting, setIsInspecting] = useState(false);
  const [inspectError, setInspectError] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [hasAppliedToDashboard, setHasAppliedToDashboard] = useState(false);

  // Locate Me state on the map
  const [isLocatingOnMap, setIsLocatingOnMap] = useState(false);
  const [mapGpsPos, setMapGpsPos] = useState(
    userLocation && userLocation.latitude && userLocation.longitude
      ? [userLocation.latitude, userLocation.longitude]
      : null
  );

  // Center coordinates
  const activePos = useMemo(() => {
    if (
      inspectedLocation &&
      inspectedLocation.latitude !== undefined &&
      inspectedLocation.longitude !== undefined
    ) {
      return [inspectedLocation.latitude, inspectedLocation.longitude];
    }
    if (
      selectedCity &&
      selectedCity.latitude !== undefined &&
      selectedCity.longitude !== undefined
    ) {
      return [selectedCity.latitude, selectedCity.longitude];
    }
    return [12.9716, 77.5946];
  }, [inspectedLocation, selectedCity]);

  // Keep inspected location in sync if selectedCity changes from the search bar
  useEffect(() => {
    if (selectedCity && selectedCity.latitude && selectedCity.longitude) {
      setInspectedLocation(selectedCity);
      setInspectedWeather(weather);
      setInspectError(null);
      setHasAppliedToDashboard(false);
    }
  }, [selectedCity, weather]);

  // Save selected map layer to localStorage
  useEffect(() => {
    localStorage.setItem('skypulse_map_layer', mapLayer);
  }, [mapLayer]);

  // Fetch RainViewer radar timestamp when radar overlay is enabled
  useEffect(() => {
    let isCancelled = false;
    if (showRadar && !radarPath) {
      setIsLoadingRadar(true);
      fetch('https://api.rainviewer.com/public/weather-maps.json')
        .then((res) => res.json())
        .then((data) => {
          if (isCancelled) return;
          const past = data.radar?.past;
          if (past && past.length > 0) {
            setRadarPath(past[past.length - 1].path);
          } else {
            setMapToast({
              type: 'info',
              message: 'Live rain radar is currently unavailable in this area.',
            });
            setShowRadar(false);
          }
        })
        .catch(() => {
          if (isCancelled) return;
          setMapToast({
            type: 'error',
            message: 'Unable to connect to live radar service.',
          });
          setShowRadar(false);
        })
        .finally(() => {
          if (!isCancelled) setIsLoadingRadar(false);
        });
    }
    return () => {
      isCancelled = true;
    };
  }, [showRadar, radarPath]);

  // Handle Fullscreen toggle
  const toggleFullscreen = () => {
    const elem = containerRef.current;
    if (!elem) return;

    if (!document.fullscreenElement) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(() => {
          setIsFullscreen((prev) => !prev);
        });
      } else {
        setIsFullscreen((prev) => !prev);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  // Sync fullscreen change listener
  useEffect(() => {
    const handleFsChange = () => {
      const isFs = Boolean(document.fullscreenElement);
      setIsFullscreen(isFs);
      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.invalidateSize();
        }
      }, 200);
    };

    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Handle click anywhere on the map: reverse geocode and fetch weather
  const handleMapClickInternal = useCallback(
    async (lat, lon) => {
      if (lat === undefined || lon === undefined) return;

      // Cancel any ongoing inspect request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      setIsInspecting(true);
      setInspectError(null);
      setIsPanelOpen(true);
      setHasAppliedToDashboard(false);

      // Temporary optimistic location
      const tempLoc = {
        name: `Location (${lat.toFixed(2)}°, ${lon.toFixed(2)}°)`,
        country: '',
        admin1: '',
        latitude: lat,
        longitude: lon,
      };
      setInspectedLocation(tempLoc);

      try {
        const [location, weatherData] = await Promise.all([
          reverseGeocode(lat, lon, abortController.signal),
          fetchWeatherData(lat, lon, 'auto', abortController.signal),
        ]);

        setInspectedLocation(location);
        setInspectedWeather(weatherData);

        // Also notify parent if needed
        if (onMapClick) {
          onMapClick(lat, lon);
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Failed to inspect map location:', err);
          setInspectError(
            err.message || 'Unable to fetch weather for clicked coordinates.'
          );
        }
      } finally {
        setIsInspecting(false);
      }
    },
    [onMapClick]
  );

  // Apply selected location to main dashboard
  const handleApplyToDashboard = () => {
    if (!inspectedLocation) return;
    setHasAppliedToDashboard(true);

    if (onSelectLocationFromMap) {
      onSelectLocationFromMap(inspectedLocation, inspectedWeather);
    }

    setMapToast({
      type: 'success',
      message: `Updated dashboard to ${inspectedLocation.name}!`,
    });

    // Dismiss toast after 3s
    setTimeout(() => {
      setMapToast(null);
    }, 3200);
  };

  // Map Locate Me button handler
  const handleLocateMeOnMap = () => {
    if (!navigator.geolocation) {
      setMapToast({
        type: 'error',
        message: 'Geolocation is not supported by your browser.',
      });
      return;
    }

    setIsLocatingOnMap(true);
    setMapToast({
      type: 'info',
      message: 'Locating your GPS coordinates...',
    });

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setMapGpsPos([latitude, longitude]);
        setIsLocatingOnMap(false);
        setMapToast({
          type: 'success',
          message: 'Location detected! Fetching local weather...',
        });

        // Fly map to detected location
        if (mapRef.current) {
          mapRef.current.flyTo([latitude, longitude], 11, {
            duration: 1.4,
          });
        }

        // Fetch weather for user location
        await handleMapClickInternal(latitude, longitude);

        setTimeout(() => setMapToast(null), 3000);
      },
      (err) => {
        setIsLocatingOnMap(false);
        let msg = 'Unable to retrieve location.';
        if (err.code === err.PERMISSION_DENIED) {
          msg = 'Location access was denied in browser permissions.';
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          msg = 'Location signal unavailable.';
        } else if (err.code === err.TIMEOUT) {
          msg = 'Location request timed out.';
        }
        setMapToast({ type: 'error', message: msg });
        setTimeout(() => setMapToast(null), 4500);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Reset to original selected city
  const handleResetView = () => {
    if (selectedCity && selectedCity.latitude && selectedCity.longitude) {
      setInspectedLocation(selectedCity);
      setInspectedWeather(weather);
      setIsPanelOpen(false);
      if (mapRef.current) {
        mapRef.current.flyTo([selectedCity.latitude, selectedCity.longitude], 8, {
          duration: 1.2,
        });
      }
    }
  };

  // Zoom controls
  const handleZoomIn = () => {
    if (mapRef.current) mapRef.current.zoomIn();
  };
  const handleZoomOut = () => {
    if (mapRef.current) mapRef.current.zoomOut();
  };

  // Active layer metadata
  const currentLayer = MAP_LAYERS[mapLayer] || MAP_LAYERS.dark;

  // Selected weather info
  const currWeather = inspectedWeather?.current || weather?.current;
  const currWeatherInfo = currWeather
    ? getWeatherInfo(currWeather.weatherCode, currWeather.isDay)
    : null;

  return (
    <section
      ref={containerRef}
      className={`card interactive-map-section ${
        isFullscreen ? 'map-fullscreen-active' : ''
      }`}
      aria-label="Interactive World Weather Map"
    >
      {/* Map Section Header */}
      <div className="map-section-header">
        <div className="map-header-text">
          <div className="map-title-row">
            <h2 className="map-heading">Explore Weather Around the World 🌍</h2>
            {(isLoadingLocationWeather || isInspecting) && (
              <span className="map-loading-badge" role="status">
                <Loader2 size={13} className="spin-animation" />
                <span>Scanning atmospheric data...</span>
              </span>
            )}
            {showRadar && (
              <span className="map-radar-badge" role="status">
                <span className="radar-pulse-dot"></span>
                <span>Live Rain Radar Active</span>
              </span>
            )}
          </div>
          <p className="map-subheading">
            Click anywhere on Earth to view real-time conditions, or use the controls to explore layers and radar.
          </p>
        </div>

        {/* Legend */}
        <div className="map-legend" aria-hidden="true">
          <div className="legend-item">
            <span className="legend-dot legend-dot--selected"></span>
            <span className="legend-label">Selected Spot</span>
          </div>
          {mapGpsPos && (
            <div className="legend-item">
              <span className="legend-dot legend-dot--gps"></span>
              <span className="legend-label">Your GPS</span>
            </div>
          )}
          {showRadar && (
            <div className="legend-item">
              <span className="legend-dot legend-dot--radar"></span>
              <span className="legend-label">Rain Radar</span>
            </div>
          )}
        </div>
      </div>

      {/* Map Container Viewport */}
      <div className={`map-wrapper theme-${theme}`}>
        <MapContainer
          center={activePos}
          zoom={5}
          scrollWheelZoom={true}
          zoomControl={false}
          className="leaflet-map-element"
          attributionControl={true}
        >
          {/* Bridge to store Leaflet Map instance */}
          <MapBridge onMapReady={(map) => (mapRef.current = map)} />

          {/* Smooth Pan/Fly View Controller */}
          <MapFlyController targetPos={activePos} />

          {/* Map Click Event Listener */}
          <MapClickHandler onMapClick={handleMapClickInternal} />

          {/* Active Map Base Tile Layer */}
          <TileLayer
            key={currentLayer.id}
            attribution={currentLayer.attribution}
            url={currentLayer.url}
            className={currentLayer.isDark ? 'leaflet-tile-dark' : ''}
            maxZoom={currentLayer.maxZoom || 19}
          />

          {/* RainViewer Live Precipitation Radar Tile Layer Overlay */}
          {showRadar && radarPath && (
            <TileLayer
              key={`radar-${radarPath}`}
              url={`https://tilecache.rainviewer.com${radarPath}/256/{z}/{x}/{y}/2/1_1.png`}
              opacity={0.65}
              zIndex={400}
              attribution='&copy; <a href="https://www.rainviewer.com/" target="_blank" rel="noopener noreferrer">RainViewer</a>'
            />
          )}

          {/* User GPS Location Marker */}
          {mapGpsPos && (
            <Marker
              position={mapGpsPos}
              icon={createWeatherMarkerIcon({ isUserGps: true })}
            >
              <Popup className="custom-leaflet-popup">
                <div className="map-popup-card user-location-popup">
                  <div className="map-popup-header">
                    <Navigation size={14} className="user-gps-icon" />
                    <span className="popup-title">Your Current Location</span>
                  </div>
                  <p className="popup-coords">
                    {mapGpsPos[0].toFixed(2)}°, {mapGpsPos[1].toFixed(2)}°
                  </p>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Inspected / Selected Location Weather Marker */}
          {inspectedLocation && inspectedLocation.latitude && (
            <Marker
              position={[inspectedLocation.latitude, inspectedLocation.longitude]}
              ref={activeMarkerRef}
              icon={createWeatherMarkerIcon({
                temp: currWeather?.temperature,
                tempUnit,
                category: currWeatherInfo?.category || 'clouds',
                isSelected: true,
                isDay: currWeather?.isDay ?? 1,
              })}
            >
              <Popup className="custom-leaflet-popup">
                <div className="map-popup-card">
                  <div className="map-popup-header">
                    <MapPin size={15} className="popup-pin-icon" />
                    <div className="popup-location-text">
                      <span className="popup-city-name">
                        {inspectedLocation.name}
                      </span>
                      {inspectedLocation.country && (
                        <span className="popup-region-name">
                          {[inspectedLocation.admin1, inspectedLocation.country]
                            .filter(Boolean)
                            .join(', ')}
                        </span>
                      )}
                    </div>
                  </div>

                  {isInspecting ? (
                    <div className="map-popup-loading">
                      <Loader2 size={16} className="spin-animation" />
                      <span>Fetching weather data...</span>
                    </div>
                  ) : currWeather && currWeatherInfo ? (
                    <div className="map-popup-body">
                      <div className="popup-weather-hero">
                        <WeatherIcon
                          code={currWeather.weatherCode}
                          isDay={currWeather.isDay}
                          size={32}
                          className="popup-weather-icon"
                        />
                        <div className="popup-temp-group">
                          <span className="popup-temp">
                            {formatTemp(currWeather.temperature, tempUnit)}
                          </span>
                          <span className="popup-unit">°{tempUnit}</span>
                        </div>
                        <span
                          className="popup-condition-badge"
                          data-category={currWeatherInfo.category}
                        >
                          {currWeatherInfo.label}
                        </span>
                      </div>

                      <div className="popup-metrics-grid">
                        <div className="popup-metric-item">
                          <Droplets
                            size={12}
                            className="popup-metric-icon metric-icon--blue"
                          />
                          <span className="popup-metric-label">Humidity:</span>
                          <span className="popup-metric-val">
                            {formatPercent(currWeather.relativeHumidity)}
                          </span>
                        </div>

                        <div className="popup-metric-item">
                          <Wind
                            size={12}
                            className="popup-metric-icon metric-icon--teal"
                          />
                          <span className="popup-metric-label">Wind:</span>
                          <span className="popup-metric-val">
                            {formatWindSpeed(currWeather.windSpeed)}
                          </span>
                        </div>
                      </div>

                      {/* View Full Weather in Main Dashboard button */}
                      <button
                        type="button"
                        className="popup-apply-dashboard-btn"
                        onClick={handleApplyToDashboard}
                      >
                        <span>
                          {hasAppliedToDashboard
                            ? '✓ Active on Dashboard'
                            : 'View Full Weather'}
                        </span>
                        {!hasAppliedToDashboard && <ArrowRight size={13} />}
                      </button>
                    </div>
                  ) : (
                    <p className="popup-no-data">Weather data unavailable</p>
                  )}
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>

        {/* Floating Glass Map Controls Toolbar */}
        <div className="map-floating-controls" role="toolbar" aria-label="Map Navigation Tools">
          {/* Zoom In */}
          <button
            type="button"
            className="map-control-btn"
            onClick={handleZoomIn}
            title="Zoom In"
            aria-label="Zoom in on map"
          >
            <ZoomIn size={16} />
          </button>

          {/* Zoom Out */}
          <button
            type="button"
            className="map-control-btn"
            onClick={handleZoomOut}
            title="Zoom Out"
            aria-label="Zoom out on map"
          >
            <ZoomOut size={16} />
          </button>

          <div className="map-control-separator" />

          {/* Locate Me */}
          <button
            type="button"
            className={`map-control-btn ${isLocatingOnMap ? 'is-loading' : ''}`}
            onClick={handleLocateMeOnMap}
            title="Locate Me (GPS)"
            aria-label="Detect your current location"
            disabled={isLocatingOnMap}
          >
            {isLocatingOnMap ? (
              <Loader2 size={16} className="spin-animation" />
            ) : (
              <Navigation size={16} />
            )}
          </button>

          {/* Reset / Home View */}
          <button
            type="button"
            className="map-control-btn"
            onClick={handleResetView}
            title="Recenter to Selected City"
            aria-label="Recenter map to selected city"
          >
            <RotateCcw size={15} />
          </button>

          <div className="map-control-separator" />

          {/* Layer Switcher Button */}
          <div className="layer-switcher-wrap">
            <button
              type="button"
              className={`map-control-btn ${isLayerMenuOpen ? 'is-active' : ''}`}
              onClick={() => setIsLayerMenuOpen((prev) => !prev)}
              title="Map Layers"
              aria-label="Choose map tile layer"
              aria-expanded={isLayerMenuOpen}
            >
              <Layers size={16} />
            </button>

            {/* Layer Selection Dropdown Menu */}
            {isLayerMenuOpen && (
              <div className="map-layers-dropdown card" role="menu">
                <div className="layers-dropdown-header">
                  <span>Map Base Layers</span>
                  <button
                    type="button"
                    className="layers-close-btn"
                    onClick={() => setIsLayerMenuOpen(false)}
                    aria-label="Close layers menu"
                  >
                    <X size={14} />
                  </button>
                </div>

                <div className="layers-options-list">
                  {Object.values(MAP_LAYERS).map((layer) => (
                    <button
                      key={layer.id}
                      type="button"
                      className={`layer-option-btn ${
                        mapLayer === layer.id ? 'is-selected' : ''
                      }`}
                      onClick={() => {
                        setMapLayer(layer.id);
                        setIsLayerMenuOpen(false);
                      }}
                      role="menuitem"
                    >
                      <div className="layer-info">
                        <span className="layer-name">{layer.name}</span>
                        <span className="layer-tag">{layer.tag}</span>
                      </div>
                      {mapLayer === layer.id && (
                        <Check size={14} className="layer-check-icon" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Rain Radar Overlay Toggle */}
          <button
            type="button"
            className={`map-control-btn radar-toggle-btn ${
              showRadar ? 'is-radar-active' : ''
            }`}
            onClick={() => setShowRadar((prev) => !prev)}
            title={showRadar ? 'Disable Rain Radar' : 'Enable Rain Radar Overlay'}
            aria-label="Toggle precipitation rain radar overlay"
            disabled={isLoadingRadar}
          >
            {isLoadingRadar ? (
              <Loader2 size={16} className="spin-animation" />
            ) : (
              <CloudRain size={16} />
            )}
          </button>

          <div className="map-control-separator" />

          {/* Fullscreen Toggle */}
          <button
            type="button"
            className={`map-control-btn ${isFullscreen ? 'is-active' : ''}`}
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'View Fullscreen'}
            aria-label="Toggle map fullscreen"
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>

        {/* Floating Map Notification Toast */}
        {mapToast && (
          <div
            className={`map-floating-toast toast--${mapToast.type}`}
            role="alert"
          >
            {mapToast.type === 'error' ? (
              <AlertCircle size={15} />
            ) : mapToast.type === 'success' ? (
              <Check size={15} />
            ) : (
              <Sparkles size={15} />
            )}
            <span>{mapToast.message}</span>
            <button
              type="button"
              className="toast-close-btn"
              onClick={() => setMapToast(null)}
              aria-label="Dismiss message"
            >
              <X size={13} />
            </button>
          </div>
        )}

        {/* Selected Location Weather Panel (Side Panel on Desktop, Bottom Sheet on Mobile) */}
        {isPanelOpen && inspectedLocation && (
          <aside
            className="selected-weather-panel card"
            aria-label="Selected Location Weather Breakdown"
          >
            <div className="panel-header">
              <div className="panel-location-meta">
                <div className="panel-pill-badge">
                  <MapPin size={12} />
                  <span>Map Selection</span>
                </div>
                <h3 className="panel-title">{inspectedLocation.name}</h3>
                <p className="panel-subtitle">
                  {[
                    inspectedLocation.admin1,
                    inspectedLocation.country,
                    `${inspectedLocation.latitude?.toFixed(2)}°, ${inspectedLocation.longitude?.toFixed(2)}°`,
                  ]
                    .filter(Boolean)
                    .join(' • ')}
                </p>
              </div>

              <button
                type="button"
                className="panel-close-btn"
                onClick={() => setIsPanelOpen(false)}
                aria-label="Close weather panel"
              >
                <X size={16} />
              </button>
            </div>

            {isInspecting ? (
              <div className="panel-loading-state">
                <Loader2 size={24} className="spin-animation" />
                <p>Retrieving atmospheric telemetry...</p>
              </div>
            ) : inspectError ? (
              <div className="panel-error-state">
                <AlertCircle size={22} className="panel-error-icon" />
                <p className="panel-error-text">{inspectError}</p>
                <button
                  type="button"
                  className="panel-retry-btn"
                  onClick={() =>
                    handleMapClickInternal(
                      inspectedLocation.latitude,
                      inspectedLocation.longitude
                    )
                  }
                >
                  Retry Request
                </button>
              </div>
            ) : currWeather && currWeatherInfo ? (
              <div className="panel-content">
                {/* Weather Hero */}
                <div className="panel-weather-hero">
                  <div className="panel-hero-left">
                    <WeatherIcon
                      code={currWeather.weatherCode}
                      isDay={currWeather.isDay}
                      size={44}
                      className="panel-weather-icon"
                    />
                    <div>
                      <div className="panel-temp-row">
                        <span className="panel-temp-number">
                          {formatTemp(currWeather.temperature, tempUnit)}
                        </span>
                        <span className="panel-temp-unit">°{tempUnit}</span>
                      </div>
                      <span
                        className="panel-condition-badge"
                        data-category={currWeatherInfo.category}
                      >
                        {currWeatherInfo.label}
                      </span>
                    </div>
                  </div>

                  <div className="panel-hero-right">
                    <span className="panel-feels-like">
                      Feels like {formatTemp(currWeather.apparentTemperature, tempUnit)}°{tempUnit}
                    </span>
                  </div>
                </div>

                {/* Metrics 4-Grid */}
                <div className="panel-metrics-grid">
                  <div className="panel-metric-card">
                    <Droplets size={16} className="metric-icon--blue" />
                    <div className="metric-details">
                      <span className="metric-title">Humidity</span>
                      <span className="metric-value">
                        {formatPercent(currWeather.relativeHumidity)}
                      </span>
                    </div>
                  </div>

                  <div className="panel-metric-card">
                    <Wind size={16} className="metric-icon--teal" />
                    <div className="metric-details">
                      <span className="metric-title">Wind</span>
                      <span className="metric-value">
                        {formatWindSpeed(currWeather.windSpeed)}{' '}
                        <small>{formatWindDirection(currWeather.windDirection)}</small>
                      </span>
                    </div>
                  </div>

                  <div className="panel-metric-card">
                    <Eye size={16} className="metric-icon--cyan" />
                    <div className="metric-details">
                      <span className="metric-title">Visibility</span>
                      <span className="metric-value">
                        {formatVisibility(currWeather.visibility, tempUnit)}
                      </span>
                    </div>
                  </div>

                  <div className="panel-metric-card">
                    <Gauge size={16} className="metric-icon--purple" />
                    <div className="metric-details">
                      <span className="metric-title">Pressure</span>
                      <span className="metric-value">
                        {currWeather.surfacePressure
                          ? `${Math.round(currWeather.surfacePressure)} hPa`
                          : '--'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Primary CTA: View Full Weather */}
                <button
                  type="button"
                  className={`panel-apply-btn ${
                    hasAppliedToDashboard ? 'is-applied' : ''
                  }`}
                  onClick={handleApplyToDashboard}
                >
                  <span>
                    {hasAppliedToDashboard
                      ? '✓ Synced with SkyPulse Dashboard'
                      : 'View Full Weather on Dashboard'}
                  </span>
                  {!hasAppliedToDashboard && <ArrowRight size={16} />}
                </button>
              </div>
            ) : null}
          </aside>
        )}
      </div>
    </section>
  );
}
