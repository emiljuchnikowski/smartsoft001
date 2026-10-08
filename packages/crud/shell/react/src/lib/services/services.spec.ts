import { Model } from '@smartsoft001/models';

import { CrudFacade } from '../state/crud.facade';
import { getReducer } from '../state/crud.reducer';
import { CrudStore } from '../state/crud.store';
import { CrudListGroupService } from './list-group/list-group.service';
import { applyPagePermissions } from './page/page.service';
import { CrudSearchService } from './search/search.service';

@Model({
  create: { permissions: ['create'] },
  update: { permissions: ['update'] },
  remove: { permissions: ['remove'] },
})
class Secured {}

describe('@smartsoft001/crud-shell-react: applyPagePermissions', () => {
  const config = {
    apiUrl: '/api',
    entity: 'secured',
    title: 'Secured',
    type: Secured,
    add: true,
    edit: true,
    remove: true,
  };

  it('should turn off what the user may not do', () => {
    const result = applyPagePermissions(config, {
      expectPermissions: (p) => !!p?.includes('update'),
    });

    expect([result.add, result.edit, result.remove]).toEqual([
      false,
      true,
      false,
    ]);
  });

  it('should leave the given config untouched', () => {
    applyPagePermissions(config, { expectPermissions: () => false });

    expect(config.add).toBe(true);
  });
});

describe('@smartsoft001/crud-shell-react: CrudSearchService', () => {
  it('should ignore the filter while disabled', () => {
    const service = new CrudSearchService();

    service.setFilter({ searchText: 'abc' });

    expect(service.filter).toEqual({});
  });

  it('should return the filter once enabled', () => {
    const service = new CrudSearchService();

    service.setFilter({ searchText: 'abc' });
    service.setEnabled(true);

    expect(service.filter).toEqual({ searchText: 'abc' });
  });
});

describe('@smartsoft001/crud-shell-react: CrudListGroupService', () => {
  function setup() {
    const store = new CrudStore('groups', getReducer('groups'));
    store.set({ loaded: true, filter: { limit: 5, query: [] } });
    const facade = new CrudFacade(store, { apiUrl: '/api', entity: 'groups' });
    const read = jest.spyOn(facade, 'read').mockImplementation(() => undefined);

    return { facade, read, service: new CrudListGroupService(facade) };
  }

  it('should filter the list by the group as a hidden query item', () => {
    const { read, service } = setup();

    service.change(true, { key: 'status', value: 'open', text: 'Open' });

    expect(read).toHaveBeenCalledWith({
      limit: 5,
      offset: 0,
      query: [{ key: 'status', type: '=', value: 'open', hidden: true }],
    });
  });

  it('should drop the query items of destroyed groups after a pause', () => {
    jest.useFakeTimers();
    const { read, service } = setup();
    const group = { key: 'status', value: 'open', text: 'Open' };
    service.change(true, group);
    read.mockClear();

    service.destroy([group]);
    jest.advanceTimersByTime(250);

    expect(read).toHaveBeenCalledWith({ limit: 5, query: [] });
    jest.useRealTimers();
  });
});
