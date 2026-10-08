import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';

import { IToggleOptions } from '../../models';
import { SmartTogglePreset } from './preset/toggle-preset';
import { SmartToggle } from './toggle';

interface ToggleArgs {
  value: boolean;
  disabled: boolean;
  label: string;
  description: string;
  labelPosition: 'left' | 'right';
}

const meta: Meta<ToggleArgs> = {
  title: 'Components/Toggle',
  tags: ['autodocs'],
  parameters: {
    // Register the preset variation as the replacement for the standard
    // toggle, so every <SmartToggle> renders SmartTogglePreset.
    smart: { components: { toggle: SmartTogglePreset } },
  },
  argTypes: {
    value: { control: 'boolean' },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    description: { control: 'text' },
    labelPosition: { control: 'radio', options: ['left', 'right'] },
  },
  args: {
    value: false,
    disabled: false,
    label: 'Allow notifications',
    description: '',
    labelPosition: 'right',
  },
};

export default meta;
type Story = StoryObj<ToggleArgs>;

// `value` is a model in Angular, bound one way here: the toggle keeps its own
// state after a click until the control changes it again.
// #region usage
export const Playground: Story = {
  name: 'Playground',
  render: (args) => (
    <div style={{ padding: 40 }}>
      <SmartToggle
        key={String(args.value)}
        defaultValue={args.value}
        disabled={args.disabled}
        options={
          {
            label: args.label,
            description: args.description,
            labelPosition: args.labelPosition,
          } satisfies IToggleOptions
        }
      />
    </div>
  ),
};
// #endregion

const sectionTitle = { fontSize: 16, fontWeight: 600, marginBottom: 12 };

/**
 * Stands in for the `<smart-toggle>` host element of the Angular story,
 * whose inline `<smart-toggle-standard>` gives each toggle a line box.
 */
const Host = ({ children }: { children: ReactNode }) => <div>{children}</div>;

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
        <h3 style={sectionTitle}>Default</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <Host>
            <SmartToggle defaultValue={false} />
          </Host>
          <Host>
            <SmartToggle defaultValue={true} />
          </Host>
        </div>
      </section>

      <section>
        <h3 style={sectionTitle}>Disabled</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <Host>
            <SmartToggle defaultValue={false} disabled={true} />
          </Host>
          <Host>
            <SmartToggle defaultValue={true} disabled={true} />
          </Host>
        </div>
      </section>

      <section>
        <h3 style={sectionTitle}>With label</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Host>
            <SmartToggle defaultValue={false} options={{ label: 'Off' }} />
          </Host>
          <Host>
            <SmartToggle defaultValue={true} options={{ label: 'On' }} />
          </Host>
        </div>
      </section>

      <section>
        <h3 style={sectionTitle}>With description</h3>
        <Host>
          <SmartToggle
            defaultValue={true}
            options={{
              label: 'Notifications',
              description: 'Receive push alerts on your device',
            }}
          />
        </Host>
      </section>

      <section>
        <h3 style={sectionTitle}>Label position</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Host>
            <SmartToggle
              defaultValue={true}
              options={{ label: 'Label right', labelPosition: 'right' }}
            />
          </Host>
          <Host>
            <SmartToggle
              defaultValue={true}
              options={{ label: 'Label left', labelPosition: 'left' }}
            />
          </Host>
        </div>
      </section>
    </div>
  ),
};
