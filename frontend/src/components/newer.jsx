// // worldmap
// import React, { useState, useRef, useEffect } from "react";
// import Sidebar from "./Sidebar";
// import NasaWorldMap from "./NasaWorldMap";
// import ProfileModal from "../pages/profile/ProfileModal";
// import "./WorldMap.css";

// const WorldMap = () => {
//   const [activeTool, setActiveTool] = useState(null);
//   const [isZooming, setIsZooming] = useState(false);
//   const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const mapRef = useRef(null);
//   const [newLabelLocation, setNewLabelLocation] = useState(null);
//   const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

//   // Layer state management
//   const [activeBaseLayer, setActiveBaseLayer] = useState(
//     "MODIS_Terra_CorrectedReflectance_TrueColor"
//   );
//   const [activeOverlays, setActiveOverlays] = useState([]);

//   const [dateLeft, setDateLeft] = useState(
//     new Date().toISOString().split("T")[0]
//   );
//   const [dateRight, setDateRight] = useState("2020-09-22");

//   const [showProfile, setShowProfile] = useState(false);

//   useEffect(() => {
//     let zoomTimeout;
//     if (isZooming) {
//       zoomTimeout = setTimeout(() => setIsZooming(false), 1500);
//     }
//     return () => clearTimeout(zoomTimeout);
//   }, [isZooming]);

//   useEffect(() => {
//     const handleMouseMove = (e) => {
//       if (activeTool === "label") {
//         setCursorPosition({ x: e.clientX, y: e.clientY });
//       }
//     };
//     window.addEventListener("mousemove", handleMouseMove);
//     return () => window.removeEventListener("mousemove", handleMouseMove);
//   }, [activeTool]);

//   const handleZoom = () => {
//     setIsZooming(true);
//   };

//   const handleMapClick = (e, side = "single") => {
//     if (activeTool === "label") {
//       setNewLabelLocation(e.latlng);
//     } else if (activeTool === "story") {
//       console.log("Creating story at:", e.latlng, "on", side);
//     }
//   };

//   return (
//     <div className="world-view-container">
//       {/* MAP AREA */}
//       <div className="map-area">
//         {activeTool === "compare" ? (
//           <div className="compare-mode-container">
//             <div className="compare-map-wrapper left-map">
//               <NasaWorldMap
//                 key="left"
//                 date={dateLeft}
//                 onMapClick={(e) => handleMapClick(e, "left")}
//                 activeBaseLayer={activeBaseLayer}
//                 activeOverlays={activeOverlays}
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
//                 activeBaseLayer={activeBaseLayer}
//                 activeOverlays={activeOverlays}
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
//           <NasaWorldMap
//             key="single"
//             date={date}
//             onMapClick={(e) => handleMapClick(e, "single")}
//             activeBaseLayer={activeBaseLayer}
//             activeOverlays={activeOverlays}
//           />
//         )}
//       </div>

//       {/* NASA Logo */}
//       <div className="nasa-logo">NASA</div>

//       {/* Grid Overlay */}
//       <div className="map-grid" />

//       {/* Search Bar */}
//       <div className="search-container">
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

//       {/* Zoom Control */}
//       {isZooming && (
//         <div className="zoom-control">
//           <div className="zoom-slider">
//             <button onClick={() => handleZoom("in")}>+</button>
//             <div className="slider-track">
//               <div className="slider-thumb" />
//             </div>
//             <button onClick={() => handleZoom("out")}>-</button>
//           </div>
//         </div>
//       )}

//       {/* Floating cursor (+) */}
//       {activeTool === "label" && (
//         <div
//           className="label-cursor"
//           style={{
//             top: cursorPosition.y,
//             left: cursorPosition.x,
//           }}
//         >
//           +
//         </div>
//       )}

//       {/* Sidebar */}
//       <Sidebar
//         activeTool={activeTool}
//         setActiveTool={setActiveTool}
//         newLabelLocation={newLabelLocation}
//         date={date}
//         setDate={setDate}
//         setShowProfile={setShowProfile}
//         activeBaseLayer={activeBaseLayer}
//         setActiveBaseLayer={setActiveBaseLayer}
//         activeOverlays={activeOverlays}
//         setActiveOverlays={setActiveOverlays}
//       />
//       <ProfileModal open={showProfile} setOpen={setShowProfile} />
//     </div>
//   );
// };

