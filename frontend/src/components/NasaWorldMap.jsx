import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  LayersControl,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import CustomZoom from "./CustomZoom"; // Import the new component

// Helper function to build the NASA layer URL
const GIBS_URL = (layerId, matrixSet, date) =>
  `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/${layerId}/default/${date}/${matrixSet}/{z}/{y}/{x}.jpg`;

// Curated list of layers
const CURATED_LAYERS = [
  {
    id: "MODIS_Terra_CorrectedReflectance_TrueColor",
    title: "True Color (Day)",
    matrixSet: "GoogleMapsCompatible_Level9",
  },
  {
    id: "VIIRS_CityLights_2012",
    title: "Night Lights (2012)",
    matrixSet: "GoogleMapsCompatible_Level8",
  },
  {
    id: "MODIS_Terra_Thermal_Anomalies_Day",
    title: "Fires and Thermal Anomalies",
    matrixSet: "GoogleMapsCompatible_Level9",
  },
  {
    id: "MODIS_Aqua_Aerosol",
    title: "Aerosol/Haze",
    matrixSet: "GoogleMapsCompatible_Level9",
  },
  {
    id: "SMAP_L3_Active_Passive_Soil_Moisture",
    title: "Soil Moisture",
    matrixSet: "GoogleMapsCompatible_Level6",
  },
];

// Default marker icon
const defaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [0, -35],
});

export default function NasaWorldMap({ date, onMapClick }) {
  const [label, setLabel] = useState(null);
  const [tempName, setTempName] = useState("");
  const [showForm, setShowForm] = useState(false);

  const worldBounds = [
    [-90, -180], // Southwest
    [90, 180], // Northeast
  ];
  const baseLayer = CURATED_LAYERS.find(
    (l) => l.id === "MODIS_Terra_CorrectedReflectance_TrueColor"
  );
  const overlayLayers = CURATED_LAYERS.filter(
    (l) => l.id !== "MODIS_Terra_CorrectedReflectance_TrueColor"
  );

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
    });
  };
  

  return (
    <MapContainer
      center={[0, 0]}
      zoom={2}
      style={{ height: "100vh", width: "100%" }}
      maxBounds={worldBounds}
      maxBoundsViscosity={1.0}
      zoomControl={false} // Disable the default zoom control
    >
      <LayersControl position="topright">
        {/* Base Layer (The main map) */}
        {baseLayer && (
          <LayersControl.BaseLayer checked name={baseLayer.title}>
            <TileLayer
              key={date}
              url={GIBS_URL(baseLayer.id, baseLayer.matrixSet, date)}
              attribution="NASA Worldview / GIBS"
              noWrap={true}
            />
          </LayersControl.BaseLayer>
        )}

        {/* Overlay Layers (Can be toggled on/off) */}
        {overlayLayers.map((layer) => (
          <LayersControl.Overlay key={layer.id} name={layer.title}>
            <TileLayer
              key={`${layer.id}-${date}`}
              url={GIBS_URL(layer.id, layer.matrixSet, date)}
              attribution="NASA Worldview / GIBS"
              noWrap={true}
            />
          </LayersControl.Overlay>
        ))}
      </LayersControl>

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
                />
                <button type="submit">Save</button>
              </form>
            ) : (
              <b>{label.name}</b>
            )}
          </Popup>
        </Marker>
      )}

      {/* Add your custom zoom control here */}
      <CustomZoom />
    </MapContainer>
  );
}

// // // // // --- NEW ---
// // // // import React from "react";
// // // // import { MapContainer, TileLayer, LayersControl, useMap } from "react-leaflet";
// // // // import "leaflet/dist/leaflet.css";

// // // // // This function builds the correct URL for a NASA GIBS layer
// // // // const GIBS_URL = (layerId, matrixSet, date) =>
// // // //   `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/${layerId}/default/${date}/${matrixSet}/{z}/{y}/{x}.jpg`;

// // // // // A curated list of high-quality, useful layers. This avoids slow loading.
// // // // const CURATED_LAYERS = [
// // // //   {
// // // //     id: "MODIS_Terra_CorrectedReflectance_TrueColor",
// // // //     title: "True Color (Day)",
// // // //     // --- THIS WAS THE FIX ---
// // // //     // The matrixSet for this layer must be Level9, not Level8.
// // // //     matrixSet: "GoogleMapsCompatible_Level9",
// // // //   },
// // // //   {
// // // //     id: "VIIRS_CityLights_2012",
// // // //     title: "Night Lights (2012)",
// // // //     matrixSet: "GoogleMapsCompatible_Level8",
// // // //   },
// // // //   {
// // // //     id: "MODIS_Terra_Thermal_Anomalies_Day",
// // // //     title: "Fires and Thermal Anomalies",
// // // //     matrixSet: "GoogleMapsCompatible_Level9",
// // // //   },
// // // //   {
// // // //     id: "MODIS_Aqua_Aerosol",
// // // //     title: "Aerosol/Haze",
// // // //     matrixSet: "GoogleMapsCompatible_Level9",
// // // //   },
// // // //   {
// // // //     id: "SMAP_L3_Active_Passive_Soil_Moisture",
// // // //     title: "Soil Moisture",
// // // //     matrixSet: "GoogleMapsCompatible_Level6",
// // // //   },
// // // // ];

