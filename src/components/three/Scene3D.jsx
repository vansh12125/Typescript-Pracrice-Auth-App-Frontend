import React, { useRef, useState, useEffect, Suspense, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, useTexture } from '@react-three/drei';
import * as THREE from 'three';
function VoxelBlock({ 
  position, 
  index, 
  texture, 
  hoveredIndex, 
  setHoveredIndex, 
  scatterFactor, 
  smoothScroll,
  onClick 
}) {
  const meshRef = useRef();
  const isHovered = hoveredIndex === index;
  const basePos = useMemo(() => new THREE.Vector3(...position), [position]);
  const dir = useMemo(() => {
    const d = basePos.clone();
    if (d.length() === 0) d.set(0, 0, 1);
    return d.normalize();
  }, [basePos]);
  const currentPos = useRef(basePos.clone());
  const currentScale = useRef(1);
  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const scrollExpansion = smoothScroll.current * 1.8;
    const hoverOffset = isHovered ? 0.25 : 0;
    const scatterOffset = scatterFactor.current * (1.2 + (index % 3) * 0.4);
    const totalDist = scrollExpansion + hoverOffset + scatterOffset;
    const targetX = basePos.x + dir.x * totalDist;
    const targetY = basePos.y + dir.y * totalDist;
    const targetZ = basePos.z + dir.z * totalDist;
    const lerpSpeed = delta * 8;
    currentPos.current.x = THREE.MathUtils.lerp(currentPos.current.x, targetX, lerpSpeed);
    currentPos.current.y = THREE.MathUtils.lerp(currentPos.current.y, targetY, lerpSpeed);
    currentPos.current.z = THREE.MathUtils.lerp(currentPos.current.z, targetZ, lerpSpeed);
    meshRef.current.position.copy(currentPos.current);
    const targetScale = isHovered ? 1.12 : 1;
    currentScale.current = THREE.MathUtils.lerp(currentScale.current, targetScale, lerpSpeed);
    meshRef.current.scale.setScalar(currentScale.current);
  });
  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHoveredIndex(index);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHoveredIndex(null);
        document.body.style.cursor = 'auto';
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <boxGeometry args={[0.54, 0.54, 0.54]} />
      <meshStandardMaterial
        color={isHovered ? "#60a5fa" : "#555555"}
        emissive={isHovered ? "#3b82f6" : "#000000"}
        emissiveIntensity={isHovered ? 0.6 : 0}
        metalness={0.3}
        roughness={0.4}
        map={texture}
        bumpMap={texture}
        bumpScale={0.04}
        roughnessMap={texture}
      />
    </mesh>
  );
}
function VoxelCluster({ isMobile, mousePos, scrollProgress }) {
  const groupRef = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const lightRef = useRef();
  const coreRef = useRef();
  const timeRef = useRef(0);
  const scatterFactor = useRef(0);
  const smoothScroll = useRef(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const { gl } = useThree();
  const grungeTexture = useTexture("/textures/grunge.jpg");
  grungeTexture.wrapS = THREE.RepeatWrapping;
  grungeTexture.wrapT = THREE.RepeatWrapping;
  grungeTexture.repeat.set(1, 1);
  grungeTexture.colorSpace = THREE.SRGBColorSpace;
  grungeTexture.anisotropy = Math.min(gl.capabilities.getMaxAnisotropy(), 16);
  const handleScatter = () => {
    scatterFactor.current = 2.0;
  };
  useFrame((state, delta) => {
    const safeDelta = Math.min(delta, 0.1);
    timeRef.current += safeDelta;
    const time = timeRef.current;
    smoothScroll.current = THREE.MathUtils.lerp(
      smoothScroll.current, 
      scrollProgress.current, 
      safeDelta * 6
    );
    scatterFactor.current = THREE.MathUtils.lerp(scatterFactor.current, 0, safeDelta * 4);
    const targetRotX = (mousePos.current.y * 0.4) + Math.sin(time * 0.15) * 0.15;
    const targetRotY = (mousePos.current.x * 0.5) + (time * 0.08);
    const targetPosY = Math.sin(time * 0.4) * 0.1 + (isMobile ? -0.4 : 0);
    const defaultX = isMobile ? 0 : 1.3;
    const targetPosX = THREE.MathUtils.lerp(defaultX, 0, smoothScroll.current);
    if (groupRef.current) {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.05);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.05);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetPosY, 0.05);
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetPosX, 0.05);
      const clusterScale = (isMobile ? 1.4 : 2.0) + (smoothScroll.current * 0.5);
      groupRef.current.scale.setScalar(clusterScale);
    }
    const ring1Scale = 1 + smoothScroll.current * 0.6;
    const ring2Scale = 1 + smoothScroll.current * 0.8;
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z = time * 0.25;
      ring1Ref.current.scale.setScalar(ring1Scale);
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = time * 0.2;
      ring2Ref.current.rotation.y = time * 0.15;
      ring2Ref.current.scale.setScalar(ring2Scale);
    }
    if (lightRef.current) {
      lightRef.current.intensity = 5 + (smoothScroll.current * 20) + Math.sin(time * 4) * 2 + (scatterFactor.current * 15);
    }
    if (coreRef.current) {
      const coreScale = 1 + (smoothScroll.current * 0.4);
      coreRef.current.scale.setScalar(coreScale);
    }
  });
  const blockPositions = [
    [-0.6, 0.6, 0.6], [0, 0.6, 0.6], [0.6, 0.6, 0.6],
    [-0.6, 0.6, 0],                  [0.6, 0.6, 0],
    [-0.6, 0.6, -0.6],[0, 0.6, -0.6],[0.6, 0.6, -0.6],
    [-0.6, 0, 0.6],   [0, 0, 0.6],    [0.6, 0, 0.6],
    [-0.6, 0, 0],                     [0.6, 0, 0],
    [-0.6, 0, -0.6],  [0, 0, -0.6],   [0.6, 0, -0.6],
    [-0.6, -0.6, 0.6], [0, -0.6, 0.6], [0.6, -0.6, 0.6],
    [-0.6, -0.6, 0],                   [0.6, -0.6, 0],
    [-0.6, -0.6, -0.6],[0, -0.6, -0.6],[0.6, -0.6, -0.6],
  ];
  return (
    <group ref={groupRef} position={[isMobile ? 0 : 1.3, 0, 0]} scale={isMobile ? 1.4 : 2.0}>
      {}
      {blockPositions.map((pos, idx) => (
        <VoxelBlock
          key={idx}
          index={idx}
          position={pos}
          texture={grungeTexture}
          hoveredIndex={hoveredIndex}
          setHoveredIndex={setHoveredIndex}
          scatterFactor={scatterFactor}
          smoothScroll={smoothScroll}
          onClick={handleScatter}
        />
      ))}
      {}
      <mesh 
        ref={coreRef}
        position={[0, 0, 0]} 
        onClick={handleScatter}
        onPointerOver={() => (document.body.style.cursor = 'pointer')}
        onPointerOut={() => (document.body.style.cursor = 'auto')}
      >
        <boxGeometry args={[0.55, 0.55, 0.55]} />
        <meshBasicMaterial color="#ffffff" />
        <pointLight ref={lightRef} intensity={5} distance={8} color="#60a5fa" />
      </mesh>
      {}
      <group ref={ring1Ref} rotation={[0.4, 0.5, 0]}>
        <mesh>
          <torusGeometry args={[1.3, 0.006, 8, 64]} />
          <meshBasicMaterial color="#60a5fa" opacity={0.3} transparent />
        </mesh>
        <mesh position={[1.3, 0, 0]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshStandardMaterial color="#ffffff" emissive="#3b82f6" emissiveIntensity={2} />
        </mesh>
      </group>
      <group ref={ring2Ref} rotation={[-0.6, 1.2, 0]}>
        <mesh>
          <torusGeometry args={[1.45, 0.006, 8, 64]} />
          <meshBasicMaterial color="#ffffff" opacity={0.2} transparent />
        </mesh>
        <mesh position={[0, 1.45, 0]}>
          <sphereGeometry args={[0, 1.45, 0]} />
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshStandardMaterial color="#ffffff" emissive="#60a5fa" emissiveIntensity={2} />
        </mesh>
      </group>
    </group>
  );
}
export default function Scene3D() {
  const [isMobile, setIsMobile] = useState(false);
  const mousePos = useRef({ x: 0, y: 0 });
  const scrollProgress = useRef(0);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    const handleMouseMove = (e) => {
      mousePos.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mousePos.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        scrollProgress.current = Math.min(Math.max(window.scrollY / totalScroll, 0), 1);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  return (
    <div className="w-full h-full min-h-screen relative bg-[#050507]">
      <Canvas
        camera={{ position: [0, 0, 6.5], fov: 45 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 4, 4]} intensity={1.8} color="#ffffff" />
        <directionalLight position={[-3, 2, 3]} intensity={1.2} color="#93c5fd" />
        <pointLight position={[0, -3, 2]} intensity={0.5} color="#ffffff" />
        <Suspense fallback={null}>
          <VoxelCluster 
            isMobile={isMobile} 
            mousePos={mousePos} 
            scrollProgress={scrollProgress} 
          />
        </Suspense>
        <Environment preset="studio" intensity={0.2} />
      </Canvas>
    </div>
  );
}