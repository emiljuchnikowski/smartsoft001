import { Location } from '@angular/common';
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

import {
  AuthService,
  DetailsService,
  DynamicComponentLoader,
  FormComponent,
  FORM_STANDARD_COMPONENT_TOKEN,
  FormFactory,
  FormStandardComponent,
  HardwareService,
  IIconButtonOptions,
  MODEL_VALIDATORS_PROVIDER,
  StyleService,
  ToastService,
} from '@smartsoft001/angular';
import { Field, FieldType, Model } from '@smartsoft001/models';

import { ItemComponent } from './item.component';
import { CrudFacade } from '../../+state';
import { CrudFullConfig } from '../../crud.config';
import { CrudService } from '../../services/crud/crud.service';
import { PageService } from '../../services/page/page.service';

@Model({})
class NoteModel {
  id!: string;

  @Field({ type: FieldType.text, create: { required: true }, update: true })
  title!: string;
}

interface Mounted {
  fixture: ComponentFixture<ItemComponent<any>>;
  facadeMock: { create: jest.Mock; updatePartial: jest.Mock };
  toastMock: { info: jest.Mock };
}

/**
 * FRA-388 — the FRA-385 spec drives the page with a `FormFactory` mock that
 * hands back one stable group and a stubbed form body, so the group the page
 * validates and the group the inputs write to are one and the same there.
 * This spec mounts the real form engine: `FormComponent`,
 * `FormStandardComponent`, `InputComponent` and the real `FormFactory`, and
 * drives the page the way a user does, through the rendered input.
 */
describe('crud-shell-angular: ItemComponent with the real form engine (FRA-388)', () => {
  // The first case pays for compiling the whole form engine, which on a
  // machine that is also running the rest of the workspace's suites took
  // longer than Jest's default five seconds (FRA-390). The budget matches
  // what the spec mounts; the assertions themselves settle in milliseconds.
  jest.setTimeout(30_000);

  const fixtures: ComponentFixture<ItemComponent<any>>[] = [];

  afterEach(() => {
    fixtures.splice(0).forEach((fixture) => fixture.destroy());
  });

  function setup(
    config: Partial<CrudFullConfig<any>>,
    {
      url,
      params = {},
      selected = null,
    }: { url: string; params?: Record<string, string>; selected?: unknown },
  ): Mounted {
    const facadeMock = {
      selected: signal<any>(selected),
      select: jest.fn(),
      create: jest.fn(),
      updatePartial: jest.fn(),
    };
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
        { provide: CrudFullConfig, useValue: { type: NoteModel, ...config } },
        {
          provide: Router,
          useValue: { routerState: { snapshot: { url } }, events: of() },
        },
        {
          provide: ActivatedRoute,
          useValue: { params: of(params), queryParams: of({}) },
        },
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
        {
          provide: DetailsService,
          useValue: { init: jest.fn(), setRoot: jest.fn() },
        },
        { provide: HardwareService, useValue: { isMobile: false } },
        // SharedComponentsModule registers the standard body under this token,
        // so every application renders the form body through the outlet.
        {
          provide: FORM_STANDARD_COMPONENT_TOKEN,
          useValue: FormStandardComponent,
        },
        // The real factory, wired the way its own spec wires it.
        FormFactory,
        { provide: MODEL_VALIDATORS_PROVIDER, useValue: null },
        { provide: AuthService, useValue: { expectPermissions: () => true } },
      ],
    });

    const fixture = TestBed.createComponent(ItemComponent<any>);
    fixtures.push(fixture);

    return { fixture, facadeMock, toastMock };
  }

  /**
   * Runs change detection and lets every pending microtask and macrotask of
   * the page init settle: `generateComponents`, the `uniqueProvider` write
   * that follows it, and each `FormFactory.create` promise.
   */
  async function settle(fixture: ComponentFixture<ItemComponent<any>>) {
    for (let round = 0; round < 4; round++) {
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve));
    }
    fixture.detectChanges();
  }

  function typeInto(
    fixture: ComponentFixture<ItemComponent<any>>,
    value: string,
  ): void {
    const input = fixture.nativeElement.querySelector(
      'input[type="text"]',
    ) as HTMLInputElement | null;

    if (!input) throw new Error('no text input rendered');

    input.value = value;
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
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

  it('should create the record with the value typed into the rendered input in add mode', async () => {
    const { fixture, facadeMock } = setup({ add: true }, { url: '/notes/add' });
    await settle(fixture);

    typeInto(fixture, 'Alpha');
    buttonOf(fixture, 'add').handler?.();

    expect(facadeMock.create).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Alpha' }),
    );
  });

  it('should render the inputs of the same group the page validates in add mode', async () => {
    const { fixture } = setup({ add: true }, { url: '/notes/add' });
    await settle(fixture);

    const wrapper = fixture.debugElement.query(By.directive(FormComponent))
      .componentInstance as FormComponent<NoteModel>;
    const standard = fixture.debugElement.query(
      By.directive(FormStandardComponent),
    ).componentInstance as FormStandardComponent<NoteModel>;

    expect(standard.form()).toBe(wrapper.form);
  });

  it('should build the create form once in add mode', async () => {
    const { fixture } = setup({ add: true }, { url: '/notes/add' });
    const spy = jest.spyOn(TestBed.inject(FormFactory), 'create');

    await settle(fixture);

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should send the value typed into the rendered input as a partial update in edit mode', async () => {
    const { fixture, facadeMock } = setup(
      { edit: true },
      {
        url: '/notes/123',
        params: { id: '123' },
        selected: { id: '123', title: 'Old' },
      },
    );
    await settle(fixture);

    typeInto(fixture, 'New');
    buttonOf(fixture, 'save').handler?.();

    expect(facadeMock.updatePartial).toHaveBeenCalledWith({
      title: 'New',
      id: '123',
    });
  });
});
