import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';

import { SmartCard } from './card';
import { SmartCardPreset } from './preset/card-preset';

interface CardArgs {
  title: string;
  hasHeader: boolean;
  hasFooter: boolean;
  grayBody: boolean;
  grayFooter: boolean;
}

const meta: Meta<CardArgs> = {
  title: 'Components/Card',
  tags: ['autodocs'],
  // Register the preset variation as the replacement for the standard
  // card, so every <SmartCard> renders SmartCardPreset.
  parameters: {
    smart: { components: { card: SmartCardPreset } },
  },
  argTypes: {
    title: { control: 'text' },
    hasHeader: { control: 'boolean' },
    hasFooter: { control: 'boolean' },
    grayBody: { control: 'boolean' },
    grayFooter: { control: 'boolean' },
  },
  args: {
    title: 'Card title',
    hasHeader: true,
    hasFooter: true,
    grayBody: false,
    grayFooter: false,
  },
};

export default meta;
type Story = StoryObj<CardArgs>;

// #region usage
export const Playground: Story = {
  name: 'Playground',
  render: (args) => (
    <div style={{ maxWidth: 360, padding: 40 }}>
      <SmartCard
        options={{
          title: args.title,
          grayBody: args.grayBody,
          grayFooter: args.grayFooter,
        }}
        hasHeader={args.hasHeader}
        hasFooter={args.hasFooter}
        footer={
          <span className="smart:text-sm smart:text-gray-500 smart:dark:text-gray-400">
            Footer content
          </span>
        }
      >
        <p className="smart:text-gray-500 smart:dark:text-gray-400">
          Some quick example text to build on the card title and make up the
          bulk of the card&apos;s content.
        </p>
      </SmartCard>
    </div>
  ),
};
// #endregion

// In Angular every card renders inside its host element (<smart-card-preset>),
// and that element, not the card, is the grid item, so the card keeps its
// natural height instead of stretching to the row. This <div> plays the part
// of the host element.
const Host = ({ children }: { children: ReactNode }) => <div>{children}</div>;

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: 24,
        padding: 24,
      }}
    >
      <Host>
        <SmartCard>
          <h3 className="smart:font-semibold smart:text-gray-900 smart:dark:text-white">
            Simple card
          </h3>
          <p className="smart:mt-1 smart:text-gray-500 smart:dark:text-gray-400">
            A barebones card with only body content.
          </p>
        </SmartCard>
      </Host>

      <Host>
        <SmartCard options={{ title: 'With header' }} hasHeader={true}>
          <p className="smart:text-gray-500 smart:dark:text-gray-400">
            Header renders the title from options.
          </p>
        </SmartCard>
      </Host>

      <Host>
        <SmartCard
          options={{ title: 'Header and footer' }}
          hasHeader={true}
          hasFooter={true}
          footer={
            <span className="smart:text-sm smart:text-gray-500 smart:dark:text-gray-400">
              Featured
            </span>
          }
        >
          <p className="smart:text-gray-500 smart:dark:text-gray-400">
            Card with both a header and a footer slot.
          </p>
        </SmartCard>
      </Host>

      <Host>
        <SmartCard
          options={{ title: 'Gray body', grayBody: true }}
          hasHeader={true}
        >
          <p className="smart:text-gray-500 smart:dark:text-gray-400">
            The body has a subtle gray surface.
          </p>
        </SmartCard>
      </Host>

      <Host>
        <SmartCard
          options={{ title: 'Gray footer', grayFooter: true }}
          hasHeader={true}
          hasFooter={true}
          footer={
            <span className="smart:text-sm smart:text-gray-500 smart:dark:text-gray-400">
              Footer
            </span>
          }
        >
          <p className="smart:text-gray-500 smart:dark:text-gray-400">
            The footer has a subtle gray surface.
          </p>
        </SmartCard>
      </Host>
    </div>
  ),
};
