import { Location } from '@angular/common';
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

import {
  DetailsService,
  DynamicComponentLoader,
  FormFactory,
  HardwareService,
  StyleService,
  ToastService,
} from '@smartsoft001/angular';
import { Model } from '@smartsoft001/models';

import { ItemComponent } from './item.component';
import { CrudFacade } from '../../+state';
import { CrudFullConfig } from '../../crud.config';
import { CrudService } from '../../services/crud/crud.service';
import { PageService } from '../../services/page/page.service';

@Model({})
class SomeModel {
  id!: string;
}

/**
 * GAP-28/29 — the heavy item page (dynamic-component engine + effect-driven
 * change detection) is integration-tested by the build and the full suite.
 * Here we assert the reliably reachable contract: the styling surface
 * (`config.variant`) is threaded into the `pageOptions()` signal that the
 * restored `<smart-page>` wrapper renders.
 */
describe('crud-shell-angular: ItemComponent (GAP-28 styling surface)', () => {
  function setup(
    config: Partial<CrudFullConfig<any>> = {},
    url = '/some/123',
  ): ComponentFixture<ItemComponent<any>> {
    const facadeMock = {
      selected: signal<any>(null),
      select: jest.fn(),
    };
    const routerMock = {
      routerState: { snapshot: { url } },
      events: of(),
    };
    const activeRouteMock = { params: of({}), queryParams: of({}) };
    const translateMock = {
      currentLang: 'en',
      get: jest.fn().mockReturnValue(of('')),
      instant: jest.fn((k: string) => k),
      onLangChange: of(),
      onTranslationChange: of(),
      onDefaultLangChange: of(),
      onFallbackLangChange: of(),
    };

    TestBed.configureTestingModule({
      imports: [ItemComponent],
      providers: [
        { provide: CrudFacade, useValue: facadeMock },
        { provide: CrudFullConfig, useValue: { type: SomeModel, ...config } },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activeRouteMock },
        { provide: TranslateService, useValue: translateMock },
        { provide: Location, useValue: { back: jest.fn() } },
        { provide: CrudService, useValue: { getList: jest.fn() } },
        {
          provide: DynamicComponentLoader,
          useValue: {
            getComponentsWithFactories: jest.fn().mockResolvedValue([]),
          },
        },
        { provide: StyleService, useValue: { init: jest.fn() } },
        { provide: ToastService, useValue: { info: jest.fn() } },
        { provide: PageService, useValue: { checkPermissions: jest.fn() } },
        { provide: DetailsService, useValue: { init: jest.fn() } },
        { provide: HardwareService, useValue: { isMobile: false } },
        {
          // The add form is built asynchronously; a pending promise renders the
          // chrome without driving the real form engine from a unit test.
          provide: FormFactory,
          useValue: { create: jest.fn(() => new Promise(() => undefined)) },
        },
      ],
    });

    return TestBed.createComponent(ItemComponent<any>);
  }

  it('should thread config.variant into the pageOptions passed to smart-page', () => {
    const fixture = setup({ variant: 'standard' });

    expect(fixture.componentInstance.pageOptions().variant).toBe('standard');
  });

  it('should preserve the back-button / hide-menu page chrome alongside the variant', () => {
    const fixture = setup({ variant: 'standard' });

    const options = fixture.componentInstance.pageOptions();
    expect(options.showBackButton).toBe(true);
    expect(options.hideMenuButton).toBe(true);
  });

  it('should leave variant undefined when config has no variant', () => {
    const fixture = setup();

    expect(fixture.componentInstance.pageOptions().variant).toBeUndefined();
  });

  // FRA-365/1 — the template binds `[detailsOptions]="detailsOptions()"` and
  // `[uniqueProvider]="uniqueProvider()"`, and `refreshProperties()` reads both
  // as functions, so they must be writable signals from construction. They used
  // to be declared with definite assignment and never created, which made the
  // first change detection throw `detailsOptions is not a function` in add,
  // edit and details mode.
  /**
   * Counts how often the constructor effect recomputes the page options while
   * `body` runs. A self-retriggering effect would never stop, so past `cap` the
   * recomputation is skipped: `pageOptions` stops changing, the run ends and
   * the assertion - not a hung worker - reports the defect.
   */
  function countPageOptionRefreshes(
    component: ItemComponent<any>,
    body: () => void,
    cap = 10,
  ): number {
    const refresh = (component as any).initPageOptions.bind(component);
    let refreshes = 0;

    jest.spyOn(component as any, 'initPageOptions').mockImplementation(() => {
      refreshes += 1;

      if (refreshes <= cap) refresh();
    });

    body();

    return refreshes;
  }

  it('should expose detailsOptions as a writable signal from construction', () => {
    const component = setup().componentInstance;

    expect(component.detailsOptions()).toBeUndefined();

    const options = { type: SomeModel } as any;
    component.detailsOptions.set(options);
    expect(component.detailsOptions()).toBe(options);
  });

  it('should expose uniqueProvider as a writable signal from construction', () => {
    const component = setup().componentInstance;

    expect(component.uniqueProvider()).toBeUndefined();

    const provider = async () => true;
    component.uniqueProvider.set(provider);
    expect(component.uniqueProvider()).toBe(provider);
  });

  // FRA-365/2 — the constructor effect calls `initPageOptions()`, which used to
  // read `pageOptions()` inside that reactive context and then write the same
  // signal. The effect re-triggered itself forever, so the first change
  // detection never returned and the item page froze the browser tab.
  it('should recompute the page options once per change detection', () => {
    const fixture = setup({ details: true });

    const refreshes = countPageOptionRefreshes(fixture.componentInstance, () =>
      fixture.detectChanges(),
    );

    expect(refreshes).toBe(1);
  });

  // FRA-365/3 — `generateComponents()` asks the top and bottom anchors for
  // their content with `get(0)` and fills them with `createComponent()`, which
  // is the `ViewContainerRef` API. The anchors are plain `div` elements, so
  // declaring them as `viewChild<ViewContainerRef>` handed back an `ElementRef`
  // and every add/edit init rejected with `get is not a function`.
  it('should resolve generateComponents against the top and bottom anchors', async () => {
    const fixture = setup({ details: true });
    fixture.detectChanges();

    await expect(
      fixture.componentInstance['generateComponents']('add'),
    ).resolves.toBeUndefined();
  });

  // The three defects above each broke this: `detailsOptions is not a
  // function` on the first binding, then a change detection that never
  // returned, then a rejected `generateComponents('add')`.
  it('should render the page wrapper in add mode on first change detection', () => {
    const fixture = setup({ add: true }, '/articles/add');

    expect(() => fixture.detectChanges()).not.toThrow();

    expect(fixture.nativeElement.querySelector('smart-page')).toBeTruthy();
  });
});
