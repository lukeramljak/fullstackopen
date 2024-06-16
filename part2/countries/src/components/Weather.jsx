import { useEffect, useState } from "react";
import weatherService from "../services/weather";

const Weather = ({ country }) => {
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    weatherService.getCurrent(country.capital[0]).then((response) => {
      setWeatherData(response.data);
    });
  }, [country]);

  return (
    weatherData && (
      <div>
        <h2>Weather in {country.capital[0]}</h2>
        <p>temperature {weatherData.current?.temp_c} Celsius</p>
        <img
          src={weatherData.current.condition.icon}
          alt={weatherData.current.condition.text}
        />
        <p>wind {weatherData.current.wind_kph} km/h</p>
      </div>
    )
  );
};

export default Weather;
