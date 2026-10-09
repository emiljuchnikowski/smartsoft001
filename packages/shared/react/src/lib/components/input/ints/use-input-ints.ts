import { useCallback, useEffect, useState } from 'react';

import { useInput } from '../base/use-input';
import { SmartInputFieldProps } from '../input.types';
import { toNumberValue } from '../int/number-value';

/** One row of the ints field. */
export interface SmartIntsItem {
  /** Stable key of the row. */
  id: number;
  value: number | null;
}

let nextItemId = 0;

function createItem(value: number | null): SmartIntsItem {
  return { id: nextItemId++, value };
}

/**
 * The list logic of the ints field shared by `SmartInputInts` and
 * `SmartInputIntsPreset`: one row per number plus a trailing row to add one.
 * Every change writes the non-empty rows (`0` counts as empty) to the control
 * as numbers, marks the control touched and dirty, and appends a new row (`0`)
 * once the last row has a value. This also runs when the control is set.
 */
export function useInputInts<T>(props: SmartInputFieldProps<T>) {
  const input = useInput(props);
  const { control } = input;
  const [items, setItems] = useState<SmartIntsItem[]>([]);

  const refresh = useCallback(
    (list: SmartIntsItem[]) => {
      if (!control) return;

      control.markAsTouched();
      control.markAsDirty();
      control.setValue(
        list.filter((i) => i && i.value).map((i) => Number(i.value)),
      );

      const last = list[list.length - 1];

      setItems(
        !list.length || (last && last.value) ? [...list, createItem(0)] : list,
      );
    },
    [control],
  );

  useEffect(() => {
    if (!control) return;

    const values = (control.value as Array<number | null> | null) || [];

    refresh(values.map((value) => createItem(value)));
  }, [control, refresh]);

  const update = (id: number, value: number | null) =>
    refresh(items.map((i) => (i.id === id ? { ...i, value } : i)));

  return {
    ...input,
    items,
    /** Sets the typed number of a row (empty -> `null`). */
    changeItem: (id: number, raw: string) => update(id, toNumberValue(raw)),
    removeItem: (id: number) => refresh(items.filter((i) => i.id !== id)),
    increment: (item: SmartIntsItem) =>
      update(item.id, Number(item.value || 0) + 1),
    decrement: (item: SmartIntsItem) =>
      update(item.id, Number(item.value || 0) - 1),
  };
}
