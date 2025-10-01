
import React, { useState, useEffect, useRef } from 'react';
import { Rocket, Globe, Moon, ChevronRight } from 'lucide-react';
import './HomePage.css';

export default function HomePage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredCard, setHoveredCard] = useState(null);
  const [stars, setStars] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    // Generate random stars
    const newStars = Array.from({ length: 150 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2
    }));
    setStars(newStars);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
        const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
        setMousePosition({ x, y });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleCardClick = (mapType) => {
    // Navigate to the respective map page
    window.location.href = `/${mapType}`;
  };

  return (
    <div 
      ref={containerRef}
      className="homepage-container"
      style={{
        perspective: '1000px'
      }}
    >
      {/* Animated starfield background */}
      <div className="starfield">
        {stars.map((star, i) => (
          <div
            key={i}
            className="star"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`
            }}
          />
        ))}
      </div>

      {/* Animated gradient overlay */}
      <div 
        className="gradient-overlay"
        style={{
          transform: `translate(${mousePosition.x * 50}px, ${mousePosition.y * 50}px)`
        }}
      />

      {/* Main content */}
      <div 
        className="main-content"
        style={{
          transform: `rotateY(${mousePosition.x * 5}deg) rotateX(${-mousePosition.y * 5}deg)`
        }}
      >
        {/* Header */}
        <div className="header">
          <div className="rocket-icon-container">
            <Rocket className="rocket-icon" />
          </div>
          <h1 className="main-title">
            NASA
            <span className="subtitle">Space Explorer</span>
          </h1>
          <p className="description">
            Choose your destination and explore the cosmos
          </p>
        </div>

        {/* Map selection cards */}
        <div className="cards-container">
          {/* Earth Map Card */}
          <div
            onMouseEnter={() => setHoveredCard('earth')}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => handleCardClick('earth')}
            className={`map-card ${hoveredCard === 'earth' ? 'hovered' : ''}`}
            style={{
              transform: hoveredCard === 'earth' 
                ? 'translateZ(80px) scale(1.05)' 
                : 'translateZ(20px)'
            }}
          >
            <div className="card-border earth-border">
              <div className="card-hover-effect" />
              
              <div className="card-content">
                <div className="card-inner">
                  <div 
                    className="icon-container"
                    style={{
                      animation: hoveredCard === 'earth' ? 'spin 4s linear infinite' : 'float 3s ease-in-out infinite'
                    }}
                  >
                    <Globe className="planet-icon earth-icon" />
                    <div className="icon-glow earth-glow" />
                  </div>
                  
                  <div className="card-text">
                    <h2 className="card-title">Earth</h2>
                    <p className="card-description">
                      Explore our beautiful home planet with detailed satellite imagery and terrain data
                    </p>
                  </div>

                  <div className="launch-button earth-button">
                    <span>Launch Mission</span>
                    <ChevronRight className="chevron-icon" />
                  </div>
                </div>
              </div>
            </div>

            {/* Orbital ring effect */}
            <div className="orbital-ring earth-ring" />
          </div>

          {/* Moon Map Card */}
          <div
            onMouseEnter={() => setHoveredCard('moon')}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => handleCardClick('moon')}
            className={`map-card ${hoveredCard === 'moon' ? 'hovered' : ''}`}
            style={{
              transform: hoveredCard === 'moon' 
                ? 'translateZ(80px) scale(1.05)' 
                : 'translateZ(20px)'
            }}
          >
            <div className="card-border moon-border">
              <div className="card-hover-effect" />
              
              <div className="card-content">
                <div className="card-inner">
                  <div 
                    className="icon-container"
                    style={{
                      animation: hoveredCard === 'moon' ? 'spin 4s linear infinite' : 'float 3s ease-in-out infinite 0.5s'
                    }}
                  >
                    <Moon className="planet-icon moon-icon" />
                    <div className="icon-glow moon-glow" />
                  </div>
                  
                  <div className="card-text">
                    <h2 className="card-title">Moon</h2>
                    <p className="card-description">
                      Navigate lunar landscapes and discover the mysteries of Earth's natural satellite
                    </p>
                  </div>

                  <div className="launch-button moon-button">
                    <span>Launch Mission</span>
                    <ChevronRight className="chevron-icon" />
                  </div>
                </div>
              </div>
            </div>

            {/* Orbital ring effect */}
            <div className="orbital-ring moon-ring" />
          </div>
        </div>

        {/* Footer text */}
        <div className="footer">
          <p className="footer-text">
            NASA Space Apps Challenge 2025 | Powered by Advanced Mapping Technology
          </p>
        </div>
      </div>
    </div>
  );
}