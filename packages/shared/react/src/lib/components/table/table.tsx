import { SmartTableStandard } from './standard/table-standard';
import { SmartTableProps } from './table.types';
import { useSmartComponent } from '../../providers/hooks';

/**
 * Renders the implementation registered as `components.table` on
 * `SmartProvider`, `SmartTableStandard` by default.
 */
export function SmartTable(props: SmartTableProps) {
  const Component = useSmartComponent('table', SmartTableStandard);

  return <Component {...props} />;
}
