import { SmartTabsStandard } from './standard/tabs-standard';
import { SmartTabsProps } from './tabs.types';
import { useSmartComponent } from '../../providers/hooks';

/**
 * Renders the implementation registered as `components.tabs` on
 * `SmartProvider`, `SmartTabsStandard` by default.
 */
export function SmartTabs(props: SmartTabsProps) {
  const Component = useSmartComponent('tabs', SmartTabsStandard);

  return <Component {...props} />;
}
