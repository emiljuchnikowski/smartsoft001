import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { IEntity } from '@smartsoft001/domain-core';
import { IFieldListMetadata, IFieldOptions } from '@smartsoft001/models';

import { SmartListModeProps } from './list.types';
import {
  IButtonOptions,
  IDetailsOptions,
  IItemOptionsForCustom,
  IItemOptionsForPage,
  IListOptions,
  PaginationMode,
} from '../../models';
import {
  useAlertService,
  useAuthService,
  useFileService,
  useNavigation,
  useTranslate,
} from '../../providers/hooks';

type ListField = { key: string; options: IFieldOptions };

/** The object form of the `details` / `item` / `remove` options. */
type ListObjectOption<K extends 'details' | 'item' | 'remove', T> = Exclude<
  IListOptions<T>[K],
  boolean | undefined
>;

const NO_FIELDS: ListField[] = [];

/**
 * The column keys of the list: the fields the user may see (list
 * `permissions`), with a `dynamic` field expanded into one
 * `__array.<key>.<index>.<headerKey>.<rowKey>` column per entry of the first
 * item.
 */
function getListKeys(
  fields: ListField[],
  data: unknown[] | null,
  expectPermissions: (permissions: Array<string> | null) => boolean,
): string[] {
  const result: string[] = [];

  fields
    .filter((field) => {
      const list = field.options.list as IFieldListMetadata | undefined;

      if (list && list.permissions) {
        return expectPermissions(list.permissions ?? null);
      }

      return true;
    })
    .forEach((field) => {
      const list = field.options.list as IFieldListMetadata | undefined;

      if (list?.dynamic) {
        if (!data?.length) return;

        ((data[0] as Record<string, unknown>)[field.key] as unknown[]).forEach(
          (_, index) =>
            result.push(
              `__array.${field.key}.${index}.${list.dynamic?.headerKey ?? ''}.${
                list.dynamic?.rowKey ?? ''
              }`,
            ),
        );

        return;
      }

      result.push(field.key);
    });

  return result;
}

/**
 * The URL of an image cell: the download URL of an attachment (`{ id }`), `''`
 * without a file service.
 */
export function useListFileUrl(): (
  file: { id: any } | null | undefined,
) => string {
  const fileService = useFileService();

  return useCallback(
    (file) => (file && fileService ? fileService.getUrl(file.id) : ''),
    [fileService],
  );
}

/** `routingPrefix` + `id` as one path, with a single `/` between them. */
function getItemUrl(routingPrefix: string, id: string): string {
  const prefix = routingPrefix.replace('//', '/');

  return (prefix.endsWith('/') ? prefix : prefix + '/') + id;
}

/**
 * The behaviour every list mode shares: the column `keys` (permissions via
 * `useAuthService()`, dynamic `__array` columns), the provider `list` and
 * `loading`, the `sort` options, the remove flow (a confirm alert, then
 * `remove.provider.invoke(id)`), item navigation
 * (`useNavigation().navigate(routingPrefix + id)` or `item.options.select`),
 * the details provider (`select` / `unselect`, `detailsComponent` and its
 * props) and the pagination (`loadNextPage` / `loadPrevPage`,
 * `handlePageChange`).
 *
 * With `pagination.mode === PaginationMode.infiniteScroll` and a next page,
 * `infiniteScroll` is `true`: render an element with `infiniteScrollRef`
 * after the items, and the next page loads when it scrolls into view.
 */
