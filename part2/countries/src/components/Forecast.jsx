import { useEffect, useState } from "react";
import weatherService from "../services/weather";

const Forecast = ({ country }) => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    weatherService
      .getForCapital(country.capital, country.cca2)
      .then((data) => {
        setWeather(data);
      })
      .catch((err) => console.log(err));
  }, [country.capital, country.cca2]);

  if (weather) {
    const weatherIcon = weather.weather[0].icon;
    return (
      <div>
        <h2>Weather in {country.capital}</h2>
        <div>Temp: {weather.main.temp} &deg;C</div>
        <div>
          <img
            src={`https://openweathermap.org/img/wn/${weatherIcon}@2x.png`}
          />
        </div>
        <div>Wind: {weather.wind.speed} m/s</div>
      </div>
    );
  } else {
    return <div>Loading...</div>;
  }
};

export default Forecast;
