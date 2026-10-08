import { render, screen } from '@testing-library/react';

import { IEntity } from '@smartsoft001/domain-core';
import { Field, FieldType, Model } from '@smartsoft001/models';

import { SmartListMasonryGrid } from './list-masonry-grid';
import { IListInternalOptions, PaginationMode } from '../../../models';
import { SmartProvider } from '../../../providers/smart-provider';
import { AuthService } from '../../../services/auth/auth.service';

@Model({})
class TestItemModel implements IEntity<string> {
  id = 'test-id';

  @Field({ list: true })
  firstName = 'Jane';

  @Field({ list: true, type: FieldType.image })
  photo: { id: string } | null = null;
}

const FIELDS = [
  { key: 'firstName', options: { list: true } },
  { key: 'photo', options: { list: true, type: FieldType.image } },
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
  return render(
    <SmartProvider
      language="eng"
      authService={authService}
      fileServiceConfig={fileServiceConfig}
    >
      <SmartListMasonryGrid
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
}

describe('@smartsoft001/react: SmartListMasonryGrid', () => {
  it('should include base grid classes on the list', () => {
    setup();

    expect(screen.getByRole('list')).toHaveClass(
      'smart:grid',
      'smart:grid-cols-1',
      'smart:gap-6',
      'smart:sm:grid-cols-2',
      'smart:lg:grid-cols-3',
    );
  });

  it('should append className to the list classes', () => {
    setup([], {}, 'my-extra-class');

    expect(screen.getByRole('list')).toHaveClass('my-extra-class');
  });

  it('should render one <li> per item', () => {
    setup(makeItems(2));

    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('should render the image of the model image field', () => {
    const [item] = makeItems(1);
    item.photo = { id: 'file-1' };

    setup([item]);

    const image = screen.getByRole('presentation');
    expect(image).toHaveAttribute('src', 'http://api/attachments/file-1');
    expect(image).toHaveAttribute('width', '400');
    expect(image).toHaveAttribute('height', '192');
    expect(image).toHaveAttribute('loading', 'lazy');
    expect(image).toHaveClass(
      'smart:h-48',
      'smart:w-full',
      'smart:object-cover',
    );
  });

  it('should not render an image without a value', () => {
    setup(makeItems(1));

    expect(screen.queryByRole('presentation')).not.toBeInTheDocument();
  });

  it('should render a paragraph per non-image cell', () => {
    const [item] = makeItems(1);
    item.photo = { id: 'file-1' };

    setup([item]);

    const paragraphs = screen.getByRole('listitem').querySelectorAll('p');
    expect(paragraphs).toHaveLength(1);
    expect(paragraphs[0]).toHaveTextContent('Jane');
  });

  it('should render the top component factory', () => {
    const Top = () => <div data-testid="top">Top</div>;

    setup([], { componentFactories: { top: Top } });

    expect(screen.getByTestId('top')).toBeInTheDocument();
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
