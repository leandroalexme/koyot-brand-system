import React, { useState, useEffect } from 'react';
import { BrandTokens, EditorialBlock } from '../../types';
import {
  getFontClass,
  getReadableTextColor,
} from '../../utils/styleUtils';
import { BrandLogoMark } from './BrandLogoMark';
import {
  Image as ImageIcon,
  CheckSquare,
  MessageSquare,
  User,
  FileText,
  Camera,
  Folder,
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Lock,
  Link2,
  Home,
  Search,
  LogIn,
} from 'lucide-react';

interface SpecimenProps {
  tokens: BrandTokens;
  block: EditorialBlock;
  containerWidth?: number;
}

/**
 * 1. LOGOTYPE SCALING LADDER (Minimalist "Silo" reference — zero truncation, pure scale steps)
 */
export const LogotypeScalingSpecimen: React.FC<SpecimenProps> = ({ tokens }) => {
  const headingFont = getFontClass(tokens.headingFont);
  const shortBrand = tokens.brandName.split(' ')[0];

  const steps = [
    { sizePx: 112, label: '320 px' },
    { sizePx: 68, label: '160 px' },
    { sizePx: 40, label: '80 px' },
    { sizePx: 24, label: 'Reduction @ 40 px' },
    { sizePx: 14, label: 'Reduction @ 20 px' },
  ];

  return (
    <div
      className="bg-white rounded-[24px] flex flex-col justify-between"
      style={{ padding: `${Math.round(36 * tokens.spacingMultiplier)}px` }}
    >
      <div className="flex items-center gap-2 pb-5 border-b border-zinc-100">
        <span
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: tokens.primaryColor }}
        />
        <span className="text-xs text-zinc-400">Logotype scaling</span>
      </div>

      <div className="divide-y divide-zinc-100">
        {steps.map((step, idx) => {
          const scaledFontPx = Math.round(step.sizePx * tokens.fontScale);
          return (
            <div
              key={idx}
              className="flex items-baseline justify-between gap-4 py-5 first:pt-6 last:pb-1"
            >
              <div
                className={`leading-[0.9] select-none whitespace-nowrap ${headingFont}`}
                style={{
                  fontSize: `${scaledFontPx}px`,
                  fontWeight: tokens.headingWeight,
                  letterSpacing: `${tokens.letterSpacingEm}em`,
                  color: tokens.primaryColor,
                }}
              >
                {shortBrand}
              </div>
              <span className="text-[11px] text-zinc-400 shrink-0 font-mono">
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/**
 * 2. 4-ZONE BRAND LOCKUP & APP ICON MATRIX (Minimalist "Cadmus" reference — 100% cohesive palette)
 */
export const BrandLockupMatrixSpecimen: React.FC<SpecimenProps> = ({ tokens }) => {
  const headingFont = getFontClass(tokens.headingFont);
  const fgPrimary = getReadableTextColor(tokens.primaryColor);
  const fgSupport = getReadableTextColor(tokens.supportColor);
  const fgSecondary = getReadableTextColor(tokens.secondaryColor);
  const shortBrand = tokens.brandName.split(' ')[0];

  return (
    <div className="bg-white rounded-[24px] overflow-hidden grid grid-cols-12 h-[440px]">
      {/* Left 6 columns: 2x2 + Bottom Horizontal Lockup */}
      <div className="col-span-6 grid grid-rows-2">
        <div className="grid grid-cols-2">
          {/* Top-Left: Wordmark on Primary */}
          <div
            className="p-6 flex items-center justify-center text-center transition-colors duration-200"
            style={{
              backgroundColor: tokens.primaryColor,
              color: fgPrimary,
            }}
          >
            <span
              className={`text-3xl whitespace-nowrap ${headingFont}`}
              style={{
                fontWeight: tokens.headingWeight,
                letterSpacing: `${tokens.letterSpacingEm}em`,
              }}
            >
              {shortBrand}
            </span>
          </div>

          {/* Top-Right: Standalone Symbol on Secondary Brand Color */}
          <div
            className="p-6 flex items-center justify-center transition-colors duration-200"
            style={{ backgroundColor: tokens.secondaryColor }}
          >
            <BrandLogoMark
              logoId={tokens.logoId}
              color={fgSecondary}
              size={Math.round(52 * tokens.fontScale)}
            />
          </div>
        </div>

        {/* Bottom-Left Full Span: Horizontal Lockup on Support Color */}
        <div
          className="p-8 flex items-center justify-center gap-3.5 transition-colors duration-200"
          style={{
            backgroundColor: tokens.supportColor,
            color: fgSupport,
          }}
        >
          <BrandLogoMark
            logoId={tokens.logoId}
            color={fgSupport}
            size={Math.round(36 * tokens.fontScale)}
          />
          <span
            className={`text-4xl whitespace-nowrap ${headingFont}`}
            style={{
              fontWeight: tokens.headingWeight,
              letterSpacing: `${tokens.letterSpacingEm}em`,
            }}
          >
            {shortBrand}
          </span>
        </div>
      </div>

      {/* Right 6 columns: Tactile App Icon Squircle on Surface Tint */}
      <div
        className="col-span-6 p-10 flex items-center justify-center transition-colors duration-200"
        style={{ backgroundColor: tokens.surfaceTint }}
      >
        <div
          className="w-36 h-36 flex items-center justify-center shadow-[0_24px_48px_-12px_rgba(0,0,0,0.22)] transition-all duration-200"
          style={{
            backgroundColor: tokens.primaryColor,
            borderRadius: `${Math.max(16, Math.min(36, tokens.radiusPx * 1.6))}px`,
          }}
        >
          <BrandLogoMark
            logoId={tokens.logoId}
            color={fgPrimary}
            size={Math.round(64 * tokens.fontScale)}
          />
        </div>
      </div>
    </div>
  );
};

/**
 * 3. 32PX OPTICAL ICON GRID INSPECTOR (Ultra-clean "Session Icons" reference — zero extra pills)
 */
export const IconGridInspectorSpecimen: React.FC<SpecimenProps> = ({ tokens }) => {
  const [activeIdx, setActiveIdx] = useState<number>(0);

  const items = [
    { num: '01', label: 'Image Added', Icon: ImageIcon },
    { num: '02', label: 'Payment Made', Icon: CheckSquare },
    { num: '03', label: 'New Message', Icon: MessageSquare },
    { num: '04', label: 'View Profile', Icon: User },
    { num: '05', label: 'Form Completed', Icon: FileText },
    { num: '06', label: 'New Booking', Icon: Camera },
    { num: '07', label: 'Folder Created', Icon: Folder },
  ];

  const current = items[activeIdx];
  const ActiveIcon = current.Icon;
  const strokePx = tokens.borderWidth === 0 ? 1.5 : tokens.borderWidth === 2 ? 2.25 : 2;

  return (
    <div
      onClick={() => setActiveIdx((activeIdx + 1) % items.length)}
      className="bg-white rounded-[24px] flex flex-col justify-between h-[440px] cursor-pointer select-none"
      style={{ padding: `${Math.round(32 * tokens.spacingMultiplier)}px` }}
    >
      {/* Minimalist Top Bar */}
      <div className="flex items-center justify-between text-xs text-zinc-900">
        <span>Session Icons</span>
        <span className="text-zinc-400">
          32px Grid | {strokePx}px Stroke
        </span>
      </div>

      {/* Central Optical Construction Grid */}
      <div className="my-auto flex items-center justify-center">
        <div className="relative w-60 h-60 flex items-center justify-center">
          <svg
            viewBox="0 0 240 240"
            className="absolute inset-0 w-full h-full pointer-events-none"
          >
            <defs>
              <pattern
                id="optical-icon-grid"
                width="12"
                height="12"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 12 0 L 0 0 0 12"
                  fill="none"
                  stroke={tokens.primaryColor}
                  strokeWidth="0.5"
                  strokeOpacity="0.25"
                />
              </pattern>
            </defs>
            <circle
              cx="120"
              cy="120"
              r="106"
              fill={tokens.primaryColor}
              fillOpacity="0.08"
              stroke={tokens.primaryColor}
              strokeWidth="0.6"
              strokeOpacity="0.25"
            />
            <rect
              x="24"
              y="24"
              width="192"
              height="192"
              fill="url(#optical-icon-grid)"
              stroke={tokens.primaryColor}
              strokeWidth="0.6"
              strokeOpacity="0.3"
            />
          </svg>

          <ActiveIcon
            className="relative z-10 w-36 h-36 text-zinc-900 transition-transform duration-300"
            strokeWidth={strokePx}
          />
        </div>
      </div>

      {/* Minimalist Bottom Bar */}
      <div className="flex items-center justify-between text-xs text-zinc-900">
        <span className="font-mono text-zinc-400">{current.num}</span>
        <span>{current.label}</span>
      </div>
    </div>
  );
};

/**
 * 4. MORPHING ICON & PILL MOTION SYSTEM (Pure "fraenk" reference — zero buttons or telemetry clutter)
 */
export const MotionIconMorphSpecimen: React.FC<SpecimenProps> = ({ tokens }) => {
  const [stage, setStage] = useState<0 | 1 | 2>(0);
  const headingFont = getFontClass(tokens.headingFont);
  const shortBrand = tokens.brandName.split(' ')[0].toLowerCase();

  useEffect(() => {
    const interval = setInterval(() => {
      setStage((prev) => ((prev + 1) % 3) as 0 | 1 | 2);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  const badgeBg = tokens.accentColor;
  const badgeFg = getReadableTextColor(badgeBg);

  return (
    <div
      onClick={() => setStage(((stage + 1) % 3) as 0 | 1 | 2)}
      className="rounded-[24px] p-10 h-[440px] flex flex-col items-center justify-center relative overflow-hidden cursor-pointer select-none transition-colors duration-300"
      style={{ backgroundColor: tokens.darkSurface, color: '#FFFFFF' }}
    >
      <div
        className={`flex items-center justify-center transition-all duration-500 ${
          stage === 2
            ? 'w-80 h-28 px-5 justify-start gap-5 bg-white/10 rounded-full'
            : 'w-40 h-40'
        }`}
      >
        <div
          className="relative flex items-center justify-center transition-all duration-500"
          style={
            stage === 1
              ? {
                  padding: '8px',
                  borderRadius: '9999px',
                  background: `linear-gradient(135deg, ${tokens.primaryColor}, ${tokens.supportColor}, ${tokens.accentColor})`,
                }
              : undefined
          }
        >
          <div
            className="flex items-center justify-center shadow-xl transition-all duration-500"
            style={{
              width: stage === 2 ? '68px' : '128px',
              height: stage === 2 ? '68px' : '128px',
              backgroundColor: badgeBg,
              color: badgeFg,
              borderRadius:
                stage === 1
                  ? '9999px'
                  : `${Math.max(14, Math.min(32, tokens.radiusPx * 1.4))}px`,
            }}
          >
            <span
              className={`select-none ${headingFont}`}
              style={{
                fontSize: stage === 2 ? '28px' : '54px',
                fontWeight: tokens.headingWeight,
                letterSpacing: `${tokens.letterSpacingEm}em`,
              }}
            >
              {tokens.brandCopy.sculptureGlyph.toLowerCase()}
            </span>
          </div>
        </div>

        {stage === 2 && (
          <span
            className={`text-3xl text-white whitespace-nowrap ${headingFont}`}
            style={{
              fontWeight: tokens.bodyWeight,
              letterSpacing: `${tokens.letterSpacingEm}em`,
            }}
          >
            {shortBrand}
          </span>
        )}
      </div>

      {stage === 0 && (
        <span
          className={`mt-5 text-base text-white/85 tracking-tight ${headingFont}`}
        >
          {shortBrand}
        </span>
      )}
    </div>
  );
};

/**
 * 5. STYLISTIC SET & OPENTYPE ALTERNATES SHEET (Pure "Raptor Text — RR / Levitate" reference)
 */
export const StylisticSetSpecimen: React.FC<SpecimenProps> = ({ tokens }) => {
  const headingFont = getFontClass(tokens.headingFont);
  const bodyFont = getFontClass(tokens.bodyFont);
  const glyphChar = tokens.brandName.charAt(0).toUpperCase();

  return (
    <div
      className="rounded-[24px] space-y-6 transition-colors duration-200"
      style={{
        backgroundColor: tokens.surfaceTint,
        color: '#18181B',
        padding: `${Math.round(36 * tokens.spacingMultiplier)}px`,
      }}
    >
      {/* Top Section: Side-by-side Glyph Alternates */}
      <div className="grid grid-cols-2 gap-8 border-t border-zinc-900/20 pt-2">
        <div>
          <div className="flex items-center justify-between text-[11px] text-zinc-500 mb-2">
            <span>Font: {tokens.headingFont}</span>
            <span>Style: Bold</span>
          </div>
          <div
            className={`leading-[0.86] select-none ${headingFont}`}
            style={{
              fontSize: `${Math.round(168 * tokens.fontScale)}px`,
              fontWeight: tokens.headingWeight,
              letterSpacing: `${tokens.letterSpacingEm}em`,
            }}
          >
            {glyphChar}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between text-[11px] text-zinc-500 mb-2">
            <span>Stylistic Set: Alternative {glyphChar} (ss10)</span>
            <span>Superior Type</span>
          </div>
          <div
            className={`leading-[0.86] select-none italic ${headingFont}`}
            style={{
              fontSize: `${Math.round(168 * tokens.fontScale)}px`,
              fontWeight: tokens.headingWeight,
              letterSpacing: `${tokens.letterSpacingEm}em`,
              color: tokens.primaryColor,
            }}
          >
            {glyphChar}
          </div>
        </div>
      </div>

      {/* Middle Section: Display Word */}
      <div className="border-t border-zinc-900/20 pt-2">
        <div className="flex items-center justify-between text-[11px] text-zinc-500 mb-2">
          <span>Alternative Ligatures (ss09)</span>
          <span>Font: {tokens.headingFont} · SemiBold</span>
        </div>
        <div
          className={`leading-[0.94] select-none whitespace-nowrap ${headingFont}`}
          style={{
            fontSize: `${Math.round(88 * tokens.fontScale)}px`,
            fontWeight: Math.max(500, tokens.headingWeight - 100),
            letterSpacing: `${tokens.letterSpacingEm}em`,
          }}
        >
          {tokens.brandCopy.stylisticWord}
        </div>
      </div>

      {/* Bottom Section: Editorial Paragraph */}
      <div className="border-t border-zinc-900/20 pt-2">
        <div className="flex items-center justify-between text-[11px] text-zinc-500 mb-3">
          <span>Font: {tokens.bodyFont}</span>
          <span>Style: Medium</span>
        </div>
        <p
          className={`leading-[1.26] text-zinc-900 ${bodyFont}`}
          style={{
            fontSize: `${Math.round(21 * tokens.fontScale)}px`,
            fontWeight: tokens.bodyWeight,
          }}
        >
          {tokens.brandCopy.hierarchyBodySample}
        </p>
      </div>
    </div>
  );
};

/**
 * 6. 3-COLUMN TYPE TRIPTYCH POSTER (Reference: "*12 95% | €f | $&@!")
 */
export const TypeTriptychPosterSpecimen: React.FC<SpecimenProps> = ({ tokens }) => {
  const headingFont = getFontClass(tokens.headingFont);
  const bodyFont = getFontClass(tokens.bodyFont);

  return (
    <div className="bg-white rounded-[24px] p-6">
      <div className="grid grid-cols-3 gap-5">
        {/* Poster 1: Numerals & Percentages on Secondary */}
        <div
          className="p-6 h-[380px] flex flex-col justify-between overflow-hidden transition-all"
          style={{
            backgroundColor: tokens.secondaryColor,
            color: getReadableTextColor(tokens.secondaryColor),
            borderRadius: `${tokens.radiusPx}px`,
          }}
        >
          <div className="flex items-center justify-between text-[10px] opacity-75">
            <span>{tokens.headingFont}</span>
            <span>Numerals</span>
          </div>

          <div
            className={`leading-[0.88] select-none ${headingFont}`}
            style={{
              fontSize: `${Math.round(92 * tokens.fontScale)}px`,
              fontWeight: tokens.headingWeight,
              letterSpacing: `${tokens.letterSpacingEm}em`,
            }}
          >
            <div>*12</div>
            <div>95%</div>
          </div>
        </div>

        {/* Poster 2: Currency & Ligatures on Surface Tint */}
        <div
          className="p-6 h-[380px] flex flex-col justify-between overflow-hidden transition-all"
          style={{
            backgroundColor: tokens.surfaceTint,
            color: '#18181B',
            borderRadius: `${tokens.radiusPx}px`,
          }}
        >
          <div className="flex items-center justify-between text-[10px] text-zinc-500">
            <span>Primary Type</span>
            <span>{tokens.headingFont}</span>
          </div>

          <div
            className={`leading-none text-center my-auto select-none ${headingFont}`}
            style={{
              fontSize: `${Math.round(124 * tokens.fontScale)}px`,
              fontWeight: tokens.headingWeight,
            }}
          >
            €ƒ
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-3 text-[10px] text-zinc-500">
              <span>Regular</span>
              <span>Medium</span>
              <span className="font-bold text-zinc-900">Bold</span>
            </div>
            <p className={`text-[10px] leading-snug text-zinc-800 ${bodyFont}`}>
              Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz 1234567890
            </p>
          </div>
        </div>

        {/* Poster 3: Expressive Punctuation on Primary */}
        <div
          className="p-6 h-[380px] flex flex-col justify-between overflow-hidden transition-all"
          style={{
            backgroundColor: tokens.primaryColor,
            color: tokens.secondaryColor,
            borderRadius: `${tokens.radiusPx}px`,
          }}
        >
          <div className="flex items-center justify-between text-[10px] opacity-80">
            <span>Secondary Type</span>
            <span>{tokens.bodyFont}</span>
          </div>

          <div
            className={`leading-[0.86] text-center my-auto select-none ${headingFont}`}
            style={{
              fontSize: `${Math.round(100 * tokens.fontScale)}px`,
              fontWeight: tokens.headingWeight,
            }}
          >
            <div>$&amp;</div>
            <div>@!</div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 7. HIGH-CONTRAST TYPE SCALE SHEET (Reference: Yellow "120PX H1 Heading ... 20PX D1 Detail")
 */
export const TypeScaleSheetSpecimen: React.FC<SpecimenProps> = ({ tokens }) => {
  const headingFont = getFontClass(tokens.headingFont);
  const bodyFont = getFontClass(tokens.bodyFont);
  const fgAccent = getReadableTextColor(tokens.accentColor);

  const rows = [
    { pxLabel: '120PX', samplePx: 54, title: 'H1 Heading', isBody: false },
    { pxLabel: '80PX', samplePx: 40, title: 'H2 Heading', isBody: false },
    { pxLabel: '56PX', samplePx: 30, title: 'H3 Heading', isBody: false },
    { pxLabel: '42PX', samplePx: 22, title: 'H4 Heading', isBody: false },
    { pxLabel: '32PX', samplePx: 17, title: 'H5 Subheading', isBody: false },
    { pxLabel: '24PX', samplePx: 15, title: 'P1 Paragraph', isBody: true },
    { pxLabel: '16PX', samplePx: 12, title: 'D1 Detail', isBody: true, isMono: true },
  ];

  return (
    <div
      className="rounded-[24px] overflow-hidden transition-colors duration-200 h-full flex flex-col justify-center"
      style={{
        backgroundColor: tokens.accentColor,
        color: fgAccent,
        padding: `${Math.round(32 * tokens.spacingMultiplier)}px`,
      }}
    >
      <div className="divide-y divide-current/15 border-t border-b border-current/15">
        {rows.map((r) => {
          const computedSize = Math.round(r.samplePx * tokens.fontScale);
          return (
            <div
              key={r.title}
              className="grid grid-cols-12 items-baseline py-3 overflow-hidden"
            >
              <span className="col-span-2 text-[10px] font-mono opacity-70">
                {r.pxLabel}
              </span>
              <div
                className={`col-span-10 whitespace-nowrap leading-none ${
                  r.isMono
                    ? 'font-mono tracking-widest'
                    : r.isBody
                    ? bodyFont
                    : headingFont
                }`}
                style={{
                  fontSize: `${computedSize}px`,
                  fontWeight: r.isBody ? tokens.bodyWeight : tokens.headingWeight,
                  letterSpacing: r.isMono ? '0.08em' : `${tokens.letterSpacingEm}em`,
                }}
              >
                {r.title}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/**
 * 8. DYNAMIC EDITORIAL LAYOUT GRID SYSTEM (Pure "bpm supreme" reference — click artboard to cycle layouts)
 */
export const LayoutGridSystemSpecimen: React.FC<SpecimenProps> = ({ tokens }) => {
  const [gridMode, setGridMode] = useState<'triptych' | 'split' | 'poster'>('triptych');
  const headingFont = getFontClass(tokens.headingFont);
  const [g1, g2, g3] = tokens.brandCopy.gridPosterHeadline;

  const cycleGrid = () => {
    setGridMode((prev) =>
      prev === 'triptych' ? 'split' : prev === 'split' ? 'poster' : 'triptych'
    );
  };

  return (
    <div
      onClick={cycleGrid}
      title="Click to cycle layout grid proportions"
      className="rounded-[24px] p-10 cursor-pointer select-none transition-colors duration-300"
      style={{ backgroundColor: tokens.darkSurface }}
    >
      <div
        className="text-zinc-950 transition-all duration-500 overflow-hidden"
        style={{
          backgroundColor: tokens.surfaceTint,
          borderRadius: `${Math.min(tokens.radiusPx, 16)}px`,
        }}
      >
        {gridMode === 'poster' && (
          <div className="max-w-sm mx-auto min-h-[320px] flex flex-col justify-between border-x border-zinc-900/15 p-8">
            <h3
              className={`leading-[0.94] ${headingFont}`}
              style={{
                fontSize: `${Math.round(52 * tokens.fontScale)}px`,
                fontWeight: tokens.headingWeight,
                letterSpacing: `${tokens.letterSpacingEm}em`,
              }}
            >
              <div>{g1}</div>
              <div>{g2}</div>
              <div>{g3}</div>
            </h3>

            <div className="pt-12 flex items-end justify-between text-[10px] border-t border-zinc-900/20 mt-8">
              <div className="flex items-center gap-1.5 font-bold">
                <BrandLogoMark logoId={tokens.logoId} color="#09090B" size={16} />
                <span>{tokens.brandName.toLowerCase()}</span>
              </div>
              <span className="text-zinc-600">{tokens.brandCopy.domainUrl}</span>
            </div>
          </div>
        )}

        {gridMode === 'split' && (
          <div className="grid grid-cols-12 min-h-[320px]">
            <div className="col-span-7 p-8 flex flex-col justify-between border-r border-zinc-900/20">
              <h3
                className={`leading-[0.94] ${headingFont}`}
                style={{
                  fontSize: `${Math.round(54 * tokens.fontScale)}px`,
                  fontWeight: tokens.headingWeight,
                  letterSpacing: `${tokens.letterSpacingEm}em`,
                }}
              >
                <div>{g1}</div>
                <div>{g2}</div>
                <div>{g3}</div>
              </h3>
              <span className="text-[10px] text-zinc-600">
                {tokens.brandCopy.domainUrl}
              </span>
            </div>

            <div className="col-span-3 p-5 flex flex-col justify-between border-r border-zinc-900/20">
              <div className="text-[10px] space-y-0.5 text-zinc-700">
                <div>{tokens.brandCopy.domainUrl}</div>
                <div>{tokens.brandCopy.socialHandle}</div>
              </div>
              <div
                className="relative h-40 border border-zinc-900/25"
                style={{ backgroundColor: `${tokens.primaryColor}22` }}
              >
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
                  <line x1="0" y1="0" x2="100" y2="100" stroke="#18181B" strokeWidth="0.5" />
                  <line x1="100" y1="0" x2="0" y2="100" stroke="#18181B" strokeWidth="0.5" />
                </svg>
              </div>
            </div>

            <div className="col-span-2 p-5 flex flex-col justify-between items-start">
              <BrandLogoMark logoId={tokens.logoId} color="#09090B" size={24} />
              <span className={`text-xs font-bold leading-tight ${headingFont}`}>
                {tokens.brandName}
              </span>
            </div>
          </div>
        )}

        {gridMode === 'triptych' && (
          <div className="grid grid-cols-12 min-h-[320px]">
            <div className="col-span-4 p-6 flex flex-col justify-between border-r border-zinc-900/20">
              <h3
                className={`leading-[0.95] ${headingFont}`}
                style={{
                  fontSize: `${Math.round(38 * tokens.fontScale)}px`,
                  fontWeight: tokens.headingWeight,
                  letterSpacing: `${tokens.letterSpacingEm}em`,
                }}
              >
                <div>{g1}</div>
                <div>{g2}</div>
                <div>{g3}</div>
              </h3>
              <div className="text-[10px] text-zinc-600">
                <div>{tokens.brandCopy.domainUrl}</div>
                <div>{tokens.brandCopy.socialHandle}</div>
              </div>
            </div>

            <div className="col-span-4 p-5 border-r border-zinc-900/20 flex items-center justify-center">
              <div
                className="relative w-full h-full min-h-[220px] border border-zinc-900/25"
                style={{ backgroundColor: `${tokens.primaryColor}22` }}
              >
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
                  <line x1="0" y1="0" x2="100" y2="100" stroke="#18181B" strokeWidth="0.5" />
                  <line x1="100" y1="0" x2="0" y2="100" stroke="#18181B" strokeWidth="0.5" />
                </svg>
              </div>
            </div>

            <div className="col-span-3 p-6 flex flex-col justify-between border-r border-zinc-900/20">
              <h4
                className={`leading-[0.98] ${headingFont}`}
                style={{
                  fontSize: `${Math.round(32 * tokens.fontScale)}px`,
                  fontWeight: tokens.headingWeight,
                  letterSpacing: `${tokens.letterSpacingEm}em`,
                }}
              >
                All the Brand, One System
              </h4>
            </div>

            <div className="col-span-1 p-4 flex flex-col justify-between items-center">
              <BrandLogoMark logoId={tokens.logoId} color="#09090B" size={20} />
              <span className="text-[10px] font-bold [writing-mode:vertical-rl] rotate-180">
                {tokens.brandName.split(' ')[0]}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * 9. MACRO iOS HOME SCREEN APP ICON MOCKUP (Cohesive with active BrandTokens surfaceTint & primaryColor)
 */
export const IosHomescreenMockupSpecimen: React.FC<SpecimenProps> = ({ tokens }) => {
  const headingFont = getFontClass(tokens.headingFont);
  const shortBrand = tokens.brandName.split(' ')[0];

  return (
    <div
      className="rounded-[24px] pt-10 pl-10 overflow-hidden h-[420px] flex items-end justify-end transition-colors duration-300"
      style={{ backgroundColor: tokens.secondaryColor }}
    >
      {/* Macro iPhone Top-Left Bezel */}
      <div className="w-full h-full bg-[#18181B] rounded-tl-[64px] pt-5 pl-5 shadow-2xl">
        <div
          className="w-full h-full rounded-tl-[48px] pt-6 pl-8 pr-6 pb-8 relative overflow-hidden flex flex-col justify-between transition-colors duration-300"
          style={{
            backgroundColor: tokens.surfaceTint,
            color: '#09090B',
          }}
        >
          {/* Top Notch & 9:41 Status Bar */}
          <div className="flex items-center justify-between">
            <span className="text-xl font-semibold text-zinc-950 tracking-tight pl-4">
              9:41
            </span>
            <div className="w-36 h-9 bg-[#18181B] rounded-b-3xl -mt-6 -mr-6" />
          </div>

          {/* App Icons Grid */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-8 my-auto pl-4">
            {/* Primary Brand App Icon */}
            <div className="flex flex-col items-center gap-2">
              <div
                className="w-24 h-24 bg-white shadow-md flex items-center justify-center transition-transform duration-300 hover:scale-105"
                style={{
                  borderRadius: `${Math.max(16, Math.min(26, tokens.radiusPx * 1.4))}px`,
                }}
              >
                <BrandLogoMark
                  logoId={tokens.logoId}
                  color={tokens.primaryColor}
                  size={46}
                />
              </div>
              <span className={`text-xs font-medium text-zinc-900 ${headingFont}`}>
                {shortBrand}
              </span>
            </div>

            {/* Companion Ecosystem Icon */}
            <div className="flex flex-col items-center gap-2">
              <div
                className="w-24 h-24 shadow-md flex items-center justify-center"
                style={{
                  backgroundColor: tokens.primaryColor,
                  borderRadius: `${Math.max(16, Math.min(26, tokens.radiusPx * 1.4))}px`,
                }}
              >
                <BrandLogoMark
                  logoId={tokens.logoId}
                  color={getReadableTextColor(tokens.primaryColor)}
                  size={42}
                />
              </div>
              <span className={`text-xs font-medium text-zinc-900 ${headingFont}`}>
                {shortBrand} Pro
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 10. MACRO BROWSER TAB & FAVICON MOCKUP (Reference: "Sequel — Browser Tab & URL Bar")
 */
export const BrowserFaviconMockupSpecimen: React.FC<SpecimenProps> = ({ tokens }) => {
  const headingFont = getFontClass(tokens.headingFont);
  const fgAccent = getReadableTextColor(tokens.accentColor);

  return (
    <div
      className="rounded-[24px] pt-10 pl-10 overflow-hidden h-[420px] flex flex-col justify-end transition-colors duration-300"
      style={{ backgroundColor: tokens.darkSurface }}
    >
      <div className="bg-[#E4E4E7] rounded-tl-[28px] overflow-hidden shadow-2xl flex-1 flex flex-col">
        {/* Top Browser Tab Strip */}
        <div className="pt-4 pl-6 flex items-end gap-5">
          <div className="flex items-center gap-2.5 pb-3.5">
            <span className="w-3.5 h-3.5 rounded-full bg-zinc-400" />
            <span className="w-3.5 h-3.5 rounded-full bg-zinc-400" />
            <span className="w-3.5 h-3.5 rounded-full bg-zinc-400" />
          </div>

          {/* Active Browser Tab */}
          <div className="bg-white rounded-t-2xl px-5 py-3 flex items-center gap-3 flex-1 shadow-sm">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors duration-200"
              style={{
                backgroundColor: tokens.accentColor,
                color: fgAccent,
              }}
            >
              <BrandLogoMark logoId={tokens.logoId} color={fgAccent} size={16} />
            </div>
            <span
              className={`text-sm font-medium text-zinc-900 whitespace-nowrap ${headingFont}`}
            >
              {tokens.brandName}
            </span>
          </div>
        </div>

        {/* Browser Address Bar */}
        <div className="bg-white px-6 py-3 flex items-center gap-4 border-b border-zinc-100">
          <ArrowLeft className="w-4 h-4 text-zinc-600" />
          <ArrowRight className="w-4 h-4 text-zinc-300" />
          <RotateCw className="w-4 h-4 text-zinc-600" />

          <div className="flex-1 bg-[#F4F4F5] rounded-full px-4 py-1.5 flex items-center gap-2 text-xs text-zinc-600">
            <Lock className="w-3.5 h-3.5 text-zinc-400" />
            <span className="font-mono">{tokens.brandCopy.domainUrl}</span>
          </div>
        </div>

        {/* Website Hero Peek */}
        <div className="relative flex-1 bg-zinc-900 overflow-hidden">
          <img
            src={tokens.brandCopy.lifestyleImageUrl}
            alt={tokens.brandName}
            className="w-full h-full object-cover opacity-90"
          />
        </div>
      </div>
    </div>
  );
};

/**
 * 11. SOCIAL PROFILE & STATS PILL MOCKUP (100% Cohesive with BrandTokens palette)
 */
export const SocialProfileMockupSpecimen: React.FC<SpecimenProps> = ({
  tokens,
  block,
}) => {
  const [following, setFollowing] = useState(false);
  const headingFont = getFontClass(tokens.headingFont);
  const bodyFont = getFontClass(tokens.bodyFont);
  const shortBrand = tokens.brandName.split(' ')[0];

  if (block.theme === 'brand') {
    return (
      <div
        className="rounded-[24px] p-10 h-[420px] flex items-center justify-center transition-colors duration-200"
        style={{ backgroundColor: tokens.primaryColor }}
      >
        <div
          className="bg-white p-7 shadow-2xl w-full flex items-center justify-between gap-6"
          style={{ borderRadius: `${tokens.radiusPx}px` }}
        >
          <div
            className="p-1 rounded-full shrink-0"
            style={{
              background: `linear-gradient(135deg, ${tokens.primaryColor}, ${tokens.supportColor}, ${tokens.accentColor})`,
            }}
          >
            <div className="w-20 h-20 rounded-full bg-zinc-950 text-white flex flex-col items-center justify-center p-2 border-2 border-white">
              <BrandLogoMark logoId={tokens.logoId} color="#FFFFFF" size={24} />
              <span className={`text-[10px] font-bold mt-1 ${headingFont}`}>
                {shortBrand}
              </span>
            </div>
          </div>

          <div className={`grid grid-cols-3 gap-4 flex-1 text-center ${bodyFont}`}>
            <div>
              <div className="text-sm font-bold text-zinc-950">1,234</div>
              <div className="text-[11px] text-zinc-500">Posts</div>
            </div>
            <div>
              <div className="text-sm font-bold text-zinc-950">84.2K</div>
              <div className="text-[11px] text-zinc-500">Followers</div>
            </div>
            <div>
              <div className="text-sm font-bold text-zinc-950">520</div>
              <div className="text-[11px] text-zinc-500">Following</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-[24px] pt-8 pl-8 overflow-hidden h-[420px] flex flex-col justify-end transition-colors duration-200"
      style={{ backgroundColor: tokens.surfaceTint }}
    >
      <div
        className="text-white rounded-tl-[36px] p-7 space-y-4 flex-1 flex flex-col justify-between"
        style={{ backgroundColor: tokens.darkSurface }}
      >
        <div className="flex items-center gap-3">
          <ArrowLeft className="w-4 h-4 text-white/70" />
          <span
            className={`text-base ${headingFont}`}
            style={{ fontWeight: tokens.headingWeight }}
          >
            {shortBrand}
          </span>
        </div>

        <div className="flex items-center gap-7">
          <div
            className="p-1 rounded-full shrink-0"
            style={{
              background: `linear-gradient(135deg, ${tokens.primaryColor}, ${tokens.supportColor}, ${tokens.accentColor})`,
            }}
          >
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
              <BrandLogoMark
                logoId={tokens.logoId}
                color={tokens.primaryColor}
                size={32}
              />
            </div>
          </div>

          <div className="flex items-center gap-7 text-center">
            <div>
              <div className="text-sm font-bold">367</div>
              <div className="text-[11px] text-white/60">posts</div>
            </div>
            <div>
              <div className="text-sm font-bold">84.5K</div>
              <div className="text-[11px] text-white/60">followers</div>
            </div>
          </div>
        </div>

        <div className={`space-y-1 text-xs leading-relaxed ${bodyFont}`}>
          <div className="font-bold">{tokens.brandName}</div>
          <div className="text-white/75 line-clamp-2">{tokens.brandCopy.socialBio}</div>
          <div
            className="pt-0.5 flex items-center gap-1.5 font-medium"
            style={{ color: tokens.secondaryColor }}
          >
            <Link2 className="w-3.5 h-3.5" />
            <span>{tokens.brandCopy.domainUrl}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            onClick={() => setFollowing(!following)}
            className="py-2 text-xs font-semibold transition-all"
            style={{
              backgroundColor: following ? 'rgba(255,255,255,0.12)' : tokens.primaryColor,
              color: following ? '#FFFFFF' : getReadableTextColor(tokens.primaryColor),
              borderRadius: `${Math.min(tokens.radiusPx, 12)}px`,
            }}
          >
            {following ? 'Following ✓' : 'Follow'}
          </button>
          <button
            className="py-2 text-xs font-semibold border border-white/20 text-white hover:bg-white/5 transition-all"
            style={{
              borderRadius: `${Math.min(tokens.radiusPx, 12)}px`,
            }}
          >
            Message
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * 12. DETACHED CIRCLE ICON + PILL ACTION STACK (Reference: "Início / Contratos / Buscar / Acessar / Mensagem")
 */
export const DetachedPillNavSpecimen: React.FC<SpecimenProps> = ({ tokens }) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const headingFont = getFontClass(tokens.headingFont);

  const navIcons = [Home, FileText, Search, LogIn, MessageSquare];
  const labels = tokens.brandCopy.detachedNavLabels;

  return (
    <div
      className="rounded-[24px] p-10 min-h-[420px] flex items-center justify-center transition-colors duration-200"
      style={{ backgroundColor: tokens.surfaceTint }}
    >
      <div
        className="flex flex-col"
        style={{ gap: `${Math.round(14 * tokens.spacingMultiplier)}px` }}
      >
        {labels.map((label, idx) => {
          const Icon = navIcons[idx % navIcons.length];
          const isActive = activeIndex === idx;
          const pillBg = isActive ? tokens.primaryColor : tokens.secondaryColor;
          const pillFg = getReadableTextColor(pillBg);

          return (
            <button
              key={label}
              onClick={() => setActiveIndex(idx)}
              className="flex items-center gap-3.5 group text-left transition-transform duration-150 hover:translate-x-1"
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-colors duration-200"
                style={{
                  backgroundColor: pillBg,
                  color: pillFg,
                }}
              >
                <Icon className="w-5 h-5" />
              </div>

              <div
                className={`px-7 h-12 flex items-center justify-center whitespace-nowrap transition-all duration-200 ${headingFont}`}
                style={{
                  backgroundColor: pillBg,
                  color: pillFg,
                  borderRadius: `${Math.max(8, tokens.radiusPx)}px`,
                  fontSize: `${Math.round(18 * tokens.fontScale)}px`,
                  fontWeight: isActive ? tokens.headingWeight : tokens.bodyWeight,
                  letterSpacing: `${tokens.letterSpacingEm}em`,
                }}
              >
                {label}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
