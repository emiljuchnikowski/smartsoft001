import { inject } from '@angular/core';
import { patchState } from '@ngrx/signals';

import { PaginationMode } from '@smartsoft001/angular';
import { IEntity } from '@smartsoft001/domain-core';

import { ICrudCreateManyOptions, ICrudFilter } from '../models';
import { initialState } from './crud.store';
import { CrudService } from '../services/crud/crud.service';

// "Actions, Reducers, Effects" in a normal store
export function CrudMethodsFactory<T extends IEntity<string>>() {
  return (store: any, crudService = inject(CrudService<T>)) => {
    const methods = {
      async create(item: T) {
        patchState(store, {
          loaded: false,
          error: null,
        });

        try {
          await crudService.create(item);
          await this.createSuccess();
        } catch (error) {
          methods.defaultFailure(error);
        }
      },

      async createSuccess() {
        patchState(store, {
          loaded: true,
          error: null,
        });

        await methods.read(
          store.filter ? { ...store.filter, offset: 0 } : null,
        );
      },

      async createMany(data: { items: T[]; options: ICrudCreateManyOptions }) {
        patchState(store, {
          loaded: false,
          error: null,
        });

        try {
          await crudService.createMany(data.items, data.options);
          await methods.createManySuccess();
        } catch (e) {
          methods.defaultFailure(e);
        }
      },

      async createManySuccess() {
        patchState(store, {
          loaded: true,
          error: null,
        });

        await methods.read(
          store.filter ? { ...store.filter, offset: 0 } : null,
        );
      },

      async export(filter: ICrudFilter, format: any) {
        patchState(store, {
          loaded: false,
        });

        try {
          await crudService.exportList(filter, format);
          methods.exportSuccess();
        } catch (e) {
          methods.defaultFailure(e);
        }
      },

      exportSuccess() {
        patchState(store, {
          loaded: true,
        });
      },

      async read(filter: ICrudFilter) {
        patchState(store, {
          loaded: false,
          filter,
          error: null,
          totalCount: null,
          links: null,
        });

        try {
          const result = await crudService.getList<T>(filter);
          methods.readSuccess<T>({
            list: result.data,
            filter,
            totalCount: result.totalCount,
            links: result.links,
          });
        } catch (error) {
          methods.defaultFailure(error);
        }
      },

      readSuccess<T>(data: {
        list: T[];
        filter?: ICrudFilter;
        totalCount?: number;
        links?: any;
      }) {
        let list = [];

        if (
          data.filter?.offset &&
          store.list() &&
          data.filter.paginationMode !== PaginationMode.singlePage
        ) {
          list = [...store.list(), ...data.list];
        } else {
          list = data.list;
        }

        patchState(store, {
          loaded: true,
          list,
          totalCount: data.totalCount,
          links: data.links,
          error: null,
        });
      },

      clear() {
        store.set(() => ({ ...initialState }));
      },

      async select(id: string) {
        patchState(store, {
          loaded: false,
          selected: null,
          error: null,
        });

        try {
          const result = await crudService.getById(id);
          methods.selectSuccess(result);
        } catch (e) {
          methods.defaultFailure(e);
        }
      },

      selectSuccess(selected: T) {
        patchState(store, {
          loaded: true,
          selected,
          error: null,
        });
      },

      unselect() {
        patchState(store, {
          loaded: true,
          selected: null,
          error: null,
        });
      },

      multiSelect(items: Array<T>) {
        patchState(store, {
          multiSelected: [...items],
        });
      },

      async update(item: Partial<T> & { id: string }) {
        patchState(store, {
          loaded: false,
          error: null,
        });

        try {
          await crudService.updatePartial(item);
          await methods.updateSuccess(item.id);
        } catch (e) {
          methods.defaultFailure(e);
        }
      },

      async updateSuccess(id: string) {
        await methods.read({ ...store.filter, offset: 0 });
        await methods.select(id);
      },

      async updatePartial(item: Partial<T> & { id: string }) {
        patchState(store, {
          loaded: false,
          error: null,
        });

        try {
          await crudService.updatePartial(item);
          await methods.updatePartialSuccess(item.id);
        } catch (e) {
          methods.defaultFailure(e);
        }
      },

      async updatePartialSuccess(id: string) {
        await methods.read({ ...store.filter, offset: 0 });
        await methods.select(id);
      },

      async updatePartialMany(items: Array<Partial<T> & { id: string }>) {
        patchState(store, {
          loaded: false,
          error: null,
        });

        try {
          await crudService.updatePartialMany(items);
          await methods.updatePartialManySuccess();
        } catch (e) {
          methods.defaultFailure(e);
        }
      },

      async updatePartialManySuccess() {
        await methods.read({ ...store.filter, offset: 0 });
      },

      async delete(id: string) {
        patchState(store, {
          loaded: false,
          error: null,
        });

        try {
          await crudService.delete(id);
          await methods.deleteSuccess();
        } catch (e) {
          methods.defaultFailure(e);
        }
      },

      async deleteSuccess() {
        await methods.read({ ...store.filter, offset: 0 });
      },

      defaultFailure(error: string) {
        patchState(store, {
          loaded: true,
          error,
        });
      },
    };

    return methods;
  };
}
