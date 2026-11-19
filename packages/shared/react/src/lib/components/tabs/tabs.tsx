import { useSmartComponent } from '../../providers/hooks';
import { SmartTabsStandard } from './standard/tabs-standard';
import { SmartTabsProps } from './tabs.types';

/**
 * Renders the implementation registered as `components.tabs` on
 * `SmartProvider`, `SmartTabsStandard` by default.
 */
export function SmartTabs(props: SmartTabsProps) {
  const Component = useSmartComponent('tabs', SmartTabsStandard);

  return <Component {...props} />;
}
