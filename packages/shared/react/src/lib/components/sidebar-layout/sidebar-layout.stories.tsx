import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';

import { ISidebarLayoutOptions } from '../../models';
import { SmartSidebarLayoutPreset } from './preset/sidebar-layout-preset';

const POSITIONS = ['left', 'right'] as const;

interface SidebarLayoutArgs {
  title: string;
  sidebarPosition: (typeof POSITIONS)[number];
  condensed: boolean;
  withHeader: boolean;
}

const meta: Meta<SidebarLayoutArgs> = {
  title: 'Components/SidebarLayout',
  tags: ['autodocs'],
  parameters: {
    // SmartSidebarLayoutPreset is rendered directly; it is also registered as
    // the replacement for every <SmartSidebarLayout>.
    smart: { components: { 'sidebar-layout': SmartSidebarLayoutPreset } },
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Fallback heading used when `headerTpl` is not supplied.',
    },
    sidebarPosition: { control: 'inline-radio', options: POSITIONS },
    condensed: {
      control: 'boolean',
      description: 'Narrow icon rail instead of the full sidebar.',
    },
    withHeader: { control: 'boolean' },
  },
  args: {
    title: 'Dashboard',
    sidebarPosition: 'left',
    condensed: false,
    withHeader: false,
  },
};

export default meta;
type Story = StoryObj<SidebarLayoutArgs>;

// `mobileBreakpoint` is intentionally absent — the preset does not consume it.
const headerTpl = (
  <div className="smart:flex smart:items-center smart:justify-between">
    <h1 className="smart:text-2xl smart:font-semibold smart:text-gray-900 smart:dark:text-white">
      Dashboard
    </h1>
    <button className="smart:rounded-md smart:bg-teal-600 smart:px-3 smart:py-2 smart:text-sm smart:font-medium smart:text-white">
      New item
    </button>
  </div>
);

const sidebarTpl = (
  <nav className="smart:flex smart:flex-col smart:gap-2 smart:p-4 smart:text-sm smart:text-gray-600 smart:dark:text-gray-300">
    <a href="#">Overview</a>
    <a href="#">Team</a>
    <a href="#">Projects</a>
    <a href="#">Settings</a>
  </nav>
);

const condensedSidebarTpl = (
  <nav className="smart:flex smart:flex-col smart:items-center smart:gap-4 smart:p-3 smart:text-gray-600 smart:dark:text-gray-300">
    <span>1</span>
    <span>2</span>
    <span>3</span>
  </nav>
);

// #region usage
export const Playground: Story = {
  name: 'Playground',
  render: (args) => (
    <div style={{ padding: 24 }}>
      <div style={{ height: 320 }}>
        <SmartSidebarLayoutPreset
          options={{
            title: args.title,
            sidebarTpl: args.condensed ? condensedSidebarTpl : sidebarTpl,
            headerTpl: args.withHeader ? headerTpl : undefined,
            sidebarPosition: args.sidebarPosition,
            condensed: args.condensed,
          }}
        >
          <p className="smart:text-gray-600 smart:dark:text-gray-300">
            Main content projected into the layout body.
          </p>
        </SmartSidebarLayoutPreset>
      </div>
    </div>
  ),
};
// #endregion

const Layout = ({
  body,
  options,
}: {
  body: string;
  options: ISidebarLayoutOptions;
}) => (
  <div style={{ height: 260 }}>
    <SmartSidebarLayoutPreset options={options}>
      <p className="smart:text-gray-600 smart:dark:text-gray-300">{body}</p>
    </SmartSidebarLayoutPreset>
  </div>
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
      <Section title="Sidebar position">
        {POSITIONS.map((position) => (
          <Layout
            key={position}
            body={`sidebarPosition: ${position}`}
            options={{
              title: 'Dashboard',
              sidebarTpl: sidebarTpl,
              sidebarPosition: position,
            }}
          />
        ))}
      </Section>

      <Section title="Condensed rail">
        <Layout
          body="condensed: true — narrow icon rail"
          options={{
            title: 'Condensed',
            sidebarTpl: condensedSidebarTpl,
            condensed: true,
          }}
        />
      </Section>

      <Section title="Header from a title or from a template">
        <Layout
          body="Header taken from the title"
          options={{ title: 'Dashboard', sidebarTpl: sidebarTpl }}
        />
        <Layout
          body="Header taken from a template"
          options={{ headerTpl: headerTpl, sidebarTpl: sidebarTpl }}
        />
      </Section>
    </div>
  ),
};
