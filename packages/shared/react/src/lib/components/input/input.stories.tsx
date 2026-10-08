import type { Meta, StoryObj } from '@storybook/react-vite';
import { useMemo } from 'react';
import type { FormEvent } from 'react';

import type { IAddress } from '@smartsoft001/domain-core';
import { Field, FieldType, FieldTypeDef, Model } from '@smartsoft001/models';

import { SmartInputErrorPreset } from './error/preset/input-error-preset';
import { SmartInput } from './input';
import { INPUT_PRESET_FIELD_COMPONENTS } from './preset-fields';
import { SmartAbstractControl } from '../../forms/abstract-control';
import { SmartFormArray } from '../../forms/form-array';
import { SmartFormControl } from '../../forms/form-control';
import { SmartFormGroup } from '../../forms/form-group';
import { SmartValidators } from '../../forms/validators';
import { InputOptions } from '../../models';
import {
  IModelLabelOptions,
  IModelLabelProvider,
} from '../../providers/model-label.provider';
import {
  IModelValidatorsOptions,
  IModelValidatorsProvider,
} from '../../providers/model-validators.provider';
import { FileService } from '../../services/file/file.service';

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

// A single model carrying one field per FieldType. <SmartInput> derives each
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

  // The radio field reads options.possibilities; the decorator record is
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

  override get(input: IModelLabelOptions) {
    return this.labels[input.key] ?? input.key;
  }
}

// The object/array fields render nested forms through the form factory; keep
// the validators it derives from the field options.
const MODEL_VALIDATORS_PROVIDER: IModelValidatorsProvider = {
  get: (options: IModelValidatorsOptions) =>
    Promise.resolve(options.base ?? {}),
};

// The media fields only ask the file service for URLs; the story serves
// placeholder images instead of an API.
const FILE_SERVICE = {
  getUrl: (id: string) => `https://picsum.photos/seed/${id}/150/150`,
  download: (id: string) => console.log('[storybook] download', id),
  upload: () => undefined,
  delete: () => Promise.resolve(),
} as unknown as FileService;

// ─── Variant table ───────────────────────────────────────────────────────────

type PossibilitiesFactory = () => InputOptions<any>['possibilities'];

interface InputVariant {
  key: string;
  type: FieldTypeDef;
  control: () => SmartAbstractControl;
  possibilities?: PossibilitiesFactory;
}

