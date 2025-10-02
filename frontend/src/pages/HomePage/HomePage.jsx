import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Text3D,
  Float,
  Environment,
  PerspectiveCamera,
  useTexture,
} from "@react-three/drei";
import { useNavigate } from "react-router-dom";
import * as THREE from "three";
import "./HomePage.css";

// Map Card Component in 3D
function MapCard({
  position,
  rotation,
  title,
  description,
  icon,
  onClick,
  index,
}) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime + index) * 0.1;
      if (hovered) {
        meshRef.current.scale.lerp(new THREE.Vector3(1.2, 1.2, 1.2), 0.1);
      } else {
        meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      }
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
      <group position={position} rotation={rotation}>
        <mesh
          ref={meshRef}
          onClick={onClick}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <boxGeometry args={[2.5, 3, 0.3]} />
          <meshStandardMaterial
            color={hovered ? "#00d4ff" : "#0a1128"}
            metalness={0.8}
            roughness={0.2}
            emissive={hovered ? "#00a9ff" : "#001a33"}
            emissiveIntensity={hovered ? 0.5 : 0.2}
          />
        </mesh>

        {/* Card Content */}
        <Text3D
          font="/fonts/helvetiker_bold.typeface.json"
          size={0.25}
          height={0.05}
          position={[-1, 0.8, 0.2]}
          castShadow
        >
          {title}
          <meshStandardMaterial
            color="#00d4ff"
            emissive="#00a9ff"
            emissiveIntensity={0.5}
          />
        </Text3D>

        <mesh position={[0, 0, 0.2]}>
          <planeGeometry args={[2, 1.5]} />
          <meshBasicMaterial color="#001a33" opacity={0.5} transparent />
        </mesh>

        <Text3D
          font="/fonts/helvetiker_regular.typeface.json"
          size={0.12}
          height={0.02}
          position={[-0.9, -0.5, 0.2]}
        >
          {description}
          <meshStandardMaterial color="#ffffff" />
        </Text3D>

        {/* Icon representation */}
        <mesh position={[0, 0.2, 0.2]}>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshStandardMaterial
            color="#00a9ff"
            emissive="#00d4ff"
            emissiveIntensity={0.8}
            metalness={1}
            roughness={0}
          />
        </mesh>

        {/* Glow effect */}
        {hovered && (
          <pointLight
            position={[0, 0, 1]}
            intensity={2}
            distance={5}
            color="#00d4ff"
          />
        )}
      </group>
    </Float>
  );
}

// Particle Background
function Particles() {
  const pointsRef = useRef();
  const particleCount = 1000;

  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 50;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
  }

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#00a9ff"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

// Rotating Earth in Center
function CenterEarth() {
  const earthRef = useRef();

  useFrame((state) => {
    if (earthRef.current) {
      earthRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <mesh ref={earthRef} position={[0, 0, -8]}>
      <sphereGeometry args={[1.5, 64, 64]} />
      <meshStandardMaterial
        color="#0a4d8f"
        emissive="#003366"
        emissiveIntensity={0.5}
        metalness={0.7}
        roughness={0.3}
      />
    </mesh>
  );
}

// Main Homepage Component
export default function HomePage() {
  const navigate = useNavigate();

  const maps = [
    {
      id: "worldview",
      title: "World View",
      description: "Explore NASA satellite imagery",
      icon: "🌍",
      path: "/Explora/worldmap",
    },
    {
      id: "messeir",
      title: "Messeir Map",
      description: "Specialized regional view",
      icon: "🗺️",
      path: "/messeir",
    },
    {
      id: "future",
      title: "Future Map",
      description: "Coming soon...",
      icon: "🚀",
      path: "/future",
    },
  ];

  // Position cards in a circle around the camera
  const radius = 6;
  const angleStep = (Math.PI * 2) / maps.length;

  return (
    <div className="homepage-container">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={75} />

        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight
          position={[-10, -10, -10]}
          intensity={0.5}
          color="#00a9ff"
        />
        <spotLight
          position={[0, 10, 0]}
          angle={0.3}
          penumbra={1}
          intensity={1}
          castShadow
          color="#00d4ff"
        />

        {/* Environment */}
        <Environment preset="night" />

        {/* Background Particles */}
        <Particles />

        {/* Center Earth */}
        <CenterEarth />

        {/* Map Cards in Circle */}
        {maps.map((map, index) => {
          const angle = angleStep * index - Math.PI / 2;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          const rotationY = -angle;

          return (
            <MapCard
              key={map.id}
              position={[x, 0, z]}
              rotation={[0, rotationY, 0]}
              title={map.title}
              description={map.description}
              icon={map.icon}
              index={index}
              onClick={() => navigate(map.path)}
            />
          );
        })}

        {/* Controls */}
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={3}
          maxDistance={15}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>

      {/* UI Overlay */}
      <div className="homepage-overlay">
        <div className="homepage-header">
          <h1 className="homepage-title">
            <span className="title-cosmic">Cosmic</span>
            <span className="title-canvas">Canvas</span>
          </h1>
          <p className="homepage-subtitle">
            Navigate the Universe of Earth Data
          </p>
        </div>

        <div className="homepage-instructions">
          <p>🖱️ Drag to rotate • Scroll to zoom • Click cards to explore</p>
        </div>

        <div className="homepage-footer">
          <p>Powered by NASA EOSDIS GIBS</p>
        </div>
      </div>
    </div>
  );
}
