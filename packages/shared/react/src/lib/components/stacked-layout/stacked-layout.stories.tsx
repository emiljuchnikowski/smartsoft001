import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';

import { IStackedLayoutOptions } from '../../models';
import { SmartStackedLayoutPreset } from './preset/stacked-layout-preset';

const CONTAINER_WIDTHS = ['sm', 'md', 'lg', 'xl', 'full'] as const;

interface StackedLayoutArgs {
  title: string;
  containerWidth: (typeof CONTAINER_WIDTHS)[number];
  withNav: boolean;
  withHeader: boolean;
}

const meta: Meta<StackedLayoutArgs> = {
  title: 'Components/StackedLayout',
  tags: ['autodocs'],
  parameters: {
    // SmartStackedLayoutPreset is rendered directly; it is also registered as
    // the replacement for every <SmartStackedLayout>.
    smart: { components: { 'stacked-layout': SmartStackedLayoutPreset } },
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Fallback heading used when `headerTpl` is not supplied.',
    },
    containerWidth: { control: 'select', options: CONTAINER_WIDTHS },
    withNav: { control: 'boolean' },
    withHeader: { control: 'boolean' },
  },
  args: {
    title: 'Projects',
    containerWidth: 'xl',
    withNav: true,
    withHeader: true,
  },
};

export default meta;
type Story = StoryObj<StackedLayoutArgs>;

const navTpl = (
  <div className="smart:flex smart:items-center smart:justify-between">
    <span className="smart:text-lg smart:font-bold smart:text-gray-900 smart:dark:text-white">
      Acme Inc.
    </span>
    <nav className="smart:flex smart:gap-4 smart:text-sm smart:text-gray-600 smart:dark:text-gray-300">
      <a href="#">Dashboard</a>
      <a href="#">Team</a>
      <a href="#">Projects</a>
    </nav>
  </div>
);

const headerTpl = (
  <div className="smart:flex smart:items-center smart:justify-between">
    <h1 className="smart:text-2xl smart:font-semibold smart:text-gray-900 smart:dark:text-white">
      Projects
    </h1>
    <button className="smart:rounded-md smart:bg-teal-600 smart:px-3 smart:py-2 smart:text-sm smart:font-medium smart:text-white">
      New project
    </button>
  </div>
);

// #region usage
export const Playground: Story = {
  name: 'Playground',
  render: (args) => (
    <div style={{ padding: 24 }}>
      <SmartStackedLayoutPreset
        options={{
          title: args.title,
          containerWidth: args.containerWidth,
          navTpl: args.withNav ? navTpl : undefined,
          headerTpl: args.withHeader ? headerTpl : undefined,
        }}
      >
        <p className="smart:text-gray-600 smart:dark:text-gray-300">
          Main content projected into the layout body.
        </p>
      </SmartStackedLayoutPreset>
    </div>
  ),
};
// #endregion

const Layout = ({
  body,
  options,
}: {
  body: string;
  options: IStackedLayoutOptions;
}) => (
  <SmartStackedLayoutPreset options={options}>
    <p className="smart:text-gray-600 smart:dark:text-gray-300">{body}</p>
  </SmartStackedLayoutPreset>
);

const sectionTitle = { fontSize: 16, fontWeight: 600, marginBottom: 12 };

const Section = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <section>
    <h3 style={sectionTitle}>{title}</h3>
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
      <Section title="Container widths">
        {CONTAINER_WIDTHS.map((containerWidth) => (
          <Layout
            key={containerWidth}
            body={`containerWidth: ${containerWidth}`}
            options={{
              navTpl: navTpl,
              headerTpl: headerTpl,
              containerWidth,
            }}
          />
        ))}
      </Section>

      <Section title="Header from a title or from a template">
        <Layout
          body="Header taken from the title"
          options={{ title: 'Dashboard', navTpl: navTpl, containerWidth: 'md' }}
        />
        <Layout
          body="Header taken from a template"
          options={{
            navTpl: navTpl,
            headerTpl: headerTpl,
            containerWidth: 'md',
          }}
        />
      </Section>

      <Section title="Optional navigation">
        <Layout
          body="With a navigation template"
          options={{
            navTpl: navTpl,
            headerTpl: headerTpl,
            containerWidth: 'xl',
          }}
        />
        <Layout
          body="Without a navigation template"
          options={{ title: 'No navigation', containerWidth: 'xl' }}
        />
      </Section>
    </div>
  ),
};
