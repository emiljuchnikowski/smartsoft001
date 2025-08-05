import { computed, Injectable } from '@angular/core';

import { IEntity } from "@smartsoft001/domain-core";
import {IListPaginationOptions, PaginationMode} from "@smartsoft001/angular";

import {CrudFacade} from "../../+state/crud.facade";
import {ICrudFilter} from '../../models';

@Injectable()
export class CrudListPaginationFactory<T extends IEntity<string>> {
  constructor(private readonly facade: CrudFacade<T>) {}

  async create(options: {
    mode?: PaginationMode,
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
          if (this.facade.loaded()) {
            setTimeout(() => {
              res(
                options.provider.getLinks() &&
                  options.provider.getLinks().next
              );
            });
          }

          const filter = options.provider.getFilter();
          this.facade.read({
            ...filter,
            offset: filter.offset + filter.limit,
          });
        });
      },
      loadPrevPage: () => {
        if (!options.provider.getLinks() || !options.provider.getLinks().prev)
          return Promise.resolve(false);

        return new Promise((res) => {
          const loaded = this.facade.loaded();
          if (loaded) {
            setTimeout(() => {
              res(
                options.provider.getLinks() &&
                  options.provider.getLinks().prev
              );
            });
          }

          this.facade.read({
            ...options.provider.getFilter(),
            offset:
              options.provider.getFilter().offset -
              options.provider.getFilter().limit,
          });
        });
      },
      page: computed(() => {
        const f = this.facade.filter();
        return f?.limit ? f.offset / f.limit + 1 : 0;
      }),
      totalPages: computed(() => {
        const filter = this.facade.filter();
        const totalCount = this.facade.totalCount();
        return filter?.limit ? Math.ceil(totalCount / filter.limit) : 0;
      }),
    };
  }
}
