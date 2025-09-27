import React, { useState } from "react";
import {
  FaLayerGroup,
  FaMapMarkerAlt,
  FaBookOpen,
  FaClone,
  FaCalendarAlt,
  FaTimes,
} from "react-icons/fa";
import "./Sidebar.css"; 

const Sidebar = ({ activeTool, setActiveTool, newLabelLocation, date, setDate }) => {
  const [hoveredIcon, setHoveredIcon] = useState(null);

  const tools = [
    {
      id: "layers",
      icon: <FaLayerGroup size={24} />,
      name: "Layers",
      magicSentence:
        "From here you can change the world's appearance and see it in new colors!",
    },
    {
      id: "label",
      icon: <FaMapMarkerAlt size={24} />,
      name: "Create Label",
      magicSentence: "Mark special places and create your own personal map!",
    },
    {
      id: "story",
      icon: <FaBookOpen size={24} />,
      name: "Create Story",
      magicSentence:
        "Tell amazing stories about Earth's wonders and mysteries!",
    },
    {
      id: "compare",
      icon: <FaClone size={24} />,
      name: "Compare",
      magicSentence:
        "See how our planet transforms over time with just a swipe!",
    },
    {
      id: "date",
      icon: <FaCalendarAlt size={24} />,
      name: "Select Date",
      magicSentence: "Pick a date to view the map for that day!",
    },
  ];

  const handleIconClick = (toolId) => {
    if (activeTool === toolId) {
      setActiveTool(null);
    } else {
      setActiveTool(toolId);
    }
  };

  return (
    <div className="sidebar-container">
      <nav className="sidebar-dock">
        {tools.map((tool) => (
          <div
            key={tool.id}
            className="icon-container"
            onMouseEnter={() => setHoveredIcon(tool.id)}
            onMouseLeave={() => setHoveredIcon(null)}
            onClick={() => handleIconClick(tool.id)}
          >
            <div
              className={`sidebar-icon ${
                activeTool === tool.id ? "active" : ""
              }`}
            >
              {tool.icon}
            </div>

            {hoveredIcon === tool.id && activeTool !== tool.id && (
              <div className="magic-card">
                <p className="magic-sentence">{tool.magicSentence}</p>
                <span className="tool-name">{tool.name}</span>
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Smart Drawer */}
      {activeTool && (
        <div className="smart-drawer">
          <div className="drawer-content">
            {activeTool === "layers" && <LayersTool />}
            {activeTool === "label" && (
              <LabelTool newLabelLocation={newLabelLocation} />
            )}
            {activeTool === "story" && <StoryTool />}
            {activeTool === "compare" && <CompareTool />}
            {activeTool === "date" && (
              <DateTool date={date} setDate={setDate} />
            )}
          </div>
          <button className="close-drawer" onClick={() => setActiveTool(null)}>
            <FaTimes />
          </button>
        </div>
      )}
    </div>
  );
};

// // داخل Sidebar
// const LayersTool = () => {
//   const [activeLayers, setActiveLayers] = useState({
//     "True Color (Day)": true,
//     "Night Lights (2012)": false,
//     "Fires and Thermal Anomalies": false,
//     "Aerosol/Haze": false,
//     "Soil Moisture": false,
//   });

//   const toggleLayer = (layer) => {
//     setActiveLayers((prev) => ({
//       ...prev,
//       [layer]: !prev[layer],
//     }));
//   };

//   return (
//     <div className="tool-interface">
//       <h3>Map Layers</h3>
//       <div className="layer-list">
//         {Object.keys(activeLayers).map((layer) => (
//           <label key={layer} className="layer-item">
//             <input
//               type="checkbox"
//               checked={activeLayers[layer]}
//               onChange={() => toggleLayer(layer)}
//             />
//             {layer}
//           </label>
//         ))}
//       </div>
//     </div>
//   );
// };
// Tool Components
const LayersTool = () => (
  <div className="tool-interface">
    <h3>Map Layers</h3>
    <div className="layer-cards">
      {["Temperature", "Vegetation", "Precipitation", "Elevation"].map(
        (layer) => (
          <div key={layer} className="layer-card">
            <div className="layer-icon">🌡️</div>
            <span>{layer}</span>
          </div>
        )
      )}
    </div>
  </div>
);

const LabelTool = ({ newLabelLocation }) => {
  const [labelName, setLabelName] = useState("");
  const [visibility, setVisibility] = useState("private");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!newLabelLocation) {
      alert("Please click on the map to set a label location!");
      return;
    }

    const labelData = {
      name: labelName,
      location: newLabelLocation,
      visibility: visibility,
    };

    console.log("Sending to backend:", labelData);

    fetch("http://localhost:5000/api/labels", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(labelData),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Response from backend:", data);
      })
      .catch((err) => console.error("Error:", err));
  };

  return (
    <div className="tool-interface">
      <h3>Create a Label</h3>
      <div className="label-preview">
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "10px" }}
        >
          <input
            type="text"
            placeholder="Enter label name"
            value={labelName}
            onChange={(e) => setLabelName(e.target.value)}
            style={{
              padding: "6px 10px",
              borderRadius: "6px",
              border: "1px solid rgba(0,169,255,0.3)",
              background: "rgba(0,0,0,0.1)",
              color: "white",
            }}
          />
          <select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
            style={{
              padding: "6px 10px",
              borderRadius: "6px",
              border: "1px solid rgba(0,169,255,0.3)",
              background: "rgba(0,0,0,0.1)",
              color: "white",
            }}
          >
            <option value="private">Only me</option>
            <option value="public">Everyone</option>
            <option value="none">none</option>
          </select>
          <button
            type="submit"
            style={{
              padding: "8px 12px",
              borderRadius: "6px",
              border: "none",
              background: "linear-gradient(to right, #1e3a8a, #581c87)",
              color: "white",
              cursor: "pointer",
              fontWeight: "bold",
              transition: "0.3s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.opacity = 0.8)}
            onMouseOut={(e) => (e.currentTarget.style.opacity = 1)}
          >
            Save Label
          </button>
        </form>

        {newLabelLocation && (
          <p>
            Selected Location: {newLabelLocation.lat.toFixed(3)},{" "}
            {newLabelLocation.lng.toFixed(3)}
          </p>
        )}
      </div>
    </div>
  );
};

const StoryTool = () => (
  <div className="tool-interface">
    <h3>Create a Story</h3>
    <p>Select a location to start your NASA story</p>
    <div className="story-examples">
      <div className="story-sample">
        <div className="story-image"></div>
        <span>Climate Change</span>
      </div>
      <div className="story-sample">
        <div className="story-image"></div>
        <span>Urban Growth</span>
      </div>
    </div>
  </div>
);

const CompareTool = () => (
  <div className="tool-interface">
    <h3>Compare Timelines</h3>
    <p>Select two different dates to compare</p>
  </div>
);

const DateTool = ({ date, setDate }) => (
  <div className="tool-interface">
    <h3>Select Date</h3>
    <input
      type="date"
      value={date}
      onChange={(e) => setDate(e.target.value)}
      style={{
        padding: "6px 10px",
        borderRadius: "6px",
        border: "1px solid rgba(0,169,255,0.3)",
        background: "rgba(0,0,0,0.1)",
        color: "white",
      }}
    />
  </div>
);

export default Sidebar;



// import React, { useState } from "react";
// import {
//   FaLayerGroup,
//   FaMapMarkerAlt,
//   FaBookOpen,
//   FaClone,
//   FaTimes,
// } from "react-icons/fa";
// import "./Sidebar.css"; 

// const Sidebar = ({ activeTool, setActiveTool, newLabelLocation }) => {
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
//   ];

//   const handleIconClick = (toolId) => {
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

//       {/* Smart Drawer that appears when a tool is active */}
//       {activeTool && (
//         <div className="smart-drawer">
//           <div className="drawer-content">
//             {activeTool === "layers" && <LayersTool />}
//             {activeTool === "label" && (
//               <LabelTool newLabelLocation={newLabelLocation} />
//             )}
//             {activeTool === "story" && <StoryTool />}
//             {activeTool === "compare" && <CompareTool />}
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
//       <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
//   <input
//     type="text"
//     placeholder="Enter label name"
//     value={labelName}
//     onChange={(e) => setLabelName(e.target.value)}
//     style={{
//       padding: "6px 10px",
//       borderRadius: "6px",
//       border: "1px solid rgba(0,169,255,0.3)",
//       background: "rgba(0,0,0,0.1)",
//       color: "white",
//     }}
//   />
//   <select
//     value={visibility}
//     onChange={(e) => setVisibility(e.target.value)}
//     style={{
//       padding: "6px 10px",
//       borderRadius: "6px",
//       border: "1px solid rgba(0,169,255,0.3)",
//       background: "rgba(0,0,0,0.1)",
//       color: "white",
//     }}
//   >
//     <option value="private">Only me</option>
//     <option value="public">Everyone</option>
//     <option value="none">none</option>
//   </select>
//   <button
//     type="submit"
//     style={{
//       padding: "8px 12px",
//       borderRadius: "6px",
//       border: "none",
//       background: "linear-gradient(to right, #1e3a8a, #581c87)",
//       color: "white",
//       cursor: "pointer",
//       fontWeight: "bold",
//       transition: "0.3s",
//     }}
//     onMouseOver={(e) => (e.currentTarget.style.opacity = 0.8)}
//     onMouseOut={(e) => (e.currentTarget.style.opacity = 1)}
//   >
//     Save Label
//   </button>
// </form>

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

// export default Sidebar;
