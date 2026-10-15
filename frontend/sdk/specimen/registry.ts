import { SpecimenDefinition } from './types';
import { BLOCK_CATALOG } from '../../constants';
import { BlockCategory } from '../../types';

export interface CatalogItem {
  type: string;
  category: BlockCategory;
  label: string;
  description: string;
  isCustomSpecimen?: boolean;
}

// Dynamically auto-discover all custom specimens placed in `frontend/specimens/**`
const customModules = import.meta.glob<{
  default?: SpecimenDefinition<any>;
  specimen?: SpecimenDefinition<any>;
}>('../../specimens/**/*.{tsx,ts}', { eager: true });

const customSpecimensMap = new Map<string, SpecimenDefinition<any>>();

for (const [path, mod] of Object.entries(customModules)) {
  const spec = mod.default || mod.specimen;
  if (spec && spec.id) {
    customSpecimensMap.set(spec.id, spec);
  }
}

/**
 * Returns all custom specimens discovered via Vite glob
 */
export function getCustomSpecimens(): SpecimenDefinition<any>[] {
  return Array.from(customSpecimensMap.values());
}

/**
 * Finds a specific specimen by its unique block type id
 */
export function getSpecimenById(id: string): SpecimenDefinition<any> | undefined {
  return customSpecimensMap.get(id);
}

/**
 * Returns the unified catalog combining built-in blocks with auto-discovered custom specimens
 */
export function getUnifiedBlockCatalog(): CatalogItem[] {
  const builtIn: CatalogItem[] = BLOCK_CATALOG.map((item) => ({
    type: item.type,
    category: item.category,
    label: item.label,
    description: item.description,
    isCustomSpecimen: false,
  }));

  const custom: CatalogItem[] = Array.from(customSpecimensMap.values()).map(
    (spec) => ({
      type: spec.id,
      category: spec.category,
      label: spec.title,
      description: spec.description,
      isCustomSpecimen: true,
    })
  );

  return [...builtIn, ...custom];
}

/**
 * Returns inspectable sub-elements for a given block type
 */
export function getSpecimenSubElements(blockType: string) {
  const spec = customSpecimensMap.get(blockType);
  return spec?.subElements || [];
}

/**
 * Returns available variants for a given block type
 */
export function getSpecimenVariants(blockType: string): string[] {
  const spec = customSpecimensMap.get(blockType);
  if (spec?.variants && Array.isArray(spec.variants)) {
    return [...spec.variants];
  }
  return ['Default'];
}
