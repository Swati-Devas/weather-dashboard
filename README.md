# 🌤️ SkyPulse — Modern Weather Dashboard

A complete, modern, responsive Weather Dashboard web application built with **React**, **Vite**, **CSS3**, and the **Open-Meteo Live API**. SkyPulse provides real-time atmospheric data, 24-hour hourly projections, and a 7-day extended forecast with a glassmorphism design system supporting light and dark themes.

---

## ✨ Features

- **Live Weather Data**: Real-time atmospheric conditions fetched directly from the Open-Meteo API (no API key required).
- **Global City Search**: Search for any city or municipality worldwide with autocomplete suggestions, state/country indicators, and instant geocoding.
- **Geolocation Support**: "Locate Me" button to retrieve weather for your exact device GPS coordinates with a single click.
- **Popular City Quick Select**: Rapid navigation chips for major international hubs (Bengaluru, London, Tokyo, New York, Paris, Sydney).
- **Hero Current Weather**:
  - Selected city, state/region, and country.
  - Large focal temperature in Celsius or Fahrenheit.
  - Condition badge with status indicator matching WMO weather codes.
  - High and low temperatures for today.
  - Feels-like (apparent) temperature.
- **Detailed Weather Metrics**:
  - **Humidity (%)**: Air moisture level with comfort assessment.
  - **Wind Speed (km/h)**: Real-time velocity with a rotating compass needle indicator.
  - **Feels Like (°C / °F)**: Apparent temperature factoring in humidity and wind chill.
  - **Precipitation (mm)**: Rainfall level in millimeters.
  - **UV Index**: Daily solar ultraviolet radiation index.
  - **Atmospheric Pressure (hPa)**: Barometric pressure level.
- **24-Hour Hourly Forecast**:
  - Horizontal smooth-scrolling timeline with next 24 hours.
  - Highlighted current hour ("Now").
  - Weather condition icons and hourly precipitation probabilities.
- **7-Day Extended Forecast**:
  - Day-by-day temperature breakdown.
  - Visual relative temperature bar showing where daily min and max fall across the week.
  - Rain probability badges.
- **Theme Engine**:
  - Light mode and Dark mode with glassmorphism cards and ambient lighting.
  - Respects system preferences (`prefers-color-scheme`) on first visit.
  - Persisted across sessions via `localStorage`.
  - Accessible toggle button with ARIA attributes and keyboard navigation.
- **Unit Switching**:
  - Toggle between Celsius (°C) and Fahrenheit (°F) with instantaneous recalculation.
