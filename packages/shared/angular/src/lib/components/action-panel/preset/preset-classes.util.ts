// Class recipes for the styled action-panel preset. Every utility is
// smart:-prefixed to match the scoped Tailwind build, with explicit
// smart:dark:* twins merged in for the dark theme.

import { IActionPanelAction } from '../../../models';

const CARD =
  'smart:rounded-xl smart:border smart:border-gray-200 smart:bg-white smart:p-4 smart:shadow-2xs smart:sm:p-6 smart:dark:border-gray-700 smart:dark:bg-gray-800';

const TITLE =
  'smart:text-base smart:font-semibold smart:text-gray-900 smart:dark:text-white';

const DESCRIPTION =
  'smart:text-sm smart:text-gray-500 smart:dark:text-gray-400';

const WELL =
  'smart:rounded-lg smart:bg-gray-50 smart:p-4 smart:dark:bg-gray-900/50';

const LINK = 'smart:text-sm smart:text-blue-600 smart:hover:underline';

const BUTTON_SOLID =
  'smart:rounded-lg smart:bg-blue-600 smart:px-3 smart:py-2 smart:text-sm smart:text-white smart:hover:bg-blue-700';

const BUTTON_OUTLINE =
  'smart:rounded-lg smart:border smart:border-gray-200 smart:bg-white smart:px-3 smart:py-2 smart:text-sm smart:text-gray-800 smart:hover:bg-gray-50 smart:dark:border-gray-700 smart:dark:bg-gray-800 smart:dark:text-white';

export function getActionPanelCardClasses(): string {
  return CARD;
}

export function getActionPanelTitleClasses(): string {
  return TITLE;
}

export function getActionPanelDescriptionClasses(): string {
  return DESCRIPTION;
}

export function getActionPanelWellClasses(): string {
  return WELL;
}

export function getActionPanelActionClasses(
  variant: IActionPanelAction['variant'],
  asLink: boolean,
): string {
  if (asLink) {
    return LINK;
  }
  return variant === 'primary' ? BUTTON_SOLID : BUTTON_OUTLINE;
}
