import React from 'react';
import { defineBlock } from '../../sdk/block';
import { getFontClass, getReadableTextColor } from '../../utils/styleUtils';
import { Sparkles, ArrowRight } from 'lucide-react';

export default defineBlock({
  id: 'billboard-mockup',
  title: 'BillboardMockup',
  category: 'mockups' as any,
  description: 'Bloco de apresentação de marca para BillboardMockup, reativo aos tokens de design.',
  defaultLayout: '2-col-50-50' as any,
  variants: ['Default', 'Minimal'] as const,
  subElements: [
    { id: 'card', label: 'Card Container', category: 'Surfaces' },
    { id: 'headline', label: 'Título / Headline', category: 'Typography' },
    { id: 'badge', label: 'Pílula de Destaque', category: 'Badges' },
    { id: 'action', label: 'Botão de Ação', category: 'Actions' },
  ],
  render: ({
    tokens,
    activeVariant = 'Default',
    selectedSubElementId,
    onSelectSubElement,
    isDark = true,
  }) => {
    const isMinimal = activeVariant === 'Minimal';
    const fontClass = getFontClass(tokens.fontFamily);
    const readableText = getReadableTextColor(tokens.primaryColor);

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
            <span
              onClick={(e) => {
                e.stopPropagation();
                onSelectSubElement?.('badge');
              }}
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide uppercase transition-all cursor-pointer ${
                selectedSubElementId === 'badge'
                  ? 'ring-2 ring-primary ring-offset-2'
                  : ''
              }`}
              style={{
                backgroundColor: tokens.primaryColor,
                color: readableText,
              }}
            >
              BillboardMockup
            </span>
          </div>

          <span className="text-xs font-mono text-muted-foreground/80 px-2 py-0.5 rounded-md bg-muted/60 border border-border/40">
            {activeVariant}
          </span>
        </div>

        {/* Corpo do Bloco */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            onSelectSubElement?.('card');
          }}
          className={`my-auto p-6 rounded-[18px] bg-muted/30 border border-border/40 transition-all cursor-pointer relative overflow-hidden ${
            selectedSubElementId === 'card'
              ? 'ring-2 ring-primary ring-offset-2 ring-offset-background'
              : ''
          }`}
        >
          <h3
            onClick={(e) => {
              e.stopPropagation();
              onSelectSubElement?.('headline');
            }}
            className={`text-xl font-bold tracking-tight text-foreground transition-all ${fontClass} ${
              selectedSubElementId === 'headline'
                ? 'underline decoration-primary decoration-2 underline-offset-4'
                : ''
            }`}
          >
            {isMinimal ? 'BillboardMockup' : tokens.brandName}
          </h3>

          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
            Bloco de apresentação de marca para BillboardMockup, reativo aos tokens de design.
          </p>

          {!isMinimal && (
            <div className="mt-5 flex items-center gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectSubElement?.('action');
                }}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm ${
                  selectedSubElementId === 'action'
                    ? 'ring-2 ring-primary ring-offset-2 ring-offset-background'
                    : ''
                }`}
                style={{
                  backgroundColor: tokens.primaryColor,
                  color: readableText,
                  borderRadius: `${tokens.radiusPx}px`,
                }}
              >
                <span>Explorar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Rodapé do Bloco */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border/40 z-10">
          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Preset: {tokens.presetId}</span>
          </div>
          <span className="font-mono text-[11px]">Raio: {tokens.radiusPx}px</span>
        </div>
      </div>
    );
  },
});
