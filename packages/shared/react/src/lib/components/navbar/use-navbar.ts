import { useCallback, useState } from 'react';

import { SmartNavbarProps } from './navbar.types';

/**
 * The behaviour every navbar variant shares (the Angular
 * `NavbarBaseComponent` and its `mobileMenuOpen` model): the mobile menu
 * state, controlled through `mobileMenuOpen` or kept internally when that
 * prop is `undefined`, and the item click.
 */
export function useNavbar({
  mobileMenuOpen,
  defaultMobileMenuOpen = false,
  onMobileMenuOpenChange,
  onItemClick,
}: SmartNavbarProps) {
  const [internalOpen, setInternalOpen] = useState(defaultMobileMenuOpen);
  const controlled = mobileMenuOpen !== undefined;
  const open = controlled ? mobileMenuOpen : internalOpen;

  const setMobileMenuOpen = useCallback(
    (next: boolean) => {
      if (!controlled) setInternalOpen(next);

      onMobileMenuOpenChange?.(next);
    },
    [controlled, onMobileMenuOpenChange],
  );

  const toggleMobileMenu = useCallback(
    () => setMobileMenuOpen(!open),
    [open, setMobileMenuOpen],
  );

  const itemClick = useCallback(
    (itemId: string) => onItemClick?.({ itemId }),
    [onItemClick],
  );

  return {
    mobileMenuOpen: open,
    setMobileMenuOpen,
    toggleMobileMenu,
    itemClick,
  };
}
