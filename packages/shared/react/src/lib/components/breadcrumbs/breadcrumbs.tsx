import { SmartBreadcrumbsProps } from './breadcrumbs.types';
import { SmartBreadcrumbsStandard } from './standard/breadcrumbs-standard';
import { useSmartComponent } from '../../providers/hooks';

/**
 * Renders the implementation registered as `components.breadcrumbs` on
 * `SmartProvider`, `SmartBreadcrumbsStandard` by default.
 */
export function SmartBreadcrumbs(props: SmartBreadcrumbsProps) {
  const Component = useSmartComponent('breadcrumbs', SmartBreadcrumbsStandard);

  return <Component {...props} />;
}
