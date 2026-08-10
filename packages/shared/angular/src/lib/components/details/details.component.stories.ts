import { signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, moduleMetadata } from '@storybook/angular';

import { IAddress } from '@smartsoft001/domain-core';
import { Field, FieldType, Model } from '@smartsoft001/models';

import { provideStorybookTranslations } from '../../../../.storybook/storybook-translations';
import { SharedFactoriesModule } from '../../factories';
import { IDetailsOptions } from '../../models';
import { FileService } from '../../services';
import {
  DETAIL_FIELD_COMPONENTS_TOKEN,
  DETAILS_COMPONENT_TOKEN,
} from '../../shared.inectors';
import { COMPONENTS, IMPORTS } from '../components.module';
import { DETAIL_PRESET_FIELD_COMPONENTS } from '../detail';
import { DetailsComponent } from './details.component';

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

@Model({})
class TextModel {
  @Field({ details: true, type: FieldType.text })
  firstName = 'Jan';

  @Field({ details: true, type: FieldType.text })
  lastName = 'Kowalski';
}

@Model({})
class AddressModel {
  @Field({ details: true, type: FieldType.address })
  address: IAddress = ADDRESS;
}

@Model({})
class NestedModel {
  @Field({ details: true })
  title = 'Employee';

  @Field({ details: true, type: FieldType.object })
  user = new NestedUserModel();
}

@Model({})
class AllFieldsModel {
  @Field({ details: true, type: FieldType.text })
  label = 'Lorem ipsum dolor sit amet';

  @Field({ details: true, type: FieldType.email })
  email = 'user@example.com';

  @Field({ details: true, type: FieldType.enum })
  status = 'active';

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

  @Field({ details: true, type: FieldType.image })
  photo: any = { id: 'abc' };

  @Field({ details: true, type: FieldType.logo })
  logo = LOGO_DATA_URI;

  @Field({ details: true, type: FieldType.attachment })
  file: any = { id: 'doc' };

  @Field({ details: true, type: FieldType.pdf })
  brochure: any = { id: 'brochure' };

  @Field({ details: true, type: FieldType.object })
  user = new NestedUserModel();
}

type DetailsModelKey = 'text' | 'address' | 'nested' | 'all';

const MODELS: Record<DetailsModelKey, new () => object> = {
  text: TextModel,
  address: AddressModel,
  nested: NestedModel,
  all: AllFieldsModel,
};

// DetailsBaseComponent instantiates `options.type` and subscribes per instance,
// so every rendered <smart-details> gets its own options object.
const buildOptions = (
  model: DetailsModelKey,
  extra: Partial<IDetailsOptions<any>> = {},
): IDetailsOptions<any> => {
  const type = MODELS[model];
  return {
    type,
    item: signal(new type() as any),
    ...extra,
  } as IDetailsOptions<any>;
};

interface DetailsArgs {
  model: DetailsModelKey;
  title: string;
  loading: boolean;
  cssClass: string;
}

const meta: Meta<DetailsArgs> = {
  title: 'Smart-Details/Details',
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
        { provide: DETAILS_COMPONENT_TOKEN, useValue: DetailsComponent },
        // There is no details/preset — the standard shell is the only skin.
        // The individual field rows are rendered in the preset skin, matching
        // how every other story in the library showcases presets.
        {
          provide: DETAIL_FIELD_COMPONENTS_TOKEN,
          useValue: DETAIL_PRESET_FIELD_COMPONENTS,
        },
      ],
    }),
  ],
  argTypes: {
    model: {
      control: 'select',
      options: ['text', 'address', 'nested', 'all'],
      description:
        'Which decorated @Model drives the rendered rows. Only fields marked `@Field({ details: true })` appear.',
    },
    title: { control: 'text' },
    loading: { control: 'boolean' },
    cssClass: { control: 'text', description: 'Passed through as `class`.' },
  },
  args: { model: 'text', title: '', loading: false, cssClass: '' },
};

export default meta;
type Story = StoryObj<DetailsArgs>;

export const Playground: Story = {
  name: 'Playground',
  render: (args) => ({
    props: {
      options: buildOptions(args.model, {
        title: args.title || undefined,
        loading: signal(args.loading),
      }),
      cssClass: args.cssClass,
    },
    template: `
      <div style="padding: 40px; max-width: 32rem;">
        <smart-details [options]="options" [class]="cssClass"></smart-details>
      </div>
    `,
  }),
};

const section = (title: string, body: string) => `
  <section>
    <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">${title}</h3>
    <div style="max-width: 32rem;">${body}</div>
  </section>
`;

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      text: buildOptions('text'),
      address: buildOptions('address'),
      nested: buildOptions('nested'),
      all: buildOptions('all'),
      titled: buildOptions('text', { title: 'Personal data' }),
      loading: buildOptions('text', { loading: signal(true) }),
      styled: buildOptions('text'),
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 32px; padding: 24px;">

        ${section('Text fields', `<smart-details [options]="text"></smart-details>`)}

        ${section('Address field', `<smart-details [options]="address"></smart-details>`)}

        ${section('Nested object field', `<smart-details [options]="nested"></smart-details>`)}

        ${section('All field types', `<smart-details [options]="all"></smart-details>`)}

        ${section('With title', `<smart-details [options]="titled"></smart-details>`)}

        ${section('Loading', `<smart-details [options]="loading"></smart-details>`)}

        ${section(
          'External class',
          `<smart-details
             class="smart:rounded-lg smart:bg-yellow-50 smart:p-4 smart:dark:bg-yellow-900/30"
             [options]="styled"
           ></smart-details>`,
        )}

      </div>
    `,
  }),
};
