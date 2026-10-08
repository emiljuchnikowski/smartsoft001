import { SmartBreadcrumbsProps } from './breadcrumbs.types';
import { SmartBreadcrumbsStandard } from './standard/breadcrumbs-standard';
import { useSmartComponent } from '../../providers/hooks';

/**
 * `<smart-breadcrumbs>`: renders the implementation registered as
 * `components.breadcrumbs` on `SmartProvider` (the Angular
 * `BREADCRUMBS_STANDARD_COMPONENT_TOKEN`), `SmartBreadcrumbsStandard` by
 * default.
 */
export function SmartBreadcrumbs(props: SmartBreadcrumbsProps) {
  const Component = useSmartComponent('breadcrumbs', SmartBreadcrumbsStandard);

  return <Component {...props} />;
}
