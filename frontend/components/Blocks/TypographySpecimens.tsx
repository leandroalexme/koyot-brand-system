import React, { useState } from 'react';
import { BrandTokens, EditorialBlock } from '../../types';
import {
  getFontClass,
  getReadableTextColor,
} from '../../utils/styleUtils';

interface SpecimenProps {
  tokens: BrandTokens;
  block: EditorialBlock;
}

export const TypographySculptureSpecimen: React.FC<SpecimenProps> = ({ tokens, block }) => {
  const [weightOffset, setWeightOffset] = useState<number>(0);
  const headingFont = getFontClass(tokens.headingFont);

  const activeWeight = Math.max(
    300,
    Math.min(800, tokens.headingWeight + weightOffset)
  );

  if (block.theme === 'brand') {
    return (
      <div
        className="rounded-[24px] w-full h-full min-h-0 overflow-hidden flex flex-col justify-between text-center transition-colors duration-200"
        style={{
          backgroundColor: tokens.accentColor,
          color: getReadableTextColor(tokens.accentColor),
          padding: `${Math.round(36 * tokens.spacingMultiplier)}px`,
        }}
      >
        <div
          className="text-xs opacity-80"
          style={{ fontWeight: tokens.bodyWeight }}
        >
          {tokens.headingFont}
        </div>

        <div
          className={`leading-none select-none my-auto ${headingFont}`}
          style={{
            fontSize: `${Math.round(136 * tokens.fontScale)}px`,
            fontWeight: activeWeight,
            letterSpacing: `${tokens.letterSpacingEm}em`,
          }}
        >
          {tokens.brandCopy.sculptureGlyph}
        </div>

        <div
          className={`text-xs leading-relaxed opacity-75 max-w-sm mx-auto ${headingFont}`}
          style={{
            fontWeight: tokens.bodyWeight,
            letterSpacing: `${tokens.letterSpacingEm * 0.5}em`,
          }}
        >
          Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq{' '}
          <span style={{ fontWeight: activeWeight }} className="opacity-100 underline">
            {tokens.brandCopy.sculptureGlyph}
          </span>{' '}
          Rr Ss Tt Uu Vv Xx Yy Zz
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[24px] p-6 sm:p-7 w-full h-full min-h-0 overflow-hidden flex flex-col justify-between">
      <div
        className="grid grid-cols-2 items-center h-full"
        style={{ gap: `${Math.round(22 * tokens.spacingMultiplier)}px` }}
      >
        <div
          className="bg-[#F5F5F7] flex flex-col items-center justify-center text-center h-full"
          style={{
            borderRadius: `${tokens.radiusPx}px`,
            padding: `${Math.round(24 * tokens.spacingMultiplier)}px`,
          }}
        >
          <div
            className={`leading-[1.06] text-zinc-950 ${headingFont}`}
            style={{
              fontSize: `${Math.round(52 * tokens.fontScale)}px`,
              fontWeight: activeWeight,
              letterSpacing: `${tokens.letterSpacingEm}em`,
            }}
          >
            <div>Aa</div>
            <div>123</div>
            <div>#&amp;!</div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center text-center py-4">
          <span
            className="text-[11px] text-zinc-400 mb-5"
            style={{ fontWeight: tokens.bodyWeight }}
          >
            {tokens.headingFont}
          </span>
          <div
            className={`space-y-1.5 ${headingFont}`}
            style={{
              fontSize: `${Math.round(32 * tokens.fontScale)}px`,
              letterSpacing: `${tokens.letterSpacingEm}em`,
            }}
          >
            <button
              onClick={() => setWeightOffset(-200)}
              style={{ fontWeight: Math.max(300, tokens.headingWeight - 200) }}
              className={`block w-full transition ${
                weightOffset === -200
                  ? 'text-zinc-950'
                  : 'text-zinc-300 hover:text-zinc-600'
              }`}
            >
              Regular
            </button>
            <button
              onClick={() => setWeightOffset(-100)}
              style={{ fontWeight: Math.max(400, tokens.headingWeight - 100) }}
              className={`block w-full transition ${
                weightOffset === -100
                  ? 'text-zinc-950'
                  : 'text-zinc-300 hover:text-zinc-600'
              }`}
            >
              Medium
            </button>
            <button
              onClick={() => setWeightOffset(0)}
              style={{ fontWeight: tokens.headingWeight }}
              className={`block w-full transition ${
                weightOffset === 0
                  ? 'text-zinc-950'
                  : 'text-zinc-300 hover:text-zinc-600'
              }`}
            >
              Heavy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const TypographyAlphabetSpecimen: React.FC<SpecimenProps> = ({ tokens }) => {
  const glyphs = [
    'A','B','C','D','E','F','G','H','I','J','K',
    'L','M','N','O','P','Q','R','S','T','U','V',
    'W','X','Y','Z','a','b','c','d','e','f','g',
    'h','i','j','k','l','m','n','o','p','q','r',
    's','t','u','v','w','x','y','z','1','2','3',
    '4','5','6','7','8','9','0','“','#','%','&',
    '!','?','@','/','(',')',':',';',',','.','*',
    '+','-','$','®','©','™','[',']','<','>','^',
  ];

  const [activeGlyph, setActiveGlyph] = useState<string>('R');
  const headingFont = getFontClass(tokens.headingFont);

  return (
    <div
      className="bg-white rounded-[24px] w-full h-full min-h-0 flex flex-col justify-between overflow-hidden"
      style={{ padding: `${Math.round(36 * tokens.spacingMultiplier)}px` }}
    >
      <div
        className="flex items-center justify-between text-xs text-zinc-400 mb-4 shrink-0"
        style={{ fontWeight: tokens.bodyWeight }}
      >
        <span>Alphabet Matrix</span>
        <span>{tokens.headingFont}</span>
      </div>

      <div className="flex-1 min-h-0 flex items-center justify-center my-auto">
        <div className="grid grid-cols-11 border-t border-l border-zinc-100 w-full max-w-2xl">
          {glyphs.map((g, i) => {
            const isSelected = activeGlyph === g;
            return (
              <button
                key={i}
                onClick={() => setActiveGlyph(g)}
                className={`aspect-square border-r border-b border-zinc-100 flex items-center justify-center transition ${headingFont} ${
                  isSelected ? 'text-white' : 'text-zinc-800 hover:bg-zinc-50'
                }`}
                style={{
                  fontSize: `${Math.round(17 * tokens.fontScale)}px`,
                  fontWeight: isSelected ? tokens.headingWeight : tokens.bodyWeight,
                  ...(isSelected
                    ? {
                        backgroundColor: tokens.primaryColor,
                        borderRadius: `${Math.min(tokens.radiusPx, 12)}px`,
                      }
                    : {}),
                }}
              >
                {g}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const TypographyHierarchySpecimen: React.FC<SpecimenProps> = ({ tokens }) => {
  const headingFont = getFontClass(tokens.headingFont);
  const bodyFont = getFontClass(tokens.bodyFont);

  const scales = [
    { role: 'Display', basePx: 44, isBody: false, weightDelta: 0 },
    { role: 'Headline', basePx: 30, isBody: false, weightDelta: -100 },
    { role: 'Title', basePx: 22, isBody: false, weightDelta: -200 },
    { role: 'Body', basePx: 15, isBody: true, weightDelta: 0 },
  ];

  return (
    <div
      className="bg-white rounded-[24px] w-full h-full min-h-0 flex flex-col justify-between overflow-hidden"
      style={{ padding: `${Math.round(36 * tokens.spacingMultiplier)}px` }}
    >
      <div
        className="flex items-center justify-between text-xs text-zinc-400 mb-4 shrink-0"
        style={{ fontWeight: tokens.bodyWeight }}
      >
        <span>Type Hierarchy</span>
        <span>{tokens.brandName} Specs</span>
      </div>

      <div className="flex-1 min-h-0 flex flex-col justify-between divide-y divide-zinc-100 my-auto">
        {scales.map((item) => {
          const computedPx = Math.round(item.basePx * tokens.fontScale);
          const computedWeight = item.isBody
            ? tokens.bodyWeight
            : Math.max(300, Math.min(800, tokens.headingWeight + item.weightDelta));

          return (
            <div
              key={item.role}
              className="py-4 first:pt-0 last:pb-0 grid grid-cols-12 gap-4 items-baseline"
            >
              <div
                className="col-span-3 flex items-center gap-3 text-xs text-zinc-400"
                style={{ fontWeight: tokens.bodyWeight }}
              >
                <span className="font-medium text-zinc-900">{item.role}</span>
                <span>{computedPx}px</span>
              </div>
              <div
                className={`col-span-9 ${
                  item.isBody ? `text-zinc-600 ${bodyFont}` : `text-zinc-950 ${headingFont}`
                }`}
                style={{
                  fontSize: `${computedPx}px`,
                  fontWeight: computedWeight,
                  letterSpacing: item.isBody
                    ? `${tokens.letterSpacingEm * 0.35}em`
                    : `${tokens.letterSpacingEm}em`,
                  lineHeight: item.isBody ? 1.55 : 1.12,
                }}
              >
                {item.isBody
                  ? tokens.brandCopy.hierarchyBodySample
                  : `${tokens.brandName} — ${tokens.tagline}`}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
