import React, { useState, useRef } from 'react';
import {
  BrandTokens,
  EditorialBlock,
  SelectedInspectorTarget,
} from '../../types';
import {
  getFontClass,
  getReadableTextColor,
  getShadowClass,
  resolveSemanticColorToken,
} from '../../utils/styleUtils';
import {
  resolveWeightValue,
  resolveBorderWidthPx,
  resolveCornerRadiusCss,
  resolveControlSizePx,
  resolveTextMetrics,
  resolveShadowCss,
  resolveFillColorCss,
  getResolvedFontClass,
  getLimeScopeCssVars,
  buildBlockDataSlotCss,
} from '../../utils/overrideUtils';
import { BrandLogoMark } from './BrandLogoMark';
import { KoyotPortalProvider } from '../../systems/koyot/lib/portal';
import { Button as KoyotButton } from '../../systems/koyot/ui/button';
import { Badge as KoyotBadge } from '../../systems/koyot/ui/badge';
import { RadioGroup as KoyotRadioGroup, Radio as KoyotRadio } from '../../systems/koyot/ui/radio';
import { Field as KoyotField, FieldLabel as KoyotFieldLabel } from '../../systems/koyot/ui/field';
import { Input as KoyotInput } from '../../systems/koyot/ui/input';
import {
  ChevronRight,
  ChevronDown,
  Folder,
  Inbox,
  Users,
  Settings,
  Home,
  Copy,
  Check,
  Plus,
  Minus,
} from 'lucide-react';

export interface SpecimenProps {
  tokens: BrandTokens;
  block: EditorialBlock;
  containerWidth?: number;
  isInspectMode?: boolean;
  selectedTarget?: SelectedInspectorTarget | null;
  onSelectSubElement?: (
    subElementId: string,
    subElementLabel: string,
    componentLabel?: string,
    variantState?: 'Default' | 'Hover' | 'Disabled'
  ) => void;
}

/**
 * Interactive Component Anatomy & State Matrix (Default, Disabled, Hover)
 * Matches Reference Screenshots 5, 6, 7, 8, 9 (Slider -> Label, Track, Thumb)
 */
