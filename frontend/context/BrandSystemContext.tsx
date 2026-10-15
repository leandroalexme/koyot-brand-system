import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  type ReactNode,
} from 'react';
import {
  BrandTokens,
  GuidelinePage,
  PageId,
  ColumnLayout,
  BlockType,
  EditorialRow,
  EditorialBlock,
  BlockTheme,
  AppMode,
  SelectedInspectorTarget,
  SubElementStyleOverrides,
  ShadcnSingleBlockType,
  HistoryTransaction,
} from '../types';
import {
  DEFAULT_BRAND_TOKENS,
  INITIAL_PAGES,
  BRAND_PRESETS,
} from '../constants';
import {
  ShadcnPrimitiveId,
  SHADCN_PRIMITIVES_CATALOG,
  buildShadcnRegistryItem,
} from '../utils/shadcnRegistryGenerator';

const STORAGE_KEY = 'koyot_brand_system_state_v2';

export interface BrandSystemContextValue {
  // Brand Tokens
  tokens: BrandTokens;
  updateTokens: (updater: (prev: BrandTokens) => BrandTokens) => void;
  resetTokensToPreset: (presetName: string) => void;
  resetAllToDefault: () => void;

  // History & Batch Undo (KDS-05)
  history: HistoryTransaction[];
  canUndo: boolean;
  canRedo: boolean;
  lastTransaction: HistoryTransaction | null;
  undo: () => void;
  redo: () => void;
  recordTransaction: (
    desc: string,
    nextTokens: BrandTokens,
    nextPages?: GuidelinePage[],
    actorKind?: 'human' | 'agent' | 'preset' | 'autofix'
  ) => void;
  clearLastTransaction: () => void;

  // Pages & Bento Rows
  pages: GuidelinePage[];
  activePageId: PageId;
  activePage: GuidelinePage;
  activeMode: AppMode;
  setActivePageId: (id: PageId) => void;
  handleAddNewRow: (layout: ColumnLayout, blockType: BlockType) => void;
  handleChangeRowLayout: (rowId: string, layout: ColumnLayout) => void;
  handleDeleteRow: (rowId: string) => void;
  handleMoveRow: (fromIndex: number, direction: 'up' | 'down') => void;
  handleUpdateBlock: (
    rowId: string,
    blockId: string,
    updater: (b: EditorialBlock) => EditorialBlock
  ) => void;
  handleCycleBlockTheme: (rowId: string, blockId: string) => void;
  handleChangeBlockType: (
    rowId: string,
    blockId: string,
    newType: BlockType
  ) => void;

  // Inspector & Modes
  isInspectMode: boolean;
  setIsInspectMode: (val: boolean) => void;
  selectedTarget: SelectedInspectorTarget | null;
  setSelectedTarget: (target: SelectedInspectorTarget | null) => void;
  hoveredBlockId: string | null;
  setHoveredBlockId: (id: string | null) => void;

  // Studio & Appearance
  studioOpen: boolean;
  setStudioOpen: (open: boolean) => void;
  canvasDarkAppearance: boolean;
  toggleCanvasAppearance: () => void;

  // Modals & Navigation
  addBlockModalOpen: boolean;
  setAddBlockModalOpen: (open: boolean) => void;
  exportModalPrimitive: ShadcnPrimitiveId | 'all' | null;
  setExportModalPrimitive: (p: ShadcnPrimitiveId | 'all' | null) => void;
  activeComponentId: string | 'all';
  setActiveComponentId: (id: string | 'all') => void;

  // Overrides & Registry
  allPrimitiveOverrides: Record<string, Record<string, SubElementStyleOverrides>>;
}

const BrandSystemContext = createContext<BrandSystemContextValue | null>(null);

