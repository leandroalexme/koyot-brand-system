import React, { useState } from 'react';
import { defineBlock } from '../../sdk/block';
import { getReadableTextColor } from '../../utils/styleUtils';

export default defineBlock({
  id: 'customer-lifetime-value',
  title: 'Customer Lifetime Value (CLV)',
  category: 'mockups',
  description:
    'Mockup de inteligência preditiva de cliente apresentado em vitrine com respiro lateral e 4 colunas analíticas.',
  defaultLayout: '2-col-50-50',
  variants: ['Default', 'Minimal'] as const,
  subElements: [
    { id: 'profile-card', label: 'Card do Perfil VIP', category: 'Surfaces' },
    { id: 'chart-card', label: 'Card do Gráfico Preditivo', category: 'Surfaces' },
    { id: 'vip-badge', label: 'Badge VIP', category: 'Badges' },
    { id: 'predicted-bar', label: 'Barra Prevista (CLV)', category: 'Data Visualization' },
  ],
  render: ({
    tokens,
    activeVariant = 'Default',
    selectedSubElementId,
    onSelectSubElement,
    isDark = false,
  }) => {
    const [imgFailed, setImgFailed] = useState(false);
    const isMinimal = activeVariant === 'Minimal';

    const brandColor = tokens.primaryColor;
    const vipTextColor = getReadableTextColor(brandColor);

    // Tipografia da marca
    const headingStyle: React.CSSProperties = {
      fontFamily: tokens.headingFont,
      fontWeight: tokens.headingWeight || 600,
      letterSpacing: `${tokens.letterSpacingEm || -0.02}em`,
    };

    const bodyStyle: React.CSSProperties = {
      fontFamily: tokens.bodyFont,
      fontWeight: tokens.bodyWeight || 400,
    };

    // Raio reativo
    const outerRadius = `${Math.max(16, tokens.radiusPx + 4)}px`;
    const cardRadius = `${Math.max(14, tokens.radiusPx)}px`;
    const innerRadius = `${Math.max(4, tokens.radiusPx - 8)}px`;

    // Superfície de Vitrine Neutra (como em um showroom/exposição de marca)
    const showcaseBg = isDark ? '#18181b' : '#E8E8E8';
    const cardBg = isDark ? '#242427' : '#FFFFFF';
    const cardBorder = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.03)';
    const gridLineColor = isDark ? 'rgba(255,255,255,0.06)' : '#F0F0F0';

    return (
      <div
        className="w-full h-full flex flex-col items-center justify-center p-6 sm:p-10 select-none transition-colors duration-200 overflow-hidden relative"
        style={{
          backgroundColor: showcaseBg,
          borderRadius: `${Math.max(22, tokens.radiusPx + 6)}px`,
        }}
      >
        {/* Vitrine Central: Objeto de Design com Respiro Lateral Amplo */}
        <div className="w-full max-w-[340px] flex flex-col gap-3.5 my-auto">
          {/* Card 1: Perfil VIP do Cliente */}
          {!isMinimal && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                onSelectSubElement?.('profile-card');
              }}
              className={`w-full p-3 px-3.5 border transition-all cursor-pointer flex items-center justify-between ${
                selectedSubElementId === 'profile-card'
                  ? 'ring-2 ring-primary ring-offset-2'
                  : ''
              }`}
              style={{
                backgroundColor: cardBg,
                borderColor: cardBorder,
                borderRadius: cardRadius,
              }}
            >
              <div className="flex items-center gap-3">
                {/* Avatar da Cliente */}
                <div
                  className="w-10 h-10 overflow-hidden shrink-0 flex items-center justify-center bg-zinc-200 dark:bg-zinc-700"
                  style={{ borderRadius: `${Math.max(8, tokens.radiusPx - 4)}px` }}
                >
                  {!imgFailed ? (
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80"
                      alt="Abigail Jefferson"
                      className="w-full h-full object-cover"
                      onError={() => setImgFailed(true)}
                    />
                  ) : (
                    <span className="font-semibold text-xs text-zinc-600 dark:text-zinc-300">
                      AJ
                    </span>
                  )}
                </div>

                {/* Nome do Cliente */}
                <span
                  className="text-base font-bold text-zinc-900 dark:text-zinc-100"
                  style={headingStyle}
                >
                  Abigail Jefferson
                </span>
              </div>

              {/* Tag VIP reativa à cor primária da marca */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectSubElement?.('vip-badge');
                }}
                className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  selectedSubElementId === 'vip-badge' ? 'ring-2 ring-primary' : ''
                }`}
                style={{
                  backgroundColor: brandColor,
                  color: vipTextColor,
                  borderRadius: innerRadius,
                }}
              >
                VIP
              </div>
            </div>
          )}

          {/* Card 2: Gráfico Analítico de CLV */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              onSelectSubElement?.('chart-card');
            }}
            className={`w-full p-6 border transition-all cursor-pointer flex flex-col gap-6 ${
              selectedSubElementId === 'chart-card'
                ? 'ring-2 ring-primary ring-offset-2'
                : ''
            }`}
            style={{
              backgroundColor: cardBg,
              borderColor: cardBorder,
              borderRadius: outerRadius,
            }}
          >
            {/* Header Interno do Gráfico */}
            <div className="flex items-center justify-between text-xs">
              <span
                className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium tracking-tight"
                style={bodyStyle}
              >
                Predicted Customer Lifetime Value (CLV)
              </span>

              <span
                className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5"
                style={{
                  backgroundColor: isDark ? 'rgba(196, 181, 253, 0.15)' : '#F2EDFD',
                  color: isDark ? '#C4B5FD' : '#7846DF',
                  borderRadius: innerRadius,
                }}
              >
                {tokens.brandName.toUpperCase()} AI
              </span>
            </div>

            {/* Canvas do Gráfico com Linhas de Fundo */}
            <div className="relative h-44 w-full flex flex-col justify-between pt-2">
              {/* Linhas horizontais de grade (régua) */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                <div className="w-full h-[1px]" style={{ backgroundColor: gridLineColor }} />
                <div className="w-full h-[1px]" style={{ backgroundColor: gridLineColor }} />
                <div className="w-full h-[1px]" style={{ backgroundColor: gridLineColor }} />
                <div className="w-full h-[1px]" style={{ backgroundColor: gridLineColor }} />
              </div>

              {/* 4 Colunas do Gráfico da Imagem */}
              <div className="relative z-10 w-full h-full flex items-end justify-between gap-3 px-1">
                {/* Coluna 1: Baseline Sand/Beige */}
                <div
                  className="flex-1 h-[42%] transition-all"
                  style={{
                    backgroundColor: isDark ? '#4A463F' : '#DCD6CD',
                  }}
                />

                {/* Coluna 2: Lavanda com gradiente suave */}
                <div
                  className="flex-1 h-[68%] transition-all relative overflow-hidden"
                  style={{
                    backgroundColor: isDark ? '#3D2F4E' : '#ECD2F6',
                  }}
                >
                  {/* Gradiente sutil coral/marca no topo como na referência */}
                  <div
                    className="absolute inset-0 opacity-40"
                    style={{
                      background: `linear-gradient(180deg, ${brandColor} 0%, transparent 70%)`,
                    }}
                  />
                </div>

                {/* Coluna 3: Barra Destaque Previsto (Cor Primária da Marca) */}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectSubElement?.('predicted-bar');
                  }}
                  className={`flex-1 h-[95%] transition-all cursor-pointer ${
                    selectedSubElementId === 'predicted-bar' ? 'scale-[1.02]' : ''
                  }`}
                  style={{
                    backgroundColor: brandColor,
                  }}
                />

                {/* Coluna 4: Soft Sky Blue Benchmark */}
                <div
                  className="flex-1 h-[42%] transition-all"
                  style={{
                    backgroundColor: isDark ? '#2E4357' : '#A7D1ED',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
});
