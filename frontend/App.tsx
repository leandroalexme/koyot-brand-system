import React, { useState, useRef, useEffect } from 'react';
import {
  BrandTokens,
  GuidelinePage,
  PageId,
  ColumnLayout,
  BlockType,
  BlockCategory,
  EditorialRow,
  EditorialBlock,
  BlockTheme,
  AppMode,
  SelectedInspectorTarget,
} from './types';
import {
  DEFAULT_BRAND_TOKENS,
  INITIAL_PAGES,
  BLOCK_CATALOG,
} from './constants';
import { BlockRenderer } from './components/Specimens/BlockRenderer';
import { BrandStudioPanel } from './components/BrandStudioPanel';
import { ShadcnExportModal } from './components/ShadcnExportModal';
import {
  ShadcnPrimitiveId,
  SHADCN_PRIMITIVES_CATALOG,
  buildShadcnRegistryItem,
} from './utils/shadcnRegistryGenerator';
import { SubElementStyleOverrides } from './types';
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Sun,
  Moon,
  LayoutGrid,
  BookOpen,
  Sparkles,
  SlidersHorizontal,
  Play,
  Scan,
  Terminal,
} from 'lucide-react';

const CATEGORY_LABELS: Record<BlockCategory, string> = {
  identity: 'Identity Block',
  typography: 'Typography Block',
  color: 'Color Block',
  applications: 'Applications Block',
  rules: 'Rules Block',
  content: 'Content Block',
  frame: 'Frame Block',
};

