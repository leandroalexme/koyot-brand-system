import React from 'react';
import { useBrandSystem } from '../../context/BrandSystemContext';
import { BRAND_PRESETS } from '../../constants';
import { BrandLogoMark } from '../Specimens/BrandLogoMark';
import {
  Sparkles,
  BookOpen,
  LayoutGrid,
  Play,
  Scan,
  Sun,
  Moon,
  SlidersHorizontal,
  Terminal,
  RotateCcw,
} from 'lucide-react';

export const TopBrandBar: React.FC = () => {
  const {
    tokens,
    activeMode,
    setActivePageId,
    pages,
    isInspectMode,
    setIsInspectMode,
    setSelectedTarget,
    canvasDarkAppearance,
    toggleCanvasAppearance,
    studioOpen,
    setStudioOpen,
    setExportModalPrimitive,
    resetTokensToPreset,
    resetAllToDefault,
  } = useBrandSystem();

  const handleSwitchMode = (mode: 'overview' | 'guideline' | 'components') => {
    const target = pages.find((p) => p.mode === mode);
    if (target) {
      setActivePageId(target.id);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/80 dark:bg-zinc-950/80 border-b border-zinc-200/80 dark:border-zinc-800/80 transition-colors">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
        {/* Left Section: Brand Logo & Preset Switcher */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center shadow-sm transition-all"
              style={{
                backgroundColor: tokens.primaryColor,
                color: '#FFFFFF',
              }}
            >
              <BrandLogoMark logoId={tokens.logoId} color="#FFFFFF" size={18} />
            </div>
            <div className="hidden sm:block">
              <span className="text-sm font-bold text-zinc-900 dark:text-white tracking-tight block leading-tight">
                {tokens.brandName}
              </span>
              <span className="text-[11px] text-zinc-400 font-mono block leading-none">
                Living Brand OS
              </span>
            </div>
          </div>

          <div className="h-4 w-[1px] bg-zinc-200 dark:bg-zinc-800 hidden sm:block" />

          {/* Quick Preset Selector */}
          <select
            value={tokens.stylePresetName}
            onChange={(e) => resetTokensToPreset(e.target.value)}
            className="text-xs font-medium text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200/70 dark:hover:bg-zinc-800 rounded-lg px-2.5 py-1.5 border border-zinc-200/60 dark:border-zinc-800 cursor-pointer transition focus:outline-none"
            title="Mudar Preset de Marca"
          >
            {Object.keys(BRAND_PRESETS).map((presetKey) => {
              const preset = BRAND_PRESETS[presetKey];
              return (
                <option key={presetKey} value={preset.stylePresetName}>
                  {preset.brandName} ({preset.stylePresetName})
                </option>
              );
            })}
          </select>
        </div>

        {/* Center Section: Segmented Mode Selector */}
        <nav className="flex items-center bg-zinc-100/90 dark:bg-zinc-900/90 p-1 rounded-xl border border-zinc-200/60 dark:border-zinc-800 shadow-inner">
          <button
            onClick={() => handleSwitchMode('overview')}
            className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
              activeMode === 'overview'
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Overview</span>
          </button>

          <button
            onClick={() => handleSwitchMode('guideline')}
            className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
              activeMode === 'guideline'
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Diretrizes</span>
          </button>

          <button
            onClick={() => handleSwitchMode('components')}
            className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
              activeMode === 'components'
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Componentes</span>
          </button>
        </nav>

        {/* Right Section: Actions, Inspect Pill, Studio & Theme */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Dual Play / Inspect Switcher */}
          <div className="flex items-center bg-zinc-100 dark:bg-zinc-900 p-0.5 rounded-xl border border-zinc-200/60 dark:border-zinc-800">
            <button
              onClick={() => {
                setIsInspectMode(false);
                setSelectedTarget(null);
              }}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1 text-xs font-medium transition ${
                !isInspectMode
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
              }`}
              title="Modo Interativo (Testar componentes)"
            >
              <Play className="w-3 h-3 fill-current" />
              <span className="hidden md:inline">Play</span>
            </button>
            <button
              onClick={() => setIsInspectMode(true)}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1 text-xs font-medium transition ${
                isInspectMode
                  ? 'bg-[#D946EF] text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
              }`}
              title="Modo de Inspeção (Editar tokens por elemento)"
            >
              <Scan className="w-3 h-3" />
              <span className="hidden md:inline">Inspect</span>
            </button>
          </div>

          {/* Canvas Dark/Light Toggle */}
          <button
            onClick={toggleCanvasAppearance}
            className="p-1.5 rounded-xl text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
            title={canvasDarkAppearance ? 'Modo Claro' : 'Modo Escuro'}
          >
            {canvasDarkAppearance ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>

          {/* CLI Registry Export Button */}
          <button
            onClick={() => setExportModalPrimitive('all')}
            className="px-2.5 py-1.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:opacity-90 flex items-center gap-1.5 text-xs font-medium shadow-sm transition"
            title="Exportar Shadcn Registry CLI"
          >
            <Terminal className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600" />
            <span className="hidden lg:inline">CLI</span>
          </button>

          {/* Reset All to Default */}
          <button
            onClick={() => {
              if (window.confirm('Deseja restaurar todas as configurações e blocos para o padrão original?')) {
                resetAllToDefault();
              }
            }}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition hidden sm:flex"
            title="Restaurar Padrão da Marca"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Brand Studio Toggle Button */}
          <button
            onClick={() => setStudioOpen(!studioOpen)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 border transition ${
              studioOpen
                ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900 dark:border-white shadow-sm'
                : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50'
            }`}
            title="Abrir/Fechar Brand Studio"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Studio</span>
          </button>
        </div>
      </div>
    </header>
  );
};
