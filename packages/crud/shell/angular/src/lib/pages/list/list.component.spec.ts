import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import {
  DynamicComponentLoader,
  HardwareService,
  MenuService,
} from '@smartsoft001/angular';
import { Model } from '@smartsoft001/models';

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
 * GAP-27 — the list page is integration-heavy (dynamic-component engine,
 * Store, Router, pagination factory). The build + full suite cover wiring;
 * here we assert the reliably reachable contract: `ngOnInit` threads
 * `config.variant` into the `pageOptions()` signal that the restored
 * `<smart-page>` wrapper renders. `pageOptions.set(...)` runs synchronously
 * at the top of `ngOnInit`, before the first `await`, so we read it without
 * resolving the heavy async tail.
 */
describe('crud-shell-angular: ListComponent (GAP-27 styling surface)', () => {
  function setup(config: Partial<CrudFullConfig<any>> = {}): {
    fixture: ComponentFixture<ListComponent<any>>;
    ngOnInit: () => void;
  } {
    const facadeMock = {
      links: signal<any>(null),
      filter: signal<any>(undefined),
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
            list: { paginationMode: undefined },
            ...config,
          },
        },
        { provide: Router, useValue: routerMock },
        {
          provide: MenuService,
          useValue: { openEnd: jest.fn(), closeEnd: jest.fn() },
        },
        { provide: HardwareService, useValue: { isMobile: false } },
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
      ],
    });

    const fixture = TestBed.createComponent(ListComponent<any>);
    // Fire ngOnInit without awaiting its heavy async tail; pageOptions is set
    // synchronously before the first await. The tail (pagination factory etc.)
    // is exercised by the build + full suite, so swallow its rejection here.
    return {
      fixture,
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
});
