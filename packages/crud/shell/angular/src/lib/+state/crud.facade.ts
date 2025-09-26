import { Injectable, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { select, Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

import { NgrxStoreService } from '@smartsoft001/angular';
import { IEntity } from '@smartsoft001/domain-core';

import { CrudConfig } from '../crud.config';
import * as CrudActions from './crud.actions';
import * as CrudSelectors from './crud.selectors';
import {
  ICrudCreateManyOptions,
  ICrudFilter,
  ICrudFilterQueryItem,
} from '../models';

@Injectable()
export class CrudFacade<T extends IEntity<string>> {
  constructor(
    private readonly store: Store<any>,
    private config: CrudConfig<T>,
  ) {
    if (NgrxStoreService.store) {
      this.store = NgrxStoreService.store;
    }
  }

  get loaded() {
    return toSignal<boolean>(
      this.store.pipe(select(CrudSelectors.getCrudLoaded(this.config.entity))),
    );
  }

  get loading(): Signal<boolean> {
    return toSignal<boolean>(
      this.store.pipe(
        select(CrudSelectors.getCrudLoaded(this.config.entity)),
        map((l) => !l),
      ),
    ) as Signal<boolean>;
  }

  get selected() {
    return toSignal<T>(
      this.store.pipe(
        select(CrudSelectors.getCrudSelected(this.config.entity)),
      ),
    );
  }

  get multiSelected() {
    return toSignal<T[]>(
      this.store.pipe(
        select(CrudSelectors.getCrudMultiSelected(this.config.entity)),
      ),
    );
  }

  get list() {
    return toSignal<T[]>(
      this.store.pipe(select(CrudSelectors.getCrudList(this.config.entity))),
    );
  }

  get filter() {
    return toSignal<ICrudFilter>(
      this.store.pipe(select(CrudSelectors.getCrudFilter(this.config.entity))),
    );
  }

  get totalCount() {
    return toSignal<number>(
      this.store.pipe(
        select(CrudSelectors.getCrudTotalCount(this.config.entity)),
      ),
    );
  }

  get links() {
    return toSignal<any>(
      this.store.pipe(select(CrudSelectors.getCrudLinks(this.config.entity))),
    );
  }

  get error() {
    return toSignal<any>(
      this.store.pipe(select(CrudSelectors.getCrudError(this.config.entity))),
    );
  }

  create(item: T): void {
    this.store.dispatch(CrudActions.create(this.config.entity, item));
  }

  createMany(items: Array<T>, options: ICrudCreateManyOptions): void {
    this.store.dispatch(
      CrudActions.createMany(this.config.entity, { items, options }),
    );
  }

  read(filter: ICrudFilter = {}): void {
    let baseQuery: ICrudFilterQueryItem[] = [];
    if (this.config.baseQuery) {
      baseQuery = this.config.baseQuery;
    }

    const fullFilter = {
      ...(filter ? filter : {}),
      query: filter && filter.query ? filter.query : baseQuery,
    };

    this.store.dispatch(CrudActions.read(this.config.entity, fullFilter));
  }

  clear(): void {
    this.store.dispatch(CrudActions.clear(this.config.entity));
  }

  select(id: string): void {
    this.store.dispatch(CrudActions.select(this.config.entity, id));
  }

  unselect(): void {
    this.store.dispatch(CrudActions.unselect(this.config.entity));
  }

  multiSelect(items: Array<T>): void {
    this.store.dispatch(CrudActions.multiSelect(this.config.entity, items));
  }

  update(item: T): void {
    this.getStore().dispatch(CrudActions.update(this.config.entity, item));
  }

  export(filter: ICrudFilter = {}, format?: string): void {
    this.getStore().dispatch(
      CrudActions.exportList(this.config.entity, filter, format),
    );
  }

  updatePartial(item: Partial<T> & { id: string }): void {
    this.getStore().dispatch(
      CrudActions.updatePartial(this.config.entity, item),
    );
  }

  updatePartialMany(items: (Partial<T> & { id: string })[]) {
    this.getStore().dispatch(
      CrudActions.updatePartialMany(this.config.entity, items),
    );
  }

  delete(id: string): void {
    this.getStore().dispatch(CrudActions.deleteItem(this.config.entity, id));
  }

  private getStore(): Store {
    if (NgrxStoreService.store) return NgrxStoreService.store;

    return this.store;
  }
}
