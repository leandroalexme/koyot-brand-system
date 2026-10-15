export type FontFamilyOption =
  | 'Plus Jakarta Sans'
  | 'Inter'
  | 'Space Grotesk'
  | 'Syne'
  | 'Instrument Serif'
  | 'Fraunces'
  | 'DM Sans'
  | 'Outfit'
  | 'Playfair Display'
  | 'JetBrains Mono'
  | 'ABeeZee'
  | 'Abel'
  | 'Abhaya Libre'
  | 'Aboreto'
  | 'Abril Fatface'
  | 'Abyssinica SIL'
  | 'Aclonica';

export type FontRole = 'ui' | 'brand' | 'editorial' | 'data';

export type ScaleUnitName = 'XXS' | 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';

export interface ScaleUnitMetrics {
  size: number;
  height: number;
  spacing: number;
}

export interface FontRoleSettings {
  family: FontFamilyOption;
  weight: number;
  letterSpacingEm: number;
  uppercase?: boolean;
}

export type RadiusPreset = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

export type NeutralTone = 'mono' | 'warm' | 'cool' | 'sand';

export type MotionPreset = 'snappy' | 'smooth' | 'playful';

export type AppMode = 'overview' | 'guideline' | 'components';

export type BrandLogoId = 'poulp' | 'koyot' | 'vesper' | 'vortex';

export interface ColorMoodPalette {
  id: string;
  name: string;
  primaryColor: string;
  supportColor: string;
  secondaryColor: string;
  accentColor: string;
  surfaceTint: string;
}

export interface BasePaletteTokens {
  primaryColor: string;
  supportColor: string;
  secondaryColor: string;
  accentColor: string;
  surfaceTint: string;
}

export interface BrandCopyContent {
  manifestoBody: string;
  sculptureGlyph: string;
  hierarchyBodySample: string;
  billboardHeadline: [string, string, string];
  billboardSubpill: string;
  socialCardHeadline: [string, string, string];
  socialPosterHeadline: [string, string, string];
  editorialPillars: [string, string, string, string, string, string];
  lifestyleImageUrl: string;
  lifestyleCta: string;
  lifestyleCaption: string;
  paymentBalance: string;
  paymentAmount: string;
  paymentDue: string;
  planFullAmount: string;
  planFullLabel: string;
  planSplitAmount: string;
  planSplitLabel: string;
  workspaceName: string;
  companyPlaceholder: string;
  doRuleTitle: string;
  dontRuleTitle: string;
  domainUrl: string;
  socialHandle: string;
  socialBio: string;
  stylisticWord: string;
  gridPosterHeadline: [string, string, string];
  detachedNavLabels: [string, string, string, string, string];
}

export interface BrandTokens {
  brandName: string;
  tagline: string;
  stylePresetName: string;
  logoId: BrandLogoId;
  brandCopy: BrandCopyContent;
  basePalette: BasePaletteTokens;
  primaryColor: string;
  supportColor: string;
  secondaryColor: string;
  accentColor: string;
  surfaceTint: string;
  darkSurface: string;
  headingFont: FontFamilyOption;
  bodyFont: FontFamilyOption;
  editorialFont?: FontFamilyOption;
  monoFont: FontFamilyOption | string;
  fontRoles?: Record<FontRole, FontRoleSettings>;
  radius: RadiusPreset;
  baseRadiusPx: number;
  radiusPx: number;
  borderWidth: number;
  letterSpacing: 'tight' | 'normal' | 'wide';
  letterSpacingEm: number;
  scale: 'compact' | 'default' | 'airy';
  fontScale: number;
  scaleProportion?: number;
  scaleUnits?: Record<ScaleUnitName, ScaleUnitMetrics>;
  headingWeight: number;
  bodyWeight: number;
  spacingMultiplier: number;
  characterX: number; // -1 (Quiet) to 1 (Bold)
  characterY: number; // -1 (Compact) to 1 (Airy)
  neutralTone: NeutralTone;
  motion: MotionPreset;
  primaryActionStyle: 'brand' | 'neutral' | 'contrast';
  shadowDepth: 'none' | 'subtle' | 'elevated';
}

export type ColumnLayout =
  | '1-col'
  | '2-col-50-50'
  | '2-col-66-33'
  | '2-col-33-66'
  | '3-col'
  | '4-col'
  | '2x2';

export type BlockCategory =
  | 'identity'
  | 'typography'
  | 'color'
  | 'applications'
  | 'rules'
  | 'content'
  | 'frame';