export function App() {
  const [tokens, setTokens] = useState<BrandTokens>(DEFAULT_BRAND_TOKENS);
  const [pages, setPages] = useState<GuidelinePage[]>(INITIAL_PAGES);
  const [activePageId, setActivePageId] = useState<PageId>('overview');
  const [studioOpen, setStudioOpen] = useState<boolean>(true);
  const [isInspectMode, setIsInspectMode] = useState<boolean>(false);
  const [selectedTarget, setSelectedTarget] =
    useState<SelectedInspectorTarget | null>(null);
  const [hoveredBlockId, setHoveredBlockId] = useState<string | null>(null);
  const [canvasDarkAppearance, setCanvasDarkAppearance] =
    useState<boolean>(false);
  const [addBlockModalOpen, setAddBlockModalOpen] = useState<boolean>(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<
    BlockCategory | 'all'
  >('all');
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [activeComponentId, setActiveComponentId] = useState<string | 'all'>(
    'all'
  );
  const [exportModalPrimitive, setExportModalPrimitive] = useState<
    ShadcnPrimitiveId | 'all' | null
  >(null);

  // Collect all primitive sub-element overrides from blocks across pages
  const allPrimitiveOverrides = React.useMemo(() => {
    const map: Record<string, Record<string, SubElementStyleOverrides>> = {};
    for (const page of pages) {
      for (const row of page.rows) {
        for (const blk of row.blocks) {
          if (blk.type.startsWith('ui-') && blk.subElements) {
            const pId = blk.type.replace(/^ui-/, '');
            map[pId] = { ...(map[pId] || {}), ...blk.subElements };
          }
          if (blk.type === 'shadcn-slider-anatomy' && blk.subElements) {
            map['slider'] = { ...(map['slider'] || {}), ...blk.subElements };
          }
          if (blk.type === 'shadcn-interactive-suite' && blk.subElements) {
            for (const [key, ovr] of Object.entries(blk.subElements)) {
              if (key.includes(':')) {
                const [pId, partId] = key.split(':');
                map[pId] = { ...(map[pId] || {}), [partId]: ovr };
              }
            }
          }
        }
      }
    }
    return map;
  }, [pages]);

  // Auto-sync live Shadcn Registry to Backend (/r/sync) so `npx shadcn@latest add http://localhost:5174/r/<item>.json` works anytime
  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const itemsPayload: Record<string, any> = {
          all: buildShadcnRegistryItem('all', tokens, allPrimitiveOverrides),
        };
        for (const item of SHADCN_PRIMITIVES_CATALOG) {
          itemsPayload[item.id] = buildShadcnRegistryItem(
            item.id,
            tokens,
            allPrimitiveOverrides
          );
        }
        await fetch('/r/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: itemsPayload }),
        });
      } catch {
        // ignore if backend not reachable
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [tokens, allPrimitiveOverrides]);

  // Smart Canvas Width Guard: measures actual free space in the central Bento stage
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

  const activePage = pages.find((p) => p.id === activePageId) || pages[0];
  const activeMode: AppMode = activePage.mode;

  const overviewPage = pages.find((p) => p.id === 'overview')!;
  const componentsPage = pages.find((p) => p.id === 'components')!;
  const guidelinePages = pages.filter((p) => p.mode === 'guideline');

  const handleSelectPage = (id: PageId) => {
    setActivePageId(id);
    setSelectedTarget(null);
  };

  const handleSwitchMode = (targetMode: AppMode) => {
    setSelectedTarget(null);
    if (targetMode === 'overview') {
      setActivePageId('overview');
    } else if (targetMode === 'components') {
      setActivePageId('components');
    } else {
      const firstGuideline = guidelinePages[0];
      if (firstGuideline) setActivePageId(firstGuideline.id);
    }
  };

  const handleAddGuidelinePage = () => {
    const newId = `page-${Date.now()}`;
    const newPage: GuidelinePage = {
      id: newId,
      label: `Nova Página`,
      mode: 'guideline',
      locked: false,
      description: 'Diretrizes e blocos modulares da marca.',
      rows: [
        {
          id: `row-${Date.now()}-1`,
          layout: '1-col',
          blocks: [
            {
              id: `blk-${Date.now()}-1`,
              type: 'hero-manifesto',
              title: 'Brand Manifesto Block',
              theme: 'light',
            },
          ],
        },
        {
          id: `row-${Date.now()}-2`,
          layout: '2-col-50-50',
          blocks: [
            {
              id: `blk-${Date.now()}-2a`,
              type: 'typography-sculpture',
              title: 'Typography Block',
              theme: 'light',
            },
            {
              id: `blk-${Date.now()}-2b`,
              type: 'color-proportion-60-30-10',
              title: 'Color Block',
              theme: 'light',
            },
          ],
        },
      ],
    };

    setPages((prev) => {
      const withoutComp = prev.filter((p) => p.id !== 'components');
      return [...withoutComp, newPage, componentsPage];
    });
    setActivePageId(newId);
    setEditingPageId(newId);
    setSelectedTarget(null);
  };

  const handleRenameGuidelinePage = (id: string, nextLabel: string) => {
    setPages((prev) =>
      prev.map((p) =>
        p.id === id && !p.locked ? { ...p, label: nextLabel || 'Sem título' } : p
      )
    );
  };

  const handleDeleteGuidelinePage = (id: string) => {
    const pageToDelete = pages.find((p) => p.id === id);
    if (!pageToDelete || pageToDelete.locked || guidelinePages.length <= 1) return;
    const remaining = pages.filter((p) => p.id !== id);
    setPages(remaining);
    if (activePageId === id) {
      const nextGuideline = remaining.find((p) => p.mode === 'guideline');
      setActivePageId(nextGuideline ? nextGuideline.id : 'overview');
    }
  };

  const updateActivePageRows = (
    updater: (rows: EditorialRow[]) => EditorialRow[]
  ) => {
    setPages((prev) =>
      prev.map((page) =>
        page.id === activePage.id ? { ...page, rows: updater(page.rows) } : page
      )
    );
  };

  const handleMoveRow = (rowIndex: number, direction: 'up' | 'down') => {
    updateActivePageRows((rows) => {
      const targetIndex = direction === 'up' ? rowIndex - 1 : rowIndex + 1;
      if (targetIndex < 0 || targetIndex >= rows.length) return rows;
      const clone = [...rows];
      const [moved] = clone.splice(rowIndex, 1);
      clone.splice(targetIndex, 0, moved);
      return clone;
    });
  };

  const handleDeleteRow = (rowId: string) => {
    updateActivePageRows((rows) => rows.filter((r) => r.id !== rowId));
    if (selectedTarget?.rowId === rowId) {
      setSelectedTarget(null);
    }
  };

  const handleChangeRowLayout = (rowId: string, newLayout: ColumnLayout) => {
    updateActivePageRows((rows) =>
      rows.map((row) => {
        if (row.id !== rowId) return row;
        const neededCount =
          newLayout === '1-col' ? 1 : newLayout === '3-col' ? 3 : 2;
        let nextBlocks = [...row.blocks];
        while (nextBlocks.length < neededCount) {
          nextBlocks.push({
            id: `blk-${Date.now()}-${nextBlocks.length}`,
            type: 'typography-sculpture',
            title: 'Typography Block',
            theme: 'light',
          });
        }
        if (nextBlocks.length > neededCount) {
          nextBlocks = nextBlocks.slice(0, neededCount);
        }
        return { ...row, layout: newLayout, blocks: nextBlocks };
      })
    );
  };

  const handleUpdateBlock = (
    rowId: string,
    blockId: string,
    updater: (blk: EditorialBlock) => EditorialBlock
  ) => {
    updateActivePageRows((rows) =>
      rows.map((row) =>
        row.id !== rowId
          ? row
          : {
              ...row,
              blocks: row.blocks.map((b) =>
                b.id !== blockId ? b : updater(b)
              ),
            }
      )
    );
  };

  const handleChangeBlockType = (
    rowId: string,
    blockId: string,
    newType: BlockType
  ) => {
    const catalogEntry = BLOCK_CATALOG.find((c) => c.type === newType);
    handleUpdateBlock(rowId, blockId, (b) => ({
      ...b,
      type: newType,
      title: catalogEntry?.label || b.title,
    }));
  };

  const handleCycleBlockTheme = (rowId: string, blockId: string) => {
    const order: BlockTheme[] = ['light', 'tinted', 'brand', 'dark'];
    handleUpdateBlock(rowId, blockId, (b) => {
      const nextTheme = order[(order.indexOf(b.theme) + 1) % order.length];
      return { ...b, theme: nextTheme };
    });
  };

  const handleAddNewRow = (layout: ColumnLayout, initialType: BlockType) => {
    const count = layout === '1-col' ? 1 : layout === '3-col' ? 3 : 2;
    const blocks: EditorialBlock[] = Array.from({ length: count }).map(
      (_, idx) => {
        const type =
          idx === 0
            ? initialType
            : BLOCK_CATALOG[
                (BLOCK_CATALOG.findIndex((b) => b.type === initialType) + idx) %
                  BLOCK_CATALOG.length
              ].type;
        const meta = BLOCK_CATALOG.find((b) => b.type === type);
        return {
          id: `blk-${Date.now()}-${idx}`,
          type,
          title: meta?.label || 'Block',
          theme: 'light',
        };
      }
    );

    updateActivePageRows((rows) => [
      ...rows,
      {
        id: `row-${Date.now()}`,
        layout,
        blocks,
      },
    ]);
    setAddBlockModalOpen(false);
  };

  // Resolve currently selected block & row
  const selectedRow = selectedTarget
    ? activePage.rows.find((r) => r.id === selectedTarget.rowId)
    : undefined;
  const selectedBlock = selectedRow
    ? selectedRow.blocks.find((b) => b.id === selectedTarget?.blockId) || null
    : null;

  // Smart Collapse: if the available central stage width is below 680px, multi-column rows stack into 1-col automatically
  const isStageMultiColCapable = stageWidth >= 680;

  const getRowGridClass = (layout: ColumnLayout) => {
    if (!isStageMultiColCapable) return 'grid-cols-1';
    switch (layout) {
      case '1-col':
        return 'grid-cols-1';
      case '2-col-50-50':
        return 'grid-cols-2';
      case '2-col-66-33':
        return 'grid-cols-12';
      case '2-col-33-66':
        return 'grid-cols-12';
      case '3-col':
        return stageWidth >= 880 ? 'grid-cols-3' : 'grid-cols-1';
    }
  };

  const getBlockColSpanClass = (layout: ColumnLayout, blockIndex: number) => {
    if (!isStageMultiColCapable) return '';
    if (layout === '2-col-66-33') {
      return blockIndex === 0 ? 'col-span-8' : 'col-span-4';
    }
    if (layout === '2-col-33-66') {
      return blockIndex === 0 ? 'col-span-4' : 'col-span-8';
    }
    return '';
  };

  const filteredCatalog =
    selectedCategoryFilter === 'all'
      ? BLOCK_CATALOG
      : BLOCK_CATALOG.filter((b) => b.category === selectedCategoryFilter);

  return (
    <div
      className={`min-h-screen font-['Inter',sans-serif] transition-colors duration-300 ${
        canvasDarkAppearance
          ? 'bg-[#09090B] text-zinc-100'
          : 'bg-[#F2F2F0] text-zinc-950'
      }`}
    >
      {/* FIXED LEFT NAVIGATION SIDEBAR (Desktop fixed, Mobile top bar) */}
      <aside className="w-full lg:w-48 lg:fixed lg:top-6 lg:bottom-6 lg:left-6 z-30 select-none px-4 pt-4 lg:p-0">
        <nav className="h-full flex lg:flex-col gap-1 overflow-x-auto lg:overflow-y-auto py-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {/* Subtle Koyot / Brand Identity at top of fixed sidebar */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 pb-3 mb-1 text-xs">
            <span
              className={`font-semibold tracking-tight ${
                canvasDarkAppearance ? 'text-white' : 'text-zinc-900'
              }`}
            >
              Koyot
            </span>
            <span className="text-zinc-400">/</span>
            <input
              type="text"
              value={tokens.brandName}
              onChange={(e) =>
                setTokens({ ...tokens, brandName: e.target.value })
              }
              aria-label="Brand name"
              className="text-zinc-500 hover:text-zinc-900 focus:text-zinc-900 bg-transparent focus:outline-none w-24 truncate transition"
            />
          </div>

          {/* 1. FIXED TOP: Overview */}
          <button
            onClick={() => handleSelectPage(overviewPage.id)}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs transition flex items-center justify-between shrink-0 ${
              activePageId === overviewPage.id
                ? 'bg-white text-zinc-950 font-medium shadow-sm'
                : 'text-zinc-500 hover:text-zinc-900 hover:bg-black/[0.03]'
            }`}
          >
            <span>{overviewPage.label}</span>
          </button>

          {/* DIVIDER 1 */}
          <div className="hidden lg:block h-px bg-zinc-200/80 my-2 mx-3 shrink-0" />

          {/* 2. MIDDLE: Diretrizes de Marca + "+ Página" */}
          <div className="hidden lg:flex items-center justify-between px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-zinc-400 shrink-0">
            <span>Diretrizes</span>
            <button
              onClick={handleAddGuidelinePage}
              className="text-zinc-400 hover:text-zinc-900 flex items-center gap-0.5 transition normal-case tracking-normal text-[11px]"
              title="Adicionar página de diretriz"
            >
              <Plus className="w-3 h-3" />
              <span>Página</span>
            </button>
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
                  {isEditing ? (
                    <input
                      type="text"
                      autoFocus
                      value={page.label}
                      onChange={(e) =>
                        handleRenameGuidelinePage(page.id, e.target.value)
                      }
                      onBlur={() => setEditingPageId(null)}
                      onKeyDown={(e) =>
                        e.key === 'Enter' && setEditingPageId(null)
                      }
                      className="bg-transparent text-xs text-zinc-950 focus:outline-none w-full"
                    />
                  ) : (
                    <button
                      onClick={() => handleSelectPage(page.id)}
                      onDoubleClick={() =>
                        !page.locked && setEditingPageId(page.id)
                      }
                      className="text-left flex-1 truncate"
                      title="Clique duplo para renomear"
                    >
                      {page.label}
                    </button>
                  )}

                  {!page.locked && guidelinePages.length > 1 && (
                    <button
                      onClick={() => handleDeleteGuidelinePage(page.id)}
                      className="opacity-0 group-hover:opacity-100 text-zinc-300 hover:text-rose-500 transition ml-1"
                      title="Remover página"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* DIVIDER 2 */}
          <div className="hidden lg:block h-px bg-zinc-200/80 my-2 mx-3 shrink-0" />

          {/* 3. FIXED BOTTOM: Componentes */}
          <button
            onClick={() => handleSelectPage(componentsPage.id)}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs transition flex items-center justify-between shrink-0 ${
              activePageId === componentsPage.id
                ? 'bg-white text-zinc-950 font-medium shadow-sm'
                : 'text-zinc-500 hover:text-zinc-900 hover:bg-black/[0.03]'
            }`}
          >
            <span>{componentsPage.label}</span>
          </button>
        </nav>
      </aside>

      {/* FIXED RIGHT BRAND STUDIO & CONTEXTUAL INSPECTOR PANEL */}
      {studioOpen && (
        <div className="w-full lg:w-[320px] lg:fixed lg:top-6 lg:right-6 z-30 px-4 mt-4 lg:p-0 lg:mt-0">
          <BrandStudioPanel
            tokens={tokens}
            onChangeTokens={setTokens}
            onResetTokens={() => setTokens(DEFAULT_BRAND_TOKENS)}
            selectedTarget={selectedTarget}
            selectedBlock={selectedBlock}
            selectedRowLayout={selectedRow?.layout}
            onClearSelection={() => setSelectedTarget(null)}
            onSelectSubElement={(subId, subLabel) => {
              if (!selectedTarget) return;
              setSelectedTarget({
                ...selectedTarget,
                subElementId: subId,
                subElementLabel: subLabel,
              });
            }}
            onUpdateBlock={(updater) => {
              if (!selectedTarget) return;
              handleUpdateBlock(
                selectedTarget.rowId,
                selectedTarget.blockId,
                updater
              );
            }}
            onChangeRowLayout={(nextLayout) => {
              if (!selectedTarget) return;
              handleChangeRowLayout(selectedTarget.rowId, nextLayout);
            }}
            onDeleteRow={() => {
              if (!selectedTarget) return;
              handleDeleteRow(selectedTarget.rowId);
            }}
            onOpenExportModal={(primitiveId) =>
              setExportModalPrimitive(primitiveId)
            }
          />
        </div>
      )}

      {/* CENTER SCROLLABLE BENTO EDITORIAL CANVAS */}
      <main
        className={`pt-6 pb-28 px-4 sm:px-6 lg:pl-[236px] transition-all duration-300 ${
          studioOpen ? 'lg:pr-[364px]' : 'lg:pr-8'
        }`}
      >
        <div ref={canvasStageRef} className="max-w-[1240px] mx-auto w-full">
          <div className="space-y-5">
            {activePage.rows.map((row, rowIdx) => (
              <section key={row.id} className="group/row relative">
                {isInspectMode && (
                  <div className="flex items-center justify-between mb-2 px-1 opacity-0 group-hover/row:opacity-100 transition">
                    <span className="text-[10px] font-mono text-zinc-400">
                      Bento Row {rowIdx + 1} ·{' '}
                      {row.layout === '1-col'
                        ? '1 Column (Full)'
                        : row.layout === '3-col'
                        ? '3 Columns'
                        : '2 Columns (Split)'}
                    </span>
                    <div className="flex items-center gap-1">
                      {(
                        [
                          { id: '1-col', label: '1 Col' },
                          { id: '2-col-50-50', label: '2 Col' },
                          { id: '2-col-66-33', label: '66/33' },
                          { id: '3-col', label: '3 Col' },
                        ] as Array<{ id: ColumnLayout; label: string }>
                      ).map((l) => (
                        <button
                          key={l.id}
                          onClick={() => handleChangeRowLayout(row.id, l.id)}
                          className={`px-2 py-0.5 rounded text-[10px] transition ${
                            row.layout === l.id
                              ? 'bg-zinc-900 text-white'
                              : 'bg-white text-zinc-500 hover:text-zinc-900'
                          }`}
                        >
                          {l.label}
                        </button>
                      ))}

                      <button
                        onClick={() => handleMoveRow(rowIdx, 'up')}
                        disabled={rowIdx === 0}
                        className="p-1 rounded bg-white text-zinc-500 hover:text-zinc-900 disabled:opacity-30"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleMoveRow(rowIdx, 'down')}
                        disabled={rowIdx === activePage.rows.length - 1}
                        className="p-1 rounded bg-white text-zinc-500 hover:text-zinc-900 disabled:opacity-30"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDeleteRow(row.id)}
                        className="p-1 rounded bg-white text-rose-500 hover:bg-rose-50"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}

                <div
                  className={`grid gap-5 items-stretch ${getRowGridClass(
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
                        className={`group/block relative flex flex-col min-w-0 rounded-[24px] transition ${getBlockColSpanClass(
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
                        {/* Top-left Magenta Inspector Tag when hovered or selected in Inspect mode */}
                        {(isBlockSelected || isBlockHovered) && (
                          <div className="absolute -top-2.5 left-4 z-30 flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#D946EF] text-white text-[10px] font-medium shadow-sm pointer-events-none">
                            <span>{block.title}</span>
                          </div>
                        )}

                        {isInspectMode && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="mb-1.5 flex items-center justify-between gap-2 opacity-0 group-hover/block:opacity-100 transition"
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
                              {BLOCK_CATALOG.map((item) => (
                                <option key={item.type} value={item.type}>
                                  [{CATEGORY_LABELS[item.category]}] {item.label}
                                </option>
                              ))}
                            </select>

                            <button
                              onClick={() =>
                                handleCycleBlockTheme(row.id, block.id)
                              }
                              className="px-2.5 py-1 rounded-lg bg-white text-[11px] text-zinc-500 hover:text-zinc-900 capitalize shadow-sm"
                            >
                              {block.theme}
                            </button>
                          </div>
                        )}

                        <div className="flex-1 min-w-0 flex flex-col h-full">
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
              </section>
            ))}
          </div>

          {isInspectMode && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => setAddBlockModalOpen(true)}
                className="px-5 py-2.5 rounded-full bg-white hover:bg-zinc-50 text-zinc-800 text-xs font-medium shadow-sm flex items-center gap-2 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Block</span>
              </button>
            </div>
          )}
        </div>
      </main>

      {/* FLOATING BOTTOM DOCK: 3 Modes + Play/Inspect Switcher (Screenshots 7 & 8) + Studio Toggle + Appearance */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2">
        <div className="bg-[#18181B]/95 backdrop-blur-xl p-1 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-1">
          <button
            onClick={() => handleSwitchMode('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-2 transition ${
              activeMode === 'overview'
                ? 'bg-[#2C2C30] text-white'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => handleSwitchMode('guideline')}
            className={`px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-2 transition ${
              activeMode === 'guideline'
                ? 'bg-[#2C2C30] text-white'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Guideline</span>
          </button>

          <button
            onClick={() => handleSwitchMode('components')}
            className={`px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-2 transition ${
              activeMode === 'components'
                ? 'bg-[#2C2C30] text-white'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Components</span>
          </button>
        </div>

        {/* Dual Play / Inspect Pill (Matches Reference Screenshots 7 & 8) */}
        <div className="bg-[#18181B]/95 backdrop-blur-xl p-1 rounded-2xl shadow-2xl border border-white/10 flex items-center gap-1">
          <button
            onClick={() => {
              setIsInspectMode(false);
              setSelectedTarget(null);
            }}
            className={`w-9 h-8 rounded-xl flex items-center justify-center transition ${
              !isInspectMode
                ? 'bg-[#323236] text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
            title="Play / Interactive mode"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
          </button>
          <button
            onClick={() => {
              setIsInspectMode(true);
              setStudioOpen(true);
            }}
            className={`w-9 h-8 rounded-xl flex items-center justify-center transition ${
              isInspectMode
                ? 'bg-[#323236] text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
            title="Inspect & Select Blocks / Elements"
          >
            <Scan className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Brand Studio Sidebar Toggle Button */}
        <button
          onClick={() => setStudioOpen(!studioOpen)}
          className={`w-10 h-10 rounded-2xl backdrop-blur-xl border shadow-2xl flex items-center justify-center transition ${
            studioOpen
              ? 'bg-[#2C2C30] text-white border-white/20'
              : 'bg-[#18181B]/95 text-zinc-400 hover:text-white border-white/10'
          }`}
          title={studioOpen ? 'Ocultar Brand Studio' : 'Abrir Brand Studio'}
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>

        {/* Appearance (Light / Dark) Toggle Button */}
        <button
          onClick={() => setCanvasDarkAppearance(!canvasDarkAppearance)}
          className="w-10 h-10 rounded-2xl bg-[#18181B]/95 backdrop-blur-xl text-zinc-300 hover:text-white border border-white/10 shadow-2xl flex items-center justify-center transition"
          title="Alternar tema claro/escuro"
        >
          {canvasDarkAppearance ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </button>

        {/* Export / Install Shadcn Registry CLI Button */}
        <button
          onClick={() => setExportModalPrimitive('all')}
          className="h-10 px-3.5 rounded-2xl bg-[#18181B]/95 backdrop-blur-xl text-zinc-200 hover:text-white border border-white/10 shadow-2xl flex items-center gap-1.5 text-xs font-medium transition"
          title="Exportar & Instalar Shadcn Registry CLI"
        >
          <Terminal className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">CLI</span>
        </button>
      </div>

      {/* SHADCN REGISTRY & CODE EXPORT MODAL */}
      {exportModalPrimitive && (
        <ShadcnExportModal
          primitiveId={exportModalPrimitive}
          tokens={tokens}
          allPrimitiveOverrides={allPrimitiveOverrides}
          onClose={() => setExportModalPrimitive(null)}
          onChangePrimitiveId={(next) => setExportModalPrimitive(next)}
        />
      )}

      {/* UNIFIED "ADD BLOCK" MODAL */}
      {addBlockModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl space-y-6 max-h-[82vh] overflow-y-auto text-zinc-900">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-zinc-900">
                  Add Block to Bento Grid
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Choose a block category and insert as 1 Column or 2 Columns
                </p>
              </div>
              <button
                onClick={() => setAddBlockModalOpen(false)}
                className="text-xs text-zinc-400 hover:text-zinc-900"
              >
                Close
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {(
                [
                  'all',
                  'identity',
                  'typography',
                  'color',
                  'applications',
                  'rules',
                  'content',
                  'frame',
                ] as const
              ).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategoryFilter(cat)}
                  className={`px-3 py-1 rounded-full text-[11px] capitalize transition ${
                    selectedCategoryFilter === cat
                      ? 'bg-zinc-900 text-white font-medium'
                      : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200/70'
                  }`}
                >
                  {cat === 'all' ? 'All Blocks' : cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredCatalog.map((item) => (
                <div
                  key={item.type}
                  className="p-4 rounded-2xl bg-[#FAFAFA] hover:bg-zinc-100/80 transition flex flex-col justify-between gap-4"
                >
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-zinc-400">
                      {CATEGORY_LABELS[item.category]}
                    </div>
                    <h4 className="text-xs font-semibold text-zinc-900 mt-1">
                      {item.label}
                    </h4>
                    <p className="text-[11px] text-zinc-500 mt-1">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleAddNewRow('1-col', item.type)}
                      className="flex-1 py-1.5 px-2 rounded-lg bg-zinc-900 text-white text-[11px] font-medium"
                    >
                      1 Column (Full)
                    </button>
                    <button
                      onClick={() => handleAddNewRow('2-col-50-50', item.type)}
                      className="py-1.5 px-2.5 rounded-lg bg-white text-zinc-700 text-[11px]"
                    >
                      2 Columns (50/50)
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
