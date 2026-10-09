import { useCallback, useEffect, useMemo, useRef } from 'react';
import type { CSSProperties } from 'react';

import { IEntity } from '@smartsoft001/domain-core';

import { SmartListModeProps } from '../list.types';
import { useList } from '../use-list';

/** The inline style of the cells of the sticky header row. */
export const LIST_DESKTOP_STICKY_HEADER_STYLE: CSSProperties = {
  position: 'sticky',
  top: 0,
  zIndex: 100,
};

/**
 * The desktop table logic: `useList` plus the table columns (`desktopKeys`:
 * `selectMulti`, the keys, `removeAction`, `itemAction`), the multi selection
 * reported through `provider.onChangeMultiSelected` and cleared by
 * `provider.onCleanMultiSelected$`, and the `top` component factory.
 */
export function useListDesktop<T extends IEntity<string>>(
  props: SmartListModeProps<T>,
) {
  const base = useList(props);
  const { provider, selectMode, keys, removeHandler, itemHandler } = base;
  const componentFactories = props.options.componentFactories ?? null;
  const multiSelected = useRef<T[]>([]);
  const onCleanMultiSelected$ = provider?.onCleanMultiSelected$;

  useEffect(() => {
    if (!onCleanMultiSelected$) return undefined;

    const subscription = onCleanMultiSelected$.subscribe(() => {
      multiSelected.current = [];
    });

    return () => subscription.unsubscribe();
  }, [onCleanMultiSelected$]);

  const onChangeMultiselect = useCallback(
    (checked: boolean, element: T, list: T[]) => {
      const selected = multiSelected.current.filter((m) =>
        list.some((i) => i === m),
      );

      if (checked) {
        selected.push(element);
      } else {
        const index = selected.indexOf(element);

        if (index > -1) {
          selected.splice(index, 1);
        }
      }

      multiSelected.current = selected;

      provider?.onChangeMultiSelected?.(selected);
    },
    [provider],
  );

  const desktopKeys = useMemo(
    () => [
      ...(selectMode === 'multi' ? ['selectMulti'] : []),
      ...keys,
      ...(removeHandler ? ['removeAction'] : []),
      ...(itemHandler ? ['itemAction'] : []),
    ],
    [selectMode, keys, removeHandler, itemHandler],
  );

  return {
    ...base,
    desktopList: base.list,
    desktopKeys,
    componentFactories,
    onChangeMultiselect,
  };
}
