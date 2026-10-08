import type { Meta, StoryObj } from '@storybook/react-vite';

import { SmartLoader } from './loader';
import { SmartLoaderPreset } from './preset/loader-preset';
import { SmartColor, SmartSize } from '../../models';

interface LoaderArgs {
  show: boolean;
  size: SmartSize;
  color: SmartColor;
  cssClass: string;
}

const meta: Meta<LoaderArgs> = {
  title: 'Components/Loader',
  component: SmartLoader,
  tags: ['autodocs'],
  parameters: {
    // Register the preset variation as the replacement for the standard
    // loader, so every <SmartLoader> renders SmartLoaderPreset.
    smart: { components: { loader: SmartLoaderPreset } },
  },
  argTypes: {
    show: {
      control: 'boolean',
      description: 'Show or hide the spinner',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Spinner size',
    },
    color: {
      control: 'select',
      options: [
        'slate',
        'gray',
        'zinc',
        'red',
        'orange',
        'amber',
        'yellow',
        'lime',
        'green',
        'emerald',
        'teal',
        'cyan',
        'sky',
        'blue',
        'indigo',
        'violet',
        'purple',
        'fuchsia',
        'pink',
        'rose',
      ],
      description: 'Spinner color',
    },
    cssClass: {
      control: 'text',
      description: 'External CSS class (alias for `class`)',
    },
  },
};

export default meta;
type Story = StoryObj<LoaderArgs>;

// #region usage
export const Playground: Story = {
  name: 'Playground',
  args: {
    show: true,
    size: 'md',
    color: 'indigo',
    cssClass: '',
  },
  render: (args) => (
    <div style={{ padding: 40 }}>
      <SmartLoader
        show={args.show}
        size={args.size}
        color={args.color}
        className={args.cssClass}
      />
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
        gap: 32,
        padding: 24,
      }}
    >
      <section>
        <h3 style={sectionTitle}>Sizes (indigo)</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <SmartLoader show={true} size="xs" />
          <SmartLoader show={true} size="sm" />
          <SmartLoader show={true} size="md" />
          <SmartLoader show={true} size="lg" />
          <SmartLoader show={true} size="xl" />
        </div>
      </section>

      <section>
        <h3 style={sectionTitle}>Colors (size md)</h3>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <SmartLoader show={true} color="slate" />
          <SmartLoader show={true} color="red" />
          <SmartLoader show={true} color="orange" />
          <SmartLoader show={true} color="amber" />
          <SmartLoader show={true} color="yellow" />
          <SmartLoader show={true} color="green" />
          <SmartLoader show={true} color="emerald" />
          <SmartLoader show={true} color="teal" />
          <SmartLoader show={true} color="sky" />
          <SmartLoader show={true} color="blue" />
          <SmartLoader show={true} color="indigo" />
          <SmartLoader show={true} color="violet" />
          <SmartLoader show={true} color="purple" />
          <SmartLoader show={true} color="pink" />
          <SmartLoader show={true} color="rose" />
        </div>
      </section>

      <section>
        <h3 style={sectionTitle}>Hidden (show = false)</h3>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            minHeight: 32,
            padding: 8,
            border: '1px dashed #d1d5db',
          }}
        >
          <SmartLoader show={false} />
          <span style={{ fontSize: 14, color: '#6b7280' }}>
            Nothing rendered above
          </span>
        </div>
      </section>

      <section>
        <h3 style={sectionTitle}>With external class</h3>
        <SmartLoader show={true} size="lg" className="smart:text-fuchsia-500" />
      </section>
    </div>
  ),
};
