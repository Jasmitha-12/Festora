'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Eye, RotateCw, Sparkles, Layers } from 'lucide-react';

export type TableShape = 'round' | 'imperial' | 'cocktail';
export type FloralStyle = 'garden-rose' | 'minimal-orchid' | 'candlelit-evergreen' | 'pampas-wild';
export type DinnerwareStyle = 'gold' | 'silver' | 'rose-gold';
export type LightingMood = 'candlelit' | 'twilight' | 'golden-hour';

export interface TableSettingConfig {
  shape: TableShape;
  linenColor: string;
  floralStyle: FloralStyle;
  dinnerwareStyle: DinnerwareStyle;
  lightingMood: LightingMood;
}

interface TableSetting3DViewerProps {
  config: TableSettingConfig;
  className?: string;
}

export const TableSetting3DViewer: React.FC<TableSetting3DViewerProps> = ({
  config,
  className = '',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [cameraView, setCameraView] = useState<'orbit' | 'top' | 'guest'>('orbit');
  const [isRotating, setIsRotating] = useState(true);

  // Three.js References
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const tableGroupRef = useRef<THREE.Group | null>(null);
  const candlesLightRef = useRef<THREE.PointLight[]>([]);

  // Drag interaction
  const isDraggingRef = useRef(false);
  const prevPointerRef = useRef({ x: 0, y: 0 });

  // Update camera angle when cameraView changes
  useEffect(() => {
    if (!cameraRef.current) return;
    const cam = cameraRef.current;
    if (cameraView === 'top') {
      cam.position.set(0, 5.5, 0.01);
      cam.lookAt(0, 0, 0);
    } else if (cameraView === 'guest') {
      cam.position.set(0, 1.45, 2.5);
      cam.lookAt(0, 0.95, 0);
    } else {
      cam.position.set(0, 2.8, 4.4);
      cam.lookAt(0, 0.8, 0);
    }
  }, [cameraView]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 550;
    const height = container.clientHeight || 450;

    // SCENE
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // CAMERA
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 2.8, 4.4);
    camera.lookAt(0, 0.8, 0);
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
    renderer.toneMappingExposure = 1.25;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // LIGHTING SETUP ACCORDING TO LIGHTING MOOD
    const ambientLight = new THREE.AmbientLight(
      config.lightingMood === 'candlelit'
        ? 0xffeed8
        : config.lightingMood === 'twilight'
        ? 0xdfd4ea
        : 0xfff3de,
      config.lightingMood === 'candlelit' ? 1.0 : 1.3
    );
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(
      config.lightingMood === 'candlelit'
        ? 0xffc480
        : config.lightingMood === 'twilight'
        ? 0xe2a8bc
        : 0xffe6b0,
      config.lightingMood === 'candlelit' ? 1.4 : 1.6
    );
    dirLight.position.set(4, 7, 3);
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0xd9858d, 0.4);
    fillLight.position.set(-3, 3, -2);
    scene.add(fillLight);

    // ROOT TABLE GROUP
    const tableGroup = new THREE.Group();
    tableGroupRef.current = tableGroup;
    scene.add(tableGroup);

    // Floor shadow circle
    const shadowGeom = new THREE.CircleGeometry(2.4, 32);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x30252d,
      transparent: true,
      opacity: 0.18,
    });
    const shadow = new THREE.Mesh(shadowGeom, shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.01;
    scene.add(shadow);

    // -------------------------------------------------------------
    // BUILD TABLETOP, LINENS & DINNERWARE
    // -------------------------------------------------------------
    buildTableSetting(config, tableGroup, candlesLightRef);

    // ANIMATION LOOP
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      if (isRotating && !isDraggingRef.current && cameraView === 'orbit' && tableGroupRef.current) {
        tableGroupRef.current.rotation.y += 0.005;
      }

      // Candle flame flicker
      candlesLightRef.current.forEach((light, i) => {
        const flicker = Math.sin(elapsed * 8 + i * 2) * 0.15;
        light.intensity = 1.0 + flicker;
      });

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
  }, [config, isRotating, cameraView]);

  // Pointer drag
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    prevPointerRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current || !tableGroupRef.current) return;
    const deltaX = e.clientX - prevPointerRef.current.x;
    const deltaY = e.clientY - prevPointerRef.current.y;
    tableGroupRef.current.rotation.y += deltaX * 0.012;
    if (cameraView !== 'top') {
      tableGroupRef.current.rotation.x = Math.max(
        -0.2,
        Math.min(0.3, tableGroupRef.current.rotation.x + deltaY * 0.005)
      );
    }
    prevPointerRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <div
      className={`relative w-full aspect-[4/3] rounded-3xl overflow-hidden bg-gradient-to-b from-[#FFFDF9] via-[#FAF8F3] to-[#F5E3E4]/30 border border-[#E9E0D8] shadow-sm select-none cursor-grab active:cursor-grabbing ${className}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      style={{ touchAction: 'none' }}
    >
      <div ref={mountRef} className="w-full h-full" />

      {/* Floating Camera View Presets */}
      <div className="absolute top-4 left-4 flex items-center gap-1.5 p-1 rounded-full bg-white/90 backdrop-blur-md border border-[#E9E0D8] shadow-xs">
        {[
          { id: 'orbit', label: '360° Orbit', icon: RotateCw },
          { id: 'guest', label: 'Guest Seat', icon: Eye },
          { id: 'top', label: 'Aerial View', icon: Layers },
        ].map((v) => {
          const Icon = v.icon;
          const isActive = cameraView === v.id;
          return (
            <button
              key={v.id}
              onClick={() => {
                setCameraView(v.id as typeof cameraView);
                if (v.id !== 'orbit') setIsRotating(false);
              }}
              className={`px-3 py-1.5 rounded-full text-[11px] font-semibold flex items-center gap-1.5 transition-all ${
                isActive
                  ? 'bg-[#30252D] text-white shadow-xs'
                  : 'text-[#766B70] hover:text-[#30252D] hover:bg-[#FAF8F3]'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{v.label}</span>
            </button>
          );
        })}
      </div>

      {/* Auto-Orbit Toggle Button */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setIsRotating(!isRotating)}
          className={`p-2 rounded-full border border-[#E9E0D8] shadow-xs backdrop-blur-md transition-all ${
            isRotating ? 'bg-white/90 text-[#30252D]' : 'bg-[#D9858D] text-white'
          }`}
          title={isRotating ? 'Pause rotation' : 'Resume auto rotation'}
          aria-label={isRotating ? 'Pause rotation' : 'Resume auto rotation'}
        >
          <RotateCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
        </button>
      </div>

      {/* Instruction Badge */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none">
        <div className="px-3 py-1 rounded-full bg-white/80 backdrop-blur-md border border-[#E9E0D8] text-[10px] font-mono tracking-wider uppercase text-[#766B70] shadow-xs flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-[#D9858D]" />
          <span>Interactive 3D Tabletop Model</span>
        </div>
      </div>
    </div>
  );
};

