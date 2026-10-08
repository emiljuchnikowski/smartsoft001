import { useCallback, useState } from 'react';

import { SmartDropdownProps } from './dropdown.types';

/**
 * The behaviour every dropdown variant shares (the Angular
 * `DropdownBaseComponent`): the `open` state, controlled through `open` /
 * `onOpenChange` or kept internally from `defaultOpen`; `toggle()`,
 * `close()`, and `selectItem(id)`, which reports `onSelectedItem` and closes
 * the menu.
 */
export function useDropdown({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  onSelectedItem,
}: SmartDropdownProps) {
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

  const toggle = useCallback(() => setOpen(!open), [setOpen, open]);

  const close = useCallback(() => setOpen(false), [setOpen]);

  const selectItem = useCallback(
    (itemId: string) => {
      onSelectedItem?.({ itemId });
      setOpen(false);
    },
    [onSelectedItem, setOpen],
  );

  return { open, setOpen, toggle, close, selectItem };
}
