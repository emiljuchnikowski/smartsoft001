import { signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, moduleMetadata } from '@storybook/angular';

import { IAddress } from '@smartsoft001/domain-core';
import { Field, FieldType, FieldTypeDef, Model } from '@smartsoft001/models';

import { provideStorybookTranslations } from '../../../../.storybook/storybook-translations';
import { SharedFactoriesModule } from '../../factories';
import { IDetailOptions } from '../../models';
import { FileService } from '../../services';
import {
  DETAIL_FIELD_COMPONENTS_TOKEN,
  DETAILS_COMPONENT_TOKEN,
} from '../../shared.inectors';
import { COMPONENTS, IMPORTS } from '../components.module';
import { DetailsComponent } from '../details';
import { DETAIL_PRESET_FIELD_COMPONENTS } from './preset-fields';

// ─── Fixtures ────────────────────────────────────────────────────────────────

const LOGO_DATA_URI =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 150 150"><rect width="150" height="150" fill="#6366f1"/><text x="50%" y="50%" text-anchor="middle" dominant-baseline="central" fill="white" font-family="sans-serif" font-size="24" font-weight="bold">LOGO</text></svg>`,
  );

const ADDRESS: IAddress = {
  city: 'Warszawa',
  street: 'Marszałkowska',
  zipCode: '00-001',
  flatNumber: '5',
  buildingNumber: '3B',
};

@Model({})
class NestedUserModel {
  @Field({ details: true })
  firstName = 'Jan';

  @Field({ details: true })
  lastName = 'Kowalski';
}

// DetailArrayComponent derives the child type from `value.constructor`, so the
// items must be instances of a decorated class — not plain object literals.
@Model({})
class ArrayItemModel {
  @Field({ details: true })
  name = '';
}

const arrayItem = (name: string) =>
  Object.assign(new ArrayItemModel(), { name });

// A single model carrying one field per FieldType. Detail components are
// read-only, so all rows can share one instance.
@Model({})
class DetailFieldsModel {
  @Field({ details: true, type: FieldType.text })
  note = 'Lorem ipsum dolor sit amet';

  @Field({ details: true, type: FieldType.email })
  email = 'user@example.com';

  @Field({ details: true, type: FieldType.enum })
  status = ['active', 'pending'];

  @Field({ details: true, type: FieldType.flag })
  isActive = true;

  @Field({ details: true, type: FieldType.color })
  color = '#4f46e5';

  @Field({ details: true, type: FieldType.address })
  address: IAddress = ADDRESS;

  @Field({ details: true, type: FieldType.phoneNumberPl })
  phone = '600700800';

  @Field({ details: true, type: FieldType.dateRange })
  range = { start: '2026-01-01', end: '2026-01-31' };

  // Media values must always carry an id — the file components call
  // fileService.getUrl(value.id) without a null guard.
  @Field({ details: true, type: FieldType.image })
  photo: any = { id: 'photo' };

  @Field({ details: true, type: FieldType.logo })
  logo = LOGO_DATA_URI;

  @Field({ details: true, type: FieldType.video })
  clip: any = { id: 'sample' };

  @Field({ details: true, type: FieldType.attachment })
  file: any = { id: 'doc', fileName: 'report.pdf' };

  @Field({ details: true, type: FieldType.pdf })
  brochure: any = { id: 'brochure', fileName: 'brochure.pdf' };

  @Field({ details: true, type: FieldType.object })
  user = Object.assign(new NestedUserModel(), {
    firstName: 'Jan',
    lastName: 'Kowalski',
  });

  @Field({ details: true, type: FieldType.array })
  items: ArrayItemModel[] = [arrayItem('Item A'), arrayItem('Item B')];
}

const ITEM = signal(new DetailFieldsModel());

interface DetailVariant {
  key: string;
  type: FieldTypeDef;
}

const VARIANTS: DetailVariant[] = [
  { key: 'note', type: FieldType.text },
  { key: 'email', type: FieldType.email },
  { key: 'status', type: FieldType.enum },
  { key: 'isActive', type: FieldType.flag },
  { key: 'color', type: FieldType.color },
  { key: 'phone', type: FieldType.phoneNumberPl },
  { key: 'range', type: FieldType.dateRange },
  { key: 'address', type: FieldType.address },
  { key: 'photo', type: FieldType.image },
  { key: 'logo', type: FieldType.logo },
  { key: 'clip', type: FieldType.video },
  { key: 'file', type: FieldType.attachment },
  { key: 'brochure', type: FieldType.pdf },
  { key: 'user', type: FieldType.object },
  { key: 'items', type: FieldType.array },
];

