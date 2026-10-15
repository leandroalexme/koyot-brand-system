import React, { useState } from 'react';
import { BrandTokens, EditorialBlock, BrandLogoId } from '../../types';
import {
  getFontClass,
  getTrackingClass,
  getReadableTextColor,
} from '../../utils/styleUtils';
import { BrandLogoMark } from './BrandLogoMark';
import {
  Check,
  X,
  DollarSign,
  Briefcase,
  User,
  Coins,
  Banknote,
  Wallet,
  Landmark,
  PiggyBank,
  Bell,
  CreditCard,
  Wifi,
  ShieldCheck,
} from 'lucide-react';

interface SpecimenProps {
  tokens: BrandTokens;
  block: EditorialBlock;
}

interface BezierLogoBlueprint {
  paths: string[];
  handles: Array<{ x1: number; y1: number; x2: number; y2: number; mx: number; my: number }>;
  nodes: Array<{ x: number; y: number }>;
}

const BEZIER_BLUEPRINTS: Record<BrandLogoId, BezierLogoBlueprint> = {
  // 1. Poulp (Felt) — Symbol Loop + "Plp" organic geometry
  poulp: {
    paths: [
      // Organic Symbol Loop on left
      'M 55 295 L 55 155 C 55 95 100 60 155 60 C 210 60 248 95 248 148 C 248 202 210 236 155 236 L 105 236 C 105 185 130 165 155 165 C 178 165 192 148 192 132 C 192 115 178 102 155 102 C 125 102 102 124 102 158 L 102 295 Z',
      // Letter "P"
      'M 305 68 L 425 68 C 488 68 528 105 528 162 C 528 218 488 255 425 255 L 355 255 L 355 325 L 305 325 Z M 355 115 L 355 208 L 418 208 C 456 208 478 190 478 162 C 478 134 456 115 418 115 Z',
      // Letter "l"
      'M 575 68 L 625 68 L 625 325 L 575 325 Z',
      // Letter "a"
      'M 682 198 C 686 160 720 140 772 140 C 824 140 856 164 856 214 L 856 325 L 810 325 L 810 300 C 794 319 770 330 738 330 C 694 330 664 304 664 268 C 664 228 694 208 750 204 L 808 200 L 808 192 C 808 176 792 165 768 165 C 742 165 726 175 720 195 Z',
    ],
    handles: [
      { x1: 95, y1: 60, x2: 215, y2: 60, mx: 155, my: 60 },
      { x1: 248, y1: 100, x2: 248, y2: 196, mx: 248, my: 148 },
      { x1: 380, y1: 68, x2: 470, y2: 68, mx: 425, my: 68 },
      { x1: 720, y1: 140, x2: 822, y2: 140, mx: 771, my: 140 },
      { x1: 664, y1: 232, x2: 664, y2: 304, mx: 664, my: 268 },
    ],
    nodes: [
      { x: 55, y: 295 },
      { x: 102, y: 295 },
      { x: 305, y: 68 },
      { x: 355, y: 115 },
      { x: 355, y: 208 },
      { x: 305, y: 325 },
      { x: 355, y: 325 },
      { x: 575, y: 68 },
      { x: 625, y: 68 },
      { x: 575, y: 325 },
      { x: 625, y: 325 },
      { x: 810, y: 325 },
      { x: 856, y: 325 },
    ],
  },

  // 2. Koyot Studio (Swiss Brutalist) — Monolith K Mark + "KOY" angular construction
  koyot: {
    paths: [
      // Brutalist Monolith K Symbol
      'M 55 68 L 112 68 L 112 325 L 55 325 Z',
      'M 124 192 L 228 68 L 282 68 L 178 192 L 286 325 L 230 325 L 124 192 Z',
      // Geometric "O"
      'M 332 68 L 532 68 L 532 325 L 332 325 Z M 386 118 L 386 275 L 478 275 L 478 118 Z',
      // Geometric "Y"
      'M 578 68 L 636 68 L 698 172 L 760 68 L 818 68 L 726 218 L 726 325 L 670 325 L 670 218 Z',
    ],
    handles: [
      { x1: 150, y1: 68, x2: 260, y2: 145, mx: 205, my: 106 },
      { x1: 380, y1: 68, x2: 484, y2: 68, mx: 432, my: 68 },
      { x1: 640, y1: 115, x2: 756, y2: 115, mx: 698, my: 115 },
    ],
    nodes: [
      { x: 55, y: 68 },
      { x: 112, y: 68 },
      { x: 55, y: 325 },
      { x: 112, y: 325 },
      { x: 228, y: 68 },
      { x: 282, y: 68 },
      { x: 124, y: 192 },
      { x: 178, y: 192 },
      { x: 286, y: 325 },
      { x: 230, y: 325 },
      { x: 332, y: 68 },
      { x: 532, y: 68 },
      { x: 332, y: 325 },
      { x: 532, y: 325 },
      { x: 578, y: 68 },
      { x: 818, y: 68 },
      { x: 698, y: 172 },
      { x: 670, y: 325 },
      { x: 726, y: 325 },
    ],
  },

  // 3. Maison Vesper (Atelier Editorial) — Serif Crest V + High-contrast "Vsp"
  vesper: {
    paths: [
      // Editorial Serif V with top serif terminals
      'M 48 68 L 138 68 L 138 88 L 112 88 L 188 268 L 262 88 L 236 88 L 236 68 L 312 68 L 312 88 L 288 88 L 192 325 L 172 325 L 74 88 L 48 88 Z',
      // Crest Star Circle inside V
      'M 182 104 C 198 104 210 116 210 132 C 210 148 198 160 182 160 C 166 160 154 148 154 132 C 154 116 166 104 182 104 Z',
      // Editorial "e"
      'M 365 232 C 365 172 408 136 468 136 C 528 136 565 172 565 224 L 408 224 C 410 268 438 294 478 294 C 512 294 536 278 548 256 L 566 268 C 548 304 516 326 472 326 C 408 326 365 286 365 232 Z',
      // Editorial "s"
      'M 622 272 L 646 258 C 658 284 684 298 718 298 C 752 298 774 282 774 260 C 774 212 630 232 630 172 C 630 142 662 136 708 136 C 752 136 784 152 796 178 L 772 192 C 760 170 738 158 708 158 C 678 158 660 168 660 184 C 660 222 806 202 806 260 C 806 298 770 326 716 326 C 668 326 636 304 622 272 Z',
    ],
    handles: [
      { x1: 138, y1: 104, x2: 226, y2: 104, mx: 182, my: 104 },
      { x1: 412, y1: 136, x2: 524, y2: 136, mx: 468, my: 136 },
      { x1: 365, y1: 180, x2: 365, y2: 284, mx: 365, my: 232 },
      { x1: 656, y1: 136, x2: 760, y2: 136, mx: 708, my: 136 },
      { x1: 660, y1: 326, x2: 772, y2: 326, mx: 716, my: 326 },
    ],
    nodes: [
      { x: 48, y: 68 },
      { x: 138, y: 68 },
      { x: 236, y: 68 },
      { x: 312, y: 68 },
      { x: 188, y: 268 },
      { x: 172, y: 325 },
      { x: 192, y: 325 },
      { x: 408, y: 224 },
      { x: 565, y: 224 },
      { x: 622, y: 272 },
      { x: 806, y: 260 },
    ],
  },

  // 4. Vortex Pay (Neo Kinetic) — Dynamic Rotor Emblem + Kinetic "VRX"
  vortex: {
    paths: [
      // Kinetic Rotor Emblem on left
      'M 165 65 C 238 65 295 122 295 195 C 245 148 190 148 165 195 C 140 148 92 122 165 65 Z',
      'M 295 195 C 295 268 238 325 165 325 C 212 275 212 220 165 195 C 212 170 238 122 295 195 Z',
      'M 165 325 C 92 325 35 268 35 195 C 85 242 140 242 165 195 C 190 242 238 268 165 325 Z',
      'M 35 195 C 35 122 92 65 165 65 C 118 115 118 170 165 195 C 118 220 92 268 35 195 Z',
      // Kinetic "V"
      'M 345 68 L 402 68 L 468 248 L 534 68 L 590 68 L 494 325 L 442 325 Z',
      // Kinetic "X"
      'M 618 68 L 678 68 L 732 156 L 786 68 L 846 68 L 764 194 L 852 325 L 792 325 L 732 232 L 672 325 L 612 325 L 700 194 Z',
    ],
    handles: [
      { x1: 95, y1: 65, x2: 235, y2: 65, mx: 165, my: 65 },
      { x1: 295, y1: 125, x2: 295, y2: 265, mx: 295, my: 195 },
      { x1: 95, y1: 325, x2: 235, y2: 325, mx: 165, my: 325 },
      { x1: 35, y1: 125, x2: 35, y2: 265, mx: 35, my: 195 },
    ],
    nodes: [
      { x: 165, y: 195 },
      { x: 345, y: 68 },
      { x: 402, y: 68 },
      { x: 468, y: 248 },
      { x: 590, y: 68 },
      { x: 442, y: 325 },
      { x: 494, y: 325 },
      { x: 618, y: 68 },
      { x: 846, y: 68 },
      { x: 732, y: 156 },
      { x: 732, y: 232 },
      { x: 612, y: 325 },
      { x: 852, y: 325 },
    ],
  },
};

