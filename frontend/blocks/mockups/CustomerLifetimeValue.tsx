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

    // Helpers de Escala Dinâmica (Zero Hardcode!)
    const spacingMul = tokens.spacingMultiplier || 1;
    const fontScale = tokens.fontScale || 1;
    const sp = (basePx: number) => Math.round(basePx * spacingMul);
    const fs = (basePx: number) => Math.round(basePx * fontScale);

    const brandColor = tokens.primaryColor;
    const secondaryColor = tokens.secondaryColor || tokens.supportColor;
    const vipTextColor = getReadableTextColor(brandColor);

    // Tipografia Viva 100% Reativa aos Tokens
    const headingStyle: React.CSSProperties = {
      fontFamily: tokens.headingFont,
      fontWeight: tokens.headingWeight || 600,
      letterSpacing: `${tokens.letterSpacingEm || -0.02}em`,
    };

    const bodyStyle: React.CSSProperties = {
      fontFamily: tokens.bodyFont,
      fontWeight: tokens.bodyWeight || 400,
    };

    // Raio de Borda dos Componentes (100% Reativo a tokens.radiusPx para cards internos e badges)
    const cardRadius = `${tokens.radiusPx}px`;
    const innerRadius = `${Math.max(0, tokens.radiusPx - 6)}px`;
    const avatarRadius = `${Math.max(4, Math.round(tokens.radiusPx * 0.7))}px`;

    // Superfícies de Vitrine Dinâmicas
    const showcaseBg = isDark ? '#141416' : '#E8E8E8';
    const cardBg = isDark ? '#1E1E22' : '#FFFFFF';
    const cardBorder = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.03)';
    const gridLineColor = isDark ? 'rgba(255,255,255,0.06)' : '#EEEEEE';

    return (
      <div
        className="w-full h-full flex flex-col items-center justify-center select-none transition-all duration-200 overflow-hidden relative rounded-[24px] p-6 sm:p-8"
        style={{
          backgroundColor: showcaseBg,
        }}
      >
        {/* Vitrine Central: Objeto de Design com Respiro Lateral Reativo */}
        <div
          className="w-full max-w-[340px] flex flex-col my-auto transition-all"
          style={{ gap: `${sp(14)}px` }}
        >
          {/* Card 1: Perfil VIP do Cliente */}
          {!isMinimal && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                onSelectSubElement?.('profile-card');
              }}
              className={`w-full border transition-all cursor-pointer flex items-center justify-between ${
                selectedSubElementId === 'profile-card'
                  ? 'ring-2 ring-primary ring-offset-2'
                  : ''
              }`}
              style={{
                backgroundColor: cardBg,
                borderColor: cardBorder,
                borderRadius: cardRadius,
                padding: `${sp(12)}px ${sp(16)}px`,
              }}
            >
              <div className="flex items-center" style={{ gap: `${sp(12)}px` }}>
                {/* Avatar da Cliente com raio e tamanho proporcionais */}
                <div
                  className="overflow-hidden shrink-0 flex items-center justify-center bg-zinc-200 dark:bg-zinc-700 transition-all"
                  style={{
                    width: `${fs(40)}px`,
                    height: `${fs(40)}px`,
                    borderRadius: avatarRadius,
                  }}
                >
                  {!imgFailed ? (
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80"
                      alt="Abigail Jefferson"
                      className="w-full h-full object-cover"
                      onError={() => setImgFailed(true)}
                    />
                  ) : (
                    <span
                      className="font-semibold text-zinc-600 dark:text-zinc-300"
                      style={{ fontSize: `${fs(12)}px` }}
                    >
                      AJ
                    </span>
                  )}
                </div>

                {/* Nome do Cliente com tipografia e escala de fonte reativas */}
                <span
                  className="font-bold text-zinc-900 dark:text-zinc-100 transition-all"
                  style={{ ...headingStyle, fontSize: `${fs(15)}px` }}
                >
                  Abigail Jefferson
                </span>
              </div>

              {/* Tag VIP reativa à cor primária e raio da marca */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectSubElement?.('vip-badge');
                }}
                className={`font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  selectedSubElementId === 'vip-badge' ? 'ring-2 ring-primary' : ''
                }`}
                style={{
                  backgroundColor: brandColor,
                  color: vipTextColor,
                  borderRadius: innerRadius,
                  padding: `${sp(4)}px ${sp(8)}px`,
                  fontSize: `${fs(10)}px`,
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
            className={`w-full border transition-all cursor-pointer flex flex-col ${
              selectedSubElementId === 'chart-card'
                ? 'ring-2 ring-primary ring-offset-2'
                : ''
            }`}
            style={{
              backgroundColor: cardBg,
              borderColor: cardBorder,
              borderRadius: cardRadius,
              padding: `${sp(24)}px`,
              gap: `${sp(20)}px`,
            }}
          >
            {/* Header Interno do Gráfico */}
            <div className="flex items-center justify-between">
              <span
                className="text-zinc-500 dark:text-zinc-400 font-medium tracking-tight"
                style={{ ...bodyStyle, fontSize: `${fs(11)}px` }}
              >
                Predicted Customer Lifetime Value (CLV)
              </span>

              <span
                className="font-bold uppercase tracking-wider transition-all"
                style={{
                  backgroundColor: isDark ? 'rgba(196, 181, 253, 0.15)' : '#F2EDFD',
                  color: isDark ? '#C4B5FD' : '#7846DF',
                  borderRadius: innerRadius,
                  padding: `${sp(3)}px ${sp(8)}px`,
                  fontSize: `${fs(10)}px`,
                }}
              >
                {tokens.brandName.toUpperCase()} AI
              </span>
            </div>

            {/* Canvas do Gráfico com Altura Escalada */}
            <div
              className="relative w-full flex flex-col justify-between pt-2"
              style={{ height: `${sp(160)}px` }}
            >
              {/* Linhas horizontais de grade (régua) */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                <div className="w-full h-[1px]" style={{ backgroundColor: gridLineColor }} />
                <div className="w-full h-[1px]" style={{ backgroundColor: gridLineColor }} />
                <div className="w-full h-[1px]" style={{ backgroundColor: gridLineColor }} />
                <div className="w-full h-[1px]" style={{ backgroundColor: gridLineColor }} />
              </div>

              {/* 4 Colunas do Gráfico com Gaps Proporcionais */}
              <div
                className="relative z-10 w-full h-full flex items-end justify-between px-1"
                style={{ gap: `${sp(12)}px` }}
              >
                {/* Coluna 1: Baseline Sand/Beige */}
                <div
                  className="flex-1 h-[42%] transition-all"
                  style={{
                    backgroundColor: isDark ? '#4A463F' : '#DCD6CD',
                    borderRadius: `${Math.min(innerRadius ? parseInt(innerRadius) : 0, 4)}px`,
                  }}
                />

                {/* Coluna 2: Lavanda com gradiente suave */}
                <div
                  className="flex-1 h-[68%] transition-all relative overflow-hidden"
                  style={{
                    backgroundColor: isDark ? '#3D2F4E' : '#ECD2F6',
                    borderRadius: `${Math.min(innerRadius ? parseInt(innerRadius) : 0, 4)}px`,
                  }}
                >
                  <div
                    className="absolute inset-0 opacity-40 transition-all"
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
                    borderRadius: `${Math.min(innerRadius ? parseInt(innerRadius) : 0, 4)}px`,
                  }}
                />

                {/* Coluna 4: Soft Sky Blue Benchmark */}
                <div
                  className="flex-1 h-[42%] transition-all"
                  style={{
                    backgroundColor: isDark ? '#2E4357' : '#A7D1ED',
                    borderRadius: `${Math.min(innerRadius ? parseInt(innerRadius) : 0, 4)}px`,
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
