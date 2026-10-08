// Class recipes for the styled page preset (application-shell look).
// Every utility is smart:-prefixed with explicit smart:dark:* twins in the same
// template — no separate dark component. Vanilla Tailwind palette is used
// (gray-50/white shells, indigo accents) and kept template-faithful.

const PAGE = 'smart:min-h-full smart:bg-gray-50 smart:dark:bg-gray-900';

const HEADER =
  'smart:bg-white smart:border-b smart:border-gray-200 smart:dark:bg-gray-800 smart:dark:border-gray-700';

const CONTAINER =
  'smart:mx-auto smart:max-w-7xl smart:px-4 smart:sm:px-6 smart:lg:px-8';

const TITLE =
  'smart:text-2xl smart:font-semibold smart:text-gray-900 smart:dark:text-white';

const BODY_CARD =
  'smart:rounded-lg smart:border smart:border-gray-200 smart:bg-white smart:p-4 smart:sm:p-6 smart:shadow-2xs smart:dark:border-gray-700 smart:dark:bg-gray-800';

const ICON_BUTTON =
  'smart:inline-flex smart:items-center smart:rounded-md smart:p-1.5 smart:text-gray-400 smart:hover:text-gray-500 smart:dark:text-gray-500 smart:dark:hover:text-gray-400';

export function getPagePageClasses(cssClass = ''): string {
  return `${PAGE} ${cssClass}`.trim();
}

export function getPageHeaderClasses(): string {
  return HEADER;
}

export function getPageContainerClasses(): string {
  return CONTAINER;
}

export function getPageTitleClasses(): string {
  return TITLE;
}

export function getPageBodyCardClasses(): string {
  return BODY_CARD;
}

export function getPageIconButtonClasses(): string {
  return ICON_BUTTON;
}
