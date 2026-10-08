import { useMemo } from 'react';

import { IEntity } from '@smartsoft001/domain-core';
import { FieldType, getModelFieldsWithOptions } from '@smartsoft001/models';

import { SmartListModeProps } from '../list.types';
import { useList } from '../use-list';

/**
 * The masonry-grid logic (the Angular `ListMasonryGridComponent` over
 * `ListBaseComponent`): `useList` plus `listWithImages`, every item paired
 * with the value of the model's first image field.
 */
export function useListMasonryGrid<T extends IEntity<string>>(
  props: SmartListModeProps<T>,
) {
  const base = useList(props);
  const { list, type } = base;

  const imageKey = useMemo(
    () =>
      getModelFieldsWithOptions(new type()).find(
        (item) => item.options?.type === FieldType.image,
      )?.key,
    [type],
  );

  const listWithImages = useMemo<Array<{ data: T; image: any }> | null>(
    () =>
      list
        ? list.map((item) => ({
            data: item,
            image: (item as Record<string, any>)[imageKey ?? ''],
          }))
        : null,
    [list, imageKey],
  );

  return { ...base, listWithImages };
}
