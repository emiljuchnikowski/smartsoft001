import { fireEvent, render, screen } from '@testing-library/react';

import { IEntity } from '@smartsoft001/domain-core';
import { Field, Model } from '@smartsoft001/models';

import { SmartListMobile } from './list-mobile';
import {
  IListInternalOptions,
  IListPaginationOptions,
  PaginationMode,
} from '../../../models';
import { SmartProvider } from '../../../providers/smart-provider';
import { AlertService } from '../../../services/alert/alert.service';
import { AuthService } from '../../../services/auth/auth.service';

@Model({})
class TestItemModel implements IEntity<string> {
  id = 'test-id';

  @Field({ list: true })
  firstName = 'Jane';

  @Field({ list: true })
  lastName = 'Doe';
}

const FIELDS = [
  { key: 'firstName', options: { list: true } },
  { key: 'lastName', options: { list: true } },
];

const authService = {
  expectPermissions: () => true,
} as unknown as AuthService;

function makeItems(count: number): TestItemModel[] {
  return Array.from({ length: count }, (_, i) =>
    Object.assign(new TestItemModel(), { id: `id-${i}` }),
  );
}

function createPagination(
  extra: Partial<IListPaginationOptions> = {},
): IListPaginationOptions {
  return {
    limit: 10,
    page: 1,
    totalPages: 2,
    loadNextPage: jest.fn(() => Promise.resolve(true)),
    loadPrevPage: jest.fn(() => Promise.resolve(true)),
    ...extra,
  };
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
    >
      <SmartListMobile
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

  return { ...view, alertService };
}

describe('@smartsoft001/react: SmartListMobile', () => {
  it('should render a <ul role="list"> with Tailwind divide classes', () => {
    setup();

    expect(screen.getByRole('list')).toHaveClass(
      'smart:divide-y',
      'smart:divide-gray-100',
      'smart:dark:divide-white/10',
    );
  });

  it('should append className to the list classes', () => {
    setup([], {}, 'my-extra-class');

    expect(screen.getByRole('list')).toHaveClass('my-extra-class');
  });

  it('should render one <li> per item', () => {
    setup(makeItems(3));

    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });

  it('should render a paragraph per cell', () => {
    setup(makeItems(1));

    const item = screen.getByRole('listitem');
    const paragraphs = item.querySelectorAll('p');
    expect(paragraphs).toHaveLength(2);
    expect(paragraphs[0]).toHaveTextContent('Jane');
    expect(paragraphs[1]).toHaveTextContent('Doe');
    expect(paragraphs[0]).toHaveClass(
      'smart:text-sm',
      'smart:text-gray-900',
      'smart:dark:text-white',
    );
  });

  it('should skip an empty cell', () => {
    const [item] = makeItems(1);
    item.lastName = '';

    setup([item]);

    expect(screen.getByRole('listitem').querySelectorAll('p')).toHaveLength(1);
  });

  it('should render the top component factory', () => {
    const Top = () => <div data-testid="top">Top</div>;

    setup([], { componentFactories: { top: Top } });

    expect(screen.getByTestId('top')).toBeInTheDocument();
  });

  it('should render a remove button that opens the remove confirmation', () => {
    const invoke = jest.fn();
    const { alertService } = setup(makeItems(1), {
      remove: { provider: { invoke } },
    });

    fireEvent.click(screen.getByRole('button', { name: 'remove' }));
    alertService.alerts.get()[0].options.buttons?.[1].handler?.();

    expect(invoke).toHaveBeenCalledWith('id-0');
  });

  it('should not render a remove button when the check fails', () => {
    setup(makeItems(1), {
      remove: { provider: { invoke: jest.fn(), check: () => false } },
    });

    expect(
      screen.queryByRole('button', { name: 'remove' }),
    ).not.toBeInTheDocument();
  });

  it('should render an item button that calls the item handler', () => {
    const select = jest.fn();
    setup(makeItems(1), { item: { options: { select, edit: false } } });

    fireEvent.click(screen.getByRole('button', { name: '→' }));

    expect(select).toHaveBeenCalledWith('id-0');
  });

  it('should render the paging for the single page mode', () => {
    setup([], {
      pagination: createPagination({ mode: PaginationMode.singlePage }),
    });

    expect(
      screen.getByRole('navigation', { name: 'Pagination' }),
    ).toBeInTheDocument();
  });

  it('should render the infinite scroll sentinel for the infinite scroll mode', () => {
    const { container } = setup([], {
      pagination: createPagination({ mode: PaginationMode.infiniteScroll }),
    });

    expect(
      container.querySelector('[data-role="infinite-scroll"]'),
    ).toBeInTheDocument();
  });
});
