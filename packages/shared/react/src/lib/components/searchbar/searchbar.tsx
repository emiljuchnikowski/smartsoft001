import { useSmartComponent } from '../../providers/hooks';
import { SmartSearchbarProps } from './searchbar.types';
import { SmartSearchbarStandard } from './standard/searchbar-standard';

/**
 * Renders the implementation registered as `components.searchbar` on
 * `SmartProvider`, `SmartSearchbarStandard` by default.
 */
export function SmartSearchbar(props: SmartSearchbarProps) {
  const Component = useSmartComponent('searchbar', SmartSearchbarStandard);

  return <Component {...props} />;
}
