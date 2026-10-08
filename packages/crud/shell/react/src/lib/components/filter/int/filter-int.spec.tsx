import { act, fireEvent, render, screen } from '@testing-library/react';

import { IModelFilter } from '@smartsoft001/models';
import { SmartProvider } from '@smartsoft001/react';

import { SmartCrudFilterInt } from './filter-int';
import { CrudProvider } from '../../../crud.provider';
import { useCrudState } from '../../../hooks';
import { ICrudFilter } from '../../../models';
import { CrudService } from '../../../services/crud/crud.service';

class TodoModel {
  age?: number;
}

const config = {
  apiUrl: '/api/todos',
  entity: 'todos-filter-int',
  type: TodoModel,
};

function buildItem(type: IModelFilter['type'] = '='): IModelFilter {
  return { key: 'age', type, label: 'age.label' };
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

  return <SmartCrudFilterInt item={item} filter={filter ?? initial} />;
}

function setup(initial: ICrudFilter = { query: [] }, item = buildItem()) {
  const service = {
    getList: jest.fn(() => new Promise(() => undefined)),
  };
  const view = render(
    <SmartProvider language="eng">
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

function numberInputs(container: HTMLElement): HTMLInputElement[] {
  return Array.from(container.querySelectorAll('input[type="number"]'));
}

describe('@smartsoft001/crud-shell-react: SmartCrudFilterInt', () => {
  afterEach(() => jest.useRealTimers());

  it('should render the primary int input of the item key', () => {
    setup();

    expect(screen.getByLabelText('MODEL.age')).toHaveAttribute(
      'type',
      'number',
    );
  });

  it('should read the list with the typed number 500 ms later', () => {
    jest.useFakeTimers();
    const { service } = setup();

    fireEvent.change(screen.getByLabelText('MODEL.age'), {
      target: { value: '42' },
    });
    act(() => jest.advanceTimersByTime(500));

    expect(service.getList).toHaveBeenCalledWith({
      offset: 0,
      query: [{ key: 'age', type: '=', value: 42, label: 'age.label' }],
    });
  });

  it('should allow advanced only when item type is "="', () => {
    setup();

    expect(
      screen.getByRole('button', { name: 'settings' }),
    ).toBeInTheDocument();
  });

  it('should not allow advanced when item type is not "="', () => {
    setup({ query: [] }, buildItem('>='));

    expect(
      screen.queryByRole('button', { name: 'settings' }),
    ).not.toBeInTheDocument();
  });

  it('should replace the primary input with from/to number inputs when advanced is toggled on', () => {
    const { view } = setup();
    expect(numberInputs(view.container)).toHaveLength(1);

    fireEvent.click(screen.getByRole('button', { name: 'settings' }));

    expect(numberInputs(view.container)).toEqual([
      screen.getByLabelText('from'),
      screen.getByLabelText('to'),
    ]);
  });

  it('should remove the value when advanced is toggled on', () => {
    jest.useFakeTimers();
    const { service } = setup({
      query: [{ key: 'age', type: '=', value: 5 }],
    });

    fireEvent.click(screen.getByRole('button', { name: 'settings' }));
    act(() => jest.advanceTimersByTime(500));

    expect(service.getList).toHaveBeenCalledWith({ offset: 0, query: [] });
  });

  it('should disable the settings button while a range value is set', () => {
    setup({ query: [{ key: 'age', type: '<=', value: 9 }] });

    expect(screen.getByRole('button', { name: 'settings' })).toBeDisabled();
  });

  it('should show the range inputs seeded with the range values while one is set', () => {
    setup({
      query: [
        { key: 'age', type: '>=', value: 1 },
        { key: 'age', type: '<=', value: 9 },
      ],
    });

    expect([
      screen.getByLabelText('from'),
      screen.getByLabelText('to'),
    ]).toEqual([
      expect.objectContaining({ value: '1' }),
      expect.objectContaining({ value: '9' }),
    ]);
  });

  it('should read the list with the typed "from" number 500 ms later', () => {
    jest.useFakeTimers();
    const { service } = setup();
    fireEvent.click(screen.getByRole('button', { name: 'settings' }));
    act(() => jest.advanceTimersByTime(500));

    fireEvent.change(screen.getByLabelText('from'), {
      target: { value: '3' },
    });
    act(() => jest.advanceTimersByTime(500));

    expect(service.getList).toHaveBeenLastCalledWith({
      offset: 0,
      query: [{ key: 'age', type: '>=', value: 3, label: 'age.label' }],
    });
  });

  it('should show the clear button when a matching value query is present', () => {
    setup({ query: [{ key: 'age', type: '=', value: 5 }] });

    expect(screen.getByRole('button', { name: 'clear' })).toBeInTheDocument();
  });

  it('should show the clear button when a matching min (>=) query is present', () => {
    setup({ query: [{ key: 'age', type: '>=', value: 1 }] });

    expect(screen.getByRole('button', { name: 'clear' })).toBeInTheDocument();
  });

  it('should not show the clear button when no matching query is present', () => {
    setup({ query: [] });

    expect(
      screen.queryByRole('button', { name: 'clear' }),
    ).not.toBeInTheDocument();
  });

  it('should remove every entry of the item at once when cleared', () => {
    const { service } = setup({
      query: [
        { key: 'other', type: '=', value: 'x' },
        { key: 'age', type: '>=', value: 1 },
        { key: 'age', type: '<=', value: 9 },
      ],
    });

    fireEvent.click(screen.getByRole('button', { name: 'clear' }));

    expect(service.getList).toHaveBeenCalledWith({
      offset: 0,
      query: [{ key: 'other', type: '=', value: 'x' }],
    });
  });

  it.each([
    ['clear-from', '>=', { key: 'age', type: '<=', value: 9 }],
    ['clear-to', '<=', { key: 'age', type: '>=', value: 1 }],
  ])('should remove the %s range value', (label, _type, remaining) => {
    jest.useFakeTimers();
    const { service } = setup({
      query: [
        { key: 'age', type: '>=', value: 1 },
        { key: 'age', type: '<=', value: 9 },
      ],
    });

    fireEvent.click(screen.getByRole('button', { name: label }));
    act(() => jest.advanceTimersByTime(500));

    expect(service.getList).toHaveBeenCalledWith({
      offset: 0,
      query: [remaining],
    });
  });

  it('should render the Angular host and row classes', () => {
    const { view } = setup();

    expect(view.container.firstElementChild).toHaveClass(
      'smart:block',
      'smart:w-full',
    );
    expect(view.container.firstElementChild?.firstElementChild).toHaveClass(
      'smart:flex',
      'smart:w-full',
      'smart:items-end',
      'smart:gap-2',
    );
  });
});
