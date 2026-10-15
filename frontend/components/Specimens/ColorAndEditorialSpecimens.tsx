import React, { useState } from 'react';
import { BrandTokens, EditorialBlock } from '../../types';
import {
  getFontClass,
  getReadableTextColor,
  getNeutralRamp,
} from '../../utils/styleUtils';
import { BrandLogoMark } from './BrandLogoMark';
import {
  Check,
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  Briefcase,
  ChevronRight,
} from 'lucide-react';

interface SpecimenProps {
  tokens: BrandTokens;
  block: EditorialBlock;
}

export const ColorProportionSpecimen: React.FC<SpecimenProps> = ({ tokens }) => {
  const neutralRamp = getNeutralRamp(tokens.neutralTone);

  return (
    <div
      className="bg-white rounded-[24px] flex flex-col justify-between h-full"
      style={{ padding: `${Math.round(28 * tokens.spacingMultiplier)}px` }}
    >
      {/* 4-Part Proportional Palette Bar */}
      <div
        className="w-full h-44 md:h-52 overflow-hidden flex transition-all duration-150"
        style={{ borderRadius: `${tokens.radiusPx}px` }}
      >
        <div
          className="h-full transition-colors duration-200"
          style={{ width: '58%', backgroundColor: tokens.primaryColor }}
          title={`Primary: ${tokens.primaryColor}`}
        />
        <div
          className="h-full transition-colors duration-200"
          style={{ width: '14%', backgroundColor: tokens.supportColor }}
          title={`Support: ${tokens.supportColor}`}
        />
        <div
          className="h-full transition-colors duration-200"
          style={{ width: '14%', backgroundColor: tokens.secondaryColor }}
          title={`Secondary: ${tokens.secondaryColor}`}
        />
        <div
          className="h-full transition-colors duration-200"
          style={{ width: '14%', backgroundColor: tokens.accentColor }}
          title={`Accent: ${tokens.accentColor}`}
        />
      </div>

      {/* Bottom Neutral Ramp */}
      <div
        className="mt-4 grid grid-cols-8 h-8 overflow-hidden transition-all duration-150"
        style={{ borderRadius: `${Math.min(tokens.radiusPx, 12)}px` }}
      >
        {neutralRamp.map((hex) => (
          <div
            key={hex}
            className="h-full transition-colors duration-200"
            style={{ backgroundColor: hex }}
          />
        ))}
      </div>
    </div>
  );
};

