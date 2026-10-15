import React, { useState } from 'react';
import {
  BrandTokens,
  EditorialBlock,
  SelectedInspectorTarget,
} from '../../types';
import {
  SHADCN_ALL_COMPONENTS,
  ShadcnComponentDef,
} from '../../utils/shadcnAllComponentsCatalog';
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
} from '../../utils/overrideUtils';
import { BrandLogoMark } from './BrandLogoMark';
import {
  Copy,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  Calendar as CalendarIcon,
  Search,
  User,
  CreditCard,
  Settings,
  Bold,
  Italic,
  Underline,
  ChevronsUpDown,
  Loader2,
  Inbox,
  Home,
  Folder,
} from 'lucide-react';

interface ShadcnPrimitivesWorkbenchProps {
  tokens: BrandTokens;
  block: EditorialBlock;
  containerWidth?: number;
  activeComponentId?: string | 'all';
  onSelectComponentId?: (id: string | 'all') => void;
  selectedTarget?: SelectedInspectorTarget | null;
  onSelectSubElement?: (
    subElementId: string,
    subElementLabel: string,
    componentLabel?: string,
    variantState?: 'Default' | 'Hover' | 'Disabled'
  ) => void;
  onOpenExportModal?: (primitiveId: string | 'all') => void;
}

export function makePrimitiveSubKey(
  primitiveId: string,
  partId: string
): string {
  return `${primitiveId}:${partId}`;
}

export const ShadcnPrimitivesWorkbench: React.FC<
  ShadcnPrimitivesWorkbenchProps
