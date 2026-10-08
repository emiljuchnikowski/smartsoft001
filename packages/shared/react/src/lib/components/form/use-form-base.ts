import { useCallback } from 'react';

import { getModelFieldKeys } from '@smartsoft001/models';

import { SmartFormBaseProps } from './form.types';
import { SmartAbstractControl } from '../../forms/abstract-control';
import { SmartFormGroup } from '../../forms/form-group';
import { useControlVersion } from '../../forms/hooks';

/** The field order of every form rendered so far, by form. */
const fieldOrders = new WeakMap<SmartFormGroup, string[]>();

/**
 * The place of `key` among the model's fields; a `<key>Confirm` control
 * follows its field, as the form factory adds it. `undefined` for a key the
 * model does not declare.
 */
function getRank(modelKeys: string[], key: string): number | undefined {
  const index = modelKeys.indexOf(key);

  if (index !== -1) return index;

  if (key.endsWith('Confirm')) {
    const original = modelKeys.indexOf(key.slice(0, -'Confirm'.length));

    if (original !== -1) return original + 0.5;
  }

  return undefined;
}

/**
 * The keys of the form's controls, in the order they were first seen. A control
 * removed and added again (an `enabled` specification) keeps its place.
 *
 * The form factory leaves a field that starts disabled out from the start, so a
 * key seen for the first time later is placed where the model declares it.
 */
function getFields(form: SmartFormGroup, model: unknown): string[] {
  const keys = Object.keys(form.controls);
  const known = fieldOrders.get(form);

  if (!known) {
    fieldOrders.set(form, keys);
    return keys;
  }

  const added = keys.filter((key) => !known.includes(key));

  if (!added.length) return known;

  const modelKeys = model
    ? getModelFieldKeys((model as object).constructor)
    : [];
  const result = [...known];

  for (const key of added) {
    const rank = getRank(modelKeys, key);
    const before =
      rank === undefined
        ? -1
        : result.findIndex((other) => {
            const otherRank = getRank(modelKeys, other);

            return otherRank !== undefined && otherRank > rank;
          });

    if (before === -1) result.push(key);
    else result.splice(before, 0, key);
  }

  fieldOrders.set(form, result);

  return result;
}

/**
 * What every form body shares: the fields to render, the options every input
 * gets and `submit()`. The body re-renders on every change of the form, so a
 * field added or removed by an `enabled` specification shows up at once.
 *
 * Bodies render a field when `form.controls[field]` exists and is not
 * `smartDisabled`.
 */
export function useFormBase<T>({
  form,
  options,
  onInvokeSubmit,
}: SmartFormBaseProps<T>) {
  useControlVersion(form);

  const submit = useCallback(
    () => onInvokeSubmit?.(form.value),
    [form, onInvokeSubmit],
  );

  const getControl = useCallback(
    (field: string): SmartAbstractControl | undefined => form.controls[field],
    [form],
  );

  return {
    fields: getFields(form, options.model),
    model: options.model,
    mode: options?.mode ?? '',
    possibilities: options.possibilities ?? {},
    inputComponents: options.inputComponents ?? {},
    treeLevel: options.treeLevel,
    /** Emits `onInvokeSubmit` with the form value. */
    submit,
    /** The control of `field`. */
    getControl,
  };
}
