import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';

import { NgrxStoreService } from '@smartsoft001/angular';

import { CrudFacade } from './crud.facade';

function createStoreMock() {
  return { dispatch: jest.fn(), pipe: jest.fn(() => of(undefined)) };
}

function createFacade(store: unknown): CrudFacade<any> {
  return TestBed.runInInjectionContext(
    () => new CrudFacade<any>(store as Store<any>, { entity: 'X' } as any),
  );
}

describe('crud-shell-angular: CrudFacade', () => {
  afterEach(() => {
    NgrxStoreService.store = undefined;
  });

  it('should dispatch select to the injected store even when a static store is connected', () => {
    const injected = createStoreMock();
    const staticStore = createStoreMock();
    NgrxStoreService.store = staticStore as any;
    const facade = createFacade(injected);

    facade.select('1');

    expect(injected.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: '[X] Select', id: '1' }),
    );
    expect(staticStore.dispatch).not.toHaveBeenCalled();
  });

  it('should dispatch delete to the injected store even when a static store is connected', () => {
    const injected = createStoreMock();
    const staticStore = createStoreMock();
    NgrxStoreService.store = staticStore as any;
    const facade = createFacade(injected);

    facade.delete('1');

    expect(injected.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: '[X] Delete', id: '1' }),
    );
    expect(staticStore.dispatch).not.toHaveBeenCalled();
  });

  it('should fall back to the static store when no store is injected', () => {
    const staticStore = createStoreMock();
    NgrxStoreService.store = staticStore as any;
    const facade = createFacade(undefined);

    facade.select('1');
    facade.delete('2');

    expect(staticStore.dispatch).toHaveBeenCalledTimes(2);
  });
});
