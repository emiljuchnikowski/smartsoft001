import { SmartSearchbarProps } from './searchbar.types';
import { SmartSearchbarStandard } from './standard/searchbar-standard';
import { useSmartComponent } from '../../providers/hooks';

/**
 * Renders the implementation registered as `components.searchbar` on
 * `SmartProvider`, `SmartSearchbarStandard` by default.
 */
export function SmartSearchbar(props: SmartSearchbarProps) {
  const Component = useSmartComponent('searchbar', SmartSearchbarStandard);

  return <Component {...props} />;
}
