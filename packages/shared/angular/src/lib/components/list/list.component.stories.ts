import { signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, moduleMetadata } from '@storybook/angular';

import { IEntity } from '@smartsoft001/domain-core';
import { Field, FieldType, Model } from '@smartsoft001/models';

import { provideStorybookTranslations } from '../../../../.storybook/storybook-translations';
import { SharedFactoriesModule } from '../../factories';
import { IListOptions, IListProvider, ListMode } from '../../models';
import { FileService } from '../../services';
import { LIST_MODE_COMPONENTS_TOKEN } from '../../shared.inectors';
import { COMPONENTS, IMPORTS } from '../components.module';
import { LIST_PRESET_MODE_COMPONENTS } from './preset-modes';

// ─── Fixtures ────────────────────────────────────────────────────────────────

@Model({})
class UserListModel implements IEntity<string> {
  id = '1';

  @Field({ list: true, type: FieldType.text })
  firstName = 'Jan';

  @Field({ list: true, type: FieldType.email })
  email = 'jan@example.com';

  @Field({ list: true, type: FieldType.text })
  role = 'Admin';
}

// masonryGrid resolves the tile image from the first FieldType.image field, so
// it needs a model that declares one.
@Model({})
class PhotoListModel implements IEntity<string> {
  id = '1';

  @Field({ list: true, type: FieldType.text })
  title = 'Photo';

  @Field({ list: true, type: FieldType.image })
  image: any = { id: 'abc' };
}

const USERS = [
  { id: '1', firstName: 'Jan', email: 'jan@example.com', role: 'Admin' },
  { id: '2', firstName: 'Anna', email: 'anna@example.com', role: 'User' },
  { id: '3', firstName: 'Piotr', email: 'piotr@example.com', role: 'User' },
] as UserListModel[];

const PHOTOS = [
  { id: '1', title: 'Mountain', image: { id: 'mountain' } },
  { id: '2', title: 'Forest', image: { id: 'forest' } },
  { id: '3', title: 'Ocean', image: { id: 'ocean' } },
  { id: '4', title: 'Desert', image: { id: 'desert' } },
  { id: '5', title: 'City', image: { id: 'city' } },
  { id: '6', title: 'River', image: { id: 'river' } },
] as PhotoListModel[];

interface BuildOptions {
  presentation?: IListOptions<any>['presentation'];
  loading?: boolean;
  empty?: boolean;
}

// ListBaseComponent mutates `removed`/`keys` and subscribes to the provider per
// instance, so every rendered <smart-list> gets its own options object.
const buildOptions = (
  mode: ListMode,
  { presentation, loading = false, empty = false }: BuildOptions = {},
): IListOptions<any> => {
  const isMasonry = mode === ListMode.masonryGrid;
  const provider: IListProvider<any> = {
    list: signal(empty ? [] : isMasonry ? [...PHOTOS] : [...USERS]),
    loading: signal(loading),
    getData: () => undefined,
  };
  return {
    provider,
    type: isMasonry ? PhotoListModel : UserListModel,
    mode,
    presentation,
  } as IListOptions<any>;
};

const PRESENTATION_VARIANTS = [
  'default',
  'striped',
  'bordered',
  'borderless',
] as const;
const HEADER_VARIANTS = ['default', 'muted', 'none'] as const;

interface ListArgs {
  mode: ListMode;
  variant: (typeof PRESENTATION_VARIANTS)[number];
  hoverable: boolean;
  header: (typeof HEADER_VARIANTS)[number];
  loading: boolean;
  empty: boolean;
  cssClass: string;
}

const PRESENTATION_NOTE =
  'Consumed only by the desktop preset component — ignored in mobile and masonryGrid modes.';

