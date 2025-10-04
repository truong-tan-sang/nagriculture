"use client";
import { useLeafletContext } from '@react-leaflet/core'
import "leaflet-geometryutil";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from 'leaflet'
import { use, useEffect, useState } from "react";
import { Box } from '@mui/material';
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});
function MyComponent() {
    const map = useMapEvents({
        click: () => {
            map.locate()
        },
        locationfound: (location) => {
            console.log('location found:', location)
        },
    })
    return null
}

const center = [10.535512374246121, 105.86227561323018]

export default function MapView() {
    return (
        <div className="w-full h-[100vh] bg-white rounded-lg shadow-lg">
            <MapContainer
                center={center}
                zoom={16}
                scrollWheelZoom={false}
                dragging={false}
                zoomControl={false}
                doubleClickZoom={false}
                touchZoom={false}
                style={{ height: "100%", width: "100%" }}
            >
                <MyComponent />
                <TileLayer
                    attribution='Tiles &copy; <a href="https://www.esri.com/">Esri</a>'
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                />
                {/* <Square center={center} size={1000} /> */}

                <Marker position={[10.535512374246121, 105.86227561323018]}>
                    <Popup>A pretty CSS3 popup. <br /> Easily customizable.</Popup>
                </Marker>
            </MapContainer>
        </div>
    );
}
