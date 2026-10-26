'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { EventType } from '@/types/event';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Sparkles,
  ArrowUpRight,
  Heart,
  Gift,
  Users,
  Music,
  GraduationCap,
  Wine,
} from 'lucide-react';

export interface GalleryItem {
  id: string;
  eventType: EventType;
  categoryLabel: string;
  title: string;
  subtitle: string;
  image: string;
  icon: React.ElementType;
  accentColor: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-1',
    eventType: 'wedding',
    categoryLabel: 'Glasshouse Nuptials',
    title: 'The Cotswolds Union',
    subtitle: 'Sun-dappled botanicals & candlelit vows',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    icon: Heart,
    accentColor: '#E88D83',
  },
  {
    id: 'gal-2',
    eventType: 'birthday',
    categoryLabel: 'Milestone 40th',
    title: 'Golden Luminary Loft',
    subtitle: 'Rooftop mixology & vinyl dance floor',
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80',
    icon: Gift,
    accentColor: '#D8BD91',
  },
  {
    id: 'gal-3',
    eventType: 'community',
    categoryLabel: 'Open-Air Concert',
    title: 'Solstice Sunset Amphitheater',
    subtitle: 'Acoustic stage & festival lights',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
    icon: Music,
    accentColor: '#E6C875',
  },
  {
    id: 'gal-4',
    eventType: 'wedding',
    categoryLabel: 'Heritage Splendor',
    title: 'Palazzo Ceremonial Gala',
    subtitle: 'Gold brocade, roses & chandeliers',
    image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
    icon: Heart,
    accentColor: '#E88D83',
  },
  {
    id: 'gal-5',
    eventType: 'community',
    categoryLabel: 'College & Youth Fest',
    title: 'Campus Vanguard Conclave',
    subtitle: 'Street arts, hackathon & collective beats',
    image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=800&q=80',
    icon: GraduationCap,
    accentColor: '#A9B8A0',
  },
  {
    id: 'gal-6',
    eventType: 'birthday',
    categoryLabel: 'Silver Jubilee',
    title: 'Midnight Velvet Soirée',
    subtitle: 'Showstopper cake reveal & champagne pop',
    image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=800&q=80',
    icon: Gift,
    accentColor: '#D5C7DA',
  },
  {
    id: 'gal-7',
    eventType: 'community',
    categoryLabel: 'Civic Harvest',
    title: 'Green Horizon Gathering',
    subtitle: 'Artisan culinary stalls & community forum',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
    icon: Users,
    accentColor: '#7F9374',
  },
  {
    id: 'gal-8',
    eventType: 'wedding',
    categoryLabel: 'Contemporary Atelier',
    title: 'Monolithic City Nuptials',
    subtitle: 'Architectural minimalism & warm glow',
    image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
    icon: Heart,
    accentColor: '#FAF7F2',
  },
  {
    id: 'gal-9',
    eventType: 'community',
    categoryLabel: 'Cultural Street Fair',
    title: 'Heritage Street Carnival',
    subtitle: 'Folk performances & lantern processions',
    image: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80',
    icon: Users,
    accentColor: '#E88D83',
  },
  {
    id: 'gal-10',
    eventType: 'birthday',
    categoryLabel: 'Garden Al Fresco',
    title: 'Long-Table Orchard Feast',
    subtitle: 'Warm festoon lanterns & shared laughter',
    image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80',
    icon: Wine,
    accentColor: '#D8BD91',
  },
];

// 3D Cylinder Physics and Interaction Constants
const AUTO_ROTATION_SPEED_DEG_PER_SEC = 7.2;
const INERTIA_DAMPING_FACTOR = 0.94;
const POINTER_DRAG_SENSITIVITY = 0.42;
const POINTER_VELOCITY_FACTOR = 0.38;
const WHEEL_SPIN_SENSITIVITY = 0.12;
const VELOCITY_STOP_THRESHOLD = 0.04;
const WHEEL_DELTA_THRESHOLD = 4;

const subscribeReducedMotion = (callback: () => void) => {
  if (typeof window === 'undefined') return () => {};
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  mediaQuery.addEventListener('change', callback);
  return () => mediaQuery.removeEventListener('change', callback);
};

const getReducedMotionSnapshot = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

interface Rolling3DGalleryProps {
  onSelectEvent: (type: EventType) => void;
}

