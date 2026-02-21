import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  PerspectiveCamera, 
  Environment, 
  Float, 
  Text, 
  MeshDistortMaterial, 
  ContactShadows,
  Html
} from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';

// --- 3D Components ---

function Truck({ position, color = "#3b82f6" }: { position: [number, number, number], color?: string }) {
  const mesh = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (mesh.current) {
      // Gentle floating animation
      mesh.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.1;
    }
  });

  return (
    <group ref={mesh} position={position}>
      {/* Truck Body */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[2, 1, 1]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Truck Cabin */}
      <mesh position={[1.25, 0.75, 0]}>
        <boxGeometry args={[0.5, 1.5, 1]} />
        <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(1.2)} />
      </mesh>
      {/* Wheels */}
      <mesh position={[-0.7, 0, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
      <mesh position={[0.7, 0, 0.5]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
       <mesh position={[-0.7, 0, -0.5]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
      <mesh position={[0.7, 0, -0.5]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
    </group>
  );
}

function FloatingPackage({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.5;
      ref.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <mesh ref={ref} position={position}>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <MeshDistortMaterial color="#f97316" speed={2} distort={0.3} />
      </mesh>
    </Float>
  );
}

function GridFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
      <planeGeometry args={[50, 50]} />
      <meshStandardMaterial color="#0f172a" roughness={0.8} metalness={0.2} />
      <gridHelper args={[50, 50, "#1e293b", "#1e293b"]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} />
    </mesh>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#3b82f6" />
      <pointLight position={[-10, 5, -5]} intensity={0.5} color="#f97316" />
      
      <Environment preset="city" />
      
      <group position={[0, -1, 0]}>
          <GridFloor />
          <Truck position={[-2, 0.3, 2]} color="#3b82f6" />
          <Truck position={[3, 0.3, -2]} color="#10b981" />
          <Truck position={[-4, 0.3, -4]} color="#6366f1" />
          
          <FloatingPackage position={[0, 3, 0]} />
          <FloatingPackage position={[-4, 2, 3]} />
          <FloatingPackage position={[4, 4, -3]} />
      </group>

      <ContactShadows position={[0, -0.49, 0]} opacity={0.5} scale={20} blur={2} far={4} />
    </>
  );
}

// --- Main Component ---

interface LandingPageProps {
  onGetStarted: (mode: 'login' | 'register') => void;
}

const ThreeDLandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="relative w-full h-screen bg-slate-900 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Canvas shadows dpr={[1, 2]}>
          <PerspectiveCamera makeDefault position={[0, 3, 10]} fov={50} />
          <Scene />
          <OrbitControls 
            enableZoom={false} 
            enablePan={false} 
            maxPolarAngle={Math.PI / 2 - 0.1} 
            autoRotate 
            autoRotateSpeed={0.5}
          />
        </Canvas>
      </div>

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
        <div className="container mx-auto px-6 text-center pointer-events-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 mb-6 drop-shadow-2xl">
              Fleet Code
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto mb-10 font-light">
              Create a 3d landing page of fleet code
              <br />
              Logistics management reimagined for the modern era.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => onGetStarted('login')}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-600/30 transition-all transform hover:scale-105 active:scale-95"
              >
                Launch Dashboard
              </button>
              <button 
                onClick={() => onGetStarted('register')}
                className="px-8 py-4 bg-slate-800/80 hover:bg-slate-700 backdrop-blur-md text-white border border-slate-700 rounded-xl font-bold text-lg transition-all transform hover:scale-105 active:scale-95"
              >
                Create Account
              </button>
            </div>
          </motion.div>
        </div>
      </div>
          
      {/* Decorative footer */}
      <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-center text-slate-500 text-sm z-10 pointer-events-none">
        <p>© 2026 Fleet Code Systems. All rights reserved.</p>
      </div>
    </div>
  );
};

export default ThreeDLandingPage;
