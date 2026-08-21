import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { CommandPaletteComponent } from './command-palette.component';
import { CommandPalettePresetComponent } from './preset/preset.component';
import { ICommand, SmartCommandPaletteVariant } from '../../models';
import { COMMAND_PALETTE_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

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
  decorators: [
    moduleMetadata({
      imports: [CommandPaletteComponent],
      // Register the preset variation so every <smart-command-palette>
      // renders CommandPalettePresetComponent through NgComponentOutlet.
      providers: [
        {
          provide: COMMAND_PALETTE_STANDARD_COMPONENT_TOKEN,
          useValue: CommandPalettePresetComponent,
        },
      ],
    }),
  ],
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

export const Playground: Story = {
  name: 'Playground',
  render: (args) => ({
    props: {
      commands: COMMANDS,
      open: args.open,
      query: args.query,
      options: {
        variant: args.variant,
        placeholder: args.placeholder,
        emptyText: args.emptyText,
      },
    },
    template: `
      <div style="padding: 40px;">
        <smart-command-palette
          [commands]="commands"
          [open]="open"
          [query]="query"
          [options]="options"
        ></smart-command-palette>
      </div>
    `,
  }),
};

// The palette's root is a <dialog>, which the UA stylesheet positions
// `absolute` — no Tailwind class does it, so it is easy to miss. Being out of
// flow it contributes no height, so without a sized containing block every
// variant collapses onto its neighbours. `position: relative` re-anchors it and
// the reserved height is what actually separates the variants; the transform
// keeps this identical to the modal/drawer wrappers, which need it for `fixed`.
const wrap = (body: string, minHeight: number) => `
  <div style="position: relative; transform: translateZ(0); overflow: hidden; min-height: ${minHeight}px;">
    ${body}
  </div>
`;

// `with-preview` and `with-footer` render taller panels than the rest.
const heightFor = (variant: SmartCommandPaletteVariant) =>
  variant === 'with-preview' || variant === 'with-footer' ? 560 : 480;

const block = (variant: SmartCommandPaletteVariant) => `
  <section>
    <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">${VARIANT_LABELS[variant]}</h3>
    ${wrap(
      `<smart-command-palette
      [commands]="commands"
      [open]="true"
      [options]="{
        variant: '${variant}',
        placeholder: 'Search commands…',
        emptyText: 'No results'
      }"
    ></smart-command-palette>`,
      heightFor(variant),
    )}
  </section>
`;

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => ({
    props: { commands: COMMANDS },
    template: `
      <div style="display: flex; flex-direction: column; gap: 32px; padding: 24px;">
        ${VARIANTS.map((variant) => block(variant)).join('\n        ')}

        <section>
          <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">Empty (no match)</h3>
          ${wrap(
            `<smart-command-palette
            [commands]="commands"
            [open]="true"
            query="zzzzz"
            [options]="{
              variant: 'simple',
              placeholder: 'Search commands…',
              emptyText: 'No results'
            }"
          ></smart-command-palette>`,
            260,
          )}
        </section>
      </div>
    `,
  }),
};
