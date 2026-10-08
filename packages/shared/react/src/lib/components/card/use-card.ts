import type { ReactNode } from 'react';

import { SmartCardVariantProps } from './card.types';

/**
 * Whether a card section is rendered: `flag` when set, otherwise whether
 * `content` renders anything (`null`, `undefined`, booleans and `''` do not).
 */
export function isCardSectionShown(
  flag: boolean | undefined,
  content: ReactNode,
): boolean {
  if (flag !== undefined) return flag;

  return (
    content !== undefined &&
    content !== null &&
    typeof content !== 'boolean' &&
    content !== ''
  );
}

/**
 * The behaviour every card variant shares (the Angular `CardBaseComponent`):
 * which sections are shown, and the classes of the container and the header,
 * body and footer sections.
 */
export function useCard({
  options,
  hasHeader,
  hasFooter,
  headerTpl,
  footerTpl,
}: SmartCardVariantProps) {
  const showHeader = isCardSectionShown(hasHeader, headerTpl);
  const showFooter = isCardSectionShown(hasFooter, footerTpl);

  const sharedContainerClasses = ['smart:overflow-hidden'];

  if (
    (showHeader || showFooter) &&
    !options?.grayFooter &&
    !options?.grayBody
  ) {
    sharedContainerClasses.push(
      'smart:divide-y',
      'smart:divide-gray-200',
      'smart:dark:divide-white/10',
    );
  }

  const headerClasses = 'smart:px-4 smart:py-5 smart:sm:px-6';

  const bodyClasses = ['smart:px-4', 'smart:py-5', 'smart:sm:p-6'];

  if (options?.grayBody) {
    bodyClasses.push('smart:bg-gray-50', 'smart:dark:bg-gray-800/50');
  }

  const footerClasses = ['smart:px-4', 'smart:py-4', 'smart:sm:px-6'];

  if (options?.grayFooter) {
    footerClasses.push('smart:bg-gray-50', 'smart:dark:bg-gray-800/50');
  }

  return {
    showHeader,
    showFooter,
    sharedContainerClasses,
    headerClasses,
    bodyClasses: bodyClasses.join(' '),
    footerClasses: footerClasses.join(' '),
  };
}
