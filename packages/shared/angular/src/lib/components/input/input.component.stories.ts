import { CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import {
  AbstractControl,
  ReactiveFormsModule,
  UntypedFormArray,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, moduleMetadata } from '@storybook/angular';

import { IAddress } from '@smartsoft001/domain-core';
import { Field, FieldType, FieldTypeDef, Model } from '@smartsoft001/models';

import { provideStorybookTranslations } from '../../../../.storybook/storybook-translations';
import { SharedFactoriesModule } from '../../factories';
import { InputOptions } from '../../models';
import {
  IModelLabelProvider,
  IModelValidatorsOptions,
  MODEL_VALIDATORS_PROVIDER,
} from '../../providers';
import { FileService } from '../../services';
import {
  FORM_COMPONENT_TOKEN,
  INPUT_FIELD_COMPONENTS_TOKEN,
} from '../../shared.inectors';
import { COMPONENTS, IMPORTS } from '../components.module';
import { FormComponent } from '../form';
import { InputErrorPresetComponent } from './error/preset/preset.component';
import { INPUT_PRESET_FIELD_COMPONENTS } from './preset-fields';

// ─── Fixtures ────────────────────────────────────────────────────────────────

enum CategoryEnum {
  News = 'News',
  Tutorial = 'Tutorial',
  Guide = 'Guide',
}

@Model({})
class ItemModel {
  @Field({ type: FieldType.text }) name = '';
}

@Model({})
class ProfileModel {
  @Field({ type: FieldType.text }) nickname = '';
  @Field({ type: FieldType.email }) contact = '';
}

// A single model carrying one field per FieldType. <smart-input> derives each
// field's IFieldOptions from this model via getModelFieldOptions(model, key),
// so the decorator metadata here is what drives labels, `required` markers,
// enum possibilities and file `accept` filters.
@Model({})
class AllFieldsModel {
  @Field({ type: FieldType.text }) name = '';
  @Field({ type: FieldType.longText }) description = '';
  @Field({ type: FieldType.email }) email = '';
  @Field({ type: FieldType.password, required: true }) password = '';

  @Field({ type: FieldType.int }) age = 0;
  @Field({ type: FieldType.float }) price = 0;
  @Field({ type: FieldType.currency }) amount = 0;
  @Field({ type: FieldType.ints }) ids: number[] = [];

  @Field({ type: FieldType.nip }) nip = '';
  @Field({ type: FieldType.pesel }) pesel = '';
  @Field({ type: FieldType.phoneNumber }) phone = '';
  @Field({ type: FieldType.phoneNumberPl }) phonePl = '';

  @Field({ type: FieldType.enum, possibilities: CategoryEnum })
  categories: CategoryEnum[] = [];

  // InputRadioComponent reads options.possibilities; the decorator record is
  // what the label/validation layer uses.
  @Field({
    type: FieldType.radio,
    possibilities: { Aktywny: 1, Nieaktywny: 2, Oczekujący: 3 },
  })
  status = 1;

  @Field({ type: FieldType.check }) tags: string[] = [];
  @Field({ type: FieldType.strings }) labels: string[] = [];
  @Field({ type: FieldType.flag }) active = true;

  @Field({ type: FieldType.date }) startDate = '';
  @Field({ type: FieldType.dateWithEdit }) dateEdit = '';
  @Field({ type: FieldType.dateRange }) range: any = null;

  @Field({ type: FieldType.file, possibilities: '.pdf,.docx' } as any)
  file: any = null;

  @Field({ type: FieldType.image }) image: any = null;
  @Field({ type: FieldType.pdf }) document: any = null;

  @Field({ type: FieldType.attachment, possibilities: '.pdf,.doc,.zip' } as any)
  attachment: any = null;

  @Field({ type: FieldType.video }) clip: any = null;
  @Field({ type: FieldType.logo }) logo = '';
  @Field({ type: FieldType.color }) color = '#4f46e5';

  @Field({ type: FieldType.address }) address!: IAddress;

  @Field({ type: FieldType.object, classType: ProfileModel } as any)
  profile = new ProfileModel();

  @Field({ type: FieldType.array, classType: ItemModel } as any)
  items: ItemModel[] = [];
}

class MockModelLabelProvider extends IModelLabelProvider {
  private labels: Record<string, string> = {
    name: 'Nazwa',
    description: 'Opis',
    email: 'Email',
    password: 'Hasło',
    age: 'Wiek',
    price: 'Cena',
    amount: 'Kwota',
    ids: 'Identyfikatory',
    nip: 'NIP',
    pesel: 'PESEL',
    phone: 'Telefon',
    phonePl: 'Telefon PL',
    categories: 'Kategorie',
    status: 'Status',
    tags: 'Tagi',
    labels: 'Etykiety',
    active: 'Aktywny',
    startDate: 'Data rozpoczęcia',
    dateEdit: 'Data (ręczna edycja)',
    range: 'Zakres dat',
    file: 'File upload',
    image: 'Profile photo',
    document: 'Document (PDF)',
    attachment: 'Attachment',
    clip: 'Video',
    logo: 'Logo',
    color: 'Kolor',
    address: 'Adres',
    profile: 'Profil',
    items: 'Items',
    nickname: 'Pseudonim',
    contact: 'Kontakt',
  };

  override get(input: { instance: any; key: string; type?: any }) {
    return signal(this.labels[input.key] ?? input.key);
  }
}

// ─── Variant table ───────────────────────────────────────────────────────────

type PossibilitiesFactory = () => InputOptions<any>['possibilities'];

interface InputVariant {
  key: string;
  type: FieldTypeDef;
  control: () => AbstractControl;
  possibilities?: PossibilitiesFactory;
}

const ctrl = (value: unknown) => () => new UntypedFormControl(value);

const VARIANTS: InputVariant[] = [
  { key: 'name', type: FieldType.text, control: ctrl('Przykładowy tekst') },
  {
    key: 'description',
    type: FieldType.longText,
    control: ctrl('<p>Sformatowany opis</p>'),
  },
  { key: 'email', type: FieldType.email, control: ctrl('user@example.com') },
  {
    key: 'password',
    type: FieldType.password,
    control: () => new UntypedFormControl('', Validators.required),
  },

  { key: 'age', type: FieldType.int, control: ctrl(25) },
  { key: 'price', type: FieldType.float, control: ctrl(19.99) },
  { key: 'amount', type: FieldType.currency, control: ctrl(100.5) },
  { key: 'ids', type: FieldType.ints, control: ctrl([1, 2, 3]) },

  { key: 'nip', type: FieldType.nip, control: ctrl('1234567890') },
  { key: 'pesel', type: FieldType.pesel, control: ctrl('') },
  {
    key: 'phone',
    type: FieldType.phoneNumber,
    control: ctrl('+48123456789'),
  },
  { key: 'phonePl', type: FieldType.phoneNumberPl, control: ctrl('600700800') },

  {
    key: 'categories',
    type: FieldType.enum,
    control: ctrl([CategoryEnum.News]),
    // InputEnumPresetComponent extends InputPossibilitiesBaseComponent and
    // calls possibilities() in its template; without MODEL_POSSIBILITIES_PROVIDER
    // the signal is never assigned, so the story supplies it directly.
    possibilities: () =>
      signal(
        Object.values(CategoryEnum).map((value) => ({
          id: value,
          text: value,
          checked: false,
        })),
      ),
  },
  {
    key: 'status',
    type: FieldType.radio,
    control: ctrl(1),
    // InputRadioComponent calls this.possibilities() unconditionally — without
    // it the component throws.
    possibilities: () =>
      signal([
        { id: 1, text: 'Aktywny', checked: true },
        { id: 2, text: 'Nieaktywny', checked: false },
        { id: 3, text: 'Oczekujący', checked: false },
      ]),
  },
  {
    key: 'tags',
    type: FieldType.check,
    control: ctrl([]),
    possibilities: () =>
      signal([
        { id: 'alpha', text: 'Alpha', checked: false },
        { id: 'beta', text: 'Beta', checked: false },
        { id: 'gamma', text: 'Gamma', checked: false },
      ]),
  },
  {
    key: 'labels',
    type: FieldType.strings,
    control: ctrl(['alpha', 'beta']),
  },
  { key: 'active', type: FieldType.flag, control: ctrl(true) },

  { key: 'startDate', type: FieldType.date, control: ctrl('2026-04-20') },
  {
    key: 'dateEdit',
    type: FieldType.dateWithEdit,
    control: ctrl('2026-04-20'),
  },
  {
    key: 'range',
    type: FieldType.dateRange,
    control: ctrl({ start: '2026-04-01', end: '2026-04-30' }),
  },

  { key: 'file', type: FieldType.file, control: ctrl(null) },
  { key: 'image', type: FieldType.image, control: ctrl({ id: 'demo' }) },
  {
    key: 'document',
    type: FieldType.pdf,
    control: ctrl({ id: 'demo', fileName: 'contract.pdf' }),
  },
  {
    key: 'attachment',
    type: FieldType.attachment,
    control: ctrl({ id: 'demo', fileName: 'archive.zip' }),
  },
  { key: 'clip', type: FieldType.video, control: ctrl({ id: 'sample' }) },
  { key: 'logo', type: FieldType.logo, control: ctrl('') },
  { key: 'color', type: FieldType.color, control: ctrl('#4f46e5') },

  {
    key: 'address',
    type: FieldType.address,
    control: () =>
      new UntypedFormGroup({
        city: new UntypedFormControl('Warszawa'),
        zipCode: new UntypedFormControl('00-001'),
        street: new UntypedFormControl('Marszałkowska'),
        buildingNumber: new UntypedFormControl('10'),
        flatNumber: new UntypedFormControl('5'),
      }),
  },
  {
    key: 'profile',
    type: FieldType.object,
    control: () =>
      new UntypedFormGroup({
        nickname: new UntypedFormControl('jan'),
        contact: new UntypedFormControl('jan@example.com'),
      }),
  },
  {
    key: 'items',
    type: FieldType.array,
    control: () => new UntypedFormArray([]),
  },
];

const SECTIONS: Array<{ title: string; keys: string[] }> = [
  { title: 'Text', keys: ['name', 'description', 'email', 'password'] },
  { title: 'Numeric', keys: ['age', 'price', 'amount', 'ids'] },
  { title: 'Identity', keys: ['nip', 'pesel', 'phone', 'phonePl'] },
  {
    title: 'Choice',
    keys: ['categories', 'status', 'tags', 'labels', 'active'],
  },
  // `dateEdit` is deliberately absent: InputDateWithEditPresetComponent renders
  // <smart-date-edit variant="preset">, whose [ngModel] binding + CVA writeValue
  // feed each other and throw NG0103 ("endless change notifications"), which
  // destabilises the whole showcase page. The field is still reachable from the
  // Playground so the bug can be reproduced in isolation.
  { title: 'Date', keys: ['startDate', 'range'] },
  {
    title: 'Media',
    keys: ['file', 'image', 'document', 'attachment', 'clip', 'logo', 'color'],
  },
  { title: 'Composite', keys: ['address', 'profile', 'items'] },
];

interface BuildExtra {
  required?: boolean;
  touched?: boolean;
}

// Every rendered field owns its FormControl — sharing one would mirror typing
// between cells. The parent FormGroup is required because each field's label
// reads `control.parent.value`.
function buildOptions(
  key: string,
  { required, touched }: BuildExtra = {},
): InputOptions<any> {
  const variant = VARIANTS.find((x) => x.key === key)!;
  const control = variant.control();
  if (required) control.setValidators(Validators.required);
  new UntypedFormGroup({ [key]: control });
  if (touched) control.markAsTouched();
  control.updateValueAndValidity();

  return {
    control: control as any,
    fieldKey: key,
    model: new AllFieldsModel(),
    treeLevel: 0,
    ...(variant.possibilities
      ? { possibilities: variant.possibilities() }
      : {}),
  } as InputOptions<any>;
}

// ─── Meta ────────────────────────────────────────────────────────────────────

interface InputArgs {
  field: string;
  required: boolean;
  touched: boolean;
  cssClass: string;
}

const meta: Meta<InputArgs> = {
  title: 'Smart-Input/Input',
  tags: ['autodocs'],
  decorators: [
    // The object/array fields render nested forms through FORM_COMPONENT_TOKEN
    // -> FormFactory, which injects MODEL_VALIDATORS_PROVIDER (no library-side
    // default). Must be root-level: moduleMetadata providers don't reach the
    // standalone story wrapper's environment injector.
    applicationConfig({
      providers: [
        ...provideStorybookTranslations(),
        {
          provide: MODEL_VALIDATORS_PROVIDER,
          useValue: {
            get: (options: IModelValidatorsOptions) =>
              Promise.resolve(options.base ?? {}),
          },
        },
        { provide: FORM_COMPONENT_TOKEN, useValue: FormComponent },
      ],
    }),
    moduleMetadata({
      imports: [
        ...IMPORTS,
        ...COMPONENTS,
        ReactiveFormsModule,
        SharedFactoriesModule,
        TranslateModule,
        // Presets are not part of COMPONENTS, so the error preset used in the
        // showcase must be imported by class.
        InputErrorPresetComponent,
      ],
      providers: [
        { provide: IModelLabelProvider, useClass: MockModelLabelProvider },
        {
          provide: FileService,
          useValue: {
            getUrl: (id: string) => `https://picsum.photos/seed/${id}/150/150`,
            download: (id: string) => console.log('[storybook] download', id),
            upload: () => undefined,
            delete: () => Promise.resolve(),
          },
        },
        {
          provide: INPUT_FIELD_COMPONENTS_TOKEN,
          useValue: INPUT_PRESET_FIELD_COMPONENTS,
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }),
  ],
  argTypes: {
    field: {
      control: 'select',
      options: VARIANTS.map((x) => x.key),
      description:
        'Field of the fixture model to render. Its FieldType selects which component <smart-input> dispatches to.',
    },
    required: {
      control: 'boolean',
      description: 'Adds Validators.required to the control.',
    },
    touched: {
      control: 'boolean',
      description:
        'Marks the control touched — combined with `required`, this reveals the <smart-input-error> message.',
    },
    cssClass: { control: 'text', description: 'Passed through as `class`.' },
  },
  args: { field: 'name', required: false, touched: false, cssClass: '' },
};

export default meta;
type Story = StoryObj<InputArgs>;

export const Playground: Story = {
  name: 'Playground',
  render: (args) => ({
    props: {
      options: buildOptions(args.field, {
        required: args.required,
        touched: args.touched,
      }),
      cssClass: args.cssClass,
    },
    template: `
      <form onsubmit="return false" style="padding: 40px; max-width: 32rem;">
        <smart-input [options]="options" [class]="cssClass"></smart-input>
      </form>
    `,
  }),
};

// Radio inputs bind [name]="fieldKey"; without an enclosing <form> per cell,
// same-key groups across sections would merge into one DOM radio group.
const cell = (key: string) => `
  <div>
    <code style="display: block; font-size: 12px; opacity: .6; margin-bottom: 4px;">${key}</code>
    <form onsubmit="return false">
      <smart-input [options]="opt_${key}"></smart-input>
    </form>
  </div>
`;

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      ...Object.fromEntries(
        VARIANTS.map((variant) => [
          `opt_${variant.key}`,
          buildOptions(variant.key),
        ]),
      ),
      opt_error: buildOptions('name', { required: true, touched: true }),
      opt_styled: buildOptions('name'),
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 32px; padding: 24px;">

        ${SECTIONS.map(
          (section) => `
          <section>
            <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">${section.title}</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px;">
              ${section.keys.map(cell).join('\n')}
            </div>
          </section>`,
        ).join('\n')}

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">States</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px;">
            <div>
              <code style="display: block; font-size: 12px; opacity: .6; margin-bottom: 4px;">required + touched</code>
              <form onsubmit="return false">
                <smart-input [options]="opt_error"></smart-input>
              </form>
            </div>
            <div>
              <code style="display: block; font-size: 12px; opacity: .6; margin-bottom: 4px;">external class</code>
              <form onsubmit="return false">
                <smart-input
                  class="smart:rounded-lg smart:bg-yellow-50 smart:p-4 smart:dark:bg-yellow-900/30"
                  [options]="opt_styled"
                ></smart-input>
              </form>
            </div>
          </div>
        </section>

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">Validation messages (smart-input-error-preset)</h3>
          <div style="display: grid; gap: 8px;">
            <smart-input-error-preset [errors]="{ required: true }"></smart-input-error-preset>
            <smart-input-error-preset [errors]="{ email: true }"></smart-input-error-preset>
            <smart-input-error-preset [errors]="{ minlength: { requiredLength: 5 } }"></smart-input-error-preset>
            <smart-input-error-preset [errors]="{ maxlength: { requiredLength: 20 } }"></smart-input-error-preset>
          </div>
        </section>

      </div>
    `,
  }),
};
