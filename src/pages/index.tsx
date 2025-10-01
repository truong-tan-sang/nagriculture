"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

export default function Home() {
  const [weather, setWeather] = useState<any>(null);
  const [score, setScore] = useState<number>(0);
  const [crop, setCrop] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/weather");
      const data = await res.json();
      setWeather(data);
    }
    fetchData();
  }, []);

  function plantCrop(type: string) {
    setCrop(type);

    if (weather) {
      const temp = weather.properties.parameter.T2M[0];
      const rain = weather.properties.parameter.PRECTOT[0];

      // Logic siêu đơn giản demo
      if (type === "rice" && rain > 5) {
        setScore((s) => s + 10);
      } else if (type === "corn" && temp >= 20 && temp <= 30) {
        setScore((s) => s + 8);
      } else {
        setScore((s) => s + 2); // mặc định
      }
    }
  }

  return (
    <div className="flex h-screen">
      {/* Bên trái: Map */}
      <div className="flex-1">
        <MapView />
      </div>

      {/* Bên phải: UI Game */}
      <div className="w-80 bg-gray-900 text-white p-4 flex flex-col gap-4">
        <h1 className="text-xl font-bold">Nagriculture 🌱</h1>

        {/* Weather info */}
        <div className="bg-gray-800 p-3 rounded">
          <h2 className="font-semibold mb-2">Weather</h2>
          {weather ? (
            <ul>
              <li>🌡 Temp: {weather.properties.parameter.T2M[0]}°C</li>
              <li>☔ Rain: {weather.properties.parameter.PRECTOT[0]} mm</li>
            </ul>
          ) : (
            <p>Loading...</p>
          )}
        </div>

        {/* Crop action */}
        <div className="bg-gray-800 p-3 rounded">
          <h2 className="font-semibold mb-2">Plant Crop</h2>
          <div className="flex gap-2">
            <button
              onClick={() => plantCrop("rice")}
              className="px-3 py-1 bg-green-600 rounded"
            >
              Rice
            </button>
            <button
              onClick={() => plantCrop("corn")}
              className="px-3 py-1 bg-yellow-600 rounded"
            >
              Corn
            </button>
          </div>
        </div>

        {/* Scoreboard */}
        <div className="bg-gray-800 p-3 rounded">
          <h2 className="font-semibold mb-2">Zero Carbon Score</h2>
          <div className="w-full bg-gray-700 h-4 rounded">
            <div
              className="bg-green-500 h-4 rounded"
              style={{ width: `${score}%` }}
            />
          </div>
          <p className="mt-1">{score} pts</p>
        </div>
      </div>
    </div>
  );
}
