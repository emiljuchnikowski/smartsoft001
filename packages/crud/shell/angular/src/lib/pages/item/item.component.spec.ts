import { Location } from '@angular/common';
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

import {
  DetailsService,
  DynamicComponentLoader,
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
  ): ComponentFixture<ItemComponent<any>> {
    const facadeMock = {
      selected: signal<any>(null),
      select: jest.fn(),
    };
    const routerMock = {
      routerState: { snapshot: { url: '/some/123' } },
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
});
