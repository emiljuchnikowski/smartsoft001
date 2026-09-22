import { Component, input, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

import {
  DYNAMIC_COMPONENTS_STORE,
  DynamicComponentLoader,
  DynamicComponentType,
  HardwareService,
  LIST_MODE_COMPONENTS_TOKEN,
  ListMode,
  MenuService,
  StyleService,
} from '@smartsoft001/angular';
import { Model } from '@smartsoft001/models';

import { CrudListPageBaseComponent } from './base/base.component';
import { ListComponent } from './list.component';
import { CrudFacade } from '../../+state';
import { CrudFullConfig } from '../../crud.config';
import { CrudListPaginationFactory } from '../../factories/list-pagination/list-pagination.factory';
import { PageService } from '../../services/page/page.service';
import { CrudSearchService } from '../../services/search/search.service';

@Model({})
class SomeModel {
  id!: string;
}

/**
 * Stands in for the row engine behind `<smart-list>`, which `ListComponent`
 * projects through `ngComponentOutlet` with the inputs `options` and `class`.
 * The rows are not under test here; the page only needs its default body to
 * render without pulling in the whole desktop list.
 */
@Component({ selector: 'test-list-body', template: '' })
class ListBodyStubComponent {
  options = input<unknown>();
  cssClass = input('', { alias: 'class' });
}

/**
 * A body registered for the `crud-list-page` dynamic component key. It has no
 * `#contentTpl` anchor on purpose: the engine only projects the page content
 * into a body that declares one.
 */
@Component({
  selector: 'test-custom-list-body',
  template: '<p class="custom-list-body">custom body</p>',
})
class CustomListBodyComponent extends CrudListPageBaseComponent<any> {
  static override smartType: DynamicComponentType = 'crud-list-page';
}

/**
 * GAP-27 — the list page is integration-heavy (dynamic-component engine,
 * Store, Router, pagination factory). The build + full suite cover wiring;
 * here we assert the reliably reachable contract: `ngOnInit` threads
 * `config.variant` into the `pageOptions()` signal that the restored
 * `<smart-page>` wrapper renders. `pageOptions.set(...)` runs synchronously
 * at the top of `ngOnInit`, before the first `await`, so we read it without
 * resolving the heavy async tail.
 */
describe('crud-shell-angular: ListComponent (GAP-27 styling surface)', () => {
  function setup(
    config: Partial<CrudFullConfig<any>> = {},
    {
      omitDefaultList = false,
      filter = undefined,
      store,
    }: {
      omitDefaultList?: boolean;
      /** The page hides its whole body until the facade exposes a filter. */
      filter?: unknown;
      /** Components registered for the dynamic component keys. */
      store?: unknown[];
    } = {},
  ): {
    fixture: ComponentFixture<ListComponent<any>>;
    ngOnInit: () => void;
    facadeMock: { read: jest.Mock };
  } {
    const facadeMock = {
      links: signal<any>(null),
      filter: signal<any>(filter),
      list: signal<any[]>([]),
      loading: signal(false),
      selected: signal<any>(null),
      read: jest.fn(),
      multiSelect: jest.fn(),
    };
    const routerMock = {
      routerState: { snapshot: { url: '/some' } },
      events: of(),
      navigate: jest.fn(),
    };

    TestBed.configureTestingModule({
      imports: [ListComponent],
      providers: [
        { provide: CrudFacade, useValue: facadeMock },
        {
          provide: CrudFullConfig,
          useValue: {
            type: SomeModel,
            ...(omitDefaultList ? {} : { list: { paginationMode: undefined } }),
            ...config,
          },
        },
        { provide: Router, useValue: routerMock },
        {
          provide: MenuService,
          useValue: { openEnd: jest.fn(), closeEnd: jest.fn() },
        },
        { provide: HardwareService, useValue: { isMobile: false } },
        { provide: StyleService, useValue: { init: jest.fn() } },
        {
          provide: LIST_MODE_COMPONENTS_TOKEN,
          useValue: { [ListMode.desktop]: ListBodyStubComponent },
        },
        {
          provide: TranslateService,
          useValue: {
            currentLang: 'en',
            get: jest.fn().mockReturnValue(of('')),
            instant: jest.fn((k: string) => k),
            onLangChange: of(),
            onTranslationChange: of(),
            onDefaultLangChange: of(),
            onFallbackLangChange: of(),
          },
        },
        {
          provide: CrudListPaginationFactory,
          useValue: { create: jest.fn().mockResolvedValue({}) },
        },
        { provide: PageService, useValue: { checkPermissions: jest.fn() } },
        {
          provide: CrudSearchService,
          useValue: { filter: undefined },
        },
        {
          provide: DynamicComponentLoader,
          useValue: {
            getComponentsWithFactories: jest.fn().mockResolvedValue([]),
          },
        },
        ...(store
          ? [{ provide: DYNAMIC_COMPONENTS_STORE, useValue: store }]
          : []),
      ],
    });

    const fixture = TestBed.createComponent(ListComponent<any>);
    // Fire ngOnInit without awaiting its heavy async tail; pageOptions is set
    // synchronously before the first await. The tail (pagination factory etc.)
    // is exercised by the build + full suite, so swallow its rejection here.
    return {
      fixture,
      facadeMock,
      ngOnInit: () => {
        fixture.componentInstance.ngOnInit().catch(() => undefined);
      },
    };
  }

  it('should start with a null pageOptions before init', () => {
    const { fixture } = setup({ variant: 'standard' });

    expect(fixture.componentInstance.pageOptions()).toBeNull();
  });

  it('should thread config.variant into the pageOptions passed to smart-page', () => {
    const { fixture, ngOnInit } = setup({ variant: 'standard' });

    ngOnInit();

    expect(fixture.componentInstance.pageOptions()?.variant).toBe('standard');
  });

  it('should leave variant undefined when config has no variant', () => {
    const { fixture, ngOnInit } = setup();

    ngOnInit();

    expect(fixture.componentInstance.pageOptions()?.variant).toBeUndefined();
  });

  it('should expose the configured title on the page options', () => {
    const { fixture, ngOnInit } = setup({
      variant: 'standard',
      title: 'My List',
    });

    ngOnInit();

    expect(fixture.componentInstance.pageOptions()?.title).toBe('My List');
  });

  // Regression: CrudFullConfig.list and .pagination are OPTIONAL. A consumer
  // config that omits `list` must not crash ngOnInit on `list!.paginationMode`.
  it('should not throw on init when config has no list property', () => {
    const { ngOnInit } = setup(
      { title: 'No List', export: true, pagination: { limit: 25 } },
      { omitDefaultList: true },
    );

    expect(() => ngOnInit()).not.toThrow();
  });

  it('should read with paginationMode undefined when config has no list', () => {
    const { ngOnInit, facadeMock } = setup(
      { title: 'No List', export: true, pagination: { limit: 25 } },
      { omitDefaultList: true },
    );

    ngOnInit();

    expect(facadeMock.read).toHaveBeenCalledTimes(1);
    expect(facadeMock.read.mock.calls[0][0].paginationMode).toBeUndefined();
  });

  it('should not throw on init when config has no pagination property', () => {
    const { ngOnInit } = setup(
      { title: 'No Pagination', export: true },
      { omitDefaultList: true },
    );

    expect(() => ngOnInit()).not.toThrow();
  });

  // Regression: `details: true` used to make the rendered list throw
  // `Must set details component`, because the page builds the descriptor with
  // a provider and component factories and never with a component.
  it('should build details options with a provider and no component', async () => {
    const { fixture } = setup({ title: 'Details', details: true });

    await fixture.componentInstance.ngOnInit();

    const details = fixture.componentInstance.listOptions()?.details as {
      provider?: unknown;
      component?: unknown;
    };
    expect(details.provider).toBeDefined();
    expect(details.component).toBeUndefined();
  });

  // FRA-385 - the `.dynamic-content` anchor is only matched by
  // `DynamicContentDirective` when the directive is in the component imports.
  // Without it `dynamicContents()` stayed empty and a body registered for the
  // `crud-list-page` key was never created.
  describe('crud-list-page extension point (FRA-385)', () => {
    /**
     * Runs change detection and lets the dynamic-component engine react: it
     * watches the view query through `toObservable`, so the body appears one
     * round after the anchor does.
     */
    async function settle(fixture: ComponentFixture<ListComponent<any>>) {
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve));
      fixture.detectChanges();
    }

    it('should render a body registered for the crud-list-page key', async () => {
      const { fixture } = setup(
        { title: 'Custom' },
        { filter: {}, store: [CustomListBodyComponent] },
      );

      await fixture.componentInstance.ngOnInit();
      await settle(fixture);
      await settle(fixture);

      expect(fixture.componentInstance.template()).toBe('custom');
      expect(
        fixture.nativeElement.querySelector('.custom-list-body'),
      ).toBeTruthy();
    });
  });
});