export const ShadcnSliderAnatomySpecimen: React.FC<SpecimenProps> = ({
  tokens,
  block,
  containerWidth = 760,
  isInspectMode = false,
  selectedTarget = null,
  onSelectSubElement,
}) => {
  const [sliderValue, setSliderValue] = useState<number>(48);
  const [isDraggingSlider, setIsDraggingSlider] = useState(false);
  const [hoveredPart, setHoveredPart] = useState<
    'label' | 'track' | 'thumb' | null
  >(null);
  const [copiedCard, setCopiedCard] = useState<string | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const labelOvr = block.subElements?.label;
  const trackOvr = block.subElements?.track;
  const thumbOvr = block.subElements?.thumb;

  const isThisBlockSelected = selectedTarget?.blockId === block.id;
  const selectedPart = isThisBlockSelected
    ? selectedTarget?.subElementId
    : undefined;

  // 1. Resolve Label styles
  const labelFontClass = getResolvedFontClass(tokens, labelOvr, 'ui');
  const labelMetrics = resolveTextMetrics(
    tokens,
    labelOvr?.textSize || 'S',
    Math.round(14 * tokens.fontScale)
  );
  const labelWeight = resolveWeightValue(
    labelOvr?.fontWeight || 'Medium',
    Math.max(500, tokens.bodyWeight)
  );
  const labelColor = labelOvr?.textColorToken
    ? resolveSemanticColorToken(labelOvr.textColorToken, tokens).cssColor
    : '#09090B';
  const labelShadow = resolveShadowCss(labelOvr?.shadow);

  // 2. Resolve Track styles
  const trackHeightPx = resolveControlSizePx(
    trackOvr?.controlSize || 'XL',
    34
  );
  const trackBg = resolveFillColorCss(
    tokens,
    trackOvr?.fillToken || 'Neutral 3',
    trackOvr?.fillOpacity ?? 100,
    '#F1F1EF'
  );
  const trackActiveFill = trackOvr?.accentFillToken
    ? resolveSemanticColorToken(trackOvr.accentFillToken, tokens).cssColor
    : tokens.primaryColor;
  const trackRadiusCss = resolveCornerRadiusCss(
    trackOvr || { cornerRadius: 'Full' },
    9999
  );
  const trackBorderWidth = resolveBorderWidthPx(
    trackOvr?.borderWidth || 'None',
    0
  );
  const trackBorderColor = trackOvr?.borderToken
    ? resolveSemanticColorToken(trackOvr.borderToken, tokens).cssColor
    : 'transparent';
  const trackShadow = resolveShadowCss(trackOvr?.shadow);

  // 3. Resolve Thumb styles
  const thumbSizePx = Math.max(16, trackHeightPx - 8);
  const thumbFill = resolveFillColorCss(
    tokens,
    thumbOvr?.fillToken || 'Neutral 1',
    thumbOvr?.fillOpacity ?? 100,
    '#FFFFFF'
  );
  const thumbRadiusCss = resolveCornerRadiusCss(
    thumbOvr || { cornerRadius: 'Full' },
    9999
  );
  const thumbBorderWidth = resolveBorderWidthPx(
    thumbOvr?.borderWidth || 'None',
    0
  );
  const thumbBorderColor = thumbOvr?.borderToken
    ? resolveSemanticColorToken(thumbOvr.borderToken, tokens).cssColor
    : 'transparent';
  const thumbShadow = resolveShadowCss(
    thumbOvr?.shadow,
    '0 1px 3px rgba(0,0,0,0.16)'
  );

  const updateSliderFromClientX = (clientX: number) => {
    const el = trackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const rel = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    setSliderValue(Math.round(rel * 100));
  };

  const handleCopySpec = (id: string) => {
    navigator.clipboard.writeText(
      `/* ${tokens.brandName} Slider (${id}) — Track: ${trackHeightPx}px, Radius: ${trackRadiusCss} */`
    );
    setCopiedCard(id);
    setTimeout(() => setCopiedCard(null), 1400);
  };

  const isTwoCol = containerWidth >= 540;

  const renderSliderInstance = (
    variant: 'Default' | 'Disabled' | 'Hover',
    interactive: boolean
  ) => {
    const isDisabled = variant === 'Disabled';
    const isHover = variant === 'Hover';

    const instanceActiveBar = isDisabled
      ? '#D6D3CD'
      : trackActiveFill;
    const instanceThumbFill = isDisabled ? '#FFFFFF' : thumbFill;

    return (
      <div className="w-full max-w-[290px] mx-auto select-none">
        {/* LABEL ROW */}
        <div className="flex items-center justify-between mb-2">
          <div
            onClick={(e) => {
              if (!isInspectMode) return;
              e.stopPropagation();
              onSelectSubElement?.('label', 'Label', 'Slider', variant);
            }}
            onMouseEnter={() =>
              interactive && isInspectMode && setHoveredPart('label')
            }
            onMouseLeave={() => interactive && setHoveredPart(null)}
            className={`relative px-1.5 py-0.5 -ml-1.5 transition ${labelFontClass} ${
              isInspectMode ? 'cursor-pointer' : ''
            } ${
              interactive &&
              (selectedPart === 'label' ||
                (isInspectMode && hoveredPart === 'label'))
                ? 'ring-1 ring-[#D946EF]'
                : ''
            }`}
            style={{
              fontSize: `${labelMetrics.fontSizePx}px`,
              lineHeight: `${labelMetrics.lineHeightPx}px`,
              fontWeight: labelWeight,
              color: isDisabled ? '#A1A1AA' : labelColor,
              textShadow: labelShadow,
            }}
          >
            Volume
          </div>

          <span
            className={`text-xs text-zinc-400 ${getFontClass(tokens.monoFont)}`}
          >
            {sliderValue}
          </span>
        </div>

        {/* TRACK BOUNDING BOX */}
        <div
          onClick={(e) => {
            if (!isInspectMode) return;
            e.stopPropagation();
            onSelectSubElement?.('track', 'Track', 'Slider', variant);
          }}
          onMouseEnter={() =>
            interactive && isInspectMode && setHoveredPart('track')
          }
          onMouseLeave={() => interactive && setHoveredPart(null)}
          className={`relative p-2.5 -mx-2.5 cursor-pointer transition ${
            interactive &&
            (selectedPart === 'track' ||
              (isInspectMode &&
                hoveredPart === 'track' &&
                hoveredPart !== 'thumb'))
              ? 'ring-1 ring-[#D946EF]'
              : ''
          }`}
        >
          <div
            ref={interactive ? trackRef : undefined}
            onPointerDown={(e) => {
              if (!interactive || isInspectMode) return;
              setIsDraggingSlider(true);
              updateSliderFromClientX(e.clientX);
            }}
            onPointerMove={(e) => {
              if (!interactive || !isDraggingSlider || isInspectMode) return;
              updateSliderFromClientX(e.clientX);
            }}
            onPointerUp={() => setIsDraggingSlider(false)}
            onPointerLeave={() => setIsDraggingSlider(false)}
            className="relative w-full flex items-center transition-all"
            style={{
              height: `${trackHeightPx}px`,
              backgroundColor: trackBg,
              borderRadius: trackRadiusCss,
              borderWidth: `${trackBorderWidth}px`,
              borderStyle: trackBorderWidth > 0 ? 'solid' : 'none',
              borderColor: trackBorderColor,
              boxShadow: trackShadow,
            }}
          >
            {/* Active Progress Pill */}
            <div
              className="h-full flex items-center justify-end pr-1 transition-all duration-75"
              style={{
                width: `${Math.max(16, sliderValue)}%`,
                backgroundColor: instanceActiveBar,
                borderRadius: trackRadiusCss,
              }}
            >
              {/* THUMB BOUNDING BOX */}
              <div
                onClick={(e) => {
                  if (!isInspectMode) return;
                  e.stopPropagation();
                  onSelectSubElement?.('thumb', 'Thumb', 'Slider', variant);
                }}
                onMouseEnter={(e) => {
                  e.stopPropagation();
                  if (interactive && isInspectMode) setHoveredPart('thumb');
                }}
                onMouseLeave={(e) => {
                  e.stopPropagation();
                  if (interactive && isInspectMode) setHoveredPart('track');
                }}
                className={`relative p-2 -m-2 flex items-center justify-center cursor-pointer ${
                  interactive &&
                  (selectedPart === 'thumb' ||
                    (isInspectMode && hoveredPart === 'thumb'))
                    ? 'ring-1 ring-[#D946EF]'
                    : ''
                }`}
              >
                <div
                  className={`transition-transform ${
                    isHover ? 'scale-105' : ''
                  }`}
                  style={{
                    width: `${thumbSizePx}px`,
                    height: `${thumbSizePx}px`,
                    backgroundColor: instanceThumbFill,
                    borderRadius: thumbRadiusCss,
                    borderWidth: `${thumbBorderWidth}px`,
                    borderStyle: thumbBorderWidth > 0 ? 'solid' : 'none',
                    borderColor: thumbBorderColor,
                    boxShadow: thumbShadow,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* TOP FULL CARD: Default State */}
      <div className="bg-white rounded-[24px] p-6 sm:p-8 min-h-[260px] flex flex-col justify-between relative group/card">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-zinc-800">Default</span>
          <div className="flex items-center gap-2">
            {isInspectMode && (
              <span className="text-[10px] text-[#D946EF] bg-[#D946EF]/10 px-2 py-0.5 rounded-full font-medium">
                Click Label, Track or Thumb to inspect
              </span>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleCopySpec('Default');
              }}
              className="w-7 h-7 rounded-lg bg-zinc-100/80 hover:bg-zinc-200/70 flex items-center justify-center text-zinc-500 hover:text-zinc-900 opacity-0 group-hover/card:opacity-100 transition"
              title="Copy component spec"
            >
              {copiedCard === 'Default' ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        <div className="my-auto py-8">
          {renderSliderInstance('Default', true)}
        </div>

        <div />
      </div>

      {/* BOTTOM 2-COLUMN CARDS: Disabled & Hover States */}
      <div
        className={`grid ${
          isTwoCol ? 'grid-cols-2' : 'grid-cols-1'
        } gap-4`}
      >
        <div className="bg-white rounded-[24px] p-6 sm:p-7 min-h-[220px] flex flex-col justify-between relative group/card">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400">Disabled</span>
          </div>
          <div className="my-auto py-6">
            {renderSliderInstance('Disabled', false)}
          </div>
          <div />
        </div>

        <div className="bg-white rounded-[24px] p-6 sm:p-7 min-h-[220px] flex flex-col justify-between relative group/card">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400">Hover</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleCopySpec('Hover');
              }}
              className="w-7 h-7 rounded-lg bg-zinc-100/80 hover:bg-zinc-200/70 flex items-center justify-center text-zinc-500 hover:text-zinc-900 opacity-0 group-hover/card:opacity-100 transition"
              title="Copy hover spec"
            >
              {copiedCard === 'Hover' ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
          <div className="my-auto py-6">
            {renderSliderInstance('Hover', true)}
          </div>
          <div />
        </div>
      </div>
    </div>
  );
};

export const ShadcnPaymentWidgetSpecimen: React.FC<SpecimenProps> = ({
  tokens,
  block,
  containerWidth = 500,
  isInspectMode = false,
  selectedTarget = null,
  onSelectSubElement,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<'full' | 'split'>('full');
  const [paid, setPaid] = useState(false);

  const isThisBlockSelected = selectedTarget?.blockId === block.id;
  const selectedPart = isThisBlockSelected
    ? selectedTarget?.subElementId
    : undefined;

  const balanceOvr = block.subElements?.balance;
  const cardOvr = block.subElements?.card;
  const payBtnOvr = block.subElements?.['pay-button'];

  const headingFont = getResolvedFontClass(tokens, balanceOvr, 'brand');
  const bodyFont = getFontClass(tokens.bodyFont);
  const shadowClass = getShadowClass(tokens);

  const defaultBtnBg =
    tokens.primaryActionStyle === 'neutral' ? '#09090B' : tokens.primaryColor;
  const btnBg = payBtnOvr?.fillToken
    ? resolveFillColorCss(
        tokens,
        payBtnOvr.fillToken,
        payBtnOvr.fillOpacity,
        defaultBtnBg
      )
    : defaultBtnBg;
  const btnText = getReadableTextColor(
    payBtnOvr?.fillToken
      ? resolveSemanticColorToken(payBtnOvr.fillToken, tokens).hex
      : defaultBtnBg
  );
  const btnRadiusCss = resolveCornerRadiusCss(
    payBtnOvr,
    Math.max(0, tokens.radiusPx - 2)
  );

  const cardBg = cardOvr?.fillToken
    ? resolveFillColorCss(
        tokens,
        cardOvr.fillToken,
        cardOvr.fillOpacity,
        '#FFFFFF'
      )
    : '#FFFFFF';
  const cardRadiusCss = resolveCornerRadiusCss(cardOvr, tokens.radiusPx);
  const cardBorderW = resolveBorderWidthPx(
    cardOvr?.borderWidth,
    tokens.borderWidth
  );
  const cardBorderColor = cardOvr?.borderToken
    ? resolveSemanticColorToken(cardOvr.borderToken, tokens).cssColor
    : '#E4E4E7';

  const balanceColor = balanceOvr?.textColorToken
    ? resolveSemanticColorToken(balanceOvr.textColorToken, tokens).cssColor
    : '#09090B';

  const isCompactFrame = containerWidth < 360;
  const innerPad = Math.round(
    (isCompactFrame ? 18 : 24) * tokens.spacingMultiplier
  );
  const koyotVars = getLimeScopeCssVars(tokens, false);
  const slotCss = buildBlockDataSlotCss(
    block.id,
    tokens,
    block.subElements,
    null,
    selectedPart || null
  );

  return (
    <div
      data-koyot-block={block.id}
      style={{ ...koyotVars, fontWeight: tokens.bodyWeight }}
      className={`koyot lime bg-transparent! space-y-5 h-full flex flex-col justify-between ${bodyFont}`}
    >
      {slotCss && <style>{slotCss}</style>}
      <KoyotPortalProvider>
      {/* Fixed Koyot Bento Card (rounded-[24px]) */}
      <div className="bg-[#E5E5E7] rounded-[24px] p-5 sm:p-6 pt-8 relative overflow-hidden">
        {/* Inner Brand Accent Tab */}
        <div
          className="h-5 mx-6 -mb-2 transition-colors duration-200"
          style={{
            backgroundColor: tokens.primaryColor,
            borderTopLeftRadius: `${Math.min(tokens.radiusPx, 16)}px`,
            borderTopRightRadius: `${Math.min(tokens.radiusPx, 16)}px`,
          }}
        />

        {/* Inner Brand Payment Card — responds to Character XY and Sub-element Inspector */}
        <div
          onClick={(e) => {
            if (isInspectMode && onSelectSubElement) {
              e.stopPropagation();
              onSelectSubElement('card', 'Card', 'Payment Widget', 'Default');
            }
          }}
          className={`relative z-10 transition ${shadowClass} ${
            selectedPart === 'card' ? 'ring-2 ring-[#D946EF]' : ''
          }`}
          style={{
            backgroundColor: cardBg,
            borderRadius: cardRadiusCss,
            borderWidth: `${cardBorderW}px`,
            borderStyle: cardBorderW > 0 ? 'solid' : 'none',
            borderColor: cardBorderColor,
            padding: `${innerPad}px`,
          }}
        >
          <div className="flex items-start justify-between gap-2">
            <div
              onClick={(e) => {
                if (isInspectMode && onSelectSubElement) {
                  e.stopPropagation();
                  onSelectSubElement(
                    'balance',
                    'Balance',
                    'Payment Widget',
                    'Default'
                  );
                }
              }}
              className={`min-w-0 rounded px-1 -ml-1 transition ${
                isInspectMode ? 'cursor-pointer' : ''
              } ${
                selectedPart === 'balance' ? 'ring-1 ring-[#D946EF]' : ''
              }`}
            >
              <div
                className="text-xs text-zinc-400 truncate"
                style={{ fontWeight: tokens.bodyWeight }}
              >
                Balance · {tokens.brandName}
              </div>
              <div
                className={`mt-1 truncate ${headingFont}`}
                style={{
                  color: balanceColor,
                  fontSize: `${
                    balanceOvr?.textSize
                      ? resolveTextMetrics(tokens, balanceOvr.textSize, 34)
                          .fontSizePx
                      : Math.round(
                          (isCompactFrame ? 28 : 36) * tokens.fontScale
                        )
                  }px`,
                  fontWeight: resolveWeightValue(
                    balanceOvr?.fontWeight,
                    tokens.headingWeight
                  ),
                  letterSpacing: `${tokens.letterSpacingEm}em`,
                  lineHeight: 1.1,
                }}
              >
                {tokens.brandCopy.paymentBalance}
              </div>
            </div>
            <BrandLogoMark
              logoId={tokens.logoId}
              color={tokens.primaryColor}
              size={22}
              className="shrink-0"
            />
          </div>

          <div
            className="space-y-2 text-xs"
            style={{
              marginTop: `${Math.round(18 * tokens.spacingMultiplier)}px`,
              marginBottom: `${Math.round(18 * tokens.spacingMultiplier)}px`,
            }}
          >
            <div className="flex items-center justify-between text-zinc-400">
              <span>Payment</span>
              <span
                className="text-zinc-900"
                style={{ fontWeight: Math.min(700, tokens.bodyWeight + 100) }}
              >
                {tokens.brandCopy.paymentAmount}
              </span>
            </div>
            <div className="flex items-center justify-between text-zinc-400">
              <span>Due</span>
              <span
                className="text-zinc-900"
                style={{ fontWeight: Math.min(700, tokens.bodyWeight + 100) }}
              >
                {tokens.brandCopy.paymentDue}
              </span>
            </div>
          </div>

          <KoyotButton
            variant={tokens.stylePresetName === 'Lime' ? 'glow' : 'primary'}
            className={`w-full ${selectedPart === 'pay-button' ? 'ring-2 ring-[#D946EF]' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              if (isInspectMode && onSelectSubElement) {
                onSelectSubElement(
                  'pay-button',
                  'Pay Button',
                  'Payment Widget',
                  'Default'
                );
                return;
              }
              setPaid(!paid);
            }}
          >
            {paid ? 'Paid ✓' : 'Pay'}
          </KoyotButton>
        </div>
      </div>

      {/* Fixed Koyot Bento Card (rounded-[24px]) housing brand radio items */}
      <div className="bg-white rounded-[24px] p-5 sm:p-6">
        <KoyotRadioGroup
          value={selectedPlan}
          onValueChange={(val) => setSelectedPlan(val as 'full' | 'split')}
          className="gap-2.5"
        >
          <label
            className={`flex ${
              isCompactFrame
                ? 'flex-col items-start gap-2'
                : 'items-center justify-between'
            } cursor-pointer transition`}
            style={{
              backgroundColor:
                selectedPlan === 'full' ? 'var(--surface)' : 'transparent',
              borderRadius: `${tokens.radiusPx}px`,
              padding: `${Math.round(14 * tokens.spacingMultiplier)}px`,
            }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <KoyotRadio value="full" />
              <div className="min-w-0">
                <div
                  className="text-fg truncate"
                  style={{
                    fontSize: `${Math.round(13 * tokens.fontScale)}px`,
                    fontWeight: Math.max(500, tokens.headingWeight - 100),
                  }}
                >
                  {tokens.brandCopy.planFullAmount}
                </div>
                <div
                  className="text-xs text-fg-3 truncate"
                  style={{ fontWeight: tokens.bodyWeight }}
                >
                  {tokens.brandCopy.planFullLabel}
                </div>
              </div>
            </div>
            <KoyotBadge variant="accent">Recommended</KoyotBadge>
          </label>

          <label
            className="flex items-center justify-between cursor-pointer transition"
            style={{
              backgroundColor:
                selectedPlan === 'split' ? 'var(--surface)' : 'transparent',
              borderRadius: `${tokens.radiusPx}px`,
              padding: `${Math.round(14 * tokens.spacingMultiplier)}px`,
            }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <KoyotRadio value="split" />
              <div className="min-w-0">
                <div
                  className="text-fg truncate"
                  style={{
                    fontSize: `${Math.round(13 * tokens.fontScale)}px`,
                    fontWeight: Math.max(500, tokens.headingWeight - 100),
                  }}
                >
                  {tokens.brandCopy.planSplitAmount}
                </div>
                <div
                  className="text-xs text-fg-3 truncate"
                  style={{ fontWeight: tokens.bodyWeight }}
                >
                  {tokens.brandCopy.planSplitLabel}
                </div>
              </div>
            </div>
          </label>
        </KoyotRadioGroup>
      </div>
      </KoyotPortalProvider>
    </div>
  );
};

export const ShadcnNavigationPreviewSpecimen: React.FC<SpecimenProps> = ({
  tokens,
  block,
  containerWidth = 500,
  isInspectMode = false,
  selectedTarget = null,
  onSelectSubElement,
}) => {
  const [activeNav, setActiveNav] = useState('Overview');
  const [seats, setSeats] = useState(2);

  const isThisBlockSelected = selectedTarget?.blockId === block.id;
  const selectedPart = isThisBlockSelected
    ? selectedTarget?.subElementId
    : undefined;

  const sidebarOvr = block.subElements?.sidebar;
  const navItemOvr = block.subElements?.['nav-item'];
  const inputOvr = block.subElements?.input;

  const headingFont = getFontClass(tokens.headingFont);
  const bodyFont = getFontClass(tokens.bodyFont);
  const isCompactSidebar = containerWidth < 420;

  const sidebarBg = sidebarOvr?.fillToken
    ? resolveFillColorCss(
        tokens,
        sidebarOvr.fillToken,
        sidebarOvr.fillOpacity,
        '#F7F7F7'
      )
    : '#F7F7F7';

  const activeNavBg = navItemOvr?.fillToken
    ? resolveFillColorCss(
        tokens,
        navItemOvr.fillToken,
        navItemOvr.fillOpacity,
        tokens.primaryColor
      )
    : tokens.primaryColor;

  const navItemRadius = resolveCornerRadiusCss(navItemOvr, tokens.radiusPx);
  const inputRadius = resolveCornerRadiusCss(inputOvr, tokens.radiusPx);

  const navItems = [
    { label: 'Overview', icon: Home },
    { label: 'Projects', icon: Folder },
    { label: 'Inbox', icon: Inbox, badge: '8' },
    { label: 'Team', icon: Users },
    { label: 'Settings', icon: Settings },
  ];

  const koyotVars = getLimeScopeCssVars(tokens, false);
  const slotCss = buildBlockDataSlotCss(
    block.id,
    tokens,
    block.subElements,
    null,
    selectedPart || null
  );

  return (
    <div
      data-koyot-block={block.id}
      style={{ ...koyotVars, fontWeight: tokens.bodyWeight }}
      className={`koyot lime bg-transparent! space-y-5 h-full flex flex-col justify-between ${bodyFont}`}
    >
      {slotCss && <style>{slotCss}</style>}
      <KoyotPortalProvider>
      {/* Fixed Koyot Bento Card (rounded-[24px]) */}
      <div className="bg-[#D6D6D8] rounded-[24px] pt-8 pl-6 sm:pl-8 overflow-hidden flex-1 flex flex-col justify-end">
        <div
          className="shadow-sm flex min-h-[250px] overflow-hidden"
          style={{
            backgroundColor: sidebarBg,
            borderTopLeftRadius: `${tokens.radiusPx}px`,
          }}
        >
          <div
            onClick={(e) => {
              if (isInspectMode && onSelectSubElement) {
                e.stopPropagation();
                onSelectSubElement(
                  'sidebar',
                  'Sidebar',
                  'Navigation Shell',
                  'Default'
                );
              }
            }}
            className={`${
              isCompactSidebar ? 'w-40' : 'w-52'
            } border-r border-zinc-200/60 flex flex-col justify-between shrink-0 transition-all ${
              isInspectMode ? 'cursor-pointer' : ''
            } ${
              selectedPart === 'sidebar' ? 'ring-2 ring-[#D946EF]' : ''
            }`}
            style={{ padding: `${Math.round(14 * tokens.spacingMultiplier)}px` }}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between px-2 py-1">
                <span
                  className={`text-zinc-900 flex items-center gap-2 min-w-0 ${headingFont}`}
                  style={{
                    fontSize: `${Math.round(13 * tokens.fontScale)}px`,
                    fontWeight: tokens.headingWeight,
                    letterSpacing: `${tokens.letterSpacingEm}em`,
                  }}
                >
                  <BrandLogoMark
                    logoId={tokens.logoId}
                    color={tokens.primaryColor}
                    size={16}
                    className="shrink-0"
                  />
                  <span className="truncate">
                    {tokens.brandCopy.workspaceName}
                  </span>
                  <ChevronDown className="w-3 h-3 text-zinc-400 shrink-0" />
                </span>
              </div>

              <nav
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: `${Math.round(4 * tokens.spacingMultiplier)}px`,
                }}
              >
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeNav === item.label;
                  return (
                    <button
                      key={item.label}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isInspectMode && onSelectSubElement) {
                          onSelectSubElement(
                            'nav-item',
                            'Nav Pill',
                            'Navigation Shell',
                            'Default'
                          );
                          return;
                        }
                        setActiveNav(item.label);
                      }}
                      className={`w-full flex items-center justify-between px-3 transition-colors ${
                        isActive && selectedPart === 'nav-item'
                          ? 'ring-2 ring-[#D946EF]'
                          : ''
                      }`}
                      style={{
                        backgroundColor: isActive ? activeNavBg : 'transparent',
                        color: isActive
                          ? getReadableTextColor(tokens.primaryColor)
                          : '#3F3F46',
                        borderRadius: navItemRadius,
                        paddingTop: `${Math.round(
                          7 * tokens.spacingMultiplier
                        )}px`,
                        paddingBottom: `${Math.round(
                          7 * tokens.spacingMultiplier
                        )}px`,
                        fontSize: `${Math.round(12 * tokens.fontScale)}px`,
                        fontWeight: isActive
                          ? Math.max(500, tokens.headingWeight - 100)
                          : tokens.bodyWeight,
                      }}
                    >
                      <span className="flex items-center gap-2.5 truncate">
                        <Icon className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </span>
                      {item.badge && (
                        <span
                          className={`text-[11px] shrink-0 ${
                            isActive ? 'opacity-90' : 'text-zinc-500'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          <div
            className="flex-1 bg-white space-y-5 min-w-0"
            style={{ padding: `${Math.round(20 * tokens.spacingMultiplier)}px` }}
          >
            <h4
              className={`text-zinc-900 truncate ${headingFont}`}
              style={{
                fontSize: `${Math.round(20 * tokens.fontScale)}px`,
                fontWeight: tokens.headingWeight,
                letterSpacing: `${tokens.letterSpacingEm}em`,
              }}
            >
              {activeNav}
            </h4>
            <div className="space-y-3">
              {[1, 2, 3].map((row) => (
                <div key={row} className="flex items-center gap-3">
                  <div
                    className="w-6 h-6 bg-zinc-100 shrink-0"
                    style={{
                      borderRadius: `${Math.min(tokens.radiusPx, 8)}px`,
                    }}
                  />
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="h-2 w-20 max-w-full rounded bg-zinc-100" />
                    <div className="h-1.5 w-14 max-w-full rounded bg-zinc-50" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Koyot Bento Card (rounded-[24px]) with Koyot UI Field, Input & Stepper Buttons */}
      <div className="bg-white rounded-[24px] p-6 space-y-4">
        <div
          onClick={(e) => {
            if (isInspectMode && onSelectSubElement) {
              e.stopPropagation();
              onSelectSubElement(
                'input',
                'Input Field',
                'Navigation Shell',
                'Default'
              );
            }
          }}
          className={`rounded-xl p-1 -m-1 transition ${
            selectedPart === 'input' ? 'ring-1 ring-[#D946EF]' : ''
          }`}
        >
          <KoyotField>
            <KoyotFieldLabel>Company</KoyotFieldLabel>
            <KoyotInput
              key={tokens.brandCopy.companyPlaceholder}
              defaultValue={tokens.brandCopy.companyPlaceholder}
            />
          </KoyotField>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span
            className="text-xs text-fg-2"
            style={{ fontWeight: tokens.bodyWeight }}
          >
            Seats
          </span>
          <div className="flex items-center gap-2">
            <KoyotButton
              variant="secondary"
              size="icon-sm"
              onClick={() => setSeats(Math.max(1, seats - 1))}
            >
              <Minus className="w-3 h-3" />
            </KoyotButton>
            <span
              className="w-8 text-center text-xs text-fg tabular-nums"
              style={{ fontWeight: tokens.headingWeight }}
            >
              {seats}
            </span>
            <KoyotButton
              variant="secondary"
              size="icon-sm"
              onClick={() => setSeats(seats + 1)}
            >
              <Plus className="w-3 h-3" />
            </KoyotButton>
          </div>
        </div>
      </div>
      </KoyotPortalProvider>
    </div>
  );
};

export const ShadcnInteractiveSuiteSpecimen: React.FC<SpecimenProps> = ({
  tokens,
  containerWidth = 800,
}) => {
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);
  const [dialogConfirmed, setDialogConfirmed] = useState(false);
  const [cityQuery, setCityQuery] = useState('');
  const [checkedDigest, setCheckedDigest] = useState(true);
  const [copiedComponent, setCopiedComponent] = useState<string | null>(null);

  const headingFont = getFontClass(tokens.headingFont);
  const bodyFont = getFontClass(tokens.bodyFont);
  const shadowClass = getShadowClass(tokens);

  const btnColor =
    tokens.primaryActionStyle === 'neutral' ? '#09090B' : tokens.primaryColor;
  const btnText = getReadableTextColor(btnColor);

  const handleCopyCli = (comp: string) => {
    navigator.clipboard.writeText(`npx shadcn@latest add ${comp}`);
    setCopiedComponent(comp);
    setTimeout(() => setCopiedComponent(null), 1500);
  };

  const isTwoColSuite = containerWidth >= 560;

  return (
    <div
      className={`grid ${
        isTwoColSuite ? 'grid-cols-2' : 'grid-cols-1'
      } gap-5 ${bodyFont}`}
      style={{ fontWeight: tokens.bodyWeight }}
    >
      {/* 1. Accordion */}
      <div className="bg-white rounded-[24px] p-7 min-h-[280px] flex flex-col justify-between group">
        <div className="flex items-center justify-between">
          <span className="text-xs text-zinc-500">Accordion</span>
          <button
            onClick={() => handleCopyCli('accordion')}
            className="opacity-0 group-hover:opacity-100 transition text-[11px] text-zinc-400 hover:text-zinc-900 flex items-center gap-1"
          >
            {copiedComponent === 'accordion' ? (
              <Check className="w-3 h-3" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
          </button>
        </div>

        <div className="my-auto max-w-xs mx-auto w-full space-y-2">
          {[
            {
              q: `What is ${tokens.brandName}?`,
              a: tokens.brandCopy.manifestoBody,
            },
            {
              q: 'Can I customize it?',
              a: 'Adjust colors, typography, and corner radius live in the Studio.',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="px-3.5 transition-all"
              style={{
                borderRadius: `${tokens.radiusPx}px`,
                backgroundColor:
                  openAccordion === idx ? '#FAFAFA' : 'transparent',
                paddingTop: `${Math.round(10 * tokens.spacingMultiplier)}px`,
                paddingBottom: `${Math.round(10 * tokens.spacingMultiplier)}px`,
              }}
            >
              <button
                onClick={() =>
                  setOpenAccordion(openAccordion === idx ? null : idx)
                }
                className={`w-full flex items-center justify-between text-zinc-900 ${headingFont}`}
                style={{
                  fontSize: `${Math.round(12.5 * tokens.fontScale)}px`,
                  fontWeight: Math.max(500, tokens.headingWeight - 100),
                  letterSpacing: `${tokens.letterSpacingEm}em`,
                }}
              >
                <span>{item.q}</span>
                <ChevronRight
                  className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${
                    openAccordion === idx ? 'rotate-90' : ''
                  }`}
                />
              </button>
              {openAccordion === idx && (
                <p
                  className="text-xs text-zinc-400 mt-2 leading-relaxed"
                  style={{ fontWeight: tokens.bodyWeight }}
                >
                  {item.a}
                </p>
              )}
            </div>
          ))}
        </div>

        <div />
      </div>

      {/* 2. Alert dialog */}
      <div className="bg-white rounded-[24px] p-7 min-h-[280px] flex flex-col justify-between group">
        <div className="flex items-center justify-between">
          <span className="text-xs text-zinc-500">Alert dialog</span>
          <button
            onClick={() => handleCopyCli('alert-dialog')}
            className="opacity-0 group-hover:opacity-100 transition text-[11px] text-zinc-400 hover:text-zinc-900 flex items-center gap-1"
          >
            {copiedComponent === 'alert-dialog' ? (
              <Check className="w-3 h-3" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
          </button>
        </div>

        <div className="my-auto flex flex-col items-center justify-center text-center">
          {!dialogConfirmed ? (
            <button
              onClick={() => setDialogConfirmed(true)}
              className={`text-zinc-900 hover:bg-zinc-50 transition-all ${headingFont} ${shadowClass}`}
              style={{
                borderRadius: `${tokens.radiusPx}px`,
                borderWidth: `${tokens.borderWidth}px`,
                borderColor: '#E4E4E7',
                padding: `${Math.round(9 * tokens.spacingMultiplier)}px ${Math.round(
                  18 * tokens.spacingMultiplier
                )}px`,
                fontSize: `${Math.round(12.5 * tokens.fontScale)}px`,
                fontWeight: Math.max(500, tokens.headingWeight - 100),
              }}
            >
              Archive {tokens.brandCopy.workspaceName}
            </button>
          ) : (
            <div
              className={`bg-[#FAFAFA] max-w-xs w-full space-y-3 text-left transition-all ${shadowClass}`}
              style={{
                borderRadius: `${tokens.radiusPx}px`,
                borderWidth: `${tokens.borderWidth}px`,
                borderColor: '#E4E4E7',
                padding: `${Math.round(18 * tokens.spacingMultiplier)}px`,
              }}
            >
              <div
                className={`text-zinc-900 ${headingFont}`}
                style={{
                  fontSize: `${Math.round(13 * tokens.fontScale)}px`,
                  fontWeight: tokens.headingWeight,
                }}
              >
                Archive {tokens.brandCopy.workspaceName}?
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  onClick={() => setDialogConfirmed(false)}
                  className="px-3 py-1.5 text-[11px] text-zinc-500 hover:text-zinc-900"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setDialogConfirmed(false)}
                  className="px-3 py-1.5 text-[11px] transition-all"
                  style={{
                    backgroundColor: btnColor,
                    color: btnText,
                    borderRadius: `${Math.max(0, tokens.radiusPx - 2)}px`,
                    fontWeight: tokens.headingWeight,
                  }}
                >
                  Confirm
                </button>
              </div>
            </div>
          )}
        </div>

        <div />
      </div>

      {/* 3. Autocomplete */}
      <div className="bg-white rounded-[24px] p-7 min-h-[280px] flex flex-col justify-between group">
        <div className="flex items-center justify-between">
          <span className="text-xs text-zinc-500">Autocomplete</span>
          <button
            onClick={() => handleCopyCli('command')}
            className="opacity-0 group-hover:opacity-100 transition text-[11px] text-zinc-400 hover:text-zinc-900 flex items-center gap-1"
          >
            {copiedComponent === 'command' ? (
              <Check className="w-3 h-3" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
          </button>
        </div>

        <div className="my-auto max-w-xs mx-auto w-full space-y-2">
          <label
            className={`text-zinc-900 block ${headingFont}`}
            style={{
              fontSize: `${Math.round(12.5 * tokens.fontScale)}px`,
              fontWeight: Math.max(500, tokens.headingWeight - 100),
            }}
          >
            Workspace Location
          </label>
          <input
            type="text"
            value={cityQuery}
            onChange={(e) => setCityQuery(e.target.value)}
            placeholder={tokens.brandCopy.companyPlaceholder}
            className={`w-full px-3.5 text-xs bg-[#F4F4F5] text-zinc-900 placeholder-zinc-400 focus:outline-none transition-all ${shadowClass}`}
            style={{
              borderRadius: `${tokens.radiusPx}px`,
              borderWidth: `${tokens.borderWidth}px`,
              borderColor: tokens.borderWidth > 0 ? '#E4E4E7' : 'transparent',
              paddingTop: `${Math.round(10 * tokens.spacingMultiplier)}px`,
              paddingBottom: `${Math.round(10 * tokens.spacingMultiplier)}px`,
              fontWeight: tokens.bodyWeight,
            }}
          />
        </div>

        <div />
      </div>

      {/* 4. Avatar */}
      <div className="bg-white rounded-[24px] p-7 min-h-[280px] flex flex-col justify-between group">
        <div className="flex items-center justify-between">
          <span className="text-xs text-zinc-500">Brand Avatar</span>
          <button
            onClick={() => handleCopyCli('avatar')}
            className="opacity-0 group-hover:opacity-100 transition text-[11px] text-zinc-400 hover:text-zinc-900 flex items-center gap-1"
          >
            {copiedComponent === 'avatar' ? (
              <Check className="w-3 h-3" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
          </button>
        </div>

        <div className="my-auto flex items-center justify-center">
          <div
            className={`flex items-center justify-center transition-all ${shadowClass}`}
            style={{
              width: `${Math.round(46 * tokens.fontScale)}px`,
              height: `${Math.round(46 * tokens.fontScale)}px`,
              backgroundColor: tokens.surfaceTint,
              color: tokens.primaryColor,
              borderRadius: `${tokens.radiusPx}px`,
              borderWidth: `${tokens.borderWidth}px`,
              borderColor:
                tokens.borderWidth > 0 ? tokens.secondaryColor : 'transparent',
            }}
          >
            <BrandLogoMark
              logoId={tokens.logoId}
              color={tokens.primaryColor}
              size={Math.round(22 * tokens.fontScale)}
            />
          </div>
        </div>

        <div />
      </div>

      {/* 5. Button */}
      <div className="bg-white rounded-[24px] p-7 min-h-[240px] flex flex-col justify-between group">
        <div className="flex items-center justify-between">
          <span className="text-xs text-zinc-500">Button</span>
          <button
            onClick={() => handleCopyCli('button')}
            className="opacity-0 group-hover:opacity-100 transition text-[11px] text-zinc-400 hover:text-zinc-900 flex items-center gap-1"
          >
            {copiedComponent === 'button' ? (
              <Check className="w-3 h-3" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
          </button>
        </div>

        <div className="my-auto flex items-center justify-center">
          <button
            className={`transition-all transform active:scale-95 flex items-center gap-2 ${headingFont} ${shadowClass}`}
            style={{
              backgroundColor: btnColor,
              color: btnText,
              borderRadius: `${tokens.radiusPx}px`,
              padding: `${Math.round(10 * tokens.spacingMultiplier)}px ${Math.round(
                24 * tokens.spacingMultiplier
              )}px`,
              fontSize: `${Math.round(12.5 * tokens.fontScale)}px`,
              fontWeight: Math.max(500, tokens.headingWeight - 100),
              letterSpacing: `${tokens.letterSpacingEm}em`,
            }}
          >
            <BrandLogoMark logoId={tokens.logoId} color={btnText} size={14} />
            <span>{tokens.brandCopy.lifestyleCta}</span>
          </button>
        </div>

        <div />
      </div>

      {/* 6. Checkbox */}
      <div className="bg-white rounded-[24px] p-7 min-h-[240px] flex flex-col justify-between group">
        <div className="flex items-center justify-between">
          <span className="text-xs text-zinc-500">Checkbox</span>
          <button
            onClick={() => handleCopyCli('checkbox')}
            className="opacity-0 group-hover:opacity-100 transition text-[11px] text-zinc-400 hover:text-zinc-900 flex items-center gap-1"
          >
            {copiedComponent === 'checkbox' ? (
              <Check className="w-3 h-3" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
          </button>
        </div>

        <div className="my-auto flex items-center justify-center">
          <label
            onClick={() => setCheckedDigest(!checkedDigest)}
            className="flex items-center gap-2.5 cursor-pointer select-none"
          >
            <div
              className="w-4 h-4 flex items-center justify-center border transition-all"
              style={{
                backgroundColor: checkedDigest ? btnColor : '#FFFFFF',
                borderColor: checkedDigest ? btnColor : '#D4D4D8',
                color: btnText,
                borderRadius: `${Math.min(tokens.radiusPx, 6)}px`,
              }}
            >
              {checkedDigest && <Check className="w-3 h-3 stroke-[3]" />}
            </div>
            <span
              className="text-zinc-800"
              style={{
                fontSize: `${Math.round(12.5 * tokens.fontScale)}px`,
                fontWeight: tokens.bodyWeight,
              }}
            >
              {tokens.brandName} weekly digest
            </span>
          </label>
        </div>

        <div />
      </div>
    </div>
  );
};
