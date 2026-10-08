import { FieldTypeDef, getModelFieldOptions } from '@smartsoft001/models';
import { RemoveHtmlService, SlugService } from '@smartsoft001/utils';

import { SmartTranslateFn } from '../i18n/translate';
import { ICellPipe } from '../models/interfaces';
import { IModelLabelProvider } from '../providers/model-label.provider';

/*
 * The pipes of the Angular library as plain functions. The ones that need the
 * translations or the label provider take them as arguments; `hooks.ts`
 * binds them to the provider's context.
 */

/** `smartEnumToList`: the keys of an enum object. */
export function enumToList(value: any): Array<string> {
  if (!value) return value;

  return Object.keys(value);
}

/** `smartRemoveHtml` */
export function removeHtml(value: string | undefined | null): string {
  return RemoveHtmlService.create(value);
}

/** `smartSlug` */
export function slug(value: string | undefined | null): string {
  return SlugService.create(value);
}

/** `smartModelLabel`: the label of a field, from the provider or `MODEL.<key>`. */
export function getModelLabel(
  instance: unknown,
  key: string,
  type: unknown,
  deps: {
    translate: SmartTranslateFn;
    labelProvider?: IModelLabelProvider | null;
  },
): string {
  if (deps.labelProvider) {
    const result = deps.labelProvider.get({ instance, key, type });

    if (result) return result;
  }

  return deps.translate('MODEL.' + key);
}

/** `smartListHeader`: the header of a list column. */
export function getListHeader<T>(
  data: T,
  key: string,
  type: unknown,
  deps: {
    translate: SmartTranslateFn;
    labelProvider?: IModelLabelProvider | null;
  },
): string {
  if (key.indexOf('__array') === 0) {
    const info = key.split('.');
    const arrayKey = info[1];
    const index = Number(info[2]);
    const headerKey = info[3];

    return (data as any)?.[0]?.[arrayKey]?.[index]?.[headerKey];
  }

  if (deps.labelProvider) {
    const result = deps.labelProvider.get({ type, key });

    if (result) return result;
  }

  return deps.translate('MODEL.' + key);
}

const fieldTypeCache = new WeakMap<object, Map<string, FieldTypeDef | null>>();

function getFieldType(type: any, key: string): FieldTypeDef | null {
  if (!type) return null;

  let cache = fieldTypeCache.get(type);

  if (!cache) {
    cache = new Map();
    fieldTypeCache.set(type, cache);
  }

  if (!cache.has(key)) {
    const options = getModelFieldOptions(new type(), key);

    cache.set(key, options?.type ?? null);
  }

  return cache.get(key) ?? null;
}

function getCellValue(value: any, key: string): any {
  if (key.indexOf('__array') === 0) {
    const info = key.split('.');
    const arrayKey = info[1];
    const index = Number(info[2]);
    const rowKey = info[4];

    return value?.[arrayKey]?.[index]?.[rowKey];
  }

  return value[key];
}

/**
 * `smartListCell`: the value of a list cell, run through the cell pipe and
 * the translations, with the field type of the column.
 */
export function getListCell<T extends Record<string, any>>(
  obj: T,
  key: string,
  pipe: ICellPipe<T> | null | undefined,
  type: any,
  translate: SmartTranslateFn,
): { value?: any; type?: FieldTypeDef | null } {
  if (!obj) return {};

  const fieldType = getFieldType(type, key);
  let result = pipe
    ? pipe.transform(obj, key, (val) => translate(val))
    : getCellValue(obj, key);

  if (!result) return result;

  if (typeof result === 'string') {
    result = translate(result);
  }

  if (fieldType === 'enum' && Array.isArray(result)) {
    result = result.map((item: any) => translate(item));
  }

  return { value: result, type: fieldType };
}
