"use client";

import dynamic from "next/dynamic";
import { useMapEvents } from "react-leaflet/hooks";
const MapView = dynamic(() => import("@/components/MapView"), {
    ssr: false,
});

export default function MapPage() {
    return (
        <main className="p-4">
            <h1 className="text-2xl font-bold mb-4">Map</h1>
            <MapView />
        </main>
    );
}
