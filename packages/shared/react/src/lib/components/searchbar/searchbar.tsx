import { SmartSearchbarProps } from './searchbar.types';
import { SmartSearchbarStandard } from './standard/searchbar-standard';
import { useSmartComponent } from '../../providers/hooks';

/**
 * `<smart-searchbar>`: renders the implementation registered as
 * `components.searchbar` on `SmartProvider` (the Angular
 * `SEARCHBAR_STANDARD_COMPONENT_TOKEN`), `SmartSearchbarStandard` by default.
 */
export function SmartSearchbar(props: SmartSearchbarProps) {
  const Component = useSmartComponent('searchbar', SmartSearchbarStandard);

  return <Component {...props} />;
}
