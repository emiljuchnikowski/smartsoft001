// HyperUI-styled class recipes for the card-heading preset.
// Every utility is `smart:`-prefixed (Tailwind v4 `prefix(smart)`). HyperUI
// ships no dark twin for these cards, so explicit `dark:` variants are derived:
//   text-gray-900        -> dark:text-white
//   text-gray-700        -> dark:text-gray-300
//   bg-white             -> dark:bg-gray-900
//   border-gray-300      -> dark:border-gray-600
//   border-black         -> dark:border-white
//   bg-black             -> unchanged (overlay backdrop stays dark)

export type CardHeadingVariant = 'author' | 'stacked' | 'overlay' | 'outline';

const CONTAINER: Record<CardHeadingVariant, string[]> = {
  author: [
    'smart:block',
    'smart:rounded-md',
    'smart:border',
    'smart:border-gray-300',
    'smart:dark:border-gray-600',
    'smart:p-4',
    'smart:shadow-sm',
    'smart:sm:p-6',
  ],
  stacked: ['smart:block'],
  overlay: ['smart:group', 'smart:relative', 'smart:block', 'smart:bg-black'],
  outline: [
    'smart:group',
    'smart:relative',
    'smart:block',
    'smart:h-64',
    'smart:sm:h-80',
    'smart:lg:h-96',
  ],
};

/**
 * Classes for the root card element. Falls back to the `author` recipe for an
 * unknown variant.
 */
export function getCardHeadingContainerClasses(
  variant: CardHeadingVariant = 'author',
): string {
  const recipe = CONTAINER[variant] ?? CONTAINER.author;
  return recipe.join(' ');
}
