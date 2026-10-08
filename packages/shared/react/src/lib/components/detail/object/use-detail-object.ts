import { useMemo } from 'react';

import { IEntity } from '@smartsoft001/domain-core';

import { IDetailsOptions } from '../../../models';
import { SmartDetailFieldProps } from '../detail.types';
import { useDetail } from '../use-detail';

/**
 * The object detail's logic (the Angular `DetailObjectComponent.childOptions`):
 * the options of the nested `<SmartDetails>`, the nested object typed by its
 * own class, `null` without an item or a nested object.
 */
export function useDetailObject<T, TChild extends IEntity<string>>(
  props: SmartDetailFieldProps<T>,
) {
  const { item, key, value } = useDetail(props);

  const childOptions = useMemo<IDetailsOptions<TChild> | null>(() => {
    if (!item || !key || value === null || value === undefined) return null;

    return { type: value.constructor, item: value as TChild };
  }, [item, key, value]);

  return { childOptions };
}
