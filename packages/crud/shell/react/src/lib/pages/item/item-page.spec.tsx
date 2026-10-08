import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import type { ComponentType } from 'react';

import { IEntity } from '@smartsoft001/domain-core';
import { Field, FieldType, Model } from '@smartsoft001/models';
import {
  AuthService,
  FormFactory,
  ISmartNavigation,
  SmartFormArray,
  SmartFormControl,
  SmartFormGroup,
  SmartPageVariantProps,
  SmartProvider,
  SmartValidators,
  StorageService,
  ToastService,
} from '@smartsoft001/react';

import { SmartCrudItemPage } from './item-page';
import { SmartCrudItemPageBodyProps } from './item-page.types';
import { CrudFullConfig } from '../../crud.config';
import { CrudProvider } from '../../crud.provider';
import { ICrudFilter } from '../../models';
import { CrudService } from '../../services/crud/crud.service';

const ENTITY = 'item-page-articles';

@Model({ titleKey: 'title' })
class ItemPageArticle implements IEntity<string> {
  id!: string;

  @Field({
    type: FieldType.text,
    create: { required: true },
    update: true,
    details: true,
  })
  title!: string;
}

@Model({
  titleKey: 'title',
  update: { enabled: { criteria: { locked: false } } },
})
class LockableItemPageArticle implements IEntity<string> {
  id!: string;

  @Field({ type: FieldType.text, update: true, details: true })
  title!: string;

  locked!: boolean;
}

@Model({ update: { permissions: ['admin'] } })
class GuardedItemPageArticle implements IEntity<string> {
  id!: string;

  @Field({ type: FieldType.text, update: true, details: true })
  title!: string;
}

const ARTICLE = { id: '123', title: 'Old title', locked: false };

function createConfig(
  partial: Partial<CrudFullConfig<any>> = {},
): CrudFullConfig<any> {
  return {
    apiUrl: '/api/item-page-articles',
    entity: ENTITY,
    type: ItemPageArticle,
    title: 'Articles',
    ...partial,
  };
}

function createService(item: Record<string, unknown> = ARTICLE) {
  return {
    getList: jest.fn<
      Promise<{ data: unknown[]; totalCount: number; links: unknown }>,
      [ICrudFilter?]
    >(async () => ({
      data: [],
      totalCount: 0,
      links: {},
    })),
    getById: jest.fn(async (id: string) => ({ ...item, id })),
    create: jest.fn(async () => '1'),
    createMany: jest.fn(async () => undefined),
    update: jest.fn(async () => undefined),
    updatePartial: jest.fn(async () => undefined),
    updatePartialMany: jest.fn(async () => []),
    delete: jest.fn(async () => undefined),
    exportList: jest.fn(async () => undefined),
  };
}

function createNavigation(url: string) {
  const listeners = new Set<(next: string) => void>();
  let current = url;
  const navigation: ISmartNavigation & {
    navigate: jest.Mock;
    back: jest.Mock;
  } = {
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

interface RenderOptions {
  id?: string;
  basePath?: string;
  url?: string;
  item?: Record<string, unknown>;
  components?: Record<string, ComponentType<any>>;
  authService?: AuthService;
  /** Let the requests and the form build settle (default `true`). */
  settle?: boolean;
}

/** Lets the pending requests and form builds settle. */
const settle = () =>
  act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
  });

async function renderPage(
  config: CrudFullConfig<any>,
  options: RenderOptions = {},
) {
  const navigation = createNavigation(
    options.url ?? '/articles/' + (options.id ?? 'add'),
  );
  const service = createService(options.item);
  const toastService = new ToastService();
  const info = jest.spyOn(toastService, 'info');

  const tree = (id?: string) => (
    <SmartProvider
      language="eng"
      navigation={navigation}
      toastService={toastService}
      components={options.components}
      authService={options.authService}
    >
      <CrudProvider
        config={config}
        service={service as unknown as CrudService<any>}
      >
        <SmartCrudItemPage id={id} basePath={options.basePath} />
      </CrudProvider>
    </SmartProvider>
  );

  const view = render(tree(options.id));

  if (options.settle !== false) await settle();

  const rerender = async (id?: string) => {
    view.rerender(tree(id));
    await settle();
  };

  return { ...view, rerender, navigation, service, info };
}

