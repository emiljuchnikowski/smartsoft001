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

const block = (variant: SmartCommandPaletteVariant) => `
  <section>
    <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">${variant}</h3>
    <smart-command-palette
      [commands]="commands"
      [open]="true"
      [options]="{
        variant: '${variant}',
        placeholder: 'Search commands…',
        emptyText: 'No results'
      }"
    ></smart-command-palette>
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
          <smart-command-palette
            [commands]="commands"
            [open]="true"
            query="zzzzz"
            [options]="{
              variant: 'simple',
              placeholder: 'Search commands…',
              emptyText: 'No results'
            }"
          ></smart-command-palette>
        </section>
      </div>
    `,
  }),
};
