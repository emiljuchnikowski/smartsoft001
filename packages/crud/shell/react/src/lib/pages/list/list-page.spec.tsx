import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import type { ComponentType } from 'react';
import { renderToString } from 'react-dom/server';

import { IEntity } from '@smartsoft001/domain-core';
import { Field, Model } from '@smartsoft001/models';
import {
  AuthService,
  IListOptions,
  ISmartNavigation,
  ListMode,
  MenuService,
  PaginationMode,
  SmartPageVariantProps,
  SmartProvider,
  StorageService,
  useStore,
} from '@smartsoft001/react';

import { SmartCrudListPage } from './list-page';
import { SmartCrudListPageBodyProps } from './list-page.types';
import { CrudFullConfig } from '../../crud.config';
import { useCrud } from '../../crud.context';
import { CrudProvider } from '../../crud.provider';
import { ICrudFilter } from '../../models';
import { CrudService } from '../../services/crud/crud.service';

// The CRUD components have specs of their own; the page only places them.
jest.mock('../../components/filters/filters', () => ({
  SmartCrudFilters: function MockFilters() {
    const { useCrudConfig } = jest.requireActual('../../crud.context');

    return <p>filters of {useCrudConfig().title}</p>;
  },
}));

jest.mock('../../components/multiselect/multiselect', () => ({
  SmartCrudMultiselect: function MockMultiselect() {
    const { useCrudState } = jest.requireActual('../../hooks');
    const selected = useCrudState(
      (state: { multiSelected?: unknown[] }) => state.multiSelected,
    );

    return <p>multiselect of {selected?.length ?? 0}</p>;
  },
}));

jest.mock('../../components/export/export', () => ({
  SmartCrudExport: function MockExport({ dismiss }: { dismiss?: () => void }) {
    const { useCrudConfig } = jest.requireActual('../../crud.context');

    return (
      <button type="button" onClick={() => dismiss?.()}>
        export of {useCrudConfig().title}
      </button>
    );
  },
}));

jest.mock('../../components/filters-config/filters-config', () => ({
  SmartCrudFiltersConfig: () => <p>filters config</p>,
}));

jest.mock('../../components/group/group', () => ({
  SmartCrudGroup: ({
    groups,
    listOptions,
  }: {
    groups?: Array<{ text: string }> | null;
    listOptions?: unknown;
  }) => (
    <p data-testid="group">
      {groups?.map((g) => g.text).join(', ')}
      {listOptions ? ' with list' : ''}
    </p>
  ),
}));

const ENTITY = 'list-page-notes';

@Model({ titleKey: 'title' })
class ListPageNote implements IEntity<string> {
  id!: string;

  @Field({ list: true, search: true })
  title!: string;

  @Field({ list: true })
  body!: string;
}

@Model({})
class FilterableListPageNote implements IEntity<string> {
  id!: string;

  @Field({ list: { filter: true } })
  title!: string;
}

@Model({})
class MultiListPageNote implements IEntity<string> {
  id!: string;

  @Field({ list: true, update: { multi: true } })
  title!: string;
}

@Model({ remove: { enabled: { criteria: { locked: false } } } })
class LockableListPageNote implements IEntity<string> {
  id!: string;

  @Field({ list: true })
  title!: string;

  locked!: boolean;
}

@Model({ create: { permissions: ['admin'] } })
class GuardedListPageNote implements IEntity<string> {
  id!: string;

  @Field({ list: true })
  title!: string;
}

const NOTES = [
  { id: '1', title: 'First note', body: 'Alpha', locked: false },
  { id: '2', title: 'Second note', body: 'Beta', locked: true },
];

function createConfig(
  partial: Partial<CrudFullConfig<any>> = {},
): CrudFullConfig<any> {
  return {
    apiUrl: '/api/list-page-notes',
    entity: ENTITY,
    type: ListPageNote,
    title: 'Notes',
    ...partial,
  };
}

function createService(items = NOTES) {
  return {
    getList: jest.fn<
      Promise<{ data: unknown[]; totalCount: number; links: unknown }>,
      [ICrudFilter?]
    >(async () => ({
      data: items,
      totalCount: items.length,
      links: {},
    })),
    getById: jest.fn(async (id: string) => items.find((i) => i.id === id)),
    create: jest.fn(async () => '3'),
    createMany: jest.fn(async () => undefined),
    update: jest.fn(async () => undefined),
    updatePartial: jest.fn(async () => undefined),
    updatePartialMany: jest.fn(async () => []),
    delete: jest.fn(async () => undefined),
    exportList: jest.fn(async () => undefined),
  };
}

