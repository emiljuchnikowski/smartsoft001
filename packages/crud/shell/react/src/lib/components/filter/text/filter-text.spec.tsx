import { act, fireEvent, render, screen } from '@testing-library/react';

import { IModelFilter } from '@smartsoft001/models';
import { SmartProvider } from '@smartsoft001/react';

import { SmartCrudFilterText } from './filter-text';
import { CrudProvider } from '../../../crud.provider';
import { useCrudState } from '../../../hooks';
import { ICrudFilter } from '../../../models';
import { CrudService } from '../../../services/crud/crud.service';

class TodoModel {
  name?: string;
}

const config = {
  apiUrl: '/api/todos',
  entity: 'todos-filter-text',
  type: TodoModel,
};

const item: IModelFilter = { key: 'name', type: '=', label: 'name.label' };

/** The filter field fed with the store's filter, as the filters panel does. */
function Connected({ initial }: { initial: ICrudFilter }) {
  const filter = useCrudState((state) => state.filter);

  return <SmartCrudFilterText item={item} filter={filter ?? initial} />;
}

function setup(initial: ICrudFilter = { query: [] }) {
  const service = {
    getList: jest.fn(() => new Promise(() => undefined)),
  };
  const view = render(
    <SmartProvider>
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

describe('@smartsoft001/crud-shell-react: SmartCrudFilterText', () => {
  afterEach(() => jest.useRealTimers());

  it('should render the text input of the item key', () => {
    setup();

    expect(screen.getByLabelText('MODEL.name')).toHaveAttribute('type', 'text');
  });

  it('should seed the input with the current value', () => {
    setup({ query: [{ key: 'name', type: '=', value: 'abc' }] });

    expect(screen.getByLabelText('MODEL.name')).toHaveValue('abc');
  });

  it('should read the list with the typed value 500 ms later', () => {
    jest.useFakeTimers();
    const { service } = setup({ limit: 10, offset: 20, query: [] });

    fireEvent.change(screen.getByLabelText('MODEL.name'), {
      target: { value: 'Ada' },
    });
    act(() => jest.advanceTimersByTime(500));

    expect(service.getList).toHaveBeenCalledWith({
      limit: 10,
      offset: 0,
      query: [{ key: 'name', type: '=', value: 'Ada', label: 'name.label' }],
    });
  });

  it('should show the clear button when a matching query value is present', () => {
    setup({ query: [{ key: 'name', type: '=', value: 'abc' }] });

    expect(screen.getByRole('button', { name: 'clear' })).toBeInTheDocument();
  });

  it('should not show the clear button when no matching query value is present', () => {
    setup({ query: [] });

    expect(
      screen.queryByRole('button', { name: 'clear' }),
    ).not.toBeInTheDocument();
  });

  it('should remove the value and hide the clear button after clearing', () => {
    jest.useFakeTimers();
    const { service } = setup({
      query: [{ key: 'name', type: '=', value: 'abc' }],
    });

    fireEvent.click(screen.getByRole('button', { name: 'clear' }));
    act(() => jest.advanceTimersByTime(500));

    expect(service.getList).toHaveBeenCalledWith({ offset: 0, query: [] });
    expect(
      screen.queryByRole('button', { name: 'clear' }),
    ).not.toBeInTheDocument();
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
