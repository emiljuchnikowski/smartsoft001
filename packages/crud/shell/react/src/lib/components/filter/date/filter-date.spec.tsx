import { act, fireEvent, render, screen } from '@testing-library/react';

import { IModelFilter } from '@smartsoft001/models';
import { SmartProvider } from '@smartsoft001/react';

import { SmartCrudFilterDate } from './filter-date';
import { CrudProvider } from '../../../crud.provider';
import { useCrudState } from '../../../hooks';
import { ICrudFilter } from '../../../models';
import { CrudService } from '../../../services/crud/crud.service';

class TodoModel {
  date?: string;
}

const config = {
  apiUrl: '/api/todos',
  entity: 'todos-filter-date',
  type: TodoModel,
};

const item: IModelFilter = { key: 'date', type: '=', label: 'date.label' };

/** The filter field fed with the store's filter, as the filters panel does. */
function Connected({ initial }: { initial: ICrudFilter }) {
  const filter = useCrudState((state) => state.filter);

  return <SmartCrudFilterDate item={item} filter={filter ?? initial} />;
}

function setup(initial: ICrudFilter = { query: [] }) {
  const service = {
    getList: jest.fn(() => new Promise(() => undefined)),
  };
  const view = render(
    <SmartProvider translations={{ 'date.label': 'Date' }}>
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

/** The eight digit inputs of the date editor: DD MM RRRR. */
function digits(container: HTMLElement): HTMLInputElement[] {
  return Array.from(container.querySelectorAll('input[type="number"]'));
}

describe('@smartsoft001/crud-shell-react: SmartCrudFilterDate', () => {
  afterEach(() => jest.useRealTimers());

  it('should render the translated item label', () => {
    setup();

    expect(screen.getByText('Date')).toHaveClass(
      'smart:mb-1',
      'smart:block',
      'smart:text-sm',
      'smart:font-medium',
    );
  });

  it('should render an empty date editor without a value', () => {
    const { view } = setup();

    expect(digits(view.container).map((input) => input.value)).toEqual(
      Array(8).fill(''),
    );
  });

  it('should show the current value in the date editor', () => {
    const { view } = setup({
      query: [{ key: 'date', type: '=', value: '2024-03-15' }],
    });

    expect(digits(view.container).map((input) => input.value)).toEqual([
      '1',
      '5',
      '0',
      '3',
      '2',
      '0',
      '2',
      '4',
    ]);
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

  it('should keep the edited date in the editor while the read is debounced', () => {
    jest.useFakeTimers();
    const { view } = setup({
      query: [{ key: 'date', type: '=', value: '2024-03-15' }],
    });

    fireEvent.change(digits(view.container)[1], { target: { value: '6' } });

    expect(digits(view.container)[1]).toHaveValue(6);
  });

  it('should show the clear button when a matching query value is present', () => {
    setup({ query: [{ key: 'date', type: '=', value: '2024-03-15' }] });

    expect(screen.getByRole('button', { name: 'clear' })).toBeInTheDocument();
  });

  it('should not show the clear button when no matching query value is present', () => {
    setup({ query: [] });

    expect(
      screen.queryByRole('button', { name: 'clear' }),
    ).not.toBeInTheDocument();
  });

  it('should remove the value and empty the editor when cleared', () => {
    jest.useFakeTimers();
    const { service, view } = setup({
      query: [{ key: 'date', type: '=', value: '2024-03-15' }],
    });

    fireEvent.click(screen.getByRole('button', { name: 'clear' }));
    act(() => jest.advanceTimersByTime(500));

    expect(service.getList).toHaveBeenCalledWith({ offset: 0, query: [] });
    expect(digits(view.container).map((input) => input.value)).toEqual(
      Array(8).fill(''),
    );
  });

  it('should render the root and row classes', () => {
    const { view } = setup();

    expect(view.container.firstElementChild).toHaveClass(
      'smart:block',
      'smart:w-full',
    );
    expect(view.container.firstElementChild?.children[1]).toHaveClass(
      'smart:flex',
      'smart:w-full',
      'smart:items-end',
      'smart:gap-2',
    );
  });
});