// export default WorldMap;

// import React, { useState } from "react";
// import {
//   FaLayerGroup,
//   FaMapMarkerAlt,
//   FaBookOpen,
//   FaClone,
//   FaCalendarAlt,
//   FaTimes,
// } from "react-icons/fa";
// import { UserCircle } from "lucide-react";
// import "./Sidebar.css";

// const Sidebar = ({ activeTool, setActiveTool, newLabelLocation, date, setDate, setShowProfile }) => {
//   const [hoveredIcon, setHoveredIcon] = useState(null);

//   const tools = [
//     {
//       id: "layers",
//       icon: <FaLayerGroup size={24} />,
//       name: "Layers",
//       magicSentence:
//         "From here you can change the world's appearance and see it in new colors!",
//     },
//     {
//       id: "label",
//       icon: <FaMapMarkerAlt size={24} />,
//       name: "Create Label",
//       magicSentence: "Mark special places and create your own personal map!",
//     },
//     {
//       id: "story",
//       icon: <FaBookOpen size={24} />,
//       name: "Create Story",
//       magicSentence:
//         "Tell amazing stories about Earth's wonders and mysteries!",
//     },
//     {
//       id: "compare",
//       icon: <FaClone size={24} />,
//       name: "Compare",
//       magicSentence:
//         "See how our planet transforms over time with just a swipe!",
//     },
//     {
//       id: "date",
//       icon: <FaCalendarAlt size={24} />,
//       name: "Select Date",
//       magicSentence: "Pick a date to view the map for that day!",
//     },
//     {
//       id: "profile",
//       icon: <UserCircle size={24} />,
//       name: "Profile",
//       magicSentence: "View your profile info!",
//     },
//   ];

//   const handleIconClick = (toolId) => {
//     if (toolId === "profile") {
//       setShowProfile(true);
//       return;
//     }

//     if (activeTool === toolId) {
//       setActiveTool(null);
//     } else {
//       setActiveTool(toolId);
//     }
//   };

//   return (
//     <div className="sidebar-container">
//       <nav className="sidebar-dock">
//         {tools.map((tool) => (
//           <div
//             key={tool.id}
//             className="icon-container"
//             onMouseEnter={() => setHoveredIcon(tool.id)}
//             onMouseLeave={() => setHoveredIcon(null)}
//             onClick={() => handleIconClick(tool.id)}
//           >
//             <div
//               className={`sidebar-icon ${
//                 activeTool === tool.id ? "active" : ""
//               }`}
//             >
//               {tool.icon}
//             </div>

//             {hoveredIcon === tool.id && activeTool !== tool.id && (
//               <div className="magic-card">
//                 <p className="magic-sentence">{tool.magicSentence}</p>
//                 <span className="tool-name">{tool.name}</span>
//               </div>
//             )}
//           </div>
//         ))}
//       </nav>

//       {/* Smart Drawer */}
//       {activeTool && (
//         <div className="smart-drawer">
//           <div className="drawer-content">
//             {activeTool === "layers" && <LayersTool />}
//             {activeTool === "label" && (
//               <LabelTool newLabelLocation={newLabelLocation} />
//             )}
//             {activeTool === "story" && <StoryTool />}
//             {activeTool === "compare" && <CompareTool />}
//             {activeTool === "date" && (
//               <DateTool date={date} setDate={setDate} />
//             )}
//           </div>
//           <button className="close-drawer" onClick={() => setActiveTool(null)}>
//             <FaTimes />
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// // Tool Components
// const LayersTool = () => (
//   <div className="tool-interface">
//     <h3>Map Layers</h3>
//     <div className="layer-cards">
//       {["Temperature", "Vegetation", "Precipitation", "Elevation"].map(
//         (layer) => (
//           <div key={layer} className="layer-card">
//             <div className="layer-icon">🌡️</div>
//             <span>{layer}</span>
//           </div>
//         )
//       )}
//     </div>
//   </div>
// );

