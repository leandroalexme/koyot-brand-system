import {
  BrandTokens,
  SubElementStyleOverrides,
  ScaleUnitName,
  TextWeightName,
  BorderWidthName,
  CornerRadiusName,
  ControlSizeName,
} from '../types';
import {
  resolveSemanticColorToken,
  getFontFamilyByRole,
  getFontClass,
  computeScaleUnits,
  hexToRgba,
  hexToHsl,
  hslToHex,
  getNeutralRamp10,
  getReadableTextColor,
} from './styleUtils';

export interface UnifiedDesignMetrics {
  /** Scale units XXS..XXL computed from fontScale, scaleProportion, spacingMultiplier */
  units: Record<ScaleUnitName, { size: number; height: number; spacing: number }>;
  /** Neutral 1..10 ramp based on tokens.neutralTone (mono | warm | cool | sand) */
  neutrals: string[];
  /** Primary action background (respects primaryActionStyle: 'brand' | 'neutral') */
  actionBg: string;
  actionFg: string;
  /** Scaled control heights */
  controlHeightSm: number;
  controlHeightMd: number;
  controlHeightLg: number;
  /** Scaled horizontal & vertical paddings */
  padXSm: number;
  padXMd: number;
  padXLg: number;
  padYSm: number;
  padYMd: number;
  padYLg: number;
  /** Scaled gap between elements */
  gapSm: number;
  gapMd: number;
  gapLg: number;
  /** Font classes by semantic role */
  uiFontClass: string;
  brandFontClass: string;
  editorialFontClass: string;
  dataFontClass: string;
  /** Box shadow CSS from tokens.shadowDepth */
  shadowCss: string;
}

/**
 * Single source of truth connecting global BrandTokens (Character XY pad, Scale sliders,
 * 4 Font Roles, Neutral Tone, Primary Action Style, Radius, Border Width, Shadow Depth)
 * to every UI component and specimen.
 */
export function getUnifiedDesignMetrics(
  tokens: BrandTokens
): UnifiedDesignMetrics {
  const units =
    tokens.scaleUnits ||
    computeScaleUnits(
      tokens.fontScale,
      tokens.scaleProportion || 1.44,
      tokens.spacingMultiplier
    );
  const neutrals = getNeutralRamp10(tokens.neutralTone);

  const actionBg =
    tokens.primaryActionStyle === 'neutral' ? neutrals[9] : tokens.primaryColor;
  const actionFg = getReadableTextColor(actionBg);

  const sp = tokens.spacingMultiplier;
  const fs = tokens.fontScale;

  // Control heights react to both spacingMultiplier (Compact <-> Airy) and fontScale (Quiet <-> Bold)
  const scaleFactor = sp * 0.65 + fs * 0.35;
  const controlHeightSm = Math.max(24, Math.round(30 * scaleFactor));
  const controlHeightMd = Math.max(30, Math.round(38 * scaleFactor));
  const controlHeightLg = Math.max(34, Math.round(44 * scaleFactor));

  const padXSm = Math.max(6, Math.round(10 * sp));
  const padXMd = Math.max(10, Math.round(16 * sp));
  const padXLg = Math.max(14, Math.round(24 * sp));

  const padYSm = Math.max(4, Math.round(6 * sp));
  const padYMd = Math.max(6, Math.round(10 * sp));
  const padYLg = Math.max(8, Math.round(14 * sp));

  const gapSm = Math.max(4, Math.round(6 * sp));
  const gapMd = Math.max(6, Math.round(10 * sp));
  const gapLg = Math.max(10, Math.round(16 * sp));

  const uiFontClass = getFontClass(getFontFamilyByRole(tokens, 'ui'));
  const brandFontClass = getFontClass(getFontFamilyByRole(tokens, 'brand'));
  const editorialFontClass = getFontClass(
    getFontFamilyByRole(tokens, 'editorial')
  );
  const dataFontClass = getFontClass(getFontFamilyByRole(tokens, 'data'));

  const shadowCss =
    tokens.shadowDepth === 'none'
      ? 'none'
      : tokens.shadowDepth === 'elevated'
      ? '0 12px 28px rgba(0,0,0,0.12)'
      : '0 2px 6px rgba(0,0,0,0.06)';

  return {
    units,
    neutrals,
    actionBg,
    actionFg,
    controlHeightSm,
    controlHeightMd,
    controlHeightLg,
    padXSm,
    padXMd,
    padXLg,
    padYSm,
    padYMd,
    padYLg,
    gapSm,
    gapMd,
    gapLg,
    uiFontClass,
    brandFontClass,
    editorialFontClass,
    dataFontClass,
    shadowCss,
  };
}

