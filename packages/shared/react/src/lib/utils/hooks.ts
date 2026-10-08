import { useCallback } from 'react';

import { getListHeader, getModelLabel } from './model';
import { useSmart } from '../providers/smart-context';

/** The label of a model field, translated. */
export function useModelLabel(
  instance: unknown,
  key: string,
  type?: unknown,
): string {
  const { translate, modelLabelProvider } = useSmart();

  return getModelLabel(instance, key, type, {
    translate,
    labelProvider: modelLabelProvider,
  });
}

/** A label function bound to the provider, for lists of fields. */
export function useModelLabelFn(): (
  instance: unknown,
  key: string,
  type?: unknown,
) => string {
  const { translate, modelLabelProvider } = useSmart();

  return useCallback(
    (instance, key, type) =>
      getModelLabel(instance, key, type, {
        translate,
        labelProvider: modelLabelProvider,
      }),
    [translate, modelLabelProvider],
  );
}

/** A list column header function bound to the provider. */
export function useListHeaderFn(): (
  data: unknown,
  key: string,
  type?: unknown,
) => string {
  const { translate, modelLabelProvider } = useSmart();

  return useCallback(
    (data, key, type) =>
      getListHeader(data, key, type, {
        translate,
        labelProvider: modelLabelProvider,
      }),
    [translate, modelLabelProvider],
  );
}

/** The download URL of an attachment, `''` without a file service. */
export function useFileUrl(file: { id: any } | null | undefined): string {
  const { fileService } = useSmart();

  if (!file || !fileService) return '';

  return fileService.getUrl(file.id);
}
