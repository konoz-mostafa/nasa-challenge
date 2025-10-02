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
import CustomZoom from "./CustomZoom";
import { layerCategories } from "./layers";

const GIBS_URL = (layerId, matrixSet, date, format) =>
  `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/${layerId}/default/${date}/${matrixSet}/{z}/{y}/{x}.${format}`;

// Default marker icon
const defaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [0, -35],
});

export default function NasaWorldMap({
  date,
  onMapClick,
  activeBaseLayer,
  activeOverlays,
}) {
  const [label, setLabel] = useState(null);
  const [tempName, setTempName] = useState("");
  const [showForm, setShowForm] = useState(false);

  const worldBounds = [
    [-90, -180],
    [90, 180],
  ];

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

  // Get the active base layer config
  const baseLayerConfig =
    layerCategories.find(
      (l) => l.id === activeBaseLayer && l.type === "base"
    ) || layerCategories.find((l) => l.type === "base");

  // Get active overlay configs
  const overlayConfigs = layerCategories.filter(
    (l) => l.type === "overlay" && activeOverlays.includes(l.id)
  );

  return (
    <MapContainer
      center={[20, 0]}
      zoom={3}
      style={{ height: "100%", width: "100%" }}
      maxBounds={worldBounds}
      maxBoundsViscosity={1.0}
      zoomControl={false}
    >
      {/* Base Layer */}
      <TileLayer
        key={`base-${baseLayerConfig.id}-${date}`}
        url={GIBS_URL(
          baseLayerConfig.id,
          baseLayerConfig.matrixSet,
          date,
          baseLayerConfig.format
        )}
        attribution="&copy; NASA EOSDIS GIBS"
        noWrap={true}
        tileSize={256}
        maxNativeZoom={9}
      />

      {/* Overlay Layers */}
      {overlayConfigs.map((layer) => (
        <TileLayer
          key={`overlay-${layer.id}-${date}`}
          url={GIBS_URL(layer.id, layer.matrixSet, date, layer.format)}
          attribution="&copy; NASA EOSDIS GIBS"
          noWrap={true}
          tileSize={256}
          opacity={layer.opacity || 0.7}
          maxNativeZoom={parseInt(layer.matrixSet.match(/\d+/)[0])}
        />
      ))}

      <MapClickHandler />

      {label && (
        <Marker position={label.position} icon={defaultIcon}>
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

      <CustomZoom />
    </MapContainer>
  );
}
