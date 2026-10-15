import {
  BrandTokens,
  SubElementStyleOverrides,
  BrandPolicies,
} from '../types';
import {
  hexToHsl,
  getNeutralRamp10,
  getFontFamilyByRole,
  resolveSemanticColorToken,
  getReadableTextColor,
} from './styleUtils';
import {
  resolveCornerRadiusCss,
  resolveBorderWidthPx,
  resolveControlSizePx,
  resolveWeightValue,
  resolveTextMetrics,
  getUnifiedDesignMetrics,
} from './overrideUtils';
import {
  SHADCN_ALL_COMPONENTS,
  ShadcnComponentDef,
} from './shadcnAllComponentsCatalog';

export type ShadcnPrimitiveId = string;

export const SHADCN_PRIMITIVES_CATALOG: ShadcnComponentDef[] =
  SHADCN_ALL_COMPONENTS;

function toHslCssTuple(hex: string): string {
  const { h, s, l } = hexToHsl(hex);
  return `${h} ${s}% ${l}%`;
}

/**
 * Generates the complete `globals.css` file containing all shadcn/ui CSS variables
 * plus Koyot's extended Neutral 1–10 ramp and 4 semantic font roles.
 */
export function generateBrandGlobalsCss(tokens: BrandTokens): string {
  const metrics = getUnifiedDesignMetrics(tokens);
  const neutrals = getNeutralRamp10(tokens.neutralTone);
  const fgOnPrimary = getReadableTextColor(tokens.primaryColor);
  const fgOnSecondary = getReadableTextColor(tokens.secondaryColor);
  const fgOnAccent = getReadableTextColor(tokens.accentColor);

  const uiFont = getFontFamilyByRole(tokens, 'ui');
  const brandFont = getFontFamilyByRole(tokens, 'brand');
  const editorialFont = getFontFamilyByRole(tokens, 'editorial');
  const dataFont = getFontFamilyByRole(tokens, 'data');

  return `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* ${tokens.brandName} — ${tokens.stylePresetName} Brand OS Tokens */
    --background: ${toHslCssTuple(neutrals[0])};
    --foreground: ${toHslCssTuple(neutrals[9])};

    --card: ${toHslCssTuple(neutrals[0])};
    --card-foreground: ${toHslCssTuple(neutrals[9])};

    --popover: ${toHslCssTuple(neutrals[0])};
    --popover-foreground: ${toHslCssTuple(neutrals[9])};

    --primary: ${toHslCssTuple(tokens.primaryColor)};
    --primary-foreground: ${toHslCssTuple(fgOnPrimary)};

    --secondary: ${toHslCssTuple(tokens.secondaryColor)};
    --secondary-foreground: ${toHslCssTuple(fgOnSecondary)};

    --muted: ${toHslCssTuple(neutrals[2])};
    --muted-foreground: ${toHslCssTuple(neutrals[6])};

    --accent: ${toHslCssTuple(tokens.accentColor)};
    --accent-foreground: ${toHslCssTuple(fgOnAccent)};

    --support: ${toHslCssTuple(tokens.supportColor)};
    --surface-tint: ${toHslCssTuple(tokens.surfaceTint)};

    --destructive: 0 84% 60%;
    --destructive-foreground: 0 0% 98%;

    --border: ${toHslCssTuple(neutrals[3])};
    --input: ${toHslCssTuple(neutrals[3])};
    --ring: ${toHslCssTuple(tokens.primaryColor)};

    --radius: ${tokens.radiusPx}px;
    --border-width: ${tokens.borderWidth}px;

    /* 4 Semantic Font Roles */
    --font-ui: "${uiFont}", sans-serif;
    --font-brand: "${brandFont}", sans-serif;
    --font-editorial: "${editorialFont}", serif;
    --font-data: "${dataFont}", monospace;

    /* Neutral 1–10 Ramp (${tokens.neutralTone}) */
${neutrals.map((hex, i) => `    --neutral-${i + 1}: ${hex};`).join('\n')}

    /* Koyot Living Brand System Scoped Tokens */
    --page: ${neutrals[0]};
    --surface: ${neutrals[1]};
    --surface-2: ${neutrals[2]};
    --surface-3: ${neutrals[3]};
    --raised: #ffffff;
    --field: ${neutrals[1]};
    --fg: ${neutrals[9]};
    --fg-2: ${neutrals[7]};
    --fg-3: ${neutrals[6]};
    --fg-disabled: ${neutrals[5]};
    --on-accent: ${fgOnPrimary};
    --line: ${neutrals[3]};
    --line-strong: ${neutrals[4]};
    --control: ${neutrals[5]};
    --ink: ${neutrals[9]};
    --brand-primary: ${tokens.primaryColor};
    --brand-primary-wash: ${tokens.surfaceTint};
    --accent-wash: ${tokens.surfaceTint};
    --control-sm: ${metrics.controlHeightSm}px;
    --control-md: ${metrics.controlHeightMd}px;
    --control-lg: ${metrics.controlHeightLg}px;
    --radius-sm: ${Math.max(0, Math.round(tokens.radiusPx * 0.35))}px;
    --radius-md: ${Math.max(0, Math.round(tokens.radiusPx * 0.6))}px;
    --radius-field: ${Math.max(0, Math.round(tokens.radiusPx * 0.75))}px;
    --radius-panel: ${tokens.radiusPx}px;
    --radius-control: ${tokens.radiusPx >= 20 ? '999px' : `${tokens.radiusPx}px`};
  }

  .dark {
    --background: ${toHslCssTuple(neutrals[9])};
    --foreground: ${toHslCssTuple(neutrals[0])};
    --card: ${toHslCssTuple(neutrals[8])};
    --card-foreground: ${toHslCssTuple(neutrals[0])};
    --muted: ${toHslCssTuple(neutrals[8])};
    --muted-foreground: ${toHslCssTuple(neutrals[5])};
    --border: ${toHslCssTuple(neutrals[7])};
    --input: ${toHslCssTuple(neutrals[7])};
  }
}
`;
}

