import { PaginationMode } from '@smartsoft001/react';

import * as CrudActions from './crud.actions';
import { CrudEffects } from './crud.effects';
import { CrudFacade } from './crud.facade';
import { getReducer, initialState } from './crud.reducer';
import { CrudStore } from './crud.store';
import { CrudService } from '../services/crud/crud.service';

type Todo = { id: string; name?: string };

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

function setup(
  overrides: Partial<Record<keyof CrudService<Todo>, jest.Mock>> = {},
) {
  const service = {
    create: jest.fn(async () => '1'),
    createMany: jest.fn(async () => undefined),
    getList: jest.fn(async () => ({
      data: [{ id: '1' }],
      totalCount: 1,
      links: {},
    })),
    getById: jest.fn(async (id: string) => ({ id, name: 'Item' })),
    exportList: jest.fn(async () => undefined),
    update: jest.fn(async () => undefined),
    updatePartial: jest.fn(async () => undefined),
    updatePartialMany: jest.fn(async () => []),
    delete: jest.fn(async () => undefined),
    ...overrides,
  };
  const store = new CrudStore('todos', getReducer('todos'));
  new CrudEffects<Todo>(service as unknown as CrudService<Todo>).init(store);
  const facade = new CrudFacade<Todo>(store, {
    apiUrl: '/api',
    entity: 'todos',
    baseQuery: [{ key: 'archived', type: '=', value: false }],
  });

  return { service, store, facade };
}

describe('@smartsoft001/crud-shell-react: reducer', () => {
  const reducer = getReducer('todos');

  it('should start a read with the filter and no result', () => {
    const state = reducer(
      { ...initialState },
      CrudActions.read('todos', { limit: 5 }),
    );

    expect(state).toMatchObject({
      loaded: false,
      filter: { limit: 5 },
      totalCount: null,
    });
  });

  it('should append the next page in infinite scroll', () => {
    const state = reducer(
      { loaded: false, list: [{ id: '1' }] },
      CrudActions.readSuccess(
        'todos',
        { offset: 1 },
        { data: [{ id: '2' }], totalCount: 2, links: {} },
      ),
    );

    expect(state.list).toEqual([{ id: '1' }, { id: '2' }]);
  });

  it('should replace the page in single page mode', () => {
    const state = reducer(
      { loaded: false, list: [{ id: '1' }] },
      CrudActions.readSuccess(
        'todos',
        { offset: 1, paginationMode: PaginationMode.singlePage },
        { data: [{ id: '2' }], totalCount: 2, links: {} },
      ),
    );

    expect(state.list).toEqual([{ id: '2' }]);
  });

  it('should ignore the actions of another entity', () => {
    const state = { ...initialState };

    expect(reducer(state, CrudActions.read('other'))).toBe(state);
  });

  it('should go back to the initial state on clear', () => {
    expect(
      reducer(
        { loaded: true, list: [{ id: '1' }] },
        CrudActions.clear('todos'),
      ),
    ).toEqual(initialState);
  });
});

describe('@smartsoft001/crud-shell-react: CrudFacade with effects', () => {
  it('should load the list', async () => {
    const { facade } = setup();

    facade.read({ limit: 10 });
    await flush();

    expect([facade.list, facade.totalCount, facade.loaded]).toEqual([
      [{ id: '1' }],
      1,
      true,
    ]);
  });

  it('should send the base query when the filter has none', () => {
    const { facade, service } = setup();

    facade.read({ limit: 10 });

    expect(service.getList).toHaveBeenCalledWith({
      limit: 10,
      query: [{ key: 'archived', type: '=', value: false }],
    });
  });

  it('should be loading while the read is in flight', () => {
    const { facade } = setup();

    facade.read();

    expect(facade.loading).toBe(true);
  });

  it('should keep the error of a failed read', async () => {
    const error = new Error('down');
    const { facade } = setup({
      getList: jest.fn(async () => Promise.reject(error)),
    });

    facade.read();
    await flush();

    expect(facade.error).toBe(error);
  });

  it('should select an item', async () => {
    const { facade } = setup();

    facade.select('5');
    await flush();

    expect(facade.selected).toEqual({ id: '5', name: 'Item' });
  });

  it('should reload the list from the first page after a create', async () => {
    const { facade, service } = setup();
    facade.read({ limit: 10, offset: 20 });
    await flush();
    service.getList.mockClear();

    facade.create({ id: '' });
    await flush();

    expect(service.getList).toHaveBeenCalledWith(
      expect.objectContaining({ limit: 10, offset: 0 }),
    );
  });

  it('should reload and re-select after an update', async () => {
    const { facade, service } = setup();

    facade.update({ id: '3', name: 'New' });
    await flush();

    expect([
      service.updatePartial.mock.calls[0][0],
      service.getById.mock.calls[0][0],
    ]).toEqual([{ id: '3', name: 'New' }, '3']);
  });

  it('should delete the item', async () => {
    const { facade, service } = setup();

    facade.delete('3');
    await flush();

    expect(service.delete).toHaveBeenCalledWith('3');
  });

  it('should reload the list after a delete', async () => {
    const { facade, service } = setup();

    facade.delete('3');
    await flush();

    expect(service.getList).toHaveBeenCalledWith({ offset: 0 });
  });

  it('should clear the multi-selection after a partial update of many', async () => {
    const { facade } = setup();
    facade.multiSelect([{ id: '1' }, { id: '2' }]);

    facade.updatePartialMany([{ id: '1' }, { id: '2' }]);
    await flush();

    expect(facade.multiSelected).toEqual([]);
  });
});
