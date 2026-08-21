import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { DropdownComponent } from './dropdown.component';
import { DropdownPresetComponent } from './preset/preset.component';
import { IDropdownItem, SmartDropdownVariant } from '../../models';
import { DROPDOWN_STANDARD_COMPONENT_TOKEN } from '../../shared.inectors';

const VARIANTS: SmartDropdownVariant[] = [
  'simple',
  'with-dividers',
  'with-icons',
  'minimal',
  'with-header',
];

// Showcase headings read as prose, not as the raw option value.
const VARIANT_LABELS: Record<SmartDropdownVariant, string> = {
  simple: 'Simple',
  'with-dividers': 'With dividers',
  'with-icons': 'With icons',
  minimal: 'Minimal',
  'with-header': 'With header',
};

const ITEMS: IDropdownItem[] = [
  { id: 'newsletter', label: 'Newsletter', icon: '✉' },
  { id: 'purchases', label: 'Purchases', icon: '🛒' },
  { id: 'sep', label: '', divider: true },
  { id: 'downloads', label: 'Downloads', icon: '⬇' },
  { id: 'team', label: 'Team Account', icon: '👥' },
];

interface DropdownArgs {
  triggerLabel: string;
  variant: SmartDropdownVariant;
  headerLabel: string;
  open: boolean;
}

const meta: Meta<DropdownArgs> = {
  title: 'Components/Dropdown',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [DropdownComponent],
      // Register the preset variation as the replacement for the standard
      // dropdown, so every <smart-dropdown> renders DropdownPresetComponent.
      providers: [
        {
          provide: DROPDOWN_STANDARD_COMPONENT_TOKEN,
          useValue: DropdownPresetComponent,
        },
      ],
    }),
  ],
  argTypes: {
    triggerLabel: { control: 'text' },
    variant: { control: 'select', options: VARIANTS },
    headerLabel: { control: 'text' },
    open: { control: 'boolean' },
  },
  args: {
    triggerLabel: 'Actions',
    variant: 'simple',
    headerLabel: 'james@site.com',
    open: true,
  },
};

export default meta;
type Story = StoryObj<DropdownArgs>;

export const Playground: Story = {
  name: 'Playground',
  render: (args) => ({
    props: {
      items: ITEMS,
      triggerLabel: args.triggerLabel,
      open: args.open,
      options: { variant: args.variant, headerLabel: args.headerLabel },
    },
    template: `
      <div style="padding: 40px; min-height: 320px;">
        <smart-dropdown
          [items]="items"
          [triggerLabel]="triggerLabel"
          [open]="open"
          [options]="options"
        ></smart-dropdown>
      </div>
    `,
  }),
};

// The menu is already correctly scoped — DROPDOWN_CONTAINER is
// `smart:relative smart:inline-flex` and the menu is `smart:absolute` inside it,
// so no containing-block trick is needed here. The variants collided purely
// because each section was only as wide as its trigger (~110px) while every
// menu is `smart:min-w-60` (240px), so each open menu ran over its neighbour.
// Reserving 280px of width and 320px of height per section keeps them apart.
const variantColumn = (variant: SmartDropdownVariant) => `
  <section style="display: flex; flex-direction: column; gap: 8px; width: 280px; min-height: 320px;">
    <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">${VARIANT_LABELS[variant]}</h3>
    <smart-dropdown
      [items]="items"
      triggerLabel="Actions"
      [open]="true"
      [options]="{ variant: '${variant}', headerLabel: 'james@site.com' }"
    ></smart-dropdown>
  </section>
`;

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => ({
    props: { items: ITEMS },
    template: `
      <div style="display: flex; flex-wrap: wrap; gap: 48px; padding: 24px; min-height: 360px;">
        ${VARIANTS.map((variant) => variantColumn(variant)).join('\n        ')}
      </div>
    `,
  }),
};
