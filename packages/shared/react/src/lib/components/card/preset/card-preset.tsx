import { cn } from '../../../utils/class-names';
import { SmartCardVariantProps } from '../card.types';
import { useCard } from '../use-card';
import {
  getCardBodyClasses,
  getCardContainerClasses,
  getCardFooterClasses,
  getCardHeaderClasses,
} from './preset-classes';

/**
 * Styled card variation (preset). Register it as `components.card` on
 * `SmartProvider` to restyle every `<SmartCard>`, or render it directly.
 *
 * Renders the same header / body / footer slots as the standard card, with
 * the Preline card look: `rounded-xl` surface, `shadow-2xs`, a bordered
 * surface header and footer. Honours `options.grayBody` / `options.grayFooter`.
 */
export function SmartCardPreset(props: SmartCardVariantProps) {
  const { options, className = '', headerTpl, bodyTpl, footerTpl } = props;
  const { showHeader, showFooter } = useCard(props);

  return (
    <div className={cn(getCardContainerClasses(), className)}>
      {showHeader && (
        <div className={getCardHeaderClasses()}>
          {options?.title && (
            <h3 className="smart:font-semibold smart:text-gray-900 smart:dark:text-white">
              {options.title}
            </h3>
          )}
          {headerTpl}
        </div>
      )}

      <div className={getCardBodyClasses(Boolean(options?.grayBody))}>
        {bodyTpl}
      </div>

      {showFooter && (
        <div className={getCardFooterClasses(Boolean(options?.grayFooter))}>
          {footerTpl}
        </div>
      )}
    </div>
  );
}
