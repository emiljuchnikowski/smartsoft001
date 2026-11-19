import { useSmartComponent } from '../../providers/hooks';
import { SmartBreadcrumbsProps } from './breadcrumbs.types';
import { SmartBreadcrumbsStandard } from './standard/breadcrumbs-standard';

/**
 * Renders the implementation registered as `components.breadcrumbs` on
 * `SmartProvider`, `SmartBreadcrumbsStandard` by default.
 */
export function SmartBreadcrumbs(props: SmartBreadcrumbsProps) {
  const Component = useSmartComponent('breadcrumbs', SmartBreadcrumbsStandard);

  return <Component {...props} />;
}
