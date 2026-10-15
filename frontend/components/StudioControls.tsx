import React, { useState, useRef, useEffect } from 'react';
import {
  BrandTokens,
  FontFamilyOption,
} from '../types';
import {
  getSemanticColorCatalog,
  resolveSemanticColorToken,
  getFontClass,
} from '../utils/styleUtils';
import { ChevronDown, ChevronsUpDown, Check } from 'lucide-react';

export interface SteppedOption<T extends string | number> {
  value: T;
  label: string;
}

interface SteppedPillSliderProps<T extends string | number> {
  options: SteppedOption<T>[];
  value: T;
  onChange: (next: T) => void;
  className?: string;
}

/**
 * Tactile dark stepped track with discrete dots and a draggable/clickable pill indicator
 * matching the reference UI (e.g. Size 135%, Proportion 1.44x, Text size S, Corner radius Full).
 */
export function SteppedPillSlider<T extends string | number>({
  options,
  value,
  onChange,
  className = '',
}: SteppedPillSliderProps<T>) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState(false);

  const activeIndex = Math.max(
    0,
    options.findIndex((o) => o.value === value)
  );

  const selectFromClientX = (clientX: number) => {
    const el = trackRef.current;
    if (!el || options.length === 0) return;
    const rect = el.getBoundingClientRect();
    const pad = 18;
    const usableW = Math.max(1, rect.width - pad * 2);
    const rel = Math.max(0, Math.min(1, (clientX - rect.left - pad) / usableW));
    const idx = Math.round(rel * (options.length - 1));
    const target = options[idx];
    if (target && target.value !== value) {
      onChange(target.value);
    }
  };

  return (
    <div
      ref={trackRef}
      onPointerDown={(e) => {
        e.preventDefault();
        e.currentTarget.setPointerCapture(e.pointerId);
        setDragging(true);
        selectFromClientX(e.clientX);
      }}
      onPointerMove={(e) => {
        if (!dragging) return;
        selectFromClientX(e.clientX);
      }}
      onPointerUp={(e) => {
        if (!dragging) return;
        setDragging(false);
        try {
          e.currentTarget.releasePointerCapture(e.pointerId);
        } catch {
          // ignore
        }
      }}
      onPointerCancel={() => setDragging(false)}
      className={`relative h-9 rounded-xl bg-[#1C1C1E] border border-white/[0.04] px-2 flex items-center justify-between select-none touch-none cursor-ew-resize ${className}`}
    >
      {options.map((opt, idx) => {
        const isSelected = idx === activeIndex;
        return (
          <button
            key={String(opt.value)}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange(opt.value);
            }}
            className="relative flex-1 h-full flex items-center justify-center focus:outline-none"
          >
            {/* Discrete step dot */}
            <span
              className={`w-1 h-1 rounded-full transition-opacity ${
                isSelected ? 'opacity-0' : 'bg-zinc-600 hover:bg-zinc-400'
              }`}
            />

            {/* Active Pill Thumb */}
            {isSelected && (
              <span
                className={`px-2.5 py-1 rounded-lg bg-[#323236] text-white text-[11px] font-medium shadow-md border border-white/[0.08] whitespace-nowrap transition-transform ${
                  dragging ? 'scale-105' : ''
                }`}
              >
                {opt.label}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/**
 * Circular color or transparency-checkerboard swatch matching Neutral 1..10 & Transparent tokens
 */
export const TokenColorSwatchCircle: React.FC<{
  hex: string;
  isTransparent?: boolean;
  size?: number;
}> = ({ hex, isTransparent = false, size = 18 }) => {
  if (!isTransparent) {
    return (
      <span
        className="rounded-full shrink-0 border border-white/15 inline-block"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: hex,
        }}
      />
    );
  }

  return (
    <span
      className="rounded-full shrink-0 border border-white/15 inline-block relative overflow-hidden"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundImage:
          'conic-gradient(#B4B4B8 25%, #E4E4E7 25% 50%, #B4B4B8 50% 75%, #E4E4E7 75%)',
        backgroundSize: '8px 8px',
      }}
    >
      <span
        className="absolute inset-0"
        style={{
          backgroundColor: hex,
          opacity: 0.38,
        }}
      />
    </span>
  );
};

interface SemanticColorPickerProps {
  tokens: BrandTokens;
  value: string | undefined;
  fallbackId?: string;
  onChange: (tokenId: string) => void;
}

export const SemanticColorTokenPicker: React.FC<SemanticColorPickerProps> = ({
  tokens,
  value,
  fallbackId = 'Neutral 10',
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const catalog = getSemanticColorCatalog(tokens);
  const current = resolveSemanticColorToken(value, tokens, fallbackId);

  useEffect(() => {
    if (!open) return;
    const handleOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [open]);

  const brandItems = catalog.filter((c) => c.group === 'Brand Colors');
  const neutralItems = catalog.filter((c) => c.group === 'Neutrals');

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full h-9 px-3 rounded-xl bg-[#242427] hover:bg-[#2C2C30] border border-white/[0.06] flex items-center justify-between gap-2 text-xs text-white transition"
      >
        <span className="flex items-center gap-2 min-w-0">
          <TokenColorSwatchCircle
            hex={current.hex}
            isTransparent={current.isTransparent}
            size={16}
          />
          <span className="truncate">{current.label}</span>
        </span>
        <ChevronsUpDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
      </button>

      {open && (
        <div className="mt-1.5 w-full rounded-2xl bg-[#1C1C1F] border border-white/10 shadow-2xl p-1.5 max-h-64 overflow-y-auto z-50 space-y-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="px-2.5 py-1 text-[10px] font-medium text-zinc-400">
            Brand
          </div>
          {brandItems.map((item) => {
            const isSelected = item.id === current.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onChange(item.id);
                  setOpen(false);
                }}
                className={`w-full px-2.5 py-2 rounded-xl flex items-center justify-between text-xs transition ${
                  isSelected
                    ? 'bg-[#35353A] text-white font-medium'
                    : 'text-zinc-200 hover:bg-white/[0.06]'
                }`}
              >
                <span className="flex items-center gap-2.5 truncate">
                  <TokenColorSwatchCircle
                    hex={item.hex}
                    isTransparent={item.isTransparent}
                    size={18}
                  />
                  <span className="truncate">{item.label}</span>
                </span>
                {isSelected && <Check className="w-3.5 h-3.5 text-zinc-300 shrink-0" />}
              </button>
            );
          })}

          <div className="px-2.5 pt-2 pb-1 text-[10px] font-medium text-zinc-400">
            Neutrals
          </div>
          {neutralItems.map((item) => {
            const isSelected = item.id === current.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onChange(item.id);
                  setOpen(false);
                }}
                className={`w-full px-2.5 py-2 rounded-xl flex items-center justify-between text-xs transition ${
                  isSelected
                    ? 'bg-[#35353A] text-white font-medium'
                    : 'text-zinc-200 hover:bg-white/[0.06]'
                }`}
              >
                <span className="flex items-center gap-2.5 truncate">
                  <TokenColorSwatchCircle
                    hex={item.hex}
                    isTransparent={item.isTransparent}
                    size={18}
                  />
                  <span className="truncate">{item.label}</span>
                </span>
                {isSelected && <Check className="w-3.5 h-3.5 text-zinc-300 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const FONT_CATALOG: Array<{
  family: FontFamilyOption;
  source: 'Google' | 'Curated';
  displaySample?: string;
}> = [
  { family: 'Plus Jakarta Sans', source: 'Curated' },
  { family: 'Inter', source: 'Curated' },
  { family: 'Space Grotesk', source: 'Curated' },
  { family: 'Syne', source: 'Curated' },
  { family: 'Instrument Serif', source: 'Curated' },
  { family: 'Fraunces', source: 'Curated' },
  { family: 'DM Sans', source: 'Curated' },
  { family: 'Outfit', source: 'Google' },
  { family: 'Playfair Display', source: 'Google' },
  { family: 'JetBrains Mono', source: 'Curated' },
  { family: 'ABeeZee', source: 'Google' },
  { family: 'Abel', source: 'Google' },
  { family: 'Abhaya Libre', source: 'Google' },
  { family: 'Aboreto', source: 'Google', displaySample: 'ABORETO' },
  { family: 'Abril Fatface', source: 'Google' },
  { family: 'Abyssinica SIL', source: 'Google' },
  { family: 'Aclonica', source: 'Google' },
];

interface FontSearchPickerProps {
  value: FontFamilyOption;
  onChange: (next: FontFamilyOption) => void;
}

export const FontSearchPicker: React.FC<FontSearchPickerProps> = ({
  value,
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const [sourceFilter, setSourceFilter] = useState<'Google' | 'Curated' | 'All'>('Google');
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const handleOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [open]);

  const filteredFonts = FONT_CATALOG.filter((item) => {
    const matchesSource =
      sourceFilter === 'All' ? true : item.source === sourceFilter;
    const matchesQuery = item.family
      .toLowerCase()
      .includes(search.trim().toLowerCase());
    return matchesSource && matchesQuery;
  });

  // Always fallback to all matching fonts if the current source filter + query has none
  const displayedFonts =
    filteredFonts.length > 0
      ? filteredFonts
      : FONT_CATALOG.filter((item) =>
          item.family.toLowerCase().includes(search.trim().toLowerCase())
        );

  return (
    <div ref={containerRef} className="relative flex-1 min-w-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full h-9 px-3 rounded-xl bg-[#1C1C1E] hover:bg-[#252529] border border-white/[0.05] flex items-center justify-between gap-2 text-xs text-white transition"
      >
        <span className={`truncate ${getFontClass(value)}`}>{value}</span>
        <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
      </button>

      {open && (
        <div className="mt-2 w-[236px] right-0 rounded-2xl bg-[#1C1C1F] border border-white/10 shadow-2xl p-2 space-y-2 z-50">
          {/* Source Selector (Google / Curated / All) */}
          <div className="relative">
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value as any)}
              className="w-full h-9 px-3 rounded-xl bg-[#2A2A2E] text-xs text-white focus:outline-none cursor-pointer appearance-none"
            >
              <option value="Google" className="bg-[#1C1C1F]">
                Google
              </option>
              <option value="Curated" className="bg-[#1C1C1F]">
                Licensed & Studio
              </option>
              <option value="All" className="bg-[#1C1C1F]">
                All Fonts
              </option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Search Input with crisp white ring */}
          <input
            type="text"
            autoFocus
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className="w-full h-9 px-3 rounded-xl bg-[#141416] text-xs text-white placeholder-zinc-500 border border-white/80 focus:outline-none focus:ring-1 focus:ring-white"
          />

          {/* Font List rendered in each font's own typeface */}
          <div className="max-h-56 overflow-y-auto space-y-0.5 pt-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {displayedFonts.map((f) => {
              const isSelected = f.family === value;
              return (
                <button
                  key={f.family}
                  type="button"
                  onClick={() => {
                    onChange(f.family);
                    setOpen(false);
                  }}
                  className={`w-full px-3 py-2.5 rounded-xl text-left text-sm transition flex items-center justify-between ${getFontClass(
                    f.family
                  )} ${
                    isSelected
                      ? 'bg-[#38383D] text-white'
                      : 'text-zinc-200 hover:bg-[#2E2E33]'
                  }`}
                >
                  <span className="truncate">
                    {f.displaySample || f.family}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
