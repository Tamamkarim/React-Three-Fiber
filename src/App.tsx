
import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, SoftShadows } from '@react-three/drei';
import './App.css';
import { Mesh, Group } from 'three';

function Antenna({ position, active }: { position: [number, number, number], active: boolean }) {
  const ref = useRef<Mesh>(null);
  useFrame((state) => {
    if (ref.current) ref.current.rotation.z = Math.sin(state.clock.getElapsedTime()) * 0.5;
  });
  return (
    <mesh ref={ref} position={position} castShadow>
      <cylinderGeometry args={[0.05, 0.05, 1, 16]} />
      <meshStandardMaterial color="#888" />
      <mesh position={[0, 0, 0.5]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color={active ? "#ff0055" : "#252323"} emissive={active ? "#ff0055" : "#222"} emissiveIntensity={active ? 0.8 : 0.2} />
      </mesh>
    </mesh>
  );
}


function Button3D({ position, label, active, onClick }: { position: [number, number, number], label: string, active: boolean, onClick: () => void }) {
  return (
    <mesh position={position} onClick={onClick} castShadow receiveShadow>
      <boxGeometry args={[0.4, 0.4, 0.15]} />
      <meshStandardMaterial color={active ? '#00c853' : '#263238'} roughness={0.25} metalness={0.5} />
      <Html center position={[0, 0, 0.12]} style={{ pointerEvents: 'none' }}>
        <div className="dashboard-label">{label}</div>
      </Html>
    </mesh>
  );
}



function LED({ position, on }: { position: [number, number, number], on: boolean }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.07, 12, 12]} />
      <meshStandardMaterial color={on ? '#00ff00' : '#c37676'} emissive={on ? '#00ff00' : '#751717'} emissiveIntensity={on ? 1 : 0.1} />
    </mesh>
  );
}


function Dashboard({ states, setStates }: { states: boolean[]; setStates: React.Dispatch<React.SetStateAction<boolean[]>> }) {
  const antennaActive = states.some(Boolean);
  const groupRef = useRef<Group>(null);
  useFrame(() => {
    if (groupRef.current) {
      const t = Date.now() * 0.003;
      groupRef.current.position.x = antennaActive ? Math.sin(t) * 0.05 : 0;
      groupRef.current.position.y = antennaActive ? Math.cos(t) * 0.05 : 0;
    }
  });
  return (
    <group ref={groupRef}>
      {/* Panel Base */}
      <mesh position={[0, 0, 0]} receiveShadow castShadow>
        <boxGeometry args={[2, 1, 0.2]} />
        <meshStandardMaterial color="#37474f" metalness={0.2} roughness={0.6} />
      </mesh>
      {/* Panel Title */}
      <Html center position={[0, 0, 0.7]} style={{ pointerEvents: 'none' }}>
        <div className="dashboard-label">Tauluko</div>
      </Html>
      {/* Antenna */} 
      <Antenna position={[0.8, 0, 0.6]} active={antennaActive} />
      {/* Buttons & LEDs */}
      {states.map((active, i) => (
        <group key={i}>
          <Button3D
            position={[-0.6 + i * 0.6, 0, 0.25]}
            label={`Button ${i + 1}`}
            active={active}
            onClick={() => setStates(s => s.map((v, idx) => idx === i ? !v : v))}
          />
          {/* LED Indicator */}
          <LED position={[-0.6 + i * 0.6, 0.35, 0.25]} on={active} />
        </group>
      ))}
    </group>
  );
}

function App() {
  // تغيير لون الإضاءة حسب حالة الأزرار
  const [states, setStates] = useState([false, false, false]);
  const antennaActive = states.some(Boolean);
  const lightColor = antennaActive ? '#ffe082' : '#ffffff';
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#222' }}>
      <Canvas shadows camera={{ position: [0, -3, 2], fov: 50 }}>
        <SoftShadows size={20} samples={16} focus={0.95} />
        <ambientLight intensity={0.4} color={lightColor} />
        <directionalLight
          castShadow
          position={[2, -2, 4]}
          intensity={1.2}
          color={lightColor}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-bias={-0.0005}
        />
        <Dashboard states={states} setStates={setStates} />
        <mesh receiveShadow position={[0, 0, -0.1]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[8, 8]} />
          <shadowMaterial opacity={0.3} />
        </mesh>
        <OrbitControls enablePan enableZoom enableRotate />
      </Canvas>
    </div>
  );
}

export default App;

