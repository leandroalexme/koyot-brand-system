import {
  BrandTokens,
  FontFamilyOption,
  FontRole,
  NeutralTone,
  BasePaletteTokens,
  ScaleUnitName,
  ScaleUnitMetrics,
} from '../types';

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace('#', '').trim();
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean.padEnd(6, '0');
  const num = parseInt(full, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export function hexToRgba(hex: string, alpha: number): string {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${Number(alpha.toFixed(2))})`;
}

export function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const { r, g, b } = hexToRgb(hex);
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;
  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rNorm:
        h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0);
        break;
      case gNorm:
        h = (bNorm - rNorm) / d + 2;
        break;
      case bNorm:
        h = (rNorm - gNorm) / d + 4;
        break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function hslToHex(h: number, s: number, l: number): string {
  const hNorm = ((h % 360) + 360) % 360;
  const sNorm = Math.max(0, Math.min(100, s)) / 100;
  const lNorm = Math.max(0, Math.min(100, l)) / 100;

  const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm;
  const x = c * (1 - Math.abs(((hNorm / 60) % 2) - 1));
  const m = lNorm - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;

  if (hNorm >= 0 && hNorm < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (hNorm >= 60 && hNorm < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (hNorm >= 120 && hNorm < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (hNorm >= 180 && hNorm < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (hNorm >= 240 && hNorm < 300) {
    r = x;
    g = 0;
    b = c;
  } else {
    r = c;
    g = 0;
    b = x;
  }

  const toHex = (n: number) =>
    Math.round((n + m) * 255)
      .toString(16)
      .padStart(2, '0');

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

export const SCALE_UNIT_KEYS: ScaleUnitName[] = [
  'XXS',
  'XS',
  'S',
  'M',
  'L',
  'XL',
  'XXL',
];

/**
 * Computes the 7-tier modular scale units (XXS to XXL) for Size, Height, and Spacing.
 * At fontScale=1.0, proportion=1.44, spacingMultiplier=1.0, produces the exact canonical ramp:
 * XXS: 11 | 15 | 4
 * XS:  13 | 17 | 8
 * S:   15 | 21 | 13
 * M:   17 | 25 | 17
 * L:   25 | 34 | 25
 * XL:  38 | 42 | 34
 * XXL: 50 | 55 | 50
 */
export function computeScaleUnits(
  fontScale = 1,
  proportion = 1.44,
  spacingMultiplier = 1
): Record<ScaleUnitName, ScaleUnitMetrics> {
  const baseSizes: Record<ScaleUnitName, number> = {
    XXS: 11,
    XS: 13,
    S: 15,
    M: 17,
    L: 25,
    XL: 38,
    XXL: 50,
  };
  const baseHeights: Record<ScaleUnitName, number> = {
    XXS: 15,
    XS: 17,
    S: 21,
    M: 25,
    L: 34,
    XL: 42,
    XXL: 55,
  };
  const baseSpacings: Record<ScaleUnitName, number> = {
    XXS: 4,
    XS: 8,
    S: 13,
    M: 17,
    L: 25,
    XL: 34,
    XXL: 50,
  };

  // Ratio adjustment relative to canonical 1.44x
  const ratioDelta = (proportion - 1.44) / 0.44;
  const tierFactor: Record<ScaleUnitName, number> = {
    XXS: 1 - ratioDelta * 0.08,
    XS: 1 - ratioDelta * 0.05,
    S: 1 - ratioDelta * 0.02,
    M: 1,
    L: 1 + ratioDelta * 0.08,
    XL: 1 + ratioDelta * 0.16,
    XXL: 1 + ratioDelta * 0.24,
  };

  const result = {} as Record<ScaleUnitName, ScaleUnitMetrics>;
  for (const unit of SCALE_UNIT_KEYS) {
    const f = tierFactor[unit];
    const size = Math.max(8, Math.round(baseSizes[unit] * fontScale * f));
    const height = Math.max(size + 2, Math.round(baseHeights[unit] * fontScale * f));
    const spacing = Math.max(2, Math.round(baseSpacings[unit] * spacingMultiplier * f));
    result[unit] = { size, height, spacing };
  }
  return result;
}

/**
 * Shifts a single color's saturation, lightness, and subtle hue warmth based on Character X (Quiet <-> Bold) and Y (Compact <-> Airy)
 */
function shiftColorWithCharacter(
  baseHex: string,
  charX: number,
  charY: number,
  isSurface = false
): string {
  const { h, s, l } = hexToHsl(baseHex);
  if (isSurface) {
    const nextS = Math.max(5, Math.min(60, s + charX * 14));
    const nextL = Math.max(86, Math.min(98, l + charY * 4 - charX * 2));
    return hslToHex(h, nextS, nextL);
  }
  const hueShift = Math.round(charX * 6 - charY * 4);
  const satShift = Math.round(charX * 22);
  const lightShift = Math.round(charY * 7 - charX * 6);

  const nextH = (h + hueShift + 360) % 360;
  const nextS = s <= 8 ? s : Math.max(18, Math.min(100, s + satShift));
  const nextL = Math.max(10, Math.min(90, l + lightShift));

  return hslToHex(nextH, nextS, nextL);
}

/**
 * Fluidly modulates spacing, border radius, font scale, heading/body weight, and palette colors
 * from the 2D Character pad coordinates (charX: -1 Quiet to +1 Bold, charY: -1 Compact to +1 Airy).
 */
export function modulateTokensByCharacter(
  tokens: BrandTokens,
  charX: number,
  charY: number,
  overrideBasePalette?: BasePaletteTokens
): BrandTokens {
  const clampedX = Math.max(-1, Math.min(1, charX));
  const clampedY = Math.max(-1, Math.min(1, charY));
  const basePal = overrideBasePalette || tokens.basePalette;

  const fontScale = Number((1 + clampedX * 0.14 + clampedY * 0.06).toFixed(3));

  const rawHeadingWeight = 600 + clampedX * 200;
  const headingWeight = Math.round(Math.max(300, Math.min(800, rawHeadingWeight)) / 100) * 100;

  const rawBodyWeight = 450 + clampedX * 150;
  const bodyWeight = Math.round(Math.max(300, Math.min(700, rawBodyWeight)) / 100) * 100;

  const spacingMultiplier = Number((1 + clampedY * 0.32).toFixed(2));

  const letterSpacingEm = Number((-0.02 - clampedX * 0.025 + clampedY * 0.015).toFixed(3));
  const letterSpacing: 'tight' | 'normal' | 'wide' =
    letterSpacingEm < -0.025 ? 'tight' : letterSpacingEm > 0.005 ? 'wide' : 'normal';

  const radiusDelta = Math.round(clampedY * 10 - clampedX * 6);
  const radiusPx = Math.max(0, Math.min(32, tokens.baseRadiusPx + radiusDelta));
  const radiusPreset =
    radiusPx === 0
      ? 'none'
      : radiusPx <= 6
      ? 'sm'
      : radiusPx <= 12
      ? 'md'
      : radiusPx <= 18
      ? 'lg'
      : radiusPx <= 24
      ? 'xl'
      : 'full';

  const borderWidth = clampedX > 0.55 ? 2 : clampedX < -0.55 ? 0 : 1;

  const scale: 'compact' | 'default' | 'airy' =
    clampedY > 0.25 ? 'airy' : clampedY < -0.25 ? 'compact' : 'default';

  const primaryColor = shiftColorWithCharacter(basePal.primaryColor, clampedX, clampedY, false);
  const supportColor = shiftColorWithCharacter(basePal.supportColor, clampedX, clampedY, false);
  const secondaryColor = shiftColorWithCharacter(basePal.secondaryColor, clampedX, clampedY, false);
  const accentColor = shiftColorWithCharacter(basePal.accentColor, clampedX, clampedY, false);
  const surfaceTint = shiftColorWithCharacter(basePal.surfaceTint, clampedX, clampedY, true);

  const scaleProportion = tokens.scaleProportion || 1.44;
  const scaleUnits = computeScaleUnits(fontScale, scaleProportion, spacingMultiplier);

  return {
    ...tokens,
    basePalette: basePal,
    characterX: Number(clampedX.toFixed(3)),
    characterY: Number(clampedY.toFixed(3)),
    fontScale,
    scaleProportion,
    scaleUnits,
    headingWeight,
    bodyWeight,
    spacingMultiplier,
    letterSpacingEm,
    letterSpacing,
    radiusPx,
    radius: radiusPreset,
    borderWidth,
    scale,
    primaryColor,
    supportColor,
    secondaryColor,
    accentColor,
    surfaceTint,
  };
}

/**
 * Generates a complete, mood-matched 4-color harmony + surface tint from any primary HEX
 */
export function deriveMoodPaletteFromHex(primaryHex: string): BasePaletteTokens {
  const { h, s } = hexToHsl(primaryHex);
  const supportColor = hslToHex((h + 145) % 360, Math.max(45, s - 15), 42);
  const secondaryColor = hslToHex((h + 35) % 360, Math.max(50, s - 10), 82);
  const accentColor = hslToHex((h + 215) % 360, Math.max(65, s), 62);
  const surfaceTint = hslToHex(h, Math.min(35, s), 95);

  return {
    primaryColor: primaryHex.toUpperCase(),
    supportColor,
    secondaryColor,
    accentColor,
    surfaceTint,
  };
}

export function getNeutralRamp(tone: NeutralTone): string[] {
  switch (tone) {
    case 'warm':
      return ['#FAF9F6', '#F5F3EF', '#E7E5E0', '#D6D3CD', '#A8A29E', '#78716C', '#44403C', '#1C1917'];
    case 'cool':
      return ['#F8FAFC', '#F1F5F9', '#E2E8F0', '#CBD5E1', '#94A3B8', '#64748B', '#334155', '#0F172A'];
    case 'sand':
      return ['#FDFBF7', '#F7F3E9', '#EAE3D2', '#D8CEB8', '#B0A48C', '#7D725D', '#4A4235', '#211D17'];
    case 'mono':
    default:
      return ['#FAFAFA', '#F4F4F5', '#E4E4E7', '#D4D4D8', '#A1A1AA', '#71717A', '#3F3F46', '#18181B'];
  }
}

export function getNeutralRamp10(tone: NeutralTone): string[] {
  switch (tone) {
    case 'warm':
      return [
        '#FFFFFF',
        '#FAF9F6',
        '#F3F1EC',
        '#E7E5E0',
        '#D6D3CD',
        '#A8A29E',
        '#78716C',
        '#57534E',
        '#292524',
        '#141210',
      ];
    case 'cool':
      return [
        '#FFFFFF',
        '#F8FAFC',
        '#F1F5F9',
        '#E2E8F0',
        '#CBD5E1',
        '#94A3B8',
        '#64748B',
        '#475569',
        '#1E293B',
        '#090D16',
      ];
    case 'sand':
      return [
        '#FFFFFF',
        '#FDFBF7',
        '#F5EFE2',
        '#EAE3D2',
        '#D8CEB8',
        '#B0A48C',
        '#857963',
        '#5C5242',
        '#332D24',
        '#171410',
      ];
    case 'mono':
    default:
      return [
        '#FFFFFF',
        '#FAFAFA',
        '#F2F2F0',
        '#E4E4E7',
        '#D4D4D8',
        '#A1A1AA',
        '#71717A',
        '#52525B',
        '#27272A',
        '#09090B',
      ];
  }
}

export interface SemanticColorEntry {
  id: string;
  label: string;
  group: 'Brand Colors' | 'Neutrals';
  hex: string;
  cssColor: string;
  isTransparent: boolean;
}

export function getSemanticColorCatalog(tokens: BrandTokens): SemanticColorEntry[] {
  const neutrals = getNeutralRamp10(tokens.neutralTone);
  const brandColors = [
    { id: 'Color 1', hex: tokens.primaryColor },
    { id: 'Color 2', hex: tokens.supportColor },
    { id: 'Color 3', hex: tokens.secondaryColor },
    { id: 'Color 4', hex: tokens.accentColor },
  ];

  const entries: SemanticColorEntry[] = [];

  for (const bc of brandColors) {
    entries.push({
      id: bc.id,
      label: bc.id,
      group: 'Brand Colors',
      hex: bc.hex,
      cssColor: bc.hex,
      isTransparent: false,
    });
    entries.push({
      id: `${bc.id} Transparent`,
      label: `${bc.id} Transparent`,
      group: 'Brand Colors',
      hex: bc.hex,
      cssColor: hexToRgba(bc.hex, 0.22),
      isTransparent: true,
    });
  }

  neutrals.forEach((nHex, idx) => {
    const num = idx + 1;
    entries.push({
      id: `Neutral ${num}`,
      label: `Neutral ${num}`,
      group: 'Neutrals',
      hex: nHex,
      cssColor: nHex,
      isTransparent: false,
    });
    entries.push({
      id: `Neutral ${num} Transparent`,
      label: `Neutral ${num} Transparent`,
      group: 'Neutrals',
      hex: nHex,
      cssColor: hexToRgba(nHex, 0.25),
      isTransparent: true,
    });
  });

  return entries;
}

export function resolveSemanticColorToken(
  tokenId: string | undefined,
  tokens: BrandTokens,
  fallbackId = 'Neutral 10'
): SemanticColorEntry {
  const catalog = getSemanticColorCatalog(tokens);
  const found = catalog.find((c) => c.id === (tokenId || fallbackId));
  return (
    found ||
    catalog.find((c) => c.id === fallbackId) ||
    catalog[catalog.length - 2]
  );
}

export function hexToHslString(hex: string): string {
  const { h, s, l } = hexToHsl(hex);
  return `${h}° ${s}% ${l}%`;
}

export function getLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  const a = [r, g, b].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

export function getContrastRatio(hex1: string, hex2: string): number {
  const lum1 = getLuminance(hex1);
  const lum2 = getLuminance(hex2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return Number(((brightest + 0.05) / (darkest + 0.05)).toFixed(2));
}

export function getReadableTextColor(bgHex: string): '#FFFFFF' | '#09090B' {
  const lum = getLuminance(bgHex);
  const lumWhite = 1.0;
  const lumDark = getLuminance('#09090B');
  const contrastWithWhite = (lumWhite + 0.05) / (lum + 0.05);
  const contrastWithDark = (lum + 0.05) / (lumDark + 0.05);
  return contrastWithDark >= contrastWithWhite ? '#09090B' : '#FFFFFF';
}

export function getFontClass(font: FontFamilyOption | string): string {
  switch (font) {
    case 'Plus Jakarta Sans':
      return "font-['Plus_Jakarta_Sans',sans-serif]";
    case 'Inter':
      return "font-['Inter',sans-serif]";
    case 'Space Grotesk':
      return "font-['Space_Grotesk',sans-serif]";
    case 'Syne':
      return "font-['Syne',sans-serif]";
    case 'Instrument Serif':
      return "font-['Instrument_Serif',serif]";
    case 'Fraunces':
      return "font-['Fraunces',serif]";
    case 'DM Sans':
      return "font-['DM_Sans',sans-serif]";
    case 'Outfit':
      return "font-['Outfit',sans-serif]";
    case 'Playfair Display':
      return "font-['Playfair_Display',serif]";
    case 'JetBrains Mono':
      return "font-['JetBrains_Mono',monospace]";
    case 'ABeeZee':
      return "font-['ABeeZee',sans-serif]";
    case 'Abel':
      return "font-['Abel',sans-serif]";
    case 'Abhaya Libre':
      return "font-['Abhaya_Libre',serif]";
    case 'Aboreto':
      return "font-['Aboreto',cursive]";
    case 'Abril Fatface':
      return "font-['Abril_Fatface',serif]";
    case 'Abyssinica SIL':
      return "font-['Abyssinica_SIL',serif]";
    case 'Aclonica':
      return "font-['Aclonica',sans-serif]";
    default:
      return "font-['Inter',sans-serif]";
  }
}

export function getFontFamilyByRole(
  tokens: BrandTokens,
  role: FontRole = 'ui'
): FontFamilyOption {
  if (tokens.fontRoles && tokens.fontRoles[role]) {
    return tokens.fontRoles[role].family;
  }
  switch (role) {
    case 'brand':
      return tokens.headingFont;
    case 'editorial':
      return tokens.editorialFont || tokens.headingFont;
    case 'data':
      return (tokens.monoFont as FontFamilyOption) || 'JetBrains Mono';
    case 'ui':
    default:
      return tokens.bodyFont;
  }
}

export function getRadiusClass(tokens: BrandTokens, multiplier: 'sm' | 'md' | 'lg' | 'pill' = 'md'): string {
  const px = tokens.radiusPx;
  if (px === 0) return 'rounded-none';
  if (multiplier === 'pill' && px >= 20) return 'rounded-full';
  if (px <= 4) return multiplier === 'lg' ? 'rounded-md' : 'rounded';
  if (px <= 10) return multiplier === 'lg' ? 'rounded-xl' : 'rounded-lg';
  if (px <= 16) return multiplier === 'lg' ? 'rounded-2xl' : 'rounded-xl';
  if (px <= 22) return multiplier === 'lg' ? 'rounded-3xl' : 'rounded-2xl';
  return multiplier === 'sm' ? 'rounded-2xl' : 'rounded-full';
}

export function getTrackingClass(tokens: BrandTokens): string {
  if (tokens.letterSpacing === 'tight') return 'tracking-tight';
  if (tokens.letterSpacing === 'wide') return 'tracking-wide';
  return 'tracking-normal';
}

export function getShadowClass(tokens: BrandTokens): string {
  if (tokens.shadowDepth === 'none') return 'shadow-none';
  if (tokens.shadowDepth === 'elevated') return 'shadow-xl shadow-zinc-900/10';
  return 'shadow-sm';
}
