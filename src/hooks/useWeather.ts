import axios from "axios";
import { z } from "zod";
// import { object, string, number, InferOutput, parse } from "valibot";
import { useMemo, useState } from "react";
import { SearchType } from "../types";

// function isWeatherResult(weather: unknown): weather is Weather {
//   return (
//     Boolean(weather) &&
//     typeof weather === "object" &&
//     typeof (weather as Weather).name === "string" &&
//     typeof (weather as Weather).main.temp === "number" &&
//     typeof (weather as Weather).main.temp_max === "number" &&
//     typeof (weather as Weather).main.temp_min === "number"
//   );
// }

//zod
const Weather = z.object({
  name: z.string(),
  main: z.object({
    temp: z.number(),
    temp_max: z.number(),
    temp_min: z.number(),
  }),
});

export type Weather = z.infer<typeof Weather>;

//valibot
// const WeatherSchema = object({
//   name: string(),
//   main: object({
//     temp: number(),
//     temp_max: number(),
//     temp_min: number(),
//   }),
// });

// type Weather = InferOutput<typeof WeatherSchema>;

const initialState = {
  name: "",
  main: {
    temp: 0,
    temp_max: 0,
    temp_min: 0,
  },
};

export default function useWeather() {
  const [weather, setWeather] = useState<Weather>(initialState);
  const [loading, setLoading] = useState(false);
  const [notFound, setnotFound] = useState(false);
  const fetchWeather = async (search: SearchType) => {
    const appID = import.meta.env.VITE_API_KEY;
    setLoading(true);
    setWeather(initialState);
    try {
      const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${search.city},${search.country}&appid=${appID}`;

      const { data } = await axios(geoUrl);

      //comprobar si existe
      if (!data[0]) {
        setnotFound(true);
        return;
      }
      const lat = data[0].lat;
      const lon = data[0].lon;

      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appID}`;

      //castear type (menos recomendada)
      //   const { data: weatherResult } = await axios<Weather>(weatherUrl);
      //type guard
      //   const { data: weatherResult } = await axios(weatherUrl);
      //   const result = isWeatherResult(weatherResult);

      //Zod
      const { data: weatherResult } = await axios(weatherUrl);
      const result = Weather.safeParse(weatherResult);
      if (result.success) {
        setWeather(result.data);
      }

      //valibot
      // const { data: weatherResult } = await axios(weatherUrl);
      // const result = parse(WeatherSchema, weatherResult);
      // console.log(result)
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const hasWeatherData = useMemo(() => weather.name, [weather]);

  return {
    weather,
    loading,
    notFound,
    fetchWeather,
    hasWeatherData,
  };
}
