import { SmartPageHeadingProps } from './page-heading.types';
import { SmartPageHeadingStandard } from './standard/page-heading-standard';
import { useSmartComponent } from '../../providers/hooks';

/**
 * `<smart-page-heading>`: renders the implementation registered as
 * `components['page-heading']` on `SmartProvider` (the Angular
 * `PAGE_HEADING_STANDARD_COMPONENT_TOKEN`), `SmartPageHeadingStandard` by
 * default.
 */
export function SmartPageHeading(props: SmartPageHeadingProps) {
  const Component = useSmartComponent('page-heading', SmartPageHeadingStandard);

  return <Component {...props} />;
}
