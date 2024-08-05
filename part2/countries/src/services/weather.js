import axios from "axios";
const api_Key = import.meta.env.VITE_WEATHER_API_KEY;

const getForCapital = (capital, cca2) => {
  const request = axios.get(
    `https://api.openweathermap.org/data/2.5/weather?q=${capital},${cca2}&appid=${api_Key}&units=metric`
  );
  return request.then((response) => response.data);
};

export default {
  getForCapital,
};
