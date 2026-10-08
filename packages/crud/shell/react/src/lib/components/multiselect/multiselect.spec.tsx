import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor,
} from '@testing-library/react';
import type { ReactNode } from 'react';

import { Field, FieldType, Model } from '@smartsoft001/models';
import {
  MenuService,
  SmartProvider,
  useMenuService,
} from '@smartsoft001/react';

import { SmartCrudMultiselect } from './multiselect';
import { useCrudMultiselect } from './use-crud-multiselect';
import { CrudConfig, CrudFullConfig } from '../../crud.config';
import { useCrudFacade } from '../../crud.context';
import { CrudProvider } from '../../crud.provider';
import { CrudFacade } from '../../state/crud.facade';

@Model({})
class TodoModel {
  id!: string;

  @Field({ type: FieldType.text, update: { multi: true } })
  status!: string;
}

class PlainModel {
  id!: string;
}

@Model({})
class RequiredModel {
  id!: string;

  @Field({ type: FieldType.text, required: true, update: { multi: true } })
  status!: string;
}

type TestConfig = CrudConfig<TodoModel> & Partial<CrudFullConfig<TodoModel>>;

const config: TestConfig = {
  apiUrl: '/api/todos',
  entity: 'todos-multiselect',
  type: TodoModel,
};

async function setup(
  selected: TodoModel[] = [{ id: '1' }, { id: '2' }] as TodoModel[],
  crudConfig: TestConfig = config,
) {
  let facade!: CrudFacade<TodoModel>;
  let menuService!: MenuService;
  const Grab = () => {
    facade = useCrudFacade();
    menuService = useMenuService();
    return null;
  };

  const view = render(
    <SmartProvider language="eng">
      <CrudProvider config={crudConfig}>
        <Grab />
        <SmartCrudMultiselect />
      </CrudProvider>
    </SmartProvider>,
  );
  await act(async () =>
    facade.store.set({ loaded: true, multiSelected: selected }),
  );

  return { facade, menuService, view };
}

describe('@smartsoft001/crud-shell-react: SmartCrudMultiselect', () => {
  it('should render the translated selected title with the count', async () => {
    await setup();

    expect(screen.getByRole('heading')).toHaveTextContent('selected: 2');
  });

  it('should close the end menu with the close button', async () => {
    const { menuService } = await setup();
    const closeEnd = jest.spyOn(menuService, 'closeEnd');

    fireEvent.click(screen.getByRole('button', { name: 'close' }));

    expect(closeEnd).toHaveBeenCalledTimes(1);
  });

  it('should show the form of the fields to change together', async () => {
    await setup();

    expect(await screen.findByLabelText(/MODEL\.status/)).toBeInTheDocument();
  });

  it('should not show a form for a model without such fields', async () => {
    await setup(undefined, { ...config, type: PlainModel });

    expect(
      screen.queryByRole('button', { name: 'change' }),
    ).not.toBeInTheDocument();
  });

  it('should fill in a value all the selected items share', async () => {
    await setup([
      { id: '1', status: 'open' },
      { id: '2', status: 'open' },
    ]);

    expect(await screen.findByLabelText(/MODEL\.status/)).toHaveValue('open');
  });

  it('should leave a value the selected items do not share empty', async () => {
    await setup([
      { id: '1', status: 'open' },
      { id: '2', status: 'done' },
    ]);

    expect(await screen.findByLabelText(/MODEL\.status/)).toHaveValue('');
  });

  it('should enable the change button once the valid form reported', async () => {
    await setup();

    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'change' })).toBeEnabled(),
    );
  });

  it('should keep the change button disabled while the form is invalid', async () => {
    await setup(undefined, { ...config, type: RequiredModel });

    await screen.findByLabelText(/MODEL\.status/);

    expect(screen.getByRole('button', { name: 'change' })).toBeDisabled();
  });

  it('should apply the changes to every selected item once confirmed', async () => {
    const { facade } = await setup();
    const updatePartialMany = jest
      .spyOn(facade, 'updatePartialMany')
      .mockImplementation(() => undefined);
    fireEvent.change(await screen.findByLabelText(/MODEL\.status/), {
      target: { value: 'done' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'change' }));
    await act(async () =>
      fireEvent.click(screen.getByRole('button', { name: 'confirm' })),
    );

    expect(updatePartialMany).toHaveBeenCalledWith([
      { status: 'done', id: '1' },
      { status: 'done', id: '2' },
    ]);
  });

  it('should close the end menu after applying the changes', async () => {
    const { facade, menuService } = await setup();
    jest.spyOn(facade, 'updatePartialMany').mockImplementation(() => undefined);
    const closeEnd = jest.spyOn(menuService, 'closeEnd');
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'change' })).toBeEnabled(),
    );

    fireEvent.click(screen.getByRole('button', { name: 'change' }));
    await act(async () =>
      fireEvent.click(screen.getByRole('button', { name: 'confirm' })),
    );

    expect(closeEnd).toHaveBeenCalledTimes(1);
  });

  it('should render the multi component of the list with the selected items', async () => {
    const Multi = ({ items }: { items: TodoModel[] }) => (
      <span data-testid="multi">{items.map((i) => i.id).join(',')}</span>
    );

    await setup(undefined, {
      ...config,
      type: PlainModel,
      list: { components: { multi: Multi } },
    });

    expect(screen.getByTestId('multi')).toHaveTextContent('1,2');
  });
});

describe('@smartsoft001/crud-shell-react: useCrudMultiselect', () => {
  function setupHook() {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <SmartProvider>
        <CrudProvider config={{ ...config, entity: 'todos-multiselect-hook' }}>
          {children}
        </CrudProvider>
      </SmartProvider>
    );
    const hook = renderHook(
      () => ({ multiselect: useCrudMultiselect(), facade: useCrudFacade() }),
      { wrapper },
    );
    act(() =>
      hook.result.current.facade.store.set({
        loaded: true,
        multiSelected: [{ id: '1' }],
      }),
    );

    return hook;
  }

  it('should unlock once the form reported its changes', () => {
    const { result } = setupHook();

    act(() =>
      result.current.multiselect.onPartialChange(
        {},
        result.current.multiselect.list,
      ),
    );

    expect(result.current.multiselect.lock).toBe(false);
  });

  it('should lock again when the selection changes', () => {
    const { result } = setupHook();
    act(() =>
      result.current.multiselect.onPartialChange(
        {},
        result.current.multiselect.list,
      ),
    );

    act(() => result.current.facade.multiSelect([{ id: '2' }] as TodoModel[]));

    expect(result.current.multiselect.lock).toBe(true);
  });

  it('should set valid from the form', () => {
    const { result } = setupHook();

    act(() => result.current.multiselect.onValidChange(true));

    expect(result.current.multiselect.valid).toBe(true);
  });
});
