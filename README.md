# 🌤️ SkyPulse — Modern Weather Dashboard

A complete, modern, responsive Weather Dashboard web application built with **React 19**, **Vite 8**, **CSS3**, **React Leaflet**, and the **Open-Meteo Live API**. SkyPulse provides three synchronized methods for discovering real-time atmospheric data: global search, one-click device geolocation, and a fully interactive world map with clickable weather exploration.

---

## 🧭 Three Ways to Discover Weather

SkyPulse supports three tightly synchronized weather discovery options:

1. **Option 1: City Search 🔍**
   - Search bar for any municipality, city, or territory worldwide.
   - Live autocomplete with country and regional indicators via Open-Meteo Geocoding.
   - Quick navigation chips for popular global hubs (Bengaluru, London, Tokyo, New York, Paris, Sydney).
   - Moving the search updates the dashboard and automatically pans the map view to the selected city.

2. **Option 2: Locate Me 📍**
   - One-click HTML5 Geolocation detection for exact device GPS coordinates.
   - Automatically reverse-geocodes coordinates into a friendly location name.
   - Renders a distinctive pulsing green radar beacon marker on the interactive world map.
   - Graceful permission denial, unavailable signal, and timeout notifications.

3. **Option 3: Interactive World Map 🌍 (NEW)**
   - Powered by **React Leaflet** and **OpenStreetMap**.
   - Pan, drag, and zoom across all continents and oceans.
   - **Click anywhere on Earth**:
     - Captures exact latitude & longitude coordinates.
     - Performs reverse geocoding to resolve nearest city, island, or region.
     - Fetches live weather for coordinates via Open-Meteo.
     - Smoothly flies the map to the clicked location.
     - Displays a custom animated pin marker with a rich popup showing:
       - City/Location Name & Country
       - Current Temperature in °C / °F
       - Weather Condition badge & dynamic icon
       - Relative Humidity (%)
       - Wind Speed (km/h)
     - Shows an active loading badge while data is being fetched.
     - Automatically synchronizes with the main dashboard, updating metrics, hourly timeline, and 7-day outlook.

---

## ✨ Full Feature Overview

- **Live Weather API**: Real-time atmospheric conditions fetched directly from Open-Meteo (open-source, no API key required).
- **Hero Current Weather**:
  - City name, region, and country.
  - Large focal temperature in Celsius or Fahrenheit.
  - Dynamic condition badge matching WMO weather interpretation codes.
  - Today's high and low temperatures.
  - Feels-like (apparent) temperature.
- **6 Detailed Weather Metrics**:
  - **Humidity (%)**: Moisture level with comfort status.
  - **Wind Speed (km/h)**: Real-time velocity with a rotating compass indicator.
  - **Feels Like (°C / °F)**: Apparent temperature factoring in humidity and wind chill.
  - **Precipitation (mm)**: Rainfall level in millimeters.
  - **UV Index**: Solar ultraviolet radiation index.
  - **Pressure (hPa)**: Barometric pressure level.
- **24-Hour Hourly Forecast**:
  - Horizontally scrollable timeline covering the next 24 hours.
  - Highlighted current hour ("Now") with rain probabilities and matching icons.
- **7-Day Extended Forecast**:
  - Daily outlook with relative temperature gauge bars showing where daily high/low lands within the week's range.
- **Glassmorphism Design System**:
  - Ambient glowing gradients, frosted glass cards (`backdrop-filter: blur(16px)`).
  - Light mode and Dark mode with seamless theme adaptation on map tiles.
  - Respects system preferences (`prefers-color-scheme`) and persists via `localStorage`.
- **Unit Switching**:
  - One-click toggle between Celsius (°C) and Fahrenheit (°F) with immediate recalculation.
