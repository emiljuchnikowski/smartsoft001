import { useEffect } from 'react';

/**
 * Calls `close` on an Escape key press anywhere in the document while `open`
 * is true. Used by the standard and the preset; `useCommandPalette` itself
 * binds no keyboard listeners, so a custom implementation decides on its own.
 */
export function useCloseOnEscape(open: boolean, close: () => void): void {
  useEffect(() => {
    if (!open) return undefined;

    const listener = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };

    document.addEventListener('keydown', listener);

    return () => document.removeEventListener('keydown', listener);
  }, [open, close]);
}
