import type { Meta, StoryObj } from '@storybook/react-vite';

import { SmartDropdown } from './dropdown';
import { SmartDropdownPreset } from './preset/dropdown-preset';
import { IDropdownItem, SmartDropdownVariant } from '../../models';

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
  parameters: {
    // Register the preset variation as the replacement for the standard
    // dropdown, so every <SmartDropdown> renders SmartDropdownPreset.
    smart: { components: { dropdown: SmartDropdownPreset } },
  },
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

// The Angular stories bind `[open]` one way into the dropdown's `open` model,
// so the menu can still be toggled: `defaultOpen` (re-mounted when the
// control changes) is the React counterpart.

// #region usage
export const Playground: Story = {
  name: 'Playground',
  render: (args) => (
    <div style={{ padding: 40, minHeight: 320 }}>
      <SmartDropdown
        key={String(args.open)}
        items={ITEMS}
        triggerLabel={args.triggerLabel}
        defaultOpen={args.open}
        options={{ variant: args.variant, headerLabel: args.headerLabel }}
      />
    </div>
  ),
};
// #endregion

// The menu is already correctly scoped — DROPDOWN_CONTAINER is
// `smart:relative smart:inline-flex` and the menu is `smart:absolute` inside it,
// so no containing-block trick is needed here. The variants collided purely
// because each section was only as wide as its trigger (~110px) while every
// menu is `smart:min-w-60` (240px), so each open menu ran over its neighbour.
// Reserving 280px of width and 320px of height per section keeps them apart.
const VariantColumn = ({ variant }: { variant: SmartDropdownVariant }) => (
  <section
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      width: 280,
      minHeight: 320,
    }}
  >
    <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>
      {VARIANT_LABELS[variant]}
    </h3>
    <SmartDropdown
      items={ITEMS}
      triggerLabel="Actions"
      defaultOpen={true}
      options={{ variant, headerLabel: 'james@site.com' }}
    />
  </section>
);

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 48,
        padding: 24,
        minHeight: 360,
      }}
    >
      {VARIANTS.map((variant) => (
        <VariantColumn key={variant} variant={variant} />
      ))}
    </div>
  ),
};
