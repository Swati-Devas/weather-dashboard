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

3. **Option 3: Interactive World Map 🌍 **
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

- **Google Login Authentication & Forecast Access Control**:
  - **Public Mode (Logged-Out)**: Instant access to live current weather, city search, weather metrics (humidity, wind, pressure, UV index, sun schedule), and the interactive Leaflet map.
  - **Forecast Gate**: Upcoming forecast sections (Hourly 24-hr strip, 7-Day outlook, Analytics charts) are restricted behind an attractive glassmorphism locked card with a blurred mockup preview.
  - **Google Sign-In Popup**: Powered by official Firebase Auth SDK (`signInWithPopup`).
  - **Instant State Sync**: Unlocks all forecasts immediately upon login without page refresh or resetting search location.
  - **User Profile Menu**: Header avatar, user display name, email, and sign-out dropdown menu.
- **Dynamic Weather Background Animations**:
  - **Sunny**: Animated rotating sun rays and radiant golden sunlight.
  - **Night Sky**: Glowing crescent moon and twinkling starfield.
  - **Cloudy**: Multi-layered drifting cloud vapor banks.
  - **Rainy**: Angled falling raindrops and misty horizon.
  - **Thunderstorm**: Atmospheric dark clouds with periodic lightning flashes.
  - **Snowy**: Gently swaying and floating snowflakes of varying sizes.
- **Visual Analytics & Trend Charts**:
  - Recharts-powered area graphs with smooth transitions and glassmorphic tooltips.
  - Switchable tabs for 24-Hour Temperature trend, 7-Day High/Low range, and Rain Probability (%).
- **Live Weather API**: Real-time atmospheric conditions fetched directly from Open-Meteo (open-source, no API key required).
- **Hero Current Weather**:
  - City name, region, country, and localized date & time.
  - Large modern focal temperature display with tabular typography.
  - Dynamic condition badge matching official WMO weather interpretation codes.
  - Weather illustration with glowing ambient halo.
  - Feels-like temperature, high and low today.
- **Detailed Weather Metrics**:
  - **Humidity**: Circular SVG animated progress ring with moisture comfort level.
  - **Wind**: Velocity with an interactive rotating compass needle showing degree and cardinal direction.
  - **UV Index**: Exposure level with color-coded severity indicator.
  - **Visibility**: Real-time distance measurement (km / mi) with clarity assessment.
  - **Pressure**: Atmospheric pressure gauge bar (hPa).
  - **Sun Schedule**: Sunrise and sunset times with a parabolic solar timeline tracking daylight progress.
- **24-Hour Hourly Forecast**:
  - Horizontally scrollable timeline covering the next 24 hours.
  - Highlighted current hour ("Now") with rain probabilities and matching icons.
- **7-Day Extended Forecast**:
  - Daily outlook with highlighted "Today" tag and relative temperature gauge bars.
- **Premium Dark Glassmorphism Design System**:
  - Palette: `#0B1220` (main), `#111C2F` (secondary), `#162338` (glass cards).
  - Accents: `#38BDF8` (Sky blue) & `#818CF8` (Indigo).
  - Font: Plus Jakarta Sans / Inter typography.
  - Respects system preferences (`prefers-color-scheme`) and persists via `localStorage`.
- **Unit Switching**:
  - One-click toggle between Celsius (°C) and Fahrenheit (°F) with immediate recalculation.
