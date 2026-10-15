import React from 'react';
import { defineBlock } from '../../sdk/block';
import { getReadableTextColor } from '../../utils/styleUtils';

export default defineBlock({
  id: 'billboard-mockup',
  title: 'Outdoor Billboard Mockup',
  category: 'mockups',
  description:
    'Mockup editorial em grande escala de outdoor urbano de alto impacto.',
  defaultLayout: '2-col-50-50',
  variants: ['Default', 'Inverted', 'Monochrome'] as const,
  subElements: [
    { id: 'headline', label: 'Headline Principal', category: 'Typography' },
    { id: 'tagline', label: 'Assinatura da Marca', category: 'Typography' },
  ],
  render: ({
    tokens,
    activeVariant = 'Default',
    selectedSubElementId,
    onSelectSubElement,
    isDark = false,
  }) => {
    const isInverted = activeVariant === 'Inverted';
    const isMono = activeVariant === 'Monochrome';

    const brandColor = tokens.primaryColor;
    const accentColor = tokens.accentColor || brandColor;

    const bg = isMono
      ? (isDark ? '#09090b' : '#f4f4f5')
      : isInverted
      ? accentColor
      : (isDark ? '#121215' : '#ffffff');

    const fg = isMono
      ? (isDark ? '#ffffff' : '#09090b')
      : isInverted
      ? getReadableTextColor(accentColor)
      : (isDark ? '#f4f4f5' : '#09090b');

    const subtleFg = `${fg}80`;

    const headingStyle: React.CSSProperties = {
      fontFamily: tokens.headingFont,
      fontWeight: tokens.headingWeight || 700,
      letterSpacing: `${tokens.letterSpacingEm || -0.03}em`,
    };

    const bodyStyle: React.CSSProperties = {
      fontFamily: tokens.bodyFont,
      fontWeight: tokens.bodyWeight || 400,
    };

    const spacingMul = tokens.spacingMultiplier || 1;
    const fontScale = tokens.fontScale || 1;
    const sp = (basePx: number) => Math.round(basePx * spacingMul);
    const fs = (basePx: number) => Math.round(basePx * fontScale);

    return (
      <div
        className="w-full h-full flex flex-col justify-between rounded-[24px] overflow-hidden select-none transition-all duration-200 border border-border/40 relative p-6 sm:p-8 md:p-10"
        style={{
          backgroundColor: bg,
          color: fg,
        }}
      >
        {/* Metadado Sutil de Canto */}
        <div className="flex items-center justify-between text-[10px] font-mono tracking-[0.2em] uppercase opacity-60">
          <span>{tokens.brandName} // Large Scale 16:9</span>
          <span>Tokyo • Shibuya 01</span>
        </div>

        {/* Tipografia de Grande Impacto Editorial */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            onSelectSubElement?.('headline');
          }}
          className={`my-auto py-6 cursor-pointer transition-all ${
            selectedSubElementId === 'headline' ? 'opacity-80' : ''
          }`}
        >
          <div
            className="text-4xl sm:text-6xl md:text-7xl font-bold leading-[0.92] tracking-tighter"
            style={headingStyle}
          >
            {tokens.brandName}
          </div>
          <div
            className="text-sm sm:text-base mt-4 max-w-md opacity-80 leading-relaxed font-light"
            style={bodyStyle}
          >
            {tokens.tagline || 'The living brand system engineered for modern identities.'}
          </div>
        </div>

        {/* Rodapé Tipográfico Puro (Sem debug, apenas assinatura da marca) */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            onSelectSubElement?.('tagline');
          }}
          className="flex items-baseline justify-between pt-6 border-t cursor-pointer"
          style={{ borderColor: `${fg}15` }}
        >
          <span className="text-xs font-mono tracking-widest uppercase" style={{ color: subtleFg }}>
            Autumn / Winter Campaign
          </span>
          <span className="text-xs font-semibold" style={{ color: isMono ? fg : brandColor }}>
            koyot.design
          </span>
        </div>
      </div>
    );
  },
});
