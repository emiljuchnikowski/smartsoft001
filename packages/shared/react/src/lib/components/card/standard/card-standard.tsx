import { cn } from '../../../utils/class-names';
import { SmartCardVariantProps } from '../card.types';
import { useCard } from '../use-card';

/**
 * The default card rendering: a white panel with an optional header (with
 * `options.title`), the body and an optional footer.
 */
export function SmartCardStandard(props: SmartCardVariantProps) {
  const { options, className, headerTpl, bodyTpl, footerTpl } = props;
  const {
    showHeader,
    showFooter,
    sharedContainerClasses,
    headerClasses,
    bodyClasses,
    footerClasses,
  } = useCard(props);

  return (
    <div
      className={cn(
        sharedContainerClasses,
        'smart:rounded-lg',
        'smart:bg-white',
        'smart:shadow-sm',
        'smart:dark:bg-gray-800/50',
        'smart:dark:shadow-none',
        'smart:dark:outline',
        'smart:dark:-outline-offset-1',
        'smart:dark:outline-white/10',
        className,
      )}
    >
      {showHeader && (
        <div className={headerClasses}>
          {options?.title && (
            <h3 className="smart:text-base smart:font-semibold smart:text-gray-900 smart:dark:text-white">
              {options.title}
            </h3>
          )}
          {headerTpl}
        </div>
      )}

      <div className={bodyClasses}>{bodyTpl}</div>

      {showFooter && <div className={footerClasses}>{footerTpl}</div>}
    </div>
  );
}