/** Records the options the page variant got. */
function createPageProbe() {
  const probe = jest.fn();
  const PageProbe = (props: SmartPageVariantProps) => {
    probe(props);

    return <div data-testid="page">{props.options?.bodyTpl}</div>;
  };

  return {
    PageProbe,
    last: (): SmartPageVariantProps =>
      probe.mock.calls[probe.mock.calls.length - 1][0],
  };
}

/** A body registered for `crud-item-page`, recording its props. */
function createBodyProbe(
  onRender?: (props: SmartCrudItemPageBodyProps) => void,
) {
  let current: SmartCrudItemPageBodyProps | null = null;
  const Body = (props: SmartCrudItemPageBodyProps) => {
    current = props;
    onRender?.(props);

    return <p className="custom-item-body">custom body {props.mode}</p>;
  };

  return { Body, get: () => current as SmartCrudItemPageBodyProps };
}

const titleInput = () => screen.findByLabelText(/MODEL\.title/);

describe('@smartsoft001/crud-shell-react: SmartCrudItemPage', () => {
  describe('page options', () => {
    it('should thread config.variant into the page options', async () => {
      const { PageProbe, last } = createPageProbe();

      await renderPage(createConfig({ variant: 'standard', add: true }), {
        components: { page: PageProbe },
      });

      expect(last().options?.variant).toBe('standard');
    });

    it('should preserve the back button and hide the menu button alongside the variant', async () => {
      const { PageProbe, last } = createPageProbe();

      await renderPage(createConfig({ variant: 'standard', add: true }), {
        components: { page: PageProbe },
      });

      expect([
        last().options?.showBackButton,
        last().options?.hideMenuButton,
      ]).toEqual([true, true]);
    });

    it('should leave the variant undefined when config has no variant', async () => {
      const { PageProbe, last } = createPageProbe();

      await renderPage(createConfig({ add: true }), {
        components: { page: PageProbe },
      });

      expect(last().options?.variant).toBeUndefined();
    });

    it('should pass config.className to the page', async () => {
      const { PageProbe, last } = createPageProbe();

      await renderPage(createConfig({ className: 'smart:bg-slate-50' }), {
        components: { page: PageProbe },
      });

      expect(last().className).toBe('smart:bg-slate-50');
    });

    it('should go back with the back button', async () => {
      const { container, navigation } = await renderPage(createConfig());

      fireEvent.click(container.querySelector('button') as HTMLElement);

      expect(navigation.back).toHaveBeenCalled();
    });
  });

  describe('create mode', () => {
    it('should render the page wrapper and the add title without an id', async () => {
      await renderPage(createConfig({ add: true }));

      expect(screen.getByRole('heading', { name: 'add' })).toBeInTheDocument();
    });

    it('should render the create form', async () => {
      await renderPage(createConfig({ add: true }));

      expect(await titleInput()).toHaveValue('');
    });

    it('should build the create form once', async () => {
      const create = jest.spyOn(FormFactory.prototype, 'create');

      await renderPage(createConfig({ add: true }));
      await titleInput();

      expect(create).toHaveBeenCalledTimes(1);
      create.mockRestore();
    });

    it('should create the record with the value typed into the input', async () => {
      const { service } = await renderPage(createConfig({ add: true }));

      fireEvent.change(await titleInput(), { target: { value: 'Alpha' } });
      fireEvent.click(screen.getByRole('button', { name: 'add' }));

      await waitFor(() =>
        expect(service.create).toHaveBeenCalledWith(
          expect.objectContaining({ title: 'Alpha' }),
        ),
      );
    });

    it('should go back after creating without a basePath', async () => {
      const { navigation } = await renderPage(createConfig({ add: true }));

      fireEvent.change(await titleInput(), { target: { value: 'Alpha' } });
      fireEvent.click(screen.getByRole('button', { name: 'add' }));

      expect(navigation.back).toHaveBeenCalled();
    });

    it('should navigate to the list after creating with a basePath', async () => {
      const { navigation } = await renderPage(createConfig({ add: true }), {
        basePath: '/articles',
      });

      fireEvent.change(await titleInput(), { target: { value: 'Alpha' } });
      fireEvent.click(screen.getByRole('button', { name: 'add' }));

      expect(navigation.navigate).toHaveBeenCalledWith('/articles');
    });

    it('should report the invalid controls instead of creating when the form is invalid', async () => {
      const { service, info } = await renderPage(createConfig({ add: true }));

      await titleInput();
      fireEvent.click(screen.getByRole('button', { name: 'add' }));

      expect([
        service.create.mock.calls.length,
        info.mock.calls[0][0].title,
        info.mock.calls[0][0].message,
      ]).toEqual([0, 'fields are required', ' > MODEL.title']);
    });

    it('should not create before the form is built', async () => {
      const { service } = await renderPage(createConfig({ add: true }), {
        settle: false,
      });

      fireEvent.click(screen.getByRole('button', { name: 'add' }));
      await settle();

      expect(service.create).not.toHaveBeenCalled();
    });

    it('should render the add components above and below the body', async () => {
      const Top = () => <p>add top</p>;
      const Bottom = () => <p>add bottom</p>;

      await renderPage(
        createConfig({ add: { components: { top: Top, bottom: Bottom } } }),
      );

      expect([
        screen.getByText('add top').parentElement,
        screen.getByText('add bottom').parentElement,
      ]).toEqual([
        expect.objectContaining({ className: 'text-xl py-2.5 separator' }),
        expect.objectContaining({ className: 'text-xl py-2.5 separator' }),
      ]);
    });

    it('should not select an item', async () => {
      const { service } = await renderPage(createConfig({ add: true }));

      expect(service.getById).not.toHaveBeenCalled();
    });
  });

  describe('details mode', () => {
    it('should select the item of the id', async () => {
      const { service } = await renderPage(createConfig({ details: true }), {
        id: '123',
      });

      expect(service.getById).toHaveBeenCalledWith('123');
    });

    it('should render the details of the selected item', async () => {
      await renderPage(createConfig({ details: true }), { id: '123' });

      expect(await screen.findByText('Old title')).toBeInTheDocument();
    });

    it('should title the page with the item title', async () => {
      await renderPage(createConfig({ details: true }), { id: '123' });

      expect(
        await screen.findByRole('heading', { name: 'Old title - details' }),
      ).toBeInTheDocument();
    });

    it('should title the page with the first paragraph of an HTML title', async () => {
      await renderPage(createConfig({ details: true }), {
        id: '123',
        item: { title: '<p>Rich</p><p>rest</p>' },
      });

      expect(
        await screen.findByRole('heading', { name: 'Rich - details' }),
      ).toBeInTheDocument();
    });

    it('should not offer the edit without config.edit', async () => {
      await renderPage(createConfig({ details: true }), { id: '123' });

      await screen.findByText('Old title');

      expect(
        screen.queryByRole('button', { name: 'edit' }),
      ).not.toBeInTheDocument();
    });

    it('should not offer the edit of an item the model does not allow to update', async () => {
      await renderPage(
        createConfig({
          type: LockableItemPageArticle,
          details: true,
          edit: true,
        }),
        { id: '123', item: { ...ARTICLE, locked: true } },
      );

      await screen.findByText('Old title');

      expect(
        screen.queryByRole('button', { name: 'edit' }),
      ).not.toBeInTheDocument();
    });

    it('should not offer the edit without the update permission', async () => {
      const authService = new AuthService(new StorageService());
      jest.spyOn(authService, 'expectPermissions').mockReturnValue(false);

      await renderPage(
        createConfig({
          type: GuardedItemPageArticle,
          details: true,
          edit: true,
        }),
        { id: '123', authService },
      );
      await screen.findByText('Old title');

      expect(
        screen.queryByRole('button', { name: 'edit' }),
      ).not.toBeInTheDocument();
    });

    it('should switch to the edit form', async () => {
      await renderPage(createConfig({ details: true, edit: true }), {
        id: '123',
      });

      fireEvent.click(await screen.findByRole('button', { name: 'edit' }));

      expect(await titleInput()).toHaveValue('Old title');
    });

    it('should title the edit with the item title', async () => {
      await renderPage(createConfig({ details: true, edit: true }), {
        id: '123',
      });

      fireEvent.click(await screen.findByRole('button', { name: 'edit' }));
      await settle();

      expect(
        screen.getByRole('heading', { name: 'Old title - change' }),
      ).toBeInTheDocument();
    });

    it('should go back to the details on cancel', async () => {
      await renderPage(createConfig({ details: true, edit: true }), {
        id: '123',
      });

      fireEvent.click(await screen.findByRole('button', { name: 'edit' }));
      await titleInput();
      fireEvent.click(screen.getByRole('button', { name: 'cancel' }));

      expect(
        screen.getByRole('heading', { name: 'Old title - details' }),
      ).toBeInTheDocument();
    });

    it('should save a partial update and show the details again', async () => {
      const { service, navigation } = await renderPage(
        createConfig({ details: true, edit: true }),
        { id: '123', basePath: '/articles' },
      );

      fireEvent.click(await screen.findByRole('button', { name: 'edit' }));
      fireEvent.change(await titleInput(), { target: { value: 'New' } });
      fireEvent.click(screen.getByRole('button', { name: 'save' }));

      await waitFor(() =>
        expect(service.updatePartial).toHaveBeenCalledWith({
          title: 'New',
          id: '123',
        }),
      );
      await settle();
      expect([
        screen.getByRole('button', { name: 'edit' }),
        navigation.navigate.mock.calls.length,
      ]).toEqual([expect.anything(), 0]);
    });

    it('should open the edit form with the edit query param', async () => {
      await renderPage(createConfig({ details: true, edit: true }), {
        id: '123',
        url: '/articles/123?edit=1',
      });

      expect(await titleInput()).toHaveValue('Old title');
    });

    it('should hand the details options to the body', async () => {
      const { Body, get } = createBodyProbe();
      const Top = () => null;
      const Bottom = () => null;
      const cellPipe = { transform: () => '' };

      await renderPage(
        createConfig({
          details: { cellPipe, components: { top: Top, bottom: Bottom } },
        }),
        { id: '123', components: { 'crud-item-page': Body } },
      );

      expect(get().detailsOptions).toMatchObject({
        type: ItemPageArticle,
        cellPipe,
        componentFactories: { top: Top, bottom: Bottom },
      });
    });

    it('should select the item of a new id', async () => {
      const { rerender, service } = await renderPage(
        createConfig({ details: true }),
        {
          id: '123',
        },
      );

      await rerender('456');

      expect(service.getById).toHaveBeenLastCalledWith('456');
    });
  });

  describe('update mode', () => {
    it('should start with the form without details', async () => {
      await renderPage(createConfig({ edit: true }), { id: '123' });

      await waitFor(async () =>
        expect(await titleInput()).toHaveValue('Old title'),
      );
    });

    it('should send a partial update carrying the id and go back', async () => {
      const { service, navigation } = await renderPage(
        createConfig({ edit: true }),
        {
          id: '123',
        },
      );

      await waitFor(async () =>
        expect(await titleInput()).toHaveValue('Old title'),
      );
      fireEvent.change(await titleInput(), { target: { value: 'New' } });
      fireEvent.click(screen.getByRole('button', { name: 'save' }));

      await waitFor(() =>
        expect(service.updatePartial).toHaveBeenCalledWith({
          title: 'New',
          id: '123',
        }),
      );
      await settle();
      expect(navigation.back).toHaveBeenCalled();
    });

    it('should not offer cancel without details', async () => {
      await renderPage(createConfig({ edit: true }), { id: '123' });

      await titleInput();

      expect(
        screen.queryByRole('button', { name: 'cancel' }),
      ).not.toBeInTheDocument();
    });

    it('should render the edit components only while editing', async () => {
      const Top = () => <p>edit top</p>;

      await renderPage(
        createConfig({ details: true, edit: { components: { top: Top } } }),
        { id: '123' },
      );
      await screen.findByText('Old title');
      const before = screen.queryByText('edit top');
      fireEvent.click(screen.getByRole('button', { name: 'edit' }));
      await settle();

      expect([before, screen.getByText('edit top')]).toEqual([
        null,
        expect.anything(),
      ]);
    });
  });

  describe('crud-item-page extension point', () => {
    it('should render a body registered for the crud-item-page key', async () => {
      const { Body } = createBodyProbe();

      const { container } = await renderPage(createConfig({ add: true }), {
        components: { 'crud-item-page': Body },
      });

      expect(
        container.querySelector('.dynamic-content .custom-item-body'),
      ).toHaveTextContent('custom body create');
    });

    it('should create the value the body reports with the form it registered', async () => {
      const form = new SmartFormGroup({ title: new SmartFormControl('X') });
      const { Body, get } = createBodyProbe((props) => {
        if (props.formRef) props.formRef.current = form;
      });

      const { service } = await renderPage(createConfig({ add: true }), {
        components: { 'crud-item-page': Body },
      });
      act(() => get().onChange?.({ title: 'X' }));
      fireEvent.click(screen.getByRole('button', { name: 'add' }));

      expect(service.create).toHaveBeenCalledWith({ title: 'X' });
    });

    it('should list the invalid nested controls, three at most', async () => {
      const required = SmartValidators.required;
      const form = new SmartFormGroup({
        address: new SmartFormGroup({
          shelf: new SmartFormControl('', required),
        }),
        tags: new SmartFormArray([new SmartFormControl('', required)]),
        code: new SmartFormControl('', () => ({ customMessage: 'too short' })),
        extra: new SmartFormControl('', required),
      });
      const { Body } = createBodyProbe((props) => {
        if (props.formRef) props.formRef.current = form;
      });

      const { info } = await renderPage(createConfig({ add: true }), {
        components: { 'crud-item-page': Body },
      });
      fireEvent.click(screen.getByRole('button', { name: 'add' }));

      expect(info.mock.calls[0][0].message).toBe(
        [
          ' > MODEL.address > MODEL.shelf',
          ' > MODEL.tags(1)',
          ' > MODEL.code (too short)',
        ].join('<br/>'),
      );
    });

    it('should check the uniqueness against the other items', async () => {
      const { Body, get } = createBodyProbe();

      const { service } = await renderPage(createConfig({ edit: true }), {
        id: '123',
        components: { 'crud-item-page': Body },
      });
      const unique = await get().uniqueProvider?.({ title: 'Taken' } as never);

      expect([unique, service.getList.mock.calls[0][0]]).toEqual([
        true,
        {
          query: [
            { key: 'title', value: 'Taken', type: '=' },
            { key: 'id', value: '123', type: '!=' },
          ],
        },
      ]);
    });

    it('should keep the unique provider between renders', async () => {
      const { Body, get } = createBodyProbe();

      await renderPage(createConfig({ details: true, edit: true }), {
        id: '123',
        components: { 'crud-item-page': Body },
      });
      const first = get().uniqueProvider;
      await waitFor(() => expect(get().detailsOptions?.item).toBeTruthy());

      expect(get().uniqueProvider).toBe(first);
    });
  });
});
