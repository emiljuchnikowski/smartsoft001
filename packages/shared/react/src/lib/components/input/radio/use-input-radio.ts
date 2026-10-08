import { useMemo } from 'react';

import { getModelFieldOptions } from '@smartsoft001/models';

import { SmartPossibility } from '../../../models';
import { useInput } from '../base/use-input';
import { useInputPossibilities } from '../base/use-input-possibilities';
import { SmartInputFieldProps } from '../input.types';

/**
 * The `possibilities` of the model field as a list, when they are an object
 * map `{ text: id }` (e.g. an enum): what the Angular radio and enum preset
 * fields fell back to when neither the provider nor the input options had any.
 * The field options of an array model are read through its first item. An
 * array (or nothing) yields `null`, as in Angular.
 */
export function getModelFieldPossibilitiesList(
  model: unknown,
  fieldKey: string | undefined,
): SmartPossibility[] | null {
  if (!model || !fieldKey) return null;

  let fieldOptions = getModelFieldOptions(model, fieldKey);

  const first = (model as Record<number, unknown>)[0];
  if (!fieldOptions && first) {
    fieldOptions = getModelFieldOptions(first, fieldKey);
  }

  const possibilities = fieldOptions?.possibilities as
    Record<string, unknown> | unknown[] | undefined;

  if (!possibilities || Array.isArray(possibilities)) return null;

  return Object.keys(possibilities).map((key) => ({
    id: possibilities[key],
    text: key,
    checked: false,
  }));
}

/**
 * What both radio fields share (the Angular `InputRadioComponent` logic on
 * top of `InputPossibilitiesBaseComponent`): the input state, and the
 * possibilities of the provider or the input options, or else the object map
 * of the model field's `possibilities`.
 */
export function useInputRadio<T>(props: SmartInputFieldProps<T>) {
  const input = useInput(props);
  const fromInput = useInputPossibilities(props);
  const fromModel = useMemo(
    () => getModelFieldPossibilitiesList(input.model, input.fieldKey),
    [input.model, input.fieldKey],
  );

  return {
    ...input,
    possibilities: fromInput ?? fromModel,
  };
}
