import React, { useState, useRef, useEffect } from "react";
import Sidebar from "./Sidebar";
import NasaWorldMap from "./NasaWorldMap";
import ProfileModal from "./ProfileModal";
import { User } from "lucide-react";
import "./WorldMap.css";

const WorldMap = () => {
  const [activeTool, setActiveTool] = useState(null);
  const [isZooming, setIsZooming] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const mapRef = useRef(null);
  const [newLabelLocation, setNewLabelLocation] = useState(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [activeLayers, setActiveLayers] = useState({
  "True Color (Day)": true,
  "Night Lights (2012)": false,
  "Fires and Thermal Anomalies": false,
  "Aerosol/Haze": false,
  "Soil Moisture": false,
});
  

  const [dateLeft, setDateLeft] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [dateRight, setDateRight] = useState("2020-09-22");

  const [showProfileModal, setShowProfileModal] = useState(false);

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
                newLabelLocation={newLabelLocation}
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
                newLabelLocation={newLabelLocation}
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
            newLabelLocation={newLabelLocation}
          />
        )}
      </div>

      {/* NASA Logo */}
      <div className="nasa-logo">NASA</div>

      {/* Profile Button */}
      <button
        className="profile-btn"
        onClick={() => setShowProfileModal(true)}
      >
        <User size={20} />
      </button>

      <ProfileModal
        open={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />

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

      {/* Date Control
      <div className="date-control">
        <div
          className="date-box"
          onClick={() => setShowDatePicker(!showDatePicker)}
        >
          <span className="date-icon">🗓️</span>
          <span className="date-text">{date}</span>
        </div>

        {showDatePicker && (
          <div className="date-picker-popup">
            <h4>Select Date</h4>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <button onClick={() => setShowDatePicker(false)}>Apply</button>
          </div>
        )}
      </div> */}

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
      />
    </div>
  );
};

export default WorldMap;



// import React, { useState, useRef, useEffect } from "react";
// import Sidebar from "../components/Sidebar";
// import NasaWorldMap from "../components/NasaWorldMap";
// // import "../components/WorldMap.css";

// const WorldMap = () => {
//   const [activeTool, setActiveTool] = useState(null);
//   const [isZooming, setIsZooming] = useState(false);
//   const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const mapRef = useRef(null);
//   const [newLabelLocation, setNewLabelLocation] = useState(null);

//   const [dateLeft, setDateLeft] = useState(
//     new Date().toISOString().split("T")[0]
//   );
//   const [dateRight, setDateRight] = useState("2020-09-22");

//   // Simulate zooming
//   useEffect(() => {
//     let zoomTimeout;
//     if (isZooming) {
//       zoomTimeout = setTimeout(() => setIsZooming(false), 1500);
//     }
//     return () => clearTimeout(zoomTimeout);
//   }, [isZooming]);

//   const handleZoom = (type) => {
//     setIsZooming(true);
//   };

//   const handleMapClick = (e, side = "single") => {
//     if (activeTool === "label") {
//       console.log("Creating label at:", e.latlng, "on", side);
//       setNewLabelLocation(e.latlng);
//     } else if (activeTool === "story") {
//       console.log("Creating story at:", e.latlng, "on", side);
//     } else {
//       console.log("Map click on", side, e.latlng);
//     }
//   };

//   return (
//     <div className="world-view-container">
//       {/* MAP AREA (conditionally single or compare) */}
//       <div className="map-area">
//         {/* <div
//         className={`map-area ${
//           activeTool === "label" ? "label-tool-active" : ""
//         }`} */}
//         {/* > */}
//         {activeTool === "compare" ? (
//           /* --- COMPARE VIEW: two maps side-by-side --- */
//           <div className="compare-mode-container">
//             <div className="compare-map-wrapper left-map">
//               <NasaWorldMap
//                 key="left"
//                 date={dateLeft}
//                 onMapClick={(e) => handleMapClick(e, "left")}
//               />
//               <div className="compare-date-picker">
//                 <label>Left Map Date:</label>
//                 <input
//                   type="date"
//                   value={dateLeft}
//                   onChange={(e) => setDateLeft(e.target.value)}
//                 />
//               </div>
//             </div>

//             <div className="compare-divider" />

//             <div className="compare-map-wrapper right-map">
//               <NasaWorldMap
//                 key="right"
//                 date={dateRight}
//                 onMapClick={(e) => handleMapClick(e, "right")}
//               />
//               <div className="compare-date-picker">
//                 <label>Right Map Date:</label>
//                 <input
//                   type="date"
//                   value={dateRight}
//                   onChange={(e) => setDateRight(e.target.value)}
//                 />
//               </div>
//             </div>

//             <button
//               className="exit-compare"
//               aria-label="Exit compare mode"
//               onClick={() => setActiveTool(null)}
//             >
//               ×
//             </button>
//           </div>
//         ) : (
//           /* --- SINGLE MAP VIEW --- */
//           <NasaWorldMap
//             key="single"
//             date={date}
//             onMapClick={(e) => handleMapClick(e, "single")}
//           />
//         )}
//       </div>
//       {/* Overlays (kept in their original place; ensured zIndex so they stay on top) */}
//       <div
//         className="nasa-logo"
//         style={{
//           position: "absolute",
//           top: "10px",
//           left: "10px",
//           color: "white",
//           fontWeight: "bold",
//           background: "rgba(0,0,0,0.5)",
//           padding: "4px 8px",
//           borderRadius: "4px",
//           zIndex: 2000,
//         }}
//       >
//         NASA
//       </div>
//       <div
//         className="map-grid"
//         style={{
//           position: "absolute",
//           inset: 0,
//           backgroundImage:
//             "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
//           backgroundSize: "50px 50px",
//           pointerEvents: "none",
//           zIndex: 1000,
//         }}
//       />
//       {/* Search Bar (kept at same place) */}
//       <div className="search-container" style={{ zIndex: 2000 }}>
//         <div className="search-bar">
//           <span className="search-icon">🔍</span>
//           <input
//             type="text"
//             placeholder="Search locations..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//         </div>
//       </div>
//       {/* Date Control */}
//       <div className="date-control" style={{ zIndex: 2000 }}>
//         <div
//           className="date-box"
//           onClick={() => setShowDatePicker(!showDatePicker)}
//           style={{ cursor: "pointer" }}
//         >
//           <span className="date-icon">🗓️</span>
//           <span className="date-text">{date}</span>
//         </div>

//         {showDatePicker && (
//           <div className="date-picker-popup">
//             <h4>Select Date</h4>
//             <input
//               type="date"
//               value={date}
//               onChange={(e) => setDate(e.target.value)}
//             />
//             <button onClick={() => setShowDatePicker(false)}>Apply</button>
//           </div>
//         )}
//       </div>
//       {/* Zoom Control */}
//       {isZooming && (
//         <div className="zoom-control" style={{ zIndex: 2000 }}>
//           <div className="zoom-slider">
//             <button onClick={() => handleZoom("in")}>+</button>
//             <div className="slider-track">
//               <div className="slider-thumb" />
//             </div>
//             <button onClick={() => handleZoom("out")}>-</button>
//           </div>
//         </div>
//       )}

//       {activeTool === "label" && (
//         <div className="label-cursor" style={{ zIndex: 2000 }}>
//           +
//         </div>
//       )}
//       {/* Sidebar (unchanged) */}
//       <Sidebar
//         activeTool={activeTool}
//         setActiveTool={setActiveTool}
//         newLabelLocation={newLabelLocation}
//       />
//     </div>
//   );
// };

// export default WorldMap;
