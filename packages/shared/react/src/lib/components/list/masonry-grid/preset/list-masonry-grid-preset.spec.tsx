import { render, screen } from '@testing-library/react';

import { IEntity } from '@smartsoft001/domain-core';
import { Field, FieldType, Model } from '@smartsoft001/models';

import { SmartListMasonryGridPreset } from './list-masonry-grid-preset';
import { IListInternalOptions, PaginationMode } from '../../../../models';
import { SmartProvider } from '../../../../providers/smart-provider';
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
  className = '',
  options: Partial<IListInternalOptions<TestItemModel>> = {},
) {
  const view = render(
    <SmartProvider
      language="eng"
      authService={authService}
      fileServiceConfig={fileServiceConfig}
    >
      <SmartListMasonryGridPreset
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

  return { ...view, queryAll };
}

describe('@smartsoft001/react: SmartListMasonryGridPreset', () => {
  it('should keep the base masonry column layout on the grid container', () => {
    const { queryAll } = setup(makeItems(1));

    expect(queryAll('grid')[0]).toHaveClass(
      'smart:grid',
      'smart:sm:grid-cols-2',
      'smart:lg:grid-cols-3',
    );
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
      'smart:dark:bg-gray-800',
    );
  });

  it('should render the item image with a rounded card top', () => {
    const { queryAll } = setup(makeItems(1));

    const image = queryAll('card-image')[0];
    expect(image).toHaveClass('smart:rounded-t-xl', 'smart:object-cover');
    expect(image).toHaveAttribute('src', 'http://api/attachments/file-id');
    expect(image).toHaveAttribute('loading', 'lazy');
  });

  it('should map the first non-image cell to the card title and the rest to text', () => {
    const { queryAll } = setup(makeItems(1));

    const titles = queryAll('card-title');
    const texts = queryAll('card-text');
    expect(titles).toHaveLength(1);
    expect(titles[0].innerHTML).toContain('value-firstName');
    expect(texts).toHaveLength(1);
    expect(texts[0].innerHTML).toContain('value-lastName');
  });

  it('should append className to the grid container', () => {
    const { queryAll } = setup(makeItems(1), 'my-extra-class');

    expect(queryAll('grid')[0]).toHaveClass('my-extra-class');
  });

  it('should render no cards when the list is empty', () => {
    const { queryAll } = setup([]);

    expect(queryAll('card')).toHaveLength(0);
  });

  it('should render the paging for the single page mode', () => {
    setup([], '', {
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
