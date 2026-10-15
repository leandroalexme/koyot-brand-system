import React from 'react';
import {
  BrandTokens,
  EditorialBlock,
  SelectedInspectorTarget,
} from '../../types';
import {
  BezierConstructionSpecimen,
  LogoAnatomySpecimen,
  IconographyGridSpecimen,
  DosAndDontsSpecimen,
} from './IdentitySpecimens';
import {
  TypographySculptureSpecimen,
  TypographyAlphabetSpecimen,
  TypographyHierarchySpecimen,
} from './TypographySpecimens';
import {
  ColorProportionSpecimen,
  ColorSwatchesSpecimen,
  OutdoorBillboardSpecimen,
  SocialCardPosterSpecimen,
  EditorialValuesListSpecimen,
  LifestylePhotographySpecimen,
} from './ColorAndEditorialSpecimens';
import {
  ShadcnSliderAnatomySpecimen,
  ShadcnPaymentWidgetSpecimen,
  ShadcnNavigationPreviewSpecimen,
} from './ShadcnShowcaseSpecimens';
import { ShadcnPrimitivesWorkbench } from './ShadcnPrimitivesWorkbench';
import { ShadcnSingleComponentSpecimen } from './ShadcnSingleComponentSpecimen';
import { ShadcnPrimitiveId } from '../../utils/shadcnRegistryGenerator';
import {
  LogotypeScalingSpecimen,
  BrandLockupMatrixSpecimen,
  IconGridInspectorSpecimen,
  MotionIconMorphSpecimen,
  StylisticSetSpecimen,
  TypeTriptychPosterSpecimen,
  TypeScaleSheetSpecimen,
  LayoutGridSystemSpecimen,
  IosHomescreenMockupSpecimen,
  BrowserFaviconMockupSpecimen,
  SocialProfileMockupSpecimen,
  DetachedPillNavSpecimen,
} from './ExtendedBrandSpecimens';
import { BrandLogoMark } from './BrandLogoMark';
import { ProportionalArtboard } from './ProportionalArtboard';
import { ResizableComponentFrame } from './ResizableComponentFrame';
import { getBlockById } from '../../sdk/block';
import {
  getReadableTextColor,
  resolveSemanticColorToken,
} from '../../utils/styleUtils';
import {
  resolveFillColorCss,
  resolveCornerRadiusCss,
  resolveBorderWidthPx,
  resolveShadowCss,
  resolveWeightValue,
  resolveTextMetrics,
  getResolvedFontClass,
} from '../../utils/overrideUtils';

interface BlockRendererProps {
  block: EditorialBlock;
  tokens: BrandTokens;
  isInspectMode?: boolean;
  activeComponentId?: string | 'all';
  onSelectComponentId?: (id: string | 'all') => void;
  selectedTarget?: SelectedInspectorTarget | null;
  onSelectSubElement?: (
    subElementId: string | undefined,
    subElementLabel?: string,
    componentLabel?: string,
    variantState?: string
  ) => void;
  onChangeVariant?: (nextVariant: string) => void;
  onOpenExportModal?: (primitiveId: ShadcnPrimitiveId | 'all') => void;
}

