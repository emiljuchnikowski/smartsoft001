import { SmartPageHeadingProps } from './page-heading.types';
import { SmartPageHeadingStandard } from './standard/page-heading-standard';
import { useSmartComponent } from '../../providers/hooks';

/**
 * Renders the implementation registered as `components['page-heading']` on
 * `SmartProvider`, `SmartPageHeadingStandard` by default.
 */
export function SmartPageHeading(props: SmartPageHeadingProps) {
  const Component = useSmartComponent('page-heading', SmartPageHeadingStandard);

  return <Component {...props} />;
}
