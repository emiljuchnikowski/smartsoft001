import { Injectable } from "@angular/core";

import { map } from "rxjs/operators";
import { combineLatest } from "rxjs";

import { IEntity } from "@smartsoft001/domain-core";
import {IListPaginationOptions, PaginationMode} from "@smartsoft001/angular";

import {CrudFacade} from "../../+state/crud.facade";
import {ICrudFilter} from "../../models/interfaces";

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
          const sub = this.facade.loaded$.subscribe((l) => {
            if (l) {
              // if (sub && !sub.closed) sub.unsubscribe();
              setTimeout(() => {
                res(
                  options.provider.getLinks() &&
                    options.provider.getLinks().next
                );
              });
            }
          });

          this.facade.read({
            ...options.provider.getFilter(),
            offset:
              options.provider.getFilter().offset +
              options.provider.getFilter().limit,
          });
        });
      },
      loadPrevPage: () => {
        if (!options.provider.getLinks() || !options.provider.getLinks().prev)
          return Promise.resolve(false);

        return new Promise((res) => {
          const sub = this.facade.loaded$.subscribe((l) => {
            if (l) {
              // if (sub && !sub.closed) sub.unsubscribe();
              setTimeout(() => {
                res(
                  options.provider.getLinks() &&
                    options.provider.getLinks().prev
                );
              });
            }
          });

          this.facade.read({
            ...options.provider.getFilter(),
            offset:
              options.provider.getFilter().offset -
              options.provider.getFilter().limit,
          });
        });
      },
      page$: this.facade.filter$.pipe(
        map((f) => {
          return f?.limit ? f.offset / f.limit + 1 : 0;
        })
      ),
      totalPages$: combineLatest(
        this.facade.filter$,
        this.facade.totalCount$
      ).pipe(
        map(([filter, totalCount]) => {
          return filter?.limit ? Math.ceil(totalCount / filter.limit) : 0;
        })
      ),
    };
  }
}
