import { inject, Injectable, InjectionToken } from '@angular/core';

import { IEntity } from '@smartsoft001/domain-core';

import { CrudConfig } from '../crud.config';
import { createCrudFeatureStore, CrudFeatureStore } from './crud.store';

export const CRUD_STORE_TOKEN = new InjectionToken<CrudFeatureStore<any>>(
  'CRUD_STORE',
);

@Injectable()
export class CrudStoreProvider<T extends IEntity<string>> {
  private config = inject(CrudConfig<T>);
  private _store?: CrudFeatureStore<T>;

  get store(): CrudFeatureStore<T> {
    if (!this._store) {
      this._store = this.createStore();
    }
    return this._store;
  }

  protected createStore(): CrudFeatureStore<T> {
    const defaultOptions = {
      storeName: this.config.entity || 'crud',
      providedIn: undefined, // module-scoped instead of root
    };

    const storeOptions = {
      ...defaultOptions,
      ...this.config.storeOptions,
    };

    return createCrudFeatureStore<T>(storeOptions);
  }
}

export function provideCrudStore<T extends IEntity<string>>() {
  return {
    provide: CRUD_STORE_TOKEN,
    useFactory: (provider: CrudStoreProvider<T>) => provider.store,
    deps: [CrudStoreProvider],
  };
}
