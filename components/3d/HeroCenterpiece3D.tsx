'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Sun, Moon, Flame, RefreshCw, Eye } from 'lucide-react';

interface HeroCenterpiece3DProps {
  className?: string;
  onExplore?: () => void;
}

type LightingMode = 'champagne' | 'candlelight' | 'midnight';

export const HeroCenterpiece3D: React.FC<HeroCenterpiece3DProps> = ({ className = '', onExplore }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [lightingMode, setLightingMode] = useState<LightingMode>('champagne');
  const [isRotating, setIsRotating] = useState(() => {
    if (typeof window === 'undefined') return true;
    return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });
  const [isWebGLSupported] = useState(() => {
    if (typeof window === 'undefined') return true;
    try {
      const canvas = document.createElement('canvas');
      return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    } catch {
      return false;
    }
  });
  const [isInteracting, setIsInteracting] = useState(false);

  // References to keep between renders
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const pavilionGroupRef = useRef<THREE.Group | null>(null);
  const lightsGroupRef = useRef<THREE.Group | null>(null);
  const candlesRef = useRef<THREE.PointLight[]>([]);
  const sparklesRef = useRef<THREE.Points | null>(null);

  // Mouse & rotation damping
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const isDraggingRef = useRef(false);
  const previousPointerPositionRef = useRef({ x: 0, y: 0 });

  // Check prefers-reduced-motion
  const prefersReducedMotion = useRef(false);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      prefersReducedMotion.current = mq.matches;
    }
  }, []);

  // Update lighting mode colors in real-time
  useEffect(() => {
    if (!sceneRef.current || !lightsGroupRef.current) return;

    const ambientLight = lightsGroupRef.current.getObjectByName('ambientLight') as THREE.AmbientLight;
    const keyLight = lightsGroupRef.current.getObjectByName('keyLight') as THREE.DirectionalLight;
    const fillLight = lightsGroupRef.current.getObjectByName('fillLight') as THREE.DirectionalLight;

    if (lightingMode === 'champagne') {
      if (ambientLight) ambientLight.color.setHex(0xfff6ea);
      if (keyLight) {
        keyLight.color.setHex(0xffe6c2);
        keyLight.intensity = 1.4;
      }
      if (fillLight) {
        fillLight.color.setHex(0xe8d0b5);
        fillLight.intensity = 0.7;
      }
      candlesRef.current.forEach((c) => (c.intensity = 0.9));
    } else if (lightingMode === 'candlelight') {
      if (ambientLight) ambientLight.color.setHex(0x5a2d3a);
      if (keyLight) {
        keyLight.color.setHex(0xffaa5e);
        keyLight.intensity = 1.6;
      }
      if (fillLight) {
        fillLight.color.setHex(0xd9858d);
        fillLight.intensity = 0.9;
      }
      candlesRef.current.forEach((c) => (c.intensity = 2.2));
    } else {
      // Midnight Plum
      if (ambientLight) ambientLight.color.setHex(0x281232);
      if (keyLight) {
        keyLight.color.setHex(0xe8c7a1);
        keyLight.intensity = 1.1;
      }
      if (fillLight) {
        fillLight.color.setHex(0xa88ea8);
        fillLight.intensity = 0.6;
      }
      candlesRef.current.forEach((c) => (c.intensity = 1.8));
    }
  }, [lightingMode]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container || !isWebGLSupported) return;

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;

    // SCENE
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // CAMERA
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 3.2, 7.8);
    camera.lookAt(0, 0.9, 0);
    cameraRef.current = camera;

    // RENDERER
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // LIGHTS GROUP
    const lightsGroup = new THREE.Group();
    lightsGroupRef.current = lightsGroup;
    scene.add(lightsGroup);

    const ambientLight = new THREE.AmbientLight(0xfff6ea, 1.1);
    ambientLight.name = 'ambientLight';
    lightsGroup.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffe6c2, 1.4);
    keyLight.position.set(5, 8, 4);
    keyLight.name = 'keyLight';
    lightsGroup.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xe8d0b5, 0.7);
    fillLight.position.set(-5, 4, -3);
    fillLight.name = 'fillLight';
    lightsGroup.add(fillLight);

    // Warm underside bounce light
    const bounceLight = new THREE.DirectionalLight(0xd9858d, 0.4);
    bounceLight.position.set(0, -3, 2);
    lightsGroup.add(bounceLight);

    // -------------------------------------------------------------
    // PAVILION GEOMETRY & MATERIALS
    // -------------------------------------------------------------
    const pavilionGroup = new THREE.Group();
    pavilionGroupRef.current = pavilionGroup;
    scene.add(pavilionGroup);

    // Curated Editorial Luxury Materials
    const marbleIvoryMat = new THREE.MeshStandardMaterial({
      color: 0xfcfaf6,
      roughness: 0.35,
      metalness: 0.05,
    });

    const brushedGoldMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.3,
      metalness: 0.85,
    });

    const deepPlumMat = new THREE.MeshStandardMaterial({
      color: 0x30252d,
      roughness: 0.5,
      metalness: 0.2,
    });

    const coralFloraMat = new THREE.MeshStandardMaterial({
      color: 0xd9858d,
      roughness: 0.6,
      metalness: 0.05,
    });

    const sageFloraMat = new THREE.MeshStandardMaterial({
      color: 0xa8b69a,
      roughness: 0.5,
      metalness: 0.05,
    });

    const candleWaxMat = new THREE.MeshStandardMaterial({
      color: 0xfffcf0,
      roughness: 0.2,
      metalness: 0.05,
    });

    const candleFlameMat = new THREE.MeshBasicMaterial({
      color: 0xffb347,
    });

    // 1. Multi-tiered Pedestal Base
    const baseGeom1 = new THREE.CylinderGeometry(2.5, 2.7, 0.2, 32);
    const base1 = new THREE.Mesh(baseGeom1, marbleIvoryMat);
    base1.position.y = 0.1;
    pavilionGroup.add(base1);

    const baseTrimGeom = new THREE.TorusGeometry(2.52, 0.04, 16, 64);
    baseTrimGeom.rotateX(Math.PI / 2);
    const baseTrim = new THREE.Mesh(baseTrimGeom, brushedGoldMat);
    baseTrim.position.y = 0.2;
    pavilionGroup.add(baseTrim);

    const baseGeom2 = new THREE.CylinderGeometry(2.2, 2.3, 0.18, 32);
    const base2 = new THREE.Mesh(baseGeom2, deepPlumMat);
    base2.position.y = 0.29;
    pavilionGroup.add(base2);

    // Inlaid Gold Star/Geometric Floor Pattern
    const innerFloorGeom = new THREE.CylinderGeometry(1.95, 1.95, 0.02, 8);
    const innerFloor = new THREE.Mesh(innerFloorGeom, marbleIvoryMat);
    innerFloor.position.y = 0.39;
    pavilionGroup.add(innerFloor);

    // 2. Eight Neoclassical Fluted Columns
    const numColumns = 8;
    const columnRadius = 1.9;
    const columnHeight = 2.4;
    const columnGeom = new THREE.CylinderGeometry(0.09, 0.11, columnHeight, 20);
    const columnCapitalGeom = new THREE.BoxGeometry(0.28, 0.12, 0.28);
    const columnBaseGeom = new THREE.BoxGeometry(0.3, 0.1, 0.3);

    for (let i = 0; i < numColumns; i++) {
      const angle = (i / numColumns) * Math.PI * 2;
      const x = Math.cos(angle) * columnRadius;
      const z = Math.sin(angle) * columnRadius;

      const colGroup = new THREE.Group();
      colGroup.position.set(x, 0.4 + columnHeight / 2, z);

      const shaft = new THREE.Mesh(columnGeom, marbleIvoryMat);
      colGroup.add(shaft);

      const baseRing = new THREE.Mesh(columnBaseGeom, brushedGoldMat);
      baseRing.position.y = -columnHeight / 2 + 0.05;
      colGroup.add(baseRing);

      const capitalRing = new THREE.Mesh(columnCapitalGeom, brushedGoldMat);
      capitalRing.position.y = columnHeight / 2 - 0.06;
      colGroup.add(capitalRing);

      pavilionGroup.add(colGroup);
    }

    // 3. Classical Architrave & Entablature
    const entablatureGeom = new THREE.TorusGeometry(columnRadius, 0.12, 16, 64);
    entablatureGeom.rotateX(Math.PI / 2);
    const entablature = new THREE.Mesh(entablatureGeom, marbleIvoryMat);
    entablature.position.y = 0.4 + columnHeight + 0.06;
    pavilionGroup.add(entablature);

    const entablatureGoldGeom = new THREE.TorusGeometry(columnRadius + 0.08, 0.035, 16, 64);
    entablatureGoldGeom.rotateX(Math.PI / 2);
    const entablatureGold = new THREE.Mesh(entablatureGoldGeom, brushedGoldMat);
    entablatureGold.position.y = 0.4 + columnHeight + 0.15;
    pavilionGroup.add(entablatureGold);

    // 4. Domed Rotunda Roof
    const domeGeom = new THREE.SphereGeometry(columnRadius + 0.05, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2.7);
    const dome = new THREE.Mesh(domeGeom, marbleIvoryMat);
    dome.position.y = 0.4 + columnHeight + 0.1;
    pavilionGroup.add(dome);

    // Decorative Gold Ribs over Dome
    for (let i = 0; i < numColumns; i++) {
      const angle = (i / numColumns) * Math.PI * 2;
      const ribCurve = new THREE.EllipseCurve(0, 0, columnRadius + 0.07, 1.4, 0, Math.PI / 2, false, 0);
      const points = ribCurve.getPoints(20);
      const ribGeom = new THREE.BufferGeometry().setFromPoints(points);
      const ribMat = new THREE.LineBasicMaterial({ color: 0xd4af37, linewidth: 2 });
      const rib = new THREE.Line(ribGeom, ribMat);
      rib.position.y = 0.4 + columnHeight + 0.1;
      rib.rotation.y = angle;
      pavilionGroup.add(rib);
    }

    // Gold Finial / Pineapple Pinnacle at Dome Top
    const finialGeom = new THREE.ConeGeometry(0.14, 0.45, 16);
    const finial = new THREE.Mesh(finialGeom, brushedGoldMat);
    finial.position.y = 0.4 + columnHeight + 1.48;
    pavilionGroup.add(finial);

    const finialOrbGeom = new THREE.SphereGeometry(0.12, 16, 16);
    const finialOrb = new THREE.Mesh(finialOrbGeom, brushedGoldMat);
    finialOrb.position.y = 0.4 + columnHeight + 1.25;
    pavilionGroup.add(finialOrb);

    // 5. Central Floral Urn & Tiered Cascade
    const urnBaseGeom = new THREE.CylinderGeometry(0.35, 0.45, 0.6, 24);
    const urn = new THREE.Mesh(urnBaseGeom, marbleIvoryMat);
    urn.position.y = 0.4 + 0.3;
    pavilionGroup.add(urn);

    const urnRimGeom = new THREE.TorusGeometry(0.38, 0.04, 16, 32);
    urnRimGeom.rotateX(Math.PI / 2);
    const urnRim = new THREE.Mesh(urnRimGeom, brushedGoldMat);
    urnRim.position.y = 0.4 + 0.6;
    pavilionGroup.add(urnRim);

    // Floral Bouquet Cluster (Garden Roses & Foliage)
    const flowerGroup = new THREE.Group();
    flowerGroup.position.set(0, 0.4 + 0.68, 0);
    pavilionGroup.add(flowerGroup);

    // Rose clusters
    const roseGeom = new THREE.DodecahedronGeometry(0.14, 1);
    const leafGeom = new THREE.TetrahedronGeometry(0.12, 0);

    for (let r = 0; r < 24; r++) {
      const theta = (r / 24) * Math.PI * 2;
      const dist = 0.12 + (r % 3) * 0.14;
      const yOffset = (r % 4) * 0.08 + Math.sin(r) * 0.04;

      const rose = new THREE.Mesh(
        roseGeom,
        r % 2 === 0 ? coralFloraMat : r % 3 === 0 ? brushedGoldMat : marbleIvoryMat
      );
      rose.position.set(Math.cos(theta) * dist, yOffset, Math.sin(theta) * dist);
      rose.rotation.set(Math.sin(r), Math.cos(r), r * 0.2);
      flowerGroup.add(rose);

      // Leaves between roses
      if (r % 2 === 0) {
        const leaf = new THREE.Mesh(leafGeom, sageFloraMat);
        leaf.position.set(Math.cos(theta + 0.2) * (dist + 0.12), yOffset - 0.05, Math.sin(theta + 0.2) * (dist + 0.12));
        leaf.scale.set(1.5, 0.5, 1);
        leaf.rotation.set(0.4, theta, 0.3);
        flowerGroup.add(leaf);
      }
    }

    // 6. Hanging Crystal Chandelier in Pavilion Center with warm candles
    const chandelierGroup = new THREE.Group();
    chandelierGroup.position.set(0, 0.4 + columnHeight - 0.4, 0);
    pavilionGroup.add(chandelierGroup);

    const chainGeom = new THREE.CylinderGeometry(0.015, 0.015, 0.6, 8);
    const chain = new THREE.Mesh(chainGeom, brushedGoldMat);
    chain.position.y = 0.3;
    chandelierGroup.add(chain);

    const chandelierRingGeom = new THREE.TorusGeometry(0.45, 0.03, 16, 32);
    chandelierRingGeom.rotateX(Math.PI / 2);
    const chRing = new THREE.Mesh(chandelierRingGeom, brushedGoldMat);
    chandelierGroup.add(chRing);

    // 6 Candles on the Chandelier
    candlesRef.current = [];
    const candleGeom = new THREE.CylinderGeometry(0.025, 0.025, 0.18, 12);
    const flameGeom = new THREE.ConeGeometry(0.02, 0.07, 8);

    for (let c = 0; c < 6; c++) {
      const cAngle = (c / 6) * Math.PI * 2;
      const cx = Math.cos(cAngle) * 0.45;
      const cz = Math.sin(cAngle) * 0.45;

      const candleMesh = new THREE.Mesh(candleGeom, candleWaxMat);
      candleMesh.position.set(cx, 0.09, cz);
      chandelierGroup.add(candleMesh);

      const flameMesh = new THREE.Mesh(flameGeom, candleFlameMat);
      flameMesh.position.set(cx, 0.22, cz);
      chandelierGroup.add(flameMesh);

      // PointLight for real-time candle illumination
      const candleLight = new THREE.PointLight(0xffa84a, 0.9, 3.5, 2);
      candleLight.position.set(cx, 0.24, cz);
      chandelierGroup.add(candleLight);
      candlesRef.current.push(candleLight);
    }

    // 7. Ambient Floating Fireflies / Gold Sparkles Particle Cloud
    const particleCount = 120;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleScales = new Float32Array(particleCount);

    for (let p = 0; p < particleCount; p++) {
      particlePositions[p * 3] = (Math.random() - 0.5) * 6;
      particlePositions[p * 3 + 1] = Math.random() * 4 + 0.2;
      particlePositions[p * 3 + 2] = (Math.random() - 0.5) * 6;
      particleScales[p] = Math.random() * 0.8 + 0.4;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('scale', new THREE.BufferAttribute(particleScales, 1));

    const particleMaterial = new THREE.PointsMaterial({
      color: 0xffe29a,
      size: 0.045,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });

    const sparkles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(sparkles);
    sparklesRef.current = sparkles;

    // Ground Soft Contact Shadow Plane
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const shadowCtx = shadowCanvas.getContext('2d');
    if (shadowCtx) {
      const radGrad = shadowCtx.createRadialGradient(128, 128, 10, 128, 128, 120);
      radGrad.addColorStop(0, 'rgba(48, 37, 45, 0.45)');
      radGrad.addColorStop(0.5, 'rgba(48, 37, 45, 0.15)');
      radGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      shadowCtx.fillStyle = radGrad;
      shadowCtx.fillRect(0, 0, 256, 256);
    }
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowPlaneGeom = new THREE.PlaneGeometry(6.5, 6.5);
    const shadowPlaneMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
    });
    const shadowPlane = new THREE.Mesh(shadowPlaneGeom, shadowPlaneMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = 0.01;
    scene.add(shadowPlane);

    // -------------------------------------------------------------
    // ANIMATION & RENDER LOOP
    // -------------------------------------------------------------
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse damping towards target
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.06;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.06;

      if (pavilionGroupRef.current) {
        // Continuous auto-orbit when enabled
        if (isRotating && !isDraggingRef.current && !prefersReducedMotion.current) {
          pavilionGroupRef.current.rotation.y += 0.005;
        }

        // Pointer parallax tilt (subtle and cinematic)
        pavilionGroupRef.current.rotation.x = mouseRef.current.y * 0.22 - 0.05;
        pavilionGroupRef.current.rotation.z = mouseRef.current.x * -0.15;
      }

      // Candle flame flicker
      candlesRef.current.forEach((light, i) => {
        const flicker = Math.sin(elapsedTime * 9 + i * 2) * 0.12 + Math.cos(elapsedTime * 14 + i) * 0.08;
        light.intensity = Math.max(0.4, (lightingMode === 'candlelight' ? 2.2 : 0.9) + flicker);
      });

      // Sparkles floating wave
      if (sparklesRef.current) {
        const positions = sparklesRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 1; i < positions.length; i += 3) {
          positions[i] += Math.sin(elapsedTime * 0.8 + i) * 0.002;
        }
        sparklesRef.current.geometry.attributes.position.needsUpdate = true;
        sparklesRef.current.rotation.y = elapsedTime * 0.02;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // CLEANUP ON UNMOUNT
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isRotating, lightingMode, isWebGLSupported]);

  // Pointer interactions for 360 degree manual orbital inspection
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    setIsInteracting(true);
    previousPointerPositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const container = mountRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const relX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const relY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

    mouseRef.current.targetX = relX;
    mouseRef.current.targetY = relY;

    if (isDraggingRef.current && pavilionGroupRef.current) {
      const deltaX = e.clientX - previousPointerPositionRef.current.x;
      pavilionGroupRef.current.rotation.y += deltaX * 0.012;
      previousPointerPositionRef.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
    setTimeout(() => setIsInteracting(false), 800);
  };

  return (
    <div
      className={`relative w-full aspect-square max-w-[540px] mx-auto select-none rounded-3xl overflow-hidden ${className}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      style={{ touchAction: 'none' }}
      aria-label="Interactive 3D Neoclassical Celebration Pavilion. Drag to rotate 360 degrees."
    >
      {/* 3D WebGL Canvas Mount */}
      {isWebGLSupported ? (
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      ) : (
        // High-fidelity fallback if WebGL is disabled
        <div className="w-full h-full relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#FFFDF9] to-[#FAF8F3] border border-[#E9E0D8] p-6 flex flex-col justify-end">
          <img
            src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80"
            alt="Celebration Pavilion"
            className="absolute inset-0 w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#30252D]/90 via-[#30252D]/30 to-transparent" />
          <div className="relative z-10 text-white">
            <span className="px-3 py-1 rounded-full bg-[#D9858D] text-[10px] font-bold uppercase tracking-widest">
              Editorial Centerpiece
            </span>
            <h3 className="font-serif text-2xl font-bold mt-2">The Glasshouse Rotunda</h3>
          </div>
        </div>
      )}

      {/* Floating Interactive Controls Overlay */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none no-print">
        {/* Left Badge: Status */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/85 backdrop-blur-md border border-[#E9E0D8] text-[11px] font-mono tracking-wider text-[#30252D] shadow-xs pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-[#D9858D] animate-ping" />
          <span className="font-semibold">3D Pavilion Centerpiece</span>
        </div>

        {/* Right Controls: Orbit Toggle & Lighting Modes */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          <button
            onClick={() => setIsRotating(!isRotating)}
            className={`p-2 rounded-full backdrop-blur-md border border-[#E9E0D8] transition-all shadow-xs ${
              isRotating ? 'bg-white/90 text-[#30252D]' : 'bg-[#D9858D] text-white'
            }`}
            title={isRotating ? 'Pause rotation' : 'Resume 3D rotation'}
            aria-label={isRotating ? 'Pause rotation' : 'Resume 3D rotation'}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
          </button>

          <div className="flex items-center p-0.5 rounded-full bg-white/90 border border-[#E9E0D8] backdrop-blur-md shadow-xs">
            <button
              onClick={() => setLightingMode('champagne')}
              className={`p-1.5 rounded-full transition-all ${
                lightingMode === 'champagne' ? 'bg-[#FAF8F3] text-[#C8AD78] shadow-xs' : 'text-[#766B70] hover:text-[#30252D]'
              }`}
              title="Champagne Daylight Mood"
              aria-label="Champagne Daylight Mood"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setLightingMode('candlelight')}
              className={`p-1.5 rounded-full transition-all ${
                lightingMode === 'candlelight' ? 'bg-[#FAF8F3] text-[#D9858D] shadow-xs' : 'text-[#766B70] hover:text-[#30252D]'
              }`}
              title="Romantic Candlelight Mood"
              aria-label="Romantic Candlelight Mood"
            >
              <Flame className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setLightingMode('midnight')}
              className={`p-1.5 rounded-full transition-all ${
                lightingMode === 'midnight' ? 'bg-[#FAF8F3] text-[#4A3A47] shadow-xs' : 'text-[#766B70] hover:text-[#30252D]'
              }`}
              title="Midnight Plum Mood"
              aria-label="Midnight Plum Mood"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Subtle Bottom Instruction Pill */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 transition-opacity duration-300">
        <button
          onClick={onExplore}
          type="button"
          disabled={!onExplore}
          className={`px-3.5 py-1 rounded-full bg-white/85 backdrop-blur-md border border-[#E9E0D8] text-[10px] font-mono tracking-widest uppercase text-[#766B70] shadow-xs flex items-center gap-1.5 ${
            onExplore ? 'hover:text-[#30252D] hover:border-[#D9858D] cursor-pointer' : 'pointer-events-none'
          }`}
        >
          <Eye className="w-3 h-3 text-[#C8AD78]" />
          <span>{isInteracting ? 'Orbiting 3D Scene' : onExplore ? 'Explore Celebration Gallery' : 'Drag or tilt to orbit'}</span>
        </button>
      </div>
    </div>
  );
};
