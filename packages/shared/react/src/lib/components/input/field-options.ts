import {
  getModelFieldOptions,
  getModelFieldsWithOptions,
  IFieldOptions,
} from '@smartsoft001/models';

import { InputOptions } from '../../models';

function isObject(value: unknown): value is object {
  return value !== null && typeof value === 'object';
}

/**
 * The options of the field an input renders, merged with the options of the
 * form's mode: a `<key>Confirm` control takes the options of `<key>`, and an
 * array model is read through its first item.
 */
export function resolveInputFieldOptions<T>(
  options: InputOptions<T> | undefined,
): IFieldOptions | undefined {
  let key = options?.fieldKey;

  if (!options || !key) return undefined;

  if (key.endsWith('Confirm')) key = key.replace('Confirm', '');

  const model = options.model as any;
  let fieldOptions: IFieldOptions | undefined = model
    ? getModelFieldOptions(model, key)
    : undefined;

  if (!fieldOptions && model?.[0]) {
    fieldOptions = getModelFieldOptions(model[0], key);
  }

  if (!fieldOptions && model) {
    fieldOptions = getModelFieldsWithOptions(model).find(
      (x) => x.key === key,
    )?.options;
  }

  if (!fieldOptions) return undefined;

  if (options.mode === 'create' && isObject(fieldOptions.create)) {
    return { ...fieldOptions, ...(fieldOptions.create as IFieldOptions) };
  }

  if (options.mode === 'update' && isObject(fieldOptions.update)) {
    return { ...fieldOptions, ...(fieldOptions.update as IFieldOptions) };
  }

  return fieldOptions;
}
