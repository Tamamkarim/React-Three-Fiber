import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, softShadows } from '@react-three/drei';

softShadows();

function Antenna({ position, active }) {
  const ref = useRef();
  useFrame((state) => {
    ref.current.rotation.z = Math.sin(state.clock.getElapsedTime()) * 0.5;
  });
  return (
    <mesh ref={ref} position={position} castShadow>
      <cylinderGeometry args={[0.05, 0.05, 1, 16]} />
      <meshStandardMaterial color="#888" />
      <mesh position={[0, 0, 0.5]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color={active ? "#ff0055" : "#888"} emissive={active ? "#ff0055" : "#222"} emissiveIntensity={active ? 0.8 : 0.2} />
      </mesh>
    </mesh>
  );
}

function Button3D({ position, label, active, onClick }) {
  return (
    <mesh position={position} onClick={onClick} castShadow receiveShadow className="button3d">
      <boxGeometry args={[0.4, 0.4, 0.15]} />
      <meshStandardMaterial color={active ? '#00c853' : '#263238'} roughness={0.25} metalness={0.5} />
      <Html center position={[0, 0, 0.12]} style={{ pointerEvents: 'none' }}>
        <div className="dashboard-label">{label}</div>
      </Html>
    </mesh>
  );
}

function Dashboard() {
  const [states, setStates] = useState([false, false, false]);
  // الهوائي يضيء عند تفعيل أي زر
  const antennaActive = states.some(Boolean);
  return (
    <group>
      {/* Panel Base */}
      <mesh position={[0, 0, 0]} receiveShadow castShadow>
        <boxGeometry args={[2, 1, 0.2]} />
        <meshStandardMaterial color="#37474f" metalness={0.2} roughness={0.6} />
      </mesh>
      {/* عنوان اللوحة */}
      <Html center position={[0, 0, 0.7]} style={{ pointerEvents: 'none' }}>
        <div className="dashboard-label">لوحة تحكم ثلاثية الأبعاد</div>
      </Html>
      {/* Antenna */}
      <Antenna position={[0.8, 0, 0.6]} active={antennaActive} />
      {/* Buttons */}
      {states.map((active, i) => (
        <Button3D
          key={i}
          position={[-0.6 + i * 0.6, 0, 0.25]}
          label={`زر ${i + 1}`}
          active={active}
          onClick={() => setStates(s => s.map((v, idx) => idx === i ? !v : v))}
        />
      ))}
    </group>
  );
}

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#222' }}>
      <Canvas shadows camera={{ position: [0, -3, 2], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <directionalLight
          castShadow
          position={[2, -2, 4]}
          intensity={1.2}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-bias={-0.0005}
        />
        <Dashboard />
        <mesh receiveShadow position={[0, 0, -0.1]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[8, 8]} />
          <shadowMaterial opacity={0.3} />
        </mesh>
        <OrbitControls enablePan enableZoom enableRotate />
      </Canvas>
    </div>
  );
}