const SECTIONS: Array<{ title: string; keys: string[] }> = [
  { title: 'Text and identity', keys: ['note', 'email', 'phone', 'address'] },
  { title: 'Choice and state', keys: ['status', 'isActive', 'color', 'range'] },
  { title: 'Media', keys: ['photo', 'logo', 'clip', 'file', 'brochure'] },
  { title: 'Composite', keys: ['user', 'items'] },
];

const buildOptions = (
  key: string,
  extra: { info?: string; loading?: boolean } = {},
): IDetailOptions<any> => {
  const variant = VARIANTS.find((x) => x.key === key)!;
  return {
    key,
    // A loading detail renders its skeleton, which requires no item.
    item: extra.loading ? undefined : ITEM,
    options: { type: variant.type, info: extra.info },
    loading: signal(!!extra.loading),
  } as IDetailOptions<any>;
};

interface DetailArgs {
  field: string;
  info: string;
  loading: boolean;
  cssClass: string;
}

const meta: Meta<DetailArgs> = {
  title: 'Smart-Detail/Detail',
  tags: ['autodocs'],
  decorators: [
    applicationConfig({
      providers: [...provideStorybookTranslations()],
    }),
    moduleMetadata({
      imports: [
        ...IMPORTS,
        ...COMPONENTS,
        SharedFactoriesModule,
        TranslateModule,
      ],
      providers: [
        {
          provide: FileService,
          useValue: {
            getUrl: (id: string) => `https://picsum.photos/seed/${id}/150/150`,
            download: (id: string) => console.log('[storybook] download', id),
            upload: () => undefined,
            delete: () => Promise.resolve(),
          },
        },
        // object/array fields render their children through <smart-details>.
        { provide: DETAILS_COMPONENT_TOKEN, useValue: DetailsComponent },
        {
          provide: DETAIL_FIELD_COMPONENTS_TOKEN,
          useValue: DETAIL_PRESET_FIELD_COMPONENTS,
        },
      ],
    }),
  ],
  argTypes: {
    field: {
      control: 'select',
      options: VARIANTS.map((x) => x.key),
      description:
        'Field of the fixture model to render. The FieldType selects which component <smart-detail> dispatches to.',
    },
    info: {
      control: 'text',
      description: 'Renders the <smart-info> tooltip next to the value.',
    },
    loading: {
      control: 'boolean',
      description: 'Renders the skeleton instead of the value.',
    },
    cssClass: { control: 'text', description: 'Passed through as `class`.' },
  },
  args: { field: 'note', info: '', loading: false, cssClass: '' },
};

export default meta;
type Story = StoryObj<DetailArgs>;

export const Playground: Story = {
  name: 'Playground',
  render: (args) => ({
    props: {
      type: DetailFieldsModel,
      options: buildOptions(args.field, {
        info: args.info || undefined,
        loading: args.loading,
      }),
      cssClass: args.cssClass,
    },
    template: `
      <div style="padding: 40px; max-width: 32rem;">
        <smart-detail
          [options]="options"
          [type]="type"
          [class]="cssClass"
        ></smart-detail>
      </div>
    `,
  }),
};

const row = (key: string, type: FieldTypeDef) => `
  <div style="font-size: 13px;">
    ${key}<br /><code style="opacity: .6;">${type}</code>
  </div>
  <div><smart-detail [options]="opt_${key}" [type]="type"></smart-detail></div>
`;

const grid = (body: string) => `
  <div style="display: grid; grid-template-columns: 160px 1fr; gap: 16px 24px; align-items: start;">
    ${body}
  </div>
`;

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      type: DetailFieldsModel,
      ...Object.fromEntries(
        VARIANTS.map((variant) => [
          `opt_${variant.key}`,
          buildOptions(variant.key),
        ]),
      ),
      opt_info: buildOptions('note', {
        info: 'Helpful tooltip text explaining this field',
      }),
      opt_loading: buildOptions('note', { loading: true }),
      opt_styled: buildOptions('note'),
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 32px; padding: 24px;">

        ${SECTIONS.map(
          (section) => `
          <section>
            <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">${section.title}</h3>
            ${grid(
              section.keys
                .map((key) =>
                  row(key, VARIANTS.find((x) => x.key === key)!.type),
                )
                .join('\n'),
            )}
          </section>`,
        ).join('\n')}

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">States</h3>
          ${grid(`
            <div style="font-size: 13px;">info tooltip</div>
            <div><smart-detail [options]="opt_info" [type]="type"></smart-detail></div>

            <div style="font-size: 13px;">loading</div>
            <div><smart-detail [options]="opt_loading" [type]="type"></smart-detail></div>

            <div style="font-size: 13px;">external class</div>
            <div>
              <smart-detail
                class="smart:rounded-lg smart:bg-yellow-50 smart:p-4 smart:dark:bg-yellow-900/30"
                [options]="opt_styled"
                [type]="type"
              ></smart-detail>
            </div>
          `)}
        </section>

      </div>
    `,
  }),
};
