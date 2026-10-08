import { SmartNotificationProps } from './notification.types';
import { SmartNotificationStandard } from './standard/notification-standard';
import { useSmartComponent } from '../../providers/hooks';

/**
 * `<smart-notification>`: renders the implementation registered as
 * `components.notification` on `SmartProvider` (the Angular
 * `NOTIFICATION_STANDARD_COMPONENT_TOKEN`), `SmartNotificationStandard` by
 * default. It has no open state: render it while the notification is shown
 * and remove it on `onDismissed`.
 */
export function SmartNotification(props: SmartNotificationProps) {
  const Component = useSmartComponent(
    'notification',
    SmartNotificationStandard,
  );

  return <Component {...props} />;
}
