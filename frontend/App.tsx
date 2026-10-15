import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  BrandSystemProvider,
  useBrandSystem,
} from './context/BrandSystemContext';
import { TopBrandBar } from './components/Navigation/TopBrandBar';
import { BlockRenderer } from './components/Blocks/BlockRenderer';
import { BrandStudioPanel } from './components/BrandStudioPanel';
import { ShadcnExportModal } from './components/ShadcnExportModal';
import { AddBlockModal } from './components/Modals/AddBlockModal';
import { BLOCK_CATALOG } from './constants';
import { getUnifiedBlockCatalog } from './sdk/block';
import {
  BlockType,
  BlockCategory,
  ColumnLayout,
} from './types';
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Sparkles,
  BookOpen,
  LayoutGrid,
} from 'lucide-react';

const CATEGORY_LABELS: Record<string, string> = {
  identity: 'Identity Block',
  typography: 'Typography Block',
  color: 'Color Block',
  mockups: 'Mockups & Touchpoints',
  applications: 'Applications Block',
  rules: 'Rules Block',
  content: 'Content Block',
  frame: 'Frame Block',
};

function AppContent() {
  const {
    tokens,
    pages,
    activePage,
    activePageId,
    setActivePageId,
    isInspectMode,
    selectedTarget,
    setSelectedTarget,
    hoveredBlockId,
    setHoveredBlockId,
    studioOpen,
    setStudioOpen,
    canvasDarkAppearance,
    setAddBlockModalOpen,
    exportModalPrimitive,
    setExportModalPrimitive,
    activeComponentId,
    setActiveComponentId,
    allPrimitiveOverrides,
    policies,
    handleMoveRow,
    handleDeleteRow,
    handleUpdateBlock,
    handleCycleBlockTheme,
    handleChangeBlockType,
  } = useBrandSystem();

  const unifiedCatalog = useMemo(() => getUnifiedBlockCatalog(), []);
  const [editingPageId, setEditingPageId] = useState<string | null>(null);

  // Smart Canvas Width Guard
  const canvasStageRef = useRef<HTMLDivElement | null>(null);
  const [stageWidth, setStageWidth] = useState<number>(1000);

  useEffect(() => {
    const el = canvasStageRef.current;
    if (!el) return;

    let rafId: number | null = null;
    const ro = new ResizeObserver(() => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const w = el.clientWidth;
        if (w > 0) {
          setStageWidth((prev) => (Math.abs(prev - w) > 4 ? w : prev));
        }
      });
    });
    ro.observe(el);
    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, []);

  const overviewPage = pages.find((p) => p.id === 'overview')!;
  const componentsPage = pages.find((p) => p.id === 'components')!;
  const guidelinePages = pages.filter((p) => p.mode === 'guideline');

  const getRowGridClass = (layout: ColumnLayout) => {
    switch (layout) {
      case '1-col':
        return 'grid-cols-1 grid-rows-1 h-full min-h-0';
      case '2-col-50-50':
        return 'grid-cols-1 md:grid-cols-2 grid-rows-2 md:grid-rows-1 h-full min-h-0';
      case '2-col-66-33':
        return 'grid-cols-1 md:grid-cols-12 grid-rows-2 md:grid-rows-1 h-full min-h-0';
      case '2-col-33-66':
        return 'grid-cols-1 md:grid-cols-12 grid-rows-2 md:grid-rows-1 h-full min-h-0';
      case '3-col':
        return 'grid-cols-1 md:grid-cols-3 grid-rows-3 md:grid-rows-1 h-full min-h-0';
      case '4-col':
        return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4 grid-rows-4 sm:grid-rows-2 md:grid-rows-1 h-full min-h-0';
      case '2x2':
        return 'grid-cols-1 md:grid-cols-2 grid-rows-4 md:grid-rows-2 h-full min-h-0';
      default:
        return 'grid-cols-1 grid-rows-1 h-full min-h-0';
    }
  };

  const getBlockColSpanClass = (layout: ColumnLayout, index: number) => {
    if (layout === '2-col-66-33') {
      return index === 0 ? 'md:col-span-8 h-full min-h-0' : 'md:col-span-4 h-full min-h-0';
    }
    if (layout === '2-col-33-66') {
      return index === 0 ? 'md:col-span-4 h-full min-h-0' : 'md:col-span-8 h-full min-h-0';
    }
    return 'h-full min-h-0';
  };

  return (
    <div
      className={`min-h-screen font-['Inter',sans-serif] transition-colors duration-300 ${
        canvasDarkAppearance ? 'bg-[#09090B] text-white' : 'bg-[#F2F2F0] text-zinc-950'
      }`}
    >
      {/* 1. TOP BRAND HEADER (Replaces the floating bottom dock) */}
      <TopBrandBar />

      {/* 2. FIXED LEFT SUB-PAGE SIDEBAR */}
      <aside className="w-full lg:w-48 lg:fixed lg:top-20 lg:left-6 z-30 select-none px-4 pt-4 lg:p-0">
        <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
          {/* Section: Overview */}
          <button
            onClick={() => setActivePageId(overviewPage.id)}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs transition flex items-center justify-between shrink-0 ${
              activePageId === overviewPage.id
                ? 'bg-white text-zinc-950 font-medium shadow-sm'
                : 'text-zinc-500 hover:text-zinc-900 hover:bg-black/[0.03]'
            }`}
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{overviewPage.label}</span>
            </div>
          </button>

          <div className="hidden lg:block h-px bg-zinc-200/80 my-2 mx-3 shrink-0" />

          {/* Section: Diretrizes Sub-pages */}
          <div className="hidden lg:flex items-center justify-between px-3 py-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
              Diretrizes
            </span>
          </div>

          <div className="flex lg:flex-col gap-0.5">
            {guidelinePages.map((page) => {
              const isActive = activePageId === page.id;
              const isEditing = editingPageId === page.id;

              return (
                <div
                  key={page.id}
                  className={`group flex items-center justify-between rounded-xl px-3 py-2 text-xs transition shrink-0 ${
                    isActive
                      ? 'bg-white text-zinc-950 font-medium shadow-sm'
                      : 'text-zinc-500 hover:text-zinc-900 hover:bg-black/[0.03]'
                  }`}
                >
                  <button
                    onClick={() => setActivePageId(page.id)}
                    className="text-left flex-1 truncate flex items-center gap-2"
                  >
                    <BookOpen className="w-3 h-3 text-zinc-400" />
                    <span>{page.label}</span>
                  </button>
                </div>
              );
            })}
          </div>

          <div className="hidden lg:block h-px bg-zinc-200/80 my-2 mx-3 shrink-0" />

          {/* Section: Componentes */}
          <button
            onClick={() => setActivePageId(componentsPage.id)}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs transition flex items-center justify-between shrink-0 ${
              activePageId === componentsPage.id
                ? 'bg-white text-zinc-950 font-medium shadow-sm'
                : 'text-zinc-500 hover:text-zinc-900 hover:bg-black/[0.03]'
            }`}
          >
            <div className="flex items-center gap-2">
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>{componentsPage.label}</span>
            </div>
          </button>
        </nav>
      </aside>

      {/* 3. FIXED RIGHT BRAND STUDIO & CONTEXTUAL INSPECTOR */}
      {studioOpen && (
        <div className="w-full lg:w-[320px] lg:fixed lg:top-20 lg:right-6 z-30 px-4 mt-4 lg:p-0 lg:mt-0">
          <BrandStudioPanel />
        </div>
      )}

      {/* 4. CENTER SCROLLABLE BENTO EDITORIAL CANVAS */}
      <main
        className={`pt-6 pb-16 px-4 sm:px-6 lg:pl-[236px] transition-all duration-300 ${
          studioOpen ? 'lg:pr-[364px]' : 'lg:pr-8'
        }`}
      >
        <div ref={canvasStageRef} className="max-w-[1240px] mx-auto w-full">
          <div className="space-y-5">
            {activePage.rows.map((row, rowIdx) => {
              const pageNumber = String(rowIdx + 1).padStart(2, '0');
              return (
                <article
                  key={row.id}
                  className="brand-sheet group/row relative w-full flex flex-col justify-between mb-8 sm:mb-12"
                >
                  {/* Subtle Presentation Sheet Header (GMR / Cicely Brand Guidelines Style) */}
                  <div className="flex items-center justify-between mb-2 px-1 text-[11px] font-mono tracking-wider text-zinc-400 select-none">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-zinc-800 dark:text-zinc-200">
                        SHEET {pageNumber}
                      </span>
                      <span className="opacity-30">/</span>
                      <span className="uppercase text-[10px] tracking-widest">{activePage.label}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isInspectMode && (
                        <div className="flex items-center gap-1 opacity-0 group-hover/row:opacity-100 transition">
                          <button
                            onClick={() => handleMoveRow(rowIdx, 'up')}
                            disabled={rowIdx === 0}
                            className="p-1 rounded bg-white text-zinc-500 hover:text-zinc-900 disabled:opacity-30 shadow-sm"
                            title="Mover Página Acima"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleMoveRow(rowIdx, 'down')}
                            disabled={rowIdx === activePage.rows.length - 1}
                            className="p-1 rounded bg-white text-zinc-500 hover:text-zinc-900 disabled:opacity-30 shadow-sm"
                            title="Mover Página Abaixo"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDeleteRow(row.id)}
                            className="p-1 rounded bg-white text-rose-500 hover:bg-rose-50 shadow-sm"
                            title="Remover Página"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                      <span className="text-[10px] font-mono uppercase tracking-[0.2em] opacity-40 hidden sm:inline">
                        16:9 PRESENTATION
                      </span>
                    </div>
                  </div>

                  {/* Canonical Fixed Height Presentation Sheet (All blocks share exact identical height) */}
                  <div className="w-full h-[560px] sm:h-[600px] md:h-[620px] flex flex-col overflow-hidden">
                    <div
                      className={`grid gap-4 w-full h-full min-h-0 items-stretch ${getRowGridClass(
                        row.layout
                      )}`}
                    >
                  {row.blocks.map((block, blkIdx) => {
                    const isBlockSelected =
                      selectedTarget?.blockId === block.id &&
                      !selectedTarget?.subElementId;
                    const isBlockHovered =
                      isInspectMode && hoveredBlockId === block.id;

                    return (
                      <div
                        key={block.id}
                        onMouseEnter={() => setHoveredBlockId(block.id)}
                        onMouseLeave={() =>
                          setHoveredBlockId((prev) =>
                            prev === block.id ? null : prev
                          )
                        }
                        onClick={() => {
                          if (!isInspectMode) return;
                          setStudioOpen(true);
                          setSelectedTarget({
                            rowId: row.id,
                            blockId: block.id,
                            componentLabel: block.title,
                            variantState: 'Default',
                          });
                        }}
                        className={`group/block relative flex flex-col min-w-0 min-h-0 rounded-[24px] transition h-full overflow-hidden ${getBlockColSpanClass(
                          row.layout,
                          blkIdx
                        )} ${
                          isBlockSelected
                            ? 'ring-2 ring-[#D946EF]'
                            : isBlockHovered
                            ? 'ring-1 ring-[#D946EF]/80 cursor-pointer'
                            : ''
                        }`}
                      >
                        {/* Top-left Magenta Inspector Tag */}
                        {(isBlockSelected || isBlockHovered) && (
                          <div className="absolute -top-2.5 left-4 z-30 flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#D946EF] text-white text-[10px] font-medium shadow-sm pointer-events-none">
                            <span>{block.title}</span>
                          </div>
                        )}

                        {isInspectMode && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="mb-1.5 flex items-center justify-between gap-2 opacity-0 group-hover/block:opacity-100 transition shrink-0"
                          >
                            <select
                              value={block.type}
                              onChange={(e) =>
                                handleChangeBlockType(
                                  row.id,
                                  block.id,
                                  e.target.value as BlockType
                                )
                              }
                              className="bg-white rounded-lg px-2.5 py-1 text-[11px] text-zinc-600 focus:outline-none cursor-pointer shadow-sm"
                            >
                              {unifiedCatalog.map((item) => (
                                <option key={item.type} value={item.type}>
                                  [{CATEGORY_LABELS[item.category as BlockCategory] || item.category}] {item.label}
                                </option>
                              ))}
                            </select>

                            <button
                              onClick={() =>
                                handleCycleBlockTheme(row.id, block.id)
                              }
                              className="px-2.5 py-1 rounded-lg bg-white text-[11px] text-zinc-500 hover:text-zinc-900 capitalize shadow-sm shrink-0"
                            >
                              {block.theme}
                            </button>
                          </div>
                        )}

                        <div className="flex-1 min-w-0 min-h-0 flex flex-col h-full w-full overflow-hidden">
                          <BlockRenderer
                            block={block}
                            tokens={tokens}
                            isInspectMode={isInspectMode}
                            activeComponentId={activeComponentId}
                            onSelectComponentId={(id) => {
                              setActiveComponentId(id);
                              setSelectedTarget(null);
                            }}
                            selectedTarget={selectedTarget}
                            onSelectSubElement={(
                              subId,
                              subLabel,
                              compLabel,
                              variantState
                            ) => {
                              setStudioOpen(true);
                              setSelectedTarget({
                                rowId: row.id,
                                blockId: block.id,
                                subElementId: subId,
                                subElementLabel: subLabel,
                                componentLabel: compLabel || block.title,
                                variantState:
                                  variantState || block.variant || 'Default',
                              });
                            }}
                            onChangeVariant={(nextVariant) => {
                              handleUpdateBlock(row.id, block.id, (b) => ({
                                ...b,
                                variant: nextVariant,
                              }));
                            }}
                            onOpenExportModal={(primitiveId) =>
                              setExportModalPrimitive(primitiveId)
                            }
                          />
                        </div>
                      </div>
                    );
                  })}
                  </div>
                </div>
              </article>
            );
          })}
          </div>

          {isInspectMode && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => setAddBlockModalOpen(true)}
                className="px-5 py-2.5 rounded-full bg-white hover:bg-zinc-50 text-zinc-800 text-xs font-medium shadow-sm flex items-center gap-2 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar Bloco</span>
              </button>
            </div>
          )}
        </div>
      </main>

      {/* MODALS */}
      <AddBlockModal />

      {exportModalPrimitive && (
        <ShadcnExportModal
          primitiveId={exportModalPrimitive}
          tokens={tokens}
          allPrimitiveOverrides={allPrimitiveOverrides}
          policies={policies}
          onClose={() => setExportModalPrimitive(null)}
          onChangePrimitiveId={(next) => setExportModalPrimitive(next)}
        />
      )}
    </div>
  );
}

export function App() {
  return (
    <BrandSystemProvider>
      <AppContent />
    </BrandSystemProvider>
  );
}
export default App;
