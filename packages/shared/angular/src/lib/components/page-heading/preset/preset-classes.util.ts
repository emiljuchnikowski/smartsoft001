// Class recipes for the styled page-heading preset (HyperUI-style navbar look).
// Vanilla Tailwind palette classes are kept template-faithful (teal-600 accents)
// and every utility is smart:-prefixed with explicit smart:dark:* twins merged
// from the original HyperUI dark variant.

export type PageHeadingPresetLayout =
  | 'links-left'
  | 'links-center'
  | 'links-right'
  | 'user';

const HEADER = 'smart:bg-white smart:dark:bg-gray-900';

const BAR_BASE = 'smart:flex smart:h-16 smart:items-center';

export function getPageHeadingHeaderClasses(): string {
  return HEADER;
}

export function getPageHeadingBarClasses(
  layout: PageHeadingPresetLayout,
): string {
  const arrangement =
    layout === 'links-left' ? 'smart:gap-8' : 'smart:justify-between';
  return `${BAR_BASE} ${arrangement}`;
}
