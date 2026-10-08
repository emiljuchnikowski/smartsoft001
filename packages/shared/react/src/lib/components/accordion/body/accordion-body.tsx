import { cn } from '../../../utils/class-names';
import { SmartAccordionBodyProps } from '../accordion.types';

/** `<smart-accordion-body>`: the padded content of an open accordion. */
export function SmartAccordionBody({
  className,
  children,
}: SmartAccordionBodyProps) {
  return (
    <div
      className={cn(
        [
          'smart:px-4',
          'smart:py-3',
          'smart:text-gray-600',
          'smart:dark:text-gray-300',
        ],
        className,
      )}
    >
      {children}
    </div>
  );
}
