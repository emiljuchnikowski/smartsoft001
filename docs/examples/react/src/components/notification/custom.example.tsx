// #region usage
import {
  INotificationAction,
  INotificationOptions,
  SmartNotification,
  SmartNotificationProps,
  SmartProvider,
  useNotification,
} from '@smartsoft001/react';

/**
 * A custom notification built on `useNotification`: the hook provides
 * `dismiss()` and `invokeAction(id)`, which already report `onDismissed` and
 * `onActionClick` - the implementation only decides the markup.
 */
export function CustomNotification(props: SmartNotificationProps) {
  const {
    title,
    description,
    iconName,
    avatarUrl,
    actions = [],
    dismissible = false,
    options,
    className,
  } = props;
  const { dismiss, invokeAction } = useNotification(props);

  const classes = [
    'docs-notification',
    options?.variant && `docs-notification--${options.variant}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <section
      role="status"
      aria-live={options?.ariaLive ?? 'polite'}
      className={classes}
    >
      {avatarUrl ? (
        <img className="docs-notification__avatar" src={avatarUrl} alt="" />
      ) : iconName ? (
        <span className="docs-notification__icon" aria-hidden="true">
          {iconName}
        </span>
      ) : null}

      <div className="docs-notification__body">
        <h3 className="docs-notification__title">{title}</h3>
        {description && (
          <p className="docs-notification__description">{description}</p>
        )}

        {actions.length > 0 && (
          <div className="docs-notification__actions">
            {actions.map((action) => (
              <button
                key={action.id}
                type="button"
                className="docs-notification__action"
                data-variant={action.variant ?? 'primary'}
                onClick={() => invokeAction(action.id)}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {dismissible && (
        <button
          type="button"
          className="docs-notification__dismiss"
          aria-label="Close"
          onClick={dismiss}
        >
          &times;
        </button>
      )}
    </section>
  );
}

// A module constant: a new object on every render would change the context.
const components = { notification: CustomNotification };

const avatarUrl =
  'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=facearea&facepad=2&w=300&h=300&q=80';

const actions: INotificationAction[] = [
  { id: 'deny', label: "Don't allow", variant: 'secondary' },
  { id: 'allow', label: 'Allow', variant: 'primary' },
];

const options: INotificationOptions = {
  variant: 'with-actions-below',
  ariaLive: 'polite',
};

/**
 * Every `SmartNotification` below this provider, and every toast of
 * `ToastService`, renders `CustomNotification` instead of the standard
 * rendering.
 */
export function NotificationCustomExample() {
  return (
    <SmartProvider components={components}>
      <SmartNotification
        title="App notifications"
        description="Notifications may include alerts, sounds and icon badges."
        avatarUrl={avatarUrl}
        actions={actions}
        dismissible
        options={options}
      />
    </SmartProvider>
  );
}
// #endregion
