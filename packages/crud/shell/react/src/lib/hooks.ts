import { useMemo } from 'react';

import { IEntity } from '@smartsoft001/domain-core';
import {
  IListPaginationOptions,
  PaginationMode,
  useStore,
} from '@smartsoft001/react';


import { useCrud } from './crud.context';
import { ICrudFilter } from './models';
import { CrudState } from './state/crud.reducer';
import { CrudStore } from './state/crud.store';

/** The feature's state (or a slice of it), re-rendering when it changes. */
export function useCrudState<T extends IEntity<string>>(): CrudState<T>;
export function useCrudState<T extends IEntity<string>, S>(
  selector: (state: CrudState<T>) => S,
): S;
export function useCrudState<T extends IEntity<string>, S>(
  selector?: (state: CrudState<T>) => S,
): CrudState<T> | S {
  const { store } = useCrud<T>();

  return useStore(
    store,
    (selector ?? ((state: CrudState<any>) => state)) as (
      state: CrudState<any>,
    ) => S,
  );
}

function whenLoaded(store: CrudStore): Promise<void> {
  return new Promise((resolve) => {
    if (store.get().loaded) {
      resolve();
      return;
    }

    const unsubscribe = store.subscribe(() => {
      if (!store.get().loaded) return;

      unsubscribe();
      resolve();
    });
  });
}

/**
 * The pagination options of the list, driven by the feature's filter and
 * links (the Angular `CrudListPaginationFactory`): the next / previous page
 * loaders resolve once the read settled, with whether there is a further page.
 */
export function useCrudListPagination(options: {
  mode?: PaginationMode;
  limit: number;
}): IListPaginationOptions {
  const { store, facade } = useCrud();
  const filter = useCrudState((state) => state.filter);
  const totalCount = useCrudState((state) => state.totalCount);
  const { mode, limit } = options;

  return useMemo<IListPaginationOptions>(() => {
    const load = (direction: 'next' | 'prev') => {
      const links = store.get().links;

      if (!links || !links[direction]) return Promise.resolve(false);

      const current: ICrudFilter = store.get().filter ?? {};
      const step = current.limit || 0;
      const settled = new Promise<boolean>((resolve) => {
        // Reading flips `loaded` to false first; wait for it to come back.
        queueMicrotask(() =>
          whenLoaded(store).then(() =>
            setTimeout(() => {
              const next = store.get().links;
              resolve(!!(next && next[direction]));
            }),
          ),
        );
      });

      facade.read({
        ...current,
        offset: (current.offset || 0) + (direction === 'next' ? step : -step),
      });

      return settled;
    };

    return {
      mode,
      limit,
      loadNextPage: () => load('next'),
      loadPrevPage: () => load('prev'),
      page: filter?.limit ? (filter.offset || 0) / filter.limit + 1 : 0,
      totalPages:
        filter?.limit && totalCount ? Math.ceil(totalCount / filter.limit) : 0,
    };
  }, [store, facade, mode, limit, filter, totalCount]);
}
