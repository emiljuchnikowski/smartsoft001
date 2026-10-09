import { useCallback, useEffect, useMemo, useRef } from 'react';

import { IEntity } from '@smartsoft001/domain-core';
import {
  FieldType,
  getModelFieldsWithOptions,
  getModelOptions,
  IFieldListMetadata,
  IModelFilter,
} from '@smartsoft001/models';
import {
  StyleService,
  useMenuService,
  useStyleService,
} from '@smartsoft001/react';

import { SmartCrudFiltersProps } from './filters.types';
import { useCrudConfig } from '../../crud.context';
import { useCrudState } from '../../hooks';

/**
 * The filters of the model `type`: the model's `filters` (labelled
 * `MODEL.<key>` when they have no label — set on the model's filter itself),
 * then a filter for each field with `list.filter`: `~=` for text fields, `=`
 * for the others.
 */
function getFilters(type: new () => object): Array<IModelFilter> {
  const modelFilters = getModelOptions(type)?.filters;

  return [
    ...(modelFilters
      ? modelFilters.map((item) => {
          if (!item.label) {
            item.label = 'MODEL.' + item.key;
          }
          return item;
        })
      : []),
    ...getModelFieldsWithOptions(new type())
      .filter((item) => (item.options?.list as IFieldListMetadata)?.filter)
      .map((item) => ({
        key: item.key,
        type:
          item.options.type === FieldType.text ||
          item.options.type === FieldType.longText
            ? ('~=' as const)
            : ('=' as const),
        label: 'MODEL.' + item.key,
        fieldType: item.options.type,
      })),
  ];
}

/**
 * The behaviour of the filters panel: `list` holds the filters of
 * `config.type`, `filter` the current filter of the feature, and `onClose`
 * closes the end menu the panel is shown in. Attach `elementRef` to the root
 * element: it gets the application style.
 */
export function useCrudFilters<T extends IEntity<string>>({
  hideMenu = false,
}: SmartCrudFiltersProps = {}) {
  const config = useCrudConfig<T>();
  const menuService = useMenuService();
  const styleService = useStyleService();
  const elementRef = useRef<HTMLDivElement>(null);
  const filter = useCrudState((state) => state.filter);

  const list = useMemo(() => getFilters(config.type), [config.type]);

  // A local service writes the style, so the shared one is not redirected
  // to this element.
  useEffect(() => {
    new StyleService().init(elementRef.current, styleService.get());
  }, [styleService]);

  const onClose = useCallback(async (): Promise<void> => {
    await menuService.closeEnd();
  }, [menuService]);

  return { elementRef, hideMenu, list, filter, onClose };
}
