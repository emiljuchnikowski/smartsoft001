import { SmartCardHeadingProps } from './card-heading.types';
import { SmartCardHeadingStandard } from './standard/card-heading-standard';
import { useSmartComponent } from '../../providers/hooks';

/**
 * `<smart-card-heading>`: renders the implementation registered as
 * `components['card-heading']` on `SmartProvider` (the Angular
 * `CARD_HEADING_STANDARD_COMPONENT_TOKEN`), `SmartCardHeadingStandard` by
 * default.
 */
export function SmartCardHeading(props: SmartCardHeadingProps) {
  const Component = useSmartComponent('card-heading', SmartCardHeadingStandard);

  return <Component {...props} />;
}