export const BlockRenderer: React.FC<BlockRendererProps> = ({
  block,
  tokens,
  isInspectMode = false,
  activeComponentId = 'all',
  onSelectComponentId,
  selectedTarget = null,
  onSelectSubElement,
  onChangeVariant,
  onOpenExportModal,
}) => {
  const blockOvr = block.overrides;

  // Optional wrapper styling if block-level overrides (border, corner radius, shadow) are set
  const hasBlockFrameOverrides =
    blockOvr &&
    (blockOvr.borderWidth ||
      blockOvr.cornerRadius ||
      blockOvr.individualCorners ||
      blockOvr.shadow);

  const wrapperStyle: React.CSSProperties | undefined = hasBlockFrameOverrides
    ? {
        borderRadius: resolveCornerRadiusCss(blockOvr, 24),
        borderWidth: `${resolveBorderWidthPx(blockOvr?.borderWidth, 0)}px`,
        borderStyle:
          resolveBorderWidthPx(blockOvr?.borderWidth, 0) > 0
            ? 'solid'
            : 'none',
        borderColor: blockOvr?.borderToken
          ? resolveSemanticColorToken(blockOvr.borderToken, tokens).cssColor
          : 'transparent',
        boxShadow: resolveShadowCss(blockOvr?.shadow),
        overflow: 'hidden',
      }
    : undefined;

  const renderContent = () => {
    // 1. Dynamic Block SDK Auto-Discovery
    const dynamicBlock = getBlockById(block.type);
    if (dynamicBlock) {
      const BlockComponent = dynamicBlock.render;
      const activeVariant =
        block.variant || dynamicBlock.variants?.[0] || 'Default';
      return (
        <BlockComponent
          tokens={tokens}
          block={block}
          activeVariant={activeVariant}
          isInspectMode={isInspectMode}
          selectedTarget={selectedTarget}
          onSelectSubElement={onSelectSubElement}
        />
      );
    }

    if (block.type.startsWith('ui-')) {
      return (
        <ShadcnSingleComponentSpecimen
          tokens={tokens}
          block={block}
          isInspectMode={isInspectMode}
          selectedTarget={selectedTarget}
          onSelectSubElement={onSelectSubElement}
          onChangeVariant={onChangeVariant}
          onOpenExportModal={onOpenExportModal}
        />
      );
    }

    switch (block.type) {
      case 'shadcn-slider-anatomy':
        return (
          <ResizableComponentFrame>
            {(w) => (
              <ShadcnSliderAnatomySpecimen
                tokens={tokens}
                block={block}
                containerWidth={w}
                isInspectMode={isInspectMode}
                selectedTarget={selectedTarget}
                onSelectSubElement={onSelectSubElement}
              />
            )}
          </ResizableComponentFrame>
        );
      case 'shadcn-payment-widget':
        return (
          <ResizableComponentFrame>
            {(w) => (
              <ShadcnPaymentWidgetSpecimen
                tokens={tokens}
                block={block}
                containerWidth={w}
                isInspectMode={isInspectMode}
                selectedTarget={selectedTarget}
                onSelectSubElement={onSelectSubElement}
              />
            )}
          </ResizableComponentFrame>
        );
      case 'shadcn-navigation-preview':
        return (
          <ResizableComponentFrame>
            {(w) => (
              <ShadcnNavigationPreviewSpecimen
                tokens={tokens}
                block={block}
                containerWidth={w}
                isInspectMode={isInspectMode}
                selectedTarget={selectedTarget}
                onSelectSubElement={onSelectSubElement}
              />
            )}
          </ResizableComponentFrame>
        );
      case 'shadcn-interactive-suite':
        return (
          <ResizableComponentFrame>
            {(w) => (
              <ShadcnPrimitivesWorkbench
                tokens={tokens}
                block={block}
                containerWidth={w}
                activeComponentId={activeComponentId}
                onSelectComponentId={onSelectComponentId}
                selectedTarget={selectedTarget}
                onSelectSubElement={onSelectSubElement}
                onOpenExportModal={onOpenExportModal}
              />
            )}
          </ResizableComponentFrame>
        );
      case 'detached-pill-nav':
        return (
          <ResizableComponentFrame>
            {(w) => (
              <DetachedPillNavSpecimen
                tokens={tokens}
                block={block}
                containerWidth={w}
              />
            )}
          </ResizableComponentFrame>
        );

      // PROPORTIONAL EDITORIAL ARTBOARDS
      case 'bezier-construction':
        return (
          <ProportionalArtboard baseWidth={860}>
            <BezierConstructionSpecimen tokens={tokens} block={block} />
          </ProportionalArtboard>
        );
      case 'brand-lockup-matrix':
        return (
          <ProportionalArtboard baseWidth={860}>
            <BrandLockupMatrixSpecimen tokens={tokens} block={block} />
          </ProportionalArtboard>
        );
      case 'logotype-scaling':
        return (
          <ProportionalArtboard baseWidth={520}>
            <LogotypeScalingSpecimen tokens={tokens} block={block} />
          </ProportionalArtboard>
        );
      case 'logo-anatomy':
        return (
          <ProportionalArtboard baseWidth={520}>
            <LogoAnatomySpecimen tokens={tokens} block={block} />
          </ProportionalArtboard>
        );
      case 'icon-grid-inspector':
        return (
          <ProportionalArtboard baseWidth={480}>
            <IconGridInspectorSpecimen tokens={tokens} block={block} />
          </ProportionalArtboard>
        );
      case 'motion-icon-morph':
        return (
          <ProportionalArtboard baseWidth={480}>
            <MotionIconMorphSpecimen tokens={tokens} block={block} />
          </ProportionalArtboard>
        );
      case 'iconography-grid':
        return (
          <ProportionalArtboard baseWidth={480}>
            <IconographyGridSpecimen tokens={tokens} block={block} />
          </ProportionalArtboard>
        );
      case 'dos-and-donts':
        return (
          <ProportionalArtboard baseWidth={860}>
            <DosAndDontsSpecimen tokens={tokens} block={block} />
          </ProportionalArtboard>
        );
      case 'layout-grid-system':
        return (
          <ProportionalArtboard baseWidth={880}>
            <LayoutGridSystemSpecimen tokens={tokens} block={block} />
          </ProportionalArtboard>
        );
      case 'typography-sculpture':
        return (
          <ProportionalArtboard baseWidth={500}>
            <TypographySculptureSpecimen tokens={tokens} block={block} />
          </ProportionalArtboard>
        );
      case 'stylistic-set-specimen':
        return (
          <ProportionalArtboard baseWidth={860}>
            <StylisticSetSpecimen tokens={tokens} block={block} />
          </ProportionalArtboard>
        );
      case 'type-triptych-poster':
        return (
          <ProportionalArtboard baseWidth={880}>
            <TypeTriptychPosterSpecimen tokens={tokens} block={block} />
          </ProportionalArtboard>
        );
      case 'type-scale-sheet':
        return (
          <ProportionalArtboard baseWidth={500}>
            <TypeScaleSheetSpecimen tokens={tokens} block={block} />
          </ProportionalArtboard>
        );
      case 'typography-alphabet':
        return (
          <ProportionalArtboard baseWidth={860}>
            <TypographyAlphabetSpecimen tokens={tokens} block={block} />
          </ProportionalArtboard>
        );
      case 'typography-hierarchy':
        return (
          <ProportionalArtboard baseWidth={860}>
            <TypographyHierarchySpecimen tokens={tokens} block={block} />
          </ProportionalArtboard>
        );
      case 'color-proportion-60-30-10':
        return (
          <ProportionalArtboard baseWidth={500}>
            <ColorProportionSpecimen tokens={tokens} block={block} />
          </ProportionalArtboard>
        );
      case 'color-swatches':
        return (
          <ProportionalArtboard baseWidth={860}>
            <ColorSwatchesSpecimen tokens={tokens} block={block} />
          </ProportionalArtboard>
        );
      case 'ios-homescreen-mockup':
        return (
          <ProportionalArtboard baseWidth={480}>
            <IosHomescreenMockupSpecimen tokens={tokens} block={block} />
          </ProportionalArtboard>
        );
      case 'browser-favicon-mockup':
        return (
          <ProportionalArtboard baseWidth={480}>
            <BrowserFaviconMockupSpecimen tokens={tokens} block={block} />
          </ProportionalArtboard>
        );
      case 'social-profile-mockup':
        return (
          <ProportionalArtboard baseWidth={480}>
            <SocialProfileMockupSpecimen tokens={tokens} block={block} />
          </ProportionalArtboard>
        );
      case 'outdoor-billboard':
        return (
          <ProportionalArtboard baseWidth={880}>
            <OutdoorBillboardSpecimen tokens={tokens} block={block} />
          </ProportionalArtboard>
        );
      case 'social-card-poster':
        return (
          <ProportionalArtboard baseWidth={480}>
            <SocialCardPosterSpecimen tokens={tokens} block={block} />
          </ProportionalArtboard>
        );
      case 'editorial-values-list':
        return (
          <ProportionalArtboard baseWidth={480}>
            <EditorialValuesListSpecimen tokens={tokens} block={block} />
          </ProportionalArtboard>
        );
      case 'lifestyle-photography':
        return (
          <ProportionalArtboard baseWidth={480}>
            <LifestylePhotographySpecimen tokens={tokens} block={block} />
          </ProportionalArtboard>
        );
      case 'hero-manifesto':
      default: {
        const isThisBlockSelected = selectedTarget?.blockId === block.id;
        const selectedPart = isThisBlockSelected
          ? selectedTarget?.subElementId
          : undefined;

        const badgeOvr = block.subElements?.badge;
        const headlineOvr = block.subElements?.headline;
        const bodyOvr = block.subElements?.body;

        const defaultBg =
          block.theme === 'brand'
            ? tokens.primaryColor
            : block.theme === 'dark'
            ? '#18181B'
            : block.theme === 'tinted'
            ? tokens.surfaceTint
            : '#FFFFFF';

        const bg = blockOvr?.fillToken
          ? resolveFillColorCss(
              tokens,
              blockOvr.fillToken,
              blockOvr.fillOpacity,
              defaultBg
            )
          : defaultBg;

        const fg =
          block.theme === 'brand'
            ? getReadableTextColor(tokens.primaryColor)
            : block.theme === 'dark'
            ? '#FFFFFF'
            : '#09090B';

        const headlineFont = getResolvedFontClass(tokens, headlineOvr, 'brand');
        const bodyFont = getResolvedFontClass(tokens, bodyOvr, 'ui');

        return (
          <ProportionalArtboard baseWidth={860}>
            <div
              className="rounded-[24px] flex flex-col justify-between min-h-[320px] transition-colors duration-200"
              style={{
                backgroundColor: bg,
                color: fg,
                padding: `${Math.round(44 * tokens.spacingMultiplier)}px`,
              }}
            >
              <div className="flex items-center gap-2.5">
                <span
                  onClick={(e) => {
                    if (isInspectMode && onSelectSubElement) {
                      e.stopPropagation();
                      onSelectSubElement(
                        'badge',
                        'Brand Pill',
                        'Manifesto',
                        'Default'
                      );
                    }
                  }}
                  className={`px-3.5 py-1.5 text-xs flex items-center gap-2 transition-all ${
                    isInspectMode ? 'cursor-pointer' : ''
                  } ${
                    selectedPart === 'badge' ? 'ring-2 ring-[#D946EF]' : ''
                  }`}
                  style={{
                    backgroundColor: badgeOvr?.fillToken
                      ? resolveFillColorCss(
                          tokens,
                          badgeOvr.fillToken,
                          badgeOvr.fillOpacity,
                          tokens.surfaceTint
                        )
                      : block.theme === 'brand'
                      ? 'rgba(255,255,255,0.18)'
                      : tokens.surfaceTint,
                    color: block.theme === 'brand' ? fg : '#18181B',
                    borderRadius: resolveCornerRadiusCss(
                      badgeOvr,
                      tokens.radiusPx
                    ),
                    fontWeight: tokens.bodyWeight,
                  }}
                >
                  <BrandLogoMark
                    logoId={tokens.logoId}
                    color={block.theme === 'brand' ? fg : tokens.primaryColor}
                    size={16}
                  />
                  <span>{tokens.brandName}</span>
                </span>
              </div>
              <h2
                onClick={(e) => {
                  if (isInspectMode && onSelectSubElement) {
                    e.stopPropagation();
                    onSelectSubElement(
                      'headline',
                      'Headline',
                      'Manifesto',
                      'Default'
                    );
                  }
                }}
                className={`leading-[1.04] my-6 rounded px-1 -mx-1 transition ${headlineFont} ${
                  isInspectMode ? 'cursor-pointer' : ''
                } ${
                  selectedPart === 'headline' ? 'ring-1 ring-[#D946EF]' : ''
                }`}
                style={{
                  fontSize: `${
                    headlineOvr?.textSize
                      ? resolveTextMetrics(tokens, headlineOvr.textSize, 52)
                          .fontSizePx
                      : Math.round(52 * tokens.fontScale)
                  }px`,
                  fontWeight: resolveWeightValue(
                    headlineOvr?.fontWeight,
                    tokens.headingWeight
                  ),
                  color: headlineOvr?.textColorToken
                    ? resolveSemanticColorToken(
                        headlineOvr.textColorToken,
                        tokens
                      ).cssColor
                    : fg,
                  letterSpacing: `${tokens.letterSpacingEm}em`,
                }}
              >
                {tokens.tagline}
              </h2>
              <p
                onClick={(e) => {
                  if (isInspectMode && onSelectSubElement) {
                    e.stopPropagation();
                    onSelectSubElement(
                      'body',
                      'Manifesto Copy',
                      'Manifesto',
                      'Default'
                    );
                  }
                }}
                className={`opacity-75 max-w-2xl rounded px-1 -mx-1 transition ${bodyFont} ${
                  isInspectMode ? 'cursor-pointer' : ''
                } ${
                  selectedPart === 'body' ? 'ring-1 ring-[#D946EF]' : ''
                }`}
                style={{
                  fontSize: `${
                    bodyOvr?.textSize
                      ? resolveTextMetrics(tokens, bodyOvr.textSize, 15)
                          .fontSizePx
                      : Math.round(15 * tokens.fontScale)
                  }px`,
                  fontWeight: resolveWeightValue(
                    bodyOvr?.fontWeight,
                    tokens.bodyWeight
                  ),
                  color: bodyOvr?.textColorToken
                    ? resolveSemanticColorToken(bodyOvr.textColorToken, tokens)
                        .cssColor
                    : fg,
                }}
              >
                {tokens.brandCopy.manifestoBody}
              </p>
            </div>
          </ProportionalArtboard>
        );
      }
    }
  };

  if (wrapperStyle) {
    return (
      <div
        style={wrapperStyle}
        className="w-full h-full min-h-0 flex flex-col flex-1 overflow-hidden"
      >
        {renderContent()}
      </div>
    );
  }
  return (
    <div className="w-full h-full min-h-0 flex flex-col flex-1 overflow-hidden">
      {renderContent()}
    </div>
  );
};
