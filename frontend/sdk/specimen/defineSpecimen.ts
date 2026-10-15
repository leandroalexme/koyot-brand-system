import { SpecimenDefinition } from './types';

/**
 * defineSpecimen provides type safety, autocompletion, and schema validation
 * for Koyot Specimen blocks.
 *
 * Example:
 * ```tsx
 * export default defineSpecimen({
 *   id: 'credit-card-preview',
 *   title: 'Credit Card 3D',
 *   category: 'applications',
 *   description: 'Interactive debit/credit card with holographic chip.',
 *   defaultLayout: '2-col-50-50',
 *   variants: ['Default', 'Glass', 'Minimal'] as const,
 *   subElements: [
 *     { id: 'card', label: 'Card Surface', kind: 'surface' },
 *     { id: 'balance', label: 'Balance Amount', kind: 'text' },
 *   ],
 *   render: ({ tokens, block, activeVariant }) => ( ... ),
 * });
 * ```
 */
export function defineSpecimen<const TVariants extends readonly string[]>(
  definition: SpecimenDefinition<TVariants>
): SpecimenDefinition<TVariants> {
  if (!definition.id || !definition.title || !definition.category) {
    throw new Error(
      `[Specimen SDK] Invalid specimen definition: 'id', 'title', and 'category' are required.`
    );
  }
  return definition;
}