export function generatePortalTsxCode(): string {
  return `'use client';

import * as React from 'react';

const KoyotPortalContext = React.createContext<HTMLElement | null | undefined>(undefined);

export function KoyotPortalProvider({ children }: { children: React.ReactNode }) {
  const [container, setContainer] = React.useState<HTMLElement | null>(null);
  return (
    <KoyotPortalContext.Provider value={container}>
      {children}
      <div ref={setContainer} data-koyot-portal="" />
    </KoyotPortalContext.Provider>
  );
}

let fallback: HTMLElement | null = null;

function getFallbackContainer() {
  if (typeof document === 'undefined') return null;
  if (fallback && fallback.isConnected) return fallback;
  fallback = document.createElement('div');
  fallback.className = 'koyot';
  fallback.setAttribute('data-system', 'koyot');
  fallback.setAttribute('data-koyot-portal', 'fallback');
  document.body.appendChild(fallback);
  return fallback;
}

export function useKoyotPortal() {
  const scoped = React.useContext(KoyotPortalContext);
  const [own, setOwn] = React.useState<HTMLElement | null>(null);
  React.useEffect(() => {
    if (scoped === undefined) setOwn(getFallbackContainer());
  }, [scoped]);
  return scoped === undefined ? own : scoped;
}
`;
}

export function generateUtilsTsCode(): string {
  return `import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      radius: ["field", "panel", "sheet", "control"],
      shadow: ["card", "menu", "overlay"],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function mergeClass<State>(
  base: ClassValue,
  className: string | ((state: State) => string | undefined) | undefined
): string | ((state: State) => string) {
  return typeof className === "function"
    ? (state: State) => cn(base, className(state))
    : cn(base, className);
}
`;
}

/**
 * Generates an Agent \`SKILL.md\` file tailored to the user's live BrandTokens
 * so AI coding agents follow the brand's rules, tokens, and verified component contracts.
 */
