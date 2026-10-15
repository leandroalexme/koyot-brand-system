import { BlockDefinition } from './types';

/**
 * defineBlock provides type safety, autocompletion, and schema validation
 * for Koyot Brand Blocks.
 *
 * Usage:
 * ```tsx
 * export default defineBlock({
 *   id: 'credit-card-mockup',
 *   title: 'Credit Card 3D Mockup',
 *   category: 'mockups',
 *   variants: ['Default', 'Minimal', 'Metal'],
 *   render: ({ tokens, activeVariant }) => (
 *     <div className="w-full h-full flex flex-col justify-between ...">
 *       ...
 *     </div>
 *   )
 * });
 * ```
 */
export function defineBlock<const TVariants extends readonly string[]>(
  definition: BlockDefinition<TVariants>
): BlockDefinition<TVariants> {
  if (process.env.NODE_ENV !== 'production') {
    if (!definition.id || !definition.title || !definition.category) {
      console.warn(
        `[Block SDK] Invalid block definition: 'id', 'title', and 'category' are required.`
      );
    }
  }
  return definition;
}
