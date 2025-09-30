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

// // Helper function to build the NASA GIBS layer URL
// const GIBS_URL = (layerId, matrixSet, date, format = "png") =>
//   `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/${layerId}/default/${date}/${matrixSet}/{z}/{y}/{x}.${format}`;

// // Curated list of 10 NASA Worldview layers

// const LAYERS = [
//   {
//     id: "MODIS_Terra_CorrectedReflectance_TrueColor",
//     title: "MODIS True Color (Terra)",
//     matrixSet: "GoogleMapsCompatible_Level9",
//     format: "jpg",
//     type: "base",
//     description: "Natural color satellite imagery",
//     opacity: 1.0,
//   },
//   {
//     id: "VIIRS_NOAA20_CorrectedReflectance_TrueColor",
//     title: "VIIRS True Color (NOAA-20)",
//     matrixSet: "GoogleMapsCompatible_Level9",
//     format: "jpg",
//     type: "base",
//     description: "High resolution true color",
//     opacity: 1.0,
//   },
//   {
//     id: "MODIS_Terra_CorrectedReflectance_Bands721",
//     title: "False Color (Urban)",
//     matrixSet: "GoogleMapsCompatible_Level9",
//     format: "jpg",
//     type: "overlay",
//     description: "Cities appear purple/brown",
//     opacity: 0.8,
//   },
//   {
//     id: "VIIRS_NOAA20_CorrectedReflectance_BandsM11-I2-I1",
//     title: "Night Infrared",
//     matrixSet: "GoogleMapsCompatible_Level9",
//     format: "jpg",
//     type: "overlay",
//     description: "Infrared view for night observation",
//     opacity: 0.8,
//   },
//   {
//     id: "MODIS_Terra_Land_Surface_Temp_Day",
//     title: "Land Surface Temperature (Day)",
//     matrixSet: "GoogleMapsCompatible_Level7",
//     format: "png",
//     type: "overlay",
//     description: "Surface temperature during daytime",
//     opacity: 0.7,
//   },
//   {
//     id: "MODIS_Terra_Snow_Cover",
//     title: "Snow Cover",
//     matrixSet: "GoogleMapsCompatible_Level8",
//     format: "png",
//     type: "overlay",
//     description: "Shows snow and ice coverage",
//     opacity: 0.7,
//   },
//   {
//     id: "MODIS_Terra_Aerosol",
//     title: "Aerosol Optical Depth",
//     matrixSet: "GoogleMapsCompatible_Level6",
//     format: "png",
//     type: "overlay",
//     description: "Air quality and atmospheric particles",
//     opacity: 0.7,
//   },
//   {
//     id: "MODIS_Terra_Water_Vapor_5km_Day",
//     title: "Water Vapor",
//     matrixSet: "GoogleMapsCompatible_Level6",
//     format: "png",
//     type: "overlay",
//     description: "Atmospheric moisture content",
//     opacity: 0.6,
//   },
//   {
//     id: "MODIS_Terra_Cloud_Top_Temp_Day",
//     title: "Cloud Top Temperature",
//     matrixSet: "GoogleMapsCompatible_Level6",
//     format: "png",
//     type: "overlay",
//     description: "Temperature at cloud tops",
//     opacity: 0.7,
//   },
//   {
//     id: "VIIRS_NOAA20_CorrectedReflectance_BandsM3-I3-M11",
//     title: "Shortwave Infrared",
//     matrixSet: "GoogleMapsCompatible_Level9",
//     format: "jpg",
//     type: "overlay",
//     description: "Useful for detecting fires and hot spots",
//     opacity: 0.8,
//   },
// ];

// // // Custom Zoom Control Component
// // const CustomZoom = () => {
// //   const map = useMapEvents({});

// //   return (
// //     <div
// //       style={{
// //         position: "absolute",
// //         top: "10px",
// //         left: "10px",
// //         zIndex: 1000,
// //         display: "flex",
// //         flexDirection: "column",
// //         gap: "5px",
// //       }}
// //     >
// //       <button
// //         onClick={() => map.zoomIn()}
// //         style={{
// //           width: "30px",
// //           height: "30px",
// //           backgroundColor: "white",
// //           border: "2px solid #ccc",
// //           borderRadius: "4px",
// //           cursor: "pointer",
// //           fontSize: "18px",
// //           fontWeight: "bold",
// //         }}
// //       >
// //         +
// //       </button>
// //       <button
// //         onClick={() => map.zoomOut()}
// //         style={{
// //           width: "30px",
// //           height: "30px",
// //           backgroundColor: "white",
// //           border: "2px solid #ccc",
// //           borderRadius: "4px",
// //           cursor: "pointer",
// //           fontSize: "18px",
// //           fontWeight: "bold",
// //         }}
// //       >
// //         −
// //       </button>
// //     </div>
// //   );
// // };