// // // // // A helper component to handle map click events
// // // // function MapEvents({ onMapClick }) {
// // // //   useMap({
// // // //     click(e) {
// // // //       if (onMapClick) {
// // // //         onMapClick(e);
// // // //       }
// // // //     },
// // // //   });
// // // //   return null;
// // // // }

// // // // export default function NasaWorldMap({ date, onMapClick }) {
// // // //   const worldBounds = [
// // // //     [-90, -180], // Southwest
// // // //     [90, 180], // Northeast
// // // //   ];

// // // //   // Separate the base layer from the overlays
// // // //   const baseLayer = CURATED_LAYERS.find(
// // // //     (l) => l.id === "MODIS_Terra_CorrectedReflectance_TrueColor"
// // // //   );
// // // //   const overlayLayers = CURATED_LAYERS.filter(
// // // //     (l) => l.id !== "MODIS_Terra_CorrectedReflectance_TrueColor"
// // // //   );

// // // //   return (
// // // //     <MapContainer
// // // //       center={[0, 0]}
// // // //       zoom={2}
// // // //       // Use "100vh" to ensure the map container has a valid height
// // // //       style={{ height: "100vh", width: "100%" }}
// // // //       maxBounds={worldBounds}
// // // //       maxBoundsViscosity={1.0}
// // // //     >
// // // //       <LayersControl position="topright">
// // // //         {/* Base Layer (The main map) */}
// // // //         {baseLayer && (
// // // //           <LayersControl.BaseLayer checked name={baseLayer.title}>
// // // //             <TileLayer
// // // //               url={GIBS_URL(baseLayer.id, baseLayer.matrixSet, date)}
// // // //               attribution="NASA Worldview / GIBS"
// // // //               noWrap={true}
// // // //             />
// // // //           </LayersControl.BaseLayer>
// // // //         )}

// // // //         {/* Overlay Layers (Can be toggled on/off) */}
// // // //         {overlayLayers.map((layer) => (
// // // //           <LayersControl.Overlay key={layer.id} name={layer.title}>
// // // //             <TileLayer
// // // //               url={GIBS_URL(layer.id, layer.matrixSet, date)}
// // // //               attribution="NASA Worldview / GIBS"
// // // //               noWrap={true}
// // // //             />
// // // //           </LayersControl.Overlay>
// // // //         ))}
// // // //       </LayersControl>

// // // //       <MapEvents onMapClick={onMapClick} />
// // // //     </MapContainer>
// // // //   );
// // // // }

// // import React, { useState } from "react";
// // import {
// //   MapContainer,
// //   TileLayer,
// //   LayersControl,
// //   Marker,
// //   Popup,
// //   useMapEvents,
// // } from "react-leaflet";
// // import L from "leaflet";
// // import "leaflet/dist/leaflet.css";

// // // Helper function from Version 2 to build the NASA layer URL
// // const GIBS_URL = (layerId, matrixSet, date) =>
// //   `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/${layerId}/default/${date}/${matrixSet}/{z}/{y}/{x}.jpg`;

// // // Curated list of layers from Version 2
// // const CURATED_LAYERS = [
// //   {
// //     id: "MODIS_Terra_CorrectedReflectance_TrueColor",
// //     title: "True Color (Day)",
// //     matrixSet: "GoogleMapsCompatible_Level9",
// //   },
// //   {
// //     id: "VIIRS_CityLights_2012",
// //     title: "Night Lights (2012)",
// //     matrixSet: "GoogleMapsCompatible_Level8",
// //   },
// //   {
// //     id: "MODIS_Terra_Thermal_Anomalies_Day",
// //     title: "Fires and Thermal Anomalies",
// //     matrixSet: "GoogleMapsCompatible_Level9",
// //   },
// //   {
// //     id: "MODIS_Aqua_Aerosol",
// //     title: "Aerosol/Haze",
// //     matrixSet: "GoogleMapsCompatible_Level9",
// //   },
// //   {
// //     id: "SMAP_L3_Active_Passive_Soil_Moisture",
// //     title: "Soil Moisture",
// //     matrixSet: "GoogleMapsCompatible_Level6",
// //   },
// // ];

