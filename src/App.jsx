import "./App.css";
import { useState } from "react";

function Weather() {
  const [city, setCity] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apikey = "ea0cb7606e0947049a3193245250211";

  const fetchWeather = async (q) => {
    const query = q ?? city.trim();
    if (!query) return;

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const res = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${apikey}&q=${encodeURIComponent(
          query
        )}&days=3`
      );
      const json = await res.json();
      if (!res.ok || json?.error) throw new Error(json?.error?.message);
      setData(json);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const useMyLocation = () => {
    navigator.geolocation.getCurrentPosition(
      pos => fetchWeather(`${pos.coords.latitude},${pos.coords.longitude}`),
      () => setError("Couldn't get location")
    );
  };

  const fmt = d =>
    new Date(d).toLocaleDateString(undefined, {weekday:"short", month:"short", day:"numeric"});

  return (
    <div className="app">
      <div className="header">
        <div style={{fontSize:"42px"}}>🌦️</div>
        <h1>Weather App</h1>
      </div>

      <div className="search">
        <input className="input"
          placeholder="Search city..."
          value={city}
          onChange={e=>setCity(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&fetchWeather()}
        />
        <button className="button" onClick={()=>fetchWeather()}>Get Weather</button>
        <button className="button secondary" onClick={useMyLocation}>Use my location</button>
      </div>

      {error && <div className="alert">❌ {error}</div>}
      {loading && <div className="spinner"/>}

      {data && !loading && (
        <div className="grid">

          {/* LEFT: Main weather */}
          <div className="card">
            <div className="weather-header">{data.location.name}, {data.location.country}</div>
            <div className="weather-meta">{data.location.region} • {data.location.localtime}</div>

            <div className="icon-temp">
              <img src={data.current.condition.icon} width="68" />
              <div>
                <p className="temp">{data.current.temp_c}°C</p>
                <p className="condition">{data.current.condition.text}</p>
              </div>
            </div>

            <div className="badges">
              <div className="badge">💨 {data.current.wind_kph} km/h wind</div>
              <div className="badge">💧 {data.current.humidity}% humidity</div>
              <div className="badge">🌡 Feels like {data.current.feelslike_c}°C</div>
            </div>
          </div>

          {/* RIGHT: Today at a glance */}
          <div className="card">
            <div style={{fontWeight:"700", marginBottom:"12px"}}>Today at a glance</div>
            <div className="stats-grid">
              <div className="stat"><div className="label">UV</div><div className="value">{data.current.uv}</div></div>
              <div className="stat"><div className="label">Visibility</div><div className="value">{data.current.vis_km} km</div></div>
              <div className="stat"><div className="label">Pressure</div><div className="value">{data.current.pressure_mb} mb</div></div>
              <div className="stat"><div className="label">Cloud</div><div className="value">{data.current.cloud}%</div></div>
              <div className="stat"><div className="label">Wind gust</div><div className="value">{data.current.gust_kph} km/h</div></div>
              <div className="stat"><div className="label">Sunrise / Sunset</div><div className="value">
                {data.forecast.forecastday[0].astro.sunrise} · {data.forecast.forecastday[0].astro.sunset}
              </div></div>
            </div>
          </div>

          {/* Bottom full-width forecast */}
          <div className="forecast-section">
            <div className="section-title">3-day forecast</div>
            <div className="forecast-grid">
              {data.forecast.forecastday.map(d=>(
                <div className="forecast-card" key={d.date}>
                  <img src={d.day.condition.icon} width="48"/>
                  <div>
                    <div className="day">{fmt(d.date)}</div>
                    <div>{d.day.condition.text}</div>
                    <div className="range">{Math.round(d.day.mintemp_c)}° / {Math.round(d.day.maxtemp_c)}°</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

export default Weather;
