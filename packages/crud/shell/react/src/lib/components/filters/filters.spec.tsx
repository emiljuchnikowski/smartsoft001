import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
} from '@testing-library/react';
import type { ReactNode } from 'react';

import { Field, FieldType, Model } from '@smartsoft001/models';
import {
  MenuService,
  SmartProvider,
  useMenuService,
  useStyleService,
} from '@smartsoft001/react';

import { SmartCrudFilters } from './filters';
import { SmartCrudFiltersProps } from './filters.types';
import { useCrudFilters } from './use-crud-filters';
import { useCrudFacade } from '../../crud.context';
import { CrudProvider } from '../../crud.provider';
import { CrudFacade } from '../../state/crud.facade';
import { SmartCrudFilter } from '../filter/filter';

jest.mock('../filter/filter', () => ({
  SmartCrudFilter: jest.fn((p: { item: { key: string } }) => (
    <div data-testid="filter">{p.item.key}</div>
  )),
}));

@Model({
  filters: [
    { label: 'testNegation', key: 'body', type: '!=' },
    { key: 'type', type: '=', fieldType: FieldType.radio },
  ],
})
class TodoModel {
  id!: string;

  @Field({ type: FieldType.text, list: { filter: true } })
  title!: string;

  @Field({ type: FieldType.longText, list: { filter: true } })
  description!: string;

  @Field({ type: FieldType.int, list: { filter: true } })
  views!: number;

  @Field({ type: FieldType.text, list: true })
  name!: string;
}

const config = {
  apiUrl: '/api/todos',
  entity: 'todos-filters',
  type: TodoModel,
};

function setup(props: SmartCrudFiltersProps = {}) {
  let facade!: CrudFacade<TodoModel>;
  let menuService!: MenuService;
  const Grab = () => {
    facade = useCrudFacade();
    menuService = useMenuService();
    useStyleService().set({ 'color-primary': '#ff0000' });
    return null;
  };

  const view = render(
    <SmartProvider language="eng">
      <CrudProvider config={config}>
        <Grab />
        <SmartCrudFilters {...props} />
      </CrudProvider>
    </SmartProvider>,
  );

  return { facade, menuService, view };
}

describe('@smartsoft001/crud-shell-react: SmartCrudFilters', () => {
  beforeEach(() => jest.mocked(SmartCrudFilter).mockClear());

  it('should render the translated filters title', () => {
    setup();

    expect(screen.getByRole('heading')).toHaveTextContent('filters');
  });

  it('should render the close button', () => {
    setup();

    expect(screen.getByRole('button', { name: 'close' })).toBeInTheDocument();
  });

  it('should hide the header with hideMenu', () => {
    setup({ hideMenu: true });

    expect([
      screen.queryByRole('heading'),
      screen.queryByRole('button', { name: 'close' }),
    ]).toEqual([null, null]);
  });

  it('should close the end menu with the close button', () => {
    const { menuService } = setup();
    const closeEnd = jest.spyOn(menuService, 'closeEnd');

    fireEvent.click(screen.getByRole('button', { name: 'close' }));

    expect(closeEnd).toHaveBeenCalledTimes(1);
  });

  it('should render a filter for every model filter and filtered field', () => {
    setup();

    expect(screen.getAllByTestId('filter').map((el) => el.textContent)).toEqual(
      ['body', 'type', 'title', 'description', 'views'],
    );
  });

  it('should hand the current filter to every filter', () => {
    const { facade } = setup();
    const filter = { searchText: 'abc', query: [] };

    act(() => facade.store.set({ loaded: true, filter }));

    expect(jest.mocked(SmartCrudFilter).mock.lastCall?.[0]).toEqual({
      item: expect.objectContaining({ key: 'views' }),
      filter,
    });
  });

  it('should write the application style on its element', () => {
    const { view } = setup();

    expect(
      (view.container.firstElementChild as HTMLElement).style.getPropertyValue(
        '--smart-color-primary',
      ),
    ).toBe('#ff0000');
  });
});

describe('@smartsoft001/crud-shell-react: useCrudFilters', () => {
  function setupHook() {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <SmartProvider>
        <CrudProvider config={config}>{children}</CrudProvider>
      </SmartProvider>
    );

    return renderHook(() => useCrudFilters(), { wrapper }).result.current;
  }

  it('should keep the label of a model filter', () => {
    const { list } = setupHook();

    expect(list[0]).toMatchObject({ key: 'body', label: 'testNegation' });
  });

  it('should label a model filter without a label by its key', () => {
    const { list } = setupHook();

    expect(list[1]).toMatchObject({ key: 'type', label: 'MODEL.type' });
  });

  it('should filter text fields by containing text', () => {
    const { list } = setupHook();

    expect(list.slice(2, 4)).toEqual([
      {
        key: 'title',
        type: '~=',
        label: 'MODEL.title',
        fieldType: FieldType.text,
      },
      {
        key: 'description',
        type: '~=',
        label: 'MODEL.description',
        fieldType: FieldType.longText,
      },
    ]);
  });

  it('should filter other fields by equality', () => {
    const { list } = setupHook();

    expect(list[4]).toEqual({
      key: 'views',
      type: '=',
      label: 'MODEL.views',
      fieldType: FieldType.int,
    });
  });
});
