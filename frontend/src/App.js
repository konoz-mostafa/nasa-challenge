import "./App.css";

import WorldMap from "./components/WorldMap";
import WelcomePage from "./pages/welcome/WelcomePage";
import HomePage from "./pages/HomePage/HomePage";
import RegistrationLogin from "./pages/auth/RegistrationLogin";
import Home from "./pages/home/Home";
// import HUbbleExperience from "./pages/Hubble/Hubble";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/Explora" element={<WelcomePage />} />
        <Route path="/Explora/login" element={<RegistrationLogin />} />
        <Route path="/Explora/home" element={<HomePage />} />
        <Route path="/Explora/worldmap" element={<WorldMap />} />
      </Routes>
    </Router>
  );
}
export default App;

// import React, { useState } from "react";
// // Step 1: Import the necessary components from react-router-dom
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// import HomePage from "./pages/HomePage/HomePage";
// import GenericMapPage from "./components/WorldMap";
// import NasaWorldMap from "./components/NasaWorldMap";
// import MesseirMap from "./components/MesseirMap";

// /**
//  * Main App Component
//  * Handles routing between HomePage and different map views
//  */
// export default function AppWrapper() {
//   // We create a wrapper component to keep the router at the top level.
//   return (
//     // Step 2: Wrap everything in the Router component. This is "the car".
//     <Router>
//       <Routes>
//         {/* We tell the router to render our App component for all paths */}
//         <Route path="*" element={<App />} />
//       </Routes>
//     </Router>
//   );
// }

// function App() {
//   const [currentView, setCurrentView] = useState("home");

//   // Map configurations
//   const mapConfigs = {
//     worldview: {
//       title: "World View - NASA Satellite Imagery",
//       component: NasaWorldMap,
//       hasLayers: true,
//       hasDatePicker: true,
//       hasCompare: true,
//       hasLabels: true,
//       hasStories: true,
//       defaultBaseLayer: "MODIS_Terra_CorrectedReflectance_TrueColor",
//     },
//     messeir: {
//       title: "Messeir Regional Map",
//       component: MesseirMap,
//       hasLayers: false,
//       hasDatePicker: false,
//       hasCompare: false,
//       hasLabels: false,
//       hasStories: false,
//     },
//     future: {
//       title: "Future Map - Coming Soon",
//       component: () => (
//         <div
//           style={{
//             width: "100%",
//             height: "100%",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             flexDirection: "column",
//             background: "linear-gradient(135deg, #0a1128 0%, #001a33 100%)",
//             color: "white",
//             gap: "20px",
//           }}
//         >
//           <div style={{ fontSize: "4rem" }}>🚀</div>
//           <h2 style={{ margin: 0, color: "#00a9ff" }}>Future Map</h2>
//           <p style={{ color: "rgba(255, 255, 255, 0.7)" }}>
//             This map is coming soon!
//           </p>
//         </div>
//       ),
//       hasLayers: false,
//       hasDatePicker: false,
//       hasCompare: false,
//       hasLabels: false,
//       hasStories: false,
//     },
//   };

//   const handleSelectMap = (mapId) => {
//     setCurrentView(mapId);
//   };

//   const handleBackToHome = () => {
//     setCurrentView("home");
//   };

//   // Render HomePage
//   if (currentView === "home") {
//     // Now HomePage can use `useNavigate` because it's inside the Router context
//     return <HomePage onSelectMap={handleSelectMap} />;
//   }

//   // Render selected map
//   const config = mapConfigs[currentView];
//   if (!config) {
//     return <HomePage onSelectMap={handleSelectMap} />;
//   }

//   return (
//     <GenericMapPage
//       mapComponent={config.component}
//       mapConfig={config}
//       onBack={handleBackToHome}
//     />
//   );
// }