const meta: Meta<ListArgs> = {
  title: 'Smart-List/List',
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
            getUrl: (id: string) => `https://picsum.photos/seed/${id}/400/300`,
            download: (id: string) => console.log('[storybook] download', id),
            upload: () => undefined,
            delete: () => Promise.resolve(),
          },
        },
        {
          provide: LIST_MODE_COMPONENTS_TOKEN,
          useValue: LIST_PRESET_MODE_COMPONENTS,
        },
      ],
    }),
  ],
  argTypes: {
    mode: {
      control: 'inline-radio',
      options: [ListMode.desktop, ListMode.mobile, ListMode.masonryGrid],
      description:
        'masonryGrid switches the fixture to a model with an image field.',
    },
    variant: {
      control: 'select',
      options: PRESENTATION_VARIANTS,
      description: PRESENTATION_NOTE,
    },
    hoverable: { control: 'boolean', description: PRESENTATION_NOTE },
    header: {
      control: 'inline-radio',
      options: HEADER_VARIANTS,
      description: PRESENTATION_NOTE,
    },
    loading: { control: 'boolean' },
    empty: { control: 'boolean', description: 'Renders the no-results state.' },
    cssClass: { control: 'text', description: 'Passed through as `class`.' },
  },
  args: {
    mode: ListMode.desktop,
    variant: 'default',
    hoverable: false,
    header: 'default',
    loading: false,
    empty: false,
    cssClass: '',
  },
};

export default meta;
type Story = StoryObj<ListArgs>;

export const Playground: Story = {
  name: 'Playground',
  render: (args) => ({
    props: {
      options: buildOptions(args.mode, {
        presentation: {
          variant: args.variant,
          hoverable: args.hoverable,
          header: args.header,
        },
        loading: args.loading,
        empty: args.empty,
      }),
      cssClass: args.cssClass,
    },
    template: `
      <div style="padding: 40px;">
        <smart-list [options]="options" [class]="cssClass"></smart-list>
      </div>
    `,
  }),
};

const section = (title: string, body: string) => `
  <section>
    <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">${title}</h3>
    ${body}
  </section>
`;

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      desktop: buildOptions(ListMode.desktop),
      mobile: buildOptions(ListMode.mobile),
      masonry: buildOptions(ListMode.masonryGrid),
      ...Object.fromEntries(
        PRESENTATION_VARIANTS.map((variant) => [
          `variant_${variant}`,
          buildOptions(ListMode.desktop, { presentation: { variant } }),
        ]),
      ),
      ...Object.fromEntries(
        HEADER_VARIANTS.map((header) => [
          `header_${header}`,
          buildOptions(ListMode.desktop, { presentation: { header } }),
        ]),
      ),
      hoverable: buildOptions(ListMode.desktop, {
        presentation: { hoverable: true },
      }),
      loading: buildOptions(ListMode.desktop, { loading: true }),
      empty: buildOptions(ListMode.desktop, { empty: true }),
      styled: buildOptions(ListMode.desktop),
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 32px; padding: 24px;">

        ${section('Mode: desktop', `<smart-list [options]="desktop"></smart-list>`)}

        ${section('Mode: mobile', `<smart-list [options]="mobile"></smart-list>`)}

        ${section(
          'Mode: masonryGrid',
          `<smart-list [options]="masonry"></smart-list>`,
        )}

        ${section(
          'Desktop presentation variants',
          PRESENTATION_VARIANTS.map(
            (variant) => `
            <div style="margin-bottom: 16px;">
              <p style="font-size: 13px; opacity: .7; margin-bottom: 6px;">${variant}</p>
              <smart-list [options]="variant_${variant}"></smart-list>
            </div>`,
          ).join(''),
        )}

        ${section(
          'Desktop header styles',
          HEADER_VARIANTS.map(
            (header) => `
            <div style="margin-bottom: 16px;">
              <p style="font-size: 13px; opacity: .7; margin-bottom: 6px;">${header}</p>
              <smart-list [options]="header_${header}"></smart-list>
            </div>`,
          ).join(''),
        )}

        ${section('Hoverable rows', `<smart-list [options]="hoverable"></smart-list>`)}

        ${section('Loading', `<smart-list [options]="loading"></smart-list>`)}

        ${section('Empty (no results)', `<smart-list [options]="empty"></smart-list>`)}

        ${section(
          'External class',
          `<smart-list
             class="smart:rounded-lg smart:bg-yellow-50 smart:p-4 smart:dark:bg-yellow-900/30"
             [options]="styled"
           ></smart-list>`,
        )}

      </div>
    `,
  }),
};
