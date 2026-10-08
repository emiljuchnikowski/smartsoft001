import { act, fireEvent, render, screen } from '@testing-library/react';

import { SmartProvider } from '@smartsoft001/react';
import type { SmartProviderProps } from '@smartsoft001/react';

import { SmartCrudFiltersConfig } from './filters-config';
import { useCrudFacade } from '../../crud.context';
import { CrudProvider } from '../../crud.provider';
import { ICrudFilter } from '../../models';
import { CrudService } from '../../services/crud/crud.service';
import { CrudFacade } from '../../state/crud.facade';

class TodoModel {
  id!: string;
}

const config = {
  apiUrl: '/api/todos',
  entity: 'todos-filters-config',
  type: TodoModel,
};

const defaultFilter = (): ICrudFilter => ({
  query: [
    { key: 'name', type: '=', value: 'a' },
    { key: 'age', type: '>=', value: '18' },
  ],
});

function setup(
  filter: ICrudFilter = defaultFilter(),
  smart: Partial<SmartProviderProps> = {},
) {
  let facade!: CrudFacade<TodoModel>;
  const Grab = () => {
    facade = useCrudFacade();
    return null;
  };
  const service = {
    getList: jest.fn(async () => ({ data: [], totalCount: 0, links: {} })),
  } as unknown as CrudService<TodoModel>;

  render(
    <SmartProvider {...smart}>
      <CrudProvider config={config} service={service}>
        <Grab />
        <SmartCrudFiltersConfig />
      </CrudProvider>
    </SmartProvider>,
  );
  act(() => facade.store.set({ loaded: true, filter }));

  const read = jest.spyOn(facade, 'read');

  return { facade, read };
}

describe('@smartsoft001/crud-shell-react: SmartCrudFiltersConfig', () => {
  it('should render one chip button per visible query item', () => {
    setup();

    const buttons = screen.getAllByRole('button');

    expect(buttons.map((b) => b.textContent)).toEqual([
      'MODEL.name = a✕',
      'MODEL.age >= 18✕',
    ]);
  });

  it('should read the list without the item of the clicked chip', () => {
    const { read } = setup();

    fireEvent.click(screen.getAllByRole('button')[0]);

    expect(read).toHaveBeenCalledWith({
      query: [{ key: 'age', type: '>=', value: '18' }],
    });
  });

  it('should drop the chip of the removed item', () => {
    setup();

    fireEvent.click(screen.getAllByRole('button')[0]);

    expect(screen.getAllByRole('button').map((b) => b.textContent)).toEqual([
      'MODEL.age >= 18✕',
    ]);
  });

  it('should not render hidden query items', () => {
    setup({
      query: [
        { key: 'name', type: '=', value: 'a' },
        { key: 'secret', type: '=', value: 'x', hidden: true },
      ],
    });

    expect(screen.getAllByRole('button').map((b) => b.textContent)).toEqual([
      'MODEL.name = a✕',
    ]);
  });

  it('should render nothing without visible query items', () => {
    setup({ query: [{ key: 'secret', type: '=', value: 'x', hidden: true }] });

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('should label the chip with the translated remove action and field', () => {
    setup(defaultFilter(), {
      language: 'eng',
      translations: { MODEL: { name: 'Name' } },
    });

    expect(
      screen.getByRole('button', { name: 'remove Name' }),
    ).toBeInTheDocument();
  });

  it('should translate a text value', () => {
    setup(
      { query: [{ key: 'state', type: '=', value: 'open' }] },
      {
        translations: { open: 'Otwarte' },
      },
    );

    expect(screen.getByRole('button')).toHaveTextContent(
      'MODEL.state = Otwarte',
    );
  });

  it('should show a value that is not a text as it is', () => {
    setup({ query: [{ key: 'done', type: '=', value: false }] });

    expect(screen.getByRole('button')).toHaveTextContent('MODEL.done = false');
  });

  it('should show an empty value as nothing', () => {
    setup({ query: [{ key: 'owner', type: '=', value: null }] });

    expect(screen.getByRole('button').textContent).toBe('MODEL.owner = ✕');
  });
});
