import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ComponentType } from 'react';

import { IEntity } from '@smartsoft001/domain-core';
import {
  getModelFieldsWithOptions,
  getModelOptions,
  IFieldEditMetadata,
  IFieldListMetadata,
} from '@smartsoft001/models';
import {
  IIconButtonOptions,
  IListOptions,
  IPageOptions,
  ListMode,
  SmartEmitter,
  useMenuService,
  useModalService,
  useNavigation,
} from '@smartsoft001/react';
import { SpecificationService } from '@smartsoft001/utils';

import { SmartCrudListPageProps } from './list-page.types';
import { SmartCrudExport } from '../../components/export/export';
import { SmartCrudFilters } from '../../components/filters/filters';
import { SmartCrudMultiselect } from '../../components/multiselect/multiselect';
import { CrudFullConfig } from '../../crud.config';
import { useCrudFacade, useCrudSearchService } from '../../crud.context';
import { useCrudListPagination, useCrudState } from '../../hooks';
import { ICrudFilter } from '../../models';
import { useCrudBoundComponent } from '../use-crud-bound-component';
import { useCrudPageConfig } from '../use-crud-page-config';

const NO_ITEMS: never[] = [];

/** `path` + `/` + `segment`, without doubling the slash. */
function joinPath(path: string, segment: string): string {
  return path.replace(/\/+$/, '') + '/' + segment;
}

/** The `default` / `defaultDesc` of an object `config.sort`. */
function sortDefaults(config: CrudFullConfig<any>) {
  const sort = config.sort as { default?: string; defaultDesc?: boolean };

  return {
    sortBy: config.sort ? sort['default'] : undefined,
    sortDesc: config.sort ? sort['defaultDesc'] : undefined,
  };
}

/**
 * The filter of the first read: with `list.resetQuery: 'beforeInit'` the
 * configured defaults, else the filter the feature already has, else the
 * defaults, the enabled search filter on top.
 */
function getInitialFilter(
  config: CrudFullConfig<any>,
  current: ICrudFilter | undefined,
  search: Partial<ICrudFilter>,
): ICrudFilter {
  if (config.list?.resetQuery === 'beforeInit') {
    return {
      query: config.baseQuery ? [...config.baseQuery] : [],
      paginationMode: config.list?.paginationMode,
      limit: config.pagination ? config.pagination.limit : undefined,
      offset: config.pagination ? 0 : undefined,
      ...sortDefaults(config),
      ...search,
    };
  }

  if (current) return current;

  const defaults = sortDefaults(config);

  return {
    paginationMode: config.list?.paginationMode,
    limit: search?.limit
      ? search.limit
      : config.pagination
        ? config.pagination.limit
        : undefined,
    offset:
      search?.offset || search?.offset === 0
        ? search.offset
        : config.pagination
          ? 0
          : undefined,
    sortBy: search?.sortBy ? search.sortBy : defaults.sortBy,
    sortDesc: search?.sortDesc ? search.sortDesc : defaults.sortDesc,
    query: config.baseQuery ? [...config.baseQuery] : [],
    ...search,
  };
}

/** The `top` / `bottom` components of an object `config.details`. */
function getDetailsComponents(config: CrudFullConfig<any>) {
  return config.details && typeof config.details === 'object'
    ? config.details.components
    : undefined;
}

/**
 * The logic of the list page, for `SmartCrudListPage` or a page of your own
 * around the same feature:
 *
 * - `config`: the `CrudFullConfig` after the model's permissions;
 * - the first read on mount (pagination, default sort, base query and the
 *   enabled `CrudSearchService` filter; `list.resetQuery: 'beforeInit'`
 *   starts from the defaults instead of the feature's filter);
 * - `pageOptions`: the title, `variant`, the search (`config.search`) and the
 *   end buttons: multi edit, filters (`SmartCrudFilters` in the end menu),
 *   add (navigates to `<basePath>/add`), export (`SmartCrudExport` in a
 *   modal) and `config.buttons`;
 * - `listOptions` for `SmartList`: the feature's items and loading, details
 *   through the facade, item links to `<basePath>/<id>`, remove through the
 *   facade (the list confirms it), the pagination of
 *   `useCrudListPagination`, sort and the multi selection (it opens
 *   `SmartCrudMultiselect` in the end menu);
 * - `filter`: the feature's filter (the page renders once it is set);
 * - `TopComponent`: `config.list.components.top`.
 *
 * A navigation closes the end menu and ends the multi selection.
 */
