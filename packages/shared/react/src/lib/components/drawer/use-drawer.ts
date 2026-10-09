import { useCallback, useState } from 'react';

import { SmartDrawerProps } from './drawer.types';

/**
 * The behaviour every drawer variant shares: the `open` state, controlled
 * through `open` / `onOpenChange` or kept internally from `defaultOpen`, and
 * `close()`, which hides the drawer and reports `onClosed`.
 */
export function useDrawer({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  onClosed,
}: SmartDrawerProps) {
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

  const close = useCallback(() => {
    setOpen(false);
    onClosed?.();
  }, [setOpen, onClosed]);

  return { open, setOpen, close };
}
