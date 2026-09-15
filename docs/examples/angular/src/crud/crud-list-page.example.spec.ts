import { signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import {
  DynamicComponentLoader,
  HardwareService,
  MenuService,
  SharedModule,
} from '@smartsoft001/angular';
import {
  CrudFacade,
  CrudFullConfig,
  CrudListPaginationFactory,
  CrudSearchService,
  ICrudFilter,
  ListComponent,
  PageService,
} from '@smartsoft001/crud-shell-angular';

import { Note, noteCrudConfig } from './crud-config.example';
import { NotesPageComponent } from './crud-list-page.example';

/**
 * The list page is integration-heavy: it drives the NgRx facade, the dynamic
 * component engine, the router and the pagination factory. Mocking the facade
 * keeps the example free of HTTP and of a real store while still rendering the
 * whole page, so the docs snippet cannot drift from the shipped markup.
 */
interface FacadeMock {
  links: WritableSignal<unknown>;
  filter: WritableSignal<ICrudFilter | undefined>;
  list: WritableSignal<Note[]>;
  loaded: WritableSignal<boolean>;
  loading: WritableSignal<boolean>;
  selected: WritableSignal<Note | undefined>;
  totalCount: WritableSignal<number>;
  read: jest.Mock;
  multiSelect: jest.Mock;
  select: jest.Mock;
  unselect: jest.Mock;
  delete: jest.Mock;
}

describe('docs-examples-angular: NotesPageComponent', () => {
  let fixture: ComponentFixture<NotesPageComponent>;
  let facadeMock: FacadeMock;

  beforeEach(async () => {
    facadeMock = {
      links: signal<unknown>(null),
      filter: signal<ICrudFilter | undefined>({ limit: 25, offset: 0 }),
      list: signal<Note[]>([]),
      loaded: signal(true),
      loading: signal(false),
      selected: signal<Note | undefined>(undefined),
      totalCount: signal(0),
      read: jest.fn(),
      multiSelect: jest.fn(),
      select: jest.fn(),
      unselect: jest.fn(),
      delete: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [NotesPageComponent, SharedModule, TranslateModule.forRoot()],
      providers: [
        { provide: CrudFacade, useValue: facadeMock },
        { provide: CrudFullConfig, useValue: noteCrudConfig },
        {
          provide: Router,
          useValue: {
            routerState: { snapshot: { url: '/notes' } },
            events: of(),
            navigate: jest.fn(),
          },
        },
        {
          provide: MenuService,
          useValue: { openEnd: jest.fn(), closeEnd: jest.fn() },
        },
        { provide: HardwareService, useValue: { isMobile: false } },
        CrudListPaginationFactory,
        { provide: PageService, useValue: { checkPermissions: jest.fn() } },
        { provide: CrudSearchService, useValue: { filter: undefined } },
        {
          provide: DynamicComponentLoader,
          useValue: {
            getComponentsWithFactories: jest.fn().mockResolvedValue([]),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NotesPageComponent);
    fixture.detectChanges();
  });

  function listPage(): ListComponent<Note> {
    return fixture.debugElement.children[0]
      .componentInstance as ListComponent<Note>;
  }

  it('should place the crud list page in the host template', () => {
    expect(
      fixture.nativeElement.querySelector('smart-crud-list-page'),
    ).not.toBeNull();
  });

  it('should load the collection through the facade on init', () => {
    expect(facadeMock.read).toHaveBeenCalledTimes(1);
  });

  it('should read with the page size taken from the config', () => {
    expect(facadeMock.read.mock.calls[0][0].limit).toBe(25);
  });

  it('should thread the config title into the page options', () => {
    expect(listPage().pageOptions()?.title).toBe('Notes');
  });

  it('should enable the search box because the config sets search', () => {
    expect(listPage().pageOptions()?.search).toBeDefined();
  });

  it('should render the shared page shell around the generated list', () => {
    expect(fixture.nativeElement.querySelector('smart-page')).not.toBeNull();
  });

  it('should render a table column per field marked list in the model', () => {
    const headers = fixture.nativeElement.querySelectorAll('th');

    expect(headers.length).toBeGreaterThanOrEqual(2);
  });
});