export const BezierConstructionSpecimen: React.FC<SpecimenProps> = ({ tokens }) => {
  const [showHandles, setShowHandles] = useState(true);
  const blueprint = BEZIER_BLUEPRINTS[tokens.logoId] || BEZIER_BLUEPRINTS.poulp;

  return (
    <div className="relative overflow-hidden bg-white rounded-[24px] p-6 sm:p-8 md:p-10 w-full h-full min-h-0 flex flex-col justify-between transition-colors duration-300">
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div className="flex items-center gap-2.5">
          <BrandLogoMark logoId={tokens.logoId} color={tokens.primaryColor} size={18} />
          <span className="text-xs font-medium text-zinc-400">
            {tokens.brandName} · Bezier Master Geometry
          </span>
        </div>
        <button
          onClick={() => setShowHandles(!showHandles)}
          className="text-xs text-zinc-400 hover:text-zinc-900 transition"
        >
          {showHandles ? 'Hide Nodes' : 'Show Nodes'}
        </button>
      </div>

      {/* Vector stage inside the fixed Koyot card */}
      <div className="relative w-full flex-1 min-h-0 flex items-center justify-center select-none my-auto">
        <svg
          viewBox="0 0 900 390"
          className="w-full h-full max-w-[820px] overflow-visible"
        >
          {blueprint.paths.map((d, i) => (
            <path
              key={i}
              d={d}
              fill="none"
              stroke="#18181B"
              strokeWidth={Math.max(1.35, tokens.borderWidth * 1.5)}
            />
          ))}

          {showHandles && (
            <g>
              {blueprint.handles.map((h, i) => (
                <g key={i}>
                  <line
                    x1={h.x1}
                    y1={h.y1}
                    x2={h.x2}
                    y2={h.y2}
                    stroke={tokens.primaryColor}
                    strokeWidth="1.1"
                  />
                  <circle
                    cx={h.x1}
                    cy={h.y1}
                    r="4"
                    fill="#FFF"
                    stroke={tokens.primaryColor}
                    strokeWidth="1.3"
                  />
                  <circle
                    cx={h.x2}
                    cy={h.y2}
                    r="4"
                    fill="#FFF"
                    stroke={tokens.primaryColor}
                    strokeWidth="1.3"
                  />
                  <rect
                    x={h.mx - 4}
                    y={h.my - 4}
                    width="8"
                    height="8"
                    fill="#FFF"
                    stroke={tokens.primaryColor}
                    strokeWidth="1.3"
                  />
                </g>
              ))}

              {blueprint.nodes.map((pt, idx) => (
                <polygon
                  key={idx}
                  points={`${pt.x},${pt.y - 7} ${pt.x + 7},${pt.y} ${pt.x},${pt.y + 7} ${pt.x - 7},${pt.y}`}
                  fill="#09090B"
                />
              ))}
            </g>
          )}
        </svg>
      </div>
    </div>
  );
};

