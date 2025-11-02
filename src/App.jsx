import './App.css';
import { useState } from 'react';

function Weather() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apikey = "";

  const fetchWeather = async () => {
    if (!city) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${apikey}&q=${city}`
      );
      const data = await response.json();

      if (data.error) {
        setError(data.error.message);
        setWeather(null);
      } else {
        setWeather(data);
      }
    } catch (err) {
      setError("Weather data couldn't be fetched unfortunately.");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="first-div" style={{ textAlign: "center", padding: "40px" }}>
      <h1>🌦️ Weather App</h1>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name"
          style={{
            padding: "10px",
            width: "250px",
            fontSize: "16px",
            borderRadius: "8px",
            border: "1px dashed #ccc",
            marginRight: "10px",
          }}
        />
        <button
          onClick={fetchWeather}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            borderRadius: "8px",
            background: "#007BFF",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Get Weather
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>❌ {error}</p>}

      {weather && (
        <div
          style={{
            background: "white",
            display: "inline-block",
            padding: "20px 40px",
            borderRadius: "16px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            textAlign: "left",
          }}
        >
          <h2>
            {weather.location.name}, {weather.location.country}
          </h2>
          <img
            src={weather.current.condition.icon}
            alt={weather.current.condition.text}
            style={{ verticalAlign: "middle" }}
          />
          <h3>{weather.current.temp_c}°C</h3>
          <p>{weather.current.condition.text}</p>
          <p>💨 {weather.current.wind_kph} km/h wind</p>
          <p>💧 {weather.current.humidity}% humidity</p>
          <p>🕒 Local time: {weather.location.localtime}</p>
        </div>
      )}
    </div>
  );
}

export default Weather;
