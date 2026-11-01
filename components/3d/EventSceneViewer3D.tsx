'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { EventType } from '@/types/event';
import { Heart, Gift, Users, ArrowRight, RotateCw, ZoomIn, ZoomOut, Sparkles } from 'lucide-react';

interface EventSceneViewer3DProps {
  onSelectEventType: (type: EventType) => void;
  initialType?: EventType;
}

interface CategoryConfig {
  type: EventType;
  title: string;
  badge: string;
  tagline: string;
  accentColor: string;
  cameraPos: [number, number, number];
  features: string[];
}

const CATEGORIES: CategoryConfig[] = [
  {
    type: 'wedding',
    title: 'Weddings & Nuptials',
    badge: 'Floral Ceremony Arbor',
    tagline: 'Cascading garden roses, candlelit hurricane lanterns & ceremonial aisle runner',
    accentColor: '#D9858D',
    cameraPos: [0, 2.4, 6.2],
    features: ['Curated vow run-of-show', 'Bridal styling & beauty', 'Florals & champagne budget'],
  },
  {
    type: 'birthday',
    title: 'Milestone Birthdays',
    badge: 'Luminary Cake Soirée',
    tagline: 'Tiered velvet cake, gold sparklers, floating balloons & gift presentation',
    accentColor: '#C8AD78',
    cameraPos: [0, 2.2, 5.8],
    features: ['Midnight cake reveal', 'Mixology & playlist schedule', 'VIP guest keepsakes'],
  },
  {
    type: 'community',
    title: 'Community Festivals',
    badge: 'Open-Air Amphitheater',
    tagline: 'Acoustic stage canopy, festoon bistro lighting & festival sound production',
    accentColor: '#A8B69A',
    cameraPos: [0, 2.6, 6.6],
    features: ['Municipal clearances', 'Acoustic stage run-sheet', 'Volunteer & crowd zones'],
  },
];

