import React, { useMemo } from 'react';
import { getWeatherInfo } from '../utils/weatherCodes';

export default function WeatherBackground({ weather }) {
  const current = weather?.current;
  const isDay = current ? current.isDay : 1;
  const weatherCode = current ? current.weatherCode : 0;

  // Determine current active animation effect
  const effect = useMemo(() => {
    if (!current) return 'clear-day';
    const info = getWeatherInfo(weatherCode, isDay);
    const category = info.category;

    if (!isDay && (category === 'clear' || category === 'clouds')) {
      return 'night';
    }
    if (category === 'clear') return 'sunny';
    if (category === 'rain') return 'rainy';
    if (category === 'thunderstorm') return 'thunderstorm';
    if (category === 'snow') return 'snowy';
    if (category === 'clouds' || category === 'fog') return 'cloudy';
    return isDay ? 'sunny' : 'night';
  }, [current, weatherCode, isDay]);

  // Pre-generate static star positions for night sky
  const stars = useMemo(() => {
    return Array.from({ length: 40 }, (_, i) => ({
      id: i,
      top: `${(i * 19) % 95}%`,
      left: `${(i * 29) % 98}%`,
      size: `${(i % 3) + 1.5}px`,
      duration: `${3 + (i % 4)}s`,
      delay: `${(i * 0.4) % 3}s`,
      opacity: 0.3 + ((i % 5) * 0.14),
    }));
  }, []);

  // Pre-generate raindrops
  const raindrops = useMemo(() => {
    return Array.from({ length: 32 }, (_, i) => ({
      id: i,
      left: `${(i * 3.2) % 100}%`,
      duration: `${0.7 + ((i % 5) * 0.15)}s`,
      delay: `${(i * 0.08) % 1.5}s`,
      length: `${16 + (i % 4) * 8}px`,
      opacity: 0.35 + ((i % 4) * 0.15),
    }));
  }, []);

  // Pre-generate snowflakes
  const snowflakes = useMemo(() => {
    return Array.from({ length: 28 }, (_, i) => ({
      id: i,
      left: `${(i * 3.6) % 100}%`,
      duration: `${4.5 + ((i % 5) * 1.2)}s`,
      delay: `${(i * 0.35) % 4}s`,
      size: `${(i % 4) + 3}px`,
      drift: `${(i % 2 === 0 ? 1 : -1) * (15 + (i % 20))}px`,
    }));
  }, []);

  return (
    <div className={`dynamic-weather-bg weather-effect--${effect}`} aria-hidden="true">
      {/* Ambient Backdrop Gradients */}
      <div className="weather-bg-gradient" />

      {/* Sunny Atmosphere: Rotating rays & warm radiant glow */}
      {effect === 'sunny' && (
        <div className="sun-effect-container">
          <div className="sun-core" />
          <div className="sun-glow-ring ring-1" />
          <div className="sun-glow-ring ring-2" />
          <div className="sun-rays-rotor">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <div
                key={deg}
                className="sun-ray-beam"
                style={{ transform: `rotate(${deg}deg)` }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Night Sky: Moon aura & twinkling starfield */}
      {effect === 'night' && (
        <div className="night-effect-container">
          <div className="moon-glow" />
          <div className="moon-crescent" />
          <div className="stars-field">
            {stars.map((s) => (
              <span
                key={s.id}
                className="star-dot"
                style={{
                  top: s.top,
                  left: s.left,
                  width: s.size,
                  height: s.size,
                  animationDuration: s.duration,
                  animationDelay: s.delay,
                  opacity: s.opacity,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Cloudy Sky: Drifting multi-layered cloud vapors */}
      {effect === 'cloudy' && (
        <div className="cloud-effect-container">
          <div className="cloud-layer layer-back" />
          <div className="cloud-layer layer-mid" />
          <div className="cloud-layer layer-front" />
        </div>
      )}

      {/* Rainy Atmosphere: Angled animated rain streaks */}
      {effect === 'rainy' && (
        <div className="rain-effect-container">
          <div className="rain-mist" />
          <div className="rain-streaks-field">
            {raindrops.map((r) => (
              <span
                key={r.id}
                className="rain-streak"
                style={{
                  left: r.left,
                  height: r.length,
                  animationDuration: r.duration,
                  animationDelay: r.delay,
                  opacity: r.opacity,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Thunderstorm: Dramatic dark storm clouds, rain & periodic lightning flashes */}
      {effect === 'thunderstorm' && (
        <div className="thunder-effect-container">
          <div className="lightning-flash" />
          <div className="rain-mist" />
          <div className="rain-streaks-field">
            {raindrops.map((r) => (
              <span
                key={r.id}
                className="rain-streak"
                style={{
                  left: r.left,
                  height: r.length,
                  animationDuration: r.duration,
                  animationDelay: r.delay,
                  opacity: r.opacity,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Snowy Atmosphere: Floating, gently swaying snowflakes */}
      {effect === 'snowy' && (
        <div className="snow-effect-container">
          {snowflakes.map((s) => (
            <span
              key={s.id}
              className="snowflake-particle"
              style={{
                left: s.left,
                width: s.size,
                height: s.size,
                animationDuration: s.duration,
                animationDelay: s.delay,
                '--snow-drift': s.drift,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