function createNavigation(url = '/notes') {
  const listeners = new Set<(next: string) => void>();
  let current = url;
  const navigation: ISmartNavigation & { navigate: jest.Mock } = {
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

/** The end menu of the application shell, outside the CRUD feature. */
function EndMenu({ menuService }: { menuService: MenuService }) {
  const content = useStore(menuService.endContent);

  if (!content) return null;

  const Component = content.component;

  return (
    <aside data-testid="end-menu">
      <Component {...(content.props ?? {})} />
    </aside>
  );
}

interface RenderOptions {
  basePath?: string;
  url?: string;
  components?: Record<string, ComponentType<any>>;
  authService?: AuthService;
  service?: ReturnType<typeof createService>;
  /** Rendered in the feature before the page, e.g. to prepare its state. */
  before?: ComponentType;
}

/** Lets the pending requests settle. */
const settle = () =>
  act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });

async function renderPage(
  config: CrudFullConfig<any>,
  options: RenderOptions = {},
) {
  const navigation = createNavigation(options.url);
  const service = options.service ?? createService();
  const menuService = new MenuService();
  const Before = options.before;

  const view = render(
    <SmartProvider
      language="eng"
      navigation={navigation}
      menuService={menuService}
      components={options.components}
      authService={options.authService}
    >
      <CrudProvider
        config={config}
        service={service as unknown as CrudService<any>}
      >
        {Before ? <Before /> : null}
        <SmartCrudListPage basePath={options.basePath} />
      </CrudProvider>
      <EndMenu menuService={menuService} />
    </SmartProvider>,
  );

  await settle();

  return { ...view, navigation, service, menuService };
}

/** Records the options the page variant got. */
function createPageProbe() {
  const probe = jest.fn();
  const PageProbe = (props: SmartPageVariantProps) => {
    probe(props);

    return (
      <div data-testid="page" className={props.className}>
        {props.options?.bodyTpl}
      </div>
    );
  };

  return {
    PageProbe,
    last: (): SmartPageVariantProps =>
      probe.mock.calls[probe.mock.calls.length - 1][0],
  };
}

/** A body registered for `crud-list-page`, recording its list options. */
function createBodyProbe() {
  let listOptions: IListOptions<any> | null = null;
  const Body = (props: SmartCrudListPageBodyProps) => {
    listOptions = props.listOptions;

    return <p className="custom-list-body">custom body</p>;
  };

  return { Body, get: () => listOptions as IListOptions<any> };
}

function lastFilter(service: ReturnType<typeof createService>) {
  const calls = service.getList.mock.calls;

  return calls[calls.length - 1][0] as ICrudFilter;
}

