import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';

import { SmartCommandPalette } from './command-palette';
import { ICommand, SmartCommandPaletteVariant } from '../../models';
import { SmartCommandPalettePreset } from './preset/command-palette-preset';

const COMMANDS: ICommand[] = [
  {
    id: 'new-file',
    label: 'New file',
    icon: 'N',
    group: 'Files',
    description: 'Create a blank file in the current folder.',
    imageUrl: 'https://i.pravatar.cc/64?img=1',
  },
  {
    id: 'open-settings',
    label: 'Open settings',
    icon: 'S',
    group: 'Files',
    description: 'Edit your workspace preferences.',
    imageUrl: 'https://i.pravatar.cc/64?img=2',
  },
  {
    id: 'toggle-theme',
    label: 'Toggle theme',
    icon: 'T',
    group: 'View',
    description: 'Switch between light and dark mode.',
    imageUrl: 'https://i.pravatar.cc/64?img=3',
  },
  {
    id: 'run-tests',
    label: 'Run tests',
    icon: 'R',
    group: 'Tools',
    description: 'Execute the project test suite.',
    imageUrl: 'https://i.pravatar.cc/64?img=4',
  },
];

const VARIANTS: SmartCommandPaletteVariant[] = [
  'simple',
  'with-padding',
  'with-icons',
  'with-images',
  'semi-transparent',
  'with-groups',
  'with-footer',
  'with-preview',
];

// Showcase headings read as prose, not as the raw option value.
const VARIANT_LABELS: Record<SmartCommandPaletteVariant, string> = {
  simple: 'Simple',
  'with-padding': 'With padding',
  'with-icons': 'With icons',
  'with-images': 'With images',
  'semi-transparent': 'Translucent background',
  'with-groups': 'With groups',
  'with-footer': 'With footer',
  'with-preview': 'With preview',
};

interface CommandPaletteArgs {
  variant: SmartCommandPaletteVariant;
  placeholder: string;
  emptyText: string;
  open: boolean;
  query: string;
}

const meta: Meta<CommandPaletteArgs> = {
  title: 'Components/Command Palette',
  tags: ['autodocs'],
  // Register the preset variation so every <SmartCommandPalette> renders
  // SmartCommandPalettePreset.
  parameters: {
    smart: { components: { 'command-palette': SmartCommandPalettePreset } },
  },
  argTypes: {
    variant: { control: 'select', options: VARIANTS },
    placeholder: { control: 'text' },
    emptyText: { control: 'text' },
    open: { control: 'boolean' },
    query: {
      control: 'text',
      description:
        'Filters the command list — set a non-matching value to see the empty state.',
    },
  },
  args: {
    variant: 'simple',
    placeholder: 'Search commands…',
    emptyText: 'No results',
    open: true,
    query: '',
  },
};

export default meta;
type Story = StoryObj<CommandPaletteArgs>;

// #region usage
export const Playground: Story = {
  name: 'Playground',
  render: (args) => (
    <div style={{ padding: 40 }}>
      <SmartCommandPalette
        // Remounts when the `open` / `query` controls change, so they become
        // the new initial state; typing and closing stay inside the palette.
        key={`${args.open}|${args.query}`}
        commands={COMMANDS}
        defaultOpen={args.open}
        defaultQuery={args.query}
        options={{
          variant: args.variant,
          placeholder: args.placeholder,
          emptyText: args.emptyText,
        }}
      />
    </div>
  ),
};
// #endregion

// The palette's root is a <dialog>, which the UA stylesheet positions
// `absolute` — no Tailwind class does it, so it is easy to miss. Being out of
// flow it contributes no height, so without a sized containing block every
// variant collapses onto its neighbours. `position: relative` re-anchors it and
// the reserved height is what actually separates the variants; the transform
// keeps this identical to the modal/drawer wrappers, which need it for `fixed`.
const Wrap = ({
  minHeight,
  children,
}: {
  minHeight: number;
  children: ReactNode;
}) => (
  <div
    style={{
      position: 'relative',
      transform: 'translateZ(0)',
      overflow: 'hidden',
      minHeight,
    }}
  >
    {children}
  </div>
);

// `with-preview` and `with-footer` render taller panels than the rest.
const heightFor = (variant: SmartCommandPaletteVariant) =>
  variant === 'with-preview' || variant === 'with-footer' ? 560 : 480;

const sectionTitle = { fontSize: 16, fontWeight: 600, marginBottom: 12 };

const Block = ({ variant }: { variant: SmartCommandPaletteVariant }) => (
  <section>
    <h3 style={sectionTitle}>{VARIANT_LABELS[variant]}</h3>
    <Wrap minHeight={heightFor(variant)}>
      <SmartCommandPalette
        commands={COMMANDS}
        defaultOpen={true}
        options={{
          variant,
          placeholder: 'Search commands…',
          emptyText: 'No results',
        }}
      />
    </Wrap>
  </section>
);

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 32,
        padding: 24,
      }}
    >
      {VARIANTS.map((variant) => (
        <Block key={variant} variant={variant} />
      ))}

      <section>
        <h3 style={sectionTitle}>Empty (no match)</h3>
        <Wrap minHeight={260}>
          <SmartCommandPalette
            commands={COMMANDS}
            defaultOpen={true}
            defaultQuery="zzzzz"
            options={{
              variant: 'simple',
              placeholder: 'Search commands…',
              emptyText: 'No results',
            }}
          />
        </Wrap>
      </section>
    </div>
  ),
};
