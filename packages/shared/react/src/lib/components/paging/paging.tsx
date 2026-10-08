import { SmartPagingProps } from './paging.types';
import { SmartPagingStandard } from './standard/paging-standard';
import { useSmartComponent } from '../../providers/hooks';

/**
 * `<smart-paging>`: renders the implementation registered as
 * `components.paging` on `SmartProvider` (the Angular
 * `PAGING_STANDARD_COMPONENT_TOKEN`), `SmartPagingStandard` by default.
 * The page is owned by the parent: `onPageChange` reports the requested page.
 */
export function SmartPaging(props: SmartPagingProps) {
  const Component = useSmartComponent('paging', SmartPagingStandard);

  return <Component {...props} />;
}