export const EventSceneViewer3D: React.FC<EventSceneViewer3DProps> = ({
  onSelectEventType,
  initialType = 'wedding',
}) => {
  const [selectedType, setSelectedType] = useState<EventType>(initialType);
  const mountRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const prevPointerRef = useRef({ x: 0, y: 0 });

  // Three.js References
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const categoryGroupRef = useRef<THREE.Group | null>(null);

  const activeCategory = CATEGORIES.find((c) => c.type === selectedType) || CATEGORIES[0];

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 450;

    // SCENE
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // CAMERA
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(...activeCategory.cameraPos);
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
    renderer.toneMappingExposure = 1.2;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // LIGHTING
    const ambientLight = new THREE.AmbientLight(0xfff8f0, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffecc7, 1.5);
    dirLight.position.set(5, 7, 4);
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0xd9858d, 0.6);
    fillLight.position.set(-4, 3, -3);
    scene.add(fillLight);

    // Root dynamic group for swapping category scenes
    const rootGroup = new THREE.Group();
    categoryGroupRef.current = rootGroup;
    scene.add(rootGroup);

    // Ground platform
    const platformGeom = new THREE.CylinderGeometry(2.8, 3.0, 0.15, 36);
    const platformMat = new THREE.MeshStandardMaterial({
      color: 0xfcfaf6,
      roughness: 0.4,
      metalness: 0.05,
    });
    const platform = new THREE.Mesh(platformGeom, platformMat);
    platform.position.y = 0.075;
    rootGroup.add(platform);

    const rimGeom = new THREE.TorusGeometry(2.82, 0.035, 16, 64);
    rimGeom.rotateX(Math.PI / 2);
    const rimMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.3,
      metalness: 0.85,
    });
    const rim = new THREE.Mesh(rimGeom, rimMat);
    rim.position.y = 0.15;
    rootGroup.add(rim);

    // -------------------------------------------------------------
    // BUILD SCENE FOR SELECTED CATEGORY
    // -------------------------------------------------------------
    buildCategoryScene(selectedType, rootGroup);

    // ANIMATION LOOP
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Gentle auto-orbit
      if (!isDraggingRef.current && rootGroup) {
        rootGroup.rotation.y += 0.004;
      }

      // Dynamic sub-animations per category
      if (selectedType === 'birthday') {
        const sparklers = rootGroup.getObjectByName('sparklerGroup');
        if (sparklers) {
          sparklers.rotation.y = elapsed * 0.8;
        }
      } else if (selectedType === 'community') {
        const festoons = rootGroup.getObjectByName('festoonGroup');
        if (festoons) {
          festoons.children.forEach((bulb, idx) => {
            const point = bulb.getObjectByName('bulbLight') as THREE.PointLight;
            if (point) {
              point.intensity = 1.0 + Math.sin(elapsed * 4 + idx) * 0.25;
            }
          });
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [selectedType, activeCategory]);

  // Pointer manual rotation
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    prevPointerRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current || !categoryGroupRef.current) return;
    const deltaX = e.clientX - prevPointerRef.current.x;
    const deltaY = e.clientY - prevPointerRef.current.y;
    categoryGroupRef.current.rotation.y += deltaX * 0.012;
    categoryGroupRef.current.rotation.x = Math.max(
      -0.2,
      Math.min(0.3, categoryGroupRef.current.rotation.x + deltaY * 0.005)
    );
    prevPointerRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  const handleZoom = (direction: 'in' | 'out') => {
    if (!cameraRef.current) return;
    const factor = direction === 'in' ? 0.85 : 1.15;
    cameraRef.current.position.multiplyScalar(factor);
  };

  const resetCamera = () => {
    if (!cameraRef.current || !categoryGroupRef.current) return;
    cameraRef.current.position.set(...activeCategory.cameraPos);
    categoryGroupRef.current.rotation.set(0, 0, 0);
  };

  return (
    <div className="w-full bg-white rounded-3xl border border-[#E9E0D8] shadow-[0_20px_50px_rgba(48,37,45,0.08)] overflow-hidden">
      {/* Top Header & Category Selector Tabs */}
      <div className="p-6 sm:p-8 border-b border-[#E9E0D8] bg-[#FAF8F3]/60 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-[#D9858D] animate-ping" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#C8AD78] font-bold">
              Spatial Category Discovery
            </span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#30252D]">
            Explore 3D Celebration Venues
          </h3>
          <p className="text-xs sm:text-sm text-[#766B70] mt-1 font-light max-w-xl">
            Interact with bespoke 3D environments crafted for each milestone anatomy.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white border border-[#E9E0D8] shadow-xs self-start md:self-auto">
          {[
            { type: 'wedding' as EventType, label: 'Weddings', icon: Heart },
            { type: 'birthday' as EventType, label: 'Birthdays', icon: Gift },
            { type: 'community' as EventType, label: 'Festivals', icon: Users },
          ].map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedType === cat.type;
            return (
              <button
                key={cat.type}
                onClick={() => setSelectedType(cat.type)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                  isSelected
                    ? 'bg-[#30252D] text-white shadow-xs'
                    : 'text-[#766B70] hover:text-[#30252D] hover:bg-[#FAF8F3]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#D9858D]' : 'text-[#C8AD78]'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3D Scene Viewport & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch">
        {/* Left Column: 3D Interactive Canvas */}
        <div
          className="lg:col-span-8 relative aspect-[4/3] sm:aspect-[16/10] bg-gradient-to-b from-[#FFFDF9] via-[#FAF8F3] to-[#F5E3E4]/30 select-none cursor-grab active:cursor-grabbing border-b lg:border-b-0 lg:border-r border-[#E9E0D8]"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          style={{ touchAction: 'none' }}
        >
          <div ref={mountRef} className="w-full h-full" />

          {/* Canvas Floating Overlay Controls */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-white/90 backdrop-blur-md border border-[#E9E0D8] text-[#30252D] shadow-xs">
              {activeCategory.badge}
            </span>
          </div>

          <div className="absolute top-4 right-4 flex items-center gap-1.5 p-1 rounded-full bg-white/90 backdrop-blur-md border border-[#E9E0D8] shadow-xs">
            <button
              onClick={() => handleZoom('in')}
              className="p-1.5 rounded-full text-[#766B70] hover:text-[#30252D] hover:bg-[#FAF8F3] transition-colors"
              title="Zoom In"
              aria-label="Zoom in 3D scene"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleZoom('out')}
              className="p-1.5 rounded-full text-[#766B70] hover:text-[#30252D] hover:bg-[#FAF8F3] transition-colors"
              title="Zoom Out"
              aria-label="Zoom out 3D scene"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={resetCamera}
              className="p-1.5 rounded-full text-[#766B70] hover:text-[#30252D] hover:bg-[#FAF8F3] transition-colors"
              title="Reset Camera View"
              aria-label="Reset camera view"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none">
            <div className="px-3 py-1 rounded-full bg-white/80 backdrop-blur-md border border-[#E9E0D8] text-[10px] font-mono tracking-wider uppercase text-[#766B70] shadow-xs flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-[#D9858D]" />
              <span>Drag to rotate 360°</span>
            </div>
          </div>
        </div>

        {/* Right Column: Category Details & CTA */}
        <div className="lg:col-span-4 p-6 sm:p-8 flex flex-col justify-between bg-white space-y-6">
          <div className="space-y-4">
            <span
              className="inline-block px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest text-white shadow-xs"
              style={{ backgroundColor: activeCategory.accentColor }}
            >
              {selectedType.toUpperCase()} ARCHITECTURE
            </span>

            <h4 className="font-serif text-2xl font-bold text-[#30252D]">
              {activeCategory.title}
            </h4>

            <p className="text-xs sm:text-sm text-[#766B70] font-light leading-relaxed">
              {activeCategory.tagline}
            </p>

            <div className="pt-2 border-t border-[#E9E0D8] space-y-2.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#C8AD78] font-bold block">
                Included in Blueprint:
              </span>
              <ul className="space-y-2 text-xs text-[#30252D]/85">
                {activeCategory.features.map((feat, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D9858D]" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action button */}
          <div className="pt-4 border-t border-[#E9E0D8]">
            <button
              onClick={() => onSelectEventType(selectedType)}
              className="w-full py-4 px-6 rounded-2xl bg-[#D9858D] hover:bg-[#E29DA3] text-white font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(217,133,141,0.35)] hover:shadow-[0_15px_40px_rgba(217,133,141,0.5)] transition-all transform hover:-translate-y-0.5 group"
            >
              <span>Orchestrate {activeCategory.title}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Builds 3D geometries and materials tailored to each event category
 */
function buildCategoryScene(type: EventType, parent: THREE.Group) {
  // Common Materials
  const goldMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.3, metalness: 0.85 });
  const ivoryMat = new THREE.MeshStandardMaterial({ color: 0xfcfaf6, roughness: 0.4, metalness: 0.05 });
  const coralMat = new THREE.MeshStandardMaterial({ color: 0xd9858d, roughness: 0.6, metalness: 0.05 });
  const sageMat = new THREE.MeshStandardMaterial({ color: 0xa8b69a, roughness: 0.5, metalness: 0.05 });
  const plumMat = new THREE.MeshStandardMaterial({ color: 0x30252d, roughness: 0.4, metalness: 0.2 });

  if (type === 'wedding') {
    // -----------------------------------------------------------
    // SCENE 1: WEDDING CEREMONIAL FLORAL ARCH & AISLE
    // -----------------------------------------------------------
    // Ivory Satin Aisle Runner
    const runnerGeom = new THREE.PlaneGeometry(1.2, 3.8);
    const runnerMat = new THREE.MeshStandardMaterial({ color: 0xfffcf5, roughness: 0.6 });
    const runner = new THREE.Mesh(runnerGeom, runnerMat);
    runner.rotation.x = -Math.PI / 2;
    runner.position.set(0, 0.16, 0.4);
    parent.add(runner);

    // Floral Ceremonial Arch (Torus curve)
    const archCurve = new THREE.TorusGeometry(1.3, 0.08, 16, 32, Math.PI);
    const archFrame = new THREE.Mesh(archCurve, goldMat);
    archFrame.position.set(0, 1.45, -0.6);
    parent.add(archFrame);

    // Arch Bases / Pedestals
    const baseColGeom = new THREE.CylinderGeometry(0.12, 0.15, 1.45, 16);
    const colLeft = new THREE.Mesh(baseColGeom, ivoryMat);
    colLeft.position.set(-1.3, 0.725 + 0.15, -0.6);
    parent.add(colLeft);

    const colRight = new THREE.Mesh(baseColGeom, ivoryMat);
    colRight.position.set(1.3, 0.725 + 0.15, -0.6);
    parent.add(colRight);

    // Floral Cluster over Arch (30 colorful roses & leaves)
    const flowerGeom = new THREE.DodecahedronGeometry(0.1, 0);
    for (let f = 0; f < 32; f++) {
      const angle = (f / 32) * Math.PI;
      const fx = Math.cos(angle) * 1.3 + (Math.sin(f * 3) * 0.08);
      const fy = Math.sin(angle) * 1.3 + 1.45 + (Math.cos(f * 2) * 0.08);
      const fz = -0.6 + (Math.sin(f * 5) * 0.08);

      const flower = new THREE.Mesh(
        flowerGeom,
        f % 2 === 0 ? coralMat : f % 3 === 0 ? ivoryMat : sageMat
      );
      flower.position.set(fx, fy, fz);
      flower.rotation.set(f, f * 0.5, 0);
      parent.add(flower);
    }

    // Two Hurricane Candle Lanterns along Aisle
    const lanternGeom = new THREE.CylinderGeometry(0.08, 0.08, 0.35, 12);
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.1,
      metalness: 0.1,
      transparent: true,
      opacity: 0.4,
    });

    [-0.75, 0.75].forEach((lx) => {
      const lantern = new THREE.Mesh(lanternGeom, glassMat);
      lantern.position.set(lx, 0.15 + 0.18, 0.6);
      parent.add(lantern);

      const candle = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.16, 8), ivoryMat);
      candle.position.set(lx, 0.15 + 0.08, 0.6);
      parent.add(candle);

      const candleLight = new THREE.PointLight(0xffaa44, 1.2, 2.5);
      candleLight.position.set(lx, 0.15 + 0.22, 0.6);
      parent.add(candleLight);
    });

    // Center Vow Altar Pedestal with Rings
    const altarGeom = new THREE.CylinderGeometry(0.28, 0.32, 0.75, 20);
    const altar = new THREE.Mesh(altarGeom, ivoryMat);
    altar.position.set(0, 0.15 + 0.375, -0.6);
    parent.add(altar);

    // Velvet Ring Pillow & Gold Rings
    const pillowGeom = new THREE.BoxGeometry(0.2, 0.08, 0.2);
    const pillow = new THREE.Mesh(pillowGeom, plumMat);
    pillow.position.set(0, 0.15 + 0.75 + 0.04, -0.6);
    parent.add(pillow);

    const ringGeom = new THREE.TorusGeometry(0.035, 0.007, 8, 16);
    const ring1 = new THREE.Mesh(ringGeom, goldMat);
    ring1.rotation.x = Math.PI / 4;
    ring1.position.set(-0.025, 0.15 + 0.82, -0.6);
    parent.add(ring1);

    const ring2 = new THREE.Mesh(ringGeom, goldMat);
    ring2.rotation.x = -Math.PI / 4;
    ring2.position.set(0.025, 0.15 + 0.82, -0.6);
    parent.add(ring2);
  } else if (type === 'birthday') {
    // -----------------------------------------------------------
    // SCENE 2: MILESTONE BIRTHDAY VELVET CAKE SOIRÉE
    // -----------------------------------------------------------
    // Center Pedestal Table
    const tableGeom = new THREE.CylinderGeometry(1.2, 1.2, 0.08, 32);
    const table = new THREE.Mesh(tableGeom, ivoryMat);
    table.position.y = 0.75;
    parent.add(table);

    const tableLegGeom = new THREE.CylinderGeometry(0.1, 0.15, 0.6, 16);
    const leg = new THREE.Mesh(tableLegGeom, goldMat);
    leg.position.y = 0.15 + 0.3;
    parent.add(leg);

    // 3-Tiered Birthday Celebration Cake
    const tier1Geom = new THREE.CylinderGeometry(0.55, 0.55, 0.35, 32);
    const tier1 = new THREE.Mesh(tier1Geom, plumMat);
    tier1.position.y = 0.79 + 0.175;
    parent.add(tier1);

    const tier2Geom = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 32);
    const tier2 = new THREE.Mesh(tier2Geom, ivoryMat);
    tier2.position.y = 0.79 + 0.35 + 0.15;
    parent.add(tier2);

    const tier3Geom = new THREE.CylinderGeometry(0.26, 0.26, 0.25, 32);
    const tier3 = new THREE.Mesh(tier3Geom, coralMat);
    tier3.position.y = 0.79 + 0.65 + 0.125;
    parent.add(tier3);

    // Gold Trim Rings between tiers
    [0.79 + 0.35, 0.79 + 0.65].forEach((yPos) => {
      const trim = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.02, 12, 32), goldMat);
      trim.rotation.x = Math.PI / 2;
      trim.position.y = yPos;
      parent.add(trim);
    });

    // Cake Topper: Golden Star
    const topperGeom = new THREE.OctahedronGeometry(0.09, 0);
    const topper = new THREE.Mesh(topperGeom, goldMat);
    topper.position.y = 0.79 + 0.9 + 0.06;
    parent.add(topper);

    // Sparkler Particle Cluster Group
    const sparklerGroup = new THREE.Group();
    sparklerGroup.name = 'sparklerGroup';
    sparklerGroup.position.set(0, 0.79 + 0.95, 0);
    parent.add(sparklerGroup);

    const sparkCount = 36;
    const sparkGeom = new THREE.BufferGeometry();
    const sparkPos = new Float32Array(sparkCount * 3);
    for (let s = 0; s < sparkCount; s++) {
      const theta = (s / sparkCount) * Math.PI * 2;
      const r = 0.15 + (s % 3) * 0.12;
      sparkPos[s * 3] = Math.cos(theta) * r;
      sparkPos[s * 3 + 1] = (s % 4) * 0.08 + 0.05;
      sparkPos[s * 3 + 2] = Math.sin(theta) * r;
    }
    sparkGeom.setAttribute('position', new THREE.BufferAttribute(sparkPos, 3));
    const sparkMat = new THREE.PointsMaterial({
      color: 0xffe07a,
      size: 0.05,
      blending: THREE.AdditiveBlending,
    });
    const sparks = new THREE.Points(sparkGeom, sparkMat);
    sparklerGroup.add(sparks);

    // Floating Balloon Bunch (Metallic plum, champagne, coral)
    const balloonGeom = new THREE.SphereGeometry(0.24, 16, 16);
    balloonGeom.scale(1, 1.25, 1);

    const balloonLeft = new THREE.Mesh(balloonGeom, plumMat);
    balloonLeft.position.set(-1.4, 1.6, -0.4);
    parent.add(balloonLeft);

    const balloonMid = new THREE.Mesh(balloonGeom, goldMat);
    balloonMid.position.set(-1.25, 2.0, -0.5);
    parent.add(balloonMid);

    const balloonRight = new THREE.Mesh(balloonGeom, coralMat);
    balloonRight.position.set(-1.55, 1.85, -0.3);
    parent.add(balloonRight);

    // Gift Boxes on floor
    const gift1 = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.35, 0.35), plumMat);
    gift1.position.set(1.1, 0.15 + 0.175, 0.3);
    gift1.rotation.y = 0.3;
    parent.add(gift1);

    const gift2 = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.26, 0.26), coralMat);
    gift2.position.set(1.35, 0.15 + 0.13, 0.1);
    gift2.rotation.y = -0.4;
    parent.add(gift2);
  } else {
    // -----------------------------------------------------------
    // SCENE 3: COMMUNITY & CULTURAL FESTIVAL OPEN-AIR STAGE
    // -----------------------------------------------------------
    // Raised Wooden Timber Platform
    const stageGeom = new THREE.BoxGeometry(3.6, 0.3, 2.6);
    const stageWoodMat = new THREE.MeshStandardMaterial({
      color: 0x4a3a30,
      roughness: 0.7,
      metalness: 0.05,
    });
    const stage = new THREE.Mesh(stageGeom, stageWoodMat);
    stage.position.set(0, 0.15 + 0.15, -0.2);
    parent.add(stage);

    // Arch Acoustic Canopy Roof
    const trussGeom = new THREE.TorusGeometry(1.6, 0.05, 12, 32, Math.PI);
    const truss = new THREE.Mesh(trussGeom, goldMat);
    truss.position.set(0, 0.45 + 1.6, -0.2);
    parent.add(truss);

    // Backstage Acoustic Wall
    const backWallGeom = new THREE.BoxGeometry(3.2, 1.8, 0.08);
    const backWall = new THREE.Mesh(backWallGeom, sageMat);
    backWall.position.set(0, 0.45 + 0.9, -1.3);
    parent.add(backWall);

    // Festoon Bistro Lights String Group (Curved across stage)
    const festoonGroup = new THREE.Group();
    festoonGroup.name = 'festoonGroup';
    parent.add(festoonGroup);

    const bulbGeom = new THREE.SphereGeometry(0.05, 8, 8);
    const bulbMat = new THREE.MeshBasicMaterial({ color: 0xffd97d });

    for (let b = 0; b < 10; b++) {
      const frac = b / 9;
      const bx = (frac - 0.5) * 3.2;
      const by = 0.45 + 1.8 - Math.sin(frac * Math.PI) * 0.45;
      const bz = -0.2;

      const bulb = new THREE.Mesh(bulbGeom, bulbMat);
      bulb.position.set(bx, by, bz);

      const bulbLight = new THREE.PointLight(0xffba52, 0.8, 1.8);
      bulbLight.name = 'bulbLight';
      bulbLight.position.set(0, 0, 0);
      bulb.add(bulbLight);

      festoonGroup.add(bulb);
    }

    // Two Stage Audio Monitor / Speaker Cabinets
    const speakerGeom = new THREE.BoxGeometry(0.35, 0.65, 0.3);
    const speakerLeft = new THREE.Mesh(speakerGeom, plumMat);
    speakerLeft.position.set(-1.45, 0.45 + 0.325, 0.6);
    speakerLeft.rotation.y = 0.35;
    parent.add(speakerLeft);

    const speakerRight = new THREE.Mesh(speakerGeom, plumMat);
    speakerRight.position.set(1.45, 0.45 + 0.325, 0.6);
    speakerRight.rotation.y = -0.35;
    parent.add(speakerRight);

    // Civic Podium with Festival Emblem
    const podiumGeom = new THREE.CylinderGeometry(0.18, 0.22, 0.8, 16);
    const podium = new THREE.Mesh(podiumGeom, ivoryMat);
    podium.position.set(0, 0.45 + 0.4, 0.3);
    parent.add(podium);
  }
}
