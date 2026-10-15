import React, { useState } from 'react';
import { defineBlock } from '../../sdk/block';
import { getReadableTextColor, hexToHsl, hslToHex } from '../../utils/styleUtils';

interface ColorSwatch {
  id: string;
  name: string;
  hex: string;
}

export default defineBlock({
  id: 'palette-stack',
  title: 'Color Palette Stack',
  category: 'color',
  description:
    'Paleta de cores em cartões empilhados 100% reativa aos tokens da marca ativa, sem bordas, com expansão sutil e sem overflow.',
  defaultLayout: '2-col-50-50',
  variants: ['Tonal Ramp (9 Cores)', 'Essential (4 Cores)', 'Core Tokens'] as const,
  subElements: [
    { id: 'swatch-1', label: 'Swatch 1', category: 'Color Swatches' },
    { id: 'swatch-2', label: 'Swatch 2', category: 'Color Swatches' },
    { id: 'swatch-3', label: 'Swatch 3', category: 'Color Swatches' },
    { id: 'swatch-4', label: 'Swatch 4', category: 'Color Swatches' },
    { id: 'swatch-5', label: 'Swatch 5', category: 'Color Swatches' },
    { id: 'swatch-6', label: 'Swatch 6', category: 'Color Swatches' },
    { id: 'swatch-7', label: 'Swatch 7', category: 'Color Swatches' },
    { id: 'swatch-8', label: 'Swatch 8', category: 'Color Swatches' },
    { id: 'swatch-9', label: 'Swatch 9', category: 'Color Swatches' },
  ],
  render: ({
    tokens,
    activeVariant = 'Tonal Ramp (9 Cores)',
    selectedSubElementId,
    onSelectSubElement,
    isDark = false,
  }) => {
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    // 1. Helpers Dinâmicos de Escala (Zero Hardcode!)
    const spacingMul = tokens.spacingMultiplier || 1;
    const fontScale = tokens.fontScale || 1;
    const sp = (basePx: number) => Math.round(basePx * spacingMul);
    const fs = (basePx: number) => Math.round(basePx * fontScale);

    // 2. Tipografia Dinâmica do Tema (NUNCA SLAB!)
    const fontStyle: React.CSSProperties = {
      fontFamily: tokens.bodyFont || tokens.headingFont,
      fontWeight: tokens.bodyWeight || 400,
    };

    // 3. Raio de Borda dos Swatches (100% Reativo a tokens.radiusPx)
    const cardRadius = `${tokens.radiusPx}px`;

    // 4. Cores 100% Derivadas dos Tokens da Marca Ativa
    const primary = tokens.primaryColor;
    const secondary = tokens.secondaryColor || primary;
    const accent = tokens.accentColor || primary;
    const support = tokens.supportColor || secondary;
    const surface = tokens.surfaceTint || primary;
    const darkSurface = tokens.darkSurface || '#18181B';

    const surfaceHsl = hexToHsl(surface);
    const darkHsl = hexToHsl(darkSurface);

    // Geração de rampa tonal dinâmica conectada aos tokens da marca
    const pureLight = hslToHex(surfaceHsl.h, Math.min(surfaceHsl.s, 4), 99);
    const subtleNeutral = hslToHex(surfaceHsl.h, Math.min(surfaceHsl.s, 8), 88);
    const midNeutral = hslToHex(surfaceHsl.h, Math.min(surfaceHsl.s, 6), 60);
    const deepDark = hslToHex(darkHsl.h, Math.min(darkHsl.s, 10), 7);

    // 5. Construção Dinâmica das Paletas por Variante
    let palette: ColorSwatch[];

    if (activeVariant === 'Essential (4 Cores)') {
      palette = [
        { id: 'swatch-1', name: 'Surface', hex: surface },
        { id: 'swatch-2', name: 'Secondary', hex: secondary },
        { id: 'swatch-3', name: 'Support', hex: support },
        { id: 'swatch-4', name: tokens.brandName || 'Primary', hex: primary },
      ];
    } else if (activeVariant === 'Core Tokens') {
      palette = [
        { id: 'swatch-1', name: 'Surface Tint', hex: surface },
        { id: 'swatch-2', name: tokens.brandName || 'Primary', hex: primary },
        { id: 'swatch-3', name: 'Secondary', hex: secondary },
        { id: 'swatch-4', name: 'Accent', hex: accent },
        { id: 'swatch-5', name: 'Support', hex: support },
        { id: 'swatch-6', name: 'Dark Surface', hex: darkSurface },
      ];
    } else {
      palette = [
        { id: 'swatch-1', name: 'Light Canvas', hex: pureLight },
        { id: 'swatch-2', name: 'Surface Tint', hex: surface },
        { id: 'swatch-3', name: 'Subtle Muted', hex: subtleNeutral },
        { id: 'swatch-4', name: 'Mid Neutral', hex: midNeutral },
        { id: 'swatch-5', name: 'Support Tone', hex: support },
        { id: 'swatch-6', name: 'Dark Surface', hex: darkSurface },
        { id: 'swatch-7', name: 'Deep Contrast', hex: deepDark },
        { id: 'swatch-8', name: 'Secondary Tone', hex: secondary },
        { id: 'swatch-9', name: tokens.brandName || 'Brand Accent', hex: primary },
      ];
    }

    // Fundo da vitrine limpo e reativo
    const showcaseBg = isDark
      ? darkSurface
      : hslToHex(surfaceHsl.h, Math.min(surfaceHsl.s, 6), 98);

    const isFewItems = palette.length <= 4;

    return (
      <div
        className="w-full h-full flex flex-col overflow-hidden select-none relative rounded-[24px] p-5 sm:p-6"
        style={{
          backgroundColor: showcaseBg,
        }}
      >
        {/* Pilha de Cartões: Zero Overflow com min-h-0 e flex proporcional */}
        <div
          className="w-full h-full flex flex-col overflow-hidden"
          style={{ gap: `${sp(isFewItems ? 10 : 5)}px` }}
        >
          {palette.map((color) => {
            const isHovered = hoveredId === color.id;
            const isSelected = selectedSubElementId === color.id;

            // Contraste tipográfico dinâmico
            const textColor = getReadableTextColor(color.hex);
            const hexColor = `${textColor}99`;

            return (
              <div
                key={color.id}
                onMouseEnter={() => setHoveredId(color.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectSubElement?.(color.id);
                  if (navigator?.clipboard) {
                    navigator.clipboard.writeText(color.hex);
                  }
                }}
                className={`w-full min-h-0 relative cursor-pointer flex items-center justify-between overflow-hidden ${
                  isSelected ? 'ring-2 ring-primary ring-offset-2' : ''
                }`}
                style={{
                  backgroundColor: color.hex,
                  borderRadius: cardRadius,
                  // Expansão sutil e limpa no hover sem escalas ou sombras
                  flex: isHovered ? (isFewItems ? 1.35 : 1.45) : 1,
                  transition: 'flex 200ms ease',
                  paddingLeft: `${sp(18)}px`,
                  paddingRight: `${sp(18)}px`,
                }}
              >
                {/* Linha de Dados: Nome e Código HEX */}
                <div
                  className="flex items-center"
                  style={{ gap: `${sp(28)}px` }}
                >
                  <span
                    className="tracking-tight shrink-0 truncate"
                    style={{
                      ...fontStyle,
                      color: textColor,
                      fontSize: `${fs(13)}px`,
                      width: `${fs(92)}px`,
                    }}
                  >
                    {color.name}
                  </span>

                  <span
                    className="font-mono uppercase tracking-wider shrink-0"
                    style={{
                      color: hexColor,
                      fontSize: `${fs(12)}px`,
                    }}
                  >
                    {color.hex.toUpperCase()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  },
});