export const ColorSwatchesSpecimen: React.FC<SpecimenProps> = ({ tokens }) => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const swatches = [
    { name: 'Primary', hex: tokens.primaryColor },
    { name: 'Support', hex: tokens.supportColor },
    { name: 'Secondary', hex: tokens.secondaryColor },
    { name: 'Accent', hex: tokens.accentColor },
    { name: 'Surface', hex: tokens.surfaceTint },
  ];

  const handleCopy = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1400);
  };

  return (
    <div
      className="bg-white rounded-[24px]"
      style={{ padding: `${Math.round(32 * tokens.spacingMultiplier)}px` }}
    >
      <div
        className="grid grid-cols-2 sm:grid-cols-5"
        style={{ gap: `${Math.round(16 * tokens.spacingMultiplier)}px` }}
      >
        {swatches.map((s) => {
          const textColor = getReadableTextColor(s.hex);
          return (
            <button
              key={s.name}
              onClick={() => handleCopy(s.hex)}
              className="group text-left overflow-hidden transition-all hover:-translate-y-0.5"
              style={{ borderRadius: `${tokens.radiusPx}px` }}
            >
              <div
                className="h-36 p-4 flex flex-col justify-between transition-colors duration-200"
                style={{
                  backgroundColor: s.hex,
                  color: textColor,
                  fontWeight: tokens.bodyWeight,
                }}
              >
                <div className="flex items-center justify-between text-xs opacity-75">
                  <span>{s.name}</span>
                  {copiedHex === s.hex && <Check className="w-3.5 h-3.5" />}
                </div>
                <div
                  className="font-mono text-xs"
                  style={{ fontWeight: tokens.headingWeight }}
                >
                  {s.hex.toUpperCase()}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export const OutdoorBillboardSpecimen: React.FC<SpecimenProps> = ({ tokens }) => {
  const headingFont = getFontClass(tokens.headingFont);
  const [line1, line2, line3] = tokens.brandCopy.billboardHeadline;

  return (
    <div className="relative overflow-hidden bg-[#E5E5E7] rounded-[24px] p-8 md:p-14">
      <div className="relative max-w-4xl mx-auto bg-zinc-950 p-3 rounded-2xl shadow-2xl">
        <div
          className="rounded-xl bg-[#F5F5F7] grid grid-cols-1 md:grid-cols-12 gap-8 items-center"
          style={{ padding: `${Math.round(36 * tokens.spacingMultiplier)}px` }}
        >
          <div className="md:col-span-6 flex flex-col justify-between h-full space-y-6">
            <h3
              className={`text-zinc-950 leading-[1.06] ${headingFont}`}
              style={{
                fontSize: `${Math.round(36 * tokens.fontScale)}px`,
                fontWeight: tokens.headingWeight,
                letterSpacing: `${tokens.letterSpacingEm}em`,
              }}
            >
              {line1}
              <br />
              {line2}
              <br />
              {line3}
            </h3>

            <div>
              <span
                className="inline-flex items-center px-3.5 py-1.5 text-[11px] bg-zinc-950 text-white transition-all"
                style={{
                  borderRadius: `${tokens.radiusPx}px`,
                  fontWeight: tokens.bodyWeight,
                }}
              >
                {tokens.brandCopy.billboardSubpill}
              </span>
            </div>

            <div className="flex items-center gap-2.5 pt-1">
              <BrandLogoMark
                logoId={tokens.logoId}
                color={tokens.primaryColor}
                size={22}
              />
              <span
                className={`text-lg text-zinc-950 ${headingFont}`}
                style={{
                  fontWeight: tokens.headingWeight,
                  letterSpacing: `${tokens.letterSpacingEm}em`,
                }}
              >
                {tokens.brandName}
              </span>
            </div>
          </div>

          <div
            className="md:col-span-6 h-56 md:h-64 relative overflow-hidden flex items-center justify-center p-6 transition-all duration-200"
            style={{
              borderRadius: `${tokens.radiusPx}px`,
              background: `linear-gradient(135deg, ${tokens.secondaryColor}66 0%, ${tokens.primaryColor}30 100%)`,
            }}
          >
            <svg viewBox="0 0 320 220" className="w-full h-full">
              <defs>
                <linearGradient id="canGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor={tokens.primaryColor} />
                  <stop offset="100%" stopColor={tokens.supportColor} />
                </linearGradient>
              </defs>
              <polygon points="55,135 85,55 125,70 105,150" fill="url(#canGrad)" />
              <line x1="110" y1="130" x2="165" y2="95" stroke={tokens.supportColor} strokeWidth="6" strokeLinecap="round" />
              <ellipse cx="185" cy="52" rx="26" ry="20" transform="rotate(25 185 52)" fill={tokens.accentColor} />
              <polygon points="260,30 280,55 250,115 235,80" fill={tokens.secondaryColor} />
              <path
                d="M 215 170 C 190 140 185 120 215 115 C 245 120 240 140 215 170 Z"
                fill={tokens.primaryColor}
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SocialCardPosterSpecimen: React.FC<SpecimenProps> = ({ tokens, block }) => {
  const [liked, setLiked] = useState(true);
  const headingFont = getFontClass(tokens.headingFont);

  if (block.theme === 'brand') {
    const [pLine1, pLine2, pLine3] = tokens.brandCopy.socialPosterHeadline;
    const fgColor = getReadableTextColor(tokens.primaryColor);

    return (
      <div
        className="rounded-[24px] min-h-[420px] flex flex-col justify-between relative overflow-hidden transition-colors duration-200"
        style={{
          backgroundColor: tokens.primaryColor,
          color: fgColor,
          padding: `${Math.round(34 * tokens.spacingMultiplier)}px`,
        }}
      >
        <div
          className={`leading-[1.03] z-10 ${headingFont}`}
          style={{
            fontSize: `${Math.round(44 * tokens.fontScale)}px`,
            fontWeight: tokens.headingWeight,
            letterSpacing: `${tokens.letterSpacingEm}em`,
          }}
        >
          <div>{pLine1}</div>
          <div>{pLine2}</div>
          <div>{pLine3}</div>
        </div>

        <div className="my-6 flex items-center justify-center z-10">
          <div className="relative w-56 h-32 flex items-center justify-center">
            {[
              tokens.supportColor,
              tokens.secondaryColor,
              tokens.accentColor,
              tokens.primaryColor,
              tokens.supportColor,
            ].map((cardColor, idx) => (
              <div
                key={idx}
                className="w-16 h-24 shadow-md border border-white/25 transition-all duration-200"
                style={{
                  borderRadius: `${Math.min(tokens.radiusPx, 16)}px`,
                  background: `linear-gradient(135deg, ${cardColor}, ${tokens.accentColor})`,
                  transform: `rotate(${(idx - 2) * 14}deg) translateY(${Math.abs(idx - 2) * 4}px)`,
                }}
              />
            ))}
          </div>
        </div>

        <div className="flex items-end justify-between text-xs opacity-90 z-10">
          <div className="flex items-center gap-2">
            <BrandLogoMark logoId={tokens.logoId} color={fgColor} size={24} />
            <span
              className={`text-sm ${headingFont}`}
              style={{ fontWeight: tokens.headingWeight }}
            >
              {tokens.brandName}
            </span>
          </div>
        </div>
      </div>
    );
  }

  const [cLine1, cLine2, cLine3] = tokens.brandCopy.socialCardHeadline;

  return (
    <div className="rounded-[24px] bg-white p-8 flex items-center justify-center h-full">
      <div
        className="bg-[#FAFAFA] max-w-sm w-full space-y-5 transition-all"
        style={{
          borderRadius: `${tokens.radiusPx}px`,
          padding: `${Math.round(24 * tokens.spacingMultiplier)}px`,
        }}
      >
        <div className="flex items-center justify-between">
          <h4
            className={`text-zinc-950 leading-[1.08] ${headingFont}`}
            style={{
              fontSize: `${Math.round(28 * tokens.fontScale)}px`,
              fontWeight: tokens.headingWeight,
              letterSpacing: `${tokens.letterSpacingEm}em`,
            }}
          >
            {cLine1}
            <br />
            {cLine2}
            <br />
            {cLine3}
          </h4>
          <BrandLogoMark
            logoId={tokens.logoId}
            color={tokens.primaryColor}
            size={24}
          />
        </div>

        <div
          className="h-44 p-6 flex items-center justify-center relative overflow-hidden transition-all duration-200"
          style={{
            borderRadius: `${Math.max(0, tokens.radiusPx - 4)}px`,
            background: `linear-gradient(180deg, ${tokens.secondaryColor}66 0%, ${tokens.primaryColor} 100%)`,
          }}
        >
          <div className="relative w-36 h-24">
            {[
              tokens.primaryColor,
              tokens.supportColor,
              tokens.accentColor,
            ].map((layerColor, layer) => (
              <div
                key={layer}
                className="absolute inset-x-0 h-14 border border-white/25 shadow-sm transition-all duration-200"
                style={{
                  top: `${layer * 12}px`,
                  borderRadius: `${Math.min(tokens.radiusPx, 14)}px`,
                  backgroundColor: layerColor,
                }}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-1 text-zinc-600">
          <div className="flex items-center gap-3">
            <button onClick={() => setLiked(!liked)}>
              <Heart
                className="w-4 h-4 transition"
                style={
                  liked
                    ? { fill: tokens.primaryColor, color: tokens.primaryColor }
                    : undefined
                }
              />
            </button>
            <MessageCircle className="w-4 h-4" />
            <Send className="w-4 h-4" />
          </div>
          <Bookmark className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};

export const EditorialValuesListSpecimen: React.FC<SpecimenProps> = ({ tokens }) => {
  const headingFont = getFontClass(tokens.headingFont);
  const pillars = tokens.brandCopy.editorialPillars;

  return (
    <div
      className="rounded-[24px] flex flex-col items-center justify-center text-center h-full min-h-[380px] transition-colors duration-200"
      style={{
        backgroundColor: tokens.surfaceTint,
        padding: `${Math.round(40 * tokens.spacingMultiplier)}px`,
      }}
    >
      <div
        className={`text-zinc-900 ${headingFont}`}
        style={{
          fontSize: `${Math.round(34 * tokens.fontScale)}px`,
          fontWeight: Math.max(400, tokens.headingWeight - 200),
          letterSpacing: `${tokens.letterSpacingEm}em`,
          display: 'flex',
          flexDirection: 'column',
          gap: `${Math.round(10 * tokens.spacingMultiplier)}px`,
        }}
      >
        <div>{pillars[0]}</div>
        <div className="flex items-center justify-center gap-2.5">
          <span className="underline decoration-1 underline-offset-4">
            {pillars[1]}
          </span>
          <Briefcase className="w-6 h-6 stroke-[1.5]" />
        </div>
        <div>{pillars[2]}</div>
        <div>{pillars[3]}</div>
        <div>
          <span className="underline decoration-1 underline-offset-4">
            {pillars[4]}
          </span>
        </div>
        <div>{pillars[5]}</div>
      </div>
    </div>
  );
};

export const LifestylePhotographySpecimen: React.FC<SpecimenProps> = ({ tokens }) => {
  const headingFont = getFontClass(tokens.headingFont);

  return (
    <div className="relative overflow-hidden rounded-[24px] min-h-[420px] h-full flex flex-col justify-between p-8 bg-zinc-900 text-white group">
      <img
        src={tokens.brandCopy.lifestyleImageUrl}
        alt={tokens.brandCopy.lifestyleCaption}
        className="absolute inset-0 w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-700"
      />
      <div className="absolute inset-0 bg-black/25" />

      <div className="relative z-10 flex items-center gap-2">
        <BrandLogoMark logoId={tokens.logoId} color="#FFFFFF" size={20} />
        <span className={`text-xs font-medium text-white/90 ${headingFont}`}>
          {tokens.brandName}
        </span>
      </div>

      <div className="relative z-10 my-auto flex justify-center">
        <button
          className={`shadow-lg flex items-center gap-2.5 transition-all duration-150 transform hover:scale-105 ${headingFont}`}
          style={{
            backgroundColor: tokens.primaryColor,
            color: getReadableTextColor(tokens.primaryColor),
            borderRadius: `${tokens.radiusPx}px`,
            padding: `${Math.round(12 * tokens.spacingMultiplier)}px ${Math.round(
              24 * tokens.spacingMultiplier
            )}px`,
            fontSize: `${Math.round(13 * tokens.fontScale)}px`,
            fontWeight: Math.max(500, tokens.headingWeight - 100),
            letterSpacing: `${tokens.letterSpacingEm}em`,
          }}
        >
          <span>{tokens.brandCopy.lifestyleCta}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div
        className="relative z-10 text-[11px] text-white/80"
        style={{ fontWeight: tokens.bodyWeight }}
      >
        {tokens.brandCopy.lifestyleCaption}
      </div>
    </div>
  );
};
