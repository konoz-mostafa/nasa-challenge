// // src/components/Sidebar.jsx
// import React, { useState } from "react";
// import { FaTimes } from "react-icons/fa";
// import "../../components/Sidebar.css";

// // The Sidebar is now a flexible component.
// // It receives the tools to display and the content for the drawer as props.
// const Sidebar = ({ tools, children }) => {
//   const [activeTool, setActiveTool] = useState(null);
//   const [hoveredIcon, setHoveredIcon] = useState(null);

//   const handleIconClick = (toolId) => {
//     // Toggle the drawer open/closed
//     setActiveTool(activeTool === toolId ? null : toolId);
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

//       {/* The smart drawer's content is now passed from the parent */}
//       {activeTool && (
//         <div className="smart-drawer">
//           <div className="drawer-content">
//             {/* Render the specific tool UI passed as a child */}
//             {React.cloneElement(children, { activeTool })}
//           </div>
//           <button className="close-drawer" onClick={() => setActiveTool(null)}>
//             <FaTimes />
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Sidebar;

// src/components/Sidebar.jsx
import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import "../../components/Sidebar.css";
import "./ImageSelection.css"; // Assuming styles are in this file

// -- Tool Component Definitions --
// All tool UIs are now defined inside the Sidebar file as they are closely related.

const ImageSelectionTool = ({ images, onSelectImage, activeImageDzi }) => (
  <div className="tool-interface">
    <h3>Hubble's Gallery</h3>
    <p>Select an image to explore.</p>
    <div className="image-list">
      {images.map((image) => (
        <div
          key={image.id}
          className={`image-item ${
            activeImageDzi === image.dziPath ? "active" : ""
          }`}
          onClick={() => onSelectImage(image.dziPath)}
        >
          <img
            src={image.thumbnail}
            alt={image.name}
            className="item-thumbnail"
          />
          <span className="item-name">{image.name}</span>
        </div>
      ))}
    </div>
  </div>
);

const LabelTool = () => (
  <div className="tool-interface">
    <h3>Create a Label</h3>
    <p>Mark specific points of interest on the current image.</p>
  </div>
);

const StoryTool = () => (
  <div className="tool-interface">
    <h3>Create a Story</h3>
    <p>Build a narrative tour through the cosmic wonders.</p>
  </div>
);

const CompareTool = () => (
  <div className="tool-interface">
    <h3>Compare Images</h3>
    <p>Functionality to compare images will be available here.</p>
  </div>
);

// -- Main Sidebar Component --
// It now contains the logic to render the correct tool component internally.
const Sidebar = ({
  tools,
  activeTool,
  setActiveTool,
  // Props needed for the tool components
  hubbleImages,
  onImageSelect,
  activeDzi,
}) => {
  const [hoveredIcon, setHoveredIcon] = useState(null);

  const handleIconClick = (toolId) => {
    setActiveTool(activeTool === toolId ? null : toolId);
  };

  // This function decides which tool's UI to render inside the drawer
  const renderToolContent = () => {
    switch (activeTool) {
      case "images":
        return (
          <ImageSelectionTool
            images={hubbleImages}
            onSelectImage={onImageSelect}
            activeImageDzi={activeDzi}
          />
        );
      case "label":
        return <LabelTool />;
      case "story":
        return <StoryTool />;
      case "compare":
        return <CompareTool />;
      default:
        return null; // Render nothing if no tool is active
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

      {activeTool && (
        <div className="smart-drawer">
          <div className="drawer-content">{renderToolContent()}</div>
          <button className="close-drawer" onClick={() => setActiveTool(null)}>
            <FaTimes />
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
