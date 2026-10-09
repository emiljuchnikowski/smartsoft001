import { useId } from 'react';

import { cn } from '../../../utils/class-names';
import { SmartAccordionBaseProps } from '../accordion.types';
import { useAccordion } from '../use-accordion';
import {
  getAccordionPresetContainerClasses,
  getAccordionPresetContentClasses,
  getAccordionPresetIconClasses,
  getAccordionPresetToggleClasses,
} from './preset-classes';

/**
 * Styled accordion variation (preset), based on the Preline bordered
 * accordion.
 *
 * The accordion has no registry key: render it directly with the same
 * `headerTpl` / `bodyTpl`, `show` and `className` contract as
 * `SmartAccordionDefault`. The toggle button carries `aria-expanded` /
 * `aria-controls`; the open body is a `region`.
 */
export function SmartAccordionPreset(props: SmartAccordionBaseProps) {
  const { options, className, headerTpl, bodyTpl } = props;
  const { show, toggle } = useAccordion(props);
  const id = useId();
  const contentId = 'smart-accordion-preset-' + id;
  const iconClasses = getAccordionPresetIconClasses();

  return (
    <div className={cn(getAccordionPresetContainerClasses(show), className)}>
      <button
        type="button"
        className={cn(getAccordionPresetToggleClasses(show))}
        disabled={options?.disabled ?? false}
        aria-expanded={show}
        aria-controls={contentId}
        onClick={toggle}
      >
        {headerTpl}

        {show ? (
          <svg
            className={iconClasses}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m18 15-6-6-6 6" />
          </svg>
        ) : (
          <svg
            className={iconClasses}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        )}
      </button>

      {show && (
        <div
          id={contentId}
          className={cn(getAccordionPresetContentClasses())}
          role="region"
        >
          {bodyTpl}
        </div>
      )}
    </div>
  );
}
