import { act, fireEvent, render, screen } from '@testing-library/react';

import { IModelFilter } from '@smartsoft001/models';
import { SmartProvider } from '@smartsoft001/react';

import { SmartCrudFilterFlag } from './filter-flag';
import { CrudProvider } from '../../../crud.provider';
import { useCrudState } from '../../../hooks';
import { ICrudFilter } from '../../../models';
import { CrudService } from '../../../services/crud/crud.service';

class TodoModel {
  active?: boolean;
}

const config = {
  apiUrl: '/api/todos',
  entity: 'todos-filter-flag',
  type: TodoModel,
};

const item: IModelFilter = { key: 'active', type: '=', label: 'active.label' };

/** The filter field fed with the store's filter, as the filters panel does. */
function Connected({ initial }: { initial: ICrudFilter }) {
  const filter = useCrudState((state) => state.filter);

  return <SmartCrudFilterFlag item={item} filter={filter ?? initial} />;
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

describe('@smartsoft001/crud-shell-react: SmartCrudFilterFlag', () => {
  afterEach(() => jest.useRealTimers());

  it('should render the checkbox of the item key', () => {
    setup();

    expect(screen.getByLabelText('MODEL.active')).toHaveAttribute(
      'type',
      'checkbox',
    );
  });

  it('should read the list with the checked flag 500 ms later', () => {
    jest.useFakeTimers();
    const { service } = setup();

    fireEvent.click(screen.getByLabelText('MODEL.active'));
    act(() => jest.advanceTimersByTime(500));

    expect(service.getList).toHaveBeenCalledWith({
      offset: 0,
      query: [{ key: 'active', type: '=', value: true, label: 'active.label' }],
    });
  });

  it('should show the clear button when the query value is boolean', () => {
    setup({ query: [{ key: 'active', type: '=', value: false }] });

    expect(screen.getByRole('button', { name: 'clear' })).toBeInTheDocument();
  });

  it('should not show the clear button for a value that is not boolean', () => {
    setup({ query: [{ key: 'active', type: '=', value: 'yes' }] });

    expect(
      screen.queryByRole('button', { name: 'clear' }),
    ).not.toBeInTheDocument();
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
      query: [{ key: 'active', type: '=', value: true }],
    });

    fireEvent.click(screen.getByRole('button', { name: 'clear' }));
    act(() => jest.advanceTimersByTime(500));

    expect(service.getList).toHaveBeenCalledWith({ offset: 0, query: [] });
  });

  it('should render the root and row classes', () => {
    const { view } = setup();

    expect(view.container.firstElementChild).toHaveClass(
      'smart:block',
      'smart:w-full',
    );
    expect(view.container.firstElementChild?.firstElementChild).toHaveClass(
      'smart:flex',
      'smart:w-full',
      'smart:items-center',
      'smart:gap-2',
    );
  });
});