const ctrl = (value: unknown) => () => new SmartFormControl(value);

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
    control: () => new SmartFormControl('', SmartValidators.required),
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
    // Without a model possibilities provider the field has no options, so
    // the story supplies them directly.
    possibilities: () =>
      Object.values(CategoryEnum).map((value) => ({
        id: value,
        text: value,
        checked: false,
      })),
  },
  {
    key: 'status',
    type: FieldType.radio,
    control: ctrl(1),
    possibilities: () => [
      { id: 1, text: 'Aktywny', checked: true },
      { id: 2, text: 'Nieaktywny', checked: false },
      { id: 3, text: 'Oczekujący', checked: false },
    ],
  },
  {
    key: 'tags',
    type: FieldType.check,
    control: ctrl([]),
    possibilities: () => [
      { id: 'alpha', text: 'Alpha', checked: false },
      { id: 'beta', text: 'Beta', checked: false },
      { id: 'gamma', text: 'Gamma', checked: false },
    ],
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
      new SmartFormGroup({
        city: new SmartFormControl('Warszawa'),
        zipCode: new SmartFormControl('00-001'),
        street: new SmartFormControl('Marszałkowska'),
        buildingNumber: new SmartFormControl('10'),
        flatNumber: new SmartFormControl('5'),
      }),
  },
  {
    key: 'profile',
    type: FieldType.object,
    control: () =>
      new SmartFormGroup({
        nickname: new SmartFormControl('jan'),
        contact: new SmartFormControl('jan@example.com'),
      }),
  },
  {
    key: 'items',
    type: FieldType.array,
    control: () => new SmartFormArray([]),
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
  { title: 'Date', keys: ['startDate', 'dateEdit', 'range'] },
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

// Every rendered field owns its control — sharing one would mirror typing
// between cells. The parent group is required because each field's label
// reads `control.parent.value`.
function buildOptions(
  key: string,
  { required, touched }: BuildExtra = {},
): InputOptions<any> {
  const variant = VARIANTS.find((x) => x.key === key)!;
  const control = variant.control();
  if (required) control.setValidators(SmartValidators.required);
  new SmartFormGroup({ [key]: control });
  if (touched) control.markAsTouched();
  control.updateValueAndValidity();

  return {
    control,
    fieldKey: key,
    model: new AllFieldsModel(),
    treeLevel: 0,
    ...(variant.possibilities
      ? { possibilities: variant.possibilities() }
      : {}),
  } as InputOptions<any>;
}

/** One `<SmartInput>` with its own control, kept for the cell's lifetime. */
const InputCell = ({
  field,
  required,
  touched,
  className,
}: {
  field: string;
  required?: boolean;
  touched?: boolean;
  className?: string;
}) => {
  const options = useMemo(
    () => buildOptions(field, { required, touched }),
    [field, required, touched],
  );

  return <SmartInput options={options} className={className} />;
};

const preventSubmit = (event: FormEvent<HTMLFormElement>) =>
  event.preventDefault();

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
  parameters: {
    smart: {
      modelValidatorsProvider: MODEL_VALIDATORS_PROVIDER,
      modelLabelProvider: new MockModelLabelProvider(),
      fileService: FILE_SERVICE,
      inputFieldComponents: INPUT_PRESET_FIELD_COMPONENTS,
    },
  },
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

// #region usage
export const Playground: Story = {
  name: 'Playground',
  render: (args) => (
    <form onSubmit={preventSubmit} style={{ padding: 40, maxWidth: '32rem' }}>
      <InputCell
        field={args.field}
        required={args.required}
        touched={args.touched}
        className={args.cssClass}
      />
    </form>
  ),
};
// #endregion

const codeLabel = {
  display: 'block',
  fontSize: 12,
  opacity: 0.6,
  marginBottom: 4,
};

const sectionTitle = { fontSize: 16, fontWeight: 600, marginBottom: 12 };

const cellsGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  gap: 24,
};

// Radio inputs are named by their field key; without an enclosing <form> per
// cell, same-key groups across sections would merge into one radio group.
const Cell = ({ fieldKey }: { fieldKey: string }) => (
  <div>
    <code style={codeLabel}>{fieldKey}</code>
    <form onSubmit={preventSubmit}>
      <InputCell field={fieldKey} />
    </form>
  </div>
);

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: 32, padding: 24 }}
    >
      {SECTIONS.map((section) => (
        <section key={section.title}>
          <h3 style={sectionTitle}>{section.title}</h3>
          <div style={cellsGrid}>
            {section.keys.map((key) => (
              <Cell key={key} fieldKey={key} />
            ))}
          </div>
        </section>
      ))}

      <section>
        <h3 style={sectionTitle}>States</h3>
        <div style={cellsGrid}>
          <div>
            <code style={codeLabel}>required + touched</code>
            <form onSubmit={preventSubmit}>
              <InputCell field="name" required={true} touched={true} />
            </form>
          </div>
          <div>
            <code style={codeLabel}>external class</code>
            <form onSubmit={preventSubmit}>
              <InputCell
                field="name"
                className="smart:rounded-lg smart:bg-yellow-50 smart:p-4 smart:dark:bg-yellow-900/30"
              />
            </form>
          </div>
        </div>
      </section>

      <section>
        <h3 style={sectionTitle}>Validation messages</h3>
        <div style={{ display: 'grid', gap: 8 }}>
          <SmartInputErrorPreset errors={{ required: true }} />
          <SmartInputErrorPreset errors={{ email: true }} />
          <SmartInputErrorPreset
            errors={{ minlength: { requiredLength: 5 } }}
          />
          <SmartInputErrorPreset
            errors={{ maxlength: { requiredLength: 20 } }}
          />
        </div>
      </section>
    </div>
  ),
};
