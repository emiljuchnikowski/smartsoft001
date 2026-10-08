import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';

import type { IAddress } from '@smartsoft001/domain-core';
import { Field, FieldType, FieldTypeDef, Model } from '@smartsoft001/models';

import { SmartDetail } from './detail';
import { DETAIL_PRESET_FIELD_COMPONENTS } from './preset-fields';
import { IDetailOptions } from '../../models';
import { FileService } from '../../services/file/file.service';

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

// The array detail derives the child type from `value.constructor`, so the
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
  // fileService.getUrl(value.id).
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

const ITEM = new DetailFieldsModel();

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
    loading: !!extra.loading,
  } as IDetailOptions<any>;
};

// The media details only ask the file service for URLs; the story serves
// placeholder images instead of an API.
const FILE_SERVICE = {
  getUrl: (id: string) => `https://picsum.photos/seed/${id}/150/150`,
  download: (id: string) => console.log('[storybook] download', id),
  upload: () => undefined,
  delete: () => Promise.resolve(),
} as unknown as FileService;

interface DetailArgs {
  field: string;
  info: string;
  loading: boolean;
  cssClass: string;
}

const meta: Meta<DetailArgs> = {
  title: 'Smart-Detail/Detail',
  tags: ['autodocs'],
  parameters: {
    smart: {
      fileService: FILE_SERVICE,
      // object/array fields render their children through <SmartDetails>.
      detailFieldComponents: DETAIL_PRESET_FIELD_COMPONENTS,
    },
  },
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

// #region usage
export const Playground: Story = {
  name: 'Playground',
  render: (args) => (
    <div style={{ padding: 40, maxWidth: '32rem' }}>
      <SmartDetail
        options={buildOptions(args.field, {
          info: args.info || undefined,
          loading: args.loading,
        })}
        type={DetailFieldsModel}
        className={args.cssClass}
      />
    </div>
  ),
};
// #endregion

const Row = ({ fieldKey, type }: { fieldKey: string; type: FieldTypeDef }) => (
  <>
    <div style={{ fontSize: 13 }}>
      <code>{fieldKey}</code>
      <br />
      <code style={{ opacity: 0.6 }}>{type}</code>
    </div>
    <div>
      <SmartDetail options={buildOptions(fieldKey)} type={DetailFieldsModel} />
    </div>
  </>
);

const Grid = ({ children }: { children: ReactNode }) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: '160px 1fr',
      gap: '16px 24px',
      alignItems: 'start',
    }}
  >
    {children}
  </div>
);

const sectionTitle = { fontSize: 16, fontWeight: 600, marginBottom: 12 };

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
          <Grid>
            {section.keys.map((key) => (
              <Row
                key={key}
                fieldKey={key}
                type={VARIANTS.find((x) => x.key === key)!.type}
              />
            ))}
          </Grid>
        </section>
      ))}

      <section>
        <h3 style={sectionTitle}>States</h3>
        <Grid>
          <div style={{ fontSize: 13 }}>info tooltip</div>
          <div>
            <SmartDetail
              options={buildOptions('note', {
                info: 'Helpful tooltip text explaining this field',
              })}
              type={DetailFieldsModel}
            />
          </div>

          <div style={{ fontSize: 13 }}>loading</div>
          <div>
            <SmartDetail
              options={buildOptions('note', { loading: true })}
              type={DetailFieldsModel}
            />
          </div>

          <div style={{ fontSize: 13 }}>external class</div>
          <div>
            <SmartDetail
              className="smart:rounded-lg smart:bg-yellow-50 smart:p-4 smart:dark:bg-yellow-900/30"
              options={buildOptions('note')}
              type={DetailFieldsModel}
            />
          </div>
        </Grid>
      </section>
    </div>
  ),
};
