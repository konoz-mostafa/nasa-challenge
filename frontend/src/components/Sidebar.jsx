import React, { useState } from "react";
import {
  FaLayerGroup,
  FaMapMarkerAlt,
  FaBookOpen,
  FaClone,
  FaCalendarAlt,
  FaTimes,
  FaGamepad,
} from "react-icons/fa";
import { UserCircle } from "lucide-react";
import { layerCategories, getLayersByCategory } from "./layers";
import "./Sidebar.css";

const Sidebar = ({
  activeTool,
  setActiveTool,
  newLabelLocation,
  date,
  setDate,
  setShowProfile,
  activeBaseLayer,
  setActiveBaseLayer,
  activeOverlays,
  setActiveOverlays,
  onGameClick, // Add this prop
}) => {
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
    {
      id: "game",
      icon: <FaGamepad size={24} />,
      name: "Geography Game",
      magicSentence:
        "Test your knowledge! Can you identify locations from space?",
    },
    {
      id: "profile",
      icon: <UserCircle size={24} />,
      name: "Profile",
      magicSentence:
        "View your profile info and check your points, levels, and badges!",
    },
  ];

  const handleIconClick = (toolId) => {
    if (toolId === "profile") {
      setShowProfile(true);
      return;
    }

    if (toolId === "game") {
      onGameClick(); // Trigger game mode
      return;
    }

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
              } ${tool.id === "game" ? "game-icon" : ""}`}
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
      {activeTool && activeTool !== "game" && (
        <div className="smart-drawer">
          <div className="drawer-content">
            {activeTool === "layers" && (
              <LayersTool
                activeBaseLayer={activeBaseLayer}
                setActiveBaseLayer={setActiveBaseLayer}
                activeOverlays={activeOverlays}
                setActiveOverlays={setActiveOverlays}
              />
            )}
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

// LAYERS TOOL COMPONENT
const LayersTool = ({
  activeBaseLayer,
  setActiveBaseLayer,
  activeOverlays,
  setActiveOverlays,
}) => {
  const layersByCategory = getLayersByCategory();
  const baseLayers = layerCategories.filter((l) => l.type === "base");

  const toggleOverlay = (layerId) => {
    if (activeOverlays.includes(layerId)) {
      setActiveOverlays(activeOverlays.filter((id) => id !== layerId));
    } else {
      setActiveOverlays([...activeOverlays, layerId]);
    }
  };

  return (
    <div
      className="tool-interface"
      style={{ maxHeight: "70vh", overflowY: "auto" }}
    >
      <h3 style={{ marginBottom: "15px", color: "#00a9ff" }}>Map Layers</h3>

      {/* Base Layers Section */}
      <div style={{ marginBottom: "20px" }}>
        <h4
          style={{
            fontSize: "14px",
            color: "#888",
            marginBottom: "10px",
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          Base Map
        </h4>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {baseLayers.map((layer) => (
            <div
              key={layer.id}
              onClick={() => setActiveBaseLayer(layer.id)}
              style={{
                padding: "12px",
                borderRadius: "8px",
                background:
                  activeBaseLayer === layer.id
                    ? "linear-gradient(135deg, rgba(0,169,255,0.3), rgba(88,28,135,0.3))"
                    : "rgba(0,0,0,0.2)",
                border:
                  activeBaseLayer === layer.id
                    ? "2px solid #00a9ff"
                    : "2px solid rgba(255,255,255,0.1)",
                cursor: "pointer",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span style={{ fontSize: "24px" }}>{layer.icon}</span>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontWeight: "bold",
                    fontSize: "14px",
                    color: "white",
                  }}
                >
                  {layer.title}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "#aaa",
                    marginTop: "2px",
                  }}
                >
                  {layer.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Overlay Layers by Category */}
      {Object.entries(layersByCategory).map(([category, layers]) => {
        const categoryLayers = layers.filter((l) => l.type === "overlay");
        if (categoryLayers.length === 0) return null;

        return (
          <div key={category} style={{ marginBottom: "20px" }}>
            <h4
              style={{
                fontSize: "14px",
                color: "#888",
                marginBottom: "10px",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              {category}
            </h4>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              {categoryLayers.map((layer) => {
                const isActive = activeOverlays.includes(layer.id);
                return (
                  <div
                    key={layer.id}
                    onClick={() => toggleOverlay(layer.id)}
                    style={{
                      padding: "12px",
                      borderRadius: "8px",
                      background: isActive
                        ? "linear-gradient(135deg, rgba(0,169,255,0.3), rgba(88,28,135,0.3))"
                        : "rgba(0,0,0,0.2)",
                      border: isActive
                        ? "2px solid #00a9ff"
                        : "2px solid rgba(255,255,255,0.1)",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      opacity: isActive ? 1 : 0.7,
                    }}
                  >
                    <span style={{ fontSize: "24px" }}>{layer.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontWeight: "bold",
                          fontSize: "14px",
                          color: "white",
                        }}
                      >
                        {layer.title}
                      </div>
                      <div
                        style={{
                          fontSize: "11px",
                          color: "#aaa",
                          marginTop: "2px",
                        }}
                      >
                        {layer.description}
                      </div>
                    </div>
                    {isActive && (
                      <div
                        style={{
                          width: "20px",
                          height: "20px",
                          borderRadius: "50%",
                          background: "#00a9ff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontSize: "12px",
                          fontWeight: "bold",
                        }}
                      >
                        ✓
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Info box */}
      <div
        style={{
          marginTop: "20px",
          padding: "12px",
          background: "rgba(0,169,255,0.1)",
          borderRadius: "8px",
          border: "1px solid rgba(0,169,255,0.3)",
          fontSize: "12px",
          color: "#aaa",
        }}
      >
        💡 <strong>Tip:</strong> You can activate multiple overlay layers at
        once to combine different data views!
      </div>
    </div>
  );
};

// Other tool components remain the same
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

    fetch("http://localhost:5000/api/labels", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(labelData),
    })
      .then((res) => res.json())
      .then((data) => console.log("Response from backend:", data))
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
