import React from 'react';
import { BrandTokens } from '../../types';

export type BlockCategory =
  | 'identity'
  | 'typography'
  | 'color'
  | 'mockups'
  | 'applications'
  | 'rules'
  | 'data';

export interface SubElementDefinition {
  id: string;
  label: string;
  category: string;
  description?: string;
}

export interface BlockRenderProps<TVariant extends string = string> {
  tokens: BrandTokens;
  activeVariant?: TVariant;
  selectedSubElementId?: string | null;
  onSelectSubElement?: (id: string | null) => void;
  isDark?: boolean;
}

export interface BlockDefinition<
  TVariants extends readonly string[] = readonly string[]
> {
  /** Unique block type identifier (e.g. 'credit-card-mockup') */
  id: string;
  /** Human-readable title displayed in the catalog and inspector */
  title: string;
  /** Category for sorting and filtering in the Add Block modal */
  category: BlockCategory;
  /** Short description of what this block visualizes */
  description?: string;
  /** Default grid column layout */
  defaultLayout?:
    | 'full'
    | '2-col-50-50'
    | '3-col-33-33-33'
    | '2-col-33-66'
    | '2-col-66-33';
  /** Available variants */
  variants?: readonly TVariants[number][];
  /** Sub-elements that can be clicked and inspected */
  subElements?: readonly SubElementDefinition[];
  /** React render function */
  render: React.FC<BlockRenderProps<TVariants[number]>>;
}
