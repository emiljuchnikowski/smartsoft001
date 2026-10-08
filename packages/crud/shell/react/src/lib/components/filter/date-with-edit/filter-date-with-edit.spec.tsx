import { act, fireEvent, render, screen } from '@testing-library/react';

import { IModelFilter } from '@smartsoft001/models';
import { SmartProvider } from '@smartsoft001/react';

import { SmartCrudFilterDateWithEdit } from './filter-date-with-edit';
import { CrudProvider } from '../../../crud.provider';
import { useCrudState } from '../../../hooks';
import { ICrudFilter } from '../../../models';
import { CrudService } from '../../../services/crud/crud.service';

class TodoModel {
  date?: string;
}

const config = {
  apiUrl: '/api/todos',
  entity: 'todos-filter-date-with-edit',
  type: TodoModel,
};

function buildItem(type: IModelFilter['type'] = '='): IModelFilter {
  return { key: 'date', type, label: 'date.label' };
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

  return <SmartCrudFilterDateWithEdit item={item} filter={filter ?? initial} />;
}

function setup(initial: ICrudFilter = { query: [] }, item = buildItem()) {
  const service = {
    getList: jest.fn(() => new Promise(() => undefined)),
  };
  const view = render(
    <SmartProvider language="eng" translations={{ 'date.label': 'Date' }}>
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

/** The digit inputs of every date editor rendered (eight per editor). */
function digits(container: HTMLElement): HTMLInputElement[] {
  return Array.from(container.querySelectorAll('input[type="number"]'));
}

describe('@smartsoft001/crud-shell-react: SmartCrudFilterDateWithEdit', () => {
  afterEach(() => jest.useRealTimers());

  it('should render the translated item label and the primary date editor', () => {
    const { view } = setup();

    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(digits(view.container)).toHaveLength(8);
  });

  it('should read the list with the edited date 500 ms later', () => {
    jest.useFakeTimers();
    const { service, view } = setup({
      query: [{ key: 'date', type: '=', value: '2024-03-15' }],
    });

    fireEvent.change(digits(view.container)[1], { target: { value: '6' } });
    act(() => jest.advanceTimersByTime(500));

    expect(service.getList).toHaveBeenCalledWith({
      offset: 0,
      query: [
        { key: 'date', type: '=', value: '2024-03-16', label: 'date.label' },
      ],
    });
  });

  it('should replace the primary editor with the from/to range editors when advanced is toggled on', () => {
    const { view } = setup();

    fireEvent.click(screen.getByRole('button', { name: 'advanced' }));

    expect(digits(view.container)).toHaveLength(16);
    expect([screen.getByText('from'), screen.getByText('to')]).toHaveLength(2);
  });

  it('should keep the advanced button above the range when toggled on', () => {
    setup();

    fireEvent.click(screen.getByRole('button', { name: 'advanced' }));

    expect(screen.getByRole('button', { name: 'advanced' })).toHaveClass(
      'smart:mb-2',
    );
  });

  it('should bring the primary editor back when advanced is toggled off', () => {
    const { view } = setup();
    fireEvent.click(screen.getByRole('button', { name: 'advanced' }));

    fireEvent.click(screen.getByRole('button', { name: 'advanced' }));

    expect(digits(view.container)).toHaveLength(8);
  });

  it('should remove the value when advanced is toggled on', () => {
    jest.useFakeTimers();
    const { service } = setup({
      query: [{ key: 'date', type: '=', value: '2024-03-15' }],
    });

    fireEvent.click(screen.getByRole('button', { name: 'advanced' }));
    act(() => jest.advanceTimersByTime(500));

    expect(service.getList).toHaveBeenCalledWith({ offset: 0, query: [] });
  });

  it('should read the list with the edited "from" date 500 ms later', () => {
    jest.useFakeTimers();
    const { service, view } = setup({
      query: [{ key: 'date', type: '>=', value: '2024-03-15' }],
    });

    fireEvent.change(digits(view.container)[9], { target: { value: '6' } });
    act(() => jest.advanceTimersByTime(500));

    expect(service.getList).toHaveBeenCalledWith({
      offset: 0,
      query: [
        { key: 'date', type: '>=', value: '2024-03-16', label: 'date.label' },
      ],
    });
  });

  it('should show the range editors next to the primary one while a range value is set', () => {
    const { view } = setup({
      query: [{ key: 'date', type: '<=', value: '2024-03-20' }],
    });

    expect(digits(view.container)).toHaveLength(24);
  });

  it('should not offer the advanced range for an item type other than "="', () => {
    const { view } = setup(
      { query: [{ key: 'date', type: '>=', value: '2024-03-15' }] },
      buildItem('>='),
    );

    expect(
      screen.queryByRole('button', { name: 'advanced' }),
    ).not.toBeInTheDocument();
    expect(digits(view.container)).toHaveLength(8);
  });

  it('should show the clear button when a matching query value is present', () => {
    setup({ query: [{ key: 'date', type: '=', value: '2024-03-15' }] });

    expect(screen.getByRole('button', { name: 'clear' })).toBeInTheDocument();
  });

  it('should not show any clear button without a value', () => {
    setup({ query: [] });

    expect(
      screen.queryByRole('button', { name: /clear/ }),
    ).not.toBeInTheDocument();
  });

  it('should remove the value when cleared', () => {
    jest.useFakeTimers();
    const { service } = setup({
      query: [{ key: 'date', type: '=', value: '2024-03-15' }],
    });

    fireEvent.click(screen.getByRole('button', { name: 'clear' }));
    act(() => jest.advanceTimersByTime(500));

    expect(service.getList).toHaveBeenCalledWith({ offset: 0, query: [] });
  });

  it.each([
    ['clear-from', { key: 'date', type: '<=', value: '2024-03-20' }],
    ['clear-to', { key: 'date', type: '>=', value: '2024-03-15' }],
  ])('should remove the range value of %s', (label, remaining) => {
    jest.useFakeTimers();
    const { service } = setup({
      query: [
        { key: 'date', type: '>=', value: '2024-03-15' },
        { key: 'date', type: '<=', value: '2024-03-20' },
      ],
    });

    fireEvent.click(screen.getByRole('button', { name: label }));
    act(() => jest.advanceTimersByTime(500));

    expect(service.getList).toHaveBeenCalledWith({
      offset: 0,
      query: [remaining],
    });
  });

  it('should render the Angular host classes', () => {
    const { view } = setup();

    expect(view.container.firstElementChild).toHaveClass(
      'smart:block',
      'smart:w-full',
    );
  });
});
