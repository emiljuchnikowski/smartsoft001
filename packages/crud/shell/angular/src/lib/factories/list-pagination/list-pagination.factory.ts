import { computed, inject, Injectable, Injector } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, take } from 'rxjs/operators';

import { IListPaginationOptions, PaginationMode } from '@smartsoft001/angular';
import { IEntity } from '@smartsoft001/domain-core';

import { CrudFacade } from '../../+state/crud.facade';
import { ICrudFilter } from '../../models';

@Injectable()
export class CrudListPaginationFactory<T extends IEntity<string>> {
  private readonly facade = inject(CrudFacade<T>);
  private readonly injector = inject(Injector);

  async create(options: {
    mode?: PaginationMode;
    limit: number;
    provider: {
      getLinks(): any;
      getFilter(): ICrudFilter;
    };
  }): Promise<IListPaginationOptions> {
    return {
      mode: options.mode,
      limit: options.limit,
      loadNextPage: () => {
        if (!options.provider.getLinks() || !options.provider.getLinks().next)
          return Promise.resolve(false);

        return new Promise((res) => {
          toObservable(this.facade.loaded, { injector: this.injector })
            .pipe(
              filter((l) => !!l),
              take(1),
            )
            .subscribe(() => {
              setTimeout(() => {
                res(
                  options.provider.getLinks() &&
                    options.provider.getLinks().next,
                );
              });
            });

          const currentFilter = options.provider.getFilter();
          this.facade.read({
            ...currentFilter,
            offset: (currentFilter.offset || 0) + (currentFilter.limit || 0),
          });
        });
      },
      loadPrevPage: () => {
        if (!options.provider.getLinks() || !options.provider.getLinks().prev)
          return Promise.resolve(false);

        return new Promise((res) => {
          toObservable(this.facade.loaded, { injector: this.injector })
            .pipe(
              filter((l) => !!l),
              take(1),
            )
            .subscribe(() => {
              setTimeout(() => {
                res(
                  options.provider.getLinks() &&
                    options.provider.getLinks().prev,
                );
              });
            });

          const currentFilter = options.provider.getFilter();
          this.facade.read({
            ...currentFilter,
            offset: (currentFilter.offset || 0) - (currentFilter.limit || 0),
          });
        });
      },
      page: computed(() => {
        const f = this.facade.filter();
        return f?.limit ? (f.offset || 0) / f.limit + 1 : 0;
      }),
      totalPages: computed(() => {
        const filter = this.facade.filter();
        const totalCount = this.facade.totalCount();
        return filter?.limit && totalCount
          ? Math.ceil(totalCount / filter.limit)
          : 0;
      }),
    };
  }
}
