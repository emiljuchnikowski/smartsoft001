import { IEntity } from '@smartsoft001/domain-core';

import { CrudConfig } from '../crud.config';
import {
  ICrudCreateManyOptions,
  ICrudFilter,
  ICrudFilterQueryItem,
} from '../models';
import * as CrudActions from './crud.actions';
import { CrudState } from './crud.reducer';
import { CrudStore } from './crud.store';

/**
 * The API the pages and components use to read and change a CRUD feature.
 * The state is read through getters (`facade.list`), and `useCrudState`
 * re-renders a component when it changes.
 */
export class CrudFacade<T extends IEntity<string>> {
  constructor(
    readonly store: CrudStore,
    private readonly config: CrudConfig<T>,
  ) {}

  get state(): CrudState<T> {
    return this.store.get() as CrudState<T>;
  }

  get loaded(): boolean | undefined {
    return this.state.loaded;
  }

  get loading(): boolean {
    return !this.state.loaded;
  }

  get selected(): T | undefined {
    return this.state.selected ?? undefined;
  }

  get multiSelected(): T[] | undefined {
    return this.state.multiSelected;
  }

  get list(): T[] | undefined {
    return this.state.list;
  }

  get filter(): ICrudFilter | undefined {
    return this.state.filter ?? undefined;
  }

  get totalCount(): number | undefined {
    return this.state.totalCount ?? undefined;
  }

  get links(): any {
    return this.state.links;
  }

  get error(): any {
    return this.state.error;
  }

  create(item: T): void {
    this.store.dispatch(CrudActions.create(this.config.entity, item));
  }

  createMany(items: Array<T>, options: ICrudCreateManyOptions): void {
    this.store.dispatch(
      CrudActions.createMany(this.config.entity, { items, options }),
    );
  }

  /** Reads the list; without a `query` of its own the filter gets `baseQuery`. */
  read(filter: ICrudFilter = {}): void {
    const baseQuery: ICrudFilterQueryItem[] = this.config.baseQuery ?? [];
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
    this.store.dispatch(CrudActions.update(this.config.entity, item));
  }

  export(filter: ICrudFilter = {}, format?: string): void {
    this.store.dispatch(
      CrudActions.exportList(this.config.entity, filter, format),
    );
  }

  updatePartial(item: Partial<T> & { id: string }): void {
    this.store.dispatch(CrudActions.updatePartial(this.config.entity, item));
  }

  updatePartialMany(items: (Partial<T> & { id: string })[]): void {
    this.store.dispatch(
      CrudActions.updatePartialMany(this.config.entity, items),
    );
  }

  delete(id: string): void {
    this.store.dispatch(CrudActions.deleteItem(this.config.entity, id));
  }
}
