import React, { useState } from "react";
import { GoogleMap, LoadScript, Polyline, InfoWindow } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "500px",
  borderRadius: "12px",
};

// River path
const mithiRiverPath = [
  { lat: 19.120, lng: 72.880 },
  { lat: 19.115, lng: 72.875 },
  { lat: 19.110, lng: 72.870 },
  { lat: 19.105, lng: 72.865 },
  { lat: 19.100, lng: 72.860 },
  { lat: 19.095, lng: 72.855 },
  { lat: 19.090, lng: 72.850 },
  { lat: 19.085, lng: 72.848 },
  { lat: 19.080, lng: 72.845 },
  { lat: 19.075, lng: 72.842 },
];

// Dark futuristic style
const mapStyle = [
  { elementType: "geometry", stylers: [{ color: "#1e1e2f" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#ffffff" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#1e1e2f" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#0f4c81" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#2c2c3c" }] },
  { featureType: "poi", elementType: "geometry", stylers: [{ color: "#2c2c3c" }] },
];

export default function Maps() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const [selected, setSelected] = useState(null);

  if (!apiKey) return <div style={{ color: "red" }}>API key missing!</div>;

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={{ lat: 19.095, lng: 72.855 }}
        zoom={14}
        options={{ styles: mapStyle }}
      >
        <Polyline
          path={mithiRiverPath}
          options={{
            strokeColor: "#00f5ff",
            strokeOpacity: 0.8,
            strokeWeight: 8,
            clickable: true,
            zIndex: 1,
            icons: [
              {
                icon: {
                  path: window.google?.maps?.SymbolPath.FORWARD_CLOSED_ARROW,
                  scale: 4,
                  strokeColor: "#00f5ff",
                },
                offset: "0",
                repeat: "50px",
              },
            ],
          }}
          onClick={(e) =>
            setSelected({ lat: e.latLng.lat(), lng: e.latLng.lng() })
          }
        />

        {selected && (
          <InfoWindow
            position={selected}
            onCloseClick={() => setSelected(null)}
          >
            <div style={{ color: "#00f5ff" }}>
              <strong>River Clicked!</strong>
              <br />
              Latitude: {selected.lat.toFixed(6)}
              <br />
              Longitude: {selected.lng.toFixed(6)}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
}
