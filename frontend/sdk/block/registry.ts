import { BlockDefinition } from './types';
import { BLOCK_CATALOG } from '../../constants';

export interface CatalogItem {
  id: string;
  name: string;
  category: string;
  description: string;
  defaultLayout: string;
  variants?: readonly string[];
  isCustomBlock?: boolean;
}

// Dynamically auto-discover all custom blocks placed in `frontend/blocks/**`
const blockModules = import.meta.glob<{
  default?: BlockDefinition<any>;
  block?: BlockDefinition<any>;
}>('../../blocks/**/*.{tsx,ts}', { eager: true });

const customBlocksMap = new Map<string, BlockDefinition<any>>();

for (const path in blockModules) {
  const mod = blockModules[path];
  const blk = mod.default || mod.block;
  if (blk && blk.id) {
    customBlocksMap.set(blk.id, blk);
  }
}

/**
 * Returns all custom blocks discovered via Vite glob
 */
export function getCustomBlocks(): BlockDefinition<any>[] {
  return Array.from(customBlocksMap.values());
}

/**
 * Finds a specific block by its unique block type id
 */
export function getBlockById(id: string): BlockDefinition<any> | undefined {
  return customBlocksMap.get(id);
}

/**
 * Returns the unified catalog combining built-in blocks with auto-discovered custom blocks
 */
export function getUnifiedBlockCatalog(): CatalogItem[] {
  const builtIns: CatalogItem[] = BLOCK_CATALOG.map((item) => ({
    id: item.id,
    name: item.name,
    category: item.category,
    description: item.description,
    defaultLayout: item.defaultLayout,
    isCustomBlock: false,
  }));

  const custom: CatalogItem[] = Array.from(customBlocksMap.values()).map(
    (b) => ({
      id: b.id,
      name: b.title,
      category: b.category,
      description: b.description || 'Bloco customizado de marca',
      defaultLayout: b.defaultLayout || '2-col-50-50',
      variants: b.variants,
      isCustomBlock: true,
    })
  );

  return [...builtIns, ...custom];
}

/**
 * Returns sub-elements for a given block type if registered via Block SDK
 */
export function getBlockSubElements(blockType: string) {
  const blk = customBlocksMap.get(blockType);
  return blk?.subElements;
}

/**
 * Returns variants for a given block type if registered via Block SDK
 */
export function getBlockVariants(blockType: string): string[] {
  const blk = customBlocksMap.get(blockType);
  return blk?.variants ? [...blk.variants] : [];
}

// Aliases for backwards compatibility during transition
export const getSpecimenSubElements = getBlockSubElements;
export const getSpecimenVariants = getBlockVariants;