describe('@smartsoft001/crud-shell-react: SmartCrudListPage', () => {
  describe('page options', () => {
    it('should render nothing before the first read', async () => {
      const html = renderToString(
        <SmartProvider>
          <CrudProvider
            config={createConfig()}
            service={createService() as unknown as CrudService<any>}
          >
            <SmartCrudListPage />
          </CrudProvider>
        </SmartProvider>,
      );

      expect(html).toBe('');
    });

    it('should thread config.variant into the page options', async () => {
      const { PageProbe, last } = createPageProbe();

      await renderPage(createConfig({ variant: 'standard' }), {
        components: { page: PageProbe },
      });

      expect(last().options?.variant).toBe('standard');
    });

    it('should leave the variant undefined when config has no variant', async () => {
      const { PageProbe, last } = createPageProbe();

      await renderPage(createConfig(), { components: { page: PageProbe } });

      expect(last().options?.variant).toBeUndefined();
    });

    it('should render the page variant of config.variant', async () => {
      const { PageProbe } = createPageProbe();

      await renderPage(createConfig({ variant: 'preset' }), {
        components: { 'page:preset': PageProbe },
      });

      expect(screen.getByTestId('page')).toBeInTheDocument();
    });

    it('should expose the configured title', async () => {
      await renderPage(createConfig({ title: 'My List' }));

      expect(
        await screen.findByRole('heading', { name: 'My List' }),
      ).toBeInTheDocument();
    });

    it('should pass config.className to the page', async () => {
      const { PageProbe, last } = createPageProbe();

      await renderPage(createConfig({ className: 'smart:bg-slate-50' }), {
        components: { page: PageProbe },
      });

      expect(last().className).toBe('smart:bg-slate-50');
    });
  });

  describe('first read', () => {
    it('should read with the pagination, the default sort and the base query', async () => {
      const { service } = await renderPage(
        createConfig({
          pagination: { limit: 25 },
          sort: { default: 'title', defaultDesc: true },
          baseQuery: [{ key: 'archived', type: '=', value: false }],
          list: { paginationMode: PaginationMode.singlePage },
        }),
      );

      expect(lastFilter(service)).toEqual({
        paginationMode: PaginationMode.singlePage,
        limit: 25,
        offset: 0,
        sortBy: 'title',
        sortDesc: true,
        query: [{ key: 'archived', type: '=', value: false }],
      });
    });

    it('should not throw and read without a paginationMode when config has no list', async () => {
      const { service } = await renderPage(
        createConfig({ export: true, pagination: { limit: 25 } }),
      );

      expect(lastFilter(service).paginationMode).toBeUndefined();
    });

    it('should read without paging when config has no pagination', async () => {
      const { service } = await renderPage(createConfig({ export: true }));

      expect([lastFilter(service).limit, lastFilter(service).offset]).toEqual([
        undefined,
        undefined,
      ]);
    });

    it('should read once', async () => {
      const { service } = await renderPage(createConfig());

      expect(service.getList).toHaveBeenCalledTimes(1);
    });

    it('should apply the enabled search filter', async () => {
      const Before = () => {
        const { searchService } = useCrud();

        searchService.setEnabled(true);
        searchService.setFilter({ searchText: 'abc', limit: 5, offset: 10 });

        return null;
      };

      const { service } = await renderPage(
        createConfig({ pagination: { limit: 25 } }),
        { before: Before },
      );

      expect(lastFilter(service)).toMatchObject({
        searchText: 'abc',
        limit: 5,
        offset: 10,
      });
    });

    it('should keep the filter the feature already has', async () => {
      const Before = () => {
        const { store } = useCrud();

        if (!store.get().filter) {
          store.set({ loaded: true, filter: { limit: 7, offset: 14 } });
        }

        return null;
      };

      const { service } = await renderPage(
        createConfig({ pagination: { limit: 25 } }),
        { before: Before },
      );

      expect(lastFilter(service)).toMatchObject({ limit: 7, offset: 14 });
    });

    it('should reset the query before init with list.resetQuery', async () => {
      const Before = () => {
        const { store } = useCrud();

        if (!store.get().filter) {
          store.set({
            loaded: true,
            filter: {
              limit: 7,
              offset: 14,
              query: [{ key: 'old', type: '=', value: 1 }],
            },
          });
        }

        return null;
      };

      const { service } = await renderPage(
        createConfig({
          pagination: { limit: 25 },
          baseQuery: [{ key: 'archived', type: '=', value: false }],
          list: { resetQuery: 'beforeInit' },
        }),
        { before: Before },
      );

      expect(lastFilter(service)).toMatchObject({
        limit: 25,
        offset: 0,
        query: [{ key: 'archived', type: '=', value: false }],
      });
    });
  });

  describe('list', () => {
    it('should render the items read', async () => {
      await renderPage(createConfig());

      expect(await screen.findByText('First note')).toBeInTheDocument();
    });

    it('should navigate to the item when an item is opened', async () => {
      const { navigation } = await renderPage(createConfig({ edit: true }), {
        basePath: '/notes',
      });

      await screen.findByText('First note');
      fireEvent.click(screen.getAllByRole('button', { name: '→' })[0]);
      await settle();

      expect(navigation.navigate).toHaveBeenCalledWith('/notes/1');
    });

    it('should link the items relative to the current path without basePath', async () => {
      const { navigation } = await renderPage(createConfig({ details: true }), {
        url: '/app/notes?page=1',
      });

      await screen.findByText('First note');
      fireEvent.click(screen.getAllByRole('button', { name: '→' })[0]);
      await settle();

      expect(navigation.navigate).toHaveBeenCalledWith('/app/notes/1');
    });

    it('should not link the items without edit and details', async () => {
      await renderPage(createConfig());

      await screen.findByText('First note');

      expect(
        screen.queryByRole('button', { name: '→' }),
      ).not.toBeInTheDocument();
    });

    it('should delete an item through the facade once confirmed', async () => {
      const { service } = await renderPage(createConfig({ remove: true }));

      await screen.findByText('First note');
      fireEvent.click(screen.getAllByRole('button', { name: 'remove' })[0]);
      fireEvent.click(await screen.findByRole('button', { name: 'confirm' }));

      await waitFor(() => expect(service.delete).toHaveBeenCalledWith('1'));
    });

    it('should not delete an item when the confirm is cancelled', async () => {
      const { service } = await renderPage(createConfig({ remove: true }));

      await screen.findByText('First note');
      fireEvent.click(screen.getAllByRole('button', { name: 'remove' })[0]);
      fireEvent.click(await screen.findByRole('button', { name: 'cancel' }));

      expect(service.delete).not.toHaveBeenCalled();
    });

    it('should offer remove only for the items the model allows', async () => {
      await renderPage(
        createConfig({ type: LockableListPageNote, remove: true }),
      );

      await screen.findByText('First note');

      expect(screen.getAllByRole('button', { name: 'remove' })).toHaveLength(1);
    });

    it('should render the top component of the list', async () => {
      const Top = () => <p>list top</p>;

      await renderPage(createConfig({ list: { components: { top: Top } } }));

      expect(await screen.findByText('list top')).toBeInTheDocument();
    });

    it('should render the active filters', async () => {
      await renderPage(createConfig());

      expect(await screen.findByText('filters config')).toBeInTheDocument();
    });
  });

  describe('list options', () => {
    it('should render a body registered for the crud-list-page key', async () => {
      const { Body } = createBodyProbe();

      const { container } = await renderPage(createConfig(), {
        components: { 'crud-list-page': Body },
      });

      await screen.findByText('custom body');

      expect([
        container.querySelector('.dynamic-content .custom-list-body'),
        screen.queryByText('filters config'),
      ]).toEqual([expect.anything(), null]);
    });

    it('should build the details options with a provider and no component', async () => {
      const { Body, get } = createBodyProbe();

      await renderPage(createConfig({ details: true }), {
        components: { 'crud-list-page': Body },
      });
      await screen.findByText('custom body');

      const details = get().details as {
        provider?: unknown;
        component?: unknown;
      };
      expect([details.provider, details.component]).toEqual([
        expect.anything(),
        undefined,
      ]);
    });

    it('should hand the details components to the list', async () => {
      const { Body, get } = createBodyProbe();
      const Top = () => null;
      const Bottom = () => null;

      await renderPage(
        createConfig({ details: { components: { top: Top, bottom: Bottom } } }),
        { components: { 'crud-list-page': Body } },
      );
      await screen.findByText('custom body');

      expect(
        (get().details as { componentFactories?: unknown }).componentFactories,
      ).toEqual({ top: Top, bottom: Bottom });
    });

    it('should select the item of the details through the facade', async () => {
      const { Body, get } = createBodyProbe();

      const { service } = await renderPage(createConfig({ details: true }), {
        components: { 'crud-list-page': Body },
      });
      await screen.findByText('custom body');

      act(() => {
        (
          get().details as { provider: { getData: (id: string) => void } }
        ).provider.getData('2');
      });
      await settle();

      expect(service.getById).toHaveBeenCalledWith('2');
    });

    it('should pass the mode, the sort and the pagination to the list', async () => {
      const { Body, get } = createBodyProbe();

      await renderPage(
        createConfig({
          pagination: { limit: 25 },
          sort: true,
          list: {
            mode: ListMode.mobile,
            paginationMode: PaginationMode.singlePage,
          },
        }),
        { components: { 'crud-list-page': Body } },
      );
      await screen.findByText('custom body');

      expect([
        get().mode,
        get().sort,
        get().pagination?.limit,
        get().pagination?.mode,
      ]).toEqual([ListMode.mobile, true, 25, PaginationMode.singlePage]);
    });

    it('should read the list with the current filter merged with the one asked for', async () => {
      const { Body, get } = createBodyProbe();

      const { service } = await renderPage(
        createConfig({ pagination: { limit: 25 } }),
        { components: { 'crud-list-page': Body } },
      );
      await screen.findByText('custom body');

      act(() => get().provider.getData({ sortBy: 'title', sortDesc: true }));
      await settle();

      expect(lastFilter(service)).toMatchObject({
        limit: 25,
        offset: 0,
        sortBy: 'title',
        sortDesc: true,
      });
    });
  });

  describe('end buttons', () => {
    it('should navigate to the add page', async () => {
      const { navigation } = await renderPage(createConfig({ add: true }), {
        basePath: '/notes/',
      });

      fireEvent.click(await screen.findByRole('button', { name: 'add' }));
      await settle();

      expect(navigation.navigate).toHaveBeenCalledWith('/notes/add');
    });

    it('should hide the add button without the create permission', async () => {
      const authService = new AuthService(new StorageService());
      jest.spyOn(authService, 'expectPermissions').mockReturnValue(false);

      await renderPage(createConfig({ type: GuardedListPageNote, add: true }), {
        authService,
      });
      await screen.findByText('First note');

      expect(
        screen.queryByRole('button', { name: 'add' }),
      ).not.toBeInTheDocument();
    });

    it('should not show the filters button without filterable fields', async () => {
      await renderPage(createConfig());
      await screen.findByText('First note');

      expect(
        screen.queryByRole('button', { name: 'filters' }),
      ).not.toBeInTheDocument();
    });

    it('should open the filters of the feature in the end menu', async () => {
      await renderPage(createConfig({ type: FilterableListPageNote }));

      fireEvent.click(await screen.findByRole('button', { name: 'filters' }));

      expect(screen.getByTestId('end-menu')).toHaveTextContent(
        'filters of Notes',
      );
    });

    it('should open the export of the feature in a modal', async () => {
      await renderPage(createConfig({ export: true }));

      fireEvent.click(await screen.findByRole('button', { name: 'export' }));

      expect(
        await screen.findByRole('button', { name: 'export of Notes' }),
      ).toBeInTheDocument();
    });

    it('should close the export modal when it dismisses itself', async () => {
      await renderPage(createConfig({ export: true }));

      fireEvent.click(await screen.findByRole('button', { name: 'export' }));
      fireEvent.click(
        await screen.findByRole('button', { name: 'export of Notes' }),
      );

      await waitFor(() =>
        expect(
          screen.queryByRole('button', { name: 'export of Notes' }),
        ).not.toBeInTheDocument(),
      );
    });

    it('should append the configured buttons', async () => {
      const handler = jest.fn();

      await renderPage(
        createConfig({
          add: true,
          buttons: [{ icon: 'star', text: 'star', handler }],
        }),
      );
      fireEvent.click(await screen.findByRole('button', { name: 'star' }));

      expect(handler).toHaveBeenCalled();
    });

    it('should order the buttons: multi, filters, add, export, custom', async () => {
      const { PageProbe, last } = createPageProbe();

      await renderPage(
        createConfig({
          type: FilterableListPageNote,
          add: true,
          export: true,
          buttons: [{ icon: 'star', text: 'star' }],
          list: { components: { multi: () => null } },
        }),
        { components: { page: PageProbe } },
      );

      expect(last().options?.endButtons?.map((b) => b.text)).toEqual([
        'multi',
        'filters',
        'add',
        'export',
        'star',
      ]);
    });

    it('should not offer the multi edit without multi fields', async () => {
      await renderPage(createConfig({ edit: true }));
      await screen.findByText('First note');

      expect(
        screen.queryByRole('button', { name: 'multi' }),
      ).not.toBeInTheDocument();
    });

    it('should not offer the multi edit outside the desktop mode', async () => {
      await renderPage(
        createConfig({
          type: MultiListPageNote,
          edit: true,
          list: { mode: ListMode.mobile },
        }),
      );
      await screen.findByText('First note');

      expect(
        screen.queryByRole('button', { name: 'multi' }),
      ).not.toBeInTheDocument();
    });

    it('should switch the list to the multi selection', async () => {
      await renderPage(createConfig({ type: MultiListPageNote, edit: true }));

      fireEvent.click(await screen.findByRole('button', { name: 'multi' }));

      await waitFor(() =>
        expect(screen.getAllByRole('checkbox')).toHaveLength(2),
      );
    });

    it('should switch the multi selection off again', async () => {
      await renderPage(createConfig({ type: MultiListPageNote, edit: true }));
      const multi = await screen.findByRole('button', { name: 'multi' });

      fireEvent.click(multi);
      await waitFor(() =>
        expect(screen.getAllByRole('checkbox')).toHaveLength(2),
      );
      fireEvent.click(multi);

      await waitFor(() =>
        expect(screen.queryByRole('checkbox')).not.toBeInTheDocument(),
      );
    });

    it('should open the multiselect in the end menu with the selected items', async () => {
      await renderPage(createConfig({ type: MultiListPageNote, edit: true }));

      fireEvent.click(await screen.findByRole('button', { name: 'multi' }));
      fireEvent.click((await screen.findAllByRole('checkbox'))[0]);

      await waitFor(() =>
        expect(screen.getByTestId('end-menu')).toHaveTextContent(
          'multiselect of 1',
        ),
      );
    });

    it('should close the end menu when nothing is selected anymore', async () => {
      await renderPage(createConfig({ type: MultiListPageNote, edit: true }));

      fireEvent.click(await screen.findByRole('button', { name: 'multi' }));
      const checkbox = (await screen.findAllByRole('checkbox'))[0];
      fireEvent.click(checkbox);
      await screen.findByTestId('end-menu');
      fireEvent.click(checkbox);

      await waitFor(() =>
        expect(screen.queryByTestId('end-menu')).not.toBeInTheDocument(),
      );
    });

    it('should close the end menu after a navigation', async () => {
      const { navigation } = await renderPage(
        createConfig({ type: FilterableListPageNote }),
      );

      fireEvent.click(await screen.findByRole('button', { name: 'filters' }));
      await act(async () => navigation.navigate('/elsewhere'));

      await waitFor(() =>
        expect(screen.queryByTestId('end-menu')).not.toBeInTheDocument(),
      );
    });
  });

  describe('search', () => {
    it('should not render the search without config.search', async () => {
      await renderPage(createConfig());
      await screen.findByText('First note');

      expect(screen.queryByPlaceholderText('search')).not.toBeInTheDocument();
    });

    it('should read the first page of the searched text', async () => {
      const { service } = await renderPage(
        createConfig({ search: true, pagination: { limit: 25 } }),
      );

      fireEvent.change(await screen.findByPlaceholderText('search'), {
        target: { value: 'abc' },
      });
      await settle();

      expect(lastFilter(service)).toMatchObject({
        searchText: 'abc',
        offset: 0,
        limit: 25,
      });
    });

    it('should show the searched text', async () => {
      await renderPage(createConfig({ search: true }));

      const input = await screen.findByPlaceholderText('search');
      fireEvent.change(input, { target: { value: 'abc' } });
      await settle();

      expect(input).toHaveValue('abc');
    });
  });

  describe('groups', () => {
    const groups = [
      { key: 'priority', value: '1', text: 'High priority' },
      { key: 'priority', value: '2', text: 'Low priority' },
    ];

    it('should render the groups with the list options', async () => {
      await renderPage(createConfig({ list: { groups } }));

      expect(await screen.findByTestId('group')).toHaveTextContent(
        'High priority, Low priority with list',
      );
    });

    it('should hide the flat list behind the groups', async () => {
      await renderPage(createConfig({ list: { groups } }));

      await screen.findByTestId('group');

      expect(
        screen.getByRole('table', { hidden: true }).closest('[hidden]'),
      ).not.toBeNull();
    });

    it('should show the flat list instead of the groups while searching', async () => {
      await renderPage(createConfig({ search: true, list: { groups } }));

      fireEvent.change(await screen.findByPlaceholderText('search'), {
        target: { value: 'abc' },
      });
      await settle();

      expect([
        screen.queryByTestId('group'),
        screen.getByRole('table').closest('[hidden]'),
      ]).toEqual([null, null]);
    });
  });

  describe('without groups', () => {
    it('should not wrap the list', async () => {
      await renderPage(createConfig());

      await screen.findByText('First note');

      expect(within(document.body).getByRole('table')).toBeVisible();
    });
  });
});