export function resolveWeightValue(
  weightName: TextWeightName | undefined,
  fallbackWeight: number
): number {
  switch (weightName) {
    case 'Light':
      return 300;
    case 'Regular':
      return 400;
    case 'Medium':
      return 500;
    case 'Bold':
      return 700;
    default:
      return fallbackWeight;
  }
}

export function resolveBorderWidthPx(
  bw: BorderWidthName | undefined,
  fallbackPx: number
): number {
  switch (bw) {
    case 'None':
      return 0;
    case 'S':
      return Math.max(1, fallbackPx);
    case 'M':
      return Math.max(2, fallbackPx + 1);
    case 'L':
      return Math.max(3, fallbackPx + 2);
    default:
      return fallbackPx;
  }
}

export function resolveCornerRadiusCss(
  ovr: SubElementStyleOverrides | undefined,
  fallbackPx: number
): string {
  if (!ovr) return `${fallbackPx}px`;
  if (ovr.individualCorners) {
    const tl = ovr.cornerTL ?? fallbackPx;
    const tr = ovr.cornerTR ?? fallbackPx;
    const br = ovr.cornerBR ?? fallbackPx;
    const bl = ovr.cornerBL ?? fallbackPx;
    return `${tl}px ${tr}px ${br}px ${bl}px`;
  }
  switch (ovr.cornerRadius) {
    case 'None':
      return '0px';
    case 'XS':
      return '4px';
    case 'S':
      return '8px';
    case 'M':
      return '12px';
    case 'L':
      return '18px';
    case 'XL':
      return '24px';
    case 'Full':
      return '9999px';
    default:
      return `${fallbackPx}px`;
  }
}

export function resolveControlSizePx(
  size: ControlSizeName | undefined,
  defaultPx = 32
): number {
  switch (size) {
    case 'XS':
      return Math.round(defaultPx * 0.65);
    case 'S':
      return Math.round(defaultPx * 0.8);
    case 'M':
      return Math.round(defaultPx * 0.92);
    case 'L':
      return defaultPx;
    case 'XL':
      return Math.round(defaultPx * 1.15);
    case 'XXL':
      return Math.round(defaultPx * 1.35);
    default:
      return defaultPx;
  }
}

export function resolveTextMetrics(
  tokens: BrandTokens,
  unit: ScaleUnitName | undefined,
  fallbackSizePx: number
): { fontSizePx: number; lineHeightPx: number; spacingPx: number } {
  const units =
    tokens.scaleUnits ||
    computeScaleUnits(
      tokens.fontScale,
      tokens.scaleProportion || 1.44,
      tokens.spacingMultiplier
    );
  if (unit && units[unit]) {
    return {
      fontSizePx: units[unit].size,
      lineHeightPx: units[unit].height,
      spacingPx: units[unit].spacing,
    };
  }
  return {
    fontSizePx: fallbackSizePx,
    lineHeightPx: Math.round(fallbackSizePx * 1.35),
    spacingPx: Math.round(12 * tokens.spacingMultiplier),
  };
}

