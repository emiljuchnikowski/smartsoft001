import { SmartCardProps, SmartCardVariantProps } from './card.types';
import { SmartCardStandard } from './standard/card-standard';
import { isCardSectionShown } from './use-card';
import { useSmartComponent } from '../../providers/hooks';

/**
 * `<smart-card>`: renders the implementation registered as `components.card`
 * on `SmartProvider` (the Angular `CARD_STANDARD_COMPONENT_TOKEN`),
 * `SmartCardStandard` by default.
 *
 * `header` and `footer` replace the Angular `[cardHeader]` / `[cardFooter]`
 * slots and reach the implementation as `headerTpl` / `footerTpl`, the
 * children as `bodyTpl`. A section is rendered when its content is given,
 * unless `hasHeader` / `hasFooter` say otherwise.
 */
export function SmartCard({
  options,
  hasHeader,
  hasFooter,
  className,
  header,
  footer,
  children,
}: SmartCardProps) {
  const Component = useSmartComponent<SmartCardVariantProps>(
    'card',
    SmartCardStandard,
  );

  return (
    <Component
      options={options}
      hasHeader={isCardSectionShown(hasHeader, header)}
      hasFooter={isCardSectionShown(hasFooter, footer)}
      className={className}
      headerTpl={header}
      bodyTpl={children}
      footerTpl={footer}
    />
  );
}
