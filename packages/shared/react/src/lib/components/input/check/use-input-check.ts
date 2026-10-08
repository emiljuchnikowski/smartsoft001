import { useCallback, useMemo } from 'react';

import { getModelFieldOptions } from '@smartsoft001/models';

import { SmartPossibility } from '../../../models';
import { useInput } from '../base/use-input';
import { useInputPossibilities } from '../base/use-input-possibilities';
import { SmartInputFieldProps } from '../input.types';

/**
 * The possibilities with `checked` set from the control value (the Angular
 * `syncCheckedWithControl`): a possibility whose `id` is an object with an
 * `id` is checked when the value holds an object with that `id`, and then
 * takes that object as its `id`, so the value keeps the stored objects; any
 * other possibility is checked when its `id` is in the value (or is the
 * value).
 */
export function syncInputCheckPossibilities(
  possibilities: SmartPossibility[] | null,
  value: unknown,
): SmartPossibility[] | null {
  if (!possibilities) return null;

  return possibilities.map((item) => {
    if (value && Array.isArray(value) && item?.id?.id) {
      const controlItem = value.find(
        (ci: { id?: unknown } | null) => ci?.id === item.id.id,
      );

      return controlItem
        ? { ...item, id: controlItem, checked: true }
        : { ...item, checked: false };
    }

    return {
      ...item,
      checked: Array.isArray(value)
        ? value.includes(item.id)
        : item.id === value,
    };
  });
}

/**
 * What both check fields share (the Angular `InputCheckComponent` logic on
 * top of `InputPossibilitiesBaseComponent`): the possibilities of the
 * provider or the input options, or else the model field's `possibilities`,
 * kept checked in line with the control value, and `toggle(item)`, which
 * sets the ids of the checked possibilities as the value and marks the
 * control dirty and touched.
 */
export function useInputCheck<T>(props: SmartInputFieldProps<T>) {
  const input = useInput(props);
  const { control, model, fieldKey, value } = input;
  const fromInput = useInputPossibilities(props);
  const fromModel = useMemo(() => {
    const possibilities =
      model && fieldKey
        ? getModelFieldOptions(model, fieldKey)?.possibilities
        : null;

    return Array.isArray(possibilities)
      ? (possibilities as SmartPossibility[])
      : null;
  }, [model, fieldKey]);

  const possibilities = useMemo(
    () => syncInputCheckPossibilities(fromInput ?? fromModel, value),
    [fromInput, fromModel, value],
  );

  const toggle = useCallback(
    (item: SmartPossibility) => {
      if (!control || !possibilities) return;

      const result = possibilities
        .filter((p) => (p === item ? !item.checked : p.checked))
        .map((p) => p.id);

      control.markAsDirty();
      control.markAsTouched();
      control.setValue(result);
    },
    [control, possibilities],
  );

  return { ...input, possibilities, toggle };
}