// // Default marker icon
// const defaultIcon = new L.Icon({
//   iconUrl: "https://unpkg.com/leaflet@1.7/dist/images/marker-icon.png",
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [0, -35],
// });

// export default function NasaWorldMap() {
//   const [date] = useState(() => {
//     const d = new Date();
//     d.setDate(d.getDate() - 1);
//     return d.toISOString().split("T")[0];
//   });

//   const [markers, setMarkers] = useState([]);
//   const [showForm, setShowForm] = useState(false);
//   const [tempMarker, setTempMarker] = useState(null);
//   const [tempName, setTempName] = useState("");

//   const worldBounds = [
//     [-85, -180],
//     [85, 180],
//   ];

//   const baseLayers = LAYERS.filter((l) => l.type === "base");
//   const overlayLayers = LAYERS.filter((l) => l.type === "overlay");

//   const MapClickHandler = () => {
//     useMapEvents({
//       click(e) {
//         setTempMarker(e.latlng);
//         setTempName("");
//         setShowForm(true);
//       },
//     });
//     return null;
//   };

//   const handleSave = () => {
//     if (!tempName.trim() || !tempMarker) return;

//     const newMarker = {
//       id: Date.now(),
//       position: tempMarker,
//       name: tempName,
//     };

//     setMarkers([...markers, newMarker]);
//     setShowForm(false);
//     setTempMarker(null);
//     setTempName("");
//   };

//   const handleCancel = () => {
//     setShowForm(false);
//     setTempMarker(null);
//     setTempName("");
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
//         {baseLayers.map((layer, idx) => (
//           <LayersControl.BaseLayer
//             key={layer.id}
//             checked={idx === 0}
//             name={layer.title}
//           >
//             <TileLayer
//               url={GIBS_URL(layer.id, layer.matrixSet, date, layer.format)}
//               attribution="&copy; NASA EOSDIS GIBS"
//               noWrap={true}
//               tileSize={256}
//               maxNativeZoom={9}
//             />
//           </LayersControl.BaseLayer>
//         ))}

//         {overlayLayers.map((layer) => (
//           <LayersControl.Overlay key={layer.id} name={layer.title}>
//             <TileLayer
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
//       <CustomZoom />

//       {markers.map((marker) => (
//         <Marker key={marker.id} position={marker.position} icon={defaultIcon}>
//           <Popup>
//             <div style={{ fontWeight: "bold", fontSize: "14px" }}>
//               {marker.name}
//             </div>
//             <div style={{ fontSize: "11px", color: "#666", marginTop: "5px" }}>
//               {marker.position.lat.toFixed(4)}, {marker.position.lng.toFixed(4)}
//             </div>
//           </Popup>
//         </Marker>
//       ))}

//       {showForm && tempMarker && (
//         <Marker position={tempMarker} icon={defaultIcon}>
//           <Popup>
//             <div style={{ minWidth: "150px" }}>
//               <div style={{ marginBottom: "8px", fontWeight: "bold" }}>
//                 Add Label
//               </div>
//               <input
//                 type="text"
//                 placeholder="Enter location name"
//                 value={tempName}
//                 onChange={(e) => setTempName(e.target.value)}
//                 onKeyPress={(e) => {
//                   if (e.key === "Enter") {
//                     e.preventDefault();
//                     handleSave();
//                   }
//                 }}
//                 autoFocus
//                 style={{
//                   width: "100%",
//                   padding: "5px",
//                   marginBottom: "8px",
//                   border: "1px solid #ccc",
//                   borderRadius: "3px",
//                 }}
//               />
//               <div style={{ display: "flex", gap: "5px" }}>
//                 <button
//                   onClick={handleSave}
//                   style={{
//                     flex: 1,
//                     padding: "5px",
//                     backgroundColor: "#4CAF50",
//                     color: "white",
//                     border: "none",
//                     borderRadius: "3px",
//                     cursor: "pointer",
//                   }}
//                 >
//                   Save
//                 </button>
//                 <button
//                   onClick={handleCancel}
//                   style={{
//                     flex: 1,
//                     padding: "5px",
//                     backgroundColor: "#f44336",
//                     color: "white",
//                     border: "none",
//                     borderRadius: "3px",
//                     cursor: "pointer",
//                   }}
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </Popup>
//         </Marker>
//       )}
//     </MapContainer>
//   );
// }
