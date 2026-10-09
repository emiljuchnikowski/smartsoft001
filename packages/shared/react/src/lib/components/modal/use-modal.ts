import { useCallback, useState } from 'react';

import { SmartModalProps } from './modal.types';

/**
 * The behaviour every modal variant shares: the `open` state, controlled
 * through `open` / `onOpenChange` or kept internally from `defaultOpen`;
 * `invokeAction(id)`, which reports `onActionClick` without closing, and
 * `close()`, which hides the modal and reports `onClosed`.
 */
export function useModal({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  onActionClick,
  onClosed,
}: SmartModalProps) {
  const [innerOpen, setInnerOpen] = useState(defaultOpen);
  const controlled = openProp !== undefined;
  const open = controlled ? openProp : innerOpen;

  const setOpen = useCallback(
    (value: boolean) => {
      if (value === open) return;
      if (!controlled) setInnerOpen(value);
      onOpenChange?.(value);
    },
    [open, controlled, onOpenChange],
  );

  const invokeAction = useCallback(
    (actionId: string) => onActionClick?.({ actionId }),
    [onActionClick],
  );

  const close = useCallback(() => {
    setOpen(false);
    onClosed?.();
  }, [setOpen, onClosed]);

  return { open, setOpen, invokeAction, close };
}
