import React from 'react';
import { defineBlock } from '../../sdk/block';
import { getReadableTextColor } from '../../utils/styleUtils';
import { CreditCard, Wifi, ShieldCheck } from 'lucide-react';

export default defineBlock({
  id: 'credit-card-mockup',
  title: 'Credit Card 3D Mockup',
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
    isDark = true,
  }) => {
    const isMinimal = activeVariant === 'Minimal';
    const isDarkMode = activeVariant === 'Dark' || isDark;

    const textColor = getReadableTextColor(tokens.primaryColor);

    return (
      <div className="w-full h-full flex flex-col justify-between p-7 rounded-[24px] bg-card border border-border/70 overflow-hidden select-none relative group transition-all">
        {/* Header / Metadados */}
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono tracking-widest uppercase text-muted-foreground">
              Mockup de Aplicação
            </span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <span className="text-xs font-mono text-muted-foreground/80 px-2 py-0.5 rounded-md bg-muted/60 border border-border/40">
            {activeVariant}
          </span>
        </div>

        {/* Cartão 3D Central */}
        <div className="my-auto py-4 flex items-center justify-center perspective-[1000px]">
          <div
            onClick={(e) => {
              e.stopPropagation();
              onSelectSubElement?.('card-surface');
            }}
            className={`w-full max-w-[340px] aspect-[1.586/1] rounded-[20px] p-6 shadow-2xl relative transition-all duration-300 hover:rotate-y-6 hover:-translate-y-1 cursor-pointer flex flex-col justify-between overflow-hidden ${
              selectedSubElementId === 'card-surface'
                ? 'ring-2 ring-primary ring-offset-4 ring-offset-background'
                : ''
            }`}
            style={{
              borderRadius: `${Math.max(16, tokens.radiusPx + 4)}px`,
              background: isDarkMode
                ? `linear-gradient(135deg, ${tokens.primaryColor}22 0%, #09090b 70%)`
                : `linear-gradient(135deg, ${tokens.primaryColor} 0%, #1e1b4b 100%)`,
              border: `1px solid ${tokens.primaryColor}40`,
            }}
          >
            {/* Efeito de brilho de luz no cartão */}
            <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />

            {/* Topo do cartão */}
            <div className="flex items-center justify-between z-10">
              <span
                className="font-bold tracking-tight text-lg"
                style={{ color: isDarkMode ? '#ffffff' : textColor }}
              >
                {tokens.brandName}
              </span>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectSubElement?.('brand-chip');
                }}
                className={`p-1.5 rounded-lg bg-amber-400/20 border border-amber-400/40 text-amber-300 transition-all ${
                  selectedSubElementId === 'brand-chip'
                    ? 'ring-2 ring-amber-400'
                    : ''
                }`}
                title="Chip & Contactless"
              >
                <Wifi className="w-4 h-4 rotate-90" />
              </div>
            </div>

            {/* Centro do cartão - Chip e Ícone */}
            {!isMinimal && (
              <div className="flex items-center gap-3 z-10 my-1">
                <div className="w-10 h-7 rounded-md bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 border border-amber-300/50 shadow-sm" />
                <ShieldCheck className="w-4 h-4 text-white/40" />
              </div>
            )}

            {/* Rodapé do cartão - Número e Titular */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                onSelectSubElement?.('cardholder-info');
              }}
              className={`z-10 transition-all rounded-lg p-1.5 -mx-1.5 ${
                selectedSubElementId === 'cardholder-info'
                  ? 'bg-primary/20 ring-1 ring-primary'
                  : ''
              }`}
            >
              <div className="font-mono text-xs tracking-[0.2em] text-white/70">
                •••• •••• •••• 8842
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[11px] font-mono tracking-wider text-white/90 uppercase">
                  LIVING BRAND MEMBER
                </span>
                <span className="text-[10px] font-mono text-white/60">
                  EXP 09/29
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Rodapé do Bloco */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border/40 z-10">
          <div className="flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5" />
            <span>Preset: {tokens.presetId}</span>
          </div>
          <span className="font-mono text-[11px]">Raio: {tokens.radiusPx}px</span>
        </div>
      </div>
    );
  },
});
