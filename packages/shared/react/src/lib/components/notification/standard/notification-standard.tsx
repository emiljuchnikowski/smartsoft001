import { SmartNotificationProps } from '../notification.types';
import { useNotification } from '../use-notification';

/** The default notification rendering. */
export function SmartNotificationStandard(props: SmartNotificationProps) {
  const {
    title,
    description,
    actions = [],
    dismissible = false,
    options,
    className,
  } = props;
  const { dismiss, invokeAction } = useNotification(props);

  return (
    <div
      role="status"
      aria-live={options?.ariaLive ?? 'polite'}
      className={className}
    >
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {dismissible && (
        <button type="button" aria-label="Close" onClick={dismiss}>
          &times;
        </button>
      )}
      {actions.map((action) => (
        <button
          key={action.id}
          type="button"
          data-variant={action.variant ?? 'primary'}
          onClick={() => invokeAction(action.id)}
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}
