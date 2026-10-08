import type { Meta, StoryObj } from '@storybook/react-vite';
import { useMemo } from 'react';
import type { ReactNode } from 'react';

import type { IAddress } from '@smartsoft001/domain-core';
import { Field, FieldType, Model } from '@smartsoft001/models';

import { SmartDetails } from './details';
import { IDetailsOptions } from '../../models';
import { FileService } from '../../services/file/file.service';
import { DETAIL_PRESET_FIELD_COMPONENTS } from '../detail/preset-fields';

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

// Every rendered <SmartDetails> gets its own options object, built from a
// fresh instance of the model.
const buildOptions = (
  model: DetailsModelKey,
  extra: Partial<IDetailsOptions<any>> = {},
): IDetailsOptions<any> => {
  const type = MODELS[model];
  return {
    type,
    item: new type() as any,
    ...extra,
  } as IDetailsOptions<any>;
};

// The media details only ask the file service for URLs; the story serves
// placeholder images instead of an API.
const FILE_SERVICE = {
  getUrl: (id: string) => `https://picsum.photos/seed/${id}/150/150`,
  download: (id: string) => console.log('[storybook] download', id),
  upload: () => undefined,
  delete: () => Promise.resolve(),
} as unknown as FileService;

interface DetailsArgs {
  model: DetailsModelKey;
  title: string;
  loading: boolean;
  cssClass: string;
}

const meta: Meta<DetailsArgs> = {
  title: 'Smart-Details/Details',
  tags: ['autodocs'],
  parameters: {
    smart: {
      fileService: FILE_SERVICE,
      // There is no details/preset — the standard shell is the only skin.
      // The individual field rows are rendered in the preset skin, matching
      // how every other story in the library showcases presets.
      detailFieldComponents: DETAIL_PRESET_FIELD_COMPONENTS,
    },
  },
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

/** One `<SmartDetails>` with its own options, kept for the cell's lifetime. */
const DetailsCell = ({
  model,
  title,
  loading,
  className,
}: {
  model: DetailsModelKey;
  title?: string;
  loading?: boolean;
  className?: string;
}) => {
  const options = useMemo(
    () =>
      buildOptions(model, {
        ...(title !== undefined ? { title } : {}),
        ...(loading !== undefined ? { loading } : {}),
      }),
    [model, title, loading],
  );

  return <SmartDetails options={options} className={className} />;
};

// #region usage
export const Playground: Story = {
  name: 'Playground',
  render: (args) => (
    <div style={{ padding: 40, maxWidth: '32rem' }}>
      <DetailsCell
        model={args.model}
        title={args.title || undefined}
        loading={args.loading}
        className={args.cssClass}
      />
    </div>
  ),
};
// #endregion

const Section = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <section>
    <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>{title}</h3>
    <div style={{ maxWidth: '32rem' }}>{children}</div>
  </section>
);

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: 32, padding: 24 }}
    >
      <Section title="Text fields">
        <DetailsCell model="text" />
      </Section>

      <Section title="Address field">
        <DetailsCell model="address" />
      </Section>

      <Section title="Nested object field">
        <DetailsCell model="nested" />
      </Section>

      <Section title="All field types">
        <DetailsCell model="all" />
      </Section>

      <Section title="With title">
        <DetailsCell model="text" title="Personal data" />
      </Section>

      <Section title="Loading">
        <DetailsCell model="text" loading={true} />
      </Section>

      <Section title="External class">
        <DetailsCell
          model="text"
          className="smart:rounded-lg smart:bg-yellow-50 smart:p-4 smart:dark:bg-yellow-900/30"
        />
      </Section>
    </div>
  ),
};