// // // Default marker icon from Version 1
// // const defaultIcon = new L.Icon({
// //   iconUrl: "https://unpkg.com/leaflet@1.7/dist/images/marker-icon.png",
// //   iconSize: [25, 41],
// //   iconAnchor: [12, 41],
// //   popupAnchor: [0, -35],
// // });

// // export default function NasaWorldMap({ date, onMapClick }) {
// //   // --- State management for the marker, from Version 1 ---
// //   const [label, setLabel] = useState(null); // Stores the single marker
// //   const [tempName, setTempName] = useState(""); // Temporary name for the input field
// //   const [showForm, setShowForm] = useState(false); // Controls showing the input form

// //   // --- Map settings from Version 2 ---
// //   const worldBounds = [
// //     [-90, -180], // Southwest
// //     [90, 180], // Northeast
// //   ];
// //   const baseLayer = CURATED_LAYERS.find(
// //     (l) => l.id === "MODIS_Terra_CorrectedReflectance_TrueColor"
// //   );
// //   const overlayLayers = CURATED_LAYERS.filter(
// //     (l) => l.id !== "MODIS_Terra_CorrectedReflectance_TrueColor"
// //   );

// //   // --- Click handler logic from Version 1, adapted for the new structure ---
// //   const MapClickHandler = () => {
// //     useMapEvents({
// //       click(e) {
// //         // This is the function passed from the parent component
// //         if (onMapClick) {
// //           onMapClick(e);
// //         }
// //         // This is the logic to create a new marker from Version 1
// //         setLabel({ position: e.latlng, name: "" });
// //         setTempName("");
// //         setShowForm(true);
// //       },
// //     });
// //     return null;
// //   };

// //   // --- Form submission handler from Version 1 ---
// //   const handleLabelSubmit = (e) => {
// //     e.preventDefault();
// //     if (!tempName.trim()) return;

// //     // Update the marker's name
// //     const newLabel = { ...label, name: tempName };
// //     setLabel(newLabel);
// //     setShowForm(false); // Hide the form and show the name

// //     // Send data to the backend API
// //     fetch("http://localhost:5000/api/labels", {
// //       method: "POST",
// //       headers: { "Content-Type": "application/json" },
// //       body: JSON.stringify(newLabel),
// //     });
// //   };

// //   return (
// //     <MapContainer
// //       center={[0, 0]}
// //       zoom={2}
// //       style={{ height: "100vh", width: "100%" }}
// //       maxBounds={worldBounds}
// //       maxBoundsViscosity={1.0}
// //     >
// //       {/* --- Layers control from Version 2 --- */}
// //       <LayersControl position="topright">
// //         {/* Base Layer (The main map) */}
// //         {baseLayer && (
// //           <LayersControl.BaseLayer checked name={baseLayer.title}>
// //             <TileLayer
// //               url={GIBS_URL(baseLayer.id, baseLayer.matrixSet, date)}
// //               attribution="NASA Worldview / GIBS"
// //               noWrap={true}
// //             />
// //           </LayersControl.BaseLayer>
// //         )}

// //         {/* Overlay Layers (Can be toggled on/off) */}
// //         {overlayLayers.map((layer) => (
// //           <LayersControl.Overlay key={layer.id} name={layer.title}>
// //             <TileLayer
// //               url={GIBS_URL(layer.id, layer.matrixSet, date)}
// //               attribution="NASA Worldview / GIBS"
// //               noWrap={true}
// //             />
// //           </LayersControl.Overlay>
// //         ))}
// //       </LayersControl>

// //       {/* --- Click handler from Version 1 --- */}
// //       <MapClickHandler />

// //       {/* --- Marker and Popup display logic from Version 1 --- */}
// //       {label && (
// //         <Marker position={label.position} icon={defaultIcon}>
// //           <Popup>
// //             {showForm ? (
// //               <form onSubmit={handleLabelSubmit}>
// //                 <input
// //                   type="text"
// //                   placeholder="Enter label name"
// //                   value={tempName}
// //                   onChange={(e) => setTempName(e.target.value)}
// //                   autoFocus // Automatically focus the input field
// //                 />
// //                 <button type="submit">Save</button>
// //               </form>
// //             ) : (
// //               <b>{label.name}</b>
// //             )}
// //           </Popup>
// //         </Marker>
// //       )}
// //     </MapContainer>
// //   );
// // }
