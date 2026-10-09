import { cn } from '../../../utils/class-names';
import { SmartIcon } from '../../icon';
import { SmartAccordionHeaderProps } from '../accordion.types';

/**
 * The header button of `SmartAccordionDefault`, with a chevron pointing up
 * while `open`. The click is handled by the accordion around it.
 */
export function SmartAccordionHeader({
  open = false,
  disabled = false,
  className,
  children,
}: SmartAccordionHeaderProps) {
  return (
    <button
      type="button"
      className={cn(
        [
          'smart:flex',
          'smart:w-full',
          'smart:items-center',
          'smart:justify-between',
          'smart:px-4',
          'smart:py-3',
          'smart:text-left',
          'smart:font-medium',
          'smart:text-gray-900',
          'smart:cursor-pointer',
          'smart:hover:bg-gray-50',
          'smart:dark:text-white',
          'smart:dark:hover:bg-gray-800',
        ],
        className,
        disabled && 'smart:cursor-not-allowed',
        disabled && 'smart:opacity-50',
      )}
      disabled={disabled}
    >
      {children}
      <SmartIcon
        name={open ? 'chevron-up' : 'chevron-down'}
        className="smart:text-gray-400 smart:transition-transform smart:duration-200"
      />
    </button>
  );
}
