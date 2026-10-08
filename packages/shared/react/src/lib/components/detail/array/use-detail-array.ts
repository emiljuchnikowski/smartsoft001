import { useMemo } from 'react';

import { IEntity } from '@smartsoft001/domain-core';

import { IDetailsOptions } from '../../../models';
import { SmartDetailFieldProps } from '../detail.types';
import { useDetail } from '../use-detail';

/**
 * The array detail's logic (the Angular `DetailArrayComponent.childOptions`):
 * the options of a `<SmartDetails>` per element, each typed by its own class;
 * empty without an item or elements.
 */
export function useDetailArray<T, TChild extends IEntity<string>>(
  props: SmartDetailFieldProps<T>,
) {
  const { item, key, value } = useDetail(props);

  const childOptions = useMemo<IDetailsOptions<TChild>[]>(() => {
    if (!item || !key || !value) return [];

    return (value as any[]).map((val) => ({
      type: val.constructor,
      item: val as TChild,
    }));
  }, [item, key, value]);

  return { childOptions };
}
