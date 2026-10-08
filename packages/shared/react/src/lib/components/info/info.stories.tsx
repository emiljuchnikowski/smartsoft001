import type { Meta, StoryObj } from '@storybook/react-vite';

import { SmartInfo } from './info';
import { SmartInfoPreset } from './preset/info-preset';
import { IInfoOptions } from '../../models';

interface InfoArgs {
  options: IInfoOptions;
  cssClass: string;
}

const meta: Meta<InfoArgs> = {
  title: 'Components/Info',
  component: SmartInfo,
  tags: ['autodocs'],
  parameters: {
    // Register the preset variation as the replacement for the standard
    // info component, so every <SmartInfo> renders SmartInfoPreset.
    smart: { components: { info: SmartInfoPreset } },
  },
  argTypes: {
    options: {
      control: 'object',
      description: 'IInfoOptions — `{ text: string }`',
    },
    cssClass: {
      control: 'text',
      description: 'External CSS class (alias for `class`)',
    },
  },
};

export default meta;
type Story = StoryObj<InfoArgs>;

// #region usage
export const Playground: Story = {
  name: 'Playground',
  args: {
    options: {
      text: 'This is an info tooltip with helpful information about the field.',
    },
    cssClass: '',
  },
  render: (args) => (
    <div style={{ padding: 60 }}>
      <p style={{ marginBottom: 16, fontSize: 14 }}>
        Hover or focus the info icon to reveal the tooltip:
      </p>
      <SmartInfo options={args.options} className={args.cssClass} />
    </div>
  ),
};
// #endregion

const sectionTitle = { fontSize: 16, fontWeight: 600, marginBottom: 12 };

export const AllVariants: Story = {
  name: 'All variants',
  parameters: {
    controls: { disable: true },
  },
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 48,
        padding: 48,
      }}
    >
      <section>
        <h3 style={sectionTitle}>Placements (hover / focus the icon)</h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            gap: 16,
            maxWidth: 320,
          }}
        >
          <div style={{ gridColumnStart: 2, textAlign: 'center' }}>
            <SmartInfoPreset
              placement="top"
              options={{ text: 'Tooltip on top' }}
            />
          </div>
          <div style={{ gridColumnStart: 1, textAlign: 'end' }}>
            <SmartInfoPreset
              placement="left"
              options={{ text: 'Tooltip on left' }}
            />
          </div>
          <div style={{ gridColumnStart: 3 }}>
            <SmartInfoPreset
              placement="right"
              options={{ text: 'Tooltip on right' }}
            />
          </div>
          <div style={{ gridColumnStart: 2, textAlign: 'center' }}>
            <SmartInfoPreset
              placement="bottom"
              options={{ text: 'Tooltip on bottom' }}
            />
          </div>
        </div>
      </section>

      <section>
        <h3 style={sectionTitle}>Inline with label (registered via token)</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <label style={{ fontSize: 14, fontWeight: 500 }}>Email address</label>
          <SmartInfo
            options={{
              text: 'Enter your primary email address. This will be used for notifications.',
            }}
          />
        </div>
      </section>

      <section>
        <h3 style={sectionTitle}>With external class</h3>
        <SmartInfo
          className="smart:opacity-90"
          options={{ text: 'External class applied via the class alias.' }}
        />
      </section>
    </div>
  ),
};
