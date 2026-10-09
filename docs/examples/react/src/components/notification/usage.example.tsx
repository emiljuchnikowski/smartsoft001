// #region usage
import { useState } from 'react';

import {
  INotificationAction,
  INotificationActionClick,
  INotificationOptions,
  SmartNotification,
} from '@smartsoft001/react';

const actions: INotificationAction[] = [
  { id: 'undo', label: 'Undo', variant: 'primary' },
];

// The preset's `simple` look has no room for actions: show them below.
const options: INotificationOptions = { variant: 'with-actions-below' };

export function NotificationUsageExample() {
  const [visible, setVisible] = useState(true);
  const [lastAction, setLastAction] = useState<string | null>(null);

  const onActionClick = ({ actionId }: INotificationActionClick) =>
    setLastAction(actionId);

  return (
    <>
      {/* The notification has no open state: remove it on onDismissed. */}
      {visible && (
        <SmartNotification
          title="Successfully saved!"
          description="Anyone with a link can now view this file."
          actions={actions}
          dismissible
          options={options}
          onActionClick={onActionClick}
          onDismissed={() => setVisible(false)}
        />
      )}

      {lastAction && <p>Last action: {lastAction}</p>}
    </>
  );
}
// #endregion
