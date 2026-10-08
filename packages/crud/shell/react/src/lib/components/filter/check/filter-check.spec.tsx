import { act, fireEvent, render, screen } from '@testing-library/react';

import { FieldType, IModelFilter } from '@smartsoft001/models';
import { SmartProvider } from '@smartsoft001/react';

import { SmartCrudFilterCheck } from './filter-check';
import { CrudProvider } from '../../../crud.provider';
import { useCrudState } from '../../../hooks';
import { ICrudFilter } from '../../../models';
import { CrudService } from '../../../services/crud/crud.service';

class TodoModel {
  status?: number;
}

const config = {
  apiUrl: '/api/todos',
  entity: 'todos-filter-check',
  type: TodoModel,
};

const translations = {
  'status.label': 'Status',
  'status.a': 'Open',
  'status.b': 'Closed',
};

function buildItem(withPossibilities = true): IModelFilter {
  return {
    key: 'status',
    type: '=',
    fieldType: FieldType.check,
    label: 'status.label',
    possibilities: withPossibilities
      ? ((() => [
          { id: 1, text: 'status.a' },
          { id: 2, text: 'status.b' },
        ]) as unknown as IModelFilter['possibilities'])
      : undefined,
  };
}

function buildFilter(values: number[]): ICrudFilter {
  return {
    query: values.map((value) => ({ key: 'status', type: '=', value })),
  };
}

/** The filter field fed with the store's filter, as the filters panel does. */
function Connected({
  item,
  initial,
}: {
  item: IModelFilter;
  initial: ICrudFilter;
}) {
  const filter = useCrudState((state) => state.filter);

  return <SmartCrudFilterCheck item={item} filter={filter ?? initial} />;
}

function setup(initial: ICrudFilter = buildFilter([]), item = buildItem()) {
  const service = {
    getList: jest.fn(() => new Promise(() => undefined)),
  };
  const view = render(
    <SmartProvider translations={translations}>
      <CrudProvider
        config={config}
        service={service as unknown as CrudService<any>}
      >
        <Connected item={item} initial={initial} />
      </CrudProvider>
    </SmartProvider>,
  );

  return { service, view };
}

describe('@smartsoft001/crud-shell-react: SmartCrudFilterCheck', () => {
  afterEach(() => jest.useRealTimers());

  it('should render the translated item label as the legend', () => {
    setup();

    expect(screen.getByRole('group', { name: 'Status' })).toBeVisible();
  });

  it('should render one translated checkbox label per possibility', () => {
    setup();

    expect(
      screen.getAllByRole('checkbox').map((box) => box.closest('label')),
    ).toEqual([
      screen.getByText('Open').closest('label'),
      screen.getByText('Closed').closest('label'),
    ]);
  });

  it('should render an empty list when no possibilities are available', () => {
    setup(buildFilter([]), buildItem(false));

    expect(screen.queryAllByRole('checkbox')).toHaveLength(0);
  });

  it('should mark only the checkbox whose id is in the value array as checked', () => {
    setup(buildFilter([1]));

    expect(
      screen
        .getAllByRole('checkbox')
        .map((box) => (box as HTMLInputElement).checked),
    ).toEqual([true, false]);
  });

  it('should mark every entry unchecked when the filter has no query', () => {
    setup({});

    expect(
      screen
        .getAllByRole('checkbox')
        .map((box) => (box as HTMLInputElement).checked),
    ).toEqual([false, false]);
  });

  it('should keep the clicked checkbox checked while the read is debounced', () => {
    jest.useFakeTimers();
    setup();

    fireEvent.click(screen.getByRole('checkbox', { name: 'Open' }));

    expect(screen.getByRole('checkbox', { name: 'Open' })).toBeChecked();
  });

  it('should read the list with [id] when toggled on from a null value', () => {
    jest.useFakeTimers();
    const { service } = setup({});

    fireEvent.click(screen.getByRole('checkbox', { name: 'Open' }));
    act(() => jest.advanceTimersByTime(500));

    expect(service.getList).toHaveBeenCalledWith({
      offset: 0,
      query: [{ key: 'status', type: '=', value: 1 }],
    });
  });

  it('should add the toggled id to the checked ones', () => {
    jest.useFakeTimers();
    const { service } = setup(buildFilter([1]));

    fireEvent.click(screen.getByRole('checkbox', { name: 'Closed' }));
    act(() => jest.advanceTimersByTime(500));

    expect(service.getList).toHaveBeenCalledWith({
      offset: 0,
      query: [
        { key: 'status', type: '=', value: 1 },
        { key: 'status', type: '=', value: 2 },
      ],
    });
  });

  it('should remove the id toggled off', () => {
    jest.useFakeTimers();
    const { service } = setup(buildFilter([1, 2]));

    fireEvent.click(screen.getByRole('checkbox', { name: 'Open' }));
    act(() => jest.advanceTimersByTime(500));

    expect(service.getList).toHaveBeenCalledWith({
      offset: 0,
      query: [{ key: 'status', type: '=', value: 2 }],
    });
    expect(screen.getByRole('checkbox', { name: 'Open' })).not.toBeChecked();
  });

  it('should show the clear-all button when the value array is non-empty', () => {
    setup(buildFilter([1]));

    expect(screen.getByRole('button', { name: 'clear' })).toBeInTheDocument();
  });

  it('should not show the clear-all button when the value array is empty', () => {
    setup(buildFilter([]));

    expect(
      screen.queryByRole('button', { name: 'clear' }),
    ).not.toBeInTheDocument();
  });

  it('should uncheck everything when cleared', () => {
    jest.useFakeTimers();
    const { service } = setup(buildFilter([1, 2]));

    fireEvent.click(screen.getByRole('button', { name: 'clear' }));
    act(() => jest.advanceTimersByTime(500));

    expect(service.getList).toHaveBeenCalledWith({ offset: 0, query: [] });
    expect(
      screen
        .getAllByRole('checkbox')
        .map((box) => (box as HTMLInputElement).checked),
    ).toEqual([false, false]);
  });

  it('should render the Angular host and fieldset classes', () => {
    const { view } = setup();

    expect(view.container.firstElementChild).toHaveClass(
      'smart:block',
      'smart:w-full',
    );
    expect(view.container.firstElementChild?.firstElementChild).toHaveClass(
      'smart:w-full',
    );
  });
});
