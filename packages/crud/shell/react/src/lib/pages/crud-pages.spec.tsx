import { act, render, screen } from '@testing-library/react';

import { ISmartNavigation, SmartProvider } from '@smartsoft001/react';

import { matchCrudRoute, SmartCrudPages } from './crud-pages';

jest.mock('./list/list-page', () => ({
  SmartCrudListPage: ({ basePath }: { basePath?: string }) => (
    <p data-testid="list">list {basePath}</p>
  ),
}));

jest.mock('./item/item-page', () => ({
  SmartCrudItemPage: ({ id, basePath }: { id?: string; basePath?: string }) => (
    <p data-testid="item">
      item {id ?? 'create'} {basePath}
    </p>
  ),
}));

function createNavigation(url: string) {
  const listeners = new Set<(next: string) => void>();
  let current = url;
  const navigation: ISmartNavigation = {
    navigate: jest.fn((next: string) => {
      current = next;
      listeners.forEach((listener) => listener(next));
    }),
    back: jest.fn(),
    getCurrentUrl: () => current,
    subscribe: (listener) => {
      listeners.add(listener);

      return () => listeners.delete(listener);
    },
  };

  return navigation;
}

function renderPages(url: string, basePath = '/notes') {
  const navigation = createNavigation(url);

  render(
    <SmartProvider navigation={navigation}>
      <SmartCrudPages basePath={basePath} />
    </SmartProvider>,
  );

  return navigation;
}

describe('@smartsoft001/crud-shell-react: matchCrudRoute', () => {
  it('should match the base path as the list', () => {
    const route = matchCrudRoute('/notes', '/notes');

    expect(route).toEqual({ page: 'list' });
  });

  it('should ignore the query string and a trailing slash', () => {
    const route = matchCrudRoute('/notes/?page=2', '/notes');

    expect(route).toEqual({ page: 'list' });
  });

  it('should match "add" as the item page in create mode', () => {
    const route = matchCrudRoute('/notes/add', '/notes/');

    expect(route).toEqual({ page: 'item' });
  });

  it('should match a segment as the id of the item page', () => {
    const route = matchCrudRoute('/notes/a%20b?edit=1', '/notes');

    expect(route).toEqual({ page: 'item', id: 'a b' });
  });

  it('should match the routes under the root path', () => {
    const route = matchCrudRoute('/12', '/');

    expect(route).toEqual({ page: 'item', id: '12' });
  });

  it('should not match a deeper path', () => {
    const route = matchCrudRoute('/notes/12/history', '/notes');

    expect(route).toBeNull();
  });

  it('should not match another path', () => {
    const route = matchCrudRoute('/notebooks', '/notes');

    expect(route).toBeNull();
  });
});

describe('@smartsoft001/crud-shell-react: SmartCrudPages', () => {
  it('should render the list page on the base path', () => {
    renderPages('/notes');

    expect(screen.getByTestId('list')).toHaveTextContent('list /notes');
  });

  it('should render the item page in create mode on "add"', () => {
    renderPages('/notes/add');

    expect(screen.getByTestId('item')).toHaveTextContent('item create /notes');
  });

  it('should render the item page of the id', () => {
    renderPages('/notes/42');

    expect(screen.getByTestId('item')).toHaveTextContent('item 42 /notes');
  });

  it('should render nothing outside its routes', () => {
    renderPages('/other');

    expect(screen.queryByTestId('list')).not.toBeInTheDocument();
  });

  it('should follow the navigation', () => {
    const navigation = renderPages('/notes');

    act(() => navigation.navigate('/notes/7'));

    expect(screen.getByTestId('item')).toHaveTextContent('item 7 /notes');
  });
});
