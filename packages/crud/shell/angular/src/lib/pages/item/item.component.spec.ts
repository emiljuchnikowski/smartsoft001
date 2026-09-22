import { Location } from '@angular/common';
import { Component, input, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormControl, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

import {
  DetailsService,
  DYNAMIC_COMPONENTS_STORE,
  DynamicComponentLoader,
  DynamicComponentType,
  FORM_STANDARD_COMPONENT_TOKEN,
  FormComponent,
  FormFactory,
  HardwareService,
  IIconButtonOptions,
  SmartFormGroup,
  StyleService,
  ToastService,
} from '@smartsoft001/angular';
import { Field, Model } from '@smartsoft001/models';

import { CrudItemPageBaseComponent } from './base/base.component';
import { ItemComponent } from './item.component';
import { CrudFacade } from '../../+state';
import { CrudFullConfig } from '../../crud.config';
import { CrudService } from '../../services/crud/crud.service';
import { PageService } from '../../services/page/page.service';

@Model({})
class SomeModel {
  id!: string;

  @Field({ create: true, update: true })
  name!: string;
}

/**
 * Stands in for the input engine behind `<smart-form>`. The form body is not
 * under test here; the page only needs the reactive form to exist.
 */
@Component({ selector: 'test-form-body', template: '' })
class FormBodyStubComponent {
  options = input<unknown>();
  form = input<unknown>();
  cssClass = input('', { alias: 'class' });
}

/**
 * A body registered for the `crud-item-page` dynamic component key. It has no
 * `#contentTpl` anchor on purpose: the engine only projects the page content
 * into a body that declares one.
 */
@Component({
  selector: 'test-custom-item-body',
  template: '<p class="custom-item-body">custom body</p>',
})
class CustomItemBodyComponent extends CrudItemPageBaseComponent<any> {
  static override smartType: DynamicComponentType = 'crud-item-page';
}

interface SetupOptions {
  url?: string;
  params?: Record<string, string>;
  selected?: unknown;
  /** Resolve the form factory with a real group instead of leaving it pending. */
  buildForm?: boolean;
  /** Components registered for the dynamic component keys. */
  store?: unknown[];
}

interface Mounted {
  fixture: ComponentFixture<ItemComponent<any>>;
  facadeMock: {
    create: jest.Mock;
    updatePartial: jest.Mock;
    select: jest.Mock;
  };
  toastMock: { info: jest.Mock };
}

function buildForm(): SmartFormGroup {
  const form = SmartFormGroup.create();
  form.addControl('name', new UntypedFormControl(null, Validators.required));
  return form;
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
    {
      url = '/some/123',
      params = {},
      selected = null,
      buildForm: withForm = false,
      store,
    }: SetupOptions = {},
  ): Mounted {
    const facadeMock = {
      selected: signal<any>(selected),
      select: jest.fn(),
      create: jest.fn(),
      updatePartial: jest.fn(),
    };
    const routerMock = {
      routerState: { snapshot: { url } },
      events: of(),
    };
    const activeRouteMock = { params: of(params), queryParams: of({}) };
    const translateMock = {
      currentLang: 'en',
      get: jest.fn().mockReturnValue(of('')),
      instant: jest.fn((k: string) => k),
      onLangChange: of(),
      onTranslationChange: of(),
      onDefaultLangChange: of(),
      onFallbackLangChange: of(),
    };
    const toastMock = { info: jest.fn() };

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
        { provide: ToastService, useValue: toastMock },
        { provide: PageService, useValue: { checkPermissions: jest.fn() } },
        { provide: DetailsService, useValue: { init: jest.fn() } },
        { provide: HardwareService, useValue: { isMobile: false } },
        {
          // The add form is built asynchronously. By default the promise stays
          // pending, which renders the chrome without driving the real form
          // engine; the submit tests ask for a real group instead.
          provide: FormFactory,
          useValue: {
            create: jest.fn(() =>
              withForm
                ? Promise.resolve(buildForm())
                : new Promise(() => undefined),
            ),
          },
        },
        {
          provide: FORM_STANDARD_COMPONENT_TOKEN,
          useValue: FormBodyStubComponent,
        },
        ...(store
          ? [{ provide: DYNAMIC_COMPONENTS_STORE, useValue: store }]
          : []),
      ],
    });

    return {
      fixture: TestBed.createComponent(ItemComponent<any>),
      facadeMock,
      toastMock,
    };
  }

  /**
   * Runs change detection, lets the async init (`generateComponents`, the
   * form factory promise) settle, and renders the result.
   */
  async function settle(fixture: ComponentFixture<ItemComponent<any>>) {
    fixture.detectChanges();
    await new Promise((resolve) => setTimeout(resolve));
    fixture.detectChanges();
  }

  function formOf(
    fixture: ComponentFixture<ItemComponent<any>>,
  ): SmartFormGroup {
    return fixture.debugElement.query(By.directive(FormComponent))
      .componentInstance.form;
  }

  function buttonOf(
    fixture: ComponentFixture<ItemComponent<any>>,
    text: string,
  ): IIconButtonOptions {
    const button = fixture.componentInstance
      .pageOptions()
      .endButtons?.find((b) => b.text === text);

    if (!button) throw new Error(`no "${text}" button on the page`);

    return button;
  }

  it('should thread config.variant into the pageOptions passed to smart-page', () => {
    const { fixture } = setup({ variant: 'standard' });

    expect(fixture.componentInstance.pageOptions().variant).toBe('standard');
  });

  it('should preserve the back-button / hide-menu page chrome alongside the variant', () => {
    const { fixture } = setup({ variant: 'standard' });

    const options = fixture.componentInstance.pageOptions();
    expect(options.showBackButton).toBe(true);
    expect(options.hideMenuButton).toBe(true);
  });

  it('should leave variant undefined when config has no variant', () => {
    const { fixture } = setup();

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
    const component = setup().fixture.componentInstance;

    expect(component.detailsOptions()).toBeUndefined();

    const options = { type: SomeModel } as any;
    component.detailsOptions.set(options);
    expect(component.detailsOptions()).toBe(options);
  });

  it('should expose uniqueProvider as a writable signal from construction', () => {
    const component = setup().fixture.componentInstance;

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
    const { fixture } = setup({ details: true });

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
    const { fixture } = setup({ details: true });
    fixture.detectChanges();

    await expect(
      fixture.componentInstance['generateComponents']('add'),
    ).resolves.toBeUndefined();
  });

  // The three defects above each broke this: `detailsOptions is not a
  // function` on the first binding, then a change detection that never
  // returned, then a rejected `generateComponents('add')`.
  it('should render the page wrapper in add mode on first change detection', () => {
    const { fixture } = setup({ add: true }, { url: '/articles/add' });

    expect(() => fixture.detectChanges()).not.toThrow();

    expect(fixture.nativeElement.querySelector('smart-page')).toBeTruthy();
  });

  // FRA-385 — every add and every save runs through `checkFirstInvalid()`,
  // which used to read `standardComponents()[0].formComponents?.[0]?.form`.
  // `formComponents` is a `viewChildren` signal, not an array, so `[0]` was
  // `undefined` and `form.valid` threw before the facade was ever called.
  describe('submitting the form (FRA-385)', () => {
    it('should create the record from the form value in add mode', async () => {
      const { fixture, facadeMock } = setup(
        { add: true },
        { url: '/articles/add', buildForm: true },
      );
      await settle(fixture);

      formOf(fixture).controls['name'].setValue('Alpha');
      buttonOf(fixture, 'add').handler?.();

      expect(facadeMock.create).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Alpha' }),
      );
    });

    it('should send a partial update carrying the id in edit mode', async () => {
      const { fixture, facadeMock } = setup(
        { edit: true },
        {
          url: '/articles/123',
          params: { id: '123' },
          selected: { id: '123', name: 'Old' },
          buildForm: true,
        },
      );
      await settle(fixture);

      const name = formOf(fixture).controls['name'];
      name.markAsDirty();
      name.setValue('New');
      buttonOf(fixture, 'save').handler?.();

      expect(facadeMock.updatePartial).toHaveBeenCalledWith({
        name: 'New',
        id: '123',
      });
    });

    it('should report the invalid controls instead of creating when the form is invalid', async () => {
      const { fixture, facadeMock, toastMock } = setup(
        { add: true },
        { url: '/articles/add', buildForm: true },
      );
      await settle(fixture);

      buttonOf(fixture, 'add').handler?.();

      expect(facadeMock.create).not.toHaveBeenCalled();
      expect(toastMock.info).toHaveBeenCalledTimes(1);
      expect(toastMock.info.mock.calls[0][0].message).toContain('MODEL.name');
    });
  });

  // FRA-385 — the `.dynamic-content` anchor is only matched by
  // `DynamicContentDirective` when the directive is in the component imports.
  // Without it `dynamicContents()` stayed empty and a body registered for the
  // `crud-item-page` key was never created.
  describe('crud-item-page extension point (FRA-385)', () => {
    it('should render a body registered for the crud-item-page key', async () => {
      const { fixture } = setup(
        { add: true },
        { url: '/articles/add', store: [CustomItemBodyComponent] },
      );
      await settle(fixture);
      await settle(fixture);

      expect(fixture.componentInstance.template()).toBe('custom');
      expect(
        fixture.nativeElement.querySelector('.custom-item-body'),
      ).toBeTruthy();
    });
  });
});
