import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';

import { IEntity } from '@smartsoft001/domain-core';
import { Field, Model } from '@smartsoft001/models';

import { SmartListModeProps } from './list.types';
import { useList } from './use-list';
import {
  IDetailsProvider,
  IListInternalOptions,
  IListProvider,
} from '../../models';
import { ISmartNavigation } from '../../providers/navigation';
import { SmartConfig } from '../../providers/smart-context';
import { SmartProvider } from '../../providers/smart-provider';
import { AlertService } from '../../services/alert/alert.service';
import { AuthService } from '../../services/auth/auth.service';

@Model({})
class TestItemModel implements IEntity<string> {
  id = 'test-id';

  @Field({ list: true })
  firstName = 'Jane';
}

function createProvider(
  list: TestItemModel[] = [],
): IListProvider<TestItemModel> {
  return { list, loading: false, getData: jest.fn() };
}

function createDetailsProvider(): IDetailsProvider<TestItemModel> {
  return {
    getData: jest.fn(),
    clearData: jest.fn(),
    item: { id: 'test-id' } as TestItemModel,
    loading: false,
  };
}

function createNavigation(): ISmartNavigation {
  return {
    navigate: jest.fn(),
    back: jest.fn(),
    getCurrentUrl: () => '/',
    subscribe: () => () => undefined,
  };
}

function setup(
  options: Partial<IListInternalOptions<TestItemModel>> = {},
  config: SmartConfig = {},
) {
  const alertService = new AlertService();
  const navigation = createNavigation();
  const authService = {
    expectPermissions: () => true,
  } as unknown as AuthService;
  const props: SmartListModeProps<TestItemModel> = {
    options: {
      provider: createProvider(),
      type: TestItemModel,
      fields: [{ key: 'firstName', options: { list: true } }],
      ...options,
    },
  };
  const wrapper = ({ children }: { children: ReactNode }) => (
    <SmartProvider
      language="eng"
      alertService={alertService}
      authService={authService}
      navigation={navigation}
      {...config}
    >
      {children}
    </SmartProvider>
  );

  const hook = renderHook(() => useList(props), { wrapper });

  return { ...hook, alertService, navigation };
}

