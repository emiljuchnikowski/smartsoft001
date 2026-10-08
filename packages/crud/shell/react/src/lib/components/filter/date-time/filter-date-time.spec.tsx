import { act, fireEvent, render, screen } from '@testing-library/react';

import { IModelFilter } from '@smartsoft001/models';
import { SmartProvider } from '@smartsoft001/react';

import { SmartCrudFilterDateTime } from './filter-date-time';
import { CrudProvider } from '../../../crud.provider';
import { useCrudState } from '../../../hooks';
import { ICrudFilter } from '../../../models';
import { CrudService } from '../../../services/crud/crud.service';

class TodoModel {
  date?: string;
}

const config = {
  apiUrl: '/api/todos',
  entity: 'todos-filter-date-time',
  type: TodoModel,
};

const item: IModelFilter = { key: 'date', type: '=', label: 'date.label' };

/** The filter field fed with the store's filter, as the filters panel does. */
function Connected({ initial }: { initial: ICrudFilter }) {
  const filter = useCrudState((state) => state.filter);

  return <SmartCrudFilterDateTime item={item} filter={filter ?? initial} />;
}

function setup(initial: ICrudFilter = { query: [] }) {
  const service = {
    getList: jest.fn(() => new Promise(() => undefined)),
  };
  const view = render(
    <SmartProvider language="eng" translations={{ 'date.label': 'Date' }}>
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

describe('@smartsoft001/crud-shell-react: SmartCrudFilterDateTime', () => {
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

  it('should render datetime-local inputs for the from/to range', () => {
    setup();

    expect([
      screen.getByLabelText('from'),
      screen.getByLabelText('to'),
    ]).toEqual([
      expect.objectContaining({ type: 'datetime-local' }),
      expect.objectContaining({ type: 'datetime-local' }),
    ]);
  });

  it('should show the current range values', () => {
    setup({
      query: [
        { key: 'date', type: '>=', value: '2024-03-15T10:30' },
        { key: 'date', type: '<=', value: '2024-03-20T08:00' },
      ],
    });

    expect([
      screen.getByLabelText('from'),
      screen.getByLabelText('to'),
    ]).toEqual([
      expect.objectContaining({ value: '2024-03-15T10:30' }),
      expect.objectContaining({ value: '2024-03-20T08:00' }),
    ]);
  });

  it('should read the list with the ">=" day of the typed "from" date-time 500 ms later', () => {
    jest.useFakeTimers();
    const { service } = setup();

    fireEvent.change(screen.getByLabelText('from'), {
      target: { value: '2024-03-15T10:30' },
    });
    act(() => jest.advanceTimersByTime(500));

    expect(service.getList).toHaveBeenCalledWith({
      offset: 0,
      query: [
        { key: 'date', type: '>=', value: '2024-03-15', label: 'date.label' },
      ],
    });
  });

  it('should read the list with the "<=" day of the typed "to" date-time 500 ms later', () => {
    jest.useFakeTimers();
    const { service } = setup();

    fireEvent.change(screen.getByLabelText('to'), {
      target: { value: '2024-03-20T08:00' },
    });
    act(() => jest.advanceTimersByTime(500));

    expect(service.getList).toHaveBeenCalledWith({
      offset: 0,
      query: [
        { key: 'date', type: '<=', value: '2024-03-20', label: 'date.label' },
      ],
    });
  });

  it('should keep the typed date-time in the input while the read is debounced', () => {
    jest.useFakeTimers();
    setup();

    fireEvent.change(screen.getByLabelText('from'), {
      target: { value: '2024-03-15T10:30' },
    });

    expect(screen.getByLabelText('from')).toHaveValue('2024-03-15T10:30');
  });

  it('should show the clear-from button when a ">=" value is present', () => {
    setup({ query: [{ key: 'date', type: '>=', value: '2024-03-15T10:30' }] });

    expect(
      screen.getByRole('button', { name: 'clear-from' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'clear-to' }),
    ).not.toBeInTheDocument();
  });

  it('should show the clear-to button when a "<=" value is present', () => {
    setup({ query: [{ key: 'date', type: '<=', value: '2024-03-20T08:00' }] });

    expect(
      screen.getByRole('button', { name: 'clear-to' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'clear-from' }),
    ).not.toBeInTheDocument();
  });

  it.each([
    ['clear-from', { key: 'date', type: '<=', value: '2024-03-20T08:00' }],
    ['clear-to', { key: 'date', type: '>=', value: '2024-03-15T10:30' }],
  ])('should remove the range value of %s', (label, remaining) => {
    jest.useFakeTimers();
    const { service } = setup({
      query: [
        { key: 'date', type: '>=', value: '2024-03-15T10:30' },
        { key: 'date', type: '<=', value: '2024-03-20T08:00' },
      ],
    });

    fireEvent.click(screen.getByRole('button', { name: label }));
    act(() => jest.advanceTimersByTime(500));

    expect(service.getList).toHaveBeenCalledWith({
      offset: 0,
      query: [remaining],
    });
  });

  it('should render the Angular host and range classes', () => {
    const { view } = setup();

    expect(view.container.firstElementChild).toHaveClass(
      'smart:block',
      'smart:w-full',
    );
    expect(view.container.firstElementChild?.children[1]).toHaveClass(
      'smart:flex',
      'smart:w-full',
      'smart:flex-col',
      'smart:gap-2',
    );
  });
});