export const BrandSystemProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Initialize state with localStorage cache if available
  const [tokens, setTokens] = useState<BrandTokens>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.tokens) return parsed.tokens;
      }
    } catch {
      // ignore
    }
    return DEFAULT_BRAND_TOKENS;
  });

  const [pages, setPages] = useState<GuidelinePage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed?.pages) && parsed.pages.length > 0) {
          // Verify newly added components rows exist in components page
          const savedComponents = parsed.pages.find((p: GuidelinePage) => p.id === 'components');
          const initialComponents = INITIAL_PAGES.find((p) => p.id === 'components');
          if (
            savedComponents &&
            initialComponents &&
            savedComponents.rows.length < initialComponents.rows.length
          ) {
            // Merge in missing rows
            const existingRowIds = new Set(savedComponents.rows.map((r: EditorialRow) => r.id));
            const missingRows = initialComponents.rows.filter((r) => !existingRowIds.has(r.id));
            savedComponents.rows.push(...missingRows);
          }
          return parsed.pages;
        }
      }
    } catch {
      // ignore
    }
    return INITIAL_PAGES;
  });

  const [activePageId, setActivePageId] = useState<PageId>('overview');
  const [studioOpen, setStudioOpen] = useState<boolean>(true);
  const [isInspectMode, setIsInspectMode] = useState<boolean>(false);
  const [selectedTarget, setSelectedTarget] =
    useState<SelectedInspectorTarget | null>(null);
  const [hoveredBlockId, setHoveredBlockId] = useState<string | null>(null);
  const [canvasDarkAppearance, setCanvasDarkAppearance] =
    useState<boolean>(false);
  const [addBlockModalOpen, setAddBlockModalOpen] = useState<boolean>(false);
  const [activeComponentId, setActiveComponentId] = useState<string | 'all'>(
    'all'
  );
  const [exportModalPrimitive, setExportModalPrimitive] = useState<
    ShadcnPrimitiveId | 'all' | null
  >(null);

  // History & Batch Undo (KDS-05)
  const [history, setHistory] = useState<HistoryTransaction[]>([]);
  const [redoStack, setRedoStack] = useState<HistoryTransaction[]>([]);
  const [lastTransaction, setLastTransaction] =
    useState<HistoryTransaction | null>(null);

  // Debounced auto-save to localStorage
  const saveTimeoutRef = useRef<number | null>(null);
  useEffect(() => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = window.setTimeout(() => {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ tokens, pages })
        );
      } catch {
        // quota exceeded or private mode
      }
    }, 400);

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [tokens, pages]);

  // Compute all primitive sub-element overrides
  const allPrimitiveOverrides = useMemo(() => {
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

  // Auto-sync live Shadcn Registry to Backend (/r/sync) for CLI consumption
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
        // backend not reachable
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [tokens, allPrimitiveOverrides]);

  const activePage = useMemo(() => {
    return pages.find((p) => p.id === activePageId) || pages[0];
  }, [pages, activePageId]);

  const activeMode: AppMode = activePage.mode;

  const updateTokens = useCallback(
    (updater: (prev: BrandTokens) => BrandTokens) => {
      setTokens((prev) => updater(prev));
    },
    []
  );

  const recordTransaction = useCallback(
    (
      desc: string,
      nextTokens: BrandTokens,
      nextPages?: GuidelinePage[],
      actorKind: 'human' | 'agent' | 'preset' | 'autofix' = 'human'
    ) => {
      const tx: HistoryTransaction = {
        id: `tx-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        timestamp: Date.now(),
        actor: { kind: actorKind },
        description: desc,
        tokensBefore: tokens,
        tokensAfter: nextTokens,
        pagesBefore: pages,
        pagesAfter: nextPages || pages,
      };
      setHistory((prev) => [tx, ...prev.slice(0, 49)]);
      setRedoStack([]);
      setLastTransaction(tx);
      setTokens(nextTokens);
      if (nextPages) {
        setPages(nextPages);
      }
    },
    [tokens, pages]
  );

  const undo = useCallback(() => {
    setHistory((prev) => {
      if (prev.length === 0) return prev;
      const [tx, ...rest] = prev;
      setRedoStack((r) => [tx, ...r]);
      setTokens(tx.tokensBefore);
      if (tx.pagesBefore) {
        setPages(tx.pagesBefore);
      }
      setLastTransaction(null);
      return rest;
    });
  }, []);

  const redo = useCallback(() => {
    setRedoStack((prev) => {
      if (prev.length === 0) return prev;
      const [tx, ...rest] = prev;
      setHistory((h) => [tx, ...h]);
      setTokens(tx.tokensAfter);
      if (tx.pagesAfter) {
        setPages(tx.pagesAfter);
      }
      setLastTransaction(tx);
      return rest;
    });
  }, []);

  const clearLastTransaction = useCallback(() => {
    setLastTransaction(null);
  }, []);

  const canUndo = history.length > 0;
  const canRedo = redoStack.length > 0;

  // Global Keyboard Shortcuts (Cmd+Z / Ctrl+Z, Shift+Cmd+Z)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable);
      if (isInput) return;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  const resetTokensToPreset = useCallback(
    (presetName: string) => {
      const preset = BRAND_PRESETS[presetName];
      if (preset) {
        recordTransaction(
          `Preset aplicado: ${presetName}`,
          { ...preset },
          undefined,
          'preset'
        );
      }
    },
    [recordTransaction]
  );

  const resetAllToDefault = useCallback(() => {
    recordTransaction(
      'Restaurar padrões de fábrica',
      DEFAULT_BRAND_TOKENS,
      INITIAL_PAGES,
      'human'
    );
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, [recordTransaction]);

  const toggleCanvasAppearance = useCallback(() => {
    setCanvasDarkAppearance((prev) => !prev);
  }, []);

  const handleAddNewRow = useCallback(
    (layout: ColumnLayout, blockType: BlockType) => {
      const newBlock: EditorialBlock = {
        id: `blk-${Date.now()}`,
        type: blockType,
        title: blockType
          .split('-')
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' '),
        theme: 'light',
      };

      let initialBlocks: EditorialBlock[] = [newBlock];
      if (layout === '2-col-50-50' || layout === '2-col-66-33' || layout === '2-col-33-66') {
        initialBlocks = [newBlock, { ...newBlock, id: `blk-${Date.now()}-2` }];
      } else if (layout === '3-col') {
        initialBlocks = [
          newBlock,
          { ...newBlock, id: `blk-${Date.now()}-2` },
          { ...newBlock, id: `blk-${Date.now()}-3` },
        ];
      } else if (layout === '4-col' || layout === '2x2') {
        initialBlocks = [
          newBlock,
          { ...newBlock, id: `blk-${Date.now()}-2` },
          { ...newBlock, id: `blk-${Date.now()}-3` },
          { ...newBlock, id: `blk-${Date.now()}-4` },
        ];
      }

      const newRow: EditorialRow = {
        id: `row-${Date.now()}`,
        layout,
        blocks: initialBlocks,
      };

      setPages((prev) =>
        prev.map((p) =>
          p.id === activePageId
            ? { ...p, rows: [...p.rows, newRow] }
            : p
        )
      );
      setAddBlockModalOpen(false);
    },
    [activePageId]
  );

  const handleChangeRowLayout = useCallback(
    (rowId: string, nextLayout: ColumnLayout) => {
      setPages((prev) =>
        prev.map((p) => {
          if (p.id !== activePageId) return p;
          return {
            ...p,
            rows: p.rows.map((r) => {
              if (r.id !== rowId) return r;
              let targetCount = 1;
              if (
                nextLayout === '2-col-50-50' ||
                nextLayout === '2-col-66-33' ||
                nextLayout === '2-col-33-66'
              ) {
                targetCount = 2;
              } else if (nextLayout === '3-col') {
                targetCount = 3;
              } else if (nextLayout === '4-col' || nextLayout === '2x2') {
                targetCount = 4;
              }

              let updatedBlocks = [...r.blocks];
              while (updatedBlocks.length < targetCount) {
                const baseBlock = updatedBlocks[0] || {
                  id: `blk-${Date.now()}`,
                  type: 'typography-sculpture',
                  title: 'Block',
                  theme: 'light',
                };
                updatedBlocks.push({
                  ...baseBlock,
                  id: `blk-${Date.now()}-${updatedBlocks.length + 1}`,
                });
              }
              if (updatedBlocks.length > targetCount) {
                updatedBlocks = updatedBlocks.slice(0, targetCount);
              }

              return {
                ...r,
                layout: nextLayout,
                blocks: updatedBlocks,
              };
            }),
          };
        })
      );
    },
    [activePageId]
  );

  const handleDeleteRow = useCallback(
    (rowId: string) => {
      setPages((prev) =>
        prev.map((p) =>
          p.id === activePageId
            ? { ...p, rows: p.rows.filter((r) => r.id !== rowId) }
            : p
        )
      );
      if (selectedTarget?.rowId === rowId) {
        setSelectedTarget(null);
      }
    },
    [activePageId, selectedTarget]
  );

  const handleMoveRow = useCallback(
    (fromIndex: number, direction: 'up' | 'down') => {
      setPages((prev) =>
        prev.map((p) => {
          if (p.id !== activePageId) return p;
          const targetIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
          if (targetIndex < 0 || targetIndex >= p.rows.length) return p;

          const updatedRows = [...p.rows];
          const [moved] = updatedRows.splice(fromIndex, 1);
          updatedRows.splice(targetIndex, 0, moved);
          return { ...p, rows: updatedRows };
        })
      );
    },
    [activePageId]
  );

  const handleUpdateBlock = useCallback(
    (
      rowId: string,
      blockId: string,
      updater: (b: EditorialBlock) => EditorialBlock
    ) => {
      setPages((prev) =>
        prev.map((p) => {
          if (p.id !== activePageId) return p;
          return {
            ...p,
            rows: p.rows.map((r) => {
              if (r.id !== rowId) return r;
              return {
                ...r,
                blocks: r.blocks.map((b) => (b.id === blockId ? updater(b) : b)),
              };
            }),
          };
        })
      );
    },
    [activePageId]
  );

  const handleCycleBlockTheme = useCallback(
    (rowId: string, blockId: string) => {
      const themes: BlockTheme[] = ['light', 'dark', 'tinted', 'brand'];
      handleUpdateBlock(rowId, blockId, (b) => {
        const nextTheme =
          themes[(themes.indexOf(b.theme) + 1) % themes.length];
        return { ...b, theme: nextTheme };
      });
    },
    [handleUpdateBlock]
  );

  const handleChangeBlockType = useCallback(
    (rowId: string, blockId: string, newType: BlockType) => {
      handleUpdateBlock(rowId, blockId, (b) => ({
        ...b,
        type: newType,
        title: newType
          .split('-')
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' '),
      }));
    },
    [handleUpdateBlock]
  );

  const value = useMemo<BrandSystemContextValue>(
    () => ({
      tokens,
      updateTokens,
      resetTokensToPreset,
      resetAllToDefault,
      history,
      canUndo,
      canRedo,
      lastTransaction,
      undo,
      redo,
      recordTransaction,
      clearLastTransaction,
      pages,
      activePageId,
      activePage,
      activeMode,
      setActivePageId,
      handleAddNewRow,
      handleChangeRowLayout,
      handleDeleteRow,
      handleMoveRow,
      handleUpdateBlock,
      handleCycleBlockTheme,
      handleChangeBlockType,
      isInspectMode,
      setIsInspectMode,
      selectedTarget,
      setSelectedTarget,
      hoveredBlockId,
      setHoveredBlockId,
      studioOpen,
      setStudioOpen,
      canvasDarkAppearance,
      toggleCanvasAppearance,
      addBlockModalOpen,
      setAddBlockModalOpen,
      exportModalPrimitive,
      setExportModalPrimitive,
      activeComponentId,
      setActiveComponentId,
      allPrimitiveOverrides,
    }),
    [
      tokens,
      updateTokens,
      resetTokensToPreset,
      resetAllToDefault,
      history,
      canUndo,
      canRedo,
      lastTransaction,
      undo,
      redo,
      recordTransaction,
      clearLastTransaction,
      pages,
      activePageId,
      activePage,
      activeMode,
      handleAddNewRow,
      handleDeleteRow,
      handleMoveRow,
      handleUpdateBlock,
      handleCycleBlockTheme,
      handleChangeBlockType,
      isInspectMode,
      selectedTarget,
      hoveredBlockId,
      studioOpen,
      canvasDarkAppearance,
      toggleCanvasAppearance,
      addBlockModalOpen,
      exportModalPrimitive,
      activeComponentId,
      allPrimitiveOverrides,
    ]
  );

  return (
    <BrandSystemContext.Provider value={value}>
      {children}
    </BrandSystemContext.Provider>
  );
};

export function useBrandSystem() {
  const ctx = useContext(BrandSystemContext);
  if (!ctx) {
    throw new Error('useBrandSystem must be used within a BrandSystemProvider');
  }
  return ctx;
}
