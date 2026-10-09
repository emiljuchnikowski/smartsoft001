import { SmartStore } from '@smartsoft001/react';

import { CrudAction } from './crud.actions';
import { CrudReducer, CrudState, initialState } from './crud.reducer';

export type CrudActionListener = (action: CrudAction, store: CrudStore) => void;

/**
 * The state of one CRUD feature: a reducer applied to dispatched actions,
 * with listeners (the effects) told about every action after the state
 * changed.
 */
export class CrudStore extends SmartStore<CrudState<any>> {
  private readonly actionListeners = new Set<CrudActionListener>();

  constructor(
    readonly entity: string,
    private readonly reducer: CrudReducer,
  ) {
    super({ ...initialState });
  }

  dispatch(action: CrudAction): void {
    this.set(this.reducer(this.get(), action));

    for (const listener of [...this.actionListeners]) listener(action, this);
  }

  onAction(listener: CrudActionListener): () => void {
    this.actionListeners.add(listener);

    return () => {
      this.actionListeners.delete(listener);
    };
  }
}
