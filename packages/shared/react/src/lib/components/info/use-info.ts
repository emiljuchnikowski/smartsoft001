import { useCallback, useState } from 'react';

/**
 * The behaviour every info variant shares (the Angular `InfoBaseComponent`):
 * whether the text is shown, and the functions that show and hide it.
 */
export function useInfo() {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = useCallback(() => setIsOpen((value) => !value), []);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return { isOpen, toggle, open, close };
}
