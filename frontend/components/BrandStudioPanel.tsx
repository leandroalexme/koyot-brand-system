import React, { useState, useRef } from 'react';
import {
  BrandTokens,
  FontFamilyOption,
  FontRole,
  NeutralTone,
  MotionPreset,
  ColorMoodPalette,
  ScaleUnitName,
  ScaleUnitMetrics,
  SelectedInspectorTarget,
  EditorialBlock,
  SubElementStyleOverrides,
  TextWeightName,
  BorderWidthName,
  CornerRadiusName,
  ControlSizeName,
  BlockType,
  BlockTheme,
  ColumnLayout,
} from '../types';
import {
  BRAND_PRESETS,
  COLOR_MOOD_PALETTES,
  BLOCK_CATALOG,
} from '../constants';
import {
  deriveMoodPaletteFromHex,
  modulateTokensByCharacter,
  computeScaleUnits,
  SCALE_UNIT_KEYS,
  getFontFamilyByRole,
  getNeutralRamp10,
} from '../utils/styleUtils';
import {
  SteppedPillSlider,
  SemanticColorTokenPicker,
  FontSearchPicker,
  TokenColorSwatchCircle,
} from './StudioControls';
import {
  SHADCN_PRIMITIVES_CATALOG,
  ShadcnPrimitiveId,
} from '../utils/shadcnRegistryGenerator';
import { SHADCN_BLOCK_VARIANTS } from './Specimens/ShadcnSingleComponentSpecimen';
import { ShadcnSingleBlockType } from '../types';
import {
  SlidersHorizontal,
  ArrowLeft,
  Palette,
  Maximize2,
  Type as TypeIcon,
  MoveHorizontal,
  CornerUpRight,
  Square,
  Layers,
  Activity,
  ChevronRight,
  ChevronDown,
  RotateCcw,
  Plus,
  X,
  ChevronsUpDown,
  Scan,
  Trash2,
  Terminal,
} from 'lucide-react';

import { useBrandSystem } from '../context/BrandSystemContext';
import { getSpecimenSubElements, getSpecimenVariants } from '../sdk/specimen';

interface BrandStudioPanelProps {
  tokens?: BrandTokens;
  onChangeTokens?: (next: BrandTokens) => void;
  onResetTokens?: () => void;
  selectedTarget?: SelectedInspectorTarget | null;
  selectedBlock?: EditorialBlock | null;
  selectedRowLayout?: ColumnLayout;
  onClearSelection?: () => void;
  onSelectSubElement?: (subElementId: string | undefined, label?: string) => void;
  onUpdateBlock?: (updater: (block: EditorialBlock) => EditorialBlock) => void;
  onChangeRowLayout?: (layout: ColumnLayout) => void;
  onDeleteRow?: () => void;
  onOpenExportModal?: (primitiveId: ShadcnPrimitiveId | 'all') => void;
}

type StudioView = 'main' | 'edit';

type EditSectionId =
  | 'colors'
  | 'scale'
  | 'fonts'
  | 'letter-spacing'
  | 'corners'
  | 'borders'
  | 'shadows'
  | 'motion';

export const SUB_ELEMENTS_BY_BLOCK: Partial<
  Record<
    BlockType,
    Array<{ id: string; label: string; kind: 'text' | 'surface' | 'control' }>
  >
> = {
  'shadcn-slider-anatomy': [
    { id: 'label', label: 'Label', kind: 'text' },
    { id: 'track', label: 'Track', kind: 'control' },
    { id: 'thumb', label: 'Thumb', kind: 'surface' },
  ],
  'shadcn-payment-widget': [
    { id: 'balance', label: 'Balance', kind: 'text' },
    { id: 'card', label: 'Card', kind: 'surface' },
    { id: 'pay-button', label: 'Pay Button', kind: 'control' },
  ],
  'shadcn-navigation-preview': [
    { id: 'sidebar', label: 'Sidebar', kind: 'surface' },
    { id: 'nav-item', label: 'Nav Pill', kind: 'control' },
    { id: 'input', label: 'Input Field', kind: 'control' },
  ],
  'hero-manifesto': [
    { id: 'badge', label: 'Brand Pill', kind: 'control' },
    { id: 'headline', label: 'Headline', kind: 'text' },
    { id: 'body', label: 'Manifesto Copy', kind: 'text' },
  ],
};

