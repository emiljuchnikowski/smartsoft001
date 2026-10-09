import { useId } from 'react';

import { INotificationAction } from '../../../models';
import { cn } from '../../../utils/class-names';
import { SmartNotificationProps } from '../notification.types';
import { useNotification } from '../use-notification';
import {
  getNotificationActionClasses,
  getNotificationActionsRowClasses,
  getNotificationAvatarClasses,
  getNotificationCloseClasses,
  getNotificationContainerClasses,
  getNotificationDescriptionClasses,
  getNotificationIconClasses,
  getNotificationMessageClasses,
  getNotificationTitleClasses,
} from './preset-classes';

function CloseButton({
  className,
  onClick,
}: {
  className: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label="Close"
      className={className}
      onClick={onClick}
    >
      <span className="smart:sr-only">Close</span>
      <svg
        className="smart:shrink-0 smart:size-4"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </svg>
    </button>
  );
}

/**
 * Styled notification (toast) variation (preset). Register it as
 * `components.notification` on `SmartProvider` to restyle every
 * `<SmartNotification>`, or render it directly.
 *
 * Renders the Preline toast looks, selected via `options.variant` (defaults to
 * `simple`): `simple`, `condensed`, `with-actions-below`, `with-buttons-below`,
 * `with-split-buttons` and `with-avatar`. The `simple` variant does not render
 * `actions`. The label id is `smart-notification-preset-<useId()>`.
 */
export function SmartNotificationPreset(props: SmartNotificationProps) {
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
  const labelId = `smart-notification-preset-${useId()}`;

  const variant = options?.variant ?? 'simple';
  const ariaLive = options?.ariaLive ?? 'polite';

  const renderAction = (action: INotificationAction) => (
    <button
      key={action.id}
      type="button"
      className={getNotificationActionClasses(
        variant,
        action.variant ?? 'primary',
      )}
      onClick={() => invokeAction(action.id)}
    >
      {action.label}
    </button>
  );

  return (
    <div
      role="alert"
      tabIndex={-1}
      aria-live={ariaLive}
      aria-labelledby={labelId}
      className={cn(getNotificationContainerClasses(), className)}
    >
      {variant === 'condensed' ? (
        <div className="smart:flex smart:p-4">
          <p id={labelId} className={getNotificationMessageClasses()}>
            {title}
          </p>
          <div className="smart:ms-auto smart:flex smart:items-center smart:space-x-3">
            {actions.map(renderAction)}
            {dismissible && (
              <CloseButton
                className={getNotificationCloseClasses(false)}
                onClick={dismiss}
              />
            )}
          </div>
        </div>
      ) : variant === 'simple' ? (
        <div className="smart:flex smart:gap-x-3 smart:p-4">
          {iconName && (
            <span className={getNotificationIconClasses()}>{iconName}</span>
          )}
          <div className="smart:grow">
            <p id={labelId} className={getNotificationMessageClasses()}>
              {title}
            </p>
            {description && (
              <div className={getNotificationDescriptionClasses()}>
                {description}
              </div>
            )}
          </div>
          {dismissible && (
            <div className="smart:ms-auto">
              <CloseButton
                className={getNotificationCloseClasses(false)}
                onClick={dismiss}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="smart:relative smart:flex smart:gap-x-3 smart:p-4">
          {variant === 'with-avatar' && avatarUrl ? (
            <img
              className={getNotificationAvatarClasses()}
              src={avatarUrl}
              alt=""
            />
          ) : (
            iconName && (
              <span className={getNotificationIconClasses()}>{iconName}</span>
            )
          )}
          {dismissible && (
            <CloseButton
              className={getNotificationCloseClasses(true)}
              onClick={dismiss}
            />
          )}
          <div className="smart:grow smart:pe-4">
            <h3 id={labelId} className={getNotificationTitleClasses()}>
              {title}
            </h3>
            {description && (
              <div className={getNotificationDescriptionClasses()}>
                {description}
              </div>
            )}
            {actions.length > 0 && (
              <div className={getNotificationActionsRowClasses()}>
                {actions.map(renderAction)}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
