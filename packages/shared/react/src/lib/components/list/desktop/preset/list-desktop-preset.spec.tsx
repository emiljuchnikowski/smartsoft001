import { fireEvent, render, screen } from '@testing-library/react';

import { IEntity } from '@smartsoft001/domain-core';
import { Field, Model } from '@smartsoft001/models';

import { SmartListDesktopPreset } from './list-desktop-preset';
import {
  IListInternalOptions,
  IListProvider,
  PaginationMode,
} from '../../../../models';
import { SmartProvider } from '../../../../providers/smart-provider';
import { AlertService } from '../../../../services/alert/alert.service';
import { AuthService } from '../../../../services/auth/auth.service';

@Model({})
class TestItemModel implements IEntity<string> {
  id = 'test-id';

  @Field({ list: true })
  firstName = 'Jane';
}

function createProvider(
  items: TestItemModel[] = [],
  extra: Partial<IListProvider<TestItemModel>> = {},
): IListProvider<TestItemModel> {
  return { list: items, loading: false, getData: jest.fn(), ...extra };
}

const authService = {
  expectPermissions: () => true,
} as unknown as AuthService;

function setup(
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
      <SmartListDesktopPreset
        options={{
          provider: createProvider([new TestItemModel()]),
          type: TestItemModel,
          fields: [{ key: 'firstName', options: { list: true } }],
          ...options,
        }}
        className={className}
      />
    </SmartProvider>,
  );

  const query = (role: string) =>
    view.container.querySelector(`[data-role="${role}"]`);

  return { ...view, alertService, query };
}

describe('@smartsoft001/react: SmartListDesktopPreset', () => {
  it('should render a body row from the provider list', () => {
    const { container } = setup();

    expect(container.querySelectorAll('[data-role="row"]')).toHaveLength(1);
  });

  it('should apply default Preline table classes', () => {
    const { query } = setup();

    expect(query('table')).toHaveClass(
      'smart:min-w-full',
      'smart:divide-y',
      'smart:dark:divide-gray-700',
    );
  });

  it('should drop table dividers for the borderless variant', () => {
    const { query } = setup({ presentation: { variant: 'borderless' } });

    expect(query('table')).toHaveClass('smart:min-w-full');
    expect(query('table')).not.toHaveClass('smart:divide-y');
  });

  it('should apply striped classes on body rows', () => {
    const { query } = setup({ presentation: { variant: 'striped' } });

    expect(query('row')).toHaveClass(
      'smart:odd:bg-white',
      'smart:even:bg-gray-50',
      'smart:dark:even:bg-gray-800',
    );
  });

  it('should apply hoverable classes on body rows', () => {
    const { query } = setup({ presentation: { hoverable: true } });

    expect(query('row')).toHaveClass(
      'smart:hover:bg-gray-100',
      'smart:dark:hover:bg-gray-700',
    );
  });

  it('should add a border on the container for the bordered variant', () => {
    const { query } = setup({ presentation: { variant: 'bordered' } });

    expect(query('table')?.parentElement).toHaveClass(
      'smart:overflow-x-auto',
      'smart:border',
      'smart:border-gray-200',
    );
  });

  it('should append className to the container', () => {
    const { query } = setup({}, 'my-extra-class');

    expect(query('table')?.parentElement).toHaveClass('my-extra-class');
  });

  it('should apply muted header row classes', () => {
    const { query } = setup({ presentation: { header: 'muted' } });

    expect(query('header-row')).toHaveClass(
      'smart:bg-gray-50',
      'smart:dark:bg-gray-800',
    );
  });

  it('should hide the header row when header is none', () => {
    const { query } = setup({ presentation: { header: 'none' } });

    expect(query('header-row')).toHaveClass('smart:hidden');
  });

  it('should style the header and body cells', () => {
    setup();

    expect(screen.getByRole('columnheader')).toHaveClass(
      'smart:px-6',
      'smart:text-xs',
      'smart:uppercase',
    );
    expect(screen.getByRole('cell')).toHaveClass(
      'smart:px-6',
      'smart:whitespace-nowrap',
    );
  });

  it('should render a remove button that opens the remove confirmation', () => {
    const invoke = jest.fn();
    const { query, alertService } = setup({ remove: { provider: { invoke } } });

    fireEvent.click(query('remove') as HTMLButtonElement);
    alertService.alerts.get()[0].options.buttons?.[1].handler?.();

    expect(query('remove')).toHaveTextContent('remove');
    expect(invoke).toHaveBeenCalledWith('test-id');
  });

  it('should render an item button that calls the item handler', () => {
    const select = jest.fn();
    const { query } = setup({ item: { options: { select, edit: false } } });

    fireEvent.click(query('item') as HTMLButtonElement);

    expect(select).toHaveBeenCalledWith('test-id');
  });

  it('should align the action columns to the end', () => {
    const { query } = setup({
      item: { options: { select: jest.fn(), edit: false } },
    });

    expect(query('item')?.closest('td')).toHaveClass(
      'smart:px-6',
      'smart:w-10',
      'smart:text-end',
    );
  });

  it('should report the multi selection', () => {
    const item = new TestItemModel();
    const onChangeMultiSelected = jest.fn();
    setup({
      select: 'multi',
      provider: createProvider([item], { onChangeMultiSelected }),
    });

    fireEvent.click(screen.getByRole('checkbox'));

    expect(onChangeMultiSelected).toHaveBeenCalledWith([item]);
  });

  it('should render the paging for the single page mode', () => {
    setup({
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