export function useCrudListPage<T extends IEntity<string>>({
  basePath,
}: SmartCrudListPageProps = {}) {
  const config = useCrudPageConfig<T>();
  const facade = useCrudFacade<T>();
  const searchService = useCrudSearchService();
  const navigation = useNavigation();
  const menuService = useMenuService();
  const modalService = useModalService();

  const filter = useCrudState<T, ICrudFilter | null | undefined>(
    (state) => state.filter,
  );
  const list = useCrudState<T, T[] | undefined>((state) => state.list);
  const loading = useCrudState<T, boolean>((state) => !state.loaded);
  const selected = useCrudState<T, T | null | undefined>(
    (state) => state.selected,
  );

  const [select, setSelect] = useState<'multi' | undefined>(undefined);
  const [cleanMultiSelected] = useState(() => new SmartEmitter<void>());

  const Filters = useCrudBoundComponent(SmartCrudFilters);
  const Multiselect = useCrudBoundComponent(SmartCrudMultiselect);
  const Export = useCrudBoundComponent(SmartCrudExport);

  // Without `basePath`, the path of the current URL.
  const path = useMemo(
    () => basePath ?? navigation.getCurrentUrl().split(/[?#]/)[0],
    [basePath, navigation],
  );

  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;

    initialized.current = true;
    facade.read(getInitialFilter(config, facade.filter, searchService.filter));
  }, [config, facade, searchService]);

  // Closes the end menu and ends the multi selection.
  const clear = useCallback(async () => {
    await menuService.closeEnd();
    setSelect(undefined);
    facade.multiSelect([]);
  }, [menuService, facade]);

  useEffect(
    () =>
      navigation.subscribe(() => {
        void clear();
      }),
    [navigation, clear],
  );

  const type = config.type;
  const modelOptions = useMemo(() => getModelOptions(type), [type]);
  const fieldsWithOptions = useMemo(
    () => (type ? getModelFieldsWithOptions(new type()) : []),
    [type],
  );

  const endButtons = useMemo<Array<IIconButtonOptions>>(() => {
    const showFilters =
      fieldsWithOptions.some(
        (x) => (x.options?.list as IFieldListMetadata)?.filter,
      ) || modelOptions?.filters?.length;

    // Mobile devices are not detected; only the list mode decides.
    const showMultiEdit =
      config.list?.components?.multi ||
      (config.edit &&
        fieldsWithOptions.some(
          (x) => (x.options?.update as IFieldEditMetadata)?.multi,
        ) &&
        (!config.list?.mode || config.list.mode === ListMode.desktop));

    return [
      ...(showMultiEdit
        ? [
            {
              icon: 'checkbox-outline',
              text: 'multi',
              handler: () => {
                facade.multiSelect([]);
                cleanMultiSelected.emit();

                setTimeout(async () => {
                  setSelect((val) => (val === 'multi' ? undefined : 'multi'));

                  if (menuService.openedEnd) await menuService.closeEnd();
                });
              },
            },
          ]
        : []),
      ...(showFilters
        ? [
            {
              icon: 'filter-outline',
              text: 'filters',
              handler: async () => {
                await menuService.openEnd({ component: Filters });
              },
            },
          ]
        : []),
      ...(config.add
        ? [
            {
              icon: 'add',
              text: 'add',
              handler: () => {
                navigation.navigate(joinPath(path, 'add'));
              },
            },
          ]
        : []),
      ...(config.export
        ? [
            {
              text: 'export',
              icon: 'download-outline',
              type: 'popover' as const,
              component: Export,
              // The export buttons open in a modal.
              handler: () => {
                void modalService.show({ component: Export });
              },
            },
          ]
        : []),
      ...(config.buttons ? config.buttons : []),
    ];
  }, [
    config,
    facade,
    fieldsWithOptions,
    modelOptions,
    cleanMultiSelected,
    menuService,
    modalService,
    navigation,
    path,
    Filters,
    Export,
  ]);

  const getFilter = useCallback(() => facade.filter, [facade]);

  const pageOptions = useMemo<IPageOptions>(
    () => ({
      title: config.title || '',
      variant: config.variant,
      search: config.search
        ? {
            text: filter?.searchText ?? '',
            set: (txt: string) => {
              const current = getFilter();

              if (txt !== current?.searchText)
                facade.read({ ...current, searchText: txt, offset: 0 });
            },
          }
        : undefined,
      endButtons,
    }),
    [config, filter, facade, getFilter, endButtons],
  );

  const pagination = useCrudListPagination({
    mode: config.list?.paginationMode,
    limit: config.pagination?.limit ?? 0,
  });

  const listOptions = useMemo<IListOptions<T>>(() => {
    const detailsComponents = getDetailsComponents(config);

    return {
      provider: {
        getData: (next: ICrudFilter): void => {
          facade.read({ ...getFilter(), ...next });
        },
        onChangeMultiSelected: async (items: T[]) => {
          if (items.length && !menuService.openedEnd) {
            await menuService.openEnd({ component: Multiselect });
          } else if (!items.length && menuService.openedEnd) {
            await menuService.closeEnd();
          }

          facade.multiSelect(items);
        },
        list: list || NO_ITEMS,
        loading,
        onCleanMultiSelected$: cleanMultiSelected,
      },
      cellPipe: config.list ? config.list.cellPipe : undefined,
      mode: config.list?.mode,
      type: config.type,
      details: config.details
        ? {
            provider: {
              getData: (id: string) => {
                facade.select(id);
              },
              clearData: () => {
                facade.unselect();
              },
              item: selected,
              loading,
            },
            componentFactories: {
              top: detailsComponents?.top,
              bottom: detailsComponents?.bottom,
            },
          }
        : undefined,
      item:
        !!config.edit || config.details
          ? {
              options: {
                routingPrefix: joinPath(path, ''),
                edit: !!config.edit,
              },
            }
          : undefined,
      remove: config.remove
        ? {
            provider: {
              invoke: (id: string) => facade.delete(id),
              check: (item: T) =>
                modelOptions?.remove?.enabled
                  ? SpecificationService.valid(
                      item,
                      modelOptions.remove.enabled,
                    )
                  : true,
            },
          }
        : undefined,
      pagination,
      sort: config.sort,
      select,
    };
  }, [
    config,
    facade,
    getFilter,
    menuService,
    Multiselect,
    list,
    loading,
    cleanMultiSelected,
    selected,
    path,
    modelOptions,
    pagination,
    select,
  ]);

  const TopComponent: ComponentType | undefined = config.list?.components?.top;

  return { config, filter, pageOptions, listOptions, TopComponent };
}
