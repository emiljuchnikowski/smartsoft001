import { fireEvent, render, screen } from '@testing-library/react';

import { IEntity } from '@smartsoft001/domain-core';
import { Field, FieldType, Model } from '@smartsoft001/models';

import { SmartListMobilePreset } from './list-mobile-preset';
import { IListInternalOptions, PaginationMode } from '../../../../models';
import { SmartProvider } from '../../../../providers/smart-provider';
import { AlertService } from '../../../../services/alert/alert.service';
import { AuthService } from '../../../../services/auth/auth.service';

@Model({})
class TestItemModel implements IEntity<string> {
  id = 'test-id';

  @Field({ list: true, type: FieldType.image })
  photo = { id: 'file-id' };

  @Field({ list: true })
  firstName = 'value-firstName';

  @Field({ list: true })
  lastName = 'value-lastName';
}

const FIELDS = [
  { key: 'photo', options: { list: true, type: FieldType.image } },
  { key: 'firstName', options: { list: true } },
  { key: 'lastName', options: { list: true } },
];

const authService = {
  expectPermissions: () => true,
} as unknown as AuthService;
const fileServiceConfig = { apiUrl: 'http://api' };

function makeItems(count: number): TestItemModel[] {
  return Array.from({ length: count }, (_, i) =>
    Object.assign(new TestItemModel(), { id: `id-${i}` }),
  );
}

function setup(
  items: TestItemModel[] = [],
  options: Partial<IListInternalOptions<TestItemModel>> = {},
  className?: string,
) {
  const alertService = new AlertService();

  const view = render(
    <SmartProvider
      language="eng"
      alertService={alertService}
      authService={authService}
      fileServiceConfig={fileServiceConfig}
    >
      <SmartListMobilePreset
        options={{
          provider: { list: items, loading: false, getData: jest.fn() },
          type: TestItemModel,
          fields: FIELDS,
          ...options,
        }}
        className={className}
      />
    </SmartProvider>,
  );

  const queryAll = (role: string) =>
    view.container.querySelectorAll(`[data-role="${role}"]`);

  return { ...view, alertService, queryAll };
}

describe('@smartsoft001/react: SmartListMobilePreset', () => {
  it('should render a grid <ul> with grid + gap classes', () => {
    setup(makeItems(1));

    expect(screen.getByRole('list')).toHaveClass(
      'smart:grid',
      'smart:gap-4',
      'smart:grid-cols-1',
      'smart:sm:grid-cols-2',
      'smart:lg:grid-cols-3',
    );
  });

  it('should append className to the grid', () => {
    setup(makeItems(1), {}, 'my-extra-class');

    expect(screen.getByRole('list')).toHaveClass('my-extra-class');
  });

  it('should render one card per item', () => {
    const { queryAll } = setup(makeItems(3));

    expect(queryAll('card')).toHaveLength(3);
  });

  it('should apply preset card container classes to each card', () => {
    const { queryAll } = setup(makeItems(1));

    expect(queryAll('card')[0]).toHaveClass(
      'smart:rounded-xl',
      'smart:border',
      'smart:bg-white',
    );
  });

  it('should render a lazy image with rounded-t-xl for FieldType.image cells', () => {
    const { queryAll } = setup(makeItems(1));

    const image = queryAll('card-image')[0];
    expect(image).toHaveClass('smart:rounded-t-xl');
    expect(image).toHaveAttribute('src', 'http://api/attachments/file-id');
    expect(image).toHaveAttribute('loading', 'lazy');
  });

  it('should map the first non-image cell to the card title', () => {
    const { queryAll } = setup(makeItems(1));

    const titles = queryAll('card-title');
    expect(titles).toHaveLength(1);
    expect(titles[0].innerHTML).toContain('value-firstName');
  });

  it('should map remaining non-image cells to card text', () => {
    const { queryAll } = setup(makeItems(1));

    const texts = queryAll('card-text');
    expect(texts).toHaveLength(1);
    expect(texts[0].innerHTML).toContain('value-lastName');
  });

  it('should render an item button and call the item handler on click', () => {
    const select = jest.fn();
    const { queryAll } = setup(makeItems(1), {
      item: { options: { select, edit: false } },
    });

    fireEvent.click(queryAll('item')[0]);

    expect(queryAll('item')[0]).toHaveTextContent('details');
    expect(select).toHaveBeenCalledWith('id-0');
  });

  it('should render a remove button that opens the remove confirmation', () => {
    const invoke = jest.fn();
    const { queryAll, alertService } = setup(makeItems(1), {
      remove: { provider: { invoke, check: () => true } },
    });

    fireEvent.click(queryAll('remove')[0]);
    alertService.alerts.get()[0].options.buttons?.[1].handler?.();

    expect(invoke).toHaveBeenCalledWith('id-0');
  });

  it('should not render a remove button when the check returns false', () => {
    const { queryAll } = setup(makeItems(1), {
      remove: { provider: { invoke: jest.fn(), check: () => false } },
    });

    expect(queryAll('remove')).toHaveLength(0);
  });

  it('should render the paging for the single page mode', () => {
    setup([], {
      pagination: {
        mode: PaginationMode.singlePage,
        limit: 10,
        page: 1,
        totalPages: 2,
        loadNextPage: jest.fn(),
        loadPrevPage: jest.fn(),
      },
    });

    expect(
      screen.getByRole('navigation', { name: 'Pagination' }),
    ).toBeInTheDocument();
  });
});
