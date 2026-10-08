import { useCallback, useMemo, useState } from 'react';

import { SmartCommandPaletteProps } from './command-palette.types';
import { ICommand } from '../../models';

/**
 * A value that is controlled when `value` is defined and kept in state
 * otherwise; `onChange` is called only when the value actually changes, like
 * an Angular `model()`.
 */
function useModel<T>(
  value: T | undefined,
  defaultValue: T,
  onChange: ((value: T) => void) | undefined,
): [T, (next: T) => void] {
  const [internal, setInternal] = useState<T>(defaultValue);
  const controlled = value !== undefined;
  const current = controlled ? value : internal;

  const set = useCallback(
    (next: T) => {
      if (Object.is(next, current)) return;

      if (!controlled) setInternal(next);
      onChange?.(next);
    },
    [controlled, current, onChange],
  );

  return [current, set];
}

/**
 * The behaviour every command-palette variant shares (the Angular
 * `CommandPaletteBaseComponent`): the `open` and `query` models (controlled
 * or uncontrolled), the commands filtered by a case-insensitive label
 * substring, and `selectCommand`, which reports the command through
 * `onRunCommand` and closes the palette.
 */
export function useCommandPalette({
  commands = [],
  open,
  defaultOpen = false,
  onOpenChange,
  query,
  defaultQuery = '',
  onQueryChange,
  onRunCommand,
}: SmartCommandPaletteProps) {
  const [currentOpen, setOpen] = useModel(open, defaultOpen, onOpenChange);
  const [currentQuery, setQuery] = useModel(query, defaultQuery, onQueryChange);

  const filteredCommands = useMemo<ICommand[]>(() => {
    const q = currentQuery.toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => c.label.toLowerCase().includes(q));
  }, [commands, currentQuery]);

  const selectCommand = useCallback(
    (commandId: string) => {
      onRunCommand?.({ commandId });
      setOpen(false);
    },
    [onRunCommand, setOpen],
  );

  const close = useCallback(() => setOpen(false), [setOpen]);

  return {
    open: currentOpen,
    query: currentQuery,
    setQuery,
    filteredCommands,
    selectCommand,
    close,
  };
}