- **Resilient State Handling**:
  - Floating weather badge loader with shimmering skeleton cards during initial fetch.
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
| **Authentication** | [Firebase Auth](https://firebase.google.com/) (Google Sign-In) |
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
│   │   ├── Header.jsx           # App title, live clock, user profile menu, unit switch, theme toggle
│   │   ├── HourlyForecast.jsx   # 24-hour horizontal forecast strip (Auth gated)
│   │   ├── InteractiveMap.jsx   # Option 3: Interactive Leaflet map with custom markers & popups
│   │   ├── LoadingState.jsx     # Shimmer skeleton loader
│   │   ├── LockedForecastCard.jsx # Glassmorphic gate card prompting Google sign-in
│   │   ├── LoginModal.jsx       # Google authentication dialog modal
│   │   ├── SearchBar.jsx        # Option 1 & 2: Search input, dropdown results, GPS button, popular chips
│   │   ├── TemperatureChart.jsx # Recharts 24-hr temp, 7-day range & rain analytics (Auth gated)
│   │   ├── ThemeToggle.jsx      # Light/dark mode toggle button
│   │   ├── UserProfileMenu.jsx  # Avatar trigger, user display name & sign-out dropdown
│   │   ├── WeatherBackground.jsx# Dynamic weather condition animations (sun, rain, snow, clouds, etc.)
│   │   ├── WeatherIcon.jsx      # WMO-to-Lucide icon renderer
│   │   ├── WeatherMetrics.jsx   # 6 cards for humidity, wind, feels-like, rain, UV, pressure
│   │   └── WeeklyForecast.jsx   # 7-day forecast with visual temperature range bar (Auth gated)
│   ├── context/
│   │   └── AuthContext.jsx      # Firebase auth provider & state management
│   ├── services/
│   │   ├── firebase.js          # Firebase app initialization & Google Auth provider
│   │   └── weatherApi.js        # Open-Meteo Geocoding, reverse geocoding & forecast client
│   ├── utils/
│   │   ├── formatters.js        # Unit converters, dates, times, compass directions
│   │   └── weatherCodes.js      # WMO WW code mappings & categories
│   ├── App.jsx                  # Main application state & synchronization coordinator
│   ├── index.css                # Glassmorphism design system, Leaflet map styling & media queries
│   └── main.jsx                 # React root mount
├── .env.example                 # Firebase environment variables template
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

---

## 🔐 Firebase Authentication Setup (Google Sign-In)

SkyPulse features public access to real-time current weather metrics and the interactive world map, while locking upcoming weather forecasts (hourly, 7-day, and analytics charts) behind a Google Sign-In gate.

### Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/).

2. Click **Add project**, enter a project name (e.g., `skypulse-weather`), and complete the wizard.

### Step 2: Enable Google Authentication

1. In your Firebase project sidebar, click **Build** > **Authentication**.

2. Click **Get Started** and select the **Sign-in method** tab.

3. Choose **Google**, enable the toggle, configure your project support email, and click **Save**.

### Step 3: Register Web App & Get Credentials

1. In the Project Overview, click the **Web icon** (`</>`) to register a web app.

2. Enter an app nickname (e.g., `skypulse-web`) and click **Register app**.

3. Copy your `firebaseConfig` credentials.

### Step 4: Add Authorized Domains

1. In Firebase Console, go to **Authentication** > **Settings** > **Authorized domains**.

2. `localhost` is added by default.

3. Add your Vercel deployment domain (e.g., `weather-dashboard-*.vercel.app`).

### Step 5: Configure Environment Variables

Create a `.env` file in the root of the project (refer to `.env.example`):

```env

VITE_FIREBASE_API_KEY=your_api_key_here

VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com

VITE_FIREBASE_PROJECT_ID=your_project_id

VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com

VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id

VITE_FIREBASE_APP_ID=your_app_id

```

> **Note**: If Firebase environment variables are not yet provided, the application operates in safe fallback mode: the locked forecast gate is active and clicking "Sign In" will inform you to configure the environment variables.

## ⚡ Vercel Deployment

Since the repository is already connected to GitHub:
1. Pushing commits to `main` automatically triggers a zero-config production deployment on Vercel.
2. Build Settings:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
3. **Environment Variables** (Firebase):
   - When importing the project in Vercel (or in **Project Settings > Environment Variables**), expand the **Environment Variables** section.
   - Add all 6 VITE_FIREBASE_* variables from your .env.
   - Click **Deploy**!

---

## 📄 License

This project is licensed under the MIT License - open and free for personal and educational use.
