import styles from "./App.module.css";
import Alert from "./components/Alert/Alert";
import Spinner from "./components/Spinner/Spinner";
import WeatherDetail from "./components/WeatherDetail";
import Form from "./components/form/Form";
import useWeather from "./hooks/useWeather";
export default function App() {
  const { weather, loading, notFound, fetchWeather, hasWeatherData } =
    useWeather();
  return (
    <>
      <h1 className={styles.title}>Buscador de Clima</h1>
      <div className={styles.container}>
        <Form fetchWeather={fetchWeather} />
        {loading && <Spinner />}
        {hasWeatherData && <WeatherDetail weather={weather} />}
        {notFound && <Alert>Ciudad no encontrada</Alert>}
      </div>
    </>
  );
}
