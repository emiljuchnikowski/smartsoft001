import { useCallback } from 'react';

import { SmartNotificationProps } from './notification.types';

/**
 * The behaviour every notification variant shares: `dismiss()` reports
 * `onDismissed` and `invokeAction(id)` reports `onActionClick`. The
 * notification does not hide itself; its owner removes it.
 */
export function useNotification({
  onDismissed,
  onActionClick,
}: SmartNotificationProps) {
  const dismiss = useCallback(() => onDismissed?.(), [onDismissed]);

  const invokeAction = useCallback(
    (actionId: string) => onActionClick?.({ actionId }),
    [onActionClick],
  );

  return { dismiss, invokeAction };
}
