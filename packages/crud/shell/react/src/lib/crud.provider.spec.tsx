import { act, render, screen } from '@testing-library/react';

import { SmartProvider, useFileService } from '@smartsoft001/react';

import { useCrud } from './crud.context';
import { CrudProvider } from './crud.provider';
import { useCrudListPagination, useCrudState } from './hooks';

const config = { apiUrl: 'http://api/todos', entity: 'todos' };
const other = { apiUrl: 'http://api/todos', entity: 'todos' };

describe('@smartsoft001/crud-shell-react: CrudProvider', () => {
  it('should share the store of an entity between features of one app', () => {
    const stores: unknown[] = [];
    const Probe = () => {
      stores.push(useCrud().store);
      return null;
    };

    render(
      <SmartProvider>
        <CrudProvider config={config}>
          <Probe />
        </CrudProvider>
        <CrudProvider config={other}>
          <Probe />
        </CrudProvider>
      </SmartProvider>,
    );

    expect(stores[0]).toBe(stores[1]);
  });

  it('should keep the stores of two apps apart', () => {
    const stores: unknown[] = [];
    const Probe = () => {
      stores.push(useCrud().store);
      return null;
    };

    render(
      <>
        <SmartProvider>
          <CrudProvider config={config}>
            <Probe />
          </CrudProvider>
        </SmartProvider>
        <SmartProvider>
          <CrudProvider config={config}>
            <Probe />
          </CrudProvider>
        </SmartProvider>
      </>,
    );

    expect(stores[0]).not.toBe(stores[1]);
  });

  it('should point the file service at the resource', () => {
    const Probe = () => <span>{useFileService()?.getUrl('1')}</span>;

    render(
      <SmartProvider>
        <CrudProvider config={config}>
          <Probe />
        </CrudProvider>
      </SmartProvider>,
    );

    expect(
      screen.getByText('http://api/todos/attachments/1'),
    ).toBeInTheDocument();
  });

  it('should throw a helpful error outside a provider', () => {
    const Probe = () => {
      useCrud();
      return null;
    };
    jest.spyOn(console, 'error').mockImplementation(() => undefined);

    expect(() => render(<Probe />)).toThrow('<CrudProvider config={...}>');
  });

  it('should re-render on state changes', () => {
    const Probe = () => <span>{String(useCrudState((s) => s.loaded))}</span>;
    let store: ReturnType<typeof useCrud>['store'] | null = null;
    const Grab = () => {
      store = useCrud().store;
      return null;
    };

    render(
      <SmartProvider>
        <CrudProvider config={config}>
          <Probe />
          <Grab />
        </CrudProvider>
      </SmartProvider>,
    );
    act(() => store?.set({ loaded: true }));

    expect(screen.getByText('true')).toBeInTheDocument();
  });

  it('should compute the page and the page count', () => {
    let pagination: ReturnType<typeof useCrudListPagination> | null = null;
    let store: ReturnType<typeof useCrud>['store'] | null = null;
    const Probe = () => {
      pagination = useCrudListPagination({ limit: 10 });
      store = useCrud().store;
      return null;
    };

    render(
      <SmartProvider>
        <CrudProvider config={{ apiUrl: '/api', entity: 'paged' }}>
          <Probe />
        </CrudProvider>
      </SmartProvider>,
    );
    act(() =>
      store?.set({
        loaded: true,
        filter: { limit: 10, offset: 20 },
        totalCount: 45,
      }),
    );

    expect([pagination!.page, pagination!.totalPages]).toEqual([3, 5]);
  });

  it('should not load a next page without a next link', async () => {
    let pagination: ReturnType<typeof useCrudListPagination> | null = null;
    const Probe = () => {
      pagination = useCrudListPagination({ limit: 10 });
      return null;
    };

    render(
      <SmartProvider>
        <CrudProvider config={{ apiUrl: '/api', entity: 'nolinks' }}>
          <Probe />
        </CrudProvider>
      </SmartProvider>,
    );

    expect(await pagination!.loadNextPage()).toBe(false);
  });
});
