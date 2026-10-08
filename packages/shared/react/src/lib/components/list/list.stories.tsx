import type { Meta, StoryObj } from '@storybook/react-vite';
import { useMemo } from 'react';
import type { ReactNode } from 'react';

import { IEntity } from '@smartsoft001/domain-core';
import { Field, FieldType, Model } from '@smartsoft001/models';

import { SmartList } from './list';
import { LIST_PRESET_MODE_COMPONENTS } from './preset-modes';
import { IListOptions, IListProvider, ListMode } from '../../models';
import { FileService } from '../../services/file/file.service';

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

// The list keeps per-instance state (removed items, keys), so every rendered
// <SmartList> gets its own options object.
const buildOptions = (
  mode: ListMode,
  { presentation, loading = false, empty = false }: BuildOptions = {},
): IListOptions<any> => {
  const isMasonry = mode === ListMode.masonryGrid;
  const provider: IListProvider<any> = {
    list: empty ? [] : isMasonry ? [...PHOTOS] : [...USERS],
    loading,
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

// The masonry tiles only ask the file service for image URLs; the story
// serves placeholder images instead of an API.
const FILE_SERVICE = {
  getUrl: (id: string) => `https://picsum.photos/seed/${id}/400/300`,
  download: (id: string) => console.log('[storybook] download', id),
  upload: () => undefined,
  delete: () => Promise.resolve(),
} as unknown as FileService;

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
  parameters: {
    smart: {
      fileService: FILE_SERVICE,
      listModeComponents: LIST_PRESET_MODE_COMPONENTS,
    },
  },
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

/** One `<SmartList>` with its own options, kept for the cell's lifetime. */
const ListCell = ({
  mode,
  variant,
  hoverable,
  header,
  loading,
  empty,
  className,
}: {
  mode: ListMode;
  variant?: ListArgs['variant'];
  hoverable?: boolean;
  header?: ListArgs['header'];
  loading?: boolean;
  empty?: boolean;
  className?: string;
}) => {
  const options = useMemo(() => {
    const presentation: BuildOptions['presentation'] = {
      ...(variant !== undefined ? { variant } : {}),
      ...(hoverable !== undefined ? { hoverable } : {}),
      ...(header !== undefined ? { header } : {}),
    };

    return buildOptions(mode, {
      presentation: Object.keys(presentation).length ? presentation : undefined,
      loading,
      empty,
    });
  }, [mode, variant, hoverable, header, loading, empty]);

  return <SmartList options={options} className={className} />;
};

// #region usage
export const Playground: Story = {
  name: 'Playground',
  render: (args) => (
    <div style={{ padding: 40 }}>
      <ListCell
        mode={args.mode}
        variant={args.variant}
        hoverable={args.hoverable}
        header={args.header}
        loading={args.loading}
        empty={args.empty}
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
    {children}
  </section>
);

const Labelled = ({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) => (
  <div style={{ marginBottom: 16 }}>
    <p style={{ fontSize: 13, opacity: 0.7, marginBottom: 6 }}>{label}</p>
    {children}
  </div>
);

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: 32, padding: 24 }}
    >
      <Section title="Mode: desktop">
        <ListCell mode={ListMode.desktop} />
      </Section>

      <Section title="Mode: mobile">
        <ListCell mode={ListMode.mobile} />
      </Section>

      <Section title="Mode: masonry grid">
        <ListCell mode={ListMode.masonryGrid} />
      </Section>

      <Section title="Desktop presentation variants">
        {PRESENTATION_VARIANTS.map((variant) => (
          <Labelled key={variant} label={variant}>
            <ListCell mode={ListMode.desktop} variant={variant} />
          </Labelled>
        ))}
      </Section>

      <Section title="Desktop header styles">
        {HEADER_VARIANTS.map((header) => (
          <Labelled key={header} label={header}>
            <ListCell mode={ListMode.desktop} header={header} />
          </Labelled>
        ))}
      </Section>

      <Section title="Hoverable rows">
        <ListCell mode={ListMode.desktop} hoverable={true} />
      </Section>

      <Section title="Loading">
        <ListCell mode={ListMode.desktop} loading={true} />
      </Section>

      <Section title="Empty (no results)">
        <ListCell mode={ListMode.desktop} empty={true} />
      </Section>

      <Section title="External class">
        <ListCell
          mode={ListMode.desktop}
          className="smart:rounded-lg smart:bg-yellow-50 smart:p-4 smart:dark:bg-yellow-900/30"
        />
      </Section>
    </div>
  ),
};
