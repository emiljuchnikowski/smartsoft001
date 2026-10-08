import { SmartActionPanelProps } from './action-panel.types';
import { SmartActionPanelStandard } from './standard/action-panel-standard';
import { useSmartComponent } from '../../providers/hooks';

/**
 * `<smart-action-panel>`: renders the implementation registered as
 * `components['action-panel']` on `SmartProvider` (the Angular
 * `ACTION_PANEL_STANDARD_COMPONENT_TOKEN`), `SmartActionPanelStandard` by
 * default. `onActionClick` is passed through to the implementation.
 */
export function SmartActionPanel(props: SmartActionPanelProps) {
  const Component = useSmartComponent('action-panel', SmartActionPanelStandard);

  return <Component {...props} />;
}
