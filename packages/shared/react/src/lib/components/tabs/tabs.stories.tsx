import type { Meta, StoryObj } from '@storybook/react-vite';

import { ITabItem, SmartTabsLayout } from '../../models';
import { SmartTabsPreset } from './preset/tabs-preset';
import { SmartTabs } from './tabs';

const LAYOUTS: SmartTabsLayout[] = [
  'underline',
  'underline-with-icons',
  'underline-with-badges',
  'underline-full-width',
  'pills',
  'pills-on-gray',
  'pills-with-brand-color',
  'bar-with-underline',
  'simple',
];

// Showcase headings read as prose, not as the raw option value.
const LAYOUT_LABELS: Record<SmartTabsLayout, string> = {
  underline: 'Underline',
  'underline-with-icons': 'Underline with icons',
  'underline-with-badges': 'Underline with badges',
  'underline-full-width': 'Underline, full width',
  pills: 'Pills',
  'pills-on-gray': 'Pills on gray',
  'pills-with-brand-color': 'Pills with brand color',
  'bar-with-underline': 'Bar with underline',
  simple: 'Simple',
};

const ITEMS: ITabItem[] = [
  { id: 'tab-1', label: 'Tab 1' },
  { id: 'tab-2', label: 'Tab 2' },
  { id: 'tab-3', label: 'Tab 3' },
];

const BADGE_ITEMS: ITabItem[] = [
  { id: 'tab-1', label: 'Tab 1', badge: '99+' },
  { id: 'tab-2', label: 'Tab 2', badge: 5 },
  { id: 'tab-3', label: 'Tab 3' },
];

interface TabsArgs {
  layout: SmartTabsLayout;
  selectedId: string;
}

const meta: Meta<TabsArgs> = {
  title: 'Components/Tabs',
  tags: ['autodocs'],
  parameters: {
    // Register the preset variation as the replacement for the standard
    // tabs, so every <SmartTabs> renders SmartTabsPreset.
    smart: { components: { tabs: SmartTabsPreset } },
  },
  argTypes: {
    layout: { control: 'select', options: LAYOUTS },
    selectedId: { control: 'select', options: ITEMS.map((i) => i.id) },
  },
  args: {
    layout: 'underline',
    selectedId: 'tab-1',
  },
};

export default meta;
type Story = StoryObj<TabsArgs>;

// #region usage
export const Playground: Story = {
  name: 'Playground',
  // `selectedId` is a model in Angular: the tabs keep the clicked tab until
  // the control changes it again.
  render: (args) => (
    <div style={{ padding: 40, minWidth: 480 }}>
      <SmartTabs
        key={args.selectedId}
        options={{
          layout: args.layout,
          items: args.layout === 'underline-with-badges' ? BADGE_ITEMS : ITEMS,
          ariaLabel: 'Demo tabs',
          showMobileSelect: false,
        }}
        defaultSelectedId={args.selectedId}
      />
    </div>
  ),
};
// #endregion

const sectionTitle = { fontSize: 16, fontWeight: 600, marginBottom: 12 };

export const AllVariants: Story = {
  name: 'All variants',
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ padding: 24, minWidth: 520 }}>
      {LAYOUTS.map((layout) => (
        <section key={layout} style={{ marginBottom: 32 }}>
          <h3 style={sectionTitle}>{LAYOUT_LABELS[layout]}</h3>
          <SmartTabs
            options={{
              layout,
              items: layout === 'underline-with-badges' ? BADGE_ITEMS : ITEMS,
              showMobileSelect: false,
            }}
            defaultSelectedId="tab-1"
          />
        </section>
      ))}
    </div>
  ),
};