> = ({
  tokens,
  block,
  containerWidth = 900,
  activeComponentId = 'all',
  onSelectComponentId,
  selectedTarget = null,
  onSelectSubElement,
  onOpenExportModal,
}) => {
  const [sliderVal, setSliderVal] = useState(48);
  const [switchChecked, setSwitchChecked] = useState(true);
  const [checkboxChecked, setCheckboxChecked] = useState(true);
  const [radioValue, setRadioValue] = useState<'default' | 'comfortable'>(
    'default'
  );
  const [openAccIdx, setOpenAccIdx] = useState<number | null>(0);
  const [activeTab, setActiveTab] = useState<'account' | 'password'>('account');
  const [togglePressed, setTogglePressed] = useState(true);
  const [hoveredSubKey, setHoveredSubKey] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const isThisBlockSelected = selectedTarget?.blockId === block.id;
  const activeSubKey = isThisBlockSelected
    ? selectedTarget?.subElementId
    : undefined;

  const getPartOvr = (primitiveId: string, partId: string) => {
    const compositeKey = makePrimitiveSubKey(primitiveId, partId);
    return (
      block.subElements?.[compositeKey] || block.subElements?.[partId] || {}
    );
  };

  const selectPart = (
    e: React.MouseEvent,
    primitiveId: string,
    primitiveName: string,
    partId: string,
    partLabel: string,
    variantState: 'Default' | 'Hover' | 'Disabled' = 'Default'
  ) => {
    e.stopPropagation();
    const compositeKey = makePrimitiveSubKey(primitiveId, partId);
    onSelectSubElement?.(compositeKey, partLabel, primitiveName, variantState);
  };

  const getInspectRing = (
    primitiveId: string,
    partId: string,
    interactive = true
  ) => {
    if (!interactive) return '';
    const key = makePrimitiveSubKey(primitiveId, partId);
    const isSelected =
      activeSubKey === key ||
      (primitiveId === 'slider' && activeSubKey === partId);
    const isHovered = hoveredSubKey === key;
    if (isSelected) {
      return 'ring-1.5 ring-zinc-900 dark:ring-white shadow-sm';
    }
    if (isHovered) {
      return 'ring-1 ring-zinc-400/50 dark:ring-zinc-600/50';
    }
    return '';
  };

  const bindHover = (
    primitiveId: string,
    partId: string,
    interactive = true
  ) => {
    if (!interactive) return {};
    const key = makePrimitiveSubKey(primitiveId, partId);
    return {
      onMouseEnter: (e: React.MouseEvent) => {
        e.stopPropagation();
        setHoveredSubKey(key);
      },
      onMouseLeave: (e: React.MouseEvent) => {
        e.stopPropagation();
        setHoveredSubKey((prev) => (prev === key ? null : prev));
      },
    };
  };

  const headingFont = getFontClass(tokens.headingFont);
  const bodyFont = getFontClass(tokens.bodyFont);
  const monoFont = getFontClass(tokens.monoFont);
  const shadowClass = getShadowClass(tokens);

  const defaultActionBg =
    tokens.primaryActionStyle === 'neutral' ? '#09090B' : tokens.primaryColor;

  /**
   * Renders a clean, authentic specimen instance of any of the 56 shadcn/ui components
   * in `Default`, `Disabled`, or `Hover` state.
   */
  const renderComponentInstance = (
    meta: ShadcnComponentDef,
    variantState: 'Default' | 'Disabled' | 'Hover' = 'Default',
    interactive = true
  ) => {
    const pId = meta.id;
    const isDisabled = variantState === 'Disabled';
    const isHover = variantState === 'Hover';

    switch (pId) {
      case 'slider': {
        const lblOvr = getPartOvr('slider', 'label');
        const trkOvr = getPartOvr('slider', 'track');
        const thbOvr = getPartOvr('slider', 'thumb');

        const lblFont = getResolvedFontClass(tokens, lblOvr, 'ui');
        const lblMetrics = resolveTextMetrics(
          tokens,
          lblOvr.textSize || 'S',
          Math.round(14 * tokens.fontScale)
        );
        const lblWeight = resolveWeightValue(
          lblOvr.fontWeight || 'Medium',
          Math.max(500, tokens.bodyWeight)
        );
        const lblColor = isDisabled
          ? '#A1A1AA'
          : lblOvr.textColorToken
          ? resolveSemanticColorToken(lblOvr.textColorToken, tokens).cssColor
          : '#09090B';

        const trkH = resolveControlSizePx(trkOvr.controlSize || 'XL', 34);
        const thbS = Math.max(16, trkH - 8);
        const trkRad = resolveCornerRadiusCss(
          trkOvr.cornerRadius ? trkOvr : { cornerRadius: 'Full' },
          9999
        );
        const trkBg = resolveFillColorCss(
          tokens,
          trkOvr.fillToken || 'Neutral 3',
          trkOvr.fillOpacity,
          '#F2F2F0'
        );
        const activeBar = isDisabled
          ? '#D6D3CD'
          : trkOvr.accentFillToken
          ? resolveSemanticColorToken(trkOvr.accentFillToken, tokens).cssColor
          : tokens.primaryColor;
        const trkBw = resolveBorderWidthPx(trkOvr.borderWidth || 'None', 0);
        const trkBc = trkOvr.borderToken
          ? resolveSemanticColorToken(trkOvr.borderToken, tokens).cssColor
          : 'transparent';

        const thbFill = isDisabled
          ? '#FFFFFF'
          : resolveFillColorCss(
              tokens,
              thbOvr.fillToken || 'Neutral 1',
              thbOvr.fillOpacity,
              '#FFFFFF'
            );
        const thbRad = resolveCornerRadiusCss(
          thbOvr.cornerRadius ? thbOvr : { cornerRadius: 'Full' },
          9999
        );

        return (
          <div className="w-full max-w-[290px] mx-auto select-none">
            <div className="flex items-center justify-between mb-2">
              <div
                onClick={(e) =>
                  selectPart(e, 'slider', 'Slider', 'label', 'Label', variantState)
                }
                {...bindHover('slider', 'label', interactive)}
                className={`px-1.5 py-0.5 -ml-1.5 cursor-pointer transition ${lblFont} ${getInspectRing(
                  'slider',
                  'label',
                  interactive
                )}`}
                style={{
                  fontSize: `${lblMetrics.fontSizePx}px`,
                  lineHeight: `${lblMetrics.lineHeightPx}px`,
                  fontWeight: lblWeight,
                  color: lblColor,
                  textShadow: resolveShadowCss(lblOvr.shadow),
                }}
              >
                Volume
              </div>
              <span className={`text-xs text-zinc-400 ${monoFont}`}>
                {sliderVal}
              </span>
            </div>

            <div
              onClick={(e) => {
                if (interactive) {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pct = Math.round(
                    Math.max(
                      0,
                      Math.min(1, (e.clientX - rect.left) / rect.width)
                    ) * 100
                  );
                  setSliderVal(pct);
                }
                selectPart(e, 'slider', 'Slider', 'track', 'Track', variantState);
              }}
              {...bindHover('slider', 'track', interactive)}
              className={`p-2.5 -mx-2.5 cursor-pointer transition ${getInspectRing(
                'slider',
                'track',
                interactive
              )}`}
            >
              <div
                className="relative w-full flex items-center transition-all"
                style={{
                  height: `${trkH}px`,
                  backgroundColor: trkBg,
                  borderRadius: trkRad,
                  borderWidth: `${trkBw}px`,
                  borderStyle: trkBw > 0 ? 'solid' : 'none',
                  borderColor: trkBc,
                  boxShadow: resolveShadowCss(trkOvr.shadow),
                }}
              >
                <div
                  className="h-full flex items-center justify-end pr-1 transition-all duration-75"
                  style={{
                    width: `${Math.max(16, sliderVal)}%`,
                    backgroundColor: activeBar,
                    borderRadius: trkRad,
                  }}
                >
                  <div
                    onClick={(e) =>
                      selectPart(
                        e,
                        'slider',
                        'Slider',
                        'thumb',
                        'Thumb',
                        variantState
                      )
                    }
                    {...bindHover('slider', 'thumb', interactive)}
                    className={`p-2 -m-2 flex items-center justify-center cursor-pointer ${getInspectRing(
                      'slider',
                      'thumb',
                      interactive
                    )}`}
                  >
                    <div
                      className={`transition-transform ${
                        isHover ? 'scale-105' : ''
                      }`}
                      style={{
                        width: `${thbS}px`,
                        height: `${thbS}px`,
                        backgroundColor: thbFill,
                        borderRadius: thbRad,
                        boxShadow: resolveShadowCss(
                          thbOvr.shadow,
                          '0 1px 3px rgba(0,0,0,0.18)'
                        ),
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }

      case 'button': {
        const btnOvr = getPartOvr('button', 'button');
        const lblOvr = getPartOvr('button', 'label');
        const bg = isDisabled
          ? '#E4E4E7'
          : resolveFillColorCss(
              tokens,
              btnOvr.fillToken,
              btnOvr.fillOpacity,
              defaultActionBg
            );
        const fg = isDisabled
          ? '#A1A1AA'
          : lblOvr.textColorToken
          ? resolveSemanticColorToken(lblOvr.textColorToken, tokens).cssColor
          : getReadableTextColor(
              btnOvr.fillToken
                ? resolveSemanticColorToken(btnOvr.fillToken, tokens).hex
                : defaultActionBg
            );
        const rad = resolveCornerRadiusCss(btnOvr, tokens.radiusPx);
        const h = resolveControlSizePx(btnOvr.controlSize || 'L', 40);
        const bw = resolveBorderWidthPx(btnOvr.borderWidth, 0);
        const bc = btnOvr.borderToken
          ? resolveSemanticColorToken(btnOvr.borderToken, tokens).cssColor
          : '#E4E4E7';
        const fontCls = getResolvedFontClass(tokens, lblOvr, 'brand');
        const fw = resolveWeightValue(
          lblOvr.fontWeight,
          Math.max(500, tokens.headingWeight - 100)
        );
        const fSize = resolveTextMetrics(
          tokens,
          lblOvr.textSize,
          Math.round(13 * tokens.fontScale)
        ).fontSizePx;

        return (
          <div className="flex items-center justify-center">
            <div
              onClick={(e) =>
                selectPart(
                  e,
                  'button',
                  'Button',
                  'button',
                  'Button',
                  variantState
                )
              }
              {...bindHover('button', 'button', interactive)}
              className={`p-2 -m-2 cursor-pointer ${getInspectRing(
                'button',
                'button',
                interactive
              )}`}
            >
              <button
                type="button"
                className={`px-6 flex items-center gap-2 transition-all ${fontCls} ${
                  isHover ? 'opacity-90 scale-[1.02]' : ''
                }`}
                style={{
                  height: `${h}px`,
                  backgroundColor: bg,
                  color: fg,
                  borderRadius: rad,
                  borderWidth: `${bw}px`,
                  borderStyle: bw > 0 ? 'solid' : 'none',
                  borderColor: bc,
                  fontWeight: fw,
                  fontSize: `${fSize}px`,
                  boxShadow: resolveShadowCss(btnOvr.shadow),
                }}
              >
                <BrandLogoMark logoId={tokens.logoId} color={fg} size={14} />
                <span
                  onClick={(e) =>
                    selectPart(
                      e,
                      'button',
                      'Button',
                      'label',
                      'Label',
                      variantState
                    )
                  }
                  {...bindHover('button', 'label', interactive)}
                  className={`px-1 rounded ${getInspectRing(
                    'button',
                    'label',
                    interactive
                  )}`}
                >
                  {tokens.brandCopy.lifestyleCta}
                </span>
              </button>
            </div>
          </div>
        );
      }

      case 'switch': {
        const lblOvr = getPartOvr('switch', 'label');
        const trkOvr = getPartOvr('switch', 'track');
        const thbOvr = getPartOvr('switch', 'thumb');
        const trkH = resolveControlSizePx(trkOvr.controlSize || 'L', 28);
        const trkW = Math.round(trkH * 1.78);
        const thbS = trkH - 6;
        const rad = resolveCornerRadiusCss(
          trkOvr.cornerRadius ? trkOvr : { cornerRadius: 'Full' },
          9999
        );
        const checkedBg = isDisabled
          ? '#D6D3CD'
          : trkOvr.fillToken
          ? resolveSemanticColorToken(trkOvr.fillToken, tokens).cssColor
          : tokens.primaryColor;
        const thbBg = thbOvr.fillToken
          ? resolveSemanticColorToken(thbOvr.fillToken, tokens).cssColor
          : '#FFFFFF';

        return (
          <div className="flex items-center justify-between max-w-[260px] mx-auto w-full">
            <span
              onClick={(e) =>
                selectPart(e, 'switch', 'Switch', 'label', 'Label', variantState)
              }
              {...bindHover('switch', 'label', interactive)}
              className={`px-1.5 py-0.5 -ml-1.5 cursor-pointer ${getResolvedFontClass(
                tokens,
                lblOvr,
                'ui'
              )} ${getInspectRing('switch', 'label', interactive)}`}
              style={{
                fontSize: `${
                  resolveTextMetrics(tokens, lblOvr.textSize || 'S', 14)
                    .fontSizePx
                }px`,
                fontWeight: resolveWeightValue(lblOvr.fontWeight, 500),
                color: isDisabled
                  ? '#A1A1AA'
                  : lblOvr.textColorToken
                  ? resolveSemanticColorToken(lblOvr.textColorToken, tokens)
                      .cssColor
                  : '#09090B',
              }}
            >
              Airplane Mode
            </span>

            <div
              onClick={(e) => {
                if (interactive) setSwitchChecked(!switchChecked);
                selectPart(e, 'switch', 'Switch', 'track', 'Track', variantState);
              }}
              {...bindHover('switch', 'track', interactive)}
              className={`p-2 -m-2 cursor-pointer ${getInspectRing(
                'switch',
                'track',
                interactive
              )}`}
            >
              <div
                className="relative flex items-center p-0.5 transition-colors"
                style={{
                  width: `${trkW}px`,
                  height: `${trkH}px`,
                  backgroundColor: switchChecked ? checkedBg : '#E4E4E7',
                  borderRadius: rad,
                }}
              >
                <div
                  onClick={(e) =>
                    selectPart(
                      e,
                      'switch',
                      'Switch',
                      'thumb',
                      'Thumb',
                      variantState
                    )
                  }
                  {...bindHover('switch', 'thumb', interactive)}
                  className={`p-1 -m-1 cursor-pointer transition-transform ${getInspectRing(
                    'switch',
                    'thumb',
                    interactive
                  )}`}
                  style={{
                    transform: switchChecked
                      ? `translateX(${trkW - thbS - 6}px)`
                      : 'translateX(2px)',
                  }}
                >
                  <div
                    className="shadow-sm"
                    style={{
                      width: `${thbS}px`,
                      height: `${thbS}px`,
                      backgroundColor: thbBg,
                      borderRadius: rad,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      }

      case 'accordion': {
        const trgOvr = getPartOvr('accordion', 'trigger');
        const itmOvr = getPartOvr('accordion', 'item');
        const rad = resolveCornerRadiusCss(itmOvr, tokens.radiusPx);

        return (
          <div className="w-full max-w-[290px] mx-auto space-y-2">
            {[
              {
                q: `What is ${tokens.brandName}?`,
                a: tokens.brandCopy.manifestoBody,
              },
              {
                q: 'Is it customizable?',
                a: 'Click any element to inspect and customize live.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                onClick={(e) => {
                  if (interactive)
                    setOpenAccIdx(openAccIdx === idx ? null : idx);
                  selectPart(
                    e,
                    'accordion',
                    'Accordion',
                    'item',
                    'Item',
                    variantState
                  );
                }}
                {...bindHover('accordion', 'item', interactive)}
                className={`px-3.5 py-2.5 cursor-pointer transition ${getInspectRing(
                  'accordion',
                  'item',
                  interactive
                )}`}
                style={{
                  borderRadius: rad,
                  backgroundColor:
                    openAccIdx === idx ? '#FAFAFA' : 'transparent',
                }}
              >
                <div
                  onClick={(e) => {
                    if (interactive)
                      setOpenAccIdx(openAccIdx === idx ? null : idx);
                    selectPart(
                      e,
                      'accordion',
                      'Accordion',
                      'trigger',
                      'Trigger',
                      variantState
                    );
                  }}
                  {...bindHover('accordion', 'trigger', interactive)}
                  className={`flex items-center justify-between text-xs ${headingFont} ${getInspectRing(
                    'accordion',
                    'trigger',
                    interactive
                  )}`}
                  style={{
                    fontWeight: resolveWeightValue(
                      trgOvr.fontWeight,
                      Math.max(500, tokens.headingWeight - 100)
                    ),
                    color: isDisabled ? '#A1A1AA' : '#09090B',
                  }}
                >
                  <span>{item.q}</span>
                  <ChevronRight
                    className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${
                      openAccIdx === idx ? 'rotate-90' : ''
                    }`}
                  />
                </div>
                {openAccIdx === idx && (
                  <p className="text-[11px] text-zinc-400 mt-2 leading-relaxed">
                    {item.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        );
      }

      case 'checkbox': {
        const boxOvr = getPartOvr('checkbox', 'box');
        const lblOvr = getPartOvr('checkbox', 'label');
        const sz = resolveControlSizePx(boxOvr.controlSize || 'M', 18);
        const rad = resolveCornerRadiusCss(
          boxOvr,
          Math.min(tokens.radiusPx, 6)
        );
        const checkedBg = isDisabled
          ? '#D6D3CD'
          : boxOvr.fillToken
          ? resolveSemanticColorToken(boxOvr.fillToken, tokens).cssColor
          : defaultActionBg;

        return (
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-2.5">
              <div
                onClick={(e) => {
                  if (interactive) setCheckboxChecked(!checkboxChecked);
                  selectPart(
                    e,
                    'checkbox',
                    'Checkbox',
                    'box',
                    'Checkbox',
                    variantState
                  );
                }}
                {...bindHover('checkbox', 'box', interactive)}
                className={`p-1 -m-1 cursor-pointer ${getInspectRing(
                  'checkbox',
                  'box',
                  interactive
                )}`}
              >
                <div
                  className="flex items-center justify-center border transition-all"
                  style={{
                    width: `${sz}px`,
                    height: `${sz}px`,
                    borderRadius: rad,
                    backgroundColor: checkboxChecked ? checkedBg : '#FFFFFF',
                    borderColor: checkboxChecked ? checkedBg : '#D4D4D8',
                    color: '#FFFFFF',
                  }}
                >
                  {checkboxChecked && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>
              <span
                onClick={(e) =>
                  selectPart(
                    e,
                    'checkbox',
                    'Checkbox',
                    'label',
                    'Label',
                    variantState
                  )
                }
                {...bindHover('checkbox', 'label', interactive)}
                className={`px-1 py-0.5 rounded cursor-pointer text-xs ${getInspectRing(
                  'checkbox',
                  'label',
                  interactive
                )}`}
                style={{
                  fontWeight: resolveWeightValue(
                    lblOvr.fontWeight,
                    tokens.bodyWeight
                  ),
                  color: isDisabled ? '#A1A1AA' : '#18181B',
                }}
              >
                Accept terms and conditions
              </span>
            </div>
          </div>
        );
      }

      case 'input':
      case 'field':
      case 'combobox': {
        const lblOvr = getPartOvr(pId, 'label');
        const fldOvr = getPartOvr(pId, pId === 'input' ? 'field' : 'control');
        const rad = resolveCornerRadiusCss(fldOvr, tokens.radiusPx);
        const h = resolveControlSizePx(fldOvr.controlSize || 'L', 38);
        const bg = resolveFillColorCss(
          tokens,
          fldOvr.fillToken,
          fldOvr.fillOpacity,
          '#F4F4F5'
        );

        return (
          <div className="w-full max-w-[260px] mx-auto space-y-1.5">
            <label
              onClick={(e) =>
                selectPart(e, pId, meta.name, 'label', 'Label', variantState)
              }
              {...bindHover(pId, 'label', interactive)}
              className={`inline-block px-1 -ml-1 text-xs cursor-pointer ${headingFont} ${getInspectRing(
                pId,
                'label',
                interactive
              )}`}
              style={{
                color: isDisabled ? '#A1A1AA' : '#18181B',
                fontWeight: resolveWeightValue(lblOvr.fontWeight, 500),
              }}
            >
              {pId === 'combobox' ? 'Framework' : 'Location'}
            </label>
            <div
              onClick={(e) =>
                selectPart(
                  e,
                  pId,
                  meta.name,
                  pId === 'input' ? 'field' : 'control',
                  'Field',
                  variantState
                )
              }
              {...bindHover(
                pId,
                pId === 'input' ? 'field' : 'control',
                interactive
              )}
              className={`p-1 -m-1 cursor-pointer ${getInspectRing(
                pId,
                pId === 'input' ? 'field' : 'control',
                interactive
              )}`}
            >
              <input
                type="text"
                disabled={isDisabled}
                defaultValue={tokens.brandCopy.companyPlaceholder}
                className="w-full px-3.5 text-xs text-zinc-900 focus:outline-none"
                style={{
                  height: `${h}px`,
                  backgroundColor: bg,
                  borderRadius: rad,
                  borderWidth: `${tokens.borderWidth}px`,
                  borderStyle: tokens.borderWidth > 0 ? 'solid' : 'none',
                  borderColor: isHover ? tokens.primaryColor : '#E4E4E7',
                }}
              />
            </div>
          </div>
        );
      }

      case 'tabs': {
        const lstOvr = getPartOvr('tabs', 'list');
        const trgOvr = getPartOvr('tabs', 'trigger');
        const rad = resolveCornerRadiusCss(lstOvr, tokens.radiusPx);

        return (
          <div className="w-full max-w-[260px] mx-auto">
            <div
              onClick={(e) =>
                selectPart(
                  e,
                  'tabs',
                  'Tabs',
                  'list',
                  'Tabs List',
                  variantState
                )
              }
              {...bindHover('tabs', 'list', interactive)}
              className={`grid grid-cols-2 p-1 bg-[#F2F2F0] cursor-pointer ${getInspectRing(
                'tabs',
                'list',
                interactive
              )}`}
              style={{ borderRadius: rad }}
            >
              {(['account', 'password'] as const).map((t) => {
                const isAct = activeTab === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={(e) => {
                      if (interactive) setActiveTab(t);
                      selectPart(
                        e,
                        'tabs',
                        'Tabs',
                        'trigger',
                        'Active Tab',
                        variantState
                      );
                    }}
                    {...bindHover('tabs', 'trigger', interactive)}
                    className={`py-1.5 text-xs capitalize transition ${
                      isAct
                        ? `bg-white text-zinc-950 font-medium shadow-sm ${getInspectRing(
                            'tabs',
                            'trigger',
                            interactive
                          )}`
                        : 'text-zinc-500'
                    }`}
                    style={{
                      borderRadius: resolveCornerRadiusCss(
                        trgOvr,
                        Math.max(0, tokens.radiusPx - 4)
                      ),
                    }}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>
        );
      }

      case 'badge': {
        const pillOvr = getPartOvr('badge', 'pill');
        const rad = resolveCornerRadiusCss(
          pillOvr.cornerRadius ? pillOvr : { cornerRadius: 'Full' },
          9999
        );
        const bg = isDisabled
          ? '#E4E4E7'
          : pillOvr.fillToken
          ? resolveSemanticColorToken(pillOvr.fillToken, tokens).cssColor
          : tokens.primaryColor;

        return (
          <div className="flex items-center justify-center gap-2">
            <span
              onClick={(e) =>
                selectPart(
                  e,
                  'badge',
                  'Badge',
                  'pill',
                  'Badge',
                  variantState
                )
              }
              {...bindHover('badge', 'pill', interactive)}
              className={`px-3.5 py-1 text-xs font-medium cursor-pointer transition ${getInspectRing(
                'badge',
                'pill',
                interactive
              )}`}
              style={{
                backgroundColor: bg,
                color: isDisabled
                  ? '#A1A1AA'
                  : getReadableTextColor(tokens.primaryColor),
                borderRadius: rad,
              }}
            >
              {tokens.stylePresetName}
            </span>
          </div>
        );
      }

      case 'avatar': {
        const frmOvr = getPartOvr('avatar', 'frame');
        const rad = resolveCornerRadiusCss(frmOvr, tokens.radiusPx);
        const sz = resolveControlSizePx(frmOvr.controlSize || 'XL', 46);
        const bg = frmOvr.fillToken
          ? resolveSemanticColorToken(frmOvr.fillToken, tokens).cssColor
          : tokens.surfaceTint;

        return (
          <div className="flex items-center justify-center">
            <div
              onClick={(e) =>
                selectPart(
                  e,
                  'avatar',
                  'Avatar',
                  'frame',
                  'Avatar',
                  variantState
                )
              }
              {...bindHover('avatar', 'frame', interactive)}
              className={`flex items-center justify-center cursor-pointer transition ${shadowClass} ${getInspectRing(
                'avatar',
                'frame',
                interactive
              )}`}
              style={{
                width: `${sz}px`,
                height: `${sz}px`,
                backgroundColor: bg,
                borderRadius: rad,
                opacity: isDisabled ? 0.45 : 1,
              }}
            >
              <BrandLogoMark
                logoId={tokens.logoId}
                color={tokens.primaryColor}
                size={Math.round(sz * 0.48)}
              />
            </div>
          </div>
        );
      }

      case 'progress': {
        const trkOvr = getPartOvr('progress', 'track');
        const indOvr = getPartOvr('progress', 'indicator');
        const h = resolveControlSizePx(trkOvr.controlSize || 'M', 12);
        const rad = resolveCornerRadiusCss(
          trkOvr.cornerRadius ? trkOvr : { cornerRadius: 'Full' },
          9999
        );
        const indColor = isDisabled
          ? '#D6D3CD'
          : indOvr.fillToken
          ? resolveSemanticColorToken(indOvr.fillToken, tokens).cssColor
          : tokens.primaryColor;

        return (
          <div className="w-full max-w-[260px] mx-auto space-y-2">
            <div
              onClick={(e) =>
                selectPart(
                  e,
                  'progress',
                  'Progress',
                  'track',
                  'Track',
                  variantState
                )
              }
              {...bindHover('progress', 'track', interactive)}
              className={`w-full bg-[#F1F1EF] overflow-hidden cursor-pointer ${getInspectRing(
                'progress',
                'track',
                interactive
              )}`}
              style={{ height: `${h}px`, borderRadius: rad }}
            >
              <div
                onClick={(e) =>
                  selectPart(
                    e,
                    'progress',
                    'Progress',
                    'indicator',
                    'Indicator',
                    variantState
                  )
                }
                className="h-full transition-all"
                style={{
                  width: '66%',
                  backgroundColor: indColor,
                  borderRadius: rad,
                }}
              />
            </div>
          </div>
        );
      }

      case 'radio-group': {
        const itmOvr = getPartOvr('radio-group', 'item');
        const dotColor = isDisabled
          ? '#D4D4D8'
          : itmOvr.fillToken
          ? resolveSemanticColorToken(itmOvr.fillToken, tokens).cssColor
          : tokens.primaryColor;

        return (
          <div className="space-y-2.5 max-w-[200px] mx-auto">
            {(
              [
                { id: 'default', label: 'Default' },
                { id: 'comfortable', label: 'Comfortable' },
              ] as const
            ).map((opt) => {
              const active = radioValue === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={(e) => {
                    if (interactive) setRadioValue(opt.id);
                    selectPart(
                      e,
                      'radio-group',
                      'Radio Group',
                      'item',
                      'Radio',
                      variantState
                    );
                  }}
                  {...bindHover('radio-group', 'item', interactive)}
                  className={`flex items-center gap-2.5 cursor-pointer px-1.5 py-1 rounded ${getInspectRing(
                    'radio-group',
                    'item',
                    interactive
                  )}`}
                >
                  <span
                    className="w-4 h-4 rounded-full border-2 flex items-center justify-center"
                    style={{
                      borderColor: active ? dotColor : '#D4D4D8',
                    }}
                  >
                    {active && (
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: dotColor }}
                      />
                    )}
                  </span>
                  <span
                    className="text-xs"
                    style={{ color: isDisabled ? '#A1A1AA' : '#18181B' }}
                  >
                    {opt.label}
                  </span>
                </div>
              );
            })}
          </div>
        );
      }

      case 'alert-dialog':
      case 'dialog':
      case 'drawer':
      case 'sheet':
      case 'popover':
      case 'hover-card': {
        const srfPart = meta.subParts[0]?.id || 'surface';
        const srfOvr = getPartOvr(pId, srfPart);
        const rad = resolveCornerRadiusCss(srfOvr, tokens.radiusPx);
        const bg = resolveFillColorCss(
          tokens,
          srfOvr.fillToken,
          srfOvr.fillOpacity,
          '#FAFAFA'
        );

        return (
          <div
            onClick={(e) =>
              selectPart(
                e,
                pId,
                meta.name,
                srfPart,
                meta.subParts[0]?.label || 'Surface',
                variantState
              )
            }
            {...bindHover(pId, srfPart, interactive)}
            className={`w-full max-w-[260px] mx-auto p-4 border border-zinc-200/80 space-y-3 cursor-pointer transition ${shadowClass} ${getInspectRing(
              pId,
              srfPart,
              interactive
            )}`}
            style={{
              backgroundColor: bg,
              borderRadius: rad,
              opacity: isDisabled ? 0.5 : 1,
            }}
          >
            <div className={`text-xs font-semibold text-zinc-900 ${headingFont}`}>
              Archive {tokens.brandCopy.workspaceName}?
            </div>
            <div className="flex justify-end gap-2">
              <span className="px-2.5 py-1 text-[11px] text-zinc-500">
                Cancel
              </span>
              <span
                className="px-3 py-1 text-[11px] font-medium"
                style={{
                  backgroundColor: defaultActionBg,
                  color: getReadableTextColor(defaultActionBg),
                  borderRadius: `${Math.max(0, tokens.radiusPx - 2)}px`,
                }}
              >
                Confirm
              </span>
            </div>
          </div>
        );
      }

      case 'toggle':
      case 'toggle-group':
      case 'button-group': {
        const mainPart = meta.subParts[0]?.id || 'button';
        const ovr = getPartOvr(pId, mainPart);
        const rad = resolveCornerRadiusCss(ovr, tokens.radiusPx);

        return (
          <div className="flex items-center justify-center">
            <div
              onClick={(e) => {
                if (interactive) setTogglePressed(!togglePressed);
                selectPart(
                  e,
                  pId,
                  meta.name,
                  mainPart,
                  meta.subParts[0]?.label || 'Control',
                  variantState
                );
              }}
              {...bindHover(pId, mainPart, interactive)}
              className={`inline-flex items-center gap-1 p-1 bg-[#F4F4F5] cursor-pointer ${getInspectRing(
                pId,
                mainPart,
                interactive
              )}`}
              style={{ borderRadius: rad, opacity: isDisabled ? 0.45 : 1 }}
            >
              {[Bold, Italic, Underline].map((Icon, i) => (
                <span
                  key={i}
                  className={`w-8 h-8 flex items-center justify-center transition ${
                    i === 0 && togglePressed
                      ? 'bg-white text-zinc-950 shadow-sm'
                      : 'text-zinc-500'
                  }`}
                  style={{
                    borderRadius: `${Math.max(0, tokens.radiusPx - 4)}px`,
                  }}
                >
                  <Icon className="w-3.5 h-3.5" />
                </span>
              ))}
            </div>
          </div>
        );
      }

      case 'calendar':
      case 'date-picker': {
        const mainPart = meta.subParts[0]?.id || 'surface';
        const ovr = getPartOvr(pId, mainPart);
        const rad = resolveCornerRadiusCss(ovr, tokens.radiusPx);

        return (
          <div
            onClick={(e) =>
              selectPart(
                e,
                pId,
                meta.name,
                mainPart,
                meta.subParts[0]?.label || 'Calendar',
                variantState
              )
            }
            {...bindHover(pId, mainPart, interactive)}
            className={`w-full max-w-[240px] mx-auto p-3.5 bg-[#FAFAFA] border border-zinc-200/80 space-y-2.5 cursor-pointer ${getInspectRing(
              pId,
              mainPart,
              interactive
            )}`}
            style={{ borderRadius: rad, opacity: isDisabled ? 0.5 : 1 }}
          >
            <div className="flex items-center justify-between text-xs font-medium text-zinc-800">
              <span>October 2026</span>
              <CalendarIcon className="w-3.5 h-3.5 text-zinc-400" />
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-[10px]">
              {[12, 13, 14, 15, 16, 17, 18].map((d) => {
                const sel = d === 14;
                return (
                  <span
                    key={d}
                    className="py-1 font-medium"
                    style={{
                      backgroundColor: sel ? tokens.primaryColor : 'transparent',
                      color: sel
                        ? getReadableTextColor(tokens.primaryColor)
                        : '#3F3F46',
                      borderRadius: `${Math.min(tokens.radiusPx, 8)}px`,
                    }}
                  >
                    {d}
                  </span>
                );
              })}
            </div>
          </div>
        );
      }

      case 'input-otp': {
        const slotOvr = getPartOvr('input-otp', 'slot');
        const rad = resolveCornerRadiusCss(slotOvr, tokens.radiusPx);

        return (
          <div
            onClick={(e) =>
              selectPart(
                e,
                'input-otp',
                'Input OTP',
                'slot',
                'OTP Slot',
                variantState
              )
            }
            {...bindHover('input-otp', 'slot', interactive)}
            className={`flex items-center justify-center gap-1.5 cursor-pointer p-1 ${getInspectRing(
              'input-otp',
              'slot',
              interactive
            )}`}
          >
            {['4', '8', '2', '9'].map((digit, i) => (
              <div
                key={i}
                className={`w-10 h-11 bg-[#F4F4F5] border border-zinc-200 flex items-center justify-center text-sm font-semibold text-zinc-900 ${monoFont}`}
                style={{
                  borderRadius: rad,
                  borderColor: i === 1 && isHover ? tokens.primaryColor : '#E4E4E7',
                  opacity: isDisabled ? 0.45 : 1,
                }}
              >
                {digit}
              </div>
            ))}
          </div>
        );
      }

      case 'chart': {
        const barOvr = getPartOvr('chart', 'bar');
        const barColor = isDisabled
          ? '#D4D4D8'
          : barOvr.fillToken
          ? resolveSemanticColorToken(barOvr.fillToken, tokens).cssColor
          : tokens.primaryColor;

        return (
          <div
            onClick={(e) =>
              selectPart(
                e,
                'chart',
                'Chart',
                'bar',
                'Data Series',
                variantState
              )
            }
            {...bindHover('chart', 'bar', interactive)}
            className={`w-full max-w-[230px] mx-auto h-24 flex items-end justify-between gap-2 px-3 pt-4 pb-1 cursor-pointer ${getInspectRing(
              'chart',
              'bar',
              interactive
            )}`}
          >
            {[42, 68, 54, 88, 62, 95].map((h, i) => (
              <div
                key={i}
                className="flex-1 transition-all"
                style={{
                  height: `${h}%`,
                  backgroundColor: i % 2 === 0 ? barColor : tokens.secondaryColor,
                  borderRadius: `${Math.min(tokens.radiusPx, 6)}px`,
                }}
              />
            ))}
          </div>
        );
      }

      default: {
        // Clean, authentic visual representation for remaining components (Card, Alert, Table, Select, Skeleton, Breadcrumb, Pagination, Kbd, Spinner, etc.)
        const firstPart = meta.subParts[0] || {
          id: 'surface',
          label: meta.name,
          kind: 'surface' as const,
        };
        const ovr = getPartOvr(pId, firstPart.id);
        const rad = resolveCornerRadiusCss(ovr, tokens.radiusPx);
        const bg = resolveFillColorCss(
          tokens,
          ovr.fillToken,
          ovr.fillOpacity,
          '#FAFAFA'
        );

        return (
          <div
            onClick={(e) =>
              selectPart(
                e,
                pId,
                meta.name,
                firstPart.id,
                firstPart.label,
                variantState
              )
            }
            {...bindHover(pId, firstPart.id, interactive)}
            className={`w-full max-w-[260px] mx-auto p-4 border border-zinc-200/80 flex items-center justify-between gap-3 cursor-pointer transition ${shadowClass} ${getInspectRing(
              pId,
              firstPart.id,
              interactive
            )}`}
            style={{
              backgroundColor: bg,
              borderRadius: rad,
              opacity: isDisabled ? 0.45 : 1,
            }}
          >
            <div className="min-w-0">
              <div
                className={`text-xs font-medium text-zinc-900 truncate ${headingFont}`}
              >
                {meta.name}
              </div>
              <div className="text-[11px] text-zinc-400 truncate mt-0.5">
                {tokens.brandName} · {tokens.stylePresetName}
              </div>
            </div>
            <span
              className="px-2.5 py-1 text-[10px] font-medium shrink-0"
              style={{
                backgroundColor: tokens.primaryColor,
                color: getReadableTextColor(tokens.primaryColor),
                borderRadius: `${Math.min(tokens.radiusPx, 10)}px`,
              }}
            >
              {firstPart.label}
            </span>
          </div>
        );
      }
    }
  };

  // ============================================================================
  // MODE 1: SINGLE COMPONENT ANATOMY & STATE MATRIX (Default / Disabled / Hover)
  // Exact match to Reference Screenshots 5, 7, 8, 9
  // ============================================================================
  if (activeComponentId !== 'all') {
    const selectedMeta =
      SHADCN_ALL_COMPONENTS.find((c) => c.id === activeComponentId) ||
      SHADCN_ALL_COMPONENTS.find((c) => c.id === 'slider')!;

    const isTwoCol = containerWidth >= 540;

    return (
      <div className={`w-full h-full min-h-0 flex flex-col gap-4 ${bodyFont}`}>
        {/* TOP FULL CARD: Default State */}
        <div className="bg-white rounded-[24px] p-6 sm:p-8 flex-1 min-h-0 flex flex-col justify-between relative group/card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-800">Default</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenExportModal?.(selectedMeta.id);
              }}
              className="w-7 h-7 rounded-lg bg-zinc-100/80 hover:bg-zinc-200/70 flex items-center justify-center text-zinc-500 hover:text-zinc-900 opacity-0 group-hover/card:opacity-100 transition"
              title={`Copy / Install ${selectedMeta.name} CLI`}
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="my-auto py-6 sm:py-8">
            {renderComponentInstance(selectedMeta, 'Default', true)}
          </div>

          <div />
        </div>

        {/* BOTTOM 2-COLUMN CARDS: Disabled & Hover States */}
        <div
          className={`grid ${
            isTwoCol ? 'grid-cols-2' : 'grid-cols-1'
          } gap-4 flex-1 min-h-0`}
        >
          <div className="bg-white rounded-[24px] p-6 sm:p-7 h-full min-h-0 flex flex-col justify-between relative group/card">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400">Disabled</span>
            </div>
            <div className="my-auto py-4 sm:py-6">
              {renderComponentInstance(selectedMeta, 'Disabled', false)}
            </div>
            <div />
          </div>

          <div className="bg-white rounded-[24px] p-6 sm:p-7 h-full min-h-0 flex flex-col justify-between relative group/card">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400">Hover</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenExportModal?.(selectedMeta.id);
                }}
                className="w-7 h-7 rounded-lg bg-zinc-100/80 hover:bg-zinc-200/70 flex items-center justify-center text-zinc-500 hover:text-zinc-900 opacity-0 group-hover/card:opacity-100 transition"
                title={`Copy / Install ${selectedMeta.name} CLI`}
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="my-auto py-4 sm:py-6">
              {renderComponentInstance(selectedMeta, 'Hover', true)}
            </div>
            <div />
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // MODE 2: CLEAN MINIMALIST 2-COLUMN GRID OF ALL 56 SHADCN COMPONENTS
  // ============================================================================
  const isTwoColGrid = containerWidth >= 560;

  return (
    <div
      className={`grid ${
        isTwoColGrid ? 'grid-cols-2' : 'grid-cols-1'
      } gap-5 w-full h-full min-h-0 ${bodyFont}`}
    >
      {SHADCN_ALL_COMPONENTS.map((meta) => (
        <div
          key={meta.id}
          onClick={() => onSelectComponentId?.(meta.id)}
          className="bg-white rounded-[24px] p-7 w-full h-full min-h-[160px] flex flex-col justify-between group cursor-pointer hover:shadow-sm transition"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500 group-hover:text-zinc-900 transition">
              {meta.name}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenExportModal?.(meta.id);
              }}
              className="w-7 h-7 rounded-lg hover:bg-zinc-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-zinc-400 hover:text-zinc-900"
              title={`Export / Install ${meta.name}`}
            >
              {copiedId === meta.id ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          <div className="my-auto py-4">
            {renderComponentInstance(meta, 'Default', true)}
          </div>

          <div />
        </div>
      ))}
    </div>
  );
};
