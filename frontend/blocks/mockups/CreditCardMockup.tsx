import React from 'react';
import { defineBlock } from '../../sdk/block';
import { getReadableTextColor } from '../../utils/styleUtils';
import { Wifi, ShieldCheck } from 'lucide-react';

export default defineBlock({
  id: 'credit-card-mockup',
  title: 'Credit Card Physical Mockup',
  category: 'mockups',
  description: 'Mockup tridimensional de cartão físico reativo à paleta da marca e raio de curvatura.',
  defaultLayout: '2-col-50-50',
  variants: ['Default', 'Minimal', 'Dark'] as const,
  subElements: [
    {
      id: 'card-surface',
      label: 'Superfície do Cartão',
      category: 'Surfaces',
      description: 'Acabamento acetinado com gradiente e raio de borda da marca.',
    },
    {
      id: 'brand-chip',
      label: 'Chip EMV & Contactless',
      category: 'Hardware',
      description: 'Componente de segurança do cartão em acabamento metálico.',
    },
    {
      id: 'cardholder-info',
      label: 'Dados do Titular',
      category: 'Typography',
      description: 'Nome do titular e numeração com tipografia monoespaçada.',
    },
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
    const textColor = getReadableTextColor(brandColor);

    const headingStyle: React.CSSProperties = {
      fontFamily: tokens.headingFont,
      fontWeight: tokens.headingWeight || 600,
    };

    const spacingMul = tokens.spacingMultiplier || 1;
    const fontScale = tokens.fontScale || 1;
    const sp = (basePx: number) => Math.round(basePx * spacingMul);
    const fs = (basePx: number) => Math.round(basePx * fontScale);

    return (
      <div
        className="w-full h-full flex flex-col justify-between rounded-[24px] overflow-hidden select-none relative transition-all duration-200 border border-border/40 p-6 sm:p-8"
        style={{
          backgroundColor: isDarkMode ? '#0d0d10' : '#ffffff',
        }}
      >
        {/* Topo Sutil */}
        <div className="flex items-center justify-between text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground/70">
          <span>{tokens.brandName} Physical Touchpoint</span>
          <span>EMV • NFC 3.0</span>
        </div>

        {/* Cartão Centralizado sem sombras pesadas */}
        <div className="my-auto py-6 flex items-center justify-center">
          <div
            onClick={(e) => {
              e.stopPropagation();
              onSelectSubElement?.('card-surface');
            }}
            className={`w-full max-w-[340px] aspect-[1.586/1] p-6 relative transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden border border-black/10 dark:border-white/10 ${
              selectedSubElementId === 'card-surface'
                ? 'ring-2 ring-primary ring-offset-4 ring-offset-background'
                : ''
            }`}
            style={{
              borderRadius: `${Math.max(12, tokens.radiusPx)}px`,
              background: `linear-gradient(135deg, ${brandColor} 0%, #111116 100%)`,
            }}
          >
            {/* Topo do cartão */}
            <div className="flex items-center justify-between z-10">
              <span
                className="font-bold tracking-tight text-lg"
                style={{ ...headingStyle, color: textColor }}
              >
                {tokens.brandName}
              </span>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectSubElement?.('brand-chip');
                }}
                className={`p-1.5 rounded-lg bg-white/10 text-white/80 transition-all ${
                  selectedSubElementId === 'brand-chip' ? 'ring-2 ring-white' : ''
                }`}
                title="Chip & Contactless"
              >
                <Wifi className="w-4 h-4 rotate-90" />
              </div>
            </div>

            {/* Centro do cartão */}
            {!isMinimal && (
              <div className="flex items-center gap-3 z-10 my-1">
                <div className="w-10 h-7 rounded bg-amber-400/90 border border-amber-300/40" />
                <ShieldCheck className="w-4 h-4 text-white/30" />
              </div>
            )}

            {/* Rodapé do cartão */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                onSelectSubElement?.('cardholder-info');
              }}
              className={`z-10 transition-all rounded p-1 ${
                selectedSubElementId === 'cardholder-info' ? 'ring-1 ring-white/60' : ''
              }`}
            >
              <div className="font-mono text-xs tracking-[0.2em] text-white/70">
                •••• •••• •••• 8842
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[10px] font-mono tracking-wider text-white/90 uppercase">
                  LIVING BRAND MEMBER
                </span>
                <span className="text-[10px] font-mono text-white/50">
                  09/29
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Rodapé Tipográfico Mínimo */}
        <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground/60 pt-4 border-t border-border/40">
          <span>SPEC 85.60 × 53.98 MM</span>
          <span>CORNER RADIUS: {tokens.radiusPx}PX</span>
        </div>
      </div>
    );
  },
});
