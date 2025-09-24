// // src/components/NasaWorldMap.jsx
// // CORRECTED CODE

import NasaWorldMap from "./NasaWorldMap";

// import React from "react";
// import { MapContainer, TileLayer, LayersControl, useMap } from "react-leaflet";
// import "leaflet/dist/leaflet.css";

// // Function to build GIBS URL
// const GIBS_URL = (layer, date) =>
//   `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/${layer}/default/${date}/GoogleMapsCompatible_Level8/{z}/{y}/{x}.jpg`;

// // Define some layers from NASA GIBS
// const LAYERS = {
//   trueColor: "MODIS_Terra_CorrectedReflectance_TrueColor",
//   nightLights: "VIIRS_CityLights_2012",
//   fires: "MODIS_Terra_Thermal_Anomalies_Day",
// };

// // A helper component to handle map events
// function MapEvents({ onMapClick }) {
//   useMap({
//     click(e) {
//       onMapClick(e);
//     },
//   });
//   return null;
// }

// export default function NasaWorldMap({ date, onMapClick }) {
//   // Define the world bounds to prevent panning into empty space
//   const worldBounds = [
//     [-90, -180], // Southwest corner
//     [90, 180], // Northeast corner
//   ];

//   return (
//     <MapContainer
//       center={[0, 0]}
//       zoom={2}
//       // maxZoom={8}
//       style={{ height: "100%", width: "100%" }}
//       maxBounds={worldBounds} // Bonus: Prevents panning beyond the world map
//       maxBoundsViscosity={1.0} // Makes the bounds feel solid
//     >
//       <LayersControl position="topright">
//         {/* Base Layer: True Color */}
//         <LayersControl.BaseLayer checked name="True Color">
//           <TileLayer
//             url={GIBS_URL(LAYERS.trueColor, date)}
//             attribution="NASA Worldview / GIBS"
//             noWrap={true} // <-- FIX: Add this line
//           />
//         </LayersControl.BaseLayer>

//         {/* Overlay: Night Lights */}
//         <LayersControl.Overlay name="Night Lights">
//           <TileLayer
//             url={GIBS_URL(LAYERS.nightLights, date)}
//             attribution="NASA Worldview / GIBS"
//             noWrap={true} // <-- FIX: Add this line
//           />
//         </LayersControl.Overlay>

//         {/* Overlay: Fires */}
//         <LayersControl.Overlay name="Fires">
//           <TileLayer
//             url={GIBS_URL(LAYERS.fires, date)}
//             attribution="NASA Worldview / GIBS"
//             noWrap={true} // <-- FIX: Add this line
//           />
//         </LayersControl.Overlay>
//       </LayersControl>

//       {/* Add the event handler component */}
//       <MapEvents onMapClick={onMapClick} />
//     </MapContainer>
//   );
//
// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// NasaWorldMap
//◘ // alll alll layers but still not working---------------------------------------------------------------------------------------
// this work and appear the map of the ture color and apper all layers but when i cleck on any layer like nightlight , it doesn't appear it (sill appear ture color map)
// it take alooonng time to uploading the website
// import React, { useState, useEffect } from "react";
// import { MapContainer, TileLayer, LayersControl, useMap } from "react-leaflet";
// import "leaflet/dist/leaflet.css";

// // This function now takes the layer's specific "matrixSet" (which defines its max zoom level)
// const GIBS_URL = (layerId, matrixSet, date) =>
//   `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/${layerId}/default/${date}/${matrixSet}/{z}/{y}/{x}.jpg`;

// // Default base layer identifier
// const DEFAULT_BASE_LAYER_ID = "MODIS_Terra_CorrectedReflectance_TrueColor";

// // A helper component to handle map events (unchanged)
// function MapEvents({ onMapClick }) {
//   useMap({
//     click(e) {
//       onMapClick(e);
//     },
//   });
//   return null;
// }

