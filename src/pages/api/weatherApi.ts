// 📁 src/api/weatherApi.ts
export interface WeatherData {
  day: string;
  temp: number;
  humidity: number;
  rain: number;
}

/**
 * Fetch weather data from backend
 */
export async function getWeatherData(): Promise<WeatherData[]> {
  const res = await fetch("http://localhost:5000/api/weather"); // <-- your backend URL

  if (!res.ok) {
    throw new Error("Failed to fetch weather data");
  }

  const data = await res.json();

  // Optional: validate or normalize data
  return data;
}
