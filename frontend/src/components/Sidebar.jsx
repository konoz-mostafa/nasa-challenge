

import React, { useState } from "react";
import {
  FaLayerGroup,
  FaMapMarkerAlt,
  FaBookOpen,
  FaClone,
  FaTimes,
} from "react-icons/fa";
import "./Sidebar.css"; // Import the CSS file

const Sidebar = ({ activeTool, setActiveTool, newLabelLocation }) => {
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

      {/* Smart Drawer that appears when a tool is active */}
      {activeTool && (
        <div className="smart-drawer">
          <div className="drawer-content">
            {activeTool === "layers" && <LayersTool />}
            {activeTool === "label" && (
              <LabelTool newLabelLocation={newLabelLocation} />
            )}
            {activeTool === "story" && <StoryTool />}
            {activeTool === "compare" && <CompareTool />}
          </div>
          <button className="close-drawer" onClick={() => setActiveTool(null)}>
            <FaTimes />
          </button>
        </div>
      )}
    </div>
  );
};

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

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!newLabelLocation) {
      alert("Please click on the map to set a label location!");
      return;
    }

    const labelData = {
      name: labelName,
      location: newLabelLocation,
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
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter label name"
            value={labelName}
            onChange={(e) => setLabelName(e.target.value)}
          />
          <button className="submit" type="submit">
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
    <div className="timeline-selector">
      <div className="date-selector">
        <label>From</label>
        <input type="date" />
      </div>
      <div className="date-selector">
        <label>To</label>
        <input type="date" />
      </div>
    </div>
  </div>
);

export default Sidebar;
