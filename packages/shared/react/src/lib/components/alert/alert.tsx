import { SmartAlertProps } from './alert.types';
import { SmartAlertStandard } from './standard/alert-standard';
import { useSmartComponent } from '../../providers/hooks';

/**
 * `<smart-alert>`: renders the implementation registered as
 * `components.alert` on `SmartProvider` (the Angular
 * `ALERT_STANDARD_COMPONENT_TOKEN`), `SmartAlertStandard` by default.
 * `AlertService` renders its dialogs through the same key, with
 * `{ options, onDismissed }`.
 */
export function SmartAlert(props: SmartAlertProps) {
  const Component = useSmartComponent('alert', SmartAlertStandard);

  return <Component {...props} />;
}
