import React from 'react';
import {
  BrandTokens,
  EditorialBlock,
  BlockCategory,
  ColumnLayout,
  SelectedInspectorTarget,
} from '../../types';

export interface SubElementDefinition {
  id: string;
  label: string;
  kind: 'text' | 'surface' | 'control';
  description?: string;
}

export interface SpecimenRenderProps<TVariant extends string = string> {
  tokens: BrandTokens;
  block: EditorialBlock;
  activeVariant: TVariant;
  isInspectMode: boolean;
  selectedTarget: SelectedInspectorTarget | null;
  onSelectSubElement?: (subElementId: string, label?: string) => void;
  containerWidth?: number;
}

export interface SpecimenDefinition<
  TVariants extends readonly string[] = readonly string[]
> {
  /** Unique block type identifier, e.g. 'custom-credit-card' */
  id: string;
  /** Human readable title shown in catalog and inspector */
  title: string;
  /** Bento category */
  category: BlockCategory;
  /** Short description of the specimen */
  description: string;
  /** Recommended default column layout in Bento grid */
  defaultLayout: ColumnLayout;
  /** Supported variants, e.g. ['Default', 'Minimal', 'Dark'] */
  variants?: TVariants;
  /** Inspectable sub-elements for the Brand Studio */
  subElements?: SubElementDefinition[];
  /** React render component */
  render: React.FC<SpecimenRenderProps<TVariants[number]>>;
}
