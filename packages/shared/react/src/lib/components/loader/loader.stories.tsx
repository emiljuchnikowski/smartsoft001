import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';

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

/**
 * Wraps a loader in a flex item that stays even when the loader renders
 * nothing, so the row keeps its gap.
 */
const Host = ({ children }: { children: ReactNode }) => <div>{children}</div>;

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
          <Host>
            <SmartLoader show={true} size="xs" />
          </Host>
          <Host>
            <SmartLoader show={true} size="sm" />
          </Host>
          <Host>
            <SmartLoader show={true} size="md" />
          </Host>
          <Host>
            <SmartLoader show={true} size="lg" />
          </Host>
          <Host>
            <SmartLoader show={true} size="xl" />
          </Host>
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
          <Host>
            <SmartLoader show={true} color="slate" />
          </Host>
          <Host>
            <SmartLoader show={true} color="red" />
          </Host>
          <Host>
            <SmartLoader show={true} color="orange" />
          </Host>
          <Host>
            <SmartLoader show={true} color="amber" />
          </Host>
          <Host>
            <SmartLoader show={true} color="yellow" />
          </Host>
          <Host>
            <SmartLoader show={true} color="green" />
          </Host>
          <Host>
            <SmartLoader show={true} color="emerald" />
          </Host>
          <Host>
            <SmartLoader show={true} color="teal" />
          </Host>
          <Host>
            <SmartLoader show={true} color="sky" />
          </Host>
          <Host>
            <SmartLoader show={true} color="blue" />
          </Host>
          <Host>
            <SmartLoader show={true} color="indigo" />
          </Host>
          <Host>
            <SmartLoader show={true} color="violet" />
          </Host>
          <Host>
            <SmartLoader show={true} color="purple" />
          </Host>
          <Host>
            <SmartLoader show={true} color="pink" />
          </Host>
          <Host>
            <SmartLoader show={true} color="rose" />
          </Host>
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
          <Host>
            <SmartLoader show={false} />
          </Host>
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