export const LogoAnatomySpecimen: React.FC<SpecimenProps> = ({ tokens }) => {
  const headingFont = getFontClass(tokens.headingFont);
  const tracking = getTrackingClass(tokens);

  return (
    <div className="bg-white rounded-[24px] p-6 sm:p-8 md:p-10 flex flex-col justify-between w-full h-full min-h-0 overflow-hidden">
      <div className="flex items-center justify-between shrink-0">
        <span className="text-xs font-medium text-zinc-400">
          {tokens.brandName} · Clear Space
        </span>
        <span className="text-xs text-zinc-400">2x Ratio</span>
      </div>

      {/* Inner stage: proprietary brand symbol + wordmark respond to tokens */}
      <div className="my-auto py-8 px-6 rounded-2xl bg-[#FAFAFA] flex items-center justify-center relative flex-1 min-h-0">
        <div
          className="px-10 py-6 border border-dashed flex items-center gap-4 bg-white transition-all"
          style={{
            borderColor: tokens.primaryColor,
            borderRadius: `${tokens.radiusPx}px`,
          }}
        >
          <div
            className="w-12 h-12 flex items-center justify-center transition-all"
            style={{
              backgroundColor: tokens.primaryColor,
              color: getReadableTextColor(tokens.primaryColor),
              borderRadius: `${Math.min(tokens.radiusPx, 24)}px`,
            }}
          >
            <BrandLogoMark
              logoId={tokens.logoId}
              color={getReadableTextColor(tokens.primaryColor)}
              size={26}
            />
          </div>
          <span
            className={`text-zinc-950 ${headingFont} ${tracking}`}
            style={{
              fontSize: `${Math.round(36 * tokens.fontScale)}px`,
              fontWeight: tokens.headingWeight,
              letterSpacing: `${tokens.letterSpacingEm}em`,
            }}
          >
            {tokens.brandName}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 pt-4 border-t border-zinc-100 text-xs">
        <div>
          <div className="text-zinc-400">Digital</div>
          <div className="font-medium text-zinc-900 mt-0.5">84px min</div>
        </div>
        <div>
          <div className="text-zinc-400">Symbol</div>
          <div className="font-medium text-zinc-900 mt-0.5">16px min</div>
        </div>
        <div>
          <div className="text-zinc-400">Print</div>
          <div className="font-medium text-zinc-900 mt-0.5">22mm min</div>
        </div>
      </div>
    </div>
  );
};

