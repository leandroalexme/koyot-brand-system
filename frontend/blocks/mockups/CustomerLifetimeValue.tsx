import React from 'react';
import { defineBlock } from '../../sdk/block';
import { getReadableTextColor } from '../../utils/styleUtils';
import { Sparkles, TrendingUp, ShieldCheck } from 'lucide-react';

export default defineBlock({
  id: 'customer-lifetime-value',
  title: 'Customer Lifetime Value (CLV)',
  category: 'mockups',
  description:
    'Widget analítico e preditivo de valor de cliente (CLV), reativo à cor da marca, tipografia e raios.',
  defaultLayout: '2-col-50-50',
  variants: ['Default', 'Minimal', 'Dark'] as const,
  subElements: [
    { id: 'profile-card', label: 'Card do Perfil', category: 'Surfaces' },
    { id: 'analytics-card', label: 'Gráfico Analítico', category: 'Data Visualization' },
    { id: 'vip-badge', label: 'Badge de Status', category: 'Badges' },
    { id: 'bar-predicted', label: 'Barra CLV Previsto', category: 'Data Visualization' },
  ],
  render: ({
    tokens,
    activeVariant = 'Default',
    selectedSubElementId,
    onSelectSubElement,
    isDark = false,
  }) => {
    const isMinimal = activeVariant === 'Minimal';
    const isDarkMode = activeVariant === 'Dark' || isDark;

    const brandColor = tokens.primaryColor;
    const secondaryColor = tokens.secondaryColor || tokens.supportColor;
    const readableText = getReadableTextColor(brandColor);

    // Tipografia viva da marca
    const headingStyle: React.CSSProperties = {
      fontFamily: tokens.headingFont,
      fontWeight: tokens.headingWeight || 600,
      letterSpacing: `${tokens.letterSpacingEm || -0.02}em`,
    };

    const bodyStyle: React.CSSProperties = {
      fontFamily: tokens.bodyFont,
      fontWeight: tokens.bodyWeight || 400,
    };

    // Raio dinâmico
    const cardRadius = `${tokens.radiusPx}px`;
    const innerRadius = `${Math.max(6, tokens.radiusPx - 4)}px`;

    return (
      <div
        className="w-full h-full flex flex-col justify-between p-7 rounded-[24px] bg-card border border-border/70 overflow-hidden select-none relative group transition-all"
        style={{
          borderRadius: `${Math.max(16, tokens.radiusPx + 4)}px`,
        }}
      >
        {/* Header do Bloco */}
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono tracking-widest uppercase text-muted-foreground">
              Customer Intelligence
            </span>
            <span
              className="inline-block w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: brandColor }}
            />
          </div>

          <span className="text-xs font-mono text-muted-foreground/80 px-2 py-0.5 rounded-md bg-muted/60 border border-border/40">
            {activeVariant}
          </span>
        </div>

        {/* Palco Central: Mockup Visual Leve */}
        <div className="my-auto py-4 flex flex-col items-center justify-center">
          <div className="w-full max-w-[340px] flex flex-col gap-3">
            {/* Card 1: Perfil VIP do Cliente */}
            {!isMinimal && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectSubElement?.('profile-card');
                }}
                className={`w-full p-3.5 border transition-all cursor-pointer flex items-center justify-between ${
                  selectedSubElementId === 'profile-card'
                    ? 'ring-2 ring-primary ring-offset-2'
                    : ''
                }`}
                style={{
                  borderRadius: cardRadius,
                  backgroundColor: isDarkMode ? '#141416' : '#ffffff',
                  borderColor: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs"
                    style={{
                      backgroundColor: `${brandColor}20`,
                      color: brandColor,
                    }}
                  >
                    CA
                  </div>
                  <div>
                    <h4 className="text-xs text-foreground" style={headingStyle}>
                      Clara Albuquerque
                    </h4>
                    <p className="text-[11px] text-muted-foreground" style={bodyStyle}>
                      {tokens.brandName} VIP • Desde 2023
                    </p>
                  </div>
                </div>

                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectSubElement?.('vip-badge');
                  }}
                  className={`px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                    selectedSubElementId === 'vip-badge' ? 'ring-2 ring-primary' : ''
                  }`}
                  style={{
                    backgroundColor: brandColor,
                    color: readableText,
                    borderRadius: innerRadius,
                  }}
                >
                  VIP Tier 1
                </div>
              </div>
            )}

            {/* Card 2: Projeção de CLV */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                onSelectSubElement?.('analytics-card');
              }}
              className={`w-full p-4 border transition-all cursor-pointer flex flex-col gap-3.5 ${
                selectedSubElementId === 'analytics-card'
                  ? 'ring-2 ring-primary ring-offset-2'
                  : ''
              }`}
              style={{
                borderRadius: cardRadius,
                backgroundColor: isDarkMode ? '#141416' : '#ffffff',
                borderColor: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
              }}
            >
              {/* Header do Widget */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono">
                    Predicted CLV
                  </span>
                  <div className="text-xl text-foreground mt-0.5" style={headingStyle}>
                    R$ 14.850
                  </div>
                </div>

                <div
                  className="px-2 py-1 text-[10px] font-mono rounded-md flex items-center gap-1"
                  style={{
                    backgroundColor: `${brandColor}15`,
                    color: brandColor,
                    borderRadius: innerRadius,
                  }}
                >
                  <Sparkles className="w-3 h-3" />
                  <span>{tokens.brandName} AI</span>
                </div>
              </div>

              {/* Mini Gráfico Visual com as cores do tema */}
              <div className="pt-2 border-t border-border/40 flex items-end justify-between gap-3 h-24">
                <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <div
                    className="w-full rounded-t-md opacity-30 transition-all"
                    style={{
                      height: '42%',
                      backgroundColor: brandColor,
                      borderRadius: `${Math.min(4, tokens.radiusPx)}px ${Math.min(4, tokens.radiusPx)}px 0 0`,
                    }}
                  />
                  <span className="text-[9px] font-mono text-muted-foreground">Histórico</span>
                </div>

                <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <div
                    className="w-full rounded-t-md opacity-50 transition-all"
                    style={{
                      height: '65%',
                      backgroundColor: secondaryColor,
                      borderRadius: `${Math.min(4, tokens.radiusPx)}px ${Math.min(4, tokens.radiusPx)}px 0 0`,
                    }}
                  />
                  <span className="text-[9px] font-mono text-muted-foreground">Médio</span>
                </div>

                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectSubElement?.('bar-predicted');
                  }}
                  className={`flex-1 flex flex-col items-center gap-1.5 h-full justify-end cursor-pointer transition-all ${
                    selectedSubElementId === 'bar-predicted' ? 'scale-105' : ''
                  }`}
                >
                  <div
                    className="w-full rounded-t-md relative transition-all shadow-sm"
                    style={{
                      height: '92%',
                      backgroundColor: brandColor,
                      borderRadius: `${Math.min(4, tokens.radiusPx)}px ${Math.min(4, tokens.radiusPx)}px 0 0`,
                    }}
                  >
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-mono font-bold text-foreground">
                      +182%
                    </div>
                  </div>
                  <span className="text-[9px] font-mono font-bold text-foreground">Previsto</span>
                </div>

                <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <div
                    className="w-full rounded-t-md bg-muted/60 transition-all"
                    style={{
                      height: '50%',
                      borderRadius: `${Math.min(4, tokens.radiusPx)}px ${Math.min(4, tokens.radiusPx)}px 0 0`,
                    }}
                  />
                  <span className="text-[9px] font-mono text-muted-foreground">Mercado</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rodapé do Bloco */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border/40 z-10">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-primary" style={{ color: brandColor }} />
            <span style={bodyStyle}>Fonte: {tokens.headingFont}</span>
          </div>
          <span className="font-mono text-[11px]">Raio: {tokens.radiusPx}px</span>
        </div>
      </div>
    );
  },
});
