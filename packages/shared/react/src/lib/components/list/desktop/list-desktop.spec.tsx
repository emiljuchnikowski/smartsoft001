import { act, fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';

import { IEntity } from '@smartsoft001/domain-core';
import { Field, FieldType, Model } from '@smartsoft001/models';

import { SmartListDesktop } from './list-desktop';
import {
  IListInternalOptions,
  IListPaginationOptions,
  IListProvider,
  PaginationMode,
} from '../../../models';
import { ISmartNavigation } from '../../../providers/navigation';
import { SmartProvider } from '../../../providers/smart-provider';
import { AlertService } from '../../../services/alert/alert.service';
import { AuthService } from '../../../services/auth/auth.service';

@Model({})
class TestItemModel implements IEntity<string> {
  id = 'test-id';

  @Field({ list: true })
  firstName = 'Jane';

  @Field({ list: true, type: FieldType.image })
  photo: { id: string } | null = null;
}

const FIELDS = [{ key: 'firstName', options: { list: true } }];

function createProvider(
  list: TestItemModel[] = [],
  extra: Partial<IListProvider<TestItemModel>> = {},
): IListProvider<TestItemModel> {
  return { list, loading: false, getData: jest.fn(), ...extra };
}

function createItems(...names: string[]): TestItemModel[] {
  return names.map((firstName, index) =>
    Object.assign(new TestItemModel(), { id: `id-${index}`, firstName }),
  );
}

function createPagination(
  extra: Partial<IListPaginationOptions> = {},
): IListPaginationOptions {
  return {
    limit: 10,
    page: 1,
    totalPages: 3,
    loadNextPage: jest.fn(() => Promise.resolve(true)),
    loadPrevPage: jest.fn(() => Promise.resolve(true)),
    ...extra,
  };
}

const navigation: ISmartNavigation = {
  navigate: jest.fn(),
  back: jest.fn(),
  getCurrentUrl: () => '/',
  subscribe: () => () => undefined,
};
const authService = {
  expectPermissions: () => true,
} as unknown as AuthService;
const translations = { MODEL: { firstName: 'First name' } };
const fileServiceConfig = { apiUrl: 'http://api' };

function setup(
  options: Partial<IListInternalOptions<TestItemModel>> = {},
  className?: string,
  children?: ReactNode,
) {
  const alertService = new AlertService();

  const view = render(
    <SmartProvider
      language="eng"
      translations={translations}
      alertService={alertService}
      authService={authService}
      navigation={navigation}
      fileServiceConfig={fileServiceConfig}
    >
      <SmartListDesktop
        options={{
          provider: createProvider(createItems('Jane')),
          type: TestItemModel,
          fields: FIELDS,
          ...options,
        }}
        className={className}
      />
      {children}
    </SmartProvider>,
  );

  return { ...view, alertService };
}

describe('@smartsoft001/react: SmartListDesktop', () => {
  beforeEach(() => {
    jest.spyOn(window, 'scrollTo').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('should render a <table> with Tailwind container classes', () => {
    setup();

    const table = screen.getByRole('table');
    expect(table).toHaveClass(
      'smart:min-w-full',
      'smart:divide-y',
      'smart:divide-gray-300',
      'smart:dark:divide-white/10',
    );
  });

  it('should append className to the table classes', () => {
    setup({}, 'my-extra-class');

    expect(screen.getByRole('table')).toHaveClass('my-extra-class');
  });

  it('should wrap the table in a horizontally scrolling container', () => {
    setup();

    expect(screen.getByRole('table').parentElement).toHaveClass(
      'smart:overflow-x-auto',
    );
  });

  it('should render the translated column header', () => {
    setup();

    expect(
      screen.getByRole('columnheader', { name: 'First name' }),
    ).toBeInTheDocument();
  });

  it('should keep the header row sticky', () => {
    setup();

    expect(
      screen.getByRole('columnheader', { name: 'First name' }),
    ).toHaveStyle({ position: 'sticky', top: '0px' });
  });

  it('should render one body row per item', () => {
    setup({ provider: createProvider(createItems('Jane', 'John', 'Ann')) });

    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(4);
    expect(rows[2]).toHaveClass(
      'smart:hover:bg-gray-50',
      'smart:dark:hover:bg-gray-800/30',
    );
  });

  it('should render the cell value as HTML with the column key', () => {
    setup({ provider: createProvider(createItems('<b>Jane</b>')) });

    const cell = screen.getByRole('cell', { name: 'Jane' });
    expect(cell).toHaveAttribute('smart-item-key', 'firstName');
    expect(cell.querySelector('b')).toHaveTextContent('Jane');
  });

  it('should run the cell pipe', () => {
    setup({
      cellPipe: { transform: (item, key) => `${key}:${item.firstName}` },
    });

    expect(
      screen.getByRole('cell', { name: 'firstName:Jane' }),
    ).toBeInTheDocument();
  });

  it('should render a lazy image for an image cell', () => {
    const [item] = createItems('Jane');
    item.photo = { id: 'file-1' };

    setup({
      provider: createProvider([item]),
      fields: [
        { key: 'photo', options: { list: true, type: FieldType.image } },
      ],
    });

    const image = screen.getByRole('presentation');
    expect(image).toHaveAttribute('src', 'http://api/attachments/file-1');
    expect(image).toHaveAttribute('loading', 'lazy');
    expect(image).toHaveAttribute('height', '50');
    expect(image).toHaveClass('smart:h-10', 'smart:w-auto');
  });

  it('should render the top component factory', () => {
    const Top = () => <div data-testid="top">Top</div>;

    setup({ componentFactories: { top: Top } });

    expect(screen.getByTestId('top')).toBeInTheDocument();
  });

  it('should order the columns: selectMulti + keys + removeAction + itemAction', () => {
    setup({
      select: 'multi',
      remove: { provider: { invoke: jest.fn() } },
      item: { options: { select: jest.fn(), edit: false } },
    });

    const cells = screen.getAllByRole('row')[1].querySelectorAll('td');
    expect(cells).toHaveLength(4);
    expect(cells[0].querySelector('input[type="checkbox"]')).not.toBeNull();
    expect(cells[1]).toHaveAttribute('smart-item-key', 'firstName');
    expect(cells[2]).toHaveTextContent('remove');
    expect(cells[3]).toHaveTextContent('→');
  });

  describe('multi select', () => {
    it('should report the selected items', () => {
      const items = createItems('Jane', 'John');
      const onChangeMultiSelected = jest.fn();
      setup({
        select: 'multi',
        provider: createProvider(items, { onChangeMultiSelected }),
      });
      const [first, second] = screen.getAllByRole('checkbox');

      fireEvent.click(first);
      fireEvent.click(second);

      expect(onChangeMultiSelected).toHaveBeenLastCalledWith(items);
    });

    it('should drop an unchecked item from the selection', () => {
      const items = createItems('Jane', 'John');
      const onChangeMultiSelected = jest.fn();
      setup({
        select: 'multi',
        provider: createProvider(items, { onChangeMultiSelected }),
      });
      const [first, second] = screen.getAllByRole('checkbox');

      fireEvent.click(first);
      fireEvent.click(second);
      fireEvent.click(first);

      expect(onChangeMultiSelected).toHaveBeenLastCalledWith([items[1]]);
    });

    it('should clear the selection when onCleanMultiSelected$ emits', () => {
      const items = createItems('Jane', 'John');
      const onChangeMultiSelected = jest.fn();
      let clean: () => void = () => undefined;
      const onCleanMultiSelected$ = {
        subscribe: (listener: () => void) => {
          clean = listener;
          return { unsubscribe: jest.fn() };
        },
      };
      setup({
        select: 'multi',
        provider: createProvider(items, {
          onChangeMultiSelected,
          onCleanMultiSelected$,
        }),
      });
      const [first, second] = screen.getAllByRole('checkbox');

      fireEvent.click(first);
      clean();
      fireEvent.click(second);

      expect(onChangeMultiSelected).toHaveBeenLastCalledWith([items[1]]);
    });

    it('should unsubscribe from onCleanMultiSelected$ on unmount', () => {
      const unsubscribe = jest.fn();
      const { unmount } = setup({
        select: 'multi',
        provider: createProvider([], {
          onCleanMultiSelected$: { subscribe: () => ({ unsubscribe }) },
        }),
      });

      unmount();

      expect(unsubscribe).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove action', () => {
    it('should confirm with an alert and invoke the remove provider', () => {
      const invoke = jest.fn();
      const { alertService } = setup({ remove: { provider: { invoke } } });

      fireEvent.click(screen.getByRole('button', { name: 'remove' }));
      const [alert] = alertService.alerts.get();
      alert.options.buttons?.[1].handler?.();

      expect(alert.options.header).toBe('confirm delete object');
      expect(invoke).toHaveBeenCalledWith('id-0');
    });

    it('should hide the remove button when the check fails', () => {
      setup({
        remove: { provider: { invoke: jest.fn(), check: () => false } },
      });

      expect(
        screen.queryByRole('button', { name: 'remove' }),
      ).not.toBeInTheDocument();
    });
  });

  describe('item action', () => {
    it('should navigate to the item page', () => {
      setup({
        item: { options: { routingPrefix: '/users/', edit: false } },
      });

      fireEvent.click(screen.getByRole('button', { name: '→' }));

      expect(navigation.navigate).toHaveBeenCalledWith('/users/id-0');
    });
  });

  describe('pagination', () => {
    it('should show the page in the last column header', () => {
      setup({ pagination: createPagination({ page: 2, totalPages: 5 }) });

      const header = screen.getByRole('columnheader');
      expect(header).toHaveTextContent('page: 2/5');
      expect(header.querySelector('b')).toHaveTextContent('2/5');
    });

    it('should not show the page without pagination', () => {
      setup();

      expect(screen.getByRole('columnheader')).not.toHaveTextContent('page');
    });

    it('should render the paging for the single page mode', () => {
      setup({
        pagination: createPagination({ mode: PaginationMode.singlePage }),
      });

      expect(
        screen.getByRole('navigation', { name: 'Pagination' }),
      ).toBeInTheDocument();
    });

    it('should not render the paging for the infinite scroll mode', () => {
      setup({
        pagination: createPagination({ mode: PaginationMode.infiniteScroll }),
      });

      expect(
        screen.queryByRole('navigation', { name: 'Pagination' }),
      ).not.toBeInTheDocument();
    });

    it('should load the next page from the paging', () => {
      const pagination = createPagination({ mode: PaginationMode.singlePage });
      setup({ pagination });

      fireEvent.click(screen.getByRole('button', { name: '2' }));

      expect(pagination.loadNextPage).toHaveBeenCalledTimes(1);
    });
  });

  describe('infinite scroll', () => {
    let observe: jest.Mock;
    let disconnect: jest.Mock;
    let trigger: (isIntersecting: boolean) => void;

    beforeEach(() => {
      observe = jest.fn();
      disconnect = jest.fn();
      (
        window as unknown as { IntersectionObserver: unknown }
      ).IntersectionObserver = jest.fn(
        (callback: (entries: Array<{ isIntersecting: boolean }>) => void) => {
          trigger = (isIntersecting) => callback([{ isIntersecting }]);
          return { observe, disconnect };
        },
      );
    });

    afterEach(() => {
      delete (window as unknown as { IntersectionObserver?: unknown })
        .IntersectionObserver;
    });

    it('should observe the sentinel after the table', () => {
      const { container } = setup({
        pagination: createPagination({ mode: PaginationMode.infiniteScroll }),
      });

      const sentinel = container.querySelector('[data-role="infinite-scroll"]');
      expect(observe).toHaveBeenCalledWith(sentinel);
    });

    it('should load the next page when the sentinel scrolls into view', async () => {
      const pagination = createPagination({
        mode: PaginationMode.infiniteScroll,
      });
      setup({ pagination });

      await act(async () => trigger(true));

      expect(pagination.loadNextPage).toHaveBeenCalledTimes(1);
    });

    it('should not load the next page while the sentinel is hidden', async () => {
      const pagination = createPagination({
        mode: PaginationMode.infiniteScroll,
      });
      setup({ pagination });

      await act(async () => trigger(false));

      expect(pagination.loadNextPage).not.toHaveBeenCalled();
    });

    it('should not load the next page twice while it is loading', async () => {
      const pagination = createPagination({
        mode: PaginationMode.infiniteScroll,
        loadNextPage: jest.fn(() => new Promise<boolean>(() => undefined)),
      });
      setup({ pagination });

      await act(async () => {
        trigger(true);
        trigger(true);
      });

      expect(pagination.loadNextPage).toHaveBeenCalledTimes(1);
    });

    it('should not render the sentinel on the last page', () => {
      const { container } = setup({
        pagination: createPagination({
          mode: PaginationMode.infiniteScroll,
          page: 3,
          totalPages: 3,
        }),
      });

      expect(
        container.querySelector('[data-role="infinite-scroll"]'),
      ).toBeNull();
    });

    it('should disconnect the observer on unmount', () => {
      const { unmount } = setup({
        pagination: createPagination({ mode: PaginationMode.infiniteScroll }),
      });

      unmount();

      expect(disconnect).toHaveBeenCalled();
    });
  });

  it('should render without IntersectionObserver (SSR / jsdom)', () => {
    const { container } = setup({
      pagination: createPagination({ mode: PaginationMode.infiniteScroll }),
    });

    expect(
      container.querySelector('[data-role="infinite-scroll"]'),
    ).toBeInTheDocument();
  });
});
