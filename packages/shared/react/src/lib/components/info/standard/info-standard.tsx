import { useEffect, useRef } from 'react';
import type { MouseEvent as ReactMouseEvent } from 'react';

import { useTranslate } from '../../../providers/hooks';
import { cn } from '../../../utils/class-names';
import { SmartInfoProps } from '../info.types';
import { useInfo } from '../use-info';

/**
 * The default info rendering: an info icon that toggles a popover with the
 * translated `options.text`. A click outside the component (a `click` listener
 * on `document`) closes the popover.
 */
export function SmartInfoStandard({ options, className = '' }: SmartInfoProps) {
  const t = useTranslate();
  const { isOpen, toggle, close } = useInfo();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const onDocumentClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) close();
    };

    document.addEventListener('click', onDocumentClick);

    return () => document.removeEventListener('click', onDocumentClick);
  }, [isOpen, close]);

  const onToggleClick = (event: ReactMouseEvent<HTMLButtonElement>) => {
    toggle();
    event.stopPropagation();
  };

  return (
    <div
      ref={rootRef}
      className={cn('smart:relative', 'smart:inline-block', className)}
    >
      <button type="button" onClick={onToggleClick}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="smart:h-5 smart:w-5"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {isOpen && (
        <div
          data-testid="info-popover"
          className="smart:absolute smart:z-10 smart:mt-2 smart:w-64 smart:rounded-lg smart:bg-white smart:p-3 smart:text-sm smart:text-gray-700 smart:shadow-lg smart:ring-1 smart:ring-gray-900/5 smart:dark:bg-gray-800 smart:dark:text-gray-300 smart:dark:ring-white/10"
        >
          {t(options.text)}
        </div>
      )}
    </div>
  );
}
