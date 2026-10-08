import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';

import { SmartMultiColumnLayoutPreset } from './preset/multi-column-layout-preset';
import { IMultiColumnLayoutOptions } from '../../models';

const WIDTHS = ['full', 'constrained'] as const;
const SECONDARY_WIDTHS = ['sm', 'md', 'lg'] as const;

interface MultiColumnLayoutArgs {
  title: string;
  width: (typeof WIDTHS)[number];
  secondaryWidth: (typeof SECONDARY_WIDTHS)[number];
  withNav: boolean;
  withSecondary: boolean;
  withHeader: boolean;
}

const meta: Meta<MultiColumnLayoutArgs> = {
  title: 'Components/MultiColumnLayout',
  tags: ['autodocs'],
  parameters: {
    // SmartMultiColumnLayoutPreset is rendered directly; the registration
    // mirrors how the preset becomes the replacement for every
    // <SmartMultiColumnLayout>.
    smart: {
      components: { 'multi-column-layout': SmartMultiColumnLayoutPreset },
    },
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Fallback heading used when `headerTpl` is not supplied.',
    },
    width: { control: 'inline-radio', options: WIDTHS },
    secondaryWidth: { control: 'inline-radio', options: SECONDARY_WIDTHS },
    withNav: { control: 'boolean' },
    withSecondary: { control: 'boolean' },
    withHeader: { control: 'boolean' },
  },
  args: {
    title: 'Inbox',
    width: 'full',
    secondaryWidth: 'sm',
    withNav: true,
    withSecondary: true,
    withHeader: true,
  },
};

export default meta;
type Story = StoryObj<MultiColumnLayoutArgs>;

const navTpl: ReactNode = (
  <nav className="smart:flex smart:flex-col smart:gap-2 smart:p-4 smart:text-sm smart:text-gray-600 smart:dark:text-gray-300">
    <a
      href="#"
      className="smart:font-medium smart:text-gray-900 smart:dark:text-white"
    >
      Inbox
    </a>
    <a href="#">Sent</a>
    <a href="#">Drafts</a>
    <a href="#">Archive</a>
  </nav>
);

const headerTpl: ReactNode = (
  <div className="smart:flex smart:items-center smart:justify-between">
    <h1 className="smart:text-2xl smart:font-semibold smart:text-gray-900 smart:dark:text-white">
      Inbox
    </h1>
    <button className="smart:rounded-md smart:bg-teal-600 smart:px-3 smart:py-2 smart:text-sm smart:font-medium smart:text-white">
      Compose
    </button>
  </div>
);

const secondaryTpl: ReactNode = (
  <div className="smart:p-4 smart:text-sm smart:text-gray-600 smart:dark:text-gray-300">
    <p className="smart:font-medium smart:text-gray-900 smart:dark:text-white">
      Filters
    </p>
    <ul className="smart:mt-2 smart:space-y-1">
      <li>Unread</li>
      <li>Flagged</li>
      <li>Attachments</li>
    </ul>
  </div>
);

// #region usage
export const Playground: Story = {
  name: 'Playground',
  render: (args) => {
    const options: IMultiColumnLayoutOptions = {
      title: args.title,
      width: args.width,
      secondaryWidth: args.secondaryWidth,
      navTpl: args.withNav ? navTpl : undefined,
      secondaryTpl: args.withSecondary ? secondaryTpl : undefined,
      headerTpl: args.withHeader ? headerTpl : undefined,
    };

    return (
      <div style={{ padding: 24 }}>
        <SmartMultiColumnLayoutPreset options={options}>
          <p className="smart:text-gray-600 smart:dark:text-gray-300">
            Main content projected into the layout body.
          </p>
        </SmartMultiColumnLayoutPreset>
      </div>
    );
  },
};
// #endregion

const Layout = ({
  body,
  options,
}: {
  body: string;
  options: IMultiColumnLayoutOptions;
}) => (
  <SmartMultiColumnLayoutPreset options={options}>
    <p className="smart:text-gray-600 smart:dark:text-gray-300">{body}</p>
  </SmartMultiColumnLayoutPreset>
);

const Section = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <section>
    <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>{title}</h3>
    <div style={{ display: 'grid', gap: 24 }}>{children}</div>
  </section>
);

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
      <Section title="Width">
        {WIDTHS.map((width) => (
          <Layout
            key={width}
            body={`width: ${width}`}
            options={{
              headerTpl,
              navTpl,
              secondaryTpl,
              width,
              secondaryWidth: 'sm',
            }}
          />
        ))}
      </Section>

      <Section title="Secondary column width">
        {SECONDARY_WIDTHS.map((secondaryWidth) => (
          <Layout
            key={secondaryWidth}
            body={`secondaryWidth: ${secondaryWidth}`}
            options={{
              headerTpl,
              navTpl,
              secondaryTpl,
              width: 'full',
              secondaryWidth,
            }}
          />
        ))}
      </Section>

      <Section title="Header from a title or from a template">
        <Layout
          body="Header taken from the title"
          options={{ title: 'Reports', navTpl, secondaryTpl, width: 'full' }}
        />
        <Layout
          body="Header taken from a template"
          options={{ headerTpl, navTpl, secondaryTpl, width: 'full' }}
        />
      </Section>

      <Section title="Optional columns">
        <Layout
          body="no nav"
          options={{ title: 'No nav', secondaryTpl, width: 'full' }}
        />
        <Layout
          body="no secondary column"
          options={{ title: 'No secondary', navTpl, width: 'full' }}
        />
        <Layout
          body="main content only"
          options={{ title: 'Main only', width: 'full' }}
        />
      </Section>
    </div>
  ),
};