export function resolveShadowCss(
  shadow: 'none' | 'subtle' | 'elevated' | undefined,
  fallbackShadow?: string
): string | undefined {
  if (!shadow) return fallbackShadow;
  if (shadow === 'none') return 'none';
  if (shadow === 'subtle') return '0 2px 8px rgba(0,0,0,0.08)';
  return '0 12px 28px rgba(0,0,0,0.16)';
}

export function resolveFillColorCss(
  tokens: BrandTokens,
  tokenId: string | undefined,
  opacityPercent: number | undefined,
  fallbackHex: string
): string {
  const resolved = tokenId
    ? resolveSemanticColorToken(tokenId, tokens)
    : null;
  const baseHex = resolved ? resolved.hex : fallbackHex;
  const baseAlpha = resolved?.isTransparent ? 0.25 : 1;
  const userAlpha = (opacityPercent ?? 100) / 100;
  const finalAlpha = baseAlpha * userAlpha;
  if (finalAlpha >= 0.99) return baseHex;
  return hexToRgba(baseHex, finalAlpha);
}

export function getResolvedFontClass(
  tokens: BrandTokens,
  ovr: SubElementStyleOverrides | undefined,
  defaultRole: 'ui' | 'brand' | 'editorial' | 'data' = 'ui'
): string {
  const role = ovr?.fontRole || defaultRole;
  const family = getFontFamilyByRole(tokens, role);
  return getFontClass(family);
}

/**
 * Computes the complete CSS Custom Properties map for `.lime` / `[data-system="lime"]`
 * from the active BrandTokens (Character XY pad, Scale, Colors, Neutrals, Fonts, Corners, Shadows).
 * Every `@base-ui/react` component in `systems/lime` reads these CSS variables directly.
 */