export function generateBrandSkillMd(
  tokens: BrandTokens,
  policies?: BrandPolicies
): string {
  const slug = tokens.brandName.toLowerCase().replace(/\s+/g, '-');
  const uiFont = getFontFamilyByRole(tokens, 'ui');
  const brandFont = getFontFamilyByRole(tokens, 'brand');
  const dataFont = getFontFamilyByRole(tokens, 'data');

  const lockedTokensList = policies?.lockedTokens?.length
    ? policies.lockedTokens.join(', ')
    : 'None';

  return `---
name: ${slug}
description: ${tokens.brandName} (${tokens.stylePresetName}) design system rules for this project's UI. Use when building or changing any screen, component, form or style.
---

# ${tokens.brandName} — ${tokens.stylePresetName} Design System

${tokens.brandCopy.manifestoBody}

## Setup
Wrap the root layout in \`<KoyotPortalProvider>\` from \`@/lib/portal\` so overlays (dialogs, popovers, selects) inherit every brand token:
\`\`\`tsx
import { KoyotPortalProvider } from '@/lib/portal';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="koyot min-h-screen bg-background text-foreground antialiased font-[family-name:var(--font-ui)]">
        <KoyotPortalProvider>{children}</KoyotPortalProvider>
      </body>
    </html>
  );
}
\`\`\`

## Brand Governance & Policies (KDS-07)
- **Institutional Locked Tokens**: \`${lockedTokensList}\` (Do NOT alter these core brand assets without owner approval).
- **WCAG 2.2 AA Enforcement**: ${
    policies?.enforceWcagAA !== false
      ? 'STRICT (All text-to-background contrast pairs MUST be >= 4.5:1)'
      : 'Advisory'
  }.
- **Radius Scale Constraint**: ${
    policies?.disallowArbitraryRadius !== false
      ? 'STRICT (Only use canonical semantic radius classes: rounded-none, rounded-sm, rounded-md, rounded-lg, rounded-full. Never use arbitrary pixels like rounded-[13px])'
      : 'Flexible'
  }.
- **Font Scale Constraint**: ${
    policies?.disallowArbitraryFonts !== false
      ? 'STRICT (Use only designated font families: var(--font-brand), var(--font-ui), var(--font-data))'
      : 'Flexible'
  }.

## Global Rules
1. **${slug}-components-first (MUST)**: Use a verified ${tokens.brandName} primitive from \`@/components/ui/*\` (Button, Input, Dialog, Slider) before writing custom markup.
2. **${slug}-tokens-only (MUST)**: Use only semantic token classes (\`bg-background\`, \`bg-card\`, \`text-foreground\`, \`bg-primary\`, \`border-border\`, \`h-[var(--control-md)]\`); never hardcode raw hex values or arbitrary pixel sizes.
3. **${slug}-do-rule (MUST)**: ${tokens.brandCopy.doRuleTitle}.
4. **${slug}-dont-rule (NEVER)**: ${tokens.brandCopy.dontRuleTitle}.
5. **${slug}-contrast-compliance (MUST)**: Always pair foreground and background tokens that pass WCAG AA 4.5:1 minimum contrast.

## Active Brand Tokens
- **Brand Primary (\`--primary\`)**: \`${tokens.primaryColor}\`
- **Brand Secondary (\`--secondary\`)**: \`${tokens.secondaryColor}\`
- **Brand Accent (\`--accent\`)**: \`${tokens.accentColor}\`
- **Surface Wash (\`--surface-tint\`)**: \`${tokens.surfaceTint}\`
- **Neutral Ramp**: \`${tokens.neutralTone}\`
- **Typography**:
  - UI (\`--font-ui\`): \`${uiFont}\` (weight \`${tokens.bodyWeight}\`)
  - Brand Display (\`--font-brand\`): \`${brandFont}\` (weight \`${tokens.headingWeight}\`, tracking \`${tokens.letterSpacingEm}em\`)
  - Data / Tabular (\`--font-data\`): \`${dataFont}\`
- **Geometry & Scale**:
  - Corner Radius (\`--radius\`): \`${tokens.radiusPx}px\`
  - Font Scale: \`${Math.round(tokens.fontScale * 100)}%\`
  - Spacing Multiplier: \`${Math.round(tokens.spacingMultiplier * 100)}%\`
`;
}

