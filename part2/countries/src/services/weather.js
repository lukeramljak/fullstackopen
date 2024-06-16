import axios from "axios";

const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
const baseUrl = "http://api.weatherapi.com/v1";

const getCurrent = (location) => {
  const response = axios.get(
    `${baseUrl}/current.json?key=${apiKey}&q=${location}`
  );
  return response;
};

export default { getCurrent };
