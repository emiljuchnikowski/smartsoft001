import { useSmartComponent } from '../../providers/hooks';
import { SmartCardHeadingProps } from './card-heading.types';
import { SmartCardHeadingStandard } from './standard/card-heading-standard';

/**
 * Renders the implementation registered as `components['card-heading']` on
 * `SmartProvider`, `SmartCardHeadingStandard` by default.
 */
export function SmartCardHeading(props: SmartCardHeadingProps) {
  const Component = useSmartComponent('card-heading', SmartCardHeadingStandard);

  return <Component {...props} />;
}