- **Resilient State Handling**:
  - Shimmering skeleton loader on initial load with zero layout shift.
  - Contextual error banners with retry buttons.
  - Race condition prevention with `AbortController`.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [React 19](https://react.dev/) |
| **Build Tool & Bundler** | [Vite 8](https://vitejs.dev/) |
| **Mapping Engine** | [Leaflet](https://leafletjs.com/) & [React Leaflet](https://react-leaflet.js.org/) |
| **Map Tiles** | [OpenStreetMap](https://www.openstreetmap.org/) |
| **Language** | Modern JavaScript (ES6+ Modules, Async/Await) |
| **Styling** | Vanilla CSS3 (Custom Properties, Glassmorphism, Responsive Grid & Flexbox) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Weather & Geocoding API** | [Open-Meteo](https://open-meteo.com/) (No API Key Required) |
| **Reverse Geocoding** | BigDataCloud Client API + OpenStreetMap Nominatim Fallback |
| **Version Control** | Git & GitHub |
| **Deployment** | [Vercel](https://vercel.com/) |

---

## 📸 Screenshots

| Light Theme | Dark Theme |
| :---: | :---: |
| ![SkyPulse Light Mode](docs/screenshots/light-mode.png) | ![SkyPulse Dark Mode](docs/screenshots/dark-mode.png) |

> **Capturing Screenshots**:
> 1. Run `npm run dev` locally.
> 2. Open `http://localhost:5173` in your browser.
> 3. Press `F12` -> Press `Ctrl+Shift+P` -> Type "Capture full size screenshot".
> 4. Save to `docs/screenshots/` and commit to Git.

---

## 📁 Project Structure

```text
Weather_Dashboard/
├── public/
│   ├── favicon.svg              # SkyPulse weather icon
│   └── icons.svg
├── src/
│   ├── components/
│   │   ├── CurrentWeather.jsx   # Hero card with temperature & condition
│   │   ├── ErrorMessage.jsx     # Error banner with retry action
│   │   ├── Header.jsx           # App title, live clock, unit switch, theme toggle
│   │   ├── HourlyForecast.jsx   # 24-hour horizontal forecast strip
│   │   ├── InteractiveMap.jsx   # Option 3: Interactive Leaflet map with custom markers & popups
│   │   ├── LoadingState.jsx     # Shimmer skeleton loader
│   │   ├── SearchBar.jsx        # Option 1 & 2: Search input, dropdown results, GPS button, popular chips
│   │   ├── ThemeToggle.jsx      # Light/dark mode toggle button
│   │   ├── WeatherIcon.jsx      # WMO-to-Lucide icon renderer
│   │   ├── WeatherMetrics.jsx   # 6 cards for humidity, wind, feels-like, rain, UV, pressure
│   │   └── WeeklyForecast.jsx   # 7-day forecast with visual temperature range bar
│   ├── services/
│   │   └── weatherApi.js        # Open-Meteo Geocoding, reverse geocoding & forecast client
│   ├── utils/
│   │   ├── formatters.js        # Unit converters, dates, times, compass directions
│   │   └── weatherCodes.js      # WMO WW code mappings & categories
│   ├── App.jsx                  # Main application state & synchronization coordinator
│   ├── index.css                # Glassmorphism design system, Leaflet map styling & media queries
│   └── main.jsx                 # React root mount
├── .gitignore                   # Excludes node_modules, dist, logs
├── index.html                   # HTML entry point with meta tags
├── package.json                 # Dependencies and scripts
├── vite.config.js               # Vite configuration
└── README.md                    # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or later (v20+ LTS recommended)
- **npm**: v9.0.0 or later

### Installation

1. Clone or navigate to the project directory:
   ```bash
   cd Weather_Dashboard
   ```

2. Install dependencies (including Leaflet and React Leaflet):
   ```bash
   npm install
   ```

### Running the Development Server

Start the local development server:
```bash
npm run dev
```

Open your browser and navigate to:
```text
http://localhost:5173
```

### Building for Production

Compile optimized production assets:
```bash
npm run build
```

The compiled files will be output to the `dist/` directory.

To preview the production build locally:
```bash
npm run preview
```

---

## 🌐 API Reference

SkyPulse integrates with open, free services without API key requirements:

### 1. Geocoding API (City Search)
```text
GET https://geocoding-api.open-meteo.com/v1/search?name={CITY}&count=5&language=en&format=json
```

### 2. Reverse Geocoding (Map Clicks & Geolocation)
- **Primary**: BigDataCloud Client Reverse Geocode API
  ```text
  GET https://api.bigdatacloud.net/data/reverse-geocode-client?latitude={LAT}&longitude={LON}&localityLanguage=en
  ```
- **Fallback**: OpenStreetMap Nominatim Reverse Geocode
  ```text
  GET https://nominatim.openstreetmap.org/reverse?lat={LAT}&lon={LON}&format=json
  ```

### 3. Weather Forecast API
```text
GET https://api.open-meteo.com/v1/forecast?latitude={LAT}&longitude={LON}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure,uv_index&hourly=temperature_2m,precipitation_probability,weather_code,relative_humidity_2m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,uv_index_max&timezone=auto&forecast_days=7
```

---

## 🐙 Git & GitHub Push

Commit and push your enhancements:
```bash
git add .
git commit -m "feat: add interactive world map with 3 synchronized weather discovery options"
git push origin main
```

---

## ⚡ Vercel Deployment

Since the repository is already connected to GitHub:
1. Pushing commits to `main` automatically triggers a zero-config production deployment on Vercel.
2. Build Settings:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
3. No secret environment variables are required.

---

## 📄 License

This project is licensed under the MIT License - open and free for personal and educational use.