/**
 * Generates authentic, copy-ready React + Radix UI + Tailwind `.tsx` source code
 * for any of the 56 shadcn/ui components incorporating both BrandTokens and sub-element overrides.
 */
export function generatePrimitiveTsxCode(
  primitiveId: string,
  tokens: BrandTokens,
  subOverrides: Record<string, SubElementStyleOverrides> = {}
): string {
  const uiFont = getFontFamilyByRole(tokens, 'ui');
  const brandFont = getFontFamilyByRole(tokens, 'brand');
  const dataFont = getFontFamilyByRole(tokens, 'data');

  switch (primitiveId) {
    case 'slider': {
      const labelOvr = subOverrides.label;
      const trackOvr = subOverrides.track;
      const thumbOvr = subOverrides.thumb;

      const trackHeightPx = resolveControlSizePx(trackOvr?.controlSize || 'XL', 34);
      const thumbSizePx = Math.max(16, trackHeightPx - 8);
      const trackRadius = resolveCornerRadiusCss(trackOvr || { cornerRadius: 'Full' }, 9999);
      const thumbRadius = resolveCornerRadiusCss(thumbOvr || { cornerRadius: 'Full' }, 9999);
      const trackBg = trackOvr?.fillToken
        ? resolveSemanticColorToken(trackOvr.fillToken, tokens).cssColor
        : '#F2F2F0';
      const activeBar = trackOvr?.accentFillToken
        ? resolveSemanticColorToken(trackOvr.accentFillToken, tokens).cssColor
        : tokens.primaryColor;
      const thumbFill = thumbOvr?.fillToken
        ? resolveSemanticColorToken(thumbOvr.fillToken, tokens).cssColor
        : '#FFFFFF';
      const labelMetrics = resolveTextMetrics(tokens, labelOvr?.textSize || 'S', 14);
      const labelWeight = resolveWeightValue(labelOvr?.fontWeight || 'Medium', 500);

      return `"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "@/lib/utils"

export interface BrandSliderProps
  extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  label?: string
  showValue?: boolean
}

/**
 * ${tokens.brandName} (${tokens.stylePresetName}) — Customized Slider Primitive
 */
const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  BrandSliderProps
>(({ className, label, showValue = true, defaultValue = [48], value, ...props }, ref) => {
  const currentVal = value ?? defaultValue

  return (
    <div className="w-full space-y-2">
      {(label || showValue) && (
        <div className="flex items-center justify-between">
          {label && (
            <span
              style={{
                fontFamily: '"${getFontFamilyByRole(tokens, labelOvr?.fontRole || 'ui')}", sans-serif',
                fontSize: "${labelMetrics.fontSizePx}px",
                lineHeight: "${labelMetrics.lineHeightPx}px",
                fontWeight: ${labelWeight},
              }}
              className="text-foreground"
            >
              {label}
            </span>
          )}
          {showValue && (
            <span
              style={{ fontFamily: '"${dataFont}", monospace' }}
              className="text-xs text-muted-foreground"
            >
              {currentVal?.[0]}
            </span>
          )}
        </div>
      )}

      <SliderPrimitive.Root
        ref={ref}
        defaultValue={defaultValue}
        value={value}
        className={cn(
          "relative flex w-full touch-none select-none items-center",
          className
        )}
        {...props}
      >
        <SliderPrimitive.Track
          className="relative w-full grow overflow-hidden transition-colors"
          style={{
            height: "${trackHeightPx}px",
            backgroundColor: "${trackBg}",
            borderRadius: "${trackRadius}",
          }}
        >
          <SliderPrimitive.Range
            className="absolute h-full"
            style={{
              backgroundColor: "${activeBar}",
              borderRadius: "${trackRadius}",
            }}
          />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb
          className="block shadow transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:scale-105"
          style={{
            width: "${thumbSizePx}px",
            height: "${thumbSizePx}px",
            backgroundColor: "${thumbFill}",
            borderRadius: "${thumbRadius}",
          }}
        />
      </SliderPrimitive.Root>
    </div>
  )
})
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
`;
    }

    case 'button': {
      return `'use client';

import * as React from 'react';
import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn, mergeClass } from '@/lib/utils';

export const buttonVariants = cva(
  [
    'group/button relative inline-flex max-w-full shrink-0 items-center justify-center gap-2 rounded-[var(--radius)] font-[family-name:var(--font-brand)] font-medium tracking-[var(--tracking-brand)] whitespace-nowrap select-none',
    'transition-all duration-150 ease-out outline-none',
    'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'active:not-disabled:scale-[0.98]',
    'disabled:cursor-not-allowed disabled:opacity-50',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0',
  ],
  {
    variants: {
      variant: {
        primary:
          'bg-primary text-primary-foreground shadow-sm hover:opacity-90 active:opacity-95',
        glow:
          'bg-primary text-primary-foreground shadow-[0_0_16px_rgba(var(--primary),0.35)] hover:shadow-[0_0_24px_rgba(var(--primary),0.5)]',
        solid:
          'bg-foreground text-background hover:bg-foreground/90 active:bg-foreground/80',
        secondary:
          'bg-secondary text-secondary-foreground shadow-sm hover:opacity-90',
        outline:
          'border border-[length:var(--border-width,1px)] border-border bg-background text-foreground hover:bg-muted',
        ghost:
          'bg-transparent text-foreground hover:bg-muted',
        destructive:
          'bg-destructive text-destructive-foreground shadow-sm hover:opacity-90',
        link:
          'h-auto min-h-6 gap-1 rounded-sm bg-transparent px-0 text-primary underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-[var(--control-sm)] px-3 text-xs',
        md: 'h-[var(--control-md)] px-4 text-sm',
        lg: 'h-[var(--control-lg)] px-6 text-base',
        'icon-sm': 'size-[var(--control-sm)] p-0',
        icon: 'size-[var(--control-md)] p-0',
        'icon-lg': 'size-[var(--control-lg)] p-0',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
);

function Spinner({ className, size = 16 }: { className?: string; size?: number }) {
  return (
    <svg
      data-slot="spinner"
      viewBox="0 0 16 16"
      width={size}
      height={size}
      fill="none"
      aria-hidden="true"
      className={cn('animate-spin', className)}
    >
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2" />
      <path d="M8 2a6 6 0 0 1 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export type ButtonProps = ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants> & {
    pending?: boolean;
    icon?: React.ReactNode;
  };

export function Button({
  className,
  variant,
  size,
  pending,
  icon,
  disabled,
  children: content,
  ...props
}: ButtonProps) {
  const children =
    typeof content === 'string' ? (
      <span data-slot="button-text" className="min-w-0 truncate">
        {content}
      </span>
    ) : (
      content
    );

  return (
    <ButtonPrimitive
      data-slot="button"
      data-variant={variant ?? 'primary'}
      className={mergeClass(buttonVariants({ variant, size }), className)}
      disabled={disabled || pending}
      aria-busy={pending || undefined}
      {...props}
    >
      {pending ? (
        <span className="inline-flex items-center gap-2">
          <Spinner size={14} />
          {size?.startsWith('icon') ? null : children}
        </span>
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </ButtonPrimitive>
  );
}
`;
    }

    case 'input': {
      return `'use client';

import * as React from 'react';
import { Input as InputPrimitive } from '@base-ui/react/input';
import { cva, type VariantProps } from 'class-variance-authority';
import { mergeClass } from '@/lib/utils';

export const inputVariants = cva(
  [
    'w-full min-w-0 rounded-[var(--radius)] border border-[length:var(--border-width,1px)] border-input bg-background px-3 text-foreground font-[family-name:var(--font-ui)]',
    'placeholder:text-muted-foreground transition-colors outline-none',
    'hover:not-disabled:not-aria-invalid:border-ring/50',
    'focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20',
    'aria-invalid:border-destructive',
    'disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:placeholder:text-muted-foreground',
  ],
  {
    variants: {
      size: {
        sm: 'h-[var(--control-sm)] text-xs',
        md: 'h-[var(--control-md)] text-sm',
        lg: 'h-[var(--control-lg)] text-base',
      },
    },
    defaultVariants: { size: 'md' },
  }
);

export type InputProps = Omit<InputPrimitive.Props, 'size'> &
  VariantProps<typeof inputVariants>;

export function Input({ className, size, type = 'text', ...props }: InputProps) {
  return (
    <InputPrimitive
      data-slot="input"
      type={type}
      className={mergeClass(inputVariants({ size }), className)}
      {...props}
    />
  );
}
`;
    }

    case 'dialog': {
      return `'use client';

import * as React from 'react';
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog';
import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';
import { cn, mergeClass } from '@/lib/utils';
import { useKoyotPortal } from '@/lib/portal';

export const backdropClass = cn(
  'fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity duration-200',
  'data-[starting-style]:opacity-0 data-[ending-style]:opacity-0'
);

export const dialogVariants = cva(
  [
    'fixed start-1/2 top-1/2 z-50 flex max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col gap-4 overflow-y-auto rounded-[calc(var(--radius)+4px)] border border-border bg-card p-6 text-card-foreground shadow-2xl outline-none duration-200',
    'rtl:translate-x-1/2',
    'transition-[opacity,scale] duration-200 ease-out',
    'data-[starting-style]:scale-95 data-[starting-style]:opacity-0 data-[ending-style]:scale-95 data-[ending-style]:opacity-0',
  ],
  {
    variants: {
      size: {
        sm: 'max-w-sm',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        full: 'max-w-4xl',
      },
    },
    defaultVariants: { size: 'md' },
  }
);

export function Dialog(props: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

export function DialogTrigger(props: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

export type DialogContentProps = DialogPrimitive.Popup.Props &
  VariantProps<typeof dialogVariants> & {
    showClose?: boolean;
  };

export function DialogContent({
  className,
  size,
  showClose = true,
  children,
  ...props
}: DialogContentProps) {
  const container = useKoyotPortal();
  return (
    <DialogPrimitive.Portal container={container}>
      <DialogPrimitive.Backdrop data-slot="dialog-backdrop" className={backdropClass} />
      <DialogPrimitive.Popup
        data-slot="dialog-content"
        className={mergeClass(dialogVariants({ size }), className)}
        {...props}
      >
        {children}
        {showClose && (
          <DialogPrimitive.Close
            aria-label="Close"
            className="absolute end-4 top-4 rounded-sm p-1 text-muted-foreground opacity-70 transition-opacity hover:opacity-100 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <X className="h-4 w-4" />
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Popup>
    </DialogPrimitive.Portal>
  );
}

export function DialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="dialog-header" className={cn('flex flex-col gap-1.5 pe-8', className)} {...props} />;
}

export function DialogFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="dialog-footer" className={cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)} {...props} />;
}

export function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return <DialogPrimitive.Title data-slot="dialog-title" className={mergeClass('text-lg font-semibold leading-none tracking-tight font-[family-name:var(--font-brand)]', className)} {...props} />;
}

export function DialogDescription({ className, ...props }: DialogPrimitive.Description.Props) {
  return <DialogPrimitive.Description data-slot="dialog-description" className={mergeClass('text-sm text-muted-foreground', className)} {...props} />;
}

export function DialogClose(props: DialogPrimitive.Close.Props) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}
`;
    }

    default: {
      const meta =
        SHADCN_ALL_COMPONENTS.find((m) => m.id === primitiveId) ||
        SHADCN_ALL_COMPONENTS[0];
      const compSymbol = meta.name.replace(/[^a-zA-Z0-9]/g, '');

      return `/**
 * @koyot/status development (Roadmap KDS-01)
 * Component: ${meta.name} (${primitiveId})
 * 
 * ⚠️ ATENÇÃO: Este componente está em desenvolvimento no roadmap de fidelidade canônica Base UI.
 * 
 * Conforme o relatório de auditoria e arquitetura KDS-01 / KDS-03:
 * Componentes sem exportador canônico validado NÃO geram substitutos genéricos de <div>
 * para não quebrar semântica, foco de teclado e acessibilidade no seu projeto consumidor.
 * 
 * Primitivas canônicas disponíveis na Fase 0:
 * - Button (components/ui/button.tsx)
 * - Input (components/ui/input.tsx)
 * - Dialog (components/ui/dialog.tsx)
 * - Slider (components/ui/slider.tsx)
 */

export const ${compSymbol} = () => {
  throw new Error(
    "O componente '${meta.name}' está em desenvolvimento no Koyot (Fase 1 do roadmap KDS-01). Use Button, Input, Dialog ou Slider."
  );
};
`;
    }
  }
}