/**
 * Spatial 3D cylindrical celebration gallery.
 *
 * Utilizes CSS 3D transforms, real-time depth-of-field attenuation, pointer parallax,
 * and inertial damping for an immersive portfolio showcase.
 */
export const Rolling3DGallery: React.FC<Rolling3DGalleryProps> = ({ onSelectEvent }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const totalItems = GALLERY_ITEMS.length;
  const angleStep = 360 / totalItems;

  // Responsive radius calculation based on viewport width
  const [radius, setRadius] = useState(520);
  const [panelWidth, setPanelWidth] = useState(280);
  const [panelHeight, setPanelHeight] = useState(380);

  // 3D rotation state
  const [rotationY, setRotationY] = useState(0);
  const [tiltX, setTiltX] = useState(-4);
  const [tiltZ, setTiltZ] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // Derived currently focused front card index
  const normalizedRotation = ((-rotationY % 360) + 360) % 360;
  const activeItemIndex = Math.round(normalizedRotation / angleStep) % totalItems;

  // Drag interaction refs
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const lastXRef = useRef(0);
  const velocityRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);

  // Update geometry on resize
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setRadius(320);
        setPanelWidth(210);
        setPanelHeight(290);
      } else if (width < 1024) {
        setRadius(440);
        setPanelWidth(250);
        setPanelHeight(340);
      } else {
        setRadius(550);
        setPanelWidth(290);
        setPanelHeight(400);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const prefersReducedMotion = React.useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    () => false
  );

  // Smooth continuous animation loop
  useEffect(() => {
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      // Handle inertia if dragging just ended
      if (!isDraggingRef.current && Math.abs(velocityRef.current) > VELOCITY_STOP_THRESHOLD) {
        setRotationY((prev) => prev + velocityRef.current);
        velocityRef.current *= INERTIA_DAMPING_FACTOR; // Inertia damping
      } else if (isAutoRotating && !isHovered && !isDraggingRef.current && !prefersReducedMotion) {
        // Continuous graceful auto-rotation
        setRotationY((prev) => prev - AUTO_ROTATION_SPEED_DEG_PER_SEC * delta);
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isAutoRotating, isHovered, prefersReducedMotion]);

  // Pointer move tilt parallax (dynamic 3D camera angles following pointer)
  const handlePointerMoveContainer = useCallback((e: React.PointerEvent) => {
    if (isDraggingRef.current) {
      const currentX = e.clientX;
      const deltaX = currentX - lastXRef.current;
      velocityRef.current = deltaX * POINTER_VELOCITY_FACTOR;
      setRotationY((prev) => prev + deltaX * POINTER_DRAG_SENSITIVITY);
      lastXRef.current = currentX;
      return;
    }

    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    // Dynamic 3D tilt
    setTiltX(relY * 9 - 3);
    setTiltZ(relX * -4);
  }, []);

  // Wheel interaction: scrolling over the gallery gently spins the cylinder horizontally
  const handleWheel = (e: React.WheelEvent) => {
    // Only spin if predominantly scrolling or deltaX exists
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (Math.abs(delta) > WHEEL_DELTA_THRESHOLD) {
      setRotationY((prev) => prev - delta * WHEEL_SPIN_SENSITIVITY);
    }
  };

  // Pointer down (start drag)
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    lastXRef.current = e.clientX;
    velocityRef.current = 0;
  };

  // Pointer up (end drag)
  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  // Step carousel by index
  const stepGallery = (direction: 'prev' | 'next') => {
    velocityRef.current = 0;
    const delta = direction === 'next' ? -angleStep : angleStep;
    setRotationY((prev) => {
      const target = Math.round((prev + delta) / angleStep) * angleStep;
      return target;
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      stepGallery('prev');
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      stepGallery('next');
    }
  };

  const currentItem = GALLERY_ITEMS[activeItemIndex] || GALLERY_ITEMS[0];

  return (
    <div
      ref={containerRef}
      role="region"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onPointerMove={handlePointerMoveContainer}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onWheel={handleWheel}
      className="relative w-full overflow-hidden select-none py-16 sm:py-24 perspective-1200 cursor-grab active:cursor-grabbing bg-gradient-to-b from-[#140718] via-[#1A0A21] to-[#140718] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D8BD91]/60"
      aria-label="3D Rolling Celebration Gallery, use left and right arrow keys to navigate"
    >
      {/* Editorial Decorative Horizon Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#D9858D] animate-ping" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#C8AD78] font-semibold">
              Spatial 3D Cylinder Installation
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#FAF7F2] tracking-tight">
            Celebrations in Continuous Motion
          </h2>
          <p className="text-sm sm:text-base text-[#FAF7F2]/80 font-light mt-1.5 max-w-xl">
            Drag horizontally, roll the wheel, or use step controls to navigate our curated portfolio of orchestrated celebrations.
          </p>
        </div>

        {/* Gallery Interactive Action & Controls */}
        <div className="flex items-center gap-4 self-start sm:self-auto no-print">
          <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-white/90 border border-[#E9E0D8] backdrop-blur-md shadow-sm">
            <button
              onClick={() => stepGallery('prev')}
              className="p-2.5 rounded-full text-[#30252D] hover:bg-[#F5E3E4]/60 transition-all active:scale-95"
              aria-label="Previous celebration"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsAutoRotating(!isAutoRotating)}
              className="p-2.5 rounded-full text-[#30252D] hover:bg-[#F5E3E4]/60 transition-all active:scale-95"
              aria-label={isAutoRotating ? 'Pause rotation' : 'Resume rotation'}
            >
              {isAutoRotating ? (
                <Pause className="w-4 h-4 text-[#C8AD78]" />
              ) : (
                <Play className="w-4 h-4 text-[#D9858D]" />
              )}
            </button>

            <button
              onClick={() => stepGallery('next')}
              className="p-2.5 rounded-full text-[#30252D] hover:bg-[#F5E3E4]/60 transition-all active:scale-95"
              aria-label="Next celebration"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 border border-[#E9E0D8] shadow-xs backdrop-blur-md">
            <span className="text-xs font-mono text-[#C8AD78] font-bold">
              0{activeItemIndex + 1}
            </span>
            <span className="text-[10px] font-mono text-[#766B70]/50">/</span>
            <span className="text-xs font-mono text-[#766B70]">10</span>
          </div>
        </div>
      </div>

      {/* 3D Scene Viewport */}
      <div
        className="relative mx-auto flex items-center justify-center my-8"
        style={{
          height: `${panelHeight + 110}px`,
        }}
      >
        {/* Overhead Dramatic Atmospheric Spotlight */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-gradient-to-b from-[#F5E3E4]/50 via-[#D8C9DF]/25 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

        {/* 3D Orbital Pedestal Ground Floor & Cast Shadow */}
        <div
          className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full pointer-events-none -z-10 transition-transform duration-200"
          style={{
            width: `${radius * 2 + 120}px`,
            height: `${radius * 2 + 120}px`,
            transform: `rotateX(78deg) rotateY(${rotationY * 0.5}deg) translateZ(-${panelHeight / 2 + 30}px)`,
            background:
              'radial-gradient(ellipse at center, rgba(217, 133, 141, 0.16) 0%, rgba(245, 227, 228, 0.5) 55%, transparent 75%)',
            border: '1.5px dashed rgba(200, 173, 120, 0.4)',
            boxShadow: '0 0 60px 15px rgba(250, 248, 243, 0.95) inset',
          }}
        />

        {/* The 3D Rotating Cylinder */}
        <div
          className="preserve-3d transition-transform duration-150 ease-out"
          style={{
            transform: `rotateX(${tiltX}deg) rotateZ(${tiltZ}deg) rotateY(${rotationY}deg)`,
            transformOrigin: '50% 50%',
            willChange: 'transform',
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {GALLERY_ITEMS.map((item, index) => {
            const itemAngle = index * angleStep;
            const Icon = item.icon;

            // Calculate relative angle to front camera
            const relativeAngle = (((itemAngle + rotationY) % 360) + 360) % 360;
            const rad = (relativeAngle * Math.PI) / 180;
            const cos = Math.cos(rad); // 1 = direct front, 0 = sides, -1 = direct back
            const isFacingFront = cos >= -0.15;
            const isFrontCenter = cos >= 0.88;

            // Scale attenuation: front panels pop forward, receding panels shrink
            const scale = cos >= 0 ? 0.88 + 0.20 * cos : Math.max(0.68, 0.88 + 0.26 * cos);

            // Opacity attenuation: back panels dim gracefully into atmospheric darkness
            const opacity = cos >= 0 ? 0.75 + 0.25 * cos : Math.max(0.12, 0.75 + 0.7 * cos);

            // Brightness & lighting: front panels catch the golden glow
            const brightness = cos >= 0 ? 0.85 + 0.25 * cos : Math.max(0.35, 0.85 + 0.55 * cos);

            // Depth of field blur: back cards soften slightly
            const blur = cos >= 0.65 ? 0 : Math.min(2.5, Math.round((1 - cos) * 1.5));

            // Strictly ordered z-index to eliminate z-fighting in CSS 3D
            const zIndex = Math.round((cos + 1) * 100);

            return (
              <div
                key={item.id}
                className="absolute left-1/2 top-1/2 rounded-3xl overflow-hidden preserve-3d group transition-all duration-300"
                style={{
                  width: `${panelWidth}px`,
                  height: `${panelHeight}px`,
                  marginLeft: `-${panelWidth / 2}px`,
                  marginTop: `-${panelHeight / 2}px`,
                  transform: `rotateY(${itemAngle}deg) translateZ(${radius}px) scale(${scale})`,
                  opacity,
                  filter: `brightness(${brightness}) blur(${blur}px)`,
                  zIndex,
                  pointerEvents: isFacingFront ? 'auto' : 'none',
                  boxShadow: isFrontCenter
                    ? '0 30px 60px -10px rgba(48, 37, 45, 0.22), 0 0 35px 2px rgba(217, 133, 141, 0.25)'
                    : '0 15px 35px -8px rgba(48, 37, 45, 0.1)',
                }}
              >
                {/* Panel Card Face */}
                <div
                  className={`w-full h-full relative rounded-3xl overflow-hidden bg-white flex flex-col justify-between transition-all duration-500 border ${
                    isFrontCenter ? 'border-[#D9858D] ring-2 ring-[#D9858D]/30' : 'border-[#E9E0D8]'
                  }`}
                >
                  {/* Image with High-Contrast Dark Gradient Overlay */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 pointer-events-none"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#30252D]/95 via-[#30252D]/40 to-black/20" />

                  {/* Specular Edge Sheen for Front Cards */}
                  {isFrontCenter && (
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#D9858D]/20 via-transparent to-white/20 pointer-events-none" />
                  )}

                  {/* Top Panel Badges */}
                  <div className="relative z-10 p-4 sm:p-5 flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-white/90 backdrop-blur-md text-[#30252D] border border-[#E9E0D8] flex items-center gap-1.5 shadow-sm">
                      <Icon className="w-3.5 h-3.5 text-[#C8AD78]" />
                      <span>{item.categoryLabel}</span>
                    </span>

                    <span className="text-[10px] font-mono text-[#C8AD78] bg-white/90 px-2 py-0.5 rounded-full border border-[#E9E0D8] shadow-xs">
                      0{index + 1}
                    </span>
                  </div>

                  {/* Bottom Caption & Action */}
                  <div className="relative z-10 p-5 sm:p-6 space-y-2.5">
                    <h3 className="font-serif text-lg sm:text-2xl font-bold text-white group-hover:text-[#D9858D] transition-colors leading-tight drop-shadow-md">
                      {item.title}
                    </h3>
                    <p className="text-xs text-white/90 font-light line-clamp-2 leading-relaxed">
                      {item.subtitle}
                    </p>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectEvent(item.eventType);
                      }}
                      className={`mt-3 w-full py-2.5 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 backdrop-blur-md transition-all shadow-md ${
                        isFrontCenter
                          ? 'bg-[#D9858D] hover:bg-[#E29DA3] text-white font-bold'
                          : 'bg-white/90 hover:bg-white text-[#30252D] border border-[#E9E0D8]'
                      }`}
                    >
                      <span>Plan This Celebration</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Focused Card Detail Capsule */}
      <div className="max-w-2xl mx-auto px-4 mt-4 text-center space-y-2">
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#240E2E]/90 border border-[#D8BD91]/30 text-xs text-[#FAF7F2] shadow-lg backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-[#D8BD91]" />
          <span>Currently in focus:</span>
          <span className="font-bold text-[#E88D83]">{currentItem.title}</span>
          <span className="text-[#FAF7F2]/50 font-mono">({currentItem.categoryLabel})</span>
        </div>
        <p className="text-xs text-[#FAF7F2]/65 font-light">
          Drag horizontally, swipe, or roll the wheel to orbit through all 10 curated celebration models.
        </p>
      </div>
    </div>
  );
};
