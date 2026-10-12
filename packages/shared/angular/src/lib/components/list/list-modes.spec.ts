import { NgComponentOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  Pipe,
  PipeTransform,
  signal,
  Type,
  WritableSignal,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { IEntity } from '@smartsoft001/domain-core';
import { Field, Model } from '@smartsoft001/models';

import { ListBaseComponent } from './base/base.component';
import { ListDesktopComponent } from './desktop/desktop.component';
import {
  IDetailsProvider,
  IListInternalOptions,
  IListPaginationOptions,
  IListProvider,
  PaginationMode,
} from '../../models';
import { DetailsPage } from '../../pages/details/details.page';
import { FileUrlPipe, ListCellPipe, ListHeaderPipe } from '../../pipes';
import { PagingComponent } from '../paging';
import { ListDesktopPresetComponent } from './desktop/preset/preset.component';
import { ListMasonryGridComponent } from './masonry-grid/masonry-grid.component';
import {
  AlertService,
  AuthService,
  HardwareService,
  ModalService,
} from '../../services';
import { ListMasonryGridPresetComponent } from './masonry-grid/preset/preset.component';
import { ListMobileComponent } from './mobile/mobile.component';
import { ListMobilePresetComponent } from './mobile/preset/preset.component';

@Pipe({ name: 'smartListHeader' })
class MockListHeaderPipe implements PipeTransform {
  transform(_list: unknown, key: string): () => string {
    return () => `label:${key}`;
  }
}

@Pipe({ name: 'smartListCell' })
class MockListCellPipe implements PipeTransform {
  transform(item: Record<string, unknown>, key: string) {
    return { type: 'text', value: String(item[key] ?? '') };
  }
}

@Pipe({ name: 'smartFileUrl' })
class MockFileUrlPipe implements PipeTransform {
  transform(value: unknown): unknown {
    return value;
  }
}

@Pipe({ name: 'translate' })
class MockTranslatePipe implements PipeTransform {
  transform(value: unknown): unknown {
    return value;
  }
}

@Component({ selector: 'smart-paging', template: '' })
class MockPagingComponent {
  currentPage = input<number>();
  totalPages = input<number>();
  pageChange = output<number>();
}

@Component({ selector: 'smart-test-custom-details', template: '' })
class CustomDetailsComponent {}

@Model({})
class Member implements IEntity<string> {
  id = '';

  @Field({ list: { order: 1 } })
  firstName = '';

  @Field({ list: { order: 2 } })
  lastName = '';
}

@Component({
  selector: 'smart-test-list-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgComponentOutlet],
  template: `<ng-container
    *ngComponentOutlet="component(); inputs: { options: options() }"
  />`,
})
class HostComponent {
  component = signal<Type<unknown>>(ListDesktopComponent);
  options = signal<IListInternalOptions<Member>>({} as never);
}

const MODES: Array<[string, Type<ListBaseComponent<Member>>]> = [
  ['desktop', ListDesktopComponent],
  ['desktop preset', ListDesktopPresetComponent],
  ['mobile', ListMobileComponent],
  ['mobile preset', ListMobilePresetComponent],
  ['masonry grid', ListMasonryGridComponent],
  ['masonry grid preset', ListMasonryGridPresetComponent],
];

const DESKTOP_MODES = MODES.slice(0, 2);

const MEMBERS: Member[] = [
  { id: '1', firstName: 'Lindsay', lastName: 'Walton' },
  { id: '2', firstName: 'Courtney', lastName: 'Henry' },
];

describe('@smartsoft001/shared-angular: ListBaseComponent modes', () => {
  let modalService: { show: jest.Mock; dismiss: jest.Mock };
  let hardwareService: { onBackButtonClick: jest.Mock; isMobile: boolean };
  let observers: Array<{
    target?: Element;
    trigger: (isIntersecting: boolean) => void;
    disconnect: jest.Mock;
  }>;

  function provider(): IListProvider<Member> {
    return {
      list: signal(MEMBERS),
      loading: signal(false),
      getData: jest.fn(),
    } as unknown as IListProvider<Member>;
  }

  function detailsProvider(): IDetailsProvider<Member> {
    return {
      getData: jest.fn(),
      clearData: jest.fn(),
      item: signal(MEMBERS[0]),
      loading: signal(false),
    };
  }

  function pagination(
    extra: Partial<IListPaginationOptions> = {},
  ): IListPaginationOptions {
    return {
      mode: PaginationMode.infiniteScroll,
      limit: 2,
      page: signal(1),
      totalPages: signal(3),
      loadNextPage: jest.fn().mockResolvedValue(true),
      loadPrevPage: jest.fn().mockResolvedValue(true),
      ...extra,
    };
  }

  function render(
    component: Type<ListBaseComponent<Member>>,
    options: Partial<IListInternalOptions<Member>> = {},
  ): {
    fixture: ComponentFixture<HostComponent>;
    element: HTMLElement;
    list: ListBaseComponent<Member>;
  } {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.component.set(component);
    fixture.componentInstance.options.set({
      provider: provider(),
      type: Member,
      fields: [
        { key: 'firstName', options: { list: { order: 1 } } },
        { key: 'lastName', options: { list: { order: 2 } } },
      ],
      ...options,
    });
    fixture.detectChanges();
    fixture.detectChanges();

    return {
      fixture,
      element: fixture.nativeElement,
      list: fixture.debugElement.query(By.directive(component))
        .componentInstance,
    };
  }

  beforeEach(async () => {
    observers = [];
    (
      window as unknown as { IntersectionObserver: unknown }
    ).IntersectionObserver = jest.fn(
      (callback: (entries: Array<{ isIntersecting: boolean }>) => void) => {
        const observer: (typeof observers)[number] = {
          trigger: (isIntersecting) => callback([{ isIntersecting }]),
          disconnect: jest.fn(),
        };
        observers.push(observer);

        return {
          observe: (target: Element) => (observer.target = target),
          disconnect: observer.disconnect,
        };
      },
    );
    modalService = {
      show: jest.fn().mockResolvedValue({
        dismiss: jest.fn(),
        onDidDismiss: () => new Promise(() => undefined),
      }),
      dismiss: jest.fn(),
    };
    hardwareService = {
      isMobile: false,
      onBackButtonClick: jest.fn().mockResolvedValue({ remove: jest.fn() }),
    };

    const removedImports = [
      PagingComponent,
      ListHeaderPipe,
      ListCellPipe,
      FileUrlPipe,
      TranslatePipe,
    ];
    const addedImports = [
      MockPagingComponent,
      MockListHeaderPipe,
      MockListCellPipe,
      MockFileUrlPipe,
      MockTranslatePipe,
    ];

    TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: { expectPermissions: () => true } },
        { provide: AlertService, useValue: { show: jest.fn() } },
        { provide: ModalService, useValue: modalService },
        { provide: HardwareService, useValue: hardwareService },
        { provide: TranslateService, useValue: { instant: (k: string) => k } },
      ],
    });

    MODES.forEach(([, component]) =>
      TestBed.overrideComponent(component, {
        remove: { imports: removedImports },
        add: { imports: addedImports },
      }),
    );

    await TestBed.compileComponents();
  });

  afterEach(() => {
    delete (window as unknown as { IntersectionObserver?: unknown })
      .IntersectionObserver;
  });

  describe('details', () => {
    it.each(MODES)(
      '%s: should render no details action without details',
      (_, mode) => {
        const { element } = render(mode);

        expect(element.querySelector('[data-role="details"]')).toBeNull();
      },
    );

    it.each(MODES)('%s: should render a details action per item', (_, mode) => {
      const { element } = render(mode, {
        details: { provider: detailsProvider() },
      });

      expect(element.querySelectorAll('[data-role="details"]')).toHaveLength(2);
    });

    it.each(MODES)(
      '%s: should open the details page of the item in a bottom modal',
      async (_, mode) => {
        const details = detailsProvider();
        const { element, list } = render(mode, {
          details: { provider: details },
        });

        element
          .querySelectorAll<HTMLButtonElement>('[data-role="details"]')[1]
          .click();
        await new Promise((resolve) => setTimeout(resolve));

        expect(details.clearData).toHaveBeenCalledTimes(1);
        expect(modalService.show).toHaveBeenCalledWith(
          expect.objectContaining({
            component: DetailsPage,
            props: { value: list.detailsComponentProps },
            mode: 'bottom',
          }),
        );
        expect(details.getData).toHaveBeenCalledWith('2');
      },
    );

    it.each(MODES)(
      '%s: should open the custom details component',
      async (_, mode) => {
        const { element } = render(mode, {
          details: {
            provider: detailsProvider(),
            component: CustomDetailsComponent,
          },
        });

        element
          .querySelector<HTMLButtonElement>('[data-role="details"]')
          ?.click();
        await new Promise((resolve) => setTimeout(resolve));

        expect(modalService.show).toHaveBeenCalledWith(
          expect.objectContaining({ component: CustomDetailsComponent }),
        );
      },
    );

    it('should pass the item, the type and the handlers to the details page', () => {
      const details = detailsProvider();
      const { list } = render(ListDesktopComponent, {
        details: { provider: details },
      });

      expect(list.detailsComponentProps).toEqual({
        item: details.item,
        type: Member,
        loading: details.loading,
        itemHandler: null,
        removeHandler: null,
        componentFactories: undefined,
      });
    });
  });

  describe('infinite scroll', () => {
    it.each(MODES)(
      '%s: should observe the anchor after the items',
      (_, mode) => {
        const { element } = render(mode, { pagination: pagination() });

        const anchor = element.querySelector('[data-role="infinite-scroll"]');
        expect(anchor).toBeTruthy();
        expect(observers[observers.length - 1].target).toBe(anchor);
      },
    );

    it.each(MODES)(
      '%s: should load the next page when the anchor scrolls into view',
      async (_, mode) => {
        const options = pagination();
        render(mode, { pagination: options });

        observers[observers.length - 1].trigger(true);
        await Promise.resolve();

        expect(options.loadNextPage).toHaveBeenCalledTimes(1);
      },
    );

    it.each(MODES)(
      '%s: should not load the next page twice while it is loading',
      async (_, mode) => {
        const options = pagination({
          loadNextPage: jest.fn(() => new Promise<boolean>(() => undefined)),
        });
        render(mode, { pagination: options });

        observers[observers.length - 1].trigger(true);
        observers[observers.length - 1].trigger(true);
        await Promise.resolve();

        expect(options.loadNextPage).toHaveBeenCalledTimes(1);
      },
    );

    it('should not load the next page while the anchor is hidden', () => {
      const options = pagination();
      render(ListDesktopComponent, { pagination: options });

      observers[observers.length - 1].trigger(false);

      expect(options.loadNextPage).not.toHaveBeenCalled();
    });

    it('should observe the anchor again once a page loaded', () => {
      const options = pagination();
      const { fixture } = render(ListDesktopComponent, { pagination: options });
      const first = observers[observers.length - 1];

      (options.page as WritableSignal<number>).set(2);
      fixture.detectChanges();

      expect(first.disconnect).toHaveBeenCalled();
      expect(observers[observers.length - 1]).not.toBe(first);
    });

    it.each(MODES)(
      '%s: should render no anchor on the last page',
      (_, mode) => {
        const { element } = render(mode, {
          pagination: pagination({ page: signal(3), totalPages: signal(3) }),
        });

        expect(
          element.querySelector('[data-role="infinite-scroll"]'),
        ).toBeNull();
      },
    );

    it.each(MODES)(
      '%s: should render no anchor for a single page',
      (_, mode) => {
        const { element } = render(mode, {
          pagination: pagination({ mode: PaginationMode.singlePage }),
        });

        expect(
          element.querySelector('[data-role="infinite-scroll"]'),
        ).toBeNull();
      },
    );

    it('should disconnect the observer when the list is destroyed', () => {
      const { fixture } = render(ListMobileComponent, {
        pagination: pagination(),
      });
      const observer = observers[observers.length - 1];

      fixture.destroy();

      expect(observer.disconnect).toHaveBeenCalled();
    });

    it('should render without IntersectionObserver', () => {
      delete (window as unknown as { IntersectionObserver?: unknown })
        .IntersectionObserver;

      const { element } = render(ListDesktopComponent, {
        pagination: pagination(),
      });

      expect(
        element.querySelector('[data-role="infinite-scroll"]'),
      ).toBeTruthy();
    });
  });

  describe('sort', () => {
    function headers(element: HTMLElement): HTMLElement[] {
      return Array.from(element.querySelectorAll('th'));
    }

    function sortButton(element: HTMLElement, key: string): HTMLButtonElement {
      return Array.from(
        element.querySelectorAll<HTMLButtonElement>('[data-role="sort"]'),
      ).find((button) =>
        button.textContent?.includes(`label:${key}`),
      ) as HTMLButtonElement;
    }

    it.each(DESKTOP_MODES)(
      '%s: should render plain headers without sort',
      (_, mode) => {
        const { element } = render(mode);

        expect(element.querySelector('[data-role="sort"]')).toBeNull();
        expect(
          headers(element).some((header) => header.hasAttribute('aria-sort')),
        ).toBe(false);
      },
    );

    it.each(DESKTOP_MODES)(
      '%s: should render a sort button per field column',
      (_, mode) => {
        const { element } = render(mode, { sort: true });

        expect(element.querySelectorAll('[data-role="sort"]')).toHaveLength(2);
      },
    );

    it.each(DESKTOP_MODES)(
      '%s: should show the default sort on its header',
      (_, mode) => {
        const { element } = render(mode, {
          sort: { default: 'lastName', defaultDesc: true },
        });

        expect(
          headers(element).map((header) => header.getAttribute('aria-sort')),
        ).toEqual([null, 'descending']);
        expect(sortButton(element, 'lastName').textContent).toContain('↓');
      },
    );

    it.each(DESKTOP_MODES)(
      '%s: should read the data sorted by a clicked column from the first page',
      (_, mode) => {
        const { element, fixture } = render(mode, { sort: true });
        const options = fixture.componentInstance.options();

        sortButton(element, 'firstName').click();
        fixture.detectChanges();

        expect(options.provider.getData).toHaveBeenCalledWith({
          offset: 0,
          sortBy: 'firstName',
          sortDesc: false,
        });
        expect(headers(element)[0].getAttribute('aria-sort')).toBe('ascending');
      },
    );

    it.each(DESKTOP_MODES)(
      '%s: should toggle the direction of the active column',
      (_, mode) => {
        const { element, fixture } = render(mode, {
          sort: { default: 'firstName' },
        });
        const options = fixture.componentInstance.options();

        sortButton(element, 'firstName').click();
        fixture.detectChanges();

        expect(options.provider.getData).toHaveBeenCalledWith({
          offset: 0,
          sortBy: 'firstName',
          sortDesc: true,
        });
        expect(headers(element)[0].getAttribute('aria-sort')).toBe(
          'descending',
        );
      },
    );

    it('should move the sort to another column in ascending order', () => {
      const { element, fixture } = render(ListDesktopComponent, {
        sort: { default: 'firstName', defaultDesc: true },
      });

      sortButton(element, 'lastName').click();
      fixture.detectChanges();

      expect(
        headers(element).map((header) => header.getAttribute('aria-sort')),
      ).toEqual([null, 'ascending']);
    });

    it('should keep the clicked sort when other options change', () => {
      const sort = { default: 'firstName' };
      const { element, fixture } = render(ListDesktopComponent, { sort });

      sortButton(element, 'lastName').click();
      fixture.componentInstance.options.update((options) => ({
        ...options,
        select: 'multi',
      }));
      fixture.detectChanges();

      expect(sortButton(element, 'lastName').textContent).toContain('↑');
    });

    it('should start over from the default when the sort option changes', () => {
      const { element, fixture } = render(ListDesktopComponent, {
        sort: { default: 'firstName' },
      });

      sortButton(element, 'lastName').click();
      fixture.componentInstance.options.update((options) => ({
        ...options,
        sort: { default: 'firstName', defaultDesc: true },
      }));
      fixture.detectChanges();

      expect(headers(element)[0].getAttribute('aria-sort')).toBe('descending');
    });

    it('should not sort the expanded columns of a dynamic field', () => {
      const { list } = render(ListDesktopComponent, { sort: true });

      list.sortBy('__array.tags.0.name.value');

      expect(list.isSortable('__array.tags.0.name.value')).toBe(false);
      expect(list.options().provider.getData).not.toHaveBeenCalled();
    });
  });
});