// export default function NasaWorldMap({ date, onMapClick }) {
//   // State to hold the layers fetched from NASA's service
//   const [layers, setLayers] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   // useEffect hook to fetch and parse layer data when the component mounts
//   useEffect(() => {
//     const fetchNasaLayers = async () => {
//       setIsLoading(true); // Set loading to true when starting fetch
//       try {
//         const response = await fetch(
//           "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/wmts.cgi?SERVICE=WMTS&request=GetCapabilities"
//         );
//         const xmlText = await response.text();
//         const parser = new DOMParser();
//         const xmlDoc = parser.parseFromString(xmlText, "application/xml");
//         const layerNodes = xmlDoc.querySelectorAll("Contents > Layer");

//         const availableLayers = Array.from(layerNodes)
//           .map((layerNode) => {
//             const identifier = layerNode.querySelector("Identifier")?.textContent;
//             const title = layerNode.querySelector("Title")?.textContent;
//             const matrixSet = layerNode.querySelector("TileMatrixSetLink > TileMatrixSet")?.textContent;

//             if (identifier && title && matrixSet?.startsWith("GoogleMapsCompatible")) {
//               return { id: identifier, title, matrixSet };
//             }
//             return null;
//           })
//           .filter(Boolean);

//         setLayers(availableLayers);
//       } catch (error) {
//         console.error("Failed to fetch or parse NASA GIBS layers:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchNasaLayers();
//   }, []); // The empty array [] means this effect runs only once on mount

//   // Define the world bounds (unchanged)
//   const worldBounds = [
//     [-90, -180], // Southwest
//     [90, 180],  // Northeast
//   ];

//   // Separate the base layer from the overlays
//   const baseLayer = layers.find(l => l.id === DEFAULT_BASE_LAYER_ID);
//   const overlayLayers = layers.filter(l => l.id !== DEFAULT_BASE_LAYER_ID);

//   return (
//     <MapContainer
//       center={[0, 0]}
//       zoom={2}
//       style={{ height: "100%", width: "100%" }}
//       maxBounds={worldBounds}
//       maxBoundsViscosity={1.0}
//     >
//       {isLoading ? (
//         // Optional: Show a loading indicator while layers are being fetched
//         <div style={{ position: 'absolute', top: '50%', left: '50%', zIndex: 1000, background: 'white', padding: '10px', transform: 'translate(-50%, -50%)' }}>
//           Loading NASA Layers...
//         </div>
//       ) : (
//         baseLayer && (
//           // --- FIX APPLIED HERE ---
//           // Add a `key` to LayersControl to force re-mounting when layers are loaded.
//           // This ensures the control correctly registers all its dynamic children.
//           <LayersControl position="topright" key={overlayLayers.length}>
//             <LayersControl.BaseLayer checked name={baseLayer.title}>
//               <TileLayer
//                 url={GIBS_URL(baseLayer.id, baseLayer.matrixSet, date)}
//                 attribution="NASA Worldview / GIBS"
//                 noWrap={true}
//               />
//             </LayersControl.BaseLayer>

//             {overlayLayers.map((layer) => (
//               <LayersControl.Overlay key={layer.id} name={layer.title}>
//                 <TileLayer
//                   url={GIBS_URL(layer.id, layer.matrixSet, date)}
//                   attribution="NASA Worldview / GIBS"
//                   noWrap={true}
//                 />
//               </LayersControl.Overlay>
//             ))}
//           </LayersControl>
//         )
//       )}

//       {/* Add the event handler component (unchanged) */}
//       <MapEvents onMapClick={onMapClick} />
//     </MapContainer>
//   );
// }

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

// أيقونة افتراضية صغيرة
const defaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [0, -35],
});

const NasaWorldMap = ({ date, onMapClick }) => {
  const [label, setLabel] = useState(null); // هيخزن ماركر واحد فقط
  const [tempName, setTempName] = useState(""); // اسم مؤقت قبل الحفظ
  const [showForm, setShowForm] = useState(false);

  // عشان تمسك الكليكات على الخريطة
  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        onMapClick(e);
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

    // إرسال للباك إند
    fetch("http://localhost:5000/api/labels", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newLabel),
    });
  };

  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      style={{ width: "100%", height: "100%" }}
    >
      <TileLayer
        url={`https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_SNPP_CorrectedReflectance_TrueColor/default/${date}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg`}
      />
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
                />
                <button type="submit">Save</button>
              </form>
            ) : (
              <b>{label.name}</b>
            )}
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default NasaWorldMap;