export function getLimeScopeCssVars(
  tokens: BrandTokens,
  isDark = false
): React.CSSProperties {
  const ds = getUnifiedDesignMetrics(tokens);
  const { h, s, l } = hexToHsl(tokens.primaryColor);

  const accentHex =
    tokens.primaryActionStyle === 'neutral'
      ? isDark
        ? '#FFFFFF'
        : ds.neutrals[9]
      : tokens.primaryColor;
  const onAccentHex = getReadableTextColor(accentHex);

  const accentHover = hslToHex(h, s, Math.max(10, l - 6));
  const accentActive = hslToHex(h, s, Math.max(8, l - 12));
  const accentWash = isDark
    ? hslToHex(h, Math.min(45, s), 16)
    : tokens.surfaceTint;
  const accentLine = hslToHex(h, Math.max(40, s), isDark ? 65 : 38);

  const glowFrom = hslToHex(h, s, Math.max(12, l - 4));
  const glowTo = hslToHex(h, Math.min(100, s + 8), Math.min(92, l + 14));
  const glowFromLit = hslToHex(h, s, Math.min(90, l + 3));
  const glowToLit = hslToHex(h, Math.min(100, s + 10), Math.min(95, l + 20));

  const uiFamily = getFontFamilyByRole(tokens, 'ui');
  const brandFamily = getFontFamilyByRole(tokens, 'brand');
  const editorialFamily = getFontFamilyByRole(tokens, 'editorial');
  const dataFamily = getFontFamilyByRole(tokens, 'data');

  const rPx = tokens.radiusPx;
  const radiusSm = `${Math.max(0, Math.round(rPx * 0.35))}px`;
  const radiusMd = `${Math.max(0, Math.round(rPx * 0.6))}px`;
  const radiusField = `${Math.max(0, Math.round(rPx * 0.75))}px`;
  const radiusPanel = `${Math.max(0, rPx)}px`;
  const radiusSheet = `${Math.max(0, Math.round(rPx * 1.35))}px`;
  const radiusControl = rPx >= 20 ? '999px' : `${Math.max(0, rPx)}px`;

  return {
    '--page': isDark ? '#141416' : ds.neutrals[0],
    '--surface': isDark ? '#1C1C1F' : ds.neutrals[1],
    '--surface-2': isDark ? '#252529' : ds.neutrals[2],
    '--surface-3': isDark ? '#323237' : ds.neutrals[3],
    '--raised': isDark ? '#1F1F23' : '#FFFFFF',
    '--field': isDark ? '#1C1C1F' : ds.neutrals[1],
    '--fg': isDark ? '#F4F4F5' : ds.neutrals[9],
    '--fg-2': isDark ? '#D4D4D8' : ds.neutrals[7],
    '--fg-3': isDark ? '#A1A1AA' : ds.neutrals[6],
    '--fg-disabled': isDark ? '#52525B' : ds.neutrals[5],
    '--fg-inverse': isDark ? '#09090B' : '#FFFFFF',
    '--on-accent': onAccentHex,
    '--glow-accent-fg': onAccentHex,
    '--border-width': `${tokens.borderWidth}px`,
    '--line': isDark ? '#2E2E33' : ds.neutrals[3],
    '--line-strong': isDark ? '#3F3F46' : ds.neutrals[4],
    '--control': isDark ? '#71717A' : ds.neutrals[5],
    '--ink': isDark ? '#F4F4F5' : ds.neutrals[9],
    '--ink-hover': isDark ? '#E4E4E7' : ds.neutrals[8],
    '--ink-active': isDark ? '#D4D4D8' : ds.neutrals[7],
    '--accent': accentHex,
    '--accent-hover': accentHover,
    '--accent-active': accentActive,
    '--accent-wash': accentWash,
    '--accent-line': accentLine,
    '--ring': accentLine,
    '--support': tokens.supportColor,
    '--secondary': tokens.secondaryColor,
    '--highlight': tokens.accentColor,
    '--switch-on': accentHex,
    '--shadow-card': ds.shadowCss,
    '--glow-accent-from': glowFrom,
    '--glow-accent-to': glowTo,
    '--glow-accent-from-lit': glowFromLit,
    '--glow-accent-to-lit': glowToLit,
    '--glow-accent-from-press': accentActive,
    '--glow-accent-to-press': accentHex,
    '--font-sans': `"${uiFamily}", ui-sans-serif, system-ui, sans-serif`,
    '--font-brand': `"${brandFamily}", "${uiFamily}", sans-serif`,
    '--font-editorial': `"${editorialFamily}", Georgia, serif`,
    '--font-mono': `"${dataFamily}", ui-monospace, monospace`,
    '--tracking-brand': `${tokens.letterSpacingEm}em`,
    '--tracking-tight': `${tokens.letterSpacingEm}em`,
    '--text-xs': `${ds.units.XXS.size}px`,
    '--text-sm': `${ds.units.XS.size}px`,
    '--text-base': `${ds.units.S.size}px`,
    '--text-lg': `${ds.units.M.size}px`,
    '--text-xl': `${Math.round((ds.units.M.size + ds.units.L.size) / 2)}px`,
    '--text-2xl': `${ds.units.L.size}px`,
    '--text-3xl': `${ds.units.XL.size}px`,
    '--weight-normal': String(tokens.bodyWeight),
    '--weight-medium': String(Math.min(700, tokens.bodyWeight + 100)),
    '--weight-semibold': String(tokens.headingWeight),
    '--control-sm': `${ds.controlHeightSm}px`,
    '--control-md': `${ds.controlHeightMd}px`,
    '--control-lg': `${ds.controlHeightLg}px`,
    '--spacing': `${Math.max(2.5, Number((4 * tokens.spacingMultiplier).toFixed(1)))}px`,
    '--radius-sm': radiusSm,
    '--radius-md': radiusMd,
    '--radius-field': radiusField,
    '--radius-panel': radiusPanel,
    '--radius-sheet': radiusSheet,
    '--radius-control': radiusControl,
  } as React.CSSProperties;
}

/**
 * Generates scoped CSS rules for any `[data-slot="..."]` overrides configured in the right-hand Inspector
 */
