import { SmartTableStandard } from './standard/table-standard';
import { SmartTableProps } from './table.types';
import { useSmartComponent } from '../../providers/hooks';

/**
 * `<smart-table>`: renders the implementation registered as
 * `components.table` on `SmartProvider` (the Angular
 * `TABLE_STANDARD_COMPONENT_TOKEN`), `SmartTableStandard` by default.
 */
export function SmartTable(props: SmartTableProps) {
  const Component = useSmartComponent('table', SmartTableStandard);

  return <Component {...props} />;
}
