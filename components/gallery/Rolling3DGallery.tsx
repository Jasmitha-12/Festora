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

interface Rolling3DGalleryProps {
  onSelectEvent: (type: EventType) => void;
}

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
  const [tiltX, setTiltX] = useState(-3);
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
        setPanelWidth(200);
        setPanelHeight(280);
      } else if (width < 1024) {
        setRadius(430);
        setPanelWidth(240);
        setPanelHeight(330);
      } else {
        setRadius(540);
        setPanelWidth(280);
        setPanelHeight(390);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Smooth continuous animation loop
  useEffect(() => {
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      // Handle inertia if dragging just ended
      if (!isDraggingRef.current && Math.abs(velocityRef.current) > 0.05) {
        setRotationY((prev) => prev + velocityRef.current);
        velocityRef.current *= 0.94; // Inertia damping
      } else if (isAutoRotating && !isHovered && !isDraggingRef.current) {
        // Continuous graceful auto-rotation (approx ~7.5 degrees per second)
        const speed = 7.5;
        setRotationY((prev) => prev - speed * delta);
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isAutoRotating, isHovered]);

  // Pointer move tilt parallax (subtle 3D angle follows mouse)
  const handlePointerMoveContainer = useCallback((e: React.PointerEvent) => {
    if (isDraggingRef.current) {
      const currentX = e.clientX;
      const deltaX = currentX - lastXRef.current;
      velocityRef.current = deltaX * 0.35;
      setRotationY((prev) => prev + deltaX * 0.4);
      lastXRef.current = currentX;
      return;
    }

    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    // Limit tilt range to subtle -7deg to +3deg
    setTiltX(relY * 10 - 2);
  }, []);

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

  const currentItem = GALLERY_ITEMS[activeItemIndex] || GALLERY_ITEMS[0];

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMoveContainer}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      className="relative w-full overflow-hidden select-none py-12 sm:py-16 perspective-1200 cursor-grab active:cursor-grabbing"
      aria-label="3D Rolling Celebration Gallery"
    >
      {/* Editorial Decorative Horizon Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-[#E88D83] animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#D8BD91] font-semibold">
              Interactive 3D Cylinder Installation
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#FAF7F2]">
            Celebrations in Continuous Motion
          </h2>
          <p className="text-xs sm:text-sm text-[#FAF7F2]/75 font-light mt-1">
            Drag horizontally or use controls to rotate through orchestrated weddings, milestone birthdays, and community festivals.
          </p>
        </div>

        {/* Gallery Interactive Action & Controls */}
        <div className="flex items-center gap-3 self-start sm:self-auto no-print">
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-[#1E1120]/80 editorial-border-light backdrop-blur-md">
            <button
              onClick={() => stepGallery('prev')}
              className="p-2 rounded-full text-[#FAF7F2] hover:bg-white/10 transition-colors"
              aria-label="Previous celebration"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsAutoRotating(!isAutoRotating)}
              className="p-2 rounded-full text-[#FAF7F2] hover:bg-white/10 transition-colors"
              aria-label={isAutoRotating ? 'Pause rotation' : 'Resume rotation'}
            >
              {isAutoRotating ? <Pause className="w-3.5 h-3.5 text-[#D8BD91]" /> : <Play className="w-3.5 h-3.5 text-[#E88D83]" />}
            </button>

            <button
              onClick={() => stepGallery('next')}
              className="p-2 rounded-full text-[#FAF7F2] hover:bg-white/10 transition-colors"
              aria-label="Next celebration"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <span className="text-xs font-mono text-[#D8BD91] font-bold px-3 py-1 rounded-full bg-[#1E1120]/70 border border-[#D8BD91]/25">
            0{activeItemIndex + 1} / 10
          </span>
        </div>
      </div>

      {/* 3D Scene Viewport */}
      <div
        className="relative mx-auto flex items-center justify-center my-6"
        style={{
          height: `${panelHeight + 80}px`,
        }}
      >
        {/* Subtle background glow anchor behind cylinder */}
        <div className="absolute w-[500px] h-[300px] bg-gradient-to-r from-[#E88D83]/15 via-[#D8BD91]/10 to-[#8F7696]/15 rounded-full blur-3xl pointer-events-none -z-10 animate-glow" />

        {/* The 3D Rotating Cylinder */}
        <div
          className="preserve-3d transition-transform duration-100 ease-out"
          style={{
            transform: `rotateX(${tiltX}deg) rotateY(${rotationY}deg)`,
            transformOrigin: '50% 50%',
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {GALLERY_ITEMS.map((item, index) => {
            const itemAngle = index * angleStep;
            const Icon = item.icon;
            const isCurrent = index === activeItemIndex;

            return (
              <div
                key={item.id}
                className="absolute left-1/2 top-1/2 rounded-2xl overflow-hidden preserve-3d group transition-all duration-300"
                style={{
                  width: `${panelWidth}px`,
                  height: `${panelHeight}px`,
                  marginLeft: `-${panelWidth / 2}px`,
                  marginTop: `-${panelHeight / 2}px`,
                  transform: `rotateY(${itemAngle}deg) translateZ(${radius}px)`,
                  boxShadow: isCurrent
                    ? '0 25px 60px -12px rgba(0, 0, 0, 0.7), 0 0 35px 2px rgba(232, 141, 131, 0.3)'
                    : '0 15px 35px -8px rgba(0, 0, 0, 0.5)',
                }}
              >
                {/* Panel Card Face */}
                <div className="w-full h-full relative rounded-2xl overflow-hidden border border-white/20 bg-[#1E1120] flex flex-col justify-between">
                  {/* Image with Dark Gradient Overlay */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 pointer-events-none"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#160B18]/95 via-[#160B18]/40 to-black/20" />

                  {/* Top Panel Badges */}
                  <div className="relative z-10 p-4 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-black/60 backdrop-blur-md text-[#FAF7F2] border border-white/15 flex items-center gap-1.5">
                      <Icon className="w-3 h-3 text-[#D8BD91]" />
                      <span>{item.categoryLabel}</span>
                    </span>

                    <span className="text-[10px] font-mono text-white/70 bg-black/40 px-2 py-0.5 rounded-full">
                      0{index + 1}
                    </span>
                  </div>

                  {/* Bottom Caption & Action */}
                  <div className="relative z-10 p-5 space-y-2">
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-white group-hover:text-[#E88D83] transition-colors leading-snug drop-shadow-sm">
                      {item.title}
                    </h3>
                    <p className="text-xs text-white/80 font-light line-clamp-2">
                      {item.subtitle}
                    </p>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectEvent(item.eventType);
                      }}
                      className="mt-2 w-full py-2 px-3 rounded-xl bg-white/10 hover:bg-white text-white hover:text-[#1E1120] border border-white/20 text-[11px] font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 backdrop-blur-md transition-all shadow-sm"
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
      <div className="max-w-2xl mx-auto px-4 mt-2 text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1E1120]/80 editorial-border-light text-xs text-[#FAF7F2]">
          <Sparkles className="w-3.5 h-3.5 text-[#D8BD91]" />
          <span>Currently in focus:</span>
          <span className="font-bold text-[#E88D83]">{currentItem.title}</span>
          <span className="text-[#FAF7F2]/50 font-mono">({currentItem.categoryLabel})</span>
        </div>
        <p className="text-xs text-[#FAF7F2]/65 font-light">
          Drag horizontally across the cylinder or swipe on touch screens to explore all 10 orchestrated celebrations.
        </p>
      </div>

    </div>
  );
};
