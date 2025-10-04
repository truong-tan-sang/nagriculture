"use client";
import { useLeafletContext } from '@react-leaflet/core'
import "leaflet-geometryutil";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from 'leaflet'
import { use, useEffect, useState } from "react";
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

function Square(props) {
    // const [area, setArea] = useState(0);
    const context = useLeafletContext()
    useEffect(() => {
        // Tính diện tích (m2)
        const latLngs = polygonCoords.map(([lat, lng]) => L.latLng(lat, lng));
        // const areaCalc = L.GeometryUtil.geodesicArea(latLngs);
        // setArea(areaCalc);
    }, []);
    useEffect(() => {
        const bounds = L.latLng(props.center).toBounds(props.size)
        const square = new L.Rectangle(bounds)
        const container = context.layerContainer || context.map
        container.addLayer(square)

        return () => {
            container.removeLayer(square)
        }
    })

    return null
}
const center = [10.535512374246121, 105.86227561323018]
const polygonCoords = [
    [10.5380, 105.6000],
    [10.5365, 105.8630],
    [10.5345, 105.8630],
    [10.5345, 105.8615],
];
export default function MapView() {
    return (
        <div className="w-full h-[80vh] bg-white rounded-lg shadow-lg">
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
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />      <Square center={center} size={1000} />

                <Marker position={[10.535512374246121, 105.86227561323018]}>
                    <Popup>A pretty CSS3 popup. <br /> Easily customizable.</Popup>
                </Marker>
            </MapContainer>
        </div>
    );
}
