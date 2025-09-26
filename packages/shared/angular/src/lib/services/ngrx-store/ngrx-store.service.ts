import { Injectable } from '@angular/core';
import { ActionReducer, Store } from '@ngrx/store';
import { Action } from '@ngrx/store/src/models';

@Injectable()
export class NgrxStoreService {
  private static _reducers = {};

  static store: Store<any> | undefined = undefined;

  static addReducer<State, Actions extends Action = Action>(
    key: string,
    reducer: ActionReducer<State, Actions>,
  ): void {
    if (!(NgrxStoreService as any)._reducers[key]) {
      (NgrxStoreService as any)._reducers[key] = reducer;
      (NgrxStoreService as any).store.addReducer(key, reducer);
      console.log(`${NgrxStoreService.name} register reducer ${key}`);
    }
  }

  connect(store: Store<any>) {
    NgrxStoreService.store = store;
  }
}
