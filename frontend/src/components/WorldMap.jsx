import React, { useState, useRef, useEffect } from "react";
import Sidebar from "./Sidebar";
import NasaWorldMap from "./NasaWorldMap";
import ProfileModal from "../pages/profile/ProfileModal";
import "./WorldMap.css";

const WorldMap = () => {
  const [activeTool, setActiveTool] = useState(null);
  const [isZooming, setIsZooming] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const mapRef = useRef(null);
  const [newLabelLocation, setNewLabelLocation] = useState(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  // Layer state management
  const [activeBaseLayer, setActiveBaseLayer] = useState(
    "MODIS_Terra_CorrectedReflectance_TrueColor"
  );
  const [activeOverlays, setActiveOverlays] = useState([]);

  const [dateLeft, setDateLeft] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [dateRight, setDateRight] = useState("2020-09-22");

  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    let zoomTimeout;
    if (isZooming) {
      zoomTimeout = setTimeout(() => setIsZooming(false), 1500);
    }
    return () => clearTimeout(zoomTimeout);
  }, [isZooming]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (activeTool === "label") {
        setCursorPosition({ x: e.clientX, y: e.clientY });
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [activeTool]);

  const handleZoom = () => {
    setIsZooming(true);
  };

  const handleMapClick = (e, side = "single") => {
    if (activeTool === "label") {
      setNewLabelLocation(e.latlng);
    } else if (activeTool === "story") {
      console.log("Creating story at:", e.latlng, "on", side);
    }
  };

  return (
    <div className="world-view-container">
      {/* MAP AREA */}
      <div className="map-area">
        {activeTool === "compare" ? (
          <div className="compare-mode-container">
            <div className="compare-map-wrapper left-map">
              <NasaWorldMap
                key="left"
                date={dateLeft}
                onMapClick={(e) => handleMapClick(e, "left")}
                activeBaseLayer={activeBaseLayer}
                activeOverlays={activeOverlays}
              />
              <div className="compare-date-picker">
                <label>Left Map Date:</label>
                <input
                  type="date"
                  value={dateLeft}
                  onChange={(e) => setDateLeft(e.target.value)}
                />
              </div>
            </div>

            <div className="compare-divider" />

            <div className="compare-map-wrapper right-map">
              <NasaWorldMap
                key="right"
                date={dateRight}
                onMapClick={(e) => handleMapClick(e, "right")}
                activeBaseLayer={activeBaseLayer}
                activeOverlays={activeOverlays}
              />
              <div className="compare-date-picker">
                <label>Right Map Date:</label>
                <input
                  type="date"
                  value={dateRight}
                  onChange={(e) => setDateRight(e.target.value)}
                />
              </div>
            </div>

            <button
              className="exit-compare"
              aria-label="Exit compare mode"
              onClick={() => setActiveTool(null)}
            >
              ×
            </button>
          </div>
        ) : (
          <NasaWorldMap
            key="single"
            date={date}
            onMapClick={(e) => handleMapClick(e, "single")}
            activeBaseLayer={activeBaseLayer}
            activeOverlays={activeOverlays}
          />
        )}
      </div>

      {/* NASA Logo */}
      <div className="nasa-logo">NASA</div>

      {/* Grid Overlay */}
      <div className="map-grid" />

      {/* Search Bar */}
      <div className="search-container">
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Zoom Control */}
      {isZooming && (
        <div className="zoom-control">
          <div className="zoom-slider">
            <button onClick={() => handleZoom("in")}>+</button>
            <div className="slider-track">
              <div className="slider-thumb" />
            </div>
            <button onClick={() => handleZoom("out")}>-</button>
          </div>
        </div>
      )}

      {/* Floating cursor (+) */}
      {activeTool === "label" && (
        <div
          className="label-cursor"
          style={{
            top: cursorPosition.y,
            left: cursorPosition.x,
          }}
        >
          +
        </div>
      )}

      {/* Sidebar */}
      <Sidebar
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        newLabelLocation={newLabelLocation}
        date={date}
        setDate={setDate}
        setShowProfile={setShowProfile}
        activeBaseLayer={activeBaseLayer}
        setActiveBaseLayer={setActiveBaseLayer}
        activeOverlays={activeOverlays}
        setActiveOverlays={setActiveOverlays}
      />
      <ProfileModal open={showProfile} setOpen={setShowProfile} />
    </div>
  );
};

export default WorldMap;