// const LabelTool = ({ newLabelLocation }) => {
//   const [labelName, setLabelName] = useState("");
//   const [visibility, setVisibility] = useState("private");

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     if (!newLabelLocation) {
//       alert("Please click on the map to set a label location!");
//       return;
//     }

//     const labelData = {
//       name: labelName,
//       location: newLabelLocation,
//       visibility: visibility,
//     };

//     console.log("Sending to backend:", labelData);

//     fetch("http://localhost:5000/api/labels", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(labelData),
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         console.log("Response from backend:", data);
//       })
//       .catch((err) => console.error("Error:", err));
//   };

//   return (
//     <div className="tool-interface">
//       <h3>Create a Label</h3>
//       <div className="label-preview">
//         <form
//           onSubmit={handleSubmit}
//           style={{ display: "flex", flexDirection: "column", gap: "10px" }}
//         >
//           <input
//             type="text"
//             placeholder="Enter label name"
//             value={labelName}
//             onChange={(e) => setLabelName(e.target.value)}
//             style={{
//               padding: "6px 10px",
//               borderRadius: "6px",
//               border: "1px solid rgba(0,169,255,0.3)",
//               background: "rgba(0,0,0,0.1)",
//               color: "white",
//             }}
//           />
//           <select
//             value={visibility}
//             onChange={(e) => setVisibility(e.target.value)}
//             style={{
//               padding: "6px 10px",
//               borderRadius: "6px",
//               border: "1px solid rgba(0,169,255,0.3)",
//               background: "rgba(0,0,0,0.1)",
//               color: "white",
//             }}
//           >
//             <option value="private">Only me</option>
//             <option value="public">Everyone</option>
//             <option value="none">none</option>
//           </select>
//           <button
//             type="submit"
//             style={{
//               padding: "8px 12px",
//               borderRadius: "6px",
//               border: "none",
//               background: "linear-gradient(to right, #1e3a8a, #581c87)",
//               color: "white",
//               cursor: "pointer",
//               fontWeight: "bold",
//               transition: "0.3s",
//             }}
//             onMouseOver={(e) => (e.currentTarget.style.opacity = 0.8)}
//             onMouseOut={(e) => (e.currentTarget.style.opacity = 1)}
//           >
//             Save Label
//           </button>
//         </form>

//         {newLabelLocation && (
//           <p>
//             Selected Location: {newLabelLocation.lat.toFixed(3)},{" "}
//             {newLabelLocation.lng.toFixed(3)}
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// const StoryTool = () => (
//   <div className="tool-interface">
//     <h3>Create a Story</h3>
//     <p>Select a location to start your NASA story</p>
//     <div className="story-examples">
//       <div className="story-sample">
//         <div className="story-image"></div>
//         <span>Climate Change</span>
//       </div>
//       <div className="story-sample">
//         <div className="story-image"></div>
//         <span>Urban Growth</span>
//       </div>
//     </div>
//   </div>
// );

// const CompareTool = () => (
//   <div className="tool-interface">
//     <h3>Compare Timelines</h3>
//     <p>Select two different dates to compare</p>
//   </div>
// );

// const DateTool = ({ date, setDate }) => (
//   <div className="tool-interface">
//     <h3>Select Date</h3>
//     <input
//       type="date"
//       value={date}
//       onChange={(e) => setDate(e.target.value)}
//       style={{
//         padding: "6px 10px",
//         borderRadius: "6px",
//         border: "1px solid rgba(0,169,255,0.3)",
//         background: "rgba(0,0,0,0.1)",
//         color: "white",
//       }}
//     />
//   </div>
// );

// export default Sidebar;
// import React, { useState } from "react";
// import {
//   MapContainer,
//   TileLayer,
//   LayersControl,
//   Marker,
//   Popup,
//   useMapEvents,
// } from "react-leaflet";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";
// import CustomZoom from "./CustomZoom";
// import { layerCategories } from "./layers"; // Import your layer definitions

// const GIBS_URL = (layerId, matrixSet, date, format) =>
//   `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/${layerId}/default/${date}/${matrixSet}/{z}/{y}/{x}.${format}`;

// const baseLayers = layerCategories.filter((l) => l.type === "base");
// const overlayLayers = layerCategories.filter((l) => l.type === "overlay");

// // Default marker icon
// const defaultIcon = new L.Icon({
//   iconUrl: "https://unpkg.com/leaflet@1.7/dist/images/marker-icon.png",
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [0, -35],
// });

// export default function NasaWorldMap({ date, onMapClick }) {
//   const [label, setLabel] = useState(null);
//   const [tempName, setTempName] = useState("");
//   const [showForm, setShowForm] = useState(false);

//   const worldBounds = [
//     [-90, -180], // Southwest
//     [90, 180], // Northeast
//   ];

//   const MapClickHandler = () => {
//     useMapEvents({
//       click(e) {
//         if (onMapClick) {
//           onMapClick(e);
//         }
//         setLabel({ position: e.latlng, name: "" });
//         setTempName("");
//         setShowForm(true);
//       },
//     });
//     return null;
//   };

//   const handleLabelSubmit = (e) => {
//     e.preventDefault();
//     if (!tempName.trim()) return;
//     const newLabel = { ...label, name: tempName };
//     setLabel(newLabel);
//     setShowForm(false);
//     fetch("http://localhost:5000/api/labels", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(newLabel),
//     });
//   };

//   return (
//     <MapContainer
//       center={[20, 0]}
//       zoom={3}
//       style={{ height: "100%", width: "100%" }}
//       maxBounds={worldBounds}
//       maxBoundsViscosity={1.0}
//       zoomControl={false}
//     >
//       <LayersControl position="topright">
//         {/* Render Base Layers Dynamically */}
//         {baseLayers.map((layer, idx) => (
//           <LayersControl.BaseLayer
//             key={layer.id}
//             name={layer.title}
//             checked={idx === 0} // Set the first base layer as default
//           >
//             <TileLayer
//               // key={`${layer.id}-${date}`}
//               // url={GIBS_URL(layer.id, layer.matrixSet, date, layer.format)}
//               // attribution="NASA Worldview / GIBS"
//               // noWrap={true}
//               url={GIBS_URL(layer.id, layer.matrixSet, date, layer.format)}
//               attribution="&copy; NASA EOSDIS GIBS"
//               noWrap={true}
//               tileSize={256}
//               maxNativeZoom={9}
//             />
//           </LayersControl.BaseLayer>
//         ))}

//         {/* Render Overlay Layers Dynamically */}
//         {overlayLayers.map((layer) => (
//           <LayersControl.Overlay key={layer.id} name={layer.title}>
//             <TileLayer
//               // key={`${layer.id}-${date}`}
//               // url={GIBS_URL(layer.id, layer.matrixSet, date, layer.format)}
//               // attribution="NASA Worldview / GIBS"
//               // noWrap={true}
//               url={GIBS_URL(layer.id, layer.matrixSet, date, layer.format)}
//               attribution="&copy; NASA EOSDIS GIBS"
//               noWrap={true}
//               tileSize={256}
//               opacity={0.7}
//               maxNativeZoom={parseInt(layer.matrixSet.match(/\d+/)[0])}
//             />
//           </LayersControl.Overlay>
//         ))}
//       </LayersControl>

//       <MapClickHandler />

//       {label && (
//         <Marker position={label.position} icon={defaultIcon}>
//           <Popup>
//             {showForm ? (
//               <form onSubmit={handleLabelSubmit}>
//                 <input
//                   type="text"
//                   placeholder="Enter label name"
//                   value={tempName}
//                   onChange={(e) => setTempName(e.target.value)}
//                   autoFocus
//                 />
//                 <button type="submit">Save</button>
//               </form>
//             ) : (
//               <b>{label.name}</b>
//             )}
//           </Popup>
//         </Marker>
//       )}

//       <CustomZoom />
//     </MapContainer>
//   );
// }