export interface ShadcnRegistryItemJson {
  $schema: string;
  name: string;
  type: 'registry:ui' | 'registry:style' | 'registry:block';
  title: string;
  author: string;
  description: string;
  dependencies: string[];
  registryDependencies?: string[];
  cssVars: {
    light: Record<string, string>;
    dark: Record<string, string>;
  };
  files: Array<{
    path: string;
    type: 'registry:ui' | 'registry:component';
    target?: string;
    content: string;
  }>;
}

/**
 * Builds the official `registry-item.json` payload compatible with `npx shadcn@latest add <url>`
 */
export function buildShadcnRegistryItem(
  primitiveId: string | 'all',
  tokens: BrandTokens,
  allPrimitiveOverrides: Record<
    string,
    Record<string, SubElementStyleOverrides>
  > = {},
  policies?: BrandPolicies
): ShadcnRegistryItemJson {
  const neutrals = getNeutralRamp10(tokens.neutralTone);
  const fgOnPrimary = getReadableTextColor(tokens.primaryColor);
  const fgOnSecondary = getReadableTextColor(tokens.secondaryColor);
  const fgOnAccent = getReadableTextColor(tokens.accentColor);

  const cssVars = {
    light: {
      background: toHslCssTuple(neutrals[0]),
      foreground: toHslCssTuple(neutrals[9]),
      card: toHslCssTuple(neutrals[0]),
      'card-foreground': toHslCssTuple(neutrals[9]),
      popover: toHslCssTuple(neutrals[0]),
      'popover-foreground': toHslCssTuple(neutrals[9]),
      primary: toHslCssTuple(tokens.primaryColor),
      'primary-foreground': toHslCssTuple(fgOnPrimary),
      secondary: toHslCssTuple(tokens.secondaryColor),
      'secondary-foreground': toHslCssTuple(fgOnSecondary),
      muted: toHslCssTuple(neutrals[2]),
      'muted-foreground': toHslCssTuple(neutrals[6]),
      accent: toHslCssTuple(tokens.accentColor),
      'accent-foreground': toHslCssTuple(fgOnAccent),
      border: toHslCssTuple(neutrals[3]),
      input: toHslCssTuple(neutrals[3]),
      ring: toHslCssTuple(tokens.primaryColor),
      radius: `${tokens.radiusPx}px`,
      'font-sans': `"${getFontFamilyByRole(tokens, 'ui')}", sans-serif`,
      'font-heading': `"${getFontFamilyByRole(tokens, 'brand')}", sans-serif`,
      'font-mono': `"${getFontFamilyByRole(tokens, 'data')}", monospace`,
    },
    dark: {
      background: toHslCssTuple(neutrals[9]),
      foreground: toHslCssTuple(neutrals[0]),
      card: toHslCssTuple(neutrals[8]),
      'card-foreground': toHslCssTuple(neutrals[0]),
      primary: toHslCssTuple(tokens.primaryColor),
      'primary-foreground': toHslCssTuple(fgOnPrimary),
      border: toHslCssTuple(neutrals[7]),
      input: toHslCssTuple(neutrals[7]),
      ring: toHslCssTuple(tokens.primaryColor),
    },
  };

  if (primitiveId === 'all') {
    const deps = new Set<string>([
      '@base-ui/react',
      'class-variance-authority',
      'clsx',
      'tailwind-merge',
      'lucide-react',
    ]);
    const files: Array<{
      path: string;
      type: 'registry:ui' | 'registry:component';
      target?: string;
      content: string;
    }> = [
      {
        path: 'lib/utils.ts',
        target: 'lib/utils.ts',
        type: 'registry:ui',
        content: generateUtilsTsCode(),
      },
      {
        path: 'lib/portal.tsx',
        target: 'lib/portal.tsx',
        type: 'registry:ui',
        content: generatePortalTsxCode(),
      },
    ];

    SHADCN_ALL_COMPONENTS.forEach((meta) => {
      files.push({
        path: `components/ui/${meta.id}.tsx`,
        target: `components/ui/${meta.id}.tsx`,
        type: 'registry:ui' as const,
        content: generatePrimitiveTsxCode(
          meta.id,
          tokens,
          allPrimitiveOverrides[meta.id] || {}
        ),
      });
    });

    files.push({
      path: '.agents/skills/brand-system/SKILL.md',
      target: '.agents/skills/brand-system/SKILL.md',
      type: 'registry:ui' as const,
      content: generateBrandSkillMd(tokens, policies),
    });

    if (policies) {
      files.push({
        path: 'brand-policy.json',
        target: 'brand-policy.json',
        type: 'registry:ui' as const,
        content: JSON.stringify(policies, null, 2),
      });
    }

    return {
      $schema: 'https://ui.shadcn.com/schema/registry-item.json',
      name: `${tokens.brandName.toLowerCase().replace(/\s+/g, '-')}-design-system`,
      type: 'registry:ui',
      title: `${tokens.brandName} (${tokens.stylePresetName}) Koyot UI System`,
      author: 'Koyot Living Brand OS',
      description: `Canonical Base UI primitive collection (Fase 0: Button, Input, Dialog, Slider) + SKILL.md customized for ${tokens.brandName}.`,
      dependencies: Array.from(deps),
      cssVars,
      files,
    };
  }

  const meta =
    SHADCN_ALL_COMPONENTS.find((m) => m.id === primitiveId) ||
    SHADCN_ALL_COMPONENTS[0];

  const dependencies = [
    '@base-ui/react',
    'class-variance-authority',
    'clsx',
    'tailwind-merge',
    'lucide-react',
  ];

  const files: Array<{
    path: string;
    type: 'registry:ui' | 'registry:component';
    target?: string;
    content: string;
  }> = [
    {
      path: 'lib/utils.ts',
      target: 'lib/utils.ts',
      type: 'registry:ui',
      content: generateUtilsTsCode(),
    },
    {
      path: `components/ui/${meta.id}.tsx`,
      target: `components/ui/${meta.id}.tsx`,
      type: 'registry:ui',
      content: generatePrimitiveTsxCode(
        meta.id,
        tokens,
        allPrimitiveOverrides[meta.id] || {}
      ),
    },
  ];

  if (meta.id === 'dialog') {
    files.unshift({
      path: 'lib/portal.tsx',
      target: 'lib/portal.tsx',
      type: 'registry:ui',
      content: generatePortalTsxCode(),
    });
  }

  return {
    $schema: 'https://ui.shadcn.com/schema/registry-item.json',
    name: meta.id,
    type: 'registry:ui',
    title: `${tokens.brandName} — ${meta.name}`,
    author: 'Koyot Living Brand OS',
    description: `${meta.name} primitive synchronized with ${tokens.brandName} tokens.`,
    dependencies,
    cssVars,
    files,
  };
}
