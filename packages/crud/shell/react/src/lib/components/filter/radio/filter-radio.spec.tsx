import { act, fireEvent, render, screen } from '@testing-library/react';

import { IModelFilter } from '@smartsoft001/models';
import {
  IModelPossibilitiesProvider,
  SmartProvider,
  SmartProviderProps,
} from '@smartsoft001/react';

import { SmartCrudFilterRadio } from './filter-radio';
import { CrudProvider } from '../../../crud.provider';
import { useCrudState } from '../../../hooks';
import { ICrudFilter } from '../../../models';
import { CrudService } from '../../../services/crud/crud.service';

class TodoModel {
  status?: number;
}

const config = {
  apiUrl: '/api/todos',
  entity: 'todos-filter-radio',
  type: TodoModel,
};

const possibilities = [
  { id: 1, text: 'a' },
  { id: 2, text: 'b' },
];

const item: IModelFilter = {
  key: 'status',
  type: '=',
  label: 'status.label',
  possibilities: (() =>
    possibilities) as unknown as IModelFilter['possibilities'],
};

/** The filter field fed with the store's filter, as the filters panel does. */
function Connected({ initial }: { initial: ICrudFilter }) {
  const filter = useCrudState((state) => state.filter);

  return <SmartCrudFilterRadio item={item} filter={filter ?? initial} />;
}

function setup(
  initial: ICrudFilter = { query: [] },
  smart: Omit<SmartProviderProps, 'children'> = {},
) {
  const service = {
    getList: jest.fn(() => new Promise(() => undefined)),
  };
  const view = render(
    <SmartProvider {...smart}>
      <CrudProvider
        config={config}
        service={service as unknown as CrudService<any>}
      >
        <Connected initial={initial} />
      </CrudProvider>
    </SmartProvider>,
  );

  return { service, view };
}

describe('@smartsoft001/crud-shell-react: SmartCrudFilterRadio', () => {
  afterEach(() => jest.useRealTimers());

  it('should render one labelled radio input per possibility', () => {
    setup();

    expect(
      screen.getAllByRole('radio').map((radio) => radio.closest('label')),
    ).toEqual([
      screen.getByText('a').closest('label'),
      screen.getByText('b').closest('label'),
    ]);
  });

  it('should render the legend of the item key', () => {
    setup();

    expect(screen.getByRole('group', { name: 'MODEL.status' })).toBeVisible();
  });

  it('should check the radio of the current value', () => {
    setup({ query: [{ key: 'status', type: '=', value: 2 }] });

    expect(screen.getByRole('radio', { name: 'b' })).toBeChecked();
  });

  it('should read the list with the chosen id 500 ms later', () => {
    jest.useFakeTimers();
    const { service } = setup();

    fireEvent.click(screen.getByRole('radio', { name: 'b' }));
    act(() => jest.advanceTimersByTime(500));

    expect(service.getList).toHaveBeenCalledWith({
      offset: 0,
      query: [{ key: 'status', type: '=', value: 2, label: 'status.label' }],
    });
  });

  it('should render the possibilities of the model possibilities provider', async () => {
    const provider = {
      get: jest.fn(() => [{ id: 7, text: 'from provider', checked: false }]),
    } as unknown as IModelPossibilitiesProvider;

    setup({ query: [] }, { modelPossibilitiesProvider: provider });

    expect(
      await screen.findByRole('radio', { name: 'from provider' }),
    ).toBeInTheDocument();
  });

  it('should show the clear button when a matching query value is present', () => {
    setup({ query: [{ key: 'status', type: '=', value: 1 }] });

    expect(screen.getByRole('button', { name: 'clear' })).toBeInTheDocument();
  });

  it('should show the clear button for a false value', () => {
    setup({ query: [{ key: 'status', type: '=', value: false }] });

    expect(screen.getByRole('button', { name: 'clear' })).toBeInTheDocument();
  });

  it('should not show the clear button when no matching query value is present', () => {
    setup({ query: [] });

    expect(
      screen.queryByRole('button', { name: 'clear' }),
    ).not.toBeInTheDocument();
  });

  it('should remove the value when cleared', () => {
    jest.useFakeTimers();
    const { service } = setup({
      query: [{ key: 'status', type: '=', value: 1 }],
    });

    fireEvent.click(screen.getByRole('button', { name: 'clear' }));
    act(() => jest.advanceTimersByTime(500));

    expect(service.getList).toHaveBeenCalledWith({ offset: 0, query: [] });
  });

  it('should render the Angular host and row classes', () => {
    const { view } = setup();

    expect(view.container.firstElementChild).toHaveClass(
      'smart:mb-5',
      'smart:block',
      'smart:w-full',
    );
    expect(view.container.firstElementChild?.firstElementChild).toHaveClass(
      'smart:flex',
      'smart:w-full',
      'smart:items-start',
      'smart:gap-2',
    );
  });
});