export type ShadcnSingleBlockType =
  | 'ui-accordion'
  | 'ui-alert'
  | 'ui-alert-dialog'
  | 'ui-autocomplete'
  | 'ui-avatar'
  | 'ui-badge'
  | 'ui-breadcrumb'
  | 'ui-button'
  | 'ui-calendar'
  | 'ui-card'
  | 'ui-checkbox'
  | 'ui-checkbox-group'
  | 'ui-collapsible'
  | 'ui-combobox'
  | 'ui-command'
  | 'ui-dialog'
  | 'ui-drawer'
  | 'ui-dropdown-menu'
  | 'ui-input'
  | 'ui-input-otp'
  | 'ui-menubar'
  | 'ui-navigation-menu'
  | 'ui-pagination'
  | 'ui-popover'
  | 'ui-progress'
  | 'ui-radio-group'
  | 'ui-select'
  | 'ui-separator'
  | 'ui-sheet'
  | 'ui-skeleton'
  | 'ui-slider'
  | 'ui-switch'
  | 'ui-table'
  | 'ui-tabs'
  | 'ui-textarea'
  | 'ui-toast'
  | 'ui-toggle'
  | 'ui-tooltip'
  | 'ui-empty'
  | 'ui-dropzone';

export type BlockType =
  | 'hero-manifesto'
  | 'logo-anatomy'
  | 'bezier-construction'
  | 'logotype-scaling'
  | 'brand-lockup-matrix'
  | 'icon-grid-inspector'
  | 'motion-icon-morph'
  | 'typography-sculpture'
  | 'typography-alphabet'
  | 'typography-hierarchy'
  | 'stylistic-set-specimen'
  | 'type-triptych-poster'
  | 'type-scale-sheet'
  | 'color-proportion-60-30-10'
  | 'color-swatches'
  | 'dos-and-donts'
  | 'layout-grid-system'
  | 'outdoor-billboard'
  | 'social-card-poster'
  | 'ios-homescreen-mockup'
  | 'browser-favicon-mockup'
  | 'social-profile-mockup'
  | 'iconography-grid'
  | 'editorial-values-list'
  | 'lifestyle-photography'
  | 'detached-pill-nav'
  | 'shadcn-slider-anatomy'
  | 'customer-lifetime-value'
  | 'billboard-mockup'
  | 'credit-card-mockup'
  | 'palette-stack'
  | ShadcnSingleBlockType
  | (string & {});

export type BlockTheme = 'light' | 'tinted' | 'dark' | 'brand';

export type TextWeightName = 'Light' | 'Regular' | 'Medium' | 'Bold';
export type BorderWidthName = 'None' | 'S' | 'M' | 'L';
export type CornerRadiusName = 'None' | 'XS' | 'S' | 'M' | 'L' | 'XL' | 'Full';
export type ControlSizeName = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';

export interface SubElementStyleOverrides {
  fillToken?: string;
  fillOpacity?: number;
  accentFillToken?: string;
  textColorToken?: string;
  borderToken?: string;
  borderWidth?: BorderWidthName;
  fontRole?: FontRole;
  textSize?: ScaleUnitName;
  fontWeight?: TextWeightName;
  controlSize?: ControlSizeName;
  cornerRadius?: CornerRadiusName;
  individualCorners?: boolean;
  cornerTL?: number;
  cornerTR?: number;
  cornerBR?: number;
  cornerBL?: number;
  shadow?: 'none' | 'subtle' | 'elevated';
}

export interface BlockStyleOverrides extends SubElementStyleOverrides {
  paddingScale?: ControlSizeName;
}

export interface EditorialBlock {
  id: string;
  type: BlockType;
  title: string;
  subtitle?: string;
  theme: BlockTheme;
  variant?: string;
  customHeading?: string;
  customSubtext?: string;
  overrides?: BlockStyleOverrides;
  subElements?: Record<string, SubElementStyleOverrides>;
}

export interface SelectedInspectorTarget {
  rowId: string;
  blockId: string;
  subElementId?: string;
  subElementLabel?: string;
  componentLabel?: string;
  variantState?: string;
}

export interface EditorialRow {
  id: string;
  sectionTitle?: string;
  sectionSubtitle?: string;
  layout: ColumnLayout;
  blocks: EditorialBlock[];
}

export type PageId = string;

export interface GuidelinePage {
  id: PageId;
  label: string;
  mode: AppMode;
  locked?: boolean;
  description: string;
  rows: EditorialRow[];
}

export interface HistoryTransaction {
  id: string;
  timestamp: number;
  actor: {
    kind: 'human' | 'agent' | 'preset' | 'autofix';
    name?: string;
  };
  description: string;
  summary?: string;
  tokensBefore: BrandTokens;
  tokensAfter: BrandTokens;
  pagesBefore?: GuidelinePage[];
  pagesAfter?: GuidelinePage[];
}

export type OverrideScope = 'component' | 'instance';

export interface BrandPolicies {
  lockedTokens: Array<keyof BrandTokens>;
  enforceWcagAA: boolean;
  disallowArbitraryRadius: boolean;
  disallowArbitraryFonts: boolean;
  allowComponentOverrides: boolean;
}
