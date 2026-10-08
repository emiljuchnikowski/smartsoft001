import { useCallback } from 'react';

import { useControlState } from '../../../forms/hooks';
import { useModelLabel } from '../../../utils/hooks';
import { SmartInputFieldProps } from '../input.types';

/**
 * What every field component shares (the Angular `InputBaseComponent`): the
 * control and its live state, whether it is required, the translated label
 * and the handlers that bind an element to the control the way the
 * `formControl` directive does (a change sets the value and marks the control
 * dirty, a blur marks it touched).
 */
export function useInput<T = any>({
  options,
  fieldOptions,
}: SmartInputFieldProps<T>) {
  const control = options?.control ?? null;
  const state = useControlState(control);
  const label = useModelLabel(
    control?.parent?.value,
    options?.fieldKey ?? '',
    (options?.model as { constructor?: unknown } | undefined)?.constructor,
  );

  const setValue = useCallback(
    (value: unknown) => {
      if (!control) return;

      control.setValue(value);
      control.markAsDirty();
    },
    [control],
  );

  const markAsTouched = useCallback(() => control?.markAsTouched(), [control]);

  return {
    control,
    state,
    value: state?.value,
    required: state?.required ?? false,
    disabled: state?.disabled ?? false,
    label,
    fieldKey: options?.fieldKey ?? '',
    model: options?.model,
    mode: options?.mode,
    treeLevel: options?.treeLevel ?? 0,
    fieldOptions,
    /** Sets the value as the user would: the control becomes dirty. */
    setValue,
    /** Marks the control as touched, as leaving the field does. */
    markAsTouched,
    /** Autofocus as `fieldOptions.focused` asks. */
    autoFocus: !!fieldOptions?.focused,
  };
}