export const IconographyGridSpecimen: React.FC<SpecimenProps> = ({ tokens, block }) => {
  const isDark = block.theme === 'dark';

  const icons = [
    DollarSign,
    Briefcase,
    User,
    Coins,
    Banknote,
    Wallet,
    Landmark,
    PiggyBank,
    Bell,
    CreditCard,
    ShieldCheck,
    Wifi,
  ];

  return (
    <div
      className={`rounded-[24px] p-6 sm:p-8 md:p-10 w-full h-full min-h-0 flex flex-col justify-center transition-colors overflow-hidden ${
        isDark ? 'bg-[#1C1C1E] text-white' : 'bg-white text-zinc-900'
      }`}
    >
      <div className="grid grid-cols-3 gap-y-8 gap-x-8 py-2 place-items-center my-auto flex-1 min-h-0">
        {icons.map((Icon, idx) => (
          <div
            key={idx}
            className="w-12 h-12 flex items-center justify-center transition-all duration-300 hover:scale-110"
            style={{
              borderRadius: `${Math.min(tokens.radiusPx, 24)}px`,
              backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#FAFAFA',
              borderWidth: tokens.borderWidth > 1 ? `${tokens.borderWidth}px` : '0px',
              borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#E4E4E7',
            }}
          >
            <Icon
              className="w-5 h-5"
              strokeWidth={tokens.borderWidth === 0 ? 1.25 : tokens.borderWidth === 2 ? 2 : 1.5}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export const DosAndDontsSpecimen: React.FC<SpecimenProps> = ({ tokens }) => {
  const headingFont = getFontClass(tokens.headingFont);
  const fgPrimary = getReadableTextColor(tokens.primaryColor);

  const rules = [
    {
      isDo: true,
      title: tokens.brandCopy.doRuleTitle,
      preview: (
        <div className="flex-1 min-h-[180px] rounded-2xl bg-[#FAFAFA] flex items-center justify-center p-6">
          <div
            className="px-7 py-4 flex items-center gap-3 shadow-sm transition-all"
            style={{
              backgroundColor: tokens.primaryColor,
              color: fgPrimary,
              borderRadius: `${tokens.radiusPx}px`,
            }}
          >
            <BrandLogoMark logoId={tokens.logoId} color={fgPrimary} size={24} />
            <span
              className={`text-2xl ${headingFont}`}
              style={{
                fontWeight: tokens.headingWeight,
                letterSpacing: `${tokens.letterSpacingEm}em`,
              }}
            >
              {tokens.brandName}
            </span>
          </div>
        </div>
      ),
    },
    {
      isDo: false,
      title: tokens.brandCopy.dontRuleTitle,
      preview: (
        <div className="flex-1 min-h-[180px] rounded-2xl bg-[#FAFAFA] flex items-center justify-center p-6">
          <div className="flex items-center gap-3 scale-x-150 -skew-x-12 opacity-40">
            <BrandLogoMark logoId={tokens.logoId} color="#71717A" size={24} />
            <span className={`text-3xl font-bold text-zinc-500 ${headingFont}`}>
              {tokens.brandName}
            </span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-[24px] p-6 sm:p-8 md:p-10 w-full h-full min-h-0 flex flex-col justify-between overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1 min-h-0 my-auto items-stretch">
        {rules.map((rule, idx) => (
          <div key={idx} className="flex flex-col justify-between h-full space-y-4">
            {rule.preview}
            <div className="flex items-center gap-2.5 text-xs shrink-0">
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center ${
                  rule.isDo
                    ? 'bg-emerald-500/10 text-emerald-600'
                    : 'bg-rose-500/10 text-rose-600'
                }`}
              >
                {rule.isDo ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
              </span>
              <span className="font-medium text-zinc-900">{rule.title}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