export const BrandStudioPanel: React.FC<BrandStudioPanelProps> = (props) => {
  const brandSys = useBrandSystem();

  const tokens = props.tokens ?? brandSys.tokens;
  const onChangeTokens = props.onChangeTokens ?? ((next: BrandTokens) => brandSys.updateTokens(() => next));
  const onResetTokens = props.onResetTokens ?? brandSys.resetAllToDefault;
  const selectedTarget = props.selectedTarget !== undefined ? props.selectedTarget : brandSys.selectedTarget;
  const onClearSelection = props.onClearSelection ?? (() => brandSys.setSelectedTarget(null));
  const onSelectSubElement = props.onSelectSubElement ?? ((subId, subLabel) => {
    if (!brandSys.selectedTarget) return;
    brandSys.setSelectedTarget({
      ...brandSys.selectedTarget,
      subElementId: subId,
      subElementLabel: subLabel,
    });
  });
  const onUpdateBlock = props.onUpdateBlock ?? ((updater) => {
    if (!brandSys.selectedTarget) return;
    brandSys.handleUpdateBlock(
      brandSys.selectedTarget.rowId,
      brandSys.selectedTarget.blockId,
      updater
    );
  });
  const onDeleteRow = props.onDeleteRow ?? (() => {
    if (!brandSys.selectedTarget) return;
    brandSys.handleDeleteRow(brandSys.selectedTarget.rowId);
  });
  const onOpenExportModal = props.onOpenExportModal ?? brandSys.setExportModalPrimitive;

  const selectedRow = brandSys.pages
    .flatMap((p) => p.rows)
    .find((r) => r.id === selectedTarget?.rowId);
  const selectedBlock = props.selectedBlock ?? selectedRow?.blocks.find((b) => b.id === selectedTarget?.blockId) ?? null;
  const selectedRowLayout = props.selectedRowLayout ?? selectedRow?.layout;
  const onChangeRowLayout = props.onChangeRowLayout ?? ((nextLayout) => {
    // layout update
  });
  const [studioView, setStudioView] = useState<StudioView>('main');
  const [openEditSections, setOpenEditSections] = useState<
    Record<EditSectionId, boolean>
  >({
    colors: false,
    scale: true,
    fonts: true,
    'letter-spacing': false,
    corners: false,
    borders: false,
    shadows: false,
    motion: false,
  });
  const [expandedFontRole, setExpandedFontRole] = useState<FontRole | null>(
    null
  );
  const [inspectorOpenSections, setInspectorOpenSections] = useState<
    Record<string, boolean>
  >({
    color: true,
    typography: true,
    border: true,
    spacing: true,
    shape: true,
    shadows: true,
    blockSettings: false,
  });

  const [isDraggingPad, setIsDraggingPad] = useState(false);
  const padRef = useRef<HTMLDivElement | null>(null);
  const colorInputRef = useRef<HTMLInputElement | null>(null);

  const toggleEditSection = (id: EditSectionId) => {
    setOpenEditSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleInspectorSection = (id: string) => {
    setInspectorOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const updateCharacterFromClientXY = (clientX: number, clientY: number) => {
    if (!padRef.current) return;
    const rect = padRef.current.getBoundingClientRect();
    const padInset = 14;
    const usableW = Math.max(1, rect.width - padInset * 2);
    const usableH = Math.max(1, rect.height - padInset * 2);

    const relX = Math.max(
      0,
      Math.min(1, (clientX - rect.left - padInset) / usableW)
    );
    const relY = Math.max(
      0,
      Math.min(1, (clientY - rect.top - padInset) / usableH)
    );

    const charX = relX * 2 - 1; // -1 (Quiet) to +1 (Bold)
    const charY = 1 - relY * 2; // -1 (Compact) to +1 (Airy)

    const modulated = modulateTokensByCharacter(tokens, charX, charY);
    onChangeTokens(modulated);
  };

  const handlePadPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDraggingPad(true);
    updateCharacterFromClientXY(e.clientX, e.clientY);
  };

  const handlePadPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingPad) return;
    updateCharacterFromClientXY(e.clientX, e.clientY);
  };

  const handlePadPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingPad) return;
    setIsDraggingPad(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const handleSelectColorMood = (mood: ColorMoodPalette) => {
    const newBase = {
      primaryColor: mood.primaryColor,
      supportColor: mood.supportColor,
      secondaryColor: mood.secondaryColor,
      accentColor: mood.accentColor,
      surfaceTint: mood.surfaceTint,
    };
    const nextTokens = modulateTokensByCharacter(
      tokens,
      tokens.characterX,
      tokens.characterY,
      newBase
    );
    onChangeTokens(nextTokens);
  };

  const handleCustomHexChange = (hex: string) => {
    const derivedBase = deriveMoodPaletteFromHex(hex);
    const nextTokens = modulateTokensByCharacter(
      tokens,
      tokens.characterX,
      tokens.characterY,
      derivedBase
    );
    onChangeTokens(nextTokens);
  };

  // Scale calculations & handlers
  const scaleSizeOptions = [
    { value: 0.85, label: '85%' },
    { value: 0.92, label: '92%' },
    { value: 1.0, label: '100%' },
    { value: 1.1, label: '110%' },
    { value: 1.2, label: '120%' },
    { value: 1.35, label: '135%' },
    { value: 1.5, label: '150%' },
  ];
  const currentSizeOption =
    scaleSizeOptions.reduce((prev, curr) =>
      Math.abs(curr.value - tokens.fontScale) <
      Math.abs(prev.value - tokens.fontScale)
        ? curr
        : prev
    ).value;

  const proportionOptions = [
    { value: 1.15, label: '1.15×' },
    { value: 1.2, label: '1.20×' },
    { value: 1.25, label: '1.25×' },
    { value: 1.33, label: '1.33×' },
    { value: 1.44, label: '1.44×' },
    { value: 1.5, label: '1.50×' },
    { value: 1.62, label: '1.62×' },
  ];
  const currentProportion = tokens.scaleProportion || 1.44;
  const currentProportionOption =
    proportionOptions.reduce((prev, curr) =>
      Math.abs(curr.value - currentProportion) <
      Math.abs(prev.value - currentProportion)
        ? curr
        : prev
    ).value;

  const spacingOptions = [
    { value: 0.75, label: '75%' },
    { value: 0.85, label: '85%' },
    { value: 1.0, label: '100%' },
    { value: 1.15, label: '115%' },
    { value: 1.3, label: '130%' },
    { value: 1.5, label: '150%' },
  ];
  const currentSpacingOption =
    spacingOptions.reduce((prev, curr) =>
      Math.abs(curr.value - tokens.spacingMultiplier) <
      Math.abs(prev.value - tokens.spacingMultiplier)
        ? curr
        : prev
    ).value;

  const activeScaleUnits: Record<ScaleUnitName, ScaleUnitMetrics> =
    tokens.scaleUnits ||
    computeScaleUnits(
      tokens.fontScale,
      currentProportion,
      tokens.spacingMultiplier
    );

  const handleUpdateScaleUnitCell = (
    unit: ScaleUnitName,
    field: keyof ScaleUnitMetrics,
    nextVal: number
  ) => {
    const clamped = Math.max(1, Math.min(200, Math.round(nextVal || 0)));
    onChangeTokens({
      ...tokens,
      scaleUnits: {
        ...activeScaleUnits,
        [unit]: {
          ...activeScaleUnits[unit],
          [field]: clamped,
        },
      },
    });
  };

  const handleRoleFontChange = (role: FontRole, nextFamily: FontFamilyOption) => {
    const currentRoles = {
      ui: {
        family: getFontFamilyByRole(tokens, 'ui'),
        weight: tokens.bodyWeight,
        letterSpacingEm: 0,
      },
      brand: {
        family: getFontFamilyByRole(tokens, 'brand'),
        weight: tokens.headingWeight,
        letterSpacingEm: tokens.letterSpacingEm,
      },
      editorial: {
        family: getFontFamilyByRole(tokens, 'editorial'),
        weight: tokens.headingWeight,
        letterSpacingEm: tokens.letterSpacingEm,
      },
      data: {
        family: getFontFamilyByRole(tokens, 'data'),
        weight: 500,
        letterSpacingEm: 0,
      },
      ...(tokens.fontRoles || {}),
    };

    currentRoles[role] = {
      ...currentRoles[role],
      family: nextFamily,
    };

    const nextTokens: BrandTokens = {
      ...tokens,
      fontRoles: currentRoles,
    };

    if (role === 'brand') nextTokens.headingFont = nextFamily;
    if (role === 'ui') nextTokens.bodyFont = nextFamily;
    if (role === 'editorial') nextTokens.editorialFont = nextFamily;
    if (role === 'data') nextTokens.monoFont = nextFamily;

    onChangeTokens(nextTokens);
  };

  const thumbLeftPercent = ((tokens.characterX + 1) / 2) * 100;
  const thumbTopPercent = ((1 - tokens.characterY) / 2) * 100;

  // ============================================================================
  // CONTEXTUAL ELEMENT / BLOCK INSPECTOR (When a block or sub-element is selected)
  // ============================================================================
  if (selectedTarget && selectedBlock && onUpdateBlock) {
    const subId = selectedTarget.subElementId;

    // Check if subId is a composite primitive key like `button:button` or if selectedBlock is a `ui-*` block
    const isSingleUiBlock = selectedBlock.type.startsWith('ui-');
    const singleUiSlug = isSingleUiBlock
      ? selectedBlock.type.replace(/^ui-/, '')
      : null;

    const compositePrimitivePrefix =
      subId && subId.includes(':')
        ? (subId.split(':')[0] as ShadcnPrimitiveId)
        : singleUiSlug
        ? (singleUiSlug as ShadcnPrimitiveId)
        : selectedBlock.type === 'shadcn-slider-anatomy'
        ? ('slider' as ShadcnPrimitiveId)
        : null;

    const primitiveCatalogMeta = compositePrimitivePrefix
      ? SHADCN_PRIMITIVES_CATALOG.find((p) => p.id === compositePrimitivePrefix)
      : null;

    const availableSubElements: Array<{
      id: string;
      label: string;
      kind: 'text' | 'surface' | 'control';
    }> =
      selectedBlock.type === 'shadcn-interactive-suite' && primitiveCatalogMeta
        ? primitiveCatalogMeta.subParts.map((sp) => ({
            id: `${primitiveCatalogMeta.id}:${sp.id}`,
            label: sp.label,
            kind: sp.kind,
          }))
        : isSingleUiBlock && primitiveCatalogMeta
        ? primitiveCatalogMeta.subParts.map((sp) => ({
            id: sp.id,
            label: sp.label,
            kind: sp.kind,
          }))
        : SUB_ELEMENTS_BY_BLOCK[selectedBlock.type] ||
          getSpecimenSubElements(selectedBlock.type) ||
          [];

    const activeSubMeta = availableSubElements.find((s) => s.id === subId);

    const blockVariants = isSingleUiBlock
      ? SHADCN_BLOCK_VARIANTS[selectedBlock.type as ShadcnSingleBlockType] || []
      : getSpecimenVariants(selectedBlock.type);

    const currentOverrides: SubElementStyleOverrides = subId
      ? selectedBlock.subElements?.[subId] || {}
      : selectedBlock.overrides || {};

    const updateTargetOverrides = (
      patch: Partial<SubElementStyleOverrides>
    ) => {
      onUpdateBlock((blk) => {
        if (subId) {
          const prevSub = blk.subElements?.[subId] || {};
          return {
            ...blk,
            subElements: {
              ...(blk.subElements || {}),
              [subId]: { ...prevSub, ...patch },
            },
          };
        }
        return {
          ...blk,
          overrides: {
            ...(blk.overrides || {}),
            ...patch,
          },
        };
      });
    };

    const rawPartName =
      subId && subId.includes(':') ? subId.split(':')[1] : subId;

    // Determine contextual defaults based on subElement or block
    const isTextTarget =
      activeSubMeta?.kind === 'text' ||
      rawPartName === 'label' ||
      rawPartName === 'headline' ||
      rawPartName === 'body' ||
      rawPartName === 'balance' ||
      rawPartName === 'title' ||
      rawPartName === 'fallback';

    const defaultFillToken =
      rawPartName === 'track'
        ? 'Neutral 3'
        : rawPartName === 'thumb'
        ? 'Neutral 10'
        : isTextTarget
        ? 'Neutral 10'
        : 'Neutral 1';

    const headerTitle =
      selectedTarget.subElementLabel ||
      activeSubMeta?.label ||
      selectedBlock.title;
    const parentComponentLabel =
      primitiveCatalogMeta?.name ||
      selectedTarget.componentLabel ||
      (selectedBlock.type === 'shadcn-slider-anatomy'
        ? 'Slider'
        : selectedBlock.title);
    const variantBadge = selectedTarget.variantState || 'Default';

    return (
      <div className="w-full select-none">
        <div className="bg-[#111112] text-white rounded-[28px] shadow-2xl border border-white/[0.08] overflow-hidden">
          <div className="p-5 max-h-[calc(100vh-3rem)] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden space-y-4">
            {/* Inspector Top Header: ✕ Label / Track / Thumb */}
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <button
                    type="button"
                    onClick={onClearSelection}
                    className="p-1 -ml-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition"
                    title="Close inspector"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <h3 className="text-base font-medium text-white truncate">
                    {headerTitle}
                  </h3>
                </div>
                {compositePrimitivePrefix && onOpenExportModal ? (
                  <button
                    type="button"
                    onClick={() => onOpenExportModal(compositePrimitivePrefix)}
                    className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-[11px] text-white font-medium flex items-center gap-1.5 transition"
                  >
                    <Terminal className="w-3 h-3" />
                    <span>Export CLI</span>
                  </button>
                ) : (
                  subId && (
                    <button
                      type="button"
                      onClick={() => onSelectSubElement?.(undefined)}
                      className="text-[11px] text-zinc-400 hover:text-white transition"
                    >
                      Inspect Block
                    </button>
                  )
                )}
              </div>

              {/* Breadcrumb / Parent Context Row: Component Name -------- Variant Selector */}
              <div className="flex items-center justify-between text-xs mt-2.5">
                <span className="text-zinc-300 font-medium">
                  {parentComponentLabel}
                </span>
                {blockVariants.length > 1 ? (
                  <select
                    value={selectedBlock.variant || blockVariants[0]}
                    onChange={(e) => {
                      const nextVar = e.target.value;
                      onUpdateBlock((blk) => ({ ...blk, variant: nextVar }));
                    }}
                    className="bg-[#1C1C1E] hover:bg-[#252529] px-2.5 py-1 rounded-lg text-xs text-zinc-200 focus:outline-none cursor-pointer"
                  >
                    {blockVariants.map((v) => (
                      <option key={v} value={v} className="bg-[#1C1C1F]">
                        {v}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className="text-zinc-500">{variantBadge}</span>
                )}
              </div>

              {/* Sub-Element Quick Pills (e.g. Label | Track | Thumb) */}
              {availableSubElements.length > 0 && (
                <div className="flex items-center gap-1 mt-3 p-1 rounded-xl bg-[#1A1A1D]">
                  <button
                    type="button"
                    onClick={() => onSelectSubElement?.(undefined)}
                    className={`flex-1 py-1 px-2 rounded-lg text-[11px] transition ${
                      !subId
                        ? 'bg-[#323236] text-white font-medium shadow-sm'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Block
                  </button>
                  {availableSubElements.map((part) => (
                    <button
                      key={part.id}
                      type="button"
                      onClick={() => onSelectSubElement?.(part.id, part.label)}
                      className={`flex-1 py-1 px-2 rounded-lg text-[11px] transition truncate ${
                        subId === part.id
                          ? 'bg-[#323236] text-white font-medium shadow-sm'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      {part.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="divide-y divide-white/[0.06]">
              {/* 1. COLOR SECTION */}
              <div className="py-3.5 space-y-3">
                <button
                  type="button"
                  onClick={() => toggleInspectorSection('color')}
                  className="w-full flex items-center justify-between text-xs font-medium text-white"
                >
                  <span>Color</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-zinc-500 transition-transform ${
                      inspectorOpenSections.color ? '' : '-rotate-90'
                    }`}
                  />
                </button>

                {inspectorOpenSections.color && (
                  <div className="space-y-2.5 pt-1">
                    {isTextTarget ? (
                      <div className="grid grid-cols-[88px_1fr] items-center gap-2">
                        <span className="text-xs text-zinc-300">Text</span>
                        <SemanticColorTokenPicker
                          tokens={tokens}
                          value={currentOverrides.textColorToken}
                          fallbackId="Neutral 10"
                          onChange={(tokenId) =>
                            updateTargetOverrides({ textColorToken: tokenId })
                          }
                        />
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-[88px_1fr] items-center gap-2">
                          <span className="text-xs text-zinc-300">Fill</span>
                          <SemanticColorTokenPicker
                            tokens={tokens}
                            value={currentOverrides.fillToken}
                            fallbackId={defaultFillToken}
                            onChange={(tokenId) =>
                              updateTargetOverrides({ fillToken: tokenId })
                            }
                          />
                        </div>

                        {(rawPartName === 'track' || rawPartName === 'indicator') && (
                          <div className="grid grid-cols-[88px_1fr] items-center gap-2">
                            <span className="text-xs text-zinc-300">
                              Active bar
                            </span>
                            <SemanticColorTokenPicker
                              tokens={tokens}
                              value={currentOverrides.accentFillToken}
                              fallbackId="Color 1"
                              onChange={(tokenId) =>
                                updateTargetOverrides({
                                  accentFillToken: tokenId,
                                })
                              }
                            />
                          </div>
                        )}

                        <div className="grid grid-cols-[88px_1fr] items-center gap-2">
                          <span className="text-xs text-zinc-300">
                            Fill opacity
                          </span>
                          <SteppedPillSlider
                            options={[
                              { value: 20, label: '20%' },
                              { value: 40, label: '40%' },
                              { value: 60, label: '60%' },
                              { value: 80, label: '80%' },
                              { value: 90, label: '90%' },
                              { value: 100, label: '100%' },
                            ]}
                            value={currentOverrides.fillOpacity ?? 100}
                            onChange={(val) =>
                              updateTargetOverrides({ fillOpacity: val })
                            }
                          />
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* 2. TYPOGRAPHY SECTION (Shown for Label / Text / Block) */}
              {(isTextTarget || !subId || subId === 'pay-button' || subId === 'badge') && (
                <div className="py-3.5 space-y-3">
                  <button
                    type="button"
                    onClick={() => toggleInspectorSection('typography')}
                    className="w-full flex items-center justify-between text-xs font-medium text-white"
                  >
                    <span>Typography</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-zinc-500 transition-transform ${
                        inspectorOpenSections.typography ? '' : '-rotate-90'
                      }`}
                    />
                  </button>

                  {inspectorOpenSections.typography && (
                    <div className="space-y-2.5 pt-1">
                      <div className="grid grid-cols-[88px_1fr] items-center gap-2">
                        <span className="text-xs text-zinc-300">Font</span>
                        <div className="relative">
                          <select
                            value={currentOverrides.fontRole || 'ui'}
                            onChange={(e) =>
                              updateTargetOverrides({
                                fontRole: e.target.value as FontRole,
                              })
                            }
                            className="w-full h-9 px-3 rounded-xl bg-[#242427] hover:bg-[#2C2C30] border border-white/[0.06] text-xs text-white focus:outline-none appearance-none cursor-pointer"
                          >
                            <option value="ui" className="bg-[#1C1C1F]">
                              UI ({getFontFamilyByRole(tokens, 'ui')})
                            </option>
                            <option value="brand" className="bg-[#1C1C1F]">
                              Brand ({getFontFamilyByRole(tokens, 'brand')})
                            </option>
                            <option value="editorial" className="bg-[#1C1C1F]">
                              Editorial ({getFontFamilyByRole(tokens, 'editorial')})
                            </option>
                            <option value="data" className="bg-[#1C1C1F]">
                              Data ({getFontFamilyByRole(tokens, 'data')})
                            </option>
                          </select>
                          <ChevronsUpDown className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>

                      <div className="grid grid-cols-[88px_1fr] items-center gap-2">
                        <span className="text-xs text-zinc-300">Text size</span>
                        <SteppedPillSlider<ScaleUnitName>
                          options={[
                            { value: 'XXS', label: 'XXS' },
                            { value: 'XS', label: 'XS' },
                            { value: 'S', label: 'S' },
                            { value: 'M', label: 'M' },
                            { value: 'L', label: 'L' },
                            { value: 'XL', label: 'XL' },
                            { value: 'XXL', label: 'XXL' },
                          ]}
                          value={currentOverrides.textSize || 'S'}
                          onChange={(val) =>
                            updateTargetOverrides({ textSize: val })
                          }
                        />
                      </div>

                      <div className="grid grid-cols-[88px_1fr] items-center gap-2">
                        <span className="text-xs text-zinc-300">Weight</span>
                        <SteppedPillSlider<TextWeightName>
                          options={[
                            { value: 'Light', label: 'Light' },
                            { value: 'Regular', label: 'Regular' },
                            { value: 'Medium', label: 'Medium' },
                            { value: 'Bold', label: 'Bold' },
                          ]}
                          value={currentOverrides.fontWeight || 'Medium'}
                          onChange={(val) =>
                            updateTargetOverrides({ fontWeight: val })
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 3. BORDER SECTION (Shown for non-text or block targets) */}
              {!isTextTarget && (
                <div className="py-3.5 space-y-3">
                  <button
                    type="button"
                    onClick={() => toggleInspectorSection('border')}
                    className="w-full flex items-center justify-between text-xs font-medium text-white"
                  >
                    <span>Border</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-zinc-500 transition-transform ${
                        inspectorOpenSections.border ? '' : '-rotate-90'
                      }`}
                    />
                  </button>

                  {inspectorOpenSections.border && (
                    <div className="space-y-2.5 pt-1">
                      <div className="grid grid-cols-[88px_1fr] items-center gap-2">
                        <span className="text-xs text-zinc-300">Border</span>
                        <SemanticColorTokenPicker
                          tokens={tokens}
                          value={currentOverrides.borderToken}
                          fallbackId="Neutral 4 Transparent"
                          onChange={(tokenId) =>
                            updateTargetOverrides({ borderToken: tokenId })
                          }
                        />
                      </div>

                      <div className="grid grid-cols-[88px_1fr] items-center gap-2">
                        <span className="text-xs text-zinc-300">
                          Border width
                        </span>
                        <SteppedPillSlider<BorderWidthName>
                          options={[
                            { value: 'None', label: 'None' },
                            { value: 'S', label: 'S' },
                            { value: 'M', label: 'M' },
                            { value: 'L', label: 'L' },
                          ]}
                          value={currentOverrides.borderWidth || 'None'}
                          onChange={(val) =>
                            updateTargetOverrides({ borderWidth: val })
                          }
                        />
                      </div>

                      {(currentOverrides.borderWidth || 'None') === 'None' &&
                        tokens.borderWidth === 0 && (
                          <div className="grid grid-cols-[88px_1fr] gap-2">
                            <span />
                            <p className="text-[11px] text-zinc-500">
                              S, M and L are 0 currently.
                            </p>
                          </div>
                        )}
                    </div>
                  )}
                </div>
              )}

              {/* 4. SPACING SECTION */}
              {!isTextTarget && (
                <div className="py-3.5 space-y-3">
                  <button
                    type="button"
                    onClick={() => toggleInspectorSection('spacing')}
                    className="w-full flex items-center justify-between text-xs font-medium text-white"
                  >
                    <span>Spacing</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-zinc-500 transition-transform ${
                        inspectorOpenSections.spacing ? '' : '-rotate-90'
                      }`}
                    />
                  </button>

                  {inspectorOpenSections.spacing && (
                    <div className="space-y-2.5 pt-1">
                      <div className="grid grid-cols-[88px_1fr] items-center gap-2">
                        <span className="text-xs text-zinc-300">
                          Control size
                        </span>
                        <SteppedPillSlider<ControlSizeName>
                          options={[
                            { value: 'XS', label: 'XS' },
                            { value: 'S', label: 'S' },
                            { value: 'M', label: 'M' },
                            { value: 'L', label: 'L' },
                            { value: 'XL', label: 'XL' },
                            { value: 'XXL', label: 'XXL' },
                          ]}
                          value={currentOverrides.controlSize || 'XL'}
                          onChange={(val) =>
                            updateTargetOverrides({ controlSize: val })
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 5. SHAPE SECTION */}
              {!isTextTarget && (
                <div className="py-3.5 space-y-3">
                  <button
                    type="button"
                    onClick={() => toggleInspectorSection('shape')}
                    className="w-full flex items-center justify-between text-xs font-medium text-white"
                  >
                    <span>Shape</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-zinc-500 transition-transform ${
                        inspectorOpenSections.shape ? '' : '-rotate-90'
                      }`}
                    />
                  </button>

                  {inspectorOpenSections.shape && (
                    <div className="space-y-2.5 pt-1">
                      <div className="grid grid-cols-[88px_1fr] items-center gap-2">
                        <span className="text-xs text-zinc-300">
                          Corner radius
                        </span>
                        <div className="flex items-center gap-1.5 min-w-0">
                          <SteppedPillSlider<CornerRadiusName>
                            className="flex-1"
                            options={[
                              { value: 'None', label: 'None' },
                              { value: 'XS', label: 'XS' },
                              { value: 'S', label: 'S' },
                              { value: 'M', label: 'M' },
                              { value: 'L', label: 'L' },
                              { value: 'XL', label: 'XL' },
                              { value: 'Full', label: 'Full' },
                            ]}
                            value={currentOverrides.cornerRadius || 'Full'}
                            onChange={(val) =>
                              updateTargetOverrides({ cornerRadius: val })
                            }
                          />
                          <button
                            type="button"
                            onClick={() =>
                              updateTargetOverrides({
                                individualCorners:
                                  !currentOverrides.individualCorners,
                              })
                            }
                            title="Individual corners"
                            className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 transition ${
                              currentOverrides.individualCorners
                                ? 'bg-[#323236] text-white border-white/20'
                                : 'bg-[#1C1C1E] text-zinc-400 hover:text-white border-white/[0.04]'
                            }`}
                          >
                            <Scan className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {currentOverrides.individualCorners && (
                        <div className="grid grid-cols-4 gap-1.5 pl-[96px]">
                          {(
                            [
                              { key: 'cornerTL', label: 'TL' },
                              { key: 'cornerTR', label: 'TR' },
                              { key: 'cornerBR', label: 'BR' },
                              { key: 'cornerBL', label: 'BL' },
                            ] as const
                          ).map((c) => (
                            <div
                              key={c.key}
                              className="bg-[#1C1C1E] rounded-lg px-2 py-1.5 text-center"
                            >
                              <div className="text-[9px] text-zinc-500">
                                {c.label}
                              </div>
                              <input
                                type="number"
                                min={0}
                                max={64}
                                value={
                                  currentOverrides[c.key] ?? tokens.radiusPx
                                }
                                onChange={(e) =>
                                  updateTargetOverrides({
                                    [c.key]: Number(e.target.value),
                                  })
                                }
                                className="w-full bg-transparent text-center text-xs text-white focus:outline-none mt-0.5"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* 6. SHADOWS SECTION */}
              <div className="py-3.5 space-y-3">
                <button
                  type="button"
                  onClick={() => toggleInspectorSection('shadows')}
                  className="w-full flex items-center justify-between text-xs font-medium text-white"
                >
                  <span>Shadows</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-zinc-500 transition-transform ${
                      inspectorOpenSections.shadows ? '' : '-rotate-90'
                    }`}
                  />
                </button>

                {inspectorOpenSections.shadows && (
                  <div className="pt-1">
                    {!currentOverrides.shadow ||
                    currentOverrides.shadow === 'none' ? (
                      <button
                        type="button"
                        onClick={() =>
                          updateTargetOverrides({ shadow: 'subtle' })
                        }
                        className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition py-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add shadow</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <SteppedPillSlider<'subtle' | 'elevated'>
                          className="flex-1"
                          options={[
                            { value: 'subtle', label: 'Subtle' },
                            { value: 'elevated', label: 'Elevated' },
                          ]}
                          value={currentOverrides.shadow}
                          onChange={(val) =>
                            updateTargetOverrides({ shadow: val })
                          }
                        />
                        <button
                          type="button"
                          onClick={() =>
                            updateTargetOverrides({ shadow: 'none' })
                          }
                          className="p-2 rounded-xl bg-[#1C1C1E] text-zinc-400 hover:text-white"
                          title="Remove shadow"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 7. BENTO BLOCK & ROW SETTINGS */}
              <div className="py-3.5 space-y-3">
                <button
                  type="button"
                  onClick={() => toggleInspectorSection('blockSettings')}
                  className="w-full flex items-center justify-between text-xs font-medium text-white"
                >
                  <span>Block & Grid Settings</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-zinc-500 transition-transform ${
                      inspectorOpenSections.blockSettings ? '' : '-rotate-90'
                    }`}
                  />
                </button>

                {inspectorOpenSections.blockSettings && (
                  <div className="space-y-3 pt-1">
                    <div className="space-y-1.5">
                      <span className="text-[11px] text-zinc-400">
                        Specimen Type
                      </span>
                      <select
                        value={selectedBlock.type}
                        onChange={(e) => {
                          const nextType = e.target.value as BlockType;
                          const cat = BLOCK_CATALOG.find(
                            (b) => b.type === nextType
                          );
                          onUpdateBlock((blk) => ({
                            ...blk,
                            type: nextType,
                            title: cat?.label || blk.title,
                          }));
                        }}
                        className="w-full h-9 px-3 rounded-xl bg-[#1C1C1E] text-xs text-white focus:outline-none cursor-pointer"
                      >
                        {BLOCK_CATALOG.map((item) => (
                          <option
                            key={item.type}
                            value={item.type}
                            className="bg-[#1C1C1F]"
                          >
                            {item.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-[88px_1fr] items-center gap-2">
                      <span className="text-xs text-zinc-300">Surface</span>
                      <SteppedPillSlider<BlockTheme>
                        options={[
                          { value: 'light', label: 'Light' },
                          { value: 'tinted', label: 'Tinted' },
                          { value: 'brand', label: 'Brand' },
                          { value: 'dark', label: 'Dark' },
                        ]}
                        value={selectedBlock.theme}
                        onChange={(nextTheme) =>
                          onUpdateBlock((blk) => ({ ...blk, theme: nextTheme }))
                        }
                      />
                    </div>

                    {selectedRowLayout && onChangeRowLayout && (
                      <div className="grid grid-cols-[88px_1fr] items-center gap-2">
                        <span className="text-xs text-zinc-300">Row grid</span>
                        <SteppedPillSlider<ColumnLayout>
                          options={[
                            { value: '1-col', label: '1 Col' },
                            { value: '2-col-50-50', label: '50/50' },
                            { value: '2-col-66-33', label: '66/33' },
                            { value: '3-col', label: '3 Col' },
                          ]}
                          value={selectedRowLayout}
                          onChange={onChangeRowLayout}
                        />
                      </div>
                    )}

                    {onDeleteRow && (
                      <button
                        type="button"
                        onClick={onDeleteRow}
                        className="w-full py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs flex items-center justify-center gap-1.5 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove Bento Row</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // GLOBAL THEME & EDIT ACCORDION PANEL
  // ============================================================================
  return (
    <div className="w-full select-none">
      {/* Outer shell preserves crisp 28px rounded corners at all times */}
      <div className="bg-[#111112] text-white rounded-[28px] shadow-2xl border border-white/[0.06] overflow-hidden">
        {/* Inner scroll area with hidden native scrollbar */}
        <div className="p-5 max-h-[calc(100vh-3rem)] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {studioView === 'main' && (
            <div className="space-y-4">
              {/* Clean Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-white">Theme</h3>
                <div className="flex items-center gap-1">
                  <button
                    onClick={onResetTokens}
                    title="Restore defaults"
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-white transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setStudioView('edit')}
                    className="px-2.5 py-1 rounded-lg text-xs text-zinc-300 hover:text-white hover:bg-white/[0.06] flex items-center gap-1.5 transition"
                  >
                    <span>Edit</span>
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Style Preset */}
              <div className="bg-[#1C1C1E] rounded-2xl px-4 py-2.5 flex items-center justify-between">
                <span className="text-xs text-zinc-400">Style</span>
                <select
                  value={
                    Object.keys(BRAND_PRESETS).find(
                      (k) =>
                        BRAND_PRESETS[k].stylePresetName ===
                        tokens.stylePresetName
                    ) || 'Felt'
                  }
                  onChange={(e) => {
                    const preset = BRAND_PRESETS[e.target.value];
                    if (preset) {
                      onChangeTokens(
                        modulateTokensByCharacter(
                          preset,
                          preset.characterX,
                          preset.characterY,
                          preset.basePalette
                        )
                      );
                    }
                  }}
                  className="bg-transparent text-xs font-medium text-white focus:outline-none cursor-pointer text-right"
                >
                  {Object.keys(BRAND_PRESETS).map((key) => (
                    <option
                      key={key}
                      value={key}
                      className="bg-zinc-900 text-white"
                    >
                      {BRAND_PRESETS[key].stylePresetName}
                    </option>
                  ))}
                </select>
              </div>

              {/* 2D Character XY Pad — Free 60fps Dragging */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-300">Character</span>
                  <span className="text-[10px] font-mono text-zinc-500">
                    {tokens.headingWeight}w · {tokens.radiusPx}px ·{' '}
                    {Math.round(tokens.fontScale * 100)}%
                  </span>
                </div>

                <div
                  ref={padRef}
                  onPointerDown={handlePadPointerDown}
                  onPointerMove={handlePadPointerMove}
                  onPointerUp={handlePadPointerUp}
                  onPointerCancel={handlePadPointerUp}
                  className="relative h-36 rounded-2xl bg-[#1C1C1E] cursor-grab active:cursor-grabbing overflow-hidden touch-none select-none"
                >
                  <div
                    className="absolute inset-4 opacity-25 pointer-events-none"
                    style={{
                      backgroundImage:
                        'radial-gradient(circle, #71717A 1px, transparent 1px)',
                      backgroundSize: '14px 14px',
                    }}
                  />

                  {isDraggingPad && (
                    <div className="absolute inset-3.5 pointer-events-none">
                      <div
                        className="absolute top-0 bottom-0 w-px bg-white/15"
                        style={{ left: `${thumbLeftPercent}%` }}
                      />
                      <div
                        className="absolute left-0 right-0 h-px bg-white/15"
                        style={{ top: `${thumbTopPercent}%` }}
                      />
                    </div>
                  )}

                  <span className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] text-zinc-500 pointer-events-none">
                    Airy
                  </span>
                  <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-zinc-500 pointer-events-none">
                    Compact
                  </span>
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] text-zinc-500 pointer-events-none">
                    Quiet
                  </span>
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 rotate-90 text-[10px] text-zinc-500 pointer-events-none">
                    Bold
                  </span>

                  <div className="absolute inset-3.5 pointer-events-none">
                    <div
                      className={`w-5 h-5 -ml-2.5 -mt-2.5 rounded-full bg-white shadow-[0_0_16px_rgba(255,255,255,0.9)] border-2 border-[#111112] ${
                        isDraggingPad
                          ? 'scale-125'
                          : 'transition-all duration-150'
                      }`}
                      style={{
                        left: `${thumbLeftPercent}%`,
                        top: `${thumbTopPercent}%`,
                        position: 'absolute',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Motion */}
              <div className="bg-[#1C1C1E] rounded-2xl px-4 py-2.5 flex items-center justify-between">
                <span className="text-xs text-zinc-400">Motion</span>
                <select
                  value={tokens.motion}
                  onChange={(e) =>
                    onChangeTokens({
                      ...tokens,
                      motion: e.target.value as MotionPreset,
                    })
                  }
                  className="bg-transparent text-xs font-medium text-white focus:outline-none cursor-pointer capitalize"
                >
                  <option value="snappy" className="bg-zinc-900">
                    Snappy
                  </option>
                  <option value="smooth" className="bg-zinc-900">
                    Smooth
                  </option>
                  <option value="playful" className="bg-zinc-900">
                    Playful
                  </option>
                </select>
              </div>

              {/* Color Spectrum Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-300">Color</span>
                  <div className="flex items-center gap-1">
                    {[
                      tokens.primaryColor,
                      tokens.supportColor,
                      tokens.secondaryColor,
                      tokens.accentColor,
                    ].map((hex, i) => (
                      <span
                        key={i}
                        className="w-2.5 h-2.5 rounded-full border border-white/15 transition-colors duration-200"
                        style={{ backgroundColor: hex }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1 h-11 rounded-2xl flex items-center bg-[#1C1C1E] p-1">
                    {COLOR_MOOD_PALETTES.map((mood) => {
                      const isSelected =
                        tokens.basePalette.primaryColor.toLowerCase() ===
                        mood.primaryColor.toLowerCase();
                      return (
                        <button
                          key={mood.id}
                          onClick={() => handleSelectColorMood(mood)}
                          title={`${mood.name} Palette`}
                          className={`h-full flex-1 transition-all relative ${
                            isSelected
                              ? 'rounded-xl ring-2 ring-white z-10 scale-y-110 shadow-lg'
                              : 'first:rounded-l-xl last:rounded-r-xl hover:opacity-95'
                          }`}
                          style={{ backgroundColor: mood.primaryColor }}
                        />
                      );
                    })}
                  </div>

                  <button
                    onClick={() => colorInputRef.current?.click()}
                    className="w-10 h-11 rounded-2xl bg-zinc-100 text-zinc-900 hover:bg-white flex items-center justify-center transition shrink-0"
                    title="Custom primary color (auto-generates mood palette)"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <input
                    ref={colorInputRef}
                    type="color"
                    value={tokens.primaryColor}
                    onChange={(e) => handleCustomHexChange(e.target.value)}
                    className="sr-only"
                  />
                </div>

                <div className="space-y-1.5 pt-0.5">
                  <div className="bg-[#1C1C1E] rounded-2xl px-4 py-2.5 flex items-center justify-between">
                    <span className="text-xs text-zinc-400">Neutrals</span>
                    <select
                      value={tokens.neutralTone}
                      onChange={(e) =>
                        onChangeTokens({
                          ...tokens,
                          neutralTone: e.target.value as NeutralTone,
                        })
                      }
                      className="bg-transparent text-xs font-medium text-white focus:outline-none cursor-pointer capitalize"
                    >
                      <option value="mono" className="bg-zinc-900">
                        Mono
                      </option>
                      <option value="warm" className="bg-zinc-900">
                        Warm
                      </option>
                      <option value="cool" className="bg-zinc-900">
                        Cool
                      </option>
                      <option value="sand" className="bg-zinc-900">
                        Sand
                      </option>
                    </select>
                  </div>

                  <div className="bg-[#1C1C1E] rounded-2xl px-4 py-2.5 flex items-center justify-between">
                    <span className="text-xs text-zinc-400">Primary action</span>
                    <select
                      value={tokens.primaryActionStyle}
                      onChange={(e) =>
                        onChangeTokens({
                          ...tokens,
                          primaryActionStyle: e.target.value as any,
                        })
                      }
                      className="bg-transparent text-xs font-medium text-white focus:outline-none cursor-pointer capitalize"
                    >
                      <option value="neutral" className="bg-zinc-900">
                        Neutral
                      </option>
                      <option value="brand" className="bg-zinc-900">
                        Brand
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Typography */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-300">Typography</span>
                  <button
                    type="button"
                    onClick={() => {
                      setStudioView('edit');
                      setOpenEditSections((p) => ({ ...p, fonts: true }));
                    }}
                    className="text-[11px] text-zinc-500 hover:text-zinc-300 transition"
                  >
                    4 Roles →
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <FontSearchPicker
                    value={tokens.headingFont}
                    onChange={(nextFont) =>
                      handleRoleFontChange('brand', nextFont)
                    }
                  />
                </div>
              </div>

              {/* Stepped Corner Radius Slider */}
              <div className="space-y-1.5 pt-0.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Corners</span>
                  <span className="text-zinc-400">{tokens.radiusPx}px</span>
                </div>
                <SteppedPillSlider<number>
                  options={[
                    { value: 0, label: '0px' },
                    { value: 6, label: '6px' },
                    { value: 12, label: '12px' },
                    { value: 16, label: '16px' },
                    { value: 22, label: '22px' },
                    { value: 28, label: 'Full' },
                  ]}
                  value={
                    [0, 6, 12, 16, 22, 28].reduce((prev, curr) =>
                      Math.abs(curr - tokens.radiusPx) <
                      Math.abs(prev - tokens.radiusPx)
                        ? curr
                        : prev
                    )
                  }
                  onChange={(val) =>
                    onChangeTokens({
                      ...tokens,
                      baseRadiusPx: val,
                      radiusPx: val,
                    })
                  }
                />
              </div>
            </div>
          )}

          {/* =================================================================
              EDIT <STYLE> — INLINE COLLAPSIBLE ACCORDION (Screenshots 1–4)
             ================================================================= */}
          {studioView === 'edit' && (
            <div className="space-y-1">
              {/* Top Back Bar: ← Edit <PresetName> */}
              <div className="flex items-center gap-3 pb-3 mb-1 border-b border-white/[0.08]">
                <button
                  onClick={() => setStudioView('main')}
                  className="p-1.5 -ml-1.5 rounded-lg hover:bg-white/10 text-zinc-300 transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <h3 className="text-base font-medium text-white">
                  Edit {tokens.stylePresetName}
                </h3>
              </div>

              <div className="divide-y divide-white/[0.07]">
                {/* 1. COLORS ACCORDION */}
                <div className="py-3">
                  <button
                    type="button"
                    onClick={() => toggleEditSection('colors')}
                    className="w-full py-1 flex items-center justify-between text-sm text-zinc-100 hover:text-white transition"
                  >
                    <span className="flex items-center gap-3">
                      <Palette className="w-4 h-4 text-zinc-400" />
                      <span>Colors</span>
                    </span>
                    {openEditSections.colors ? (
                      <ChevronDown className="w-4 h-4 text-zinc-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-zinc-500" />
                    )}
                  </button>

                  {openEditSections.colors && (
                    <div className="mt-3.5 space-y-2.5">
                      {[
                        { label: 'Color 1 (Primary)', key: 'primaryColor' as const },
                        { label: 'Color 2 (Support)', key: 'supportColor' as const },
                        { label: 'Color 3 (Secondary)', key: 'secondaryColor' as const },
                        { label: 'Color 4 (Accent)', key: 'accentColor' as const },
                        { label: 'Surface Tint', key: 'surfaceTint' as const },
                      ].map((c) => (
                        <div
                          key={c.key}
                          className="flex items-center justify-between gap-2"
                        >
                          <span className="text-xs text-zinc-300">{c.label}</span>
                          <label className="h-9 px-3 rounded-xl bg-[#1C1C1E] hover:bg-[#252529] border border-white/[0.05] flex items-center gap-2 cursor-pointer">
                            <TokenColorSwatchCircle hex={tokens[c.key]} size={16} />
                            <span className="text-xs font-mono text-zinc-200 uppercase">
                              {tokens[c.key]}
                            </span>
                            <input
                              type="color"
                              value={tokens[c.key]}
                              onChange={(e) =>
                                onChangeTokens({
                                  ...tokens,
                                  basePalette: {
                                    ...tokens.basePalette,
                                    [c.key]: e.target.value,
                                  },
                                  [c.key]: e.target.value,
                                })
                              }
                              className="sr-only"
                            />
                          </label>
                        </div>
                      ))}

                      {/* Neutral 1..10 Ramp Preview */}
                      <div className="pt-2 space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] text-zinc-400">
                          <span>Neutral 1–10 Ramp</span>
                          <span className="capitalize">{tokens.neutralTone}</span>
                        </div>
                        <div className="grid grid-cols-10 gap-1 p-1.5 rounded-xl bg-[#1C1C1E]">
                          {getNeutralRamp10(tokens.neutralTone).map((hex, idx) => (
                            <div
                              key={idx}
                              title={`Neutral ${idx + 1} (${hex})`}
                              className="h-5 rounded-md border border-white/10"
                              style={{ backgroundColor: hex }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. SCALE ACCORDION (Screenshots 1 & 3 — Size, Proportion, Spacing + XXS–XXL Unit Table) */}
                <div className="py-3">
                  <button
                    type="button"
                    onClick={() => toggleEditSection('scale')}
                    className="w-full py-1 flex items-center justify-between text-sm text-zinc-100 hover:text-white transition"
                  >
                    <span className="flex items-center gap-3">
                      <Maximize2 className="w-4 h-4 text-zinc-400" />
                      <span>Scale</span>
                    </span>
                    {openEditSections.scale ? (
                      <ChevronDown className="w-4 h-4 text-zinc-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-zinc-500" />
                    )}
                  </button>

                  {openEditSections.scale && (
                    <div className="mt-3.5 space-y-3.5">
                      {/* 3 Stepped Sliders: Size, Proportion, Spacing */}
                      <div className="space-y-2.5">
                        <div className="grid grid-cols-[88px_1fr] items-center gap-2">
                          <span className="text-xs text-zinc-200">Size</span>
                          <SteppedPillSlider<number>
                            options={scaleSizeOptions}
                            value={currentSizeOption}
                            onChange={(nextFontScale) => {
                              const nextUnits = computeScaleUnits(
                                nextFontScale,
                                currentProportion,
                                tokens.spacingMultiplier
                              );
                              onChangeTokens({
                                ...tokens,
                                fontScale: nextFontScale,
                                scaleUnits: nextUnits,
                              });
                            }}
                          />
                        </div>

                        <div className="grid grid-cols-[88px_1fr] items-center gap-2">
                          <span className="text-xs text-zinc-200">
                            Proportion
                          </span>
                          <SteppedPillSlider<number>
                            options={proportionOptions}
                            value={currentProportionOption}
                            onChange={(nextProp) => {
                              const nextUnits = computeScaleUnits(
                                tokens.fontScale,
                                nextProp,
                                tokens.spacingMultiplier
                              );
                              onChangeTokens({
                                ...tokens,
                                scaleProportion: nextProp,
                                scaleUnits: nextUnits,
                              });
                            }}
                          />
                        </div>

                        <div className="grid grid-cols-[88px_1fr] items-center gap-2">
                          <span className="text-xs text-zinc-200">Spacing</span>
                          <SteppedPillSlider<number>
                            options={spacingOptions}
                            value={currentSpacingOption}
                            onChange={(nextSpacing) => {
                              const nextUnits = computeScaleUnits(
                                tokens.fontScale,
                                currentProportion,
                                nextSpacing
                              );
                              onChangeTokens({
                                ...tokens,
                                spacingMultiplier: nextSpacing,
                                scale:
                                  nextSpacing > 1.1
                                    ? 'airy'
                                    : nextSpacing < 0.9
                                    ? 'compact'
                                    : 'default',
                                scaleUnits: nextUnits,
                              });
                            }}
                          />
                        </div>
                      </div>

                      {/* Unit Table: XXS, XS, S, M, L, XL, XXL -> Size | Height | Spacing */}
                      <div className="pt-1 space-y-2">
                        <div className="grid grid-cols-[88px_1fr] items-center gap-2 text-[11px] text-zinc-400">
                          <span>Unit</span>
                          <div className="grid grid-cols-3 text-center">
                            <span>Size</span>
                            <span>Height</span>
                            <span>Spacing</span>
                          </div>
                        </div>

                        {SCALE_UNIT_KEYS.map((unitKey) => {
                          const rowMetrics = activeScaleUnits[unitKey];
                          return (
                            <div
                              key={unitKey}
                              className="grid grid-cols-[88px_1fr] items-center gap-2"
                            >
                              <span className="text-xs font-medium text-zinc-200">
                                {unitKey}
                              </span>
                              <div className="h-10 rounded-xl bg-[#1C1C1E] border border-white/[0.04] grid grid-cols-3 divide-x divide-white/[0.08] items-center">
                                {(
                                  ['size', 'height', 'spacing'] as const
                                ).map((field) => (
                                  <input
                                    key={field}
                                    type="number"
                                    value={rowMetrics[field]}
                                    onChange={(e) =>
                                      handleUpdateScaleUnitCell(
                                        unitKey,
                                        field,
                                        Number(e.target.value)
                                      )
                                    }
                                    className="w-full bg-transparent text-center text-xs text-zinc-100 focus:outline-none focus:text-white"
                                  />
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. FONTS ACCORDION (Screenshots 2 & 4 — UI, Brand, Editorial, Data + Search Popover + Sliders) */}
                <div className="py-3">
                  <button
                    type="button"
                    onClick={() => toggleEditSection('fonts')}
                    className="w-full py-1 flex items-center justify-between text-sm text-zinc-100 hover:text-white transition"
                  >
                    <span className="flex items-center gap-3">
                      <TypeIcon className="w-4 h-4 text-zinc-400" />
                      <span>Fonts</span>
                    </span>
                    {openEditSections.fonts ? (
                      <ChevronDown className="w-4 h-4 text-zinc-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-zinc-500" />
                    )}
                  </button>

                  {openEditSections.fonts && (
                    <div className="mt-3.5 space-y-2.5">
                      {(
                        [
                          { role: 'ui', label: 'UI' },
                          { role: 'brand', label: 'Brand' },
                          { role: 'editorial', label: 'Editorial' },
                          { role: 'data', label: 'Data' },
                        ] as Array<{ role: FontRole; label: string }>
                      ).map(({ role, label }) => {
                        const currentFamily = getFontFamilyByRole(tokens, role);
                        const isTuningOpen = expandedFontRole === role;

                        return (
                          <div key={role} className="space-y-2">
                            <div className="grid grid-cols-[76px_1fr] items-center gap-2">
                              <span className="text-xs text-zinc-200">
                                {label}
                              </span>
                              <div className="flex items-center gap-1.5 min-w-0">
                                <FontSearchPicker
                                  value={currentFamily}
                                  onChange={(nextFont) =>
                                    handleRoleFontChange(role, nextFont)
                                  }
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    setExpandedFontRole(
                                      isTuningOpen ? null : role
                                    )
                                  }
                                  title={`Tune ${label} weight & tracking`}
                                  className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 transition ${
                                    isTuningOpen
                                      ? 'bg-[#323236] text-white border-white/20'
                                      : 'bg-[#1C1C1E] hover:bg-[#252529] text-zinc-400 hover:text-white border-white/[0.05]'
                                  }`}
                                >
                                  <SlidersHorizontal className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {isTuningOpen && (
                              <div className="p-2.5 rounded-xl bg-[#18181B] border border-white/[0.06] space-y-2">
                                <div className="grid grid-cols-[68px_1fr] items-center gap-2">
                                  <span className="text-[11px] text-zinc-400">
                                    Weight
                                  </span>
                                  <SteppedPillSlider<number>
                                    options={[
                                      { value: 400, label: 'Regular' },
                                      { value: 500, label: 'Medium' },
                                      { value: 600, label: 'Semi' },
                                      { value: 700, label: 'Bold' },
                                      { value: 800, label: 'Heavy' },
                                    ]}
                                    value={
                                      role === 'ui' || role === 'data'
                                        ? tokens.bodyWeight
                                        : tokens.headingWeight
                                    }
                                    onChange={(w) => {
                                      if (role === 'ui' || role === 'data') {
                                        onChangeTokens({
                                          ...tokens,
                                          bodyWeight: w,
                                        });
                                      } else {
                                        onChangeTokens({
                                          ...tokens,
                                          headingWeight: w,
                                        });
                                      }
                                    }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 4. LETTER SPACING ACCORDION */}
                <div className="py-3">
                  <button
                    type="button"
                    onClick={() => toggleEditSection('letter-spacing')}
                    className="w-full py-1 flex items-center justify-between text-sm text-zinc-100 hover:text-white transition"
                  >
                    <span className="flex items-center gap-3">
                      <MoveHorizontal className="w-4 h-4 text-zinc-400" />
                      <span>Letter spacing</span>
                    </span>
                    {openEditSections['letter-spacing'] ? (
                      <ChevronDown className="w-4 h-4 text-zinc-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-zinc-500" />
                    )}
                  </button>

                  {openEditSections['letter-spacing'] && (
                    <div className="mt-3 grid grid-cols-[88px_1fr] items-center gap-2">
                      <span className="text-xs text-zinc-300">Tracking</span>
                      <SteppedPillSlider<'tight' | 'normal' | 'wide'>
                        options={[
                          { value: 'tight', label: 'Tight (-3%)' },
                          { value: 'normal', label: 'Normal (0%)' },
                          { value: 'wide', label: 'Wide (+2%)' },
                        ]}
                        value={tokens.letterSpacing}
                        onChange={(val) =>
                          onChangeTokens({
                            ...tokens,
                            letterSpacing: val,
                            letterSpacingEm:
                              val === 'tight'
                                ? -0.035
                                : val === 'wide'
                                ? 0.025
                                : 0,
                          })
                        }
                      />
                    </div>
                  )}
                </div>

                {/* 5. CORNERS ACCORDION */}
                <div className="py-3">
                  <button
                    type="button"
                    onClick={() => toggleEditSection('corners')}
                    className="w-full py-1 flex items-center justify-between text-sm text-zinc-100 hover:text-white transition"
                  >
                    <span className="flex items-center gap-3">
                      <CornerUpRight className="w-4 h-4 text-zinc-400" />
                      <span>Corners</span>
                    </span>
                    {openEditSections.corners ? (
                      <ChevronDown className="w-4 h-4 text-zinc-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-zinc-500" />
                    )}
                  </button>

                  {openEditSections.corners && (
                    <div className="mt-3 grid grid-cols-[88px_1fr] items-center gap-2">
                      <span className="text-xs text-zinc-300">Radius</span>
                      <SteppedPillSlider<number>
                        options={[
                          { value: 0, label: 'None' },
                          { value: 6, label: '6px' },
                          { value: 12, label: '12px' },
                          { value: 16, label: '16px' },
                          { value: 22, label: '22px' },
                          { value: 28, label: 'Full' },
                        ]}
                        value={
                          [0, 6, 12, 16, 22, 28].reduce((prev, curr) =>
                            Math.abs(curr - tokens.radiusPx) <
                            Math.abs(prev - tokens.radiusPx)
                              ? curr
                              : prev
                          )
                        }
                        onChange={(px) =>
                          onChangeTokens({
                            ...tokens,
                            baseRadiusPx: px,
                            radiusPx: px,
                          })
                        }
                      />
                    </div>
                  )}
                </div>

                {/* 6. BORDERS ACCORDION */}
                <div className="py-3">
                  <button
                    type="button"
                    onClick={() => toggleEditSection('borders')}
                    className="w-full py-1 flex items-center justify-between text-sm text-zinc-100 hover:text-white transition"
                  >
                    <span className="flex items-center gap-3">
                      <Square className="w-4 h-4 text-zinc-400" />
                      <span>Borders</span>
                    </span>
                    {openEditSections.borders ? (
                      <ChevronDown className="w-4 h-4 text-zinc-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-zinc-500" />
                    )}
                  </button>

                  {openEditSections.borders && (
                    <div className="mt-3 grid grid-cols-[88px_1fr] items-center gap-2">
                      <span className="text-xs text-zinc-300">Stroke</span>
                      <SteppedPillSlider<number>
                        options={[
                          { value: 0, label: 'None' },
                          { value: 1, label: '1px' },
                          { value: 2, label: '2px' },
                        ]}
                        value={tokens.borderWidth}
                        onChange={(bw) =>
                          onChangeTokens({ ...tokens, borderWidth: bw })
                        }
                      />
                    </div>
                  )}
                </div>

                {/* 7. SHADOWS ACCORDION */}
                <div className="py-3">
                  <button
                    type="button"
                    onClick={() => toggleEditSection('shadows')}
                    className="w-full py-1 flex items-center justify-between text-sm text-zinc-100 hover:text-white transition"
                  >
                    <span className="flex items-center gap-3">
                      <Layers className="w-4 h-4 text-zinc-400" />
                      <span>Shadows</span>
                    </span>
                    {openEditSections.shadows ? (
                      <ChevronDown className="w-4 h-4 text-zinc-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-zinc-500" />
                    )}
                  </button>

                  {openEditSections.shadows && (
                    <div className="mt-3 grid grid-cols-[88px_1fr] items-center gap-2">
                      <span className="text-xs text-zinc-300">Elevation</span>
                      <SteppedPillSlider<'none' | 'subtle' | 'elevated'>
                        options={[
                          { value: 'none', label: 'None' },
                          { value: 'subtle', label: 'Subtle' },
                          { value: 'elevated', label: 'Elevated' },
                        ]}
                        value={tokens.shadowDepth}
                        onChange={(sd) =>
                          onChangeTokens({ ...tokens, shadowDepth: sd })
                        }
                      />
                    </div>
                  )}
                </div>

                {/* 8. ICONS & MOTION ACCORDION */}
                <div className="py-3">
                  <button
                    type="button"
                    onClick={() => toggleEditSection('motion')}
                    className="w-full py-1 flex items-center justify-between text-sm text-zinc-100 hover:text-white transition"
                  >
                    <span className="flex items-center gap-3">
                      <Activity className="w-4 h-4 text-zinc-400" />
                      <span>Icons & Motion</span>
                    </span>
                    {openEditSections.motion ? (
                      <ChevronDown className="w-4 h-4 text-zinc-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-zinc-500" />
                    )}
                  </button>

                  {openEditSections.motion && (
                    <div className="mt-3 grid grid-cols-[88px_1fr] items-center gap-2">
                      <span className="text-xs text-zinc-300">Physics</span>
                      <SteppedPillSlider<MotionPreset>
                        options={[
                          { value: 'snappy', label: 'Snappy' },
                          { value: 'smooth', label: 'Smooth' },
                          { value: 'playful', label: 'Playful' },
                        ]}
                        value={tokens.motion}
                        onChange={(m) =>
                          onChangeTokens({ ...tokens, motion: m })
                        }
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
