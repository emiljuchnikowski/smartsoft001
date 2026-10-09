import { useCallback, useMemo, useSyncExternalStore } from 'react';

import {
  SmartAbstractControl,
  SmartControlStatus,
  SmartValidationErrors,
} from './abstract-control';
import { isControlRequired } from './validators';

const noop = (): void => undefined;

/**
 * Re-renders the calling component whenever `control` changes, and returns
 * the control's version. Every other hook here is built on it.
 */
export function useControlVersion(
  control: SmartAbstractControl | null | undefined,
): number {
  const subscribe = useCallback(
    (onChange: () => void) => {
      if (!control) return noop;

      const subscription = control.changes.subscribe(onChange);

      return () => subscription.unsubscribe();
    },
    [control],
  );
  const getSnapshot = useCallback(() => control?.version ?? 0, [control]);

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export interface SmartControlState<TValue = any> {
  value: TValue;
  status: SmartControlStatus;
  errors: SmartValidationErrors | null;
  valid: boolean;
  invalid: boolean;
  pending: boolean;
  disabled: boolean;
  touched: boolean;
  dirty: boolean;
  /** The control reports `required` for an empty value. */
  required: boolean;
}

function snapshot<TValue>(
  control: SmartAbstractControl<TValue>,
): SmartControlState<TValue> {
  return {
    value: control.value,
    status: control.status,
    errors: control.errors,
    valid: control.valid,
    invalid: control.invalid,
    pending: control.pending,
    disabled: control.disabled,
    touched: control.touched,
    dirty: control.dirty,
    required: isControlRequired(control),
  };
}

/** The current state of `control`, kept up to date across changes. */
export function useControlState<TValue = any>(
  control: SmartAbstractControl<TValue>,
): SmartControlState<TValue>;
export function useControlState<TValue = any>(
  control: SmartAbstractControl<TValue> | null | undefined,
): SmartControlState<TValue> | null;
export function useControlState<TValue = any>(
  control: SmartAbstractControl<TValue> | null | undefined,
): SmartControlState<TValue> | null {
  const version = useControlVersion(control);

  return useMemo(
    () => (control ? snapshot(control) : null),
    // `version` moves on every change; the control itself is mutable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [control, version],
  );
}

export interface SmartControlBinding<
  TValue = any,
> extends SmartControlState<TValue> {
  /** Sets the value as the user would: the control becomes dirty. */
  onChange: (value: TValue) => void;
  /** Marks the control as touched, as leaving a field does. */
  onBlur: () => void;
}

/**
 * Binds an input element to a control: a change sets the value and marks the
 * control dirty, a blur marks it touched.
 */
export function useControlBinding<TValue = any>(
  control: SmartAbstractControl<TValue>,
): SmartControlBinding<TValue> {
  const state = useControlState(control);
  const onChange = useCallback(
    (value: TValue) => {
      // Dirty first, so listeners of the value change already see the
      // control as edited.
      control.markAsDirty();
      control.setValue(value);
    },
    [control],
  );
  const onBlur = useCallback(() => control.markAsTouched(), [control]);

  return useMemo(
    () => ({ ...state, onChange, onBlur }),
    [state, onChange, onBlur],
  );
}