describe('@smartsoft001/react: useList', () => {
  it('should populate keys from fields marked as list', () => {
    const { result } = setup();

    expect(result.current.keys).toEqual(['firstName']);
  });

  it('should skip a field the user has no list permissions for', () => {
    const authService = {
      expectPermissions: (permissions: string[]) =>
        permissions.includes('admin'),
    } as unknown as AuthService;

    const { result } = setup(
      {
        fields: [
          { key: 'firstName', options: { list: { permissions: ['admin'] } } },
          { key: 'lastName', options: { list: { permissions: ['owner'] } } },
        ],
      },
      { authService },
    );

    expect(result.current.keys).toEqual(['firstName']);
  });

  it('should expand a dynamic field into one __array column per entry of the first item', () => {
    const item = Object.assign(new TestItemModel(), {
      prices: [{ label: 'Retail' }, { label: 'Wholesale' }],
    });

    const { result } = setup({
      provider: createProvider([item]),
      fields: [
        {
          key: 'prices',
          options: {
            list: { dynamic: { headerKey: 'label', rowKey: 'value' } },
          },
        },
      ],
    });

    expect(result.current.keys).toEqual([
      '__array.prices.0.label.value',
      '__array.prices.1.label.value',
    ]);
  });

  it('should skip a dynamic field while the list is empty', () => {
    const { result } = setup({
      fields: [
        {
          key: 'prices',
          options: {
            list: { dynamic: { headerKey: 'label', rowKey: 'value' } },
          },
        },
      ],
    });

    expect(result.current.keys).toEqual([]);
  });

  it('should expose the provider list and loading', () => {
    const items = [new TestItemModel()];

    const { result } = setup({
      provider: { list: items, loading: true, getData: jest.fn() },
    });

    expect(result.current.list).toEqual(items);
    expect(result.current.loading).toBe(true);
  });

  it('should not set removeHandler without the remove option', () => {
    const { result } = setup();

    expect(result.current.removeHandler).toBeNull();
  });

  it('should set removeHandler when options.remove.provider.invoke is provided', () => {
    const { result } = setup({ remove: { provider: { invoke: jest.fn() } } });

    expect(result.current.removeHandler).not.toBeNull();
  });

  it('should set checkRemoveHandler from the remove provider check', () => {
    const check = jest.fn(() => false);

    const { result } = setup({
      remove: { provider: { invoke: jest.fn(), check } },
    });

    expect(result.current.checkRemoveHandler).toBe(check);
  });

  describe('remove', () => {
    it('should open a confirm alert when removeHandler is called', () => {
      const { result, alertService } = setup({
        remove: { provider: { invoke: jest.fn() } },
      });

      act(() => {
        result.current.removeHandler?.({ id: 'test-id' } as TestItemModel);
      });

      const [alert] = alertService.alerts.get();
      expect(alert.options).toEqual({
        header: 'confirm delete object',
        buttons: [
          { text: 'cancel', role: 'cancel' },
          { text: 'confirm', handler: expect.any(Function) },
        ],
        backdropDismiss: false,
      });
    });

    it('should invoke the remove provider on confirm', () => {
      const invoke = jest.fn();
      const { result, alertService } = setup({
        remove: { provider: { invoke } },
      });

      act(() => {
        result.current.removeHandler?.({ id: 'test-id' } as TestItemModel);
      });
      alertService.alerts.get()[0].options.buttons?.[1].handler?.();

      expect(invoke).toHaveBeenCalledWith('test-id');
    });

    it('should not invoke the remove provider on cancel', () => {
      const invoke = jest.fn();
      const { result, alertService } = setup({
        remove: { provider: { invoke } },
      });

      act(() => {
        result.current.removeHandler?.({ id: 'test-id' } as TestItemModel);
      });
      act(() => {
        alertService.alerts.get()[0].resolve(null);
      });

      expect(invoke).not.toHaveBeenCalled();
      expect(alertService.alerts.get()).toEqual([]);
    });
  });

  describe('item', () => {
    it('should not set itemHandler without the item option', () => {
      const { result } = setup();

      expect(result.current.itemHandler).toBeNull();
    });

    it('should navigate to the routing prefix and the id', () => {
      const { result, navigation } = setup({
        item: { options: { routingPrefix: '//users/', edit: false } },
      });

      result.current.itemHandler?.('abc');

      expect(navigation.navigate).toHaveBeenCalledWith('/users/abc');
    });

    it('should add the segment separator when the routing prefix has none', () => {
      const { result, navigation } = setup({
        item: { options: { routingPrefix: '/users', edit: false } },
      });

      result.current.itemHandler?.('abc');

      expect(navigation.navigate).toHaveBeenCalledWith('/users/abc');
    });

    it('should call select for custom item options', () => {
      const select = jest.fn();
      const { result, navigation } = setup({
        item: { options: { select, edit: false } },
      });

      result.current.itemHandler?.('abc');

      expect(select).toHaveBeenCalledWith('abc');
      expect(navigation.navigate).not.toHaveBeenCalled();
    });

    it('should throw when item has no options', () => {
      jest.spyOn(console, 'error').mockImplementation(() => undefined);

      expect(() => setup({ item: {} })).toThrow('Must set edit options');

      jest.mocked(console.error).mockRestore();
    });
  });

  describe('details options', () => {
    it('should initialise when details has a provider and no component', () => {
      const provider = createDetailsProvider();

      const { result } = setup({ details: { provider } });

      expect(result.current.keys).toEqual(['firstName']);
      expect(result.current.detailsComponent).toBeNull();
    });

    it('should throw when details has no provider', () => {
      jest.spyOn(console, 'error').mockImplementation(() => undefined);

      expect(() => setup({ details: {} })).toThrow('Must set details provider');

      jest.mocked(console.error).mockRestore();
    });

    it('should bind select and unselect to the details provider', () => {
      const provider = createDetailsProvider();
      const { result } = setup({ details: { provider } });

      result.current.select?.('abc');
      result.current.unselect?.();

      expect(provider.getData).toHaveBeenCalledWith('abc');
      expect(provider.clearData).toHaveBeenCalledTimes(1);
    });

    it('should assign detailsComponent and props when a component is set', () => {
      const provider = createDetailsProvider();
      const TestDetailsComponent = () => null;
      const componentFactories = { top: TestDetailsComponent };

      const { result } = setup({
        details: {
          provider,
          component: TestDetailsComponent,
          componentFactories,
        },
      });

      expect(result.current.detailsComponent).toBe(TestDetailsComponent);
      expect(result.current.detailsComponentProps).toEqual({
        item: provider.item,
        type: TestItemModel,
        loading: provider.loading,
        itemHandler: null,
        removeHandler: null,
        componentFactories,
      });
    });

    it('should unselect from the details button options', () => {
      const provider = createDetailsProvider();
      const { result } = setup({ details: { provider } });

      result.current.detailsButtonOptions.click();

      expect(provider.clearData).toHaveBeenCalledTimes(1);
    });
  });

  describe('pagination', () => {
    function createPagination(page = 2, totalPages = 3) {
      return {
        limit: 10,
        page,
        totalPages,
        loadNextPage: jest.fn(() => Promise.resolve(true)),
        loadPrevPage: jest.fn(() => Promise.resolve(true)),
      };
    }

    beforeEach(() => {
      jest.useFakeTimers();
      jest.spyOn(window, 'scrollTo').mockImplementation(() => undefined);
    });

    afterEach(() => {
      jest.useRealTimers();
      jest.mocked(window.scrollTo).mockRestore();
    });

    it('should not set the page loaders without pagination', () => {
      const { result } = setup();

      expect(result.current.loadNextPage).toBeNull();
      expect(result.current.loadPrevPage).toBeNull();
    });

    it('should expose page and totalPages', () => {
      const { result } = setup({ pagination: createPagination(2, 3) });

      expect(result.current.page).toBe(2);
      expect(result.current.totalPages).toBe(3);
    });

    it('should load the next page and scroll to the top', async () => {
      const pagination = createPagination();
      const { result } = setup({ pagination });

      await act(async () => {
        await result.current.loadNextPage?.();
      });
      jest.runAllTimers();

      expect(pagination.loadNextPage).toHaveBeenCalledTimes(1);
      expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
    });

    it('should load the previous page and scroll to the bottom', async () => {
      const pagination = createPagination();
      const { result } = setup({ pagination });

      await act(async () => {
        await result.current.loadPrevPage?.();
      });
      jest.runAllTimers();

      expect(pagination.loadPrevPage).toHaveBeenCalledTimes(1);
      expect(window.scrollTo).toHaveBeenCalledWith(0, 10000);
    });

    it('should load the next page for a later page change', () => {
      const pagination = createPagination(2);
      const { result } = setup({ pagination });

      result.current.handlePageChange(3);

      expect(pagination.loadNextPage).toHaveBeenCalledTimes(1);
      expect(pagination.loadPrevPage).not.toHaveBeenCalled();
    });

    it('should load the previous page for an earlier page change', () => {
      const pagination = createPagination(2);
      const { result } = setup({ pagination });

      result.current.handlePageChange(1);

      expect(pagination.loadPrevPage).toHaveBeenCalledTimes(1);
      expect(pagination.loadNextPage).not.toHaveBeenCalled();
    });

    it('should not load a page when the page does not change', () => {
      const pagination = createPagination(2);
      const { result } = setup({ pagination });

      result.current.handlePageChange(2);

      expect(pagination.loadNextPage).not.toHaveBeenCalled();
      expect(pagination.loadPrevPage).not.toHaveBeenCalled();
    });
  });
});
