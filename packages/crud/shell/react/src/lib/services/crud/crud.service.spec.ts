/**
 * @jest-environment node
 */
import { SmartHttpClient } from '@smartsoft001/react';

import { CrudService } from './crud.service';

describe('@smartsoft001/crud-shell-react: CrudService', () => {
  function setup(response: () => Response = () => new Response('')) {
    const fetch = jest.fn(async (_url: string, _init?: RequestInit) =>
      response(),
    );
    const http = new SmartHttpClient({
      fetch: fetch as unknown as typeof globalThis.fetch,
    });
    const service = new CrudService<{ id: string }>(
      { apiUrl: 'http://api/todos', entity: 'todos' },
      http,
    );

    return { fetch, service };
  }

  it('should read the id of a created item from the Location header', async () => {
    const { service } = setup(
      () =>
        new Response('', {
          status: 201,
          headers: { Location: 'http://api/todos/42' },
        }),
    );

    expect(await service.create({ id: '' })).toBe('42');
  });

  it('should resolve null without a Location header', async () => {
    const { service } = setup();

    expect(await service.create({ id: '' })).toBeNull();
  });

  it('should build the list query string', async () => {
    const { fetch, service } = setup(
      () => new Response('{"data":[],"totalCount":0}'),
    );

    await service.getList({
      searchText: 'abc',
      limit: 10,
      offset: 20,
      sortBy: 'name',
      sortDesc: true,
      query: [
        { key: 'status', type: '=', value: 'open' },
        { key: 'number', type: '>=', value: '12' },
      ],
    });

    expect(fetch.mock.calls[0][0]).toBe(
      "http://api/todos?$search=abc&limit=10&offset=20&sort=-name&status=open&number>='12'",
    );
  });

  it('should call the list without a query string for no filter', async () => {
    const { fetch, service } = setup(() => new Response('{"data":[]}'));

    await service.getList();

    expect(fetch.mock.calls[0][0]).toBe('http://api/todos');
  });

  it('should send a partial update as PATCH to the item', async () => {
    const { fetch, service } = setup();

    await service.updatePartial({ id: '7' });

    expect([fetch.mock.calls[0][0], fetch.mock.calls[0][1]?.method]).toEqual([
      'http://api/todos/7',
      'PATCH',
    ]);
  });

  it('should send a bulk create with its mode', async () => {
    const { fetch, service } = setup();

    await service.createMany([{ id: '1' }], { mode: 'replace' });

    expect(fetch.mock.calls[0][0]).toBe('http://api/todos/bulk?mode=replace');
  });

  it('should delete the item', async () => {
    const { fetch, service } = setup();

    await service.delete('9');

    expect([fetch.mock.calls[0][0], fetch.mock.calls[0][1]?.method]).toEqual([
      'http://api/todos/9',
      'DELETE',
    ]);
  });
});
