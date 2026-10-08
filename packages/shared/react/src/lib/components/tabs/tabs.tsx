import { SmartTabsStandard } from './standard/tabs-standard';
import { SmartTabsProps } from './tabs.types';
import { useSmartComponent } from '../../providers/hooks';

/**
 * `<smart-tabs>`: renders the implementation registered as `components.tabs`
 * on `SmartProvider` (the Angular `TABS_STANDARD_COMPONENT_TOKEN`),
 * `SmartTabsStandard` by default.
 */
export function SmartTabs(props: SmartTabsProps) {
  const Component = useSmartComponent('tabs', SmartTabsStandard);

  return <Component {...props} />;
}
