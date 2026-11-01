'use client';

import React, { useState } from 'react';
import { SavedEvent } from '@/types/event';
import {
  TableSetting3DViewer,
  TableSettingConfig,
  TableShape,
  FloralStyle,
  DinnerwareStyle,
  LightingMood,
} from '@/components/3d/TableSetting3DViewer';
import {
  Check,
  Flame,
  Sun,
  Moon,
  Save,
  Sliders,
} from 'lucide-react';

interface EventDesignStudioProps {
  event?: SavedEvent;
  onSaveDecor?: (config: TableSettingConfig, themeTitle: string) => void;
  onShowToast?: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

const THEME_PRESETS: {
  id: string;
  name: string;
  description: string;
  config: TableSettingConfig;
}[] = [
  {
    id: 'regal-velvet',
    name: 'Regal Velvet & Gold',
    description: 'Deep plum linens, brushed gold flatware & lush English garden roses with ambient candlelight',
    config: {
      shape: 'round',
      linenColor: '#30252D',
      floralStyle: 'garden-rose',
      dinnerwareStyle: 'gold',
      lightingMood: 'candlelit',
    },
  },
  {
    id: 'botanical-sage',
    name: 'Botanical Eden & Sage',
    description: 'Soft sage linens, platinum flatware & sculptural white orchids in ceramic vessels',
    config: {
      shape: 'imperial',
      linenColor: '#A8B69A',
      floralStyle: 'minimal-orchid',
      dinnerwareStyle: 'silver',
      lightingMood: 'twilight',
    },
  },
  {
    id: 'coral-romance',
    name: 'Coral Sunset Romance',
    description: 'Muted coral linens, rose-gold accents & cascading rose clusters in golden-hour glow',
    config: {
      shape: 'round',
      linenColor: '#D9858D',
      floralStyle: 'garden-rose',
      dinnerwareStyle: 'rose-gold',
      lightingMood: 'golden-hour',
    },
  },
  {
    id: 'champagne-minimalist',
    name: 'Champagne Silk Minimalist',
    description: 'Ivory damask, evergreen garland & flickering taper candles for pure timeless poise',
    config: {
      shape: 'imperial',
      linenColor: '#FAF8F3',
      floralStyle: 'candlelit-evergreen',
      dinnerwareStyle: 'gold',
      lightingMood: 'candlelit',
    },
  },
];

const LINEN_OPTIONS = [
  { hex: '#30252D', label: 'Deep Plum Velvet' },
  { hex: '#FAF8F3', label: 'Warm Ivory Damask' },
  { hex: '#D9858D', label: 'Muted Coral Silk' },
  { hex: '#A8B69A', label: 'Soft Sage Linen' },
  { hex: '#E8DCC2', label: 'Champagne Satin' },
];

export const EventDesignStudio: React.FC<EventDesignStudioProps> = ({
  event,
  onSaveDecor,
  onShowToast,
}) => {
  const [activeConfig, setActiveConfig] = useState<TableSettingConfig>({
    shape: 'round',
    linenColor: '#30252D',
    floralStyle: 'garden-rose',
    dinnerwareStyle: 'gold',
    lightingMood: 'candlelit',
  });
  const [selectedThemeName, setSelectedThemeName] = useState<string>('Regal Velvet & Gold');

  const applyPreset = (preset: (typeof THEME_PRESETS)[number]) => {
    setActiveConfig(preset.config);
    setSelectedThemeName(preset.name);
    if (onShowToast) {
      onShowToast(`Applied aesthetic preset: "${preset.name}"`, 'info');
    }
  };

  const handleSave = () => {
    if (onSaveDecor) {
      onSaveDecor(activeConfig, selectedThemeName);
    }
    if (onShowToast) {
      onShowToast(`Decor & table architecture saved to "${event?.title || 'Celebration'}"!`, 'success');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E9E0D8] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-[#D9858D] animate-ping" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#C8AD78] font-bold">
              Spatial Decor Visualizer
            </span>
          </div>
          <h2 className="font-serif text-3xl font-bold text-[#30252D]">
            3D Event Design Studio
          </h2>
          <p className="text-xs sm:text-sm text-[#766B70] mt-1 font-light max-w-xl">
            Calibrate table architecture, floral installations, linen colorways, and ambient dinnerware lighting with real-time 3D feedback.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          <button
            onClick={handleSave}
            className="px-6 py-3.5 rounded-2xl bg-[#D9858D] hover:bg-[#E29DA3] text-white font-bold text-xs tracking-wider uppercase flex items-center gap-2 shadow-[0_10px_25px_rgba(217,133,141,0.35)] hover:shadow-[0_15px_35px_rgba(217,133,141,0.5)] transition-all transform hover:-translate-y-0.5"
          >
            <Save className="w-4 h-4" />
            <span>Apply to Blueprint</span>
          </button>
        </div>
      </div>

      {/* Preset Curations Carousel */}
      <div className="space-y-3">
        <span className="text-xs font-mono uppercase tracking-wider text-[#766B70] font-semibold block px-1">
          Curated Atelier Themes
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {THEME_PRESETS.map((preset) => {
            const isSelected = selectedThemeName === preset.name;
            return (
              <button
                key={preset.id}
                onClick={() => applyPreset(preset)}
                className={`p-4 rounded-2xl text-left border transition-all ${
                  isSelected
                    ? 'bg-white border-[#D9858D] shadow-[0_10px_30px_rgba(217,133,141,0.18)] ring-2 ring-[#D9858D]/30'
                    : 'bg-white/80 hover:bg-white border-[#E9E0D8] hover:border-[#D9858D]/40'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="w-4 h-4 rounded-full border border-black/10"
                    style={{ backgroundColor: preset.config.linenColor }}
                  />
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#D9858D]" />}
                </div>
                <h3 className="font-serif text-sm font-bold text-[#30252D]">
                  {preset.name}
                </h3>
                <p className="text-[11px] text-[#766B70] mt-1 font-light line-clamp-2">
                  {preset.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive 3D Canvas & Customization Palette */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: 3D Interactive Table Model */}
        <div className="lg:col-span-7 space-y-4">
          <TableSetting3DViewer config={activeConfig} />

          {/* Quick Metrics Bar below Canvas */}
          <div className="p-4 rounded-2xl bg-white border border-[#E9E0D8] shadow-xs grid grid-cols-3 gap-4 text-center">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#C8AD78] font-bold block">Table Top</span>
              <span className="text-xs font-semibold text-[#30252D] capitalize">
                {activeConfig.shape} Banquet
              </span>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-[#C8AD78] font-bold block">Centerpiece</span>
              <span className="text-xs font-semibold text-[#30252D] capitalize">
                {activeConfig.floralStyle.replace('-', ' ')}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-[#C8AD78] font-bold block">Atmosphere</span>
              <span className="text-xs font-semibold text-[#D9858D] capitalize">
                {activeConfig.lightingMood}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Customization Controls */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-[#E9E0D8] shadow-xs space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b border-[#E9E0D8]">
            <Sliders className="w-4 h-4 text-[#D9858D]" />
            <h3 className="font-serif text-lg font-bold text-[#30252D]">
              Fine-Tune Decor Parameters
            </h3>
          </div>

          {/* 1. Table Architecture */}
          <div className="space-y-2.5">
            <label className="text-xs font-mono uppercase tracking-wider text-[#766B70] font-semibold block">
              1. Table Geometry
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'round' as TableShape, label: 'Round (10-Top)' },
                { id: 'imperial' as TableShape, label: 'Imperial (16-Top)' },
                { id: 'cocktail' as TableShape, label: 'Cocktail High' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setActiveConfig((prev) => ({ ...prev, shape: opt.id }))}
                  className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all text-center ${
                    activeConfig.shape === opt.id
                      ? 'bg-[#30252D] text-white border-[#30252D] shadow-xs'
                      : 'bg-[#FAF8F3] text-[#766B70] border-[#E9E0D8] hover:border-[#D9858D]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Linen Colorways */}
          <div className="space-y-2.5">
            <label className="text-xs font-mono uppercase tracking-wider text-[#766B70] font-semibold block">
              2. Linen & Tablecloth Textile
            </label>
            <div className="flex flex-wrap gap-2.5">
              {LINEN_OPTIONS.map((linen) => {
                const isSelected = activeConfig.linenColor.toLowerCase() === linen.hex.toLowerCase();
                return (
                  <button
                    key={linen.hex}
                    onClick={() => setActiveConfig((prev) => ({ ...prev, linenColor: linen.hex }))}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                      isSelected
                        ? 'border-[#D9858D] bg-[#F5E3E4]/50 text-[#30252D] ring-2 ring-[#D9858D]/30'
                        : 'border-[#E9E0D8] bg-[#FAF8F3] text-[#766B70] hover:border-[#D9858D]/50'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/15 shadow-xs"
                      style={{ backgroundColor: linen.hex }}
                    />
                    <span>{linen.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Floral Centerpiece Style */}
          <div className="space-y-2.5">
            <label className="text-xs font-mono uppercase tracking-wider text-[#766B70] font-semibold block">
              3. Floral & Botanical Style
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'garden-rose' as FloralStyle, label: 'Garden English Roses' },
                { id: 'minimal-orchid' as FloralStyle, label: 'Minimalist Orchids' },
                { id: 'candlelit-evergreen' as FloralStyle, label: 'Candlelit Evergreen' },
                { id: 'pampas-wild' as FloralStyle, label: 'Pampas Botanical' },
              ].map((style) => (
                <button
                  key={style.id}
                  onClick={() => setActiveConfig((prev) => ({ ...prev, floralStyle: style.id }))}
                  className={`py-2 px-3 rounded-xl text-xs font-medium border text-left transition-all ${
                    activeConfig.floralStyle === style.id
                      ? 'bg-[#30252D] text-white border-[#30252D] shadow-xs'
                      : 'bg-[#FAF8F3] text-[#766B70] border-[#E9E0D8] hover:border-[#D9858D]'
                  }`}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Dinnerware Metal Finish */}
          <div className="space-y-2.5">
            <label className="text-xs font-mono uppercase tracking-wider text-[#766B70] font-semibold block">
              4. Dinnerware & Cutlery Finish
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'gold' as DinnerwareStyle, label: 'Brushed Gold', color: '#D4AF37' },
                { id: 'silver' as DinnerwareStyle, label: 'Platinum Silver', color: '#C0C0C0' },
                { id: 'rose-gold' as DinnerwareStyle, label: 'Rose Gold', color: '#B76E79' },
              ].map((dw) => (
                <button
                  key={dw.id}
                  onClick={() => setActiveConfig((prev) => ({ ...prev, dinnerwareStyle: dw.id }))}
                  className={`py-2 px-2.5 rounded-xl text-xs font-medium border transition-all flex items-center justify-center gap-1.5 ${
                    activeConfig.dinnerwareStyle === dw.id
                      ? 'bg-[#30252D] text-white border-[#30252D] shadow-xs'
                      : 'bg-[#FAF8F3] text-[#766B70] border-[#E9E0D8] hover:border-[#D9858D]'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: dw.color }} />
                  <span>{dw.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 5. Ambient Lighting Mood */}
          <div className="space-y-2.5">
            <label className="text-xs font-mono uppercase tracking-wider text-[#766B70] font-semibold block">
              5. Ambient Event Lighting
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'candlelit' as LightingMood, label: 'Candlelight', icon: Flame },
                { id: 'golden-hour' as LightingMood, label: 'Golden Hour', icon: Sun },
                { id: 'twilight' as LightingMood, label: 'Twilight Dusk', icon: Moon },
              ].map((light) => {
                const Icon = light.icon;
                return (
                  <button
                    key={light.id}
                    onClick={() => setActiveConfig((prev) => ({ ...prev, lightingMood: light.id }))}
                    className={`py-2 px-2 rounded-xl text-xs font-medium border transition-all flex items-center justify-center gap-1.5 ${
                      activeConfig.lightingMood === light.id
                        ? 'bg-[#30252D] text-white border-[#30252D] shadow-xs'
                        : 'bg-[#FAF8F3] text-[#766B70] border-[#E9E0D8] hover:border-[#D9858D]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 text-[#D9858D]" />
                    <span>{light.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
