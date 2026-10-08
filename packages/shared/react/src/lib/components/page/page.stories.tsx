import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import type { ReactNode } from 'react';

import { SmartPage } from './page';
import { PAGE_PRESET_VARIANT_COMPONENTS } from './preset-variants';
import { IPageOptions } from '../../models';

interface PageStoryProps {
  title?: string;
  showBackButton?: boolean;
  hideHeader?: boolean;
  hideMenuButton?: boolean;
  withBreadcrumbs?: boolean;
  withSubtitle?: boolean;
  withMeta?: boolean;
  withFilters?: boolean;
  withSidebar?: boolean;
  withSearch?: boolean;
  withEndButtons?: boolean;
}

const breadcrumbs = <span>Home / Users / Alice</span>;
const subtitle = <span>Account settings and permissions</span>;
const metaTpl = (
  <>
    <span style={{ marginRight: 16 }}>Last updated 2 hours ago</span>
    <span>Status: Active</span>
  </>
);
const filters = (
  <div style={{ display: 'flex', gap: 12 }}>
    <span>All</span>
    <span>Active</span>
    <span>Archived</span>
  </div>
);
const sidebar = (
  <nav style={{ display: 'grid', gap: 8 }}>
    <span>Profile</span>
    <span>Security</span>
    <span>Billing</span>
  </nav>
);

/**
 * Story host that wires the template slots into `IPageOptions` and renders
 * the preset variant through `SmartPage` (the Angular `smart-page-story`
 * host component); `search` keeps its text in state.
 */
function PageStory({
  title = 'Alice Johnson',
  showBackButton = false,
  hideHeader = false,
  hideMenuButton = false,
  withBreadcrumbs = false,
  withSubtitle = false,
  withMeta = false,
  withFilters = false,
  withSidebar = false,
  withSearch = false,
  withEndButtons = false,
}: PageStoryProps) {
  const [searchText, setSearchText] = useState('');

  const options: IPageOptions = {
    title,
    variant: 'preset',
    showBackButton,
    hideHeader,
    hideMenuButton,
    search: withSearch
      ? { text: searchText, set: (txt) => setSearchText(txt) }
      : undefined,
    endButtons: withEndButtons ? [{ icon: 'add', text: 'Invite' }] : undefined,
    breadcrumbsTpl: withBreadcrumbs ? breadcrumbs : undefined,
    subtitleTpl: withSubtitle ? subtitle : undefined,
    metaTpl: withMeta ? metaTpl : undefined,
    filtersTpl: withFilters ? filters : undefined,
    sidebarTpl: withSidebar ? sidebar : undefined,
  };

  return (
    <SmartPage options={options}>
      <div style={{ display: 'grid', gap: 12 }}>
        <p style={{ margin: 0 }}>Main page content rendered inside the card.</p>
        <p style={{ margin: 0 }}>
          The preset variant wraps the body in a bordered content card and adds
          a styled header, filters bar and optional sidebar.
        </p>
      </div>
    </SmartPage>
  );
}

interface PageArgs {
  title: string;
  showBackButton: boolean;
  hideHeader: boolean;
  hideMenuButton: boolean;
  withBreadcrumbs: boolean;
  withSubtitle: boolean;
  withMeta: boolean;
  withFilters: boolean;
  withSidebar: boolean;
  withSearch: boolean;
  withEndButtons: boolean;
}

const meta: Meta<PageArgs> = {
  title: 'Smart-Page/Page',
  tags: ['autodocs'],
  parameters: {
    // Registers the 'preset' page variant (PAGE_VARIANT_COMPONENTS_TOKEN).
    smart: { components: PAGE_PRESET_VARIANT_COMPONENTS },
  },
  argTypes: {
    title: { control: 'text' },
    showBackButton: { control: 'boolean' },
    hideHeader: { control: 'boolean' },
    hideMenuButton: { control: 'boolean' },
    withBreadcrumbs: { control: 'boolean' },
    withSubtitle: { control: 'boolean' },
    withMeta: { control: 'boolean' },
    withFilters: { control: 'boolean' },
    withSidebar: { control: 'boolean' },
    withSearch: { control: 'boolean' },
    withEndButtons: { control: 'boolean' },
  },
  args: {
    title: 'Alice Johnson',
    showBackButton: true,
    hideHeader: false,
    hideMenuButton: false,
    withBreadcrumbs: true,
    withSubtitle: true,
    withMeta: true,
    withFilters: true,
    withSidebar: true,
    withSearch: true,
    withEndButtons: true,
  },
};

export default meta;
type Story = StoryObj<PageArgs>;

// #region usage
export const Playground: Story = {
  name: 'Playground',
  render: (args) => (
    <PageStory
      title={args.title}
      showBackButton={args.showBackButton}
      hideHeader={args.hideHeader}
      hideMenuButton={args.hideMenuButton}
      withBreadcrumbs={args.withBreadcrumbs}
      withSubtitle={args.withSubtitle}
      withMeta={args.withMeta}
      withFilters={args.withFilters}
      withSidebar={args.withSidebar}
      withSearch={args.withSearch}
      withEndButtons={args.withEndButtons}
    />
  ),
};
// #endregion

const Section = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <section>
    <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>{title}</h3>
    <div
      style={{
        height: 320,
        border: '1px solid rgba(127,127,127,.3)',
        borderRadius: 8,
        overflow: 'hidden',
      }}
    >
      {children}
    </div>
  </section>
);

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: 32, padding: 24 }}
    >
      <Section title="Title only">
        <PageStory title="Alice Johnson" />
      </Section>

      <Section title="Back button, subtitle and meta">
        <PageStory
          title="Alice Johnson"
          showBackButton={true}
          withSubtitle={true}
          withMeta={true}
        />
      </Section>

      <Section title="Breadcrumbs and filters">
        <PageStory title="Users" withBreadcrumbs={true} withFilters={true} />
      </Section>

      <Section title="Sidebar">
        <PageStory title="Settings" withSidebar={true} />
      </Section>

      <Section title="Search and end buttons">
        <PageStory title="Users" withSearch={true} withEndButtons={true} />
      </Section>

      <Section title="Header hidden">
        <PageStory title="Alice Johnson" hideHeader={true} />
      </Section>

      <Section title="Menu button hidden">
        <PageStory title="Alice Johnson" hideMenuButton={true} />
      </Section>

      <Section title="All slots combined">
        <PageStory
          title="Alice Johnson"
          showBackButton={true}
          withBreadcrumbs={true}
          withSubtitle={true}
          withMeta={true}
          withFilters={true}
          withSidebar={true}
          withSearch={true}
          withEndButtons={true}
        />
      </Section>
    </div>
  ),
};
