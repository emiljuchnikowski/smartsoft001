import { TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { firstValueFrom } from 'rxjs';

import { NgrxStoreService } from './ngrx-store.service';

interface AppState {
  feature?: { loaded: boolean };
}

const createStore = (): Store<AppState> => {
  TestBed.resetTestingModule();
  TestBed.configureTestingModule({ imports: [StoreModule.forRoot({})] });
  return TestBed.inject(Store);
};

const featureReducer = (state = { loaded: true }) => state;

describe('shared-angular: NgrxStoreService', () => {
  afterEach(() => {
    NgrxStoreService.store = undefined;
    TestBed.resetTestingModule();
  });

  describe('addReducer', () => {
    it('should register the same key in two independent stores', async () => {
      const firstStore = createStore();
      NgrxStoreService.addReducer('feature', featureReducer, firstStore);
      const firstState = await firstValueFrom(firstStore);
      const secondStore = createStore();

      NgrxStoreService.addReducer('feature', featureReducer, secondStore);

      expect(firstState.feature).toEqual({ loaded: true });
      expect((await firstValueFrom(secondStore)).feature).toEqual({
        loaded: true,
      });
    });

    it('should register the key only once for the same store', () => {
      const store = createStore();
      const addReducerSpy = jest.spyOn(store, 'addReducer');

      NgrxStoreService.addReducer('feature', featureReducer, store);
      NgrxStoreService.addReducer('feature', featureReducer, store);

      expect(addReducerSpy).toHaveBeenCalledTimes(1);
    });

    it('should not add the key when it already exists in the reducer manager', () => {
      const store = createStore();
      store.addReducer('feature', featureReducer);
      const derivedStore = store.select((state) => state) as Store<AppState>;
      const addReducerSpy = jest.spyOn(derivedStore, 'addReducer');

      NgrxStoreService.addReducer('feature', featureReducer, derivedStore);

      expect(addReducerSpy).not.toHaveBeenCalled();
    });

    it('should fall back to the connected store when no store is passed', async () => {
      const store = createStore();
      new NgrxStoreService().connect(store);

      NgrxStoreService.addReducer('feature', featureReducer);

      expect((await firstValueFrom(store)).feature).toEqual({ loaded: true });
    });

    it('should register the key again after connecting a new store', async () => {
      const service = new NgrxStoreService();
      service.connect(createStore());
      NgrxStoreService.addReducer('feature', featureReducer);
      const newStore = createStore();
      service.connect(newStore);

      NgrxStoreService.addReducer('feature', featureReducer);

      expect((await firstValueFrom(newStore)).feature).toEqual({
        loaded: true,
      });
    });

    it('should not throw when no store is available', () => {
      NgrxStoreService.store = undefined;

      const act = () => NgrxStoreService.addReducer('feature', featureReducer);

      expect(act).not.toThrow();
    });
  });
});
