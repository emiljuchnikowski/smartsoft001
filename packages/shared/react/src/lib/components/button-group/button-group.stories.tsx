import type { Meta, StoryObj } from '@storybook/react-vite';

import { SmartButtonGroup } from './button-group';
import { IButtonGroupButton, SmartButtonGroupVariant } from '../../models';
import { SmartButtonGroupPreset } from './preset/button-group-preset';

const VARIANTS: SmartButtonGroupVariant[] = [
  'basic',
  'icon-only',
  'with-stat',
  'with-dropdown',
  'with-checkbox-select',
];

const DEFAULT_BUTTONS: IButtonGroupButton[] = [
  { id: 'years', label: 'Years' },
  { id: 'month', label: 'Month' },
  { id: 'date', label: 'Date' },
];

interface ButtonGroupArgs {
  variant: SmartButtonGroupVariant;
  selected: string;
}

const meta: Meta<ButtonGroupArgs> = {
  title: 'Components/ButtonGroup',
  tags: ['autodocs'],
  // Register the preset variation as the replacement for the standard
  // button group, so every <SmartButtonGroup> renders the preset.
  parameters: {
    smart: { components: { 'button-group': SmartButtonGroupPreset } },
  },
  argTypes: {
    variant: { control: 'select', options: VARIANTS },
    selected: { control: 'radio', options: ['years', 'month', 'date'] },
  },
  args: {
    variant: 'basic',
    selected: 'month',
  },
};

export default meta;
type Story = StoryObj<ButtonGroupArgs>;

// #region usage
export const Playground: Story = {
  name: 'Playground',
  render: (args) => (
    <div style={{ padding: 40 }}>
      <SmartButtonGroup
        // Remounts when the `selected` control changes, so it becomes the new
        // initial selection; clicks select inside the group.
        key={args.selected}
        buttons={DEFAULT_BUTTONS}
        defaultSelected={args.selected}
        options={{ variant: args.variant }}
      />
    </div>
  ),
};
// #endregion

const STAT_BUTTONS: IButtonGroupButton[] = [
  { id: 'all', label: 'All', count: 24 },
  { id: 'open', label: 'Open', count: 8 },
  { id: 'closed', label: 'Closed', count: 16 },
];

const ICON_BUTTONS: IButtonGroupButton[] = [
  { id: 'bold', label: 'Bold', icon: 'B' },
  { id: 'italic', label: 'Italic', icon: 'I' },
  { id: 'underline', label: 'Underline', icon: 'U' },
];

const sectionTitle = { fontSize: 16, fontWeight: 600, marginBottom: 12 };

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
      <section>
        <h3 style={sectionTitle}>Basic</h3>
        <SmartButtonGroup
          buttons={DEFAULT_BUTTONS}
          defaultSelected="month"
          options={{ variant: 'basic' }}
        />
      </section>

      <section>
        <h3 style={sectionTitle}>Icon only</h3>
        <SmartButtonGroup
          buttons={ICON_BUTTONS}
          defaultSelected="bold"
          options={{ variant: 'icon-only' }}
        />
      </section>

      <section>
        <h3 style={sectionTitle}>With stat</h3>
        <SmartButtonGroup
          buttons={STAT_BUTTONS}
          defaultSelected="open"
          options={{ variant: 'with-stat' }}
        />
      </section>
    </div>
  ),
};
