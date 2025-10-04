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
    </div>
  );
}
