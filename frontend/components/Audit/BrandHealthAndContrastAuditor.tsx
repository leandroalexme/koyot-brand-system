import React from 'react';
import { BrandTokens } from '../../types';
import {
  getLuminance,
  getContrastRatio,
  getReadableTextColor,
  getNeutralRamp10,
  hexToHsl,
  hslToHex,
} from '../../utils/styleUtils';
import { getUnifiedDesignMetrics } from '../../utils/overrideUtils';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Sliders,
  Layers,
  ArrowRight,
  Lock,
} from 'lucide-react';

interface BrandHealthAndContrastAuditorProps {
  tokens: BrandTokens;
  onChangeTokens: (next: BrandTokens) => void;
  onRecordTransaction?: (desc: string, nextTokens: BrandTokens) => void;
  isTokenLocked?: (tokenKey: keyof BrandTokens) => boolean;
}

export const BrandHealthAndContrastAuditor: React.FC<
  BrandHealthAndContrastAuditorProps
> = ({ tokens, onChangeTokens, onRecordTransaction, isTokenLocked }) => {
  const neutrals = getNeutralRamp10(tokens.neutralTone);
  const metrics = getUnifiedDesignMetrics(tokens);

  const fgPrimary = getReadableTextColor(tokens.primaryColor);
  const fgSecondary = getReadableTextColor(tokens.secondaryColor);
  const fgAccent = getReadableTextColor(tokens.accentColor);
  const fgSurfaceTint = getReadableTextColor(tokens.surfaceTint);

  // Audited pairs list
  const auditPairs = [
    {
      id: 'primary',
      label: 'Primary Button',
      role: 'Brand Primary Action',
      bg: tokens.primaryColor,
      fg: fgPrimary,
      targetType: 'primaryColor' as const,
    },
    {
      id: 'secondary',
      label: 'Secondary Action',
      role: 'Secondary UI Elements',
      bg: tokens.secondaryColor,
      fg: fgSecondary,
      targetType: 'secondaryColor' as const,
    },
    {
      id: 'accent',
      label: 'Accent Token',
      role: 'Highlights & Badges',
      bg: tokens.accentColor,
      fg: fgAccent,
      targetType: 'accentColor' as const,
    },
    {
      id: 'surface-tint',
      label: 'Surface Tint',
      role: 'Card Wash & Tinted Backgrounds',
      bg: tokens.surfaceTint,
      fg: fgSurfaceTint,
      targetType: 'surfaceTint' as const,
    },
    {
      id: 'neutrals',
      label: 'Neutral Ramp 1 vs 10',
      role: 'Page Background vs Foreground Text',
      bg: neutrals[0],
      fg: neutrals[9],
      targetType: null,
    },
  ];

  // Helper to adjust luminance to achieve minimum 4.5:1 AA contrast
  const handleAutoFixContrast = (
    colorKey: 'primaryColor' | 'secondaryColor' | 'accentColor' | 'surfaceTint',
    currentBg: string
  ) => {
    const { h, s, l } = hexToHsl(currentBg);
    // Determine whether to lighten or darken
    const currentLum = getLuminance(currentBg);
    let targetL = l;
    let bestHex = currentBg;
    let bestRatio = getContrastRatio(currentBg, getReadableTextColor(currentBg));

    // Try darker and lighter steps
    for (let delta = 5; delta <= 60; delta += 5) {
      const candidateDark = hslToHex(h, s, Math.max(8, l - delta));
      const ratioDark = getContrastRatio(
        candidateDark,
        getReadableTextColor(candidateDark)
      );
      if (ratioDark >= 4.5 && ratioDark > bestRatio) {
        bestHex = candidateDark;
        bestRatio = ratioDark;
        break;
      }

      const candidateLight = hslToHex(h, s, Math.min(94, l + delta));
      const ratioLight = getContrastRatio(
        candidateLight,
        getReadableTextColor(candidateLight)
      );
      if (ratioLight >= 4.5 && ratioLight > bestRatio) {
        bestHex = candidateLight;
        bestRatio = ratioLight;
        break;
      }
    }

    const nextTokens: BrandTokens = {
      ...tokens,
      [colorKey]: bestHex,
    };

    if (onRecordTransaction) {
      onRecordTransaction(`Ajuste Automático de Contraste WCAG em ${colorKey}`, nextTokens);
    }
    onChangeTokens(nextTokens);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Overview */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-semibold text-white">
            Auditoria WCAG 2.2 & Controles
          </h3>
        </div>
        <span className="text-[11px] font-mono text-zinc-400">
          KDS-06 Standard
        </span>
      </div>

      {/* 2. WCAG Contrast Audit Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span>Pares de Contraste (Texto vs Superfície)</span>
          <span className="text-[10px]">Alvo: WCAG AA (≥ 4.5:1)</span>
        </div>

        <div className="space-y-2">
          {auditPairs.map((pair) => {
            const ratio = getContrastRatio(pair.bg, pair.fg);
            const isAAA = ratio >= 7.0;
            const isAA = ratio >= 4.5;
            const isLargeAA = ratio >= 3.0;

            const badgeBg = isAAA
              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
              : isAA
              ? 'bg-teal-500/15 text-teal-400 border-teal-500/30'
              : isLargeAA
              ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
              : 'bg-rose-500/15 text-rose-400 border-rose-500/30';

            const badgeText = isAAA
              ? 'AAA'
              : isAA
              ? 'AA'
              : isLargeAA
              ? 'AA Large'
              : 'Fail';

            return (
              <div
                key={pair.id}
                className="bg-[#1C1C1E] border border-white/[0.06] rounded-2xl p-3 flex items-center justify-between gap-3"
              >
                {/* Visual Swatch Preview */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 shadow-inner border border-black/10"
                    style={{ backgroundColor: pair.bg, color: pair.fg }}
                  >
                    Aa
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-white truncate">
                        {pair.label}
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-400 truncate block">
                      {pair.role} ({pair.bg})
                    </span>
                  </div>
                </div>

                {/* Score & Auto-Fix */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="text-right">
                    <span className="text-xs font-mono font-semibold text-zinc-200">
                      {ratio.toFixed(2)}:1
                    </span>
                    <span
                      className={`block text-[9px] font-mono px-1.5 py-0.2 rounded border text-center ${badgeBg}`}
                    >
                      {badgeText}
                    </span>
                  </div>

                  {!isAA && pair.targetType && (
                    isTokenLocked?.(pair.targetType) ? (
                      <span
                        title="Cor institucional protegida por Brand Policy (KDS-07)"
                        className="px-2 py-1 rounded-lg bg-zinc-800 text-amber-300 border border-amber-500/20 text-[10px] flex items-center gap-1 cursor-not-allowed"
                      >
                        <Lock className="w-2.5 h-2.5 text-amber-400" />
                        <span>Locked</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          handleAutoFixContrast(pair.targetType!, pair.bg)
                        }
                        title="Ajustar luminância automaticamente para atingir AA (4.5:1)"
                        className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 transition text-[10px] flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Fix</span>
                      </button>
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Unified Controls Matrix (KDS-06) */}
      <div className="space-y-3 pt-2 border-t border-white/[0.06]">
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span className="flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-zinc-400" />
            <span>Matriz de Alturas de Controles</span>
          </span>
          <span className="text-[10px] text-emerald-400">Single Source</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="bg-[#1C1C1E] border border-white/[0.06] rounded-xl p-2.5 text-center">
            <span className="text-[10px] text-zinc-500 block">Small (sm)</span>
            <span className="text-sm font-mono font-bold text-white">
              {metrics.controlHeightSm}px
            </span>
            <span className="text-[9px] text-zinc-400 block mt-0.5">
              --control-sm
            </span>
          </div>

          <div className="bg-[#1C1C1E] border border-emerald-500/20 rounded-xl p-2.5 text-center relative">
            <span className="text-[10px] text-emerald-400 block">Default (md)</span>
            <span className="text-sm font-mono font-bold text-white">
              {metrics.controlHeightMd}px
            </span>
            <span className="text-[9px] text-zinc-400 block mt-0.5">
              --control-md
            </span>
          </div>

          <div className="bg-[#1C1C1E] border border-white/[0.06] rounded-xl p-2.5 text-center">
            <span className="text-[10px] text-zinc-500 block">Large (lg)</span>
            <span className="text-sm font-mono font-bold text-white">
              {metrics.controlHeightLg}px
            </span>
            <span className="text-[9px] text-zinc-400 block mt-0.5">
              --control-lg
            </span>
          </div>
        </div>

        {/* Alinhamento Horizontal em Linha (Side-by-side Form Row Test) */}
        <div className="bg-[#161618] border border-white/[0.06] rounded-2xl p-3 space-y-2">
          <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">
            Teste de Alinhamento em Linha (Default: {metrics.controlHeightMd}px)
          </span>

          <div className="flex items-center gap-2 relative">
            {/* Horizontal Dashed Guide Line */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-b border-dashed border-emerald-500/30 pointer-events-none" />

            <div
              className="flex-1 rounded-[var(--radius)] bg-white/5 border border-white/10 px-3 flex items-center text-xs text-zinc-400 truncate"
              style={{
                height: `${metrics.controlHeightMd}px`,
                borderRadius: `${tokens.radiusPx}px`,
              }}
            >
              Input.field
            </div>

            <div
              className="px-4 rounded-[var(--radius)] font-medium text-xs flex items-center justify-center shrink-0 shadow-sm"
              style={{
                height: `${metrics.controlHeightMd}px`,
                backgroundColor: tokens.primaryColor,
                color: fgPrimary,
                borderRadius: `${tokens.radiusPx}px`,
              }}
            >
              Button
            </div>
          </div>
          <span className="text-[10px] text-zinc-500 block text-right">
            Zero desvio vertical na linha de formulário
          </span>
        </div>
      </div>

      {/* 4. Export Coverage Status (KDS-03) */}
      <div className="space-y-2.5 pt-2 border-t border-white/[0.06]">
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 text-zinc-400">
            <Layers className="w-3.5 h-3.5 text-zinc-400" />
            <span>Cobertura de Exportação</span>
          </span>
          <span className="text-[10px] font-mono text-emerald-400">
            4 / 57 Canônicos
          </span>
        </div>

        <div className="bg-[#1C1C1E] rounded-xl p-3 space-y-2 text-xs">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-zinc-300">Fase 0 (Base UI Validados):</span>
            <span className="text-emerald-400 font-mono">Button · Input · Dialog · Slider</span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-zinc-400">Fase 1 (Próxima fila):</span>
            <span className="text-amber-400 font-mono">Select · Combobox · Tabs · Sheet</span>
          </div>
        </div>
      </div>
    </div>
  );
};
