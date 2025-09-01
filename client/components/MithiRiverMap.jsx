import React, { useState } from "react";
import { GoogleMap, LoadScript, Polyline, Marker, InfoWindow } from "@react-google-maps/api";

const containerStyle = { width: "100%", height: "600px", borderRadius: "12px" };

// Cyberpunk dark theme
const mapStyle = [
  { elementType: "geometry", stylers: [{ color: "#0d0d1f" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#ffffff" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0d0d1f" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#001f3f" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#12122e" }] },
  { featureType: "poi", elementType: "geometry", stylers: [{ color: "#12122e" }] },
];

// Correct Mithi River path from Powai/Vihar Lakes to Mahim Creek
const mithiRiverPath = [
  { lat: 19.1178, lng: 72.9100 }, // Powai Lake (Origin)
  { lat: 19.1200, lng: 72.9050 }, 
  { lat: 19.1150, lng: 72.9000 },
  { lat: 19.1100, lng: 72.8950 },
  { lat: 19.1070, lng: 72.8900 },
  { lat: 19.1050, lng: 72.8850 },
  { lat: 19.1020, lng: 72.8800 },
  { lat: 19.1000, lng: 72.8750 },
  { lat: 19.0980, lng: 72.8700 },
  { lat: 19.0950, lng: 72.8650 },
  { lat: 19.0930, lng: 72.8600 },
  { lat: 19.0900, lng: 72.8550 }, 
  { lat: 19.0880, lng: 72.8500 },
  { lat: 19.0850, lng: 72.8480 }, // Mahim Creek (Mouth)
];

export default function MithiRiverMap() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const [selected, setSelected] = useState(null);

  if (!apiKey) return <div className="text-red-500">Google Maps API Key missing!</div>;

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={{ lat: 19.105, lng: 72.885 }}
        zoom={13}
        options={{
          styles: mapStyle,
          disableDefaultUI: false,
          tilt: 45,
          mapTypeId: "terrain",
        }}
      >
        {/* Neon Futuristic River */}
        <Polyline
          path={mithiRiverPath}
          options={{
            strokeColor: "#00f5ff",
            strokeOpacity: 0.9,
            strokeWeight: 6,
            clickable: true,
            zIndex: 10,
            icons: [
              {
                icon: {
                  path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                  scale: 4,
                  strokeColor: "#00ffff",
                  fillColor: "#00ffff",
                  fillOpacity: 1,
                },
                offset: "0",
                repeat: "50px",
              },
            ],
          }}
          onClick={(e) =>
            setSelected({
              lat: e.latLng.lat(),
              lng: e.latLng.lng(),
              message: "You clicked on Mithi River!",
            })
          }
        />

        {/* Origin Marker */}
        <Marker
          position={mithiRiverPath[0]}
          label={{
            text: "Origin",
            color: "#00ffff",
            fontWeight: "bold",
          }}
          icon={{
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: "#00ffea",
            fillOpacity: 1,
            strokeWeight: 1,
            strokeColor: "#00f5ff",
          }}
          onClick={() =>
            setSelected({
              lat: mithiRiverPath[0].lat,
              lng: mithiRiverPath[0].lng,
              message: "Origin of Mithi River near Powai Lake",
            })
          }
        />

        {/* Mouth Marker */}
        <Marker
          position={mithiRiverPath[mithiRiverPath.length - 1]}
          label={{
            text: "Mouth",
            color: "#00ffff",
            fontWeight: "bold",
          }}
          icon={{
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: "#00ffea",
            fillOpacity: 1,
            strokeWeight: 1,
            strokeColor: "#00f5ff",
          }}
          onClick={() =>
            setSelected({
              lat: mithiRiverPath[mithiRiverPath.length - 1].lat,
              lng: mithiRiverPath[mithiRiverPath.length - 1].lng,
              message: "Mouth of Mithi River into Mahim Creek",
            })
          }
        />

        {/* InfoWindow */}
        {selected && (
          <InfoWindow
            position={{ lat: selected.lat, lng: selected.lng }}
            onCloseClick={() => setSelected(null)}
            options={{ pixelOffset: new window.google.maps.Size(0, -10) }}
          >
            <div className="p-2 text-cyan-400 font-semibold bg-black bg-opacity-60 rounded-md">
              <h4 className="text-lg font-bold">River Info</h4>
              <p>{selected.message}</p>
              <p>Latitude: {selected.lat.toFixed(6)}</p>
              <p>Longitude: {selected.lng.toFixed(6)}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
}
