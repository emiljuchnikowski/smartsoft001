import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from '@testing-library/react';

import { IListOptions, SmartProvider } from '@smartsoft001/react';

import { SmartCrudGroup } from './group';
import { SmartCrudGroupProps } from './group.types';
import { CrudProvider } from '../../crud.provider';
import { ICrudListGroup } from '../../models';
import { CrudListGroupService } from '../../services/list-group/list-group.service';

class TodoModel {
  id!: string;
}

const config = {
  apiUrl: '/api/todos',
  entity: 'todos-group',
  type: TodoModel,
};

function groups(): Array<ICrudListGroup> {
  return [
    { key: 'a', value: 'a', text: 'A', show: false },
    { key: 'b', value: 'b', text: 'B', show: false },
  ];
}

const components = {
  list: () => <div data-testid="list" />,
};

const listOptions = {
  type: TodoModel,
  provider: { getData: jest.fn(), list: [], loading: false },
} as IListOptions<TodoModel>;

function setup(
  props: SmartCrudGroupProps<TodoModel> = {},
  translations?: Record<string, unknown>,
) {
  return render(
    <SmartProvider components={components} translations={translations}>
      <CrudProvider config={config}>
        <SmartCrudGroup {...props} />
      </CrudProvider>
    </SmartProvider>,
  );
}

describe('@smartsoft001/crud-shell-react: SmartCrudGroup', () => {
  let change: jest.SpyInstance;
  let destroy: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    change = jest
      .spyOn(CrudListGroupService.prototype, 'change')
      .mockImplementation(() => undefined);
    destroy = jest
      .spyOn(CrudListGroupService.prototype, 'destroy')
      .mockImplementation(() => undefined);
  });

  afterEach(() => {
    cleanup();
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('should render one collapsed disclosure button per group', () => {
    setup({ groups: groups() });

    const buttons = screen.getAllByRole('button');

    expect(
      buttons.map((b) => [b.textContent, b.getAttribute('aria-expanded')]),
    ).toEqual([
      ['A▸', 'false'],
      ['B▸', 'false'],
    ]);
  });

  it('should filter the list by the clicked group', () => {
    const data = groups();
    setup({ groups: data });

    fireEvent.click(screen.getByRole('button', { name: 'A' }));

    expect(change).toHaveBeenCalledWith(true, data[0], false);
  });

  it('should open the clicked group on the next tick', () => {
    setup({ groups: groups() });
    fireEvent.click(screen.getByRole('button', { name: 'A' }));

    act(() => jest.runAllTimers());

    expect(screen.getByRole('button', { name: 'A' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  it('should not open the clicked group before the next tick', () => {
    setup({ groups: groups() });

    fireEvent.click(screen.getByRole('button', { name: 'A' }));

    expect(screen.getByRole('button', { name: 'A' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });

  it('should reveal the region of the opened group', () => {
    const { container } = setup({ groups: groups() });
    fireEvent.click(screen.getByRole('button', { name: 'A' }));

    act(() => jest.runAllTimers());

    expect(
      container.querySelector('[id="smart-crud-group-a"]'),
    ).toBeInTheDocument();
  });

  it('should mark the opened group as shown', () => {
    const data = groups();
    setup({ groups: data });
    fireEvent.click(screen.getByRole('button', { name: 'A' }));

    act(() => jest.runAllTimers());

    expect(data[0].show).toBe(true);
  });

  it('should bold the header of the opened group', () => {
    setup({ groups: groups() });
    fireEvent.click(screen.getByRole('button', { name: 'A' }));

    act(() => jest.runAllTimers());

    expect(screen.getByRole('button', { name: 'A' })).toHaveClass(
      'smart:font-bold',
    );
  });

  it('should close the other groups when opening one', () => {
    const data = groups();
    data[1].show = true;
    setup({ groups: data });

    fireEvent.click(screen.getByRole('button', { name: 'A' }));
    act(() => jest.runAllTimers());

    expect(screen.getByRole('button', { name: 'B' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });

  it('should close an open group at once on click', () => {
    const data = groups();
    data[0].show = true;
    const { container } = setup({ groups: data });

    fireEvent.click(screen.getByRole('button', { name: 'A' }));

    expect(
      container.querySelector('[id="smart-crud-group-a"]'),
    ).not.toBeInTheDocument();
  });

  it('should tell the service about a closed group', () => {
    const data = groups();
    data[0].show = true;
    setup({ groups: data });

    fireEvent.click(screen.getByRole('button', { name: 'A' }));

    expect(change).toHaveBeenCalledWith(false, data[0], false);
  });

  it('should show the list in an open group', () => {
    const data = groups();
    data[0].show = true;

    setup({ groups: data, listOptions });

    expect(screen.getByTestId('list')).toBeInTheDocument();
  });

  it('should not show a list without list options', () => {
    const data = groups();
    data[0].show = true;

    setup({ groups: data });

    expect(screen.queryByTestId('list')).not.toBeInTheDocument();
  });

  it('should show the child groups of an open group instead of the list', () => {
    const data = groups();
    data[0].show = true;
    data[0].children = [{ key: 'a1', value: 'a1', text: 'A1' }];

    setup({ groups: data, listOptions });

    expect([
      screen.getByRole('button', { name: 'A1' }).getAttribute('aria-controls'),
      screen.queryByTestId('list'),
    ]).toEqual(['smart-crud-group-a1', null]);
  });

  it('should translate the group text', () => {
    setup(
      { groups: [{ key: 'a', value: 'a', text: 'groupA' }] },
      { groupA: 'Grupa A' },
    );

    expect(screen.getByRole('button', { name: 'Grupa A' })).toBeInTheDocument();
  });

  it('should drop the query items of the groups when removed', () => {
    const data = groups();
    const view = setup({ groups: data });

    view.unmount();

    expect(destroy).toHaveBeenCalledWith(data);
  });
});
