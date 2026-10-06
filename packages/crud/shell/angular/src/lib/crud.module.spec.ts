import { NgrxStoreService } from '@smartsoft001/angular';

import { CrudFullModule } from './crud-full.module';
import { CrudCoreModule, CrudModule } from './crud.module';

describe('crud-shell-angular: CRUD modules reducer registration', () => {
  let addReducerSpy: jest.SpyInstance;

  beforeEach(() => {
    addReducerSpy = jest
      .spyOn(NgrxStoreService, 'addReducer')
      .mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it.each([
    ['CrudCoreModule', CrudCoreModule],
    ['CrudModule', CrudModule],
    ['CrudFullModule', CrudFullModule],
  ])(
    '%s should register the entity reducer in the injected Store',
    (_name, ModuleType: any) => {
      const store = {} as any;
      const effects = { init: jest.fn() } as any;

      new ModuleType({ entity: 'X' }, effects, store);

      expect(addReducerSpy).toHaveBeenCalledWith(
        'X',
        expect.any(Function),
        store,
      );
      expect(effects.init).toHaveBeenCalled();
    },
  );
});