export function useList<T extends IEntity<string>>({
  options,
}: SmartListModeProps<T>) {
  const t = useTranslate();
  const authService = useAuthService();
  const alertService = useAlertService();
  const navigation = useNavigation();

  const fields = options.fields ?? NO_FIELDS;
  const provider = options.provider;
  const sort = options.sort ?? {};
  const cellPipe = options.cellPipe ?? null;
  const selectMode = options.select;
  const type = options.type;
  const providerList = provider?.list ?? null;
  const loading = provider?.loading;

  // Ids hidden from the list (the removed items).
  const [removed] = useState(() => new Set<string>());

  const keys = useMemo(
    () =>
      getListKeys(fields, providerList, (permissions) =>
        authService.expectPermissions(permissions),
      ),
    [fields, providerList, authService],
  );

  const list = useMemo(
    () =>
      providerList
        ? providerList.filter((item) => !removed.has(item.id))
        : null,
    [providerList, removed],
  );

  const remove = options.remove;
  const removeProvider = (remove as ListObjectOption<'remove', T> | undefined)
    ?.provider;

  const removeHandler = useMemo<((item: T) => void) | null>(() => {
    if (!remove) return null;

    return async (obj: T) => {
      await alertService.show({
        header: t('OBJECT.confirmDelete'),
        buttons: [
          { text: t('cancel'), role: 'cancel' },
          {
            text: t('confirm'),
            handler: () => {
              removeProvider?.invoke?.(obj.id);
            },
          },
        ],
        backdropDismiss: false,
      });
    };
  }, [remove, removeProvider, alertService, t]);

  const checkRemoveHandler: ((item: T) => boolean) | undefined = remove
    ? removeProvider?.check
    : undefined;

  const item = options.item;

  const itemHandler = useMemo<((id: string) => void) | null>(() => {
    if (!item) return null;

    const itemOptions = (item as ListObjectOption<'item', T>).options;

    if (!itemOptions) throw Error('Must set edit options');

    return (id: string) => {
      const routingPrefix = (itemOptions as IItemOptionsForPage).routingPrefix;
      const select = (itemOptions as IItemOptionsForCustom).select;

      if (routingPrefix) {
        navigation.navigate(getItemUrl(routingPrefix, id));
      } else if (select) select(id);
    };
  }, [item, navigation]);

  const details = options.details as ListObjectOption<'details', T> | undefined;

  if (options.details && !details?.provider) {
    throw Error('Must set details provider');
  }

  const detailsProvider = options.details ? details?.provider : undefined;
  const detailsComponent = (options.details && details?.component) || null;

  const detailsComponentProps = useMemo<IDetailsOptions<T> | null>(() => {
    if (!detailsComponent || !detailsProvider) return null;

    return {
      item: detailsProvider.item,
      type,
      loading: detailsProvider.loading,
      itemHandler: itemHandler ?? null,
      removeHandler,
      componentFactories: details?.componentFactories,
    };
  }, [
    detailsComponent,
    detailsProvider,
    type,
    itemHandler,
    removeHandler,
    details?.componentFactories,
  ]);

  const select = detailsProvider?.getData;
  const unselect = detailsProvider?.clearData;

  const detailsButtonOptions = useMemo<IButtonOptions>(
    () => ({
      loading,
      click: () => {
        unselect?.();
      },
    }),
    [loading, unselect],
  );

  const pagination = options.pagination;

  const loadNextPage = useMemo<(() => Promise<void>) | null>(() => {
    if (!pagination) return null;

    return async () => {
      await pagination.loadNextPage?.();

      setTimeout(() => {
        window.scrollTo(0, 0);
      });
    };
  }, [pagination]);

  const loadPrevPage = useMemo<(() => Promise<void>) | null>(() => {
    if (!pagination) return null;

    return async () => {
      await pagination.loadPrevPage?.();

      setTimeout(() => {
        window.scrollTo(0, 10000);
      });
    };
  }, [pagination]);

  const page = pagination ? pagination.page : null;
  const totalPages = pagination ? pagination.totalPages : null;

  const handlePageChange = useCallback(
    (nextPage: number) => {
      const current = page ?? 1;

      if (nextPage > current) {
        loadNextPage?.();
      } else if (nextPage < current) {
        loadPrevPage?.();
      }
    },
    [page, loadNextPage, loadPrevPage],
  );

  const infiniteScroll =
    pagination?.mode === PaginationMode.infiniteScroll &&
    (page ?? 1) < (totalPages ?? 0);
  const infiniteScrollRef = useRef<HTMLDivElement | null>(null);
  const loadMoreRef = useRef(pagination?.loadNextPage);
  const loadingMoreRef = useRef(false);

  useEffect(() => {
    loadMoreRef.current = pagination?.loadNextPage;
  });

  useEffect(() => {
    const target = infiniteScrollRef.current;

    if (
      !infiniteScroll ||
      !target ||
      typeof IntersectionObserver === 'undefined'
    ) {
      return undefined;
    }

    const observer = new IntersectionObserver((entries) => {
      if (
        loadingMoreRef.current ||
        !entries.some((entry) => entry.isIntersecting)
      ) {
        return;
      }

      loadingMoreRef.current = true;

      Promise.resolve(loadMoreRef.current?.()).finally(() => {
        loadingMoreRef.current = false;
      });
    });

    observer.observe(target);

    return () => observer.disconnect();
  }, [infiniteScroll, page]);

  return {
    fields,
    provider,
    sort,
    cellPipe,
    selectMode,
    type,
    keys,
    list,
    loading,
    removed,
    removeHandler,
    checkRemoveHandler,
    itemHandler,
    detailsComponent,
    detailsComponentProps,
    select,
    unselect,
    detailsButtonOptions,
    loadNextPage,
    loadPrevPage,
    page,
    totalPages,
    handlePageChange,
    infiniteScroll,
    infiniteScrollRef,
  };
}