/**
 * Procedurally generates the 3D table, linens, plates, glassware, cutlery, and floral centerpieces
 */
function buildTableSetting(
  config: TableSettingConfig,
  parent: THREE.Group,
  candlesRef: React.MutableRefObject<THREE.PointLight[]>
) {
  candlesRef.current = [];

  // Parse Linen Material
  const linenColorHex = parseInt(config.linenColor.replace('#', '0x'), 16) || 0xfaf8f3;
  const linenMat = new THREE.MeshStandardMaterial({
    color: linenColorHex,
    roughness: 0.7,
    metalness: 0.05,
  });

  // Dinnerware Metal Mat (Gold / Silver / Rose-Gold)
  const metalColorHex =
    config.dinnerwareStyle === 'gold'
      ? 0xd4af37
      : config.dinnerwareStyle === 'silver'
      ? 0xdcdcdc
      : 0xcd7f32;
  const cutleryMat = new THREE.MeshStandardMaterial({
    color: metalColorHex,
    roughness: 0.25,
    metalness: 0.85,
  });

  // Fine Bone China Porcelain Plate Mat
  const porcelainMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.15,
    metalness: 0.1,
  });

  // Crystal Glassware Mat
  const glassMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.1,
    metalness: 0.15,
    transparent: true,
    opacity: 0.45,
  });

  // 1. TABLETOP & LEGS
  if (config.shape === 'round') {
    // Round Banquet Table (Radius 1.4m)
    const tableGeom = new THREE.CylinderGeometry(1.4, 1.4, 0.08, 36);
    const table = new THREE.Mesh(tableGeom, linenMat);
    table.position.y = 0.85;
    parent.add(table);

    // Overhanging Tablecloth Skirt
    const skirtGeom = new THREE.CylinderGeometry(1.42, 1.45, 0.75, 36, 1, true);
    const skirt = new THREE.Mesh(skirtGeom, linenMat);
    skirt.position.y = 0.85 - 0.375;
    parent.add(skirt);

    // 8 Place Settings in Radial Symmetry
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const px = Math.cos(angle) * 1.05;
      const pz = Math.sin(angle) * 1.05;

      const placeGroup = new THREE.Group();
      placeGroup.position.set(px, 0.89, pz);
      placeGroup.rotation.y = -angle + Math.PI / 2;

      // Charger plate
      const chargerGeom = new THREE.CylinderGeometry(0.18, 0.18, 0.015, 20);
      const charger = new THREE.Mesh(chargerGeom, cutleryMat);
      placeGroup.add(charger);

      // Dinner plate
      const plateGeom = new THREE.CylinderGeometry(0.14, 0.14, 0.018, 20);
      const plate = new THREE.Mesh(plateGeom, porcelainMat);
      plate.position.y = 0.009;
      placeGroup.add(plate);

      // Folded Napkin
      const napkinGeom = new THREE.BoxGeometry(0.08, 0.02, 0.12);
      const napkin = new THREE.Mesh(napkinGeom, linenMat);
      napkin.position.y = 0.022;
      placeGroup.add(napkin);

      // Wine Glass & Water Goblet
      const wineGlassGeom = new THREE.CylinderGeometry(0.035, 0.01, 0.14, 12);
      const wineGlass = new THREE.Mesh(wineGlassGeom, glassMat);
      wineGlass.position.set(0.12, 0.07, 0.08);
      placeGroup.add(wineGlass);

      // Flatware (Fork left, Knife right)
      const forkGeom = new THREE.BoxGeometry(0.015, 0.008, 0.16);
      const fork = new THREE.Mesh(forkGeom, cutleryMat);
      fork.position.set(-0.22, 0.005, 0);
      placeGroup.add(fork);

      const knifeGeom = new THREE.BoxGeometry(0.015, 0.008, 0.16);
      const knife = new THREE.Mesh(knifeGeom, cutleryMat);
      knife.position.set(0.22, 0.005, 0);
      placeGroup.add(knife);

      parent.add(placeGroup);
    }
  } else if (config.shape === 'imperial') {
    // Long Imperial Banquet Table (3.2m x 1.2m)
    const tableGeom = new THREE.BoxGeometry(3.2, 0.08, 1.2);
    const table = new THREE.Mesh(tableGeom, linenMat);
    table.position.y = 0.85;
    parent.add(table);

    // Long Table Skirt
    const skirtGeom = new THREE.BoxGeometry(3.22, 0.75, 1.22);
    const skirt = new THREE.Mesh(skirtGeom, linenMat);
    skirt.position.y = 0.85 - 0.375;
    parent.add(skirt);

    // Place Settings along both sides
    [-1.1, -0.55, 0, 0.55, 1.1].forEach((xPos) => {
      // Top side
      const pTop = createPlaceSetting(cutleryMat, porcelainMat, glassMat, linenMat);
      pTop.position.set(xPos, 0.89, -0.42);
      pTop.rotation.y = Math.PI;
      parent.add(pTop);

      // Bottom side
      const pBottom = createPlaceSetting(cutleryMat, porcelainMat, glassMat, linenMat);
      pBottom.position.set(xPos, 0.89, 0.42);
      parent.add(pBottom);
    });
  } else {
    // Cocktail High-Top Table
    const topGeom = new THREE.CylinderGeometry(0.65, 0.65, 0.06, 24);
    const top = new THREE.Mesh(topGeom, linenMat);
    top.position.y = 1.05;
    parent.add(top);

    // Slim Pedestal Pole
    const poleGeom = new THREE.CylinderGeometry(0.04, 0.04, 1.0, 16);
    const pole = new THREE.Mesh(poleGeom, cutleryMat);
    pole.position.y = 0.52;
    parent.add(pole);

    // Base
    const baseGeom = new THREE.CylinderGeometry(0.4, 0.4, 0.04, 24);
    const base = new THREE.Mesh(baseGeom, cutleryMat);
    base.position.y = 0.02;
    parent.add(base);

    // 2 Champagne Flutes
    const fluteGeom = new THREE.CylinderGeometry(0.03, 0.015, 0.16, 12);
    const flute1 = new THREE.Mesh(fluteGeom, glassMat);
    flute1.position.set(-0.15, 1.16, 0.1);
    parent.add(flute1);

    const flute2 = new THREE.Mesh(fluteGeom, glassMat);
    flute2.position.set(0.15, 1.16, -0.1);
    parent.add(flute2);
  }

  // 2. FLORAL CENTERPIECE & CANDLES ACCORDING TO FLORAL STYLE
  const centerpieceGroup = new THREE.Group();
  centerpieceGroup.position.set(0, 0.89, 0);
  parent.add(centerpieceGroup);

  const coralFlowerMat = new THREE.MeshStandardMaterial({ color: 0xd9858d, roughness: 0.6 });
  const ivoryFlowerMat = new THREE.MeshStandardMaterial({ color: 0xfffaf2, roughness: 0.4 });
  const sageLeafMat = new THREE.MeshStandardMaterial({ color: 0xa8b69a, roughness: 0.5 });
  const brassVaseMat = new THREE.MeshStandardMaterial({ color: metalColorHex, roughness: 0.3, metalness: 0.8 });

  if (config.floralStyle === 'garden-rose') {
    // Lush Garden Rose Urn with Cascading Petals
    const vaseGeom = new THREE.CylinderGeometry(0.2, 0.15, 0.3, 16);
    const vase = new THREE.Mesh(vaseGeom, brassVaseMat);
    vase.position.y = 0.15;
    centerpieceGroup.add(vase);

    // 16 Clustered Roses & Foliage
    for (let r = 0; r < 18; r++) {
      const theta = (r / 18) * Math.PI * 2;
      const radius = 0.12 + (r % 3) * 0.08;
      const y = 0.28 + (r % 4) * 0.06;

      const rose = new THREE.Mesh(
        new THREE.DodecahedronGeometry(0.07, 0),
        r % 2 === 0 ? coralFlowerMat : ivoryFlowerMat
      );
      rose.position.set(Math.cos(theta) * radius, y, Math.sin(theta) * radius);
      rose.rotation.set(r, theta, 0);
      centerpieceGroup.add(rose);
    }

    // 4 Candle Votives around Vase
    [-0.32, 0.32].forEach((vx) => {
      [-0.32, 0.32].forEach((vz) => {
        const votive = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.06, 12), glassMat);
        votive.position.set(vx, 0.03, vz);
        centerpieceGroup.add(votive);

        const flame = new THREE.PointLight(0xffaa44, 0.8, 1.8);
        flame.position.set(vx, 0.08, vz);
        centerpieceGroup.add(flame);
        candlesRef.current.push(flame);
      });
    });
  } else if (config.floralStyle === 'minimal-orchid') {
    // Sleek Ceramic Vessel with Sculptural Arching Orchid Branch
    const vessel = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.35, 16), porcelainMat);
    vessel.position.y = 0.175;
    centerpieceGroup.add(vessel);

    // Arching Branch
    const stemGeom = new THREE.CylinderGeometry(0.012, 0.015, 0.6, 8);
    const stem = new THREE.Mesh(stemGeom, sageLeafMat);
    stem.position.set(0.08, 0.45, 0);
    stem.rotation.z = -0.35;
    centerpieceGroup.add(stem);

    // 5 Pure White Orchid Blooms along stem
    for (let o = 0; o < 5; o++) {
      const bloom = new THREE.Mesh(new THREE.OctahedronGeometry(0.055, 0), ivoryFlowerMat);
      bloom.position.set(0.04 + o * 0.05, 0.32 + o * 0.09, Math.sin(o) * 0.04);
      centerpieceGroup.add(bloom);
    }
  } else if (config.floralStyle === 'candlelit-evergreen') {
    // Low Foliage Garland with 3 Pillar Candles
    [-0.3, 0, 0.3].forEach((cx, idx) => {
      const pillarHeight = idx === 1 ? 0.32 : 0.22;
      const pillar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, pillarHeight, 16),
        ivoryFlowerMat
      );
      pillar.position.set(cx, pillarHeight / 2, 0);
      centerpieceGroup.add(pillar);

      const light = new THREE.PointLight(0xffa834, 1.2, 2.2);
      light.position.set(cx, pillarHeight + 0.04, 0);
      centerpieceGroup.add(light);
      candlesRef.current.push(light);
    });

    // Evergreen garland ring around candles
    const garland = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.09, 8, 24), sageLeafMat);
    garland.rotation.x = Math.PI / 2;
    garland.position.y = 0.04;
    centerpieceGroup.add(garland);
  } else {
    // Pampas & Wild Botanical Texture
    const pampasVase = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.18, 0.38, 16), porcelainMat);
    pampasVase.position.y = 0.19;
    centerpieceGroup.add(pampasVase);

    // Fluffy Pampas Cones
    for (let p = 0; p < 7; p++) {
      const pAngle = (p / 7) * Math.PI * 2;
      const pampas = new THREE.Mesh(
        new THREE.ConeGeometry(0.07, 0.35, 8),
        new THREE.MeshStandardMaterial({ color: 0xe8dcc2, roughness: 0.9 })
      );
      pampas.position.set(Math.cos(pAngle) * 0.1, 0.48, Math.sin(pAngle) * 0.1);
      pampas.rotation.set(Math.cos(pAngle) * 0.4, 0, Math.sin(pAngle) * 0.4);
      centerpieceGroup.add(pampas);
    }
  }
}

function createPlaceSetting(
  cutleryMat: THREE.Material,
  porcelainMat: THREE.Material,
  glassMat: THREE.Material,
  linenMat: THREE.Material
) {
  const g = new THREE.Group();
  const charger = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.015, 16), cutleryMat);
  g.add(charger);

  const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.018, 16), porcelainMat);
  plate.position.y = 0.009;
  g.add(plate);

  const napkin = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.02, 0.1), linenMat);
  napkin.position.y = 0.022;
  g.add(napkin);

  const glass = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.01, 0.12, 10), glassMat);
  glass.position.set(0.1, 0.06, 0.06);
  g.add(glass);

  return g;
}
