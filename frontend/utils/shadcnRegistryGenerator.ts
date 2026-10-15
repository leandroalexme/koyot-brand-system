import {
  BrandTokens,
  SubElementStyleOverrides,
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

    /* design.how / Lime System Scoped Tokens */
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
    --accent: ${tokens.primaryColor};
    --accent-wash: ${tokens.surfaceTint};
    --control-sm: ${Math.max(24, Math.round(32 * tokens.spacingMultiplier))}px;
    --control-md: ${Math.max(30, Math.round(40 * tokens.spacingMultiplier))}px;
    --control-lg: ${Math.max(36, Math.round(48 * tokens.spacingMultiplier))}px;
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

/**
 * Generates an Agent `SKILL.md` file (modeled after `arla6ka/skills/systems/lime/SKILL.md`)
 * tailored to the user's live BrandTokens so AI coding agents follow the brand's rules and tokens.
 */
export function generateBrandSkillMd(tokens: BrandTokens): string {
  const slug = tokens.brandName.toLowerCase().replace(/\s+/g, '-');
  const uiFont = getFontFamilyByRole(tokens, 'ui');
  const brandFont = getFontFamilyByRole(tokens, 'brand');
  const dataFont = getFontFamilyByRole(tokens, 'data');

  return `---
name: ${slug}
description: ${tokens.brandName} (${tokens.stylePresetName}) design system rules for this project's UI. Use when building or changing any screen, component, form or style.
---

# ${tokens.brandName} — ${tokens.stylePresetName} Design System

${tokens.brandCopy.manifestoBody}

## Setup
Wrap the root layout in \`className="lime"\` with \`<LimePortalProvider>\` inside it so overlays (menus, dialogs, popovers, selects) inherit every brand token:
\`\`\`tsx
import { LimePortalProvider } from '@/lib/lime/portal';

<body className="lime">
  <LimePortalProvider>{children}</LimePortalProvider>
</body>
\`\`\`

## Global Rules
1. **${slug}-components-first (MUST)**: Use a ${tokens.brandName} primitive from \`@/components/ui/*\` before writing custom markup.
2. **${slug}-tokens-only (MUST)**: Use only semantic token classes (\`bg-page\`, \`bg-surface\`, \`text-fg\`, \`bg-accent\`, \`border-line\`, \`rounded-control\`, \`h-(--control-md)\`); never hardcode raw hex values or arbitrary pixel sizes.
3. **${slug}-do-rule (MUST)**: ${tokens.brandCopy.doRuleTitle}.
4. **${slug}-dont-rule (NEVER)**: ${tokens.brandCopy.dontRuleTitle}.
5. **${slug}-field-label (MUST)**: Wrap every input, select, slider or combobox in \`<Field>\` with a visible \`<FieldLabel>\`.

## Active Brand Tokens
- **Primary / Accent (\`--accent\`)**: \`${tokens.primaryColor}\`
- **Support (\`--support\`)**: \`${tokens.supportColor}\`
- **Secondary (\`--secondary\`)**: \`${tokens.secondaryColor}\`
- **Surface Wash (\`--accent-wash\`)**: \`${tokens.surfaceTint}\`
- **Neutral Ramp**: \`${tokens.neutralTone}\` (\`--surface\`, \`--surface-2\`, \`--surface-3\`, \`--line\`)
- **Typography**:
  - UI (\`--font-sans\`): \`${uiFont}\` (weight \`${tokens.bodyWeight}\`)
  - Brand Display: \`${brandFont}\` (weight \`${tokens.headingWeight}\`, tracking \`${tokens.letterSpacingEm}em\`)
  - Data / Tabular (\`--font-mono\`): \`${dataFont}\`
- **Geometry & Scale**:
  - Corner Radius (\`--radius-panel\`): \`${tokens.radiusPx}px\`
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
      const btnOvr = subOverrides.button;
      const labelOvr = subOverrides.label;
      const btnRadius = resolveCornerRadiusCss(btnOvr, tokens.radiusPx);
      const btnHeight = resolveControlSizePx(btnOvr?.controlSize || 'L', 40);
      const primaryBg = btnOvr?.fillToken
        ? resolveSemanticColorToken(btnOvr.fillToken, tokens).hex
        : tokens.primaryActionStyle === 'neutral'
        ? '#09090B'
        : tokens.primaryColor;
      const primaryFg = getReadableTextColor(primaryBg);
      const fontWeight = resolveWeightValue(
        labelOvr?.fontWeight,
        Math.max(500, tokens.headingWeight - 100)
      );

      return `import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/**
 * ${tokens.brandName} (${tokens.stylePresetName}) — Customized Button Primitive
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-[${primaryBg}] text-[${primaryFg}] hover:opacity-90",
        brand: "bg-[${tokens.primaryColor}] text-[${getReadableTextColor(tokens.primaryColor)}] hover:opacity-90",
        secondary: "bg-[${tokens.secondaryColor}] text-[${getReadableTextColor(tokens.secondaryColor)}] hover:opacity-90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-muted hover:text-foreground",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      },
      size: {
        default: "h-[${btnHeight}px] px-5 py-2",
        sm: "h-[${Math.max(30, btnHeight - 6)}px] px-3.5 text-xs",
        lg: "h-[${btnHeight + 8}px] px-7 text-base",
        icon: "h-[${btnHeight}px] w-[${btnHeight}px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, style, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        style={{
          borderRadius: "${btnRadius}",
          fontFamily: '"${brandFont}", sans-serif',
          fontWeight: ${fontWeight},
          letterSpacing: "${tokens.letterSpacingEm}em",
          ...style,
        }}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
`;
    }

    default: {
      const meta =
        SHADCN_ALL_COMPONENTS.find((m) => m.id === primitiveId) ||
        SHADCN_ALL_COMPONENTS[0];
      const mainPart = meta.subParts[0]?.id || 'surface';
      const ovr = subOverrides[mainPart];
      const radiusCss = resolveCornerRadiusCss(ovr, tokens.radiusPx);
      const borderW = resolveBorderWidthPx(ovr?.borderWidth, tokens.borderWidth);
      const fillHex = ovr?.fillToken
        ? resolveSemanticColorToken(ovr.fillToken, tokens).cssColor
        : '#FFFFFF';
      const compSymbol = meta.name.replace(/[^a-zA-Z0-9]/g, '');

      return `"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * ${tokens.brandName} (${tokens.stylePresetName}) — ${meta.name} Primitive
 * Synchronized with Brand Tokens:
 * - Primary: ${tokens.primaryColor}
 * - Radius: ${radiusCss}
 * - Border Width: ${borderW}px
 * - UI Font: ${uiFont}
 * - Brand Font: ${brandFont}
 */
export interface ${compSymbol}Props
  extends React.HTMLAttributes<HTMLDivElement> {}

export const ${compSymbol} = React.forwardRef<
  HTMLDivElement,
  ${compSymbol}Props
>(({ className, style, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "transition-all text-foreground",
        className
      )}
      style={{
        backgroundColor: "${fillHex}",
        borderRadius: "${radiusCss}",
        borderWidth: "${borderW}px",
        fontFamily: '"${uiFont}", sans-serif',
        ...style,
      }}
      {...props}
    />
  )
})
${compSymbol}.displayName = "${compSymbol}"
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
  > = {}
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
      '@carbon/icons-react',
      'class-variance-authority',
      'clsx',
      'tailwind-merge',
      'lucide-react',
    ]);
    const files = SHADCN_ALL_COMPONENTS.map((meta) => {
      if (meta.radixPackage) deps.add(meta.radixPackage);
      return {
        path: `components/ui/${meta.id}.tsx`,
        target: `components/ui/${meta.id}.tsx`,
        type: 'registry:ui' as const,
        content: generatePrimitiveTsxCode(
          meta.id,
          tokens,
          allPrimitiveOverrides[meta.id] || {}
        ),
      };
    });
    files.push({
      path: '.agents/skills/brand-system/SKILL.md',
      target: '.agents/skills/brand-system/SKILL.md',
      type: 'registry:ui' as const,
      content: generateBrandSkillMd(tokens),
    });

    return {
      $schema: 'https://ui.shadcn.com/schema/registry-item.json',
      name: `${tokens.brandName.toLowerCase().replace(/\s+/g, '-')}-design-system`,
      type: 'registry:ui',
      title: `${tokens.brandName} (${tokens.stylePresetName}) Koyot UI System`,
      author: 'Koyot Living Brand OS',
      description: `Complete Koyot UI primitive collection + SKILL.md customized for ${tokens.brandName}.`,
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
  if (meta.radixPackage) {
    dependencies.unshift(meta.radixPackage);
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
    files: [
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
    ],
  };
}