- **Resilient State Handling**:
  - Shimmering skeleton loaders for smooth first-load and zero layout shift.
  - Inline error messages with retry actions.
  - Previous weather state preservation if a new search fails.
  - Duplicate search prevention and automatic request cancellation via `AbortController`.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [React 19](https://react.dev/) |
| **Build Tool & Bundler** | [Vite 8](https://vitejs.dev/) |
| **Language** | Modern JavaScript (ES6+ Modules, Async/Await) |
| **Styling** | Vanilla CSS3 (Custom Properties, Glassmorphism, Responsive Grid & Flexbox) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Weather & Geocoding API** | [Open-Meteo](https://open-meteo.com/) (Free, Open-Source, No API Key Needed) |
| **Version Control** | Git & GitHub |
| **Hosting & Deployment** | [Vercel](https://vercel.com/) |

---

## 📸 Screenshots

*(To add screenshots to your repository: take a screenshot of your dashboard in light mode and dark mode, save them to an `assets/` or `screenshots/` directory, and link them below.)*

| Light Theme | Dark Theme |
| :---: | :---: |
| ![SkyPulse Light Mode](docs/screenshots/light-mode.png) | ![SkyPulse Dark Mode](docs/screenshots/dark-mode.png) |

> **Tip for Capturing Screenshots**:
> 1. Run `npm run dev` locally.
> 2. Open `http://localhost:5173` in your browser.
> 3. Press `F12` (Developer Tools) -> Press `Ctrl+Shift+P` -> Type "Capture full size screenshot".
> 4. Save to `docs/screenshots/` and commit to Git.

---

## 📁 Project Structure

```text
Weather_Dashboard/
├── public/
│   ├── favicon.svg          # SkyPulse weather tab icon
│   └── icons.svg
├── src/
│   ├── components/
│   │   ├── CurrentWeather.jsx   # Hero card with temperature & condition
│   │   ├── ErrorMessage.jsx     # Error banner with retry action
│   │   ├── Header.jsx           # App title, live clock, unit switch, theme toggle
│   │   ├── HourlyForecast.jsx   # 24-hour horizontal forecast strip
│   │   ├── LoadingState.jsx     # Shimmer skeleton loader
│   │   ├── SearchBar.jsx        # Search input, dropdown results, GPS button, popular chips
│   │   ├── ThemeToggle.jsx      # Light/dark mode toggle button
│   │   ├── WeatherIcon.jsx      # WMO-to-Lucide icon renderer
│   │   ├── WeatherMetrics.jsx   # 6 cards for humidity, wind, feels-like, rain, UV, pressure
│   │   └── WeeklyForecast.jsx   # 7-day forecast with visual temperature range bar
│   ├── services/
│   │   └── weatherApi.js        # Open-Meteo Geocoding & Forecast API client
│   ├── utils/
│   │   ├── formatters.js        # Unit converters, dates, times, compass directions
│   │   └── weatherCodes.js      # WMO WW code mappings & categories
│   ├── App.jsx                  # Main application state & layout coordinator
│   ├── index.css                # CSS variables, glassmorphism design system & media queries
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

Verify your local environment:
```bash
node -v
npm -v
```

### Installation

1. Clone or navigate to the project directory:
   ```bash
   cd Weather_Dashboard
   ```

2. Install dependencies:
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

SkyPulse integrates with Open-Meteo's open APIs. No registration or API keys are required.

### 1. Geocoding API
Converts human-entered city names to geographic coordinates (`latitude`, `longitude`, `country`, `timezone`):
```text
GET https://geocoding-api.open-meteo.com/v1/search?name={CITY}&count=5&language=en&format=json
```

### 2. Weather Forecast API
Fetches current, hourly (24-hour), and daily (7-day) metrics:
```text
GET https://api.open-meteo.com/v1/forecast?latitude={LAT}&longitude={LON}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure,uv_index&hourly=temperature_2m,precipitation_probability,weather_code,relative_humidity_2m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,uv_index_max&timezone=auto&forecast_days=7
```

---

## 🐙 Step-by-Step GitHub Setup & Push Commands

To initialize a new Git repository and push your project to GitHub:

### 1. Initialize Git and Stage Files
```bash
git init
git add .
git commit -m "feat: complete modern responsive weather dashboard with live API"
```

### 2. Create a New Repository on GitHub
1. Go to [GitHub.com/new](https://github.com/new).
2. Set **Repository name** to `weather-dashboard` (or your preferred name).
3. Set the repository to **Public**.
4. Leave "Add a README file", "Add .gitignore", and "Choose a license" **unchecked** (we already have them).
5. Click **Create repository**.

### 3. Link Remote and Push
Replace `<YOUR_GITHUB_USERNAME>` with your actual GitHub username:
```bash
git branch -M main
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/weather-dashboard.git
git push -u origin main
```

---

## ⚡ Step-by-Step Vercel Deployment Instructions

Deploying your Vite React Weather Dashboard to Vercel takes less than 2 minutes:

### Method A: Deploy via Vercel Web Dashboard (Recommended)

1. Log in to [Vercel](https://vercel.com/) (you can sign in with your GitHub account).
2. Click **Add New...** -> **Project**.
3. Under **Import Git Repository**, find your `weather-dashboard` repository and click **Import**.
4. Configure Project Settings:
   - **Framework Preset**: `Vite` (automatically detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Click **Deploy**.
6. Vercel will build the application in under 30 seconds and provide your live production URL (e.g., `https://weather-dashboard-xyz.vercel.app`).

### Method B: Deploy via Vercel CLI

1. Install Vercel CLI globally:
   ```bash
   npm install -g vercel
   ```
2. Run deployment:
   ```bash
   vercel
   ```
3. Follow the on-screen prompts, accept defaults, and deploy to production:
   ```bash
   vercel --prod
   ```

*Note: Because Open-Meteo API is open and supports CORS without requiring secret API keys, no additional environment variables are required on Vercel.*

---

## 📄 License

This project is licensed under the MIT License - open and free for personal and educational use.
