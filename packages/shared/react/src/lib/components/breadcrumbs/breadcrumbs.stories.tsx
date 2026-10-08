import type { Meta, StoryObj } from '@storybook/react-vite';

import { SmartBreadcrumbs } from './breadcrumbs';
import {
  IBreadcrumbsOptions,
  SmartBreadcrumbsLayout,
  SmartBreadcrumbsSeparator,
} from '../../models';
import { SmartBreadcrumbsPreset } from './preset/breadcrumbs-preset';

const ITEMS: IBreadcrumbsOptions['items'] = [
  { id: 'home', label: 'Home', href: '#' },
  { id: 'center', label: 'App Center', href: '#' },
  { id: 'app', label: 'Application', current: true },
];

interface BreadcrumbsArgs {
  separator: SmartBreadcrumbsSeparator;
  layout: SmartBreadcrumbsLayout | '';
  ariaLabel: string;
}

const meta: Meta<BreadcrumbsArgs> = {
  title: 'Components/Breadcrumbs',
  tags: ['autodocs'],
  // Register the preset variation as the replacement for the standard
  // breadcrumbs, so every <SmartBreadcrumbs> renders the preset.
  parameters: {
    smart: { components: { breadcrumbs: SmartBreadcrumbsPreset } },
  },
  argTypes: {
    separator: {
      control: 'radio',
      options: ['chevron', 'slash', 'arrow'],
    },
    layout: {
      control: 'select',
      options: [
        '',
        'contained',
        'full-width-bar',
        'simple-with-chevrons',
        'simple-with-slashes',
      ],
    },
    ariaLabel: { control: 'text' },
  },
  args: {
    separator: 'chevron',
    layout: '',
    ariaLabel: 'Breadcrumb',
  },
};

export default meta;
type Story = StoryObj<BreadcrumbsArgs>;

// #region usage
export const Playground: Story = {
  name: 'Playground',
  render: (args) => (
    <div style={{ padding: 40 }}>
      <SmartBreadcrumbs
        options={{
          items: ITEMS,
          separator: args.separator,
          layout: args.layout || undefined,
          ariaLabel: args.ariaLabel,
        }}
      />
    </div>
  ),
};
// #endregion

const sectionTitle = { fontSize: 16, fontWeight: 600, marginBottom: 12 };

const chevron: IBreadcrumbsOptions = { items: ITEMS, separator: 'chevron' };
const slash: IBreadcrumbsOptions = { items: ITEMS, separator: 'slash' };
const arrow: IBreadcrumbsOptions = { items: ITEMS, separator: 'arrow' };
const contained: IBreadcrumbsOptions = {
  items: ITEMS,
  separator: 'chevron',
  layout: 'contained',
};
const fullWidth: IBreadcrumbsOptions = {
  items: ITEMS,
  separator: 'chevron',
  layout: 'full-width-bar',
};

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
        <h3 style={sectionTitle}>Chevron separators</h3>
        <SmartBreadcrumbs options={chevron} />
      </section>

      <section>
        <h3 style={sectionTitle}>Slash separators</h3>
        <SmartBreadcrumbs options={slash} />
      </section>

      <section>
        <h3 style={sectionTitle}>Arrow separators</h3>
        <SmartBreadcrumbs options={arrow} />
      </section>

      <section>
        <h3 style={sectionTitle}>Contained</h3>
        <SmartBreadcrumbs options={contained} />
      </section>

      <section>
        <h3 style={sectionTitle}>Bar across the full width</h3>
        <SmartBreadcrumbs options={fullWidth} />
      </section>
    </div>
  ),
};
