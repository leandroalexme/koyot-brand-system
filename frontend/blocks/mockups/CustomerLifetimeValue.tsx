import React from 'react';
import { defineBlock } from '../../sdk/block';
import { getReadableTextColor } from '../../utils/styleUtils';

export default defineBlock({
  id: 'customer-lifetime-value',
  title: 'Customer Lifetime Value (CLV)',
  category: 'mockups',
  description:
    'Widget analítico e preditivo de valor de cliente (CLV), reativo à cor da marca, tipografia e raios.',
  defaultLayout: '2-col-50-50',
  variants: ['Default', 'Brand Surface', 'Dark'] as const,
  subElements: [
    { id: 'customer-identity', label: 'Identidade do Cliente', category: 'Typography' },
    { id: 'clv-metric', label: 'Métrica de Valor Previsto', category: 'Data' },
    { id: 'bars-matrix', label: 'Matriz Comparativa', category: 'Data Visualization' },
  ],
  render: ({
    tokens,
    activeVariant = 'Default',
    selectedSubElementId,
    onSelectSubElement,
    isDark = false,
  }) => {
    const isBrandSurface = activeVariant === 'Brand Surface';
    const isDarkMode = activeVariant === 'Dark' || isDark;

    const brandColor = tokens.primaryColor;
    const accentColor = tokens.accentColor || brandColor;
    const secondaryColor = tokens.secondaryColor || tokens.supportColor;

    // Fundo do Bloco: ou Branco limpo, ou preenchimento sólido do token da marca, ou Dark
    const bgColor = isBrandSurface
      ? accentColor
      : isDarkMode
      ? '#09090b'
      : '#ffffff';

    const textColor = isBrandSurface
      ? getReadableTextColor(accentColor)
      : isDarkMode
      ? '#f4f4f5'
      : '#09090b';

    const subtleTextColor = isBrandSurface
      ? `${textColor}99`
      : isDarkMode
      ? '#a1a1aa'
      : '#71717a';

    const borderColor = isBrandSurface
      ? `${textColor}20`
      : isDarkMode
      ? 'rgba(255,255,255,0.08)'
      : 'rgba(0,0,0,0.06)';

    const headingStyle: React.CSSProperties = {
      fontFamily: tokens.headingFont,
      fontWeight: tokens.headingWeight || 600,
      letterSpacing: `${tokens.letterSpacingEm || -0.02}em`,
    };

    const bodyStyle: React.CSSProperties = {
      fontFamily: tokens.bodyFont,
      fontWeight: tokens.bodyWeight || 400,
    };

    return (
      <div
        className="w-full h-full flex flex-col justify-between p-8 sm:p-10 rounded-[24px] overflow-hidden select-none transition-colors duration-200 border border-border/40"
        style={{
          backgroundColor: bgColor,
          color: textColor,
          borderRadius: `${Math.max(20, tokens.radiusPx + 4)}px`,
        }}
      >
        {/* Topo: Identidade do Cliente e Tag de Status */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            onSelectSubElement?.('customer-identity');
          }}
          className={`flex items-baseline justify-between pb-6 border-b cursor-pointer transition-all ${
            selectedSubElementId === 'customer-identity' ? 'opacity-80' : ''
          }`}
          style={{ borderColor }}
        >
          <div>
            <span
              className="text-[10px] font-mono uppercase tracking-[0.18em]"
              style={{ color: subtleTextColor }}
            >
              Customer Identity // 0842
            </span>
            <h3 className="text-xl sm:text-2xl mt-1 leading-tight" style={headingStyle}>
              Clara Albuquerque
            </h3>
          </div>

          <div className="text-right">
            <span
              className="text-[11px] font-mono tracking-wider uppercase font-semibold"
              style={{ color: isBrandSurface ? textColor : brandColor }}
            >
              {tokens.brandName} VIP
            </span>
            <div className="text-[10px] font-mono mt-0.5" style={{ color: subtleTextColor }}>
              Coorte Q2 2023
            </div>
          </div>
        </div>

        {/* Meio: Métrica Central CLV em Destaque Editorial */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            onSelectSubElement?.('clv-metric');
          }}
          className={`my-auto py-6 cursor-pointer transition-all ${
            selectedSubElementId === 'clv-metric' ? 'opacity-80' : ''
          }`}
        >
          <div
            className="text-[11px] font-mono uppercase tracking-[0.2em]"
            style={{ color: subtleTextColor }}
          >
            Predicted Lifetime Value
          </div>
          <div className="flex items-baseline gap-3 mt-1.5">
            <span
              className="text-4xl sm:text-5xl leading-none font-bold tracking-tight"
              style={headingStyle}
            >
              R$ 14.850
            </span>
            <span
              className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: isBrandSurface
                  ? `${textColor}25`
                  : `${brandColor}18`,
                color: isBrandSurface ? textColor : brandColor,
              }}
            >
              +182% YoY
            </span>
          </div>
        </div>

        {/* Base: Gráfico Minimalista Direto na Prancheta */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            onSelectSubElement?.('bars-matrix');
          }}
          className="pt-6 border-t cursor-pointer"
          style={{ borderColor }}
        >
          <div className="grid grid-cols-4 gap-4 items-end h-20">
            {/* Barra 1 */}
            <div className="flex flex-col gap-2 h-full justify-end">
              <div
                className="w-full transition-all"
                style={{
                  height: '38%',
                  backgroundColor: isBrandSurface ? `${textColor}40` : `${brandColor}35`,
                  borderRadius: `${Math.min(4, tokens.radiusPx)}px`,
                }}
              />
              <span className="text-[10px] font-mono" style={{ color: subtleTextColor }}>
                Base
              </span>
            </div>

            {/* Barra 2 */}
            <div className="flex flex-col gap-2 h-full justify-end">
              <div
                className="w-full transition-all"
                style={{
                  height: '58%',
                  backgroundColor: isBrandSurface ? `${textColor}60` : secondaryColor,
                  borderRadius: `${Math.min(4, tokens.radiusPx)}px`,
                }}
              />
              <span className="text-[10px] font-mono" style={{ color: subtleTextColor }}>
                Médio
              </span>
            </div>

            {/* Barra 3 - Previsto (Destaque) */}
            <div className="flex flex-col gap-2 h-full justify-end">
              <div
                className="w-full transition-all"
                style={{
                  height: '95%',
                  backgroundColor: isBrandSurface ? textColor : brandColor,
                  borderRadius: `${Math.min(4, tokens.radiusPx)}px`,
                }}
              />
              <span
                className="text-[10px] font-mono font-semibold"
                style={{ color: isBrandSurface ? textColor : brandColor }}
              >
                Previsto
              </span>
            </div>

            {/* Barra 4 */}
            <div className="flex flex-col gap-2 h-full justify-end">
              <div
                className="w-full transition-all"
                style={{
                  height: '48%',
                  backgroundColor: isBrandSurface ? `${textColor}25` : `${textColor}20`,
                  borderRadius: `${Math.min(4, tokens.radiusPx)}px`,
                }}
              />
              <span className="text-[10px] font-mono" style={{ color: subtleTextColor }}>
                Coorte
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  },
});
