import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import CustomZoom from "../../components/CustomZoom";
import ViewMarkers from "../../components/ViewMarkers";

// Custom icon for Messier objects
const messierIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [0, -35],
});

export default function MessierMap({ onMapClick }) {
  const [label, setLabel] = useState(null);
  const [tempName, setTempName] = useState("");
  const [showForm, setShowForm] = useState(false);

  const userToken = localStorage.getItem("token");
  const mapId = "messierMap";

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        if (onMapClick) {
          onMapClick(e);
        }
        setLabel({ position: e.latlng, name: "" });
        setTempName("");
        setShowForm(true);
      },
    });
    return null;
  };

  const handleLabelSubmit = (e) => {
    e.preventDefault();
    if (!tempName.trim()) return;
    const newLabel = { ...label, name: tempName };
    setLabel(newLabel);
    setShowForm(false);
    fetch("http://localhost:5000/api/labels", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newLabel),
    }).catch((err) => console.error("Error saving label:", err));
  };

  return (
    <MapContainer
      center={[0, 0]}
      zoom={3}
      style={{ height: "100%", width: "100%" }}
      zoomControl={false}
      minZoom={2}
      maxZoom={6}
    >
      {/* Messier Tiles from your API */}
      <TileLayer
        url="https://0a69e0e57dd7.ngrok-free.app/messeir1/{z}/{x}/{y}.html"
        attribution="&copy; Messier Catalog"
        tileSize={256}
        maxNativeZoom={5}
      />

      <MapClickHandler />

      {label && (
        <Marker position={label.position} icon={messierIcon}>
          <Popup>
            {showForm ? (
              <form onSubmit={handleLabelSubmit}>
                <input
                  type="text"
                  placeholder="Enter label name"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  autoFocus
                  style={{
                    width: "100%",
                    padding: "5px",
                    marginBottom: "8px",
                    border: "1px solid #ccc",
                    borderRadius: "3px",
                  }}
                />
                <button
                  type="submit"
                  style={{
                    padding: "5px 10px",
                    backgroundColor: "#4CAF50",
                    color: "white",
                    border: "none",
                    borderRadius: "3px",
                    cursor: "pointer",
                  }}
                >
                  Save
                </button>
              </form>
            ) : (
              <b>{label.name}</b>
            )}
          </Popup>
        </Marker>
      )}

      <ViewMarkers token={userToken} mapId={mapId} />

      <CustomZoom />
    </MapContainer>
  );
}
