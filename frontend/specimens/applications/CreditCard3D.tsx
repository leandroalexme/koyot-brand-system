import React from 'react';
import { defineSpecimen } from '../../sdk/specimen';
import { getFontClass, getReadableTextColor } from '../../utils/styleUtils';
import { Sparkles, ArrowRight } from 'lucide-react';

export default defineSpecimen({
  id: 'credit-card3d',
  title: 'CreditCard3D',
  category: 'applications',
  description: 'Bloco interativo de CreditCard3D integrado ao sistema de tokens.',
  defaultLayout: '2-col-50-50',
  variants: ['Default', 'Minimal'] as const,
  subElements: [
    { id: 'card', label: 'Card Container', kind: 'surface' },
    { id: 'headline', label: 'Título / Headline', kind: 'text' },
    { id: 'badge', label: 'Pílula de Categoria', kind: 'control' },
    { id: 'action', label: 'Botão de Ação', kind: 'control' },
  ],
  render: ({
    tokens,
    block,
    activeVariant,
    isInspectMode,
    selectedTarget,
    onSelectSubElement,
  }) => {
    const headingFont = getFontClass(tokens.headingFont);
    const bodyFont = getFontClass(tokens.bodyFont);

    const isThisBlockSelected = selectedTarget?.blockId === block.id;
    const selectedPart = isThisBlockSelected ? selectedTarget?.subElementId : undefined;

    // Sub-element style overrides (applied when edited in the Brand Studio Inspector)
    const cardOvr = block.subElements?.card;
    const headlineOvr = block.subElements?.headline;
    const badgeOvr = block.subElements?.badge;
    const actionOvr = block.subElements?.action;

    const isMinimal = activeVariant === 'Minimal';
    const bgCard = block.theme === 'brand' ? tokens.primaryColor : '#FFFFFF';
    const fgCard = getReadableTextColor(bgCard);

    return (
      <div
        onClick={(e) => {
          if (isInspectMode && onSelectSubElement) {
            e.stopPropagation();
            onSelectSubElement('card', 'Card Container');
          }
        }}
        className={`bg-white rounded-[24px] p-7 sm:p-8 h-full min-h-[300px] flex flex-col justify-between transition-all relative group/card ${
          isInspectMode ? 'cursor-pointer hover:ring-1 hover:ring-[#D946EF]/50' : ''
        } ${selectedPart === 'card' ? 'ring-2 ring-[#D946EF]' : ''}`}
        style={{
          borderRadius: `${tokens.radiusPx}px`,
          backgroundColor: bgCard,
          color: fgCard,
        }}
      >
        {/* Top Header: Badge & Status */}
        <div className="flex items-center justify-between">
          <span
            onClick={(e) => {
              if (isInspectMode && onSelectSubElement) {
                e.stopPropagation();
                onSelectSubElement('badge', 'Pílula de Categoria');
              }
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition ${
              selectedPart === 'badge' ? 'ring-2 ring-[#D946EF]' : ''
            }`}
            style={{
              backgroundColor: tokens.surfaceTint,
              color: '#09090B',
            }}
          >
            <Sparkles className="w-3 h-3 text-zinc-500" />
            <span>${tokens.brandName} · ${activeVariant}</span>
          </span>

          <span className="text-xs text-zinc-400 font-mono">
            ${tokens.stylePresetName}
          </span>
        </div>

        {/* Central Stage: Headline & Content */}
        <div className="my-auto py-6">
          <h3
            onClick={(e) => {
              if (isInspectMode && onSelectSubElement) {
                e.stopPropagation();
                onSelectSubElement('headline', 'Título / Headline');
              }
            }}
            className={`leading-[1.1] ${headingFont} transition ${
              selectedPart === 'headline' ? 'ring-2 ring-[#D946EF] rounded p-1 -m-1' : ''
            }`}
            style={{
              fontSize: `${Math.round((isMinimal ? 26 : 34) * tokens.fontScale)}px`,
              fontWeight: tokens.headingWeight,
              letterSpacing: `${tokens.letterSpacingEm}em`,
            }}
          >
            ${tokens.tagline}
          </h3>

          {!isMinimal && (
            <p
              className={`mt-3 text-sm opacity-75 max-w-md ${bodyFont}`}
              style={{ fontWeight: tokens.bodyWeight }}
            >
              ${tokens.brandCopy.manifestoBody}
            </p>
          )}
        </div>

        {/* Bottom Bar: Action Trigger */}
        <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
          <div className="text-xs text-zinc-400">
            Design Tokens Conformance ✓
          </div>

          <button
            onClick={(e) => {
              if (isInspectMode && onSelectSubElement) {
                e.stopPropagation();
                onSelectSubElement('action', 'Botão de Ação');
              }
            }}
            className={`px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-2 shadow-sm transition ${
              selectedPart === 'action' ? 'ring-2 ring-[#D946EF]' : ''
            }`}
            style={{
              backgroundColor: tokens.primaryActionStyle === 'neutral' ? '#09090B' : tokens.primaryColor,
              color: getReadableTextColor(tokens.primaryActionStyle === 'neutral' ? '#09090B' : tokens.primaryColor),
              borderRadius: `${Math.min(tokens.radiusPx, 14)}px`,
            }}
          >
            <span>Explorar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  },
});