export function buildBlockDataSlotCss(
  blockId: string,
  tokens: BrandTokens,
  subElements?: Record<string, SubElementStyleOverrides>,
  hoveredSlot?: string | null,
  selectedSlot?: string | null
): string {
  const rules: string[] = [];

  if (hoveredSlot && hoveredSlot !== selectedSlot) {
    rules.push(
      `[data-koyot-block="${blockId}"] [data-slot="${hoveredSlot}"] { outline: 1px dashed #D946EF !important; outline-offset: 2px !important; }`
    );
  }
  if (selectedSlot) {
    rules.push(
      `[data-koyot-block="${blockId}"] [data-slot="${selectedSlot}"] { outline: 1.5px solid #D946EF !important; outline-offset: 2px !important; }`
    );
  }

  if (!subElements) return rules.join('\n');

  for (const [slotName, ovr] of Object.entries(subElements)) {
    if (!ovr) continue;
    const decls: string[] = [];

    if (ovr.fillToken || ovr.fillOpacity !== undefined) {
      const bg = resolveFillColorCss(
        tokens,
        ovr.fillToken,
        ovr.fillOpacity,
        tokens.primaryColor
      );
      decls.push(`background-color: ${bg} !important;`);
      decls.push(`background-image: none !important;`);
    }
    if (ovr.accentFillToken) {
      const acc = resolveSemanticColorToken(ovr.accentFillToken, tokens).cssColor;
      decls.push(`--accent: ${acc} !important;`);
    }
    if (ovr.textColorToken) {
      const fg = resolveSemanticColorToken(ovr.textColorToken, tokens).cssColor;
      decls.push(`color: ${fg} !important;`);
    }
    if (ovr.fontRole) {
      const fam = getFontFamilyByRole(tokens, ovr.fontRole);
      decls.push(`font-family: "${fam}", sans-serif !important;`);
    }
    if (ovr.textSize) {
      const m = resolveTextMetrics(tokens, ovr.textSize, 14);
      decls.push(`font-size: ${m.fontSizePx}px !important;`);
      decls.push(`line-height: ${m.lineHeightPx}px !important;`);
    }
    if (ovr.fontWeight) {
      const w = resolveWeightValue(ovr.fontWeight, 500);
      decls.push(`font-weight: ${w} !important;`);
    }
    if (ovr.borderWidth) {
      const bw = resolveBorderWidthPx(ovr.borderWidth, 1);
      decls.push(`border-width: ${bw}px !important;`);
      decls.push(`border-style: ${bw > 0 ? 'solid' : 'none'} !important;`);
    }
    if (ovr.borderToken) {
      const bc = resolveSemanticColorToken(ovr.borderToken, tokens).cssColor;
      decls.push(`border-color: ${bc} !important;`);
    }
    if (ovr.cornerRadius || ovr.individualCorners) {
      const rad = resolveCornerRadiusCss(ovr, tokens.radiusPx);
      decls.push(`border-radius: ${rad} !important;`);
    }
    if (ovr.controlSize) {
      const h = resolveControlSizePx(ovr.controlSize, 36);
      decls.push(`min-height: ${h}px !important;`);
    }
    if (ovr.shadow) {
      const sh = resolveShadowCss(ovr.shadow);
      if (sh) decls.push(`box-shadow: ${sh} !important;`);
    }

    if (decls.length > 0) {
      rules.push(
        `[data-koyot-block="${blockId}"] [data-slot="${slotName}"] { ${decls.join(' ')} }`
      );
      if (slotName === 'slider-track' && ovr.accentFillToken) {
        const acc = resolveSemanticColorToken(ovr.accentFillToken, tokens).cssColor;
        rules.push(
          `[data-koyot-block="${blockId}"] [data-slot="slider-range"] { background-color: ${acc} !important; }`
        );
      }
    }
  }

  return rules.join('\n');
}
