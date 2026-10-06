import { Injectable } from '@angular/core';
import { Action, ActionReducer, Store } from '@ngrx/store';

const registeredKeys = new WeakMap<Store<any>, Set<string>>();

@Injectable()
export class NgrxStoreService {
  static store: Store<any> | undefined = undefined;

  /**
   * Registers a feature reducer once per Store instance.
   *
   * @param store target Store; defaults to the connected `NgrxStoreService.store`.
   * Pass it explicitly under SSR, where one process renders many app instances,
   * each with its own Store.
   */
  static addReducer<State, Actions extends Action = Action>(
    key: string,
    reducer: ActionReducer<State, Actions>,
    store?: Store<any>,
  ): void {
    const target = store ?? NgrxStoreService.store;
    if (!target) return;

    const keys = registeredKeys.get(target) ?? new Set<string>();
    registeredKeys.set(target, keys);

    const alreadyInStore = !!(target as any).reducerManager?.currentReducers?.[
      key
    ];
    if (keys.has(key) || alreadyInStore) return;

    keys.add(key);
    target.addReducer(key, reducer);
  }

  connect(store: Store<any>) {
    NgrxStoreService.store = store;
  }
}
